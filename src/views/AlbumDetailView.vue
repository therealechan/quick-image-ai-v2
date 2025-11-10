<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import ImageGallery from '@/components/ImageGallery.vue'
import ImagePreviewModal from '@/components/ImagePreviewModal.vue'
import AlbumSelector from '@/components/AlbumSelector.vue'
import CreateAlbumModal from '@/components/CreateAlbumModal.vue'
import { albumService } from '@/services/albumService'
import type { Album, GalleryImage, CreateAlbumData } from '@/types/album'
import { ArrowLeft, Edit3, Trash2, FolderOpen, Image as ImageIcon, Calendar, Tag } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const isMobileMenuOpen = ref(false)
const album = ref<Album | null>(null)
const albumImages = ref<GalleryImage[]>([])
const selectedImage = ref<GalleryImage | null>(null)
const isPreviewOpen = ref(false)
const isEditModalOpen = ref(false)
const isAlbumSelectorOpen = ref(false)
const selectedImageIds = ref<string[]>([])
const allAlbums = ref<Album[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const loadAlbumData = async () => {
  const albumId = route.params.id as string
  
  if (!albumId) {
    error.value = '相册ID无效'
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true
    
    // 获取相册信息
    album.value = albumService.getAlbumById(albumId) || null
    
    if (!album.value) {
      error.value = '相册不存在'
      isLoading.value = false
      return
    }

    // 获取相册下的图片
    albumImages.value = albumService.getImagesByAlbumId(albumId)
    
    // 获取所有相册（用于移动图片）
    allAlbums.value = albumService.getAllAlbums()
    
    error.value = null
  } catch (err) {
    console.error('Failed to load album data:', err)
    error.value = '加载相册数据失败'
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push('/albums')
}

const goToGallery = () => {
  router.push('/gallery')
}

const handleImageClick = (image: GalleryImage) => {
  selectedImage.value = image
  isPreviewOpen.value = true
}

const handleClosePreview = () => {
  isPreviewOpen.value = false
  selectedImage.value = null
}

const handleEditAlbum = () => {
  isEditModalOpen.value = true
}

const handleEditModalClose = () => {
  isEditModalOpen.value = false
}

const handleUpdateAlbum = (albumId: string, data: CreateAlbumData) => {
  const updatedAlbum = albumService.updateAlbum(albumId, data)
  if (updatedAlbum) {
    album.value = updatedAlbum
  }
  isEditModalOpen.value = false
}

const handleDeleteAlbum = () => {
  if (!album.value) return
  
  if (confirm(`确定要删除相册 "${album.value.name}" 吗？此操作不可撤销，相册中的图片将移动到未分组。`)) {
    if (albumService.deleteAlbum(album.value.id)) {
      router.push('/albums')
    }
  }
}

const handleMoveToAlbum = (imageIds: string[]) => {
  selectedImageIds.value = imageIds
  isAlbumSelectorOpen.value = true
}

const handleAlbumSelectorClose = () => {
  isAlbumSelectorOpen.value = false
  selectedImageIds.value = []
}

const handleMoveImagesToAlbum = (targetAlbumId: string, imageIds: string[]) => {
  if (albumService.moveImagesToAlbum(imageIds, targetAlbumId)) {
    // 重新加载当前相册的图片
    if (album.value) {
      albumImages.value = albumService.getImagesByAlbumId(album.value.id)
      album.value = albumService.getAlbumById(album.value.id) || album.value
    }
  }
  handleAlbumSelectorClose()
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 监听路由变化重新加载数据
watch(() => route.params.id, () => {
  loadAlbumData()
}, { immediate: true })

onMounted(() => {
  loadAlbumData()
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

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden">
      <div class="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-y-auto">
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-400">加载中...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error || !album" class="flex items-center justify-center h-full">
          <div class="text-center">
            <FolderOpen class="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <h3 class="text-xl font-semibold text-gray-400 mb-2">{{ error || '相册不存在' }}</h3>
            <p class="text-gray-500 mb-6">请检查相册链接是否正确</p>
            <button
              @click="goBack"
              class="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <ArrowLeft class="w-4 h-4" />
              <span>返回相册列表</span>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div v-else class="container mx-auto px-4 py-6">
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
              <button
                @click="goBack"
                class="text-gray-400 hover:text-primary-300 transition-colors"
              >
                管理相册
              </button>
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
              <span class="text-white font-medium">{{ album.name }}</span>
            </nav>
          </div>

          <!-- Album Header -->
          <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <!-- Album Info -->
              <div class="flex-1">
                <div class="flex items-center space-x-4 mb-4">
                  <h1 class="text-2xl font-semibold text-white">{{ album.name }}</h1>
                  <span class="bg-primary-500/20 text-primary-300 px-3 py-1 rounded-full text-sm font-medium">
                    {{ album.imageCount }} 张图片
                  </span>
                </div>
                
                <p v-if="album.description" class="text-gray-300 text-base mb-4">
                  {{ album.description }}
                </p>
                
                <!-- Tags -->
                <div v-if="album.tags && album.tags.length > 0" class="flex flex-wrap items-center gap-2 mb-4">
                  <Tag class="w-4 h-4 text-gray-400" />
                  <span
                    v-for="tag in album.tags"
                    :key="tag"
                    class="bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-sm"
                  >
                    {{ tag }}
                  </span>
                </div>
                
                <!-- Meta Info -->
                <div class="flex items-center space-x-6 text-sm text-gray-400">
                  <div class="flex items-center space-x-2">
                    <Calendar class="w-4 h-4" />
                    <span>创建：{{ formatDate(album.createdAt) }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Calendar class="w-4 h-4" />
                    <span>更新：{{ formatDate(album.updatedAt) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex items-center space-x-3">
                <button
                  @click="goBack"
                  class="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors text-sm font-medium"
                >
                  <ArrowLeft class="w-4 h-4" />
                  <span>返回</span>
                </button>
                <button
                  @click="handleEditAlbum"
                  class="flex items-center space-x-2 px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-300 rounded-lg transition-colors text-sm font-medium"
                >
                  <Edit3 class="w-4 h-4" />
                  <span>编辑</span>
                </button>
                <button
                  @click="handleDeleteAlbum"
                  class="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg transition-colors text-sm font-medium"
                >
                  <Trash2 class="w-4 h-4" />
                  <span>删除</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Images Section -->
          <div v-if="albumImages.length > 0">
            <div class="flex items-center space-x-3 mb-6">
              <h2 class="text-lg font-medium text-white">相册图片</h2>
              <span class="bg-gray-700/50 text-gray-300 text-sm px-3 py-1 rounded-full">
                {{ albumImages.length }} 张
              </span>
            </div>
            
            <ImageGallery 
              :images="albumImages"
              @image-click="handleImageClick"
              @move-to-album="handleMoveToAlbum"
            />
          </div>

          <!-- Empty Album State -->
          <div v-else class="text-center py-16">
            <ImageIcon class="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <h3 class="text-lg font-medium text-gray-400 mb-2">相册为空</h3>
            <p class="text-sm text-gray-500 mb-6">这个相册还没有任何图片</p>
            <button
              @click="goToGallery"
              class="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <span>前往图片库添加图片</span>
            </button>
          </div>
        </div>

        <!-- Preview Modal -->
        <ImagePreviewModal
          v-if="selectedImage"
          :image="selectedImage"
          :is-open="isPreviewOpen"
          @close="handleClosePreview"
        />

        <!-- Edit Album Modal -->
        <CreateAlbumModal
          :is-open="isEditModalOpen"
          :editing-album="album"
          @close="handleEditModalClose"
          @update="handleUpdateAlbum"
        />

        <!-- Album Selector Modal -->
        <AlbumSelector
          :is-open="isAlbumSelectorOpen"
          :albums="allAlbums.filter(a => a.id !== album?.id)"
          :image-ids="selectedImageIds"
          @close="handleAlbumSelectorClose"
          @move-to-album="handleMoveImagesToAlbum"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
.container {
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