// 创建一个axios实例
import axios from "axios"
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import { useUserStore } from '@/stores/user'

const http = axios.create({
  baseURL: '/api',
  timeout: 5000
})

// axios请求拦截器
http.interceptors.request.use(config => {
  // 给请求头携带token
  const userStore = useUserStore()
  if (userStore.userToken) {
    config.headers.token = userStore.userToken
  }

  return config
}, e => Promise.reject(e))

// axios响应拦截器
/* token失效处理：用户一段时间不操作，token会失效。使用失效的token去发起请求，接口会报401错误，需要我们做相应处理。
                  在响应拦截器做统一的处理。 */
http.interceptors.response.use(res => res.data, e => {
  ElMessage({ type: 'warning', message: e.message })
  return Promise.reject(e)
})

export default http