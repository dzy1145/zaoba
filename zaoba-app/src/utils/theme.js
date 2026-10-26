const ACCENTS = ['blue', 'green', 'purple', 'orange']
const MODES = ['light', 'dark', 'auto']

export const ACCENT_COLORS = {
  blue: '#007aff',
  green: '#34c759',
  purple: '#af52de',
  orange: '#ff9500'
}

function normalizeAccent(accent) {
  return ACCENTS.includes(accent) ? accent : 'blue'
}

// 解析成挂在页面根 view 上的类名，例如 "theme-blue mode-dark"
// auto 会在这里就解析成具体的 light/dark，保证页面样式与状态栏/TabBar 的判断一致
// （uni-app App 端 webview 的 prefers-color-scheme 与 JS 读到的系统主题可能不同步）
export function resolveThemeClass(accent, themeMode) {
  const a = normalizeAccent(accent)
  const m = MODES.includes(themeMode) ? themeMode : 'auto'
  const resolved = m === 'auto' ? (isDarkTheme('auto') ? 'dark' : 'light') : m
  return `theme-${a} mode-${resolved}`
}

export function isDarkTheme(themeMode) {
  if (themeMode === 'dark') return true
  if (themeMode === 'light') return false
  try {
    const info = uni.getSystemInfoSync()
    // App 端系统深色在 osTheme（theme 字段可能为空），H5 端也可能只给 theme
    return (info.osTheme || info.theme) === 'dark'
  } catch (e) {
    return false
  }
}

// 状态栏图标明暗：深色背景用浅色文字
export function applyStatusBar(themeMode) {
  try {
    const dark = isDarkTheme(themeMode)
    // #ifdef APP-PLUS
    plus.navigator.setStatusBarStyle(dark ? 'light' : 'dark')
    // #endif
    // #ifdef H5
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', dark ? '#000000' : '#f2f2f7')
    // #endif
  } catch (e) {
    /* 忽略：H5 或非 App 环境 */
  }
}

// 原生导航栏跟着主题变色（各页都在用默认导航栏）
export function applyNavBar(themeMode) {
  try {
    const dark = isDarkTheme(themeMode)
    uni.setNavigationBarColor({
      frontColor: dark ? '#ffffff' : '#000000',
      backgroundColor: dark ? '#1a1b1f' : '#ffffff'
    })
  } catch (e) {
    /* 忽略 */
  }
}

// 弹窗期间隐藏原生 TabBar（它盖不住，会破坏模态感）
export function setTabBarVisible(visible) {
  try {
    if (visible) uni.showTabBar()
    else uni.hideTabBar({ animation: false })
  } catch (e) {
    /* 非 tabBar 页面会抛错，忽略 */
  }
}

// 底部 TabBar 跟随主题（底色 + 强调色 + 选中图标）
export function applyTabBar(themeMode, accent) {
  try {
    const a = normalizeAccent(accent)
    const dark = isDarkTheme(themeMode)
    uni.setTabBarStyle({
      color: '#8e8e93',
      selectedColor: ACCENT_COLORS[a],
      backgroundColor: dark ? '#1c1c1e' : '#ffffff',
      borderStyle: 'black'
    })
    uni.setTabBarItem({ index: 0, selectedIconPath: `static/tab/calendar-${a}.png` })
    uni.setTabBarItem({ index: 1, selectedIconPath: `static/tab/contact-${a}.png` })
  } catch (e) {
    /* 非 tabBar 页面调用会抛错，忽略 */
  }
}
