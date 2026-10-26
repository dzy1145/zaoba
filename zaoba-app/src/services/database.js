const DB_NAME = 'zaoba'
const DB_PATH = '_doc/zaoba.db'
const H5_STORAGE_PREFIX = 'zaoba_'

// 课程色板（8 色，中等深度，白字可读）—— 与原版小程序一致
export const COURSE_COLORS = [
  '#4F7CD4', '#3FA7C4', '#43A98B', '#E0993F',
  '#E05E4F', '#A072D6', '#D65A95', '#7A8B9C'
]

// 每个基础色对应的同色系渐变（浅 → 深，135deg），用于课程卡片
export const COURSE_GRADIENTS = {
  '#4F7CD4': 'linear-gradient(135deg, #7DA0E8 0%, #4F7CD4 100%)',
  '#3FA7C4': 'linear-gradient(135deg, #6BC4DC 0%, #3FA7C4 100%)',
  '#43A98B': 'linear-gradient(135deg, #6FC4AB 0%, #43A98B 100%)',
  '#E0993F': 'linear-gradient(135deg, #EFB86F 0%, #E0993F 100%)',
  '#E05E4F': 'linear-gradient(135deg, #EE8478 0%, #E05E4F 100%)',
  '#A072D6': 'linear-gradient(135deg, #BC9BE4 0%, #A072D6 100%)',
  '#D65A95': 'linear-gradient(135deg, #E582B0 0%, #D65A95 100%)',
  '#7A8B9C': 'linear-gradient(135deg, #9AA8B6 0%, #7A8B9C 100%)'
}

export function courseGradient(color) {
  return COURSE_GRADIENTS[color] || COURSE_GRADIENTS[COURSE_COLORS[0]]
}

// 默认节次表（12节）—— 与小程序 utils/db.js 的 defaultPeriods() 逐条一致：
// 上午 5 节 / 下午 4 节 / 晚上 3 节，校方统一作息。别自己另编一套时间。
export const DEFAULT_PERIODS = [
  { index: 1, start: '08:00', end: '08:45' },
  { index: 2, start: '08:50', end: '09:35' },
  { index: 3, start: '09:50', end: '10:35' },
  { index: 4, start: '10:40', end: '11:25' },
  { index: 5, start: '11:30', end: '12:15' },
  { index: 6, start: '13:45', end: '14:30' },
  { index: 7, start: '14:35', end: '15:20' },
  { index: 8, start: '15:35', end: '16:20' },
  { index: 9, start: '16:25', end: '17:10' },
  { index: 10, start: '18:30', end: '19:15' },
  { index: 11, start: '19:25', end: '20:10' },
  { index: 12, start: '20:20', end: '21:05' }
]

// 主题取值（导入时要按小程序的取值范围校验，坏值不落库）
const THEME_MODES = ['light', 'dark', 'auto']
const ACCENTS = ['blue', 'green', 'purple', 'orange']
const ROW_H_MIN = 80
const ROW_H_MAX = 200
const DAY_W_MIN = 92
const DAY_W_MAX = 213

let databaseReady

function isAppPlatform() {
  if (typeof uni === 'undefined') return false
  const platform = uni.getSystemInfoSync().platform
  return platform === 'android' || platform === 'ios'
}

function isAppRuntime() {
  return typeof plus !== 'undefined' && plus.sqlite
}

function waitForAppRuntime(attempt = 0) {
  if (isAppRuntime()) return Promise.resolve()
  if (attempt >= 30) return Promise.reject(new Error('App runtime did not become ready'))
  return new Promise((resolve) => setTimeout(resolve, 100)).then(() => waitForAppRuntime(attempt + 1))
}

function requireUni() {
  if (typeof uni === 'undefined') {
    throw new Error('uni runtime is unavailable')
  }
  return uni
}

function toSql(value) {
  if (value === null || value === undefined) return 'NULL'
  if (typeof value === 'number') return String(value)
  return `'${String(value).replace(/'/g, "''")}'`
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// ---------- 导入用的取值校验（小程序的 export 是人手粘来粘去的 JSON，
// 字段可能缺、可能是字符串，坏值直接写库会让课表画不出来） ----------

function toInt(value, fallback) {
  const n = Number(value)
  return Number.isFinite(n) ? Math.round(n) : fallback
}

function clampInt(value, min, max, fallback) {
  const n = toInt(value, null)
  if (n === null) return fallback
  return Math.min(max, Math.max(min, n))
}

// 时间戳：来源的 createdAt 可能是 null / 字符串 / 秒级，取不到就用兜底值
function toTimestamp(value, fallback) {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return fallback
  // 秒级（10 位）按秒还原，避免列表排序被排到 1970 年
  return n < 1e12 ? Math.round(n * 1000) : Math.round(n)
}

function normalizeText(value, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

// 只留合法 hex 颜色，其余回落到第一个色板色
function normalizeColor(value) {
  const s = String(value || '').trim()
  return /^#[0-9a-fA-F]{6}$/.test(s) ? s : COURSE_COLORS[0]
}

// 节次表：逐条校验时间格式，非法的丢掉；index 有就用、没有就顺排
function normalizePeriods(list) {
  if (!Array.isArray(list) || !list.length) return null
  const timeRe = /^([01]?\d|2[0-3]):[0-5]\d$/
  const out = []
  for (const p of list) {
    if (!p || typeof p !== 'object') continue
    const start = normalizeText(p.start)
    const end = normalizeText(p.end)
    if (!timeRe.test(start) || !timeRe.test(end)) continue
    const index = toInt(p.index, out.length + 1)
    out.push({ index: index > 0 ? index : out.length + 1, start, end })
  }
  return out.length ? out : null
}

function isDateString(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

// ========== SQLite 操作 ==========

function openSqlite() {
  if (typeof plus === 'undefined' || !plus.sqlite) {
    return Promise.reject(new Error('SQLite is only available in the App runtime'))
  }

  return new Promise((resolve, reject) => {
    const isOpen = plus.sqlite.isOpenDatabase({
      name: DB_NAME,
      path: DB_PATH
    })

    if (isOpen) {
      resolve()
      return
    }

    plus.sqlite.openDatabase({
      name: DB_NAME,
      path: DB_PATH,
      success: resolve,
      fail: reject
    })
  })
}

function executeSql(sql) {
  return new Promise((resolve, reject) => {
    plus.sqlite.executeSql({
      name: DB_NAME,
      sql,
      success: resolve,
      fail: reject
    })
  })
}

function selectSql(sql) {
  return new Promise((resolve, reject) => {
    plus.sqlite.selectSql({
      name: DB_NAME,
      sql,
      success: resolve,
      fail: reject
    })
  })
}

// ========== H5 存储操作 ==========

function readH5Storage(key) {
  const fullKey = H5_STORAGE_PREFIX + key
  const value = requireUni().getStorageSync(fullKey)
  return value || null
}

function writeH5Storage(key, value) {
  const fullKey = H5_STORAGE_PREFIX + key
  requireUni().setStorageSync(fullKey, value)
}

// ========== 数据库初始化 ==========

export function initDatabase() {
  if (databaseReady) return databaseReady

  databaseReady = (async () => {
    if (isAppPlatform() && !isAppRuntime()) {
      await waitForAppRuntime()
    }

    if (!isAppRuntime()) {
      // H5 模式：初始化 localStorage
      if (!readH5Storage('users')) {
        writeH5Storage('users', {
          id: 1,
          nickname: '同学',
          periods: DEFAULT_PERIODS,
          themeMode: 'auto',
          accent: 'blue',
          rowH: 140,
          dayW: 128
        })
      }
      if (!readH5Storage('semesters')) {
        writeH5Storage('semesters', [])
      }
      if (!readH5Storage('courses')) {
        writeH5Storage('courses', [])
      }
      return
    }

    // App 模式：初始化 SQLite
    await openSqlite()

    // 创建用户表（本地单用户，只有一条记录）
    await executeSql(`
      CREATE TABLE IF NOT EXISTS kb_users (
        id INTEGER PRIMARY KEY,
        nickname TEXT DEFAULT '同学',
        periods TEXT,
        theme_mode TEXT DEFAULT 'auto',
        accent TEXT DEFAULT 'blue',
        grid_row_h INTEGER DEFAULT 140,
        grid_day_w INTEGER DEFAULT 128,
        current_semester_id TEXT,
        created_at INTEGER
      )
    `)

    // 兼容旧库：补上后加的列（列已存在会报错，忽略即可）
    await executeSql('ALTER TABLE kb_users ADD COLUMN grid_row_h INTEGER DEFAULT 140').catch(() => {})
    await executeSql('ALTER TABLE kb_users ADD COLUMN grid_day_w INTEGER DEFAULT 128').catch(() => {})
    await executeSql('ALTER TABLE kb_users ADD COLUMN current_semester_id TEXT').catch(() => {})

    // 创建学期表
    await executeSql(`
      CREATE TABLE IF NOT EXISTS kb_semesters (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        start_date TEXT,
        created_at INTEGER,
        sort_order INTEGER DEFAULT 0
      )
    `)

    // 创建课程表
    await executeSql(`
      CREATE TABLE IF NOT EXISTS kb_courses (
        id TEXT PRIMARY KEY,
        semester_id TEXT NOT NULL,
        name TEXT NOT NULL,
        teacher TEXT,
        location TEXT,
        day INTEGER NOT NULL,
        start_period INTEGER NOT NULL,
        end_period INTEGER NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT,
        week_type TEXT DEFAULT 'every',
        need_pc INTEGER DEFAULT 0,
        color TEXT NOT NULL,
        created_at INTEGER,
        FOREIGN KEY (semester_id) REFERENCES kb_semesters(id) ON DELETE CASCADE
      )
    `)

    // 创建索引
    await executeSql('CREATE INDEX IF NOT EXISTS idx_courses_semester ON kb_courses(semester_id)')
    await executeSql('CREATE INDEX IF NOT EXISTS idx_courses_date ON kb_courses(start_date, end_date)')
    await executeSql('CREATE INDEX IF NOT EXISTS idx_courses_day ON kb_courses(day)')

    // 初始化用户记录
    const users = await selectSql('SELECT * FROM kb_users WHERE id = 1')
    if (!users || users.length === 0) {
      await executeSql(`
        INSERT INTO kb_users (id, nickname, periods, theme_mode, accent, created_at)
        VALUES (1, '同学', ${toSql(JSON.stringify(DEFAULT_PERIODS))}, 'auto', 'blue', ${Date.now()})
      `)
    }
  })()
    .catch((error) => {
      console.error('Database initialization failed:', error)
      databaseReady = undefined
      throw error
    })

  return databaseReady
}

// ========== 用户设置 ==========

export async function getUser() {
  await initDatabase()

  if (!isAppRuntime()) {
    const stored = readH5Storage('users') || {}
    return { ...stored, currentSemesterId: stored.currentSemesterId || null }
  }

  const rows = await selectSql('SELECT * FROM kb_users WHERE id = 1')
  if (!rows || rows.length === 0) {
    return {
      id: 1,
      nickname: '同学',
      periods: DEFAULT_PERIODS,
      themeMode: 'auto',
      accent: 'blue',
      currentSemesterId: null
    }
  }

  const row = rows[0]
  return {
    id: row.id,
    nickname: row.nickname || '同学',
    periods: row.periods ? JSON.parse(row.periods) : DEFAULT_PERIODS,
    themeMode: row.theme_mode || 'auto',
    accent: row.accent || 'blue',
    rowH: row.grid_row_h || 140,
    dayW: row.grid_day_w || 128,
    // 当前学期：和小程序 globalData.currentSemesterId + storage 同义，跨 Tab 共用一份
    currentSemesterId: row.current_semester_id || null
  }
}

export async function updateUser(fields) {
  await initDatabase()

  if (!isAppRuntime()) {
    const user = readH5Storage('users')
    const updated = { ...user, ...fields }
    // periods 需要特殊处理（保持数组格式）
    if (fields.periods) {
      updated.periods = fields.periods
    }
    writeH5Storage('users', updated)
    return updated
  }

  const setParts = []
  if (fields.nickname !== undefined) setParts.push(`nickname = ${toSql(fields.nickname)}`)
  if (fields.periods !== undefined) setParts.push(`periods = ${toSql(JSON.stringify(fields.periods))}`)
  if (fields.themeMode !== undefined) setParts.push(`theme_mode = ${toSql(fields.themeMode)}`)
  if (fields.accent !== undefined) setParts.push(`accent = ${toSql(fields.accent)}`)
  if (fields.rowH !== undefined) setParts.push(`grid_row_h = ${toSql(fields.rowH)}`)
  if (fields.dayW !== undefined) setParts.push(`grid_day_w = ${toSql(fields.dayW)}`)
  if (fields.currentSemesterId !== undefined) {
    setParts.push(`current_semester_id = ${toSql(fields.currentSemesterId || null)}`)
  }

  if (setParts.length > 0) {
    await executeSql(`UPDATE kb_users SET ${setParts.join(', ')} WHERE id = 1`)
  }

  return getUser()
}

// ========== 当前学期 ==========

// 当前学期 id 存进 kb_users（对应小程序的 globalData.currentSemesterId + storage）。
// 两个 Tab 以前各自在 data 里存一份：在「我的」切学期课表页不跟着变，
// 覆盖导入后课表页还会拿着已被删掉的旧学期 → 一片空白。统一到这里。

export async function getCurrentSemesterId() {
  const user = await getUser()
  return user.currentSemesterId || null
}

export async function setCurrentSemesterId(id) {
  await updateUser({ currentSemesterId: id || null })
  return id || null
}

// 解析出真正可用的当前学期：存下的 id 不在了就退回第一个（同小程序 loadAll），
// 顺手把纠正后的结果写回库，下次进来就一致了。
export async function getCurrentSemester() {
  const semesters = await listSemesters()
  const stored = await getCurrentSemesterId()
  let current = semesters.find(s => s.id === stored) || null
  if (!current && semesters.length) current = semesters[0]
  const resolved = current ? current.id : null
  if (resolved !== (stored || null)) await setCurrentSemesterId(resolved)
  return current
}

// ========== 学期管理 ==========

export async function listSemesters() {
  await initDatabase()

  if (!isAppRuntime()) {
    const list = readH5Storage('semesters') || []
    // 与小程序的 listSemesters 一致：按创建时间升序（最早的学期排最前）
    return list.slice().sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
  }

  const rows = await selectSql('SELECT * FROM kb_semesters ORDER BY COALESCE(created_at, 0) ASC')
  return (rows || []).map(row => ({
    id: row.id,
    name: row.name,
    startDate: row.start_date,
    createdAt: row.created_at,
    sortOrder: row.sort_order || 0
  }))
}

export async function getSemester(id) {
  await initDatabase()

  if (!isAppRuntime()) {
    const semesters = readH5Storage('semesters') || []
    return semesters.find(s => s.id === id) || null
  }

  const rows = await selectSql(`SELECT * FROM kb_semesters WHERE id = ${toSql(id)}`)
  if (!rows || rows.length === 0) return null

  const row = rows[0]
  return {
    id: row.id,
    name: row.name,
    startDate: row.start_date,
    createdAt: row.created_at,
    sortOrder: row.sort_order || 0
  }
}

export async function createSemester(data) {
  await initDatabase()

  const id = data.id || generateId()
  const now = Date.now()
  // 导入时保留来源的创建时间：小程序的学期列表是 createdAt 升序，
  // 全按导入那一刻写会让顺序跟小程序对不上（还会让「当前学期」兜底选错）
  const createdAt = toTimestamp(data.createdAt, now)

  const semester = {
    id,
    name: data.name,
    startDate: data.startDate || null,
    createdAt,
    sortOrder: data.sortOrder || 0
  }

  if (!isAppRuntime()) {
    const semesters = readH5Storage('semesters') || []
    semesters.push(semester)
    writeH5Storage('semesters', semesters)
    return semester
  }

  await executeSql(`
    INSERT INTO kb_semesters (id, name, start_date, created_at, sort_order)
    VALUES (${toSql(id)}, ${toSql(data.name)}, ${toSql(data.startDate || null)}, ${createdAt}, ${data.sortOrder || 0})
  `)

  return semester
}

export async function updateSemester(id, data) {
  await initDatabase()

  if (!isAppRuntime()) {
    const semesters = readH5Storage('semesters') || []
    const index = semesters.findIndex(s => s.id === id)
    if (index === -1) return null

    semesters[index] = { ...semesters[index], ...data }
    writeH5Storage('semesters', semesters)
    return semesters[index]
  }

  const setParts = []
  if (data.name !== undefined) setParts.push(`name = ${toSql(data.name)}`)
  if (data.startDate !== undefined) setParts.push(`start_date = ${toSql(data.startDate)}`)
  if (data.sortOrder !== undefined) setParts.push(`sort_order = ${data.sortOrder}`)

  if (setParts.length > 0) {
    await executeSql(`UPDATE kb_semesters SET ${setParts.join(', ')} WHERE id = ${toSql(id)}`)
  }

  return getSemester(id)
}

export async function deleteSemester(id) {
  await initDatabase()

  if (!isAppRuntime()) {
    const semesters = readH5Storage('semesters') || []
    writeH5Storage('semesters', semesters.filter(s => s.id !== id))

    // 同时删除该学期的所有课程
    const courses = readH5Storage('courses') || []
    writeH5Storage('courses', courses.filter(c => c.semesterId !== id))
  } else {
    // 别只依赖外键级联（见 wipeAll 的说明）：显式删掉这个学期的课
    await executeSql(`DELETE FROM kb_courses WHERE semester_id = ${toSql(id)}`)
    await executeSql(`DELETE FROM kb_semesters WHERE id = ${toSql(id)}`)
  }

  // 删掉的正好是当前学期，就把当前学期清空，交给 getCurrentSemester 兜底
  if ((await getCurrentSemesterId()) === id) await setCurrentSemesterId(null)
}

// ========== 课程管理 ==========

export async function listCourses(semesterId) {
  await initDatabase()

  if (!isAppRuntime()) {
    const courses = readH5Storage('courses') || []
    return semesterId ? courses.filter(c => c.semesterId === semesterId) : courses
  }

  const condition = semesterId ? `WHERE semester_id = ${toSql(semesterId)}` : ''
  const rows = await selectSql(`SELECT * FROM kb_courses ${condition} ORDER BY day, start_period`)
  return (rows || []).map(row => ({
    id: row.id,
    semesterId: row.semester_id,
    name: row.name,
    teacher: row.teacher || '',
    location: row.location || '',
    day: row.day,
    startPeriod: row.start_period,
    endPeriod: row.end_period,
    startDate: row.start_date,
    endDate: row.end_date || null,
    weekType: row.week_type || 'every',
    needPc: Boolean(row.need_pc),
    color: row.color,
    createdAt: row.created_at
  }))
}

export async function getCourse(id) {
  await initDatabase()

  if (!isAppRuntime()) {
    const courses = readH5Storage('courses') || []
    return courses.find(c => c.id === id) || null
  }

  const rows = await selectSql(`SELECT * FROM kb_courses WHERE id = ${toSql(id)}`)
  if (!rows || rows.length === 0) return null

  const row = rows[0]
  return {
    id: row.id,
    semesterId: row.semester_id,
    name: row.name,
    teacher: row.teacher || '',
    location: row.location || '',
    day: row.day,
    startPeriod: row.start_period,
    endPeriod: row.end_period,
    startDate: row.start_date,
    endDate: row.end_date || null,
    weekType: row.week_type || 'every',
    needPc: Boolean(row.need_pc),
    color: row.color,
    createdAt: row.created_at
  }
}

export async function createCourse(data) {
  await initDatabase()

  const id = data.id || generateId()
  const now = Date.now()

  const course = {
    id,
    semesterId: data.semesterId,
    name: data.name,
    teacher: data.teacher || '',
    location: data.location || '',
    day: data.day,
    startPeriod: data.startPeriod,
    endPeriod: data.endPeriod,
    startDate: data.startDate,
    endDate: data.endDate || null,
    weekType: data.weekType || 'every',
    needPc: Boolean(data.needPc),
    color: data.color,
    createdAt: now
  }

  if (!isAppRuntime()) {
    const courses = readH5Storage('courses') || []
    courses.push(course)
    writeH5Storage('courses', courses)
    return course
  }

  await executeSql(`
    INSERT INTO kb_courses (
      id, semester_id, name, teacher, location,
      day, start_period, end_period, start_date, end_date,
      week_type, need_pc, color, created_at
    ) VALUES (
      ${toSql(id)}, ${toSql(data.semesterId)}, ${toSql(data.name)}, ${toSql(data.teacher)}, ${toSql(data.location)},
      ${data.day}, ${data.startPeriod}, ${data.endPeriod}, ${toSql(data.startDate)}, ${toSql(data.endDate)},
      ${toSql(data.weekType || 'every')}, ${data.needPc ? 1 : 0}, ${toSql(data.color)}, ${now}
    )
  `)

  return course
}

export async function updateCourse(id, data) {
  await initDatabase()

  if (!isAppRuntime()) {
    const courses = readH5Storage('courses') || []
    const index = courses.findIndex(c => c.id === id)
    if (index === -1) return null

    courses[index] = { ...courses[index], ...data }
    writeH5Storage('courses', courses)
    return courses[index]
  }

  const setParts = []
  if (data.name !== undefined) setParts.push(`name = ${toSql(data.name)}`)
  if (data.teacher !== undefined) setParts.push(`teacher = ${toSql(data.teacher)}`)
  if (data.location !== undefined) setParts.push(`location = ${toSql(data.location)}`)
  if (data.day !== undefined) setParts.push(`day = ${data.day}`)
  if (data.startPeriod !== undefined) setParts.push(`start_period = ${data.startPeriod}`)
  if (data.endPeriod !== undefined) setParts.push(`end_period = ${data.endPeriod}`)
  if (data.startDate !== undefined) setParts.push(`start_date = ${toSql(data.startDate)}`)
  if (data.endDate !== undefined) setParts.push(`end_date = ${toSql(data.endDate)}`)
  if (data.weekType !== undefined) setParts.push(`week_type = ${toSql(data.weekType)}`)
  if (data.needPc !== undefined) setParts.push(`need_pc = ${data.needPc ? 1 : 0}`)
  if (data.color !== undefined) setParts.push(`color = ${toSql(data.color)}`)

  if (setParts.length > 0) {
    await executeSql(`UPDATE kb_courses SET ${setParts.join(', ')} WHERE id = ${toSql(id)}`)
  }

  return getCourse(id)
}

export async function deleteCourse(id) {
  await initDatabase()

  if (!isAppRuntime()) {
    const courses = readH5Storage('courses') || []
    const filtered = courses.filter(c => c.id !== id)
    writeH5Storage('courses', filtered)
    return
  }

  await executeSql(`DELETE FROM kb_courses WHERE id = ${toSql(id)}`)
}

// ========== 批量操作 ==========

export async function batchInsertCourses(courses) {
  await initDatabase()

  for (const data of courses) {
    await createCourse(data)
  }
}

export async function clearSemesterCourses(semesterId) {
  await initDatabase()

  if (!isAppRuntime()) {
    const courses = readH5Storage('courses') || []
    const filtered = courses.filter(c => c.semesterId !== semesterId)
    writeH5Storage('courses', filtered)
    return
  }

  await executeSql(`DELETE FROM kb_courses WHERE semester_id = ${toSql(semesterId)}`)
}

// ========== 导入导出 ==========
//
// 契约见 早八-项目记忆.md「八、导入导出格式」，实现要跟小程序 utils/db.js 的
// importAll 对齐：覆盖时先清空、用户设置按项覆盖、学期/课程 id 重新映射、
// 最后恢复「当前学期」。这里比小程序多一个「追加」模式（APK 没云同步，搬数据更灵活）。

// 覆盖导入前清库。必须显式删课程，不能只删学期指望 ON DELETE CASCADE ——
// plus.sqlite 不保证开着 PRAGMA foreign_keys（换基座/老库都可能关着），级联一旦不触发，
// 课程就变成孤儿留在库里；而导入沿用来源 id，下次再导同一份导出时课程主键全撞车 → 整个导入报错。
async function wipeAll() {
  if (!isAppRuntime()) {
    writeH5Storage('courses', [])
    writeH5Storage('semesters', [])
    await setCurrentSemesterId(null)
    return
  }

  await executeSql('DELETE FROM kb_courses')
  await executeSql('DELETE FROM kb_semesters')
  await setCurrentSemesterId(null)
}

// 用户设置逐项校验后再写：坏值/空值一律不覆盖现状（照小程序：只覆盖真值）
async function importUserFields(user) {
  if (!user || typeof user !== 'object') return

  const fields = {}
  const nickname = normalizeText(user.nickname).trim()
  if (nickname) fields.nickname = nickname

  const periods = normalizePeriods(user.periods)
  if (periods) fields.periods = periods

  if (THEME_MODES.includes(user.themeMode)) fields.themeMode = user.themeMode
  if (ACCENTS.includes(user.accent)) fields.accent = user.accent

  const rowH = toInt(user.rowH, null)
  if (rowH !== null && rowH >= ROW_H_MIN && rowH <= ROW_H_MAX) fields.rowH = rowH

  const dayW = toInt(user.dayW, null)
  if (dayW !== null && dayW >= DAY_W_MIN && dayW <= DAY_W_MAX) fields.dayW = dayW

  if (Object.keys(fields).length) await updateUser(fields)
}

export async function exportAll() {
  await initDatabase()

  const user = await getUser()
  const semesters = await listSemesters()
  const courses = await listCourses()
  // 导出的是「用户此刻正在看的那个学期」，不是列表第一个
  const current = await getCurrentSemester()

  return {
    version: '1.0',
    exportTime: Date.now(),
    app: '早八',
    user: {
      nickname: user.nickname,
      periods: user.periods,
      themeMode: user.themeMode,
      accent: user.accent,
      rowH: user.rowH,
      dayW: user.dayW
    },
    semesters,
    courses,
    currentSemesterId: current ? current.id : null
  }
}

export async function importAll(data, mode = 'overwrite') {
  await initDatabase()

  // 校验格式（和小程序一样按数组校验，光有字段也可能是个坏 JSON）
  if (!data || !data.version || !Array.isArray(data.semesters) || !Array.isArray(data.courses)) {
    throw new Error('数据格式错误')
  }

  const overwrite = mode !== 'append'
  const baseTime = Date.now()
  const stats = { semesters: 0, courses: 0, skipped: 0 }

  if (overwrite) await wipeAll()

  await importUserFields(data.user)

  const user = await getUser()
  const periodCount = Math.max(1, (user.periods || DEFAULT_PERIODS).length)

  // 学期：覆盖模式沿用来源 id（库刚清空，重导同一份数据结果一致）；
  // 追加模式一律发新 id —— 同小程序云端 add 出来的都是新文档，不会因 id 撞车悄悄丢学期。
  // 用无原型对象当映射表：来源 id 撞上 'toString' / 'constructor' 这类键也不会误判成已存在。
  const idMap = Object.create(null)
  let seq = 0

  for (const raw of data.semesters) {
    if (!raw || typeof raw.name !== 'string' || !raw.name.trim()) {
      stats.skipped++
      continue
    }

    const srcId = normalizeText(raw.id)
    let id = overwrite && srcId && !(srcId in idMap) ? srcId : generateId()
    const payload = {
      id,
      name: raw.name.trim(),
      startDate: isDateString(raw.startDate) ? raw.startDate : '',
      // 保留来源创建时间，学期列表顺序才和小程序一致
      createdAt: toTimestamp(raw.createdAt, baseTime + seq),
      sortOrder: toInt(raw.sortOrder, 0)
    }

    try {
      await createSemester(payload)
    } catch (error) {
      // 覆盖模式下来源 id 重复（同一份 JSON 里撞了）就换新 id 再插一次
      if (!overwrite) {
        stats.skipped++
        continue
      }
      payload.id = generateId()
      id = payload.id
      try {
        await createSemester(payload)
      } catch (retryError) {
        console.error('导入学期失败', raw.name, retryError)
        stats.skipped++
        continue
      }
    }

    if (srcId && !(srcId in idMap)) idMap[srcId] = id
    seq++
    stats.semesters++
  }

  // 课程：semesterId 跟着上面的 id 映射走，节次/星期按本地节次表夹到有效范围
  const usedIds = new Set()

  for (const raw of data.courses) {
    if (!raw || typeof raw.name !== 'string' || !raw.name.trim()) {
      stats.skipped++
      continue
    }

    // 只导入「这次真的建出来了的学期」下的课程；
    // 引用不到任何学期的课在本地永远画不出来，收进来只会变成幽灵行
    const semesterId = idMap[normalizeText(raw.semesterId)] || ''
    if (!semesterId) {
      stats.skipped++
      continue
    }

    const day = clampInt(raw.day, 0, 6, 0)
    const startPeriod = clampInt(raw.startPeriod, 1, periodCount, 1)
    const endPeriod = clampInt(raw.endPeriod, startPeriod, periodCount, startPeriod)

    let startDate = isDateString(raw.startDate) ? raw.startDate : ''
    // 原版对没有开始日期的课直接隐藏（未迁移的旧周数制数据），这里保持同样的语义：
    // 不替它编一个日期，否则同一门课会「小程序里没有、APK 里冒出来」
    let endDate = isDateString(raw.endDate) ? raw.endDate : null
    if (endDate && startDate && endDate < startDate) endDate = null

    let id = ''
    if (overwrite && typeof raw.id === 'string' && raw.id && !usedIds.has(raw.id)) id = raw.id
    if (!id) id = generateId()
    usedIds.add(id)

    try {
      await createCourse({
        id,
        semesterId,
        name: raw.name.trim(),
        teacher: normalizeText(raw.teacher),
        location: normalizeText(raw.location),
        day,
        startPeriod,
        endPeriod,
        startDate,
        endDate,
        weekType: raw.weekType === 'everyOther' ? 'everyOther' : 'every',
        needPc: Boolean(raw.needPc),
        color: normalizeColor(raw.color)
      })
      stats.courses++
    } catch (error) {
      // 单门课坏掉不该让整次导入白跑
      console.error('导入课程失败', raw.name, error)
      stats.skipped++
    }
  }

  // 当前学期：来源指定了就用它；没有/对不上就退回第一个学期，
  // 别让课表页拿着一个已经不在库里的 id（那会是一片空白）
  const preferred = idMap[normalizeText(data.currentSemesterId)] || null
  if (preferred) await setCurrentSemesterId(preferred)
  const current = await getCurrentSemester()
  stats.currentSemesterId = current ? current.id : null

  return stats
}
