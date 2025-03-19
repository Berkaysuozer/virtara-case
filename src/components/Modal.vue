<script setup>
import {  defineProps, defineEmits } from 'vue'


const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-content">
          <h2 class="modal-title">{{ title }}</h2>
          <p class="modal-message">{{ message }}</p>
          <div class="modal-actions">
            <button @click="handleCancel" class="cancel-btn" v-hover-color="{ hoverColor: 'var(--neutral-200)' }">
              İptal
            </button>
            <button @click="handleConfirm" class="confirm-btn" v-hover-color="{ hoverColor: 'var(--primary-300)' }">
              Onayla
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 90%;
  width: 400px;
  box-shadow: var(--shadow-lg);
}

.modal-content {
  text-align: center;
}

.modal-title {
  color: var(--primary-300);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.modal-message {
  color: var(--neutral-600);
  margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.cancel-btn,
.confirm-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: var(--neutral-100);
  color: var(--neutral-600);
  border: none;
}

.confirm-btn {
  background: var(--gradient-primary);
  color: white;
  border: none;
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>