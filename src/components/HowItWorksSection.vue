<script setup lang="ts">
import { Upload, Camera, Wand2, Download } from 'lucide-vue-next'
</script>

<template>
  <section id="how-it-works" class="py-20 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto max-w-6xl">
      <div class="text-center space-y-4 mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold text-white">使用方法</h2>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto">
          四个简单步骤获得专业产品图像
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Step 1 -->
        <div>
          <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center h-full hover:border-primary-500/50 transition-all">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-primary-500/20 border border-primary-500/50 rounded-full mb-4">
              <span class="text-primary-400 font-bold">1</span>
            </div>
            <Upload class="w-10 h-10 text-primary-400 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-white mb-2">上传模特面部</h3>
            <p class="text-gray-400 text-sm">
              从我们的库中选择或上传您喜欢的模特面部，以匹配您的品牌美学。
            </p>
          </div>
        </div>

        <!-- Step 2 -->
        <div>
          <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center h-full hover:border-primary-500/50 transition-all">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-primary-500/20 border border-primary-500/50 rounded-full mb-4">
              <span class="text-primary-400 font-bold">2</span>
            </div>
            <Camera class="w-10 h-10 text-primary-400 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-white mb-2">添加您的服装</h3>
            <p class="text-gray-400 text-sm">
              上传您的产品图像 - 衬衫、连衣裙、配饰或任何您想要展示的服装。
            </p>
          </div>
        </div>

        <!-- Step 3 -->
        <div>
          <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center h-full hover:border-primary-500/50 transition-all">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-primary-500/20 border border-primary-500/50 rounded-full mb-4">
              <span class="text-primary-400 font-bold">3</span>
            </div>
            <Wand2 class="w-10 h-10 text-primary-400 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-white mb-2">AI魔法生成</h3>
            <p class="text-gray-400 text-sm">
              我们的先进AI无缝结合模特和服装，创建逼真的试穿图像。
            </p>
          </div>
        </div>

        <!-- Step 4 -->
        <div>
          <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center h-full hover:border-primary-500/50 transition-all">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-primary-500/20 border border-primary-500/50 rounded-full mb-4">
              <span class="text-primary-400 font-bold">4</span>
            </div>
            <Download class="w-10 h-10 text-primary-400 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-white mb-2">下载和使用</h3>
            <p class="text-gray-400 text-sm">
              获得专业质量的图像，可用于您的网站、社交媒体或市场平台。
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>