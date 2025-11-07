<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const containerRef = ref<HTMLElement>()
const scrollY = ref(0)

const handleScroll = () => {
  if (!containerRef.value) return
  
  const rect = containerRef.value.getBoundingClientRect()
  const containerTop = rect.top
  const containerHeight = rect.height
  const windowHeight = window.innerHeight
  
  // Calculate scroll progress when container is in viewport
  if (containerTop < windowHeight && containerTop > -containerHeight) {
    const progress = Math.max(0, Math.min(1, (windowHeight - containerTop) / (windowHeight + containerHeight)))
    scrollY.value = progress
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const containerStyle = computed(() => ({
  transform: `perspective(1000px) rotateX(${scrollY.value * 15}deg) translateY(${scrollY.value * -100}px)`,
  transition: 'transform 0.1s ease-out',
}))
</script>

<template>
  <div ref="containerRef" class="py-20 relative overflow-hidden">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Title Component -->
      <div class="text-center space-y-8 animate-fade-in">
        <slot name="header" />
      </div>

      <!-- Scrolling Container -->
      <div 
        class="mt-16 relative transform-gpu"
        :style="containerStyle"
      >
        <slot name="content" />
      </div>
    </div>
  </div>
</template>