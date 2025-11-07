<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '../services/auth'
import { 
  User,
  Camera,
  Zap,
  Folder, 
  Image, 
  Settings, 
  CreditCard, 
  LogOut, 
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'

interface SidebarProps {
  isMobileMenuOpen?: boolean
}

interface SidebarEmits {
  (e: 'toggle-mobile-menu'): void
  (e: 'close-mobile-menu'): void
}

defineProps<SidebarProps>()

const emit = defineEmits<SidebarEmits>()

const router = useRouter()
const route = useRoute()

const user = computed(() => authService.getCurrentUser())
const isCollapsed = ref(true) // 默认折叠
const isHovered = ref(false)
const hoverTimeout = ref<number | null>(null)

// 计算实际显示状态：折叠状态下悬停时展开
const isExpanded = computed(() => {
  return !isCollapsed.value || isHovered.value
})

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  // 如果手动展开，清除悬停状态
  if (!isCollapsed.value) {
    isHovered.value = false
  }
}

const handleMouseEnter = () => {
  if (isCollapsed.value) {
    // 清除之前的延迟
    if (hoverTimeout.value) {
      clearTimeout(hoverTimeout.value)
      hoverTimeout.value = null
    }
    isHovered.value = true
  }
}

const handleMouseLeave = () => {
  if (isCollapsed.value) {
    // 延迟折叠，避免鼠标快速移动时闪烁
    hoverTimeout.value = setTimeout(() => {
      isHovered.value = false
      hoverTimeout.value = null
    }, 300)
  }
}

const navigationItems = ref([
  {
    name: '模特图',
    shortName: '模特',
    path: '/model-generation',
    icon: User,
    active: false
  },
  {
    name: '姿势图',
    shortName: '姿势',
    path: '/pose-generation',
    icon: Camera,
    active: false
  },
  {
    name: '高清图',
    shortName: '高清',
    path: '/upscale',
    icon: Zap,
    active: false
  },
  {
    name: '图片库',
    shortName: '图库',
    path: '/gallery',
    icon: Image,
    active: false
  },
  {
    name: '设置',
    shortName: '设置',
    path: '/settings',
    icon: Settings,
    active: false
  },
  {
    name: '订阅管理',
    shortName: '订阅',
    path: '/subscription',
    icon: CreditCard,
    active: false
  }
])

const isActiveRoute = (path: string) => {
  return route.path === path || route.path.startsWith(path)
}

const handleNavigation = (path: string) => {
  // AI功能直接跳转
  if (path === '/model-generation' || path === '/pose-generation' || path === '/upscale') {
    router.push(path)
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
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    :class="[
      'fixed top-0 left-0 z-50 h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300 ease-in-out',
      'lg:translate-x-0 lg:relative lg:z-auto',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      isExpanded ? 'w-64' : 'w-20'
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-800">
        <div v-if="isExpanded" class="flex items-center space-x-2 cursor-pointer" @click="goToHome">
          <Sparkles class="w-8 h-8 text-primary-500" />
          <span class="text-lg font-bold gradient-text">Quickimage.ai</span>
        </div>
        
        <div v-else class="flex items-center justify-center w-full cursor-pointer" @click="goToHome">
          <Sparkles class="w-8 h-8 text-primary-500" />
        </div>
        
        <!-- Collapse toggle button (desktop) -->
        <button
          @click="toggleCollapse"
          class="hidden lg:block p-2 text-gray-400 hover:text-white"
        >
          <ChevronLeft v-if="!isCollapsed" class="w-5 h-5" />
          <ChevronRight v-else class="w-5 h-5" />
        </button>
        
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
        <!-- AI功能区 -->
        <div class="mb-6">
          <div v-if="isExpanded" class="px-3 mb-3">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">AI功能</h3>
          </div>
          <div class="space-y-1">
            <button
              v-for="item in navigationItems.slice(0, 3)"
              :key="item.path"
              @click="handleNavigation(item.path)"
              :class="[
                'w-full rounded-lg text-left transition-all duration-200',
                !isExpanded ? 'flex flex-col items-center justify-center py-3 px-2' : 'flex items-center space-x-3 px-4 py-3',
                isActiveRoute(item.path)
                  ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-300 border border-primary-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              ]"
            >
              <component 
                :is="item.icon" 
                :class="[
                  'w-5 h-5',
                  isActiveRoute(item.path) ? 'text-primary-400' : 'text-gray-400',
                  !isExpanded ? 'mb-1' : ''
                ]"
              />
              <span 
                :class="[
                  'font-medium',
                  !isExpanded ? 'text-xs text-center' : ''
                ]"
              >
                {{ !isExpanded ? item.shortName : item.name }}
              </span>
            </button>
          </div>
        </div>

        <!-- 其他功能区 -->
        <div>
          <div v-if="isExpanded" class="px-3 mb-3">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">管理</h3>
          </div>
          <div class="space-y-1">
            <button
              v-for="item in navigationItems.slice(3)"
              :key="item.path"
              @click="handleNavigation(item.path)"
              :class="[
                'w-full rounded-lg text-left transition-all duration-200',
                !isExpanded ? 'flex flex-col items-center justify-center py-3 px-2' : 'flex items-center space-x-3 px-4 py-3',
                isActiveRoute(item.path)
                  ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-300 border border-primary-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              ]"
            >
              <component 
                :is="item.icon" 
                :class="[
                  'w-5 h-5',
                  isActiveRoute(item.path) ? 'text-primary-400' : 'text-gray-400',
                  !isExpanded ? 'mb-1' : ''
                ]"
              />
              <span 
                :class="[
                  'font-medium',
                  !isExpanded ? 'text-xs text-center' : ''
                ]"
              >
                {{ !isExpanded ? item.shortName : item.name }}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <!-- User Profile & Logout -->
      <div class="p-4 border-t border-gray-800">
        <!-- User Info -->
        <div v-if="isExpanded" class="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg mb-3">
          <div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <User class="w-5 h-5 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white font-medium truncate">{{ user?.name }}</p>
            <p class="text-gray-400 text-sm truncate">{{ user?.email }}</p>
          </div>
        </div>
        
        <!-- Collapsed User Info -->
        <div v-else class="flex justify-center mb-3">
          <div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <User class="w-5 h-5 text-white" />
          </div>
        </div>

        <!-- Logout Button -->
        <button
          @click="handleLogout"
          :class="[
            'w-full rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-800',
            !isExpanded ? 'flex flex-col items-center justify-center py-3 px-2' : 'flex items-center space-x-3 px-4 py-3'
          ]"
        >
          <LogOut :class="['w-5 h-5', !isExpanded ? 'mb-1' : '']" />
          <span :class="['font-medium', !isExpanded ? 'text-xs text-center' : '']"
          >
            {{ !isExpanded ? '退出' : '退出登录' }}
          </span>
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