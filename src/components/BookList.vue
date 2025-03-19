<script setup>
import { ref, computed, onMounted } from 'vue'
import BookCard from './BookCard.vue'
import FilterPanel from './FilterPanel.vue'

const props = defineProps({
  books: {
    type: Array,
    required: true
  }
})

const viewMode = ref('grid')

const filters = ref({
  category: '',
  yearRange: [0, 2023],
  pageCount: [0, 2000],
  searchQuery: ''
})

const filteredBooks = computed(() => {
  return props.books.filter(book => {
    if (filters.value.category && book.category !== filters.value.category) {
      return false
    }
    
    if (book.published_year < filters.value.yearRange[0] || 
        book.published_year > filters.value.yearRange[1]) {
      return false
    }
    
    if (book.page_count < filters.value.pageCount[0] || 
        book.page_count > filters.value.pageCount[1]) {
      return false
    }
    
    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase()
      return book.book_name_tr.toLowerCase().includes(query) || 
            book.book_name_en.toLowerCase().includes(query) || 
             book.author_name.toLowerCase().includes(query) ||
             book.description_tr.toLowerCase().includes(query)
    }
    
    return true
  })
})

const currentPage = ref(1)
const itemsPerPage = 10
const totalPages = computed(() => Math.ceil(filteredBooks.value.length / itemsPerPage))

const paginatedBooks = computed(() => {
  const endIndex = currentPage.value * itemsPerPage
  return filteredBooks.value.slice(0, endIndex)
})

const isLoading = ref(false)

const loadMoreBooks = () => {
  if (currentPage.value < totalPages.value && !isLoading.value) {
    isLoading.value = true
    setTimeout(() => {
      currentPage.value++
      isLoading.value = false
    }, 500)
  }
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && currentPage.value < totalPages.value) {
      loadMoreBooks()
    }
  }, { threshold: 0.1 })
  
  const loadMoreTrigger = document.querySelector('.load-more-trigger')
  if (loadMoreTrigger) {
    observer.observe(loadMoreTrigger)
  }
  
  return () => {
    if (loadMoreTrigger) {
      observer.unobserve(loadMoreTrigger)
    }
  }
})
</script>

<template>
  <div class="book-list-container">
    <div class="book-list-layout">
      <FilterPanel 
        :books="books"
        v-model:filters="filters"
      />
      
      <div class="books-content">
        <!-- View Controls -->
        <div class="content-header">
          <div class="results-count">
            {{ filteredBooks.length }} kitap bulundu
          </div>
          <div class="view-controls">
            <button 
              @click="viewMode = 'grid'" 
              :class="['view-button', { active: viewMode === 'grid' }]"
            >
              <span class="material-icons">grid_view</span>
            </button>
            <button 
              @click="viewMode = 'list'" 
              :class="['view-button', { active: viewMode === 'list' }]"
            >
              <span class="material-icons">view_list</span>
            </button>
          </div>
        </div>
        
        <!-- Books Grid/List -->
        <div class="books-container" :class="viewMode">
          <BookCard 
            v-for="book in paginatedBooks" 
            :book="book"
            :viewMode="viewMode"
            :key="book.id"
            class="book-item"
          />
        </div>
        
        <!-- Loading Indicator -->
        <div v-if="isLoading" class="loading-indicator">
          <span class="material-icons loading-icon">autorenew</span>
          <span>Yükleniyor...</span>
        </div>
        
        <!-- Book Counter -->
        <div class="book-counter" v-if="filteredBooks.length > 0">
          {{ paginatedBooks.length }} / {{ filteredBooks.length }} kitap gösteriliyor
        </div>
        
        <!-- Load More Trigger for Infinite Scroll -->
        <div v-if="currentPage < totalPages" class="load-more-trigger"></div>
        
        <!-- No Results Message -->
        <div v-if="filteredBooks.length === 0" class="no-results">
          <span class="material-icons no-results-icon">search_off</span>
          <p>Arama kriterlerinize uygun kitap bulunamadı.</p>
          <button @click="resetFilters" class="reset-button">Filtreleri Sıfırla</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book-list-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

.book-list-layout {
  display: flex;
  gap: 2rem;
}

.search-bar {
  margin-bottom: 1.5rem;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 10px;
  color: var(--neutral-600);
  font-size: 1.25rem;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid var(--neutral-300);
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: white;
  color: var(--neutral-900);
}

.search-input:focus {
  border-color: var(--primary-200);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  outline: none;
}


.range-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.range-input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 1px solid var(--neutral-300);
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: white;
  color: var(--neutral-900);
}

.range-input:focus {
  border-color: var(--primary-200);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  outline: none;
}

.range-separator {
  color: var(--neutral-600);
  font-weight: 500;
}

.reset-button {
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: var(--neutral-200);
  color: var(--neutral-800);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  margin-top: 1rem;
}

.reset-button:hover {
  background-color: var(--neutral-300);
  transform: translateY(-1px);
}

.reset-button:active {
  transform: translateY(0);
}

.books-content {
  flex: 1;
  min-width: 0; 
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  border: 1px solid var(--neutral-200);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--neutral-300);
  background: linear-gradient(to right, var(--neutral-100), white);
  padding: 1rem 1.5rem;
  border-radius: 8px;
}

.results-count {
  font-size: 0.95rem;
  color: var(--primary-300);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.results-count::before {
  content: '📚';
  font-size: 1.2rem;
}

.view-controls {
  display: flex;
  gap: 0.5rem;
}

.view-button {
  background-color: var(--neutral-200);
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}

.view-button:hover {
  background-color: var(--neutral-300);
  transform: translateY(-2px);
}

.view-button.active {
  background-color: var(--primary-100);
  color: white;
  box-shadow: var(--shadow-md);
}

.books-container {
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
}

.books-container.grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.books-container.list {
  grid-template-columns: 1fr;
  gap: 1rem;
}

.book-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.book-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.load-more-trigger {
  height: 20px;
  margin: 2rem 0;
}

.no-results {
  text-align: center;
  padding: 3rem 2rem;
  background-color: var(--neutral-100);
  border-radius: 12px;
  margin-top: 2rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.no-results-icon {
  font-size: 3rem;
  color: var(--neutral-500);
}

@media (max-width: 992px) {
  .book-list-layout {
    flex-direction: column;
  }
  
  
  .books-container.grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 576px) {
  .books-container.grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .range-inputs {
    flex-direction: column;
    align-items: stretch;
  }
  
  .range-separator {
    align-self: center;
  }
}
</style>