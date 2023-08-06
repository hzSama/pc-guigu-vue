// 用户管理相关数据类型定义
export interface ResData {
  code: number,
  message: string,
  ok: boolean
}

// 一个账号信息的数据类型
export interface User {
  id?: number,
  createTime?: string,
  updateTime?: string,
  username: string,
  password?: string,
  name: string,
  phone?: null,
  roleName?: string
}
export type Records = User[]
// 获取所有用户信息接口返回的数据类型
export interface UserResData extends ResData {
  data: {
    records: Records,
    total: number,
    size: number,
    current: number,
    pages: number
  }
}

// 每个职位数据的类型
export interface RoleData {
  id?: number,
  createTime?: string,
  updateTime?: string,
  roleName: string,
  remark: null
}
// 所有职位列表
export type AllRole = RoleData[]
// 获取用户职位信息接口返回的数据类型
export interface RoleInfoResData extends ResData {
  data: {
    assignRoles: AllRole,
    allRolesList: AllRole
  }
}

// 给用户分配角色所携带参数的类型
export interface SetRoleData {
  userId: number,
  roleIdList: (number | undefined)[]
}