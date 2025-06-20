<template>
  <div class="relative">
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :readonly="readonly"
      class="w-full h-40 p-2 border rounded-lg resize-none"
      :class="{ 'bg-gray-50': readonly }"
      @input="handleInput"
    ></textarea>
    <div v-if="isLoading" class="absolute top-2 right-2">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    modelValue: string
    placeholder?: string
    readonly?: boolean
    isLoading?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Enter text...',
    readonly: false,
    isLoading: false
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    emit('update:modelValue', target.value)
  }
</script>
