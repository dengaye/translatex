<template>
  <div class="relative">
    <select
      :value="modelValue"
      class="appearance-none w-full px-4 py-2 pr-7 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:bg-gray-50 transition-colors"
      @change="handleChange"
    >
      <slot></slot>
    </select>
    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    modelValue: string | number
  }

  defineProps<Props>()
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void
  }>()

  const handleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    emit('update:modelValue', target.value)
  }
</script>
