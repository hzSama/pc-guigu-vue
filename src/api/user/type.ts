// 登录接口携带参数的ts类型
export interface loginForm {
  username: string,
  password: string
}

// 已登录后所有接口返回的共有数据类型
export interface ResponseData {
  code: number,
  message: string,
  ok: boolean
}

// 定义登录接口返回数据类型
export interface loginResData extends ResponseData {
  data: string
}

// 服务器返回用户信息相关的数据类型
export interface userInfoResData extends ResponseData {
  data: {
    routes: string[],
    buttons: string[],
    roles: string[],
    name: string,
    avatar: string
  }
}
