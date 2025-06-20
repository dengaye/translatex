<script setup lang="ts">
  import { computed } from 'vue'

  interface Props {
    sourceText: string
    translatedText: string
    sourceLanguage: string
    targetLanguage: string
    timestamp?: string
    isFavorite?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    timestamp: '',
    isFavorite: false
  })

  const emit = defineEmits<{
    (e: 'favorite'): void
    (e: 'copy'): void
  }>()

  const formattedTimestamp = computed(() => {
    if (!props.timestamp) return ''
    return new Date(props.timestamp).toLocaleString()
  })
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div class="p-4">
      <!-- Source text -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-500">
            {{ sourceLanguage }}
          </span>
          <span class="text-xs text-gray-400">{{ formattedTimestamp }}</span>
        </div>
        <p class="text-gray-900">{{ sourceText }}</p>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-200 my-4" />

      <!-- Translated text -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-500">
            {{ targetLanguage }}
          </span>
          <div class="flex items-center space-x-2">
            <button class="p-1 text-gray-400 hover:text-gray-500" @click="emit('copy')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            </button>
            <button class="p-1 text-gray-400 hover:text-yellow-500" @click="emit('favorite')">
              <svg class="h-5 w-5" :class="{ 'text-yellow-500': isFavorite }" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </button>
          </div>
        </div>
        <p class="text-gray-900">{{ translatedText }}</p>
      </div>
    </div>
  </div>
</template>
