<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import BookCarousel from '../components/BookCarousel.vue'
import BookList from '../components/BookList.vue'
import { useI18n } from 'vue-i18n' 

import booksData from '../data/books.json'

const router = useRouter()
const store = useStore()
const { t } = useI18n() 

const books = ref(booksData)

const featuredBooks = computed(() => {
  return books.value.slice(0, 8)
})

onMounted(() => {
  if (!store.getters['auth/isAuthenticated']) {
    router.push('/login')
  }
})
</script>

<template>
  <main class="home">
    <div class="home-header">
      <div class="header-content">
        <h1>{{ t('home.title') }}</h1>
        <p>{{ t('home.description') }}</p>
      </div>
    </div>
    
    <!-- Featured Books Carousel -->
    <section class="featured-section">
      <BookCarousel 
        :books="featuredBooks" 
        :title="t('home.featuredBooks')"
      />
    </section>
    
    <section class="books-section">
      <h2 class="section-title">{{ t('home.allBooks') }}</h2> 
      <BookList 
        :books="books" 
      />
    </section>
  </main>
</template>

<style scoped>
.home {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--neutral-100);
  min-height: 100vh;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  background: var(--gradient-primary);
  box-shadow: var(--shadow-lg);
  color: white;
}

.header-content {
  text-align: left;
}

h1 {
  font-size: 2.5rem;
  color: white;
  margin-bottom: 0.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  max-width: 600px;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.6rem;
  font-size: 1rem;
  color: var(--primary-300);
  background-color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: var(--shadow-md);
}

.logout-button:hover {
  background-color: var(--neutral-100);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.section-title {
  font-size: 1.8rem;
  color: var(--primary-300);
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  padding-bottom: 0.5rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--gradient-primary);
  border-radius: 2px;
}

.featured-section {
  margin-bottom: 3rem;
}

.books-section {
  margin-bottom: 3rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .home-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .logout-button {
    align-self: flex-start;
  }
}
</style>