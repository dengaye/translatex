<script setup lang="ts">
  import { onMounted, onUnmounted, computed } from 'vue'

  interface Props {
    modelValue: boolean
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    closeOnEsc?: boolean
    closeOnClickOutside?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    closeOnEsc: true,
    closeOnClickOutside: true
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'close'): void
  }>()

  const modalClasses = computed(() => {
    const baseClasses = 'bg-white rounded-lg shadow-xl transform transition-all'

    const sizes = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl'
    }

    return `${baseClasses} ${sizes[props.size]}`
  })

  const handleEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && props.closeOnEsc) {
      closeModal()
    }
  }

  const closeModal = () => {
    emit('update:modelValue', false)
    emit('close')
  }

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (props.closeOnClickOutside && target.classList.contains('modal-backdrop')) {
      closeModal()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleEsc)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEsc)
  })
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity modal-backdrop"
            aria-hidden="true"
            @click="handleClickOutside"
          />

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <Transition
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="modelValue"
              :class="modalClasses"
              class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 v-if="title" class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {{ title }}
                    </h3>
                    <div class="mt-2">
                      <slot />
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="$slots.footer" class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <slot name="footer" />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
