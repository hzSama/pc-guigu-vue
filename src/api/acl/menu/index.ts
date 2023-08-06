// 菜单管理相关接口
import http from "@/utils/http"
import type { PermissionParams, PermissionResData } from './type'

// 获取所有菜单数据接口
export const reqAllPermission = () => http.get<any, PermissionResData>('/admin/acl/permission')

// 添加或编辑菜单接口
export const reqAddOrUpdatePermission = (data: PermissionParams) => {
  if (data.id) {
    return http.put<any, any>('/admin/acl/permission/update', data)
  } else {
    return http.post<any, any>('/admin/acl/permission/save', data)
  }
}

// 删除菜单接口
export const reqDeletePermission = (id: number) => http.delete<any, any>(`/admin/acl/permission/remove/${id}`)