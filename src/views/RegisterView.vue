<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { authValidationRules } from '../services/validationRules'

const router = useRouter()
const store = useStore()

const formData = ref({
  email: '',
  password: ''
})

const rules = authValidationRules.register(formData.value)

const v$ = useVuelidate(rules, formData)

const errorMessage = ref('')
const isSubmitting = ref(false)

const handleSubmit = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const isFormCorrect = await v$.value.$validate()
    if (!isFormCorrect) return

    await store.dispatch('auth/register', {
      email: formData.value.email,
      password: formData.value.password
    })
    router.push('/login')
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2>Hesap Oluştur</h2>
        <p class="auth-subtitle">Yeni bir hesap oluşturarak başlayın</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <div class="input-container" :class="{ 'focused': formData.email || v$.email.$error }">
            <input
              id="email"
              type="email"
              v-model="formData.email"
              :class="{ 'error': v$.email.$error }"
              @blur="v$.email.$touch()"
              required
            >
            <label for="email">E-posta</label>
            <span class="input-border"></span>
          </div>
          <div class="error-message" v-if="v$.email.$error">
            {{ v$.email.$errors[0].$message }}
          </div>
        </div>

        <div class="form-group">
          <div class="input-container" :class="{ 'focused': formData.password || v$.password.$error }">
            <input
              id="password"
              type="password"
              v-model="formData.password"
              :class="{ 'error': v$.password.$error }"
              @blur="v$.password.$touch()"
              required
            >
            <label for="password">Şifre</label>
            <span class="input-border"></span>
          </div>
          <div class="error-message" v-if="v$.password.$error">
            {{ v$.password.$errors[0].$message }}
          </div>
        </div>

        <div class="error-message auth-error" v-if="errorMessage">
          {{ errorMessage }}
        </div>

        <button type="submit" class="auth-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'İşleniyor...' : 'Hesap Oluştur' }}
        </button>

        <div class="auth-links">
          <router-link to="/login" class="auth-link">Giriş Yap</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
  background-color: var(--neutral-100);
}

.auth-card {
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
  border-radius: 16px;
  background-color: white;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  position: relative;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: var(--gradient-primary);
}

.auth-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-300);
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: var(--neutral-600);
  font-size: 1rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-container {
  position: relative;
  margin-top: 0.5rem;
}

.input-container input {
  width: 100%;
  padding: 1rem 0.75rem 0.5rem;
  border: none;
  border-bottom: 2px solid var(--neutral-300);
  background-color: var(--neutral-100);
  border-radius: 8px 8px 0 0;
  font-size: 1rem;
  transition: all 0.3s ease;
  z-index: 1;
  color: var(--neutral-900);
}

.input-container label {
  position: absolute;
  left: 0.75rem;
  top: 1rem;
  color: var(--neutral-600);
  font-size: 1rem;
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 0;
}

.input-container.focused label {
  top: 0.35rem;
  font-size: 0.75rem;
  color: var(--primary-200);
}

.input-container input:focus {
  outline: none;
  border-bottom-color: var(--primary-200);
  background-color: var(--neutral-200);
}

.input-container input:focus + label {
  top: 0.35rem;
  font-size: 0.55rem;
  color: var(--primary-200);
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--gradient-primary);
  transition: width 0.3s ease;
}

.input-container input:focus ~ .input-border {
  width: 100%;
}

input.error {
  border-bottom-color: var(--error) !important;
}

.error-message {
  color: var(--error);
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
}

.auth-error {
  text-align: center;
  padding: 0.5rem;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
}

.auth-button {
  padding: 1rem;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.auth-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.auth-button:active:not(:disabled) {
  transform: translateY(0);
}

.auth-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: var(--neutral-400);
}

.auth-links {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.auth-link {
  color: var(--primary-200);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.auth-link:hover {
  color: var(--primary-300);
  text-decoration: underline;
}
</style>