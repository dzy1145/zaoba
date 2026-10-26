<template>
  <view class="page" :class="themeClass">
    <!-- 无学期空态 -->
    <view v-if="!currentSemester" class="empty-page">
      <view class="empty-emoji">🗓️</view>
      <view class="empty-title">还没有学期</view>
      <view class="empty-desc">先到「我的」页创建一个学期，再回来排课表</view>
      <button class="btn-primary empty-btn" @tap="goMine">去建学期</button>
    </view>

    <template v-else>
      <!-- 顶部栏 -->
      <view class="topbar">
        <view class="topbar-semester" @tap="switchSemester">{{ currentSemester.name }} ▾</view>
        <view class="mini-toggle" @tap="openSizeModal">
          <text class="mini-toggle-label">尺寸</text>
        </view>
        <view class="mini-toggle" @tap="toggleTimeShow">
          <text class="mini-toggle-label">时间</text>
          <view class="time-switch" :class="{ on: showTime }"><view class="time-switch-dot"></view></view>
        </view>
        <view class="week-switch">
          <view class="week-btn" @tap="prevWeek">‹</view>
          <view class="week-label" @tap="backToToday">
            <view v-if="weekLabel" class="week-no">
              <text>{{ weekLabel }}</text>
              <text v-if="!isThisWeek" class="week-back">回今天</text>
            </view>
            <view class="week-range">{{ weekRangeText }}</view>
          </view>
          <view class="week-btn" @tap="nextWeek">›</view>
        </view>
      </view>

      <!-- 拖动时顶部的删除区 -->
      <view v-if="drag && drag.active" class="delete-bar" :class="{ hot: overDelete }">
        <text class="delete-bar-text">{{ overDelete ? '松手删除这门课' : '拖动到此处删除' }}</text>
      </view>

      <!-- 网格 -->
      <view class="grid-main">
        <view class="side-col">
          <view class="grid-corner">节次</view>
          <view class="period-viewport">
            <view class="period-col" :style="{ transform: 'translateY(-' + (periodOffset + panY) + 'px)' }">
              <view class="period-cell" v-for="p in periods" :key="p.index" :style="{ height: rowH + 'rpx' }">
                <view class="p-time">{{ p.start }}</view>
                <view class="p-idx">{{ p.index }}</view>
                <view class="p-time">{{ p.end }}</view>
              </view>
              <view class="now-dot" v-if="timeVisible" :style="{ top: nowTop + 'rpx' }"></view>
            </view>
          </view>
        </view>

        <scroll-view
          class="canvas-scroll"
          :scroll-x="!scrollLocked"
          :scroll-y="!scrollLocked"
          :scroll-left="scrollLeft"
          :scroll-top="scrollTop"
          @scroll="onCanvasScroll"
        >
          <view class="canvas-inner" :style="{ width: gridW + 'rpx', transform: 'translate(' + (-panX) + 'px, ' + (-panY) + 'px)' }">
            <view class="days-row">
              <view
                class="day-col"
                :class="{ 'day-today': timeVisible && index === todayIndex }"
                v-for="(d, index) in dayNames"
                :key="index"
                :style="{ width: dayW + 'rpx' }"
              >{{ d }}</view>
            </view>

            <view class="grid-canvas" :style="{ width: gridW + 'rpx', height: canvasH + 'rpx' }">
              <view class="cell" v-for="c in gridCells" :key="c.key" :style="c.style" @tap="onCellTap(c)"></view>

              <view class="today-col" v-if="timeVisible" :style="todayColStyle"></view>

              <view
                class="course-card"
                :class="{ dragging: drag && drag.id === c.id }"
                v-for="c in courses"
                :key="c.id"
                :style="c.style"
                @tap="onCourseTap(c)"
                @touchstart="onCourseTouchStart(c, $event)"
                @touchmove="onCourseTouchMove($event)"
                @touchend="onCourseTouchEnd"
                @touchcancel="onCourseTouchEnd"
              >
                <view class="course-inner" :style="{ background: c.tint.bg, borderColor: c.tint.border, color: c.tint.fg }">
                  <view class="course-bar" :style="{ background: c.tint.bar }"></view>
                  <view class="course-col">
                    <view class="course-pc" v-if="c.needPc">💻</view>
                    <view class="course-body">
                      <view class="course-name">{{ c.name }}</view>
                      <view class="course-loc" v-if="c.location">{{ c.location }}</view>
                      <view class="course-teacher" v-if="c.teacher">{{ c.teacher }}</view>
                    </view>
                  </view>
                </view>
              </view>

              <!-- 落点吸附框 -->
              <view
                v-if="drag && drag.active && drag.moved2"
                class="snap-box"
                :class="{ conflict: drag.conflict }"
                :style="snapRect(drag)"
              ></view>

              <!-- 跟手预览 -->
              <view
                v-if="drag && drag.active"
                class="course-card drag-ghost"
                :class="{ conflict: drag.conflict }"
                :style="[ghostStyle, ghostMove]"
              >
                <view class="course-inner" :style="ghostInnerStyle">
                  <view class="course-bar" :style="{ background: (drag.tint && drag.tint.bar) || '#fff' }"></view>
                  <view class="course-col">
                    <view class="course-body">
                      <view class="course-name">{{ drag.name }}</view>
                    </view>
                  </view>
                </view>
                <view class="drag-hint">{{ drag.conflict ? '这里有课' : (drag.mode === 'move' ? '移动' : '复制') }}</view>
              </view>

              <view class="now-line" v-if="timeVisible" :style="{ top: nowTop + 'rpx' }"></view>
            </view>
          </view>
        </scroll-view>
      </view>
    </template>

    <!-- 课程弹窗 -->
    <view v-if="showCourseModal" class="mask" @tap="closeCourseModal">
      <view class="modal course-modal" @tap.stop>
        <view class="modal-body">
          <view class="modal-title">{{ courseForm.id ? '编辑课程' : '添加课程' }}</view>

          <view class="field">
            <text class="field-label">课程名 *</text>
            <input class="field-input" v-model="courseForm.name" placeholder="如：高等数学" placeholder-class="ph" />
          </view>

          <view class="field-row">
            <view class="field half">
              <text class="field-label">老师</text>
              <input class="field-input" v-model="courseForm.teacher" placeholder="选填" placeholder-class="ph" />
            </view>
            <view class="field half">
              <text class="field-label">地点</text>
              <input class="field-input" v-model="courseForm.location" placeholder="选填" placeholder-class="ph" />
            </view>
          </view>

          <view class="field-row">
            <view class="field half">
              <text class="field-label">星期</text>
              <picker mode="selector" :range="dayNames" :value="courseForm.day" @change="onDayChange">
                <view class="picker-box">{{ dayNames[courseForm.day] }}</view>
              </picker>
            </view>
            <view class="field half">
              <text class="field-label">开始节</text>
              <picker mode="selector" :range="periodOptions" :value="courseForm.startPeriod - 1" @change="onStartPeriodChange">
                <view class="picker-box">第{{ courseForm.startPeriod }}节</view>
              </picker>
            </view>
          </view>

          <view class="field-row">
            <view class="field half">
              <text class="field-label">结束节</text>
              <picker mode="selector" :range="periodOptions" :value="courseForm.endPeriod - 1" @change="onEndPeriodChange">
                <view class="picker-box">第{{ courseForm.endPeriod }}节</view>
              </picker>
            </view>
            <view class="field half">
              <text class="field-label">录入方式</text>
              <view class="weektype-row">
                <view class="weektype-btn tall" :class="{ on: courseForm.dateMode !== 'week' }" @tap="setCourseMode('date')">按日期</view>
                <view class="weektype-btn tall" :class="{ on: courseForm.dateMode === 'week' }" @tap="setCourseMode('week')">按周次</view>
              </view>
            </view>
          </view>

          <!-- 按日期 -->
          <template v-if="courseForm.dateMode !== 'week'">
            <view class="field-row">
              <view class="field half">
                <text class="field-label">开始日期 *</text>
                <picker mode="date" :value="courseForm.startDate" @change="onStartDateChange">
                  <view class="picker-box">{{ courseForm.startDate }}</view>
                </picker>
              </view>
              <view class="field half">
                <text class="field-label">结束日期</text>
                <view class="date-pick-row">
                  <picker class="date-pick" mode="date" :value="courseForm.endDate" @change="onEndDateChange">
                    <view class="picker-box">{{ courseForm.endDate || '一直上' }}</view>
                  </picker>
                  <view v-if="courseForm.endDate" class="date-clear" @tap="clearEndDate">✕</view>
                </view>
              </view>
            </view>
            <view class="field">
              <text class="field-label">上课频率</text>
              <view class="weektype-row">
                <view class="weektype-btn" :class="{ on: courseForm.weekType === 'every' }" @tap="setWeekType('every')">每周</view>
                <view class="weektype-btn" :class="{ on: courseForm.weekType === 'everyOther' }" @tap="setWeekType('everyOther')">隔周</view>
              </view>
            </view>
          </template>

          <!-- 按周次 -->
          <template v-else>
            <view class="field-row">
              <view class="field half">
                <text class="field-label">开始周</text>
                <picker mode="selector" :range="weekOptions" :value="courseForm.startWeek - 1" @change="onWeekStartPicker">
                  <view class="picker-box">{{ weekOptions[courseForm.startWeek - 1] }}</view>
                </picker>
              </view>
              <view class="field half">
                <text class="field-label">结束周</text>
                <view class="date-pick-row">
                  <picker class="date-pick" mode="selector" :range="weekEndOptions" :value="courseForm.endWeek" @change="onWeekEndPicker">
                    <view class="picker-box">{{ weekEndOptions[courseForm.endWeek] }}</view>
                  </picker>
                  <view v-if="courseForm.endWeek" class="date-clear" @tap="courseForm.endWeek = 0">✕</view>
                </view>
              </view>
            </view>
            <view class="field">
              <text class="field-label">上课频率</text>
              <view class="weektype-row">
                <view class="weektype-btn" :class="{ on: courseForm.weekParity === 'every' }" @tap="setWeekParity('every')">每周</view>
                <view class="weektype-btn" :class="{ on: courseForm.weekParity === 'odd' }" @tap="setWeekParity('odd')">单周</view>
                <view class="weektype-btn" :class="{ on: courseForm.weekParity === 'even' }" @tap="setWeekParity('even')">双周</view>
              </view>
            </view>
            <view class="field-hint" :class="{ warn: weekPreview.warn }">{{ weekPreview.text }}</view>
          </template>

          <view class="switch-row" @tap="courseForm.needPc = !courseForm.needPc">
            <view class="switch-row-text">
              <text class="switch-row-title">是否带电脑</text>
              <text class="switch-row-sub">开了就在卡片左上角显示 💻</text>
            </view>
            <view class="time-switch" :class="{ on: courseForm.needPc }"><view class="time-switch-dot"></view></view>
          </view>

          <view class="field-hint warn" v-if="conflicts.length">与 {{ conflicts.length }} 门课程时间冲突，仍可保存</view>

          <view class="field">
            <text class="field-label">颜色</text>
            <view class="color-row">
              <view
                class="color-dot"
                :class="{ sel: courseForm.color === c }"
                v-for="(c, i) in courseColors"
                :key="i"
                :style="{ background: c }"
                @tap="courseForm.color = c"
              ></view>
            </view>
          </view>

          <view class="modal-actions">
            <button class="btn-primary flex1" @tap="saveCourse">保存</button>
            <button v-if="courseForm.id" class="btn-danger flex1" @tap="deleteCourse">删除</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 尺寸弹窗 -->
    <view v-if="showSizeModal" class="mask" @tap="closeSizeModal">
      <view class="modal" @tap.stop>
        <view class="modal-body">
          <view class="modal-title">调整行高与列宽</view>

          <view class="size-row">
            <text class="size-label">行高</text>
            <slider
              class="size-slider"
              :value="rowH"
              :min="80"
              :max="200"
              :step="4"
              :active-color="accentColor"
              background-color="#c9cdd6"
              :block-size="20"
              @changing="onRowHChanging"
              @change="onRowHChange"
            />
            <text class="size-val">{{ rowH }}</text>
          </view>

          <view class="size-row">
            <text class="size-label">列宽</text>
            <slider
              class="size-slider"
              :value="dayW"
              :min="92"
              :max="213"
              :step="4"
              :active-color="accentColor"
              background-color="#c9cdd6"
              :block-size="20"
              @changing="onDayWChanging"
              @change="onDayWChange"
            />
            <text class="size-val">{{ dayW }}</text>
          </view>

          <view class="field-hint">7 天共 {{ 7 * dayW }}rpx，超出屏宽的部分左右滑动查看；行高影响每节能放几行字。</view>

          <view class="size-presets">
            <view class="weektype-btn" @tap="resetSize">恢复默认</view>
          </view>

          <button class="btn-primary" @tap="closeSizeModal">完成</button>
        </view>
      </view>
    </view>

    <!-- 新手引导 -->
    <view v-if="showGuide" class="guide-mask">
      <view class="guide-card">
        <view class="guide-emoji">{{ guideSteps[guideStep].emoji }}</view>
        <view class="guide-title">{{ guideSteps[guideStep].title }}</view>
        <view class="guide-desc">{{ guideSteps[guideStep].desc }}</view>
        <view class="guide-dots">
          <view class="guide-dot" :class="{ on: i === guideStep }" v-for="(s, i) in guideSteps" :key="i"></view>
        </view>
        <view class="guide-actions">
          <button class="guide-prev" :class="{ dis: guideStep === 0 }" @tap="prevGuideStep">上一步</button>
          <button class="btn-primary guide-next" @tap="nextGuideStep">{{ guideStep === guideSteps.length - 1 ? '开始使用' : '下一步' }}</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  listSemesters, listCourses, createCourse, updateCourse, deleteCourse as deleteCourseDb,
  getUser, updateUser, COURSE_COLORS, getCurrentSemester, setCurrentSemesterId
} from '../../services/database.js'
import { courseTint } from '../../utils/color.js'
import {
  formatDate, parseDate, getToday, weekMonday, addDays, formatWeekRange, getWeekDays,
  hitDate, detectConflicts, isSameDay, weekIndexOf, scheduleFromWeeks, weeksFromSchedule
} from '../../utils/schedule.js'
import { resolveThemeClass, applyStatusBar, applyTabBar, applyNavBar, setTabBarVisible, isDarkTheme } from '../../utils/theme.js'

const ROW_H_DEFAULT = 140
const DAY_W_DEFAULT = 128
const ROW_H_MIN = 80
const ROW_H_MAX = 200
const DAY_W_MIN = 92
const DAY_W_MAX = 213
const CORNER_H = 76
const WEEK_MAX = 30
let dragSeq = 0

export default {
  data() {
    return {
      semesters: [],
      currentSemester: null,
      // allCourses = 本学期全部课程（判定冲突、同名同步都要看全量）
      // courses     = 当前这一周真正要上的课（渲染用，按日期/单双周过滤）
      allCourses: [],
      courses: [],
      periods: [],
      themeClass: 'theme-blue mode-light',

      rowH: ROW_H_DEFAULT,
      dayW: DAY_W_DEFAULT,
      accentColor: '#007aff',
      isDark: false,
      showSizeModal: false,

      currentWeekStart: null,
      dayNames: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],

      showTime: true,
      nowMin: 0,
      nowTimer: null,
      periodOffset: 0,

      showCourseModal: false,
      courseForm: {},
      conflicts: [],
      courseColors: COURSE_COLORS,
      weekOptions: Array.from({ length: WEEK_MAX }, (_, i) => `第 ${i + 1} 周`),
      weekEndOptions: ['一直上', ...Array.from({ length: WEEK_MAX }, (_, i) => `第 ${i + 1} 周`)],

      // 拖动复制
      drag: null,
      suppressTap: false,
      scrollLocked: false,
      scrollLeft: 0,
      scrollTop: 0,
      panX: 0,
      panY: 0,
      overDelete: false,
      autoTimer: null,
      autoStep: { x: 0, y: 0 },

      // 新手引导
      showGuide: false,
      guideStep: 0,
      guideSteps: [
        { emoji: '👆', title: '点空格建课', desc: '点课表里的空白格，就能在那个时间加一门课' },
        { emoji: '✏️', title: '点课程可编辑', desc: '点已有课程改名称、时间、周次；按住卡片拖到别的格子可以复制' },
        { emoji: '⚙️', title: '顶栏两个开关', desc: '「尺寸」调行高列宽，「时间」开关右侧横向滑动看周六日' }
      ]
    }
  },

  computed: {
    gridW() {
      return 7 * this.dayW
    },
    canvasH() {
      return this.periods.length * this.rowH
    },
    gridH() {
      return CORNER_H + this.canvasH
    },
    weekRangeText() {
      if (!this.currentWeekStart) return ''
      return formatWeekRange(this.currentWeekStart)
    },
    weekLabel() {
      if (!this.currentSemester || !this.currentSemester.startDate || !this.currentWeekStart) return ''
      const n = weekIndexOf(this.currentSemester.startDate, this.currentWeekStart)
      return n > 0 ? `第 ${n} 周` : ''
    },
    isThisWeek() {
      if (!this.currentWeekStart) return true
      return isSameDay(this.currentWeekStart, weekMonday(getToday()))
    },
    todayIndex() {
      return (getToday().getDay() + 6) % 7
    },
    timeVisible() {
      return this.showTime
    },
    nowTop() {
      const periods = this.periods
      if (!periods.length) return 0
      const t2m = (s) => {
        const p = String(s).split(':').map(Number)
        return p[0] * 60 + p[1]
      }
      const m = this.nowMin
      const first = t2m(periods[0].start)
      if (m < first) return 0
      const last = t2m(periods[periods.length - 1].end)
      if (m >= last) return periods.length * this.rowH
      for (let i = 0; i < periods.length; i++) {
        const s = t2m(periods[i].start)
        const e = t2m(periods[i].end)
        if (m < s) return i * this.rowH
        if (m <= e) return (i + (m - s) / Math.max(1, e - s)) * this.rowH
      }
      return periods.length * this.rowH
    },
    todayColStyle() {
      return {
        left: this.todayIndex * this.dayW + 'rpx',
        top: 0,
        width: this.dayW + 'rpx',
        height: this.canvasH + 'rpx'
      }
    },
    gridCells() {
      const list = []
      for (let r = 0; r < this.periods.length; r++) {
        for (let d = 0; d < 7; d++) {
          list.push({
            key: `${r}-${d}`,
            day: d,
            period: r + 1,
            style: {
              left: d * this.dayW + 'rpx',
              top: r * this.rowH + 'rpx',
              width: this.dayW + 'rpx',
              height: this.rowH + 'rpx'
            }
          })
        }
      }
      return list
    },
    weekDays() {
      return this.currentWeekStart ? getWeekDays(this.currentWeekStart) : []
    },
    periodOptions() {
      return this.periods.map(p => `第${p.index}节`)
    },
    weekPreview() {
      const sem = this.currentSemester
      if (!sem || !sem.startDate) {
        return { text: '这个学期还没设开学日期，去「我的 → 学期管理」设一下才能按周次录入', warn: true }
      }
      const eff = this.effectiveStartWeek()
      const end = this.courseForm.endWeek || null
      if (end && eff > end) {
        return { text: '开始周晚于结束周，请调整', warn: true }
      }
      const r = scheduleFromWeeks(sem.startDate, eff, end, this.courseForm.day || 0, this.weekTypeFromParity())
      return {
        text: `实际：${r.startDate}${r.endDate ? ' ~ ' + r.endDate : ' 起一直上'}${this.courseForm.weekParity === 'every' ? '' : '（' + (this.courseForm.weekParity === 'odd' ? '单周' : '双周') + '）'}`,
        warn: false
      }
    },
    ghostInnerStyle() {
      const d = this.drag
      if (!d) return {}
      if (d.conflict) return { background: 'var(--danger)', borderColor: 'var(--danger)', color: '#fff' }
      const t = d.tint || {}
      return { background: t.bg, borderColor: t.border, color: t.fg }
    },
    ghostStyle() {
      if (!this.drag) return {}
      return {
        width: this.dayW - 8 + 'rpx',
        height: (this.drag.endPeriod - this.drag.startPeriod + 1) * this.rowH - 8 + 'rpx',
        opacity: '0.9',
        boxShadow: '0 16rpx 40rpx rgba(0, 0, 0, 0.28)'
      }
    },
    // 跟手位移只走 transform（GPU 合成），不要动 left/top，否则每帧重排会卡
    rpxToPx() {
      try {
        return uni.getSystemInfoSync().windowWidth / 750
      } catch (e) {
        return 0.5
      }
    },
    ghostMove() {
      const d = this.drag
      if (!d) return { transform: 'translate3d(0,0,0)' }
      const k = this.rpxToPx
      return {
        transform: `translate3d(${d.ghostLeft * k}px, ${d.ghostTop * k}px, 0) scale(1.04)`
      }
    }
  },

  async onLoad() {
    uni.$on('theme-changed', this.loadTheme)
    await this.init()
  },

  async onShow() {
    await this.loadTheme()
    await this.loadSemesters()
    this.startNowTimer()
    this.maybeShowGuide()
  },

  onHide() {
    this.stopNowTimer()
  },

  async onUnload() {
    uni.$off('theme-changed', this.loadTheme)
    this.stopNowTimer()
  },

  methods: {
    async init() {
      this.currentWeekStart = weekMonday(getToday())
      this.updateNow()
      await this.loadSemesters()
      await this.loadTheme()
    },

    async loadTheme() {
      const user = await getUser()
      this.periods = user.periods || []
      this.rowH = user.rowH || ROW_H_DEFAULT
      this.dayW = user.dayW || DAY_W_DEFAULT
      this.isDark = isDarkTheme(user.themeMode)
      this.accentColor = { blue: '#007aff', green: '#34c759', purple: '#af52de', orange: '#ff9500' }[user.accent] || '#007aff'
      this.themeClass = resolveThemeClass(user.accent, user.themeMode)
      applyStatusBar(user.themeMode)
      applyTabBar(user.themeMode, user.accent)
      applyNavBar(user.themeMode)
      // 卡片配色/尺寸跟着明暗和行高列宽走，就地重算一遍即可（不用再查一次库）
      this.renderCourses()
    },

    async loadSemesters() {
      this.semesters = await listSemesters()
      // 当前学期统一走数据库里的那一份（和小程序 globalData.currentSemesterId 同义）：
      // 存下的 id 还在就用它，不在了退回第一个 —— 覆盖导入后不会拿着已删掉的旧学期。
      const current = await getCurrentSemester()
      const currentId = current ? current.id : null
      const prevId = this.currentSemester ? this.currentSemester.id : null
      this.currentSemester = current
      // 换学期就回到本周（同小程序 loadAll），导入/切学期后不会停在上一门课的周次
      if (currentId !== prevId) this.currentWeekStart = weekMonday(getToday())
      await this.loadCourses()
    },

    async loadCourses() {
      const list = this.currentSemester ? await listCourses(this.currentSemester.id) : []
      this.allCourses = list
      this.renderCourses()
    },

    // 只画「这一周真的要上」的课：日期区间 + 星期 + 单双周（原版就是按 hitDate 过滤的，
    // 不过滤的话单双周/有结束日期的课会在每一周都出现）
    renderCourses() {
      const weekStart = this.currentWeekStart || weekMonday(getToday())
      const rowH = this.rowH
      this.courses = this.allCourses
        .filter(c => hitDate(c, addDays(weekStart, c.day)))
        .map(c => ({
          ...c,
          tint: courseTint(c.color || COURSE_COLORS[0], this.isDark),
          style: {
            left: c.day * this.dayW + 4 + 'rpx',
            top: (c.startPeriod - 1) * rowH + 4 + 'rpx',
            width: this.dayW - 8 + 'rpx',
            height: (c.endPeriod - c.startPeriod + 1) * rowH - 8 + 'rpx'
          }
        }))
    },

    updateNow() {
      const now = new Date()
      this.nowMin = now.getHours() * 60 + now.getMinutes()
    },

    // 网格在 scroll-view 里滚，左侧节次栏跟着位移，保持对齐
    onCanvasScroll(e) {
      this.periodOffset = e.detail.scrollTop
      this.scrollLeft = e.detail.scrollLeft
      this.scrollTop = e.detail.scrollTop
    },
    startNowTimer() {
      this.updateNow()
      this.stopNowTimer()
      this.nowTimer = setInterval(() => this.updateNow(), 60 * 1000)
    },
    stopNowTimer() {
      if (this.nowTimer) {
        clearInterval(this.nowTimer)
        this.nowTimer = null
      }
    },

    prevWeek() {
      this.currentWeekStart = addDays(this.currentWeekStart, -7)
      this.renderCourses()
    },
    nextWeek() {
      this.currentWeekStart = addDays(this.currentWeekStart, 7)
      this.renderCourses()
    },
    backToToday() {
      this.currentWeekStart = weekMonday(getToday())
      this.renderCourses()
    },
    toggleTimeShow() {
      this.showTime = !this.showTime
    },
    switchSemester() {
      const names = this.semesters.map(s => s.name)
      if (!names.length) return
      uni.showActionSheet({
        itemList: names,
        success: async (res) => {
          const sem = this.semesters[res.tapIndex]
          if (!sem) return
          await setCurrentSemesterId(sem.id)
          await this.loadSemesters()
        }
      })
    },
    goMine() {
      uni.switchTab({ url: '/pages/mine/mine' })
    },

    /* ---------- 尺寸 ---------- */
    openSizeModal() {
      this.showSizeModal = true
    },
    onRowHChanging(e) {
      this.rowH = e.detail.value
    },
    onDayWChanging(e) {
      this.dayW = e.detail.value
    },
    onRowHChange(e) {
      this.rowH = e.detail.value
      this.loadCourses()
      updateUser({ rowH: this.rowH })
    },
    onDayWChange(e) {
      this.dayW = e.detail.value
      this.loadCourses()
      updateUser({ dayW: this.dayW })
    },
    resetSize() {
      this.rowH = ROW_H_DEFAULT
      this.dayW = DAY_W_DEFAULT
      this.loadCourses()
      updateUser({ rowH: this.rowH, dayW: this.dayW })
    },
    closeSizeModal() {
      this.showSizeModal = false
    },

    /* ---------- 课程 ---------- */
    onCellTap(cell) {
      this.createCourse({ day: cell.day, startPeriod: cell.period })
    },

    onCourseTap(course) {
      if (this.suppressTap || this.drag) return
      this.courseForm = {
        ...course,
        dateMode: 'date',
        startWeek: 1,
        endWeek: 0,
        weekParity: 'every',
        _originalName: course.name,
        _originalTeacher: course.teacher,
        _originalLocation: course.location,
        _originalColor: course.color,
        _originalNeedPc: !!course.needPc
      }
      this.checkConflicts()
      this.showCourseModal = true
      setTabBarVisible(false)
    },

    createCourse(preset = {}) {
      const start = preset.startPeriod || 1
      const maxPeriod = this.periods.length || 12
      this.courseForm = {
        name: '',
        teacher: '',
        location: '',
        day: preset.day || 0,
        startPeriod: start,
        endPeriod: Math.min(start + 1, maxPeriod),
        startDate: formatDate(this.weekDays[preset.day] || getToday()),
        endDate: null,
        weekType: 'every',
        needPc: false,
        color: COURSE_COLORS[0],
        semesterId: this.currentSemester.id,
        dateMode: 'date',
        startWeek: 1,
        endWeek: 0,
        weekParity: 'every'
      }
      this.conflicts = []
      this.showCourseModal = true
      setTabBarVisible(false)
    },

    closeCourseModal() {
      this.showCourseModal = false
      this.courseForm = {}
      this.conflicts = []
      setTabBarVisible(true)
    },

    // 切到周次模式时，用当前日期反推周次
    setCourseMode(mode) {
      if (mode === this.courseForm.dateMode) return
      const sem = this.currentSemester
      if (mode === 'week') {
        if (!sem || !sem.startDate) {
          uni.showToast({ title: '先给学期设开学日期', icon: 'none' })
          return
        }
        const w = weeksFromSchedule(sem.startDate, this.courseForm.startDate, this.courseForm.endDate)
        this.courseForm.startWeek = Math.max(1, Math.min(WEEK_MAX, w.startWeek || 1))
        this.courseForm.endWeek = w.endWeek ? Math.min(WEEK_MAX, w.endWeek) : 0
        this.courseForm.weekParity = this.courseForm.weekType === 'everyOther'
          ? ((this.courseForm.startWeek % 2 === 1) ? 'odd' : 'even')
          : 'every'
        this.courseForm.dateMode = 'week'
      } else {
        this.courseForm.dateMode = 'date'
      }
    },

    weekTypeFromParity() {
      return this.courseForm.weekParity === 'every' ? 'every' : 'everyOther'
    },

    // 单双周按学期口径：把开始周夹到正确奇偶的第一周
    effectiveStartWeek() {
      let w = this.courseForm.startWeek || 1
      const p = this.courseForm.weekParity
      if (p === 'odd' && w % 2 === 0) w += 1
      if (p === 'even' && w % 2 === 1) w += 1
      return Math.min(WEEK_MAX, w)
    },

    setWeekParity(p) {
      this.courseForm.weekParity = p
      this.courseForm.weekType = p === 'every' ? 'every' : 'everyOther'
      this.checkConflicts()
    },
    setWeekType(t) {
      this.courseForm.weekType = t
      this.checkConflicts()
    },
    onWeekStartPicker(e) {
      this.courseForm.startWeek = parseInt(e.detail.value) + 1
      if (this.courseForm.endWeek && this.courseForm.endWeek < this.courseForm.startWeek) {
        this.courseForm.endWeek = this.courseForm.startWeek
      }
    },
    onWeekEndPicker(e) {
      this.courseForm.endWeek = parseInt(e.detail.value)
      if (this.courseForm.endWeek && this.courseForm.endWeek < this.courseForm.startWeek) {
        this.courseForm.startWeek = this.courseForm.endWeek
      }
    },

    async saveCourse() {
      const f = this.courseForm
      if (!f.name || (!f.startDate && f.dateMode !== 'week')) {
        uni.showToast({ title: '课程名和开始日期必填', icon: 'none' })
        return
      }

      let startDate = f.startDate
      let endDate = f.endDate || null
      let weekType = f.weekType

      if (f.dateMode === 'week') {
        const sem = this.currentSemester
        // 没设开学日期就折算不出日期，原版会拦下来（这里也拦，否则会存成一门永远不显示的课）
        if (!sem || !sem.startDate) {
          uni.showToast({ title: '先给学期设开学日期', icon: 'none' })
          return
        }
        const eff = this.effectiveStartWeek()
        const endW = f.endWeek || null
        if (endW && eff > endW) {
          uni.showToast({ title: '开始周晚于结束周', icon: 'none' })
          return
        }
        const r = scheduleFromWeeks(sem.startDate, eff, endW, f.day, this.weekTypeFromParity())
        startDate = r.startDate
        endDate = r.endDate
        weekType = r.weekType
      } else if (endDate && startDate && endDate < startDate) {
        // 同原版：结束日期早于开始日期直接拒绝（这种区间会让课按日期过滤时不显示）
        uni.showToast({ title: '结束日期不能早于开始日期', icon: 'none' })
        return
      }

      const payload = {
        name: f.name,
        teacher: f.teacher,
        location: f.location,
        day: f.day,
        startPeriod: f.startPeriod,
        endPeriod: f.endPeriod,
        startDate,
        endDate: endDate || null,
        weekType,
        needPc: !!f.needPc,
        color: f.color,
        semesterId: this.currentSemester.id
      }

      try {
        if (f.id) {
          await updateCourse(f.id, payload)
          await this.maybeSyncSameName(f, payload)
        } else {
          await createCourse(payload)
        }
        this.closeCourseModal()
        await this.loadCourses()
        uni.showToast({ title: '已保存', icon: 'success' })
      } catch (error) {
        console.error('保存课程失败', error)
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    },

    // 改了同名课程的名称/老师/地点/颜色/带电脑时，问要不要一起改
    async maybeSyncSameName(form, payload) {
      const origName = form._originalName
      if (!origName) return
      const others = this.allCourses.filter(c => c.id !== form.id && c.name === origName)
      const changed =
        origName !== payload.name ||
        (form._originalTeacher || '') !== (payload.teacher || '') ||
        (form._originalLocation || '') !== (payload.location || '') ||
        form._originalColor !== payload.color ||
        form._originalNeedPc !== !!payload.needPc
      if (!others.length || !changed) return
      const confirmed = await new Promise(resolve => {
        uni.showModal({
          title: '同步修改同名课程',
          content: `当前学期还有 ${others.length} 个同名课程，是否一并同步修改名称、老师、地点、颜色、是否带电脑？（不影响时间、节次、日期）`,
          confirmText: '全部同步',
          cancelText: '只改这条',
          success: res => resolve(res.confirm)
        })
      })
      if (!confirmed) return
      const fields = {
        name: payload.name,
        teacher: payload.teacher,
        location: payload.location,
        color: payload.color,
        needPc: payload.needPc
      }
      for (const c of others) {
        await updateCourse(c.id, { ...c, ...fields })
      }
    },

    async deleteCourse() {
      const confirmed = await new Promise(resolve => {
        uni.showModal({
          title: '删除课程',
          content: '删除后无法恢复。',
          confirmText: '删除',
          confirmColor: '#e05e4f',
          success: res => resolve(res.confirm)
        })
      })
      if (!confirmed) return
      try {
        await deleteCourseDb(this.courseForm.id)
        this.closeCourseModal()
        await this.loadCourses()
        uni.showToast({ title: '已删除', icon: 'success' })
      } catch (error) {
        console.error('删除课程失败', error)
        uni.showToast({ title: '删除失败', icon: 'none' })
      }
    },

    clearEndDate() {
      this.courseForm.endDate = null
      this.checkConflicts()
    },
    onDayChange(e) {
      this.courseForm.day = parseInt(e.detail.value)
      this.checkConflicts()
    },
    onStartPeriodChange(e) {
      const v = parseInt(e.detail.value) + 1
      this.courseForm.startPeriod = v
      if (this.courseForm.endPeriod < v) this.courseForm.endPeriod = v
      this.checkConflicts()
    },
    onEndPeriodChange(e) {
      const v = parseInt(e.detail.value) + 1
      this.courseForm.endPeriod = v
      if (this.courseForm.startPeriod > v) this.courseForm.startPeriod = v
      this.checkConflicts()
    },
    onStartDateChange(e) {
      this.courseForm.startDate = e.detail.value
      this.checkConflicts()
    },
    onEndDateChange(e) {
      this.courseForm.endDate = e.detail.value
      this.checkConflicts()
    },
    checkConflicts() {
      this.conflicts = detectConflicts(this.courseForm, this.allCourses)
    },

    /* ---------- 拖动复制 ---------- */
    onCourseTouchStart(course, e) {
      const t = e.touches && e.touches[0]
      if (!t) return
      // 用手指位移换算格子，不依赖 boundingClientRect（少一个失败点）
      let rpxPerPx = 1
      try {
        rpxPerPx = uni.getSystemInfoSync().windowWidth / 750
      } catch (err) { /* 兜底 */ }

      const token = ++dragSeq
      this.panX = 0
      this.panY = 0
      const drag = {
        token,
        id: course.id,
        name: course.name,
        tint: course.tint,
        needPc: course.needPc,
        startPeriod: course.startPeriod,
        endPeriod: course.endPeriod,
        originDay: course.day,
        originStart: course.startPeriod,
        startX: t.clientX,
        startY: t.clientY,
        lastX: t.clientX,
        lastY: t.clientY,
        startScrollLeft: this.scrollLeft,
        startScrollTop: this.scrollTop,
        colPx: this.dayW * rpxPerPx,
        rowPx: this.rowH * rpxPerPx,
        pxPerRpx: rpxPerPx,
        originLeft: course.day * this.dayW + 4,
        originTop: (course.startPeriod - 1) * this.rowH + 4,
        active: false,
        moved: false,
        timer: null,
        mode: 'copy',
        conflict: false,
        targetDay: course.day,
        targetStart: course.startPeriod,
        ghostLeft: course.day * this.dayW + 4,
        ghostTop: (course.startPeriod - 1) * this.rowH + 4
      }
      // 必须长按 250ms 才进入拖动 —— 否则滑动页面时碰到卡片会误触发复制。
      // 注意：this.drag 是 Vue 代理对象，不能和原始对象用 === 比，用 token 判断。
      drag.timer = setTimeout(() => {
        const d = this.drag
        if (d && d.token === token && !d.moved) {
          d.active = true
          // 抬起后锁住横向滚动，别让手指把网格一起拖走
          this.scrollLocked = true
        }
      }, 250)
      this.drag = drag
    },

    onCourseTouchMove(e) {
      if (!this.drag) return
      const t = e.touches && e.touches[0]
      if (!t) return
      const d = this.drag
      const dx = t.clientX - d.startX
      const dy = t.clientY - d.startY
      if (!d.active) {
        // 长按还没成立就动了 → 判定为滑动/点击，放弃拖动
        if (Math.abs(dx) + Math.abs(dy) > 12) {
          d.moved = true
          if (d.timer) clearTimeout(d.timer)
        }
        return
      }
      d.lastX = t.clientX
      d.lastY = t.clientY
      // 手指进到顶部那一条 → 变成删除区（顶栏约 108rpx，再加点余量）
      this.overDelete = t.clientY < 108 * this.rpxToPx + 24
      this.applyDragTarget(d)
      this.updateAutoScroll(d)
    },

    // 按「手指位移 + 已自动滚动的距离」算落点（手指够不到的格子靠贴边滚动补上）
    applyDragTarget(d) {
      const effX = (d.lastX - d.startX) + this.panX
      const effY = (d.lastY - d.startY) + this.panY
      const span = d.endPeriod - d.startPeriod
      const maxStart = Math.max(1, (this.periods.length || 12) - span)

      // 1) 先把卡片夹在网格范围内（到不了的格子它根本不去）
      const cardH = (span + 1) * this.rowH - 8
      d.ghostLeft = Math.max(4, Math.min(7 * this.dayW - this.dayW + 4, d.originLeft + effX / d.pxPerRpx))
      d.ghostTop = Math.max(4, Math.min(this.canvasH - cardH + 4, d.originTop + effY / d.pxPerRpx))

      // 2) 再按「卡片实际位置」反推落点
      const day = Math.max(0, Math.min(6, Math.round((d.ghostLeft - 4) / this.dayW)))
      const startPeriod = Math.max(1, Math.min(maxStart, Math.round((d.ghostTop - 4) / this.rowH) + 1))

      // 3) 落点撞到已有课程时，槽位**不跟过去**（保持上一个空位），卡片变红提示
      d.conflict = this.hasConflictAt(d, day, startPeriod, span)
      if (!d.conflict) {
        d.targetDay = day
        d.targetStart = startPeriod
      }
      // 换了天 → 复制到那天；只在同一天里挪节次 → 移动
      d.mode = d.targetDay !== d.originDay ? 'copy' : 'move'
      d.moved2 = d.targetDay !== d.originDay || d.targetStart !== d.originStart
    },

    // 手指贴到网格边缘附近时，让内容往那个方向自己挪（手机桌面拖动就是这个行为）
    updateAutoScroll(d) {
      const info = uni.getSystemInfoSync()
      const W = info.windowWidth
      const H = info.windowHeight
      const rpx = W / 750
      const EDGE = 60
      const gridLeft = 110 * rpx
      let ax = 0
      let ay = 0
      if (d.lastX > W - EDGE) ax = 1
      else if (d.lastX < gridLeft + EDGE) ax = -1
      if (d.lastY > H - 160) ay = 1
      else if (d.lastY < 190) ay = -1

      if (!ax && !ay) {
        this.stopAutoScroll()
        return
      }
      this.autoStep = { x: ax * 16, y: ay * 16 }
      if (this.autoTimer) return

      // 能滚的最大距离（超出就不是"滚动"了，计数器涨下去会把卡片拉出屏）
      const maxLeft = Math.max(0, 7 * this.dayW * rpx - (W - gridLeft))
      const maxTop = Math.max(0, (76 + this.canvasH) * rpx - (H - 108 * rpx))

      this.autoTimer = setInterval(() => {
        const cur = this.drag
        if (!cur || !cur.active) {
          this.stopAutoScroll()
          return
        }
        // 拖动期间 scroll-view 是锁着的，滚不了 —— 所以挪的是 transform 平移量 panX/panY
        const freeX = Math.max(0, maxLeft - this.scrollLeft)
        const freeY = Math.max(0, maxTop - this.scrollTop)
        const nextX = this.panX + this.autoStep.x
        const nextY = this.panY + this.autoStep.y
        const clampedX = Math.max(0, Math.min(freeX, nextX))
        const clampedY = Math.max(0, Math.min(freeY, nextY))
        if (clampedX === this.panX && clampedY === this.panY) {
          this.stopAutoScroll()
          return
        }
        this.panX = clampedX
        this.panY = clampedY
        this.applyDragTarget(cur)
      }, 16)
    },

    stopAutoScroll() {
      if (this.autoTimer) {
        clearInterval(this.autoTimer)
        this.autoTimer = null
      }
    },

    // 落点吸附格的样式（虚线框）
    snapRect(r) {
      if (!r) return {}
      const k = this.rpxToPx
      return {
        width: this.dayW - 8 + 'rpx',
        height: (r.endPeriod - r.startPeriod + 1) * this.rowH - 8 + 'rpx',
        transform: `translate3d(${(r.targetDay * this.dayW + 4) * k}px, ${((r.targetStart - 1) * this.rowH + 4) * k}px, 0)`
      }
    },

    // 这个落点是否和已有课程重叠（按节次区间算重叠，排除自己）
    hasConflictAt(d, day, startPeriod, span) {
      const src = this.allCourses.find(c => c.id === d.id)
      const probe = {
        id: d.id,
        semesterId: this.currentSemester ? this.currentSemester.id : null,
        day,
        startPeriod,
        endPeriod: startPeriod + span,
        startDate: src ? src.startDate : null,
        endDate: src ? src.endDate : null
      }
      return detectConflicts(probe, this.allCourses).length > 0
    },

    async onCourseTouchEnd() {
      const d = this.drag
      const wasOverDelete = this.overDelete
      if (d && d.timer) clearTimeout(d.timer)
      this.stopAutoScroll()
      this.overDelete = false
      this.drag = null
      // 把拖动期间的平移量提交回滚动位置，再解锁
      const commitX = this.scrollLeft + this.panX
      const commitY = this.scrollTop + this.panY
      this.panX = 0
      this.panY = 0
      this.scrollLeft = commitX
      this.scrollTop = commitY
      this.scrollLocked = false
      if (!d || !d.active) return
      this.suppressTap = true
      setTimeout(() => { this.suppressTap = false }, 350)
      // 拖进顶部删除区 → 直接删掉这门课
      if (wasOverDelete) {
        try {
          await deleteCourseDb(d.id)
          await this.loadCourses()
        } catch (error) {
          console.error('拖动删除失败', error)
          uni.showToast({ title: '删除失败', icon: 'none' })
        }
        return
      }
      if (!d.moved2) return
      const src = this.allCourses.find(c => c.id === d.id)
      if (!src) return
      const span = d.endPeriod - d.startPeriod
      // 落点已保证是空位（吸附时会跳过有课的格子），直接落
      try {
        if (d.mode === 'move') {
          await updateCourse(src.id, { ...src, startPeriod: d.targetStart, endPeriod: d.targetStart + span })
        } else {
          await createCourse({
            name: src.name,
            teacher: src.teacher,
            location: src.location,
            day: d.targetDay,
            startPeriod: d.targetStart,
            endPeriod: d.targetStart + span,
            startDate: src.startDate,
            endDate: src.endDate || null,
            weekType: src.weekType || 'every',
            needPc: !!src.needPc,
            color: src.color,
            semesterId: this.currentSemester.id
          })
        }
        await this.loadCourses()
      } catch (error) {
        console.error('拖动落位失败', error)
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    },

    /* ---------- 新手引导 ---------- */
    maybeShowGuide() {
      if (!this.currentSemester) return
      try {
        if (uni.getStorageSync('guideDone')) return
      } catch (e) {
        return
      }
      this.guideStep = 0
      this.showGuide = true
    },
    prevGuideStep() {
      if (this.guideStep > 0) this.guideStep -= 1
    },
    nextGuideStep() {
      if (this.guideStep < this.guideSteps.length - 1) {
        this.guideStep += 1
      } else {
        this.showGuide = false
        try { uni.setStorageSync('guideDone', true) } catch (e) { /* ignore */ }
      }
    }
  }
}
</script>

<style scoped>
.page {
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  overflow: hidden;
}

/* ===== 空态 ===== */
.empty-page { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0 80rpx; }
.empty-emoji { font-size: 120rpx; margin-bottom: 32rpx; }
.empty-title { font-size: 36rpx; font-weight: 600; letter-spacing: 1rpx; margin-bottom: 16rpx; color: var(--text); }
.empty-desc { color: var(--text-sub); font-size: 28rpx; text-align: center; margin-bottom: 48rpx; }
.empty-btn { width: 100%; }

/* ===== 顶部栏 ===== */
.topbar {
  position: sticky;
  top: 0;
  z-index: var(--z-float);
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx 24rpx 16rpx;
  background: var(--glass-strong);
  -webkit-backdrop-filter: blur(24px);
  backdrop-filter: blur(24px);
}
.topbar-semester {
  flex: 1;
  min-width: 0;
  font-size: 32rpx;
  font-weight: 700;
  letter-spacing: 0.5rpx;
  color: var(--text);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.mini-toggle { display: flex; align-items: center; gap: 8rpx; flex-shrink: 0; }
.mini-toggle-label { font-size: 23rpx; color: var(--text-sub); }
.time-switch {
  width: 68rpx;
  height: 38rpx;
  border-radius: 20rpx;
  background: var(--track);
  box-sizing: border-box;
  padding: 4rpx;
  transition: background 0.2s;
}
.time-switch.on { background: var(--primary); }
.time-switch-dot {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}
.time-switch.on .time-switch-dot { transform: translateX(30rpx); }

.week-switch {
  display: flex;
  align-items: center;
  gap: 2rpx;
  background: var(--card-2);
  border-radius: 999rpx;
  padding: 4rpx;
  flex-shrink: 0;
}
.week-btn { width: 48rpx; height: 48rpx; display: flex; align-items: center; justify-content: center; font-size: 34rpx; color: var(--text-sub); line-height: 1; }
.week-label { min-width: 124rpx; min-height: 64rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; white-space: nowrap; }
.week-no { display: flex; align-items: center; font-size: 22rpx; font-weight: 600; color: var(--text-sub); line-height: 1.3; }
.week-back { font-size: 20rpx; font-weight: 500; color: var(--primary); margin-left: 6rpx; }
.week-range { font-size: 24rpx; font-weight: 700; color: var(--text); line-height: 1.3; }

/* ===== 网格 ===== */
.grid-main { flex: 1; min-height: 0; display: flex; }
.side-col { width: 110rpx; flex-shrink: 0; display: flex; flex-direction: column; }
.period-viewport { flex: 1; min-height: 0; overflow: hidden; position: relative; }
.period-col { position: absolute; top: 0; left: 0; right: 0; }
.grid-corner {
  height: 76rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 21rpx;
  letter-spacing: 1rpx;
  color: var(--text-faint);
  border-bottom: 1rpx solid var(--border-soft);
  box-sizing: border-box;
}
.period-col { position: relative; }
.period-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 8rpx 0;
  box-sizing: border-box;
  border-bottom: 1rpx solid var(--border-soft);
}
.p-idx { font-size: 22rpx; font-weight: 700; color: var(--text-sub); line-height: 1; font-variant-numeric: tabular-nums; }
.p-time { font-size: 19rpx; color: var(--text-faint); line-height: 1; font-variant-numeric: tabular-nums; letter-spacing: -0.3rpx; }

.canvas-scroll { flex: 1; min-width: 0; height: 100%; }
.days-row { display: flex; height: 76rpx; background: var(--card); }
.day-col {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 500;
  color: var(--text-sub);
  border-bottom: 1rpx solid var(--border-soft);
  box-sizing: border-box;
}
.day-today { color: var(--primary); font-weight: 700; }

.grid-canvas { position: relative; }
.cell {
  position: absolute;
  box-sizing: border-box;
  border-right: 1rpx solid var(--border-soft);
  border-bottom: 1rpx solid var(--border-soft);
  background: var(--card);
}
.today-col { position: absolute; background: var(--primary-soft); opacity: 0.6; z-index: 1; pointer-events: none; }
.course-card { position: absolute; z-index: 2; transition: opacity 0.15s; }
/* 抬起时原位留一个淡影（桌面图标拖动也是原位变淡） */
.course-card.dragging { opacity: 0.28; }
.drag-ghost .course-inner { border-radius: 20rpx; }
.drag-ghost {
  left: 0;
  top: 0;
  z-index: 6;
  will-change: transform;
}
/* 落点槽位：像桌面图标拖动时那个"空位"，是个实心浅色圆角块，不是虚框 */
.snap-box {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 4;
  box-sizing: border-box;
  border-radius: 20rpx;
  background: var(--primary-soft);
  box-shadow: inset 0 0 0 3rpx var(--primary);
  pointer-events: none;
  will-change: transform;
  transition: transform 0.12s var(--ease-out);
}
.snap-box.conflict {
  background: var(--danger-soft);
  box-shadow: inset 0 0 0 3rpx var(--danger);
}
/* 拖动时的顶部删除区 */
.delete-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 132rpx;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-2);
  border-bottom: 1rpx solid var(--separator);
  pointer-events: none;
}
.delete-bar.hot {
  background: var(--danger);
  border-bottom-color: var(--danger);
}
.delete-bar-text {
  font-size: 26rpx;
  color: var(--text-sub);
}
.delete-bar.hot .delete-bar-text {
  color: #fff;
  font-weight: 600;
}

.drag-hint {
  position: absolute;
  left: 50%;
  top: -40rpx;
  transform: translateX(-50%);
  padding: 6rpx 20rpx;
  border-radius: 999rpx;
  background: rgba(12, 14, 20, 0.82);
  color: #fff;
  font-size: 22rpx;
  white-space: nowrap;
  pointer-events: none;
}
.course-inner {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 20rpx;
  border: 1rpx solid transparent;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  box-shadow: 0 4rpx 12rpx rgba(18, 22, 33, 0.08);
}
.course-bar { width: 8rpx; flex-shrink: 0; }
.course-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 12rpx;
}
.course-pc { margin-top: 10rpx; font-size: 20rpx; line-height: 1.1; flex-shrink: 0; }
.course-body { flex: 1; min-width: 0; padding: 10rpx 0; display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
.course-name {
  font-size: 24rpx;
  font-weight: 600;
  line-height: 1.32;
  letter-spacing: 0.2rpx;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.course-loc,
.course-teacher {
  font-size: 20rpx;
  opacity: 0.95;
  margin-top: 4rpx;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.now-line { position: absolute; left: 0; width: 100%; height: 0; border-top: 3rpx solid #ff5a5f; z-index: 3; pointer-events: none; }
.now-dot {
  position: absolute;
  right: 0;
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #ff5a5f;
  box-shadow: 0 0 0 5rpx rgba(255, 90, 95, 0.18);
  z-index: 3;
  pointer-events: none;
  transform: translateY(-50%);
}

/* ===== 弹窗 ===== */
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(12, 14, 20, 0.34);
  -webkit-backdrop-filter: blur(7px);
  backdrop-filter: blur(7px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  animation: maskIn 0.2s ease both;
}
.modal {
  background: var(--card);
  border-radius: var(--radius-lg);
  width: 600rpx;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-float);
  animation: modalIn 0.38s cubic-bezier(0.34, 1.5, 0.5, 1) both;
}
.course-modal { width: 620rpx; }
.modal-body { padding: 36rpx 32rpx 32rpx; overflow-y: auto; box-sizing: border-box; flex: 1; min-height: 0; }
.modal-title { font-size: 32rpx; font-weight: 700; letter-spacing: 0.5rpx; text-align: center; color: var(--text); margin-bottom: 28rpx; }

.field { margin-bottom: 24rpx; }
.field-label { font-size: 24rpx; color: var(--text-sub); margin-bottom: 12rpx; display: block; letter-spacing: 0.5rpx; }
.field-input {
  background: var(--card-2);
  border: 2rpx solid transparent;
  border-radius: var(--radius-sm);
  padding: 0 24rpx;
  font-size: 30rpx;
  width: 100%;
  box-sizing: border-box;
  color: var(--text);
  height: 88rpx;
  line-height: 88rpx;
}
.ph { color: var(--text-faint); }
.field-row { display: flex; gap: 20rpx; }
.field.half { flex: 1; margin-bottom: 24rpx; min-width: 0; }
.picker-box { background: var(--card-2); border-radius: var(--radius-sm); padding: 20rpx 24rpx; font-size: 30rpx; color: var(--text); box-sizing: border-box; }
.date-pick-row { display: flex; align-items: center; gap: 12rpx; }
.date-pick { flex: 1; min-width: 0; }
.date-clear { flex-shrink: 0; padding: 20rpx 24rpx; background: var(--card-2); border-radius: var(--radius-sm); color: var(--text-sub); font-size: 26rpx; }
.weektype-row { display: flex; gap: 12rpx; }
.weektype-btn { flex: 1; text-align: center; padding: 18rpx 0; border-radius: var(--radius-xs); background: var(--card-2); color: var(--text-sub); font-size: 24rpx; }
.weektype-btn.on { background: var(--primary-soft); color: var(--primary); font-weight: 700; }
.weektype-btn.tall { padding: 24rpx 0; }
.switch-row { display: flex; align-items: center; justify-content: space-between; gap: 20rpx; margin-bottom: 24rpx; }
.switch-row-text { display: flex; flex-direction: column; gap: 4rpx; min-width: 0; }
.switch-row-title { font-size: 26rpx; color: var(--text); }
.switch-row-sub { font-size: 21rpx; color: var(--text-faint); }
.field-hint { font-size: 23rpx; color: var(--text-sub); margin: -14rpx 0 24rpx; line-height: 1.5; }
.field-hint.warn { color: var(--danger); }
.color-row { display: flex; flex-wrap: wrap; gap: 26rpx; }
.color-dot { width: 56rpx; height: 56rpx; border-radius: 50%; box-sizing: border-box; box-shadow: 0 4rpx 10rpx rgba(18, 22, 33, 0.14); }
.color-dot.sel { border: 6rpx solid var(--text); transform: scale(1.12); }
.modal-actions { display: flex; gap: 20rpx; margin-top: 12rpx; }
.flex1 { flex: 1; }

/* 尺寸弹窗 */
.size-row { display: flex; align-items: center; gap: 16rpx; margin-bottom: 8rpx; }
.size-label { width: 72rpx; flex-shrink: 0; font-size: 26rpx; color: var(--text-2); }
.size-slider { flex: 1; min-width: 0; margin: 0 8rpx; }
.size-val { width: 70rpx; flex-shrink: 0; text-align: right; font-size: 24rpx; color: var(--text-sub); font-variant-numeric: tabular-nums; }
.size-presets { display: flex; gap: 12rpx; margin-bottom: 24rpx; }

.btn-primary {
  background: linear-gradient(135deg, var(--primary-grad-a), var(--primary-grad-b));
  color: #fff;
  border-radius: var(--radius);
  font-size: 30rpx;
  padding: 24rpx 0;
  text-align: center;
  font-weight: 600;
  letter-spacing: 1rpx;
  box-shadow: 0 10rpx 26rpx var(--primary-shadow);
}
.btn-primary:active { opacity: 0.92; transform: scale(0.98); }
.btn-danger { background: var(--danger-soft); color: var(--danger); border-radius: var(--radius); font-size: 30rpx; padding: 24rpx 0; text-align: center; font-weight: 600; }
.btn-danger:active { opacity: 0.85; }

/* ===== 新手引导 ===== */
.guide-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(12, 14, 20, 0.66);
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 60rpx;
}
.guide-card {
  width: 100%;
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 56rpx 40rpx 36rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: var(--shadow-float);
  animation: modalIn 0.38s cubic-bezier(0.34, 1.5, 0.5, 1) both;
}
.guide-emoji { font-size: 88rpx; margin-bottom: 24rpx; }
.guide-title { font-size: 34rpx; font-weight: 700; color: var(--text); margin-bottom: 16rpx; }
.guide-desc { font-size: 26rpx; color: var(--text-sub); text-align: center; line-height: 1.6; }
.guide-dots { display: flex; gap: 12rpx; margin: 32rpx 0 24rpx; }
.guide-dot { width: 12rpx; height: 12rpx; border-radius: 50%; background: var(--track); }
.guide-dot.on { background: var(--primary); width: 28rpx; border-radius: 6rpx; }
.guide-actions { display: flex; gap: 20rpx; width: 100%; }
.guide-prev { flex: 1; font-size: 28rpx; color: var(--text-sub); padding: 24rpx 0; text-align: center; }
.guide-prev.dis { opacity: 0.35; }
.guide-next { flex: 1.4; }

@keyframes maskIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes modalIn {
  from { opacity: 0; transform: scale(0.92) translateY(28rpx); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
