<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import { Plus, Menu, Calendar, Image, MoreHorizontal, Folder, Eye } from 'lucide-vue-next'

const router = useRouter()
const isMobileMenuOpen = ref(false)
const showCreateModal = ref(false)
const newProjectName = ref('')
const newProjectDescription = ref('')

const mockProjects = ref([
  {
    id: '1',
    name: '夏季服装系列',
    description: '2024夏季新品模特展示',
    createdAt: '2024-01-15',
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
    imageCount: 24,
    status: 'completed',
    type: 'model'
  },
  {
    id: '2',
    name: '运动装搭配',
    description: '健身运动服装展示项目',
    createdAt: '2024-01-12',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop',
    imageCount: 15,
    status: 'processing',
    type: 'model'
  },
  {
    id: '3',
    name: '商务正装',
    description: '职场商务装展示',
    createdAt: '2024-01-10',
    thumbnail: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=300&h=200&fit=crop',
    imageCount: 32,
    status: 'completed',
    type: 'model'
  }
])

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const openCreateModal = () => {
  showCreateModal.value = true
  newProjectName.value = ''
  newProjectDescription.value = ''
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const createProject = () => {
  if (!newProjectName.value.trim()) {
    alert('请输入项目名称')
    return
  }

  const newProject = {
    id: Date.now().toString(),
    name: newProjectName.value.trim(),
    description: newProjectDescription.value.trim(),
    createdAt: new Date().toISOString().split('T')[0] as string,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=200&fit=crop',
    imageCount: 0,
    status: 'draft',
    type: 'model'
  }

  mockProjects.value.unshift(newProject)
  closeCreateModal()
  
  // 跳转到项目详情页开始生成流程
  router.push(`/projects/${newProject.id}`)
}

const openProject = (projectId: string) => {
  router.push(`/projects/${projectId}`)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-500/20 text-green-400'
    case 'processing': return 'bg-yellow-500/20 text-yellow-400'
    case 'draft': return 'bg-gray-500/20 text-gray-400'
    default: return 'bg-gray-500/20 text-gray-400'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed': return '已完成'
    case 'processing': return '生成中'
    case 'draft': return '草稿'
    default: return '未知'
  }
}
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
      <div class="lg:hidden bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <h1 class="text-xl font-bold text-white">我的项目</h1>
        <button
          @click="toggleMobileMenu"
          class="p-2 text-gray-400 hover:text-white"
        >
          <Menu class="w-6 h-6" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 lg:p-8">
        <!-- Header -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div class="mb-4 lg:mb-0">
            <h1 class="text-2xl font-bold text-white mb-2">我的项目</h1>
            <p class="text-gray-400">管理您的AI模特图生成项目</p>
          </div>
          
          <button
            @click="openCreateModal"
            class="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white px-6 py-3 rounded-lg transition-all hover:scale-105 shadow-lg shadow-primary-500/25 flex items-center space-x-2"
          >
            <Plus class="h-5 w-5" />
            <span>新建项目</span>
          </button>
        </div>

        <!-- Projects Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
            v-for="project in mockProjects"
            :key="project.id"
            class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors cursor-pointer group"
            @click="openProject(project.id)"
          >
            <!-- Project Image -->
            <div class="aspect-video relative overflow-hidden">
              <img
                :src="project.thumbnail"
                :alt="project.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute top-4 right-4">
                <span
                  :class="['px-2 py-1 rounded-full text-xs', getStatusColor(project.status)]"
                >
                  {{ getStatusText(project.status) }}
                </span>
              </div>
            </div>

            <!-- Project Info -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-base font-semibold text-white group-hover:text-primary-300 transition-colors">
                  {{ project.name }}
                </h3>
                <button class="p-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal class="h-4 w-4" />
                </button>
              </div>
              
              <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ project.description }}</p>
              
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center space-x-4 text-gray-500">
                  <div class="flex items-center space-x-1">
                    <Image class="h-4 w-4" />
                    <span>{{ project.imageCount }}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <Calendar class="h-4 w-4" />
                    <span>{{ project.createdAt }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State / Create New Card -->
          <div
            @click="openCreateModal"
            class="bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary-500 hover:bg-gray-800/70 transition-all cursor-pointer group min-h-[280px]"
          >
            <div class="p-4 bg-primary-500/20 rounded-full mb-4 group-hover:bg-primary-500/30 transition-colors">
              <Plus class="h-8 w-8 text-primary-400" />
            </div>
            <h3 class="text-base font-medium text-white mb-2">创建新项目</h3>
            <p class="text-gray-400 text-sm">开始制作您的AI模特图</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Create Project Modal -->
    <div
      v-if="showCreateModal"
      @click="closeCreateModal"
      class="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        @click.stop
        class="bg-gray-800 rounded-xl border border-gray-700 p-8 w-full max-w-md"
      >
        <div class="flex items-center space-x-3 mb-6">
          <div class="p-2 bg-primary-500/20 rounded-lg">
            <Folder class="h-6 w-6 text-primary-400" />
          </div>
          <h2 class="text-xl font-bold text-white">创建新项目</h2>
        </div>

        <form @submit.prevent="createProject" class="space-y-6">
          <div>
            <label for="projectName" class="block text-sm font-medium text-gray-300 mb-2">
              项目名称 *
            </label>
            <input
              id="projectName"
              v-model="newProjectName"
              type="text"
              required
              class="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-400"
              placeholder="输入项目名称"
              maxlength="50"
            />
          </div>

          <div>
            <label for="projectDescription" class="block text-sm font-medium text-gray-300 mb-2">
              项目描述 (可选)
            </label>
            <textarea
              id="projectDescription"
              v-model="newProjectDescription"
              rows="3"
              class="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-400 resize-none"
              placeholder="简短描述您的项目..."
              maxlength="200"
            />
          </div>

          <div class="flex space-x-4">
            <button
              type="button"
              @click="closeCreateModal"
              class="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white rounded-lg transition-all"
            >
              创建项目
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --primary-400: #8b5cf6;
  --primary-500: #7c3aed;
  --primary-600: #6d28d9;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>