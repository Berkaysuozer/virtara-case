<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import CurrencySelector from './CurrencySelector.vue'
import LanguageSelector from './LanguageSelector.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()
const VITE_LOGO_URL = ref(import.meta.env.VITE_LOGO_URL)
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
const isAuthRoute = computed(() => ['login', 'register', 'forgot-password'].includes(route.name))
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleLogout = async () => {
  try {
    await store.dispatch('auth/logout')
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<template>
  <header v-if="isAuthenticated && !isAuthRoute">
    <nav>
      <div class="header-container">
        <div class="nav-left">
          <RouterLink to="/" class="logo-container">
            <img :src="VITE_LOGO_URL" :alt="$t('auth.login.logo_alt')" class="logo">
            <span class="logo-text">{{ $t('header.logo') }}</span>
          </RouterLink>
        </div>
        <button class="hamburger" @click="toggleMenu">
          <span class="material-icons">{{ isMenuOpen ? 'close' : 'menu' }}</span>
        </button>
      </div>
      <div class="nav-links" :class="{ 'open': isMenuOpen }">
        <RouterLink to="/favorites">
          <span class="material-icons">favorite</span>
          {{ $t('header.favorites') }}
        </RouterLink>
        <RouterLink to="/cart">
          <span class="material-icons">shopping_cart</span>
          {{ $t('header.cart') }}
        </RouterLink>
        <CurrencySelector />
        <LanguageSelector />
        <div class="profile-dropdown" v-click-outside="closeDropdown" @click="toggleDropdown" ref="dropdownRef">
          <span class="profile-button">
            <span class="material-icons">account_circle</span>
            {{ $t('header.profile') }}
          </span>
          <div class="dropdown-menu" v-show="isDropdownOpen">
            <button @click="handleLogout" class="logout-button">{{ $t('header.logout') }}</button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
header {
  line-height: 1.5;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

header.scrolled {
  padding: 0.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

nav {
  width: 100%;
  max-width: 1400px;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 0;
  background-color: transparent;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
}

.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary-300);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.hamburger:hover {
  background-color: var(--neutral-100);
}

.hamburger .material-icons {
  font-size: 1.8rem;
}

.logo {
  height: 40px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.nav-left {
  display: flex;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.logo-container:hover {
  background-color: var(--neutral-100);
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--primary-300);
}

.nav-links {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0 1rem;
  transition: all 0.3s ease;
}

nav a {
  display: inline-flex;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: var(--primary-300);
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

nav a:hover {
  color: var(--primary-100);
  background-color: var(--neutral-100);
  transform: translateY(-2px);
}

nav a.router-link-active {
  color: var(--primary-100);
  background-color: var(--neutral-100);
  font-weight: 600;
}

.profile-dropdown {
  position: relative;
  cursor: pointer;
}

.profile-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: var(--primary-300);
  font-weight: 500;
  transition: all 0.3s ease;
}

.profile-button:hover {
  color: var(--primary-100);
  background-color: var(--neutral-100);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  z-index: 1000;
  overflow: hidden;
  transform-origin: top right;
  animation: dropdown-appear 0.2s ease forwards;
}

@keyframes dropdown-appear {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.dropdown-menu a {
  display: block;
  padding: 0.75rem 1rem;
  color: var(--primary-300);
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 0;
}

.dropdown-menu a:hover {
  background-color: var(--neutral-100);
  transform: none;
}

.logout-button {
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  color: var(--secondary-200);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-top: 1px solid var(--neutral-100);
}

.logout-button:hover {
  background-color: var(--neutral-100);
  color: var(--secondary-300);
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .logo-text {
    display: none;
  }
  
  .nav-links {
    flex-direction: column;
    width: 100%;
    display: none;
    padding: 0.5rem 1.5rem 1.5rem;
    background-color: white;
    border-top: 1px solid var(--neutral-100);
    box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.1);
  }
  
  .nav-links.open {
    display: flex;
    align-items: flex-start;
    animation: slide-down 0.3s ease forwards;
  }
  
  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .profile-dropdown {
    width: 100%;
    margin-top: 0.5rem;
  }
  
  .profile-button {
    width: 100%;
  }
  
  nav a {
    width: 100%;
    margin: 0.25rem 0;
  }
  
  .dropdown-menu {
    position: static;
    box-shadow: none;
    margin-top: 0.5rem;
    width: 100%;
    border: 1px solid var(--neutral-100);
  }
}
</style>