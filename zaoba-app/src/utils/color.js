// 颜色工具：课程卡片走 iOS 的 tinted 着色风格（浅色底 + 同色系深字 + 实色条）。

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v))
}

export function hexToRgb(hex) {
  let h = String(hex || '').replace('#', '').trim()
  if (h.length === 3) h = h.split('').map(c => c + c).join('')
  if (h.length !== 6 || /[^0-9a-fA-F]/.test(h)) return { r: 0, g: 122, b: 255 }
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16)
  }
}

export function rgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function rgbToHue(hex) {
  const { r, g, b } = hexToRgb(hex)
  const rr = r / 255, gg = g / 255, bb = b / 255
  const max = Math.max(rr, gg, bb)
  const min = Math.min(rr, gg, bb)
  const d = max - min
  if (d === 0) return 210
  let h
  if (max === rr) h = (gg - bb) / d + (gg < bb ? 6 : 0)
  else if (max === gg) h = (bb - rr) / d + 2
  else h = (rr - gg) / d + 4
  return Math.round((h / 6) * 360)
}

// 由课程色推导卡片配色：浅色底 + 同色系深字 + 左侧实色条
export function courseTint(color, isDark) {
  const hue = rgbToHue(color)
  if (isDark) {
    return {
      bg: `hsla(${hue}, 68%, 58%, 0.28)`,
      border: `hsla(${hue}, 72%, 64%, 0.4)`,
      fg: `hsl(${hue}, 76%, 80%)`,
      bar: `hsl(${hue}, 72%, 64%)`
    }
  }
  return {
    bg: `hsla(${hue}, 80%, 52%, 0.12)`,
    border: `hsla(${hue}, 80%, 52%, 0.18)`,
    fg: `hsl(${hue}, 68%, 34%)`,
    bar: `hsl(${hue}, 74%, 52%)`
  }
}
