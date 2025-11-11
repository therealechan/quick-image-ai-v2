<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import { authService } from '../services/auth'
import { CreditCard, Package, History, Calendar, Sparkles, ArrowRight, ExternalLink } from 'lucide-vue-next'

const router = useRouter()
const isMobileMenuOpen = ref(false)

// Current user
const currentUser = computed(() => authService.getCurrentUser())

// Mock data - 积分包
const creditPackages = ref([
  {
    id: '1',
    name: '基础包',
    credits: 100,
    price: 29,
    originalPrice: 35,
    popular: false,
    description: '适合轻度使用'
  },
  {
    id: '2', 
    name: '标准包',
    credits: 300,
    price: 79,
    originalPrice: 99,
    popular: true,
    description: '最受欢迎的选择'
  },
  {
    id: '3',
    name: '专业包',
    credits: 600,
    price: 149,
    originalPrice: 189,
    popular: false,
    description: '高频使用用户首选'
  },
  {
    id: '4',
    name: '企业包',
    credits: 1200,
    price: 269,
    originalPrice: 349,
    popular: false,
    description: '团队和企业使用'
  }
])

// Mock data - 服务消费记录
const consumptionHistory = ref([
  {
    id: '1',
    service: '模特图生成',
    credits: 3,
    count: 1,
    timestamp: new Date('2024-11-10T14:30:00'),
    status: 'completed'
  },
  {
    id: '2',
    service: '姿势图生成', 
    credits: 6,
    count: 2,
    timestamp: new Date('2024-11-10T12:15:00'),
    status: 'completed'
  },
  {
    id: '3',
    service: '高清放大',
    credits: 2,
    count: 1,
    timestamp: new Date('2024-11-09T16:45:00'),
    status: 'completed'
  },
  {
    id: '4',
    service: '模特图生成',
    credits: 9,
    count: 3,
    timestamp: new Date('2024-11-09T10:20:00'),
    status: 'completed'
  },
  {
    id: '5',
    service: '姿势图生成',
    credits: 3,
    count: 1,
    timestamp: new Date('2024-11-08T18:30:00'),
    status: 'completed'
  }
])

// Mock data - 购买记录
const purchaseHistory = ref([
  {
    id: '1',
    packageName: '标准包',
    credits: 300,
    amount: 79,
    timestamp: new Date('2024-11-08T09:00:00'),
    status: 'completed'
  },
  {
    id: '2',
    packageName: '基础包',
    credits: 100,
    amount: 29,
    timestamp: new Date('2024-10-25T14:30:00'),
    status: 'completed'
  }
])

// Mock user credits
const userCredits = ref(277) // 300 - 23 consumed

// Pagination states
const showAllConsumption = ref(false)
const showAllPurchases = ref(false)

// Computed
const totalCreditsSpent = computed(() => {
  return consumptionHistory.value.reduce((total, item) => total + item.credits, 0)
})

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const formatShortDate = (date: Date): string => {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const handlePurchase = (packageItem: any) => {
  // Simulate purchase process
  alert(`购买 ${packageItem.name} (${packageItem.credits}积分) - ¥${packageItem.price}\n\n此功能开发中，将集成支付接口...`)
}

// Pagination handlers
const toggleConsumptionView = () => {
  showAllConsumption.value = !showAllConsumption.value
}

const goToUsageHistory = () => {
  router.push('/usage-history')
}

const goToPurchaseHistory = () => {
  router.push('/purchase-history')
}

const getServiceIcon = (serviceName: string) => {
  switch (serviceName) {
    case '模特图生成':
      return 'M'
    case '姿势图生成':
      return 'P' 
    case '高清放大':
      return 'U'
    default:
      return 'S'
  }
}

// Mobile menu handlers
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Redirect if not authenticated
onMounted(() => {
  if (!currentUser.value) {
    router.push('/login')
    return
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
    <main class="flex-1 overflow-y-auto scrollbar-hide">
      <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 xl:p-10">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center space-x-3 mb-4">
            <CreditCard class="h-8 w-8 text-primary-500" />
            <h1 class="text-2xl font-bold text-white">积分管理</h1>
          </div>
          <p class="text-sm text-gray-400">购买积分包并管理您的记录</p>
        </div>

        <!-- Top Action Area -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Current Balance - Information Display -->
          <div class="bg-gradient-to-br from-primary-500/15 to-primary-600/10 border-2 border-primary-500/30 rounded-xl p-6 shadow-lg">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-10 h-10 bg-primary-500/30 rounded-lg flex items-center justify-center">
                <Sparkles class="h-5 w-5 text-primary-300" />
              </div>
              <h3 class="text-xl font-bold text-white">当前余额</h3>
            </div>
            <div class="flex items-baseline space-x-3 mb-2">
              <span class="text-4xl font-black text-primary-200">{{ userCredits }}</span>
              <span class="text-xl font-semibold text-primary-400">积分</span>
            </div>
            <p class="text-sm text-primary-300/80">本月已使用 {{ totalCreditsSpent }} 积分</p>
          </div>

          <!-- Usage History Button -->
          <button
            @click="goToUsageHistory"
            role="button"
            aria-label="查看使用记录详情"
            class="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 hover:bg-gray-800/70 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg text-left group cursor-pointer"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <History class="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">使用记录</h3>
                  <p class="text-sm text-gray-400">查看详细使用历史</p>
                </div>
              </div>
              <ArrowRight class="h-5 w-5 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div class="text-sm text-gray-500">
              最近使用 {{ consumptionHistory.length }} 次服务
            </div>
            <div class="text-xs text-blue-400/60 mt-2 group-hover:text-blue-400 transition-colors">
              点击查看详情
            </div>
          </button>

          <!-- Purchase History Button -->
          <button
            @click="goToPurchaseHistory"
            role="button"
            aria-label="查看购买记录详情"
            class="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-green-500/50 hover:bg-gray-800/70 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg text-left group cursor-pointer"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <Calendar class="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white group-hover:text-green-300 transition-colors">购买记录</h3>
                  <p class="text-sm text-gray-400">查看购买历史记录</p>
                </div>
              </div>
              <ArrowRight class="h-5 w-5 text-gray-500 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div class="text-sm text-gray-500">
              共购买 {{ purchaseHistory.length }} 次积分包
            </div>
            <div class="text-xs text-green-400/60 mt-2 group-hover:text-green-400 transition-colors">
              点击查看详情
            </div>
          </button>
        </div>

        <!-- Credit Packages Section -->
        <div class="bg-gray-900 rounded-lg p-6 lg:p-8 border border-gray-800">
          <div class="flex items-center space-x-3 mb-6">
            <Package class="h-6 w-6 text-primary-400" />
            <h2 class="text-lg font-semibold text-white">选择积分包</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                <div 
                  v-for="pkg in creditPackages" 
                  :key="pkg.id"
                  class="relative bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-primary-500/50 transition-all hover:scale-105 cursor-pointer"
                  @click="handlePurchase(pkg)"
                >
                  <!-- Popular Badge -->
                  <div v-if="pkg.popular" class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div class="bg-primary-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      最受欢迎
                    </div>
                  </div>

                  <div class="text-center">
                    <h3 class="text-lg font-semibold text-white mb-2">{{ pkg.name }}</h3>
                    <p class="text-sm text-gray-400 mb-4">{{ pkg.description }}</p>
                    
                    <div class="mb-4">
                      <div class="text-3xl font-bold text-primary-300 mb-1">{{ pkg.credits }}</div>
                      <div class="text-sm text-gray-400">积分</div>
                    </div>

                    <div class="space-y-2 mb-6">
                      <div class="flex items-center justify-center space-x-2">
                        <span class="text-2xl font-bold text-white">¥{{ pkg.price }}</span>
                        <span class="text-lg text-gray-400 line-through">¥{{ pkg.originalPrice }}</span>
                      </div>
                      <div class="text-sm text-green-400">
                        节省 ¥{{ pkg.originalPrice - pkg.price }}
                      </div>
                    </div>

                    <button 
                      class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white py-3 rounded-lg font-medium transition-all"
                    >
                      购买
                    </button>
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