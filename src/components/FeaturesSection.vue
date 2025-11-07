<script setup lang="ts">
import { DollarSign, Clock, Sparkles, Zap } from 'lucide-vue-next'
import ExpandableGallery from './ExpandableGallery.vue'

const galleryItems = [
  {
    id: 1,
    title: "时尚电商",
    description: "为在线商店提供专业时尚摄影。高质量产品图片可提高40%的转化率。",
    image: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
    category: "时尚"
  },
  {
    id: 2,
    title: "虚拟试穿",
    description: "革命性的AI虚拟试衣技术。客户可以看到衣服在不同体型上的效果。",
    image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
    category: "技术"
  },
  {
    id: 3,
    title: "生活方式拍摄",
    description: "无需昂贵拍摄即可创建引人入胜的生活方式摄影。完美适用于社交媒体和营销。",
    image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
    category: "生活方式"
  },
  {
    id: 4,
    title: "产品变化",
    description: "几分钟内生成无限产品变化，使用不同模特、姿势和背景。",
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
    category: "变化"
  },
  {
    id: 5,
    title: "品牌一致性",
    description: "通过AI驱动的造型在所有产品图像中保持一致的品牌美学。",
    image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
    category: "品牌"
  },
  {
    id: 6,
    title: "移动端优化",
    description: "所有生成的图像都针对移动商务和社交媒体平台进行了优化。",
    image: "https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
    category: "移动端"
  }
]
</script>

<template>
  <section id="features" class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
    <div class="container mx-auto max-w-6xl">
      <div class="text-center space-y-4 mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold text-white">为什么选择 Quickimage.ai？</h2>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto">
          用尖端AI技术改变您的电商业务
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- Feature 1 -->
        <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-primary-500/50 transition-all hover:transform hover:scale-105">
          <DollarSign class="w-12 h-12 text-primary-400 mb-4" />
          <h3 class="text-xl font-semibold text-white mb-3">节省90%成本</h3>
          <p class="text-gray-400">
            消除昂贵的拍摄成本，同时为您的电商产品保持专业品质。
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-primary-500/50 transition-all hover:transform hover:scale-105">
          <Clock class="w-12 h-12 text-primary-400 mb-4" />
          <h3 class="text-xl font-semibold text-white mb-3">分钟级生成</h3>
          <p class="text-gray-400">
            几分钟内获得专业试穿图像，无需等待传统拍摄的数天或数周时间。
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-primary-500/50 transition-all hover:transform hover:scale-105">
          <Sparkles class="w-12 h-12 text-primary-400 mb-4" />
          <h3 class="text-xl font-semibold text-white mb-3">AI驱动品质</h3>
          <p class="text-gray-400">
            先进的AI技术确保逼真、高质量的虚拟试穿效果，提高客户转化率。
          </p>
        </div>

        <!-- Feature 4 -->
        <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-primary-500/50 transition-all hover:transform hover:scale-105">
          <Zap class="w-12 h-12 text-primary-400 mb-4" />
          <h3 class="text-xl font-semibold text-white mb-3">无限变化</h3>
          <p class="text-gray-400">
            创建无数种产品变化，使用不同模特和姿势，无需额外拍摄成本。
          </p>
        </div>
      </div>

      <!-- Expandable Gallery -->
      <div class="mt-20">
        <div class="text-center space-y-4 mb-12">
          <h3 class="text-2xl sm:text-3xl font-bold text-white">实际效果展示</h3>
          <p class="text-lg text-gray-400 max-w-2xl mx-auto">
            浏览我们的AI生成产品摄影案例库
          </p>
        </div>
        <ExpandableGallery :items="galleryItems" />
      </div>
    </div>
  </section>
</template>