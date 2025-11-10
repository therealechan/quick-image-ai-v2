<script setup lang="ts">
import { ref } from 'vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import AlbumManager from '@/components/AlbumManager.vue'
import CreateAlbumModal from '@/components/CreateAlbumModal.vue'
import type { Album, CreateAlbumData } from '@/types/album'

const isMobileMenuOpen = ref(false)
const isCreateAlbumModalOpen = ref(false)
const editingAlbum = ref<Album | null>(null)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const mockAlbums = ref<Album[]>([
  {
    id: 'album-1',
    name: '2025 秋冬捷展长袖卫衣',
    description: '2025年秋冬季捷展品牌长袖卫衣系列展示',
    coverImage: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-08'),
    imageCount: 2,
    tags: ['卫衣', '秋冬', '时尚']
  },
  {
    id: 'album-2',
    name: '商务正装系列',
    description: '专业商务正装展示图片',
    coverImage: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-11-05'),
    imageCount: 1,
    tags: ['商务', '正装', '专业']
  },
  {
    id: 'album-3',
    name: '休闲运动风格',
    description: '休闲运动风格服装展示',
    coverImage: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-10-10'),
    updatedAt: new Date('2024-10-28'),
    imageCount: 3,
    tags: ['休闲', '运动', '舒适']
  }
])

const handleCreateNewAlbum = () => {
  editingAlbum.value = null
  isCreateAlbumModalOpen.value = true
}

const handleCreateAlbumModalClose = () => {
  isCreateAlbumModalOpen.value = false
  editingAlbum.value = null
}

const handleCreateAlbum = (data: CreateAlbumData) => {
  const newAlbum: Album = {
    id: `album-${Date.now()}`,
    name: data.name,
    description: data.description,
    createdAt: new Date(),
    updatedAt: new Date(),
    imageCount: 0,
    tags: data.tags
  }
  
  mockAlbums.value.push(newAlbum)
  isCreateAlbumModalOpen.value = false
}

const handleUpdateAlbum = (albumId: string, data: CreateAlbumData) => {
  const album = mockAlbums.value.find(a => a.id === albumId)
  if (album) {
    album.name = data.name
    album.description = data.description
    album.tags = data.tags
    album.updatedAt = new Date()
  }
  isCreateAlbumModalOpen.value = false
  editingAlbum.value = null
}

const handleEditAlbum = (album: Album) => {
  editingAlbum.value = album
  isCreateAlbumModalOpen.value = true
}

const handleDeleteAlbum = (albumId: string) => {
  if (confirm('确定要删除此相册吗？此操作不可撤销。')) {
    mockAlbums.value = mockAlbums.value.filter(album => album.id !== albumId)
  }
}

const handleSelectAlbum = (album: Album) => {
  // TODO: Navigate to gallery view filtered by this album
  console.log('Selected album:', album.name)
}
</script>

<template>
  <div class="h-screen bg-gray-950 flex overflow-hidden">
    <!-- Sidebar -->
    <DashboardSidebar
      :is-mobile-menu-open="isMobileMenuOpen"
      @toggle-mobile-menu="toggleMobileMenu"
      @close-mobile-menu="closeMobileMenu"
    />

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden">
      <div class="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-y-auto">
        <div class="container mx-auto px-4 py-8">
          <!-- Header -->
          <div class="mb-8">
            <div class="flex items-center space-x-3 mb-4">
              <div class="p-3 bg-primary-500/20 rounded-xl">
                <svg class="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-white">相册管理</h1>
                <p class="text-gray-400 mt-1">创建和管理您的图片相册</p>
              </div>
            </div>
            
            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-400 text-sm">总相册数</p>
                    <p class="text-2xl font-bold text-white">{{ mockAlbums.length }}</p>
                  </div>
                  <div class="p-3 bg-blue-500/20 rounded-lg">
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-400 text-sm">总图片数</p>
                    <p class="text-2xl font-bold text-white">{{ mockAlbums.reduce((sum, album) => sum + album.imageCount, 0) }}</p>
                  </div>
                  <div class="p-3 bg-green-500/20 rounded-lg">
                    <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-400 text-sm">最近更新</p>
                    <p class="text-2xl font-bold text-white">
                      {{ mockAlbums.length > 0 ? 
                        Math.max(...mockAlbums.map(a => a.updatedAt.getTime())) > Date.now() - 86400000 ? '今天' : '1天前'
                        : '-' }}
                    </p>
                  </div>
                  <div class="p-3 bg-purple-500/20 rounded-lg">
                    <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Album Manager -->
          <AlbumManager
            :albums="mockAlbums"
            @create-album="handleCreateNewAlbum"
            @edit-album="handleEditAlbum"
            @delete-album="handleDeleteAlbum"
            @select-album="handleSelectAlbum"
          />
        </div>
      </div>

      <!-- Create Album Modal -->
      <CreateAlbumModal
        :is-open="isCreateAlbumModalOpen"
        :editing-album="editingAlbum"
        @close="handleCreateAlbumModalClose"
        @create="handleCreateAlbum"
        @update="handleUpdateAlbum"
      />
    </main>
  </div>
</template>

<style scoped>
/* Custom animations */
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

.container > * {
  animation: fadeIn 0.6s ease-out;
}
</style>