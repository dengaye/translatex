<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">API 密钥设置</h2>
    </div>

    <!-- 翻译服务选择器 -->
    <div class="mb-8">
      <div class="flex space-x-2 overflow-x-auto pb-2">
        <button
          v-for="service in translationServiceKeys"
          :key="service.id"
          @click="handleServiceChange(service.id)"
          class="px-4 py-2 rounded-lg whitespace-nowrap transition-colors"
          :class="
            currentServiceId === service.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          "
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
  import { translationServiceKeys, TranslationServiceIdMap } from '@/config/translation-service-keys'

  interface ApiKeys {
    [key: string]: string
  }

  const settingsStore = useSettingsStore()
  // 使用 settings store 中的翻译服务作为默认值
  const currentServiceId = ref(settingsStore.translationService)
  const form = ref<ApiKeys>({})

  // 当前选中的翻译服务
  const currentService = computed(() => {
    return translationServiceKeys.find(service => service.id === currentServiceId.value)
  })

  onMounted(() => {
    // 确保当前服务ID与store中的一致
    currentServiceId.value = settingsStore.translationService
    loadFormData()
  })

  // 处理服务切换
  const handleServiceChange = (serviceId: string) => {
    // 确保serviceId是有效的翻译服务类型
    if (serviceId === TranslationServiceIdMap.youdao || serviceId === TranslationServiceIdMap.deepl) {
      currentServiceId.value = serviceId as TranslationServiceIdMap
      // 保存选择的服务到 settings store
      settingsStore.setTranslationService(serviceId as TranslationServiceIdMap)
      loadFormData()
    }
  }

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

  // 监听 settings store 中翻译服务的变化
  watch(
    () => settingsStore.translationService,
    newService => {
      if (currentServiceId.value !== newService) {
        currentServiceId.value = newService
        loadFormData()
      }
    }
  )

  // 保存 API 密钥
  const saveApiKeys = () => {
    settingsStore.updateSettings({
      apiKeys: form.value
    })

    // 显示成功提示
    alert('API 密钥已保存')
  }
</script>
