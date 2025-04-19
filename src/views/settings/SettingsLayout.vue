<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="flex">
        <!-- 垂直标签页导航 -->
        <div class="w-64 bg-gray-50 border-r">
          <div class="p-4 border-b flex items-center justify-between">
            <h1 class="text-xl font-bold text-gray-800">设置</h1>
            <button
              @click="router.push('/')"
              class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
              title="返回主页"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>
          <nav class="p-2">
            <router-link
              v-for="tab in tabs"
              :key="tab.path"
              :to="tab.path"
              class="flex items-center px-4 py-3 text-gray-700 rounded-lg mb-1 transition-colors"
              :class="{ 'bg-blue-50 text-blue-600': isActive(tab.path) }"
            >
              <span class="mr-3">
                <component :is="tab.icon" class="w-5 h-5" />
              </span>
              {{ tab.name }}
            </router-link>
          </nav>
        </div>
        
        <!-- 内容区域 -->
        <div class="flex-1 p-6">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { KeyIcon, CogIcon, InformationCircleIcon } from '@/components/icons'

// 标签页配置
const tabs = [
  {
    name: 'API 密钥',
    path: '/settings/api-keys',
    icon: KeyIcon
  },
  {
    name: '常规设置',
    path: '/settings/general',
    icon: CogIcon
  },
  {
    name: '关于',
    path: '/settings/about',
    icon: InformationCircleIcon
  }
]

const route = useRoute()
const router = useRouter()

// 判断当前标签页是否激活
const isActive = (path: string) => {
  return route.path === path
}
</script>

<style scoped>
.router-link-active {
  @apply bg-blue-50 text-blue-600;
}
</style> 