<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '../services/auth'
import { 
  Home, 
  Plus, 
  Folder, 
  Image, 
  BarChart3, 
  Settings, 
  CreditCard, 
  LogOut, 
  User,
  Sparkles,
  X,
  Menu
} from 'lucide-vue-next'

interface SidebarProps {
  isMobileMenuOpen?: boolean
}

interface SidebarEmits {
  (e: 'toggle-mobile-menu'): void
  (e: 'close-mobile-menu'): void
}

const props = withDefaults(defineProps<SidebarProps>(), {
  isMobileMenuOpen: false
})

const emit = defineEmits<SidebarEmits>()

const router = useRouter()
const route = useRoute()

const user = computed(() => authService.getCurrentUser())

const navigationItems = ref([
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: Home,
    active: false
  },
  {
    name: '我的项目',
    path: '/dashboard/projects',
    icon: Folder,
    active: false
  },
  {
    name: '图片库',
    path: '/dashboard/gallery',
    icon: Image,
    active: false
  },
  {
    name: '使用统计',
    path: '/dashboard/analytics',
    icon: BarChart3,
    active: false
  },
  {
    name: '设置',
    path: '/dashboard/settings',
    icon: Settings,
    active: false
  },
  {
    name: '订阅管理',
    path: '/dashboard/subscription',
    icon: CreditCard,
    active: false
  }
])

const isActiveRoute = (path: string) => {
  if (path === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path.startsWith(path)
}

const handleNavigation = (path: string) => {
  if (path === '/dashboard' || path === '/dashboard/projects') {
    router.push(path)
  } else if (path === '/dashboard/create') {
    // 新建项目直接跳转到项目列表页，那里有创建功能
    router.push('/dashboard/projects')
  } else {
    // For now, show placeholder for non-implemented routes
    alert(`${navigationItems.value.find(item => item.path === path)?.name} 功能开发中...`)
  }
  emit('close-mobile-menu')
}

const handleLogout = () => {
  authService.logout()
  router.push('/login')
  emit('close-mobile-menu')
}

const goToHome = () => {
  router.push('/')
  emit('close-mobile-menu')
}
</script>

<template>
  <!-- Mobile Backdrop -->
  <div
    v-if="isMobileMenuOpen"
    @click="emit('close-mobile-menu')"
    class="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm lg:hidden"
  />

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed top-0 left-0 z-50 h-screen bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out',
      'lg:translate-x-0 lg:relative lg:z-auto',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      'w-64'
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-800">
        <div class="flex items-center space-x-2 cursor-pointer" @click="goToHome">
          <Sparkles class="w-8 h-8 text-primary-500" />
          <span class="text-lg font-bold gradient-text">Quickimage.ai</span>
        </div>
        
        <!-- Mobile close button -->
        <button
          @click="emit('close-mobile-menu')"
          class="p-2 text-gray-400 hover:text-white lg:hidden"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4">
        <div class="space-y-1">
          <button
            v-for="item in navigationItems"
            :key="item.path"
            @click="handleNavigation(item.path)"
            :class="[
              'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200',
              isActiveRoute(item.path)
                ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-300 border border-primary-500/30'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            ]"
          >
            <component 
              :is="item.icon" 
              :class="[
                'w-5 h-5',
                isActiveRoute(item.path) ? 'text-primary-400' : 'text-gray-400'
              ]"
            />
            <span class="font-medium">{{ item.name }}</span>
          </button>
        </div>
      </nav>

      <!-- User Profile & Logout -->
      <div class="p-4 border-t border-gray-800">
        <!-- User Info -->
        <div class="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg mb-3">
          <div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <User class="w-5 h-5 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white font-medium truncate">{{ user?.name }}</p>
            <p class="text-gray-400 text-sm truncate">{{ user?.email }}</p>
          </div>
        </div>

        <!-- Logout Button -->
        <button
          @click="handleLogout"
          class="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut class="w-5 h-5" />
          <span class="font-medium">退出登录</span>
        </button>
      </div>
    </div>
  </aside>
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