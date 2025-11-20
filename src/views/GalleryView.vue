<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import TimeGroupSelector from '@/components/TimeGroupSelector.vue'
import ImageGallery from '@/components/ImageGallery.vue'
import ImagePreviewModal from '@/components/ImagePreviewModal.vue'
import AlbumSelector from '@/components/AlbumSelector.vue'
import CreateAlbumModal from '@/components/CreateAlbumModal.vue'
import AlbumCard from '@/components/AlbumCard.vue'
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import { albumService } from '@/services/albumService'
import type { GalleryImage, GroupByType, Album, AlbumGroup, CreateAlbumData } from '@/types/album'

const router = useRouter()

const isMobileMenuOpen = ref(false)
const groupBy = ref<GroupByType>('all')
const selectedImage = ref<GalleryImage | null>(null)
const isPreviewOpen = ref(false)

const isAlbumSelectorOpen = ref(false)
const isCreateAlbumModalOpen = ref(false)
const selectedImageIds = ref<string[]>([])
const editingAlbum = ref<Album | null>(null)

// Delete confirmation modal state
const isDeleteModalOpen = ref(false)
const imagesToDelete = ref<string[]>([])

// Album management state
const albumSearchQuery = ref('')
const albumSortBy = ref<'name' | 'created' | 'updated' | 'count'>('updated')
const albumSortOrder = ref<'asc' | 'desc'>('desc')

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

const albumsWithImages = computed(() => {
  // 使用 albumService 获取相册数据
  let filtered = albumService.getAllAlbums().filter(album => album.imageCount > 0)
  
  // 搜索过滤
  if (albumSearchQuery.value) {
    const query = albumSearchQuery.value.toLowerCase()
    filtered = filtered.filter(album =>
      album.name.toLowerCase().includes(query) ||
      album.description?.toLowerCase().includes(query) ||
      album.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // 排序
  filtered.sort((a, b) => {
    let aValue: string | number | Date
    let bValue: string | number | Date

    switch (albumSortBy.value) {
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

    if (albumSortOrder.value === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })
  
  return filtered
})

const ungroupedImages = computed(() => 
  albumService.getImagesWithoutAlbum()
)

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
  albumService.moveImagesToAlbum(imageIds, albumId)
}

const handleCreateNewAlbum = () => {
  editingAlbum.value = null
  isCreateAlbumModalOpen.value = true
}

const handleCreateAlbumModalClose = () => {
  isCreateAlbumModalOpen.value = false
  editingAlbum.value = null
}

const handleCreateAlbum = (data: CreateAlbumData) => {
  albumService.createAlbum(data)
  isCreateAlbumModalOpen.value = false
}

const handleUpdateAlbum = (albumId: string, data: CreateAlbumData) => {
  albumService.updateAlbum(albumId, data)
  isCreateAlbumModalOpen.value = false
  editingAlbum.value = null
}

const handleEditAlbum = (album: Album) => {
  editingAlbum.value = album
  isCreateAlbumModalOpen.value = true
}

const handleAlbumCardClick = (album: Album) => {
  router.push(`/albums/${album.id}`)
}

const handleDeleteAlbum = (album: Album) => {
  if (confirm(`确定要删除相册 "${album.name}" 吗？此操作不可撤销，相册中的图片将移动到未分组。`)) {
    albumService.deleteAlbum(album.id)
  }
}

const handleDeleteImages = (imageIds: string[]) => {
  imagesToDelete.value = imageIds
  isDeleteModalOpen.value = true
}

const handleDeleteModalClose = () => {
  isDeleteModalOpen.value = false
  imagesToDelete.value = []
}

const handleDeleteModalConfirm = () => {
  const success = albumService.removeImages(imagesToDelete.value)
  if (success) {
    console.log(`成功删除 ${imagesToDelete.value.length} 张图片`)
  }
  handleDeleteModalClose()
}

onMounted(() => {
  console.log('Gallery view mounted with', totalImages.value, 'images')
  
  // 初始化 albumService 的测试数据（如果还没有数据的话）
  if (albumService.getAllAlbums().length === 0) {
    albumService.initializeWithMockData(mockAlbums.value, mockImages.value)
  }
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
          @create-album="handleCreateNewAlbum"
        />
      </div>

      <!-- Gallery Content -->
      <div v-if="groupBy === 'album'">
        <!-- Album Management Header -->
        <div class="mb-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <!-- Search -->
            <div class="flex-1 max-w-md">
              <div class="relative">
                <input
                  v-model="albumSearchQuery"
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
            <div class="flex items-center space-x-3">
              <select
                v-model="albumSortBy"
                class="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="updated">更新时间</option>
                <option value="created">创建时间</option>
                <option value="name">名称</option>
                <option value="count">图片数量</option>
              </select>
              <button
                @click="albumSortOrder = albumSortOrder === 'asc' ? 'desc' : 'asc'"
                class="p-2 border border-gray-600 rounded-lg transition-colors hover:bg-gray-600/50 text-white"
                :title="albumSortOrder === 'asc' ? '升序' : '降序'"
              >
                <svg 
                  class="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  :style="{ transform: albumSortOrder === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)' }"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Album Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <!-- Album Cards -->
          <AlbumCard 
            v-for="album in albumsWithImages"
            :key="album.id"
            :album="album"
            @click="handleAlbumCardClick"
            @edit="handleEditAlbum"
            @delete="handleDeleteAlbum"
          />
        </div>
        
        <!-- Ungrouped Images Section -->
        <div 
          v-if="ungroupedImages.length > 0"
          class="mt-12"
        >
          <div class="flex items-center space-x-3 mb-6">
            <h2 class="text-lg font-medium text-white">未分组图片</h2>
            <span class="bg-primary-500/20 text-primary-300 text-sm px-3 py-1 rounded-full">
              {{ ungroupedImages.length }} 张图片
            </span>
          </div>
          <ImageGallery 
            :images="ungroupedImages" 
            @image-click="handleImageClick"
            @move-to-album="handleMoveToAlbum"
            @delete-images="handleDeleteImages"
          />
        </div>
      </div>

      <!-- Other grouping modes -->
      <div v-else class="space-y-12">
        <div 
          v-for="group in groupedImages" 
          :key="group.key"
          class="group-section"
        >
          <!-- Group Header -->
          <div v-if="groupBy !== 'all'" class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
              <h2 class="text-lg font-medium text-white">{{ group.title }}</h2>
              <span class="bg-primary-500/20 text-primary-300 text-sm px-3 py-1 rounded-full">
                {{ group.count }} 张图片
              </span>
            </div>
            <div class="h-px bg-gradient-to-r from-gray-700 to-transparent flex-1 ml-6"></div>
          </div>

          <!-- Images Grid -->
          <ImageGallery 
            :images="group.images" 
            @image-click="handleImageClick"
            @move-to-album="handleMoveToAlbum"
            @delete-images="handleDeleteImages"
          />
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
        <h3 class="text-lg font-medium text-gray-400 mb-2">暂无图片</h3>
        <p class="text-sm text-gray-500">开始生成你的第一张AI图片吧</p>
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
        :albums="albumService.getAllAlbums()"
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

      <!-- Delete Confirmation Modal -->
      <DeleteConfirmModal
        :is-open="isDeleteModalOpen"
        :image-count="imagesToDelete.length"
        @close="handleDeleteModalClose"
        @confirm="handleDeleteModalConfirm"
      />

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