<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Clock, Star, Trash2, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface HistoryItem {
  id: string
  timestamp: Date
  models: any[]
  tops: any[]
  bottoms: any[]
  accessories: any[]
  background: any
  prompt: string
  results: any[]
  isFavorite: boolean
  batchMode: boolean
}

const props = defineProps<{
  isCollapsed?: boolean
}>()

const emit = defineEmits<{
  'use-history': [item: HistoryItem]
  'toggle-collapse': []
}>()

const historyItems = ref<HistoryItem[]>([])
const isCollapsed = ref(props.isCollapsed ?? true)
const searchQuery = ref('')
const filterType = ref<'all' | 'favorites' | 'recent'>('all')

// Mock history data
const mockHistoryData: HistoryItem[] = [
  {
    id: '1',
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
    batchMode: false
  },
  {
    id: '2',
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
    batchMode: true
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    models: [{ id: '1', name: '女性模特 A', thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop' }],
    tops: [{ id: '4', name: '西装外套', thumbnail: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=100&fit=crop' }],
    bottoms: [{ id: '4', name: '短裙', thumbnail: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=100&h=100&fit=crop' }],
    accessories: [{ id: '2', name: '手提包', thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop' }],
    background: { id: '3', name: '办公室背景' },
    prompt: '商务女性，专业形象，正装搭配',
    results: [
      { id: 'r7', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=300&fit=crop' }
    ],
    isFavorite: true,
    batchMode: false
  }
]

const filteredHistoryItems = computed(() => {
  let filtered = historyItems.value

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.prompt.toLowerCase().includes(query) ||
      item.models.some(m => m.name.toLowerCase().includes(query)) ||
      item.tops.some(t => t.name.toLowerCase().includes(query)) ||
      item.bottoms.some(b => b.name.toLowerCase().includes(query))
    )
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

const useHistoryItem = (item: HistoryItem) => {
  const confirmed = confirm(
    `确定要恢复历史记录吗？\n\n` +
    `时间：${formatTime(item.timestamp)}\n` +
    `模式：${item.batchMode ? '批量生成' : '单搭配生成'}\n` +
    `模特：${item.models.length}个\n` +
    `服装：${item.tops.length + item.bottoms.length}件\n` +
    `Prompt：${item.prompt.slice(0, 100)}${item.prompt.length > 100 ? '...' : ''}\n\n` +
    `这将覆盖当前的所有选择设置。`
  )
  
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

const saveToLocalStorage = () => {
  localStorage.setItem('modelGenerationHistory', JSON.stringify(historyItems.value))
}

const loadFromLocalStorage = () => {
  const stored = localStorage.getItem('modelGenerationHistory')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      historyItems.value = parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }))
    } catch (error) {
      console.error('Failed to load history from localStorage:', error)
      historyItems.value = mockHistoryData
    }
  } else {
    historyItems.value = mockHistoryData
  }
}

// Add new history item (called from parent component)
const addHistoryItem = (item: Omit<HistoryItem, 'id' | 'timestamp' | 'isFavorite'>) => {
  const newItem: HistoryItem = {
    ...item,
    id: Date.now().toString(),
    timestamp: new Date(),
    isFavorite: false
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
      <div class="flex-1 overflow-y-auto px-4">
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
                <span v-if="item.batchMode" class="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
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
              <!-- Models -->
              <div v-for="model in item.models.slice(0, 1)" :key="model.id" class="aspect-square rounded overflow-hidden">
                <img :src="model.thumbnail" :alt="model.name" class="w-full h-full object-cover" />
              </div>
              <!-- Clothing -->
              <div v-for="top in item.tops.slice(0, 1)" :key="top.id" class="aspect-square rounded overflow-hidden">
                <img :src="top.thumbnail" :alt="top.name" class="w-full h-full object-cover" />
              </div>
              <div v-for="bottom in item.bottoms.slice(0, 1)" :key="bottom.id" class="aspect-square rounded overflow-hidden">
                <img :src="bottom.thumbnail" :alt="bottom.name" class="w-full h-full object-cover" />
              </div>
              <!-- Results preview -->
              <div v-if="item.results.length > 0" class="aspect-square rounded overflow-hidden">
                <img :src="item.results[0].url" alt="Result" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- Details -->
            <div class="space-y-1">
              <p class="text-xs text-gray-300 line-clamp-2">{{ item.prompt }}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">
                  {{ item.models.length }}个模特 • {{ item.tops.length + item.bottoms.length }}件服装
                  {{ item.results.length > 0 ? ` • ${item.results.length}张结果` : '' }}
                </span>
                <button
                  @click="useHistoryItem(item)"
                  class="flex items-center space-x-1 px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded hover:bg-primary-500/30 transition-colors"
                >
                  <RotateCcw class="h-3 w-3" />
                  <span>重用</span>
                </button>
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
          :title="`${formatTime(item.timestamp)} - ${item.prompt.slice(0, 30)}...`"
        >
          <!-- Show result image if available, otherwise model image -->
          <img
            v-if="item.results.length > 0"
            :src="item.results[0].url"
            :alt="`历史记录 ${index + 1}`"
            class="w-full h-full object-cover"
            @error="onImageError"
            loading="lazy"
          />
          <img
            v-else-if="item.models.length > 0"
            :src="item.models[0].thumbnail"
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
            v-if="item.batchMode"
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
</style>