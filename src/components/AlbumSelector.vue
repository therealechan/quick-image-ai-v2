<script setup lang="ts">
import { ref, computed } from 'vue'
import { cn } from '@/lib/utils'
import { X, FolderOpen, Search, Plus, Check, Image as ImageIcon } from 'lucide-vue-next'
import type { Album } from '@/types/album'

const props = defineProps<{
  isOpen: boolean
  albums: Album[]
  imageIds: string[]
}>()

const emit = defineEmits<{
  close: []
  moveToAlbum: [albumId: string, imageIds: string[]]
  createNewAlbum: []
}>()

const searchQuery = ref('')
const selectedAlbumId = ref<string>('')

const filteredAlbums = computed(() => {
  return props.albums.filter(album =>
    album.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    album.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const selectedAlbum = computed(() => {
  return props.albums.find(album => album.id === selectedAlbumId.value)
})

const canMove = computed(() => {
  return selectedAlbumId.value && props.imageIds.length > 0
})

const handleSelectAlbum = (albumId: string) => {
  selectedAlbumId.value = selectedAlbumId.value === albumId ? '' : albumId
}

const handleMoveImages = () => {
  if (canMove.value) {
    emit('moveToAlbum', selectedAlbumId.value, props.imageIds)
    handleClose()
  }
}

const handleClose = () => {
  emit('close')
  setTimeout(() => {
    searchQuery.value = ''
    selectedAlbumId.value = ''
  }, 300)
}

const handleCreateNew = () => {
  emit('createNewAlbum')
  handleClose()
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}
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
      @keydown="handleEscape"
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
          class="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-700">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-purple-500/20 rounded-lg">
                <FolderOpen class="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 class="text-xl font-semibold text-white">移动到相册</h2>
                <p class="text-sm text-gray-400">选择要移动 {{ imageIds.length }} 张图片的目标相册</p>
              </div>
            </div>
            <button
              @click="handleClose"
              class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Search -->
          <div class="p-4 border-b border-gray-700">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索相册..."
                class="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
              <Search class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <!-- Albums List -->
          <div class="max-h-80 overflow-y-auto">
            <div v-if="filteredAlbums.length > 0" class="p-2">
              <div
                v-for="album in filteredAlbums"
                :key="album.id"
                :class="cn(
                  'flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200',
                  'hover:bg-gray-700/50',
                  selectedAlbumId === album.id
                    ? 'bg-primary-500/20 border border-primary-500/30'
                    : 'border border-transparent'
                )"
                @click="handleSelectAlbum(album.id)"
              >
                <!-- Album Cover/Icon -->
                <div class="w-12 h-12 relative flex-shrink-0">
                  <img
                    v-if="album.coverImage"
                    :src="album.coverImage"
                    :alt="album.name"
                    class="w-full h-full object-cover rounded-lg"
                  />
                  <div v-else class="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
                    <FolderOpen class="w-6 h-6 text-gray-400" />
                  </div>
                  
                  <!-- Selection Indicator -->
                  <div
                    v-if="selectedAlbumId === album.id"
                    class="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center"
                  >
                    <Check class="w-3 h-3 text-white" />
                  </div>
                </div>

                <!-- Album Info -->
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-white line-clamp-1 mb-1">{{ album.name }}</h3>
                  <p v-if="album.description" class="text-sm text-gray-400 line-clamp-1 mb-1">
                    {{ album.description }}
                  </p>
                  <div class="flex items-center space-x-2 text-xs text-gray-500">
                    <span class="flex items-center space-x-1">
                      <ImageIcon class="w-3 h-3" />
                      <span>{{ album.imageCount }} 张</span>
                    </span>
                    <span>•</span>
                    <span>{{ album.updatedAt.toLocaleDateString('zh-CN') }}</span>
                  </div>
                </div>

                <!-- Tags -->
                <div v-if="album.tags && album.tags.length > 0" class="flex flex-wrap gap-1">
                  <span
                    v-for="tag in album.tags.slice(0, 2)"
                    :key="tag"
                    class="text-xs bg-gray-700/50 text-gray-400 px-2 py-0.5 rounded"
                  >
                    {{ tag }}
                  </span>
                  <span v-if="album.tags.length > 2" class="text-xs text-gray-500">
                    +{{ album.tags.length - 2 }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="albums.length === 0" class="text-center py-12">
              <FolderOpen class="w-12 h-12 mx-auto mb-3 text-gray-500" />
              <h3 class="font-medium text-gray-400 mb-2">暂无相册</h3>
              <p class="text-sm text-gray-500 mb-4">创建您的第一个相册</p>
              <button
                @click="handleCreateNew"
                class="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                <Plus class="w-4 h-4" />
                <span>创建相册</span>
              </button>
            </div>

            <!-- No Search Results -->
            <div v-else class="text-center py-12">
              <Search class="w-12 h-12 mx-auto mb-3 text-gray-500" />
              <h3 class="font-medium text-gray-400 mb-2">未找到相册</h3>
              <p class="text-sm text-gray-500">尝试修改搜索关键词</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="p-4 border-t border-gray-700 bg-gray-800/50">
            <div class="flex items-center justify-between mb-4">
              <button
                @click="handleCreateNew"
                class="flex items-center space-x-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                <Plus class="w-4 h-4" />
                <span>创建新相册</span>
              </button>
              
              <div v-if="selectedAlbum" class="text-sm text-gray-400">
                移动到：<span class="text-white font-medium">{{ selectedAlbum.name }}</span>
              </div>
            </div>

            <div class="flex space-x-3">
              <button
                @click="handleClose"
                class="flex-1 px-4 py-3 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                取消
              </button>
              <button
                @click="handleMoveImages"
                :disabled="!canMove"
                :class="cn(
                  'flex-1 px-4 py-3 rounded-lg font-medium transition-colors',
                  'flex items-center justify-center space-x-2',
                  canMove
                    ? 'bg-primary-500 hover:bg-primary-600 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                )"
              >
                <FolderOpen class="w-4 h-4" />
                <span>移动图片</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar */
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