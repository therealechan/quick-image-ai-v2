<script setup lang="ts">
import { computed } from 'vue'
import type { Album } from '@/types/album'
import { FolderOpen, Image as ImageIcon, MoreVertical, Edit3, Trash2 } from 'lucide-vue-next'

const props = defineProps<{
  album: Album
}>()

const emit = defineEmits<{
  click: [album: Album]
  edit: [album: Album]
  delete: [album: Album]
}>()

const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handleClick = () => {
  emit('click', props.album)
}

const handleEdit = (event: Event) => {
  event.stopPropagation()
  emit('edit', props.album)
}

const handleDelete = (event: Event) => {
  event.stopPropagation()
  emit('delete', props.album)
}
</script>

<template>
  <div 
    class="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300 cursor-pointer"
    @click="handleClick"
  >
    <!-- Album Cover -->
    <div class="aspect-video relative overflow-hidden bg-gray-700">
      <img
        v-if="album.coverImage"
        :src="album.coverImage"
        :alt="album.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900/20 to-secondary-900/20">
        <FolderOpen class="w-8 h-8 text-gray-500" />
      </div>
      
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-white font-medium">查看相册</span>
        </div>
      </div>
      
      <!-- Image Count Badge -->
      <div class="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
        <ImageIcon class="w-3 h-3" />
        <span>{{ album.imageCount }}</span>
      </div>
      
      <!-- Action Menu -->
      <div class="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="relative">
          <div class="flex space-x-1">
            <button
              @click="handleEdit"
              class="p-1.5 bg-black/60 backdrop-blur-sm text-white rounded-lg hover:bg-primary-500/80 transition-colors"
              title="编辑相册"
            >
              <Edit3 class="w-3 h-3" />
            </button>
            <button
              @click="handleDelete"
              class="p-1.5 bg-black/60 backdrop-blur-sm text-white rounded-lg hover:bg-red-500/80 transition-colors"
              title="删除相册"
            >
              <Trash2 class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Album Info -->
    <div class="p-3">
      <h3 class="font-semibold text-white text-sm line-clamp-1 mb-1 group-hover:text-primary-300 transition-colors">
        {{ album.name }}
      </h3>
      
      <p v-if="album.description" class="text-xs text-gray-400 mb-2 line-clamp-1">
        {{ album.description }}
      </p>
      
      <!-- Tags (最多显示2个) -->
      <div v-if="album.tags && album.tags.length > 0" class="flex flex-wrap gap-1 mb-2">
        <span
          v-for="tag in album.tags.slice(0, 2)"
          :key="tag"
          class="text-xs bg-gray-700/50 text-gray-300 px-1.5 py-0.5 rounded"
        >
          {{ tag }}
        </span>
        <span
          v-if="album.tags.length > 2"
          class="text-xs text-gray-500"
        >
          +{{ album.tags.length - 2 }}
        </span>
      </div>
      
      <!-- Meta Info -->
      <div class="text-xs text-gray-500">
        更新：{{ formatDate(album.updatedAt) }}
      </div>
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
</style>