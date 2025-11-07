<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { cn } from '@/lib/utils'

export interface GalleryImage {
  id: string
  url: string
  title: string
  description?: string
  category: string
  createdAt: Date
  size: {
    width: number
    height: number
  }
  fileSize?: string
  tags?: string[]
}

const props = defineProps<{
  image: GalleryImage
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const modalRef = ref<HTMLElement>()
const imageRef = ref<HTMLImageElement>()
const isLoading = ref(true)
const imageError = ref(false)
const isZoomed = ref(false)
const zoomLevel = ref(1)
const maxZoom = 3
const minZoom = 0.5

const handleClose = () => {
  emit('close')
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === modalRef.value) {
    handleClose()
  }
}

const handleImageLoad = () => {
  isLoading.value = false
  imageError.value = false
}

const handleImageError = () => {
  isLoading.value = false
  imageError.value = true
}

const toggleZoom = () => {
  if (isZoomed.value) {
    zoomLevel.value = 1
    isZoomed.value = false
  } else {
    zoomLevel.value = 2
    isZoomed.value = true
  }
}

const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value + 0.5, maxZoom)
  isZoomed.value = zoomLevel.value > 1
}

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value - 0.5, minZoom)
  isZoomed.value = zoomLevel.value > 1
}

const resetZoom = () => {
  zoomLevel.value = 1
  isZoomed.value = false
}

const downloadImage = async () => {
  try {
    const response = await fetch(props.image.url)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${props.image.title || 'image'}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Download failed:', error)
  }
}

const shareImage = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.image.title,
        text: props.image.description,
        url: props.image.url
      })
    } catch (error) {
      console.error('Share failed:', error)
    }
  } else {
    navigator.clipboard.writeText(props.image.url)
  }
}

const formatDate = (date: Date) => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    if (!props.isOpen) return
    
    switch (event.key) {
      case 'Escape':
        handleClose()
        break
      case '+':
      case '=':
        event.preventDefault()
        zoomIn()
        break
      case '-':
        event.preventDefault()
        zoomOut()
        break
      case '0':
        event.preventDefault()
        resetZoom()
        break
    }
  }

  document.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden'

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'auto'
  })
})

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    isLoading.value = true
    imageError.value = false
    resetZoom()
  } else {
    document.body.style.overflow = 'auto'
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      ref="modalRef"
      class="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click="handleBackdropClick"
    >
      <!-- Modal Content -->
      <div class="relative w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 h-full max-h-screen">
        <!-- Image Container -->
        <div class="flex-1 flex items-center justify-center relative overflow-hidden">
          <!-- Loading State -->
          <div 
            v-if="isLoading"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>

          <!-- Error State -->
          <div 
            v-else-if="imageError"
            class="absolute inset-0 flex items-center justify-center text-center"
          >
            <div class="text-gray-400">
              <svg class="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
              </svg>
              <p>图片加载失败</p>
            </div>
          </div>

          <!-- Main Image -->
          <div 
            class="relative max-w-full max-h-full overflow-hidden cursor-zoom-in"
            @click="toggleZoom"
          >
            <img
              ref="imageRef"
              :src="image.url"
              :alt="image.title"
              :class="cn(
                'max-w-full max-h-full object-contain transition-transform duration-300 ease-out',
                isZoomed && 'cursor-zoom-out'
              )"
              :style="{
                transform: `scale(${zoomLevel})`
              }"
              @load="handleImageLoad"
              @error="handleImageError"
            />
          </div>

          <!-- Zoom Controls -->
          <div class="absolute bottom-4 left-4 flex space-x-2">
            <button
              @click.stop="zoomOut"
              :disabled="zoomLevel <= minZoom"
              class="p-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
              </svg>
            </button>
            
            <button
              @click.stop="resetZoom"
              class="px-3 py-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors text-sm"
            >
              {{ Math.round(zoomLevel * 100) }}%
            </button>
            
            <button
              @click.stop="zoomIn"
              :disabled="zoomLevel >= maxZoom"
              class="p-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Sidebar with Image Info -->
        <div class="lg:w-80 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 overflow-y-auto">
          <!-- Header -->
          <div class="flex items-start justify-between mb-6">
            <div class="flex-1">
              <h2 class="text-xl font-semibold text-white mb-2">{{ image.title }}</h2>
              <span class="inline-block px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm font-medium">
                {{ image.category }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div v-if="image.description" class="mb-6">
            <h3 class="text-sm font-medium text-gray-300 mb-2">描述</h3>
            <p class="text-gray-400 text-sm leading-relaxed">{{ image.description }}</p>
          </div>

          <!-- Tags -->
          <div v-if="image.tags && image.tags.length > 0" class="mb-6">
            <h3 class="text-sm font-medium text-gray-300 mb-3">标签</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in image.tags"
                :key="tag"
                class="px-2 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-lg"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Image Details -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-300 mb-3">图片信息</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">尺寸</span>
                <span class="text-white">{{ image.size.width }} × {{ image.size.height }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">文件大小</span>
                <span class="text-white">{{ image.fileSize || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">创建时间</span>
                <span class="text-white">{{ formatDate(image.createdAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">类型</span>
                <span class="text-white">AI生成</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-3">
            <button
              @click="downloadImage"
              class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              <span>下载图片</span>
            </button>
            
            <button
              @click="shareImage"
              class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
              </svg>
              <span>分享图片</span>
            </button>
          </div>

          <!-- Keyboard Shortcuts -->
          <div class="mt-8 p-3 bg-gray-900/50 border border-gray-700 rounded-lg">
            <h4 class="text-xs font-medium text-gray-300 mb-2">快捷键</h4>
            <div class="space-y-1 text-xs text-gray-400">
              <div class="flex justify-between">
                <span>放大</span>
                <span>+</span>
              </div>
              <div class="flex justify-between">
                <span>缩小</span>
                <span>-</span>
              </div>
              <div class="flex justify-between">
                <span>重置</span>
                <span>0</span>
              </div>
              <div class="flex justify-between">
                <span>关闭</span>
                <span>ESC</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Close Button -->
      <button
        @click="handleClose"
        class="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors z-10"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content {
  transform: scale(0.9);
}
</style>