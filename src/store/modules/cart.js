import { useToast } from '../../services/toast'

const CART_KEY = 'cart'
const toast = useToast()

const state = {
  cartItems: {}
}

const getters = {
  getCartItems: (state) => (userEmail) => {
    return state.cartItems[userEmail] || []
  }
}

const mutations = {
  SET_CART_ITEMS(state, { userEmail, items }) {
    state.cartItems = { ...state.cartItems, [userEmail]: items }
    localStorage.setItem(CART_KEY, JSON.stringify(state.cartItems))
  }
}

const actions = {
  initializeCart({ commit }, userEmail) {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '{}')
    commit('SET_CART_ITEMS', { userEmail, items: cart[userEmail] || [] })
  },

  addToCart({ commit, state }, { userEmail, book }) {
    if (!userEmail) return

    const userCart = state.cartItems[userEmail] || []
    const existingItem = userCart.find(item => item.id === book.id)

    let updatedCart
    if (existingItem) {
      updatedCart = userCart.map(item =>
        item.id === book.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    } else {
      updatedCart = [...userCart, { ...book, quantity: 1 }]
    }

    commit('SET_CART_ITEMS', { userEmail, items: updatedCart })
    toast.success('Başarıyla Sepete Eklendi')
    return updatedCart
  },

  removeFromCart({ commit, state }, { userEmail, bookId }) {
    if (!userEmail) return

    const userCart = state.cartItems[userEmail] || []
    const updatedCart = userCart.filter(item => item.id !== bookId)

    commit('SET_CART_ITEMS', { userEmail, items: updatedCart })
    toast.success('Ürün Sepetten Çıkartıldı')
    return updatedCart
  },

  updateQuantity({ commit, state }, { userEmail, bookId, quantity }) {
    if (!userEmail) return

    const userCart = state.cartItems[userEmail] || []
    const updatedCart = userCart.map(item =>
      item.id === bookId ? { ...item, quantity } : item
    )

    commit('SET_CART_ITEMS', { userEmail, items: updatedCart })
    return updatedCart
  },

  clearCart({ commit }, userEmail) {
    commit('SET_CART_ITEMS', { userEmail, items: [] })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}