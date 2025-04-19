<template>
  <div class="relative">
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'w-full border rounded-lg transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
        size === 'small' ? 'text-sm py-1' : size === 'large' ? 'text-lg py-3' : 'text-base py-2',
        prefix ? 'pl-10' : 'pl-3',
        suffix ? 'pr-10' : 'pr-3'
      ]"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <div v-if="error" class="absolute -bottom-5 left-0 text-xs text-red-500">
      {{ error }}
    </div>
    <div v-if="prefix" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <slot name="prefix">
        <span class="text-gray-500">{{ prefix }}</span>
      </slot>
    </div>
    <div v-if="suffix" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
      <slot name="suffix">
        <span class="text-gray-500">{{ suffix }}</span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue: string;
  type?: 'text' | 'password' | 'email' | 'number';
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  size?: 'small' | 'default' | 'large';
  prefix?: string;
  suffix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  error: '',
  size: 'default',
  prefix: '',
  suffix: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script> 