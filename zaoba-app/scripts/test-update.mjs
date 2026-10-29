// 更新模块的回归：版本比较 / Release 归一化 / update.json 归一化 / 是否提示 / 下载线路与权限判断。
// 用法：bash scripts/run-test-update.sh
import fs from 'node:fs'
import {
  parseVersion,
  compareVersions,
  isNewerVersion,
  normalizeRelease,
  normalizeManifest,
  shouldPrompt,
  orderMirrorUrls,
  formatSpeed,
  looksLikePermissionError,
  getCurrentVersion,
  FALLBACK_VERSION,
  MANIFEST_URLS,
  RELEASE_API
} from './_updater.mjs'

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

// ---- 版本号解析 ----
check('parseVersion v1.2.0', parseVersion('v1.2.0'), [1, 2, 0])
check('parseVersion 1.2', parseVersion('1.2'), [1, 2])
check('parseVersion 空', parseVersion(''), [0])
check('parseVersion 带后缀', parseVersion('1.2.0-beta.3'), [1, 2, 0])
check('parseVersion 非数字', parseVersion('abc'), [0])

// ---- 比较 ----
check('1.2.0 > 1.1.0', compareVersions('1.2.0', '1.1.0'), 1)
check('1.1.0 < 1.2.0', compareVersions('1.1.0', '1.2.0'), -1)
check('1.2.0 = 1.2.0', compareVersions('1.2.0', '1.2.0'), 0)
check('1.10.0 > 1.9.0（按数字比不是字符串）', compareVersions('1.10.0', '1.9.0'), 1)
check('1.2 = 1.2.0', compareVersions('1.2', '1.2.0'), 0)
check('v 前缀不影响', compareVersions('v1.3.0', '1.2.9'), 1)

// ---- isNewerVersion ----
check('有新版', isNewerVersion('1.2.0', '1.1.0'), true)
check('同版本不是新版', isNewerVersion('1.2.0', '1.2.0'), false)
check('旧版不提示', isNewerVersion('1.0.0', '1.2.0'), false)
check('拿不到当前版本时按有新版处理', isNewerVersion('1.2.0', ''), true)

// ---- GitHub Release 归一化 ----
const release = {
  tag_name: 'v1.2.0',
  html_url: 'https://github.com/dzy1145/zaoba/releases/tag/v1.2.0',
  body: '## 更新\n- 自动检查更新',
  assets: [
    { name: 'notes.txt', size: 10, browser_download_url: 'https://x/notes.txt' },
    {
      name: 'zaoba-v1.2.0-20261028.apk',
      size: 14854788,
      digest: 'sha256:ABCDEF0123',
      browser_download_url: 'https://github.com/dzy1145/zaoba/releases/download/v1.2.0/zaoba-v1.2.0-20261028.apk'
    }
  ]
}
const rel = normalizeRelease(release)
check('Release → 版本名', rel.versionName, '1.2.0')
check('Release → 用 apk 资产而不是别的附件', rel.apk.name, 'zaoba-v1.2.0-20261028.apk')
check('Release → digest 转小写 sha256', rel.apk.sha256, 'abcdef0123')
check('Release → 下载地址', rel.apk.urls.length, 1)
check('Release → 说明', rel.notes.indexOf('自动检查更新') >= 0, true)
check('Release → 无 tag 返回 null', normalizeRelease({}), null)

// ---- update.json 归一化 ----
const manifest = normalizeManifest({
  versionName: '1.3.0',
  versionCode: 130,
  notes: '修复若干问题',
  apk: {
    name: 'zaoba-v1.3.0.apk',
    size: 100,
    sha256: 'SHA256:FFEE',
    urls: ['https://a/x.apk', '', 'https://b/x.apk'],
    url: 'https://c/x.apk'
  }
})
check('manifest → 版本名', manifest.versionName, '1.3.0')
check('manifest → 三条地址（去空）', manifest.apk.urls, ['https://a/x.apk', 'https://b/x.apk', 'https://c/x.apk'])
check('manifest → sha256 前缀去掉且小写', manifest.apk.sha256, 'ffee')
check('manifest → 缺版本号返回 null', normalizeManifest({ notes: 'x' }), null)
check('manifest → 没有 apk 时 apk 为 null', normalizeManifest({ versionName: '1.0.1' }).apk, null)

// ---- 是否提示 ----
check('手动检查总是提示', shouldPrompt({ versionName: '1.2.0', apk: {} }, '1.2.0', true), true)
check('自动检查跳过同版本', shouldPrompt({ versionName: '1.2.0', apk: {} }, '1.2.0', false), false)
check('自动检查遇到其他版本要提示', shouldPrompt({ versionName: '1.3.0', apk: {} }, '1.2.0', false), true)
check('没有安装包不提示', shouldPrompt({ versionName: '1.3.0', apk: null }, '', true), false)

// ---- 常量检查（别把仓库地址写错） ----
check('清单镜像 3 路', MANIFEST_URLS.length, 3)
check('镜像都指向 zaoba 仓库', MANIFEST_URLS.every((u) => u.indexOf('dzy1145/zaoba') >= 0), true)
check('Release API 地址', RELEASE_API, 'https://api.github.com/repos/dzy1145/zaoba/releases/latest')

// ---- 下载线路排序（上次成功的那条排最前）----
const URLS = ['https://a.apk', 'https://b.apk', 'https://c.apk']
check('没有历史时保持原顺序', orderMirrorUrls(URLS), URLS)
globalThis.uni = { getStorageSync: () => 'https://b.apk' }
check('上次成功的排最前', orderMirrorUrls(URLS), ['https://b.apk', 'https://a.apk', 'https://c.apk'])
globalThis.uni = { getStorageSync: () => 'https://old.apk' }
check('历史里的地址已不在清单里就忽略', orderMirrorUrls(URLS), URLS)
check('空输入返回空数组', orderMirrorUrls(undefined), [])
check('过滤空地址', orderMirrorUrls(['', 'https://a.apk', '  ']), ['https://a.apk'])
delete globalThis.uni

// ---- 速度文案 ----
check('速度为 0 不显示', formatSpeed(0), '')
check('字节', formatSpeed(500), '500 B/s')
check('KB', formatSpeed(2048), '2 KB/s')
check('MB 保留一位', formatSpeed(1572864), '1.5 MB/s')

// ---- 安装权限判断（各家 ROM 文案不同，必须宽匹配）----
check('INSTALL_FAILED 判为权限问题', looksLikePermissionError({ message: 'INSTALL_FAILED_USER_RESTRICTED' }), true)
check('permission denied 判为权限问题', looksLikePermissionError({ message: 'Permission denied' }), true)
check('中文「未知来源」判为权限问题', looksLikePermissionError({ message: '禁止未知来源' }), true)
check('签名不一致不是权限问题', looksLikePermissionError({ message: '签名校验失败' }), false)
check('空错误不误判', looksLikePermissionError(null), false)

// ---- 兜底版本必须跟 manifest 同步（改版本号只改一处的坑）----
const manifestJson = JSON.parse(fs.readFileSync(new URL('../src/manifest.json', import.meta.url), 'utf8'))
check('FALLBACK_VERSION 与 manifest.versionName 一致', FALLBACK_VERSION, manifestJson.versionName)
check('非 App 环境返回兜底版本', await getCurrentVersion(), { versionName: FALLBACK_VERSION, versionCode: 0 })

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILED`)
process.exit(failures === 0 ? 0 : 1)
