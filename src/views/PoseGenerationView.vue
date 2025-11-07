<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import { ArrowLeft, Upload, User, Settings, Eye, Menu, Camera, Check } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const isMobileMenuOpen = ref(false)
const currentStep = ref(1)
const selectedPoseMethod = ref('')
const selectedPose = ref<any>(null)
const selectedAvatar = ref<any>(null)
const poseSettings = ref({
  quality: 'high',
  style: 'realistic',
  adjustments: {
    angle: 0,
    intensity: 50
  }
})

const generationSettings = ref({
  quantity: 1,
  prompt: ''
})

const projectId = computed(() => route.params.id as string)

const steps = [
  { id: 1, title: '选择模特', description: '选择或上传模特图' },
  { id: 2, title: '选择姿势', description: '选择参考姿势' },
  { id: 3, title: '生成设置', description: '调整参数并生成' }
]

const project = ref({
  id: projectId.value,
  name: '夏季服装系列',
  description: '姿势图生成'
})

// Mock data
const presetPoses = ref([
  {
    id: '1',
    name: '优雅站姿',
    thumbnail: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=150&h=200&fit=crop',
    category: 'standing',
    description: '经典的优雅站立姿势'
  },
  {
    id: '2',
    name: '时尚走步',
    thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=200&fit=crop',
    category: 'walking',
    description: '时尚T台走步姿势'
  },
  {
    id: '3',
    name: '坐姿展示',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=200&fit=crop',
    category: 'sitting',
    description: '专业坐姿展示'
  },
  {
    id: '4',
    name: '动感跳跃',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=200&fit=crop',
    category: 'action',
    description: '充满活力的跳跃动作'
  },
  {
    id: '5',
    name: '商务姿态',
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=200&fit=crop',
    category: 'business',
    description: '专业商务展示姿态'
  },
  {
    id: '6',
    name: '休闲放松',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=200&fit=crop',
    category: 'casual',
    description: '自然休闲的放松姿势'
  }
])

const avatars = ref([
  {
    id: '1',
    name: '女性模特 A',
    thumbnail: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=150&h=200&fit=crop',
    gender: 'female'
  },
  {
    id: '2',
    name: '女性模特 B',
    thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=200&fit=crop',
    gender: 'female'
  },
  {
    id: '3',
    name: '男性模特 A',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=200&fit=crop',
    gender: 'male'
  },
  {
    id: '4',
    name: '男性模特 B',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=200&fit=crop',
    gender: 'male'
  }
])

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
    generatePoseImage()
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const selectPoseMethod = (method: string) => {
  selectedPoseMethod.value = method
  if (method === 'upload') {
    // Simulate file upload
    alert('文件上传功能开发中...')
  }
}

const selectPose = (pose: any) => {
  selectedPose.value = pose
}

const selectAvatar = (avatar: any) => {
  selectedAvatar.value = avatar
}

const generatePoseImage = () => {
  alert('开始生成姿势图...')
  // This would implement the actual generation logic
}

const isNextDisabled = computed(() => {
  switch (currentStep.value) {
    case 1: return !selectedPoseMethod.value || (selectedPoseMethod.value === 'preset' && !selectedAvatar.value)
    case 2: return !selectedPose.value
    case 3: return generationSettings.value.quantity < 1 || generationSettings.value.quantity > 16
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
          <h1 class="text-xl font-bold text-white">姿势图生成</h1>
        </div>
        <button
          @click="toggleMobileMenu"
          class="p-2 text-gray-400 hover:text-white"
        >
          <Menu class="w-6 h-6" />
        </button>
      </div>

      <!-- Header -->
      <div class="bg-gray-900 border-b border-gray-800 px-6 lg:px-8 py-4">
        <div class="flex items-center space-x-4 mb-4">
          <button
            @click="goBack"
            class="hidden lg:block p-2 text-gray-400 hover:text-white -ml-2"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="flex-1">
            <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
              <h1 class="text-xl font-bold text-white">姿势图生成</h1>
              <p class="text-gray-400 text-sm sm:text-base">基于参考图或预设姿势生成模特图</p>
            </div>
          </div>
        </div>

        <!-- Step Indicator -->
        <div class="flex items-center space-x-2 sm:space-x-4">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="flex items-center"
            :class="index < steps.length - 1 ? 'flex-1' : ''"
          >
            <div class="flex flex-col items-center">
              <div
                :class="[
                  'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all',
                  currentStep >= step.id
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-gray-700 text-gray-400 border-gray-600'
                ]"
              >
                <Check v-if="currentStep > step.id" class="w-4 h-4" />
                <span v-else class="text-xs">{{ step.id }}</span>
              </div>
              <div class="mt-1 text-center">
                <p :class="['text-xs font-medium hidden sm:block', currentStep === step.id ? 'text-green-400' : 'text-gray-400']">
                  {{ step.title }}
                </p>
              </div>
            </div>
            <div
              v-if="index < steps.length - 1"
              :class="[
                'h-0.5 flex-1 mx-2 sm:mx-4 transition-all',
                currentStep > step.id ? 'bg-green-500' : 'bg-gray-600'
              ]"
            />
          </div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="flex-1 overflow-y-auto p-4 lg:p-6 pb-28 lg:pb-24">
        <!-- Step 1: Select Model -->
        <div v-if="currentStep === 1" class="max-w-4xl">
          <div class="mb-6">
            <h2 class="text-lg lg:text-xl font-bold text-white mb-2">选择模特图</h2>
            <p class="text-gray-400 text-sm lg:text-base">选择或上传模特图片，也可以上传自定义图片</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Upload Model Image -->
            <div
              @click="selectPoseMethod('upload')"
              :class="[
                'bg-gray-800 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 p-8',
                selectedPoseMethod === 'upload'
                  ? 'border-green-500 ring-2 ring-green-500/20'
                  : 'border-gray-700 hover:border-gray-600'
              ]"
            >
              <div class="text-center">
                <div class="p-4 bg-green-500/20 rounded-full inline-block mb-4">
                  <Upload class="h-12 w-12 text-green-400" />
                </div>
                <h3 class="text-base font-semibold text-white mb-3">上传模特图</h3>
                <p class="text-gray-400 mb-4">上传您想要应用姿势的模特图片</p>
                <div class="text-sm text-gray-500">
                  <p>• 支持 JPG, PNG 格式</p>
                  <p>• 建议图片清晰，人物明显</p>
                  <p>• 最大文件 10MB</p>
                </div>
              </div>
            </div>

            <!-- Select from Gallery -->
            <div
              @click="selectPoseMethod('preset')"
              :class="[
                'bg-gray-800 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 p-8',
                selectedPoseMethod === 'preset'
                  ? 'border-green-500 ring-2 ring-green-500/20'
                  : 'border-gray-700 hover:border-gray-600'
              ]"
            >
              <div class="text-center">
                <div class="p-4 bg-green-500/20 rounded-full inline-block mb-4">
                  <User class="h-12 w-12 text-green-400" />
                </div>
                <h3 class="text-base font-semibold text-white mb-3">选择预设模特</h3>
                <p class="text-gray-400 mb-4">从模特库中选择适合的模特形象</p>
                <div class="text-sm text-gray-500">
                  <p>• 多种风格模特</p>
                  <p>• 男性女性选择</p>
                  <p>• 专业形象质量</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Model Gallery -->
          <div v-if="selectedPoseMethod === 'preset'" class="mt-8">
            <h3 class="text-lg font-semibold text-white mb-4">选择模特</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div
                v-for="avatar in avatars"
                :key="avatar.id"
                @click="selectAvatar(avatar)"
                :class="[
                  'bg-gray-800 rounded-xl border-2 cursor-pointer transition-all hover:scale-105',
                  selectedAvatar?.id === avatar.id
                    ? 'border-green-500 ring-2 ring-green-500/20'
                    : 'border-gray-700 hover:border-gray-600'
                ]"
              >
                <div class="aspect-[3/4] overflow-hidden rounded-t-xl">
                  <img
                    :src="avatar.thumbnail"
                    :alt="avatar.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="p-4">
                  <h4 class="font-medium text-white mb-1">{{ avatar.name }}</h4>
                  <span class="inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                    {{ avatar.gender }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Select Pose -->
        <div v-else-if="currentStep === 2" class="max-w-6xl">
          <div class="mb-6">
            <h2 class="text-lg lg:text-xl font-bold text-white mb-2">选择姿势</h2>
            <p class="text-gray-400 text-sm lg:text-base">选择参考姿势或上传姿势参考图</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Upload Pose Reference -->
            <div
              @click="alert('上传姿势参考图功能开发中...')"
              class="bg-gray-800 rounded-xl border-2 border-gray-700 hover:border-gray-600 cursor-pointer transition-all hover:scale-105 p-8"
            >
              <div class="text-center">
                <div class="p-4 bg-green-500/20 rounded-full inline-block mb-4">
                  <Upload class="h-12 w-12 text-green-400" />
                </div>
                <h3 class="text-base font-semibold text-white mb-3">上传姿势参考图</h3>
                <p class="text-gray-400 mb-4">上传您想要模仿的姿势参考图片</p>
                <div class="text-sm text-gray-500">
                  <p>• 支持 JPG, PNG 格式</p>
                  <p>• 建议图片清晰，姿势明显</p>
                  <p>• 最大文件 10MB</p>
                </div>
              </div>
            </div>

            <!-- Select from Preset Poses -->
            <div class="bg-gray-800 rounded-xl border-2 border-green-500 ring-2 ring-green-500/20 p-8">
              <div class="text-center">
                <div class="p-4 bg-green-500/20 rounded-full inline-block mb-4">
                  <Camera class="h-12 w-12 text-green-400" />
                </div>
                <h3 class="text-base font-semibold text-white mb-3">选择预设姿势</h3>
                <p class="text-gray-400 mb-4">从专业摄影师精选的姿势库中选择</p>
                <div class="text-sm text-gray-500">
                  <p>• 50+ 专业姿势</p>
                  <p>• 按场景分类整理</p>
                  <p>• 快速生成，效果稳定</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Pose Gallery -->
          <div>
            <h3 class="text-lg font-semibold text-white mb-4">选择姿势</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              <div
                v-for="pose in presetPoses"
                :key="pose.id"
                @click="selectPose(pose)"
                :class="[
                  'bg-gray-800 rounded-xl border-2 cursor-pointer transition-all hover:scale-105',
                  selectedPose?.id === pose.id
                    ? 'border-green-500 ring-2 ring-green-500/20'
                    : 'border-gray-700 hover:border-gray-600'
                ]"
              >
                <div class="aspect-[3/4] overflow-hidden rounded-t-xl">
                  <img
                    :src="pose.thumbnail"
                    :alt="pose.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="p-4">
                  <h4 class="font-medium text-white mb-1">{{ pose.name }}</h4>
                  <p class="text-xs text-gray-400">{{ pose.description }}</p>
                  <span class="inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded mt-2">
                    {{ pose.category }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Generation Settings -->
        <div v-else-if="currentStep === 3" class="max-w-6xl">
          <div class="mb-6">
            <h2 class="text-lg lg:text-xl font-bold text-white mb-2">生成设置</h2>
            <p class="text-gray-400 text-sm lg:text-base">调整所有参数并开始生成姿势图</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Quality Settings -->
            <div class="bg-gray-800 rounded-xl p-6">
              <h3 class="text-base font-semibold text-white mb-4">图片质量</h3>
              <div class="space-y-3">
                <div
                  v-for="quality in ['standard', 'high', 'ultra']"
                  :key="quality"
                  @click="poseSettings.quality = quality"
                  :class="[
                    'p-4 border-2 rounded-lg cursor-pointer transition-all',
                    poseSettings.quality === quality
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-white">
                      {{ quality === 'standard' ? '标准' : quality === 'high' ? '高清' : '超高清' }}
                    </span>
                    <div
                      v-if="poseSettings.quality === quality"
                      class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <Check class="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Adjustment Settings -->
              <div class="mt-6">
                <h4 class="text-sm font-semibold text-white mb-4">姿势调整</h4>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm text-gray-400 mb-2">角度调整</label>
                    <input
                      v-model="poseSettings.adjustments.angle"
                      type="range"
                      min="-30"
                      max="30"
                      class="w-full"
                    />
                    <div class="flex justify-between text-xs text-gray-500 mt-1">
                      <span>-30°</span>
                      <span>{{ poseSettings.adjustments.angle }}°</span>
                      <span>+30°</span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm text-gray-400 mb-2">强度</label>
                    <input
                      v-model="poseSettings.adjustments.intensity"
                      type="range"
                      min="0"
                      max="100"
                      class="w-full"
                    />
                    <div class="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>{{ poseSettings.adjustments.intensity }}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Generation Quantity and Prompts -->
            <div class="bg-gray-800 rounded-xl p-6">
              <h3 class="text-base font-semibold text-white mb-4">数量和提示词</h3>
              
              <!-- Quantity Settings -->
              <div class="mb-6">
                <h4 class="text-sm font-medium text-gray-300 mb-3">生成数量</h4>
                <div class="flex items-center space-x-4 mb-3">
                  <label class="text-sm text-gray-300 min-w-fit">数量:</label>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="generationSettings.quantity = Math.max(1, generationSettings.quantity - 1)"
                      class="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <input
                      v-model="generationSettings.quantity"
                      type="number"
                      min="1"
                      max="16"
                      class="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-center"
                    />
                    <button
                      @click="generationSettings.quantity = Math.min(16, generationSettings.quantity + 1)"
                      class="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <!-- Quick Select -->
                <div class="grid grid-cols-4 gap-2 mb-3">
                  <button
                    v-for="qty in [1, 4, 8, 16]"
                    :key="qty"
                    @click="generationSettings.quantity = qty"
                    :class="[
                      'px-3 py-2 rounded-lg text-sm transition-all',
                      generationSettings.quantity === qty
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    ]"
                  >
                    {{ qty }}
                  </button>
                </div>

                <div class="p-3 bg-gray-900 rounded-lg">
                  <p class="text-xs text-gray-400">预估消耗: {{ generationSettings.quantity }} 积分</p>
                </div>
              </div>

              <!-- Prompt Settings -->
              <div>
                <h4 class="text-sm font-medium text-gray-300 mb-3">提示词</h4>
                <textarea
                  v-model="generationSettings.prompt"
                  placeholder="例如: 专业时装摄影，高质量，工作室灯光..."
                  class="w-full h-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:border-green-500 focus:outline-none transition-colors"
                ></textarea>
                <p class="text-xs text-gray-500 mt-1">{{ generationSettings.prompt.length }}/500 字符</p>
                
                <!-- Quick Templates -->
                <div class="space-y-1 mt-3">
                  <button
                    @click="generationSettings.prompt = '专业时装摄影，高质量，工作室灯光，白色背景，清晰细节，商业级质量'"
                    class="w-full text-left px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
                  >
                    时装摄影
                  </button>
                  <button
                    @click="generationSettings.prompt = '商务专业摄影，正式场景，柔和光线，简洁背景，企业级品质'"
                    class="w-full text-left px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
                  >
                    商务专业
                  </button>
                </div>
              </div>
            </div>

            <!-- Preview & Generate -->
            <div class="bg-gray-800 rounded-xl p-6">
              <h3 class="text-base font-semibold text-white mb-4">预览与生成</h3>
              
              <!-- Selected Items Preview -->
              <div class="space-y-4 mb-6">
                <div v-if="selectedAvatar" class="flex items-center space-x-3">
                  <img
                    :src="selectedAvatar.thumbnail"
                    :alt="selectedAvatar.name"
                    class="w-12 h-16 object-cover rounded"
                  />
                  <div>
                    <p class="text-sm font-medium text-white">{{ selectedAvatar.name }}</p>
                    <p class="text-xs text-gray-400">模特</p>
                  </div>
                </div>

                <div v-if="selectedPose" class="flex items-center space-x-3">
                  <img
                    :src="selectedPose.thumbnail"
                    :alt="selectedPose.name"
                    class="w-12 h-16 object-cover rounded"
                  />
                  <div>
                    <p class="text-sm font-medium text-white">{{ selectedPose.name }}</p>
                    <p class="text-xs text-gray-400">姿势</p>
                  </div>
                </div>
              </div>

              <!-- Generation Preview -->
              <div class="aspect-[2/3] bg-gray-900 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 mb-6">
                <div class="text-center">
                  <Eye class="h-12 w-12 text-gray-500 mx-auto mb-3" />
                  <p class="text-xs text-gray-400">预览功能开发中</p>
                </div>
              </div>

              <!-- Generate Button -->
              <button
                @click="generatePoseImage"
                class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-medium py-3 px-4 rounded-lg transition-all"
              >
                生成姿势图
              </button>
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
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white'
            ]"
          >
            {{ currentStep === steps.length ? '开始生成' : '下一步' }}
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