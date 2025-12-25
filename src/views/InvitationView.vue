<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth'
import { invitationService } from '../services/invitationService'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import { 
  Gift, 
  Copy, 
  Users, 
  Trophy, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  Menu,
  Coins,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'
import type { InvitationStats, InvitationRecord, PaginatedInvitations } from '../types/invitation'

const router = useRouter()
const isMobileMenuOpen = ref(false)

const user = computed(() => authService.getCurrentUser())
const stats = ref<InvitationStats | null>(null)
const invitations = ref<InvitationRecord[]>([])
const loading = ref(true)
const copying = ref(false)
const copyingCode = ref(false)
const invitationUrl = ref('')

// Pagination state
const currentPage = ref(1)
const pageSize = ref(5)
const totalInvitations = ref(0)
const totalPages = computed(() => Math.ceil(totalInvitations.value / pageSize.value))

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const loadInvitationData = async (page: number = currentPage.value) => {
  if (!user.value) return

  try {
    loading.value = true
    
    // Load invitation stats
    const statsResponse = await invitationService.getInvitationStats(user.value.id)
    if (statsResponse.success && statsResponse.data) {
      stats.value = statsResponse.data as InvitationStats
      invitationUrl.value = invitationService.generateInvitationUrl(stats.value.invitationCode)
    }

    // Load invitation records with pagination
    const recordsResponse = await invitationService.getUserInvitationsPaginated(user.value.id, {
      page,
      limit: pageSize.value
    })
    if (recordsResponse.success && recordsResponse.data) {
      const paginatedData = recordsResponse.data as PaginatedInvitations
      invitations.value = paginatedData.invitations
      totalInvitations.value = paginatedData.total
      currentPage.value = paginatedData.page
    }
  } catch (error) {
    console.error('加载邀请数据失败:', error)
  } finally {
    loading.value = false
  }
}

const copyInvitationLink = async () => {
  try {
    copying.value = true
    await navigator.clipboard.writeText(invitationUrl.value)
    // 简单的成功反馈，可以考虑使用 toast 通知
    const originalText = copying.value
    copying.value = false
    setTimeout(() => {
      copying.value = originalText
    }, 100)
  } catch (error) {
    console.error('复制失败:', error)
    copying.value = false
  }
}

const copyInvitationCode = async () => {
  try {
    copyingCode.value = true
    if (stats.value?.invitationCode) {
      await navigator.clipboard.writeText(stats.value.invitationCode)
      setTimeout(() => {
        copyingCode.value = false
      }, 1500)
    }
  } catch (error) {
    console.error('复制邀请码失败:', error)
    copyingCode.value = false
  }
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// 邮箱/手机号遮蔽函数
const maskContactInfo = (invitation: InvitationRecord) => {
  // 优先显示邮箱，其次显示手机号
  if (invitation.inviteeEmail) {
    const [username, domain] = invitation.inviteeEmail.split('@')
    if (!username || !domain) {
      return invitation.inviteeEmail // 如果邮箱格式不正确，返回原始邮箱
    }
    if (username.length <= 2) {
      return `${username[0]}***@${domain}`
    }
    return `${username.slice(0, 2)}***@${domain}`
  } else if (invitation.inviteePhone) {
    // 手机号脱敏：+86 138****1234
    const phone = invitation.inviteePhone
    if (phone.startsWith('+86') && phone.length === 14) {
      return `${phone.substring(0, 6)}****${phone.substring(10)}`
    }
    return phone
  }
  return '未知用户'
}

// Pagination functions
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    loadInvitationData(page)
  }
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

onMounted(() => {
  if (!authService.isAuthenticated()) {
    router.push('/login')
    return
  }
  loadInvitationData()
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
      <div class="lg:hidden bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
        <button
          @click="toggleMobileMenu"
          class="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Menu class="w-6 h-6" />
        </button>
        <h1 class="text-xl font-semibold text-white">赚分</h1>
        <div class="w-10"></div>
      </div>

      <div class="flex-1 overflow-y-auto p-6 lg:p-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center space-x-3 mb-2">
            <div class="p-2 bg-orange-500/20 rounded-lg">
              <Gift class="h-6 w-6 text-orange-400" />
            </div>
            <h1 class="text-3xl font-bold text-white">邀请好友赚积分</h1>
          </div>
          <p class="text-base text-gray-400">邀请朋友加入，每成功邀请一位用户获得 1000 积分奖励</p>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="text-gray-400">加载中...</div>
        </div>

        <div v-else class="space-y-6">
          <!-- Stats Overview -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle class="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p class="text-gray-400 text-sm">成功邀请</p>
                  <p class="text-3xl font-bold text-white">{{ stats?.successfulInvitations || 0 }}</p>
                  <p class="text-sm text-gray-500">通过邀请码注册的用户</p>
                </div>
              </div>
            </div>

            <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-yellow-500/20 rounded-lg">
                  <Coins class="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <p class="text-gray-400 text-sm">获得积分</p>
                  <p class="text-3xl font-bold text-white">{{ stats?.totalCreditsEarned || 0 }}</p>
                  <p class="text-sm text-gray-500">总奖励积分</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Invitation Link Section -->
          <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div class="flex items-center space-x-2 mb-4">
              <ExternalLink class="h-5 w-5 text-primary-400" />
              <h2 class="text-xl font-semibold text-white">我的邀请链接</h2>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-center space-x-3 p-4 bg-gray-900 rounded-lg">
                <div class="flex-1 min-w-0">
                  <p class="text-gray-400 text-sm mb-1">邀请码</p>
                  <p class="text-white font-mono text-xl">{{ stats?.invitationCode }}</p>
                </div>
                <button
                  @click="copyInvitationCode"
                  :disabled="copyingCode"
                  class="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  <Copy class="h-4 w-4" />
                  <span class="font-medium">{{ copyingCode ? '已复制!' : '复制邀请码' }}</span>
                </button>
              </div>

              <div class="flex items-center space-x-3 p-4 bg-gray-900 rounded-lg">
                <div class="flex-1 min-w-0">
                  <p class="text-gray-400 text-sm mb-1">邀请链接</p>
                  <p class="text-white truncate font-mono">{{ invitationUrl }}</p>
                </div>
                <button
                  @click="copyInvitationLink"
                  :disabled="copying"
                  class="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  <Copy class="h-4 w-4" />
                  <span class="font-medium">{{ copying ? '已复制!' : '复制链接' }}</span>
                </button>
              </div>
            </div>

            <!-- Instructions -->
            <div class="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h3 class="text-blue-400 font-medium mb-2 text-lg">如何邀请好友？</h3>
              <ul class="text-gray-300 space-y-1">
                <li>• 复制上方的邀请链接，发送给你的朋友</li>
                <li>• 朋友通过你的链接注册账户</li>
                <li>• 注册成功后，你将获得 1000 积分奖励</li>
                <li>• 积分可用于生成更多AI图片</li>
              </ul>
            </div>
          </div>

          <!-- Invitation Records -->
          <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div class="flex items-center space-x-2 mb-6">
              <Trophy class="h-5 w-5 text-yellow-400" />
              <h2 class="text-xl font-semibold text-white">邀请记录</h2>
            </div>

            <div v-if="(stats?.successfulInvitations || 0) === 0" class="text-center py-12">
              <Users class="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p class="text-gray-400 text-lg">还没有邀请记录</p>
              <p class="text-gray-500">分享你的邀请链接，开始赚取积分吧！</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="invitation in invitations"
                :key="invitation.id"
                class="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg"
              >
                <div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users class="w-5 h-5 text-white" />
                </div>
                
                <div class="flex-1 min-w-0">
                  <p class="text-white font-medium truncate text-base">{{ maskContactInfo(invitation) }}</p>
                  <p class="text-gray-500 text-sm">{{ formatDate(invitation.createdAt) }}</p>
                </div>

                <div class="flex items-center space-x-4 flex-shrink-0">
                  <div class="text-right">
                    <p class="text-yellow-400 font-medium text-base">+{{ invitation.rewardCredits }} 积分</p>
                    <div class="flex items-center space-x-1">
                      <CheckCircle 
                        v-if="invitation.status === 'completed'"
                        class="h-3 w-3 text-green-400"
                      />
                      <Clock 
                        v-else
                        class="h-3 w-3 text-yellow-400"
                      />
                      <span 
                        :class="[
                          'text-sm',
                          invitation.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                        ]"
                      >
                        {{ invitation.status === 'completed' ? '已完成' : '等待注册' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <div v-if="totalPages > 1" class="flex items-center justify-between mt-6 px-4">
                <div class="text-sm text-gray-400">
                  显示 {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalInvitations) }} 
                  / 共 {{ totalInvitations }} 条记录
                </div>
                
                <div class="flex items-center space-x-2">
                  <button
                    @click="goToPreviousPage"
                    :disabled="currentPage === 1"
                    class="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft class="w-4 h-4 mr-1" />
                    上一页
                  </button>

                  <div class="flex space-x-1">
                    <button
                      v-for="page in Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => 
                        p === 1 || 
                        p === totalPages || 
                        (p >= currentPage - 2 && p <= currentPage + 2)
                      )"
                      :key="page"
                      @click="goToPage(page)"
                      :class="[
                        'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                        page === currentPage
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-300 bg-gray-800 border border-gray-700 hover:bg-gray-700'
                      ]"
                    >
                      {{ page }}
                    </button>
                  </div>

                  <button
                    @click="goToNextPage"
                    :disabled="currentPage === totalPages"
                    class="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    下一页
                    <ChevronRight class="w-4 h-4 ml-1" />
                  </button>
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
:root {
  --primary-400: #8b5cf6;
  --primary-500: #7c3aed;
  --primary-600: #6d28d9;
  --primary-700: #5b21b6;
}
</style>