<template>
  <EmptyLayout>
    <div class="flex">
      <!-- 垂直标签页导航 -->
      <div class="w-64 bg-gray-50 border-r">
        <div class="p-4 border-b flex items-center justify-between">
          <h1 class="text-xl font-bold text-gray-800">设置</h1>
          <BackToHomeButton />
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
  </EmptyLayout>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { KeyIcon, InformationCircleIcon } from '@/components/icons'
  import EmptyLayout from '@/layouts/EmptyLayout.vue'
  import { BackToHomeButton } from '@/components/navigation'

  // 标签页配置
  const tabs = [
    {
      name: 'API 密钥',
      path: '/settings/api-keys',
      icon: KeyIcon
    },
    // {
    //   name: '常规设置',
    //   path: '/settings/general',
    //   icon: CogIcon
    // },
    {
      name: '关于',
      path: '/settings/about',
      icon: InformationCircleIcon
    }
  ]

  const route = useRoute()

  // 判断当前标签页是否激活
  const isActive = (path: string) => {
    return route.path === path
  }
</script>
