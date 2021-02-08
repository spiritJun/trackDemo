import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

const files = require.context('./modules', false, /\.js$/);
const modules = {};
files.keys().forEach(key => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default;  //导出模块时用default
})
console.log('**********')
console.log(modules)
// 用于vuex调试输出日志
// import createLogger from 'vuex/dist/logger' // Vuex 自带一个日志插件用于一般的调试
// Vuex的调试工具,可以帮助我们检测state修改是不是通过mutation修改,如果直接修改会报错
// npm run dev 就是一个dev环境 run build的时候就是production的环境
const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: modules,
  getters,
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
})

export default store
