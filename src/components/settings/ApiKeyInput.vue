<script setup lang="ts">
  import { ref } from 'vue'
  import BaseInput from '../base/BaseInput.vue'

  interface Props {
    modelValue: string
    serviceName: string
    label?: string
    placeholder?: string
    error?: string
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: 'API Key',
    placeholder: 'Enter your API key',
    disabled: false
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  const isVisible = ref(false)

  const toggleVisibility = () => {
    isVisible.value = !isVisible.value
  }
</script>

<template>
  <div class="relative">
    <BaseInput
      :model-value="modelValue"
      :type="isVisible ? 'text' : 'password'"
      :label="label"
      :placeholder="placeholder"
      :error="error"
      :disabled="disabled"
      @update:model-value="emit('update:modelValue', $event)"
    />
    <button
      type="button"
      class="absolute right-2 top-8 p-1 text-gray-400 hover:text-gray-500"
      @click="toggleVisibility"
    >
      <svg v-if="isVisible" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        />
      </svg>
    </button>
  </div>
</template>
