<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'warning', 'error'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const visible = ref(false)
let timer = null

onMounted(() => {
  visible.value = true
  timer = setTimeout(() => {
    visible.value = false
  }, props.duration)
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <Transition name="toast">
    <div v-if="visible" class="toast" :class="type">
      <span class="material-icons icon">
        {{ type === 'success' ? 'check_circle' : type === 'warning' ? 'warning' : 'error' }}
      </span>
      <span class="message">{{ message }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-weight: 500;
  box-shadow: var(--shadow-lg);
  z-index: 9999;
  min-width: 300px;
  max-width: 400px;
}

.toast.success {
  background: var(--gradient-primary);
}

.toast.warning {
  background: linear-gradient(to right, #f59e0b, #d97706);
}

.toast.error {
  background: linear-gradient(to right, #ef4444, #dc2626);
}

.icon {
  font-size: 1.5rem;
}

.message {
  font-size: 1rem;
  line-height: 1.5;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>