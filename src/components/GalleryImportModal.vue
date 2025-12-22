<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Check, Image as ImageIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import type { GalleryImage } from '@/types/album'
import type { UploadedImage } from '@/types/history'

interface Props {
  maxSelection?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxSelection: 4
})

const emit = defineEmits<{
  close: []
  import: [images: UploadedImage[]]
}>()

const selectedImageIds = ref<Set<string>>(new Set())

// Mock 图库数据 - 只显示图片类型
const mockGalleryImages = ref<GalleryImage[]>([
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
    type: 'image',
    title: '模特图片 1',
    category: 'model',
    createdAt: new Date(),
    size: { width: 800, height: 1200 },
    fileSize: '2.5 MB'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop',
    type: 'image',
    title: '模特图片 2',
    category: 'model',
    createdAt: new Date(),
    size: { width: 800, height: 1200 },
    fileSize: '2.3 MB'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    type: 'image',
    title: '模特图片 3',
    category: 'model',
    createdAt: new Date(),
    size: { width: 800, height: 1200 },
    fileSize: '2.8 MB'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop',
    type: 'image',
    title: '模特图片 4',
    category: 'model',
    createdAt: new Date(),
    size: { width: 800, height: 1200 },
    fileSize: '2.6 MB'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=600&fit=crop',
    type: 'image',
    title: '模特图片 5',
    category: 'model',
    createdAt: new Date(),
    size: { width: 800, height: 1200 },
    fileSize: '2.4 MB'
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=400&h=600&fit=crop',
    type: 'image',
    title: '模特图片 6',
    category: 'model',
    createdAt: new Date(),
    size: { width: 800, height: 1200 },
    fileSize: '2.7 MB'
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop',
    type: 'image',
    title: '模特图片 7',
    category: 'model',
    createdAt: new Date(),
    size: { width: 800, height: 1200 },
    fileSize: '2.9 MB'
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop',
    type: 'image',
    title: '模特图片 8',
    category: 'model',
    createdAt: new Date(),
    size: { width: 800, height: 1200 },
    fileSize: '2.2 MB'
  }
])

// 只显示图片类型的内容
const galleryImages = computed(() => {
  return mockGalleryImages.value.filter(img => img.type !== 'video')
})

const selectedCount = computed(() => selectedImageIds.value.size)

const canSelectMore = computed(() => {
  return selectedCount.value < props.maxSelection
})

const toggleSelection = (imageId: string) => {
  const newSelected = new Set(selectedImageIds.value)

  if (newSelected.has(imageId)) {
    newSelected.delete(imageId)
  } else {
    if (newSelected.size < props.maxSelection) {
      newSelected.add(imageId)
    }
  }

  selectedImageIds.value = newSelected
}

const isSelected = (imageId: string) => {
  return selectedImageIds.value.has(imageId)
}

const clearSelection = () => {
  selectedImageIds.value.clear()
}

const handleImport = () => {
  const selectedImages = galleryImages.value.filter(img =>
    selectedImageIds.value.has(img.id)
  )

  // 转换为 UploadedImage 格式
  const uploadedImages: UploadedImage[] = selectedImages.map(img => ({
    id: img.id,
    url: img.url,
    width: img.size.width,
    height: img.size.height,
    size: parseSizeString(img.fileSize || '0'),
    aspectRatio: img.size.width / img.size.height
  }))

  emit('import', uploadedImages)
}

// 解析文件大小字符串为字节数
const parseSizeString = (sizeStr: string): number => {
  const match = sizeStr.match(/^([\d.]+)\s*(B|KB|MB|GB)$/i)
  if (!match || !match[1] || !match[2]) return 0

  const value = parseFloat(match[1])
  const unit = match[2].toUpperCase()

  switch (unit) {
    case 'B': return value
    case 'KB': return value * 1024
    case 'MB': return value * 1024 * 1024
    case 'GB': return value * 1024 * 1024 * 1024
    default: return 0
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div class="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-800">
        <div>
          <h2 class="text-xl font-bold text-white">从图库导入</h2>
          <p class="text-sm text-gray-400 mt-1">
            选择图片导入到视频生成 ({{ selectedCount }}/{{ maxSelection }})
          </p>
        </div>

        <button
          @click="handleClose"
          class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Gallery Grid -->
      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="galleryImages.length === 0" class="text-center py-16">
          <ImageIcon class="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p class="text-sm text-gray-400">图库中暂无图片</p>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div
            v-for="image in galleryImages"
            :key="image.id"
            @click="toggleSelection(image.id)"
            :class="cn(
              'relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200',
              isSelected(image.id)
                ? 'border-primary-500 ring-2 ring-primary-500/50'
                : 'border-gray-700 hover:border-gray-600',
              !canSelectMore && !isSelected(image.id) && 'opacity-50 cursor-not-allowed'
            )"
          >
            <!-- 图片 -->
            <div class="aspect-[3/4] relative">
              <img
                :src="image.url"
                :alt="image.title"
                class="w-full h-full object-cover"
              />

              <!-- 选中覆盖层 -->
              <div
                v-if="isSelected(image.id)"
                class="absolute inset-0 bg-primary-500/20 flex items-center justify-center"
              >
                <div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                  <Check class="w-6 h-6 text-white" />
                </div>
              </div>

              <!-- 悬停覆盖层 -->
              <div
                v-else
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <div class="w-10 h-10 bg-white/20 rounded-full border-2 border-white" />
              </div>
            </div>

            <!-- 图片信息 -->
            <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <p class="text-xs text-white font-medium truncate">{{ image.title }}</p>
              <p class="text-xs text-gray-300">{{ image.size.width }} × {{ image.size.height }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between p-6 border-t border-gray-800">
        <button
          @click="clearSelection"
          :disabled="selectedCount === 0"
          class="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          清除选择
        </button>

        <div class="flex items-center space-x-3">
          <button
            @click="handleClose"
            class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            取消
          </button>

          <button
            @click="handleImport"
            :disabled="selectedCount === 0"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              selectedCount > 0
                ? 'bg-primary-500 hover:bg-primary-600 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            ]"
          >
            导入 {{ selectedCount }} 张图片
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
