<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Clock, Star, Trash2, RotateCcw, ChevronLeft, ChevronRight, Eye, Download, X, Loader2, Check, Play } from 'lucide-vue-next'
import type { HistoryItem, ClothingHistoryItem, PoseHistoryItem, VideoHistoryItem, HistoryTypeString, GenerationStatusType } from '../types/history'

const props = defineProps<{
  isCollapsed?: boolean
  historyType?: HistoryTypeString
}>()

// 默认为服装生成类型
const currentHistoryType = computed(() => props.historyType || 'clothing')

const emit = defineEmits<{
  'use-history': [item: HistoryItem]
  'toggle-collapse': []
}>()

const historyItems = ref<HistoryItem[]>([])
const isCollapsed = ref(props.isCollapsed ?? true)
const searchQuery = ref('')
const filterType = ref<'all' | 'favorites' | 'recent'>('all')

// Results modal state
const showResultsModal = ref(false)
const selectedHistoryItem = ref<HistoryItem | null>(null)
const currentImageIndex = ref(0)

// Mock data for clothing generation
const mockClothingHistoryData: ClothingHistoryItem[] = [
  {
    id: '1',
    type: 'clothing',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    models: [{ id: '1', name: '女性模特 A', thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop' }],
    tops: [{ id: '1', name: '白色衬衫', thumbnail: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&h=100&fit=crop' }],
    bottoms: [{ id: '1', name: '蓝色牛仔裤', thumbnail: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=100&h=100&fit=crop' }],
    accessories: [],
    background: { id: '1', name: '简约白色背景' },
    prompt: '时尚模特，商务休闲风格，优雅姿态',
    results: [
      { id: 'r1', url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=300&fit=crop' },
      { id: 'r2', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=300&fit=crop' }
    ],
    isFavorite: true,
    batchMode: false,
    status: 'completed'
  },
  {
    id: '2',
    type: 'clothing',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    models: [
      { id: '2', name: '女性模特 B', thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop' },
      { id: '3', name: '男性模特 A', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' }
    ],
    tops: [
      { id: '2', name: '蓝色牛仔衬衫', thumbnail: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=100&h=100&fit=crop' },
      { id: '3', name: '黑色T恤', thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop' }
    ],
    bottoms: [
      { id: '2', name: '黑色西裤', thumbnail: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop' },
      { id: '3', name: '运动裤', thumbnail: 'https://images.unsplash.com/photo-1506629905607-0e2dbec85709?w=100&h=100&fit=crop' }
    ],
    accessories: [{ id: '1', name: '黑色腰带', thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop' }],
    background: { id: '2', name: '城市背景' },
    prompt: '休闲运动风格，多种搭配组合，活力四射',
    results: [
      { id: 'r3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop' },
      { id: 'r4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=300&fit=crop' },
      { id: 'r5', url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=300&fit=crop' },
      { id: 'r6', url: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=200&h=300&fit=crop' }
    ],
    isFavorite: false,
    batchMode: true,
    status: 'processing'
  },
  {
    id: '3',
    type: 'clothing',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    models: [{ id: '1', name: '女性模特 A', thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop' }],
    tops: [{ id: '4', name: '西装外套', thumbnail: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=100&fit=crop' }],
    bottoms: [{ id: '4', name: '短裙', thumbnail: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=100&h=100&fit=crop' }],
    accessories: [{ id: '2', name: '手提包', thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop' }],
    background: { id: '3', name: '办公室背景' },
    prompt: '商务女性，专业形象，正装搭配',
    results: [],
    isFavorite: true,
    batchMode: false,
    status: 'failed'
  }
]

// Mock data for pose generation
const mockPoseHistoryData: PoseHistoryItem[] = [
  {
    id: 'p1',
    type: 'pose',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    model: { id: '1', name: '女性模特 A', thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop' },
    uploadedModel: null,
    selectedPose: { id: '1', name: '优雅站姿', thumbnail: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=150&h=200&fit=crop' },
    uploadedPose: null,
    promptTemplate: { id: '1', name: '时尚模特', prompt: '时尚模特，专业摄影，高端时装，优雅姿态，完美光线' },
    prompt: '时尚模特，专业摄影，高端时装，优雅姿态，完美光线',
    generationCount: 3,
    aspectRatio: { id: '9:16', name: '9:16', width: 9, height: 16 },
    results: [
      { id: 'pr1', url: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=200&h=300&fit=crop' },
      { id: 'pr2', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=300&fit=crop' },
      { id: 'pr3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop' }
    ],
    isFavorite: false,
    status: 'completed'
  },
  {
    id: 'p2',
    type: 'pose',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
    model: null,
    uploadedModel: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop',
    selectedPose: { id: '2', name: '动感跳跃', thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=200&fit=crop' },
    uploadedPose: null,
    promptTemplate: { id: '2', name: '运动风格', prompt: '运动模特，活力四射，健康身材，运动服装，动感姿势' },
    prompt: '运动模特，活力四射，健康身材，运动服装，动感姿势',
    generationCount: 4,
    aspectRatio: { id: '1:1', name: '1:1', width: 1, height: 1 },
    results: [],
    isFavorite: true,
    status: 'pending'
  }
]

// Mock data for video generation
const mockVideoHistoryData: VideoHistoryItem[] = [
  {
    id: 'v1',
    type: 'video',
    timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
    images: [
      {
        id: 'img1',
        url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
        width: 800,
        height: 1200,
        size: 2500000,
        aspectRatio: 0.67
      },
      {
        id: 'img2',
        url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop',
        width: 800,
        height: 1200,
        size: 2300000,
        aspectRatio: 0.67
      }
    ],
    description: '时尚模特展示多套服装，优雅走动，专业T台步伐，柔和打光，现代简约背景',
    negativePrompt: '变形、模糊、奇怪光影',
    aspectRatio: { id: '9:16', name: '9:16', width: 9, height: 16 },
    highQuality: true,
    result: {
      id: 'video-v1',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
      duration: 15
    },
    isFavorite: true,
    status: 'completed'
  },
  {
    id: 'v2',
    type: 'video',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    images: [
      {
        id: 'img3',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        width: 800,
        height: 1200,
        size: 2800000,
        aspectRatio: 0.67
      },
      {
        id: 'img4',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop',
        width: 800,
        height: 1200,
        size: 2600000,
        aspectRatio: 0.67
      },
      {
        id: 'img5',
        url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=600&fit=crop',
        width: 800,
        height: 1200,
        size: 2400000,
        aspectRatio: 0.67
      }
    ],
    description: '商务人士专业形象，从站立到坐姿的自然过渡，办公室环境，自信专业气质',
    negativePrompt: '',
    aspectRatio: { id: '16:9', name: '16:9', width: 16, height: 9 },
    highQuality: false,
    isFavorite: false,
    status: 'processing'
  }
]

const filteredHistoryItems = computed(() => {
  let filtered = historyItems.value

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => {
      // For video generation, search in description
      if (item.type === 'video') {
        const videoItem = item as VideoHistoryItem
        return videoItem.description.toLowerCase().includes(query)
      }

      // For clothing generation
      if (item.type === 'clothing') {
        const clothingItem = item as ClothingHistoryItem
        return (
          clothingItem.prompt.toLowerCase().includes(query) ||
          clothingItem.models.some(m => m.name.toLowerCase().includes(query)) ||
          clothingItem.tops.some(t => t.name.toLowerCase().includes(query)) ||
          clothingItem.bottoms.some(b => b.name.toLowerCase().includes(query))
        )
      }

      // For pose generation
      if (item.type === 'pose') {
        const poseItem = item as PoseHistoryItem
        return (
          poseItem.prompt.toLowerCase().includes(query) ||
          poseItem.model?.name.toLowerCase().includes(query) ||
          poseItem.selectedPose?.name.toLowerCase().includes(query) ||
          poseItem.promptTemplate?.name.toLowerCase().includes(query)
        )
      }

      return false
    })
  }

  // Apply type filter
  switch (filterType.value) {
    case 'favorites':
      filtered = filtered.filter(item => item.isFavorite)
      break
    case 'recent':
      filtered = filtered.filter(item =>
        (Date.now() - item.timestamp.getTime()) < 1000 * 60 * 60 * 24 // Last 24 hours
      )
      break
  }

  return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
})

const currentResults = computed(() => {
  if (!selectedHistoryItem.value) return []

  if (selectedHistoryItem.value.type === 'video') {
    const videoItem = selectedHistoryItem.value as VideoHistoryItem
    return videoItem.result ? [{ url: videoItem.result.url, id: videoItem.result.id }] : []
  }

  const itemWithResults = selectedHistoryItem.value as ClothingHistoryItem | PoseHistoryItem
  return itemWithResults.results || []
})

const formatTime = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 7) return `${diffDays}天前`
  
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

const getStatusColor = (status: GenerationStatusType) => {
  switch (status) {
    case 'completed': return 'bg-green-500/20 text-green-400'
    case 'processing': return 'bg-yellow-500/20 text-yellow-400'
    case 'failed': return 'bg-red-500/20 text-red-400'
    case 'pending': return 'bg-gray-500/20 text-gray-400'
    default: return 'bg-gray-500/20 text-gray-400'
  }
}

const getStatusText = (status: GenerationStatusType) => {
  switch (status) {
    case 'completed': return '已完成'
    case 'processing': return '生成中'
    case 'failed': return '生成失败'
    case 'pending': return '待生成'
    default: return '未知'
  }
}

const getStatusIcon = (status: GenerationStatusType) => {
  switch (status) {
    case 'completed': return Check
    case 'processing': return Loader2
    case 'failed': return X
    case 'pending': return Clock
    default: return Clock
  }
}

const useHistoryItem = (item: HistoryItem) => {
  let confirmMessage = `确定要恢复历史记录吗？\n\n` +
    `时间：${formatTime(item.timestamp)}\n`
  
  if (item.type === 'clothing') {
    const clothingItem = item as ClothingHistoryItem
    confirmMessage += `模式：${clothingItem.batchMode ? '批量生成' : '单搭配生成'}\n` +
      `模特：${clothingItem.models.length}个\n` +
      `服装：${clothingItem.tops.length + clothingItem.bottoms.length}件\n`
  } else if (item.type === 'pose') {
    const poseItem = item as PoseHistoryItem
    confirmMessage += `类型：姿势生成\n` +
      `模特：${poseItem.model || poseItem.uploadedModel ? '1个' : '无'}\n` +
      `姿势：${poseItem.selectedPose?.name || '无'}\n`
  }

  const promptText = item.type === 'video'
    ? (item as VideoHistoryItem).description
    : 'prompt' in item ? item.prompt : ''

  confirmMessage += `Prompt：${promptText.slice(0, 100)}${promptText.length > 100 ? '...' : ''}\n\n` +
    `这将覆盖当前的所有选择设置。`

  const confirmed = confirm(confirmMessage)
  
  if (confirmed) {
    emit('use-history', item)
  }
}

const toggleFavorite = (item: HistoryItem) => {
  item.isFavorite = !item.isFavorite
  saveToLocalStorage()
}

const deleteHistoryItem = (itemId: string) => {
  historyItems.value = historyItems.value.filter(item => item.id !== itemId)
  saveToLocalStorage()
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  emit('toggle-collapse')
}

const viewResults = (item: HistoryItem) => {
  if (item.type === 'video') {
    const videoItem = item as VideoHistoryItem
    if (!videoItem.result) {
      alert('该记录暂无生成结果')
      return
    }
  } else {
    const itemWithResults = item as ClothingHistoryItem | PoseHistoryItem
    if (!itemWithResults.results || itemWithResults.results.length === 0) {
      alert('该记录暂无生成结果')
      return
    }
  }

  selectedHistoryItem.value = item
  currentImageIndex.value = 0
  showResultsModal.value = true
}

const closeResultsModal = () => {
  showResultsModal.value = false
  selectedHistoryItem.value = null
  currentImageIndex.value = 0
}

const nextImage = () => {
  if (selectedHistoryItem.value && currentImageIndex.value < selectedHistoryItem.value.results.length - 1) {
    currentImageIndex.value++
  }
}

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const downloadImage = (url: string, index: number) => {
  const link = document.createElement('a')
  link.href = url
  link.download = `generated-image-${selectedHistoryItem.value?.id}-${index + 1}.jpg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // Replace with a fallback image or hide
  img.style.display = 'none'
  
  // Add a fallback element
  const parent = img.parentElement
  if (parent && !parent.querySelector('.image-fallback')) {
    const fallback = document.createElement('div')
    fallback.className = 'image-fallback w-full h-full bg-gray-700 flex items-center justify-center'
    fallback.innerHTML = '<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>'
    parent.appendChild(fallback)
  }
}

const getStorageKey = () => {
  switch (currentHistoryType.value) {
    case 'clothing': return 'modelGenerationHistory'
    case 'pose': return 'poseGenerationHistory'
    case 'video': return 'videoGenerationHistory'
    default: return 'modelGenerationHistory'
  }
}

const getMockData = () => {
  switch (currentHistoryType.value) {
    case 'clothing': return mockClothingHistoryData
    case 'pose': return mockPoseHistoryData
    case 'video': return mockVideoHistoryData
    default: return mockClothingHistoryData
  }
}

const saveToLocalStorage = () => {
  localStorage.setItem(getStorageKey(), JSON.stringify(historyItems.value))
}

const loadFromLocalStorage = () => {
  const stored = localStorage.getItem(getStorageKey())
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      historyItems.value = parsed.map((item: HistoryItem) => ({
        ...item,
        timestamp: new Date(item.timestamp),
        status: item.status || 'completed' // 为旧数据提供默认状态
      }))
    } catch (error) {
      console.error('Failed to load history from localStorage:', error)
      historyItems.value = getMockData()
    }
  } else {
    historyItems.value = getMockData()
  }
}

// Add new history item (called from parent component)
const addHistoryItem = (item: any) => {
  const newItem = {
    ...item,
    id: Date.now().toString(),
    timestamp: new Date(),
    isFavorite: false,
    status: item.status || 'pending'
  }
  historyItems.value.unshift(newItem)
  
  // Keep only last 50 items
  if (historyItems.value.length > 50) {
    historyItems.value = historyItems.value.slice(0, 50)
  }
  
  saveToLocalStorage()
}

defineExpose({
  addHistoryItem
})

onMounted(() => {
  loadFromLocalStorage()
})
</script>

<template>
  <div 
    :class="[
      'bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300',
      isCollapsed ? 'w-12' : 'w-80'
    ]"
  >
    <!-- Header -->
    <div class="p-4 border-b border-gray-800 flex items-center justify-between">
      <div v-if="!isCollapsed" class="flex items-center space-x-2">
        <Clock class="h-5 w-5 text-primary-400" />
        <h2 class="text-lg font-semibold text-white">生成历史</h2>
      </div>
      <button
        @click="toggleCollapse"
        class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        :class="isCollapsed ? 'mx-auto' : ''"
      >
        <ChevronLeft v-if="!isCollapsed" class="h-4 w-4" />
        <ChevronRight v-else class="h-4 w-4" />
      </button>
    </div>

    <!-- Content -->
    <div v-if="!isCollapsed" class="flex-1 flex flex-col overflow-hidden">
      <!-- Search and Filter -->
      <div class="p-4 space-y-3">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索历史记录..."
          class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-primary-500"
        />
        
        <div class="flex space-x-1">
          <button
            v-for="type in [{ key: 'all', label: '全部' }, { key: 'favorites', label: '收藏' }, { key: 'recent', label: '最近' }]"
            :key="type.key"
            @click="filterType = type.key as any"
            :class="[
              'flex-1 px-2 py-1 text-xs rounded-md font-medium transition-all',
              filterType === type.key
                ? 'bg-primary-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            ]"
          >
            {{ type.label }}
          </button>
        </div>
      </div>

      <!-- History List -->
      <div class="flex-1 overflow-y-auto scrollbar-hide px-4">
        <div class="space-y-3 pb-4">
          <div
            v-for="item in filteredHistoryItems"
            :key="item.id"
            class="bg-gray-800 rounded-lg p-3 hover:bg-gray-750 transition-colors group"
          >
            <!-- Header -->
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <span class="text-xs text-gray-400">{{ formatTime(item.timestamp) }}</span>
                <span v-if="item.type === 'clothing' && (item as ClothingHistoryItem).batchMode" class="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                  批量
                </span>
              </div>
              <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  @click="toggleFavorite(item)"
                  :class="[
                    'p-1 rounded hover:bg-gray-700 transition-colors',
                    item.isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                  ]"
                >
                  <Star class="h-3 w-3" :fill="item.isFavorite ? 'currentColor' : 'none'" />
                </button>
                <button
                  @click="deleteHistoryItem(item.id)"
                  class="p-1 text-gray-400 hover:text-red-400 rounded hover:bg-gray-700 transition-colors"
                >
                  <Trash2 class="h-3 w-3" />
                </button>
              </div>
            </div>

            <!-- Preview Images -->
            <div class="grid grid-cols-4 gap-1 mb-2">
              <!-- For clothing generation -->
              <template v-if="item.type === 'clothing'">
                <!-- Models -->
                <div v-for="model in (item as ClothingHistoryItem).models.slice(0, 1)" :key="model.id" class="aspect-square rounded overflow-hidden relative">
                  <img :src="model.thumbnail" :alt="model.name" class="w-full h-full object-cover" />
                  <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 truncate">
                    {{ model.name }}
                  </div>
                </div>
                <!-- Clothing -->
                <div v-for="top in (item as ClothingHistoryItem).tops.slice(0, 1)" :key="top.id" class="aspect-square rounded overflow-hidden relative">
                  <img :src="top.thumbnail" :alt="top.name" class="w-full h-full object-cover" />
                  <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 truncate">
                    {{ top.name }}
                  </div>
                </div>
                <div v-for="bottom in (item as ClothingHistoryItem).bottoms.slice(0, 1)" :key="bottom.id" class="aspect-square rounded overflow-hidden relative">
                  <img :src="bottom.thumbnail" :alt="bottom.name" class="w-full h-full object-cover" />
                  <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 truncate">
                    {{ bottom.name }}
                  </div>
                </div>
              </template>
              
              <!-- For pose generation -->
              <template v-else-if="item.type === 'pose'">
                <!-- Model -->
                <div v-if="(item as PoseHistoryItem).model || (item as PoseHistoryItem).uploadedModel" class="aspect-square rounded overflow-hidden relative">
                  <img
                    :src="(item as PoseHistoryItem).model?.thumbnail || (item as PoseHistoryItem).uploadedModel"
                    :alt="(item as PoseHistoryItem).model?.name || '上传模特'"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 truncate">
                    {{ (item as PoseHistoryItem).model?.name || '上传模特' }}
                  </div>
                </div>
                <!-- Pose -->
                <div v-if="(item as PoseHistoryItem).selectedPose" class="aspect-square rounded overflow-hidden relative">
                  <img
                    :src="(item as PoseHistoryItem).selectedPose.thumbnail"
                    :alt="(item as PoseHistoryItem).selectedPose.name"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 truncate">
                    {{ (item as PoseHistoryItem).selectedPose.name }}
                  </div>
                </div>
                <!-- Aspect ratio indicator -->
                <div v-if="(item as PoseHistoryItem).aspectRatio" class="aspect-square rounded overflow-hidden bg-gray-700 flex items-center justify-center">
                  <span class="text-xs text-gray-400">{{ (item as PoseHistoryItem).aspectRatio.name }}</span>
                </div>
              </template>

              <!-- For video generation -->
              <template v-else-if="item.type === 'video'">
                <!-- Source Images -->
                <div
                  v-for="(img, idx) in (item as VideoHistoryItem).images.slice(0, 3)"
                  :key="img.id"
                  class="aspect-square rounded overflow-hidden relative"
                >
                  <img :src="img.url" :alt="`图片 ${idx + 1}`" class="w-full h-full object-cover" />
                  <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 truncate">
                    图 {{ idx + 1 }}
                  </div>
                </div>
                <!-- Video result thumbnail (if available) -->
                <div v-if="(item as VideoHistoryItem).result" class="aspect-square rounded overflow-hidden relative">
                  <img :src="(item as VideoHistoryItem).result!.thumbnail" alt="视频" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play class="w-6 h-6 text-white" />
                  </div>
                  <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 flex items-center justify-between">
                    <span>视频</span>
                    <span>{{ (item as VideoHistoryItem).result!.duration }}s</span>
                  </div>
                </div>
              </template>

              <!-- Results preview (fallback for all types) -->
              <div v-if="item.type !== 'video' && (item as ClothingHistoryItem | PoseHistoryItem).results && (item as ClothingHistoryItem | PoseHistoryItem).results.length > 0" class="aspect-square rounded overflow-hidden">
                <img :src="(item as ClothingHistoryItem | PoseHistoryItem).results[0]?.url || ''" alt="Result" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- Details -->
            <div class="space-y-2">
              <p class="text-xs text-gray-300 line-clamp-2">
                {{ item.type === 'video' ? (item as VideoHistoryItem).description : (item as any).prompt }}
              </p>

              <!-- Info Row -->
              <div class="text-xs text-gray-500">
                <template v-if="item.type === 'clothing'">
                  {{ (item as ClothingHistoryItem).models.length }}个模特 • {{ (item as ClothingHistoryItem).tops.length + (item as ClothingHistoryItem).bottoms.length }}件服装
                  {{ (item as ClothingHistoryItem).results.length > 0 ? ` • ${(item as ClothingHistoryItem).results.length}张结果` : '' }}
                </template>
                <template v-else-if="item.type === 'pose'">
                  {{ (item as PoseHistoryItem).model || (item as PoseHistoryItem).uploadedModel ? '1个模特' : '无模特' }}
                  {{ (item as PoseHistoryItem).selectedPose ? ` • ${(item as PoseHistoryItem).selectedPose.name}` : '' }}
                  {{ (item as PoseHistoryItem).results.length > 0 ? ` • ${(item as PoseHistoryItem).results.length}张结果` : '' }}
                </template>
                <template v-else-if="item.type === 'video'">
                  {{ (item as VideoHistoryItem).images.length }}张图片 • {{ (item as VideoHistoryItem).aspectRatio.name }}
                  {{ (item as VideoHistoryItem).highQuality ? ' • 高清' : '' }}
                  {{ (item as VideoHistoryItem).result ? ` • ${(item as VideoHistoryItem).result!.duration}秒` : '' }}
                </template>
              </div>
              
              <!-- Actions Row -->
              <div class="flex items-center justify-between pt-1">
                <!-- Status Indicator -->
                <div class="flex items-center">
                  <div 
                    :class="[
                      'px-2 py-1 rounded-full flex items-center space-x-1 status-indicator text-xs font-medium',
                      getStatusColor(item.status || 'completed')
                    ]"
                    :title="getStatusText(item.status || 'completed')"
                  >
                    <component 
                      :is="getStatusIcon(item.status || 'completed')" 
                      :class="[
                        'h-3 w-3',
                        item.status === 'processing' ? 'animate-spin' : ''
                      ]" 
                    />
                    <span>{{ getStatusText(item.status || 'completed') }}</span>
                  </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex items-center space-x-1">
                  <button
                    v-if="(item.type === 'video' && (item as VideoHistoryItem).result) || (item.type !== 'video' && (item as ClothingHistoryItem | PoseHistoryItem).results && (item as ClothingHistoryItem | PoseHistoryItem).results.length > 0)"
                    @click="viewResults(item)"
                    class="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                    title="查看生成结果"
                  >
                    <Eye class="h-3.5 w-3.5" />
                  </button>
                  <button
                    @click="useHistoryItem(item)"
                    class="p-1.5 bg-primary-500/20 text-primary-400 rounded hover:bg-primary-500/30 transition-colors"
                    title="重用此配置"
                  >
                    <RotateCcw class="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredHistoryItems.length === 0" class="text-center py-8">
            <Clock class="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p class="text-gray-400 text-sm">
              {{ searchQuery ? '没有找到匹配的历史记录' : '暂无历史记录' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Collapsed State -->
    <div v-else class="flex-1 flex flex-col items-center py-4 space-y-3">
      <!-- Header Icon -->
      <div class="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
        <Clock class="h-4 w-4 text-primary-400" />
      </div>
      
      <!-- Recent History Previews -->
      <div class="flex flex-col space-y-2 w-full px-2">
        <div
          v-for="(item, index) in filteredHistoryItems.slice(0, 4)"
          :key="item.id"
          @click="useHistoryItem(item)"
          :class="[
            'relative w-8 h-8 rounded-md overflow-hidden cursor-pointer transition-all hover:scale-105 hover:ring-1 hover:ring-primary-400 mx-auto',
            `history-item-${index}`
          ]"
          :title="`${formatTime(item.timestamp)} - ${item.type === 'video' ? (item as VideoHistoryItem).description.slice(0, 30) : (item as any).prompt.slice(0, 30)}...`"
        >
          <!-- Show result image if available, otherwise model image -->
          <img
            v-if="item.type !== 'video' && (item as ClothingHistoryItem | PoseHistoryItem).results && (item as ClothingHistoryItem | PoseHistoryItem).results.length > 0"
            :src="(item as ClothingHistoryItem | PoseHistoryItem).results[0]?.url || ''"
            :alt="`历史记录 ${index + 1}`"
            class="w-full h-full object-cover"
            @error="onImageError"
            loading="lazy"
          />
          <img
            v-else-if="item.type === 'clothing' && (item as ClothingHistoryItem).models.length > 0"
            :src="(item as ClothingHistoryItem).models[0].thumbnail"
            :alt="`历史记录 ${index + 1}`"
            class="w-full h-full object-cover"
            @error="onImageError"
            loading="lazy"
          />
          <img
            v-else-if="item.type === 'pose' && ((item as PoseHistoryItem).model || (item as PoseHistoryItem).uploadedModel)"
            :src="(item as PoseHistoryItem).model?.thumbnail || (item as PoseHistoryItem).uploadedModel || ''"
            :alt="`历史记录 ${index + 1}`"
            class="w-full h-full object-cover"
            @error="onImageError"
            loading="lazy"
          />
          <div
            v-else
            class="w-full h-full bg-gray-700 flex items-center justify-center"
          >
            <Clock class="h-3 w-3 text-gray-500" />
          </div>
          
          <!-- Time indicator dot -->
          <div 
            :class="[
              'absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-gray-900',
              index === 0 ? 'bg-green-400' : index === 1 ? 'bg-yellow-400' : 'bg-gray-500'
            ]"
          ></div>
          
          <!-- Batch mode indicator -->
          <div
            v-if="item.type === 'clothing' && (item as ClothingHistoryItem).batchMode"
            class="absolute top-0 left-0 w-2 h-2 bg-blue-400 rounded-br-md"
          ></div>
        </div>
      </div>
      
      <!-- Empty state for collapsed view -->
      <div v-if="filteredHistoryItems.length === 0" class="flex flex-col items-center space-y-2 mt-4">
        <div class="w-6 h-6 bg-gray-700/50 rounded-md"></div>
        <div class="w-5 h-5 bg-gray-700/30 rounded-md"></div>
        <div class="w-4 h-4 bg-gray-700/20 rounded-md"></div>
      </div>
      
      <!-- Expand hint -->
      <div class="text-xs text-gray-600 text-center mt-auto">
        <div class="w-4 h-0.5 bg-gray-600 mx-auto mb-1"></div>
        <div class="w-3 h-0.5 bg-gray-600 mx-auto"></div>
      </div>
    </div>

    <!-- Results Viewing Modal -->
    <div 
      v-if="showResultsModal && selectedHistoryItem" 
      class="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="closeResultsModal"
    >
      <div class="bg-gray-900 rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-800">
          <div class="flex items-center space-x-3">
            <Eye class="h-5 w-5 text-blue-400" />
            <div>
              <h3 class="text-lg font-semibold text-white">生成结果</h3>
              <p class="text-sm text-gray-400">{{ formatTime(selectedHistoryItem.timestamp) }} • {{ currentResults.length }}张图片</p>
            </div>
          </div>
          <button
            @click="closeResultsModal"
            class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="flex-1 overflow-hidden flex">
          <!-- Main Image Display -->
          <div class="flex-1 flex items-center justify-center p-6 bg-gray-950">
            <div class="relative max-w-full max-h-full">
              <img
                :src="currentResults[currentImageIndex]?.url"
                :alt="`Generated result ${currentImageIndex + 1}`"
                class="max-w-full max-h-full object-contain rounded-lg"
                @error="onImageError"
              />

              <!-- Navigation Arrows -->
              <button
                v-if="currentResults.length > 1 && currentImageIndex > 0"
                @click="prevImage"
                class="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all"
              >
                <ChevronLeft class="h-5 w-5" />
              </button>

              <button
                v-if="currentResults.length > 1 && currentImageIndex < currentResults.length - 1"
                @click="nextImage"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all"
              >
                <ChevronRight class="h-5 w-5" />
              </button>

              <!-- Image Counter -->
              <div class="absolute bottom-4 left-4 px-3 py-1 bg-black bg-opacity-70 text-white text-sm rounded-full">
                {{ currentImageIndex + 1 }} / {{ currentResults.length }}
              </div>

              <!-- Download Button -->
              <button
                @click="downloadImage(currentResults[currentImageIndex]?.url || '', currentImageIndex)"
                class="absolute bottom-4 right-4 p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors"
                :title="'下载图片'"
              >
                <Download class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Side Panel - Image Thumbnails -->
          <div class="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <!-- Generation Details -->
            <div class="p-4 border-b border-gray-700">
              <h4 class="text-sm font-semibold text-white mb-2">生成信息</h4>
              <div class="space-y-2 text-xs text-gray-300">
                <template v-if="selectedHistoryItem.type === 'clothing'">
                  <div><span class="text-gray-500">模式:</span> {{ (selectedHistoryItem as ClothingHistoryItem).batchMode ? '批量生成' : '单搭配生成' }}</div>
                  <div><span class="text-gray-500">模特:</span> {{ (selectedHistoryItem as ClothingHistoryItem).models.length }}个</div>
                  <div><span class="text-gray-500">服装:</span> {{ (selectedHistoryItem as ClothingHistoryItem).tops.length + (selectedHistoryItem as ClothingHistoryItem).bottoms.length }}件</div>
                </template>
                <template v-else-if="selectedHistoryItem.type === 'pose'">
                  <div><span class="text-gray-500">类型:</span> 姿势生成</div>
                  <div><span class="text-gray-500">模特:</span> {{ (selectedHistoryItem as PoseHistoryItem).model ? (selectedHistoryItem as PoseHistoryItem).model.name : '上传模特' }}</div>
                  <div v-if="(selectedHistoryItem as PoseHistoryItem).selectedPose"><span class="text-gray-500">姿势:</span> {{ (selectedHistoryItem as PoseHistoryItem).selectedPose.name }}</div>
                  <div v-if="(selectedHistoryItem as PoseHistoryItem).aspectRatio"><span class="text-gray-500">比例:</span> {{ (selectedHistoryItem as PoseHistoryItem).aspectRatio.name }}</div>
                  <div><span class="text-gray-500">数量:</span> {{ (selectedHistoryItem as PoseHistoryItem).generationCount }}张</div>
                </template>
                <div><span class="text-gray-500">Prompt:</span></div>
                <p class="text-gray-300 text-xs leading-relaxed bg-gray-700 p-2 rounded">
                  {{ selectedHistoryItem.type === 'video' ? (selectedHistoryItem as VideoHistoryItem).description : (selectedHistoryItem as any).prompt }}
                </p>
              </div>
            </div>

            <!-- Thumbnails Grid -->
            <div class="flex-1 overflow-y-auto scrollbar-hide p-4">
              <h4 class="text-sm font-semibold text-white mb-3">所有结果 ({{ currentResults.length }})</h4>
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="(result, index) in currentResults"
                  :key="result.id"
                  @click="currentImageIndex = index"
                  :class="[
                    'aspect-square rounded-lg overflow-hidden cursor-pointer transition-all border-2',
                    currentImageIndex === index 
                      ? 'border-primary-500 ring-1 ring-primary-500' 
                      : 'border-gray-600 hover:border-gray-500'
                  ]"
                >
                  <img
                    :src="result.url"
                    :alt="`Result ${index + 1}`"
                    class="w-full h-full object-cover"
                    @error="onImageError"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* History item opacity effects */
.history-item-0 {
  opacity: 1;
}

.history-item-1 {
  opacity: 0.8;
}

.history-item-2 {
  opacity: 0.6;
}

.history-item-3 {
  opacity: 0.4;
}

/* Status indicator animations */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Status indicator hover effects */
.status-indicator {
  transition: all 0.2s ease-in-out;
}

.status-indicator:hover {
  transform: scale(1.1);
}
</style>