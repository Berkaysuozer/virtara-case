 const CURRENCY_UPDATE_INTERVAL = 180000 // 3 dakika
//const CURRENCY_UPDATE_INTERVAL = 1800

export default {
  namespaced: true,
  state: {
    selectedCurrency: JSON.parse(localStorage.getItem('selectedCurrency')) || { key: 'TRY', label: 'Turkish Lira ₺', symbol: '₺' },
    currencies: [
        { key: 'TRY', label: 'Turkish Lira ₺', symbol: '₺', langCode: 'tr-TR' },
        { key: 'EUR', label: 'Euro €', symbol: '€', langCode: 'en-EU' },
        { key: 'USD', label: 'USD $', symbol: '$', langCode: 'en-US' },
        { key: 'JPY', label: 'JPY ¥', symbol: '¥', langCode: 'ja-JP' },
        { key: 'CNY', label: 'CNY ¥', symbol: '¥', langCode: 'zh-CN' },
        { key: 'INR', label: 'INR ₹', symbol: '₹', langCode: 'hi-IN' },
        { key: 'AUD', label: 'AUD $', symbol: '$', langCode: 'en-AU' },
      ],
    rates: null,
    lastUpdate: null,
    updateInterval: null
  },
  mutations: {
    SET_SELECTED_COUNTRY(state, currency) {
      state.selectedCurrency = currency
      localStorage.setItem('selectedCurrency', JSON.stringify(currency))
    },
    SET_RATES(state, rates) {
      state.rates = rates
      state.lastUpdate = Date.now()
    },
    SET_UPDATE_INTERVAL(state, interval) {
      state.updateInterval = interval
    }
  },
  actions: {
    async fetchRates({ commit, state }) {
      try {
        if (state.selectedCurrency.key === 'USD') {
          // api'mizden gelen curency zaten usd olduğu için çarpanımız 1 
          commit('SET_RATES',  1 )
          return
        }
        
        const apiUrl = `${import.meta.env.VITE_CURRENCY_API}${state.selectedCurrency.key}`
        console.log('Fetching rates from:', apiUrl)
        
        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error(`API response not OK: ${response.status}`)
        }
        
        const data = await response.json()
        if (data && data.rates) {
          commit('SET_RATES', data.rates[state.selectedCurrency.key])
          console.log('Rates updated successfully:', data.rates)
        } else {
          throw new Error('Invalid data format received from API')
        }
      } catch (error) {
        console.error('Error fetching currency rates:', error)
        // curency'i çekemezsek default currency'mize geri dönüyoruz.
        commit('SET_SELECTED_COUNTRY', { key: 'USD' })
        commit('SET_RATES', 1)
      }
    },
    initializeCurrencyUpdates({ dispatch, commit, state }) {
      // Clear any existing interval to avoid duplicates
      if (state.updateInterval) {
        clearInterval(state.updateInterval)
      }
      
      // Fetch immediately on initialization
      dispatch('fetchRates')
      
      // Set up periodic updates
      const interval = setInterval(() => {
        dispatch('fetchRates')
      }, CURRENCY_UPDATE_INTERVAL)
      
      commit('SET_UPDATE_INTERVAL', interval)
    },
    updateSelectedCurrency({ commit, dispatch }, currency) {
      if (!currency || !currency.key) {
        console.error('Invalid currency object:', currency)
        return
      }
      
      commit('SET_SELECTED_COUNTRY', currency)
      dispatch('fetchRates')
    },
    // Clean up interval when component is unmounted
    cleanup({ state }) {
      if (state.updateInterval) {
        clearInterval(state.updateInterval)
      }
    }
  },
  getters: {
    availableCurrencies: state => state.currencies,
    selectedCurrency: state => state.selectedCurrency,
    currentRates: state => state.rates
  }
}