<script setup lang="ts">
import { ref, computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { verificationService } from '../services/verification'

const props = defineProps<{
  phone: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  codeSent: []
}>()

const verificationCode = defineModel<string>({ required: true })
const countdown = ref(0)
const isSending = ref(false)
const error = ref('')

const canSendCode = computed(() => {
  return (
    props.phone &&
    verificationService.isValidPhone(props.phone) &&
    countdown.value === 0 &&
    !isSending.value &&
    !props.disabled
  )
})

const buttonText = computed(() => {
  if (isSending.value) return '发送中...'
  if (countdown.value > 0) return `${countdown.value}s`
  return '发送验证码'
})

const sendVerificationCode = async () => {
  if (!canSendCode.value) return

  error.value = ''
  isSending.value = true

  try {
    const result = await verificationService.sendVerificationCode(props.phone)

    if (result.success) {
      countdown.value = 60
      emit('codeSent')

      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value === 0) {
          clearInterval(timer)
        }
      }, 1000)
    } else {
      error.value = result.error || '发送失败'
    }
  } catch (err) {
    error.value = '发送失败，请重试'
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <div>
    <div class="relative">
      <input
        v-model="verificationCode"
        type="text"
        maxlength="6"
        pattern="\d{6}"
        inputmode="numeric"
        placeholder="请输入6位验证码"
        :disabled="disabled"
        class="w-full pl-3 pr-32 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-400 transition-colors text-sm"
      />
      <button
        type="button"
        @click="sendVerificationCode"
        :disabled="!canSendCode"
        class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[
          countdown > 0
            ? 'bg-gray-700 text-gray-400'
            : 'bg-primary-500 hover:bg-primary-600 text-white'
        ]"
      >
        <Loader2 v-if="isSending" class="h-4 w-4 animate-spin" />
        <span v-else>{{ buttonText }}</span>
      </button>
    </div>
    <p v-if="error" class="mt-2 text-sm text-red-400">{{ error }}</p>
    <p v-else-if="countdown > 0" class="mt-2 text-sm text-green-400">
      验证码已发送，请查收（Mock: 123456）
    </p>
  </div>
</template>
