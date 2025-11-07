<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import { Upload, Download, User, Camera, Palette, Sparkles } from 'lucide-vue-next'

const isMobileMenuOpen = ref(false)

// Selection states
const selectedTop = ref<any>(null)
const selectedBottom = ref<any>(null)
const selectedModel = ref<any>(null)
const selectedBackground = ref<any>(null)
const selectedAccessory = ref<any>(null)
const uploadedTop = ref<string | null>(null)
const uploadedBottom = ref<string | null>(null)
const uploadedModel = ref<string | null>(null)
const uploadedAccessory = ref<string | null>(null)
const selectedPose = ref<any>(null)
const uploadedPose = ref<string | null>(null)
const generatedResults = ref<any[]>([])
const isGenerating = ref(false)
const generationCount = ref(3)
const selectedPromptTemplate = ref<any>(null)
const customPrompt = ref('')

// Mock data
const topClothingItems = ref([
  { id: '1', name: '白色衬衫', thumbnail: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&h=150&fit=crop', category: 'shirt' },
  { id: '2', name: '蓝色牛仔衬衫', thumbnail: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=150&h=150&fit=crop', category: 'shirt' },
  { id: '3', name: '黑色T恤', thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&h=150&fit=crop', category: 'casual' },
  { id: '4', name: '西装外套', thumbnail: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=150&h=150&fit=crop', category: 'formal' },
  { id: '5', name: '运动上衣', thumbnail: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d8e?w=150&h=150&fit=crop', category: 'sport' },
  { id: '6', name: '毛衣', thumbnail: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=150&h=150&fit=crop', category: 'casual' }
])

const bottomClothingItems = ref([
  { id: '1', name: '蓝色牛仔裤', thumbnail: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=150&h=150&fit=crop', category: 'casual' },
  { id: '2', name: '黑色西裤', thumbnail: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=150&h=150&fit=crop', category: 'formal' },
  { id: '3', name: '运动裤', thumbnail: 'https://images.unsplash.com/photo-1506629905607-0e2dbec85709?w=150&h=150&fit=crop', category: 'sport' },
  { id: '4', name: '短裤', thumbnail: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=150&h=150&fit=crop', category: 'casual' },
  { id: '5', name: '红色连衣裙', thumbnail: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=150&h=150&fit=crop', category: 'dress' },
  { id: '6', name: '职业裙装', thumbnail: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=150&h=150&fit=crop', category: 'formal' }
])

const modelOptions = ref([
  { id: '1', name: '女性模特 A', thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=200&fit=crop', type: 'female', style: 'elegant' },
  { id: '2', name: '女性模特 B', thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=200&fit=crop', type: 'female', style: 'casual' },
  { id: '3', name: '男性模特 A', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=200&fit=crop', type: 'male', style: 'professional' },
  { id: '4', name: '男性模特 B', thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=200&fit=crop', type: 'male', style: 'casual' },
  { id: '5', name: '女性模特 C', thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=200&fit=crop', type: 'female', style: 'fashion' },
  { id: '6', name: '男性模特 C', thumbnail: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=200&fit=crop', type: 'male', style: 'sport' }
])

const accessoryOptions = ref([
  { id: '1', name: '太阳镜', thumbnail: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=150&h=150&fit=crop', category: 'eyewear' },
  { id: '2', name: '手表', thumbnail: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=150&h=150&fit=crop', category: 'watch' },
  { id: '3', name: '项链', thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150&h=150&fit=crop', category: 'jewelry' },
  { id: '4', name: '手包', thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop', category: 'bag' },
  { id: '5', name: '帽子', thumbnail: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=150&h=150&fit=crop', category: 'hat' },
  { id: '6', name: '围巾', thumbnail: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=150&h=150&fit=crop', category: 'scarf' }
])

const backgroundOptions = ref([
  { id: '1', name: '纯色背景', thumbnail: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=150&h=150&fit=crop', type: 'solid' },
  { id: '2', name: '咖啡店', thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=150&h=150&fit=crop', type: 'indoor' },
  { id: '3', name: '办公室', thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&h=150&fit=crop', type: 'indoor' },
  { id: '4', name: '公园', thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150&h=150&fit=crop', type: 'outdoor' },
  { id: '5', name: '街道', thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=150&h=150&fit=crop', type: 'outdoor' },
  { id: '6', name: '摄影棚', thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=150&fit=crop', type: 'studio' }
])


// Prompt templates for model generation
const promptTemplates = ref([
  { id: '1', name: '时尚商业', prompt: '时尚模特，专业摄影，商业广告，完美光线，高品质' },
  { id: '2', name: '街头潮流', prompt: '街头时尚，潮流穿搭，城市背景，年轻活力，自然姿态' },
  { id: '3', name: '职业正装', prompt: '职业模特，正装形象，商务环境，专业自信，正式场合' },
  { id: '4', name: '休闲日常', prompt: '日常休闲，自然放松，生活化场景，舒适穿搭，温馨氛围' },
  { id: '5', name: '运动健康', prompt: '运动模特，健康活力，运动装备，动态姿势，健身环境' }
])

const sampleResults = ref([
  { id: '1', url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop' },
  { id: '2', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop' },
  { id: '3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop' },
  { id: '4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop' }
])

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const selectTop = (item: any) => {
  selectedTop.value = item
}

const selectBottom = (item: any) => {
  selectedBottom.value = item
}

const selectModel = (model: any) => {
  selectedModel.value = model
}

const selectAccessory = (accessory: any) => {
  selectedAccessory.value = accessory
}

const selectBackground = (background: any) => {
  selectedBackground.value = background
}

const uploadTopFile = () => {
  // 模拟上衣文件上传
  uploadedTop.value = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop'
}

const uploadBottomFile = () => {
  // 模拟下装文件上传
  uploadedBottom.value = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=400&fit=crop'
}

const uploadModelFile = () => {
  // 模拟模特文件上传
  uploadedModel.value = 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=200&fit=crop'
}

const uploadAccessoryFile = () => {
  // 模拟配饰文件上传
  uploadedAccessory.value = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=150&h=150&fit=crop'
}

const selectPose = (pose: any) => {
  selectedPose.value = pose
}

const uploadPoseFile = () => {
  // 模拟姿势文件上传
  uploadedPose.value = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=200&fit=crop'
}

const selectPromptTemplate = (template: any) => {
  selectedPromptTemplate.value = template
  customPrompt.value = template.prompt
}

const generateImages = () => {
  if ((!selectedModel.value && !uploadedModel.value) || (!selectedTop.value && !uploadedTop.value) || !customPrompt.value.trim()) {
    alert('请选择模特、上装和prompt')
    return
  }
  
  isGenerating.value = true
  
  // 模拟生成过程
  setTimeout(() => {
    const mockImages = [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=600&fit=crop'
    ]
    
    generatedResults.value = Array.from({ length: generationCount.value }, (_, index) => ({
      id: String(index + 1),
      url: mockImages[index % mockImages.length],
      config: { 
        model: uploadedModel.value ? '上传的模特' : selectedModel.value.name, 
 
        prompt: customPrompt.value.substring(0, 50) + '...'
      }
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
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-white mb-2">模特图生成</h1>
            <p class="text-gray-400 text-sm">选择模特、服装搭配和背景，生成完整的模特展示图</p>
          </div>

          <!-- Model Selection -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">选择模特</h2>
            <div class="grid grid-cols-3 gap-3">
              <div
                v-for="model in modelOptions"
                :key="model.id"
                @click="selectModel(model)"
                :class="[
                  'aspect-[3/4] rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border-2',
                  selectedModel?.id === model.id ? 'border-primary-500' : 'border-gray-700 hover:border-gray-600'
                ]"
              >
                <img
                  :src="model.thumbnail"
                  :alt="model.name"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <!-- Upload Model Option -->
            <div
              @click="uploadModelFile"
              class="mt-4 border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-lg p-4 text-center cursor-pointer transition-colors group"
            >
              <Upload class="h-6 w-6 text-gray-500 group-hover:text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 group-hover:text-gray-400 text-sm">上传模特图</p>
            </div>

            <div v-if="uploadedModel" class="mt-3 p-3 bg-gray-800 rounded-lg">
              <img :src="uploadedModel" alt="Uploaded model" class="w-16 h-20 object-cover rounded mx-auto mb-2" />
              <p class="text-green-400 text-sm text-center">模特图上传成功</p>
            </div>
            
            <div v-else-if="selectedModel" class="mt-3 text-center">
              <span class="text-primary-400 text-sm">已选择: {{ selectedModel.name }}</span>
            </div>
          </div>

          <!-- Top Clothing Selection -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">选择上装</h2>
            <div class="grid grid-cols-3 gap-3 mb-4">
              <div
                v-for="item in topClothingItems"
                :key="item.id"
                @click="selectTop(item)"
                :class="[
                  'aspect-square rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border-2',
                  selectedTop?.id === item.id ? 'border-primary-500' : 'border-gray-700 hover:border-gray-600'
                ]"
              >
                <img
                  :src="item.thumbnail"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <!-- Upload Top Option -->
            <div
              @click="uploadTopFile"
              class="border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-lg p-4 text-center cursor-pointer transition-colors group"
            >
              <Upload class="h-6 w-6 text-gray-500 group-hover:text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 group-hover:text-gray-400 text-sm">上传上装</p>
            </div>

            <div v-if="uploadedTop" class="mt-3 p-3 bg-gray-800 rounded-lg">
              <img :src="uploadedTop" alt="Uploaded top" class="w-16 h-16 object-cover rounded mx-auto mb-2" />
              <p class="text-green-400 text-sm text-center">上装上传成功</p>
            </div>
          </div>

          <!-- Bottom Clothing Selection -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">选择下装</h2>
            <div class="grid grid-cols-3 gap-3 mb-4">
              <div
                v-for="item in bottomClothingItems"
                :key="item.id"
                @click="selectBottom(item)"
                :class="[
                  'aspect-square rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border-2',
                  selectedBottom?.id === item.id ? 'border-primary-500' : 'border-gray-700 hover:border-gray-600'
                ]"
              >
                <img
                  :src="item.thumbnail"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <!-- Upload Bottom Option -->
            <div
              @click="uploadBottomFile"
              class="border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-lg p-4 text-center cursor-pointer transition-colors group"
            >
              <Upload class="h-6 w-6 text-gray-500 group-hover:text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 group-hover:text-gray-400 text-sm">上传下装</p>
            </div>

            <div v-if="uploadedBottom" class="mt-3 p-3 bg-gray-800 rounded-lg">
              <img :src="uploadedBottom" alt="Uploaded bottom" class="w-16 h-16 object-cover rounded mx-auto mb-2" />
              <p class="text-green-400 text-sm text-center">下装上传成功</p>
            </div>
          </div>

          <!-- Accessory Selection -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">选择配饰</h2>
            <div class="grid grid-cols-3 gap-3 mb-4">
              <div
                v-for="accessory in accessoryOptions"
                :key="accessory.id"
                @click="selectAccessory(accessory)"
                :class="[
                  'aspect-square rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border-2',
                  selectedAccessory?.id === accessory.id ? 'border-primary-500' : 'border-gray-700 hover:border-gray-600'
                ]"
              >
                <img
                  :src="accessory.thumbnail"
                  :alt="accessory.name"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <!-- Upload Accessory Option -->
            <div
              @click="uploadAccessoryFile"
              class="border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-lg p-4 text-center cursor-pointer transition-colors group"
            >
              <Upload class="h-6 w-6 text-gray-500 group-hover:text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 group-hover:text-gray-400 text-sm">上传配饰</p>
            </div>

            <div v-if="uploadedAccessory" class="mt-3 p-3 bg-gray-800 rounded-lg">
              <img :src="uploadedAccessory" alt="Uploaded accessory" class="w-16 h-16 object-cover rounded mx-auto mb-2" />
              <p class="text-green-400 text-sm text-center">配饰上传成功</p>
            </div>
            
            <div v-else-if="selectedAccessory" class="mt-3 text-center">
              <span class="text-primary-400 text-sm">已选择: {{ selectedAccessory.name }}</span>
            </div>
          </div>

          <!-- Background Selection -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">选择背景</h2>
            <div class="grid grid-cols-3 gap-3">
              <div
                v-for="background in backgroundOptions"
                :key="background.id"
                @click="selectBackground(background)"
                :class="[
                  'aspect-square rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border-2',
                  selectedBackground?.id === background.id ? 'border-primary-500' : 'border-gray-700 hover:border-gray-600'
                ]"
              >
                <img
                  :src="background.thumbnail"
                  :alt="background.name"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            <div v-if="selectedBackground" class="mt-3 text-center">
              <span class="text-primary-400 text-sm">已选择: {{ selectedBackground.name }}</span>
            </div>
          </div>

          <!-- Generation Count -->  
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">生成数量</h2>
            <input
              v-model.number="generationCount"
              type="number"
              min="1"
              max="8"
              class="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="输入生成数量 (1-8)"
            />
          </div>


          <!-- Prompt Templates -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">Prompt模板</h2>
            
            <div class="grid grid-cols-2 gap-3 mb-4">
              <button
                v-for="template in promptTemplates"
                :key="template.id"
                @click="selectPromptTemplate(template)"
                :class="[
                  'p-3 rounded-lg text-left transition-all border-2',
                  selectedPromptTemplate?.id === template.id 
                    ? 'border-primary-500 bg-primary-500/10 text-white' 
                    : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                ]"
              >
                <div class="font-medium text-sm mb-1">{{ template.name }}</div>
                <div class="text-xs text-gray-400 line-clamp-2">{{ template.prompt }}</div>
              </button>
            </div>

            <!-- Custom Prompt -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">自定义Prompt</label>
              <textarea
                v-model="customPrompt"
                placeholder="输入自定义的prompt描述..."
                class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 resize-none"
                rows="3"
              ></textarea>
            </div>
          </div>

          <!-- Generate Button -->
          <button
            @click="generateImages"
            :disabled="(!selectedModel && !uploadedModel) || (!selectedTop && !uploadedTop) || !customPrompt.trim() || isGenerating"
            class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:from-gray-700 disabled:to-gray-700 text-white py-4 rounded-lg font-semibold transition-all disabled:cursor-not-allowed"
          >
            <span v-if="isGenerating">生成中...</span>
            <span v-else>生成 {{ generationCount }} 张模特图</span>
          </button>

          <div class="mt-4 text-center">
            <p class="text-gray-500 text-sm">预计生成时间：3-5分钟</p>
            <p class="text-gray-500 text-xs">需要选择模特、上装和prompt</p>
          </div>
        </div>
      </div>

      <!-- Right Panel - Results -->
      <div class="hidden lg:block w-1/2 bg-gray-900 p-6 overflow-y-auto">
        <div class="max-w-lg mx-auto">
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-white mb-4">生成结果</h2>
          </div>

          <div v-if="isGenerating" class="text-center py-16">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p class="text-gray-400">正在生成模特图...</p>
          </div>

          <div v-else-if="generatedResults.length > 0" class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div
                v-for="result in generatedResults"
                :key="result.id"
                class="relative group"
              >
                <img
                  :src="result.url"
                  :alt="`Generated result ${result.id}`"
                  class="w-full aspect-[3/4] object-cover rounded-lg"
                />
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg">
                  <div class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100">
                      <Download class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Generation Info -->
            <div class="bg-gray-800 p-4 rounded-lg">
              <h3 class="text-white font-medium mb-2">生成信息</h3>
              <div class="text-sm text-gray-400 space-y-1">
                <p v-if="selectedModel || uploadedModel">模特：{{ uploadedModel ? '上传的模特' : selectedModel.name }}</p>
                <p v-if="selectedTop">上装：{{ selectedTop.name }}</p>
                <p v-if="selectedBottom">下装：{{ selectedBottom.name }}</p>
                <p v-if="selectedAccessory || uploadedAccessory">配饰：{{ uploadedAccessory ? '上传的配饰' : selectedAccessory.name }}</p>
                <p v-if="selectedBackground">背景：{{ selectedBackground.name }}</p>
                <p v-if="customPrompt">Prompt：{{ customPrompt.length > 50 ? customPrompt.substring(0, 50) + '...' : customPrompt }}</p>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="text-center py-16">
              <h3 class="text-lg font-semibold text-white mb-4">优秀案例</h3>
              <div class="grid grid-cols-2 gap-4">
                <div
                  v-for="sample in sampleResults"
                  :key="sample.id"
                  class="relative"
                >
                  <img
                    :src="sample.url"
                    :alt="`Sample ${sample.id}`"
                    class="w-full aspect-[3/4] object-cover rounded-lg opacity-60"
                  />
                </div>
              </div>
              <p class="text-gray-500 text-sm mt-4">选择模特和服装后开始生成</p>
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>