<script setup lang="ts">
import { ref, computed } from 'vue'
import { cn } from '@/lib/utils'

interface GalleryItem {
  id: number
  title: string
  description: string
  image: string
  category: string
}

const props = defineProps<{
  items: GalleryItem[]
}>()

const expandedId = ref<number | null>(null)

const toggleExpanded = (id: number) => {
  expandedId.value = expandedId.value === id ? null : id
}

const gridItems = computed(() => {
  return props.items.map((item, index) => ({
    ...item,
    isExpanded: expandedId.value === item.id,
    gridColumn: getGridColumn(index, expandedId.value === item.id),
    gridRow: getGridRow(index, expandedId.value === item.id)
  }))
})

const getGridColumn = (index: number, isExpanded: boolean) => {
  if (isExpanded) return 'span 2'
  return 'span 1'
}

const getGridRow = (index: number, isExpanded: boolean) => {
  if (isExpanded) return 'span 2'
  return 'span 1'
}
</script>

<template>
  <div class="w-full max-w-6xl mx-auto p-4">
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
      <div
        v-for="item in gridItems"
        :key="item.id"
        :class="cn(
          'relative overflow-hidden rounded-xl cursor-pointer transition-all duration-500 ease-in-out group',
          'border border-gray-700 bg-gray-800/50 backdrop-blur-sm',
          'hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10',
          item.isExpanded ? 'md:col-span-2 md:row-span-2' : 'aspect-square'
        )"
        @click="toggleExpanded(item.id)"
      >
        <!-- Background Image -->
        <div class="absolute inset-0">
          <div v-if="item.image" class="w-full h-full relative">
            <img 
              :src="item.image" 
              :alt="item.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <!-- AI Badge -->
            <div class="absolute top-3 left-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg z-20">
              AI生成
            </div>
            <!-- Quality indicator -->
            <div class="absolute top-3 right-3 flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full z-20">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-white text-xs">高清</span>
            </div>
          </div>
          <!-- Placeholder pattern when no image -->
          <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900/20 to-secondary-900/20">
            <div class="grid grid-cols-3 gap-1 opacity-20">
              <div v-for="i in 9" :key="i" class="w-3 h-3 bg-primary-400 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300"></div>

        <!-- Content -->
        <div class="absolute inset-0 p-4 flex flex-col justify-end text-white z-10">
          <div class="transform transition-all duration-300 group-hover:translate-y-0">
            <!-- Category Badge -->
            <span class="inline-block px-2 py-1 text-xs bg-primary-500 rounded-full mb-2 font-medium">
              {{ item.category }}
            </span>
            
            <!-- Title -->
            <h3 class="text-lg font-bold mb-1 line-clamp-2">
              {{ item.title }}
            </h3>
            
            <!-- Description (shown when expanded or on hover) -->
            <p 
              :class="cn(
                'text-sm text-gray-300 transition-all duration-300',
                item.isExpanded 
                  ? 'opacity-100 max-h-32' 
                  : 'opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-20'
              )"
            >
              {{ item.description }}
            </p>
            
            <!-- Additional info when expanded -->
            <div 
              v-if="item.isExpanded"
              class="mt-3 pt-3 border-t border-white/20 transition-all duration-500 delay-200"
            >
              <div class="flex items-center justify-between text-xs text-gray-400">
                <div class="flex items-center space-x-3">
                  <span class="flex items-center">
                    <div class="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                    AI处理
                  </span>
                  <span class="flex items-center">
                    <div class="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1"></div>
                    高质量
                  </span>
                </div>
                <span class="text-primary-300">查看更多</span>
              </div>
            </div>
          </div>
          
          <!-- Expand/Collapse indicator -->
          <div class="absolute top-4 right-4">
            <div 
              :class="cn(
                'w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform duration-300',
                item.isExpanded ? 'rotate-45' : 'rotate-0'
              )"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 1V11M1 6H11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>