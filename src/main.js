import { createApp } from 'vue'
import './assets/colors.css'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import clickOutside from './directives/click-outside'
import hoverColorDirective from './directives/hover-color';

const app = createApp(App)
app.use(router)
app.use(store)
app.use(i18n)
app.directive('click-outside', clickOutside)
app.directive('hover-color', hoverColorDirective)
app.mount('#app')
