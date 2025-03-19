<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import books from '../data/books.json'
import { useFormatters } from '../mixins/formatter'
import { useStore } from 'vuex' 

const route = useRoute()
const store = useStore() 
const bookId = computed(() => Number(route.params.id))
const book = computed(() => books.find(b => b.id === bookId.value))
const { currencyFormatter } = useFormatters()

const bookName = computed(() => {
  const language = store.state.language.selectedLanguage
  return language === 'en' ? book.value?.book_name_en : book.value?.book_name_tr
})

const rating = ref(0)
const review = ref('')
const reviews = ref([])

const relatedBooks = computed(() => {
  return books.filter(b => 
    (b.category === book.value?.category || b.author_name === book.value?.author_name) && 
    b.id !== book.value?.id
  ).slice(0, 4)
})

const isFavorite = computed(() => {
  if (!user.value) return false
  return store.getters['favorites/isFavorite'](user.value.email, book.value?.id)
})
const isInCart = ref(false)
const user = computed(() => store.getters['auth/currentUser'])

const checkCartStatus = () => {
  if (user.value && book.value) {
    const cartItems = store.getters['cart/getCartItems'](user.value.email)
    isInCart.value = cartItems.some(item => item.id === book.value.id)
  }
}

const addToCart = () => {
  if (user.value && book.value) {
    store.dispatch('cart/addToCart', { userEmail: user.value.email, book: book.value })
    checkCartStatus()
  }
}

const toggleFavorite = () => {
  if (book.value) {
    store.dispatch('favorites/toggleFavorite', book.value)
  }
}

onMounted(() => {
  checkCartStatus()
})

const submitReview = () => {
  if (rating.value && review.value) {
    reviews.value.push({
      id: Date.now(),
      rating: rating.value,
      content: review.value,
      date: new Date().toISOString()
    })
    rating.value = 0
    review.value = ''
  }
}

const shareOnSocial = (platform) => {
  const url = window.location.href
  const text = `Check out ${book.value?.book_name_en} by ${book.value?.author_name}`
  
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`
  }
  
  window.open(shareUrls[platform], '_blank')
}
</script>

<template>
  <div class="book-detail-container" v-if="book">
    <div class="book-header">
      <div class="book-image">
        <img :src="book.image" :alt="bookName">
        <div class="book-badges">
          <span class="category-badge">{{ book.category }}</span>
          <span v-if="isFavorite" class="favorite-badge">❤️</span>
        </div>
      </div>
      <div class="book-info">
        <h1>{{ bookName }}</h1>
        <h2>{{ book.author_name }}</h2>
        
        <div class="book-price">
          <span class="price">{{ currencyFormatter(book.usd_price) }}</span>
          <span class="discount" v-if="book.discount">%{{ book.discount }} İndirim</span>
        </div>
        
        <div class="book-actions">
          <button 
            class="favorite-btn" 
            :class="{ active: isFavorite }" 
            @click="toggleFavorite"
          >
            <span class="icon">{{ isFavorite ? '❤️' : '🤍' }}</span>
            {{ isFavorite ? $t('bookDetail.favoriteRemove') : $t('bookDetail.favoriteAdd') }}
          </button>
          
          <button 
            class="purchase-btn" 
            :class="{ 'in-cart': isInCart }" 
            @click="addToCart"
            :disabled="isInCart"
          >
            {{ isInCart ? $t('bookDetail.addedToCart') : $t('bookDetail.addToCart') }}
          </button>
        </div>
        
        <div class="share-section">
          <h3>{{ $t('bookDetail.share') }}</h3>
          <div class="share-buttons">
            <button @click="shareOnSocial('twitter')" class="share-btn twitter">
              <span class="icon">𝕏</span>
            </button>
            <button @click="shareOnSocial('facebook')" class="share-btn facebook">
              <span class="icon">f</span>
            </button>
            <button @click="shareOnSocial('linkedin')" class="share-btn linkedin">
              <span class="icon">in</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="book-content">
      <div class="content-tabs">
        <div class="tab active">{{ $t('bookDetail.aboutBook') }}</div>
        <div class="tab">{{ $t('bookDetail.details') }}</div>
        <div class="tab">{{ $t('bookDetail.reviews') }} ({{ reviews.length }})</div>
      </div>
      
      <div class="tab-content">
        <div class="book-description">
          <p>{{ book.description_tr }}</p>
        </div>
      </div>

      <div class="book-details">
        <h3>{{ $t('bookDetail.details') }}</h3>
        <div class="meta-info">
          <div class="meta-item" v-for="(value, key) in book.meta_data" :key="key">
            <span class="meta-label">{{ key }}</span>
            <span class="meta-value">{{ value }}</span>
          </div>
        </div>
      </div>

      <div class="book-reviews">
        <h3>{{ $t('bookDetail.reviews') }}</h3>
        <div class="review-form">
          <h4>{{ $t('bookDetail.writeReview') }}</h4>
          <div class="rating-input">
            <span 
              v-for="star in 5" 
              :key="star"
              @click="rating = star"
              :class="{ active: star <= rating }"
              class="star"
            >
              ★
            </span>
          </div>
          <textarea 
            v-model="review" 
            placeholder="Bu kitap hakkında düşüncelerinizi paylaşın..."
          ></textarea>
          <button @click="submitReview" :disabled="!rating || !review" class="submit-review-btn">
            {{ $t('bookDetail.submitReview') }}
          </button>
        </div>

        <div class="reviews-list">
          <div v-if="reviews.length === 0" class="no-reviews">
            {{ $t('bookDetail.noReviews') }}
          </div>
          <div v-for="review in reviews" :key="review.id" class="review-item">
            <div class="review-header">
              <div class="review-user">
                <div class="user-avatar">U</div>
                <div class="user-info">
                  <span class="user-name">Kullanıcı</span>
                  <span class="review-date">{{ new Date(review.date).toLocaleDateString() }}</span>
                </div>
              </div>
              <div class="review-rating">
                <span v-for="star in 5" :key="star" class="star" :class="{ active: star <= review.rating }">
                  ★
                </span>
              </div>
            </div>
            <p class="review-content">{{ review.content }}</p>
          </div>
        </div>
      </div>

      <div class="related-books" v-if="relatedBooks.length">
        <h3>{{ $t('bookDetail.similarBooks') }}</h3>
        <div class="related-books-grid">
          <div v-for="relBook in relatedBooks" :key="relBook.id" class="related-book-card">
            <div class="card-image">
              <img :src="relBook.image" :alt="relBook.book_name_tr">
            </div>
            <div class="card-content">
              <h4>{{ relBook.book_name_tr }}</h4>
              <p class="author">{{ relBook.author_name }}</p>
              <p class="price">${{ relBook.usd_price }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  color: var(--text-primary);
  background-color: var(--background-primary);
  line-height: 1.6;
}

.book-detail-container {
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 1.5rem;
}

.book-header {
  display: flex;
  gap: 3rem;
  margin-bottom: 3rem;
  background-color: var(--background-secondary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.book-image {
  flex: 0 0 300px;
  position: relative;
}

.book-image img {
  width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  transition: transform var(--transition-normal);
}

.book-image img:hover {
  transform: scale(1.03);
}

.book-badges {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-badge {
  background-color: var(--accent-tertiary);
  color: var(--text-primary);
  padding: 0.3rem 0.8rem;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.favorite-badge {
  background-color: rgba(15, 52, 96, 0.7);
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}

.book-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.book-info h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.book-info h2 {
  font-size: 1.5rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.book-price {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-primary);
}

.discount {
  background-color: var(--success);
  color: var(--background-secondary);
  padding: 0.3rem 0.8rem;
  border-radius: var(--radius-full);
  font-size: 0.9rem;
  font-weight: 600;
}

.book-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.favorite-btn, .purchase-btn {
  padding: 0.8rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  border: none;
}

.favorite-btn {
  background-color: var(--background-light);
  color: var(--accent-primary);
  border: 2px solid var(--accent-primary);
}

.favorite-btn:hover {
  background-color: rgba(240, 84, 84, 0.1);
}

.favorite-btn.active {
  background-color: rgba(240, 84, 84, 0.15);
  color: var(--accent-primary);
  border-color: var(--accent-primary);
}

.purchase-btn {
  background-color: var(--accent-primary);
  color: var(--background-secondary);
  flex: 1;
}

.purchase-btn:hover {
  background-color: #ff6b6b;
  transform: translateY(-2px);
}

.purchase-btn.in-cart {
  background-color: var(--success);
  cursor: default;
}

.purchase-btn.in-cart:hover {
  transform: none;
  background-color: var(--success);
}

.share-section {
  margin-top: 1.5rem;
}

.share-section h3 {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 0.8rem;
  text-align : left;
}

.share-buttons {
  display: flex;
  gap: 0.8rem;
}

.share-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--background-secondary);
  font-weight: bold;
}

.share-btn:hover {
  transform: translateY(-3px);
}

.share-btn.twitter {
  background-color: #1DA1F2;
}

.share-btn.facebook {
  background-color: #4267B2;
}

.share-btn.linkedin {
  background-color: #0077B5;
}

.book-content {
  background-color: var(--background-secondary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.content-tabs {
  display: flex;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
}

.tab {
  padding: 1rem 1.5rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
}

.tab.active {
  color: var(--accent-primary);
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--accent-primary);
}

.tab:hover {
  color: var(--accent-secondary);
}

.book-description, .book-details, .book-reviews, .related-books {
  margin-bottom: 3rem;
}

.book-description p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.8;
}

h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-weight: 700;
}

h4 {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-weight: 600;
}

.meta-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.meta-item {
  background-color: var(--background-tertiary);
  padding: 1.2rem;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  transition: all var(--transition-fast);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.meta-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.meta-label {
  color: var(--text-tertiary);
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.meta-value {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1.1rem;
}

.review-form {
  background-color: var(--background-tertiary);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.rating-input {
  margin-bottom: 1rem;
}

.star {
  font-size: 1.8rem;
  color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: color var(--transition-fast);
  margin-right: 0.3rem;
}

.star.active {
  color: #FFD700;
}

.star:hover {
  transform: scale(1.2);
}

textarea {
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
  font-family: inherit;
  font-size: 1rem;
  transition: all var(--transition-fast);
  background-color: var(--background-light);
  color: var(--text-primary);
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: var(--accent-tertiary);
  box-shadow: 0 0 0 3px rgba(58, 12, 163, 0.1);
}

.submit-review-btn {
  background-color: var(--accent-tertiary);
  color: var(--text-primary);
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.submit-review-btn:hover:not(:disabled) {
  background-color: #4a0fd3;
  transform: translateY(-2px);
}

.submit-review-btn:disabled {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-tertiary);
  cursor: not-allowed;
}

.no-reviews {
  text-align: center;
  padding: 2rem;
  color: var(--text-tertiary);
  font-style: italic;
  background-color: var(--background-tertiary);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.reviews-list {
  display: grid;
  gap: 1.5rem;
}

.review-item {
  background-color: var(--background-tertiary);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.review-item:hover {
  box-shadow: var(--shadow-md);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.review-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-full);
  background-color: var(--accent-tertiary);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: var(--text-primary);
}

.review-date {
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

.review-content {
  color: var(--text-secondary);
  line-height: 1.6;
  text-align: left;
}

.related-books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem;
}

.related-book-card {
  border-radius: var(--radius-md);
  overflow: hidden;
  background-color: var(--background-tertiary);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.related-book-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.card-image {
  overflow: hidden;
  height: 220px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.related-book-card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 1.2rem;
}

.card-content h4 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-content .author {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.card-content .price {
  color: var(--accent-primary);
  font-weight: 700;
  font-size: 1.1rem;
}

@media (max-width: 900px) {
  .book-header {
    flex-direction: column;
    gap: 2rem;
  }

  .book-image {
    flex: 0 0 auto;
    max-width: 300px;
    margin: 0 auto;
  }
  
  .book-badges {
    flex-direction: row;
    top: 0.5rem;
    left: 0.5rem;
  }
}

@media (max-width: 640px) {
  .book-detail-container {
    margin: 1.5rem auto;
    padding: 0 1rem;
  }
  
  .book-header, .book-content {
    padding: 1.5rem;
    border-radius: var(--radius-md);
  }
  
  .book-info h1 {
    font-size: 2rem;
  }
  
  .book-actions {
    flex-direction: column;
  }
  
  .content-tabs {
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .tab {
    padding: 0.8rem 1.2rem;
    white-space: nowrap;
  }
  
  .meta-info {
    grid-template-columns: 1fr;
  }
  
  .related-books-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  
  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>