<template>
  <EmptyLayout>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">TranslateX</h1>
      <button @click="router.push('/settings')" class="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
        <SettingIcon />
      </button>
    </div>

    <div class="flex justify-between items-center mb-4">
      <LanguageSelector v-model="languageState" @update:modelValue="handleLanguageChange" />
      <TranslationServiceSelector v-model="store.translationService" @update:modelValue="handleServiceChange" />
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
  </EmptyLayout>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'

  import EmptyLayout from '@/layouts/EmptyLayout.vue'
  import LanguageSelector from '@/components/LanguageSelector.vue'
  import TranslationTextarea from '@/components/TranslationTextarea.vue'
  import TranslationServiceSelector from '@/components/TranslationServiceSelector.vue'
  import { SettingIcon } from '@/components/icons'

  import { useTranslationStore } from '@/stores/translation'

  // 定义组件名称以符合 Vue 多词命名规范
  defineOptions({
    name: 'HomePage'
  })

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
    store.translationService = newValue
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
