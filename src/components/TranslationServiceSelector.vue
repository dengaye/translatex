<template>
  <div class="flex items-center gap-2 mb-4">
    <span class="text-sm text-gray-600">Translation Service:</span>
    <div class="min-w-[180px]">
      <BaseSelect :model-value="modelValue" @update:model-value="handleChange">
        <option v-for="service in translationServiceKeys" :key="service.id" :value="service.id">
          {{ service.name }}
        </option>
      </BaseSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
  import BaseSelect from './base/BaseSelect.vue'
  import { translationServiceKeys } from '@/config/translation-service-keys'

  interface Props {
    modelValue: string
  }

  defineProps<Props>()
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  const handleChange = (value: string | number) => {
    emit('update:modelValue', value as string)
  }
</script>
