// 用法：node scripts/build-school-index.mjs [--from-api] [--out=路径]
//
// 从「拾光课程表」适配仓库（ShiGuangSchedule/shiguang_warehouse，MIT 协议）拉取：
//   index/root_index.yaml              学校总索引（269 条）
//   resources/<folder>/adapters.yaml   每所学校的适配器清单
// 生成 src/data/schoolIndex.js（ESM：export const SCHOOL_INDEX = [...]）。
//
// 网络说明（本机实测）：
//   - api.github.com 通；
//   - gitee.com 的 raw 通，但会 302 跳到 raw.giteeusercontent.com（Node fetch 自动跟随），
//     所以必须带 redirect: 'follow'，纯 curl 不加 -L 只会拿到 302 的跳转页；
//   - raw.githubusercontent.com 经常 502/超时，jsDelivr 也不稳。
//   所以默认「Gitee 优先 + GitHub contents API 兜底」；加 --from-api 把 API 提到前面。
//
// 输出稳定：不含时间戳，学校按 initial + name 排序、adapters 保持 yaml 顺序，
// 同一份上游数据重复执行生成的文件逐字节一致。
//
// 注意：本脚本不引入任何 npm 依赖，只解析该仓库实际使用的 YAML 子集（见 parseSimpleYaml）。

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const APP_DIR = path.resolve(SCRIPT_DIR, '..')
const DEFAULT_OUT = path.join(APP_DIR, 'src', 'data', 'schoolIndex.js')

const GITEE_BASE = 'https://gitee.com/XingHeYuZhuan-gh/shiguang_warehouse/raw/main'
const GITHUB_REPO = 'ShiGuangSchedule/shiguang_warehouse'
const GITHUB_BRANCH = 'main'
const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_REPO}/contents`
// HTTP 头只能是 latin1，别在这里写中文
const USER_AGENT = 'zaoba-school-index-builder (+uni-app zaoba)'

// 期望的仓库快照规模：对不上就非零退出，避免上游改结构后悄悄生成半份索引。
// 学校数 269 含 GLOBAL_TOOLS 与 4 条「通用教务」条目（zhengfang/chaoxing/qingguo/urp），
// 与 root_index.yaml 条目数一致。
// 适配器 298 条 = 各校 adapters.yaml 里 adapter_id 的总数（去重后的脚本 288 个，
// 因为 CQUST/CUST/SCUT 等学校用同一份 js 挂了多个入口）。任务书里的 287 是更早的快照，
// 上游后来给一批学校补了 WebVPN / IPv6 入口，以仓库现状为准。
const EXPECTED_SCHOOLS = 269
const EXPECTED_ADAPTERS = 298

const CONCURRENCY = 8 // 并发请求数（任务要求 6~8）
const RETRY_TIMES = 2 // 失败重试次数
const REQUEST_TIMEOUT = 25000

const HELP = `用法：node scripts/build-school-index.mjs [选项]

  --from-api             优先走 GitHub contents API（默认 Gitee 优先、API 兜底）
  --out=路径             输出文件，默认 src/data/schoolIndex.js
  --expect-schools=N     覆盖期望学校数（默认 ${EXPECTED_SCHOOLS}）
  --expect-adapters=N    覆盖期望适配器数（默认 ${EXPECTED_ADAPTERS}）
  -h, --help             显示本帮助

环境变量：
  GITHUB_TOKEN / GH_TOKEN  走 GitHub contents API 时带上令牌（未登录限 60 次/小时，
                           拉 270 个文件必然不够，所以默认以 Gitee 为主）`

function parseArgs(argv) {
  const options = {
    fromApi: false,
    out: DEFAULT_OUT,
    expectSchools: EXPECTED_SCHOOLS,
    expectAdapters: EXPECTED_ADAPTERS
  }
  for (const arg of argv) {
    if (arg === '--from-api') options.fromApi = true
    else if (arg === '-h' || arg === '--help') options.help = true
    else if (arg.startsWith('--out=')) options.out = path.resolve(process.cwd(), arg.slice(6))
    else if (arg.startsWith('--expect-schools=')) options.expectSchools = Number(arg.slice(17))
    else if (arg.startsWith('--expect-adapters=')) options.expectAdapters = Number(arg.slice(18))
    else throw new Error(`未知参数：${arg}（--help 看用法）`)
  }
  return options
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 取可读的错误原因：fetch 的失败信息都在 cause 里（ECONNRESET / ETIMEDOUT 等）
function describeError(err) {
  if (!err) return '未知错误'
  const cause = err.cause
  if (cause && (cause.code || cause.message)) return String(cause.code || cause.message)
  return String(err.message || err)
}

// HTTP 4xx（429 除外）重试也没用，直接换下一个来源
function isRetryable(err) {
  const message = String((err && err.message) || '')
  const matched = message.match(/HTTP (\d{3})/)
  if (matched) {
    const status = Number(matched[1])
    return status === 429 || status >= 500
  }
  return true
}

async function requestText(url, label, headers) {
  let lastError = null
  for (let attempt = 0; attempt <= RETRY_TIMES; attempt++) {
    if (attempt > 0) await sleep(400 * attempt)
    try {
      const res = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
        headers: { 'User-Agent': USER_AGENT, ...headers }
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()
      if (!text.trim()) throw new Error('响应为空')
      return text
    } catch (e) {
      lastError = e
      if (!isRetryable(e)) break
    }
  }
  throw new Error(`${label} 请求失败：${describeError(lastError)}`)
}

// GitHub contents API 返回 base64 内容，用来在 Gitee 抽风时兜底
async function requestGithubApi(relPath) {
  const url = `${GITHUB_API_BASE}/${relPath}?ref=${GITHUB_BRANCH}`
  const headers = { Accept: 'application/vnd.github+json' }
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  if (token) headers.Authorization = `Bearer ${token}`
  const text = await requestText(url, 'GitHub contents API', headers)
  let json
  try {
    json = JSON.parse(text)
  } catch (e) {
    throw new Error('GitHub contents API 返回的不是 JSON（可能是限流页）')
  }
  if (!json || typeof json.content !== 'string') {
    throw new Error('GitHub contents API 返回里没有 content 字段')
  }
  if (json.encoding && json.encoding !== 'base64') {
    throw new Error(`GitHub contents API 返回了不支持的 encoding：${json.encoding}`)
  }
  return Buffer.from(json.content, 'base64').toString('utf8')
}

// 按来源顺序取一个文件，前一个失败就换下一个
async function fetchResource(relPath, state) {
  const order = state.fromApi ? ['github-api', 'gitee'] : ['gitee', 'github-api']
  const errors = []
  for (const source of order) {
    try {
      const text = source === 'gitee'
        ? await requestText(`${GITEE_BASE}/${relPath}`, 'Gitee raw')
        : await requestGithubApi(relPath)
      state.sourceCount[source] = (state.sourceCount[source] || 0) + 1
      return text
    } catch (e) {
      errors.push(`${source}：${e.message}`)
    }
  }
  throw new Error(`${relPath} 所有来源都失败 —— ${errors.join('；')}`)
}

// 并发池：某个任务失败不打断其它任务，最后统一抛
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length)
  const errors = []
  let cursor = 0
  const worker = async () => {
    while (cursor < items.length) {
      const index = cursor++
      try {
        results[index] = await fn(items[index], index)
      } catch (e) {
        errors.push(e)
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  if (errors.length) throw new Error(errors.map((e) => e.message).join('\n'))
  return results
}

// ---- 极简 YAML 解析（只覆盖该仓库实际写法，不装 npm 包） ----
//
// 实际遇到的写法：
//   - 顶层只有一个 key（schools / adapters），值是一串「纯标量对象」；
//   - 值基本都是双引号字符串，但 THDM 有一条裸标量 category: BACHELOR_AND_ASSOCIATE；
//   - CDUTCM 的 description 用了块标量 |（多行）；
//   - root_index 行尾带注释，如 - id: "GLOBAL_TOOLS" # id 唯一值；
//   - 双引号值里有 \" 和 \n 转义，import_url 里还有没转义的 #（不能按 # 硬切）。

const YAML_ESCAPES = {
  n: '\n',
  t: '\t',
  r: '\r',
  b: '\b',
  f: '\f',
  0: '\0',
  '"': '"',
  '\\': '\\',
  '/': '/',
  ' ': ' '
}

// 从 text[start]（必须是双引号）读到闭合引号，返回 { value, end }
function readDoubleQuoted(text, start) {
  let value = ''
  let i = start + 1
  while (i < text.length) {
    const ch = text[i]
    if (ch === '\\') {
      const next = text[i + 1]
      if (next === 'u' && /^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6))) {
        value += String.fromCharCode(parseInt(text.slice(i + 2, i + 6), 16))
        i += 6
        continue
      }
      if (next !== undefined && Object.prototype.hasOwnProperty.call(YAML_ESCAPES, next)) {
        value += YAML_ESCAPES[next]
      } else if (next !== undefined) {
        // 未知转义按原样保留，宁可多留两个字符也别吃掉内容
        value += '\\' + next
      }
      i += 2
      continue
    }
    if (ch === '"') return { value, end: i + 1 }
    value += ch
    i += 1
  }
  throw new Error('YAML 双引号没有闭合')
}

// 裸标量：去掉行尾注释（# 前必须是空白才算注释）
function readPlainScalar(text) {
  const matched = text.match(/\s#/)
  const body = matched ? text.slice(0, matched.index) : text
  return body.trim()
}

const BLOCK_INDICATOR = /^([|>])([+-]?)(\d*)$/

// 块标量续行：比 key 缩进更深（或空行）都算内容
function consumeBlockScalar(lines, startIndex, keyIndent, indicator) {
  const style = indicator[1]
  const chomp = indicator[2]
  const body = []
  let i = startIndex + 1
  while (i < lines.length) {
    const raw = lines[i]
    if (raw.trim() === '') {
      body.push('')
      i += 1
      continue
    }
    const indent = raw.length - raw.trimStart().length
    if (indent <= keyIndent) break
    body.push(raw)
    i += 1
  }
  while (body.length && body[body.length - 1].trim() === '') body.pop()
  let minIndent = Infinity
  for (const raw of body) {
    if (raw.trim() === '') continue
    minIndent = Math.min(minIndent, raw.length - raw.trimStart().length)
  }
  if (!Number.isFinite(minIndent)) minIndent = 0
  const stripped = body.map((raw) => (raw.trim() === '' ? '' : raw.slice(minIndent)))

  let value
  if (style === '|') {
    value = stripped.join('\n')
  } else {
    // 折叠块：连续非空行之间补空格，空行变成换行
    value = ''
    for (let k = 0; k < stripped.length; k++) {
      const line = stripped[k]
      if (line === '') {
        value += '\n'
        continue
      }
      value += line
      if (k + 1 < stripped.length && stripped[k + 1] !== '') value += ' '
    }
    value = value.replace(/\n{3,}/g, '\n\n')
  }

  if (chomp === '-') value = value.replace(/\n+$/, '')
  else if (chomp === '+') value += '\n'
  else value = value.replace(/\n+$/, '') + '\n'

  return { value, next: i }
}

function parseSimpleYaml(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/)
  const result = {}
  let currentKey = null
  let currentRecord = null
  let i = 0

  const setField = (target, key, rawValue, keyIndent) => {
    const value = rawValue.trim()
    // 块标量
    const head = value.startsWith('"') ? '' : (value.match(/\s#/) ? value.slice(0, value.match(/\s#/).index).trim() : value)
    const block = head.match(BLOCK_INDICATOR)
    if (block) {
      const consumed = consumeBlockScalar(lines, i, keyIndent, block)
      target[key] = consumed.value
      i = consumed.next
      return
    }
    if (value.startsWith('"')) {
      target[key] = readDoubleQuoted(value, 0).value
    } else {
      target[key] = readPlainScalar(value)
    }
    i += 1
  }

  while (i < lines.length) {
    const raw = lines[i]
    if (!raw.trim() || /^\s*#/.test(raw)) {
      i += 1
      continue
    }
    const indent = raw.length - raw.trimStart().length
    const line = raw.trim()

    // 顶层 key（schools: / adapters:，可能带行尾注释）
    const topMatch = line.match(/^([A-Za-z_][\w-]*):\s*(?:#.*)?$/)
    if (indent === 0 && topMatch) {
      currentKey = topMatch[1]
      if (!Array.isArray(result[currentKey])) result[currentKey] = []
      currentRecord = null
      i += 1
      continue
    }

    // 列表项起点：- key: value
    const itemMatch = line.match(/^-\s+([A-Za-z_][\w-]*):\s*(.*)$/)
    if (itemMatch && currentKey) {
      currentRecord = {}
      result[currentKey].push(currentRecord)
      setField(currentRecord, itemMatch[1], itemMatch[2], indent + 2)
      continue
    }

    // 普通字段
    const fieldMatch = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/)
    if (fieldMatch && currentRecord) {
      setField(currentRecord, fieldMatch[1], fieldMatch[2], indent)
      continue
    }

    // 看不懂的行直接跳过并留个提示，避免上游加字段导致整份索引失败
    process.stderr.write(`  [警告] 跳过无法解析的行（第 ${i + 1} 行）：${line.slice(0, 80)}\n`)
    i += 1
  }
  return result
}

// ---- 数据整形 ----

function asText(value) {
  if (value === undefined || value === null) return ''
  return String(value)
}

// 学校排序：先按首字母，再按学校名（中文按拼音），最后用 id 兜底保证是全序
function schoolOrder(a, b) {
  if (a.initial !== b.initial) return a.initial < b.initial ? -1 : 1
  const byName = a.name.localeCompare(b.name, 'zh-Hans-CN')
  if (byName !== 0) return byName
  if (a.id !== b.id) return a.id < b.id ? -1 : 1
  return a.folder < b.folder ? -1 : a.folder > b.folder ? 1 : 0
}

function toAdapter(record) {
  return {
    id: asText(record.adapter_id),
    name: asText(record.adapter_name),
    category: asText(record.category),
    assetJsPath: asText(record.asset_js_path),
    importUrl: asText(record.import_url),
    maintainer: asText(record.maintainer),
    description: asText(record.description)
  }
}

// ---- 生成 JS 源文件（单引号 / 无分号 / 不引 key，跟项目现有风格一致） ----

function quote(text) {
  const escaped = text
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
  return `'${escaped}'`
}

function toJsLiteral(value, depth) {
  const pad = '  '.repeat(depth)
  const childPad = '  '.repeat(depth + 1)
  if (value === null) return 'null'
  if (typeof value === 'string') return quote(value)
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) {
    if (!value.length) return '[]'
    const items = value.map((item) => `${childPad}${toJsLiteral(item, depth + 1)}`)
    return `[\n${items.join(',\n')}\n${pad}]`
  }
  const keys = Object.keys(value)
  if (!keys.length) return '{}'
  const fields = keys.map((key) => `${childPad}${key}: ${toJsLiteral(value[key], depth + 1)}`)
  return `{\n${fields.join(',\n')}\n${pad}}`
}

function buildFileContent(schools, stats) {
  const header = [
    '// 此文件由 scripts/build-school-index.mjs 生成，勿手改。',
    '// 重新生成：node scripts/build-school-index.mjs（加 --from-api 走 GitHub contents API）',
    '// 数据来源：拾光课程表适配仓库 ShiGuangSchedule/shiguang_warehouse（MIT 协议）',
    `// 规模：学校 ${stats.schools} 所，适配器 ${stats.adapters} 个（唯一脚本 ${stats.scripts} 个）`,
    '// 排序：学校按 initial + name（拼音）排序，adapters 保持上游 yaml 顺序',
    ''
  ]
  return `${header.join('\n')}export const SCHOOL_INDEX = ${toJsLiteral(schools, 0)}\n`
}

// ---- 校验 ----

function collectProblems(schools, adapterCount, expected) {
  const problems = []
  if (schools.length !== expected.schools) {
    problems.push(`学校数 ${schools.length} ≠ 期望 ${expected.schools}`)
  }
  if (adapterCount !== expected.adapters) {
    problems.push(`适配器数 ${adapterCount} ≠ 期望 ${expected.adapters}`)
  }
  const folders = new Set()
  for (const school of schools) {
    if (!school.id || !school.name || !school.folder) {
      problems.push(`学校字段缺失：id=${JSON.stringify(school.id)} name=${JSON.stringify(school.name)} folder=${JSON.stringify(school.folder)}`)
    }
    if (folders.has(school.folder)) problems.push(`resource_folder 重复：${school.folder}`)
    folders.add(school.folder)
    if (!school.adapters.length) problems.push(`学校 ${school.id} 一个适配器都没有`)
    for (const adapter of school.adapters) {
      if (!adapter.id || !adapter.name || !adapter.assetJsPath) {
        problems.push(`适配器字段缺失：${school.folder}/${adapter.id || '?'}`)
      }
      if (!/\.js$/i.test(adapter.assetJsPath)) {
        problems.push(`适配器 ${school.folder}/${adapter.id} 的 assetJsPath 不是 .js：${adapter.assetJsPath}`)
      }
    }
  }
  return problems
}

// 自检：把生成的内容拷成临时 .mjs 再 import，语法错误或数据错位都能立刻暴露
async function selfCheck(content, schools) {
  const checkPath = path.join(os.tmpdir(), `zaoba-school-index-${process.pid}.mjs`)
  fs.writeFileSync(checkPath, content, 'utf8')
  try {
    const mod = await import(pathToFileURL(checkPath).href)
    const loaded = mod.SCHOOL_INDEX
    if (!Array.isArray(loaded)) throw new Error('SCHOOL_INDEX 不是数组')
    if (loaded.length !== schools.length) {
      throw new Error(`自检失败：导入后学校数 ${loaded.length} ≠ ${schools.length}`)
    }
    const lastName = loaded[loaded.length - 1].name
    if (lastName !== schools[schools.length - 1].name) {
      throw new Error('自检失败：导入后的顺序与预期不一致')
    }
    const adapters = loaded.reduce((sum, s) => sum + s.adapters.length, 0)
    return { schools: loaded.length, adapters }
  } finally {
    fs.rmSync(checkPath, { force: true })
  }
}

// ---- 主流程 ----

async function main() {
  const startedAt = Date.now()
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    console.log(HELP)
    return
  }

  const state = { fromApi: options.fromApi, sourceCount: {} }
  const mode = options.fromApi ? 'GitHub contents API 优先（Gitee 兜底）' : 'Gitee 优先（GitHub contents API 兜底）'
  console.log(`→ 数据来源：${mode}`)

  console.log('→ 拉取 index/root_index.yaml ...')
  const rootDoc = parseSimpleYaml(await fetchResource('index/root_index.yaml', state))
  const rawSchools = Array.isArray(rootDoc.schools) ? rootDoc.schools : []
  if (!rawSchools.length) throw new Error('root_index.yaml 里没解析出 schools，可能是上游结构变了')

  const schools = rawSchools.map((record) => ({
    id: asText(record.id),
    name: asText(record.name),
    initial: (asText(record.initial).trim().charAt(0) || '#').toUpperCase(),
    folder: asText(record.resource_folder).trim(),
    adapters: []
  }))
  console.log(`  解析到 ${schools.length} 所学校，开始并发拉取 adapters.yaml（并发 ${CONCURRENCY}）...`)

  let done = 0
  const adapterDocs = await mapLimit(schools, CONCURRENCY, async (school) => {
    const text = await fetchResource(`resources/${school.folder}/adapters.yaml`, state)
    done += 1
    if (done % 40 === 0 || done === schools.length) console.log(`  进度 ${done}/${schools.length}`)
    return parseSimpleYaml(text)
  })

  schools.forEach((school, index) => {
    const records = Array.isArray(adapterDocs[index].adapters) ? adapterDocs[index].adapters : []
    school.adapters = records.map(toAdapter)
  })

  // 排序在挂完 adapters 之后做，adapters 内部顺序保持 yaml 原样
  schools.sort(schoolOrder)

  const adapterCount = schools.reduce((sum, school) => sum + school.adapters.length, 0)
  const scriptKeys = new Set()
  for (const school of schools) {
    for (const adapter of school.adapters) scriptKeys.add(`${school.folder}/${adapter.assetJsPath}`)
  }

  console.log('→ 校验数据 ...')
  const problems = collectProblems(schools, adapterCount, {
    schools: options.expectSchools,
    adapters: options.expectAdapters
  })
  if (problems.length) {
    console.error('✗ 校验没通过，已放弃写入：')
    for (const problem of problems.slice(0, 30)) console.error(`  - ${problem}`)
    if (problems.length > 30) console.error(`  ... 还有 ${problems.length - 30} 条`)
    process.exitCode = 1
    return
  }
  console.log(`  ✓ 学校 ${schools.length} 所 / 适配器 ${adapterCount} 个（唯一脚本 ${scriptKeys.size} 个）`)

  const stats = { schools: schools.length, adapters: adapterCount, scripts: scriptKeys.size }
  const content = buildFileContent(schools, stats)

  console.log('→ 写入并自检 ...')
  fs.mkdirSync(path.dirname(options.out), { recursive: true })
  fs.writeFileSync(options.out, content, 'utf8')
  const checked = await selfCheck(content, schools)

  const sizeKb = (fs.statSync(options.out).size / 1024).toFixed(1)
  const relativeOut = path.relative(APP_DIR, options.out).split(path.sep).join('/')
  const sources = Object.entries(state.sourceCount)
    .map(([name, count]) => `${name} ${count} 个文件`)
    .join('，')

  console.log('')
  console.log('✓ 生成完成')
  console.log(`  学校：${checked.schools} 所`)
  console.log(`  适配器：${checked.adapters} 个（唯一脚本 ${stats.scripts} 个）`)
  console.log(`  输出：${relativeOut}（${sizeKb} KB）`)
  console.log(`  实际来源：${sources}`)
  console.log(`  耗时：${((Date.now() - startedAt) / 1000).toFixed(1)}s`)
}

main().catch((err) => {
  console.error(`✗ 生成失败：${err && err.message ? err.message : err}`)
  process.exitCode = 1
})
