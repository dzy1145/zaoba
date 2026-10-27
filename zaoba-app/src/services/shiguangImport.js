// 拾光课程表适配脚本 → 早八课表模型
//
// 适配脚本在 WebView 里跑完，通过 bridge 回传一份标准 JSON（课程 + 时段 + 开学配置）。
// 难点在周次：拾光给的是「周次集合」（如 [1,2,3,5,7,9]），而早八的课程只能表达
// 「一段连续日期 + 每周/隔周」（startDate/endDate + weekType，判定靠 utils/schedule.js 的 hitDate）。
// 所以这里做三件事：
//   1) 按步长把周次拆段：步长 1 → every，步长 2 → everyOther（锚定首周奇偶），单周 → every；
//   2) 周次换日期：第 1 周周一 + (week-1)*7 + (day-1)，day 是拾光的 1~7（周一~周日）；
//   3) 按「课名+教师+地点+星期+节次」把重复条目合并回一起再拆，避免同一条课拆得过碎。
//
// buildImportPlan 是纯函数（不碰数据库，Node 里可直接跑回归）；
// 落库全部走 saveImportedTable，语义与 database.js 的导入契约对齐。

import { dateOfWeek, formatDate, parseDate, weekMonday } from '../utils/schedule.js'
import {
  COURSE_COLORS,
  DEFAULT_PERIODS,
  clearSemesterCourses,
  createCourse,
  createSemester,
  listSemesters,
  setCurrentSemesterId,
  updateUser
} from './database.js'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^([01]?\d|2[0-3]):[0-5]\d$/
// 一次导入最多留这么多条提示，剩下的折成一行，免得 toast 刷屏
const WARNING_LIMIT = 50

// ---------- 小工具 ----------

function toText(value) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number') return String(value)
  return ''
}

function toInt(value) {
  const n = Number(value)
  return Number.isFinite(n) ? Math.round(n) : null
}

// 取第一个能转成整数的值（老安卓 WebView 不敢用 ??，这里显式判 null）
function firstInt(fallback, ...values) {
  for (const value of values) {
    const n = toInt(value)
    if (n !== null) return n
  }
  return fallback
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

// 兜底日期：opts.today 可以是 'YYYY-MM-DD' 或 Date，没给就用今天
function baseDate(value) {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? new Date() : value
  if (typeof value === 'string' && DATE_RE.test(value)) return parseDate(value)
  const parsed = value ? new Date(value) : new Date()
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed
}

// 提示收集器：本身可直接调用（warn('…')），warn.list() 取最终数组
function createWarningBag() {
  const list = []
  let dropped = 0
  const warn = (message) => {
    if (!message) return
    if (list.length < WARNING_LIMIT) list.push(message)
    else dropped++
  }
  warn.list = () => (dropped ? list.concat(`另有 ${dropped} 条提示未显示`) : list.slice())
  return warn
}

// ---------- 时段表 ----------

// 拾光 timeSlots → 早八 periods：[{ index, start, end }]
// 只留 number 从 1 开始连续、时间格式合法的；中间断号会让早八的节次格错行，
// 所以断号直接截断，缺的节次后面按默认时长递推补（见 padPeriods）。
function normalizeTimeSlots(timeSlots, warn) {
  if (!Array.isArray(timeSlots)) return []

  let invalid = 0
  const byIndex = new Map()
  for (const slot of timeSlots) {
    if (!slot || typeof slot !== 'object') {
      invalid++
      continue
    }
    const index = toInt(slot.number)
    const start = toText(slot.startTime)
    const end = toText(slot.endTime)
    const usable =
      index !== null &&
      index >= 1 &&
      TIME_RE.test(start) &&
      TIME_RE.test(end) &&
      minutesOf(end) > minutesOf(start)
    if (!usable) {
      invalid++
      continue
    }
    if (!byIndex.has(index)) byIndex.set(index, { index, start, end })
  }
  if (invalid) warn(`时段表有 ${invalid} 个节次时间非法，已忽略`)

  const ordered = Array.from(byIndex.values()).sort((a, b) => a.index - b.index)
  const kept = []
  for (const slot of ordered) {
    if (slot.index !== kept.length + 1) break
    kept.push(slot)
  }
  const broken = ordered.length - kept.length
  if (broken) warn(`时段表从第 ${kept.length + 1} 节起编号不连续，后面的 ${broken} 节已忽略`)
  return kept
}

// 课程用到时段表以外的节次（如 endSection=15、时段表只给了 12 节）时，
// 按 defaultClassDuration / defaultBreakDuration 一节课一节课往外递推补齐。
function padPeriods(periods, maxIndex, classDuration, breakDuration, warn) {
  const list = periods.map((p) => ({ ...p }))
  if (!list.length || maxIndex <= list.length) return list

  let lastEnd = minutesOf(list[list.length - 1].end)
  let added = 0
  for (let index = list.length + 1; index <= maxIndex; index++) {
    const start = lastEnd + breakDuration
    const end = start + classDuration
    // 递推到 24:00 以后就没有合法时间了，宁可少补也不要写坏值
    if (end >= 24 * 60) {
      warn(`按默认时长递推下去第 ${index} 节会超过 24:00，已停止补齐`)
      break
    }
    list.push({ index, start: timeOf(start), end: timeOf(end) })
    lastEnd = end
    added++
  }
  if (added) {
    warn(`时段表缺 ${added} 节，已按 ${classDuration} 分钟一节、课间 ${breakDuration} 分钟递推补齐`)
  }
  return list
}

// 自定义时间 → 节次区间：先找和 [start, end] 有重叠的节次；
// 一个都不占（落在课间/午休/晚上没排节的时段）就退回时间上最近的那一节。
function mapCustomTime(startTime, endTime, periods, warn, courseName) {
  const start = toText(startTime)
  const end = toText(endTime)
  if (!TIME_RE.test(start) || !TIME_RE.test(end) || minutesOf(end) <= minutesOf(start)) {
    warn(`课程「${courseName}」的自定义时间（${start || '空'}-${end || '空'}）非法，已按节次字段处理`)
    return null
  }

  const cs = minutesOf(start)
  const ce = minutesOf(end)
  const hits = periods.filter((p) => minutesOf(p.end) > cs && minutesOf(p.start) < ce)
  if (hits.length) {
    return { startPeriod: hits[0].index, endPeriod: hits[hits.length - 1].index }
  }

  // 没占到任何一节：按「区间中点离哪节课中点最近」挑一节
  const mid = (cs + ce) / 2
  let nearest = periods[0]
  let best = Infinity
  for (const p of periods) {
    const distance = Math.abs((minutesOf(p.start) + minutesOf(p.end)) / 2 - mid)
    if (distance < best) {
      best = distance
      nearest = p
    }
  }
  warn(`课程「${courseName}」的自定义时间 ${start}-${end} 不落在任何节次内，已放到最近的第 ${nearest.index} 节`)
  return { startPeriod: nearest.index, endPeriod: nearest.index }
}

// ---------- 周次拆段 ----------

// 把升序周次集合拆成「段」：
//   步长 1 → { from, to, step: 1 } → 一条 every（覆盖首周~末周每周）
//   步长 2 → { from, to, step: 2 } → 一条 everyOther（锚定 from 的奇偶）
//   其它（断档、步长 3+、单周）→ 一条单周 every（startDate === endDate）
// 例：[1,2,3,5,7,9] → [{1,3,1}, {5,9,2}]；[1,2,3,4,6,7,8,10] → [{1,4,1}, {6,8,1}, {10,10,1}]
export function splitWeekRuns(weeks) {
  const runs = []
  let i = 0
  while (i < weeks.length) {
    const step = i + 1 < weeks.length ? weeks[i + 1] - weeks[i] : 0
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

// 周次集合：去重、丢掉非法值、升序（拆段逻辑依赖升序）
function normalizeWeeks(weeks) {
  if (!Array.isArray(weeks)) return []
  const set = new Set()
  for (const value of weeks) {
    const n = toInt(value)
    if (n !== null && n >= 1) set.add(n)
  }
  return Array.from(set).sort((a, b) => a - b)
}

// ---------- 单门课映射 ----------

function mapCourse(raw, ctx) {
  const { periods, totalWeeks, warn } = ctx

  if (!raw || typeof raw !== 'object') {
    warn('课程数据里有非对象条目，已跳过')
    return null
  }

  const name = toText(raw.name)
  if (!name) {
    warn('有课程缺少课名，已跳过')
    return null
  }

  const day = toInt(raw.day)
  if (day === null || day < 1 || day > 7) {
    warn(`课程「${name}」的星期字段（day=${raw.day}）不在 1~7 内，已跳过`)
    return null
  }

  const weeks = normalizeWeeks(raw.weeks)
  if (!weeks.length) {
    warn(`课程「${name}」没有有效周次，已跳过`)
    return null
  }
  if (totalWeeks) {
    const overflow = weeks.filter((w) => w > totalWeeks)
    // 只提示不改数据：适配脚本的总周数不一定准，按原周次导入比悄悄砍课安全
    if (overflow.length) warn(`课程「${name}」的周次 ${overflow.join(',')} 超出学期总周数 ${totalWeeks}，仍按原周次导入`)
  }

  const startSection = toInt(raw.startSection)
  if (startSection === null || startSection < 1) {
    warn(`课程「${name}」缺少有效的开始节次（startSection=${raw.startSection}），已跳过`)
    return null
  }
  let endSection = toInt(raw.endSection)
  if (endSection === null || endSection < 1) endSection = startSection
  if (endSection < startSection) {
    warn(`课程「${name}」的结束节次（${endSection}）小于开始节次（${startSection}），已按单节处理`)
    endSection = startSection
  }

  let startPeriod = startSection
  let endPeriod = endSection
  if (raw.isCustomTime) {
    const mapped = mapCustomTime(raw.customStartTime, raw.customEndTime, periods, warn, name)
    if (mapped) {
      startPeriod = mapped.startPeriod
      endPeriod = mapped.endPeriod
    }
  }

  const hasCredit =
    raw.credit !== undefined && raw.credit !== null && String(raw.credit).trim() !== ''

  return {
    name,
    teacher: toText(raw.teacher),
    location: toText(raw.position),
    day,
    startPeriod,
    endPeriod,
    weeks,
    hasCredit
  }
}

// ---------- 构建导入计划 ----------

/**
 * 把拾光回传的数据转成早八的导入计划（纯函数，不写库）
 * @param {object} input { schoolName, adapterName, courses, timeSlots, config }
 * @param {object} [opts] { today, defaultClassDuration, defaultBreakDuration, semesterTotalWeeks }
 * @returns {{ semester: { name: string, startDate: string }, periods: Array, courses: Array, warnings: string[] }}
 */
export function buildImportPlan(input, opts = {}) {
  const source = input && typeof input === 'object' ? input : {}
  const rawCourses = source.courses
  if (!Array.isArray(rawCourses) || rawCourses.length === 0) {
    throw new Error('拾光导入数据无效：courses 必须是非空数组')
  }

  const config = source.config && typeof source.config === 'object' ? source.config : {}
  const warn = createWarningBag()
  const schoolName = toText(source.schoolName) || toText(source.adapterName) || '未知学校'

  // 学期第 1 周周一：适配脚本可能拿不到开学日期（config.semesterStartDate 为 null），
  // 兜底用「本周周一」，并在 warnings 里说清楚，让用户能自己核对。
  let semesterStartDate = toText(config.semesterStartDate)
  if (!DATE_RE.test(semesterStartDate)) {
    if (semesterStartDate) {
      warn(`适配脚本给的开学日期「${semesterStartDate}」不是 YYYY-MM-DD 格式，已忽略`)
    }
    const monday = weekMonday(baseDate(opts.today))
    semesterStartDate = formatDate(monday)
    warn(`适配脚本未提供开学日期，已用本周周一 ${semesterStartDate} 作为学期第 1 周周一`)
  }

  // 节假日/作息时长：config 优先，opts 可以让调用方临时覆盖
  const classDuration = firstInt(45, config.defaultClassDuration, opts.defaultClassDuration)
  const breakDuration = firstInt(10, config.defaultBreakDuration, opts.defaultBreakDuration)
  const totalWeeks = firstInt(null, config.semesterTotalWeeks, opts.semesterTotalWeeks)

  let basePeriods = normalizeTimeSlots(source.timeSlots, warn)
  if (!basePeriods.length) {
    // 没有可用时段表时不要写空数组：早八整张课表靠 periods 画行，沿用默认作息最安全
    basePeriods = DEFAULT_PERIODS.map((p) => ({ index: p.index, start: p.start, end: p.end }))
    warn('适配脚本未返回可用的时段表，已沿用早八默认节次时间')
  }

  const ctx = {
    periods: basePeriods,
    totalWeeks: totalWeeks && totalWeeks > 0 ? totalWeeks : null,
    warn
  }

  // 按「课名+教师+地点+星期+节次」归并：适配脚本重复回传/同一门课分多条周次时，
  // 周次先合起来再拆段，避免课表里出现两条一模一样的课，也避免拆得过碎。
  const buckets = new Map()
  let creditCourses = 0
  let skipped = 0
  for (const raw of rawCourses) {
    const mapped = mapCourse(raw, ctx)
    if (!mapped) {
      skipped++
      continue
    }
    if (mapped.hasCredit) creditCourses++
    const key = [
      mapped.name,
      mapped.teacher,
      mapped.location,
      mapped.day,
      mapped.startPeriod,
      mapped.endPeriod
    ].join('|')
    let bucket = buckets.get(key)
    if (!bucket) {
      bucket = { ...mapped, weeks: new Set() }
      buckets.set(key, bucket)
    }
    for (const week of mapped.weeks) bucket.weeks.add(week)
  }

  if (skipped) warn(`共跳过 ${skipped} 门字段不完整的课程`)
  // 学分早八模型里没有对应字段，丢弃即可；但要说一次，别让用户以为丢数据了
  if (creditCourses) warn(`有 ${creditCourses} 门课带学分，早八没有学分字段，已丢弃`)

  // 颜色沿早八 8 色板轮转（按课名首次出现的顺序），同一门课拆出来的多条同色
  const colorByName = new Map()
  const colorOf = (name) => {
    if (!colorByName.has(name)) {
      colorByName.set(name, COURSE_COLORS[colorByName.size % COURSE_COLORS.length])
    }
    return colorByName.get(name)
  }

  const courses = []
  const seen = new Set()
  for (const bucket of buckets.values()) {
    const weeks = Array.from(bucket.weeks).sort((a, b) => a - b)
    for (const run of splitWeekRuns(weeks)) {
      const startDate = formatDate(dateOfWeek(semesterStartDate, run.from, bucket.day - 1))
      const endDate = formatDate(dateOfWeek(semesterStartDate, run.to, bucket.day - 1))
      // 隔周课：早八的 hitDate 是相对课程自己的 startDate 数周数奇偶的，
      // 所以步长 2 的段必须从该段首周起算（startDate 就是锚点），endDate 只负责收口。
      const weekType = run.step === 2 ? 'everyOther' : 'every'
      const dedupeKey = [
        bucket.name,
        bucket.day,
        bucket.startPeriod,
        bucket.endPeriod,
        startDate,
        endDate,
        weekType
      ].join('|')
      if (seen.has(dedupeKey)) continue
      seen.add(dedupeKey)

      courses.push({
        name: bucket.name,
        teacher: bucket.teacher,
        location: bucket.location,
        // 拾光是 1~7（周一起），早八是 0~6（0=周一）
        day: bucket.day - 1,
        startPeriod: bucket.startPeriod,
        endPeriod: bucket.endPeriod,
        startDate,
        endDate,
        weekType,
        needPc: false,
        color: colorOf(bucket.name)
      })
    }
  }

  // 节次表要覆盖所有课用到的最大节次，缺的按默认时长递推补齐
  const maxPeriod = courses.reduce((max, course) => Math.max(max, course.endPeriod), 1)
  const periods = padPeriods(basePeriods, maxPeriod, classDuration, breakDuration, warn)

  return {
    semester: {
      // 同名学期 = 同一次导入：saveImportedTable 会据此先清课后重写，重复导入幂等
      name: `${schoolName} ${semesterStartDate}`,
      startDate: semesterStartDate
    },
    periods,
    courses,
    warnings: warn.list()
  }
}

// ---------- 落库 ----------

/**
 * 把导入计划写进早八（学期 / 课程 / 节次表 / 当前学期）
 * @param {object} plan buildImportPlan 的返回值
 * @param {object} [opts] { syncPeriods: false 时不动全局节次表 }
 * @returns {Promise<{ semesterId: string, courses: number, warnings: string[] }>}
 */
export async function saveImportedTable(plan, opts = {}) {
  if (!plan || typeof plan !== 'object') {
    throw new Error('导入计划无效：需要先调用 buildImportPlan')
  }
  if (!plan.semester || typeof plan.semester.name !== 'string' || !plan.semester.name.trim()) {
    throw new Error('导入计划无效：缺少学期名称')
  }
  if (!Array.isArray(plan.courses) || plan.courses.length === 0) {
    throw new Error('导入计划里没有可写入的课程')
  }

  const warnings = []

  // 节次表是全局设置（跟学期无关），同步一次就够；追加导入的调用方可以传 syncPeriods:false
  if (opts.syncPeriods !== false && Array.isArray(plan.periods) && plan.periods.length) {
    await updateUser({ periods: plan.periods })
  }

  // 同名学期视为同一次导入：先清掉旧课再写，重复导入课程数才不会翻倍
  const semesterName = plan.semester.name.trim()
  const semesters = await listSemesters()
  let semester = semesters.find((item) => item && item.name === semesterName) || null
  if (semester) {
    await clearSemesterCourses(semester.id)
  } else {
    semester = await createSemester({
      name: semesterName,
      startDate: plan.semester.startDate || null
    })
  }

  let created = 0
  for (const course of plan.courses) {
    try {
      await createCourse({ ...course, semesterId: semester.id })
      created++
    } catch (error) {
      // 单门课失败不炸整次导入，剩下的继续写
      const label = course && course.name ? course.name : '未知课程'
      warnings.push(`课程「${label}」写入失败：${(error && error.message) || error}`)
    }
  }

  // 导入完必须把当前学期指过去，否则课表页还停在旧学期，看起来像没导进去
  await setCurrentSemesterId(semester.id)

  return { semesterId: semester.id, courses: created, warnings }
}
