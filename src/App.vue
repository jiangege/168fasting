<template>
  <div class="flex flex-col h-screen bg-ios-gray-50">
    <div class="flex-1 overflow-y-auto pb-20">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <TabBar />

    <!-- PWA 更新提示 -->
    <div
      v-if="needRefresh"
      class="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-ios-gray-200 p-4 z-[60] max-w-sm mx-4"
    >
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <RefreshCw class="w-5 h-5 text-ios-blue" />
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900 text-sm mb-1">
            发现新版本
          </h3>
          <p class="text-xs text-ios-gray-600 mb-3">
            应用已更新，点击刷新即可使用最新版本
          </p>
          <div class="flex gap-2">
            <button
              @click="updateServiceWorker"
              class="flex-1 py-2 px-3 bg-ios-blue text-white text-sm font-medium rounded-xl active:scale-95 transition-transform"
            >
              立即更新
            </button>
            <button
              @click="needRefresh = false"
              class="py-2 px-3 bg-ios-gray-100 text-ios-gray-700 text-sm font-medium rounded-xl active:scale-95 transition-transform"
            >
              稍后
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { RefreshCw } from 'lucide-vue-next'
import TabBar from './components/TabBar.vue'

const needRefresh = ref(false)

const { updateServiceWorker } = useRegisterSW({
  onNeedRefresh() {
    needRefresh.value = true
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})

onMounted(() => {
  // 检查是否通过 PWA 安装
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('Running as PWA')
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
