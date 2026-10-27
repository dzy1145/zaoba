<template>
  <view class="page" :class="themeClass">
    <!-- H5 / 非 App 环境 -->
    <view v-if="!supported" class="tip-box">
      <view class="tip-title">教务导入需要在手机 App 里使用</view>
      <view class="tip-desc">这个功能依赖系统的 WebView 去打开学校教务页面，H5 预览无法使用。</view>
    </view>

    <template v-else>
      <view class="search-box">
        <input
          class="search-input"
          v-model="keyword"
          placeholder="搜学校名或首字母，如 山东 / S"
          placeholder-class="ph"
          confirm-type="search"
        />
        <view v-if="keyword" class="search-clear" @tap="keyword = ''">✕</view>
      </view>

      <scroll-view class="school-list" scroll-y>
        <view
          class="school-row"
          v-for="school in filtered"
          :key="school.id"
          @tap="chooseSchool(school)"
        >
          <view class="school-main">
            <view class="school-name">{{ school.name }}</view>
            <view class="school-sub">{{ school.adapters.length }} 个适配器</view>
          </view>
          <view class="school-arrow">›</view>
        </view>

        <view v-if="!filtered.length" class="empty">没找到这所学校</view>
        <view class="list-pad"></view>
      </scroll-view>

      <view class="foot">适配脚本来自开源项目「拾光课程表」的适配库（MIT）</view>
    </template>

    <!-- 进度 -->
    <view v-if="busy" class="mask">
      <view class="busy-card">
        <view class="busy-text">{{ busyText }}</view>
        <button class="busy-cancel" @tap="cancelImport">取消</button>
      </view>
    </view>
  </view>
</template>

<script>
import { SCHOOL_INDEX } from '../../data/schoolIndex.js'
import { getAdapterScript } from '../../services/adapterSource.js'
import { runAdapterImport, closeImportWebview, isImportSupported } from '../../services/importWebview.js'
import { buildImportPlan, saveImportedTable } from '../../services/shiguangImport.js'
import { resolveThemeClass, applyStatusBar, applyNavBar } from '../../utils/theme.js'
import { getUser } from '../../services/database.js'

export default {
  data() {
    return {
      themeClass: 'theme-blue mode-light',
      supported: false,
      keyword: '',
      schools: [],
      busy: false,
      busyText: ''
    }
  },

  computed: {
    filtered() {
      const kw = (this.keyword || '').trim().toLowerCase()
      if (!kw) return this.schools
      return this.schools.filter((s) => {
        const name = (s.name || '').toLowerCase()
        const initial = (s.initial || '').toLowerCase()
        const id = (s.id || '').toLowerCase()
        return name.indexOf(kw) >= 0 || initial === kw || id.indexOf(kw) >= 0
      })
    }
  },

  async onLoad() {
    this.supported = isImportSupported()
    const user = await getUser()
    this.themeClass = resolveThemeClass(user.accent, user.themeMode)
    applyStatusBar(user.themeMode)
    applyNavBar(user.themeMode)
    this.schools = Array.isArray(SCHOOL_INDEX) ? SCHOOL_INDEX : []
  },

  onUnload() {
    closeImportWebview()
  },

  methods: {
    chooseSchool(school) {
      if (!school.adapters || !school.adapters.length) {
        uni.showToast({ title: '这所学校还没有适配脚本', icon: 'none' })
        return
      }
      if (school.adapters.length === 1) {
        this.startImport(school, school.adapters[0])
        return
      }
      uni.showActionSheet({
        itemList: school.adapters.map((a) => a.name),
        success: (res) => {
          const adapter = school.adapters[res.tapIndex]
          if (adapter) this.startImport(school, adapter)
        }
      })
    },

    async startImport(school, adapter) {
      if (this.busy) return
      this.busy = true
      this.busyText = '正在准备适配脚本…'
      try {
        const script = await getAdapterScript({ folder: school.folder, assetJsPath: adapter.assetJsPath })
        this.busyText = '请在打开的页面里登录教务系统'
        const data = await runAdapterImport({
          schoolName: school.name,
          adapter,
          script,
          onEvent: (e) => {
            if (e && e.message) this.busyText = e.message
          }
        })
        if (!data.coursesJson) throw new Error('适配脚本没有回传课程数据')
        this.busyText = '正在整理成早八课表…'
        const combo = safeParse(data.comboScheduleJson, null)
        const plan = buildImportPlan({
          schoolName: school.name,
          adapterName: adapter.name,
          courses: safeParse(data.coursesJson, []),
          timeSlots: safeParse(data.timeSlotsJson, []),
          config: safeParse(data.configJson, null)
        })
        // 早八的节次表是全局一套，装不下「夏季/冬季两套作息」，只能按基础作息导
        if (combo && combo.publicSchedules && combo.publicSchedules.length) {
          plan.warnings.push('该学校有 ' + combo.publicSchedules.length + ' 套作息方案（如夏/冬季），早八只支持一套节次表，已按基础作息导入')
        }
        const saved = await saveImportedTable(plan, { syncPeriods: true })
        this.busy = false
        const warn = (saved.warnings && saved.warnings.length) ? '（有 ' + saved.warnings.length + ' 条提示）' : ''
        uni.showModal({
          title: '导入完成',
          content: '共 ' + (saved.courses || plan.courses.length) + ' 条课程已写入「' +
            plan.semester.name + '」' + warn,
          showCancel: false,
          success: () => uni.navigateBack()
        })
      } catch (error) {
        this.busy = false
        const msg = (error && error.message) ? error.message : '导入失败'
        if (msg !== '已取消') {
          uni.showModal({ title: '导入未完成', content: msg, showCancel: false })
        }
      }
    },

    cancelImport() {
      closeImportWebview()
      this.busy = false
    }
  }
}

function safeParse(text, fallback) {
  if (!text) return fallback
  try { return JSON.parse(text) } catch (e) { return fallback }
}
</script>

<style scoped>
.page {
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  padding: 20rpx 24rpx 0;
}

.tip-box {
  margin-top: 120rpx;
  padding: 40rpx 32rpx;
  background: var(--card);
  border-radius: var(--radius);
}
.tip-title { font-size: 32rpx; font-weight: 600; color: var(--text); }
.tip-desc { margin-top: 16rpx; font-size: 26rpx; color: var(--text-sub); line-height: 1.6; }

.search-box {
  display: flex;
  align-items: center;
  background: var(--card);
  border-radius: var(--radius);
  padding: 0 24rpx;
  flex-shrink: 0;
}
.search-input {
  flex: 1;
  height: 84rpx;
  font-size: 28rpx;
  color: var(--text);
}
.ph { color: var(--text-faint); }
.search-clear { color: var(--text-faint); font-size: 26rpx; padding-left: 16rpx; }

.school-list { flex: 1; min-height: 0; margin-top: 20rpx; }
.school-row {
  display: flex;
  align-items: center;
  padding: 26rpx 24rpx;
  background: var(--card);
  border-radius: var(--radius);
  margin-bottom: 14rpx;
}
.school-main { flex: 1; min-width: 0; }
.school-name { font-size: 30rpx; font-weight: 600; color: var(--text); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.school-sub { margin-top: 6rpx; font-size: 23rpx; color: var(--text-sub); }
.school-arrow { color: var(--text-faint); font-size: 30rpx; }
.empty { text-align: center; color: var(--text-sub); font-size: 26rpx; padding: 60rpx 0; }
.list-pad { height: 24rpx; }
.foot {
  flex-shrink: 0;
  padding: 16rpx 0 24rpx;
  text-align: center;
  font-size: 22rpx;
  color: var(--text-faint);
}

.mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(12, 14, 20, 0.34);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.busy-card {
  width: 520rpx;
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 40rpx 32rpx 28rpx;
  box-shadow: var(--shadow-float);
}
.busy-text { font-size: 28rpx; color: var(--text); line-height: 1.6; text-align: center; }
.busy-cancel {
  margin-top: 28rpx;
  background: var(--card-2);
  color: var(--text-sub);
  border-radius: var(--radius);
  font-size: 28rpx;
  padding: 18rpx 0;
}
</style>
