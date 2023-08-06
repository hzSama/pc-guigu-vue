// 所有接口返回的共有类型
export interface ReqData {
  code: number,
  message: string,
  ok: boolean
}

// SPU数据的类型
export interface SpuData {
  id?: number,
  spuName: string,
  tmId: number | string,
  description: string,
  category3Id: number | string,
  spuSaleAttrList: null | SaleAttr[],
  spuImageList: null | Img[]
}
export type Records = SpuData[]

// 定义请求SPU接口返回的数据类型
export interface SpuResData extends ReqData {
  data: {
    records: Records,
    total: number,
    size: number,
    current: number,
    searchCount: boolean,
    pages: number
  }
}

// 请求所有品牌数据类型
export interface Trademark {
  id: number,
  tmName: string,
  logoUrl: string
}
export interface AllTrademark extends ReqData {
  data: Trademark[]
}

// SPU品牌图片的数据类型
export interface Img {
  id?: number,
  creatTime?: string,
  updateTime?: string,
  spuId?: number,
  imgName?: string,
  imgUrl?: string,
  name?: string,
  url?: string
}
export interface SpuImgs extends Img {
  data: Img[]
}

// 销售属性值对象数据类型
export interface SaleAttrValue {
  id?: number,
  createTime?: null,
  updateTime?: null,
  spuId?: number,
  baseSaleAttrId: number | string,
  saleAttrValueName: string,
  saleAttrName?: string,
  isChecked?: null
}
// 存储销售属性值的数据类型
export type spuSaleAttrValueList = SaleAttrValue[]
// 销售属性对象数据类型
export interface SaleAttr {
  id?: number,
  createTime?: null,
  updateTime?: null,
  spuId?: number,
  baseSaleAttrId: number | string,
  saleAttrName: string,
  spuSaleAttrValueList: spuSaleAttrValueList,
  flag?: boolean,
  saleAttrValue?: string
  saleIdAndValueId?: string
}
// 销售属性接口返回的数据类
export interface SaleAttrResData extends ReqData {
  data: SaleAttr[]
}

// 已有的销售属性
export interface HasSaleAttr {
  id: number,
  name: string
}
export interface HasSaleAttrResData extends ReqData {
  data: HasSaleAttr[]
}

// SKU接口所需数据类型
export interface SkuAttrValue {
  attrId: number | string,
  valueId: number | string
}
export interface SkuSaleAttrValue {
  saleAttrId: number | string,
  saleAttrValueId: number | string
}
export interface SkuData {
  category3Id: string | number,
  spuId?: string | number,
  tmId: string | number,
  skuName: string,
  price: string | number,
  weight: string | number,
  skuDesc: string,
  skuDefaultImg?: string,
  skuAttrValueList: SkuAttrValue[],
  skuSaleAttrValueList: SkuSaleAttrValue[]
}

// 请求返回SPU下的所有SKU数据类型
export interface SkuInfoData extends ReqData {
  data: SkuData[]
}