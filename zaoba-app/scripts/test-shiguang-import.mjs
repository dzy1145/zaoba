// 拾光导入映射层回归：buildImportPlan 纯函数 + saveImportedTable 走 database.js 的 H5 存储分支
// 用法：bash scripts/run-test-shiguang.sh
import { buildImportPlan, saveImportedTable, splitWeekRuns } from './_shiguangImport.mjs'
import { hitDate, parseDate } from './_schedule.mjs'
import * as db from './_database.mjs'

// ---------- 断言 ----------
let total = 0
let failed = 0

function ok(label, condition, detail) {
  total++
  if (condition) {
    console.log(`ok   ${label}`)
  } else {
    console.log(`FAIL ${label}${detail ? ' — ' + detail : ''}`)
    failed++
  }
}

function eq(label, actual, expected) {
  ok(label, actual === expected, `实际 ${JSON.stringify(actual)} 期望 ${JSON.stringify(expected)}`)
}

function hasWarning(label, warnings, keyword) {
  ok(label, Array.isArray(warnings) && warnings.some((w) => String(w).includes(keyword)), `warnings=${JSON.stringify(warnings)}`)
}

async function expectThrow(label, fn, keyword) {
  try {
    await fn()
    ok(label, false, '没有抛错')
  } catch (error) {
    const message = error && error.message ? error.message : String(error)
    ok(label, error instanceof Error && message.includes(keyword), `message=${message}`)
  }
}

function section(title) {
  console.log(`\n== ${title} ==`)
}

// ---------- H5 存储 mock（与 scripts/test-xls.mjs 同一套路） ----------
const store = new Map()
globalThis.uni = {
  getSystemInfoSync: () => ({ platform: 'h5' }),
  getStorageSync: (key) => (store.has(key) ? store.get(key) : ''),
  setStorageSync: (key, value) => store.set(key, value)
}

await db.initDatabase()

// ---------- 公共样例 ----------
// 第 1 周周一固定 2026-09-07，直接复用早八默认 12 节当拾光时段表
const START = '2026-09-07'
const timeSlots = db.DEFAULT_PERIODS.map((p) => ({
  number: p.index,
  startTime: p.start,
  endTime: p.end
}))
const baseConfig = {
  semesterStartDate: START,
  semesterTotalWeeks: 20,
  defaultClassDuration: 45,
  defaultBreakDuration: 10,
  firstDayOfWeek: 1
}

function makePlan(courses, extra = {}, opts = {}) {
  return buildImportPlan(
    {
      schoolName: extra.schoolName === undefined ? '示例大学' : extra.schoolName,
      adapterName: '示例教务',
      courses,
      timeSlots: extra.timeSlots === undefined ? timeSlots : extra.timeSlots,
      config: extra.config === undefined ? baseConfig : extra.config
    },
    opts
  )
}

const hits = (course, dateStr) => hitDate(course, parseDate(dateStr))

// ---------- 1. 连续周 ----------
section('连续周（1-4 周）')
{
  const plan = makePlan([
    { name: '高等数学', teacher: '张老师', position: 'A101', day: 1, startSection: 1, endSection: 2, weeks: [1, 2, 3, 4], credit: 4 }
  ])
  eq('课程条数', plan.courses.length, 1)
  const course = plan.courses[0]
  eq('weekType=every', course.weekType, 'every')
  eq('startDate=第1周周一', course.startDate, '2026-09-07')
  eq('endDate=第4周周一', course.endDate, '2026-09-28')
  eq('day 转 0 基（周一=0）', course.day, 0)
  eq('location 取 position', course.location, 'A101')
  eq('needPc 恒 false', course.needPc, false)
  eq('节次 1-2', `${course.startPeriod}-${course.endPeriod}`, '1-2')
  ok('第2周周一上课', hits(course, '2026-09-14'))
  ok('第5周周一不上', !hits(course, '2026-10-05'))
  eq('学分只聚合提示一次', plan.warnings.filter((w) => String(w).includes('学分')).length, 1)
  eq('除此之外无其它提示', plan.warnings.length, 1)
}

// ---------- 2. 纯单周 ----------
section('纯单周（只有第 5 周）')
{
  const plan = makePlan([
    { name: '专题报告', position: '报告厅', day: 5, startSection: 3, endSection: 3, weeks: [5] }
  ])
  eq('课程条数', plan.courses.length, 1)
  const course = plan.courses[0]
  eq('weekType=every', course.weekType, 'every')
  eq('startDate=第5周周五', course.startDate, '2026-10-09')
  eq('endDate 与 startDate 相同', course.endDate, course.startDate)
  eq('单节 startPeriod=endPeriod', `${course.startPeriod}-${course.endPeriod}`, '3-3')
  ok('第5周周五上课', hits(course, '2026-10-09'))
  ok('第6周周五不上', !hits(course, '2026-10-16'))
}

// ---------- 3. 纯双周 ----------
section('纯双周（1/3/5 周）')
{
  const plan = makePlan([
    { name: '线性代数', day: 2, startSection: 3, endSection: 4, weeks: [1, 3, 5] }
  ])
  eq('课程条数', plan.courses.length, 1)
  const course = plan.courses[0]
  eq('weekType=everyOther', course.weekType, 'everyOther')
  eq('startDate=第1周周二（锚点）', course.startDate, '2026-09-08')
  eq('endDate=第5周周二', course.endDate, '2026-10-06')
  ok('第1周周二上课', hits(course, '2026-09-08'))
  ok('第2周周二不上（隔周）', !hits(course, '2026-09-15'))
  ok('第3周周二上课', hits(course, '2026-09-22'))
  ok('第5周周二上课', hits(course, '2026-10-06'))
  ok('第6周周二不上（超区间）', !hits(course, '2026-10-13'))
}

// ---------- 4. 有断档 ----------
section('有断档（1-4 + 6-8 + 10 周）')
{
  const weeks = [1, 2, 3, 4, 6, 7, 8, 10]
  const runs = splitWeekRuns(weeks).map((r) => `${r.from}-${r.to}/${r.step}`)
  eq('周次拆段结果', runs.join(','), '1-4/1,6-8/1,10-10/1')

  const plan = makePlan([
    { name: '大学物理', day: 1, startSection: 1, endSection: 2, weeks }
  ])
  eq('断档样例课程条数', plan.courses.length, 3)
  console.log(`   ↳ 断档样例 [${weeks.join(',')}] 拆出 ${plan.courses.length} 条课`)
  const sorted = plan.courses.slice().sort((a, b) => (a.startDate < b.startDate ? -1 : 1))
  eq('三条都是 every', sorted.map((c) => c.weekType).join(','), 'every,every,every')
  eq('第1段 09-07~09-28', `${sorted[0].startDate}~${sorted[0].endDate}`, '2026-09-07~2026-09-28')
  eq('第2段 10-12~10-26', `${sorted[1].startDate}~${sorted[1].endDate}`, '2026-10-12~2026-10-26')
  eq('第3段 11-09~11-09', `${sorted[2].startDate}~${sorted[2].endDate}`, '2026-11-09~2026-11-09')
  ok('第2周周一上课', sorted.some((c) => hits(c, '2026-09-14')))
  ok('第5周周一不上（断档）', !sorted.some((c) => hits(c, '2026-10-05')))
  ok('第6周周一上课', sorted.some((c) => hits(c, '2026-10-12')))
  ok('第9周周一不上（断档）', !sorted.some((c) => hits(c, '2026-11-02')))
  ok('第10周周一上课', sorted.some((c) => hits(c, '2026-11-09')))
}

// ---------- 5. 跨年 ----------
section('跨年（第 1 周与第 18 周）')
{
  const plan = makePlan([
    { name: '马克思主义原理', day: 3, startSection: 5, endSection: 6, weeks: [1, 18] }
  ])
  eq('课程条数', plan.courses.length, 2)
  const sorted = plan.courses.slice().sort((a, b) => (a.startDate < b.startDate ? -1 : 1))
  eq('第1周周三', sorted[0].startDate, '2026-09-09')
  eq('第18周周三跨到 2027 年', sorted[1].startDate, '2027-01-06')
  ok('2027-01-06 上课', hits(sorted[1], '2027-01-06'))
  ok('2027-01-13 不上', !hits(sorted[1], '2027-01-13'))
}

// ---------- 6. 单节 / endSection 缺省 / endSection 非法 ----------
section('单节、endSection 缺省与非法值')
{
  const plan = makePlan([
    { name: '缺省结束节次', day: 4, startSection: 6, weeks: [1] },
    { name: '结束节次小于开始', day: 4, startSection: 8, endSection: 5, weeks: [1] },
    { name: '结束节次为 0', day: 4, startSection: 9, endSection: 0, weeks: [1] }
  ])
  const byName = (name) => plan.courses.find((c) => c.name === name)
  eq('缺 endSection 时取 startSection', `${byName('缺省结束节次').startPeriod}-${byName('缺省结束节次').endPeriod}`, '6-6')
  eq('endSection < startSection 时按单节', `${byName('结束节次小于开始').startPeriod}-${byName('结束节次小于开始').endPeriod}`, '8-8')
  eq('endSection=0 视为缺省', `${byName('结束节次为 0').startPeriod}-${byName('结束节次为 0').endPeriod}`, '9-9')
  hasWarning('非法结束节次有 warning', plan.warnings, '小于开始节次')
}

// ---------- 7. 自定义时间 ----------
section('自定义时间（isCustomTime）')
{
  const plan = makePlan([
    { name: '早自习', day: 1, startSection: 1, endSection: 1, weeks: [1], isCustomTime: true, customStartTime: '08:10', customEndTime: '09:30' },
    { name: '午间讲座', day: 2, startSection: 1, endSection: 1, weeks: [1], isCustomTime: true, customStartTime: '12:30', customEndTime: '13:00' },
    { name: '夜间实验', day: 3, startSection: 4, endSection: 5, weeks: [1], isCustomTime: true }
  ])
  const byName = (name) => plan.courses.find((c) => c.name === name)
  eq('覆盖 08:10-09:30 的节次区间为 1-2', `${byName('早自习').startPeriod}-${byName('早自习').endPeriod}`, '1-2')
  eq('落在课间的自定义时间取最近一节', `${byName('午间讲座').startPeriod}-${byName('午间讲座').endPeriod}`, '5-5')
  eq('自定义时间缺失时退回节次字段', `${byName('夜间实验').startPeriod}-${byName('夜间实验').endPeriod}`, '4-5')
  hasWarning('最近一节的 warning', plan.warnings, '最近的第 5 节')
  hasWarning('非法自定义时间的 warning', plan.warnings, '自定义时间')
}

// ---------- 8. 无 semesterStartDate ----------
section('config.semesterStartDate 为空（兜底本周周一）')
{
  const plan = makePlan(
    [{ name: '兜底学期课', day: 1, startSection: 1, endSection: 2, weeks: [1, 2] }],
    { config: { ...baseConfig, semesterStartDate: null } },
    { today: '2026-09-09' }
  )
  eq('学期 startDate 兜底为本周周一', plan.semester.startDate, '2026-09-07')
  eq('学期名 = 学校名 + 日期', plan.semester.name, '示例大学 2026-09-07')
  eq('课程日期按兜底周一算', plan.courses[0].startDate, '2026-09-07')
  hasWarning('兜底有 warning 说明', plan.warnings, '开学日期')

  const badFormat = makePlan(
    [{ name: '格式非法课', day: 1, startSection: 1, endSection: 1, weeks: [1] }],
    { config: { ...baseConfig, semesterStartDate: '2026/09/07' } },
    { today: '2026-09-09' }
  )
  eq('非法日期格式也兜底', badFormat.semester.startDate, '2026-09-07')
  hasWarning('非法日期格式有 warning', badFormat.warnings, '不是 YYYY-MM-DD 格式')
}

// ---------- 9. 时段表：非法/断号/补齐 ----------
section('时段表过滤与节次补齐')
{
  // 只给前 4 节，课程用到第 6 节 → 按 45/10 递推补齐
  const shortPlan = makePlan(
    [{ name: '补节次课', day: 1, startSection: 5, endSection: 6, weeks: [1] }],
    { timeSlots: timeSlots.slice(0, 4) }
  )
  eq('补齐后节次条数', shortPlan.periods.length, 6)
  eq('第5节开始时间', shortPlan.periods[4].start, '11:35')
  eq('第5节结束时间', shortPlan.periods[4].end, '12:20')
  eq('第6节开始时间', shortPlan.periods[5].start, '12:30')
  eq('第6节结束时间', shortPlan.periods[5].end, '13:15')
  hasWarning('补齐有 warning', shortPlan.warnings, '递推补齐')

  // 编号 1、2、4（断号）→ 只保留 1、2，其余按默认时长补
  const gapPlan = makePlan(
    [{ name: '断号课', day: 1, startSection: 1, endSection: 4, weeks: [1] }],
    { timeSlots: [timeSlots[0], timeSlots[1], timeSlots[3]] }
  )
  eq('断号后补齐到 4 节', gapPlan.periods.length, 4)
  eq('断号补齐第3节', `${gapPlan.periods[2].start}-${gapPlan.periods[2].end}`, '09:45-10:30')
  eq('断号补齐第4节', `${gapPlan.periods[3].start}-${gapPlan.periods[3].end}`, '10:40-11:25')
  hasWarning('断号有 warning', gapPlan.warnings, '编号不连续')

  // 时间非法的节次直接丢
  const invalidPlan = makePlan(
    [{ name: '坏时段课', day: 1, startSection: 1, endSection: 1, weeks: [1] }],
    { timeSlots: [{ number: 1, startTime: '08:00', endTime: '8点45' }] }
  )
  eq('时段表全非法时回落到默认节次表', invalidPlan.periods.length, 12)
  hasWarning('时段非法有 warning', invalidPlan.warnings, '节次时间非法')
}

// ---------- 10. 颜色轮转 ----------
section('颜色按 COURSE_COLORS 轮转')
{
  const courses = []
  for (let i = 0; i < 9; i++) {
    courses.push({ name: `轮转课${i + 1}`, day: (i % 7) + 1, startSection: (i % 4) + 1, endSection: (i % 4) + 1, weeks: [1] })
  }
  const plan = makePlan(courses)
  const expected = db.COURSE_COLORS.concat(db.COURSE_COLORS[0])
  eq('9 门课颜色按色板轮转', plan.courses.map((c) => c.color).join(','), expected.join(','))
  eq('第 1 门用第一个色板色', plan.courses[0].color, db.COURSE_COLORS[0])
}

// ---------- 11. 去重合并 ----------
section('重复条目去重 / 周次合并')
{
  const plan = makePlan([
    { name: '大学物理', day: 2, startSection: 1, endSection: 2, weeks: [1, 2] },
    { name: '大学物理', day: 2, startSection: 1, endSection: 2, weeks: [3, 4] },
    { name: '大学物理', day: 2, startSection: 1, endSection: 2, weeks: [1, 2] }
  ])
  eq('同一门课多条周次合成一条', plan.courses.length, 1)
  const course = plan.courses[0]
  eq('合并后起点第1周', course.startDate, '2026-09-08')
  eq('合并后终点第4周', course.endDate, '2026-09-29')
  ok('合并后第3周仍上课', hits(course, '2026-09-22'))
}

// ---------- 12. 坏课跳过不炸整次导入 ----------
section('单门课映射失败只跳过 + warning')
{
  const plan = makePlan([
    { name: '正常课', day: 1, startSection: 1, endSection: 2, weeks: [1] },
    { name: '坏星期课', day: 9, startSection: 1, endSection: 2, weeks: [1] },
    { day: 1, startSection: 1, endSection: 2, weeks: [1] },
    { name: '没周次课', day: 1, startSection: 1, endSection: 2, weeks: [] },
    { name: '没开始节次课', day: 1, endSection: 2, weeks: [1] }
  ])
  eq('只保留正常课', plan.courses.length, 1)
  eq('正常课名', plan.courses[0].name, '正常课')
  hasWarning('跳过数量有 warning', plan.warnings, '跳过 4 门')
}

// ---------- 13. 空输入报错 ----------
section('非法输入抛出中文 Error')
{
  await expectThrow('courses 为空数组', () => buildImportPlan({ schoolName: '示例大学', courses: [], timeSlots, config: baseConfig }), 'courses')
  await expectThrow('courses 不是数组', () => buildImportPlan({ schoolName: '示例大学', courses: 'oops', timeSlots, config: baseConfig }), 'courses')
  await expectThrow('缺少整个输入', () => buildImportPlan(), 'courses')
  await expectThrow('saveImportedTable 空计划', () => saveImportedTable({ semester: { name: '示例大学 2026-09-07' }, courses: [] }), '课程')
}

// ---------- 14. 落库 + 幂等 + 节次同步 ----------
section('落库（saveImportedTable）与重复导入幂等')
{
  const importPlan = makePlan([
    { name: '高等数学', teacher: '张老师', position: 'A101', day: 1, startSection: 1, endSection: 2, weeks: [1, 2, 3, 4], credit: 4 },
    { name: '大学英语', teacher: '李老师', position: 'B202', day: 3, startSection: 3, endSection: 4, weeks: [1, 3, 5] },
    { name: '体育', teacher: '王老师', position: '操场', day: 6, startSection: 7, endSection: 8, weeks: [1, 2, 3, 4, 5, 6, 7, 8] }
  ])
  console.log(`   ↳ 计划：${importPlan.courses.length} 条课 / ${importPlan.periods.length} 节 / ${importPlan.warnings.length} 条提示`)
  eq('计划课程条数（1 段 + 1 段隔周 + 1 段）', importPlan.courses.length, 3)

  const first = await saveImportedTable(importPlan)
  const second = await saveImportedTable(importPlan)
  const semesters = await db.listSemesters()
  const courses = await db.listCourses()

  eq('首次写入课程数', first.courses, importPlan.courses.length)
  eq('第二次重复导入课程数', second.courses, importPlan.courses.length)
  eq('库内学期数', semesters.length, 1)
  eq('库内课程数（不翻倍）', courses.length, importPlan.courses.length)
  console.log(`   ↳ 幂等：首次写 ${first.courses} 条 → 再导一次仍 ${courses.length} 条（学期 ${semesters.length} 个）`)
  eq('当前学期已切换', await db.getCurrentSemesterId(), first.semesterId)
  eq('第二次复用了同一学期', second.semesterId, first.semesterId)
  ok('课程都挂在该学期下', courses.every((c) => c.semesterId === first.semesterId))
  eq('学期名', semesters[0].name, '示例大学 2026-09-07')
  eq('学期 startDate', semesters[0].startDate, '2026-09-07')

  const user = await db.getUser()
  eq('节次表同步为计划里的节数', user.periods.length, importPlan.periods.length)
  eq('节次表第1节开始时间', user.periods[0].start, '08:00')

  // 从库里读回来的课，hitDate 也得正常（单双周没在落库过程中丢）
  const math = courses.find((c) => c.name === '高等数学')
  const english = courses.find((c) => c.name === '大学英语')
  ok('库内高等数学 第2周周一上课', hits(math, '2026-09-14'))
  ok('库内高等数学 第9周周一不上', !hits(math, '2026-11-02'))
  ok('库内大学英语 第3周周三上课（隔周）', hits(english, '2026-09-23'))
  ok('库内大学英语 第2周周三不上（隔周）', !hits(english, '2026-09-16'))

  // 同名学期再导入不同内容 → 替换而非累加
  const replacedPlan = makePlan([{ name: '替换课', day: 2, startSection: 1, endSection: 1, weeks: [2] }])
  const third = await saveImportedTable(replacedPlan)
  const afterReplace = await db.listCourses()
  eq('同学期再导入课程数', third.courses, 1)
  eq('库内课程数被替换为 1', afterReplace.length, 1)
  eq('学期数仍为 1', (await db.listSemesters()).length, 1)

  // syncPeriods:false 不动全局节次表，但课照样写
  await db.updateUser({ periods: [{ index: 1, start: '07:00', end: '07:45' }] })
  const thirdPlan = makePlan([{ name: '不同步节次课', day: 4, startSection: 1, endSection: 1, weeks: [3] }])
  const fourth = await saveImportedTable(thirdPlan, { syncPeriods: false })
  const userAfter = await db.getUser()
  eq('syncPeriods:false 保留原节次表', userAfter.periods.length, 1)
  eq('syncPeriods:false 课程照写', fourth.courses, 1)
  eq('写入后当前学期仍指向该学期', await db.getCurrentSemesterId(), fourth.semesterId)
}

// ---------- 汇总 ----------
console.log('')
if (failed) {
  console.log(`FAILED：${failed}/${total} 项未通过`)
  process.exitCode = 1
} else {
  console.log(`ALL PASS（${total} 项断言全部通过）`)
}
