// 角色管理相关数据类型
export interface ResData {
  code: number,
  message: string,
  ok: boolean
}

// 每个角色的数据类型
export interface RoleData {
  id?: number,
  createTime?: string,
  updateTime?: string,
  roleName: string,
  remark?: null
}
export type Records = RoleData[]
// 获取所有角色数据返回的数据类型
export interface RoleResData extends ResData {
  data: {
    records: Records,
    total: number,
    size: number,
    current: number,
    orders: [],
    optimizeCountSql: boolean,
    hitCount: boolean,
    countId: null,
    maxLimit: null,
    searchCount: boolean,
    pages: number
  }
}

// 每个权限对象的数据类型
export interface PermissionData {
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
export type PermissionList = PermissionData[]
// 接口返回的数据的类型
export interface PermissionResData extends ResData {
  data: PermissionList
}