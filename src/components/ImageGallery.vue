<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { cn } from '@/lib/utils'
import type { GalleryImage } from '@/types/album'

const props = defineProps<{
  images: GalleryImage[]
}>()

const emit = defineEmits<{
  imageClick: [image: GalleryImage]
  moveToAlbum: [imageIds: string[]]
  deleteImages: [imageIds: string[]]
}>()

const galleryRef = ref<HTMLElement>()
const hoveredImageId = ref<string | null>(null)
const selectedImages = ref<Set<string>>(new Set())
const isSelectionMode = ref(false)

const handleImageClick = (image: GalleryImage, event: MouseEvent) => {
  if (isSelectionMode.value || event.ctrlKey || event.metaKey) {
    toggleSelection(image.id)
  } else {
    emit('imageClick', image)
  }
}

const toggleSelection = (imageId: string) => {
  const newSelected = new Set(selectedImages.value)
  if (newSelected.has(imageId)) {
    newSelected.delete(imageId)
  } else {
    newSelected.add(imageId)
  }
  selectedImages.value = newSelected
  
  if (newSelected.size === 0) {
    isSelectionMode.value = false
  }
}

const toggleSelectionMode = () => {
  isSelectionMode.value = !isSelectionMode.value
  if (!isSelectionMode.value) {
    selectedImages.value.clear()
  }
}

const selectAll = () => {
  selectedImages.value = new Set(props.images.map(img => img.id))
}

const clearSelection = () => {
  selectedImages.value.clear()
  isSelectionMode.value = false
}

const selectedCount = computed(() => selectedImages.value.size)

const handleDeleteSelected = () => {
  if (selectedImages.value.size > 0) {
    emit('deleteImages', Array.from(selectedImages.value))
  }
}

const handleDeleteSingle = (imageId: string) => {
  emit('deleteImages', [imageId])
}

const formatFileSize = (size: string) => {
  return size || 'N/A'
}

const formatDimensions = (width: number, height: number) => {
  return `${width} × ${height}`
}

const handleMouseEnter = (imageId: string) => {
  hoveredImageId.value = imageId
}

const handleMouseLeave = () => {
  hoveredImageId.value = null
}

onMounted(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      clearSelection()
    }
  }
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

<template>
  <div class="image-gallery">
    <!-- Selection Tools -->
    <div 
      v-if="isSelectionMode || selectedCount > 0"
      class="mb-6 p-4 bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <span class="text-white font-medium">
            已选择 {{ selectedCount }} 张图片
          </span>
          <div class="flex space-x-2">
            <button
              @click="selectAll"
              class="text-sm px-3 py-1 bg-primary-500/20 text-primary-300 rounded-lg hover:bg-primary-500/30 transition-colors"
            >
              全选
            </button>
            <button
              @click="clearSelection"
              class="text-sm px-3 py-1 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              取消选择
            </button>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            @click="emit('moveToAlbum', Array.from(selectedImages))"
            class="p-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors" 
            title="移动到相册"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </button>
          <button class="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors" title="下载选中">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </button>
          <button class="p-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors" title="分享选中">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
            </svg>
          </button>
          <button 
            @click="handleDeleteSelected"
            class="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors" 
            title="删除选中"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-2">
        <button
          @click="toggleSelectionMode"
          :class="cn(
            'flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium',
            isSelectionMode 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
          )"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>{{ isSelectionMode ? '取消多选' : '多选模式' }}</span>
        </button>
      </div>

      <div class="text-sm text-gray-400">
        {{ images.length }} 张图片
      </div>
    </div>

    <!-- Image Grid -->
    <div 
      ref="galleryRef"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
    >
      <div
        v-for="image in images"
        :key="image.id"
        :class="cn(
          'group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300',
          'bg-gray-800/50 border border-gray-700 hover:border-primary-500/50',
          'hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-1',
          selectedImages.has(image.id) && 'ring-2 ring-primary-500 border-primary-500',
          isSelectionMode && 'hover:ring-2 hover:ring-primary-400'
        )"
        @click="handleImageClick(image, $event)"
        @mouseenter="handleMouseEnter(image.id)"
        @mouseleave="handleMouseLeave"
      >
        <!-- Selection Checkbox -->
        <div 
          v-if="isSelectionMode || selectedImages.has(image.id)"
          class="absolute top-2 left-2 z-20"
        >
          <div 
            :class="cn(
              'w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center',
              selectedImages.has(image.id)
                ? 'bg-primary-500 border-primary-500'
                : 'bg-black/50 border-white/50 backdrop-blur-sm'
            )"
          >
            <svg 
              v-if="selectedImages.has(image.id)"
              class="w-3 h-3 text-white" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>

        <!-- Image Container -->
        <div class="aspect-square relative overflow-hidden">
          <img 
            :src="image.url" 
            :alt="image.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          <!-- AI Badge -->
          <div class="absolute top-2 right-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg z-10">
            AI
          </div>

          <!-- Hover Overlay -->
          <div 
            :class="cn(
              'absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300',
              hoveredImageId === image.id || selectedImages.has(image.id) 
                ? 'opacity-100' 
                : 'opacity-0'
            )"
          />

          <!-- Delete Button -->
          <button
            v-if="hoveredImageId === image.id && !isSelectionMode"
            @click.stop="handleDeleteSingle(image.id)"
            class="absolute top-12 right-2 z-20 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="删除图片"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>

          <!-- Image Info Overlay -->
          <div 
            :class="cn(
              'absolute bottom-0 left-0 right-0 p-3 text-white transition-transform duration-300',
              hoveredImageId === image.id || selectedImages.has(image.id)
                ? 'translate-y-0' 
                : 'translate-y-full'
            )"
          >
            <h3 class="font-semibold text-sm mb-1 line-clamp-1">{{ image.title }}</h3>
            
            <!-- Category Badge -->
            <div class="flex items-center justify-between mb-2">
              <span class="bg-primary-500/20 text-primary-300 text-xs px-2 py-1 rounded-full">
                {{ image.category }}
              </span>
              <span class="text-xs text-gray-300">
                {{ formatDimensions(image.size.width, image.size.height) }}
              </span>
            </div>

            <!-- Tags -->
            <div v-if="image.tags && image.tags.length > 0" class="flex flex-wrap gap-1 mb-2">
              <span 
                v-for="tag in image.tags.slice(0, 2)"
                :key="tag"
                class="text-xs bg-gray-700/50 text-gray-300 px-1.5 py-0.5 rounded"
              >
                {{ tag }}
              </span>
              <span 
                v-if="image.tags.length > 2"
                class="text-xs text-gray-400"
              >
                +{{ image.tags.length - 2 }}
              </span>
            </div>

            <!-- File Info -->
            <div class="flex items-center justify-between text-xs text-gray-400">
              <span>{{ formatFileSize(image.fileSize || '') }}</span>
              <span>{{ image.createdAt.toLocaleDateString('zh-CN') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div 
      v-if="images.length === 0"
      class="text-center py-20"
    >
      <div class="text-gray-500 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-400 mb-2">该分组暂无图片</h3>
      <p class="text-gray-500">尝试切换到其他时间分组查看</p>
    </div>
  </div>
</template>

<style scoped>
.image-gallery {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgb(31 41 55);
}

::-webkit-scrollbar-thumb {
  background: rgb(75 85 99);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgb(107 114 128);
}
</style>