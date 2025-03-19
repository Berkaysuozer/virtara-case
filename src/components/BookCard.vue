<script setup>
import { ref, defineProps, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFormatters } from '../mixins/formatter'
import { useStore } from 'vuex' 

const { currencyFormatter } = useFormatters()

const router = useRouter()
const store = useStore() 
const props = defineProps({
  book: {
    type: Object,
    required: true
  },
  viewMode: {
    type: String,
    default: 'grid'
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
})


const isHovered = ref(false)

const navigateToDetail = () => {
  router.push(`/book/${props.book.id}`)
}

const addToCart = () => {
  const user = store.getters['auth/currentUser']
  if (!user) return
  store.dispatch('cart/addToCart', { userEmail: user.email, book: props.book })
}

const user = computed(() => store.getters['auth/currentUser'])
const favoriteStatus = computed(() => {
  if (!user.value) return false
  return store.getters['favorites/isFavorite'](user.value.email, props.book.id)
})

const bookName = computed(() => {
  const language = store.state.language.selectedLanguage
  return language === 'en' ? props.book.book_name_en : props.book.book_name_tr
})

const toggleFavorite = () => {
  store.dispatch('favorites/toggleFavorite', props.book)
}
</script>

<template>
  <div 
    class="book-card" 
    :class="[viewMode, { 'hovered': isHovered }]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="navigateToDetail"
  >
    <div class="book-image-container">
      <img :src="book.image" :alt="bookName" class="book-image">
      <button class="favorite-button" @click.stop="toggleFavorite">
        <span v-if="favoriteStatus" class="material-icons">favorite</span>
        <span v-else class="material-icons">favorite_border</span>
      </button>
      <div class="book-overlay" v-if="isHovered">
        <div class="book-details">
          <p class="book-description">{{ book.description_tr }}</p>
        </div>
      </div>
      <div class="book-badge" v-if="book.usd_price">
        <span>{{ currencyFormatter(book.usd_price) }}</span>
      </div>
    </div>
    <div class="book-info">
      <div class="book-header">
        <h3 class="book-title">{{ bookName }}</h3>
      </div>
      <p class="book-author">{{ book.author_name }}</p>
      <div class="book-meta">
        <span class="book-category">{{ book.category }}</span>
        <span class="book-year">{{ book.published_year }}</span>
        <span class="book-pages">{{ book.page_count }} sayfa</span>
      </div>
      <button class="add-to-cart-button" @click.stop="addToCart">
        <span class="material-icons">shopping_cart</span>
        Sepete Ekle
      </button>
    </div>
  </div>
</template>

<style scoped>
.book-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background-color: white;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--neutral-200);
}

.book-card.grid {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.book-card.list {
  display: flex;
  flex-direction: row;
  height: 250px;
  margin-bottom: 1rem;
}

.book-card.hovered {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-100);
}

.book-image-container {
  position: relative;
  overflow: hidden;
}

.book-card.grid .book-image-container {
  height: 250px;
}

.book-card.list .book-image-container {
  width: 150px;
  min-width: 150px;
  height: 100%;
}

.book-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card.hovered .book-image {
  transform: scale(0.5);
}

.book-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--gradient-primary);
  color: white;
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 8px 0 0 0;
  box-shadow: var(--shadow-md);
  z-index: 2;
}

.favorite-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: white;
  border: none;
  color: var(--secondary-200);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  z-index: 2;
}

.favorite-button:hover {
  transform: scale(1.1);
  background-color: var(--secondary-100);
  color: white;
}

.favorite-button span[class*="favorite"]:not([class*="border"]) {
  color: var(--secondary-200);
  background-color: var(--secondary-100);
}

.favorite-button:hover span[class*="favorite"]:not([class*="border"]) {
  color: white;
  background-color: var(--secondary-100);
}

.favorite-button .material-icons {
  font-size: 1.5rem;
}

.book-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.5rem;
  z-index: 1;
}

.book-info {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: linear-gradient(to bottom, var(--neutral-100), white);
}

.book-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.book-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-300);
  line-height: 1.4;
}

.add-to-cart-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
  margin-top: auto;
}

.add-to-cart-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.add-to-cart-button:active {
  transform: translateY(0);
}

.book-price-mobile {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-200);
  white-space: nowrap;
  background-color: var(--primary-100);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
}

.book-author {
  margin: 0;
  color: var(--neutral-800);
  font-size: 1rem;
  font-weight: 500;
}

.book-description {
  margin: 0;
  margin-right: 60px;
  font-size: 0.9rem;
  line-height: 1.5;
  color: white;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.book-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--neutral-200);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--neutral-600);
  font-size: 0.9rem;
}

.meta-item .material-icons {
  font-size: 1.1rem;
  color: var(--primary-100);
}

.book-category, .book-year, .book-pages {
  background-color: var(--neutral-200);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--neutral-800);
}

.book-category {
  background-color: var(--primary-100);
  color: white;
}

.book-year {
  background-color: var(--secondary-100);
  color: white;
}

.book-pages {
  background-color: var(--accent-100);
  color: white;
}

@media (max-width: 768px) {
  .book-badge {
    display: none;
  }
}
</style>