<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">TranslateX</h1>
        <button
          @click="router.push('/settings')"
          class="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      
      <div class="flex justify-between items-center mb-4">
        <LanguageSelector
          v-model="languageState"
          @update:modelValue="handleLanguageChange"
        />
        <TranslationServiceSelector
          v-model="store.translationService"
          @update:modelValue="handleServiceChange"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <TranslationTextarea
          v-model="store.sourceText"
          placeholder="Enter text to translate..."
          @update:modelValue="debounceTranslate"
        />
        <TranslationTextarea
          :model-value="store.translatedText"
          placeholder="Translation will appear here..."
          readonly
          :is-loading="store.isLoading"
        />
      </div>

      <div v-if="store.error" class="mt-4 p-2 bg-red-100 text-red-700 rounded-lg">
        {{ store.error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTranslationStore } from '@/stores/translation'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import LanguageSelector from '@/components/LanguageSelector.vue'
import TranslationTextarea from '@/components/TranslationTextarea.vue'
import TranslationServiceSelector from '@/components/TranslationServiceSelector.vue'

const router = useRouter()
const store = useTranslationStore()
const debounceTimer = ref<number | null>(null)

const languageState = reactive({
  source: store.sourceLanguage,
  target: store.targetLanguage
})

const handleLanguageChange = (newValue: { source: string; target: string }) => {
  store.sourceLanguage = newValue.source
  store.targetLanguage = newValue.target
  store.translate()
}

const handleServiceChange = (newValue: string) => {
  store.translationService = newValue as 'youdao' | 'deep'
  store.translate()
}

const debounceTranslate = () => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  debounceTimer.value = window.setTimeout(() => {
    store.translate()
  }, 500)
}
</script> 