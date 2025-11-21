<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import { ArrowLeft, User, Camera, Zap, Menu, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const isMobileMenuOpen = ref(false)
const selectedService = ref('')

const projectId = computed(() => route.params.id as string)

const serviceTypes = ref([
  {
    id: 'model',
    name: '模特图',
    description: 'AI生成完整的虚拟模特图像',
    detail: '选择虚拟形象、搭配服装、设置背景，生成完整的模特展示图',
    icon: User,
    color: 'from-blue-500 to-blue-600',
    features: ['8步完整流程', '虚拟形象选择', '服装搭配系统', '背景场景设置'],
    estimatedTime: '2-3分钟',
    progressSteps: ['正在处理', '生成中', '优化中', '精修中', '即将完成']
  },
  {
    id: 'pose',
    name: '姿势图',
    description: '基于参考图生成特定姿势的模特图',
    detail: '上传姿势参考图或选择预设姿势，应用到指定的虚拟模特上',
    icon: Camera,
    color: 'from-green-500 to-green-600',
    features: ['姿势参考导入', '模特库选择', '姿势细节调整', '快速生成'],
    estimatedTime: '1-2分钟',
    progressSteps: ['正在处理', '生成中', '优化中', '即将完成']
  },
  {
    id: 'upscale',
    name: '高清图',
    description: '将现有图片放大并增强细节',
    detail: '支持2x-8x放大，智能增强细节、减少噪点、提升清晰度',
    icon: Zap,
    color: 'from-purple-500 to-purple-600',
    features: ['多倍数放大', '智能细节增强', '噪点减少', '批量处理'],
    estimatedTime: '30-60秒',
    progressSteps: ['正在处理', '处理中', '优化中', '精修中', '即将完成']
  }
])

const project = ref({
  id: projectId.value,
  name: '夏季服装系列',
  description: '2024夏季新品模特展示'
})

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const goBack = () => {
  router.push(`/dashboard/projects/${projectId.value}`)
}

const selectService = (serviceId: string) => {
  selectedService.value = serviceId
}

const startGeneration = () => {
  if (!selectedService.value) {
    alert('请选择一个服务类型')
    return
  }

  // Route to specific service flow
  router.push(`/dashboard/projects/${projectId.value}/${selectedService.value}`)
}
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
          <h1 class="text-xl font-bold text-white">选择服务</h1>
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
        <div class="flex items-center space-x-4">
          <button
            @click="goBack"
            class="hidden lg:block p-2 text-gray-400 hover:text-white -ml-2"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-2xl font-bold text-white">选择AI服务类型</h1>
            <p class="text-gray-400">为项目 "{{ project.name }}" 选择要使用的AI服务</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 lg:p-8">
        <div class="max-w-6xl mx-auto">
          <!-- Service Type Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              v-for="service in serviceTypes"
              :key="service.id"
              @click="selectService(service.id)"
              :class="[
                'bg-gray-800 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 relative overflow-hidden',
                selectedService === service.id
                  ? 'border-primary-500 ring-2 ring-primary-500/20'
                  : 'border-gray-700 hover:border-gray-600'
              ]"
            >
              <!-- Background Gradient -->
              <div 
                :class="[
                  'absolute top-0 left-0 right-0 h-2 bg-gradient-to-r',
                  service.color
                ]"
              />

              <div class="p-6">
                <!-- Icon & Title -->
                <div class="flex items-center space-x-4 mb-4">
                  <div :class="[
                    'p-3 rounded-lg bg-gradient-to-r',
                    service.color
                  ]">
                    <component :is="service.icon" class="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-white">{{ service.name }}</h3>
                    <p class="text-gray-400 text-sm">{{ service.description }}</p>
                  </div>
                </div>

                <!-- Detail Description -->
                <p class="text-gray-300 text-sm mb-6 leading-relaxed">
                  {{ service.detail }}
                </p>

                <!-- Features -->
                <div class="mb-6">
                  <h4 class="text-white font-medium mb-3">主要功能:</h4>
                  <div class="grid grid-cols-2 gap-2">
                    <div
                      v-for="feature in service.features"
                      :key="feature"
                      class="flex items-center space-x-2"
                    >
                      <div class="w-1.5 h-1.5 bg-primary-400 rounded-full" />
                      <span class="text-gray-300 text-xs">{{ feature }}</span>
                    </div>
                  </div>
                </div>

                <!-- Estimated Time -->
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-gray-400 text-xs">预计时间:</span>
                    <span class="text-white text-sm font-medium ml-2">{{ service.estimatedTime }}</span>
                  </div>
                  
                  <!-- Selection Indicator -->
                  <div
                    v-if="selectedService === service.id"
                    class="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                  >
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Selected Service Details -->
          <div v-if="selectedService" class="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-white mb-2">
                  {{ serviceTypes.find(s => s.id === selectedService)?.name }} - 详细信息
                </h3>
                <p class="text-gray-400">
                  {{ serviceTypes.find(s => s.id === selectedService)?.detail }}
                </p>
              </div>
              <button
                @click="startGeneration"
                class="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white px-8 py-4 rounded-lg transition-all hover:scale-105 shadow-lg shadow-primary-500/25 flex items-center space-x-3"
              >
                <span class="font-medium">开始创建</span>
                <ArrowRight class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Quick Guide -->
          <div class="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 class="text-lg font-semibold text-white mb-4">使用指南</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <User class="h-6 w-6 text-blue-400" />
                </div>
                <h4 class="text-white font-medium mb-2">模特图</h4>
                <p class="text-gray-400 text-sm">适合产品展示、服装搭配、品牌宣传等场景</p>
              </div>
              <div class="text-center">
                <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Camera class="h-6 w-6 text-green-400" />
                </div>
                <h4 class="text-white font-medium mb-2">姿势图</h4>
                <p class="text-gray-400 text-sm">基于参考姿势快速生成，适合动作展示</p>
              </div>
              <div class="text-center">
                <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap class="h-6 w-6 text-purple-400" />
                </div>
                <h4 class="text-white font-medium mb-2">高清图</h4>
                <p class="text-gray-400 text-sm">提升现有图片质量，适合印刷、放大展示</p>
              </div>
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