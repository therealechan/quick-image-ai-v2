<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'

const route = useRoute()

const showNavBar = computed(() => {
  return !route.path.startsWith('/dashboard')
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
