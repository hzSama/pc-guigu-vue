export interface ResData {
  code: number,
  message: string,
  ok: boolean
}

// SKU对象的数据类型
export interface SkuAttrValue {
  attrId: number | string,
  valueId: number | string,
}
export interface SkuSaleAttrValue {
  saleAttrId: number | string,
  saleAttrValueId: number | string,
}
export interface SkuData {
  category3Id?: string | number,
  spuId?: string | number,
  tmId?: string | number,
  skuName?: string,
  price?: string | number,
  weight?: string | number,
  skuDesc?: string,
  skuDefaultImg?: string,
  skuAttrValueList?: SkuAttrValue[],
  skuSaleAttrValueList?: SkuSaleAttrValue[],
  isSale?: number,
  id?: number
}
// SKU接口返回的数据的数据类型
export interface SkuResData extends ResData {
  data: {
    records: SkuData[],
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

// 获取商品信息接口返回的数据类型
export interface SkuInfoData extends ResData {
  data: SkuData
}