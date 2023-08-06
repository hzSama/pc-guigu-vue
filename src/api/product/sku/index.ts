// SKU页面相关接口
import http from "@/utils/http"
import type { SkuInfoData, SkuResData } from './type'

// 获取所有SKU接口
export const reqSku = (page: number, limit: number) => http.get<any, SkuResData>(`/admin/product/list/${page}/${limit}`)

// SKU上架与下架接口
export const reqOnSaleSku = (skuId: number) => http.get<any, any>(`/admin/product/onSale/${skuId}`)
export const reqCancelSaleSku = (skuId: number) => http.get<any, any>(`/admin/product/cancelSale/${skuId}`)

// 获取商品信息
export const reqSkuInfo = (skuId: number) => http.get<any, SkuInfoData>(`/admin/product/getSkuInfo/${skuId}`)

// 删除商品
export const reqDeleteSku = (skuId: number) => http.delete<any, any>(`/admin/product/deleteSku/${skuId}`)