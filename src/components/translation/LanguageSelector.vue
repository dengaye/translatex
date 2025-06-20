<script setup lang="ts">
  import { ref, computed } from 'vue'

  interface Language {
    code: string
    name: string
    nativeName: string
  }

  interface Props {
    modelValue: string
    languages: Language[]
    label?: string
    placeholder?: string
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: 'Select Language',
    placeholder: 'Choose a language',
    disabled: false
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  const isOpen = ref(false)
  const searchQuery = ref('')

  const filteredLanguages = computed(() => {
    const query = searchQuery.value.toLowerCase()
    return props.languages.filter(
      lang =>
        lang.name.toLowerCase().includes(query) ||
        lang.nativeName.toLowerCase().includes(query) ||
        lang.code.toLowerCase().includes(query)
    )
  })

  const selectedLanguage = computed(() => {
    return props.languages.find(lang => lang.code === props.modelValue)
  })

  const handleSelect = (language: Language) => {
    emit('update:modelValue', language.code)
    isOpen.value = false
    searchQuery.value = ''
  }

  const handleSearch = (event: Event) => {
    const input = event.target as HTMLInputElement
    searchQuery.value = input.value
  }
</script>

<template>
  <div class="relative">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <div class="relative">
      <button
        type="button"
        class="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        :class="{ 'bg-gray-100 cursor-not-allowed': disabled }"
        @click="isOpen = !isOpen"
      >
        <span class="flex items-center">
          <span class="block truncate">
            {{ selectedLanguage?.nativeName || placeholder }}
          </span>
        </span>
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            class="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </button>

      <div
        v-if="isOpen"
        class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
      >
        <div class="sticky top-0 z-10 bg-white px-3 py-2">
          <input
            type="text"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            :placeholder="placeholder"
            @input="handleSearch"
          />
        </div>
        <ul class="py-1">
          <li
            v-for="language in filteredLanguages"
            :key="language.code"
            class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
            @click="handleSelect(language)"
          >
            <div class="flex items-center">
              <span class="font-normal block truncate">
                {{ language.nativeName }}
              </span>
              <span class="ml-2 text-gray-500 text-sm"> ({{ language.name }}) </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
