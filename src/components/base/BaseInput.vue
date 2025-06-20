<template>
  <div class="w-full">
    <label v-if="label" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="mt-1 relative rounded-md shadow-sm">
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      />
    </div>
    <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface Props {
    modelValue: string | number
    type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url'
    label?: string
    placeholder?: string
    error?: string
    disabled?: boolean
    required?: boolean
    size?: 'sm' | 'md' | 'lg'
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    size: 'md',
    disabled: false,
    required: false
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'focus', event: FocusEvent): void
    (e: 'blur', event: FocusEvent): void
  }>()

  const inputClasses = computed(() => {
    const baseClasses = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    }

    const stateClasses = props.error
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300'

    const disabledClasses = props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'

    return `${baseClasses} ${sizes[props.size]} ${stateClasses} ${disabledClasses}`
  })

  const labelClasses = computed(() => {
    const baseClasses = 'block font-medium text-gray-700'
    const sizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    }
    return `${baseClasses} ${sizes[props.size]}`
  })
</script>
