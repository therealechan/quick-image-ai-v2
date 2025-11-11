<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import { authService } from '../services/auth'
import { Calendar, Filter, Search, ArrowLeft, CreditCard, ChevronRight, Home } from 'lucide-vue-next'

const router = useRouter()
const isMobileMenuOpen = ref(false)

// Current user
const currentUser = computed(() => authService.getCurrentUser())

// Mock data - 扩展的购买记录
const allPurchaseHistory = ref([
  {
    id: '1',
    packageName: '标准包',
    credits: 300,
    amount: 79,
    originalAmount: 99,
    timestamp: new Date('2024-11-08T09:00:00'),
    status: 'completed',
    paymentMethod: '微信支付',
    orderNumber: 'WX2024110800001'
  },
  {
    id: '2',
    packageName: '基础包',
    credits: 100,
    amount: 29,
    originalAmount: 35,
    timestamp: new Date('2024-10-25T14:30:00'),
    status: 'completed',
    paymentMethod: '支付宝',
    orderNumber: 'ZFB2024102500012'
  },
  {
    id: '3',
    packageName: '专业包',
    credits: 600,
    amount: 149,
    originalAmount: 189,
    timestamp: new Date('2024-10-15T16:45:00'),
    status: 'completed',
    paymentMethod: '银行卡',
    orderNumber: 'BANK2024101500005'
  },
  {
    id: '4',
    packageName: '企业包',
    credits: 1200,
    amount: 269,
    originalAmount: 349,
    timestamp: new Date('2024-10-01T10:20:00'),
    status: 'completed',
    paymentMethod: '微信支付',
    orderNumber: 'WX2024100100003'
  },
  {
    id: '5',
    packageName: '标准包',
    credits: 300,
    amount: 79,
    originalAmount: 99,
    timestamp: new Date('2024-09-22T18:30:00'),
    status: 'refunded',
    paymentMethod: '支付宝',
    orderNumber: 'ZFB2024092200018'
  },
  {
    id: '6',
    packageName: '基础包',
    credits: 100,
    amount: 29,
    originalAmount: 35,
    timestamp: new Date('2024-09-10T09:15:00'),
    status: 'completed',
    paymentMethod: '微信支付',
    orderNumber: 'WX2024091000007'
  },
  {
    id: '7',
    packageName: '专业包',
    credits: 600,
    amount: 149,
    originalAmount: 189,
    timestamp: new Date('2024-08-28T21:45:00'),
    status: 'completed',
    paymentMethod: '银行卡',
    orderNumber: 'BANK2024082800009'
  },
  {
    id: '8',
    packageName: '标准包',
    credits: 300,
    amount: 79,
    originalAmount: 99,
    timestamp: new Date('2024-08-15T14:20:00'),
    status: 'failed',
    paymentMethod: '银行卡',
    orderNumber: 'BANK2024081500011'
  },
  {
    id: '9',
    packageName: '基础包',
    credits: 100,
    amount: 29,
    originalAmount: 35,
    timestamp: new Date('2024-08-01T10:30:00'),
    status: 'completed',
    paymentMethod: '微信支付',
    orderNumber: 'WX2024080100012'
  },
  {
    id: '10',
    packageName: '企业包',
    credits: 1200,
    amount: 269,
    originalAmount: 349,
    timestamp: new Date('2024-07-20T16:45:00'),
    status: 'completed',
    paymentMethod: '支付宝',
    orderNumber: 'ZFB2024072000015'
  },
  {
    id: '11',
    packageName: '标准包',
    credits: 300,
    amount: 79,
    originalAmount: 99,
    timestamp: new Date('2024-07-05T14:20:00'),
    status: 'completed',
    paymentMethod: '银行卡',
    orderNumber: 'BANK2024070500018'
  },
  {
    id: '12',
    packageName: '专业包',
    credits: 600,
    amount: 149,
    originalAmount: 189,
    timestamp: new Date('2024-06-25T11:15:00'),
    status: 'refunded',
    paymentMethod: '微信支付',
    orderNumber: 'WX2024062500021'
  },
  {
    id: '13',
    packageName: '基础包',
    credits: 100,
    amount: 29,
    originalAmount: 35,
    timestamp: new Date('2024-06-10T19:30:00'),
    status: 'completed',
    paymentMethod: '支付宝',
    orderNumber: 'ZFB2024061000024'
  },
  {
    id: '14',
    packageName: '标准包',
    credits: 300,
    amount: 79,
    originalAmount: 99,
    timestamp: new Date('2024-05-28T13:45:00'),
    status: 'completed',
    paymentMethod: '微信支付',
    orderNumber: 'WX2024052800027'
  },
  {
    id: '15',
    packageName: '企业包',
    credits: 1200,
    amount: 269,
    originalAmount: 349,
    timestamp: new Date('2024-05-15T09:20:00'),
    status: 'completed',
    paymentMethod: '银行卡',
    orderNumber: 'BANK2024051500030'
  }
])

// Filter and search states
const searchQuery = ref('')
const selectedPackage = ref('all')
const selectedStatus = ref('all')
const selectedPaymentMethod = ref('all')
const dateRange = ref({
  start: '',
  end: ''
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Filter options
const packages = ['all', '基础包', '标准包', '专业包', '企业包']
const statuses = ['all', 'completed', 'failed', 'refunded']
const paymentMethods = ['all', '微信支付', '支付宝', '银行卡']

// Computed filtered data
const filteredHistory = computed(() => {
  let filtered = allPurchaseHistory.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.packageName.toLowerCase().includes(query) ||
      item.orderNumber.toLowerCase().includes(query) ||
      item.paymentMethod.toLowerCase().includes(query)
    )
  }

  // Package filter
  if (selectedPackage.value !== 'all') {
    filtered = filtered.filter(item => item.packageName === selectedPackage.value)
  }

  // Status filter
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(item => item.status === selectedStatus.value)
  }

  // Payment method filter
  if (selectedPaymentMethod.value !== 'all') {
    filtered = filtered.filter(item => item.paymentMethod === selectedPaymentMethod.value)
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

// Statistics
const totalSpent = computed(() => {
  return filteredHistory.value
    .filter(item => item.status === 'completed')
    .reduce((total, item) => total + item.amount, 0)
})

const totalCredits = computed(() => {
  return filteredHistory.value
    .filter(item => item.status === 'completed')
    .reduce((total, item) => total + item.credits, 0)
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

const getPackageIcon = (packageName: string) => {
  switch (packageName) {
    case '基础包':
      return 'B'
    case '标准包':
      return 'S'
    case '专业包':
      return 'P'
    case '企业包':
      return 'E'
    default:
      return 'U'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-400 bg-green-900/20'
    case 'failed':
      return 'text-red-400 bg-red-900/20'
    case 'refunded':
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
      return '支付失败'
    case 'refunded':
      return '已退款'
    default:
      return '未知'
  }
}

const getPaymentMethodColor = (method: string) => {
  switch (method) {
    case '微信支付':
      return 'text-green-400'
    case '支付宝':
      return 'text-blue-400'
    case '银行卡':
      return 'text-purple-400'
    default:
      return 'text-gray-400'
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedPackage.value = 'all'
  selectedStatus.value = 'all'
  selectedPaymentMethod.value = 'all'
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
            <span>积分管理</span>
          </button>
          <ChevronRight class="h-4 w-4 text-gray-600" />
          <span class="text-primary-400 font-medium">购买记录</span>
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
              <Calendar class="h-8 w-8 text-primary-500" />
              <h1 class="text-2xl font-bold text-white">购买记录</h1>
            </div>
          </div>
          <p class="text-sm text-gray-400">查看您的所有积分包购买历史记录</p>
        </div>

        <!-- Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 class="text-sm font-medium text-gray-400 mb-2">累计消费</h3>
            <div class="text-2xl font-bold text-green-400">¥{{ totalSpent }}</div>
          </div>
          <div class="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 class="text-sm font-medium text-gray-400 mb-2">累计购买积分</h3>
            <div class="text-2xl font-bold text-primary-400">{{ totalCredits }}</div>
          </div>
          <div class="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 class="text-sm font-medium text-gray-400 mb-2">购买次数</h3>
            <div class="text-2xl font-bold text-blue-400">{{ filteredHistory.filter(item => item.status === 'completed').length }}</div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">搜索</label>
              <div class="relative">
                <Search class="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索套餐、订单号..."
                  class="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <!-- Package Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">套餐类型</label>
              <select
                v-model="selectedPackage"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
              >
                <option value="all">全部套餐</option>
                <option v-for="pkg in packages.slice(1)" :key="pkg" :value="pkg">
                  {{ pkg }}
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
                <option value="failed">支付失败</option>
                <option value="refunded">已退款</option>
              </select>
            </div>

            <!-- Payment Method Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">支付方式</label>
              <select
                v-model="selectedPaymentMethod"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
              >
                <option value="all">全部方式</option>
                <option v-for="method in paymentMethods.slice(1)" :key="method" :value="method">
                  {{ method }}
                </option>
              </select>
            </div>
          </div>

          <!-- Date Range and Clear Button -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
            <div class="flex items-end">
              <button
                @click="clearFilters"
                class="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
              >
                清除筛选
              </button>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">套餐</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">时间</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">积分</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">金额</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">支付方式</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">状态</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">订单号</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-800">
                <tr v-for="item in paginatedHistory" :key="item.id" class="hover:bg-gray-800/50">
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center text-sm font-semibold text-primary-400">
                        {{ getPackageIcon(item.packageName) }}
                      </div>
                      <span class="text-sm font-medium text-white">{{ item.packageName }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-300">
                    {{ formatDate(item.timestamp) }}
                  </td>
                  <td class="px-6 py-4 text-sm font-semibold text-primary-400">
                    +{{ item.credits }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-semibold text-white">¥{{ item.amount }}</div>
                    <div v-if="item.originalAmount > item.amount" class="text-xs text-gray-400 line-through">
                      ¥{{ item.originalAmount }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="['text-sm font-medium', getPaymentMethodColor(item.paymentMethod)]">
                      {{ item.paymentMethod }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="['text-xs px-2 py-1 rounded-full font-medium', getStatusColor(item.status)]">
                      {{ getStatusText(item.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm font-mono text-gray-400">
                    {{ item.orderNumber }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="filteredHistory.length === 0" class="text-center py-12">
            <CreditCard class="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-300 mb-2">暂无记录</h3>
            <p class="text-sm text-gray-500">未找到符合条件的购买记录</p>
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