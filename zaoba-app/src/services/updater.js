// 自动检测更新
//
// 版本信息有两个来源：
//   1. 仓库根目录的 update.json（jsDelivr / raw / 代理三路镜像）—— 带 versionCode、sha256、备注，
//      面向国内网络（api.github.com 在有些网络下会卡）。
//   2. GitHub Releases API（实时、无需发布清单）—— 只用来兜底取「最新 tag + 下载地址 + 说明」。
//
// 流程：取清单 → 比对版本 → 弹窗 → 下载 APK（按清单里的 sha256 校验）→ plus.runtime.install。
// 安装包必须和已装的是同一个签名（项目一直用云端证书，签名稳定），否则覆盖安装会失败。

const REPO = 'dzy1145/zaoba'
const REPO_BRANCH = 'main'

// update.json 的三路镜像：jsDelivr 国内通常可用，但 @main 有缓存（约 12 小时）；
// raw.githubusercontent 实时但经常被墙；ghproxy 只当最后兜底。
export const MANIFEST_URLS = [
  'https://cdn.jsdelivr.net/gh/' + REPO + '@' + REPO_BRANCH + '/update.json',
  'https://raw.githubusercontent.com/' + REPO + '/' + REPO_BRANCH + '/update.json',
  'https://ghproxy.net/https://raw.githubusercontent.com/' + REPO + '/' + REPO_BRANCH + '/update.json'
]

export const RELEASE_API = 'https://api.github.com/repos/' + REPO + '/releases/latest'
export const RELEASE_PAGE = 'https://github.com/' + REPO + '/releases/latest'

const KEY_LAST_CHECK = 'updateLastCheck'
const KEY_SKIP_VERSION = 'updateSkipVersion'
const KEY_AUTO_CHECK = 'updateAutoCheck'
const REQUEST_TIMEOUT = 12000

// 自动检查的节流窗口：12 小时内只自动查一次（手动点「检查更新」不受限制）
export const AUTO_CHECK_INTERVAL = 12 * 60 * 60 * 1000

// 正式包的 AppID；调试基座里 plus.runtime.appid 不是它，检查更新没有意义
const APP_ID = '__UNI__1A56EB1'

// ========== 纯函数（可在 Node 里测，见 scripts/test-update.mjs） ==========

// 'v1.2.0' / '1.2' → [1, 2, 0]；'-beta.3' / '+build' 这类后缀直接丢掉（按 semver，预发布不参与比较）
export function parseVersion(value) {
  const text = String(value || '').trim().replace(/^v/i, '')
  const core = text.split(/[-+]/)[0]
  const parts = core.split('.').map((x) => parseInt(x, 10)).filter((n) => !isNaN(n))
  if (!parts.length) return [0]
  return parts
}

// a 比 b 新返回 1，一样返回 0，旧返回 -1
export function compareVersions(a, b) {
  const va = parseVersion(a)
  const vb = parseVersion(b)
  const len = Math.max(va.length, vb.length)
  for (let i = 0; i < len; i++) {
    const x = va[i] || 0
    const y = vb[i] || 0
    if (x > y) return 1
    if (x < y) return -1
  }
  return 0
}

// 未安装 → true；同版本或更低 → false
export function isNewerVersion(latest, current) {
  if (!latest) return false
  if (!current) return true
  return compareVersions(latest, current) > 0
}

// GitHub Releases API 的响应 → 和 update.json 一致的结构
export function normalizeRelease(release) {
  if (!release || typeof release !== 'object') return null
  const tag = String(release.tag_name || '').trim()
  if (!tag) return null
  const assets = Array.isArray(release.assets) ? release.assets : []
  const apk = assets.filter((a) => a && /\.apk$/i.test(String(a.name || '')))[0]
  const digest = (apk && (apk.digest || '')) || ''
  return {
    versionName: tag.replace(/^v/i, ''),
    versionCode: 0,
    notes: String(release.body || '').trim(),
    releasePage: String(release.html_url || RELEASE_PAGE),
    apk: apk
      ? {
        name: String(apk.name || ''),
        size: Number(apk.size) || 0,
        sha256: String(digest).replace(/^sha256:/i, '').toLowerCase(),
        urls: [String(apk.browser_download_url || '')].filter(Boolean)
      }
      : null
  }
}

// update.json → 统一结构；字段缺就返回 null（调用方会继续试别的源）
export function normalizeManifest(raw) {
  if (!raw || typeof raw !== 'object') return null
  const versionName = String(raw.versionName || raw.version || '').trim()
  if (!versionName) return null
  const apk = raw.apk || {}
  const urls = []
  if (Array.isArray(apk.urls)) urls.push(...apk.urls)
  if (apk.url) urls.push(apk.url)
  const clean = urls.map((u) => String(u || '').trim()).filter(Boolean)
  return {
    versionName,
    versionCode: parseInt(raw.versionCode, 10) || 0,
    notes: String(raw.notes || '').trim(),
    releasePage: String(raw.releasePage || RELEASE_PAGE),
    apk: clean.length
      ? {
        name: String(apk.name || 'zaoba-' + versionName + '.apk'),
        size: Number(apk.size) || 0,
        sha256: String(apk.sha256 || '').replace(/^sha256:/i, '').toLowerCase(),
        urls: clean
      }
      : null
  }
}

// 这个版本要不要打扰用户：手动检查一定提示；自动检查时跳过的版本不再问
export function shouldPrompt(manifest, skippedVersion, manual) {
  if (!manifest || !manifest.apk) return false
  if (manual) return true
  return !skippedVersion || compareVersions(manifest.versionName, skippedVersion) !== 0
}

// ========== 平台相关 ==========

function isAppRuntime() {
  return typeof plus !== 'undefined' && !!plus.runtime
}

// 调试基座 / 模拟器里 appid 不是正式包，检查更新无意义
export function isReleaseApp() {
  if (!isAppRuntime()) return false
  try {
    return String(plus.runtime.appid || '') === APP_ID
  } catch (e) {
    return false
  }
}

export function isUpdateSupported() {
  return typeof uni !== 'undefined' && isAppRuntime()
}

function requestJson(url) {
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      method: 'GET',
      timeout: REQUEST_TIMEOUT,
      header: { Accept: 'application/json' },
      success: (res) => {
        if (res.statusCode !== 200) {
          reject(new Error('HTTP ' + res.statusCode))
          return
        }
        let data = res.data
        if (typeof data === 'string') {
          try { data = JSON.parse(data) } catch (e) { reject(new Error('返回的不是 JSON')); return }
        }
        resolve(data)
      },
      fail: (err) => reject(new Error((err && err.errMsg) || '网络请求失败'))
    })
  })
}

// 当前安装的版本：plus.runtime.getProperty 是唯一在所有 Android 版本上都靠谱的取法
export function getCurrentVersion() {
  return new Promise((resolve) => {
    if (!isAppRuntime()) {
      resolve({ versionName: '', versionCode: 0 })
      return
    }
    try {
      const appid = plus.runtime.appid || ''
      plus.runtime.getProperty(appid, (info) => {
        resolve({
          versionName: String((info && info.version) || ''),
          versionCode: parseInt((info && info.versionCode), 10) || 0
        })
      })
    } catch (e) {
      resolve({ versionName: '', versionCode: 0 })
    }
  })
}

// 依次试 update.json 的镜像，再退到 GitHub Releases API
export function fetchUpdateManifest() {
  const tag = { source: '' }
  const chain = MANIFEST_URLS.map((url) => () => requestJson(url).then((raw) => {
    const manifest = normalizeManifest(raw)
    if (!manifest) throw new Error('update.json 内容不完整')
    tag.source = 'update.json'
    return manifest
  }))
  chain.push(() => requestJson(RELEASE_API).then((raw) => {
    const manifest = normalizeRelease(raw)
    if (!manifest) throw new Error('Release 信息不完整')
    tag.source = 'github-release'
    return manifest
  }))

  return chain.reduce((prev, next) => prev.catch(next), Promise.reject(new Error('no-source')))
    .then((manifest) => Object.assign({ source: tag.source }, manifest))
}

function readStorage(key) {
  try { return uni.getStorageSync(key) } catch (e) { return '' }
}

function writeStorage(key, value) {
  try { uni.setStorageSync(key, value) } catch (e) { /* 忽略 */ }
}

/**
 * 检查更新。
 * @param {{manual?:boolean}} opts manual=true 时忽略节流和「跳过此版本」
 * @returns {Promise<{hasUpdate:boolean, current:object, latest:object|null, skipped:boolean, reason?:string}>}
 */
export async function checkForUpdate(opts = {}) {
  const manual = !!opts.manual
  if (!isUpdateSupported()) {
    return { hasUpdate: false, current: { versionName: '', versionCode: 0 }, latest: null, skipped: false, reason: 'not-supported' }
  }
  if (!isReleaseApp()) {
    return { hasUpdate: false, current: await getCurrentVersion(), latest: null, skipped: false, reason: 'not-release-app' }
  }

  if (!manual) {
    const last = parseInt(readStorage(KEY_LAST_CHECK), 10) || 0
    if (last && Date.now() - last < AUTO_CHECK_INTERVAL) {
      return { hasUpdate: false, current: await getCurrentVersion(), latest: null, skipped: false, reason: 'throttled' }
    }
  }
  writeStorage(KEY_LAST_CHECK, Date.now())

  const current = await getCurrentVersion()
  let latest = null
  try {
    latest = await fetchUpdateManifest()
  } catch (e) {
    return { hasUpdate: false, current, latest: null, skipped: false, reason: 'network' }
  }

  const hasUpdate = isNewerVersion(latest.versionName, current.versionName)
  const skippedVersion = String(readStorage(KEY_SKIP_VERSION) || '')
  const skipped = hasUpdate && !shouldPrompt(latest, skippedVersion, manual)
  return { hasUpdate, current, latest, skipped }
}

// 启动时自动检查的开关（默认开）。存 uni storage，不进数据库，不需要迁移
export function isAutoCheckEnabled() {
  const stored = readStorage(KEY_AUTO_CHECK)
  if (stored === '' || stored === undefined || stored === null) return true
  return !!stored
}

export function setAutoCheckEnabled(enabled) {
  writeStorage(KEY_AUTO_CHECK, !!enabled)
}
export function skipVersion(versionName) {
  writeStorage(KEY_SKIP_VERSION, String(versionName || ''))
}

// 下载 APK：plus.downloader 能拿进度，失败再试清单里的下一个地址
export function downloadApk(manifest, onProgress) {
  if (!isAppRuntime() || !manifest || !manifest.apk) {
    return Promise.reject(new Error('没有可下载的安装包'))
  }
  const apk = manifest.apk
  const urls = (apk.urls || []).filter(Boolean)
  if (!urls.length) return Promise.reject(new Error('清单里没有下载地址'))

  const tryOne = (url) => new Promise((resolve, reject) => {
    const fileName = '_downloads/zaoba-' + manifest.versionName + '.apk'
    let task = null
    try {
      task = plus.downloader.createDownload(url, { filename: fileName, timeout: 180, retry: 1 }, (done, status) => {
        if (status === 200 && done && done.filename) resolve(done.filename)
        else reject(new Error('下载失败（' + status + '）'))
      })
    } catch (e) {
      reject(new Error('创建下载任务失败：' + e.message))
      return
    }
    task.addEventListener('statechanged', (t) => {
      if (t.state === 3 && onProgress && t.totalSize > 0) {
        onProgress(Math.min(99, Math.round((t.downloadedSize / t.totalSize) * 100)))
      }
    })
    task.start()
  })

  return urls.reduce((prev, url) => prev.catch(() => tryOne(url)), Promise.reject(new Error('no-url')))
}

// 校验下载到的文件：有 sha256 就必须一致，否则拒绝安装
export function verifyApk(path, manifest) {
  const expect = manifest && manifest.apk && manifest.apk.sha256
  if (!expect) return Promise.resolve(true)
  return new Promise((resolve, reject) => {
    uni.getFileInfo({
      filePath: path,
      digestAlgorithm: 'sha256',
      success: (res) => {
        const actual = String(res.digest || '').toLowerCase()
        if (actual && actual === String(expect).toLowerCase()) resolve(true)
        else reject(new Error('安装包校验不一致'))
      },
      fail: (err) => reject(new Error('读取安装包失败：' + ((err && err.errMsg) || '')))
    })
  })
}

// 调系统安装器。Android 8+ 需要「安装未知应用」权限，失败时给可操作的提示
export function installApk(path) {
  return new Promise((resolve, reject) => {
    if (!isAppRuntime()) { reject(new Error('当前环境不支持安装')); return }
    plus.runtime.install(path, { force: false }, () => resolve(true), (err) => {
      reject(new Error((err && (err.message || err.code)) || '安装失败'))
    })
  })
}

// 启动时静默检查（节流由 checkForUpdate 内部处理），有新版才打扰用户
export function autoCheckUpdate() {
  if (!isUpdateSupported() || !isReleaseApp()) return Promise.resolve(null)
  if (!isAutoCheckEnabled()) return Promise.resolve(null)
  return checkForUpdate({ manual: false })
}

// ========== 交互流程（下载 + 校验 + 安装） ==========

function toast(title) {
  uni.showToast({ title: String(title || ''), icon: 'none', duration: 2500 })
}

function confirmUpdate(latest) {
  const notes = String(latest.notes || '').split('\n').slice(0, 8).join('\n')
  const content = '当前版本：' + (latest.currentVersionName || '') +
    '\n最新版本：' + latest.versionName +
    (notes ? '\n\n' + notes : '') +
    '\n\n下载完成会自动打开安装界面，覆盖安装不会丢课表数据。'
  return new Promise((resolve) => {
    uni.showModal({
      title: '发现新版本 v' + latest.versionName,
      content,
      confirmText: '立即更新',
      cancelText: '稍后',
      success: (res) => resolve(!!res.confirm),
      fail: () => resolve(false)
    })
  })
}

// 自动检查时用户点了「稍后」：再给一次「跳过这个版本」的机会，免得每次启动都弹
function askSkip(latest) {
  return new Promise((resolve) => {
    uni.showActionSheet({
      itemList: ['稍后再说', '跳过 v' + latest.versionName],
      success: (res) => resolve(res.tapIndex === 1),
      fail: () => resolve(false)
    })
  })
}

/**
 * 走完整个更新流程：确认 → 下载 → 校验 → 安装。
 * @param {object} latest checkForUpdate 返回的 latest
 * @param {{manual?:boolean, currentVersionName?:string}} opts
 * @returns {Promise<'installed'|'cancelled'|'skipped'|'failed'>}
 */
export async function promptAndInstall(latest, opts = {}) {
  const manual = !!opts.manual
  if (!latest || !latest.apk) {
    if (manual) toast('这个版本没有提供安装包，去 Release 页看看')
    return 'failed'
  }
  latest.currentVersionName = opts.currentVersionName || ''

  const ok = await confirmUpdate(latest)
  if (!ok) {
    if (!manual) {
      const skip = await askSkip(latest)
      if (skip) {
        skipVersion(latest.versionName)
        toast('已跳过 v' + latest.versionName)
        return 'skipped'
      }
    }
    return 'cancelled'
  }

  let waiting = false
  try {
    plus.nativeUI.showWaiting('准备下载…', { padlock: true })
    waiting = true
  } catch (e) { /* 没有 nativeUI 就静默下载 */ }

  let path = ''
  try {
    path = await downloadApk(latest, (percent) => {
      try { plus.nativeUI.showWaiting('下载中 ' + percent + '%', { padlock: true }) } catch (e) { /* 忽略 */ }
    })
  } catch (e) {
    if (waiting) { try { plus.nativeUI.closeWaiting() } catch (err) { /* 忽略 */ } }
    toast(e.message || '下载失败')
    return 'failed'
  }

  try {
    if (waiting) { try { plus.nativeUI.showWaiting('校验安装包…', { padlock: true }) } catch (e) { /* 忽略 */ } }
    await verifyApk(path, latest)
  } catch (e) {
    if (waiting) { try { plus.nativeUI.closeWaiting() } catch (err) { /* 忽略 */ } }
    toast(e.message || '安装包校验失败')
    return 'failed'
  }

  if (waiting) { try { plus.nativeUI.closeWaiting() } catch (e) { /* 忽略 */ } }

  try {
    await installApk(path)
    return 'installed'
  } catch (e) {
    const msg = String((e && e.message) || '安装失败')
    // 常见原因：没开「安装未知应用」权限 / 签名不一致 / 安装包损坏
    const isPermission = /permission|denied|Permission|INSTALL/i.test(msg)
    uni.showModal({
      title: '安装没有成功',
      content: isPermission
        ? '系统拦截了安装。请到「设置 → 应用 → 早八 → 安装未知应用」里允许后再试，或手动到 Release 页下载安装。'
        : '安装失败：' + msg + '\n可以到 Release 页手动下载安装。',
      confirmText: '去下载页',
      cancelText: '知道了',
      success: (res) => {
        if (res.confirm) {
          try { plus.runtime.openURL(latest.releasePage || RELEASE_PAGE) } catch (err) { /* 忽略 */ }
        }
      }
    })
    return 'failed'
  }
}
