<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import BookCard from '../components/BookCard.vue'
import books from '../data/books.json'

const store = useStore()
const user = computed(() => store.getters['auth/currentUser'])
const favoriteIds = computed(() => {
  if (!user.value) return []
  return store.getters['favorites/favorites'](user.value.email)
})

const favoriteBooks = computed(() => {
  if (!user.value) return []
  return favoriteIds.value
    .map(id => books.find(book => book.id === id))
    .filter(book => book !== undefined)
})

const addToCart = (book) => {
  if (!user.value) return
  store.dispatch('cart/addToCart', { userEmail: user.value.email, book })
}

</script>

<template>
  <div class="favorites-view">
    <div class="favorites-header">
      <h1>{{ $t('favorites.myFavorites') }}</h1>
      <p v-if="favoriteBooks.length === 0" class="empty-message">
        {{ $t('favorites.noFavorites') }}
      </p>
    </div>
    
    <div class="favorites-grid">
      <BookCard
        v-for="book in favoriteBooks"
        :key="book.id"
        :book="book"
        view-mode="grid"
        @add-to-cart="addToCart"
      />
    </div>
  </div>
</template>

<style scoped>
.favorites-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.favorites-header {
  margin-bottom: 2rem;
  text-align: center;
}

.favorites-header h1 {
  font-size: 2.5rem;
  color: var(--primary-300);
  margin-bottom: 1rem;
}

.empty-message {
  font-size: 1.2rem;
  color: var(--neutral-600);
  text-align: center;
  padding: 2rem;
  background: var(--neutral-100);
  border-radius: 12px;
  margin-top: 2rem;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .favorites-view {
    padding: 1rem;
  }
  
  .favorites-header h1 {
    font-size: 2rem;
  }
  
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
}
</style>