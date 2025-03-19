<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useStore } from 'vuex' 

const router = useRouter()
const store = useStore() 

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})

const navigateToBook = () => {
  router.push(`/book/${props.book.id}`)
}

const bookName = computed(() => {
  const language = store.state.language.selectedLanguage
  return language === 'en' ? props.book.book_name_en : props.book.book_name_tr
})
</script>

<template>
  <div 
    class="carousel-book-card"
    @click="navigateToBook"
  >
    <div class="book-image-container">
      <img 
        :src="book.image" 
        :alt="bookName"
        class="book-image"
      />
      <div class="book-title-overlay">
        <h3>{{ bookName }}</h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel-book-card {
  cursor: pointer;
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.carousel-book-card:hover {
  transform: scale(1.05);
}

.book-image-container {
  position: relative;
  width: 100%;
  padding-top: 150%;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
}

.book-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 1rem;
  transition: opacity 0.3s ease;
}

.book-title-overlay h3 {
  color: white;
  margin: 0;
  font-size: 1rem;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>