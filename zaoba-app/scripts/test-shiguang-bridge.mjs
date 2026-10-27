// 宿主注入脚本的回归：在 Node 的 vm 里跑「教务页里那段 JS」，
// 验证 桥挂载 / 分片回传 / 回调解 resolve / 校验函数回传 / 适配脚本只跑一次。
//
// 用法：bash scripts/run-test-bridge.sh
import vm from 'node:vm'
import {
  buildShimScript,
  buildAdapterScript,
  BRIDGE_JS,
  BRIDGE_SCHEME,
  BRIDGE_CHUNK_SIZE
} from './_importWebview.mjs'

let failures = 0
function check(name, actual, expected) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  if (a !== e) {
    failures++
    console.log(`FAIL ${name}\n  expected ${e}\n  actual   ${a}`)
  } else {
    console.log(`ok   ${name}`)
  }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ---- 造一个「教务页面」的运行环境 ----
function createPage() {
  const urls = []
  const sandbox = {
    btoa,
    unescape,
    encodeURIComponent,
    decodeURIComponent,
    JSON,
    Math,
    Date,
    Promise,
    console,
    setTimeout,
    clearTimeout
  }
  sandbox.window = {
    location: {
      set href(value) { urls.push(String(value)) }
    }
  }
  vm.createContext(sandbox)
  return { sandbox, urls }
}

// 把拦到的 URL 按 sid 拼回去（等同宿主 onIntercept 的逻辑）
function collect(urls) {
  const buckets = new Map()
  for (const url of urls) {
    if (!url.startsWith(BRIDGE_SCHEME)) continue
    const q = url.slice(BRIDGE_SCHEME.length)
    const get = (k) => {
      const m = q.match(new RegExp('[?&]' + k + '=([^&]*)'))
      return m ? m[1] : ''
    }
    const sid = get('sid')
    const i = parseInt(get('i'), 10)
    const n = parseInt(get('n'), 10)
    const d = get('d')
    let bucket = buckets.get(sid)
    if (!bucket) { bucket = { n, parts: {} }; buckets.set(sid, bucket) }
    bucket.parts[i] = d
  }
  const out = []
  for (const bucket of buckets.values()) {
    let raw = ''
    for (let i = 0; i < bucket.n; i++) raw += bucket.parts[i] || ''
    out.push({ total: bucket.n, size: raw.length, msg: JSON.parse(Buffer.from(raw, 'base64').toString('utf8')) })
  }
  return out
}

// ---- 1. 桥挂载 + 一次小消息 ----
{
  const { sandbox, urls } = createPage()
  vm.runInContext(buildShimScript(), sandbox)
  vm.runInContext(BRIDGE_JS, sandbox)

  check('shiguangBridgePromise 已挂载', typeof sandbox.window.shiguangBridgePromise, 'object')
  check('shiguangBridge 已挂载', typeof sandbox.window.shiguangBridge, 'object')
  check('旧别名 AndroidBridge 兼容', typeof sandbox.window.AndroidBridge, 'object')

  const promise = sandbox.window.shiguangBridgePromise.saveImportedCourses('[]')
  await sleep(120)
  const got = collect(urls)
  check('小消息只有 1 个分片', got.length, 1)
  check('消息 action 正确', got[0].msg.action, 'saveImportedCourses')
  check('payload 是二次编码的字符串', JSON.parse(got[0].msg.payload).coursesJsonString, '[]')

  sandbox.window._shiguangNativeCallback(got[0].msg.callbackId, true, true)
  check('原生回调能 resolve 脚本的 promise', await promise, true)
}

// ---- 2. 大消息分片 + 字节级还原（含中文/emoji） ----
{
  const { sandbox, urls } = createPage()
  vm.runInContext(buildShimScript(), sandbox)
  vm.runInContext(BRIDGE_JS, sandbox)

  const courses = Array.from({ length: 180 }, (_, i) => ({
    name: '课程' + i + '📚',
    teacher: '老师' + (i % 7),
    position: '教' + (i % 5) + '-30' + (i % 9),
    day: (i % 7) + 1,
    startSection: (i % 8) + 1,
    endSection: (i % 8) + 2,
    weeks: [1, 2, 3, 5, 7, 9, 11]
  }))
  const payload = JSON.stringify(courses)
  sandbox.window.shiguangBridgePromise.saveImportedCourses(payload)
  await sleep(1200)

  const got = collect(urls)
  check('大消息被切成多片', got.length, 1)
  check('分片数量 > 1', got[0].total > 1, true)
  check('单片 base64 不超过分片大小', got[0].size <= got[0].total * BRIDGE_CHUNK_SIZE, true)
  const back = JSON.parse(JSON.parse(got[0].msg.payload).coursesJsonString)
  check('还原后课程数一致', back.length, 180)
  check('还原后中文/emoji 一致', [back[0].name, back[179].name], ['课程0📚', '课程179📚'])
  check('还原后周次一致', back[3].weeks, [1, 2, 3, 5, 7, 9, 11])
}

// ---- 3. 校验函数回传 ----
{
  const { sandbox, urls } = createPage()
  vm.runInContext(buildShimScript(), sandbox)
  vm.runInContext(BRIDGE_JS, sandbox)
  sandbox.window.validYear = (input) => (/^[0-9]{4}$/.test(input) ? false : '请输入 4 位年份')

  sandbox.window.__sqRunValidator('v1', 'validYear', '2026')
  sandbox.window.__sqRunValidator('v2', 'validYear', '26')
  await sleep(200)
  const results = collect(urls).map((x) => x.msg).filter((m) => m.action === '__validatorResult')
  const byId = {}
  results.forEach((m) => { byId[m.id] = m.result })
  check('校验通过返回 false', byId.v1, false)
  check('校验失败返回中文提示', byId.v2, '请输入 4 位年份')
}

// ---- 4. 适配脚本同一页面只跑一次 + 异常不炸宿主 ----
{
  const { sandbox, urls } = createPage()
  vm.runInContext(buildShimScript(), sandbox)
  vm.runInContext(BRIDGE_JS, sandbox)

  const adapter = 'window.__runCount = (window.__runCount || 0) + 1; window.shiguangBridge.showToast("跑了一次")'
  vm.runInContext(buildAdapterScript(adapter), sandbox)
  vm.runInContext(buildAdapterScript(adapter), sandbox)
  check('适配脚本只执行一次', sandbox.window.__runCount, 1)

  const bad = 'throw new Error("boom")'
  let threw = false
  try { vm.runInContext(buildAdapterScript(bad), sandbox) } catch (e) { threw = true }
  check('适配脚本抛错不炸宿主', threw, false)
  await sleep(120)
  const toastCalled = sandbox.window.__sqAdapterRan === true
  check('异常后标记已注入，避免死循环重试', toastCalled, true)
}

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILED`)
process.exit(failures === 0 ? 0 : 1)
