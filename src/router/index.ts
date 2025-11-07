import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUpView.vue')
    },
    // AI功能主路由 - 重定向到模特图
    {
      path: '/dashboard',
      redirect: '/model-generation'
    },
    // AI功能直接路由
    {
      path: '/model-generation',
      name: 'model-generation',
      component: () => import('../views/ProjectDetailView.vue')
    },
    {
      path: '/pose-generation',
      name: 'pose-generation',
      component: () => import('../views/PoseGenerationView.vue')
    },
    {
      path: '/upscale',
      name: 'upscale-generation',
      component: () => import('../views/UpscaleView.vue')
    },
    // 保留项目管理功能
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/ProjectListView.vue')
    },
    {
      path: '/projects/:id',
      name: 'project-show',
      component: () => import('../views/ProjectShowView.vue')
    },
    {
      path: '/projects/:id/create',
      name: 'service-selector',
      component: () => import('../views/ServiceTypeSelector.vue')
    },
  ],
})


export default router
