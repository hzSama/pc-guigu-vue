// 角色管理相关接口
import http from "@/utils/http"
import type { RoleResData, RoleData, PermissionResData } from './type'

// 获取所有的角色数据接口
export const reqAllRoleList = (page: number, limit: number, roleName: string) => http.get<any, RoleResData>(`/admin/acl/role/${page}/${limit}/?roleName=${roleName}`)

// 添加或编辑角色接口
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return http.put<any, any>('/admin/acl/role/update', data)
  } else {
    return http.post<any, any>('/admin/acl/role/save', data)
  }
}

// 获取角色权限数据接口
export const reqAllPermission = (roleId: number) => http.get<any, PermissionResData>(`/admin/acl/permission/toAssign/${roleId}`)

// 给角色分配权限接口
export const reqSetPermission = (roleId: number, permissionId: number[]) => http.post<any, any>(`/admin/acl/permission/doAssign/?roleId=${roleId}&permissionId=${permissionId}`)

// 删除角色接口
export const reqDeleteRole = (roleId: number) => http.delete<any, any>(`/admin/acl/role/remove/${roleId}`)