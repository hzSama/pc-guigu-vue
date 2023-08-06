// 菜单管理相关数据类型
export interface ResData {
  code: number,
  message: string,
  ok: boolean
}

// 每个菜单数据的类型
export interface Permission {
  id: number,
  createTime: string,
  updateTime: string,
  pid: number,
  name: string,
  code: string,
  toCode: string,
  type: number,
  status: null,
  level: number,
  children?: PermissionList,
  select: boolean
}
export type PermissionList = Permission[]
// 获取菜单接口返回的数据类型
export interface PermissionResData extends ResData {
  data: PermissionList
}

// 添加或编辑菜单所携带的参数数据类型
export interface PermissionParams {
  id?: number
  code: string,
  level: number,
  name: string,
  pid: number
}