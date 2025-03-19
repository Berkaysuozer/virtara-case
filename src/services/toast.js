import { ref } from 'vue'

const toasts = ref([])

export const useToast = () => {
  const show = (message, type = 'success', duration = 3000) => {
    const id = Date.now()
    
    toasts.value.push({
      id,
      message,
      type,
      duration
    })

    setTimeout(() => {
      toasts.value = toasts.value.filter(toast => toast.id !== id)
    }, duration)
  }

  const success = (message, duration) => show(message, 'success', duration)
  const warning = (message, duration) => show(message, 'warning', duration)
  const error = (message, duration) => show(message, 'error', duration)

  return {
    toasts,
    show,
    success,
    warning,
    error
  }
}