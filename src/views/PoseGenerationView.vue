<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import { Upload, Download, Camera } from 'lucide-vue-next'

const isMobileMenuOpen = ref(false)

// Selection states
const selectedPose = ref<any>(null)
const uploadedModel = ref<string | null>(null)
const generatedResults = ref<any[]>([])
const isGenerating = ref(false)
const generationCount = ref(2)
const selectedPromptTemplate = ref<any>(null)
const customPrompt = ref('')

// Mock data
const poseTemplates = ref([
  { id: '1', name: '优雅站姿', thumbnail: 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=150&h=200&fit=crop', category: 'standing' },
  { id: '2', name: '动感跳跃', thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=200&fit=crop', category: 'action' },
  { id: '3', name: '坐姿优雅', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=200&fit=crop', category: 'sitting' },
  { id: '4', name: '休闲走路', thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=200&fit=crop', category: 'walking' },
  { id: '5', name: '交叉手臂', thumbnail: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=200&fit=crop', category: 'standing' },
  { id: '6', name: '手摸头发', thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=200&fit=crop', category: 'pose' }
])

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

const selectPose = (pose: any) => {
  selectedPose.value = pose
}

const selectPromptTemplate = (template: any) => {
  selectedPromptTemplate.value = template
  customPrompt.value = template.prompt
}

const uploadModel = () => {
  // 模拟模特图上传
  uploadedModel.value = 'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=300&h=400&fit=crop'
}

const generatePoseImages = () => {
  isGenerating.value = true
  
  // 模拟生成过程
  setTimeout(() => {
    const mockImages = [
      'https://images.unsplash.com/photo-1594736797933-d0d3023055e0?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop'
    ]
    
    generatedResults.value = Array.from({ length: generationCount.value }, (_, index) => ({
      id: String(index + 1),
      url: mockImages[index % mockImages.length]
    }))
    isGenerating.value = false
  }, 3000)
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
            <h1 class="text-2xl font-bold text-white mb-2">姿势图生成</h1>
            <p class="text-gray-400">上传模特图，选择姿势参考，生成新姿势</p>
          </div>

          <!-- Upload Model -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">上传模特图</h2>
            
            <div
              @click="uploadModel"
              class="border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-lg p-6 text-center cursor-pointer transition-colors group"
            >
              <Upload class="h-8 w-8 text-gray-500 group-hover:text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 group-hover:text-gray-400 text-sm">选择模特图</p>
              <p class="text-gray-600 text-xs">选择要改变姿势的模特照片</p>
            </div>

            <div v-if="uploadedModel" class="mt-4 p-4 bg-gray-800 rounded-lg">
              <img :src="uploadedModel" alt="Uploaded Model" class="w-20 h-20 object-cover rounded mx-auto mb-2" />
              <p class="text-green-400 text-sm text-center">模特图上传成功</p>
            </div>
          </div>

          <!-- Pose Selection -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">选择参考姿势</h2>
            
            <div class="grid grid-cols-3 gap-4 mb-6">
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
            <div class="flex space-x-3">
              <button
                v-for="count in [1, 2, 3, 4]"
                :key="count"
                @click="generationCount = count"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  generationCount === count 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                ]"
              >
                {{ count }}张
              </button>
            </div>
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
            @click="generatePoseImages"
            :disabled="!uploadedModel || !selectedPose || !customPrompt.trim() || isGenerating"
            class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:from-gray-700 disabled:to-gray-700 text-white py-4 rounded-lg font-semibold transition-all disabled:cursor-not-allowed"
          >
            <span v-if="isGenerating">生成中...</span>
            <span v-else>生成 {{ generationCount }} 张姿势图</span>
          </button>

          <div class="mt-4 text-center">
            <p class="text-gray-500 text-sm">预计生成时间：2-3分钟</p>
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

          <div v-else-if="generatedResults.length > 0" class="grid grid-cols-2 gap-4">
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
              <p class="text-gray-500 text-sm mt-4">上传模特图并选择姿势后开始生成</p>
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