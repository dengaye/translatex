<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Settings</h1>
        <button
          @click="router.push('/')"
          class="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>
      
      <div class="space-y-8">
        <div v-for="(service, serviceId) in translationServiceKeys" :key="serviceId" class="space-y-4">
          <div class="border-b pb-4">
            <h2 class="text-lg font-semibold text-gray-700">{{ service.name }}</h2>
            <p class="text-sm text-gray-500 mt-1">{{ service.description }}</p>
          </div>
          
          <div class="space-y-4">
            <div v-for="field in service.apiKeys" :key="field.name" class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">{{ field.label }}</label>
              <BaseInput
                v-model="form[field.name]"
                :type="field.type || 'text'"
                :placeholder="field.placeholder"
                :prefix="field.type === 'password' ? '🔒' : '🔑'"
              />
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end pt-4">
          <button
            @click="saveSettings"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/base/BaseInput.vue'
import { translationServiceKeys } from '@/config/translation-service-keys'

interface ApiKeys {
  [key: string]: string
}

const router = useRouter()
const settingsStore = useSettingsStore()

const form = ref<ApiKeys>({})

onMounted(() => {
  // Initialize form with empty values for all services
  translationServiceKeys.forEach(service => {
    service.apiKeys.forEach(key => {
      form.value[key.name] = settingsStore.apiKeys[key.name] || ''
    })
  })
})

const saveSettings = () => {
  settingsStore.updateSettings({
    apiKeys: form.value
  })
  router.push('/')
}
</script> 