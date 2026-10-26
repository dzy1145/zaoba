<template>
  <view class="page" :class="themeClass">
    <view class="head">
      <view class="head-title">节次表</view>
      <view class="head-desc">自定义每节课的起止时间，仅自己可见</view>
    </view>

    <scroll-view class="list" scroll-y>
      <view class="period-item" v-for="(item, index) in periods" :key="index">
        <view class="period-no">{{ item.index }}</view>
        <picker mode="time" :value="item.start" @change="onStartChange(index, $event)">
          <view class="time-box">{{ item.start }}</view>
        </picker>
        <view class="period-dash">—</view>
        <picker mode="time" :value="item.end" @change="onEndChange(index, $event)">
          <view class="time-box">{{ item.end }}</view>
        </picker>
        <view class="period-del" @tap.stop="removePeriod(index)">✕</view>
      </view>

      <view class="list-pad"></view>
    </scroll-view>

    <view class="actions">
      <button class="btn-primary" @tap="addPeriod">＋ 添加节次</button>
    </view>
  </view>
</template>

<script>
import { getUser, updateUser, DEFAULT_PERIODS } from '../../services/database.js'
import { resolveThemeClass, applyStatusBar, applyNavBar } from '../../utils/theme.js'

export default {
  data() {
    return {
      periods: [],
      themeClass: 'theme-blue mode-light'
    }
  },

  async onLoad() {
    uni.$on('theme-changed', this.loadPeriods)
    await this.loadPeriods()
  },

  async onUnload() {
    uni.$off('theme-changed', this.loadPeriods)
  },

  methods: {
    async loadPeriods() {
      const user = await getUser()
      this.periods = JSON.parse(JSON.stringify(user.periods || DEFAULT_PERIODS))
      this.themeClass = resolveThemeClass(user.accent, user.themeMode)
      applyStatusBar(user.themeMode)
      applyNavBar(user.themeMode)
    },

    async persist() {
      await updateUser({ periods: this.periods })
    },

    onStartChange(index, e) {
      this.periods[index].start = e.detail.value
      this.persist()
    },

    onEndChange(index, e) {
      this.periods[index].end = e.detail.value
      this.persist()
    },

    addPeriod() {
      const last = this.periods[this.periods.length - 1]
      const newIndex = last.index + 1
      const [h, m] = last.end.split(':').map(Number)
      const startMin = h * 60 + m + 5
      const fmt = (mins) => `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`
      this.periods.push({ index: newIndex, start: fmt(startMin), end: fmt(startMin + 45) })
      this.persist()
      uni.showToast({ title: `已添加第 ${newIndex} 节`, icon: 'none' })
    },

    removePeriod(index) {
      if (this.periods.length <= 1) return
      uni.showModal({
        title: `删除第 ${this.periods[index].index} 节`,
        confirmText: '删除',
        confirmColor: '#e05e4f',
        success: (res) => {
          if (!res.confirm) return
          this.periods.splice(index, 1)
          this.periods.forEach((p, i) => { p.index = i + 1 })
          this.persist()
        }
      })
    }
  }
}
</script>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 24rpx;
  gap: 24rpx;
  background: var(--bg);
}

.head-title {
  font-size: 36rpx;
  font-weight: 600;
  color: var(--text);
}

.head-desc {
  font-size: 24rpx;
  color: var(--text-sub);
  margin-top: 8rpx;
}

.list {
  flex: 1;
  min-height: 0;
}

.period-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  background: var(--card);
  border-radius: var(--radius);
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.period-no {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: var(--primary-soft);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 600;
  flex-shrink: 0;
}

.time-box {
  background: var(--card-2);
  border-radius: var(--radius-xs);
  padding: 16rpx 24rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.period-dash {
  color: var(--text-faint);
}

.period-del {
  margin-left: auto;
  width: 52rpx;
  height: 52rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-faint);
  font-size: 28rpx;
  flex-shrink: 0;
}

.list-pad {
  height: 20rpx;
}

.actions {
  padding-bottom: 20rpx;
}

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

.btn-primary:active {
  opacity: 0.92;
  transform: scale(0.98);
}
</style>
