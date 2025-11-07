<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  className?: string
  showRadialGradient?: boolean
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  showRadialGradient: true,
  size: 500
})

const canvasRef = ref<HTMLCanvasElement>()
let animationId: number
let context: CanvasRenderingContext2D | null = null

const animate = () => {
  if (!context || !canvasRef.value) return

  const canvas = canvasRef.value
  const width = canvas.width
  const height = canvas.height
  const time = Date.now() * 0.001

  context.clearRect(0, 0, width, height)

  const gradient1 = context.createRadialGradient(
    width * 0.3 + Math.sin(time * 0.5) * 100,
    height * 0.4 + Math.cos(time * 0.3) * 80,
    0,
    width * 0.3 + Math.sin(time * 0.5) * 100,
    height * 0.4 + Math.cos(time * 0.3) * 80,
    props.size
  )
  gradient1.addColorStop(0, 'rgba(139, 92, 246, 0.3)')
  gradient1.addColorStop(0.5, 'rgba(139, 92, 246, 0.1)')
  gradient1.addColorStop(1, 'rgba(139, 92, 246, 0)')

  const gradient2 = context.createRadialGradient(
    width * 0.7 + Math.cos(time * 0.4) * 120,
    height * 0.6 + Math.sin(time * 0.6) * 90,
    0,
    width * 0.7 + Math.cos(time * 0.4) * 120,
    height * 0.6 + Math.sin(time * 0.6) * 90,
    props.size * 0.8
  )
  gradient2.addColorStop(0, 'rgba(59, 130, 246, 0.2)')
  gradient2.addColorStop(0.5, 'rgba(59, 130, 246, 0.05)')
  gradient2.addColorStop(1, 'rgba(59, 130, 246, 0)')

  const gradient3 = context.createRadialGradient(
    width * 0.5 + Math.sin(time * 0.7) * 80,
    height * 0.2 + Math.cos(time * 0.8) * 60,
    0,
    width * 0.5 + Math.sin(time * 0.7) * 80,
    height * 0.2 + Math.cos(time * 0.8) * 60,
    props.size * 0.6
  )
  gradient3.addColorStop(0, 'rgba(236, 72, 153, 0.15)')
  gradient3.addColorStop(0.5, 'rgba(236, 72, 153, 0.05)')
  gradient3.addColorStop(1, 'rgba(236, 72, 153, 0)')

  context.fillStyle = gradient1
  context.fillRect(0, 0, width, height)

  context.globalCompositeOperation = 'screen'
  context.fillStyle = gradient2
  context.fillRect(0, 0, width, height)

  context.fillStyle = gradient3
  context.fillRect(0, 0, width, height)

  context.globalCompositeOperation = 'source-over'

  animationId = requestAnimationFrame(animate)
}

const resizeCanvas = () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * window.devicePixelRatio
  canvas.height = rect.height * window.devicePixelRatio
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'

  if (context) {
    context.scale(window.devicePixelRatio, window.devicePixelRatio)
  }
}

onMounted(() => {
  if (!canvasRef.value) return

  context = canvasRef.value.getContext('2d')
  if (!context) return

  resizeCanvas()
  animate()

  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<template>
  <div :class="['aurora-background', props.className]">
    <canvas
      ref="canvasRef"
      class="absolute inset-0 w-full h-full"
    />
    <div
      v-if="props.showRadialGradient"
      class="absolute inset-0 bg-gradient-radial from-transparent via-gray-950/50 to-gray-950"
    />
    <slot />
  </div>
</template>

<style scoped>
.aurora-background {
  position: relative;
  overflow: hidden;
}

.bg-gradient-radial {
  background: radial-gradient(circle at center, transparent 0%, rgba(3, 7, 18, 0.5) 50%, rgb(3, 7, 18) 100%);
}
</style>