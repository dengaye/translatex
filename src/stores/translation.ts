import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { translateWithYoudao, translateWithDeepL } from '@/services/translation'
import { useSettingsStore } from './settings'
import { TranslationServiceIdMap } from '@/config/translation-service-keys'

export const useTranslationStore = defineStore('translation', () => {
  const sourceText = ref('')
  const translatedText = ref('')
  const sourceLanguage = ref('auto')
  const targetLanguage = ref('en')
  const isLoading = ref(false)
  const error = ref('')

  // 从 settings store 获取翻译服务设置
  const settingsStore = useSettingsStore()
  const translationService = ref<TranslationServiceIdMap>(settingsStore.translationService)

  // 监听 settings store 中翻译服务的变化
  watch(
    () => settingsStore.translationService,
    newService => {
      translationService.value = newService
    }
  )

  // 当翻译服务改变时，同步到 settings store
  watch(translationService, newService => {
    if (settingsStore.translationService !== newService) {
      settingsStore.setTranslationService(newService)
    }
  })

  const translate = async () => {
    if (!sourceText.value) {
      translatedText.value = ''
      return
    }

    isLoading.value = true
    error.value = ''

    try {
      const result = await (translationService.value === TranslationServiceIdMap.youdao
        ? translateWithYoudao(sourceText.value, sourceLanguage.value, targetLanguage.value)
        : translateWithDeepL(sourceText.value, sourceLanguage.value, targetLanguage.value))

      translatedText.value = result
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Translation failed'
      translatedText.value = ''
    } finally {
      isLoading.value = false
    }
  }

  return {
    sourceText,
    translatedText,
    sourceLanguage,
    targetLanguage,
    isLoading,
    error,
    translationService,
    translate
  }
})
