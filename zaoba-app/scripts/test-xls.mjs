// 用法：bash scripts/run-test-xls.sh <xls路径> [第1周周一]
import fs from 'node:fs'
import { parseXls } from './_xls.mjs'
import { inspectXlsTimetable, guessStartMonday, buildZaobaImport } from './_xlsTimetable.mjs'
import { hitDate, parseDate } from './_schedule.mjs'

const bytes = new Uint8Array(fs.readFileSync(process.argv[2]))
const workbook = parseXls(bytes)
const inspected = inspectXlsTimetable(workbook)

console.log('学期:', inspected.semesterName)
console.log('课程门数:', inspected.courseCount, '上课时段:', inspected.entries.length)
console.log('周次范围:', inspected.minWeek, '-', inspected.maxWeek)
console.log('无课表课程:', inspected.noScheduleCount, '门')
console.log('节次块:', inspected.blocks.map((b) => `${b.from}-${b.to} ${b.start}-${b.end}`).join(', '))

const startMonday = process.argv[3] || guessStartMonday(inspected.semesterName)
console.log('第 1 周周一:', startMonday)
const data = buildZaobaImport(inspected, { startMonday, syncPeriods: true })
console.log('生成课程:', data.courses.length, '条；节次:', data.user.periods.length, '节')

// 这里用 H5 存储分支跑真实的 importAll
const store = new Map()
globalThis.uni = {
  getSystemInfoSync: () => ({ platform: 'h5' }),
  getStorageSync: (key) => (store.has(key) ? store.get(key) : ''),
  setStorageSync: (key, value) => store.set(key, value)
}
const db = await import('./_database.mjs')
await db.initDatabase()

const first = await db.importAll(data, 'overwrite')
const second = await db.importAll(data, 'overwrite')
const appended = await db.importAll(data, 'append')
const semesters = await db.listSemesters()
const courses = await db.listCourses()
const current = await db.getCurrentSemester()

console.log('\nimportAll 覆盖第一次:', first)
console.log('importAll 覆盖第二次:', second)
console.log('importAll 追加:', appended)
console.log('库内学期:', semesters.length, '课程:', courses.length, '当前学期:', current && current.name)

const byName = (name) => courses.filter((c) => c.name === name)
const check = (label, actual, expected) => {
  console.log(`${actual === expected ? 'PASS' : 'FAIL'} ${label}: ${actual} (期望 ${expected})`)
  if (actual !== expected) process.exitCode = 1
}

check('追加后学期数', semesters.length, 2)
check('覆盖后当前学期课程数', courses.filter((c) => c.semesterId === current.id).length, data.courses.length)

const military = byName('军事理论').find((c) => c.semesterId === current.id)
check('军事理论 第2周周一上课', hitDate(military, parseDate('2026-09-07')), true)
check('军事理论 第3周周一不上', hitDate(military, parseDate('2026-09-14')), false)

const design = byName('视觉设计基础').filter((c) => c.semesterId === current.id)
const designDates = design.flatMap((c) => ['2026-09-15', '2026-09-22', '2026-09-29', '2026-10-06', '2026-10-20', '2026-11-03']
  .filter((d) => hitDate(c, parseDate(d))))
check('视觉设计基础上课日期', [...new Set(designDates)].sort().join(','), '2026-09-15,2026-09-22,2026-09-29,2026-10-20,2026-11-03')

const english = byName('大学英语1').find((c) => c.semesterId === current.id && c.day === 3)
check('大学英语1 第1周周四', english && hitDate(english, parseDate('2026-09-03')), true)

const user = await db.getUser()
check('节次表同步为 10 节', user.periods.length, 10)
check('第 1 节开始时间', user.periods[0].start, '08:30')
check('昵称未被覆盖', user.nickname, '同学')

console.log('\n' + (process.exitCode ? '有失败项' : '全部通过'))
