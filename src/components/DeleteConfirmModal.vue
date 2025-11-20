<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { X, AlertTriangle } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  imageCount: number
  imageNames?: string[]
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const title = computed(() => {
  return props.imageCount === 1 ? '删除图片' : '批量删除图片'
})

const confirmMessage = computed(() => {
  if (props.imageCount === 1) {
    return '确定要删除这张图片吗？'
  } else {
    return `确定要删除这 ${props.imageCount} 张图片吗？`
  }
})

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose()
  } else if (event.key === 'Enter') {
    handleConfirm()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      @click="handleBackdropClick"
    >
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div
          v-if="isOpen"
          class="w-full max-w-md bg-gray-900 border border-red-500/30 rounded-xl shadow-2xl overflow-hidden"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-700">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle class="w-5 h-5 text-red-400" />
              </div>
              <h2 class="text-lg font-semibold text-white">{{ title }}</h2>
            </div>
            <button
              @click="handleClose"
              class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- Warning Message -->
            <div class="mb-6">
              <p class="text-gray-300 text-base mb-2">{{ confirmMessage }}</p>
              <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div class="flex items-start space-x-3">
                  <AlertTriangle class="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="text-red-300 font-medium text-sm mb-1">
                      此操作不可撤销
                    </p>
                    <p class="text-red-400/80 text-sm">
                      删除后将无法恢复这些图片，请确认是否继续。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Image Count Display -->
            <div class="mb-6 p-4 bg-gray-800/50 rounded-lg">
              <div class="flex items-center justify-between">
                <span class="text-gray-400 text-sm">即将删除</span>
                <span class="text-white font-medium text-sm">
                  {{ imageCount }} 张图片
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-3">
              <button
                @click="handleClose"
                class="flex-1 px-4 py-3 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors font-medium text-sm"
              >
                取消
              </button>
              <button
                @click="handleConfirm"
                class="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center space-x-2"
              >
                <AlertTriangle class="w-4 h-4" />
                <span>确认删除</span>
              </button>
            </div>
          </div>

          <!-- Keyboard Shortcuts Hint -->
          <div class="px-6 pb-4">
            <div class="text-xs text-gray-500 flex justify-center space-x-4">
              <span>ESC 取消</span>
              <span>Enter 确认</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* Additional hover effects for danger theme */
.bg-red-500:hover {
  background-color: rgb(239 68 68);
}

/* Focus states for accessibility */
button:focus-visible {
  outline: 2px solid rgb(239 68 68);
  outline-offset: 2px;
}
</style>