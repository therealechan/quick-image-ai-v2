<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import GenerationHistory from '../components/GenerationHistory.vue'
import { Upload, Download, Camera } from 'lucide-vue-next'
import type { PoseHistoryItem } from '../types/history'

const isMobileMenuOpen = ref(false)

// History panel state
const isHistoryCollapsed = ref(true)
const historyRef = ref<InstanceType<typeof GenerationHistory>>()

// Selection states
const selectedPose = ref<any>(null)
const selectedModel = ref<any>(null)
const uploadedModel = ref<string | null>(null)
const showModelSelection = ref(false)
const generatedResults = ref<any[]>([])
const isGenerating = ref(false)
const generationCount = ref(3)
const selectedPromptTemplate = ref<any>(null)
const customPrompt = ref('')

// Aspect ratio selection
const selectedAspectRatio = ref<any>(null)
const showAllAspectRatios = ref(false)

// Mock data
const poseTemplates = ref([
  { id: '1', name: '优雅站姿', thumbnail: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=150&h=200&fit=crop', category: 'standing' },
  { id: '2', name: '动感跳跃', thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=200&fit=crop', category: 'action' },
  { id: '3', name: '坐姿优雅', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=200&fit=crop', category: 'sitting' },
  { id: '4', name: '休闲走路', thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=200&fit=crop', category: 'walking' },
  { id: '5', name: '交叉手臂', thumbnail: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=200&fit=crop', category: 'standing' },
  { id: '6', name: '手摸头发', thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=200&fit=crop', category: 'pose' }
])

// Model gallery options (reuse from main model generation)
const modelGallery = ref([
  { id: '1', name: '女性模特 A', thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=200&fit=crop', type: 'female', style: 'elegant' },
  { id: '2', name: '女性模特 B', thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=200&fit=crop', type: 'female', style: 'casual' },
  { id: '3', name: '男性模特 A', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=200&fit=crop', type: 'male', style: 'professional' },
  { id: '4', name: '男性模特 B', thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=200&fit=crop', type: 'male', style: 'casual' },
  { id: '5', name: '女性模特 C', thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=200&fit=crop', type: 'female', style: 'fashion' },
  { id: '6', name: '男性模特 C', thumbnail: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=200&fit=crop', type: 'male', style: 'sport' }
])

// Aspect ratio options
const aspectRatioOptions = ref([
  { id: 'auto', name: 'Auto', width: 4, height: 3, isAuto: true, isDefault: true },
  { id: '1:1', name: '1:1', width: 1, height: 1, isDefault: true },
  { id: '9:16', name: '9:16', width: 9, height: 16, isDefault: true },
  { id: '3:4', name: '3:4', width: 3, height: 4, isDefault: true },
  { id: '2:3', name: '2:3', width: 2, height: 3, isDefault: true },
  { id: '4:5', name: '4:5', width: 4, height: 5, isDefault: true },
  { id: '16:9', name: '16:9', width: 16, height: 9, isDefault: false },
  { id: '21:9', name: '21:9', width: 21, height: 9, isDefault: false },
  { id: '4:3', name: '4:3', width: 4, height: 3, isDefault: false },
  { id: '3:2', name: '3:2', width: 3, height: 2, isDefault: false },
  { id: '5:4', name: '5:4', width: 5, height: 4, isDefault: false }
])

// Computed properties for aspect ratios
const defaultAspectRatios = computed(() => 
  aspectRatioOptions.value.filter(ratio => ratio.isDefault)
)

const extraAspectRatios = computed(() => 
  aspectRatioOptions.value.filter(ratio => !ratio.isDefault)
)

// Prompt templates
const promptTemplates = ref([
  { id: '1', name: '时尚模特', prompt: '时尚模特，专业摄影，高端时装，优雅姿态，完美光线' },
  { id: '2', name: '运动风格', prompt: '运动模特，活力四射，健康身材，运动服装，动感姿势' },
  { id: '3', name: '商务正装', prompt: '商务模特，专业形象，正装服饰，自信姿态，商务风格' },
  { id: '4', name: '休闲生活', prompt: '休闲模特，自然放松，日常服装，生活化姿势，温馨氛围' },
  { id: '5', name: '艺术写真', prompt: '艺术模特，创意摄影，独特风格，艺术表现，个性姿态' }
])

const sampleResults = ref([
  { id: '1', url: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=400&h=600&fit=crop' },
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

const toggleHistory = () => {
  isHistoryCollapsed.value = !isHistoryCollapsed.value
}

const useHistoryItem = (historyItem: any) => {
  // 确保是姿势历史记录
  if (historyItem.type !== 'pose') return
  
  const poseItem = historyItem as PoseHistoryItem
  // 恢复模特选择
  if (poseItem.model) {
    selectedModel.value = poseItem.model
    uploadedModel.value = null
  } else if (poseItem.uploadedModel) {
    uploadedModel.value = poseItem.uploadedModel
    selectedModel.value = null
  }
  
  // 恢复姿势选择
  selectedPose.value = poseItem.selectedPose
  
  // 恢复prompt设置
  selectedPromptTemplate.value = poseItem.promptTemplate
  customPrompt.value = poseItem.prompt
  
  // 恢复生成设置
  generationCount.value = poseItem.generationCount
  selectedAspectRatio.value = poseItem.aspectRatio
  
  console.log('已恢复历史配置:', poseItem)
}

const selectPose = (pose: any) => {
  selectedPose.value = pose
}

const selectPromptTemplate = (template: any) => {
  selectedPromptTemplate.value = template
  customPrompt.value = template.prompt
}

const selectModelFromGallery = (model: any) => {
  selectedModel.value = model
  showModelSelection.value = false
}

const selectAspectRatio = (ratio: any) => {
  selectedAspectRatio.value = ratio
}

const uploadModel = () => {
  // 模拟模特图上传
  uploadedModel.value = 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=300&h=400&fit=crop'
  selectedModel.value = null // Clear gallery selection when uploading
}

const generatePoseImages = () => {
  if ((!selectedModel.value && !uploadedModel.value) || !customPrompt.value.trim()) {
    alert('请选择模特并输入prompt')
    return
  }
  
  isGenerating.value = true
  
  // 模拟生成过程
  setTimeout(() => {
    const mockImages = [
      'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop'
    ]
    
    const results = Array.from({ length: generationCount.value }, (_, index) => ({
      id: String(index + 1),
      url: mockImages[index % mockImages.length],
      aspectRatio: selectedAspectRatio.value
    }))
    
    generatedResults.value = results
    isGenerating.value = false
    
    // 保存到历史记录
    saveToHistory(results)
  }, 3000)
}

const saveToHistory = (results: any[]) => {
  if (!historyRef.value) return
  
  const historyItem: Omit<PoseHistoryItem, 'id' | 'timestamp' | 'isFavorite'> = {
    type: 'pose',
    model: selectedModel.value,
    uploadedModel: uploadedModel.value,
    selectedPose: selectedPose.value,
    uploadedPose: null, // TODO: 当支持上传自定义姿势时使用
    promptTemplate: selectedPromptTemplate.value,
    prompt: customPrompt.value,
    generationCount: generationCount.value,
    aspectRatio: selectedAspectRatio.value,
    results: results.map(r => ({ id: r.id, url: r.url }))
  }
  
  historyRef.value.addHistoryItem(historyItem)
}

onMounted(() => {
  // 页面初始化
  
  // Set default aspect ratio to Auto
  selectedAspectRatio.value = aspectRatioOptions.value.find(ratio => ratio.id === 'auto')
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
      ref="historyRef"
      :is-collapsed="isHistoryCollapsed"
      history-type="pose"
      @use-history="useHistoryItem"
      @toggle-collapse="toggleHistory"
    />

    <!-- Main Content -->
    <main class="flex-1 flex overflow-hidden">
      <!-- Left Panel - Controls -->
      <div class="w-full lg:w-1/2 bg-gray-950 p-6 overflow-y-auto border-r border-gray-800">
        <div class="max-w-lg mx-auto">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-white mb-2">姿势图生成</h1>
            <p class="text-gray-400">上传模特图，选择姿势参考，生成新姿势</p>
          </div>

          <!-- Model Selection -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">选择模特</h2>
            
            <!-- Toggle between gallery and upload -->
            <div class="flex space-x-2 mb-4">
              <button
                @click="showModelSelection = true"
                class="flex-1 py-2 px-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700 text-sm"
              >
                从图库选择
              </button>
              <button
                @click="uploadModel"
                class="flex-1 py-2 px-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700 text-sm"
              >
                上传图片
              </button>
            </div>
            
            <!-- Show selected/uploaded model -->
            <div v-if="selectedModel || uploadedModel" class="mt-4 p-4 bg-gray-800 rounded-lg">
              <img 
                :src="selectedModel?.thumbnail || uploadedModel" 
                :alt="selectedModel?.name || 'Uploaded Model'" 
                class="w-20 h-20 object-cover rounded mx-auto mb-2" 
              />
              <p class="text-green-400 text-sm text-center">
                {{ selectedModel ? selectedModel.name : '模特图上传成功' }}
              </p>
              <button
                @click="selectedModel = null; uploadedModel = null"
                class="mt-2 text-xs text-gray-400 hover:text-red-400 block mx-auto"
              >
                重新选择
              </button>
            </div>
          </div>

          <!-- Prompt Templates -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">Prompt模板 <span class="text-red-400">*</span></h2>
            
            <div class="grid grid-cols-2 gap-3 mb-4">
              <button
                v-for="template in promptTemplates"
                :key="template.id"
                @click="selectPromptTemplate(template)"
                :class="[
                  'p-2.5 rounded-lg text-left transition-all border-2',
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
                class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 resize-none text-sm"
                rows="3"
              ></textarea>
            </div>
          </div>

          <!-- Reference Pose Selection -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">参考姿势 <span class="text-gray-500">(可选)</span></h2>
            
            <div class="grid grid-cols-4 gap-3 mb-6">
              <div
                v-for="pose in poseTemplates"
                :key="pose.id"
                @click="selectPose(pose)"
                :class="[
                  'aspect-[3/4] rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border-2',
                  selectedPose?.id === pose.id ? 'border-primary-500' : 'border-gray-700 hover:border-gray-600'
                ]"
              >
                <img
                  :src="pose.thumbnail"
                  :alt="pose.name"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>

            <!-- Upload Custom Pose -->
            <div
              @click="console.log('上传姿势参考图功能开发中...')"
              class="border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-lg p-6 text-center cursor-pointer transition-colors group"
            >
              <Camera class="h-8 w-8 text-gray-500 group-hover:text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 group-hover:text-gray-400 text-sm">上传姿势参考图</p>
              <p class="text-gray-600 text-xs">上传自定义的姿势参考图片</p>
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
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              placeholder="输入生成数量 (1-8)"
            />
          </div>

          <!-- Aspect Ratio Selection -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">图片比例</h2>
            
            <!-- Default aspect ratios (always shown) -->
            <div class="grid grid-cols-3 gap-2 mb-3">
              <div
                v-for="ratio in defaultAspectRatios"
                :key="ratio.id"
                @click="selectAspectRatio(ratio)"
                :class="[
                  'relative cursor-pointer transition-all hover:scale-105 border-2 rounded-lg p-3',
                  selectedAspectRatio?.id === ratio.id ? 'border-primary-500 bg-primary-500/10' : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                ]"
              >
                <!-- Visual preview of ratio -->
                <div class="flex items-center justify-center mb-2 h-10">
                  <div 
                    :class="[
                      'bg-gray-600 border border-gray-500 rounded-sm',
                      selectedAspectRatio?.id === ratio.id ? 'bg-primary-400' : ''
                    ]"
                    :style="{
                      width: Math.min(28, (ratio.width / Math.max(ratio.width, ratio.height)) * 28) + 'px',
                      height: Math.min(28, (ratio.height / Math.max(ratio.width, ratio.height)) * 28) + 'px'
                    }"
                  ></div>
                </div>
                <!-- Ratio label -->
                <div class="text-center">
                  <span :class="[
                    'text-xs font-medium',
                    selectedAspectRatio?.id === ratio.id ? 'text-white' : 'text-gray-300'
                  ]">{{ ratio.name }}</span>
                </div>
                <!-- Selected indicator -->
                <div v-if="selectedAspectRatio?.id === ratio.id" class="absolute top-1 right-1">
                  <div class="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                    <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Toggle button for more options -->
            <button
              @click="showAllAspectRatios = !showAllAspectRatios"
              class="w-full py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors border border-gray-700 mb-3"
            >
              <span v-if="!showAllAspectRatios">显示更多比例选项 ({{ extraAspectRatios.length }})</span>
              <span v-else>收起比例选项</span>
              <svg 
                :class="[
                  'w-4 h-4 ml-2 inline transition-transform',
                  showAllAspectRatios ? 'rotate-180' : ''
                ]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- Extra aspect ratios (collapsible) -->
            <div v-if="showAllAspectRatios" class="grid grid-cols-5 gap-2 mb-3">
              <div
                v-for="ratio in extraAspectRatios"
                :key="ratio.id"
                @click="selectAspectRatio(ratio)"
                :class="[
                  'relative cursor-pointer transition-all hover:scale-105 border-2 rounded-lg p-2',
                  selectedAspectRatio?.id === ratio.id ? 'border-primary-500 bg-primary-500/10' : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                ]"
              >
                <!-- Visual preview of ratio -->
                <div class="flex items-center justify-center mb-1 h-8">
                  <div 
                    :class="[
                      'bg-gray-600 border border-gray-500 rounded-sm',
                      selectedAspectRatio?.id === ratio.id ? 'bg-primary-400' : ''
                    ]"
                    :style="{
                      width: Math.min(24, (ratio.width / Math.max(ratio.width, ratio.height)) * 24) + 'px',
                      height: Math.min(24, (ratio.height / Math.max(ratio.width, ratio.height)) * 24) + 'px'
                    }"
                  ></div>
                </div>
                <!-- Ratio label -->
                <div class="text-center">
                  <span :class="[
                    'text-xs font-medium',
                    selectedAspectRatio?.id === ratio.id ? 'text-white' : 'text-gray-300'
                  ]">{{ ratio.name }}</span>
                </div>
                <!-- Selected indicator -->
                <div v-if="selectedAspectRatio?.id === ratio.id" class="absolute top-1 right-1">
                  <div class="w-3 h-3 bg-primary-500 rounded-full flex items-center justify-center">
                    <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="selectedAspectRatio" class="mt-3 text-center">
              <span class="text-primary-400 text-sm">已选择: {{ selectedAspectRatio.name }}</span>
            </div>
          </div>

          <!-- Generate Button -->
          <button
            @click="generatePoseImages"
:disabled="(!selectedModel && !uploadedModel) || !customPrompt.trim() || isGenerating"
            class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:from-gray-700 disabled:to-gray-700 text-white py-4 rounded-lg font-semibold transition-all disabled:cursor-not-allowed"
          >
            <span v-if="isGenerating">生成中...</span>
            <span v-else>生成 {{ generationCount }} 张姿势图</span>
          </button>

          <div class="mt-4 text-center">
            <p class="text-gray-500 text-sm">预计生成时间：2-3分钟</p>
            <p class="text-gray-500 text-xs">必选：选择模特、Prompt | 可选：参考姿势</p>
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
            <p class="text-gray-400">正在生成姿势图...</p>
          </div>

          <div v-else-if="generatedResults.length > 0" class="grid grid-cols-3 gap-3">
            <div
              v-for="result in generatedResults"
              :key="result.id"
              class="relative group"
            >
              <img
                :src="result.url"
                :alt="`Generated result ${result.id}`"
                :class="[
                  'w-full object-cover rounded-lg',
                  result.aspectRatio?.id === '1:1' ? 'aspect-square' :
                  result.aspectRatio?.id === '4:3' ? 'aspect-[4/3]' :
                  result.aspectRatio?.id === '3:2' ? 'aspect-[3/2]' :
                  result.aspectRatio?.id === '5:4' ? 'aspect-[5/4]' :
                  result.aspectRatio?.id === '9:16' ? 'aspect-[9/16]' :
                  result.aspectRatio?.id === '16:9' ? 'aspect-[16/9]' :
                  result.aspectRatio?.id === '21:9' ? 'aspect-[21/9]' :
                  result.aspectRatio?.id === '2:3' ? 'aspect-[2/3]' :
                  result.aspectRatio?.id === '4:5' ? 'aspect-[4/5]' :
                  'aspect-[3/4]'
                ]"
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

          <div v-else>
            <div class="text-center py-16">
              <h3 class="text-lg font-semibold text-white mb-4">优秀案例</h3>
              <div class="grid grid-cols-3 gap-3">
                <div
                  v-for="sample in sampleResults"
                  :key="sample.id"
                  class="relative"
                >
                  <img
                    :src="sample.url"
                    :alt="`Sample ${sample.id}`"
                    :class="[
                      'w-full object-cover rounded-lg opacity-60',
                      selectedAspectRatio?.id === '1:1' ? 'aspect-square' :
                      selectedAspectRatio?.id === '4:3' ? 'aspect-[4/3]' :
                      selectedAspectRatio?.id === '3:2' ? 'aspect-[3/2]' :
                      selectedAspectRatio?.id === '5:4' ? 'aspect-[5/4]' :
                      selectedAspectRatio?.id === '9:16' ? 'aspect-[9/16]' :
                      selectedAspectRatio?.id === '16:9' ? 'aspect-[16/9]' :
                      selectedAspectRatio?.id === '21:9' ? 'aspect-[21/9]' :
                      selectedAspectRatio?.id === '2:3' ? 'aspect-[2/3]' :
                      selectedAspectRatio?.id === '4:5' ? 'aspect-[4/5]' :
                      'aspect-[3/4]'
                    ]"
                  />
                </div>
              </div>
              <p class="text-gray-500 text-sm mt-4">上传模特图并选择姿势后开始生成</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Model Gallery Selection Modal -->
    <div 
      v-if="showModelSelection" 
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="showModelSelection = false"
    >
      <div class="bg-gray-900 rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-lg font-bold text-white">选择模特</h3>
            <p class="text-gray-400 text-sm mt-1">从图库中选择适合的模特</p>
          </div>
          <button
            @click="showModelSelection = false"
            class="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Model Gallery Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div
            v-for="model in modelGallery"
            :key="model.id"
            @click="selectModelFromGallery(model)"
            class="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border-2 border-gray-700 hover:border-primary-500 group"
          >
            <img
              :src="model.thumbnail"
              :alt="model.name"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all"></div>
            <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2">
              <p class="text-sm font-medium">{{ model.name }}</p>
              <p class="text-xs text-gray-300">{{ model.style }}</p>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="flex justify-center">
          <button
            @click="showModelSelection = false"
            class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            取消
          </button>
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>