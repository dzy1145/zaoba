<script>
import { initDatabase } from './services/database.js'
import { autoCheckUpdate, promptAndInstall, isUpdateSupported } from './services/updater.js'

export default {
  async onLaunch() {
    try {
      await initDatabase()
    } catch (error) {
      console.error('数据库初始化失败', error)
    }

    // 系统明暗切换时通知各页面重新解析主题（"跟随系统"模式需要）
    try {
      if (uni.onThemeChange) {
        uni.onThemeChange(() => uni.$emit('theme-changed'))
      }
    } catch (e) {
      /* 不支持则忽略 */
    }

    // 启动后静默检查更新：12 小时才查一次，只有真的有新版才弹窗；
    // 调试基座 / H5 里 isUpdateSupported() 为 false，直接跳过。
    if (isUpdateSupported()) {
      setTimeout(async () => {
        try {
          const result = await autoCheckUpdate()
          if (result && result.hasUpdate && !result.skipped) {
            await promptAndInstall(result.latest, {
              manual: false,
              currentVersionName: result.current.versionName
            })
          }
        } catch (error) {
          // 更新检查失败不影响正常使用，静默
          console.warn('检查更新失败', error)
        }
      }, 2500)
    }
  }
}
</script>

<style>
/* ========== 全局 ========== */
page {
  background-color: var(--bg, #f2f3f6);
  color: var(--text, #17181c);
  font-size: 32rpx;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue',
    'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;

  /* 兜底令牌：浅色 + 蓝色强调（页面根 view 会再挂 .theme-* 覆盖） */
  --accent: #007aff;
  --accent-strong: #0063ce;
  --accent-tint: rgba(0, 122, 255, 0.12);
  --accent-grad-a: #4b93ff;
  --accent-grad-b: #007aff;

  --bg: #f2f3f6;
  --surface: #ffffff;
  --surface-2: #f6f7f9;
  --surface-3: #e9ebef;
  --seg-on: #ffffff;

  --text: #17181c;
  --text-2: #6e7280;
  --text-3: #9ea2ad;
  --separator: #e8eaee;
  --separator-soft: #f0f1f4;

  --glass: rgba(255, 255, 255, 0.72);
  --toolbar: rgba(255, 255, 255, 0.82);

  --danger: #f0524f;
}

button {
  margin: 0;
  padding: 0;
  line-height: inherit;
  box-sizing: border-box;
  overflow: visible;
  background: transparent;
  border-radius: 0;
  font-family: inherit;
}

button::after {
  border: 0;
}

/* ========== 令牌 ========== */
:root {
  --fs-large-title: 68rpx;
  --fs-title1: 56rpx;
  --fs-title2: 44rpx;
  --fs-title3: 40rpx;
  --fs-headline: 34rpx;
  --fs-body: 32rpx;
  --fs-callout: 30rpx;
  --fs-subhead: 28rpx;
  --fs-footnote: 26rpx;
  --fs-caption: 24rpx;
  --fs-caption2: 22rpx;

  --sp-1: 8rpx;
  --sp-2: 16rpx;
  --sp-3: 24rpx;
  --sp-4: 32rpx;
  --sp-5: 40rpx;
  --sp-6: 48rpx;
  --sp-7: 56rpx;
  --sp-8: 64rpx;

  /* 圆角阶梯（对齐小程序的 --radius-* 语言） */
  --r-xs: 12rpx;
  --r-sm: 18rpx;
  --r-md: 26rpx;
  --r-lg: 36rpx;
  --r-xl: 48rpx;
  --r-pill: 999rpx;

  --fw-regular: 400;
  --fw-medium: 500;
  --fw-semibold: 600;
  --fw-bold: 700;

  --ease-ios: cubic-bezier(0.32, 0.72, 0, 1);
  --ease-out: cubic-bezier(0.25, 0.1, 0.25, 1);
  --dur-press: 0.12s;

  --status-bar-height: 0px;

  --z-float: 10;
  --z-modal: 100;

  /* 柔光投影：一层贴轮廓收边、一层大范围铺开做深度 */
  --shadow-card: 0 2rpx 6rpx rgba(18, 22, 33, 0.035), 0 14rpx 36rpx rgba(18, 22, 33, 0.055);
  --shadow-float: 0 8rpx 24rpx rgba(18, 22, 33, 0.1), 0 28rpx 72rpx rgba(18, 22, 33, 0.1);
}

/* ========== 强调色 ========== */
.theme-blue {
  --accent: #007aff;
  --accent-strong: #0063ce;
  --accent-tint: rgba(0, 122, 255, 0.12);
  --accent-grad-a: #4b93ff;
  --accent-grad-b: #007aff;
}

.theme-green {
  --accent: #34c759;
  --accent-strong: #248a3d;
  --accent-tint: rgba(52, 199, 89, 0.14);
  --accent-grad-a: #5fd77c;
  --accent-grad-b: #34c759;
}

.theme-purple {
  --accent: #af52de;
  --accent-strong: #8944ab;
  --accent-tint: rgba(175, 82, 222, 0.14);
  --accent-grad-a: #c17cea;
  --accent-grad-b: #af52de;
}

.theme-orange {
  --accent: #ff9500;
  --accent-strong: #c77700;
  --accent-tint: rgba(255, 149, 0, 0.16);
  --accent-grad-a: #ffb03a;
  --accent-grad-b: #ff9500;
}

/* ========== 浅色 ========== */
.theme-blue,
.theme-green,
.theme-purple,
.theme-orange {
  --bg: #f2f3f6;
  --surface: #ffffff;
  --surface-2: #f6f7f9;
  --surface-3: #e9ebef;
  --seg-on: #ffffff;
  --text: #17181c;
  --text-2: #6e7280;
  --text-3: #9ea2ad;
  --separator: #e8eaee;
  --separator-soft: #f0f1f4;
  --glass: rgba(255, 255, 255, 0.72);
  --toolbar: rgba(255, 255, 255, 0.82);
  --track: #dfe2e8;

  /* 原版小程序的令牌名（别名）—— 必须声明在也能解析到 --surface 的同一元素上 */
  --primary: var(--accent);
  --primary-soft: var(--accent-tint);
  --primary-grad-a: var(--accent-grad-a);
  --primary-grad-b: var(--accent-grad-b);
  --primary-shadow: var(--accent-tint);
  --card: var(--surface);
  --card-2: var(--surface-2);
  --text-sub: var(--text-2);
  --text-faint: var(--text-3);
  --border: var(--separator);
  --border-soft: var(--separator-soft);
  --glass-strong: var(--toolbar);
  --danger-soft: rgba(240, 82, 79, 0.12);
  --radius-xs: var(--r-xs);
  --radius-sm: var(--r-sm);
  --radius: var(--r-md);
  --radius-lg: var(--r-lg);
  --radius-xl: var(--r-xl);
}

/* ========== 深色 ========== */
.theme-blue.mode-dark,
.theme-green.mode-dark,
.theme-purple.mode-dark,
.theme-orange.mode-dark {
  --bg: #0f1013;
  --surface: #1a1b1f;
  --surface-2: #232428;
  --surface-3: #34363d;
  --seg-on: #3a3d44;
  --text: #f4f5f7;
  --text-2: #a4a7b0;
  --text-3: #71747d;
  --separator: #292a2f;
  --separator-soft: #222327;
  --track: #34363d;
  --glass: rgba(26, 27, 31, 0.7);
  --toolbar: rgba(26, 27, 31, 0.85);
  --danger: #ff6b68;
  --shadow-card: 0 2rpx 6rpx rgba(0, 0, 0, 0.28), 0 14rpx 36rpx rgba(0, 0, 0, 0.36);
  --shadow-float: 0 8rpx 24rpx rgba(0, 0, 0, 0.42), 0 28rpx 72rpx rgba(0, 0, 0, 0.5);
}
</style>
