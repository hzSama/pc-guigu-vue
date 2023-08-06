// 品牌管理接口
import http from '@/utils/http'
import type { TradeMark, TradeMarkResData } from './type'

// 获取已有品牌的接口方法
export const reqHasTrademark = (page: number, limit: number) => http.get<any, TradeMarkResData>(`/admin/product/baseTrademark/${page}/${limit}`)

// 添加或编辑品牌的接口
export const addOrUpdateTrademark = (data: TradeMark) => {
  if (data.id) {
    // 有id则为修改
    return http.put<any, any>('/admin/product/baseTrademark/update', data)
  } else {
    // 无id则为添加
    return http.post<any, any>('/admin/product/baseTrademark/save', data)
  }
}

// 删除已有的品牌接口
export const deleteTrademark = (id: number) => http.delete<any, any>(`/admin/product/baseTrademark/remove/${id}`)