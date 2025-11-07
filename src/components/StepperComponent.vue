<script setup lang="ts">
import { computed } from 'vue'
import { Check, User, Shirt, Image as ImageIcon, Settings, Eye } from 'lucide-vue-next'

interface Step {
  id: number
  title: string
  description: string
  icon: any
}

interface Props {
  currentStep: number
  steps: Step[]
}

const props = defineProps<Props>()

const getStepStatus = (stepId: number) => {
  if (stepId < props.currentStep) return 'completed'
  if (stepId === props.currentStep) return 'active'
  return 'pending'
}

const getStepClasses = (stepId: number) => {
  const status = getStepStatus(stepId)
  switch (status) {
    case 'completed':
      return 'bg-primary-500 text-white border-primary-500'
    case 'active':
      return 'bg-primary-500 text-white border-primary-500 ring-4 ring-primary-500/20'
    default:
      return 'bg-gray-700 text-gray-400 border-gray-600'
  }
}

const getConnectorClasses = (stepId: number) => {
  return stepId < props.currentStep 
    ? 'bg-primary-500' 
    : 'bg-gray-600'
}
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between">
      <div
        v-for="(step, index) in steps"
        :key="step.id"
        class="flex items-center"
        :class="index < steps.length - 1 ? 'flex-1' : ''"
      >
        <!-- Step Circle -->
        <div class="flex flex-col items-center">
          <div
            :class="[
              'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300',
              getStepClasses(step.id)
            ]"
          >
            <Check
              v-if="getStepStatus(step.id) === 'completed'"
              class="w-4 h-4"
            />
            <component
              v-else
              :is="step.icon"
              class="w-4 h-4"
            />
          </div>
          
          <!-- Step Label -->
          <div class="mt-1 text-center">
            <p
              :class="[
                'text-xs font-medium hidden sm:block',
                getStepStatus(step.id) === 'active' ? 'text-primary-300' : 'text-gray-400'
              ]"
            >
              {{ step.title }}
            </p>
          </div>
        </div>

        <!-- Connector Line -->
        <div
          v-if="index < steps.length - 1"
          :class="[
            'h-0.5 flex-1 mx-2 sm:mx-4 transition-all duration-300',
            getConnectorClasses(step.id + 1)
          ]"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --primary-300: #a78bfa;
  --primary-500: #7c3aed;
}
</style>