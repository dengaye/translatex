<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  interface Props {
    to: string
    icon?: string
    label: string
    badge?: string | number
  }

  const props = defineProps<Props>()
  const route = useRoute()

  const isActive = computed(() => {
    return route.path === props.to
  })

  const classes = computed(() => {
    const baseClasses = 'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150'
    const activeClasses = isActive.value
      ? 'bg-blue-50 text-blue-700'
      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
    return `${baseClasses} ${activeClasses}`
  })
</script>

<template>
  <router-link :to="to" :class="classes">
    <slot name="icon">
      <svg
        v-if="icon"
        class="mr-3 h-5 w-5"
        :class="isActive ? 'text-blue-500' : 'text-gray-400'"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
      </svg>
    </slot>
    <span class="flex-1">{{ label }}</span>
    <span
      v-if="badge"
      class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      :class="isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'"
    >
      {{ badge }}
    </span>
  </router-link>
</template>
