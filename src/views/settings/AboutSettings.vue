<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">关于</h2>
    </div>

    <div class="bg-gray-50 rounded-lg p-6">
      <div class="flex flex-col items-center mb-8">
        <div class="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mb-4">
          <span class="text-white text-3xl font-bold">T</span>
        </div>
        <h3 class="text-xl font-bold text-gray-800">{{ packageInfo.name }}</h3>
        <p class="text-gray-500">版本 {{ packageInfo.version }}</p>
      </div>

      <div class="space-y-4">
        <div class="border-t border-b py-4">
          <h4 class="text-lg font-medium text-gray-700 mb-2">应用信息</h4>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">开发者</p>
              <p class="text-gray-700">Aye</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">许可证</p>
              <p class="text-gray-700">{{ packageInfo.license }}</p>
            </div>
          </div>
        </div>

        <div class="py-4">
          <h4 class="text-lg font-medium text-gray-700 mb-2">支持</h4>
          <p class="text-gray-600 mb-2">如果您遇到任何问题或有任何建议，请通过以下方式联系我们：</p>
          <div class="space-y-2">
            <a href="https://github.com/dengaye/translatex" class="text-blue-500 hover:underline block">
              GitHub 仓库
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import packageJson from '../../../package.json'

  // 定义应用信息
  const packageInfo = {
    name: packageJson.name.charAt(0).toUpperCase() + packageJson.name.slice(1),
    version: packageJson.version,
    description: packageJson.description,
    license: packageJson.license
  }
</script>
