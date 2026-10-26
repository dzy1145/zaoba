// 日期和周次换算工具函数

// ========== 基础日期函数 ==========

/**
 * Date 对象转 'YYYY-MM-DD' 字符串
 */
export function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 'YYYY-MM-DD' 字符串转 Date 对象
 */
export function parseDate(str) {
  if (!str) return null
  const [year, month, day] = str.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * 日期加减天数
 */
export function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * 获取某日期所在周的周一
 */
export function weekMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day // 周日算作上周
  return addDays(d, diff)
}

/**
 * 格式化周范围 '9/2 – 9/8'
 */
export function formatWeekRange(monday) {
  const sunday = addDays(monday, 6)
  const startMonth = monday.getMonth() + 1
  const startDay = monday.getDate()
  const endMonth = sunday.getMonth() + 1
  const endDay = sunday.getDate()

  if (startMonth === endMonth) {
    return `${startMonth}/${startDay} – ${endDay}`
  }
  return `${startMonth}/${startDay} – ${endMonth}/${endDay}`
}

/**
 * 判断两个日期是否是同一天
 */
export function isSameDay(date1, date2) {
  if (!date1 || !date2) return false
  return formatDate(date1) === formatDate(date2)
}

/**
 * 获取今天的 Date 对象（时间设为 00:00:00）
 */
export function getToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

// ========== 周次换算 ==========

/**
 * 计算某日期是学期的第几周
 * @param {string} semesterStart - 学期开始日期 'YYYY-MM-DD'（第1周周一）
 * @param {Date} date - 要查询的日期
 * @returns {number} 周次（从1开始），如果在开学前则返回0
 */
export function weekIndexOf(semesterStart, date) {
  if (!semesterStart || !date) return 0

  const start = parseDate(semesterStart)
  if (!start) return 0

  const startMonday = weekMonday(start)
  const targetMonday = weekMonday(date)

  const diffMs = targetMonday - startMonday
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const weekIndex = Math.floor(diffDays / 7) + 1

  return weekIndex > 0 ? weekIndex : 0
}

/**
 * 计算学期第N周星期X的日期
 * @param {string} semesterStart - 学期开始日期 'YYYY-MM-DD'
 * @param {number} week - 周次（1开始）
 * @param {number} dayIndex - 星期几（0=周一, 6=周日）
 * @returns {Date} 对应的日期
 */
export function dateOfWeek(semesterStart, week, dayIndex) {
  if (!semesterStart || week < 1) return null

  const start = parseDate(semesterStart)
  if (!start) return null

  const startMonday = weekMonday(start)
  const targetMonday = addDays(startMonday, (week - 1) * 7)
  return addDays(targetMonday, dayIndex)
}

/**
 * 周次录入转换为日期制
 * @param {string} semesterStart - 学期开始日期
 * @param {number} startWeek - 开始周次
 * @param {number} endWeek - 结束周次（null表示一直上）
 * @param {number} dayIndex - 星期几（0-6）
 * @param {string} weekType - 'every' | 'everyOther'
 * @returns {object} { startDate, endDate, weekType }
 */
export function scheduleFromWeeks(semesterStart, startWeek, endWeek, dayIndex, weekType = 'every') {
  const startDate = dateOfWeek(semesterStart, startWeek, dayIndex)
  const endDate = endWeek ? dateOfWeek(semesterStart, endWeek, dayIndex) : null

  return {
    startDate: formatDate(startDate),
    endDate: endDate ? formatDate(endDate) : null,
    weekType
  }
}

/**
 * 日期制转换为周次展示
 * @param {string} semesterStart - 学期开始日期
 * @param {string} startDate - 课程开始日期
 * @param {string} endDate - 课程结束日期（null表示一直上）
 * @returns {object} { startWeek, endWeek, weekType }
 */
export function weeksFromSchedule(semesterStart, startDate, endDate) {
  const startWeek = weekIndexOf(semesterStart, parseDate(startDate))
  const endWeek = endDate ? weekIndexOf(semesterStart, parseDate(endDate)) : null

  return {
    startWeek,
    endWeek
  }
}

/**
 * 反推学期开始日期
 * @param {number} week - 当前周次
 * @param {Date} today - 今天的日期
 * @returns {string} 学期开始日期 'YYYY-MM-DD'
 */
export function semesterStartForWeek(week, today) {
  if (!week || week < 1) return formatDate(today)

  const todayMonday = weekMonday(today)
  const startMonday = addDays(todayMonday, -(week - 1) * 7)
  return formatDate(startMonday)
}

// ========== 课程匹配 ==========

/**
 * 判断某天是否上课
 * @param {object} course - 课程对象
 * @param {Date} date - 要判断的日期
 * @returns {boolean} 是否上课
 */
export function hitDate(course, date) {
  if (!course || !date) return false
  // 和原版一致：没有开始日期的旧数据先不显示（导入时会按学期第 1 周补齐）
  if (!course.startDate) return false

  const dateStr = formatDate(date)
  const startDate = course.startDate
  const endDate = course.endDate

  // 日期范围检查
  if (dateStr < startDate) return false
  if (endDate && dateStr > endDate) return false

  // 星期几检查
  const dayOfWeek = date.getDay()
  const courseDay = course.day
  // course.day: 0=周一, 6=周日
  // date.getDay(): 0=周日, 1=周一
  const targetDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  if (targetDay !== courseDay) return false

  // weekType 检查
  if (course.weekType === 'everyOther') {
    // 隔周课程：需要知道是第几周
    // 这里简化处理：假设 startDate 是第1周，判断当前日期是第几周
    const start = parseDate(startDate)
    const startMonday = weekMonday(start)
    const currentMonday = weekMonday(date)

    const diffMs = currentMonday - startMonday
    const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7))

    // 第1周上课，第2周不上，第3周上...
    return diffWeeks % 2 === 0
  }

  return true
}

/**
 * 检测课程冲突
 * @param {object} course - 要检查的课程
 * @param {array} allCourses - 所有课程列表
 * @returns {array} 冲突的课程列表
 */
export function detectConflicts(course, allCourses) {
  const conflicts = []

  for (const other of allCourses) {
    // 跳过自己
    if (course.id && other.id === course.id) continue

    // 不同学期不冲突
    if (course.semesterId !== other.semesterId) continue

    // 不同星期不冲突
    if (course.day !== other.day) continue

    // 时间段检查：两个时间段是否有重叠
    // [startPeriod, endPeriod] 和 [other.startPeriod, other.endPeriod]
    const overlap = !(
      course.endPeriod < other.startPeriod ||
      course.startPeriod > other.endPeriod
    )

    if (overlap) {
      // 进一步检查日期范围是否重叠
      const dateOverlap = !(
        (course.endDate && course.endDate < other.startDate) ||
        (other.endDate && other.endDate < course.startDate)
      )

      if (dateOverlap) {
        conflicts.push(other)
      }
    }
  }

  return conflicts
}

// ========== 实用函数 ==========

/**
 * 获取某月的天数
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

/**
 * 生成日期选项（用于日期选择器）
 */
export function generateDateOptions(startYear, endYear) {
  const years = []
  for (let y = startYear; y <= endYear; y++) {
    years.push(y)
  }

  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  return { years, months }
}

/**
 * 获取一周的所有日期
 * @param {Date} monday - 周一
 * @returns {array} 7个日期的数组
 */
export function getWeekDays(monday) {
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

/**
 * 格式化节次时间显示
 */
export function formatPeriodTime(period) {
  return `${period.start}-${period.end}`
}

/**
 * 获取课程的完整时间描述
 */
export function getCourseTimeDesc(course, periods) {
  const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const dayName = dayNames[course.day] || ''

  const startPeriod = periods.find(p => p.index === course.startPeriod)
  const endPeriod = periods.find(p => p.index === course.endPeriod)

  if (course.startPeriod === course.endPeriod) {
    return `${dayName} 第${course.startPeriod}节`
  }

  return `${dayName} 第${course.startPeriod}-${course.endPeriod}节`
}
