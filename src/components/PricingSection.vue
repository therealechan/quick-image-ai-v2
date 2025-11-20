<script setup lang="ts">
import { CheckCircle2, Star, Coins } from 'lucide-vue-next'
</script>

<template>
  <section id="pricing" class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
    <div class="container mx-auto max-w-6xl">
      <div class="text-center space-y-4 mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold text-white">简单透明的积分套餐</h2>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto">
          购买积分包，按需使用AI图像生成服务
        </p>
        <div class="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700 inline-block">
          <div class="flex items-center justify-center space-x-6 text-sm text-gray-300">
            <div class="flex items-center space-x-2">
              <Coins class="w-4 h-4 text-primary-400" />
              <span>模特图生成: 3积分/次</span>
            </div>
            <div class="flex items-center space-x-2">
              <Coins class="w-4 h-4 text-primary-400" />
              <span>姿势图生成: 6积分/次</span>
            </div>
            <div class="flex items-center space-x-2">
              <Coins class="w-4 h-4 text-primary-400" />
              <span>高清放大: 2积分/次</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Basic Package -->
        <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 flex flex-col">
          <h3 class="text-2xl font-bold text-white mb-2">基础包</h3>
          <p class="text-gray-400 text-sm mb-6">适合轻度使用</p>

          <div class="mb-6">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-4xl font-bold text-white">$29</span>
              <span class="text-lg text-gray-400 line-through">$35</span>
            </div>
            <div class="flex items-center space-x-2">
              <Coins class="w-5 h-5 text-primary-400" />
              <span class="text-lg font-semibold text-primary-300">100 积分</span>
            </div>
          </div>

          <button class="w-full py-3 rounded-lg font-semibold mb-8 transition-all bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-primary-400/50 hover:bg-primary-500/10 text-white hover:text-primary-300">
            购买积分包
          </button>

          <ul class="space-y-4 flex-grow">
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">约33次模特图生成</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">基础模特库访问</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">标准质量输出</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">积分永不过期</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">邮件支持</span>
            </li>
          </ul>
        </div>

        <!-- Standard Package (Featured) -->
        <div class="bg-gray-800/50 backdrop-blur-sm border border-primary-500 ring-2 ring-primary-500/20 rounded-xl p-8 flex flex-col">
          <div class="inline-flex items-center justify-center px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full mb-4 self-start">
            最受欢迎
          </div>

          <h3 class="text-2xl font-bold text-white mb-2">标准包</h3>
          <p class="text-gray-400 text-sm mb-6">最受欢迎的选择</p>

          <div class="mb-6">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-4xl font-bold text-white">$79</span>
              <span class="text-lg text-gray-400 line-through">$99</span>
            </div>
            <div class="flex items-center space-x-2">
              <Coins class="w-5 h-5 text-primary-400" />
              <span class="text-lg font-semibold text-primary-300">300 积分</span>
            </div>
          </div>

          <button class="w-full py-3 rounded-lg font-semibold mb-8 transition-all bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white shadow-lg shadow-primary-500/30 hover:scale-105">
            立即购买
          </button>

          <ul class="space-y-4 flex-grow">
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">约100次模特图生成</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">高级模特库访问</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">高清质量输出</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">积分永不过期</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">优先支持</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">批量处理功能</span>
            </li>
          </ul>
        </div>

        <!-- Professional Package -->
        <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 flex flex-col">
          <h3 class="text-2xl font-bold text-white mb-2">专业包</h3>
          <p class="text-gray-400 text-sm mb-6">高频使用用户首选</p>

          <div class="mb-6">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-4xl font-bold text-white">$149</span>
              <span class="text-lg text-gray-400 line-through">$189</span>
            </div>
            <div class="flex items-center space-x-2">
              <Coins class="w-5 h-5 text-primary-400" />
              <span class="text-lg font-semibold text-primary-300">600 积分</span>
            </div>
          </div>

          <button class="w-full py-3 rounded-lg font-semibold mb-8 transition-all bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-primary-400/50 hover:bg-primary-500/10 text-white hover:text-primary-300">
            购买积分包
          </button>

          <ul class="space-y-4 flex-grow">
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">约200次模特图生成</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">高级模特库访问</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">高清质量输出</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">积分永不过期</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">优先支持</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">自定义模特上传</span>
            </li>
          </ul>
        </div>

        <!-- Enterprise Package -->
        <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 flex flex-col">
          <h3 class="text-2xl font-bold text-white mb-2">企业包</h3>
          <p class="text-gray-400 text-sm mb-6">团队和企业使用</p>

          <div class="mb-6">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-4xl font-bold text-white">$269</span>
              <span class="text-lg text-gray-400 line-through">$349</span>
            </div>
            <div class="flex items-center space-x-2">
              <Coins class="w-5 h-5 text-primary-400" />
              <span class="text-lg font-semibold text-primary-300">1200 积分</span>
            </div>
          </div>

          <button class="w-full py-3 rounded-lg font-semibold mb-8 transition-all bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-white/40 hover:bg-white/20 text-white">
            购买积分包
          </button>

          <ul class="space-y-4 flex-grow">
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">约400次模特图生成</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">完整模特库访问</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">4K质量输出</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">积分永不过期</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">专属客户经理</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">API访问</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">批量处理功能</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>