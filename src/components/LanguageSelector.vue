<template>
  <div class="flex gap-4 mb-4">
    <div class="w-48">
      <BaseSelect
        :model-value="modelValue.source"
        @update:model-value="(value: string | number) => handleSourceChange(value as string)"
      >
        <option value="auto">Auto Detect</option>
        <option v-for="lang in languages" :key="lang.code" :value="lang.code">
          {{ lang.name }}
        </option>
      </BaseSelect>
    </div>

    <div class="w-48">
      <BaseSelect
        :model-value="modelValue.target"
        @update:model-value="(value: string | number) => handleTargetChange(value as string)"
      >
        <option v-for="lang in languages" :key="lang.code" :value="lang.code">
          {{ lang.name }}
        </option>
      </BaseSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
  import BaseSelect from './base/BaseSelect.vue'

  interface Props {
    modelValue: {
      source: string
      target: string
    }
  }

  const props = defineProps<Props>()
  const emit = defineEmits<{
    (e: 'update:modelValue', value: { source: string; target: string }): void
  }>()

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' }
  ]

  const handleSourceChange = (value: string) => {
    emit('update:modelValue', { ...props.modelValue, source: value })
  }

  const handleTargetChange = (value: string) => {
    emit('update:modelValue', { ...props.modelValue, target: value })
  }
</script>
