// 用户相关接口
import http from "@/utils/http"
import type { loginForm, loginResData, userInfoResData } from "./type"

// 暴露请求函数

// 登录接口
export const reqLogin = (data: loginForm) => http.post<any, loginResData>('/admin/acl/index/login', data)
// 获取用户信息接口
export const reqUserInfo = () => http.get<any, userInfoResData>('/admin/acl/index/info')

// 退出登录
export const reqLogout = () => http.post<any, any>('/admin/acl/index/logout')
