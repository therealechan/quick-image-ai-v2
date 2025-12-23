<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import GenerationHistory from '../components/GenerationHistory.vue'
import GalleryImportModal from '../components/GalleryImportModal.vue'
import {
  Download,
  Camera,
  Check,
  Edit2,
  Trash2,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Folder
} from 'lucide-vue-next'
import type { CollageHistoryItem, UploadedImage } from '../types/history'

// Mobile menu state
const isMobileMenuOpen = ref(false)

// History panel state
const isHistoryCollapsed = ref(true)
const historyRef = ref<InstanceType<typeof GenerationHistory>>()

// Reference images (1-4 images)
interface ReferenceImage {
  id: string
  url: string
  file?: File
  order: number
}

const referenceImages = ref<ReferenceImage[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)

// Drag and drop state
const isDragging = ref(false)

// Gallery import modal state
const showGalleryImport = ref(false)

// Configuration states
const selectedPhotoType = ref<any>(null)
const customPrompt = ref('')
const generationCount = ref(3)
const selectedAspectRatio = ref<any>(null)

// Queue system
interface CollageQueueItem {
  id: string
  referenceImages: ReferenceImage[]
  photoType?: any
  customPrompt: string
  count: number
  aspectRatio: any
  createdAt: Date
}

const generationQueue = ref<CollageQueueItem[]>([])
const showQueuePanel = ref(false)

// Generation states
const isGenerating = ref(false)
const generationProgress = ref('')
const progressSteps = ref([
  '正在处理参考图片...',
  '生成中...',
  '优化质量中...',
  '即将完成...'
])
const currentStep = ref(0)

// Results
interface CollageResult {
  id: string
  url: string
  config: {
    referenceImages: ReferenceImage[]
    prompt: string
    aspectRatio: string
  }
  aspectRatio: any
  isEdited?: boolean
}

const generatedResults = ref<CollageResult[]>([])
const selectedResults = ref<Set<string>>(new Set())

// Edit modal
const showEditModal = ref(false)
const editingResults = ref<CollageResult[]>([])
const editPrompt = ref('')

// Aspect ratio options
const showAllAspectRatios = ref(false)
const aspectRatioOptions = ref([
  { id: 'auto', name: 'Auto', width: 4, height: 3, isAuto: true, isDefault: true },
  { id: '1:1', name: '1:1', width: 1, height: 1, isDefault: true },
  { id: '9:16', name: '9:16', width: 9, height: 16, isDefault: true },
  { id: '3:4', name: '3:4', width: 3, height: 4, isDefault: true },
  { id: '2:3', name: '2:3', width: 2, height: 3, isDefault: true },
  { id: '4:5', name: '4:5', width: 4, height: 5, isDefault: true },
  { id: '16:9', name: '16:9', width: 16, height: 9, isDefault: false },
  { id: '21:9', name: '21:9', width: 21, height: 9, isDefault: false },
  { id: '4:3', name: '4:3', width: 4, height: 3, isDefault: false },
  { id: '3:2', name: '3:2', width: 3, height: 2, isDefault: false },
  { id: '5:4', name: '5:4', width: 5, height: 4, isDefault: false }
])

const defaultAspectRatios = computed(() =>
  aspectRatioOptions.value.filter(ratio => ratio.isDefault)
)

const extraAspectRatios = computed(() =>
  aspectRatioOptions.value.filter(ratio => !ratio.isDefault)
)

// Photo type templates (reuse from pose generation)
const photoTypes = ref([
  { id: '1', name: '时尚模特', prompt: '时尚模特，专业摄影，高端时装，优雅姿态，完美光线' },
  { id: '2', name: '运动风格', prompt: '运动模特，活力四射，健康身材，运动服装，动感姿势' },
  { id: '3', name: '商务正装', prompt: '商务模特，专业形象，正装服饰，自信姿态，商务风格' },
  { id: '4', name: '休闲生活', prompt: '休闲模特，自然放松，日常服装，生活化姿势，温馨氛围' },
  { id: '5', name: '艺术写真', prompt: '艺术模特，创意摄影，独特风格，艺术表现，个性姿态' }
])

// Mock result images
const mockImages = [
  'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=600&fit=crop'
]

// Toggle functions
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const toggleHistory = () => {
  isHistoryCollapsed.value = !isHistoryCollapsed.value
}

const toggleQueuePanel = () => {
  showQueuePanel.value = !showQueuePanel.value
}

// Reference image upload functions
const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files

  if (!files || files.length === 0) return

  // 验证文件数量
  if (files.length < 1 || files.length > 4) {
    alert('每组需要1-4张搭配图')
    return
  }

  // 清空现有图片
  referenceImages.value = []

  // 处理每个文件
  Array.from(files).forEach((file, index) => {
    if (file.size > 10 * 1024 * 1024) {
      alert(`文件 "${file.name}" 大小不能超过10MB`)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      const newImage: ReferenceImage = {
        id: `ref-${Date.now()}-${index}`,
        url,
        file,
        order: index + 1
      }

      referenceImages.value.push(newImage)
      referenceImages.value.sort((a, b) => a.order - b.order)
    }
    reader.readAsDataURL(file)
  })
}

const removeReferenceImage = (id: string) => {
  const index = referenceImages.value.findIndex(img => img.id === id)
  if (index !== -1) {
    referenceImages.value.splice(index, 1)
  }
}

const clearAllImages = () => {
  referenceImages.value = []
}

// Gallery import functions
const openGalleryImport = () => {
  // 检查是否还能添加更多图片
  if (referenceImages.value.length >= 4) {
    alert('已达到最大上传数量（4张）')
    return
  }
  showGalleryImport.value = true
}

const handleGalleryImport = (importedImages: UploadedImage[]) => {
  // 检查总数量是否超过限制
  const totalCount = referenceImages.value.length + importedImages.length
  if (totalCount > 4) {
    const remaining = 4 - referenceImages.value.length
    alert(`最多只能上传4张图片，当前已有${referenceImages.value.length}张，还可以添加${remaining}张`)
    showGalleryImport.value = false
    return
  }

  // 转换 UploadedImage 为 ReferenceImage 格式
  const newImages: ReferenceImage[] = importedImages.map((img, index) => ({
    id: `gallery-${Date.now()}-${index}`,
    url: img.url,
    order: referenceImages.value.length + index + 1
  }))

  // 追加到现有图片列表
  referenceImages.value = [...referenceImages.value, ...newImages]

  // 重新排序
  referenceImages.value.sort((a, b) => a.order - b.order)

  showGalleryImport.value = false
}

const closeGalleryImport = () => {
  showGalleryImport.value = false
}

// 处理文件列表的通用函数
const processFiles = (files: FileList | File[]) => {
  const fileArray = Array.from(files)

  // 过滤出图片文件
  const imageFiles = fileArray.filter(file => file.type.startsWith('image/'))

  if (imageFiles.length === 0) {
    alert('未检测到图片文件')
    return
  }

  // 验证文件数量
  const totalCount = referenceImages.value.length + imageFiles.length
  if (totalCount > 4) {
    const remaining = 4 - referenceImages.value.length
    alert(`最多只能上传4张图片，当前已有${referenceImages.value.length}张，还可以添加${remaining}张`)
    return
  }

  // 保留现有图片（拖拽和粘贴采用追加模式）
  // 不再清空现有图片

  // 处理每个文件
  imageFiles.forEach((file, index) => {
    if (file.size > 10 * 1024 * 1024) {
      alert(`文件 "${file.name}" 大小不能超过10MB`)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      const newImage: ReferenceImage = {
        id: `ref-${Date.now()}-${index}`,
        url,
        file,
        order: referenceImages.value.length + index + 1
      }

      referenceImages.value.push(newImage)
      referenceImages.value.sort((a, b) => a.order - b.order)
    }
    reader.readAsDataURL(file)
  })
}

// Drag and drop handlers
const handleDrop = (event: DragEvent) => {
  isDragging.value = false

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    processFiles(files)
  }
}

// Paste handler
const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (!items) return

  const files: File[] = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item && item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        files.push(file)
      }
    }
  }

  if (files.length > 0) {
    processFiles(files)
    event.preventDefault()
  }
}

// Photo type selection
const selectPhotoType = (type: any) => {
  if (selectedPhotoType.value?.id === type.id) {
    selectedPhotoType.value = null
    customPrompt.value = ''
  } else {
    selectedPhotoType.value = type
    customPrompt.value = type.prompt
  }
}

// Aspect ratio selection
const selectAspectRatio = (ratio: any) => {
  selectedAspectRatio.value = ratio
}

// Validation
const canGenerate = computed(() => {
  return referenceImages.value.length >= 1 &&
         referenceImages.value.length <= 4 &&
         customPrompt.value.trim().length > 0 &&
         selectedAspectRatio.value !== null
})

const canAddToQueue = computed(() => {
  return canGenerate.value
})

// Single generation
const generateCollageImages = () => {
  if (!canGenerate.value) {
    if (referenceImages.value.length < 1) {
      alert('每组需要1-4张搭配图')
    } else if (customPrompt.value.trim().length === 0) {
      alert('请输入prompt描述或选择照片类型')
    } else if (!selectedAspectRatio.value) {
      alert('请选择图片比例')
    }
    return
  }

  isGenerating.value = true
  currentStep.value = 0
  generationProgress.value = progressSteps.value[0] || '正在处理...'

  // 模拟进度
  const progressInterval = setInterval(() => {
    currentStep.value++
    if (currentStep.value < progressSteps.value.length) {
      generationProgress.value = progressSteps.value[currentStep.value] || '生成中...'
    } else {
      clearInterval(progressInterval)
    }
  }, 750)

  // 模拟生成延迟
  setTimeout(() => {
    clearInterval(progressInterval)

    const results: CollageResult[] = Array.from({ length: generationCount.value }, (_, index) => ({
      id: `result-${Date.now()}-${index}`,
      url: mockImages[index % mockImages.length] || '',
      config: {
        referenceImages: referenceImages.value,
        prompt: customPrompt.value,
        aspectRatio: selectedAspectRatio.value?.name || 'Auto'
      },
      aspectRatio: selectedAspectRatio.value
    }))

    generatedResults.value = results
    isGenerating.value = false

    // 保存到历史记录
    saveToHistory(results)
  }, 3000)
}

// Queue management
const addToQueue = () => {
  if (!canAddToQueue.value) return

  const queueItem: CollageQueueItem = {
    id: `queue-${Date.now()}`,
    referenceImages: [...referenceImages.value],
    photoType: selectedPhotoType.value,
    customPrompt: customPrompt.value,
    count: generationCount.value,
    aspectRatio: selectedAspectRatio.value,
    createdAt: new Date()
  }

  generationQueue.value.push(queueItem)
  saveQueueToStorage()

  // 清空当前选择
  referenceImages.value = []
  selectedPhotoType.value = null
  customPrompt.value = ''
  generationCount.value = 3

  alert(`已添加到队列！当前队列：${generationQueue.value.length} 项`)

  // 自动打开队列面板
  showQueuePanel.value = true
}

const editQueueItem = (item: CollageQueueItem) => {
  // 加载队列项到表单
  referenceImages.value = [...item.referenceImages]
  selectedPhotoType.value = item.photoType
  customPrompt.value = item.customPrompt
  generationCount.value = item.count
  selectedAspectRatio.value = item.aspectRatio

  // 从队列中移除
  removeFromQueue(item.id)

  // 关闭队列面板，滚动到顶部
  showQueuePanel.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const removeFromQueue = (itemId: string) => {
  const index = generationQueue.value.findIndex(item => item.id === itemId)
  if (index !== -1) {
    generationQueue.value.splice(index, 1)
    saveQueueToStorage()
  }
}

const clearQueue = () => {
  if (generationQueue.value.length === 0) return

  if (confirm(`确定要清空队列吗？这将删除 ${generationQueue.value.length} 个待生成项。`)) {
    generationQueue.value = []
    saveQueueToStorage()
  }
}

const generateQueueItems = () => {
  if (generationQueue.value.length === 0) {
    alert('队列为空，请先添加生成任务')
    return
  }

  const totalImages = generationQueue.value.reduce((sum, item) => sum + item.count, 0)
  if (!confirm(`准备生成队列中的 ${generationQueue.value.length} 个任务，共 ${totalImages} 张图片。确定继续？`)) {
    return
  }

  isGenerating.value = true
  currentStep.value = 0
  generationProgress.value = '批量生成中...'

  const allResults: CollageResult[] = []

  // 模拟批量生成
  setTimeout(() => {
    generationQueue.value.forEach((item, queueIndex) => {
      const results: CollageResult[] = Array.from({ length: item.count }, (_, index) => ({
        id: `batch-${Date.now()}-${queueIndex}-${index}`,
        url: mockImages[(queueIndex * item.count + index) % mockImages.length] || '',
        config: {
          referenceImages: item.referenceImages,
          prompt: item.customPrompt,
          aspectRatio: item.aspectRatio?.name || 'Auto'
        },
        aspectRatio: item.aspectRatio
      }))

      allResults.push(...results)
    })

    generatedResults.value = allResults
    isGenerating.value = false
    generationProgress.value = ''

    // 保存到历史记录
    saveToHistory(allResults)

    // 清空队列
    generationQueue.value = []
    saveQueueToStorage()
    showQueuePanel.value = false

    alert(`批量生成完成！共生成 ${allResults.length} 张图片`)
  }, 3000)
}

// Queue persistence
const saveQueueToStorage = () => {
  localStorage.setItem('collageGenerationQueue', JSON.stringify(generationQueue.value))
}

const loadQueueFromStorage = () => {
  const saved = localStorage.getItem('collageGenerationQueue')
  if (saved) {
    try {
      generationQueue.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load queue from storage:', e)
    }
  }
}

// Batch operations on results
const toggleResultSelection = (resultId: string) => {
  if (selectedResults.value.has(resultId)) {
    selectedResults.value.delete(resultId)
  } else {
    selectedResults.value.add(resultId)
  }
}

const selectAllResults = () => {
  generatedResults.value.forEach(result => {
    selectedResults.value.add(result.id)
  })
}

const deselectAllResults = () => {
  selectedResults.value.clear()
}

const downloadSingleResult = (result: CollageResult) => {
  const link = document.createElement('a')
  link.href = result.url
  link.download = `collage-${result.id}.jpg`
  link.click()
}

const downloadSelectedResults = () => {
  const selected = generatedResults.value.filter(result => selectedResults.value.has(result.id))
  if (selected.length === 0) {
    alert('请先选择要下载的图片')
    return
  }

  selected.forEach(result => {
    downloadSingleResult(result)
  })

  alert(`已下载 ${selected.length} 张图片`)
}

const editSingleResult = (result: CollageResult) => {
  editingResults.value = [result]
  editPrompt.value = result.config.prompt
  showEditModal.value = true
}

const editSelectedResults = () => {
  const selected = generatedResults.value.filter(result => selectedResults.value.has(result.id))
  if (selected.length === 0) {
    alert('请先选择要编辑的图片')
    return
  }

  editingResults.value = selected
  editPrompt.value = selected[0]?.config.prompt || ''
  showEditModal.value = true
}

const saveEditChanges = () => {
  if (editPrompt.value.trim().length === 0) {
    alert('请输入prompt')
    return
  }

  editingResults.value.forEach(result => {
    result.config = { ...result.config, prompt: editPrompt.value }
    result.isEdited = true
  })

  showEditModal.value = false
  editingResults.value = []
  editPrompt.value = ''

  alert('已更新prompt，可以重新生成')
}

const closeEditModal = () => {
  showEditModal.value = false
  editingResults.value = []
  editPrompt.value = ''
}

// History functions
const saveToHistory = (results: CollageResult[]) => {
  if (!historyRef.value) return

  const historyItem: CollageHistoryItem = {
    id: `history-${Date.now()}`,
    type: 'collage',
    timestamp: new Date(),
    prompt: customPrompt.value,
    results: results.map(r => ({ id: r.id, url: r.url })),
    isFavorite: false,
    status: 'completed',
    referenceImages: referenceImages.value.map(img => ({
      id: img.id,
      url: img.url,
      order: img.order
    })),
    photoType: selectedPhotoType.value,
    generationCount: generationCount.value,
    aspectRatio: selectedAspectRatio.value
  }

  historyRef.value.addHistoryItem(historyItem)
}

const useHistoryItem = (historyItem: any) => {
  if (historyItem.type !== 'collage') return

  const collageItem = historyItem as CollageHistoryItem

  // 恢复参考图片
  referenceImages.value = collageItem.referenceImages.map(img => ({
    id: img.id,
    url: img.url,
    order: img.order
  }))

  // 恢复配置
  selectedPhotoType.value = collageItem.photoType
  customPrompt.value = collageItem.prompt
  generationCount.value = collageItem.generationCount
  selectedAspectRatio.value = collageItem.aspectRatio

  // 关闭历史面板
  isHistoryCollapsed.value = true

  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Lifecycle
onMounted(() => {
  // 初始化默认比例
  selectedAspectRatio.value = aspectRatioOptions.value[0]

  // 加载队列
  loadQueueFromStorage()

  // 添加粘贴事件监听
  window.addEventListener('paste', handlePaste)
})

onUnmounted(() => {
  // 清理 object URLs
  referenceImages.value.forEach(img => {
    if (img.url.startsWith('blob:')) {
      URL.revokeObjectURL(img.url)
    }
  })

  // 移除粘贴事件监听
  window.removeEventListener('paste', handlePaste)
})
</script>

<template>
  <div class="h-screen bg-gray-950 flex overflow-hidden">
    <!-- Sidebar -->
    <DashboardSidebar
      :is-mobile-menu-open="isMobileMenuOpen"
      @toggle-mobile-menu="toggleMobileMenu"
      @close-mobile-menu="closeMobileMenu"
    />

    <!-- History Panel -->
    <GenerationHistory
      ref="historyRef"
      type="collage"
      :is-collapsed="isHistoryCollapsed"
      @toggle="toggleHistory"
      @use-history-item="useHistoryItem"
    />

    <!-- Main Content Area -->
    <main class="flex-1 flex overflow-hidden">
      <!-- Left Panel: Control -->
      <div class="w-1/2 overflow-y-auto p-8 bg-gray-950">
        <div class="max-w-2xl mx-auto">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-white mb-2">搭配图生成</h1>
            <p class="text-base text-gray-400">上传1-4张搭配图，支持服装搭配图+背景图等组合，AI将基于这些图片生成新的图像</p>
          </div>

          <!-- Reference Images Upload -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">搭配图上传</h2>
            <p class="text-sm text-gray-400 mb-4">每组1-4张，可以一次性上传、拖拽、粘贴上传或从图库选择</p>

            <!-- Hidden file input -->
            <input
              type="file"
              ref="fileInputRef"
              accept="image/*"
              multiple
              class="hidden"
              @change="handleFileSelect"
            />

            <!-- Upload area when no images -->
            <div
              v-if="referenceImages.length === 0"
              @click="triggerFileInput"
              @drop.prevent="handleDrop"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              :class="[
                'relative rounded-xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden p-12',
                isDragging
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-700 hover:border-gray-600 bg-gray-800'
              ]"
            >
              <div class="flex flex-col items-center justify-center text-center">
                <Camera class="w-16 h-16 text-gray-600 mb-4" />
                <h3 class="text-lg font-semibold text-white mb-2">点击、拖拽或粘贴上传图片</h3>
                <p class="text-sm text-gray-400 mb-1">每组1-4张搭配图</p>
                <p class="text-xs text-gray-500">支持 JPG、PNG 等格式，每张图片最大10MB</p>
                <p class="text-xs text-gray-500 mt-2">💡 提示: Ctrl+V / Cmd+V 粘贴图片</p>
              </div>
            </div>

            <!-- Preview grid when images are uploaded -->
            <div v-else>
              <div class="grid grid-cols-4 gap-3 mb-4">
                <div
                  v-for="img in referenceImages"
                  :key="img.id"
                  class="relative aspect-[3/4] rounded-lg overflow-hidden group border-2 border-gray-700"
                >
                  <img
                    :src="img.url"
                    alt="Reference"
                    class="w-full h-full object-cover"
                  />

                  <!-- Remove button -->
                  <button
                    @click="removeReferenceImage(img.id)"
                    class="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X class="w-3 h-3 text-white" />
                  </button>

                  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p class="text-white text-xs font-medium">图片 {{ img.order }}</p>
                  </div>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="flex items-center space-x-3">
                <button
                  @click="triggerFileInput"
                  class="flex-1 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm font-medium text-white transition-all flex items-center justify-center space-x-2"
                >
                  <Plus class="w-4 h-4" />
                  <span>重新选择</span>
                </button>
                <button
                  @click="openGalleryImport"
                  :disabled="referenceImages.length >= 4"
                  class="flex-1 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm font-medium text-white transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Folder class="w-4 h-4" />
                  <span>从图库选择</span>
                </button>
                <button
                  @click="clearAllImages"
                  class="py-2.5 px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-sm font-medium text-red-400 transition-all"
                >
                  清空
                </button>
              </div>
            </div>

            <!-- Image count indicator -->
            <div class="mt-4 flex items-center justify-between text-sm">
              <span class="text-gray-400">
                已上传: <span class="text-white font-medium">{{ referenceImages.length }}</span> / 4 张
                <span v-if="referenceImages.length === 0" class="text-yellow-400 ml-2">（每组需要1-4张）</span>
                <span v-else class="text-green-400 ml-2">✓</span>
              </span>
            </div>
          </div>

          <!-- Photo Type Templates -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">照片类型</h2>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="type in photoTypes"
                :key="type.id"
                @click="selectPhotoType(type)"
                :class="[
                  'py-3 px-4 rounded-lg text-sm font-medium text-left transition-all',
                  selectedPhotoType?.id === type.id
                    ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-300 border-2 border-primary-500/50'
                    : 'bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-gray-600'
                ]"
              >
                {{ type.name }}
              </button>
            </div>
          </div>

          <!-- Custom Prompt -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">自定义 Prompt</h2>
            <textarea
              v-model="customPrompt"
              placeholder="输入自定义的prompt描述，或选择上方的照片类型自动填充..."
              rows="4"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-base"
            ></textarea>
            <p class="text-xs text-gray-500 mt-2">
              {{ customPrompt.length }} / 500 字符
            </p>
          </div>

          <!-- Aspect Ratio -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">图片比例</h2>

            <!-- Default ratios -->
            <div class="grid grid-cols-6 gap-2 mb-3">
              <button
                v-for="ratio in defaultAspectRatios"
                :key="ratio.id"
                @click="selectAspectRatio(ratio)"
                :class="[
                  'py-2 px-3 rounded-lg text-sm font-medium transition-all',
                  selectedAspectRatio?.id === ratio.id
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                ]"
              >
                {{ ratio.name }}
              </button>
            </div>

            <!-- Toggle for extra ratios -->
            <button
              @click="showAllAspectRatios = !showAllAspectRatios"
              class="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <span>{{ showAllAspectRatios ? '收起' : '更多比例' }}</span>
              <ChevronDown v-if="!showAllAspectRatios" class="w-4 h-4" />
              <ChevronUp v-else class="w-4 h-4" />
            </button>

            <!-- Extra ratios -->
            <div v-if="showAllAspectRatios" class="grid grid-cols-5 gap-2 mt-3">
              <button
                v-for="ratio in extraAspectRatios"
                :key="ratio.id"
                @click="selectAspectRatio(ratio)"
                :class="[
                  'py-2 px-3 rounded-lg text-sm font-medium transition-all',
                  selectedAspectRatio?.id === ratio.id
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                ]"
              >
                {{ ratio.name }}
              </button>
            </div>
          </div>

          <!-- Generation Count -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">生成数量</h2>
            <input
              type="number"
              v-model.number="generationCount"
              min="1"
              max="8"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
            />
            <p class="text-xs text-gray-500 mt-2">可生成 1-8 张图片</p>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <!-- Generate Button -->
            <button
              @click="generateCollageImages"
              :disabled="!canGenerate || isGenerating"
              :class="[
                'w-full py-4 px-6 rounded-lg font-semibold text-base transition-all',
                canGenerate && !isGenerating
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              ]"
            >
              <span v-if="isGenerating">{{ generationProgress }}</span>
              <span v-else>生成 {{ generationCount }} 张图片</span>
            </button>

            <!-- Add to Queue Button -->
            <button
              @click="addToQueue"
              :disabled="!canAddToQueue || isGenerating"
              :class="[
                'w-full py-3 px-6 rounded-lg font-medium text-sm transition-all flex items-center justify-center space-x-2',
                canAddToQueue && !isGenerating
                  ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                  : 'bg-gray-900 text-gray-600 cursor-not-allowed border border-gray-800'
              ]"
            >
              <Plus class="w-4 h-4" />
              <span>添加到队列</span>
            </button>

            <!-- Queue Panel Toggle -->
            <button
              v-if="generationQueue.length > 0"
              @click="toggleQueuePanel"
              class="w-full py-3 px-6 rounded-lg font-medium text-sm transition-all flex items-center justify-between bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
            >
              <span>查看队列 ({{ generationQueue.length }})</span>
              <ChevronDown v-if="!showQueuePanel" class="w-4 h-4" />
              <ChevronUp v-else class="w-4 h-4" />
            </button>
          </div>

          <!-- Queue Panel -->
          <div v-if="showQueuePanel && generationQueue.length > 0" class="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-white">生成队列</h3>
              <div class="flex items-center space-x-2">
                <button
                  @click="generateQueueItems"
                  :disabled="isGenerating"
                  class="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  批量生成
                </button>
                <button
                  @click="clearQueue"
                  class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium rounded-lg transition-all"
                >
                  清空队列
                </button>
              </div>
            </div>

            <!-- Queue Items -->
            <div class="space-y-3">
              <div
                v-for="item in generationQueue"
                :key="item.id"
                class="bg-gray-900 border border-gray-700 rounded-lg p-4"
              >
                <div class="flex items-start space-x-4">
                  <!-- Reference images thumbnails -->
                  <div class="flex space-x-2">
                    <img
                      v-for="img in item.referenceImages.slice(0, 3)"
                      :key="img.id"
                      :src="img.url"
                      alt="Reference"
                      class="w-12 h-16 object-cover rounded"
                    />
                    <div v-if="item.referenceImages.length > 3" class="w-12 h-16 bg-gray-800 rounded flex items-center justify-center text-gray-400 text-xs">
                      +{{ item.referenceImages.length - 3 }}
                    </div>
                  </div>

                  <!-- Config summary -->
                  <div class="flex-1 min-w-0">
                    <p class="text-white text-sm font-medium mb-1 truncate">
                      {{ item.photoType?.name || '自定义' }}
                    </p>
                    <p class="text-gray-400 text-xs mb-2 line-clamp-2">
                      {{ item.customPrompt }}
                    </p>
                    <div class="flex items-center space-x-3 text-xs text-gray-500">
                      <span>{{ item.count }} 张</span>
                      <span>•</span>
                      <span>{{ item.aspectRatio.name }}</span>
                      <span>•</span>
                      <span>{{ item.referenceImages.length }} 参考图</span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex space-x-2">
                    <button
                      @click="editQueueItem(item)"
                      class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                      title="编辑"
                    >
                      <Edit2 class="w-4 h-4" />
                    </button>
                    <button
                      @click="removeFromQueue(item.id)"
                      class="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded transition-colors"
                      title="删除"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel: Results -->
      <div class="w-1/2 bg-gray-900 overflow-y-auto p-8">
        <div class="max-w-4xl mx-auto">
          <!-- Results Header -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-white">
              生成结果
              <span v-if="generatedResults.length > 0" class="text-gray-400 text-lg ml-2">
                ({{ generatedResults.length }})
              </span>
            </h2>

            <!-- Batch actions -->
            <div v-if="generatedResults.length > 0" class="flex items-center space-x-2">
              <button
                @click="selectAllResults"
                class="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                全选
              </button>
              <button
                @click="deselectAllResults"
                class="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                取消
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="generatedResults.length === 0 && !isGenerating" class="flex flex-col items-center justify-center py-20 text-center">
            <ImageIcon class="w-16 h-16 text-gray-700 mb-4" />
            <h3 class="text-xl font-semibold text-gray-400 mb-2">暂无生成结果</h3>
            <p class="text-base text-gray-600">
              上传参考图片并配置选项后，点击生成按钮开始创作
            </p>
          </div>

          <!-- Generating State -->
          <div v-if="isGenerating" class="flex flex-col items-center justify-center py-20 text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-primary-500 mb-4"></div>
            <h3 class="text-xl font-semibold text-white mb-2">{{ generationProgress }}</h3>
            <p class="text-base text-gray-400">
              {{ currentStep + 1 }} / {{ progressSteps.length }}
            </p>
          </div>

          <!-- Results Grid -->
          <div v-if="generatedResults.length > 0" class="grid grid-cols-3 gap-4">
            <div
              v-for="result in generatedResults"
              :key="result.id"
              @click="toggleResultSelection(result.id)"
              :class="[
                'relative rounded-lg overflow-hidden cursor-pointer group border-2 transition-all',
                selectedResults.has(result.id)
                  ? 'border-primary-500 ring-2 ring-primary-500/50'
                  : 'border-transparent hover:border-gray-600'
              ]"
            >
              <!-- Image -->
              <img
                :src="result.url"
                alt="Result"
                class="w-full aspect-[3/4] object-cover"
              />

              <!-- Checkbox -->
              <div
                :class="[
                  'absolute top-3 left-3 w-6 h-6 rounded border-2 flex items-center justify-center transition-all',
                  selectedResults.has(result.id)
                    ? 'bg-primary-500 border-primary-500'
                    : 'bg-gray-900/80 border-gray-600 opacity-0 group-hover:opacity-100'
                ]"
              >
                <Check v-if="selectedResults.has(result.id)" class="w-4 h-4 text-white" />
              </div>

              <!-- Edited badge -->
              <div
                v-if="result.isEdited"
                class="absolute top-3 right-3 px-2 py-1 bg-yellow-500/90 text-white text-xs font-medium rounded"
              >
                已编辑
              </div>

              <!-- Action buttons -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click.stop="editSingleResult(result)"
                    class="p-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-white transition-colors"
                    title="编辑"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button
                    @click.stop="downloadSingleResult(result)"
                    class="p-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-white transition-colors"
                    title="下载"
                  >
                    <Download class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Floating Batch Actions Toolbar -->
    <div
      v-if="selectedResults.size > 0"
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl px-6 py-4 flex items-center space-x-4 z-50"
    >
      <span class="text-white font-medium">
        已选择 <span class="text-primary-400">{{ selectedResults.size }}</span> 张图片
      </span>
      <div class="h-6 w-px bg-gray-700"></div>
      <button
        @click="downloadSelectedResults"
        class="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-medium rounded-lg transition-all flex items-center space-x-2"
      >
        <Download class="w-4 h-4" />
        <span>批量下载</span>
      </button>
      <button
        @click="editSelectedResults"
        class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all flex items-center space-x-2"
      >
        <Edit2 class="w-4 h-4" />
        <span>批量编辑</span>
      </button>
      <button
        @click="deselectAllResults"
        class="p-2 text-gray-400 hover:text-white transition-colors"
        title="取消选择"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="closeEditModal"
    >
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-white">
            编辑 Prompt
            <span class="text-gray-400 text-base ml-2">({{ editingResults.length }} 张图片)</span>
          </h3>
          <button
            @click="closeEditModal"
            class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Preview images -->
        <div class="flex space-x-2 mb-4 overflow-x-auto">
          <img
            v-for="result in editingResults.slice(0, 6)"
            :key="result.id"
            :src="result.url"
            alt="Preview"
            class="w-20 h-28 object-cover rounded"
          />
          <div
            v-if="editingResults.length > 6"
            class="w-20 h-28 bg-gray-700 rounded flex items-center justify-center text-gray-400 text-sm"
          >
            +{{ editingResults.length - 6 }}
          </div>
        </div>

        <!-- Prompt editor -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Prompt 描述
          </label>
          <textarea
            v-model="editPrompt"
            rows="4"
            class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder="输入新的 prompt 描述..."
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3">
          <button
            @click="closeEditModal"
            class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            @click="saveEditChanges"
            class="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-lg transition-all"
          >
            保存更改
          </button>
        </div>
      </div>
    </div>

    <!-- Gallery Import Modal -->
    <GalleryImportModal
      v-if="showGalleryImport"
      :max-selection="4 - referenceImages.length"
      @close="closeGalleryImport"
      @import="handleGalleryImport"
    />
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
