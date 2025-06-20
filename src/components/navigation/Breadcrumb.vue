<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  // 定义组件名称以符合Vue多词命名规范
  defineOptions({
    name: 'BreadcrumbNav'
  })

  interface BreadcrumbItem {
    label: string
    to?: string
  }

  interface Props {
    items?: BreadcrumbItem[]
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => []
  })

  const route = useRoute()

  const breadcrumbs = computed(() => {
    if (props.items.length > 0) {
      return props.items
    }

    // Generate breadcrumbs from route
    const paths = route.path.split('/').filter(Boolean)
    return paths.map((path, index) => {
      const to = '/' + paths.slice(0, index + 1).join('/')
      return {
        label: path.charAt(0).toUpperCase() + path.slice(1),
        to
      }
    })
  })
</script>

<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2">
      <li>
        <router-link to="/" class="text-gray-400 hover:text-gray-500">
          <svg class="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
            />
          </svg>
          <span class="sr-only">Home</span>
        </router-link>
      </li>
      <li v-for="(item, index) in breadcrumbs" :key="index" class="flex items-center">
        <svg class="h-5 w-5 flex-shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <router-link
          v-if="item.to && index < breadcrumbs.length - 1"
          :to="item.to"
          class="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          {{ item.label }}
        </router-link>
        <span v-else class="ml-2 text-sm font-medium text-gray-700" aria-current="page">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
