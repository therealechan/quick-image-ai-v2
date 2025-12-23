<script setup lang="ts">
import { useNotification } from '@/composables/useNotification'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-vue-next'

const { notifications, removeNotification } = useNotification()

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return CheckCircle
    case 'error':
      return XCircle
    case 'warning':
      return AlertTriangle
    case 'info':
    default:
      return Info
  }
}

const getColorClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-500/10 border-green-500/30 text-green-400'
    case 'error':
      return 'bg-red-500/10 border-red-500/30 text-red-400'
    case 'warning':
      return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
    case 'info':
    default:
      return 'bg-blue-500/10 border-blue-500/30 text-blue-400'
  }
}
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'flex items-start space-x-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg min-w-[320px] max-w-[400px] pointer-events-auto',
          getColorClasses(notification.type)
        ]"
      >
        <component
          :is="getIcon(notification.type)"
          class="w-5 h-5 flex-shrink-0 mt-0.5"
        />
        <p class="flex-1 text-sm font-medium text-white">
          {{ notification.message }}
        </p>
        <button
          @click="removeNotification(notification.id)"
          class="text-gray-400 hover:text-white transition-colors flex-shrink-0"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
