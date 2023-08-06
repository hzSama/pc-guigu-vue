export interface ResData {
  code: number,
  message: string,
  ok: boolean
}

// 品牌的数据类型
export interface TradeMark {
  id?: number,
  tmName: string,
  logoUrl: string
}
// 品牌数组的数据类型
export type Records = TradeMark[]

// 返回的已有品牌数据类型
export interface TradeMarkResData extends ResData {
  data: {
    records: Records,
    total: number,
    size: number,
    current: number,
    searchCount: boolean,
    pages: number
  }
}