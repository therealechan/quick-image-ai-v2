<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'

const route = useRoute()

const showNavBar = computed(() => {
  // Hide NavBar for all authenticated/dashboard pages
  const hiddenPaths = ['/dashboard', '/model-generation', '/pose-generation', '/upscale', '/gallery', '/projects']
  return !hiddenPaths.some(path => route.path.startsWith(path))
})
</script>

<template>
  <div class="dark bg-gray-950 text-gray-100 min-h-screen font-sans">
    <NavBar v-if="showNavBar" />
    <RouterView />
  </div>
</template>

<style>
html, body {
  background-color: rgb(3, 7, 18) !important;
  color: rgb(243, 244, 246) !important;
}
</style>
