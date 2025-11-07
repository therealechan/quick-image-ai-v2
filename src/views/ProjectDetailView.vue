<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import StepperComponent from '../components/StepperComponent.vue'
import { ArrowLeft, User, Shirt, Image as ImageIcon, Settings, Eye, Menu, Upload, Check, X, Loader2, Download } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const isMobileMenuOpen = ref(false)
const currentStep = ref(1)

const projectId = computed(() => route.params.id as string)

const steps = [
  { id: 1, title: '选择模特', description: '虚拟形象', icon: User },
  { id: 2, title: '搭配服装', description: '上衣下装配饰', icon: Shirt },
  { id: 3, title: '选择背景', description: '场景设置', icon: ImageIcon },
  { id: 4, title: '生成设置', description: '质量规格', icon: Settings },
  { id: 5, title: '预览生成', description: '确认生成', icon: Eye }
]

// Mock project data
const project = ref({
  id: projectId.value,
  name: '夏季服装系列',
  description: '2024夏季新品模特展示'
})

// Step selection states
const selectedAvatar = ref<any>(null)
const selectedClothing = ref<any>({
  top: null,
  bottom: null,
  accessories: []
})
const selectedBackground = ref<any>(null)
const generationSettings = ref({
  count: 1,
  prompt: ''
})

// Mock data
const presetAvatars = ref([
  {
    id: '1',
    name: '女性模特 A',
    gender: 'female',
    thumbnail: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=150&h=200&fit=crop',
    description: '亚洲女性，身材匀称'
  },
  {
    id: '2', 
    name: '女性模特 B',
    gender: 'female',
    thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=200&fit=crop',
    description: '欧美女性，高挑身材'
  },
  {
    id: '3',
    name: '男性模特 A',
    gender: 'male',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=200&fit=crop',
    description: '亚洲男性，标准身材'
  },
  {
    id: '4',
    name: '男性模特 B',
    gender: 'male',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=200&fit=crop',
    description: '欧美男性，健壮体型'
  }
])

const clothingItems = ref({
  tops: [
    { id: '1', name: '白色衬衫', thumbnail: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&h=150&fit=crop', category: 'formal' },
    { id: '2', name: '蓝色牛仔衬衫', thumbnail: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=150&h=150&fit=crop', category: 'casual' },
    { id: '3', name: '黑色T恤', thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&h=150&fit=crop', category: 'casual' },
    { id: '4', name: '红色连衣裙', thumbnail: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=150&h=150&fit=crop', category: 'formal' },
    { id: '5', name: '运动上衣', thumbnail: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d8e?w=150&h=150&fit=crop', category: 'sport' },
    { id: '6', name: '西装外套', thumbnail: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=150&h=150&fit=crop', category: 'formal' }
  ],
  bottoms: [
    { id: '1', name: '黑色西装裤', thumbnail: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc6ce5e?w=150&h=150&fit=crop', category: 'formal' },
    { id: '2', name: '蓝色牛仔裤', thumbnail: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=150&h=150&fit=crop', category: 'casual' },
    { id: '3', name: '白色短裤', thumbnail: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=150&h=150&fit=crop', category: 'casual' },
    { id: '4', name: '黑色短裙', thumbnail: 'https://images.unsplash.com/photo-1583496661160-fb5886a13709?w=150&h=150&fit=crop', category: 'formal' },
    { id: '5', name: '运动裤', thumbnail: 'https://images.unsplash.com/photo-1506629905996-9f74c4f53c41?w=150&h=150&fit=crop', category: 'sport' },
    { id: '6', name: '长裙', thumbnail: 'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=150&h=150&fit=crop', category: 'formal' }
  ],
  accessories: [
    { id: '1', name: '黑色墨镜', thumbnail: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=150&h=150&fit=crop', category: 'eyewear' },
    { id: '2', name: '棒球帽', thumbnail: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=150&h=150&fit=crop', category: 'hat' },
    { id: '3', name: '金色手表', thumbnail: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=150&h=150&fit=crop', category: 'jewelry' },
    { id: '4', name: '皮质手包', thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop', category: 'bag' },
    { id: '5', name: '丝巾', thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150&h=150&fit=crop', category: 'accessory' },
    { id: '6', name: '项链', thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150&h=150&fit=crop', category: 'jewelry' }
  ]
})

const backgroundOptions = ref([
  { id: '1', name: '纯色背景', thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200&h=150&fit=crop', category: 'studio' },
  { id: '2', name: '城市街道', thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=150&fit=crop', category: 'outdoor' },
  { id: '3', name: '咖啡店', thumbnail: 'https://images.unsplash.com/photo-1445116572660-236099c90d20?w=200&h=150&fit=crop', category: 'indoor' },
  { id: '4', name: '海滩', thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=150&fit=crop', category: 'outdoor' },
  { id: '5', name: '办公室', thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop', category: 'indoor' },
  { id: '6', name: '公园', thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=150&fit=crop', category: 'outdoor' }
])

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const goBack = () => {
  router.push('/dashboard/projects')
}

const nextStep = () => {
  if (currentStep.value < steps.length) {
    currentStep.value++
  } else {
    generateModel()
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const selectAvatar = (avatar: any) => {
  selectedAvatar.value = avatar
}

const selectClothingItem = (type: string, item: any) => {
  if (type === 'accessories') {
    const index = selectedClothing.value.accessories.findIndex((acc: any) => acc.id === item.id)
    if (index > -1) {
      selectedClothing.value.accessories.splice(index, 1)
    } else {
      selectedClothing.value.accessories.push(item)
    }
  } else {
    selectedClothing.value[type] = selectedClothing.value[type]?.id === item.id ? null : item
  }
}

const selectBackground = (background: any) => {
  selectedBackground.value = background
}

const uploadCustomAvatar = () => {
  // 这里应该实现文件上传逻辑
  alert('自定义上传功能开发中...')
}

const uploadCustomClothing = () => {
  alert('自定义服装上传功能开发中...')
}

const uploadCustomBackground = () => {
  alert('自定义背景上传功能开发中...')
}

const isNextDisabled = computed(() => {
  switch (currentStep.value) {
    case 1: return !selectedAvatar.value
    case 2: return !selectedClothing.value.top || !selectedClothing.value.bottom
    case 3: return !selectedBackground.value
    case 4: return generationSettings.value.count < 1 || generationSettings.value.count > 16
    case 5: return false
    default: return false
  }
})

const generateModel = () => {
  alert('开始生成AI模特图...')
  // 这里会实现实际的生成逻辑
}

onMounted(() => {
  // 检查项目是否存在
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
        <div class="flex items-center space-x-4 mb-6">
          <button
            @click="goBack"
            class="hidden lg:block p-2 text-gray-400 hover:text-white -ml-2"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-xl font-bold text-white">{{ project.name }}</h1>
            <p class="text-gray-400">{{ project.description }}</p>
          </div>
        </div>

        <!-- Stepper -->
        <StepperComponent
          :current-step="currentStep"
          :steps="steps"
        />
      </div>

      <!-- Step Content -->
      <div class="flex-1 overflow-y-auto p-6 lg:p-8 pb-32 lg:pb-28">
          <!-- Step 1: Avatar Selection -->
          <div v-if="currentStep === 1" class="max-w-4xl">
            <div class="mb-8">
              <h2 class="text-xl font-bold text-white mb-2">选择虚拟模特</h2>
              <p class="text-gray-400">从预设模特中选择，或上传自定义形象</p>
            </div>

            <!-- Avatar Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div
                v-for="avatar in presetAvatars"
                :key="avatar.id"
                @click="selectAvatar(avatar)"
                :class="[
                  'bg-gray-800 rounded-xl border-2 cursor-pointer transition-all hover:scale-105',
                  selectedAvatar?.id === avatar.id
                    ? 'border-primary-500 ring-2 ring-primary-500/20'
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
                  <h3 class="font-medium text-white mb-1">{{ avatar.name }}</h3>
                  <p class="text-xs text-gray-400">{{ avatar.description }}</p>
                </div>
              </div>

              <!-- Upload Custom -->
              <div
                @click="uploadCustomAvatar"
                class="bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-primary-500 hover:bg-gray-800/70 transition-all cursor-pointer group"
              >
                <div class="p-4 bg-primary-500/20 rounded-full mb-4 group-hover:bg-primary-500/30 transition-colors">
                  <Upload class="h-8 w-8 text-primary-400" />
                </div>
                <h3 class="text-sm font-medium text-white mb-1">自定义上传</h3>
                <p class="text-xs text-gray-400">上传您的形象</p>
              </div>
            </div>

            <!-- Selected Avatar Preview -->
            <div v-if="selectedAvatar" class="bg-gray-800 rounded-xl p-6">
              <h3 class="text-base font-semibold text-white mb-4">已选择模特</h3>
              <div class="flex items-center space-x-4">
                <img
                  :src="selectedAvatar.thumbnail"
                  :alt="selectedAvatar.name"
                  class="w-16 h-20 object-cover rounded-lg"
                />
                <div>
                  <p class="font-medium text-white">{{ selectedAvatar.name }}</p>
                  <p class="text-sm text-gray-400">{{ selectedAvatar.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Clothing Selection -->
          <div v-else-if="currentStep === 2" class="max-w-6xl">
            <div class="mb-8">
              <h2 class="text-xl font-bold text-white mb-2">搭配服装</h2>
              <p class="text-gray-400">为模特选择上衣、下装和配饰</p>
            </div>

            <!-- Tops -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-semibold text-white">上衣</h3>
                <button
                  @click="uploadCustomClothing"
                  class="text-primary-400 hover:text-primary-300 text-sm flex items-center space-x-1"
                >
                  <Upload class="w-4 h-4" />
                  <span>上传自定义</span>
                </button>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div
                  v-for="item in clothingItems.tops"
                  :key="item.id"
                  @click="selectClothingItem('top', item)"
                  :class="[
                    'bg-gray-800 rounded-lg border-2 cursor-pointer transition-all hover:scale-105',
                    selectedClothing.top?.id === item.id
                      ? 'border-primary-500 ring-2 ring-primary-500/20'
                      : 'border-gray-700 hover:border-gray-600'
                  ]"
                >
                  <div class="aspect-square overflow-hidden rounded-t-lg">
                    <img :src="item.thumbnail" :alt="item.name" class="w-full h-full object-cover" />
                  </div>
                  <div class="p-3">
                    <p class="text-sm font-medium text-white">{{ item.name }}</p>
                    <span class="inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded mt-1">
                      {{ item.category }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bottoms -->
            <div class="mb-8">
              <h3 class="text-base font-semibold text-white mb-4">下装</h3>
              <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div
                  v-for="item in clothingItems.bottoms"
                  :key="item.id"
                  @click="selectClothingItem('bottom', item)"
                  :class="[
                    'bg-gray-800 rounded-lg border-2 cursor-pointer transition-all hover:scale-105',
                    selectedClothing.bottom?.id === item.id
                      ? 'border-primary-500 ring-2 ring-primary-500/20'
                      : 'border-gray-700 hover:border-gray-600'
                  ]"
                >
                  <div class="aspect-square overflow-hidden rounded-t-lg">
                    <img :src="item.thumbnail" :alt="item.name" class="w-full h-full object-cover" />
                  </div>
                  <div class="p-3">
                    <p class="text-sm font-medium text-white">{{ item.name }}</p>
                    <span class="inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded mt-1">
                      {{ item.category }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Accessories -->
            <div class="mb-8">
              <h3 class="text-base font-semibold text-white mb-4">配饰 (可多选)</h3>
              <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div
                  v-for="item in clothingItems.accessories"
                  :key="item.id"
                  @click="selectClothingItem('accessories', item)"
                  :class="[
                    'bg-gray-800 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 relative',
                    selectedClothing.accessories.some((acc: any) => acc.id === item.id)
                      ? 'border-primary-500 ring-2 ring-primary-500/20'
                      : 'border-gray-700 hover:border-gray-600'
                  ]"
                >
                  <div class="aspect-square overflow-hidden rounded-t-lg">
                    <img :src="item.thumbnail" :alt="item.name" class="w-full h-full object-cover" />
                  </div>
                  <div class="p-3">
                    <p class="text-sm font-medium text-white">{{ item.name }}</p>
                    <span class="inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded mt-1">
                      {{ item.category }}
                    </span>
                  </div>
                  <div
                    v-if="selectedClothing.accessories.some((acc: any) => acc.id === item.id)"
                    class="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                  >
                    <Check class="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Selected Items Summary -->
            <div class="bg-gray-800 rounded-xl p-6">
              <h3 class="text-base font-semibold text-white mb-4">已选择的搭配</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p class="text-gray-400 mb-2">上衣</p>
                  <div v-if="selectedClothing.top" class="flex items-center space-x-3">
                    <img :src="selectedClothing.top.thumbnail" class="w-12 h-12 rounded object-cover" />
                    <span class="text-white">{{ selectedClothing.top.name }}</span>
                  </div>
                  <p v-else class="text-gray-500">未选择</p>
                </div>
                <div>
                  <p class="text-gray-400 mb-2">下装</p>
                  <div v-if="selectedClothing.bottom" class="flex items-center space-x-3">
                    <img :src="selectedClothing.bottom.thumbnail" class="w-12 h-12 rounded object-cover" />
                    <span class="text-white">{{ selectedClothing.bottom.name }}</span>
                  </div>
                  <p v-else class="text-gray-500">未选择</p>
                </div>
                <div>
                  <p class="text-gray-400 mb-2">配饰 ({{ selectedClothing.accessories.length }})</p>
                  <div v-if="selectedClothing.accessories.length > 0" class="flex flex-wrap gap-2">
                    <div
                      v-for="accessory in selectedClothing.accessories"
                      :key="accessory.id"
                      class="flex items-center space-x-2 bg-gray-700 rounded-full px-3 py-1"
                    >
                      <img :src="accessory.thumbnail" class="w-6 h-6 rounded-full object-cover" />
                      <span class="text-white text-sm">{{ accessory.name }}</span>
                    </div>
                  </div>
                  <p v-else class="text-gray-500">未选择</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Background Selection -->
          <div v-else-if="currentStep === 3" class="max-w-4xl">
            <div class="mb-8">
              <h2 class="text-xl font-bold text-white mb-2">选择背景</h2>
              <p class="text-gray-400">设置拍摄场景和背景</p>
            </div>

            <!-- Background Options -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-semibold text-white">预设背景</h3>
                <button
                  @click="uploadCustomBackground"
                  class="text-primary-400 hover:text-primary-300 text-sm flex items-center space-x-1"
                >
                  <Upload class="w-4 h-4" />
                  <span>上传自定义</span>
                </button>
              </div>
              
              <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div
                  v-for="background in backgroundOptions"
                  :key="background.id"
                  @click="selectBackground(background)"
                  :class="[
                    'bg-gray-800 rounded-xl border-2 cursor-pointer transition-all hover:scale-105',
                    selectedBackground?.id === background.id
                      ? 'border-primary-500 ring-2 ring-primary-500/20'
                      : 'border-gray-700 hover:border-gray-600'
                  ]"
                >
                  <div class="aspect-[4/3] overflow-hidden rounded-t-xl">
                    <img
                      :src="background.thumbnail"
                      :alt="background.name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="p-4">
                    <h4 class="font-medium text-white mb-1">{{ background.name }}</h4>
                    <span class="inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                      {{ background.category }}
                    </span>
                  </div>
                </div>

                <!-- Upload Custom Background -->
                <div
                  @click="uploadCustomBackground"
                  class="bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-primary-500 hover:bg-gray-800/70 transition-all cursor-pointer group aspect-[4/3]"
                >
                  <div class="p-4 bg-primary-500/20 rounded-full mb-4 group-hover:bg-primary-500/30 transition-colors">
                    <Upload class="h-8 w-8 text-primary-400" />
                  </div>
                  <h4 class="text-sm font-medium text-white mb-1">自定义背景</h4>
                  <p class="text-xs text-gray-400">上传您的背景</p>
                </div>
              </div>
            </div>

            <!-- Selected Background Preview -->
            <div v-if="selectedBackground" class="bg-gray-800 rounded-xl p-6">
              <h3 class="text-base font-semibold text-white mb-4">已选择背景</h3>
              <div class="flex items-start space-x-4">
                <img
                  :src="selectedBackground.thumbnail"
                  :alt="selectedBackground.name"
                  class="w-32 h-24 object-cover rounded-lg"
                />
                <div>
                  <p class="font-medium text-white text-base">{{ selectedBackground.name }}</p>
                  <p class="text-gray-400 text-sm mb-2">类型: {{ selectedBackground.category }}</p>
                  <span class="inline-block px-3 py-1 bg-primary-500/20 text-primary-300 text-sm rounded-full">
                    已选择
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Generation Settings -->
          <div v-else-if="currentStep === 4" class="max-w-6xl">
            <div class="mb-8">
              <h2 class="text-xl font-bold text-white mb-2">生成设置</h2>
              <p class="text-gray-400">设置生成参数、数量和提示词来优化生成效果</p>
            </div>

            <!-- Prompt Settings - Full Width -->
            <div class="mb-8">
              <div class="bg-gray-800 rounded-xl p-6">
                <h3 class="text-base font-semibold text-white mb-4">提示词设置</h3>
                <p class="text-sm text-gray-400 mb-6">添加详细的提示词可以显著提升生成效果和准确性</p>

                <div class="space-y-4">
                  <!-- Main Prompt -->
                  <div>
                    <label class="block text-sm text-gray-300 mb-2">描述提示词</label>
                    <textarea
                      v-model="generationSettings.prompt"
                      placeholder="例如: 专业时装摄影，高质量，工作室灯光，白色背景，清晰细节，商业级质量..."
                      class="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:border-primary-500 focus:outline-none transition-colors"
                    ></textarea>
                    <div class="flex justify-between items-center mt-1">
                      <p class="text-xs text-gray-500">{{ generationSettings.prompt.length }}/500 字符</p>
                    </div>
                  </div>

                  <!-- Prompt Tips and Templates -->
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Prompt Tips -->
                    <div class="bg-gray-900 rounded-lg p-4">
                      <h4 class="text-sm font-medium text-white mb-3">✨ 提示词建议</h4>
                      <div class="space-y-2 text-xs text-gray-400">
                        <p>• 描述想要的摄影风格: "专业时装摄影"、"商业产品摄影"</p>
                        <p>• 指定灯光效果: "工作室灯光"、"柔和光线"、"戏剧性光影"</p>
                        <p>• 定义背景: "白色背景"、"渐变背景"、"简洁背景"</p>
                        <p>• 强调质量: "高质量"、"清晰细节"、"专业级"、"8K超高清"</p>
                        <p>• 指定服装风格: "时尚搭配"、"商务正装"、"休闲装扮"</p>
                      </div>
                    </div>

                    <!-- Quick Prompt Templates -->
                    <div>
                      <h4 class="text-sm font-medium text-white mb-3">快速模板</h4>
                      <div class="space-y-2">
                        <button
                          @click="generationSettings.prompt = '专业时装摄影，高质量，工作室灯光，白色背景，清晰细节，商业级质量，8K超高清'"
                          class="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
                        >
                          时装摄影风格
                        </button>
                        <button
                          @click="generationSettings.prompt = '商务专业摄影，正式场景，柔和光线，简洁背景，企业级品质，肖像风格'"
                          class="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
                        >
                          商务专业风格
                        </button>
                        <button
                          @click="generationSettings.prompt = '时尚杂志风格，戏剧性光影，艺术化构图，高端品质，创意摄影'"
                          class="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
                        >
                          艺术创意风格
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

              <!-- Generation Count -->
              <div class="bg-gray-800 rounded-xl p-6">
                <h3 class="text-base font-semibold text-white mb-4">生成数量</h3>
                <p class="text-sm text-gray-400 mb-6">选择要生成的图片数量，更多图片可以提供更多选择</p>
                
                <div class="space-y-4">
                  <!-- Quantity Input -->
                  <div class="flex items-center space-x-4">
                    <label class="text-sm text-gray-300 min-w-fit">数量:</label>
                    <div class="flex items-center space-x-2">
                      <button
                        @click="generationSettings.count = Math.max(1, generationSettings.count - 1)"
                        class="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <input
                        v-model="generationSettings.count"
                        type="number"
                        min="1"
                        max="16"
                        class="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-center"
                      />
                      <button
                        @click="generationSettings.count = Math.min(16, generationSettings.count + 1)"
                        class="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <!-- Quick Select -->
                  <div>
                    <p class="text-sm text-gray-400 mb-3">快速选择:</p>
                    <div class="grid grid-cols-4 gap-2">
                      <button
                        v-for="qty in [1, 4, 8, 16]"
                        :key="qty"
                        @click="generationSettings.count = qty"
                        :class="[
                          'px-3 py-2 rounded-lg text-sm transition-all',
                          generationSettings.count === qty
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        ]"
                      >
                        {{ qty }}
                      </button>
                    </div>
                  </div>

                  <!-- Cost Estimate -->
                  <div class="mt-4 p-3 bg-gray-900 rounded-lg">
                    <p class="text-xs text-gray-400">预估消耗: {{ generationSettings.count }} 积分</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Step 5: Preview and Generate -->
          <div v-else-if="currentStep === 5" class="max-w-4xl">
            <div class="mb-8">
              <h2 class="text-xl font-bold text-white mb-2">预览与生成</h2>
              <p class="text-gray-400">确认设置并开始生成AI模特图</p>
            </div>

            <!-- Preview Configuration -->
            <div class="space-y-6">
                <!-- Selected Avatar -->
                <div class="bg-gray-800 rounded-xl p-6">
                  <h3 class="text-base font-semibold text-white mb-4">虚拟模特</h3>
                  <div class="flex items-center space-x-4">
                    <img
                      :src="selectedAvatar?.thumbnail"
                      :alt="selectedAvatar?.name"
                      class="w-16 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <p class="font-medium text-white">{{ selectedAvatar?.name }}</p>
                      <p class="text-sm text-gray-400">{{ selectedAvatar?.description }}</p>
                    </div>
                  </div>
                </div>

                <!-- Selected Clothing -->
                <div class="bg-gray-800 rounded-xl p-6">
                  <h3 class="text-base font-semibold text-white mb-4">服装搭配</h3>
                  <div class="space-y-4">
                    <div class="flex items-center space-x-4">
                      <img
                        :src="selectedClothing.top?.thumbnail"
                        :alt="selectedClothing.top?.name"
                        class="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p class="text-white text-sm">{{ selectedClothing.top?.name }}</p>
                        <p class="text-gray-400 text-xs">上衣</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-4">
                      <img
                        :src="selectedClothing.bottom?.thumbnail"
                        :alt="selectedClothing.bottom?.name"
                        class="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p class="text-white text-sm">{{ selectedClothing.bottom?.name }}</p>
                        <p class="text-gray-400 text-xs">下装</p>
                      </div>
                    </div>
                    <div v-if="selectedClothing.accessories.length > 0">
                      <p class="text-gray-400 text-sm mb-2">配饰:</p>
                      <div class="flex flex-wrap gap-2">
                        <div
                          v-for="accessory in selectedClothing.accessories"
                          :key="accessory.id"
                          class="flex items-center space-x-2 bg-gray-700 rounded-full px-3 py-1"
                        >
                          <img :src="accessory.thumbnail" class="w-4 h-4 rounded-full object-cover" />
                          <span class="text-white text-xs">{{ accessory.name }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Selected Background -->
                <div class="bg-gray-800 rounded-xl p-6">
                  <h3 class="text-base font-semibold text-white mb-4">背景场景</h3>
                  <div class="flex items-center space-x-4">
                    <img
                      :src="selectedBackground?.thumbnail"
                      :alt="selectedBackground?.name"
                      class="w-20 h-15 object-cover rounded-lg"
                    />
                    <div>
                      <p class="font-medium text-white">{{ selectedBackground?.name }}</p>
                      <p class="text-sm text-gray-400">{{ selectedBackground?.category }}</p>
                    </div>
                  </div>
                </div>

                <!-- Generation Settings Summary -->
                <div class="bg-gray-800 rounded-xl p-6">
                  <h3 class="text-base font-semibold text-white mb-4">生成设置</h3>
                  <div class="space-y-4 text-sm">
                    <!-- Generation Count -->
                    <div>
                      <p class="text-gray-400">生成数量</p>
                      <p class="text-white text-lg font-medium">{{ generationSettings.count }}张</p>
                    </div>
                    
                    <!-- Prompt Preview -->
                    <div v-if="generationSettings.prompt.trim()">
                      <p class="text-gray-400 mb-2">提示词</p>
                      <div class="bg-gray-900 rounded-lg p-3 max-h-24 overflow-y-auto">
                        <p class="text-white text-xs leading-relaxed">{{ generationSettings.prompt }}</p>
                      </div>
                    </div>
                    <div v-else>
                      <p class="text-gray-400 mb-2">提示词</p>
                      <p class="text-gray-500 text-xs">未设置自定义提示词，将使用默认设置</p>
                    </div>
                  </div>
                </div>

                <!-- Generation Button -->
                <div class="mt-8">
                  <button
                    @click="generateModel"
                    class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-medium py-4 px-6 rounded-lg transition-all hover:scale-105 shadow-lg shadow-primary-500/25 flex items-center justify-center space-x-3"
                  >
                    <Loader2 class="h-5 w-5" />
                    <span>开始生成 AI 模特图</span>
                  </button>

                  <div class="text-center text-sm text-gray-400 mt-4">
                    <p>预计生成时间: 30-60秒</p>
                    <p>将消耗 {{ generationSettings.count }} 个积分</p>
                  </div>
                </div>
              </div>
          </div>
        </div>

      <!-- Navigation Buttons - Fixed at bottom -->
      <div class="fixed bottom-0 left-0 right-0 lg:left-64 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 px-4 lg:px-6 py-3 z-10 shadow-lg shadow-gray-900/20">
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
                : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white'
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

/* Range Slider Styling */
.slider {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.slider::-webkit-slider-track {
  background: #374151;
  height: 8px;
  border-radius: 4px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #7c3aed;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  border: 2px solid #1f2937;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.slider::-webkit-slider-thumb:hover {
  background: #8b5cf6;
  transform: scale(1.1);
}

.slider::-moz-range-track {
  background: #374151;
  height: 8px;
  border-radius: 4px;
  border: none;
}

.slider::-moz-range-thumb {
  background: #7c3aed;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  border: 2px solid #1f2937;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.slider::-moz-range-thumb:hover {
  background: #8b5cf6;
  transform: scale(1.1);
}

/* Bottom navigation backdrop */
.backdrop-blur-md {
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
}
</style>