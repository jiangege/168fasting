<template>
  <div class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end justify-center z-[100]">
    <div class="bg-white rounded-t-3xl shadow-xl w-full max-w-md transform transition-all">
      <!-- 顶部标题栏 -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-ios-gray-200">
        <button
          @click="$emit('cancel')"
          class="text-ios-blue font-medium text-base active:opacity-60"
        >
          取消
        </button>
        <h2 class="text-base font-semibold text-gray-900">
          最后进食时间
        </h2>
        <button
          @click="confirm"
          class="text-ios-blue font-semibold text-base active:opacity-60"
        >
          确定
        </button>
      </div>

      <!-- iOS 风格时间选择器 -->
      <div class="py-4">
        <div class="relative h-64 overflow-hidden">
          <!-- 选中区域高亮 -->
          <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-11 bg-ios-gray-100/50 rounded-lg mx-4 pointer-events-none z-0"></div>
          <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-11 border-t border-b border-ios-gray-300 mx-4 pointer-events-none z-0"></div>

          <!-- 渐变遮罩 -->
          <div class="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>
          <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>

          <div class="flex h-full relative z-[5]">
            <!-- 月份选择器 -->
            <div class="flex-1 relative">
              <div
                ref="monthPickerRef"
                class="h-full overflow-y-scroll scrollbar-hide"
                @scroll="onMonthScroll"
              >
                <div class="h-[110px]"></div>
                <div
                  v-for="month in months"
                  :key="month"
                  class="h-11 flex items-center justify-center text-lg transition-all"
                  :class="selectedMonth === month ? 'text-gray-900' : 'text-ios-gray-400'"
                >
                  {{ month }}月
                </div>
                <div class="h-[110px]"></div>
              </div>
            </div>

            <!-- 日期选择器 -->
            <div class="flex-1 relative">
              <div
                ref="dayPickerRef"
                class="h-full overflow-y-scroll scrollbar-hide"
                @scroll="onDayScroll"
              >
                <div class="h-[110px]"></div>
                <div
                  v-for="day in days"
                  :key="day"
                  class="h-11 flex items-center justify-center text-lg transition-all"
                  :class="selectedDay === day ? 'text-gray-900' : 'text-ios-gray-400'"
                >
                  {{ day }}日
                </div>
                <div class="h-[110px]"></div>
              </div>
            </div>

            <!-- 小时选择器 -->
            <div class="flex-1 relative">
              <div
                ref="hourPickerRef"
                class="h-full overflow-y-scroll scrollbar-hide"
                @scroll="onHourScroll"
              >
                <div class="h-[110px]"></div>
                <div
                  v-for="hour in hours"
                  :key="hour"
                  class="h-11 flex items-center justify-center text-lg transition-all"
                  :class="selectedHour === hour ? 'text-gray-900' : 'text-ios-gray-400'"
                >
                  {{ String(hour).padStart(2, '0') }}
                </div>
                <div class="h-[110px]"></div>
              </div>
            </div>

            <!-- 分钟选择器 -->
            <div class="flex-1 relative">
              <div
                ref="minutePickerRef"
                class="h-full overflow-y-scroll scrollbar-hide"
                @scroll="onMinuteScroll"
              >
                <div class="h-[110px]"></div>
                <div
                  v-for="minute in minutes"
                  :key="minute"
                  class="h-11 flex items-center justify-center text-lg transition-all"
                  :class="selectedMinute === minute ? 'text-gray-900' : 'text-ios-gray-400'"
                >
                  {{ String(minute).padStart(2, '0') }}
                </div>
                <div class="h-[110px]"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 text-center text-sm text-ios-gray-600 px-5">
          将于 <span class="font-semibold text-gray-900">{{ targetTimeText }}</span> 达到目标
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { formatTime } from '@/utils/time'

const emit = defineEmits(['confirm', 'cancel'])

// Picker refs
const monthPickerRef = ref(null)
const dayPickerRef = ref(null)
const hourPickerRef = ref(null)
const minutePickerRef = ref(null)

// 选中的值
const selectedMonth = ref(1)
const selectedDay = ref(1)
const selectedHour = ref(0)
const selectedMinute = ref(0)

// 当前年份
const currentYear = ref(new Date().getFullYear())

// 选项数组
const months = Array.from({ length: 12 }, (_, i) => i + 1)
const days = computed(() => {
  const daysInMonth = new Date(currentYear.value, selectedMonth.value, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => i + 1)
})
const hours = Array.from({ length: 24 }, (_, i) => i)
const minutes = Array.from({ length: 60 }, (_, i) => i)

const ITEM_HEIGHT = 44

// 滚动处理
const onMonthScroll = () => {
  if (!monthPickerRef.value) return
  const scrollTop = monthPickerRef.value.scrollTop
  const index = Math.round(scrollTop / ITEM_HEIGHT)
  selectedMonth.value = months[index]
}

const onDayScroll = () => {
  if (!dayPickerRef.value) return
  const scrollTop = dayPickerRef.value.scrollTop
  const index = Math.round(scrollTop / ITEM_HEIGHT)
  selectedDay.value = days.value[index]
}

const onHourScroll = () => {
  if (!hourPickerRef.value) return
  const scrollTop = hourPickerRef.value.scrollTop
  const index = Math.round(scrollTop / ITEM_HEIGHT)
  selectedHour.value = hours[index]
}

const onMinuteScroll = () => {
  if (!minutePickerRef.value) return
  const scrollTop = minutePickerRef.value.scrollTop
  const index = Math.round(scrollTop / ITEM_HEIGHT)
  selectedMinute.value = minutes[index]
}

// 初始化滚动位置
const initScrollPositions = () => {
  const now = new Date()
  selectedMonth.value = now.getMonth() + 1
  selectedDay.value = now.getDate()
  selectedHour.value = now.getHours()
  selectedMinute.value = now.getMinutes()

  nextTick(() => {
    if (monthPickerRef.value) {
      monthPickerRef.value.scrollTop = (selectedMonth.value - 1) * ITEM_HEIGHT
    }
    if (dayPickerRef.value) {
      dayPickerRef.value.scrollTop = (selectedDay.value - 1) * ITEM_HEIGHT
    }
    if (hourPickerRef.value) {
      hourPickerRef.value.scrollTop = selectedHour.value * ITEM_HEIGHT
    }
    if (minutePickerRef.value) {
      minutePickerRef.value.scrollTop = selectedMinute.value * ITEM_HEIGHT
    }
  })
}

onMounted(() => {
  initScrollPositions()
})

const selectedTimestamp = computed(() => {
  const date = new Date(currentYear.value, selectedMonth.value - 1, selectedDay.value)
  date.setHours(selectedHour.value)
  date.setMinutes(selectedMinute.value)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date.getTime()
})

const targetTimeText = computed(() => {
  const target = selectedTimestamp.value + 16 * 3600000
  return formatTime(target)
})

const confirm = () => {
  emit('confirm', selectedTimestamp.value)
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

.scrollbar-hide > div[class*="h-11"] {
  scroll-snap-align: center;
}
</style>

