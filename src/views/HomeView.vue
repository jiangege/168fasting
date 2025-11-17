<template>
  <div class="min-h-screen">
    <div class="sticky top-0 bg-ios-gray-50 z-10 pt-6 pb-4 px-5">
      <h1 class="text-center text-3xl font-bold text-gray-900">
        168 断食追踪
      </h1>
    </div>

    <div class="px-5 pb-6 max-w-md mx-auto">
      <CurrentStatus
        v-if="fastingStatus === 'idle'"
      />

      <FastingProgress
        v-else
        :start-time="fastingStartTime"
        :target-hours="TARGET"
        :now="nowTick"
      />

      <Actions
        :status="fastingStatus"
        @start-fasting="showStartModal = true"
        @end-early="showEndModal = true"
      />
    </div>

    <StartFastingModal
      v-if="showStartModal"
      @confirm="startFasting"
      @cancel="showStartModal = false"
    />

    <EndEarlyModal
      v-if="showEndModal"
      :fasting-hours="fastingHours"
      @confirm="endFasting"
      @cancel="showEndModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, toRaw } from 'vue'
import CurrentStatus from '@/components/CurrentStatus.vue'
import FastingProgress from '@/components/FastingProgress.vue'
import Actions from '@/components/Actions.vue'
import StartFastingModal from '@/components/StartFastingModal.vue'
import EndEarlyModal from '@/components/EndEarlyModal.vue'
import { getItem, setItem, removeItem } from '@/utils/db'

const KEY_STATUS = 'fast_status_v2'
const KEY_START = 'fast_start_v2'
const KEY_HIS = 'fast_history_v2'
const TARGET = 16

// ========= storage 工具函数 =========
const loadStatus = async () => {
  const v = await getItem(KEY_STATUS)
  return v === 'fasting' ? 'fasting' : 'idle'
}

const saveStatus = async (status) => {
  await setItem(KEY_STATUS, status)
}

const loadStartTime = async () => {
  const v = await getItem(KEY_START)
  return Number.isFinite(v) ? v : null
}

const saveStartTime = async (ts) => {
  if (ts === null || ts === undefined) {
    await removeItem(KEY_START)
  } else {
    await setItem(KEY_START, ts)
  }
}

const loadHistory = async () => {
  try {
    const data = await getItem(KEY_HIS)
    return Array.isArray(data) ? data : []
  } catch (e) {
    return []
  }
}

const saveHistory = async (h) => {
  const arr = Array.isArray(h) ? h : []
  // 转换为纯对象，去除 Vue 响应式代理
  const plainArray = JSON.parse(JSON.stringify(arr))
  await setItem(KEY_HIS, plainArray)
}

// ========= 响应式状态 =========
const fastingStatus = ref('idle')
const fastingStartTime = ref(null)
const history = ref([])
const nowTick = ref(Date.now())
const showStartModal = ref(false)
const showEndModal = ref(false)

// ========= 定时器 =========
let timer = null

// 初始化数据
onMounted(async () => {
  fastingStatus.value = await loadStatus()
  fastingStartTime.value = await loadStartTime()
  history.value = await loadHistory()
  
  timer = setInterval(() => {
    nowTick.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// ========= 计算属性 =========
const fastingHours = computed(() => {
  if (!fastingStartTime.value) return 0
  return (nowTick.value - fastingStartTime.value) / 3600000
})

// ========= 行为函数 =========
const startFasting = async (timestamp) => {
  fastingStartTime.value = timestamp
  fastingStatus.value = 'fasting'
  
  await saveStartTime(timestamp)
  await saveStatus('fasting')
  showStartModal.value = false
}

const endFasting = async (reason) => {
  const now = Date.now()
  const hours = (now - fastingStartTime.value) / 3600000
  
  const record = {
    start: fastingStartTime.value,
    end: now,
    hours,
    success: hours >= TARGET,
    reason: reason || null
  }

  const arr = Array.isArray(history.value) ? history.value.slice() : []
  arr.push(record)
  history.value = arr
  await saveHistory(history.value)

  // 重置状态
  fastingStatus.value = 'idle'
  fastingStartTime.value = null
  await saveStatus('idle')
  await saveStartTime(null)
  showEndModal.value = false
}
</script>

