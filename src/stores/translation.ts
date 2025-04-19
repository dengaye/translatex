import { defineStore } from 'pinia'
import { ref } from 'vue'
import { translateWithYoudao, translateWithDeepL } from '@/services/translation'

type TranslationService = 'youdao' | 'deep'

// Add type declaration for import.meta.env
declare global {
  interface ImportMetaEnv {
    VITE_API_BASE_URL: string
  }
}

export const useTranslationStore = defineStore('translation', () => {
  const sourceText = ref('')
  const translatedText = ref('')
  const sourceLanguage = ref('auto')
  const targetLanguage = ref('en')
  const isLoading = ref(false)
  const error = ref('')
  const translationService = ref<TranslationService>('youdao')

  const translate = async () => {
    if (!sourceText.value) {
      translatedText.value = ''
      return
    }

    isLoading.value = true
    error.value = ''

    try {
      const translatedText = await (translationService.value === 'youdao'
        ? translateWithYoudao(sourceText.value, sourceLanguage.value, targetLanguage.value)
        : translateWithDeepL(sourceText.value, sourceLanguage.value, targetLanguage.value))
      
      translatedText.value = translatedText
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