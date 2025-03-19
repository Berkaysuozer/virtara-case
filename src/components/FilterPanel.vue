<script setup>
import { ref, computed, watch } from 'vue'
import { debounce } from 'lodash-es'

const props = defineProps({
  books: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:filters'])

const filters = ref({
  category: '',
  yearRange: [0, 2023],
  pageCount: [0, 2000],
  searchQuery: ''
})

const categories = computed(() => {
  const uniqueCategories = new Set(props.books.map(book => book.category))
  return ['', ...Array.from(uniqueCategories)]
})

const yearRange = computed(() => {
  const years = props.books.map(book => book.published_year)
  return [Math.min(...years), Math.max(...years)]
})

const pageCountRange = computed(() => {
  const pageCounts = props.books.map(book => book.page_count)
  return [Math.min(...pageCounts), Math.max(...pageCounts)]
})

watch(() => props.books, () => {
  filters.value.yearRange = [yearRange.value[0], yearRange.value[1]]
  filters.value.pageCount = [pageCountRange.value[0], pageCountRange.value[1]]
}, { immediate: true })

const debouncedEmit = debounce((newFilters) => {
  emit('update:filters', { ...newFilters })
}, 300, { leading: false, trailing: true })

watch(filters, (newFilters) => {
  debouncedEmit(newFilters)
}, { deep: true, immediate: true })

const resetFilters = () => {
  filters.value = {
    category: '',
    yearRange: [yearRange.value[0], yearRange.value[1]],
    pageCount: [pageCountRange.value[0], pageCountRange.value[1]],
    searchQuery: ''
  }
}
</script>
 
<template>
  <div class="filters-sidebar">
    <h3 class="filters-title">Filtreler</h3>
    
    <div class="search-bar">
      <div class="search-input-wrapper">
        <span class="material-icons search-icon">search</span>
        <input 
          type="text" 
          v-model="filters.searchQuery" 
          placeholder="Kitap veya yazar ara..."
          class="search-input"
        >
      </div>
    </div>
    
    <div class="filter-section">
      <h4 class="filter-section-title">Kategori</h4>
      <select id="category" v-model="filters.category" class="filter-select">
        <option v-for="category in categories" :key="category" :value="category">
          {{ category || 'Tüm Kategoriler' }}
        </option>
      </select>
    </div>
    
    <div class="filter-section">
      <h4 class="filter-section-title">Yayın Yılı</h4>
      <div class="range-inputs">
        <input 
          type="number" 
          v-model.number="filters.yearRange[0]" 
          :min="yearRange[0]" 
          :max="yearRange[1]"
          class="range-input"
        >
        <span class="range-separator">-</span>
        <input 
          type="number" 
          v-model.number="filters.yearRange[1]" 
          :min="yearRange[0]" 
          :max="yearRange[1]"
          class="range-input"
        >
      </div>
    </div>
    
    <div class="filter-section">
      <h4 class="filter-section-title">Sayfa Sayısı</h4>
      <div class="range-inputs">
        <input 
          type="number" 
          v-model.number="filters.pageCount[0]" 
          :min="pageCountRange[0]" 
          :max="pageCountRange[1]"
          class="range-input"
        >
        <span class="range-separator">-</span>
        <input 
          type="number" 
          v-model.number="filters.pageCount[1]" 
          :min="pageCountRange[0]" 
          :max="pageCountRange[1]"
          class="range-input"
        >
      </div>
    </div>
    
    <button @click="resetFilters" class="reset-button">
      <span class="material-icons">refresh</span>
      Filtreleri Sıfırla
    </button>
  </div>
</template>

<style scoped>
.filters-sidebar {
  width: 280px;
  flex-shrink: 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 1rem;
  transition: all 0.3s ease;
  border: 1px solid var(--neutral-200);
  background: linear-gradient(to bottom, white, var(--neutral-100));
}

.filters-title {
  font-size: 1.25rem;
  color: var(--primary-300);
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: 600;
  border-bottom: 1px solid var(--neutral-300);
  padding-bottom: 0.75rem;
  text-align: center;
}

.filter-section {
  margin-bottom: 1.5rem;
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.filter-section-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--primary-200);
  margin-bottom: 0.75rem;
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

.filter-select {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--neutral-300);
  border-radius: 8px;
  background-color: white;
  font-size: 0.95rem;
  color: var(--neutral-900);
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}

.filter-select:focus {
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

@media (max-width: 992px) {
  .filters-sidebar {
    position: static;
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 576px) {
  .filters-sidebar {
    padding: 1rem;
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