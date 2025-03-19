import { createI18n } from 'vue-i18n'
import store from './store'
import en from './locales/en.json'
import tr from './locales/tr.json'

console.log('Store State:', store.state)

const i18n = createI18n({
  legacy: false,
  locale: store.state.language.selectedLanguage,
  fallbackLocale: 'tr',
  messages: {
    en,
    tr
  }
})

export default i18n