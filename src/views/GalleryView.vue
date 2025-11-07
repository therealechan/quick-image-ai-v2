<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import TimeGroupSelector from '@/components/TimeGroupSelector.vue'
import ImageGallery from '@/components/ImageGallery.vue'
import ImagePreviewModal from '@/components/ImagePreviewModal.vue'

export interface GalleryImage {
  id: string
  url: string
  title: string
  description?: string
  category: string
  createdAt: Date
  size: {
    width: number
    height: number
  }
  fileSize?: string
  tags?: string[]
}

type GroupByType = 'all' | 'day' | 'month' | 'year'

const isMobileMenuOpen = ref(false)
const groupBy = ref<GroupByType>('all')
const selectedImage = ref<GalleryImage | null>(null)
const isPreviewOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const mockImages = ref<GalleryImage[]>([
  {
    id: '1',
    url: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2',
    title: 'AI生成模特图像',
    description: '高质量AI生成的时尚模特图像，展现完美的服装搭配效果',
    category: '模特生成',
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
    createdAt: new Date('2024-09-20'),
    size: { width: 800, height: 1200 },
    fileSize: '1.7MB',
    tags: ['夏季', '清新', '自然']
  }
])

const groupedImages = computed(() => {
  if (groupBy.value === 'all') {
    return [{
      key: 'all',
      title: '所有图片',
      images: mockImages.value,
      count: mockImages.value.length
    }]
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
    .map(([key, images]) => ({
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
      <!-- Group Selector -->
      <div class="mb-6">
        <TimeGroupSelector 
          :current-group-by="groupBy" 
          @change="handleGroupByChange" 
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
            </div>
            <div class="h-px bg-gradient-to-r from-gray-700 to-transparent flex-1 ml-6"></div>
          </div>

          <!-- Images Grid -->
          <ImageGallery 
            :images="group.images" 
            @image-click="handleImageClick"
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