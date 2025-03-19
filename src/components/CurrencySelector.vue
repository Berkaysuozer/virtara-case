<script setup>
import { computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const selectedCurrency = computed(() => store.getters['currency/selectedCurrency'])
const currencies = computed(() => store.getters['currency/availableCurrencies'])

const handleCurrencyChange = (event) => {
  const currencyKey = event.target.value
  const currency = currencies.value.find(c => c.key === currencyKey)
  if (currency) {
    store.dispatch('currency/updateSelectedCurrency', currency)
  }
}

watch(() => selectedCurrency.value, (newVal) => {
  console.log('Selected currency changed:', newVal)
})

onMounted(() => {
  store.dispatch('currency/initializeCurrencyUpdates')
})
</script>

<template>
  <div class="currency-selector">
    <select
      :value="selectedCurrency.key"
      @change="handleCurrencyChange"
      class="currency-select"
      aria-label="Select Currency"
    >
      <option
        v-for="currency in currencies"
        :key="currency.key"
        :value="currency.key"
      >
        {{ currency.label }}
      </option>
    </select>
    
  </div>
</template>

<style scoped>
.currency-selector {
  display: inline-block;
  position: relative;
}

.currency-select {
  padding: 0.5rem 2.5rem 0.5rem 1.2rem;
  border-radius: 8px;
  color: var(--primary-300);
  background-color: var(--neutral-100);
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7rem top 50%;
  background-size: 0.65rem auto;
}

.currency-select:hover {
  color: var(--primary-100);
  background-color: var(--neutral-200);
}

.currency-select:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--primary-100);
}

.currency-select option {
  background-color: white;
  color: var(--primary-300);
  padding: 8px;
}

.error-message {
  color: red;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  position: absolute;
  white-space: nowrap;
}
</style>