<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import CarouselBookCard from './CarouselBookCard.vue'

const props = defineProps({
  books: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Öne Çıkan Kitaplar'
  }
})

const currentSlide = ref(0)
const slideCount = ref(0)
const slideWidth = ref(0)
const carouselContainer = ref(null)
const autoplayInterval = ref(null)

const calculateSlidesPerView = () => {
  if (!carouselContainer.value) return 1
  
  const containerWidth = carouselContainer.value.offsetWidth
  if (containerWidth >= 1200) return 4
  if (containerWidth >= 900) return 3
  if (containerWidth >= 600) return 2
  return 1
}

const slidesPerView = ref(1)

const updateSlideMetrics = () => {
  if (!carouselContainer.value) return
  
  slidesPerView.value = calculateSlidesPerView()
  slideCount.value = Math.ceil(props.books.length / slidesPerView.value)
  slideWidth.value = carouselContainer.value.offsetWidth
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slideCount.value
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slideCount.value) % slideCount.value
}

const goToSlide = (index) => {
  currentSlide.value = index
}

const startAutoplay = () => {
  stopAutoplay()
  autoplayInterval.value = setInterval(() => {
    nextSlide()
  }, 5000) 
}

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
    autoplayInterval.value = null
  }
}

const handleResize = () => {
  updateSlideMetrics()
  if (currentSlide.value >= slideCount.value) {
    currentSlide.value = 0
  }
}

onMounted(() => {
  updateSlideMetrics()
  startAutoplay()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  stopAutoplay()
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="book-carousel">
    <h2 class="carousel-title">{{ title }}</h2>
    
    <div class="carousel-container" ref="carouselContainer">
      <button @click="prevSlide" class="carousel-control prev">
        <span class="material-icons">chevron_left</span>
      </button>
      
      <div class="carousel-track-container">
        <div 
          class="carousel-track" 
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div 
            v-for="(book, index) in books" 
            :key="book.book_name_en"
            class="carousel-slide"
            :style="{ width: `${100 / slidesPerView}%` }"
          >
            <CarouselBookCard 
              :book="book"
            />
          </div>
        </div>
      </div>
      
      <button @click="nextSlide" class="carousel-control next">
        <span class="material-icons">chevron_right</span>
      </button>
    </div>
    
    <div class="carousel-indicators">
      <button 
        v-for="n in slideCount" 
        :key="n-1"
        @click="goToSlide(n-1)"
        :class="['indicator', { active: currentSlide === n-1 }]"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.book-carousel {
  margin-bottom: 3rem;
}

.carousel-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--neutral-900);
}

.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
}

.carousel-track-container {
  width: 100%;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-slide {
  flex-shrink: 0;
  padding: 0 1rem;
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--neutral-100);
  border: none;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: background-color 0.3s ease;
}

.carousel-control:hover {
  background-color: var(--primary-100);
  color: white;
}

.carousel-control.prev {
  left: -20px;
}

.carousel-control.next {
  right: -20px;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--neutral-300);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.indicator.active {
  background-color: var(--primary-100);
}

@media (max-width: 768px) {
  .carousel-control {
    width: 30px;
    height: 30px;
  }
  
  .carousel-control.prev {
    left: -15px;
  }
  
  .carousel-control.next {
    right: -15px;
  }
}
</style>