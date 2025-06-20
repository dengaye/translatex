import { defineStore } from 'pinia'
import type { ApiKeys } from '@/config/translation-service-keys'
import { translationServiceKeys, TranslationServiceIdMap } from '@/config/translation-service-keys'

interface SettingsState {
  apiKeys: ApiKeys
  translationService: TranslationServiceIdMap
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    apiKeys: {},
    translationService: translationServiceKeys[0].id // 默认使用有道翻译
  }),

  getters: {
    // 检查是否有有效的API密钥
    hasValidApiKeys: state => {
      return Object.keys(state.apiKeys).some(key => state.apiKeys[key]?.trim())
    },

    // 检查当前翻译服务是否有有效的API密钥
    hasValidCurrentServiceApiKeys: state => {
      if (state.translationService === TranslationServiceIdMap.youdao) {
        return !!(state.apiKeys['youdao_app_key'] && state.apiKeys['youdao_app_secret'])
      } else if (state.translationService === TranslationServiceIdMap.deepl) {
        return !!state.apiKeys['deepl_api_key']
      }
      return false
    }
  },

  actions: {
    // 初始化设置，从缓存加载数据
    init() {
      this.loadSettings()
    },

    updateSettings(settings: Partial<SettingsState>) {
      if (settings.apiKeys) {
        this.apiKeys = { ...this.apiKeys, ...settings.apiKeys }
      }
      if (settings.translationService) {
        this.translationService = settings.translationService
      }
      this.saveSettings()
    },

    // 更新翻译服务
    setTranslationService(service: TranslationServiceIdMap) {
      this.translationService = service
      this.saveSettings()
    },

    saveSettings() {
      try {
        const settings = {
          apiKeys: this.apiKeys,
          translationService: this.translationService
        }
        localStorage.setItem('translatex_settings', JSON.stringify(settings))
      } catch (error) {
        console.error('Failed to save settings to localStorage:', error)
      }
    },

    loadSettings() {
      try {
        const savedSettings = localStorage.getItem('translatex_settings')
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings)
          // 确保解析的数据是有效的对象
          if (parsedSettings && typeof parsedSettings === 'object') {
            this.apiKeys = parsedSettings.apiKeys || {}
            this.translationService = parsedSettings.translationService || 'youdao'
          } else {
            this.resetToDefaults()
          }
        } else {
          // 如果没有缓存数据，设置为默认值
          this.resetToDefaults()
        }
      } catch (error) {
        console.error('Failed to load settings from localStorage:', error)
        this.resetToDefaults()
      }
    },

    // 重置为默认值
    resetToDefaults() {
      this.apiKeys = {}
      this.translationService = TranslationServiceIdMap.youdao
    },

    // 保持向后兼容的方法
    saveApiKeys() {
      this.saveSettings()
    },

    loadApiKeys() {
      this.loadSettings()
    },

    // 清空所有设置
    clearAll() {
      this.resetToDefaults()
      this.saveSettings()
    }
  }
})
