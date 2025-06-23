<template>
  <div class="h-screen bg-white flex flex-col p-3 text-sm">
    <!-- 头部：语言选择和控制按钮 -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2 text-xs">
        <select v-model="store.sourceLanguage" @change="handleTranslate" class="px-2 py-1 border rounded text-xs">
          <option value="auto">Auto</option>
          <option value="en">EN</option>
          <option value="zh">中文</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
          <option value="fr">FR</option>
          <option value="de">DE</option>
          <option value="es">ES</option>
        </select>
        <span class="text-gray-400">→</span>
        <select v-model="store.targetLanguage" @change="handleTranslate" class="px-2 py-1 border rounded text-xs">
          <option value="en">EN</option>
          <option value="zh">中文</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
          <option value="fr">FR</option>
          <option value="de">DE</option>
          <option value="es">ES</option>
        </select>
      </div>

      <div class="flex items-center space-x-1">
        <button
          @click="togglePin"
          :class="{ 'text-blue-600': isPinned, 'text-gray-400': !isPinned }"
          class="p-1 hover:bg-gray-100 rounded"
          title="Pin window"
        >
          📌
        </button>
        <button
          @click="closeWindow"
          class="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded"
          title="Close"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- 翻译区域 -->
    <div class="flex-1 flex flex-col space-y-2">
      <!-- 源文本 -->
      <div class="flex-1">
        <textarea
          v-model="store.sourceText"
          @input="debounceTranslate"
          placeholder="Enter text to translate..."
          class="w-full h-full p-2 border rounded text-xs resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
        ></textarea>
      </div>

      <!-- 分隔线 -->
      <div class="border-t border-gray-200"></div>

      <!-- 翻译结果 -->
      <div class="flex-1 relative">
        <textarea
          :value="store.translatedText"
          placeholder="Translation will appear here..."
          readonly
          class="w-full h-full p-2 border rounded text-xs resize-none bg-gray-50 focus:outline-none"
        ></textarea>

        <!-- 加载指示器 -->
        <div v-if="store.isLoading" class="absolute top-2 right-2">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>

        <!-- 复制按钮 -->
        <button
          v-if="store.translatedText && !store.isLoading"
          @click="copyTranslation"
          class="absolute bottom-2 right-2 p-1 text-gray-400 hover:text-blue-500 text-xs"
          title="Copy translation"
        >
          📋
        </button>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="store.error" class="mt-2 p-2 bg-red-50 text-red-600 rounded text-xs">
      {{ store.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useTranslationStore } from '@/stores/translation'

  defineOptions({
    name: 'TranslationPage'
  })

  const store = useTranslationStore()
  const isPinned = ref(false)
  const debounceTimer = ref<number | null>(null)

  // 防抖翻译
  const debounceTranslate = () => {
    if (debounceTimer.value) {
      clearTimeout(debounceTimer.value)
    }
    debounceTimer.value = window.setTimeout(() => {
      handleTranslate()
    }, 500)
  }

  const handleTranslate = () => {
    if (store.sourceText.trim()) {
      store.translate()
    }
  }

  const copyTranslation = async () => {
    try {
      await navigator.clipboard.writeText(store.translatedText)
    } catch (err) {
      // 如果 clipboard API 不可用，使用 electron 的 clipboard
      if (window.require) {
        const { clipboard } = window.require('electron')
        clipboard.writeText(store.translatedText)
      }
    }
  }

  const togglePin = () => {
    isPinned.value = !isPinned.value
    if (window.require) {
      const { ipcRenderer } = window.require('electron')
      ipcRenderer.send('pin-translation-window', isPinned.value)
    }
  }

  const closeWindow = () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron')
      ipcRenderer.send('close-translation-window')
    }
  }

  // 监听来自主进程的翻译请求
  onMounted(() => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron')

      ipcRenderer.on('translate-text', (_event: unknown, text: string) => {
        store.sourceText = text
        handleTranslate()
      })
    }
  })

  onUnmounted(() => {
    if (debounceTimer.value) {
      clearTimeout(debounceTimer.value)
    }
  })
</script>
