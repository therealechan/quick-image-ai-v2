<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import { Upload, Download } from 'lucide-vue-next'

const isMobileMenuOpen = ref(false)

// Selection states
const uploadedImages = ref<any[]>([])
const generatedResults = ref<any[]>([])
const isGenerating = ref(false)

// Settings
const upscaleSettings = ref({
  ratio: '4x',
  enhancement: 'detail'
})

// Mock data
const ratioOptions = ['2x', '4x', '8x']
const enhancementOptions = [
  { value: 'detail', label: '细节增强' },
  { value: 'face', label: '面部优化' },
  { value: 'art', label: '艺术风格' },
  { value: 'photo', label: '照片真实' }
]

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

const uploadImages = () => {
  // 模拟图片上传
  uploadedImages.value = [
    { id: '1', url: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=300&h=400&fit=crop', name: '图片1.jpg' },
    { id: '2', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=400&fit=crop', name: '图片2.jpg' }
  ]
}

const removeImage = (id: string) => {
  uploadedImages.value = uploadedImages.value.filter(img => img.id !== id)
}

const generateUpscaledImages = () => {
  if (uploadedImages.value.length === 0) {
    alert('请先上传图片')
    return
  }

  isGenerating.value = true
  
  // 模拟生成过程
  setTimeout(() => {
    generatedResults.value = uploadedImages.value.map((img) => ({
      id: `result-${img.id}`,
      original: img.url,
      upscaled: `https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=800&h=1200&fit=crop`,
      ratio: upscaleSettings.value.ratio,
      enhancement: upscaleSettings.value.enhancement
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

          <!-- Upload Images -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">上传图片</h2>
            
            <div
              @click="uploadImages"
              class="border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-lg p-6 text-center cursor-pointer transition-colors group"
            >
              <Upload class="h-8 w-8 text-gray-500 group-hover:text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 group-hover:text-gray-400 text-sm">选择图片</p>
              <p class="text-gray-600 text-xs">支持JPG、PNG格式，最大10MB</p>
            </div>

            <!-- Uploaded Images -->
            <div v-if="uploadedImages.length > 0" class="mt-4 space-y-3">
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
                  @click="removeImage(image.id)"
                  class="p-1 text-gray-400 hover:text-red-400"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Upscale Settings -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">放大设置</h2>
            
            <!-- Ratio Selection -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-300 mb-2">放大倍数</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="ratio in ratioOptions"
                  :key="ratio"
                  @click="upscaleSettings.ratio = ratio"
                  :class="[
                    'py-2 px-4 rounded-lg text-sm font-medium transition-colors',
                    upscaleSettings.ratio === ratio
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  ]"
                >
                  {{ ratio }}
                </button>
              </div>
            </div>

            <!-- Enhancement Type -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-300 mb-2">增强类型</label>
              <select 
                v-model="upscaleSettings.enhancement"
                class="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option
                  v-for="option in enhancementOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Generate Button -->
          <button
            @click="generateUpscaledImages"
            :disabled="uploadedImages.length === 0 || isGenerating"
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
                  <p class="text-gray-400 text-xs mb-2">{{ result.ratio }} 放大</p>
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
                  {{ result.enhancement === 'detail' ? '细节增强' : result.enhancement === 'face' ? '面部优化' : '已处理' }}
                </span>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="text-center py-16">
              <h3 class="text-lg font-semibold text-white mb-4">效果展示</h3>
              <div class="grid grid-cols-2 gap-4">
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
  </div>
</template>

<style scoped>
:root {
  --primary-400: #8b5cf6;
  --primary-500: #7c3aed;
  --primary-600: #6d28d9;
}
</style>