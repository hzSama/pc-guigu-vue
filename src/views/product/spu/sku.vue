<script setup lang="ts">
import { ref } from 'vue'
import type { Img, SaleAttr, SaleAttrResData, SpuData, SpuImgs, SkuData } from '@/api/product/spu/type'
import type { AttrList, AttrResData } from '@/api/product/attr/type'
import { reqAttr } from '@/api/product/attr'
import { reqSpuImages, reqSpuSaleAttr, reqAddSku } from '@/api/product/spu'
import { ElMessage } from 'element-plus'


const emit = defineEmits(['changeCardFlag'])

// 点击取消事件
const cancel = () => {
  emit('changeCardFlag', 0)
}

// 初始化添加sku数据init函数
const skuParams = ref<SkuData>({
  category3Id: '',
  spuId: '',
  tmId: '',
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuDefaultImg: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: []
})
const attrData = ref<AttrList>([])
const saleData = ref<SaleAttr[]>([])
const imgsData = ref<Img[]>([])
const initSku = async (seleC1Id: number | string, seleC2Id: number | string, seleC3Id: number | string, spu: SpuData) => {
  skuParams.value.category3Id = spu.category3Id
  skuParams.value.spuId = spu.id
  skuParams.value.tmId = spu.tmId
  // 请求所需数据
  const res: AttrResData = await reqAttr(seleC1Id, seleC2Id, seleC3Id)
  const res1: SaleAttrResData = await reqSpuSaleAttr(spu.id)
  const res2: SpuImgs = await reqSpuImages(spu.id)
  attrData.value = res.data
  saleData.value = res1.data
  imgsData.value = res2.data

}
defineExpose({ initSku })

// 选择默认图片事件
const tableRef = ref()
const seleImg = (row: Img) => {
  // 排他思想(只允许勾选一个)
  imgsData.value.forEach(item => { tableRef.value.toggleRowSelection(item, false) })
  tableRef.value.toggleRowSelection(row, true)
  // 获取图片地址参数
  skuParams.value.skuDefaultImg = row.imgUrl
}

// 点击保存事件
const save = async () => {
  // 整理平台属性参数
  skuParams.value.skuAttrValueList = attrData.value.reduce((pre: any, next: any) => {
    if (next.attrIdAndValueId) {
      const [attrId, valueId] = next.attrIdAndValueId.split('-')
      pre.push({ attrId, valueId }) // 作为对象push到空数组中
    }
    return pre
  }, [])
  // 整理销售属性参数
  skuParams.value.skuSaleAttrValueList = saleData.value.reduce((pre: any, next: any) => {
    if (next.saleIdAndValueId) {
      const [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split('-')
      pre.push({ saleAttrId, saleAttrValueId })
    }
    return pre
  }, [])

  // 请求添加SKU
  const res: any = await reqAddSku(skuParams.value)
  if (res.code === 200) {
    ElMessage({ type: 'success', message: '添加SKU成功' })
    emit('changeCardFlag', 0)
  } else {
    ElMessage({ type: 'error', message: '添加SKU失败' })
  }
}
</script>

<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="请输入SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="请输入价格" type="number" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input placeholder="请输入重量" type="number" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input placeholder="请输入描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item v-for="item in attrData" :key="item.id" :label="item.attrName">
          <el-select v-model="item.attrIdAndValueId">
            <el-option v-for="value in item.attrValueList" :key="value.id" :label="value.valueName"
              :value="`${item.id}-${value.id}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item v-for="item in saleData" :key="item.id" :label="item.saleAttrName">
          <el-select v-model="item.saleIdAndValueId">
            <el-option v-for="value in item.spuSaleAttrValueList" :key="value.id" :label="value.saleAttrValueName"
              :value="`${item.id}-${value.id}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgsData" ref="tableRef">
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" alt="图图裂开了" style="width: 100px;height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button type="warning" size="small" @click="seleImg(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="info" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
