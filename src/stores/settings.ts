import { defineStore } from 'pinia'
import type { ApiKeys } from '@/config/translation-service-keys'

interface SettingsState {
  apiKeys: ApiKeys
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    apiKeys: {}
  }),
  actions: {
    updateSettings(settings: Partial<SettingsState>) {
      if (settings.apiKeys) {
        this.apiKeys = { ...this.apiKeys, ...settings.apiKeys }
        this.saveApiKeys()
      }
    },
    saveApiKeys() {
      localStorage.setItem('apiKeys', JSON.stringify(this.apiKeys))
    },
    loadApiKeys() {
      const savedKeys = localStorage.getItem('apiKeys')
      if (savedKeys) {
        this.apiKeys = JSON.parse(savedKeys)
      }
    }
  }
}) 