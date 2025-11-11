<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import { authService } from '../services/auth'
import { History, Filter, Search, ArrowLeft, Calendar, ChevronRight, Home } from 'lucide-vue-next'

const router = useRouter()
const isMobileMenuOpen = ref(false)

// Current user
const currentUser = computed(() => authService.getCurrentUser())

// Mock data - 扩展的使用记录
const allUsageHistory = ref([
  {
    id: '1',
    service: '模特图生成',
    credits: 3,
    count: 1,
    timestamp: new Date('2024-11-10T14:30:00'),
    status: 'completed',
    details: '生成高质量模特图像'
  },
  {
    id: '2', 
    service: '姿势图生成',
    credits: 6,
    count: 2,
    timestamp: new Date('2024-11-10T12:15:00'),
    status: 'completed',
    details: '生成动态姿势参考图'
  },
  {
    id: '3',
    service: '高清放大',
    credits: 2,
    count: 1,
    timestamp: new Date('2024-11-09T16:45:00'),
    status: 'completed',
    details: '图像质量提升至4K'
  },
  {
    id: '4',
    service: '模特图生成',
    credits: 9,
    count: 3,
    timestamp: new Date('2024-11-09T10:20:00'),
    status: 'completed',
    details: '批量生成商业模特图'
  },
  {
    id: '5',
    service: '姿势图生成',
    credits: 3,
    count: 1,
    timestamp: new Date('2024-11-08T18:30:00'),
    status: 'completed',
    details: '运动姿势参考生成'
  },
  {
    id: '6',
    service: '高清放大',
    credits: 4,
    count: 2,
    timestamp: new Date('2024-11-08T09:15:00'),
    status: 'completed',
    details: '多张图片批量放大'
  },
  {
    id: '7',
    service: '模特图生成',
    credits: 6,
    count: 2,
    timestamp: new Date('2024-11-07T21:45:00'),
    status: 'completed',
    details: '时尚模特写真生成'
  },
  {
    id: '8',
    service: '姿势图生成',
    credits: 9,
    count: 3,
    timestamp: new Date('2024-11-07T14:20:00'),
    status: 'completed',
    details: '舞蹈动作参考图集'
  },
  {
    id: '9',
    service: '模特图生成',
    credits: 3,
    count: 1,
    timestamp: new Date('2024-11-06T16:30:00'),
    status: 'failed',
    details: '生成失败，积分已退回'
  },
  {
    id: '10',
    service: '高清放大',
    credits: 6,
    count: 3,
    timestamp: new Date('2024-11-06T11:00:00'),
    status: 'completed',
    details: '人像照片质量提升'
  },
  {
    id: '11',
    service: '模特图生成',
    credits: 3,
    count: 1,
    timestamp: new Date('2024-11-05T15:45:00'),
    status: 'completed',
    details: '时尚模特肖像生成'
  },
  {
    id: '12',
    service: '姿势图生成',
    credits: 9,
    count: 3,
    timestamp: new Date('2024-11-05T10:30:00'),
    status: 'completed',
    details: '瑜伽动作参考图'
  },
  {
    id: '13',
    service: '高清放大',
    credits: 4,
    count: 2,
    timestamp: new Date('2024-11-04T18:20:00'),
    status: 'completed',
    details: '风景照片质量提升'
  },
  {
    id: '14',
    service: '模特图生成',
    credits: 6,
    count: 2,
    timestamp: new Date('2024-11-04T14:15:00'),
    status: 'completed',
    details: '商业广告模特'
  },
  {
    id: '15',
    service: '姿势图生成',
    credits: 3,
    count: 1,
    timestamp: new Date('2024-11-03T16:40:00'),
    status: 'completed',
    details: '健身动作示范'
  },
  {
    id: '16',
    service: '高清放大',
    credits: 2,
    count: 1,
    timestamp: new Date('2024-11-03T11:25:00'),
    status: 'failed',
    details: '放大失败，已退回积分'
  },
  {
    id: '17',
    service: '模特图生成',
    credits: 12,
    count: 4,
    timestamp: new Date('2024-11-02T20:10:00'),
    status: 'completed',
    details: '婚纱模特系列'
  },
  {
    id: '18',
    service: '姿势图生成',
    credits: 6,
    count: 2,
    timestamp: new Date('2024-11-02T13:55:00'),
    status: 'completed',
    details: '舞蹈姿势参考'
  },
  {
    id: '19',
    service: '高清放大',
    credits: 8,
    count: 4,
    timestamp: new Date('2024-11-01T17:30:00'),
    status: 'completed',
    details: '产品摄影放大'
  },
  {
    id: '20',
    service: '模特图生成',
    credits: 3,
    count: 1,
    timestamp: new Date('2024-11-01T09:45:00'),
    status: 'completed',
    details: '休闲服装模特'
  },
  {
    id: '21',
    service: '姿势图生成',
    credits: 15,
    count: 5,
    timestamp: new Date('2024-10-31T22:15:00'),
    status: 'completed',
    details: '体操动作分解图'
  },
  {
    id: '22',
    service: '高清放大',
    credits: 6,
    count: 3,
    timestamp: new Date('2024-10-31T14:20:00'),
    status: 'completed',
    details: '艺术作品高清化'
  },
  {
    id: '23',
    service: '模特图生成',
    credits: 9,
    count: 3,
    timestamp: new Date('2024-10-30T16:50:00'),
    status: 'completed',
    details: '运动服装展示'
  },
  {
    id: '24',
    service: '姿势图生成',
    credits: 3,
    count: 1,
    timestamp: new Date('2024-10-30T12:35:00'),
    status: 'completed',
    details: '武术动作参考'
  },
  {
    id: '25',
    service: '高清放大',
    credits: 4,
    count: 2,
    timestamp: new Date('2024-10-29T19:40:00'),
    status: 'completed',
    details: '建筑摄影放大'
  }
])

// Filter and search states
const searchQuery = ref('')
const selectedService = ref('all')
const selectedStatus = ref('all')
const dateRange = ref({
  start: '',
  end: ''
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Services for filter
const services = ['all', '模特图生成', '姿势图生成', '高清放大']
const statuses = ['all', 'completed', 'failed']

// Computed filtered data
const filteredHistory = computed(() => {
  let filtered = allUsageHistory.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.service.toLowerCase().includes(query) ||
      item.details.toLowerCase().includes(query)
    )
  }

  // Service filter
  if (selectedService.value !== 'all') {
    filtered = filtered.filter(item => item.service === selectedService.value)
  }

  // Status filter
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(item => item.status === selectedStatus.value)
  }

  // Date range filter
  if (dateRange.value.start) {
    const startDate = new Date(dateRange.value.start)
    filtered = filtered.filter(item => new Date(item.timestamp) >= startDate)
  }
  if (dateRange.value.end) {
    const endDate = new Date(dateRange.value.end)
    endDate.setHours(23, 59, 59, 999) // End of day
    filtered = filtered.filter(item => new Date(item.timestamp) <= endDate)
  }

  return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

// Pagination computed
const totalPages = computed(() => Math.ceil(filteredHistory.value.length / itemsPerPage.value))

const paginatedHistory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredHistory.value.slice(start, end)
})

// Methods
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-400 bg-green-900/20'
    case 'failed':
      return 'text-yellow-400 bg-yellow-900/20'
    default:
      return 'text-gray-400 bg-gray-900/20'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return '已完成'
    case 'failed':
      return '失败-已退积分'
    default:
      return '未知'
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedService.value = 'all'
  selectedStatus.value = 'all'
  dateRange.value = { start: '', end: '' }
  currentPage.value = 1
}

const goToPage = (page: number) => {
  currentPage.value = page
}

const goBack = () => {
  router.push('/subscription')
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
      <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <!-- Breadcrumb -->
        <nav class="flex items-center space-x-2 text-sm mb-6" aria-label="面包屑导航">
          <button
            @click="router.push('/subscription')"
            class="flex items-center space-x-1 text-gray-400 hover:text-primary-400 transition-colors"
          >
            <Home class="h-4 w-4" />
            <span>订阅管理</span>
          </button>
          <ChevronRight class="h-4 w-4 text-gray-600" />
          <span class="text-primary-400 font-medium">使用记录</span>
        </nav>

        <!-- Header -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <button
                @click="goBack"
                class="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              >
                <ArrowLeft class="h-5 w-5" />
              </button>
              <History class="h-8 w-8 text-primary-500" />
              <h1 class="text-2xl font-bold text-white">使用记录</h1>
            </div>
          </div>
          <p class="text-sm text-gray-400">查看您的所有服务使用历史记录</p>
        </div>

        <!-- Filters -->
        <div class="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <!-- Search -->
            <div class="lg:col-span-2">
              <label class="block text-sm font-medium text-gray-300 mb-2">搜索</label>
              <div class="relative">
                <Search class="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索服务或详情..."
                  class="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <!-- Service Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">服务类型</label>
              <select
                v-model="selectedService"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
              >
                <option value="all">全部服务</option>
                <option v-for="service in services.slice(1)" :key="service" :value="service">
                  {{ service }}
                </option>
              </select>
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">状态</label>
              <select
                v-model="selectedStatus"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
              >
                <option value="all">全部状态</option>
                <option value="completed">已完成</option>
                <option value="failed">失败</option>
              </select>
            </div>

            <!-- Clear Filters -->
            <div class="flex items-end">
              <button
                @click="clearFilters"
                class="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
              >
                清除筛选
              </button>
            </div>
          </div>

          <!-- Date Range -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">开始日期</label>
              <input
                v-model="dateRange.start"
                type="date"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">结束日期</label>
              <input
                v-model="dateRange.end"
                type="date"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">服务</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">时间</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">消耗积分</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">数量</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">状态</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">详情</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-800">
                <tr v-for="item in paginatedHistory" :key="item.id" class="hover:bg-gray-800/50">
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center text-sm font-semibold text-primary-400">
                        {{ getServiceIcon(item.service) }}
                      </div>
                      <span class="text-sm font-medium text-white">{{ item.service }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-300">
                    {{ formatDate(item.timestamp) }}
                  </td>
                  <td class="px-6 py-4">
                    <div v-if="item.status === 'failed'" class="text-sm">
                      <div class="font-semibold text-green-400">+{{ item.credits }}</div>
                      <div class="text-xs text-green-300">已退回</div>
                    </div>
                    <div v-else class="text-sm font-semibold text-red-400">
                      -{{ item.credits }}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-300">
                    {{ item.count }}张
                  </td>
                  <td class="px-6 py-4">
                    <span :class="['text-xs px-2 py-1 rounded-full font-medium', getStatusColor(item.status)]">
                      {{ getStatusText(item.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-400">
                    {{ item.details }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="filteredHistory.length === 0" class="text-center py-12">
            <History class="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-300 mb-2">暂无记录</h3>
            <p class="text-sm text-gray-500">未找到符合条件的使用记录</p>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="bg-gray-800 px-6 py-4 border-t border-gray-700">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-400">
                显示 {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredHistory.length) }}-{{ Math.min(currentPage * itemsPerPage, filteredHistory.length) }} 
                共 {{ filteredHistory.length }} 条记录
              </div>
              <div class="flex space-x-2">
                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'px-3 py-1 text-sm rounded transition-colors',
                    page === currentPage
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  ]"
                >
                  {{ page }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>