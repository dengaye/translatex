<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800">API 密钥设置</h2>
      <button
        @click="router.push('/')"
        class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        title="返回主页"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>
    </div>
    
    <!-- 翻译服务选择器 -->
    <div class="mb-8">
      <div class="flex space-x-2 overflow-x-auto pb-2">
        <button
          v-for="service in translationServiceKeys"
          :key="service.id"
          @click="currentServiceId = service.id"
          class="px-4 py-2 rounded-lg whitespace-nowrap transition-colors"
          :class="currentServiceId === service.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          {{ service.name }}
        </button>
      </div>
    </div>
    
    <!-- 当前选中服务的设置表单 -->
    <div v-if="currentService" class="bg-gray-50 rounded-lg p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-700">{{ currentService.name }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ currentService.description }}</p>
      </div>
      
      <div class="space-y-4">
        <div v-for="field in currentService.apiKeys" :key="field.name" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">{{ field.label }}</label>
          <div class="relative">
            <input
              v-model="form[field.name]"
              :type="field.type || 'text'"
              :placeholder="field.placeholder"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {{ field.type === 'password' ? '🔒' : '🔑' }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="mt-6 flex justify-end">
        <button
          @click="saveApiKeys"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          保存密钥
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useRouter } from 'vue-router'
import { translationServiceKeys } from '@/config/translation-service-keys'

interface ApiKeys {
  [key: string]: string
}

const settingsStore = useSettingsStore()
const router = useRouter()
const currentServiceId = ref('youdao') // 默认选中有道翻译
const form = ref<ApiKeys>({})

// 当前选中的翻译服务
const currentService = computed(() => {
  return translationServiceKeys.find(service => service.id === currentServiceId.value)
})

onMounted(() => {
  // 初始化表单数据
  loadFormData()
})

// 加载表单数据
const loadFormData = () => {
  // 重置表单
  form.value = {}
  
  // 加载当前服务的 API 密钥
  if (currentService.value) {
    currentService.value.apiKeys.forEach(key => {
      form.value[key.name] = settingsStore.apiKeys[key.name] || ''
    })
  }
}

// 监听服务切换
watch(currentServiceId, () => {
  loadFormData()
})

// 保存 API 密钥
const saveApiKeys = () => {
  settingsStore.updateSettings({
    apiKeys: form.value
  })
  
  // 显示成功提示
  alert('API 密钥已保存')
}
</script> 