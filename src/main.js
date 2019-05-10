import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "babel-polyfill"
import '@/icons/index'
import './permission'
Vue.config.productionTip = false;

Vue.use(ElementUI);


new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
