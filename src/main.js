import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './permission'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import '@/assets/icon-font/iconfont.js' // iconfont
import '@/assets/icon-font/iconfont.css' // iconfont

// 事件总线传递事件
Vue.prototype.$bus = new Vue()

import api from './api'
import * as filters from './filters';

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(api)

// 主题换肤
import { initThemeColor} from './utils/themeColorClient'
initThemeColor();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
