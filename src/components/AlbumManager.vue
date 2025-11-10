<script setup lang="ts">
import { ref, computed } from 'vue'
import { cn } from '@/lib/utils'
import { Plus, Edit3, Trash2, FolderOpen, Image } from 'lucide-vue-next'
import type { Album } from '@/types/album'

const props = defineProps<{
  albums: Album[]
}>()

const emit = defineEmits<{
  createAlbum: []
  editAlbum: [album: Album]
  deleteAlbum: [albumId: string]
  selectAlbum: [album: Album]
}>()

const searchQuery = ref('')
const sortBy = ref<'name' | 'created' | 'updated' | 'count'>('updated')
const sortOrder = ref<'asc' | 'desc'>('desc')

const filteredAlbums = computed(() => {
  const filtered = props.albums.filter(album =>
    album.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    album.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )

  filtered.sort((a, b) => {
    let aValue: string | number | Date
    let bValue: string | number | Date

    switch (sortBy.value) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'created':
        aValue = a.createdAt.getTime()
        bValue = b.createdAt.getTime()
        break
      case 'updated':
        aValue = a.updatedAt.getTime()
        bValue = b.updatedAt.getTime()
        break
      case 'count':
        aValue = a.imageCount
        bValue = b.imageCount
        break
      default:
        return 0
    }

    if (sortOrder.value === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  return filtered
})

const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handleDeleteAlbum = (album: Album) => {
  if (confirm(`确定要删除相册 "${album.name}" 吗？此操作不可撤销。`)) {
    emit('deleteAlbum', album.id)
  }
}
</script>

<template>
  <div class="album-manager">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-white mb-2">相册管理</h2>
        <p class="text-gray-400">管理您的图片相册，创建新相册或编辑现有相册</p>
      </div>
      <button
        @click="emit('createAlbum')"
        class="flex items-center justify-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto"
      >
        <Plus class="w-5 h-5" />
        <span class="font-medium">新建相册</span>
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索相册..."
              class="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div class="absolute left-3 top-2.5">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Sort Options -->
        <div class="flex gap-2">
          <select
            v-model="sortBy"
            class="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="updated">更新时间</option>
            <option value="created">创建时间</option>
            <option value="name">名称</option>
            <option value="count">图片数量</option>
          </select>
          <button
            @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
            :class="cn(
              'px-3 py-2 border border-gray-600 rounded-lg transition-colors',
              'hover:bg-gray-600/50 text-white'
            )"
            :title="sortOrder === 'asc' ? '升序' : '降序'"
          >
            <svg 
              class="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              :style="{ transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)' }"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Albums Grid -->
    <div v-if="filteredAlbums.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="album in filteredAlbums"
        :key="album.id"
        class="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300"
      >
        <!-- Album Cover -->
        <div 
          class="aspect-square relative overflow-hidden bg-gray-700 cursor-pointer"
          @click="emit('selectAlbum', album)"
        >
          <img
            v-if="album.coverImage"
            :src="album.coverImage"
            :alt="album.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900/20 to-secondary-900/20">
            <FolderOpen class="w-12 h-12 text-gray-500" />
          </div>
          
          <!-- Overlay -->
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-white font-medium">查看相册</span>
            </div>
          </div>
          
          <!-- Image Count Badge -->
          <div class="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
            <Image class="w-3 h-3" />
            <span>{{ album.imageCount }}</span>
          </div>
        </div>

        <!-- Album Info -->
        <div class="p-4">
          <h3 
            class="font-semibold text-white line-clamp-1 cursor-pointer hover:text-primary-300 transition-colors mb-2"
            @click="emit('selectAlbum', album)"
          >
            {{ album.name }}
          </h3>
          
          <p v-if="album.description" class="text-sm text-gray-400 mb-3 line-clamp-2">
            {{ album.description }}
          </p>
          
          <!-- Tags -->
          <div v-if="album.tags && album.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
            <span
              v-for="tag in album.tags.slice(0, 3)"
              :key="tag"
              class="text-xs bg-gray-700/50 text-gray-300 px-2 py-0.5 rounded"
            >
              {{ tag }}
            </span>
            <span
              v-if="album.tags.length > 3"
              class="text-xs text-gray-500"
            >
              +{{ album.tags.length - 3 }}
            </span>
          </div>
          
          <!-- Meta Info -->
          <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>更新：{{ formatDate(album.updatedAt) }}</span>
            <span>创建：{{ formatDate(album.createdAt) }}</span>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between pt-2 border-t border-gray-700/50">
            <button
              @click="emit('selectAlbum', album)"
              class="flex items-center space-x-1 px-3 py-1.5 bg-primary-500/10 hover:bg-primary-500/20 text-primary-300 text-sm rounded-lg transition-colors"
            >
              <FolderOpen class="w-3 h-3" />
              <span>查看</span>
            </button>
            
            <div class="flex space-x-1">
              <button
                @click="emit('editAlbum', album)"
                class="p-1.5 text-gray-400 hover:text-primary-300 hover:bg-primary-500/10 rounded-lg transition-colors"
                title="编辑相册"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                @click="handleDeleteAlbum(album)"
                class="p-1.5 text-gray-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                title="删除相册"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="props.albums.length === 0" class="text-center py-16">
      <FolderOpen class="w-16 h-16 mx-auto mb-4 text-gray-500" />
      <h3 class="text-xl font-semibold text-gray-400 mb-2">暂无相册</h3>
      <p class="text-gray-500">点击右上角"新建相册"按钮创建您的第一个相册</p>
    </div>

    <!-- No Search Results -->
    <div v-else class="text-center py-16">
      <div class="text-gray-500 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-400 mb-2">未找到相册</h3>
      <p class="text-gray-500">尝试修改搜索关键词</p>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.album-manager {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>