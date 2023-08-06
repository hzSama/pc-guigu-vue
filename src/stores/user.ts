import { ref } from 'vue'
import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user/index'
import type { loginForm, loginResData, userInfoResData } from '@/api/user/type'
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'

// 路由过滤函数:过滤用户无权限的异步路由
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

export const useUserStore = defineStore('User', () => {
  // 登录请求
  const userToken: any = ref('')
  const userLogin = async (data: loginForm) => {
    const res: loginResData = await reqLogin(data)
    if (res.code === 200) {
      userToken.value = res.data
      // 登录成功返回一个成功的Promise
      return 'ok'
    } else {
      // 登录失败返回一个失败的Promise
      return Promise.reject(new Error(res.data))
    }
  }

  // 获取用户信息请求
  const userInfo: any = ref({})
  const menuRoutes = ref(constantRoute)
  const btns = ref<string[]>([])
  const getUserInfo = async () => {
    const res: userInfoResData = await reqUserInfo()
    if (res.code === 200) {
      userInfo.value = res.data
      btns.value = res.data.buttons
      // 使用路由过滤函数
      const userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), res.data.routes)
      menuRoutes.value = [...constantRoute, ...userAsyncRoute, ...anyRoute]
      // 向路由追加筛选后的异步路由及任意路由
      userAsyncRoute.forEach((route: any) => {
        router.addRoute(route)
      })
      router.addRoute(anyRoute[0])
      return 'ok'
    } else {
      return Promise.reject(new Error(res.message))
    }
  }

  // 退出登录请求
  const userLogout = async () => {
    const res: any = await reqLogout()
    if (res.code === 200) {
      userToken.value = ''
      userInfo.value = {}
      return 'ok'
    } else {
      return Promise.reject(new Error(res.message))
    }
  }

  // 返回数据
  return { userLogin, userToken, getUserInfo, userInfo, userLogout, menuRoutes, btns }
}, {
  persist: [
    {
      paths: ['userToken'],
      storage: localStorage
    },
    {
      paths: ['btns'],
      storage: sessionStorage
    }
  ]
})

export default useUserStore