<script setup lang="ts">
import { ref, computed } from 'vue'
import { Upload, X, Image as ImageIcon, AlertCircle, Folder } from 'lucide-vue-next'
import type { UploadedImage } from '../types/history'

interface Props {
  images: UploadedImage[]
  maxImages?: number
  minImages?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxImages: 4,
  minImages: 2
})

const emit = defineEmits<{
  'update:images': [images: UploadedImage[]]
  'import-from-gallery': []
}>()

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement>()
const uploadErrors = ref<string[]>([])

// 计算属性
const canUploadMore = computed(() => {
  return props.images.length < props.maxImages
})

const remainingSlots = computed(() => {
  return props.maxImages - props.images.length
})

// 验证文件
const validateImage = (file: File): { valid: boolean; error?: string } => {
  // 格式验证
  const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/webp']
  if (!validFormats.includes(file.type)) {
    return { valid: false, error: `${file.name}: 不支持的文件格式` }
  }

  // 大小验证 (20KB - 15MB)
  const minSize = 20 * 1024
  const maxSize = 15 * 1024 * 1024
  if (file.size < minSize) {
    return { valid: false, error: `${file.name}: 文件太小，至少需要 20KB` }
  }
  if (file.size > maxSize) {
    return { valid: false, error: `${file.name}: 文件太大，最大支持 15MB` }
  }

  return { valid: true }
}

// 验证图片尺寸
const validateImageDimensions = (file: File): Promise<{ valid: boolean; error?: string; width?: number; height?: number }> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const width = img.width
      const height = img.height

      if (width < 600 || height < 800) {
        resolve({ valid: false, error: `${file.name}: 图片尺寸必须大于 600×800` })
      } else {
        resolve({ valid: true, width, height })
      }

      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => {
      resolve({ valid: false, error: `${file.name}: 无法读取图片` })
    }
    img.src = URL.createObjectURL(file)
  })
}

// 处理文件上传
const handleFiles = async (files: FileList | File[]) => {
  uploadErrors.value = []
  const filesArray = Array.from(files)

  // 检查数量限制
  if (filesArray.length + props.images.length > props.maxImages) {
    uploadErrors.value.push(`最多只能上传 ${props.maxImages} 张图片`)
    return
  }

  const newImages: UploadedImage[] = []

  for (const file of filesArray) {
    // 基础验证
    const basicValidation = validateImage(file)
    if (!basicValidation.valid) {
      uploadErrors.value.push(basicValidation.error!)
      continue
    }

    // 尺寸验证
    const dimensionValidation = await validateImageDimensions(file)
    if (!dimensionValidation.valid) {
      uploadErrors.value.push(dimensionValidation.error!)
      continue
    }

    // 创建预览 URL
    const url = URL.createObjectURL(file)
    const aspectRatio = dimensionValidation.width! / dimensionValidation.height!

    newImages.push({
      id: `${Date.now()}-${Math.random()}`,
      url,
      file,
      width: dimensionValidation.width!,
      height: dimensionValidation.height!,
      size: file.size,
      aspectRatio
    })
  }

  if (newImages.length > 0) {
    emit('update:images', [...props.images, ...newImages])
  }
}

// 文件选择
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    await handleFiles(target.files)
    target.value = '' // 重置 input
  }
}

// 拖拽处理
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false

  if (event.dataTransfer?.files) {
    await handleFiles(event.dataTransfer.files)
  }
}

// 删除图片
const removeImage = (imageId: string) => {
  const image = props.images.find(img => img.id === imageId)
  if (image?.url) {
    URL.revokeObjectURL(image.url)
  }
  emit('update:images', props.images.filter(img => img.id !== imageId))
}

// 打开文件选择
const openFileSelector = () => {
  fileInput.value?.click()
}

// 从图库导入
const importFromGallery = () => {
  emit('import-from-gallery')
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<template>
  <div class="space-y-4">
    <!-- 上传区域 -->
    <div
      v-if="canUploadMore"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      :class="[
        'border-2 border-dashed rounded-xl p-5 transition-all duration-200',
        isDragging
          ? 'border-primary-500 bg-primary-500/10'
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
      ]"
    >
      <div class="text-center">
        <Upload :class="[
          'w-10 h-10 mx-auto mb-3',
          isDragging ? 'text-primary-400' : 'text-gray-400'
        ]" />

        <h3 class="text-base font-semibold text-white mb-2">
          {{ isDragging ? '松开鼠标上传' : '上传图片' }}
        </h3>

        <p class="text-sm text-gray-400 mb-3">
          拖拽图片到此处，或点击按钮选择文件
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            @click="openFileSelector"
            class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            选择文件
          </button>

          <button
            @click="importFromGallery"
            class="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Folder class="w-4 h-4" />
            <span>从图库导入</span>
          </button>
        </div>

        <div class="mt-3 text-xs text-gray-500 space-y-1">
          <p>• 支持格式：JPG、PNG、HEIC、WebP</p>
          <p>• 尺寸要求：大于 600×800 像素</p>
          <p>• 文件大小：20KB - 15MB</p>
          <p>• 可上传 {{ minImages }}-{{ maxImages }} 张图片，还可上传 {{ remainingSlots }} 张</p>
        </div>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/heic,image/webp"
        multiple
        class="hidden"
        @change="handleFileSelect"
      />
    </div>

    <!-- 错误提示 -->
    <div v-if="uploadErrors.length > 0" class="space-y-2">
      <div
        v-for="(error, index) in uploadErrors"
        :key="index"
        class="flex items-start space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
      >
        <AlertCircle class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <span class="text-sm text-red-300">{{ error }}</span>
      </div>
    </div>

    <!-- 已上传图片列表 -->
    <div v-if="images.length > 0" class="space-y-3">
      <div class="flex items-center justify-between">
        <h4 class="text-sm font-medium text-gray-200">
          已上传图片 ({{ images.length }}/{{ maxImages }})
        </h4>
        <span class="text-xs text-gray-400">
          {{ images.length < minImages ? `至少需要 ${minImages} 张` : '已满足要求' }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="image in images"
          :key="image.id"
          class="relative group bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <!-- 图片预览 -->
          <div class="aspect-[3/4] relative">
            <img
              :src="image.url"
              :alt="`上传的图片 ${image.id}`"
              class="w-full h-full object-cover"
            />

            <!-- 删除按钮 -->
            <button
              @click="removeImage(image.id)"
              class="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X class="w-4 h-4 text-white" />
            </button>

            <!-- 遮罩层 -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <!-- 图片信息 -->
          <div class="p-3 space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-300">
                {{ image.width }} × {{ image.height }}
              </span>
              <span class="text-gray-400">
                {{ formatFileSize(image.size) }}
              </span>
            </div>
            <div class="text-xs text-gray-400">
              比例: {{ image.aspectRatio.toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
