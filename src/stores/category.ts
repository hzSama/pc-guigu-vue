// 三级分类全局组件小仓库
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { CategoryResData, CategoryObj } from '@/api/product/attr/type'

export const useCategoryStore = defineStore('Category', () => {
  // 一级分类数据
  const c1Data = ref<CategoryObj[]>([])
  const seleC1Id = ref<number | string>('')
  // 请求一级分类
  const getC1 = async () => {
    const res: CategoryResData = await reqC1()
    if (res.code === 200) {
      c1Data.value = res.data
    }
  }
  // 一级分类变化后清空旧二级三级数据
  const clearC2C3 = () => {
    seleC2Id.value = ''
    c3Data.value = []
    seleC3Id.value = ''
  }

  // 二级分类数据
  const c2Data = ref<CategoryObj[]>([])
  const seleC2Id = ref<number | string>('')
  // 请求二级分类
  const getC2 = async () => {
    const res: CategoryResData = await reqC2(seleC1Id.value)
    if (res.code === 200) {
      c2Data.value = res.data
    }
  }
  // 二级分类变化后清空旧三级数据
  const clearC3 = () => {
    seleC3Id.value = ''
  }

  // 三级分类数据
  const c3Data = ref<CategoryObj[]>([])
  const seleC3Id = ref<number | string>('')
  // 请求三级分类
  const getC3 = async () => {
    const res: CategoryResData = await reqC3(seleC2Id.value)
    if (res.code === 200) {
      c3Data.value = res.data
    }
  }

  // 返回数据
  return { getC1, clearC2C3, c1Data, seleC1Id, getC2, clearC3, c2Data, seleC2Id, getC3, c3Data, seleC3Id }
})

export default useCategoryStore