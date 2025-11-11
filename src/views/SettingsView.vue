<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import { authService } from '../services/auth'
import { User, Settings, Lock, Mail, Calendar, CheckCircle, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const isMobileMenuOpen = ref(false)

// Current user
const currentUser = computed(() => authService.getCurrentUser())

// Form states
const profileForm = reactive({
  name: '',
  email: '',
  isLoading: false,
  message: '',
  messageType: 'success' as 'success' | 'error'
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  isLoading: false,
  message: '',
  messageType: 'success' as 'success' | 'error'
})

// Form validation
const isProfileFormValid = computed(() => {
  return profileForm.name.trim().length > 0 && 
         profileForm.email.trim().length > 0 && 
         isValidEmail(profileForm.email)
})

const isPasswordFormValid = computed(() => {
  return passwordForm.currentPassword.length > 0 &&
         passwordForm.newPassword.length >= 6 &&
         passwordForm.newPassword === passwordForm.confirmPassword
})

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

// Initialize forms
const initializeForms = () => {
  if (currentUser.value) {
    profileForm.name = currentUser.value.name
    profileForm.email = currentUser.value.email
  }
}

// Profile update
const updateProfile = async () => {
  if (!isProfileFormValid.value) {
    profileForm.message = '请填写有效的姓名和邮箱'
    profileForm.messageType = 'error'
    return
  }

  profileForm.isLoading = true
  profileForm.message = ''

  try {
    const result = await authService.updateProfile({
      name: profileForm.name,
      email: profileForm.email
    })

    if (result.success) {
      profileForm.message = '个人信息更新成功'
      profileForm.messageType = 'success'
      // Auto-hide success message
      setTimeout(() => {
        profileForm.message = ''
      }, 3000)
    } else {
      profileForm.message = result.error || '更新失败，请重试'
      profileForm.messageType = 'error'
    }
  } catch (error) {
    profileForm.message = '更新失败，请检查网络连接'
    profileForm.messageType = 'error'
  } finally {
    profileForm.isLoading = false
  }
}

// Password update
const updatePassword = async () => {
  if (!isPasswordFormValid.value) {
    passwordForm.message = '请检查密码输入'
    passwordForm.messageType = 'error'
    return
  }

  passwordForm.isLoading = true
  passwordForm.message = ''

  try {
    const result = await authService.updatePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })

    if (result.success) {
      passwordForm.message = '密码修改成功'
      passwordForm.messageType = 'success'
      // Clear password fields
      passwordForm.currentPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
      // Auto-hide success message
      setTimeout(() => {
        passwordForm.message = ''
      }, 3000)
    } else {
      passwordForm.message = result.error || '密码修改失败，请重试'
      passwordForm.messageType = 'error'
    }
  } catch (error) {
    passwordForm.message = '修改失败，请检查网络连接'
    passwordForm.messageType = 'error'
  } finally {
    passwordForm.isLoading = false
  }
}

// Message component helpers
const clearProfileMessage = () => {
  profileForm.message = ''
}

const clearPasswordMessage = () => {
  passwordForm.message = ''
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
  initializeForms()
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
      <div class="max-w-6xl mx-auto p-6 lg:p-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center space-x-3 mb-4">
            <Settings class="h-8 w-8 text-primary-500" />
            <h1 class="text-2xl font-bold text-white">账户设置</h1>
          </div>
          <p class="text-sm text-gray-400">管理您的个人信息和账户设置</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
          <!-- Left Column - Forms -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Personal Information -->
            <div class="bg-gray-900 rounded-lg p-6 lg:p-8 border border-gray-800">
              <div class="flex items-center space-x-3 mb-6">
                <User class="h-6 w-6 text-primary-400" />
                <h2 class="text-lg font-semibold text-white">个人信息</h2>
              </div>

              <!-- Success/Error Message -->
              <div v-if="profileForm.message" :class="[
                'mb-6 p-4 rounded-lg flex items-center space-x-2',
                profileForm.messageType === 'success' ? 'bg-green-900/20 border border-green-500/20' : 'bg-red-900/20 border border-red-500/20'
              ]">
                <CheckCircle v-if="profileForm.messageType === 'success'" class="h-5 w-5 text-green-400" />
                <AlertCircle v-else class="h-5 w-5 text-red-400" />
                <span :class="[
                  'text-sm',
                  profileForm.messageType === 'success' ? 'text-green-400' : 'text-red-400'
                ]">
                  {{ profileForm.message }}
                </span>
                <button
                  @click="clearProfileMessage"
                  class="ml-auto text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <form @submit.prevent="updateProfile" class="space-y-6">
                <!-- Name Field -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    姓名 <span class="text-red-400">*</span>
                  </label>
                  <input
                    v-model="profileForm.name"
                    type="text"
                    required
                    class="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="请输入您的姓名"
                  />
                </div>

                <!-- Email Field -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    邮箱地址 <span class="text-red-400">*</span>
                  </label>
                  <input
                    v-model="profileForm.email"
                    type="email"
                    required
                    class="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="请输入您的邮箱地址"
                  />
                  <p v-if="profileForm.email && !isValidEmail(profileForm.email)" class="mt-2 text-sm text-red-400">
                    请输入有效的邮箱地址
                  </p>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="!isProfileFormValid || profileForm.isLoading"
                  class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:from-gray-700 disabled:to-gray-700 text-white py-3 rounded-lg font-medium transition-all disabled:cursor-not-allowed"
                >
                  <span v-if="profileForm.isLoading">更新中...</span>
                  <span v-else>更新个人信息</span>
                </button>
              </form>
            </div>

            <!-- Password Change -->
            <div class="bg-gray-900 rounded-lg p-6 lg:p-8 border border-gray-800">
              <div class="flex items-center space-x-3 mb-6">
                <Lock class="h-6 w-6 text-primary-400" />
                <h2 class="text-lg font-semibold text-white">修改密码</h2>
              </div>

              <!-- Success/Error Message -->
              <div v-if="passwordForm.message" :class="[
                'mb-6 p-4 rounded-lg flex items-center space-x-2',
                passwordForm.messageType === 'success' ? 'bg-green-900/20 border border-green-500/20' : 'bg-red-900/20 border border-red-500/20'
              ]">
                <CheckCircle v-if="passwordForm.messageType === 'success'" class="h-5 w-5 text-green-400" />
                <AlertCircle v-else class="h-5 w-5 text-red-400" />
                <span :class="[
                  'text-sm',
                  passwordForm.messageType === 'success' ? 'text-green-400' : 'text-red-400'
                ]">
                  {{ passwordForm.message }}
                </span>
                <button
                  @click="clearPasswordMessage"
                  class="ml-auto text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <form @submit.prevent="updatePassword" class="space-y-6">
                <!-- Current Password -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    当前密码 <span class="text-red-400">*</span>
                  </label>
                  <input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    required
                    class="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="请输入当前密码"
                  />
                </div>

                <!-- New Password -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    新密码 <span class="text-red-400">*</span>
                  </label>
                  <input
                    v-model="passwordForm.newPassword"
                    type="password"
                    required
                    minlength="6"
                    class="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="请输入新密码 (至少6位)"
                  />
                  <p v-if="passwordForm.newPassword && passwordForm.newPassword.length < 6" class="mt-2 text-sm text-red-400">
                    密码长度至少为6位
                  </p>
                </div>

                <!-- Confirm Password -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    确认新密码 <span class="text-red-400">*</span>
                  </label>
                  <input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    required
                    class="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="请再次输入新密码"
                  />
                  <p v-if="passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword" class="mt-2 text-sm text-red-400">
                    两次输入的密码不一致
                  </p>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="!isPasswordFormValid || passwordForm.isLoading"
                  class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:from-gray-700 disabled:to-gray-700 text-white py-3 rounded-lg font-medium transition-all disabled:cursor-not-allowed"
                >
                  <span v-if="passwordForm.isLoading">修改中...</span>
                  <span v-else>修改密码</span>
                </button>
              </form>
            </div>
          </div>

          <!-- Right Column - Account Info -->
          <div class="space-y-6">
            <!-- Account Information -->
            <div class="bg-gray-900 rounded-lg p-6 lg:p-8 border border-gray-800">
              <h3 class="text-base font-semibold text-white mb-6">账户信息</h3>
              
              <div class="space-y-4">
                <!-- User ID -->
                <div class="flex items-center justify-between py-2 border-b border-gray-800">
                  <span class="text-sm text-gray-400">用户ID</span>
                  <span class="text-sm text-white font-mono">{{ currentUser?.id }}</span>
                </div>
                
                <!-- Email -->
                <div class="flex items-center justify-between py-2 border-b border-gray-800">
                  <span class="text-sm text-gray-400 flex items-center">
                    <Mail class="h-4 w-4 mr-2" />
                    邮箱
                  </span>
                  <span class="text-sm text-white">{{ currentUser?.email }}</span>
                </div>
                
                <!-- Registration Date -->
                <div class="flex items-center justify-between py-2">
                  <span class="text-sm text-gray-400 flex items-center">
                    <Calendar class="h-4 w-4 mr-2" />
                    注册时间
                  </span>
                  <span class="text-sm text-white">{{ currentUser ? formatDate(currentUser.createdAt) : '' }}</span>
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
}
</style>