<script setup lang="ts">
import Marquee from './ui/Marquee.vue'

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  avatar: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "设计总监",
    company: "时尚品牌 LUXE",
    content: "QuickImage.ai 彻底改变了我们的产品拍摄流程。以前需要一整天的模特拍摄，现在只需要几分钟就能生成完美的展示图片。质量惊人，为我们节省了大量成本。",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "电商运营",
    company: "TrendStyle",
    content: "作为一个快速发展的电商平台，我们需要大量的产品图片。QuickImage.ai 让我们能够快速生成各种风格的模特展示图，大大提升了转化率。",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
    rating: 5
  },
  {
    id: 3,
    name: "Lisa Wang",
    role: "创意总监",
    company: "数字营销公司",
    content: "AI生成的模特图片质量让我们的客户都惊叹不已。不仅节省了拍摄成本，还能快速迭代不同的创意方案。这是我们见过最实用的AI工具。",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
    rating: 5
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "品牌经理",
    company: "Fashion Forward",
    content: "从概念到最终图片只需要几分钟，而且可以生成多种搭配方案。对于我们这种需要快速响应市场的品牌来说，QuickImage.ai 是不可或缺的工具。",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
    rating: 5
  },
  {
    id: 5,
    name: "Emily Zhang",
    role: "产品摄影师",
    company: "Visual Studio",
    content: "作为专业摄影师，我最初对AI生成图片持怀疑态度。但QuickImage.ai 的质量真的让我刮目相看，现在我用它来快速制作样片和概念图。",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face",
    rating: 5
  },
  {
    id: 6,
    name: "Alex Kumar",
    role: "产品总监",
    company: "StyleTech",
    content: "批量生成功能太强大了！我们可以一次性生成几十种搭配组合，然后选择最佳的方案。这种效率在传统拍摄中是不可能实现的。",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=face",
    rating: 5
  }
]

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => i < rating)
}
</script>

<template>
  <section class="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          用户<span class="text-primary-500">真实评价</span>
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          数千家企业选择 QuickImage.ai，看看他们怎么说
        </p>
      </div>

      <!-- Testimonials Marquee -->
      <div class="relative">
        <!-- First Row - Left to Right -->
        <Marquee 
          :pause-on-hover="true" 
          class="[--duration:60s] mb-6"
        >
          <div
            v-for="testimonial in testimonials.slice(0, 3)"
            :key="testimonial.id"
            class="mx-4 w-96 flex-shrink-0"
          >
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <!-- Stars -->
              <div class="flex mb-4">
                <div 
                  v-for="(filled, index) in renderStars(testimonial.rating)"
                  :key="index"
                  class="w-5 h-5 mr-1"
                >
                  <svg 
                    class="w-full h-full"
                    :class="filled ? 'text-yellow-400' : 'text-gray-300'"
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
              </div>
              
              <!-- Content -->
              <blockquote class="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                "{{ testimonial.content }}"
              </blockquote>
              
              <!-- Author -->
              <div class="flex items-center">
                <img 
                  :src="testimonial.avatar" 
                  :alt="testimonial.name"
                  class="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <div class="font-semibold text-gray-900 dark:text-white">{{ testimonial.name }}</div>
                  <div class="text-gray-600 dark:text-gray-400 text-sm">{{ testimonial.role }}</div>
                  <div class="text-primary-500 text-sm font-medium">{{ testimonial.company }}</div>
                </div>
              </div>
            </div>
          </div>
        </Marquee>

        <!-- Second Row - Right to Left -->
        <Marquee 
          :pause-on-hover="true" 
          :reverse="true"
          class="[--duration:60s]"
        >
          <div
            v-for="testimonial in testimonials.slice(3, 6)"
            :key="testimonial.id"
            class="mx-4 w-96 flex-shrink-0"
          >
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <!-- Stars -->
              <div class="flex mb-4">
                <div 
                  v-for="(filled, index) in renderStars(testimonial.rating)"
                  :key="index"
                  class="w-5 h-5 mr-1"
                >
                  <svg 
                    class="w-full h-full"
                    :class="filled ? 'text-yellow-400' : 'text-gray-300'"
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
              </div>
              
              <!-- Content -->
              <blockquote class="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                "{{ testimonial.content }}"
              </blockquote>
              
              <!-- Author -->
              <div class="flex items-center">
                <img 
                  :src="testimonial.avatar" 
                  :alt="testimonial.name"
                  class="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <div class="font-semibold text-gray-900 dark:text-white">{{ testimonial.name }}</div>
                  <div class="text-gray-600 dark:text-gray-400 text-sm">{{ testimonial.role }}</div>
                  <div class="text-primary-500 text-sm font-medium">{{ testimonial.company }}</div>
                </div>
              </div>
            </div>
          </div>
        </Marquee>
      </div>

      <!-- Stats -->
      <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <div class="text-3xl md:text-4xl font-bold text-primary-500 mb-2">10,000+</div>
          <div class="text-gray-600 dark:text-gray-400">企业用户</div>
        </div>
        <div>
          <div class="text-3xl md:text-4xl font-bold text-primary-500 mb-2">500万+</div>
          <div class="text-gray-600 dark:text-gray-400">生成图片</div>
        </div>
        <div>
          <div class="text-3xl md:text-4xl font-bold text-primary-500 mb-2">99.8%</div>
          <div class="text-gray-600 dark:text-gray-400">满意度</div>
        </div>
        <div>
          <div class="text-3xl md:text-4xl font-bold text-primary-500 mb-2">4.9/5</div>
          <div class="text-gray-600 dark:text-gray-400">平均评分</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Custom animations for testimonial cards */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.testimonial-card:hover {
  animation: float 2s ease-in-out infinite;
}
</style>