<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import TimeGroupSelector from '@/components/TimeGroupSelector.vue'
import ImageGallery from '@/components/ImageGallery.vue'
import ImagePreviewModal from '@/components/ImagePreviewModal.vue'
import AlbumSelector from '@/components/AlbumSelector.vue'
import CreateAlbumModal from '@/components/CreateAlbumModal.vue'
import AlbumManager from '@/components/AlbumManager.vue'
import type { GalleryImage, GroupByType, Album, AlbumGroup, CreateAlbumData } from '@/types/album'

const isMobileMenuOpen = ref(false)
const groupBy = ref<GroupByType>('all')
const selectedImage = ref<GalleryImage | null>(null)
const isPreviewOpen = ref(false)

const isAlbumSelectorOpen = ref(false)
const isCreateAlbumModalOpen = ref(false)
const isAlbumManagerOpen = ref(false)
const selectedImageIds = ref<string[]>([])
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

const mockImages = ref<GalleryImage[]>([
  {
    id: '1',
    url: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2',
    title: 'AI生成模特图像',
    description: '高质量AI生成的时尚模特图像，展现完美的服装搭配效果',
    category: '模特生成',
    albumId: 'album-1',
    createdAt: new Date('2024-11-07'),
    size: { width: 800, height: 1200 },
    fileSize: '2.1MB',
    tags: ['AI生成', '模特', '时尚']
  },
  {
    id: '2',
    url: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2',
    title: '女装展示效果图',
    description: '专业级AI生成的女装展示图像，适用于电商和时尚展示',
    category: '服装展示',
    albumId: 'album-1',
    createdAt: new Date('2024-11-06'),
    size: { width: 800, height: 1200 },
    fileSize: '1.8MB',
    tags: ['服装', '女装', '展示']
  },
  {
    id: '3',
    url: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2',
    title: '正装商务风格',
    description: '正式商务场合的AI生成图像，展现专业形象',
    category: '商务正装',
    albumId: 'album-2',
    createdAt: new Date('2024-11-05'),
    size: { width: 800, height: 1200 },
    fileSize: '2.3MB',
    tags: ['正装', '商务', '专业']
  },
  {
    id: '4',
    url: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2',
    title: '休闲装搭配',
    description: '轻松自然的休闲装AI生成效果，适合日常穿搭参考',
    category: '休闲装',
    albumId: 'album-3',
    createdAt: new Date('2024-10-28'),
    size: { width: 800, height: 1200 },
    fileSize: '1.9MB',
    tags: ['休闲', '日常', '搭配']
  },
  {
    id: '5',
    url: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2',
    title: '运动装系列',
    description: '动感十足的运动装AI生成图像，展现活力风格',
    category: '运动装',
    albumId: 'album-3',
    createdAt: new Date('2024-10-15'),
    size: { width: 800, height: 1200 },
    fileSize: '2.0MB',
    tags: ['运动', '活力', '健身']
  },
  {
    id: '6',
    url: 'https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2',
    title: '夏季清新风',
    description: '清新自然的夏季穿搭AI生成效果',
    category: '季节穿搭',
    albumId: 'album-3',
    createdAt: new Date('2024-09-20'),
    size: { width: 800, height: 1200 },
    fileSize: '1.7MB',
    tags: ['夏季', '清新', '自然']
  }
])

const groupedImages = computed((): AlbumGroup[] => {
  if (groupBy.value === 'all') {
    return [{
      key: 'all',
      title: '所有图片',
      images: mockImages.value,
      count: mockImages.value.length
    }]
  }

  if (groupBy.value === 'album') {
    const albumGroups: AlbumGroup[] = []
    
    const imagesWithoutAlbum = mockImages.value.filter(image => !image.albumId)
    if (imagesWithoutAlbum.length > 0) {
      albumGroups.push({
        key: 'no-album',
        title: '未分组图片',
        images: imagesWithoutAlbum,
        count: imagesWithoutAlbum.length
      })
    }
    
    mockAlbums.value.forEach(album => {
      const albumImages = mockImages.value.filter(image => image.albumId === album.id)
      if (albumImages.length > 0) {
        albumGroups.push({
          key: album.id,
          title: album.name,
          album,
          images: albumImages,
          count: albumImages.length
        })
      }
    })
    
    return albumGroups.sort((a, b) => {
      if (a.album && b.album) {
        return b.album.updatedAt.getTime() - a.album.updatedAt.getTime()
      }
      return a.album ? -1 : 1
    })
  }

  const groups = new Map<string, GalleryImage[]>()
  
  mockImages.value.forEach(image => {
    let key: string
    
    const date = image.createdAt
    
    switch (groupBy.value) {
      case 'day':
        key = date.toDateString()
        break
      case 'month':
        key = `${date.getFullYear()}-${date.getMonth()}`
        break
      case 'year':
        key = date.getFullYear().toString()
        break
      default:
        key = 'all'
    }
    
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(image)
  })

  return Array.from(groups.entries())
    .map(([key, images]): AlbumGroup => ({
      key,
      title: groupBy.value === 'day' 
        ? images[0]?.createdAt.toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          }) || ''
        : groupBy.value === 'month'
        ? images[0]?.createdAt.toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: 'long'
          }) || ''
        : `${images[0]?.createdAt.getFullYear() || ''}年`,
      images,
      count: images.length
    }))
    .sort((a, b) => {
      const dateA = new Date(a.images[0]?.createdAt || 0)
      const dateB = new Date(b.images[0]?.createdAt || 0)
      return dateB.getTime() - dateA.getTime()
    })
})

const totalImages = computed(() => mockImages.value.length)

const handleGroupByChange = (newGroupBy: GroupByType) => {
  groupBy.value = newGroupBy
}

const handleImageClick = (image: GalleryImage) => {
  selectedImage.value = image
  isPreviewOpen.value = true
}

const handleClosePreview = () => {
  isPreviewOpen.value = false
  selectedImage.value = null
}

const handleMoveToAlbum = (imageIds: string[]) => {
  selectedImageIds.value = imageIds
  isAlbumSelectorOpen.value = true
}

const handleAlbumSelectorClose = () => {
  isAlbumSelectorOpen.value = false
  selectedImageIds.value = []
}

const handleMoveImagesToAlbum = (albumId: string, imageIds: string[]) => {
  mockImages.value.forEach(image => {
    if (imageIds.includes(image.id)) {
      image.albumId = albumId
    }
  })
  
  const targetAlbum = mockAlbums.value.find(album => album.id === albumId)
  if (targetAlbum) {
    targetAlbum.imageCount = mockImages.value.filter(img => img.albumId === albumId).length
    targetAlbum.updatedAt = new Date()
  }
}

const handleCreateNewAlbum = () => {
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

const handleOpenAlbumManager = () => {
  isAlbumManagerOpen.value = true
}

const handleCloseAlbumManager = () => {
  isAlbumManagerOpen.value = false
}

const handleEditAlbum = (album: Album) => {
  editingAlbum.value = album
  isCreateAlbumModalOpen.value = true
  isAlbumManagerOpen.value = false
}

const handleDeleteAlbum = (albumId: string) => {
  mockAlbums.value = mockAlbums.value.filter(album => album.id !== albumId)
  mockImages.value.forEach(image => {
    if (image.albumId === albumId) {
      image.albumId = undefined
    }
  })
}

const handleSelectAlbum = (album: Album) => {
  groupBy.value = 'album'
  isAlbumManagerOpen.value = false
}

onMounted(() => {
  console.log('Gallery view mounted with', totalImages.value, 'images')
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
    <div class="container mx-auto px-4 py-8">
      <!-- Group Selector and Album Management -->
      <div class="mb-6">
        <TimeGroupSelector 
          :current-group-by="groupBy" 
          @change="handleGroupByChange" 
          @manage-albums="handleOpenAlbumManager"
        />
      </div>

      <!-- Gallery Content -->
      <div class="space-y-12">
        <div 
          v-for="group in groupedImages" 
          :key="group.key"
          class="group-section"
        >
          <!-- Group Header -->
          <div v-if="groupBy !== 'all'" class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
              <h2 class="text-xl font-semibold text-white">{{ group.title }}</h2>
              <span class="bg-primary-500/20 text-primary-300 text-sm px-3 py-1 rounded-full">
                {{ group.count }} 张图片
              </span>
              <!-- Add album button for album grouping -->
              <button
                v-if="groupBy === 'album' && group.album"
                @click="handleEditAlbum(group.album)"
                class="p-1.5 text-gray-400 hover:text-primary-300 hover:bg-primary-500/10 rounded-lg transition-colors"
                title="编辑相册"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
            </div>
            <div class="h-px bg-gradient-to-r from-gray-700 to-transparent flex-1 ml-6"></div>
          </div>

          <!-- Images Grid -->
          <ImageGallery 
            :images="group.images" 
            @image-click="handleImageClick"
            @move-to-album="handleMoveToAlbum"
          />
        </div>

        <!-- Create New Album Card (only show in album grouping) -->
        <div v-if="groupBy === 'album'" class="group-section">
          <div class="flex items-center justify-center">
            <button
              @click="handleCreateNewAlbum"
              class="group w-full max-w-sm p-8 bg-gray-800/30 border-2 border-dashed border-gray-600 hover:border-primary-500/50 rounded-xl transition-all duration-300 hover:bg-gray-800/50"
            >
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-full mb-4 group-hover:bg-primary-500/30 transition-colors">
                  <svg class="w-8 h-8 text-primary-400 group-hover:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-300 group-hover:text-white mb-2">创建新相册</h3>
                <p class="text-sm text-gray-500 group-hover:text-gray-400">点击创建一个新的图片相册</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div 
        v-if="groupedImages.length === 0"
        class="text-center py-20"
      >
        <div class="text-gray-500 mb-4">
          <svg class="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-400 mb-2">暂无图片</h3>
        <p class="text-gray-500">开始生成你的第一张AI图片吧</p>
        </div>
      </div>

      <!-- Preview Modal -->
      <ImagePreviewModal
        v-if="selectedImage"
        :image="selectedImage"
        :is-open="isPreviewOpen"
        @close="handleClosePreview"
      />

      <!-- Album Selector Modal -->
      <AlbumSelector
        :is-open="isAlbumSelectorOpen"
        :albums="mockAlbums"
        :image-ids="selectedImageIds"
        @close="handleAlbumSelectorClose"
        @move-to-album="handleMoveImagesToAlbum"
        @create-new-album="handleCreateNewAlbum"
      />

      <!-- Create Album Modal -->
      <CreateAlbumModal
        :is-open="isCreateAlbumModalOpen"
        :editing-album="editingAlbum"
        @close="handleCreateAlbumModalClose"
        @create="handleCreateAlbum"
        @update="handleUpdateAlbum"
      />

      <!-- Album Manager Modal -->
      <div 
        v-if="isAlbumManagerOpen"
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto"
      >
        <div class="min-h-screen px-4 py-8">
          <div class="max-w-7xl mx-auto bg-gray-900 border border-gray-700 rounded-xl shadow-2xl">
            <div class="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 class="text-xl font-semibold text-white">相册管理</h2>
              <button
                @click="handleCloseAlbumManager"
                class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="p-6">
              <AlbumManager
                :albums="mockAlbums"
                @create-album="handleCreateNewAlbum"
                @edit-album="handleEditAlbum"
                @delete-album="handleDeleteAlbum"
                @select-album="handleSelectAlbum"
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.group-section {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
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