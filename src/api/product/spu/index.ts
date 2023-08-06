// SPU相关数据接口
import http from "@/utils/http"
import type { SpuResData, AllTrademark, SpuImgs, SaleAttrResData, HasSaleAttrResData, SpuData, SkuData, SkuInfoData } from './type'

// 获取某三级分类下的SPU数据
export const reqHasSpu = (page: number, limit: number, category3Id: number | string) => http.get<any, SpuResData>(`/admin/product/${page}/${limit}?category3Id=${category3Id}`)

// 获取所有品牌数据
export const reqAllTrademark = () => http.get<any, AllTrademark>('/admin/product/baseTrademark/getTrademarkList')
// 获取SPU品牌所有图片数据
export const reqSpuImages = (spuId: number | undefined) => http.get<any, SpuImgs>(`/admin/product/spuImageList/${spuId}`)
// 获取SPU品牌的销售属性数据
export const reqSpuSaleAttr = (spuId: number | undefined) => http.get<any, SaleAttrResData>(`/admin/product/spuSaleAttrList/${spuId}`)
// 获取销售属性
export const reqSpuAttrList = () => http.get<any, HasSaleAttrResData>('/admin/product/baseSaleAttrList')

// 添加新的SPU接口 /admin/product/saveSpuInfo
// 修改SPU接口 /admin/product/updateSpuInfo
export const reqAddOrUpdateSpu = (data: SpuData) => {
  if (data.id) {
    return http.post<any, any>('/admin/product/updateSpuInfo', data)
  } else {
    return http.post<any, any>('/admin/product/saveSpuInfo', data)
  }
}

// 添加一个新的SKU接口
export const reqAddSku = (data: SkuData) => http.post<any, any>('/admin/product/saveSkuInfo', data)

// 查看SPU下所有SKU的接口
export const reqAllSku = (id: number | string) => http.get<any, SkuInfoData>(`/admin/product/findBySpuId/${id}`)