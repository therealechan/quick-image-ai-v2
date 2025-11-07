<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <section class="py-20 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto max-w-4xl">
      <div class="bg-gradient-to-r from-primary-900/50 to-secondary-900/50 border border-primary-500/30 rounded-2xl p-12 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
          准备好改变您的产品摄影了吗？
        </h2>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          加入数百商家的行列，节省数千元拍摄成本，同时提高转化率
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button class="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white rounded-lg font-semibold text-lg transition-all hover:scale-105 flex items-center space-x-2 shadow-xl shadow-primary-500/30">
            <span>开始免费试用</span>
            <ArrowRight class="w-5 h-5" />
          </button>
          <button class="px-8 py-4 bg-white/15 backdrop-blur-sm border-2 border-white/40 hover:border-white/60 hover:bg-white/25 text-white rounded-lg font-semibold text-lg transition-all hover:scale-105">
            联系销售
          </button>
        </div>
        <p class="text-gray-400 text-sm mt-6">
          无需信用卡 • 14天免费试用 • 随时取消
        </p>
      </div>
    </div>
  </section>
</template>