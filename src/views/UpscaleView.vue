<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import { ArrowLeft, Upload, Image as ImageIcon, Zap, Settings, Eye, Menu, Check, Download } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const isMobileMenuOpen = ref(false)
const currentStep = ref(1)
const selectedSource = ref('')
const selectedImages = ref<any[]>([])
const upscaleSettings = ref({
  ratio: '4x',
  enhancement: 'detail',
  format: 'png',
  quality: 95
})

const projectId = computed(() => route.params.id as string)

const steps = [
  { id: 1, title: '选择图片', description: '上传或选择' },
  { id: 2, title: '放大设置', description: '倍数和增强' },
  { id: 3, title: '预览处理', description: '确认设置' }
]

const project = ref({
  id: projectId.value,
  name: '夏季服装系列',
  description: '高清图放大'
})

// Mock existing images from project
const projectImages = ref([
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=200&fit=crop',
    name: '模特图 1',
    size: '512x768',
    type: 'model'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=400&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=150&h=200&fit=crop',
    name: '模特图 2',
    size: '1024x1024',
    type: 'model'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=200&fit=crop',
    name: '姿势图 1',
    size: '512x512',
    type: 'pose'
  }
])

const ratioOptions = ['2x', '4x', '6x', '8x']
const enhancementOptions = [
  { id: 'detail', name: '细节增强', desc: '增强图片细节和锐度' },
  { id: 'noise', name: '降噪处理', desc: '减少图片噪点' },
  { id: 'face', name: '人脸优化', desc: '专门优化人脸细节' },
  { id: 'balanced', name: '平衡模式', desc: '综合优化效果' }
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const goBack = () => {
  router.push(`/dashboard/projects/${projectId.value}/create`)
}

const nextStep = () => {
  if (currentStep.value < steps.length) {
    currentStep.value++
  } else {
    startUpscale()
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const selectSource = (source: string) => {
  selectedSource.value = source
  if (source === 'upload') {
    // Simulate file upload
    alert('文件上传功能开发中...')
  }
}

const toggleImageSelection = (image: any) => {
  const index = selectedImages.value.findIndex(img => img.id === image.id)
  if (index > -1) {
    selectedImages.value.splice(index, 1)
  } else {
    selectedImages.value.push(image)
  }
}

const isImageSelected = (imageId: string) => {
  return selectedImages.value.some(img => img.id === imageId)
}

const startUpscale = () => {
  alert(`开始处理 ${selectedImages.value.length} 张图片...`)
  // This would implement the actual upscale logic
}

const calculateOutputSize = (originalSize: string, ratio: string) => {
  const [width, height] = originalSize.split('x').map(Number)
  const multiplier = parseInt(ratio)
  return `${(width || 0) * multiplier}x${(height || 0) * multiplier}`
}

const isNextDisabled = computed(() => {
  switch (currentStep.value) {
    case 1: return selectedImages.value.length === 0
    case 2: return false
    case 3: return false
    default: return false
  }
})

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
          <h1 class="text-xl font-bold text-white">高清放大</h1>
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
        <div class="flex items-center space-x-4 mb-6">
          <button
            @click="goBack"
            class="hidden lg:block p-2 text-gray-400 hover:text-white -ml-2"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-xl font-bold text-white">高清图放大</h1>
            <p class="text-gray-400">智能放大图片并增强细节</p>
          </div>
        </div>

        <!-- Step Indicator -->
        <div class="flex items-center space-x-8">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="flex items-center"
            :class="index < steps.length - 1 ? 'flex-1' : ''"
          >
            <div class="flex flex-col items-center">
              <div
                :class="[
                  'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all',
                  currentStep >= step.id
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'bg-gray-700 text-gray-400 border-gray-600'
                ]"
              >
                <Check v-if="currentStep > step.id" class="w-5 h-5" />
                <span v-else class="text-sm">{{ step.id }}</span>
              </div>
              <div class="mt-2 text-center">
                <p :class="['text-sm font-medium', currentStep === step.id ? 'text-purple-400' : 'text-gray-400']">
                  {{ step.title }}
                </p>
              </div>
            </div>
            <div
              v-if="index < steps.length - 1"
              :class="[
                'h-0.5 flex-1 mx-4 transition-all',
                currentStep > step.id ? 'bg-purple-500' : 'bg-gray-600'
              ]"
            />
          </div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="flex-1 overflow-y-auto p-6 lg:p-8 pb-32 lg:pb-28">
        <!-- Step 1: Select Images -->
        <div v-if="currentStep === 1" class="max-w-6xl">
          <div class="mb-8">
            <h2 class="text-xl font-bold text-white mb-2">选择图片来源</h2>
            <p class="text-gray-400">上传新图片或从项目中选择现有图片</p>
          </div>

          <!-- Source Selection -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Upload New -->
            <div
              @click="selectSource('upload')"
              :class="[
                'bg-gray-800 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 p-6',
                selectedSource === 'upload'
                  ? 'border-purple-500 ring-2 ring-purple-500/20'
                  : 'border-gray-700 hover:border-gray-600'
              ]"
            >
              <div class="text-center">
                <div class="p-4 bg-purple-500/20 rounded-full inline-block mb-4">
                  <Upload class="h-8 w-8 text-purple-400" />
                </div>
                <h3 class="text-base font-semibold text-white mb-2">上传新图片</h3>
                <p class="text-gray-400 text-sm">上传需要放大的图片文件</p>
              </div>
            </div>

            <!-- Project Images -->
            <div
              @click="selectSource('project')"
              :class="[
                'bg-gray-800 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 p-6',
                selectedSource === 'project'
                  ? 'border-purple-500 ring-2 ring-purple-500/20'
                  : 'border-gray-700 hover:border-gray-600'
              ]"
            >
              <div class="text-center">
                <div class="p-4 bg-purple-500/20 rounded-full inline-block mb-4">
                  <ImageIcon class="h-8 w-8 text-purple-400" />
                </div>
                <h3 class="text-base font-semibold text-white mb-2">项目图片</h3>
                <p class="text-gray-400 text-sm">从当前项目中选择图片</p>
              </div>
            </div>
          </div>

          <!-- Project Images Grid -->
          <div v-if="selectedSource === 'project'" class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-semibold text-white">项目中的图片</h3>
              <span class="text-sm text-gray-400">已选择 {{ selectedImages.length }} 张</span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div
                v-for="image in projectImages"
                :key="image.id"
                @click="toggleImageSelection(image)"
                :class="[
                  'relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105',
                  isImageSelected(image.id) ? 'ring-2 ring-purple-500' : ''
                ]"
              >
                <div class="aspect-[3/4]">
                  <img
                    :src="image.thumbnail"
                    :alt="image.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="p-3">
                  <p class="text-white text-sm font-medium">{{ image.name }}</p>
                  <p class="text-gray-400 text-xs">{{ image.size }}</p>
                </div>
                
                <!-- Selection Indicator -->
                <div
                  v-if="isImageSelected(image.id)"
                  class="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                >
                  <Check class="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Upscale Settings -->
        <div v-else-if="currentStep === 2" class="max-w-4xl">
          <div class="mb-8">
            <h2 class="text-xl font-bold text-white mb-2">放大设置</h2>
            <p class="text-gray-400">选择放大倍数和增强选项</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Upscale Ratio -->
            <div class="bg-gray-800 rounded-xl p-6">
              <h3 class="text-base font-semibold text-white mb-4">放大倍数</h3>
              <div class="grid grid-cols-2 gap-3">
                <div
                  v-for="ratio in ratioOptions"
                  :key="ratio"
                  @click="upscaleSettings.ratio = ratio"
                  :class="[
                    'p-4 border-2 rounded-lg cursor-pointer transition-all text-center',
                    upscaleSettings.ratio === ratio
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  ]"
                >
                  <p class="text-white font-medium">{{ ratio }}</p>
                  <p class="text-gray-400 text-xs">{{ ratio === '2x' ? '快速' : ratio === '4x' ? '推荐' : ratio === '6x' ? '高质量' : '最高质量' }}</p>
                </div>
              </div>
            </div>

            <!-- Enhancement Options -->
            <div class="bg-gray-800 rounded-xl p-6">
              <h3 class="text-base font-semibold text-white mb-4">增强选项</h3>
              <div class="space-y-3">
                <div
                  v-for="option in enhancementOptions"
                  :key="option.id"
                  @click="upscaleSettings.enhancement = option.id"
                  :class="[
                    'p-4 border-2 rounded-lg cursor-pointer transition-all',
                    upscaleSettings.enhancement === option.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-white font-medium">{{ option.name }}</p>
                      <p class="text-gray-400 text-sm">{{ option.desc }}</p>
                    </div>
                    <div
                      v-if="upscaleSettings.enhancement === option.id"
                      class="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                    >
                      <Check class="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Output Format -->
            <div class="bg-gray-800 rounded-xl p-6">
              <h3 class="text-base font-semibold text-white mb-4">输出格式</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm text-gray-400 mb-2">文件格式</label>
                  <select
                    v-model="upscaleSettings.format"
                    class="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="png">PNG (无损)</option>
                    <option value="jpg">JPG (较小文件)</option>
                    <option value="webp">WebP (最佳压缩)</option>
                  </select>
                </div>
                <div v-if="upscaleSettings.format === 'jpg'">
                  <label class="block text-sm text-gray-400 mb-2">质量 ({{ upscaleSettings.quality }}%)</label>
                  <input
                    v-model="upscaleSettings.quality"
                    type="range"
                    min="60"
                    max="100"
                    class="w-full"
                  />
                </div>
              </div>
            </div>

            <!-- Processing Info -->
            <div class="bg-gray-800 rounded-xl p-6">
              <h3 class="text-base font-semibold text-white mb-4">处理信息</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-400">选中图片:</span>
                  <span class="text-white">{{ selectedImages.length }} 张</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">放大倍数:</span>
                  <span class="text-white">{{ upscaleSettings.ratio }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">增强模式:</span>
                  <span class="text-white">{{ enhancementOptions.find(opt => opt.id === upscaleSettings.enhancement)?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">预计时间:</span>
                  <span class="text-white">{{ selectedImages.length * 30 }}-{{ selectedImages.length * 60 }}秒</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Preview & Process -->
        <div v-else-if="currentStep === 3" class="max-w-6xl">
          <div class="mb-8">
            <h2 class="text-xl font-bold text-white mb-2">预览与处理</h2>
            <p class="text-gray-400">确认设置并开始处理</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Selected Images -->
            <div class="bg-gray-800 rounded-xl p-6">
              <h3 class="text-base font-semibold text-white mb-4">选中的图片 ({{ selectedImages.length }})</h3>
              <div class="space-y-4 max-h-96 overflow-y-auto">
                <div
                  v-for="image in selectedImages"
                  :key="image.id"
                  class="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg"
                >
                  <img
                    :src="image.thumbnail"
                    :alt="image.name"
                    class="w-16 h-20 object-cover rounded"
                  />
                  <div class="flex-1">
                    <p class="text-white font-medium">{{ image.name }}</p>
                    <p class="text-gray-400 text-sm">{{ image.size }} → {{ calculateOutputSize(image.size, upscaleSettings.ratio) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Processing Panel -->
            <div class="bg-gray-800 rounded-xl p-6">
              <h3 class="text-base font-semibold text-white mb-4">处理设置</h3>
              <div class="space-y-4 mb-6">
                <div class="flex justify-between">
                  <span class="text-gray-400">放大倍数:</span>
                  <span class="text-white">{{ upscaleSettings.ratio }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">增强模式:</span>
                  <span class="text-white">{{ enhancementOptions.find(opt => opt.id === upscaleSettings.enhancement)?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">输出格式:</span>
                  <span class="text-white">{{ upscaleSettings.format.toUpperCase() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">处理时间:</span>
                  <span class="text-white">约 {{ Math.ceil(selectedImages.length * 45) }} 秒</span>
                </div>
              </div>
              
              <button
                @click="startUpscale"
                class="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-medium py-4 px-6 rounded-lg transition-all hover:scale-105 shadow-lg shadow-purple-500/25 flex items-center justify-center space-x-3"
              >
                <Zap class="h-5 w-5" />
                <span>开始放大处理</span>
              </button>

              <div class="mt-4 text-center text-sm text-gray-400">
                <p>处理完成后将自动保存到项目中</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="fixed bottom-0 left-0 right-0 lg:left-64 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 px-4 lg:px-6 py-3 z-10">
        <div class="flex justify-between items-center w-full">
          <button
            @click="prevStep"
            :disabled="currentStep === 1"
            :class="[
              'px-6 py-2 rounded-lg transition-colors',
              currentStep === 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            ]"
          >
            上一步
          </button>

          <span class="text-sm text-gray-400">
            步骤 {{ currentStep }} / {{ steps.length }}
          </span>

          <button
            @click="nextStep"
            :disabled="isNextDisabled"
            :class="[
              'px-6 py-2 rounded-lg transition-all',
              isNextDisabled
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white'
            ]"
          >
            {{ currentStep === steps.length ? '开始处理' : '下一步' }}
          </button>
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