import { useToast } from '@/services/toast'

export default {
  namespaced: true,
  state: {
    favorites: {}
  },
  mutations: {
    SET_FAVORITES(state, { userEmail, favorites }) {
      state.favorites = { ...state.favorites, [userEmail]: favorites }
      localStorage.setItem('favorites', JSON.stringify(state.favorites))
    },
    ADD_FAVORITE(state, { userEmail, bookId }) {
      const userFavorites = state.favorites[userEmail] || []
      userFavorites.push(bookId)
      state.favorites[userEmail] = userFavorites
      localStorage.setItem('favorites', JSON.stringify(state.favorites))
    },
    REMOVE_FAVORITE(state, { userEmail, bookId }) {
      const userFavorites = state.favorites[userEmail] || []
      const index = userFavorites.indexOf(bookId)
      if (index > -1) {
        userFavorites.splice(index, 1)
        state.favorites[userEmail] = userFavorites
        localStorage.setItem('favorites', JSON.stringify(state.favorites))
      }
    }
  },
  actions: {
    initializeFavorites({ commit }, userEmail) {
      const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '{}')
      commit('SET_FAVORITES', { userEmail, favorites: storedFavorites[userEmail] || [] })
      state.favorites = storedFavorites
    },
    toggleFavorite({ commit, rootGetters, state }, book) {
      const userEmail = rootGetters['auth/currentUser']?.email
      if (!userEmail) {
        const { error } = useToast()
        error('Favorilere eklemek için giriş yapmalısınız')
        return
      }

      const { success } = useToast()
      const userFavorites = state.favorites[userEmail] || []
      const isFavorite = userFavorites.includes(book.id)

      if (isFavorite) {
        commit('REMOVE_FAVORITE', { userEmail, bookId: book.id })
        success('Kitap favorilerden çıkarıldı')
      } else {
        commit('ADD_FAVORITE', { userEmail, bookId: book.id })
        success('Kitap favorilere eklendi')
      }
    },
    clearFavorites({ commit }, userEmail) {
      commit('SET_FAVORITES', { userEmail, favorites: [] })
    }
  },
  getters: {
    favorites: (state) => (userEmail) => state.favorites[userEmail] || [],
    isFavorite: (state) => (userEmail, bookId) => (state.favorites[userEmail] || []).includes(bookId)
  }
}