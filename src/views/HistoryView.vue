<template>
  <div class="min-h-screen">
    <div class="sticky top-0 bg-ios-gray-50 z-10 pt-6 pb-4 px-5">
      <div class="flex items-center justify-between max-w-md mx-auto">
        <h1 class="text-3xl font-bold text-gray-900">
          断食历史
        </h1>
        <div class="flex items-center gap-2">
          <button
            @click="showExportMenu = !showExportMenu"
            class="relative text-ios-gray-700 text-sm font-medium active:opacity-60 w-8 h-8 flex items-center justify-center"
          >
            <Settings class="w-5 h-5" />
          </button>
          
          <!-- 导出/导入菜单 -->
          <div
            v-if="showExportMenu"
            class="absolute right-5 top-20 bg-white rounded-2xl shadow-lg border border-ios-gray-200 overflow-hidden z-10"
          >
            <button
              @click="exportData"
              class="w-full px-4 py-3 text-left text-sm hover:bg-ios-gray-50 active:bg-ios-gray-100"
            >
              导出数据
            </button>
            <button
              @click="triggerImport"
              class="w-full px-4 py-3 text-left text-sm hover:bg-ios-gray-50 active:bg-ios-gray-100 border-t border-ios-gray-200"
            >
              导入数据
            </button>
            <button
              v-if="history.length > 0"
              @click="showClearModal = true; showExportMenu = false"
              class="w-full px-4 py-3 text-left text-sm hover:bg-ios-gray-50 active:bg-ios-gray-100 border-t border-ios-gray-200 text-ios-red"
            >
              清空数据
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="px-5 pb-6 max-w-md mx-auto">

    <!-- 隐藏的文件选择器 -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      @change="handleFileImport"
      class="hidden"
    />

    <!-- 统计卡片 -->
    <div v-if="history.length > 0" class="grid grid-cols-2 gap-3 mb-6">
      <div class="bg-white rounded-2xl shadow-sm p-4">
        <div class="text-sm text-ios-gray-500 mb-1">总次数</div>
        <div class="text-2xl font-bold text-gray-900">{{ history.length }}</div>
      </div>
      <div class="bg-white rounded-2xl shadow-sm p-4">
        <div class="text-sm text-ios-gray-500 mb-1">成功率</div>
        <div class="text-2xl font-bold text-ios-green">{{ successRate }}%</div>
      </div>
    </div>

    <!-- 历史记录列表 -->
    <div v-if="history.length === 0" 
         class="flex flex-col items-center justify-center py-20">
      <FileText class="w-16 h-16 text-ios-gray-300 mb-4" />
      <p class="text-ios-gray-500">暂无断食记录</p>
      <p class="text-sm text-ios-gray-400 mt-2">开始第一次断食吧</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="(item, index) in reversedHistory"
        :key="item.end"
        class="bg-white rounded-2xl shadow-sm p-5"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-2xl font-bold text-gray-900">
                {{ item.hours.toFixed(1) }}
              </span>
              <span class="text-sm text-ios-gray-600">小时</span>
            </div>
            <div class="text-xs text-ios-gray-400">
              第 {{ history.length - index }} 次断食
            </div>
          </div>
          <div
            :class="[
              'px-3 py-1 rounded-full text-xs font-semibold',
              item.success 
                ? 'bg-ios-green/10 text-ios-green' 
                : 'bg-ios-red/10 text-ios-red'
            ]"
          >
            {{ item.success ? '成功' : '未达标' }}
          </div>
        </div>

        <div class="space-y-1.5 text-sm">
          <div class="flex items-center gap-2 text-ios-gray-600">
            <span class="text-ios-gray-500">开始</span>
            <span>{{ formatTime(item.start) }}</span>
          </div>
          <div class="flex items-center gap-2 text-ios-gray-600">
            <span class="text-ios-gray-500">结束</span>
            <span>{{ formatTime(item.end) }}</span>
          </div>
          <div v-if="item.reason" class="flex items-start gap-2 pt-2 mt-2 border-t border-ios-gray-200">
            <div>
              <span class="text-ios-gray-500">提前结束：</span>
              <span class="text-orange-600">{{ item.reason }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ClearDataModal
      v-if="showClearModal"
      :record-count="history.length"
      @confirm="confirmClearAll"
      @cancel="showClearModal = false"
    />

    <!-- 导入成功提示 -->
    <div
      v-if="showImportSuccess"
      class="fixed bottom-24 left-1/2 -translate-x-1/2 bg-ios-green text-white px-6 py-3 rounded-full shadow-lg z-50"
    >
      <span class="font-medium">导入成功，共 {{ importCount }} 条记录</span>
    </div>

    <!-- 导出成功提示 -->
    <div
      v-if="showExportSuccess"
      class="fixed bottom-24 left-1/2 -translate-x-1/2 bg-ios-blue text-white px-6 py-3 rounded-full shadow-lg z-50"
    >
      <span class="font-medium">导出成功</span>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Settings, FileText } from 'lucide-vue-next'
import { formatTime } from '@/utils/time'
import ClearDataModal from '@/components/ClearDataModal.vue'
import { getItem, setItem, removeItem } from '@/utils/db'

const KEY_HIS = 'fast_history_v2'

// ========= storage 工具函数 =========
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
const history = ref([])
const showExportMenu = ref(false)
const showClearModal = ref(false)
const showImportSuccess = ref(false)
const showExportSuccess = ref(false)
const importCount = ref(0)
const fileInput = ref(null)

onMounted(async () => {
  history.value = await loadHistory()
})

// ========= 计算属性 =========
const reversedHistory = computed(() => {
  return history.value.slice().reverse()
})

const successRate = computed(() => {
  if (history.value.length === 0) return 0
  const successCount = history.value.filter(item => item.success).length
  return Math.round((successCount / history.value.length) * 100)
})

// ========= 行为函数 =========
const exportData = () => {
  const exportData = {
    version: '1.0',
    exportTime: Date.now(),
    records: history.value
  }

  const dataStr = JSON.stringify(exportData, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `168fasting-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  showExportMenu.value = false
  showExportSuccess.value = true
  setTimeout(() => {
    showExportSuccess.value = false
  }, 3000)
}

const triggerImport = () => {
  showExportMenu.value = false
  fileInput.value?.click()
}

const handleFileImport = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const importData = JSON.parse(e.target.result)
      
      // 验证数据格式
      if (!importData.records || !Array.isArray(importData.records)) {
        alert('数据格式错误')
        return
      }

      // 合并数据（去重）
      const existingRecords = history.value
      const newRecords = importData.records.filter(newRecord => {
        return !existingRecords.some(existing => 
          existing.start === newRecord.start && existing.end === newRecord.end
        )
      })

      if (newRecords.length === 0) {
        alert('没有新数据需要导入')
        return
      }

      // 合并并排序
      const merged = [...existingRecords, ...newRecords].sort((a, b) => a.end - b.end)
      history.value = merged
      await saveHistory(history.value)

      importCount.value = newRecords.length
      showImportSuccess.value = true
      setTimeout(() => {
        showImportSuccess.value = false
      }, 3000)
    } catch (error) {
      alert('导入失败：文件格式错误')
    }
  }
  reader.readAsText(file)
  
  // 重置文件输入
  event.target.value = ''
}

const clearAll = async () => {
  await removeItem(KEY_HIS)
  history.value = []
  showClearModal.value = false
}

const confirmClearAll = () => {
  clearAll()
}
</script>

