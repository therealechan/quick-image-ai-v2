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
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/dashboard/projects',
      name: 'projects',
      component: () => import('../views/ProjectListView.vue')
    },
    {
      path: '/dashboard/projects/:id',
      name: 'project-show',
      component: () => import('../views/ProjectShowView.vue')
    },
    {
      path: '/dashboard/projects/:id/create',
      name: 'service-selector',
      component: () => import('../views/ServiceTypeSelector.vue')
    },
    {
      path: '/dashboard/projects/:id/model',
      name: 'model-generation',
      component: () => import('../views/ProjectDetailView.vue')
    },
    {
      path: '/dashboard/projects/:id/pose',
      name: 'pose-generation',
      component: () => import('../views/PoseGenerationView.vue')
    },
    {
      path: '/dashboard/projects/:id/upscale',
      name: 'upscale-generation',
      component: () => import('../views/UpscaleView.vue')
    },
  ],
})


export default router
