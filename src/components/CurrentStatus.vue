<template>
  <div class="mb-8">
    <div class="text-sm font-semibold mb-3 text-ios-gray-600 px-1">
      当前状态
    </div>
    <div class="bg-white rounded-3xl shadow-sm p-6">
      <div class="flex items-center gap-3 text-ios-gray-600 mb-4">
        <Moon class="w-6 h-6" />
        <span class="text-lg font-medium">空闲中</span>
      </div>
      <p class="text-sm text-ios-gray-500">
        点击"开始断食"按钮选择最后进食时间，开始新的断食周期
      </p>
    </div>
  </div>
</template>

<script setup>
import { Moon } from 'lucide-vue-next'
</script>

