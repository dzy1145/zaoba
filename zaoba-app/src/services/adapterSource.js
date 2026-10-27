// 拾光适配脚本的运行时拉取：按「Gitee → jsDelivr → GitHub raw」顺序找镜像，
// 取到源码后用 uni 本地存储缓存 7 天，避免每次导入都走网络。
//
// 网络实测（2026-10）：Gitee 的 raw 最稳（国内直连，但会 302 跳到 raw.giteeusercontent.com，
// 且不返回 CORS 头，所以 H5 端可能失败、App 端没问题）；jsDelivr 带 CORS 头、H5 友好；
// raw.githubusercontent.com 经常 502/超时，只当最后兜底。
//
// 说明：只有在 App/H5 里通过 uni.request 走网络，不依赖 fetch（App 端没有可靠的 fetch）。

const CACHE_PREFIX = 'sq_adapter_'
const CACHE_SEPARATOR = '__'
const REQUEST_TIMEOUT = 15000

const GITEE_BASE = 'https://gitee.com/XingHeYuZhuan-gh/shiguang_warehouse/raw/main'
const JSDELIVR_BASE = 'https://cdn.jsdelivr.net/gh/ShiGuangSchedule/shiguang_warehouse@main'
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/ShiGuangSchedule/shiguang_warehouse/main'

// 适配脚本的镜像顺序，文档里直接引用这个数组即可
export const ADAPTER_MIRRORS = [
  { name: 'gitee', label: 'Gitee 镜像', base: GITEE_BASE },
  { name: 'jsdelivr', label: 'jsDelivr CDN', base: JSDELIVR_BASE },
  { name: 'github-raw', label: 'GitHub 原始地址', base: GITHUB_RAW_BASE }
]

// 缓存有效期：7 天。上游适配脚本更新频率很低，过期后重新拉一次就行
export const ADAPTER_CACHE_TTL = 7 * 24 * 60 * 60 * 1000

// 同一份脚本的并发请求合并，避免首屏同时点两次导入时重复拉取
const pending = new Map()

function normalizeTarget(adapter) {
  if (!adapter || typeof adapter !== 'object') return null
  const folder = String(adapter.folder || '').trim()
  const assetJsPath = String(adapter.assetJsPath || '').trim().replace(/^\.?\//, '')
  if (!folder || !assetJsPath) return null
  return { folder, assetJsPath }
}

export function getAdapterCacheKey(folder, assetJsPath) {
  return CACHE_PREFIX + folder + CACHE_SEPARATOR + assetJsPath
}

function readCache(key) {
  try {
    const hit = uni.getStorageSync(key)
    if (!hit || typeof hit !== 'object' || typeof hit.text !== 'string' || !hit.text) return ''
    const time = Number(hit.time) || 0
    if (Date.now() - time <= ADAPTER_CACHE_TTL) return hit.text
  } catch (e) {
    // 存储异常就当没缓存
  }
  return ''
}

function writeCache(key, text) {
  try {
    uni.setStorageSync(key, { text, time: Date.now() })
  } catch (e) {
    // 存不进去不影响本次使用
  }
}

// uni.request 包成 Promise，取文本；App/H5 都能用
function requestText(url) {
  return new Promise((resolve, reject) => {
    if (typeof uni === 'undefined' || typeof uni.request !== 'function') {
      reject(new Error('当前环境没有 uni.request，无法拉取适配脚本'))
      return
    }
    uni.request({
      url,
      method: 'GET',
      timeout: REQUEST_TIMEOUT,
      responseType: 'text',
      header: { Accept: 'text/plain, */*' },
      success: (res) => {
        const status = (res && res.statusCode) || 0
        const data = res && res.data
        const text = typeof data === 'string' ? data : data == null ? '' : String(data)
        if (status >= 200 && status < 300 && text.trim()) resolve(text)
        else reject(new Error(`HTTP ${status}`))
      },
      fail: (err) => {
        reject(new Error((err && (err.errMsg || err.message)) || '网络请求失败'))
      }
    })
  })
}

function buildCandidates(target, directUrl) {
  const candidates = []
  if (directUrl) candidates.push({ label: '指定 url', url: directUrl })
  if (target) {
    for (const mirror of ADAPTER_MIRRORS) {
      candidates.push({
        label: mirror.label,
        url: `${mirror.base}/resources/${target.folder}/${target.assetJsPath}`
      })
    }
  }
  return candidates
}

async function loadScript(target, directUrl) {
  const candidates = buildCandidates(target, directUrl)
  const tried = []
  for (const candidate of candidates) {
    try {
      return await requestText(candidate.url)
    } catch (e) {
      tried.push(`${candidate.label}（${e.message}）`)
    }
  }
  const subject = directUrl || `${target.folder}/${target.assetJsPath}`
  throw new Error(`拉取适配脚本失败：${subject}。已尝试 ${tried.length} 个来源：${tried.join('；')}`)
}

// 取适配脚本源码。
// 入参：{ folder, assetJsPath }（学校资源目录 + 脚本名），或 { url } 直接给绝对地址；
// 两者都给时先试 url，再按镜像顺序回退。
export async function getAdapterScript(adapter) {
  const target = normalizeTarget(adapter)
  const directUrl = adapter && typeof adapter.url === 'string' ? adapter.url.trim() : ''
  if (!target && !directUrl) {
    throw new Error('getAdapterScript 需要 { folder, assetJsPath }，或者直接给 { url }')
  }

  const key = target ? getAdapterCacheKey(target.folder, target.assetJsPath) : ''
  if (key) {
    const cached = readCache(key)
    if (cached) return cached
    const running = pending.get(key)
    if (running) return running
  }

  const task = loadScript(target, directUrl).then((text) => {
    if (key) writeCache(key, text)
    return text
  })
  if (key) {
    pending.set(key, task)
    task.then(
      () => pending.delete(key),
      () => pending.delete(key)
    )
  }
  return task
}

// 清空适配脚本缓存，返回清掉的条数
export function clearAdapterCache() {
  let removed = 0
  try {
    const info = typeof uni !== 'undefined' && typeof uni.getStorageInfoSync === 'function'
      ? uni.getStorageInfoSync()
      : null
    const keys = (info && info.keys) || []
    for (const key of keys) {
      if (typeof key === 'string' && key.indexOf(CACHE_PREFIX) === 0) {
        uni.removeStorageSync(key)
        removed += 1
      }
    }
  } catch (e) {
    // 拿不到 key 列表就算了，别把清缓存搞成崩溃
  }
  pending.clear()
  return removed
}
