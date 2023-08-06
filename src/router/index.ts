import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoute } from './routes'
// 路由跳转进度条
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// element-plus
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
// 仓库
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHashHistory(),

  routes: constantRoute,

  scrollBehavior() {
    return {
      left: 0,
      top: 0
    }
  }
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 进度条开始
  nprogress.configure({ showSpinner: false }).start()
  // 路由鉴权：
  // 问题：因为在user小仓库中使用了持久化存储插件。导致刷新后仓库数据不重置，但路由数据却重置了。导致刷新后找不到需要动态添加的异步路由。
  // 解决：配置持久化存储，使其只持久化存储userToken即可。
  const userStore = useUserStore()
  if (userStore.userToken) {
    if (to.path === '/login') {
      next(from.path)
      ElMessage({ type: 'warning', message: '您已登录!' })
    } else {
      if (userStore.userInfo.name) {
        next()
      } else {
        try {
          await userStore.getUserInfo()
          next({ ...to })
        } catch (error) {
          await userStore.userLogout()
          next('/login')
          ElMessage({ type: 'warning', message: '登录超时!' })
        }
      }
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
      ElMessage({ type: 'warning', message: '请先登录!' })
    }
  }
})
// 全局后置守卫
router.afterEach((to, from) => {
  // 进度条结束
  nprogress.done()
})

export default router
