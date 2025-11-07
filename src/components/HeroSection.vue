<script setup lang="ts">
import { ref } from 'vue'
import { Sparkles, ArrowRight } from 'lucide-vue-next'
import ContainerScroll from './ContainerScroll.vue'
import AuroraBackground from './AuroraBackground.vue'
import BendingGallery from './BendingGallery.vue'

const galleryItems = ref([
  {
    image: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
    text: "T恤AI试穿效果"
  },
  {
    image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
    text: "女装虚拟展示"
  },
  {
    image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
    text: "商务正装效果"
  },
  {
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
    text: "休闲装搭配"
  },
  {
    image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
    text: "运动装展示"
  }
])
</script>

<template>
  <section class="relative pt-32 pb-20 overflow-hidden">
    <AuroraBackground class="absolute inset-0 -z-10" :size="600">
    </AuroraBackground>
    <ContainerScroll>
      <template #header>
        <!-- Badge -->
        <div class="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-sm">
          <Sparkles class="w-4 h-4 text-primary-400" />
          <span class="text-primary-300">AI驱动的虚拟试穿技术</span>
        </div>

        <!-- Headline -->
        <h1 class="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tight">
          <span class="gradient-text drop-shadow-2xl">专业产品拍摄</span>
          <br />
          <span class="text-white drop-shadow-2xl">无需拍摄成本</span>
        </h1>

        <!-- Subheadline -->
        <p class="text-2xl font-semibold text-gray-300 max-w-4xl mx-auto leading-relaxed">
          为您的服装产品生成令人惊艳的AI虚拟试穿图像。节省90%的拍摄成本，同时保持专业品质。
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button class="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 rounded-lg font-semibold text-lg transition-all hover:scale-105 flex items-center space-x-2 shadow-lg shadow-primary-500/25 text-white">
            <span>免费试用</span>
            <ArrowRight class="w-5 h-5" />
          </button>
          <button class="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-2 border-white/30 hover:border-white/50 rounded-lg font-semibold text-lg transition-all hover:scale-105 text-white">
            观看演示
          </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-16">
          <div class="text-center">
            <div class="text-3xl sm:text-4xl font-bold text-primary-400">90%</div>
            <div class="text-gray-500 mt-1">成本节省</div>
          </div>
          <div class="text-center">
            <div class="text-3xl sm:text-4xl font-bold text-primary-400">5分钟</div>
            <div class="text-gray-500 mt-1">平均生成时间</div>
          </div>
          <div class="text-center">
            <div class="text-3xl sm:text-4xl font-bold text-primary-400">10K+</div>
            <div class="text-gray-500 mt-1">已生成图像</div>
          </div>
          <div class="text-center">
            <div class="text-3xl sm:text-4xl font-bold text-primary-400">500+</div>
            <div class="text-gray-500 mt-1">满意商家</div>
          </div>
        </div>
      </template>

      <template #content>
        <!-- Bending Gallery -->
        <div class="relative border border-zinc-800 rounded-xl overflow-clip">
          <BendingGallery 
            :bend="2"
            :border-radius="0.1"
            :items="galleryItems"
          />
          <!-- Decorative Elements -->
          <div class="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary-500/20 rounded-full blur-3xl"></div>
        </div>
      </template>
    </ContainerScroll>
  </section>
</template>