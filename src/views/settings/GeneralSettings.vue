<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">常规设置</h2>
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
          <select
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
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
  // 页面组件不需要额外的逻辑
</script>
