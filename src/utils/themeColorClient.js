
import client from 'webpack-theme-color-replacer/client'
import forElementUI from 'webpack-theme-color-replacer/forElementUI'
// 注意自己项目里的引入路径，这个是自己定义的，在vue.config.js中也需要引入，可以按照自己的方式处理
import appConfig from './config.js'
export let curColor = appConfig.themeColor

// 动态切换主题色
export function changeThemeColor(newColor) {
  var options = {
    // newColors数组必须和vue.config.js中matchColors数组一致
    newColors: [...forElementUI.getElementUISeries(newColor),'#0cdd3a','#EE5A49','#ffffff']
  }
  console.log(options,'options')
  return client.changer.changeColor(options, Promise)
    .then(() => {
      curColor = newColor
      localStorage.setItem('theme_color', curColor)
    })
}

export function initThemeColor() {
  const savedColor = localStorage.getItem('theme_color')
  if (savedColor) {
    curColor = savedColor
    changeThemeColor(savedColor)
  }
}