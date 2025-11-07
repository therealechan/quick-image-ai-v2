<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Grid3X3, Calendar, BarChart3, Archive } from 'lucide-vue-next'

type GroupByType = 'all' | 'day' | 'month' | 'year'

interface GroupOption {
  value: GroupByType
  label: string
  icon: any
  description: string
}

defineProps<{
  currentGroupBy: GroupByType
}>()

const emit = defineEmits<{
  change: [value: GroupByType]
}>()

const groupOptions: GroupOption[] = [
  {
    value: 'all',
    label: '全部图片',
    icon: Grid3X3,
    description: '查看所有图片'
  },
  {
    value: 'day',
    label: '按日分组',
    icon: Calendar,
    description: '按创建日期分组'
  },
  {
    value: 'month',
    label: '按月分组',
    icon: BarChart3,
    description: '按创建月份分组'
  },
  {
    value: 'year',
    label: '按年分组',
    icon: Archive,
    description: '按创建年份分组'
  }
]

const handleGroupChange = (value: GroupByType) => {
  emit('change', value)
}
</script>

<template>
  <div class="time-group-selector">
    <!-- Desktop View -->
    <div class="hidden md:flex items-center space-x-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-1">
      <button
        v-for="option in groupOptions"
        :key="option.value"
        :class="cn(
          'relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 group',
          'text-sm font-medium',
          currentGroupBy === option.value
            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
        )"
        @click="handleGroupChange(option.value)"
      >
        <component :is="option.icon" class="w-4 h-4" />
        <span>{{ option.label }}</span>
        
        <!-- Active indicator -->
        <div 
          v-if="currentGroupBy === option.value"
          class="absolute inset-0 bg-primary-500 rounded-lg opacity-10"
        />
      </button>
    </div>

    <!-- Mobile View -->
    <div class="md:hidden">
      <div class="relative">
        <select 
          :value="currentGroupBy"
          @change="handleGroupChange(($event.target as HTMLSelectElement).value as GroupByType)"
          class="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
        >
          <option 
            v-for="option in groupOptions"
            :key="option.value"
            :value="option.value"
            class="bg-gray-800 text-white"
          >
            {{ option.label }}
          </option>
        </select>
        
        <!-- Custom dropdown arrow -->
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Info Panel -->
    <div class="hidden lg:block mt-4">
      <div class="bg-gray-800/30 border border-gray-700/50 rounded-lg p-3">
        <div class="flex items-center space-x-2 text-sm">
          <span class="text-gray-400">当前分组方式:</span>
          <span class="text-primary-300 font-medium">
            {{ groupOptions.find(opt => opt.value === currentGroupBy)?.description }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.time-group-selector {
  animation: slideInDown 0.4s ease-out;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom select styles for better consistency */
select {
  background-image: none;
}

select:focus {
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
}
</style>