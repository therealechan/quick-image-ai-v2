<script setup lang="ts">
import { CheckCircle2 } from 'lucide-vue-next'
</script>

<template>
  <section id="pricing" class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
    <div class="container mx-auto max-w-6xl">
      <div class="text-center space-y-4 mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold text-white">简单透明的价格方案</h2>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto">
          选择适合您业务需求的完美方案
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <!-- Starter Plan -->
        <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 flex flex-col">
          <h3 class="text-2xl font-bold text-white mb-2">入门版</h3>
          <p class="text-gray-400 text-sm mb-6">适合刚起步的小型企业</p>

          <div class="mb-6">
            <span class="text-4xl font-bold text-white">$29</span>
            <span class="text-gray-400">/month</span>
          </div>

          <button class="w-full py-3 rounded-lg font-semibold mb-8 transition-all bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-primary-400/50 hover:bg-primary-500/10 text-white hover:text-primary-300">
            开始免费试用
          </button>

          <ul class="space-y-4 flex-grow">
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">每月100次AI生成</span>
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
              <span class="text-gray-300 text-sm">邮件支持</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">7天退款保证</span>
            </li>
          </ul>
        </div>

        <!-- Professional Plan (Featured) -->
        <div class="bg-gray-800/50 backdrop-blur-sm border border-primary-500 ring-2 ring-primary-500/20 rounded-xl p-8 flex flex-col transform scale-105">
          <div class="inline-flex items-center justify-center px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full mb-4 self-start">
            最受欢迎
          </div>

          <h3 class="text-2xl font-bold text-white mb-2">专业版</h3>
          <p class="text-gray-400 text-sm mb-6">适合成长中的电商企业</p>

          <div class="mb-6">
            <span class="text-4xl font-bold text-white">$79</span>
            <span class="text-gray-400">/month</span>
          </div>

          <button class="w-full py-3 rounded-lg font-semibold mb-8 transition-all bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white shadow-lg shadow-primary-500/30 hover:scale-105">
            立即开始
          </button>

          <ul class="space-y-4 flex-grow">
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">每月500次AI生成</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">高级模特库</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">高清质量输出</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">优先支持</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">自定义模特上传</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">批量处理</span>
            </li>
          </ul>
        </div>

        <!-- Enterprise Plan -->
        <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 flex flex-col">
          <h3 class="text-2xl font-bold text-white mb-2">企业版</h3>
          <p class="text-gray-400 text-sm mb-6">适合大规模运营</p>

          <div class="mb-6">
            <span class="text-4xl font-bold text-white">定制</span>
          </div>

          <button class="w-full py-3 rounded-lg font-semibold mb-8 transition-all bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-white/40 hover:bg-white/20 text-white">
            联系销售
          </button>

          <ul class="space-y-4 flex-grow">
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">无限AI生成</span>
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
              <span class="text-gray-300 text-sm">专属客户经理</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">API访问</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">白标解决方案</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckCircle2 class="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <span class="text-gray-300 text-sm">定制AI训练</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>