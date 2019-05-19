import Vue from 'vue'
import ElementUI from 'element-ui'
import 'normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import services from './services'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(services)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
