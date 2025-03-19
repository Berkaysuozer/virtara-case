<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

const store = useStore()
const { locale } = useI18n()
const isDropdownOpen = ref(false)

const selectedLanguage = computed(() => store.getters['language/currentLanguage'])

const flagTr = 'https://flagcdn.com/w40/tr.png'
const flagEn = 'https://flagcdn.com/w40/gb.png'

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const selectLanguage = (lang) => {
  store.dispatch('language/setLanguage', lang)
  locale.value = lang
  isDropdownOpen.value = false
}
</script>

<template>
  <div class="language-selector" v-click-outside="closeDropdown">
    <div class="selected-language" @click="toggleDropdown">
      <img :src="selectedLanguage === 'tr' ? flagTr : flagEn" :alt="$t(`language.${selectedLanguage}`)" class="flag-icon" />
      <span>{{ $t(`language.${selectedLanguage}`) }}</span>
      <span class="material-icons dropdown-arrow">expand_more</span>
    </div>
    
    <div v-if="isDropdownOpen" class="dropdown-menu">
      <div @click="selectLanguage('tr')" class="dropdown-item" :class="{ active: selectedLanguage === 'tr' }">
        <img :src="flagTr" alt="Türkçe" class="flag-icon" />
        <span>{{ $t('language.tr') }}</span>
      </div>
      <div @click="selectLanguage('en')" class="dropdown-item" :class="{ active: selectedLanguage === 'en' }">
        <img :src="flagEn" alt="English" class="flag-icon" />
        <span>{{ $t('language.en') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.language-selector {
  display: inline-block;
  position: relative;
}

.selected-language {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: var(--primary-300);
  background-color: var(--neutral-100);
  cursor: pointer;
  transition: all 0.3s ease;
}

.selected-language:hover {
  color: var(--primary-100);
  background-color: var(--neutral-200);
  transform: translateY(-2px);
}

.dropdown-arrow {
  font-size: 1.2rem;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  min-width: 150px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--primary-300);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: var(--neutral-100);
}

.dropdown-item.active {
  background-color: var(--neutral-200);
  font-weight: 500;
}

.flag-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
</style>