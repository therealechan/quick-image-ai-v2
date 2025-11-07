<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Sparkles, Menu, LogOut, User as UserIcon } from 'lucide-vue-next'
import { authService } from '../services/auth'

const router = useRouter()
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)

const currentUser = computed(() => authService.getCurrentUser())
const isAuthenticated = computed(() => authService.isAuthenticated())

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
  closeMobileMenu()
}

const goToLogin = () => {
  router.push('/login')
  closeMobileMenu()
}

const goToSignUp = () => {
  router.push('/signup')
  closeMobileMenu()
}

const handleLogout = () => {
  authService.logout()
  router.push('/')
  closeMobileMenu()
}

const goToHome = () => {
  router.push('/')
  closeMobileMenu()
}

const goToDashboard = () => {
  router.push('/dashboard')
  closeMobileMenu()
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav :class="[
    'fixed top-0 w-full z-50 transition-all duration-300 ease-in-out',
    isScrolled 
      ? 'bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 shadow-lg shadow-gray-900/20' 
      : 'bg-gray-900/30 backdrop-blur-sm border-b border-transparent'
  ]">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center space-x-2 cursor-pointer" @click="goToHome">
          <Sparkles class="w-8 h-8 text-primary-500 transition-transform hover:scale-110" />
          <span class="text-xl font-bold gradient-text hover:opacity-80 transition-opacity">Quickimage.ai</span>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <template v-if="isAuthenticated">
            <a @click="goToDashboard" class="text-gray-300 hover:text-white transition-colors cursor-pointer">
              Dashboard
            </a>
          </template>
          <template v-else>
            <a @click="scrollToSection('features')" class="text-gray-300 hover:text-white transition-colors cursor-pointer">
              功能特色
            </a>
            <a @click="scrollToSection('how-it-works')" class="text-gray-300 hover:text-white transition-colors cursor-pointer">
              使用方法
            </a>
            <a @click="scrollToSection('pricing')" class="text-gray-300 hover:text-white transition-colors cursor-pointer">
              价格方案
            </a>
          </template>
          
          <!-- Authentication Buttons -->
          <div v-if="!isAuthenticated" class="flex items-center space-x-4">
            <button @click="goToLogin" class="text-gray-300 hover:text-white transition-colors">
              登录
            </button>
            <button @click="goToSignUp" class="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-primary-500/25 text-white">
              注册
            </button>
          </div>
          
          <!-- User Menu -->
          <div v-else class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 text-gray-300">
              <UserIcon class="w-5 h-5" />
              <span>{{ currentUser?.name }}</span>
            </div>
            <button @click="handleLogout" class="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
              <LogOut class="w-4 h-4" />
              <span>退出</span>
            </button>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="toggleMobileMenu" class="md:hidden p-2 text-gray-400 hover:text-white">
          <Menu class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-show="isMobileMenuOpen" class="md:hidden py-4 space-y-2 border-t border-gray-800">
        <template v-if="isAuthenticated">
          <a 
            @click="goToDashboard"
            class="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded cursor-pointer"
          >
            Dashboard
          </a>
        </template>
        <template v-else>
          <a 
            @click="scrollToSection('features')"
            class="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded cursor-pointer"
          >
            功能特色
          </a>
          <a 
            @click="scrollToSection('how-it-works')"
            class="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded cursor-pointer"
          >
            使用方法
          </a>
          <a 
            @click="scrollToSection('pricing')"
            class="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded cursor-pointer"
          >
            价格方案
          </a>
        </template>
        
        <!-- Mobile Authentication -->
        <div v-if="!isAuthenticated" class="space-y-2 pt-2 border-t border-gray-700">
          <button @click="goToLogin" class="block w-full px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded text-left">
            登录
          </button>
          <button @click="goToSignUp" class="w-full px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-primary-500/25 text-white">
            注册
          </button>
        </div>
        
        <!-- Mobile User Menu -->
        <div v-else class="space-y-2 pt-2 border-t border-gray-700">
          <div class="flex items-center space-x-2 px-4 py-2 text-gray-300">
            <UserIcon class="w-5 h-5" />
            <span>{{ currentUser?.name }}</span>
          </div>
          <button @click="handleLogout" class="flex items-center space-x-2 w-full px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded">
            <LogOut class="w-4 h-4" />
            <span>退出</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
nav {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
}

.backdrop-blur-xl {
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
}

.backdrop-blur-sm {
  backdrop-filter: blur(8px) saturate(120%);
  -webkit-backdrop-filter: blur(8px) saturate(120%);
}
</style>