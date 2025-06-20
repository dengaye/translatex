<template>
  <button
    @click="handleClick"
    class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
    :title="title"
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'

  interface Props {
    title?: string
    to?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '返回主页',
    to: '/'
  })

  const router = useRouter()

  const handleClick = () => {
    router.push(props.to)
  }
</script>
