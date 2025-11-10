<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import AlbumManager from '@/components/AlbumManager.vue'
import CreateAlbumModal from '@/components/CreateAlbumModal.vue'
import type { Album, CreateAlbumData } from '@/types/album'

const router = useRouter()

const isMobileMenuOpen = ref(false)
const isCreateAlbumModalOpen = ref(false)
const editingAlbum = ref<Album | null>(null)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const goToGallery = () => {
  router.push('/gallery')
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

const handleViewAlbum = (album: Album) => {
  router.push(`/albums/${album.id}`)
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
        <div class="container mx-auto px-4 py-6">
          <!-- Breadcrumb -->
          <div class="mb-6">
            <nav class="flex items-center space-x-2 text-sm">
              <button
                @click="goToGallery"
                class="text-gray-400 hover:text-primary-300 transition-colors"
              >
                图片库
              </button>
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
              <span class="text-white font-medium">管理相册</span>
            </nav>
          </div>

          <!-- Album Manager -->
          <AlbumManager
            :albums="mockAlbums"
            @create-album="handleCreateNewAlbum"
            @edit-album="handleEditAlbum"
            @delete-album="handleDeleteAlbum"
            @select-album="handleSelectAlbum"
            @view-album="handleViewAlbum"
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