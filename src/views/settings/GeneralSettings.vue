<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800">常规设置</h2>
      <button
        @click="router.push('/')"
        class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        title="返回主页"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>
    </div>
    
    <div class="bg-gray-50 rounded-lg p-6">
      <div class="space-y-6">
        <!-- 主题设置 -->
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-gray-700">主题设置</h3>
          <div class="flex items-center space-x-4">
            <label class="inline-flex items-center">
              <input type="radio" name="theme" value="light" class="form-radio text-blue-500" />
              <span class="ml-2">浅色主题</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" name="theme" value="dark" class="form-radio text-blue-500" />
              <span class="ml-2">深色主题</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" name="theme" value="system" class="form-radio text-blue-500" />
              <span class="ml-2">跟随系统</span>
            </label>
          </div>
        </div>
        
        <!-- 语言设置 -->
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-gray-700">界面语言</h3>
          <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="zh-CN">简体中文</option>
            <option value="en-US">English (US)</option>
            <option value="ja-JP">日本語</option>
          </select>
        </div>
        
        <!-- 自动更新设置 -->
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-gray-700">自动更新</h3>
          <label class="inline-flex items-center">
            <input type="checkbox" class="form-checkbox text-blue-500" />
            <span class="ml-2">启用自动更新</span>
          </label>
        </div>
      </div>
      
      <div class="mt-6 flex justify-end">
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          保存设置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script> 