import '@/styles/common.scss'
import 'element-plus/theme-chalk/dark/css-vars.css' //暗黑模式样式

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import App from '@/App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// svg插件需要的配置
import 'virtual:svg-icons-register'
// 引入Svg组件
import SvgIcon from '@/components/SvgIcon/index.vue'
// Category组件
import Category from '@/components/Category/index.vue'
// 按钮权限自定义指令
import { btnPermission } from '@/directive/btnpermission'

const app = createApp(App)

const pinia = createPinia()
// // 注册数据持久化插件
pinia.use(piniaPluginPersistedState)
// 重写$reset方法，解决setup下不能使用
pinia.use(({ store }) => {
  const initialState = JSON.parse(JSON.stringify(store.$state))
  store.$reset = () => {
    store.$patch(initialState)
  }
})

app.use(pinia)
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(btnPermission)
// 注册全局组件
app.component('SvgIcon', SvgIcon)
app.component('Category', Category)
// 注册element-plus所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')