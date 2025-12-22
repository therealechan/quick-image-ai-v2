<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import GenerationHistory from '../components/GenerationHistory.vue'
import VideoImageUploader from '../components/VideoImageUploader.vue'
import GalleryImportModal from '../components/GalleryImportModal.vue'
import { Sparkles, Play, AlertCircle, CheckCircle, Loader2, Clock } from 'lucide-vue-next'
import type { UploadedImage, AspectRatio, VideoHistoryItem } from '../types/history'

const router = useRouter()
const isMobileMenuOpen = ref(false)
const isHistoryCollapsed = ref(true)

// 图片上传状态
const uploadedImages = ref<UploadedImage[]>([])
const showGalleryImport = ref(false)

// 配置状态
const description = ref('')
const negativePrompt = ref('')
const selectedAspectRatio = ref<AspectRatio | null>(null)
const highQuality = ref(false)

// 智能描述生成状态
const isGeneratingDescription = ref(false)

// 生成状态
const isGenerating = ref(false)
const currentStep = ref(0)
const generatedVideoId = ref<string | null>(null)

// 视频比例选项
const aspectRatioOptions = ref<AspectRatio[]>([
  { id: '3:4', name: '3:4', width: 3, height: 4 },
  { id: '9:16', name: '9:16', width: 9, height: 16 },
  { id: '1:1', name: '1:1', width: 1, height: 1 },
  { id: '16:9', name: '16:9', width: 16, height: 9 },
])

// 生成进度步骤
const progressSteps = [
  '正在上传图片...',
  '分析图片内容...',
  '生成视频帧...',
  '渲染视频...',
  '优化视频质量...',
  '即将完成...'
]

// 计算属性
const canGenerate = computed(() => {
  return uploadedImages.value.length >= 2 && !isGenerating.value && selectedAspectRatio.value
})

const hasAspectRatioWarning = computed(() => {
  if (uploadedImages.value.length < 2) return false

  const ratios = uploadedImages.value.map(img => img.aspectRatio)
  const tolerance = 0.05 // 5% 容差
  const firstRatio = ratios[0]

  return !ratios.every(ratio => Math.abs(ratio - firstRatio) < tolerance)
})

const currentProgressStep = computed(() => {
  return progressSteps[currentStep.value]
})

const progressPercentage = computed(() => {
  return ((currentStep.value + 1) / progressSteps.length) * 100
})

const generatedVideo = computed(() => {
  if (!generatedVideoId.value) return null

  const history: VideoHistoryItem[] = JSON.parse(localStorage.getItem('videoGenerationHistory') || '[]')
  const item = history.find(h => h.id === generatedVideoId.value)

  return item?.result || null
})

// 方法
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleImagesUpdate = (images: UploadedImage[]) => {
  uploadedImages.value = images
}

const handleImportFromGallery = () => {
  showGalleryImport.value = true
}

const handleGalleryImport = (importedImages: UploadedImage[]) => {
  uploadedImages.value = [...uploadedImages.value, ...importedImages]
  showGalleryImport.value = false
}

const selectAspectRatio = (ratio: AspectRatio) => {
  selectedAspectRatio.value = ratio
}

const generateSmartDescription = async () => {
  if (uploadedImages.value.length === 0) {
    alert('请先上传图片')
    return
  }

  isGeneratingDescription.value = true

  try {
    // 模拟 API 调用延迟
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock 返回描述
    const descriptions = [
      '时尚模特展示多套服装，优雅走动，专业T台步伐，柔和打光，现代简约背景',
      '年轻模特户外场景，自然动作变换，阳光明媚，清新活力，街头时尚风格',
      '商务人士专业形象，从站立到坐姿的自然过渡，办公室环境，自信专业气质',
      '模特自然行走，展现服装细节，流畅动作，专业摄影，高品质画面',
      '时尚大片质感，模特优雅转身，展示服装搭配，电影级打光，精致构图'
    ]

    description.value = descriptions[Math.floor(Math.random() * descriptions.length)]
  } catch (error) {
    console.error('生成描述失败:', error)
    alert('生成描述失败，请重试')
  } finally {
    isGeneratingDescription.value = false
  }
}

const generateVideo = async () => {
  if (!canGenerate.value) return

  // 检查是否有正在生成的任务
  const existingTask = localStorage.getItem('videoGenerationTask')
  if (existingTask) {
    const task = JSON.parse(existingTask)
    if (task.status === 'processing') {
      alert('当前有视频正在生成中，请等待完成后再创建新任务')
      return
    }
  }

  isGenerating.value = true
  currentStep.value = 0

  // 创建任务ID
  const taskId = Date.now().toString()

  // 保存任务到 localStorage
  const task = {
    id: taskId,
    status: 'processing',
    startTime: Date.now()
  }
  localStorage.setItem('videoGenerationTask', JSON.stringify(task))

  // 创建历史记录项
  const historyItem: VideoHistoryItem = {
    id: taskId,
    type: 'video',
    timestamp: new Date(),
    images: uploadedImages.value,
    description: description.value,
    negativePrompt: negativePrompt.value,
    aspectRatio: selectedAspectRatio.value!,
    highQuality: highQuality.value,
    isFavorite: false,
    status: 'processing'
  }

  // 保存到历史记录
  const history = JSON.parse(localStorage.getItem('videoGenerationHistory') || '[]')
  history.unshift(historyItem)
  localStorage.setItem('videoGenerationHistory', JSON.stringify(history))

  // 模拟进度
  const stepDuration = 60000 // 每步 1 分钟
  const interval = setInterval(() => {
    if (currentStep.value < progressSteps.length - 1) {
      currentStep.value++
    } else {
      clearInterval(interval)
      completeGeneration(taskId)
    }
  }, stepDuration)
}

const completeGeneration = (taskId: string) => {
  isGenerating.value = false
  generatedVideoId.value = taskId

  // 更新任务状态
  localStorage.removeItem('videoGenerationTask')

  // 更新历史记录
  const history: VideoHistoryItem[] = JSON.parse(localStorage.getItem('videoGenerationHistory') || '[]')
  const itemIndex = history.findIndex(item => item.id === taskId)

  if (itemIndex !== -1) {
    // Mock 生成的视频结果
    history[itemIndex].status = 'completed'
    history[itemIndex].result = {
      id: `video-${taskId}`,
      url: 'https://www.w3schools.com/html/mov_bbb.mp4', // Mock 视频 URL
      thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
      duration: 15 // 15秒视频
    }
    localStorage.setItem('videoGenerationHistory', JSON.stringify(history))
  }
}

const resetForm = () => {
  uploadedImages.value = []
  description.value = ''
  negativePrompt.value = ''
  selectedAspectRatio.value = null
  highQuality.value = false
  generatedVideoId.value = null
}

const viewInGallery = () => {
  router.push('/gallery')
}

// 页面加载时检查是否有进行中的任务
onMounted(() => {
  const existingTask = localStorage.getItem('videoGenerationTask')
  if (existingTask) {
    const task = JSON.parse(existingTask)
    const elapsed = Date.now() - task.startTime
    const totalDuration = 360000 // 6 分钟

    if (elapsed < totalDuration && task.status === 'processing') {
      // 恢复生成状态
      isGenerating.value = true
      currentStep.value = Math.floor((elapsed / totalDuration) * progressSteps.length)

      // 继续进度
      const remaining = totalDuration - elapsed
      const stepDuration = 60000

      setTimeout(() => {
        const interval = setInterval(() => {
          if (currentStep.value < progressSteps.length - 1) {
            currentStep.value++
          } else {
            clearInterval(interval)
            completeGeneration(task.id)
          }
        }, stepDuration)
      }, remaining % stepDuration)
    } else if (task.status === 'processing') {
      // 任务超时，标记为失败
      localStorage.removeItem('videoGenerationTask')
    }
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

    <!-- History Panel -->
    <GenerationHistory
      :is-collapsed="isHistoryCollapsed"
      history-type="video"
      @toggle-collapse="isHistoryCollapsed = !isHistoryCollapsed"
    />

    <!-- Main Content -->
    <main class="flex-1 flex overflow-hidden">
      <!-- Left Panel - Controls -->
      <div :class="[
        'bg-gray-950 p-6 overflow-y-auto scrollbar-hide border-r border-gray-800',
        'w-full',
        'lg:w-1/2',
        'xl:w-1/2'
      ]">
        <div class="max-w-lg mx-auto">
          <!-- Header -->
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-white mb-2">视频生成</h1>
            <p class="text-gray-400 text-sm">上传 2-4 张模特图，生成风格连贯的短视频</p>
          </div>

          <!-- 步骤一：上传图片 -->
          <div class="mb-8">
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                1
              </div>
              <h2 class="text-lg font-semibold text-white">上传图片</h2>
            </div>

          <VideoImageUploader
            :images="uploadedImages"
            :max-images="4"
            :min-images="2"
            @update:images="handleImagesUpdate"
            @import-from-gallery="handleImportFromGallery"
          />

          <!-- 比例一致性警告 -->
          <div v-if="hasAspectRatioWarning" class="mt-4">
            <div class="flex items-start space-x-2 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <AlertCircle class="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div class="text-sm text-yellow-300">
                <p class="font-medium mb-1">图片比例不一致</p>
                <p class="text-yellow-400/80">
                  检测到您上传的图片比例不完全一致，系统会自动裁切为相同比例以保证视频连贯性
                </p>
              </div>
            </div>
          </div>
        </div>

          <!-- 步骤二：配置参数 -->
          <div class="mb-8">
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                2
              </div>
              <h2 class="text-lg font-semibold text-white">配置参数</h2>
            </div>

          <div class="space-y-6">
            <!-- 视频比例 -->
            <div>
              <label class="block text-sm font-medium text-gray-200 mb-3">
                视频比例 <span class="text-red-400">*</span>
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  v-for="ratio in aspectRatioOptions"
                  :key="ratio.id"
                  @click="selectAspectRatio(ratio)"
                  :class="[
                    'p-4 rounded-lg border-2 transition-all duration-200',
                    selectedAspectRatio?.id === ratio.id
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  ]"
                >
                  <div class="text-center">
                    <div class="text-base font-semibold text-white mb-1">{{ ratio.name }}</div>
                    <div class="text-xs text-gray-400">{{ ratio.width }}:{{ ratio.height }}</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- 场景描述 -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <label class="block text-sm font-medium text-gray-200">
                  场景描述
                </label>
                <button
                  @click="generateSmartDescription"
                  :disabled="uploadedImages.length === 0 || isGeneratingDescription"
                  class="flex items-center space-x-2 px-3 py-1.5 bg-primary-500/20 hover:bg-primary-500/30 disabled:bg-gray-700 disabled:cursor-not-allowed text-primary-300 disabled:text-gray-500 text-xs font-medium rounded-lg transition-colors"
                >
                  <Sparkles class="w-4 h-4" />
                  <span>{{ isGeneratingDescription ? '生成中...' : '智能生成' }}</span>
                </button>
              </div>
              <textarea
                v-model="description"
                rows="4"
                placeholder="描述视频中的动作与场景，例如：模特优雅走动，展示服装细节，柔和打光，现代简约背景..."
                class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors text-sm leading-normal"
              />
              <p class="mt-2 text-xs text-gray-400">
                提示：描述格式建议为「主体 + 动作 + 背景 + 细节」，更准确的描述可以减少模型跑偏
              </p>
            </div>

            <!-- 负面提示 -->
            <div>
              <label class="block text-sm font-medium text-gray-200 mb-3">
                不希望出现的内容
              </label>
              <textarea
                v-model="negativePrompt"
                rows="3"
                placeholder="例如：变形、模糊、奇怪光影、低质量、噪点..."
                class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors text-sm leading-normal"
              />
            </div>

            <!-- 高清画质 -->
            <div>
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  v-model="highQuality"
                  class="w-5 h-5 rounded border-gray-700 bg-gray-900 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                />
                <span class="text-sm font-medium text-gray-200">高清画质（推荐）</span>
              </label>
            </div>
            </div>
          </div>

          <!-- 生成按钮 -->
          <div class="mb-6">
            <button
              @click="generateVideo"
              :disabled="!canGenerate"
              :class="[
                'w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                canGenerate
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/20'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              ]"
            >
              <Play class="w-5 h-5" />
              <span>{{ isGenerating ? '生成中...' : '立即生成' }}</span>
            </button>

            <div v-if="!canGenerate" class="mt-2 text-xs text-center text-gray-400">
              <span v-if="uploadedImages.length < 2">请至少上传 2 张图片</span>
              <span v-else-if="!selectedAspectRatio">请选择视频比例</span>
              <span v-else-if="isGenerating">视频生成中，请稍候...</span>
            </div>
          </div>

          <!-- 说明信息 -->
          <div class="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <h3 class="text-sm font-semibold text-white mb-2">温馨提示</h3>
            <ul class="space-y-1 text-xs text-gray-400">
              <li>• 视频生成大约需要 5-6 分钟，请耐心等待</li>
              <li>• 同一时间只能有一个视频生成任务</li>
              <li>• 建议上传比例一致的图片以获得更好的效果</li>
              <li>• 每次生成会产出一条完整视频</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Right Panel - Examples & Results -->
      <div :class="[
        'hidden lg:block bg-gray-900 p-6 overflow-y-auto scrollbar-hide',
        'lg:w-1/2',
        'xl:w-1/2'
      ]">
        <div class="max-w-4xl mx-auto">
          <!-- 生成进度 -->
          <div v-if="isGenerating" class="mb-6">
            <div class="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div class="flex items-center space-x-3 mb-4">
                <Loader2 class="w-6 h-6 text-primary-400 animate-spin" />
                <h2 class="text-lg font-semibold text-white">正在生成视频</h2>
              </div>

              <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-gray-300">{{ currentProgressStep }}</span>
                  <span class="text-sm text-gray-400">{{ Math.round(progressPercentage) }}%</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                  <div
                    class="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${progressPercentage}%` }"
                  />
                </div>
              </div>

              <div class="flex items-center space-x-2 text-sm text-gray-400">
                <Clock class="w-4 h-4" />
                <span>预计还需 {{ progressSteps.length - currentStep - 1 }} 分钟</span>
              </div>

              <!-- 后台生成提示 -->
              <div class="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p class="text-sm text-blue-300">
                  💡 您可以离开此页面，视频将在后台继续生成。生成完成后可在历史记录或图库中查看。
                </p>
              </div>
            </div>
          </div>

          <!-- 生成成功 - 视频预览 -->
          <div v-if="generatedVideoId && generatedVideo" class="mb-6">
            <div class="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
              <!-- 成功标题 -->
              <div class="p-4 bg-green-500/10 border-b border-green-500/30">
                <div class="flex items-center space-x-2">
                  <CheckCircle class="w-5 h-5 text-green-400" />
                  <h3 class="text-base font-semibold text-green-400">视频生成成功！</h3>
                </div>
              </div>

              <!-- 视频预览 -->
              <div class="p-4">
                <div class="aspect-[3/4] relative bg-gray-900 rounded-lg overflow-hidden mb-3">
                  <video
                    :src="generatedVideo.url"
                    :poster="generatedVideo.thumbnail"
                    controls
                    class="w-full h-full object-cover"
                  >
                    您的浏览器不支持视频播放
                  </video>
                </div>

                <div class="flex items-center justify-between text-sm mb-3">
                  <span class="text-gray-300">时长: {{ generatedVideo.duration }}秒</span>
                  <span class="text-gray-400">高清画质</span>
                </div>

                <div class="flex space-x-2">
                  <button
                    @click="viewInGallery"
                    class="flex-1 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    前往图库
                  </button>
                  <button
                    @click="resetForm"
                    class="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    生成新视频
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 示例视频案例 -->
          <div v-if="!generatedVideoId" class="mb-4">
            <h2 class="text-lg font-semibold text-white mb-4">视频案例</h2>
            <div class="grid grid-cols-2 gap-3">
              <!-- 案例 1 -->
              <div class="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors">
                <div class="aspect-[3/4] relative bg-gray-700">
                  <img
                    src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop"
                    alt="视频案例 1"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play class="w-12 h-12 text-white" />
                  </div>
                </div>
                <div class="p-2">
                  <p class="text-sm text-gray-300 mb-1">时尚模特展示</p>
                  <p class="text-xs text-gray-500">9:16 • 15秒 • 高清</p>
                </div>
              </div>

              <!-- 案例 2 -->
              <div class="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors">
                <div class="aspect-[3/4] relative bg-gray-700">
                  <img
                    src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop"
                    alt="视频案例 2"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play class="w-12 h-12 text-white" />
                  </div>
                </div>
                <div class="p-2">
                  <p class="text-sm text-gray-300 mb-1">街头潮流风格</p>
                  <p class="text-xs text-gray-500">9:16 • 12秒 • 高清</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 使用技巧 -->
          <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 class="text-sm font-semibold text-white mb-3">获得最佳效果的技巧</h3>
            <ul class="space-y-2 text-xs text-gray-400">
              <li class="flex items-start space-x-2">
                <span class="text-primary-400 mt-0.5">•</span>
                <span>上传的图片应保持相同的比例和光线条件</span>
              </li>
              <li class="flex items-start space-x-2">
                <span class="text-primary-400 mt-0.5">•</span>
                <span>确保每张图片中都有清晰的人脸和完整人体</span>
              </li>
              <li class="flex items-start space-x-2">
                <span class="text-primary-400 mt-0.5">•</span>
                <span>背景尽量简单统一，避免过于复杂的场景</span>
              </li>
              <li class="flex items-start space-x-2">
                <span class="text-primary-400 mt-0.5">•</span>
                <span>详细的场景描述能帮助生成更符合预期的动作</span>
              </li>
              <li class="flex items-start space-x-2">
                <span class="text-primary-400 mt-0.5">•</span>
                <span>使用负面提示排除不想要的元素，提高生成质量</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>

    <!-- Gallery Import Modal -->
    <GalleryImportModal
      v-if="showGalleryImport"
      :max-selection="4 - uploadedImages.length"
      @close="showGalleryImport = false"
      @import="handleGalleryImport"
    />
  </div>
</template>
