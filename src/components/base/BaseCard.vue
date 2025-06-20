<script setup lang="ts">
  import { computed } from 'vue'

  interface Props {
    title?: string
    subtitle?: string
    padding?: 'none' | 'sm' | 'md' | 'lg'
    shadow?: 'none' | 'sm' | 'md' | 'lg'
    bordered?: boolean
    hoverable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    padding: 'md',
    shadow: 'md',
    bordered: true,
    hoverable: false
  })

  const cardClasses = computed(() => {
    const baseClasses = 'bg-white rounded-lg'

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6'
    }

    const shadows = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow',
      lg: 'shadow-lg'
    }

    const borderClasses = props.bordered ? 'border border-gray-200' : ''
    const hoverClasses = props.hoverable ? 'transition-shadow duration-200 hover:shadow-lg' : ''

    return `${baseClasses} ${paddings[props.padding]} ${shadows[props.shadow]} ${borderClasses} ${hoverClasses}`
  })

  const headerClasses = computed(() => {
    const baseClasses = 'mb-4'
    return props.padding === 'none' ? `${baseClasses} px-4 pt-4` : baseClasses
  })
</script>

<template>
  <div :class="cardClasses">
    <div v-if="title || subtitle" :class="headerClasses">
      <h3 v-if="title" class="text-lg font-medium text-gray-900">
        {{ title }}
      </h3>
      <p v-if="subtitle" class="mt-1 text-sm text-gray-500">
        {{ subtitle }}
      </p>
    </div>
    <div :class="{ 'pt-4': title || subtitle }">
      <slot />
    </div>
    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-gray-200">
      <slot name="footer" />
    </div>
  </div>
</template>
