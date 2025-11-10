<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { cn } from '@/lib/utils'
import { X, FolderPlus, Hash, ImageIcon, Check } from 'lucide-vue-next'
import type { Album, CreateAlbumData } from '@/types/album'

const props = defineProps<{
  isOpen: boolean
  editingAlbum?: Album | null
}>()

const emit = defineEmits<{
  close: []
  create: [data: CreateAlbumData]
  update: [albumId: string, data: CreateAlbumData]
}>()

const formData = ref<CreateAlbumData>({
  name: '',
  description: '',
  tags: []
})

const tagInput = ref('')
const nameInput = ref<HTMLInputElement>()

const isEditing = computed(() => !!props.editingAlbum)
const modalTitle = computed(() => isEditing.value ? '编辑相册' : '创建新相册')
const submitButtonText = computed(() => isEditing.value ? '保存更改' : '创建相册')

const isFormValid = computed(() => {
  return formData.value.name.trim().length >= 2
})

const maxNameLength = 50
const maxDescriptionLength = 200
const maxTags = 10

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.editingAlbum) {
      formData.value = {
        name: props.editingAlbum.name,
        description: props.editingAlbum.description || '',
        tags: [...(props.editingAlbum.tags || [])]
      }
    } else {
      resetForm()
    }
    setTimeout(() => nameInput.value?.focus(), 100)
  }
})

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    tags: []
  }
  tagInput.value = ''
}

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && 
      !formData.value.tags?.includes(tag) && 
      (formData.value.tags?.length || 0) < maxTags) {
    formData.value.tags = [...(formData.value.tags || []), tag]
    tagInput.value = ''
  }
}

const removeTag = (index: number) => {
  formData.value.tags = formData.value.tags?.filter((_, i) => i !== index) || []
}

const handleTagInputKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    addTag()
  }
}

const handleSubmit = () => {
  if (!isFormValid.value) return
  
  if (isEditing.value && props.editingAlbum) {
    emit('update', props.editingAlbum.id, formData.value)
  } else {
    emit('create', formData.value)
  }
}

const handleClose = () => {
  emit('close')
  setTimeout(resetForm, 300)
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      @click="handleBackdropClick"
      @keydown="handleEscape"
    >
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div
          v-if="isOpen"
          class="w-full max-w-md bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-700">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-primary-500/20 rounded-lg">
                <FolderPlus class="w-5 h-5 text-primary-400" />
              </div>
              <h2 class="text-xl font-semibold text-white">{{ modalTitle }}</h2>
            </div>
            <button
              @click="handleClose"
              class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="p-6">
            <!-- Album Name -->
            <div class="mb-6">
              <label for="album-name" class="block text-sm font-medium text-gray-300 mb-2">
                相册名称 <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <input
                  id="album-name"
                  ref="nameInput"
                  v-model="formData.name"
                  type="text"
                  :maxlength="maxNameLength"
                  placeholder="输入相册名称，如：2025 秋冬捷展长袖卫衣"
                  :class="cn(
                    'w-full bg-gray-800/50 border rounded-lg px-4 py-3 text-white placeholder-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'transition-colors',
                    formData.name.trim().length < 2 && formData.name.length > 0
                      ? 'border-red-500'
                      : 'border-gray-600'
                  )"
                />
                <div class="absolute right-3 top-3 text-xs text-gray-500">
                  {{ formData.name.length }}/{{ maxNameLength }}
                </div>
              </div>
              <p v-if="formData.name.trim().length < 2 && formData.name.length > 0" class="mt-1 text-xs text-red-400">
                相册名称至少需要2个字符
              </p>
            </div>

            <!-- Description -->
            <div class="mb-6">
              <label for="album-description" class="block text-sm font-medium text-gray-300 mb-2">
                相册描述
              </label>
              <div class="relative">
                <textarea
                  id="album-description"
                  v-model="formData.description"
                  :maxlength="maxDescriptionLength"
                  rows="3"
                  placeholder="描述这个相册的内容或用途..."
                  class="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                />
                <div class="absolute right-3 bottom-3 text-xs text-gray-500">
                  {{ formData.description?.length || 0 }}/{{ maxDescriptionLength }}
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-300 mb-2">
                标签 (最多{{ maxTags }}个)
              </label>
              
              <!-- Tag Input -->
              <div class="flex space-x-2 mb-3">
                <div class="relative flex-1">
                  <input
                    v-model="tagInput"
                    type="text"
                    placeholder="添加标签..."
                    maxlength="20"
                    :disabled="(formData.tags?.length || 0) >= maxTags"
                    @keydown="handleTagInputKeydown"
                    class="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Hash class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
                <button
                  type="button"
                  @click="addTag"
                  :disabled="!tagInput.trim() || (formData.tags?.length || 0) >= maxTags"
                  class="px-3 py-2 bg-primary-500/20 text-primary-300 rounded-lg hover:bg-primary-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-500/20"
                >
                  <Check class="w-4 h-4" />
                </button>
              </div>

              <!-- Tags Display -->
              <div v-if="formData.tags && formData.tags.length > 0" class="flex flex-wrap gap-2">
                <span
                  v-for="(tag, index) in formData.tags"
                  :key="tag"
                  class="inline-flex items-center space-x-1 bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  <Hash class="w-3 h-3" />
                  <span>{{ tag }}</span>
                  <button
                    type="button"
                    @click="removeTag(index)"
                    class="ml-1 p-0.5 text-gray-400 hover:text-red-400 rounded-full hover:bg-red-500/10 transition-colors"
                  >
                    <X class="w-3 h-3" />
                  </button>
                </span>
              </div>
              
              <p v-if="(formData.tags?.length || 0) >= maxTags" class="mt-2 text-xs text-amber-400">
                已达到标签数量上限
              </p>
            </div>

            <!-- Actions -->
            <div class="flex space-x-3">
              <button
                type="button"
                @click="handleClose"
                class="flex-1 px-4 py-3 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                :disabled="!isFormValid"
                :class="cn(
                  'flex-1 px-4 py-3 rounded-lg font-medium transition-colors',
                  'flex items-center justify-center space-x-2',
                  isFormValid
                    ? 'bg-primary-500 hover:bg-primary-600 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                )"
              >
                <ImageIcon class="w-4 h-4" />
                <span>{{ submitButtonText }}</span>
              </button>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: rgb(31 41 55);
}

textarea::-webkit-scrollbar-thumb {
  background: rgb(75 85 99);
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: rgb(107 114 128);
}
</style>