<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import { Upload, Download } from 'lucide-vue-next'

const isMobileMenuOpen = ref(false)

// Selection states
const selectedImages = ref<any[]>([])
const uploadedImages = ref<any[]>([])
const generatedResults = ref<any[]>([])
const isGenerating = ref(false)
const showImageSelection = ref(false)

// Image gallery options
const imageGallery = ref([
  { id: '1', name: '时尚模特 1', url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=400&fit=crop', thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=200&fit=crop' },
  { id: '2', name: '时尚模特 2', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=400&fit=crop', thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=200&fit=crop' },
  { id: '3', name: '商务人士', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=200&fit=crop' },
  { id: '4', name: '休闲模特', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop', thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=200&fit=crop' },
  { id: '5', name: '运动风格', url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&h=400&fit=crop', thumbnail: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=200&fit=crop' },
  { id: '6', name: '艺术风格', url: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=300&h=400&fit=crop', thumbnail: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=150&h=200&fit=crop' }
])

const sampleResults = ref([
  { id: '1', url: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=400&h=600&fit=crop', original: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=200&h=300&fit=crop' },
  { id: '2', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop', original: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=300&fit=crop' },
  { id: '3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', original: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop' },
  { id: '4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop', original: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=300&fit=crop' }
])

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const selectImageFromGallery = (image: any) => {
  const existingIndex = selectedImages.value.findIndex(img => img.id === image.id)
  if (existingIndex > -1) {
    selectedImages.value.splice(existingIndex, 1)
  } else {
    selectedImages.value.push(image)
  }
}

const uploadImages = () => {
  // 模拟图片上传
  const newImages = [
    { id: 'upload-1', url: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=300&h=400&fit=crop', name: '图片1.jpg', isUploaded: true },
    { id: 'upload-2', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=400&fit=crop', name: '图片2.jpg', isUploaded: true }
  ]
  uploadedImages.value = [...uploadedImages.value, ...newImages]
}

const removeImage = (id: string, isUploaded: boolean = false) => {
  if (isUploaded) {
    uploadedImages.value = uploadedImages.value.filter(img => img.id !== id)
  } else {
    selectedImages.value = selectedImages.value.filter(img => img.id !== id)
  }
}

const getAllSelectedImages = () => {
  return [...selectedImages.value, ...uploadedImages.value]
}

const generateUpscaledImages = () => {
  const allImages = getAllSelectedImages()
  if (allImages.length === 0) {
    alert('请先选择图片')
    return
  }

  isGenerating.value = true
  
  // 模拟生成过程
  setTimeout(() => {
    generatedResults.value = allImages.map((img) => ({
      id: `result-${img.id}`,
      original: img.url,
      upscaled: `https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=800&h=1200&fit=crop`,
      name: img.name || `放大图片 ${img.id}`
    }))
    isGenerating.value = false
  }, 4000)
}

onMounted(() => {
  // 页面初始化
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
    <main class="flex-1 flex overflow-hidden">
      <!-- Left Panel - Controls -->
      <div class="w-full lg:w-1/2 bg-gray-950 p-6 overflow-y-auto border-r border-gray-800">
        <div class="max-w-lg mx-auto">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-white mb-2">高清图放大</h1>
            <p class="text-gray-400">AI图像超分辨率，让模糊图片变清晰</p>
          </div>

          <!-- Image Selection -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">选择图片</h2>
            
            <!-- Toggle between gallery and upload -->
            <div class="flex space-x-2 mb-4">
              <button
                @click="showImageSelection = true"
                class="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700"
              >
                从图库选择
              </button>
              <button
                @click="uploadImages"
                class="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700"
              >
                上传图片
              </button>
            </div>

            <!-- Selected Images from Gallery -->
            <div v-if="selectedImages.length > 0" class="mb-4">
              <h3 class="text-sm font-medium text-gray-300 mb-2">从图库选择 ({{ selectedImages.length }})</h3>
              <div class="space-y-2">
                <div
                  v-for="image in selectedImages"
                  :key="image.id"
                  class="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg"
                >
                  <img :src="image.thumbnail" alt="Selected" class="w-12 h-12 object-cover rounded" />
                  <div class="flex-1">
                    <p class="text-white text-sm">{{ image.name }}</p>
                    <p class="text-blue-400 text-xs">图库选择</p>
                  </div>
                  <button
                    @click="removeImage(image.id, false)"
                    class="p-1 text-gray-400 hover:text-red-400"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Uploaded Images -->
            <div v-if="uploadedImages.length > 0">
              <h3 class="text-sm font-medium text-gray-300 mb-2">上传图片 ({{ uploadedImages.length }})</h3>
              <div class="space-y-2">
                <div
                  v-for="image in uploadedImages"
                  :key="image.id"
                  class="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg"
                >
                  <img :src="image.url" alt="Uploaded" class="w-12 h-12 object-cover rounded" />
                  <div class="flex-1">
                    <p class="text-white text-sm">{{ image.name }}</p>
                    <p class="text-green-400 text-xs">上传成功</p>
                  </div>
                  <button
                    @click="removeImage(image.id, true)"
                    class="p-1 text-gray-400 hover:text-red-400"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="selectedImages.length === 0 && uploadedImages.length === 0" class="text-center py-8 text-gray-500">
              <p class="text-sm">从图库选择或上传图片开始</p>
            </div>
          </div>

          <!-- Generate Button -->
          <button
            @click="generateUpscaledImages"
            :disabled="getAllSelectedImages().length === 0 || isGenerating"
            class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:from-gray-700 disabled:to-gray-700 text-white py-4 rounded-lg font-semibold transition-all disabled:cursor-not-allowed"
          >
            <span v-if="isGenerating">处理中...</span>
            <span v-else>开始放大</span>
          </button>

          <div class="mt-4 text-center">
            <p class="text-gray-500 text-sm">预计处理时间：1-2分钟/张</p>
          </div>
        </div>
      </div>

      <!-- Right Panel - Results -->
      <div class="hidden lg:block w-1/2 bg-gray-900 p-6 overflow-y-auto">
        <div class="max-w-lg mx-auto">
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-white mb-4">处理结果</h2>
          </div>

          <div v-if="isGenerating" class="text-center py-16">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p class="text-gray-400">正在处理图片...</p>
          </div>

          <div v-else-if="generatedResults.length > 0" class="space-y-6">
            <div
              v-for="result in generatedResults"
              :key="result.id"
              class="bg-gray-800 rounded-lg p-4"
            >
              <div class="grid grid-cols-2 gap-4 mb-3">
                <!-- Original -->
                <div>
                  <p class="text-gray-400 text-xs mb-2">原图</p>
                  <img
                    :src="result.original"
                    alt="Original"
                    class="w-full aspect-[3/4] object-cover rounded"
                  />
                </div>
                <!-- Upscaled -->
                <div>
                  <p class="text-gray-400 text-xs mb-2">4x 放大</p>
                  <div class="relative">
                    <img
                      :src="result.upscaled"
                      alt="Upscaled"
                      class="w-full aspect-[3/4] object-cover rounded"
                    />
                    <div class="absolute bottom-2 right-2">
                      <button class="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100">
                        <Download class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-center">
                <span class="inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                  处理完成
                </span>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="text-center py-16">
              <h3 class="text-lg font-semibold text-white mb-4">效果展示</h3>
              <div class="grid grid-cols-3 gap-3">
                <div
                  v-for="sample in sampleResults.slice(0, 2)"
                  :key="sample.id"
                  class="space-y-2"
                >
                  <p class="text-gray-400 text-xs">放大前</p>
                  <img
                    :src="sample.original"
                    :alt="`Sample original ${sample.id}`"
                    class="w-full aspect-[3/4] object-cover rounded opacity-60"
                  />
                  <p class="text-gray-400 text-xs">4x 放大后</p>
                  <img
                    :src="sample.url"
                    :alt="`Sample upscaled ${sample.id}`"
                    class="w-full aspect-[3/4] object-cover rounded opacity-60"
                  />
                </div>
              </div>
              <p class="text-gray-500 text-sm mt-4">上传图片后开始处理</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Image Gallery Selection Modal -->
    <div 
      v-if="showImageSelection" 
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="showImageSelection = false"
    >
      <div class="bg-gray-900 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-xl font-bold text-white">选择图片</h3>
            <p class="text-gray-400 text-sm mt-1">从图库中选择要放大的图片 (可多选)</p>
          </div>
          <button
            @click="showImageSelection = false"
            class="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Selection Status -->
        <div v-if="selectedImages.length > 0" class="mb-4 p-3 bg-gray-800 rounded-lg border border-primary-500">
          <div class="flex justify-between items-center">
            <span class="text-white text-sm font-medium">
              已选择 {{ selectedImages.length }} 张图片
            </span>
            <button
              @click="selectedImages = []"
              class="text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              清空选择
            </button>
          </div>
        </div>

        <!-- Image Gallery Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <div
            v-for="image in imageGallery"
            :key="image.id"
            @click="selectImageFromGallery(image)"
            :class="[
              'relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border-2 group',
              selectedImages.some(img => img.id === image.id) 
                ? 'border-primary-500 ring-2 ring-primary-500/30' 
                : 'border-gray-700 hover:border-primary-500'
            ]"
          >
            <img
              :src="image.thumbnail"
              :alt="image.name"
              class="w-full h-full object-cover"
            />
            
            <!-- Selection Overlay -->
            <div 
              :class="[
                'absolute inset-0 transition-all',
                selectedImages.some(img => img.id === image.id)
                  ? 'bg-primary-500/20'
                  : 'bg-black/0 group-hover:bg-black/20'
              ]"
            ></div>
            
            <!-- Selection Checkbox -->
            <div class="absolute top-2 right-2">
              <div 
                :class="[
                  'w-6 h-6 rounded border-2 flex items-center justify-center transition-all',
                  selectedImages.some(img => img.id === image.id)
                    ? 'bg-primary-500 border-primary-500'
                    : 'bg-gray-800/80 border-gray-600 group-hover:border-primary-500'
                ]"
              >
                <svg v-if="selectedImages.some(img => img.id === image.id)" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>

            <!-- Image Info -->
            <div class="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
              <p class="text-sm font-medium">{{ image.name }}</p>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="flex justify-between items-center">
          <button
            @click="showImageSelection = false"
            class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            完成选择
          </button>
          <div class="text-sm text-gray-400">
            {{ selectedImages.length > 0 ? `将处理 ${selectedImages.length} 张图片` : '点击图片进行选择' }}
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