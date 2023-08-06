// 属性管理相关API
import http from "@/utils/http"
import type { CategoryResData, AttrResData, Attr } from './type'

// 一级分类接口
export const reqC1 = () => http.get<any, any>('/admin/product/getCategory1')

// 二级分类接口
export const reqC2 = (c1Id: number | string) => http.get<any, CategoryResData>(`/admin/product/getCategory2/${c1Id}`)

// 三级分类接口
export const reqC3 = (c2Id: number | string) => http.get<any, CategoryResData>(`/admin/product/getCategory3/${c2Id}`)

// 获取属性接口
export const reqAttr = (c1Id: number | string, c2Id: number | string, c3Id: number | string) => http.get<any, AttrResData>(`/admin/product/attrInfoList/${c1Id}/${c2Id}/${c3Id}`)

// 添加或修改属性接口 /admin/product/saveAttrInfo/
export const reqAddOrUpdateAttr = (data: Attr) => http.post<any, any>('/admin/product/saveAttrInfo', data)

// 删除属性接口
export const reqDeleteAttr = (id: number) => http.delete<any, any>(`/admin/product/deleteAttr/${id}`)