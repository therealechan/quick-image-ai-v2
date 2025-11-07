<script setup lang="ts">
import { ref, computed } from 'vue'

interface GalleryItem {
  image: string
  text: string
}

const props = withDefaults(defineProps<{
  items?: GalleryItem[]
  bend?: number
  borderRadius?: number
}>(), {
  bend: 2,
  borderRadius: 0.1
})

const defaultItems: GalleryItem[] = [
  {
    image: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
    text: "AI试穿 - T恤效果"
  },
  {
    image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
    text: "AI试穿 - 女装展示"
  },
  {
    image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
    text: "AI试穿 - 正装效果"
  },
  {
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
    text: "AI试穿 - 休闲装"
  },
  {
    image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
    text: "AI试穿 - 运动装"
  }
]

const galleryItems = computed(() => props.items || defaultItems)
const containerRef = ref<HTMLElement>()
const mouseX = ref(0)
const mouseY = ref(0)
const isHovering = ref(false)

const handleMouseMove = (event: MouseEvent) => {
  if (!containerRef.value) return
  
  const rect = containerRef.value.getBoundingClientRect()
  mouseX.value = ((event.clientX - rect.left) / rect.width - 0.5) * 2
  mouseY.value = ((event.clientY - rect.top) / rect.height - 0.5) * 2
}

const handleMouseEnter = () => {
  isHovering.value = true
}

const handleMouseLeave = () => {
  isHovering.value = false
  mouseX.value = 0
  mouseY.value = 0
}

const getItemTransform = () => {
  if (!isHovering.value) return 'rotateX(0deg) rotateY(0deg)'
  
  const bendAmount = props.bend
  const rotateX = -mouseY.value * bendAmount * 2
  const rotateY = mouseX.value * bendAmount * 2
  const translateX = mouseX.value * 2
  const translateY = mouseY.value * 2
  
  return `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(${translateX}px) translateY(${translateY}px)`
}
</script>

<template>
  <div 
    ref="containerRef"
    class="bending-gallery relative w-full h-96 perspective-1000"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div 
      class="gallery-grid h-full grid grid-cols-5 gap-4 p-8 transition-transform duration-300 ease-out"
      :style="{
        transform: getItemTransform(),
        transformStyle: 'preserve-3d'
      }"
    >
      <div
        v-for="(item, index) in galleryItems"
        :key="index"
        class="gallery-item relative overflow-hidden shadow-xl transition-all duration-300 group"
        :style="{
          borderRadius: `${props.borderRadius}rem`,
          transform: `translateZ(${isHovering ? 20 : 0}px)`
        }"
      >
        <!-- Image with overlay -->
        <div class="relative w-full h-full">
          <img 
            :src="item.image" 
            :alt="item.text"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <!-- AI Badge -->
          <div class="absolute top-2 right-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
            AI生成
          </div>
          <!-- Hover overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <!-- Text content -->
        <div 
          v-if="item.text"
          class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
        >
          <p class="text-white text-sm font-semibold drop-shadow-lg">{{ item.text }}</p>
          <div class="flex items-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            <div class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span class="text-green-300 text-xs">实时生成</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bending-gallery {
  perspective: 1000px;
}

.gallery-grid {
  transform-style: preserve-3d;
}

.gallery-item {
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

.perspective-1000 {
  perspective: 1000px;
}

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    padding: 1rem;
  }
  
  .bending-gallery {
    height: 320px;
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .bending-gallery {
    height: 280px;
  }
}
</style>