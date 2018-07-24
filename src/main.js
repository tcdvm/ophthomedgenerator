import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'
import VueClipboard from 'vue-clipboard2'

Vue.config.productionTip = false
Vue.use(Buefy)
Vue.use(VueClipboard);
Vue.use(require('vue-shortkey'))

new Vue({
  render: h => h(App)
}).$mount('#app')
