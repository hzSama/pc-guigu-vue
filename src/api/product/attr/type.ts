
// 返回的共有数据类型
export interface ResData {
  code: number,
  message: string,
  ok: boolean
}

// 每个分类中data的类型
export interface CategoryObj {
  id: number | string,
  name: string,
  category1Id?: number,
  category2Id?: number
}

// 相应的分类接口返回数据的类型
export interface CategoryResData extends ResData {
  data: CategoryObj[]
}


// 请求的属性与属性值类型
// 属性值对象的类型
export interface AttrValue {
  id?: number,
  valueName: string,
  attrId?: number
}
// 存储属性值的数组的类型
export type AttrValueList = AttrValue[]

// 属性对象
export interface Attr {
  id?: number,
  attrName: string,
  categoryId: number | string,
  categoryLevel: number,
  attrValueList: AttrValueList
  attrIdAndValueId?: string
}
// 存储属性对象的数组类型
export type AttrList = Attr[]

// 属性接口返回的数据类型
export interface AttrResData extends ResData {
  data: AttrList
}