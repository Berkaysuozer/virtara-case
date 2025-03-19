import { computed } from "vue";
import { useStore } from "vuex";

export function useFormatters() {
  const store = useStore();
  const selectedCurrency = computed(() => store.getters["currency/selectedCurrency"]);
  const currentRate = computed(() => store.getters["currency/currentRates"]);

  const currencyFormatter = (amount) => {
    if (typeof amount !== "number") return amount;

    const convertedAmount = amount * currentRate.value;

    const formattedNumber = new Intl.NumberFormat(selectedCurrency.value.langCode, {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      signDisplay: "auto"
    }).format(convertedAmount);
    
    return `${formattedNumber} ${selectedCurrency.value.key}`;
  };

  return {
    currencyFormatter,
  };
}
