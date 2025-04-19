<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800">关于</h2>
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
      <div class="flex flex-col items-center mb-8">
        <div class="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mb-4">
          <span class="text-white text-3xl font-bold">T</span>
        </div>
        <h3 class="text-xl font-bold text-gray-800">Translatex</h3>
        <p class="text-gray-500">版本 1.0.0</p>
      </div>
      
      <div class="space-y-4">
        <div class="border-t border-b py-4">
          <h4 class="text-lg font-medium text-gray-700 mb-2">应用信息</h4>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">开发者</p>
              <p class="text-gray-700">Your Name</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">许可证</p>
              <p class="text-gray-700">MIT</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">构建日期</p>
              <p class="text-gray-700">2023-04-19</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Electron 版本</p>
              <p class="text-gray-700">v24.0.0</p>
            </div>
          </div>
        </div>
        
        <div class="border-b py-4">
          <h4 class="text-lg font-medium text-gray-700 mb-2">支持</h4>
          <p class="text-gray-600 mb-2">
            如果您遇到任何问题或有任何建议，请通过以下方式联系我们：
          </p>
          <div class="space-y-2">
            <a href="https://github.com/yourusername/translatex" class="text-blue-500 hover:underline block">
              GitHub 仓库
            </a>
            <a href="mailto:support@translatex.com" class="text-blue-500 hover:underline block">
              support@translatex.com
            </a>
          </div>
        </div>
        
        <div class="py-4">
          <h4 class="text-lg font-medium text-gray-700 mb-2">更新日志</h4>
          <div class="space-y-2">
            <div class="flex items-start">
              <span class="text-blue-500 mr-2">•</span>
              <p class="text-gray-600">初始版本发布</p>
            </div>
            <div class="flex items-start">
              <span class="text-blue-500 mr-2">•</span>
              <p class="text-gray-600">支持有道翻译和 DeepL API</p>
            </div>
            <div class="flex items-start">
              <span class="text-blue-500 mr-2">•</span>
              <p class="text-gray-600">支持 Windows 和 macOS 平台</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script> 