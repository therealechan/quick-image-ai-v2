<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import { BarChart3, Image, Zap, TrendingUp, Plus, Menu, Activity, Clock } from 'lucide-vue-next'

const router = useRouter()

const isMobileMenuOpen = ref(false)

const mockStats = ref({
  totalImages: 1247,
  totalProjects: 23,
  monthlyImages: 186,
  creditsRemaining: 850,
  todayImages: 12
})

const mockRecentProjects = ref([
  {
    id: '1',
    name: '产品摄影系列',
    imageCount: 24,
    lastModified: '2小时前',
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop',
    status: 'completed'
  },
  {
    id: '2', 
    name: '品牌宣传图',
    imageCount: 15,
    lastModified: '1天前',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=150&h=150&fit=crop',
    status: 'processing'
  },
  {
    id: '3',
    name: 'Logo设计方案',
    imageCount: 8,
    lastModified: '3天前', 
    thumbnail: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=150&h=150&fit=crop',
    status: 'completed'
  }
])

const mockRecentImages = ref([
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=200&h=200&fit=crop'
])

const mockRecentActivity = ref([
  { action: '生成图片', project: '产品摄影系列', time: '5分钟前' },
  { action: '创建项目', project: '品牌宣传图', time: '1小时前' },
  { action: '编辑设置', project: 'Logo设计方案', time: '3小时前' },
  { action: '下载图片', project: '产品摄影系列', time: '5小时前' }
])

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const navigateToNewProject = () => {
  router.push('/projects')
}

onMounted(() => {
  if (!authService.isAuthenticated()) {
    router.push('/login')
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

      <div class="flex-1 overflow-y-auto p-6 lg:p-8">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">欢迎回来！</h1>
          <p class="text-base text-gray-400">这是你的创作概览和快速操作面板</p>
        </div>


        <!-- Stats Overview -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-blue-500/20 rounded-lg">
                <Image class="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p class="text-gray-400 text-sm">总图片</p>
                <p class="text-xl font-bold text-white">{{ mockStats.totalImages.toLocaleString() }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-green-500/20 rounded-lg">
                <BarChart3 class="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p class="text-gray-400 text-sm">项目</p>
                <p class="text-xl font-bold text-white">{{ mockStats.totalProjects }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-purple-500/20 rounded-lg">
                <TrendingUp class="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p class="text-gray-400 text-sm">本月</p>
                <p class="text-xl font-bold text-white">{{ mockStats.monthlyImages }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-yellow-500/20 rounded-lg">
                <Zap class="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p class="text-gray-400 text-sm">积分</p>
                <p class="text-xl font-bold text-white">{{ mockStats.creditsRemaining }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Left-Right Layout -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-0">
          <!-- Left Panel - Operations -->
          <div class="space-y-6 order-1 xl:order-1">
            <!-- Quick Action -->
            <div class="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <button
                @click="navigateToNewProject"
                class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white p-6 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-primary-500/25 flex items-center space-x-4"
              >
                <div class="p-3 bg-white/10 rounded-lg">
                  <Plus class="h-6 w-6" />
                </div>
                <div class="text-left">
                  <h3 class="text-xl font-semibold">创建新项目</h3>
                  <p class="text-base text-primary-100">使用AI生成精美图像</p>
                </div>
              </button>
            </div>

            <!-- Recent Projects -->
            <div class="bg-gray-800 rounded-xl border border-gray-700 p-6 flex-1 min-h-0">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-white">最近的项目</h2>
                <button class="text-base text-primary-400 hover:text-primary-300 transition-colors">
                  查看全部
                </button>
              </div>
              <div class="space-y-4 overflow-y-auto max-h-96">
                <div
                  v-for="project in mockRecentProjects"
                  :key="project.id"
                  class="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer"
                >
                  <img
                    :src="project.thumbnail"
                    :alt="project.name"
                    class="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div class="flex-1 min-w-0">
                    <h3 class="text-white font-medium truncate text-base">{{ project.name }}</h3>
                    <p class="text-gray-400 truncate">{{ project.imageCount }} 张图片 • {{ project.lastModified }}</p>
                  </div>
                  <div class="flex items-center flex-shrink-0">
                    <span
                      :class="[
                        'px-2 py-1 rounded-full text-xs whitespace-nowrap',
                        project.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      ]"
                    >
                      {{ project.status === 'completed' ? '已完成' : '处理中' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Panel - Results & Gallery -->
          <div class="space-y-6 order-2 xl:order-2">
            <!-- Recent Images Gallery -->
            <div class="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-white">最新图片</h2>
                <button class="text-base text-primary-400 hover:text-primary-300 transition-colors">
                  查看更多
                </button>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
                <div
                  v-for="(image, index) in mockRecentImages"
                  :key="index"
                  class="aspect-square rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                >
                  <img
                    :src="image"
                    :alt="`Recent image ${index + 1}`"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div class="flex items-center space-x-2 mb-4">
                <Activity class="h-5 w-5 text-primary-400" />
                <h2 class="text-xl font-semibold text-white">最近活动</h2>
              </div>
              <div class="space-y-4 max-h-64 overflow-y-auto">
                <div
                  v-for="(activity, index) in mockRecentActivity"
                  :key="index"
                  class="flex items-center space-x-3"
                >
                  <div class="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                  <div class="flex-1 min-w-0">
                    <p class="text-white truncate">{{ activity.action }}</p>
                    <p class="text-gray-400 text-sm truncate">{{ activity.project }}</p>
                  </div>
                  <div class="flex items-center space-x-1 text-gray-500 flex-shrink-0">
                    <Clock class="h-3 w-3" />
                    <span class="text-xs whitespace-nowrap">{{ activity.time }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

:root {
  --primary-400: #8b5cf6;
  --primary-500: #7c3aed;
  --primary-600: #6d28d9;
}

.bg-gray-750 {
  background-color: #374151;
}
</style>