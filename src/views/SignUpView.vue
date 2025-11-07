<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, User, Eye, EyeOff, Loader2, Check, X } from 'lucide-vue-next'
import { authService, type SignUpCredentials } from '../services/auth'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return email.value === '' || emailRegex.test(email.value)
})

const isValidPassword = computed(() => {
  return password.value === '' || password.value.length >= 6
})

const passwordsMatch = computed(() => {
  return confirmPassword.value === '' || password.value === confirmPassword.value
})

const canSubmit = computed(() => {
  return name.value && 
         email.value && 
         password.value && 
         confirmPassword.value &&
         isValidEmail.value && 
         isValidPassword.value && 
         passwordsMatch.value
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const handleSignUp = async () => {
  if (isLoading.value || !canSubmit.value) return

  error.value = ''

  if (!passwordsMatch.value) {
    error.value = '两次输入的密码不一致'
    return
  }

  isLoading.value = true

  try {
    const credentials: SignUpCredentials = {
      name: name.value,
      email: email.value,
      password: password.value
    }

    const result = await authService.signUp(credentials)

    if (result.success) {
      router.push('/dashboard')
    } else {
      error.value = result.error || '注册失败'
    }
  } catch {
    error.value = '注册时发生错误，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      <div class="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold gradient-text mb-2">注册</h1>
          <p class="text-gray-400">加入 Quickimage.ai，开始创作之旅</p>
        </div>

        <form @submit.prevent="handleSignUp" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
              姓名
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                v-model="name"
                type="text"
                autocomplete="name"
                required
                class="w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-400 transition-colors"
                placeholder="输入您的姓名"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              邮箱地址
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                :class="[
                  'w-full pl-10 pr-10 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-400 transition-colors',
                  email && !isValidEmail ? 'border-red-500' : 'border-gray-700'
                ]"
                placeholder="输入您的邮箱"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Check v-if="email && isValidEmail" class="h-5 w-5 text-green-400" />
                <X v-else-if="email && !isValidEmail" class="h-5 w-5 text-red-400" />
              </div>
            </div>
            <p v-if="email && !isValidEmail" class="mt-1 text-sm text-red-400">
              请输入有效的邮箱地址
            </p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              密码
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                :class="[
                  'w-full pl-10 pr-12 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-400 transition-colors',
                  password && !isValidPassword ? 'border-red-500' : 'border-gray-700'
                ]"
                placeholder="创建密码（至少6位）"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
              >
                <Eye v-if="!showPassword" class="h-5 w-5" />
                <EyeOff v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="password && !isValidPassword" class="mt-1 text-sm text-red-400">
              密码至少需要6位字符
            </p>
            <p v-else-if="password && isValidPassword" class="mt-1 text-sm text-green-400">
              密码强度良好
            </p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
              确认密码
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                :class="[
                  'w-full pl-10 pr-12 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-400 transition-colors',
                  confirmPassword && !passwordsMatch ? 'border-red-500' : 'border-gray-700'
                ]"
                placeholder="再次输入密码"
              />
              <button
                type="button"
                @click="toggleConfirmPasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
              >
                <Eye v-if="!showConfirmPassword" class="h-5 w-5" />
                <EyeOff v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="confirmPassword && !passwordsMatch" class="mt-1 text-sm text-red-400">
              两次输入的密码不一致
            </p>
            <p v-else-if="confirmPassword && passwordsMatch" class="mt-1 text-sm text-green-400">
              密码确认正确
            </p>
          </div>

          <div v-if="error" class="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="isLoading || !canSubmit"
            class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all hover:scale-105 shadow-lg shadow-primary-500/25 disabled:hover:scale-100 disabled:shadow-none flex items-center justify-center space-x-2"
          >
            <Loader2 v-if="isLoading" class="h-5 w-5 animate-spin" />
            <span>{{ isLoading ? '注册中...' : '注册账户' }}</span>
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-gray-400">
            已有账户？
            <button
              @click="goToLogin"
              class="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              立即登录
            </button>
          </p>
        </div>
      </div>
    </div>
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
</style>