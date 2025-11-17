<template>
  <div class="mb-8">
    <div class="text-sm font-semibold mb-3 text-ios-gray-600 px-1">
      断食进行中
    </div>
    
    <div class="bg-white rounded-3xl shadow-sm p-8">
      <!-- 圆环进度条 -->
      <div class="relative w-56 h-56 mx-auto mb-6">
        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <!-- 背景圆环 -->
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="#f2f2f7"
            stroke-width="12"
          />
          <!-- 进度圆环 -->
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            :stroke="progressColor"
            stroke-width="12"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="progressOffset"
            class="transition-all duration-300"
          />
        </svg>
        
        <!-- 中心内容 -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <div class="text-4xl font-bold text-gray-900 mb-1">
            {{ remainingTime }}
          </div>
          <div class="text-sm text-ios-gray-500">
            剩余时间
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="grid grid-cols-2 gap-4 pt-6 border-t border-ios-gray-200">
        <div class="text-center">
          <div class="text-sm text-ios-gray-500 mb-1">已断食</div>
          <div class="text-lg font-semibold text-gray-900">
            {{ elapsedText }}
          </div>
        </div>
        <div class="text-center">
          <div class="text-sm text-ios-gray-500 mb-1">目标</div>
          <div class="text-lg font-semibold text-gray-900">
            {{ targetHours }} 小时
          </div>
        </div>
      </div>

      <!-- 进度百分比 -->
      <div class="mt-6 text-center">
        <div class="inline-flex items-baseline gap-1">
          <span class="text-3xl font-bold" :class="isCompleted ? 'text-ios-green' : 'text-ios-blue'">
            {{ progressPercent }}
          </span>
          <span class="text-lg text-ios-gray-600">%</span>
        </div>
        <div v-if="isCompleted" class="text-sm text-ios-green font-semibold mt-2 flex items-center justify-center gap-1">
          <CheckCircle2 class="w-4 h-4" />
          已达标
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CheckCircle2 } from 'lucide-vue-next'
import { formatCountdown, formatDuration, calculateProgress } from '@/utils/time'

const props = defineProps({
  startTime: Number,
  targetHours: Number,
  now: Number
})

const elapsed = computed(() => {
  return (props.now - props.startTime) / 3600000 // 转换为小时
})

const remaining = computed(() => {
  const remainingHours = props.targetHours - elapsed.value
  return Math.max(remainingHours * 3600000, 0) // 转换为毫秒
})

const remainingTime = computed(() => {
  if (remaining.value <= 0) return '00:00'
  return formatCountdown(remaining.value)
})

const elapsedText = computed(() => {
  return formatDuration(elapsed.value)
})

const progressPercent = computed(() => {
  return Math.min(Math.round(calculateProgress(props.startTime, props.now, props.targetHours)), 100)
})

const isCompleted = computed(() => {
  return elapsed.value >= props.targetHours
})

const progressColor = computed(() => {
  return isCompleted.value ? '#34c759' : '#007aff'
})

// 圆环相关计算
const circumference = 2 * Math.PI * 85
const progressOffset = computed(() => {
  const progress = Math.min(elapsed.value / props.targetHours, 1)
  return circumference * (1 - progress)
})
</script>

