<script setup>
import { RouterView } from 'vue-router'
import Toast from './components/Toast.vue'
import { useToast } from './services/toast'
import Header from './components/Header.vue'

const { toasts } = useToast()
</script>

<template>
  <Header />
  <RouterView />
  <template v-for="toast in toasts" :key="toast.id">
    <Toast
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
    />
  </template>
</template>
