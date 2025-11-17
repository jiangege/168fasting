<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-ios-gray-200 safe-area-bottom z-50">
    <div class="max-w-md mx-auto px-4">
      <div class="flex items-center justify-around h-20">
        <router-link
          to="/"
          class="flex flex-col items-center justify-center flex-1 gap-1 py-2 transition-colors"
          :class="isActive('/') ? 'text-ios-blue' : 'text-ios-gray-500'"
        >
          <Timer class="w-6 h-6" />
          <span class="text-xs font-medium">断食</span>
        </router-link>

        <router-link
          to="/history"
          class="flex flex-col items-center justify-center flex-1 gap-1 py-2 transition-colors"
          :class="isActive('/history') ? 'text-ios-blue' : 'text-ios-gray-500'"
        >
          <History class="w-6 h-6" />
          <span class="text-xs font-medium">历史</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { Timer, History } from 'lucide-vue-next'

const route = useRoute()

const isActive = (path) => {
  return route.path === path
}
</script>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>

