<template>
  <div class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end justify-center z-[100] p-4">
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-md transform transition-all">
      <div class="p-6">
        <div class="flex items-center justify-center mb-6">
          <div class="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
            <AlertCircle class="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <h2 class="text-xl font-bold text-gray-900 mb-2 text-center">
          提前结束断食？
        </h2>
        
        <p class="text-sm text-ios-gray-600 text-center mb-6">
          您已断食 <span class="font-semibold text-gray-900">{{ formatDuration(fastingHours) }}</span>
        </p>

        <div class="mb-6">
          <label class="text-sm font-semibold text-ios-gray-600 mb-3 block">
            请选择原因（可选）
          </label>
          
          <div class="space-y-2">
            <button
              v-for="option in reasonOptions"
              :key="option.text"
              @click="selectedReason = option.text"
              :class="[
                'w-full py-3 px-4 rounded-xl text-left font-medium transition-all flex items-center gap-2',
                selectedReason === option.text
                  ? 'bg-ios-blue text-white'
                  : 'bg-ios-gray-100 text-gray-700 active:scale-98'
              ]"
            >
              <span class="text-lg">{{ option.emoji }}</span>
              {{ option.text }}
            </button>
          </div>

          <div v-if="selectedReason === '其他原因'" class="mt-3">
            <input
              v-model="customReason"
              type="text"
              placeholder="请输入具体原因"
              class="w-full px-4 py-3 rounded-xl border border-ios-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-ios-blue"
            />
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="$emit('cancel')"
            class="flex-1 py-3 px-4 rounded-2xl font-semibold text-ios-gray-700 bg-ios-gray-100 active:scale-98 transition-transform"
          >
            继续断食
          </button>
          <button
            @click="confirm"
            class="flex-1 py-3 px-4 rounded-2xl font-semibold text-white bg-orange-500 active:scale-98 transition-transform"
          >
            确认结束
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { AlertCircle } from 'lucide-vue-next'
import { formatDuration } from '@/utils/time'

const props = defineProps({
  fastingHours: Number
})

const emit = defineEmits(['confirm', 'cancel'])

const reasonOptions = [
  { text: '社交聚餐', emoji: '🍽️' },
  { text: '身体不适', emoji: '🤕' },
  { text: '工作需要', emoji: '💼' },
  { text: '其他原因', emoji: '💭' }
]

const selectedReason = ref(null)
const customReason = ref('')

const finalReason = computed(() => {
  if (!selectedReason.value) return null
  if (selectedReason.value === '其他原因' && customReason.value) {
    return customReason.value
  }
  return selectedReason.value
})

const confirm = () => {
  emit('confirm', finalReason.value)
}
</script>

