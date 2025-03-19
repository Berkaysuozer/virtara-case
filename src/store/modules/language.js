const state = {
  selectedLanguage: localStorage.getItem('language') || 'tr'
}

const getters = {
  currentLanguage: state => state.selectedLanguage
}

const mutations = {
  SET_LANGUAGE(state, language) {
    state.selectedLanguage = language
    localStorage.setItem('language', language)
  }
}

const actions = {
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}