<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Eye, EyeOff, Loader2, Smartphone } from 'lucide-vue-next'
import { authService, type LoginCredentials, type PhoneLoginCredentials } from '../services/auth'
import VerificationCodeInput from '../components/VerificationCodeInput.vue'

const router = useRouter()

// 登录方式切换
const loginMethod = ref<'email' | 'phone'>('email')

// 邮箱登录
const email = ref('demo@quickimage.ai')
const password = ref('password123')
const showPassword = ref(false)

// 手机登录
const phone = ref('')
const verificationCode = ref('')

const isLoading = ref(false)
const error = ref('')

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  if (isLoading.value) return

  error.value = ''

  // 邮箱登录
  if (loginMethod.value === 'email') {
    if (!email.value || !password.value) {
      error.value = '请输入邮箱和密码'
      return
    }

    isLoading.value = true

    try {
      const credentials: LoginCredentials = {
        email: email.value,
        password: password.value
      }

      const result = await authService.login(credentials)

      if (result.success) {
        router.push('/model-generation')
      } else {
        error.value = result.error || '登录失败'
      }
    } catch {
      error.value = '登录时发生错误，请稍后重试'
    } finally {
      isLoading.value = false
    }
  }
  // 手机登录
  else {
    if (!phone.value || !verificationCode.value) {
      error.value = '请输入手机号和验证码'
      return
    }

    isLoading.value = true

    try {
      const credentials: PhoneLoginCredentials = {
        phone: phone.value,
        verificationCode: verificationCode.value
      }

      const result = await authService.loginWithPhone(credentials)

      if (result.success) {
        router.push('/model-generation')
      } else {
        error.value = result.error || '登录失败'
      }
    } catch {
      error.value = '登录时发生错误，请稍后重试'
    } finally {
      isLoading.value = false
    }
  }
}

const goToSignUp = () => {
  router.push('/signup')
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      <div class="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold gradient-text mb-2">登录</h1>
          <p class="text-gray-400">欢迎回到 Quickimage.ai</p>
        </div>

        <!-- Tab 切换 -->
        <div class="flex border-b border-gray-700 mb-6">
          <button
            @click="loginMethod = 'email'"
            type="button"
            :class="[
              'flex-1 py-3 text-sm font-medium transition-colors relative',
              loginMethod === 'email'
                ? 'text-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            ]"
          >
            <Mail class="inline h-4 w-4 mr-2" />
            邮箱登录
            <div v-if="loginMethod === 'email'"
                 class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600" />
          </button>
          <button
            @click="loginMethod = 'phone'"
            type="button"
            :class="[
              'flex-1 py-3 text-sm font-medium transition-colors relative',
              loginMethod === 'phone'
                ? 'text-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            ]"
          >
            <Smartphone class="inline h-4 w-4 mr-2" />
            手机登录
            <div v-if="loginMethod === 'phone'"
                 class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600" />
          </button>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- 邮箱登录表单 -->
          <div v-show="loginMethod === 'email'" class="space-y-6">
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
                  class="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-400 transition-colors text-sm"
                  placeholder="输入您的邮箱"
                />
              </div>
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
                  autocomplete="current-password"
                  required
                  class="w-full pl-10 pr-12 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-400 transition-colors text-sm"
                  placeholder="输入您的密码"
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
            </div>
          </div>

          <!-- 手机登录表单 -->
          <div v-show="loginMethod === 'phone'" class="space-y-6">
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-300 mb-2">
                手机号码
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Smartphone class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  v-model="phone"
                  type="tel"
                  inputmode="tel"
                  placeholder="请输入手机号"
                  class="w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-400 transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                验证码
              </label>
              <VerificationCodeInput
                v-model="verificationCode"
                :phone="phone"
              />
            </div>
          </div>

          <div v-if="error" class="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all hover:scale-105 shadow-lg shadow-primary-500/25 disabled:hover:scale-100 disabled:shadow-none flex items-center justify-center space-x-2"
          >
            <Loader2 v-if="isLoading" class="h-5 w-5 animate-spin" />
            <span>{{ isLoading ? '登录中...' : '登录' }}</span>
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-gray-400">
            还没有账户？
            <button
              @click="goToSignUp"
              class="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              立即注册
            </button>
          </p>
        </div>

        <div class="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <p class="text-sm text-gray-300 font-medium mb-2">演示账户：</p>
          <div class="text-xs text-gray-400 space-y-1">
            <div>邮箱: demo@quickimage.ai / 密码: password123</div>
            <div>手机: 13800138000 / 验证码: 123456</div>
          </div>
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