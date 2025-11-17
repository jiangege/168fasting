<template>
  <div class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-sm transform transition-all">
      <div class="p-6">
        <div class="flex items-center justify-center mb-6">
          <div class="w-16 h-16 rounded-full bg-ios-red/10 flex items-center justify-center">
            <AlertTriangle class="w-8 h-8 text-ios-red" />
          </div>
        </div>

        <h2 class="text-xl font-bold text-gray-900 mb-2 text-center">
          确认清空数据？
        </h2>
        
        <p class="text-sm text-ios-gray-600 text-center mb-6">
          此操作将永久删除所有断食记录和状态，无法恢复。
        </p>

        <div class="bg-ios-red/10 rounded-2xl p-4 mb-6">
          <div class="text-sm text-ios-red space-y-1">
            <div>共 <span class="font-bold">{{ recordCount }}</span> 条记录将被删除</div>
            <div>建议先导出备份再清空</div>
          </div>
        </div>

        <div class="mb-6">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="confirmed"
              type="checkbox"
              class="w-5 h-5 rounded border-ios-gray-300 text-ios-red focus:ring-ios-red"
            />
            <span class="text-sm text-gray-700">我已知晓此操作不可恢复</span>
          </label>
        </div>

        <div class="flex gap-3">
          <button
            @click="$emit('cancel')"
            class="flex-1 py-3 px-4 rounded-2xl font-semibold text-ios-gray-700 bg-ios-gray-100 active:scale-98 transition-transform"
          >
            取消
          </button>
          <button
            @click="$emit('confirm')"
            :disabled="!confirmed"
            :class="[
              'flex-1 py-3 px-4 rounded-2xl font-semibold transition-transform',
              confirmed
                ? 'bg-ios-red text-white active:scale-98'
                : 'bg-ios-gray-200 text-ios-gray-400 cursor-not-allowed'
            ]"
          >
            确认清空
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'

defineProps({
  recordCount: Number
})

defineEmits(['confirm', 'cancel'])

const confirmed = ref(false)
</script>

