<template>
  <div class="flex items-center gap-2 mb-4">
    <span class="text-sm text-gray-600">Translation Service:</span>
    <BaseSelect
      :model-value="modelValue"
      @update:model-value="handleChange"
    >
      <option value="youdao">Youdao</option>
      <option value="deep">DeepL</option>
    </BaseSelect>
  </div>
</template>

<script setup lang="ts">
import BaseSelect from './base/BaseSelect.vue'

interface Props {
  modelValue: string;
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const handleChange = (value: string | number) => {
  emit('update:modelValue', value as string)
}
</script> 