<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import Modal from '../components/Modal.vue'
import { useToast } from '../services/toast'
import { useFormatters } from '../mixins/formatter'
import { useI18n } from 'vue-i18n'

const store = useStore()
const user = computed(() => store.getters['auth/currentUser'])
const cartItemsRef = ref([])
const { currencyFormatter } = useFormatters()
const { t } = useI18n()

onMounted(() => {
  if (user.value?.email) {
    store.dispatch('cart/initializeCart', user.value.email)
  }
})

const cartItems = computed(() => store.getters['cart/getCartItems'](user.value?.email) || [])

const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.usd_price * item.quantity)
  }, 0)
})

const updateQuantity = (item, change) => {
  if (!user.value) return
  const newQuantity = Math.max(1, item.quantity + change)
  store.dispatch('cart/updateQuantity', { userEmail: user.value.email, bookId: item.id, quantity: newQuantity })
}

const removeFromCart = (item) => {
  if (!user.value) return
  store.dispatch('cart/removeFromCart', { userEmail: user.value.email, bookId: item.id })
}

const showConfirmModal = ref(false)
const toast = useToast()

const checkout = () => {
  if (!user.value) return
  showConfirmModal.value = true
}

const handleConfirmCheckout = () => {
  store.dispatch('cart/clearCart', user.value.email)
  cartItemsRef.value = []
  showConfirmModal.value = false
  toast.success(t('cart.orderSuccess'))
}

const handleCancelCheckout = () => {
  showConfirmModal.value = false
}
</script>

<template>
  <div class="cart-view">
    <div class="cart-header">
      <h1>{{ $t('cart.myCart') }}</h1>
      <p v-if="cartItems.length === 0" class="empty-message">
        {{ $t('cart.emptyCart') }}
      </p>
    </div>
    
    <div class="cart-content" v-if="cartItems.length > 0">
      <div class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <img :src="item.image" :alt="item.book_name_tr" class="item-image">
          
          <div class="item-details">
            <h3>{{ item.book_name_tr }}</h3>
            <p class="item-author">{{ item.author_name }}</p>
            <p class="item-price">{{ currencyFormatter(item.usd_price) }}</p>
          </div>
          
          <div class="item-controls">
            <div class="quantity-controls">
              <button @click="updateQuantity(item, -1)" class="quantity-btn">
                <span class="material-icons">remove</span>
              </button>
              <span class="quantity">{{ item.quantity }}</span>
              <button @click="updateQuantity(item, 1)" class="quantity-btn">
                <span class="material-icons">add</span>
              </button>
            </div>
            
            <button @click="removeFromCart(item)" class="remove-btn">
              <span class="material-icons">delete</span>
            </button>
          </div>
          
          <div class="item-total">
            {{ currencyFormatter(item.usd_price * item.quantity) }}
          </div>
        </div>
      </div>
      
      <div class="cart-summary">
        <div class="summary-content">
          <h2>{{ $t('cart.orderSummary') }}</h2>
          <div class="summary-row">
            <span>{{ $t('cart.total') }}</span>
            <span class="total-price">{{ currencyFormatter(totalPrice) }}</span>
          </div>
          <button @click="checkout" class="checkout-btn">
            <span class="material-icons">shopping_cart_checkout</span>
            {{ $t('cart.completeOrder') }}
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <Modal
    :is-open="showConfirmModal"
    :title="$t('cart.orderConfirmation')"
    :message="$t('cart.confirmOrderMessage')"
    @confirm="handleConfirmCheckout"
    @cancel="handleCancelCheckout"
  />
</template>

<style scoped>
.cart-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.cart-header {
  margin-bottom: 2rem;
  text-align: center;
}

.cart-header h1 {
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

.cart-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.cart-items {
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto;
  gap: 1.5rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--neutral-200);
  align-items: center;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details h3 {
  font-size: 1.1rem;
  color: var(--primary-300);
  margin-bottom: 0.5rem;
}

.item-author {
  color: var(--neutral-600);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.item-price {
  font-weight: 600;
  color: var(--primary-200);
}

.item-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--neutral-100);
  padding: 0.25rem;
  border-radius: 8px;
}

.quantity-btn {
  background: white;
  border: none;
  color: var(--primary-300);
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-btn:hover {
  background: var(--primary-100);
  color: white;
}

.quantity {
  min-width: 2rem;
  text-align: center;
  font-weight: 600;
  background: var(--primary-100);
}

.remove-btn {
  background: var(--neutral-100);
  border: none;
  color: var(--secondary-200);
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: var(--secondary-100);
  color: white;
}

.item-total {
  font-weight: 600;
  color: var(--primary-300);
  font-size: 1.1rem;
}

.cart-summary {
  position: sticky;
  top: 2rem;
}

.summary-content {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
}

.summary-content h2 {
  font-size: 1.5rem;
  color: var(--primary-300);
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.total-price {
  font-weight: 600;
  color: var(--primary-300);
  font-size: 1.25rem;
}

.checkout-btn {
  width: 100%;
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.checkout-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .cart-view {
    padding: 1rem;
  }
  
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-item {
    grid-template-columns: 80px 1fr;
    grid-template-areas:
      "image details"
      "image controls"
      "total total";
    padding: 1rem;
  }
  
  .item-image {
    grid-area: image;
    width: 80px;
    height: 120px;
  }
  
  .item-details {
    grid-area: details;
  }
  
  .item-controls {
    grid-area: controls;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
  
  .item-total {
    grid-area: total;
    text-align: right;
    padding-top: 1rem;
    border-top: 1px solid var(--neutral-200);
  }
}
</style>