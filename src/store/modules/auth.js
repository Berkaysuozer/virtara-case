import { authService } from '@/services/auth'

export default {
  namespaced: true,
  state: {
    currentUser: null,
    isAuthenticated: false
  },
  mutations: {
    SET_CURRENT_USER(state, user) {
      state.currentUser = user
      state.isAuthenticated = !!user
    }
  },
  actions: {
    initializeAuth({ commit }) {
      const user = authService.getCurrentUser()
      commit('SET_CURRENT_USER', user)
    },
    async register({ commit }, user) {
      try {
        const registeredUser = await authService.register(user)
        commit('SET_CURRENT_USER', registeredUser)
        return registeredUser
      } catch (error) {
        throw error
      }
    },
    async login({ commit }, credentials) {
      try {
        const user = await authService.login(credentials)
        commit('SET_CURRENT_USER', user)
        return user
      } catch (error) {
        throw error
      }
    },
    async logout({ commit }) {
      authService.logout()
      commit('SET_CURRENT_USER', null)
    },
    async resetPassword(_, { email, newPassword }) {
      return await authService.resetPassword(email, newPassword)
    }
  },
  getters: {
    currentUser: state => state.currentUser,
    isAuthenticated: state => state.isAuthenticated
  }
}