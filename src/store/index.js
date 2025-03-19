import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import currency from './modules/currency'
import language from './modules/language'
import auth from './modules/auth'
import favorites from './modules/favorites'
import cart from './modules/cart'

const store = createStore({
  modules: {
    currency,
    language,
    auth,
    favorites,
    cart
  },
  plugins: [
    createPersistedState({
      paths: ['auth.currentUser', 'auth.isAuthenticated', 'cart.cartItems', 'favorites.favorites', 'currency.selectedCurrency', 'language.selectedLanguage']
    })
  ]
})

export default store