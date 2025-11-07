<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'
</script>

<template>
  <footer class="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto max-w-6xl">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <!-- Brand -->
        <div class="md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <Sparkles class="w-6 h-6 text-primary-500" />
            <span class="text-lg font-bold text-white">Quickimage.ai</span>
          </div>
          <p class="text-gray-400 text-sm max-w-sm">
            用AI驱动的虚拟试穿技术彻底改变电商摄影。
          </p>
        </div>

        <!-- Links -->
        <div>
          <h4 class="text-white font-semibold mb-4">产品</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><a href="#features" class="hover:text-white transition-colors">功能特色</a></li>
            <li><a href="#pricing" class="hover:text-white transition-colors">价格方案</a></li>
            <li><a href="#" class="hover:text-white transition-colors">API</a></li>
            <li><a href="#" class="hover:text-white transition-colors">文档</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-4">公司</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><a href="#" class="hover:text-white transition-colors">关于我们</a></li>
            <li><a href="#" class="hover:text-white transition-colors">博客</a></li>
            <li><a href="#" class="hover:text-white transition-colors">职位招聘</a></li>
            <li><a href="#" class="hover:text-white transition-colors">联系我们</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <p class="text-gray-400 text-sm">© 2025 Quickimage.ai. 保留所有权利。</p>
        <div class="flex space-x-6 text-sm text-gray-400">
          <a href="#" class="hover:text-white transition-colors">隐私政策</a>
          <a href="#" class="hover:text-white transition-colors">服务条款</a>
        </div>
      </div>
    </div>
  </footer>
</template>