import { useToast } from './toast'

const CART_KEY = 'cart'
const toast = useToast()

export const cartService = {
  getCartItems(userEmail) {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '{}')
    return cart[userEmail] || []
  },

  addToCart(userEmail, book) {
    if (!userEmail) return

    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '{}')
    const userCart = cart[userEmail] || []

    const existingItem = userCart.find(item => item.id === book.id)
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1
    } else {
      userCart.push({ ...book, quantity: 1 })
    }

    cart[userEmail] = userCart
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
    toast.success(`Başarıyla Sepete Eklendi`)
    return userCart
  },

  removeFromCart(userEmail, bookId) {
    if (!userEmail) return

    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '{}')
    const userCart = cart[userEmail] || []

    const itemToRemove = userCart.find(item => item.id === bookId)
    cart[userEmail] = userCart.filter(item => item.id !== bookId)
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
    if (itemToRemove) {
        toast.success(`Ürün Sepetten Çıkartıldı`)
    }
    return cart[userEmail]
  },

  updateQuantity(userEmail, bookId, quantity) {
    if (!userEmail) return

    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '{}')
    const userCart = cart[userEmail] || []

    const item = userCart.find(item => item.id === bookId)
    if (item) {
      item.quantity = quantity
      if (quantity <= 0) {
        cart[userEmail] = userCart.filter(item => item.id !== bookId)
        toast.success(`${item.title} removed from cart`)
      } else {
        toast.success(` Ürün sayısı ${quantity}'e güncellendi`)
      }
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
    }
    return cart[userEmail]
  },

  clearCart(userEmail) {
    if (!userEmail) return

    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '{}')
    cart[userEmail] = []
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }
}