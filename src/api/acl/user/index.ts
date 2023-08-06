// 用户管理模块相关接口
import http from "@/utils/http"
import type { User, UserResData, RoleInfoResData, SetRoleData } from './type'

// 获取所有用户接口
export const reqAllUserInfo = (page: number, limit: number, username: string) => http.get<any, UserResData>(`/admin/acl/user/${page}/${limit}?username=${username}`)

// 新增或编辑用户接口
export const reqAddOrUpdateUser = (data: User) => {
  if (data.id) {
    return http.put<any, any>('/admin/acl/user/update', data)
  } else {
    return http.post<any, any>('/admin/acl/user/save', data)
  }
}

// 获取用户职位信息接口
export const reqRoleInfo = (userId: number) => http.get<any, RoleInfoResData>(`/admin/acl/user/toAssign/${userId}`)

// 给用户分配角色接口
export const reqSetRole = (data: SetRoleData) => http.post<any, any>('/admin/acl/user/doAssignRole', data)

// 删除一个用户信息接口
export const reqDeleteUser = (userId: number) => http.delete<any, any>(`/admin/acl/user/remove/${userId}`)
// 批量删除用户信息接口
export const reqDeleteAllUser = (idList: number[]) => http.delete<any, any>('/admin/acl/user/batchRemove', { data: idList })