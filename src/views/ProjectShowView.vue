<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import { ArrowLeft, Plus, Download, Trash2, Eye, Menu, MoreHorizontal, Calendar, Image as ImageIcon } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const isMobileMenuOpen = ref(false)
const selectedImages = ref<string[]>([])
const showImageModal = ref(false)
const selectedImage = ref<any>(null)

const projectId = computed(() => route.params.id as string)

// Mock project data
const project = ref({
  id: projectId.value,
  name: '夏季服装系列',
  description: '2024夏季新品模特展示',
  serviceType: 'model',
  createdAt: '2024-01-15',
  totalImages: 12
})

// Mock generated images
const generatedImages = ref([
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=300&fit=crop',
    serviceType: 'model',
    generatedAt: '2024-01-15 10:30',
    settings: {
      model: '女性模特 A',
      clothing: '白色衬衫 + 蓝色牛仔裤',
      background: '纯色背景',
      quality: 'high',
      style: 'realistic'
    }
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=400&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=200&h=300&fit=crop',
    serviceType: 'model',
    generatedAt: '2024-01-15 11:15',
    settings: {
      model: '女性模特 A',
      clothing: '红色连衣裙',
      background: '咖啡店',
      quality: 'ultra',
      style: 'fashion'
    }
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=300&fit=crop',
    serviceType: 'pose',
    generatedAt: '2024-01-15 14:22',
    settings: {
      model: '女性模特 B',
      pose: '优雅站姿',
      background: '城市街道',
      quality: 'high'
    }
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop',
    serviceType: 'upscale',
    generatedAt: '2024-01-15 15:45',
    settings: {
      originalSize: '512x768',
      upscaleRatio: '4x',
      enhancement: 'detail + noise reduction',
      finalSize: '2048x3072'
    }
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=300&fit=crop',
    serviceType: 'model',
    generatedAt: '2024-01-16 09:12',
    settings: {
      model: '男性模特 A',
      clothing: '西装外套 + 黑色西装裤',
      background: '办公室',
      quality: 'high',
      style: 'portrait'
    }
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=300&fit=crop',
    serviceType: 'model',
    generatedAt: '2024-01-16 11:33',
    settings: {
      model: '女性模特 A',
      clothing: '运动上衣 + 运动裤',
      background: '公园',
      quality: 'high',
      style: 'realistic'
    }
  }
])

const serviceTypeColors: { [key: string]: string } = {
  model: 'bg-blue-500/20 text-blue-400',
  pose: 'bg-green-500/20 text-green-400',
  upscale: 'bg-purple-500/20 text-purple-400'
}

const serviceTypeNames: { [key: string]: string } = {
  model: '模特图',
  pose: '姿势图', 
  upscale: '高清图'
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const goBack = () => {
  router.push('/dashboard/projects')
}

const createNewImage = () => {
  router.push(`/dashboard/projects/${projectId.value}/create`)
}

const selectImage = (imageId: string) => {
  const index = selectedImages.value.indexOf(imageId)
  if (index > -1) {
    selectedImages.value.splice(index, 1)
  } else {
    selectedImages.value.push(imageId)
  }
}

const viewImage = (image: any) => {
  selectedImage.value = image
  showImageModal.value = true
}

const downloadImage = (imageUrl: string, imageName: string) => {
  // Mock download functionality
  console.log('Downloading image:', imageUrl)
  alert(`下载 ${imageName} 功能开发中...`)
}

const downloadSelectedImages = () => {
  if (selectedImages.value.length === 0) return
  
  // Mock batch download functionality
  const selectedImageObjects = generatedImages.value.filter(img => selectedImages.value.includes(img.id))
  const imageNames = selectedImageObjects.map(img => `图片-${img.id}`).join(', ')
  
  alert(`开始批量下载 ${selectedImages.value.length} 张图片:\n${imageNames}\n\n批量下载功能开发中...`)
  
  // In real implementation, this would:
  // 1. Create a zip file with all selected images
  // 2. Download the zip file
  // 3. Show progress indicator
}

const deleteSelectedImages = () => {
  if (selectedImages.value.length > 0) {
    const count = selectedImages.value.length
    // Remove selected images (mock)
    generatedImages.value = generatedImages.value.filter(img => !selectedImages.value.includes(img.id))
    selectedImages.value = []
    alert(`已删除 ${count} 张图片`)
  }
}

const isSelected = (imageId: string) => {
  return selectedImages.value.includes(imageId)
}

onMounted(() => {
  if (!projectId.value) {
    router.push('/dashboard/projects')
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
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Mobile Header -->
      <div class="lg:hidden bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <button
            @click="goBack"
            class="p-2 text-gray-400 hover:text-white -ml-2"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <h1 class="text-xl font-bold text-white">{{ project.name }}</h1>
        </div>
        <button
          @click="toggleMobileMenu"
          class="p-2 text-gray-400 hover:text-white"
        >
          <Menu class="w-6 h-6" />
        </button>
      </div>

      <!-- Header -->
      <div class="bg-gray-900 border-b border-gray-800 px-6 lg:px-8 py-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center space-x-4 mb-4 lg:mb-0">
            <button
              @click="goBack"
              class="hidden lg:block p-2 text-gray-400 hover:text-white -ml-2"
            >
              <ArrowLeft class="w-5 h-5" />
            </button>
            <div>
              <h1 class="text-xl font-bold text-white">{{ project.name }}</h1>
              <p class="text-sm text-gray-400">{{ project.description }}</p>
              <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <div class="flex items-center space-x-1">
                  <ImageIcon class="w-4 h-4" />
                  <span>{{ project.totalImages }} 张图片</span>
                </div>
                <div class="flex items-center space-x-1">
                  <Calendar class="w-4 h-4" />
                  <span>{{ project.createdAt }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <div v-if="selectedImages.length > 0" class="flex items-center space-x-3">
              <span class="text-sm text-gray-400">已选择 {{ selectedImages.length }} 张</span>
              <button
                @click="downloadSelectedImages"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
              >
                <Download class="w-4 h-4" />
                <span>批量下载</span>
              </button>
              <button
                @click="deleteSelectedImages"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
              >
                <Trash2 class="w-4 h-4" />
                <span>删除</span>
              </button>
            </div>
            <button
              @click="createNewImage"
              class="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white px-6 py-3 rounded-lg transition-all hover:scale-105 shadow-lg shadow-primary-500/25 flex items-center space-x-2"
            >
              <Plus class="h-5 w-5" />
              <span>创建新图片</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 lg:p-8">
        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div class="text-center">
              <p class="text-xl font-bold text-white">{{ generatedImages.filter(img => img.serviceType === 'model').length }}</p>
              <p class="text-gray-400 text-xs">模特图</p>
            </div>
          </div>
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div class="text-center">
              <p class="text-xl font-bold text-white">{{ generatedImages.filter(img => img.serviceType === 'pose').length }}</p>
              <p class="text-gray-400 text-xs">姿势图</p>
            </div>
          </div>
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div class="text-center">
              <p class="text-xl font-bold text-white">{{ generatedImages.filter(img => img.serviceType === 'upscale').length }}</p>
              <p class="text-gray-400 text-xs">高清图</p>
            </div>
          </div>
        </div>

        <!-- Image Gallery -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div
            v-for="image in generatedImages"
            :key="image.id"
            class="group relative bg-gray-800 rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
            @click="selectImage(image.id)"
          >
            <!-- Image -->
            <div class="aspect-[2/3] relative">
              <img
                :src="image.thumbnail"
                :alt="`Generated image ${image.id}`"
                class="w-full h-full object-cover"
              />
              
              <!-- Overlay -->
              <div 
                :class="[
                  'absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity',
                  isSelected(image.id) ? 'opacity-100 bg-primary-600/30' : ''
                ]"
              />

              <!-- Selection Indicator -->
              <div 
                v-if="isSelected(image.id)"
                class="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
              >
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>

              <!-- Action Buttons -->
              <div class="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="flex items-center justify-between">
                  <span 
                    :class="[
                      'px-2 py-1 rounded-full text-xs',
                      serviceTypeColors[image.serviceType]
                    ]"
                  >
                    {{ serviceTypeNames[image.serviceType] }}
                  </span>
                  
                  <div class="flex items-center space-x-2">
                    <button
                      @click.stop="viewImage(image)"
                      class="p-2 bg-gray-900/80 hover:bg-gray-800 rounded-full transition-colors"
                    >
                      <Eye class="w-4 h-4 text-white" />
                    </button>
                    <button
                      @click.stop="downloadImage(image.url, `image-${image.id}`)"
                      class="p-2 bg-gray-900/80 hover:bg-gray-800 rounded-full transition-colors"
                    >
                      <Download class="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Image Info -->
            <div class="p-4">
              <p class="text-white text-sm font-medium mb-1">图片 {{ image.id }}</p>
              <p class="text-gray-400 text-xs">{{ image.generatedAt }}</p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="generatedImages.length === 0" class="text-center py-16">
          <ImageIcon class="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-white mb-2">还没有生成的图片</h3>
          <p class="text-gray-400 mb-6">点击上方按钮开始创建您的第一张AI图片</p>
          <button
            @click="createNewImage"
            class="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white px-6 py-3 rounded-lg transition-all"
          >
            立即开始
          </button>
        </div>
      </div>
    </main>

    <!-- Image Modal -->
    <div
      v-if="showImageModal && selectedImage"
      @click="showImageModal = false"
      class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
    >
      <div
        @click.stop
        class="bg-gray-800 rounded-xl max-w-4xl w-full max-h-full overflow-auto"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-white">图片详情</h3>
            <button
              @click="showImageModal = false"
              class="p-2 text-gray-400 hover:text-white"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Image -->
            <div class="aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden">
              <img
                :src="selectedImage.url"
                :alt="`Image ${selectedImage.id}`"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Details -->
            <div>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">服务类型</label>
                  <span 
                    :class="[
                      'px-3 py-1 rounded-full text-sm',
                      serviceTypeColors[selectedImage.serviceType]
                    ]"
                  >
                    {{ serviceTypeNames[selectedImage.serviceType] }}
                  </span>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">生成时间</label>
                  <p class="text-white">{{ selectedImage.generatedAt }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">生成设置</label>
                  <div class="bg-gray-900 rounded-lg p-4 space-y-2">
                    <div v-for="(value, key) in selectedImage.settings" :key="key" class="flex justify-between">
                      <span class="text-gray-400 text-sm">{{ key }}:</span>
                      <span class="text-white text-sm">{{ value }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex space-x-3 pt-4">
                  <button
                    @click="downloadImage(selectedImage.url, `image-${selectedImage.id}`)"
                    class="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download class="w-4 h-4" />
                    <span>下载</span>
                  </button>
                  <button
                    class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <MoreHorizontal class="w-4 h-4" />
                    <span>更多</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --primary-400: #8b5cf6;
  --primary-500: #7c3aed;
  --primary-600: #6d28d9;
}
</style>