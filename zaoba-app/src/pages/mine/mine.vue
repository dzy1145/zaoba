<template>
  <view class="page" :class="themeClass">
    <!-- 用户卡片 -->
    <view class="user-card" @tap="openNicknameModal">
      <view class="user-avatar">{{ nickname ? nickname[0] : '同' }}</view>
      <view class="user-info">
        <view class="user-name">{{ nickname || '点击设置昵称' }}</view>
        <view class="user-sub">点击修改昵称</view>
      </view>
      <view class="user-arrow">✎</view>
    </view>

    <!-- 学期 -->
    <view class="card">
      <view class="card-row" @tap="openSemesterModal">
        <view class="card-icon">📅</view>
        <view class="card-body">
          <view class="card-title">学期管理</view>
          <view class="card-sub">点击新增学期</view>
        </view>
        <view class="card-arrow">＋</view>
      </view>
      <view class="sem-list" v-if="semesters.length">
        <view
          class="sem-card"
          :class="{ on: sem.id === currentSemesterId }"
          v-for="(sem, index) in semesters"
          :key="sem.id"
          @tap="setCurrentSemester(sem)"
        >
          <view class="sem-bar" :style="{ background: sem.color }"></view>
          <view class="sem-body">
            <view class="sem-name">{{ sem.name }}</view>
            <view class="sem-sub">{{ sem.subText }}</view>
          </view>
          <view class="sem-right">
            <view v-if="sem.id === currentSemesterId" class="sem-current">当前</view>
            <view class="sem-edit" @tap.stop="editSemester(sem)">✎</view>
            <view class="sem-del" @tap.stop="deleteSemester(sem)">✕</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 节次表 -->
    <view class="card">
      <view class="card-row" @tap="goPeriods">
        <view class="card-icon">⏰</view>
        <view class="card-body">
          <view class="card-title">节次表</view>
          <view class="card-sub">自定义每节课的起止时间</view>
        </view>
        <view class="card-arrow">›</view>
      </view>
    </view>

    <!-- 外观 -->
    <view class="card">
      <view class="card-row" @tap="openAppearanceModal">
        <view class="card-icon">🎨</view>
        <view class="card-body">
          <view class="card-title">外观</view>
          <view class="card-sub">{{ themeModeText }} · 强调色{{ accentText }}</view>
        </view>
        <view class="card-arrow">›</view>
      </view>
    </view>

    <!-- 数据（App 无云同步，靠导入导出手动搬课表） -->
    <view class="card">
      <view class="card-row" @tap="exportData">
        <view class="card-icon">📤</view>
        <view class="card-body">
          <view class="card-title">导出课表</view>
          <view class="card-sub">复制 JSON 到剪贴板</view>
        </view>
        <view class="card-arrow">›</view>
      </view>
      <view class="card-row" @tap="importData">
        <view class="card-icon">📥</view>
        <view class="card-body">
          <view class="card-title">导入课表</view>
          <view class="card-sub">剪贴板 JSON / 教务 Excel</view>
        </view>
        <view class="card-arrow">›</view>
      </view>
      <view class="card-row" @tap="goSchoolImport">
        <view class="card-icon">🏫</view>
        <view class="card-body">
          <view class="card-title">教务导入</view>
          <view class="card-sub">登录教务系统自动抓取课表</view>
        </view>
        <view class="card-arrow">›</view>
      </view>
    </view>

    <!-- 昵称弹窗 -->
    <view v-if="showNicknameModal" class="mask" @tap="closeNicknameModal">
      <view class="modal" @tap.stop>
        <view class="modal-body">
          <view class="modal-title">设置昵称</view>
          <view class="field">
            <text class="field-label">昵称</text>
            <input class="field-input" v-model="nicknameInput" placeholder="同学怎么称呼你？" placeholder-class="ph" maxlength="12" />
          </view>
          <button class="btn-primary" @tap="saveNickname">保存</button>
        </view>
      </view>
    </view>

    <!-- 学期弹窗 -->
    <view v-if="showSemesterModal" class="mask" @tap="closeSemesterModal">
      <view class="modal" @tap.stop>
        <view class="modal-body">
          <view class="modal-title">{{ editingSemesterId ? '编辑学期' : '新增学期' }}</view>

          <view class="field">
            <text class="field-label">学期名称</text>
            <input class="field-input" v-model="semesterName" placeholder="如：2026秋季学期" placeholder-class="ph" />
          </view>

          <view class="field">
            <text class="field-label">开学第 1 周</text>
            <view class="weektype-row">
              <view class="weektype-btn" :class="{ on: semesterMode === 'week' }" @tap="semesterMode = 'week'">按当前周次</view>
              <view class="weektype-btn" :class="{ on: semesterMode === 'date' }" @tap="semesterMode = 'date'">按开学日期</view>
            </view>
          </view>

          <view class="field">
            <template v-if="semesterMode === 'week'">
              <text class="field-label">现在是第几周</text>
              <picker mode="selector" :range="semesterWeekOptions" :value="semesterWeek" @change="onSemesterWeekPicker">
                <view class="picker-box">{{ semesterWeekOptions[semesterWeek] }}</view>
              </picker>
            </template>
            <template v-else>
              <text class="field-label">开学第一天</text>
              <view class="date-pick-row">
                <picker class="date-pick" mode="date" :value="semesterStart" @change="onSemesterStartPicker">
                  <view class="picker-box">{{ semesterStart || '选择日期' }}</view>
                </picker>
                <view v-if="semesterStart" class="date-clear" @tap="semesterStart = ''">✕</view>
              </view>
            </template>
          </view>

          <view class="field-hint">{{ semesterWeekText || '设好之后，课程才能按「第几周」录入' }}</view>

          <button class="btn-primary" @tap="submitSemester">{{ editingSemesterId ? '保存' : '创建' }}</button>
        </view>
      </view>
    </view>

    <!-- 教务 Excel 导入弹窗 -->
    <view v-if="showXlsModal" class="mask" @tap="closeXlsModal">
      <view class="modal" @tap.stop>
        <view class="modal-body">
          <view class="modal-title">导入教务课表</view>

          <view class="xls-summary">
            <view class="xls-summary-row">
              <text class="xls-summary-k">学期</text>
              <text class="xls-summary-v">{{ xlsInfo.semesterName }}</text>
            </view>
            <view class="xls-summary-row">
              <text class="xls-summary-k">识别到</text>
              <text class="xls-summary-v">{{ xlsInfo.courseCount }} 门课 · 第 {{ xlsInfo.minWeek }}–{{ xlsInfo.maxWeek }} 周</text>
            </view>
            <view v-if="xlsInfo.noScheduleCount" class="xls-summary-row">
              <text class="xls-summary-k">未排时间</text>
              <text class="xls-summary-v">{{ xlsInfo.noScheduleCount }} 门无课表课程已跳过</text>
            </view>
            <view v-if="xlsInfo.unparsedCells || xlsInfo.failedGroups" class="xls-summary-row">
              <text class="xls-summary-k">没认出来</text>
              <text class="xls-summary-v xls-warn">{{ xlsUnparsedText }}</text>
            </view>
          </view>

          <view class="field">
            <text class="field-label">第 1 周周一</text>
            <view class="date-pick-row">
              <picker class="date-pick" mode="date" :value="xlsStart" @change="onXlsStartPicker">
                <view class="picker-box">{{ xlsStart || '选择日期' }}</view>
              </picker>
            </view>
          </view>

          <view class="field">
            <text class="field-label">导入方式</text>
            <view class="weektype-row">
              <view class="weektype-btn" :class="{ on: xlsMode === 'overwrite' }" @tap="xlsMode = 'overwrite'">覆盖现有</view>
              <view class="weektype-btn" :class="{ on: xlsMode === 'append' }" @tap="xlsMode = 'append'">追加学期</view>
            </view>
          </view>

          <view v-if="xlsInfo.blocks.length" class="field">
            <text class="field-label">节次时间</text>
            <view class="weektype-row">
              <view class="weektype-btn" :class="{ on: xlsSyncPeriods }" @tap="xlsSyncPeriods = true">按 Excel 同步</view>
              <view class="weektype-btn" :class="{ on: !xlsSyncPeriods }" @tap="xlsSyncPeriods = false">保留现有</view>
            </view>
            <view v-if="xlsSyncPeriods && xlsKeepsPeriods" class="field-hint">
              现有节次表比 Excel 多，多出来的那几节保留（老学期的课不会消失）
            </view>
          </view>

          <view class="field-hint">
            {{ xlsMode === 'overwrite' ? '会先清空现有学期和课程，再写入这份课表' : '现有学期保留，这份课表另建一个学期' }}
          </view>

          <button class="btn-primary" :disabled="xlsBusy || !xlsStart" @tap="confirmXlsImport">
            {{ xlsBusy ? '导入中…' : '导入' }}
          </button>
        </view>
      </view>
    </view>

    <!-- 外观弹窗 -->
    <view v-if="showAppearanceModal" class="mask" @tap="closeAppearanceModal">
      <view class="modal appearance-modal" @tap.stop>
        <view class="modal-body">
          <view class="modal-title">外观</view>

          <view class="field">
            <text class="field-label">明暗模式</text>
            <view class="theme-row">
              <view class="theme-opt" :class="{ on: themeMode === 'light' }" @tap="selectThemeMode('light')">浅色</view>
              <view class="theme-opt" :class="{ on: themeMode === 'dark' }" @tap="selectThemeMode('dark')">深色</view>
              <view class="theme-opt" :class="{ on: themeMode === 'auto' }" @tap="selectThemeMode('auto')">跟随系统</view>
            </view>
          </view>

          <view class="field">
            <text class="field-label">强调色</text>
            <view class="accent-row">
              <view
                class="accent-dot"
                :class="{ sel: accent === a.value }"
                v-for="a in accents"
                :key="a.value"
                :style="{ background: a.color }"
                @tap="selectAccent(a.value)"
              ></view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  getUser, updateUser, listSemesters, createSemester, updateSemester,
  deleteSemester as deleteSemesterDb, exportAll, importAll,
  getCurrentSemester, setCurrentSemesterId
} from '../../services/database.js'
import { formatDate, getToday, weekMonday, addDays, isSameDay } from '../../utils/schedule.js'
import { resolveThemeClass, applyStatusBar, applyTabBar, applyNavBar } from '../../utils/theme.js'
import { pickBinaryFile } from '../../utils/pickFile.js'
import { parseXls } from '../../utils/xls.js'
import { inspectXlsTimetable, guessStartMonday, buildZaobaImport } from '../../utils/xlsTimetable.js'

const SEM_COLORS = ['#4F7CD4', '#3FA7C4', '#43A98B', '#E0993F', '#E05E4F', '#A072D6']
const WEEK_OPTIONS = Array.from({ length: 30 }, (_, i) => `第 ${i + 1} 周`)

export default {
  data() {
    return {
      nickname: '同学',
      themeMode: 'auto',
      accent: 'blue',
      themeClass: 'theme-blue mode-light',
      semesters: [],
      currentSemesterId: null,

      accents: [
        { value: 'blue', color: '#007aff' },
        { value: 'green', color: '#34c759' },
        { value: 'purple', color: '#af52de' },
        { value: 'orange', color: '#ff9500' }
      ],

      showNicknameModal: false,
      nicknameInput: '',

      showSemesterModal: false,
      editingSemesterId: null,
      semesterName: '',
      semesterMode: 'week',
      semesterWeek: 0,
      semesterStart: '',
      semesterWeekOptions: WEEK_OPTIONS,

      showAppearanceModal: false,

      showXlsModal: false,
      xlsParsed: null,
      xlsInfo: {
        semesterName: '', courseCount: 0, minWeek: 1, maxWeek: 1, noScheduleCount: 0, blocks: [],
        unparsedCells: 0, unparsedSamples: [], failedGroups: 0
      },
      xlsStart: '',
      xlsMode: 'overwrite',
      xlsSyncPeriods: true,
      xlsBusy: false,
      xlsKeepPeriods: []
    }
  },

  computed: {
    themeModeText() {
      return { light: '浅色', dark: '深色', auto: '跟随系统' }[this.themeMode] || '跟随系统'
    },
    accentText() {
      return { blue: '蓝', green: '绿', purple: '紫', orange: '橙' }[this.accent] || '蓝'
    },
    // 导入弹窗里「没认出来」那行的文案
    xlsUnparsedText() {
      const parts = []
      if (this.xlsInfo.unparsedCells) parts.push(`${this.xlsInfo.unparsedCells} 个格子`)
      if (this.xlsInfo.failedGroups) parts.push(`${this.xlsInfo.failedGroups} 处周次行`)
      const sample = (this.xlsInfo.unparsedSamples || []).join('；')
      return `${parts.join('、')}没解析出来，相关课程可能漏了${sample ? `（${sample}）` : ''}`
    },
    // Excel 只有 10 节、现有节次表更长时，会保留多出来的节次
    xlsKeepsPeriods() {
      const blocks = this.xlsInfo.blocks || []
      if (!blocks.length) return false
      const excelMax = blocks[blocks.length - 1].to || 0
      return this.maxPeriodIndex(this.xlsKeepPeriods) > excelMax
    },
    // 按周次录入时，开学日期 = 本周一 - (N-1)*7
    semesterStartFromWeek() {
      return formatDate(addDays(weekMonday(getToday()), -this.semesterWeek * 7))
    },
    semesterWeekText() {
      if (this.semesterMode === 'week') {
        return `开学第 1 周 = ${this.semesterStartFromWeek}`
      }
      return this.semesterStart ? `开学第 1 周 = ${this.semesterStart}` : ''
    }
  },

  async onLoad() {
    uni.$on('theme-changed', this.loadData)
    await this.loadData()
  },

  async onShow() {
    await this.loadData()
  },

  async onUnload() {
    uni.$off('theme-changed', this.loadData)
  },

  methods: {
    async loadData() {
      const user = await getUser()
      this.nickname = user.nickname || '同学'
      this.themeMode = user.themeMode || 'auto'
      this.accent = user.accent || 'blue'

      const list = await listSemesters()
      this.semesters = list.map((s, i) => ({
        ...s,
        color: SEM_COLORS[i % SEM_COLORS.length],
        subText: s.startDate ? `开学 ${s.startDate}` : '未设开学日期'
      }))
      // 当前学期读数据库里那一份（课表页用的是同一个），不在列表里会自动退回第一个
      const current = await getCurrentSemester()
      this.currentSemesterId = current ? current.id : null

      this.applyTheme()
    },

    applyTheme() {
      this.themeClass = resolveThemeClass(this.accent, this.themeMode)
      applyStatusBar(this.themeMode)
      applyTabBar(this.themeMode, this.accent)
      applyNavBar(this.themeMode)
    },

    goPeriods() {
      uni.navigateTo({ url: '/pages/periods/periods' })
    },

    // 教务导入：选学校 → 在 WebView 里登录教务 → 适配脚本回传课程 → 落库
    goSchoolImport() {
      uni.navigateTo({ url: '/pages/import/import' })
    },

    /* ---- 昵称 ---- */
    openNicknameModal() {
      this.nicknameInput = this.nickname
      this.showNicknameModal = true
    },
    closeNicknameModal() {
      this.showNicknameModal = false
    },
    async saveNickname() {
      const name = (this.nicknameInput || '').trim()
      if (!name) {
        this.showNicknameModal = false
        return
      }
      await updateUser({ nickname: name })
      this.nickname = name
      this.showNicknameModal = false
    },

    /* ---- 学期 ---- */
    openSemesterModal() {
      this.editingSemesterId = null
      this.semesterName = ''
      this.semesterMode = 'week'
      this.semesterWeek = 0
      this.semesterStart = ''
      this.showSemesterModal = true
    },
    editSemester(sem) {
      this.editingSemesterId = sem.id
      this.semesterName = sem.name
      if (sem.startDate) {
        this.semesterMode = 'date'
        this.semesterStart = sem.startDate
      } else {
        this.semesterMode = 'week'
        this.semesterWeek = 0
      }
      this.showSemesterModal = true
    },
    closeSemesterModal() {
      this.showSemesterModal = false
    },
    onSemesterWeekPicker(e) {
      this.semesterWeek = parseInt(e.detail.value)
    },
    onSemesterStartPicker(e) {
      this.semesterStart = e.detail.value
    },
    async submitSemester() {
      const name = (this.semesterName || '').trim()
      if (!name) {
        uni.showToast({ title: '请填学期名称', icon: 'none' })
        return
      }
      const startDate = this.semesterMode === 'week' ? this.semesterStartFromWeek : (this.semesterStart || '')
      try {
        if (this.editingSemesterId) {
          await updateSemester(this.editingSemesterId, { name, startDate })
        } else {
          const created = await createSemester({ name, startDate })
          // 新建即切过去（同小程序 addSemester 里的 setCurrentSemester）
          if (created && created.id) await setCurrentSemesterId(created.id)
        }
        this.showSemesterModal = false
        await this.loadData()
        uni.showToast({ title: '已保存', icon: 'success' })
      } catch (error) {
        console.error('保存学期失败', error)
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    },
    async setCurrentSemester(sem) {
      // 写库，课表页回来时读的就是这个学期
      await setCurrentSemesterId(sem.id)
      this.currentSemesterId = sem.id
      uni.showToast({ title: `已切换到 ${sem.name}`, icon: 'none' })
    },
    async deleteSemester(sem) {
      const confirmed = await new Promise(resolve => {
        uni.showModal({
          title: `删除「${sem.name}」`,
          content: '该学期下的课程会一起删除，无法恢复。',
          confirmText: '删除',
          confirmColor: '#e05e4f',
          success: res => resolve(res.confirm)
        })
      })
      if (!confirmed) return
      await deleteSemesterDb(sem.id)
      if (this.currentSemesterId === sem.id) this.currentSemesterId = null
      await this.loadData()
      uni.showToast({ title: '已删除', icon: 'success' })
    },

    /* ---- 外观 ---- */
    openAppearanceModal() {
      this.showAppearanceModal = true
    },
    closeAppearanceModal() {
      this.showAppearanceModal = false
    },
    async selectThemeMode(mode) {
      this.themeMode = mode
      await updateUser({ themeMode: mode })
      this.applyTheme()
      // 同小程序的 applyTheme 广播：别的 tab（课表页）立刻跟着换，不用等它 onShow
      uni.$emit('theme-changed')
    },
    async selectAccent(accent) {
      this.accent = accent
      await updateUser({ accent })
      this.applyTheme()
      uni.$emit('theme-changed')
    },

    /* ---- 数据 ---- */
    async exportData() {
      try {
        const data = await exportAll()
        uni.setClipboardData({
          data: JSON.stringify(data, null, 2),
          success: () => uni.showToast({ title: '已复制到剪贴板', icon: 'success' })
        })
      } catch (error) {
        console.error('导出失败', error)
        uni.showToast({ title: '导出失败', icon: 'none' })
      }
    },

    importData() {
      uni.showActionSheet({
        itemList: ['从剪贴板导入（早八 JSON）', '某高校课表（Excel .xls）'],
        success: (res) => {
          if (res.tapIndex === 0) this.importFromClipboard()
          else if (res.tapIndex === 1) this.importFromXls()
        }
      })
    },

    importFromClipboard() {
      uni.getClipboardData({
        success: (res) => {
          let data = null
          try {
            data = JSON.parse(res.data)
            if (!data.version || !Array.isArray(data.semesters) || !Array.isArray(data.courses)) throw new Error('format')
          } catch (e) {
            uni.showToast({ title: '剪贴板里不是课表数据', icon: 'none' })
            return
          }
          uni.showActionSheet({
            itemList: ['覆盖导入（清空现有）', '追加导入（保留现有）'],
            success: async (r) => {
              const mode = r.tapIndex === 0 ? 'overwrite' : 'append'
              try {
                const stats = await importAll(data, mode)
                // 导入会改昵称/节次表/主题/尺寸/学期，全部重读一遍；
                // 再广播一次，让课表页立刻跟着换主题和当前学期
                await this.loadData()
                uni.$emit('theme-changed')
                const skipped = stats.skipped ? `，跳过 ${stats.skipped} 条` : ''
                uni.showToast({
                  title: `导入 ${stats.semesters} 学期 / ${stats.courses} 课程${skipped}`,
                  icon: 'none',
                  duration: 2500
                })
              } catch (error) {
                console.error('导入失败', error)
                uni.showToast({ title: '导入失败', icon: 'none' })
              }
            }
          })
        }
      })
    },

    /* ---- 教务 Excel 导入 ---- */
    async importFromXls() {
      let bytes
      try {
        uni.showLoading({ title: '读取文件…', mask: true })
        bytes = await pickBinaryFile()
      } catch (error) {
        uni.hideLoading()
        if (error && error.message !== '已取消') {
          uni.showToast({ title: error.message || '选择文件失败', icon: 'none' })
        }
        return
      }

      try {
        const inspected = inspectXlsTimetable(parseXls(bytes))
        const user = await getUser()
        this.xlsKeepPeriods = (user && user.periods) || []
        this.xlsParsed = inspected
        this.xlsInfo = inspected
        this.xlsStart = guessStartMonday(inspected.semesterName)
        this.xlsMode = 'overwrite'
        this.xlsSyncPeriods = inspected.blocks.length > 0
        uni.hideLoading()
        this.showXlsModal = true
      } catch (error) {
        uni.hideLoading()
        console.error('解析 Excel 课表失败', error)
        uni.showToast({ title: error.message || '无法识别这个 Excel 课表', icon: 'none', duration: 3000 })
      }
    },
    onXlsStartPicker(e) {
      this.xlsStart = e.detail.value
    },
    maxPeriodIndex(list) {
      return (list || []).reduce((m, p) => Math.max(m, Number(p && p.index) || 0), 0)
    },
    closeXlsModal() {
      if (!this.xlsBusy) this.showXlsModal = false
    },
    async confirmXlsImport() {
      if (!this.xlsParsed || !this.xlsStart || this.xlsBusy) return
      this.xlsBusy = true
      try {
        const data = buildZaobaImport(this.xlsParsed, {
          startMonday: this.xlsStart,
          syncPeriods: this.xlsSyncPeriods,
          // 追加时老学期的课还在，节次表不能被砍短
          keepPeriods: this.xlsMode === 'append' ? this.xlsKeepPeriods : []
        })
        const stats = await importAll(data, this.xlsMode)
        this.showXlsModal = false
        await this.loadData()
        uni.$emit('theme-changed')
        const skipped = stats.skipped ? `，跳过 ${stats.skipped} 条` : ''
        uni.showToast({ title: `已导入 ${stats.courses} 条课程${skipped}`, icon: 'none', duration: 2500 })
      } catch (error) {
        console.error('导入 Excel 课表失败', error)
        uni.showToast({ title: error.message || '导入失败', icon: 'none' })
      } finally {
        this.xlsBusy = false
      }
    }
  }
}
</script>

<style scoped>
.page {
  height: 100vh;
  box-sizing: border-box;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  overflow-y: auto;
  background: var(--bg);
}

/* 用户卡片 */
.user-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  background: linear-gradient(135deg, var(--primary-grad-a), var(--primary-grad-b));
  border-radius: var(--radius-lg);
  padding: 40rpx 32rpx;
  color: #fff;
  box-shadow: 0 10rpx 24rpx var(--primary-shadow);
  flex-shrink: 0;
}
.user-avatar {
  width: 108rpx;
  height: 108rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  font-weight: 700;
  flex-shrink: 0;
}
.user-info { flex: 1; min-width: 0; }
.user-name { font-size: 38rpx; font-weight: 700; letter-spacing: 1rpx; }
.user-sub { font-size: 24rpx; opacity: 0.85; margin-top: 6rpx; }
.user-arrow { font-size: 36rpx; opacity: 0.9; flex-shrink: 0; }

/* 卡片 */
.card {
  background: var(--card);
  border-radius: var(--radius);
  overflow: hidden;
  flex-shrink: 0;
}
.card-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 32rpx;
}
.card-icon { font-size: 40rpx; }
.card-body { flex: 1; min-width: 0; }
.card-title { font-size: 30rpx; font-weight: 600; letter-spacing: 1rpx; color: var(--text); }
.card-sub { font-size: 24rpx; color: var(--text-sub); margin-top: 4rpx; }
.card-arrow { color: var(--text-faint); font-size: 32rpx; }

/* 学期列表 */
.sem-list {
  border-top: 1rpx solid var(--border);
  padding: 20rpx 24rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.sem-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
  background: var(--card-2);
  border-radius: var(--radius);
  border: 2rpx solid transparent;
}
.sem-card.on {
  background: var(--card);
  border-color: var(--primary);
  box-shadow: 0 6rpx 18rpx var(--primary-shadow);
}
.sem-bar { width: 8rpx; height: 56rpx; border-radius: 4rpx; flex-shrink: 0; }
.sem-body { flex: 1; min-width: 0; }
.sem-name { font-size: 30rpx; font-weight: 600; color: var(--text); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.sem-sub { font-size: 24rpx; color: var(--text-sub); margin-top: 6rpx; }
.sem-right { display: flex; align-items: center; gap: 16rpx; flex-shrink: 0; }
.sem-current {
  font-size: 22rpx;
  font-weight: 600;
  color: #fff;
  background: var(--primary);
  padding: 6rpx 18rpx;
  border-radius: var(--radius);
}
.sem-edit,
.sem-del {
  width: 52rpx;
  height: 52rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-faint);
  font-size: 28rpx;
  background: var(--card-2);
  border-radius: 50%;
}
.sem-card.on .sem-edit,
.sem-card.on .sem-del { background: var(--skeleton-2, var(--surface-3)); }

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
.appearance-modal { width: 600rpx; }
.modal-body {
  padding: 36rpx 32rpx 32rpx;
  overflow-y: auto;
  box-sizing: border-box;
  flex: 1;
  min-height: 0;
}
.modal-title {
  font-size: 32rpx;
  font-weight: 700;
  letter-spacing: 0.5rpx;
  text-align: center;
  color: var(--text);
  margin-bottom: 28rpx;
}

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
.field-hint { font-size: 23rpx; color: var(--text-sub); margin: -14rpx 0 24rpx; }

.picker-box {
  background: var(--card-2);
  border-radius: var(--radius-sm);
  padding: 20rpx 24rpx;
  font-size: 30rpx;
  color: var(--text);
  box-sizing: border-box;
}
.weektype-row { display: flex; gap: 12rpx; }
.weektype-btn {
  flex: 1;
  text-align: center;
  padding: 18rpx 0;
  border-radius: var(--radius-xs);
  background: var(--card-2);
  color: var(--text-sub);
  font-size: 24rpx;
}
.weektype-btn.on { background: var(--primary-soft); color: var(--primary); font-weight: 700; }
.date-pick-row { display: flex; align-items: center; gap: 12rpx; }
.date-pick { flex: 1; min-width: 0; }
.date-clear {
  flex-shrink: 0;
  padding: 20rpx 24rpx;
  background: var(--card-2);
  border-radius: var(--radius-sm);
  color: var(--text-sub);
  font-size: 26rpx;
}

.xls-summary {
  background: var(--card-2);
  border-radius: var(--radius-sm);
  padding: 20rpx 24rpx;
  margin-bottom: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.xls-summary-row { display: flex; align-items: baseline; gap: 16rpx; }
.xls-summary-k { flex-shrink: 0; width: 96rpx; font-size: 23rpx; color: var(--text-sub); }
.xls-summary-v { flex: 1; min-width: 0; font-size: 25rpx; color: var(--text); }
.xls-warn { color: var(--danger); }

.theme-row { display: flex; gap: 16rpx; }
.theme-opt {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  border-radius: var(--radius-sm);
  background: var(--card-2);
  color: var(--text-sub);
  font-size: 26rpx;
}
.theme-opt.on { background: var(--primary-soft); color: var(--primary); font-weight: 600; }

.accent-row { display: flex; gap: 28rpx; padding: 8rpx 0; }
.accent-dot {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  box-sizing: border-box;
  border: 4rpx solid transparent;
}
.accent-dot.sel { border-color: var(--text); transform: scale(1.12); }

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

@keyframes maskIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes modalIn {
  from { opacity: 0; transform: scale(0.92) translateY(28rpx); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
