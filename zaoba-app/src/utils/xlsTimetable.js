// 某高校教务系统导出的 .xls 课表 → 早八导入 JSON。
//
// 表格结构：第 2 行是「星期一…星期日」，第 0 列是「上午1、2节(01,02小节) 08:30-10:20」这类节次块，
// 单元格里每门课占 3~5 行：
//   视觉设计基础
//   任课教师(副教授)
//   3-4,8-10([周])[01-02-03-04节]
//   SJ-A3017
// 跨两个节次块的课会在两行里各出现一次，按「课程+周次+节次」去重。

import { formatDate, parseDate, addDays, weekMonday } from './schedule.js'

const DAY_NAMES = { 一: 0, 二: 1, 三: 2, 四: 3, 五: 4, 六: 5, 日: 6, 天: 6 }
const DAY_LABEL = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

// 导入取色用的扩展色：前 8 个是原版色板，后面 4 个是同风格的补充色（一学期 10 门课时不至于撞色）。
// 只用于自动分配，不动 COURSE_COLORS，手选色面板仍是原版 8 色。
const IMPORT_PALETTE = [
  '#4F7CD4', '#3FA7C4', '#43A98B', '#E0993F',
  '#E05E4F', '#A072D6', '#D65A95', '#7A8B9C',
  '#6FA33F', '#D9B23C', '#C4713A', '#6C63C9'
]

// 课程名 → 颜色的稳定散列：同一门课每次导入都是同一个颜色，撞色了就往后顺延
function nameHash(name) {
  let h = 2166136261
  const s = String(name)
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// 周次行：`3-4,8-10([周])[01-02节]`。
// 括号里那截各家写法不一样：`[周]`、`[单周]`、`第1-16周`、甚至把单双周写在括号外（`1-15(单周)[01-02节]`），
// 所以方括号可有可无——只要括号里提到「周」就算周次行，别因为写法不同把整门课静默丢掉。
const WEEK_LINE_RE = /^(.*?)\(\s*\[?\s*([^\])]*?周[^\])]*?)\s*\]?\s*\)\s*\[\s*([^\]]*?节)\s*\]/
const TIME_RANGE_RE = /(\d{1,2}:\d{2})\s*[-–—~～至]\s*(\d{1,2}:\d{2})/

// 教室行：`SJ-A3017`、`B202`、`A101`、`操场`
const ROOM_WORD_RE = /(楼|室|场|馆|中心|机房|实验|校区|报告厅|食堂|栋|层)/
const ROOM_CODE_RE = /^[A-Za-z]{1,6}[-\s]?[A-Za-z]?\d{2,}[A-Za-z0-9-]*$/

function isLocationLine(line) {
  const s = String(line || '').trim()
  if (!s || WEEK_LINE_RE.test(s)) return false
  return ROOM_WORD_RE.test(s) || ROOM_CODE_RE.test(s)
}

// 下一行是不是下一门课的开头（名字 +[教师]+ 周次行）。是就别当成这门的教室吞掉。
function startsNextCourse(lines, at) {
  const line = lines[at]
  if (!line) return true
  if (WEEK_LINE_RE.test(line)) return true
  const one = lines[at + 1]
  const two = lines[at + 2]
  if (one && WEEK_LINE_RE.test(one)) return true
  if (one && two && WEEK_LINE_RE.test(two)) return true
  return false
}

function cellText(sheet, row, col) {
  const line = sheet.rows[row]
  return line && line[col] ? String(line[col]) : ''
}

function findDayHeader(sheet) {
  for (let r = 0; r < sheet.rows.length; r++) {
    const cols = []
    const row = sheet.rows[r] || []
    for (let c = 0; c < row.length; c++) {
      const m = /^星期([一二三四五六日天])$/.exec(String(row[c] || '').trim())
      if (m) cols.push({ col: c, day: DAY_NAMES[m[1]] })
    }
    if (cols.length >= 5) return { row: r, cols }
  }
  return null
}

function parseWeekList(text) {
  const weeks = new Set()
  const chunks = String(text).split(/[,，、;；\s]+/).filter(Boolean)
  for (const chunk of chunks) {
    const range = /^第?(\d+)\s*[-–~至]\s*第?(\d+)/.exec(chunk)
    if (range) {
      const from = Number(range[1])
      const to = Number(range[2])
      for (let w = Math.min(from, to); w <= Math.max(from, to); w++) weeks.add(w)
      continue
    }
    const single = /^第?(\d+)/.exec(chunk)
    if (single) weeks.add(Number(single[1]))
  }
  return Array.from(weeks).sort((a, b) => a - b)
}

function parsePeriodList(text) {
  const nums = String(text).match(/\d+/g)
  if (!nums || !nums.length) return null
  const list = nums.map(Number)
  return { start: Math.min(...list), end: Math.max(...list) }
}

function parseEntryGroup(lines) {
  const weekIndex = lines.findIndex((line) => WEEK_LINE_RE.test(line))
  if (weekIndex < 0) return null

  const weekLine = lines[weekIndex]
  const match = WEEK_LINE_RE.exec(weekLine)
  const before = lines.slice(0, weekIndex).filter(Boolean)
  const after = lines.slice(weekIndex + 1).filter(Boolean)
  if (!before.length) return null

  const periods = parsePeriodList(match[3])
  if (!periods) return null

  let weeks = parseWeekList(match[1])
  const marker = match[2] || ''
  if (!weeks.length) return null
  if (marker.includes('单')) weeks = weeks.filter((w) => w % 2 === 1)
  if (marker.includes('双')) weeks = weeks.filter((w) => w % 2 === 0)
  if (!weeks.length) return null

  const name = before[0].trim()
  if (!name) return null

  // 教师行是周次行前最后一行；「(中2)」这种纯括号行是班级备注，不是老师
  let teacher = ''
  const teacherLine = before.length > 1 ? before[before.length - 1] : ''
  const teacherMatch = /^([^（(]+?)\s*[（(]/.exec(teacherLine)
  if (teacherMatch) teacher = teacherMatch[1].trim()
  else if (teacherLine && !/^[（(].*[）)]$/.test(teacherLine)) teacher = teacherLine.trim()

  return {
    name,
    teacher,
    location: (after[0] || '').trim(),
    day: null,
    startPeriod: periods.start,
    endPeriod: periods.end,
    weeks,
    weekText: match[1].trim()
  }
}

function parseCellEntries(text) {
  const lines = String(text).split(/\r?\n/).map((line) => line.trim())
  const weekIndexes = []
  for (let i = 0; i < lines.length; i++) {
    if (WEEK_LINE_RE.test(lines[i])) weekIndexes.push(i)
  }
  if (!weekIndexes.length) return { entries: [], failed: 0 }

  const entries = []
  let failed = 0
  let start = 0
  for (const index of weekIndexes) {
    let end = index + 1
    // 周次行后面那行通常是教室；但如果它看起来像下一门课的开头，就别吞（否则下次会把老师名当课名）
    const next = lines[end]
    if (next && !WEEK_LINE_RE.test(next) && (isLocationLine(next) || !startsNextCourse(lines, end))) {
      end++
    }
    const entry = parseEntryGroup(lines.slice(start, end))
    if (entry) entries.push(entry)
    else failed++
    start = end
  }
  return { entries, failed }
}

function parseBlockLabel(text) {
  const label = String(text || '')
  let from = null
  let to = null

  const pair = /\(\s*(\d+)\s*[,，]\s*(\d+)\s*小节\s*\)/.exec(label) || /(\d+)\s*[、,，]\s*(\d+)\s*节/.exec(label)
  if (pair) {
    from = Number(pair[1])
    to = Number(pair[2])
  } else {
    const single = /(\d+)\s*小节/.exec(label)
    if (single) {
      from = Number(single[1])
      to = from
    }
  }

  const time = TIME_RANGE_RE.exec(label)
  return {
    from,
    to,
    start: time ? time[1] : '',
    end: time ? time[2] : ''
  }
}

export function inspectXlsTimetable(workbook) {
  const sheet = workbook.sheets.find((s) => findDayHeader(s))
  if (!sheet) throw new Error('没有找到星期表头，可能不是教务课表')

  const header = findDayHeader(sheet)
  let semesterName = ''
  let noScheduleCount = 0
  let inNoScheduleList = false

  for (let r = 0; r < sheet.rows.length; r++) {
    const row = sheet.rows[r] || []
    for (const value of row) {
      const m = /学年学期[：:]\s*(\S+)/.exec(String(value || ''))
      if (m && !semesterName) semesterName = m[1]
    }
  }

  const blocks = []
  const entries = []
  const seen = new Set()
  const unparsed = []
  let failedGroups = 0

  for (let r = header.row + 1; r < sheet.rows.length; r++) {
    const first = cellText(sheet, r, 0)

    if (/无课表课程/.test(first)) {
      inNoScheduleList = true
      continue
    }
    if (inNoScheduleList) {
      if (/^\d+$/.test(first.trim()) && cellText(sheet, r, 3)) noScheduleCount++
      continue
    }
    if (/^备注/.test(first)) continue

    const block = parseBlockLabel(first)
    if (block.from == null) continue
    if (block.start && block.end) blocks.push(block)

    for (const { col, day } of header.cols) {
      const text = cellText(sheet, r, col)
      if (!text) continue
      const parsed = parseCellEntries(text)
      failedGroups += parsed.failed
      if (!parsed.entries.length) {
        // 格子里有东西却一门课都没认出来：记下来在弹窗里提示，别静默丢课
        if (text.replace(/\s/g, '')) unparsed.push(`${DAY_LABEL[day]}：${text.replace(/\s+/g, ' ').slice(0, 18)}`)
        continue
      }
      for (const entry of parsed.entries) {
        entry.day = day
        const key = [
          entry.day, entry.name, entry.teacher, entry.location,
          entry.weeks.join(','), entry.startPeriod, entry.endPeriod
        ].join('|')
        if (seen.has(key)) continue
        seen.add(key)
        entries.push(entry)
      }
    }
  }

  if (!entries.length) throw new Error('没有解析到任何课程')

  const weeks = entries.flatMap((entry) => entry.weeks)
  return {
    sheetName: sheet.name,
    semesterName: semesterName || '导入的课表',
    entries,
    blocks,
    noScheduleCount,
    unparsedCells: unparsed.length,
    unparsedSamples: unparsed.slice(0, 3),
    failedGroups,
    minWeek: Math.min(...weeks),
    maxWeek: Math.max(...weeks),
    courseCount: new Set(entries.map((entry) => entry.name)).size
  }
}

export function guessStartMonday(semesterName) {
  const m = /(\d{4})\s*[-–]\s*(\d{4})\s*[-–]\s*([12])/.exec(semesterName || '')
  let guess
  if (m) guess = m[3] === '1' ? new Date(Number(m[1]), 8, 1) : new Date(Number(m[2]), 1, 20)
  else guess = new Date()
  return formatDate(weekMonday(guess))
}

function splitWeeks(weeks) {
  const runs = []
  let i = 0
  while (i < weeks.length) {
    const step = i + 1 < weeks.length ? weeks[i + 1] - weeks[i] : 1
    if (step === 1 || step === 2) {
      let j = i
      while (j + 1 < weeks.length && weeks[j + 1] - weeks[j] === step) j++
      runs.push({ from: weeks[i], to: weeks[j], step })
      i = j + 1
    } else {
      runs.push({ from: weeks[i], to: weeks[i], step: 1 })
      i++
    }
  }
  return runs
}

function dateOfWeek(monday, week, day) {
  return formatDate(addDays(parseDate(monday), (week - 1) * 7 + day))
}

function minutesOf(time) {
  const [h, m] = String(time).split(':').map(Number)
  return h * 60 + m
}

function timeOf(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// 节次块只给了两小节合起来的时间（如 08:30-10:20）。按 10 分钟课间把它拆开，
// 两边对齐块的首尾，尽量贴近真实作息；块太短就直接均分。
export function periodsFromBlocks(blocks) {
  const byIndex = new Map()
  for (const block of blocks) {
    if (!block.start || !block.end || block.from == null) continue
    const count = block.to - block.from + 1
    const start = minutesOf(block.start)
    const end = minutesOf(block.end)
    const total = end - start
    if (!(total > 0) || count < 1) continue

    const gap = count > 1 ? 10 : 0
    let per = Math.floor((total - gap * (count - 1)) / count)
    let realGap = gap
    if (per < 20) {
      per = Math.floor(total / count)
      realGap = 0
    }

    for (let i = 0; i < count; i++) {
      const s = start + i * (per + realGap)
      byIndex.set(block.from + i, { index: block.from + i, start: timeOf(s), end: timeOf(s + per) })
    }
  }
  return Array.from(byIndex.values()).sort((a, b) => a.index - b.index)
}

// 同步节次时，Excel 里只有 10 节；老学期可能用到第 11/12 节，砍掉会让那些课画到画布外。
// 所以保留超出部分（时间沿用原来的），只覆盖 Excel 覆盖到的那些节次。
function mergePeriods(next, previous) {
  if (!next.length) return []
  const maxIndex = next[next.length - 1].index
  const extra = (previous || [])
    .filter((p) => p && Number(p.index) > maxIndex && p.start && p.end)
    .sort((a, b) => a.index - b.index)
    .map((p) => ({ index: Number(p.index), start: String(p.start), end: String(p.end) }))
  return extra.length ? next.concat(extra) : next
}

export function buildZaobaImport(inspected, options = {}) {
  const startMonday = options.startMonday
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startMonday || '')) throw new Error('请先选择第 1 周周一')

  const semesterId = `xls-${Date.now()}`
  const base = Date.now()
  const colorByName = new Map()
  const usedColors = new Set()
  const colorOf = (name) => {
    if (!colorByName.has(name)) {
      const start = nameHash(name) % IMPORT_PALETTE.length
      let color = IMPORT_PALETTE[start]
      for (let k = 1; usedColors.has(color) && k <= IMPORT_PALETTE.length; k++) {
        color = IMPORT_PALETTE[(start + k) % IMPORT_PALETTE.length]
      }
      usedColors.add(color)
      colorByName.set(name, color)
    }
    return colorByName.get(name)
  }

  const courses = []
  for (const entry of inspected.entries) {
    for (const run of splitWeeks(entry.weeks)) {
      courses.push({
        id: '',
        semesterId,
        name: entry.name,
        teacher: entry.teacher,
        location: entry.location,
        day: entry.day,
        startPeriod: entry.startPeriod,
        endPeriod: entry.endPeriod,
        startDate: dateOfWeek(startMonday, run.from, entry.day),
        endDate: dateOfWeek(startMonday, run.to, entry.day),
        weekType: run.step === 2 ? 'everyOther' : 'every',
        needPc: false,
        color: colorOf(entry.name),
        createdAt: base + courses.length
      })
    }
  }

  const periods = options.syncPeriods ? periodsFromBlocks(inspected.blocks) : []
  const userPeriods = mergePeriods(periods, options.keepPeriods)

  return {
    version: '1.0',
    exportTime: Date.now(),
    app: '早八',
    user: userPeriods.length ? { periods: userPeriods } : {},
    semesters: [{
      id: semesterId,
      name: inspected.semesterName,
      startDate: startMonday,
      createdAt: base,
      sortOrder: 0
    }],
    courses,
    currentSemesterId: semesterId
  }
}
