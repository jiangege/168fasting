<template>
  <div class="mb-8">
    <!-- 空闲状态 -->
    <template v-if="status === 'idle'">
      <button
        @click="$emit('startFasting')"
        class="w-full bg-ios-blue text-white font-semibold text-lg py-4 rounded-2xl shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
      >
        <Play class="w-5 h-5" />
        开始断食
      </button>
    </template>

    <!-- 断食中状态 -->
    <template v-else>
      <button
        @click="$emit('endEarly')"
        class="w-full bg-orange-500 text-white font-semibold text-lg py-4 rounded-2xl shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
      >
        <StopCircle class="w-5 h-5" />
        提前结束
      </button>
    </template>
  </div>
</template>

<script setup>
import { Play, StopCircle } from 'lucide-vue-next'

defineProps({
  status: String
})

defineEmits(['startFasting', 'endEarly'])
</script>

