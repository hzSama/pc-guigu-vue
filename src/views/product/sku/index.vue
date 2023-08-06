<script setup lang="ts">
import { onMounted, ref } from "vue"
import { reqSku, reqOnSaleSku, reqCancelSaleSku, reqSkuInfo, reqDeleteSku } from '@/api/product/sku/index'
import type { SkuResData, SkuData, SkuInfoData } from "@/api/product/sku/type"
import { ElMessage } from "element-plus"

// 分页器数据
const pageNo = ref<number>(1)
const limit = ref<number>(10)
const total = ref<number>(0)

// 请求SKU数据函数
const skuData = ref<SkuData[]>([])
const getSku = async () => {
  const res: SkuResData = await reqSku(pageNo.value, limit.value)
  if (res.code === 200) {
    total.value = res.data.total
    skuData.value = res.data.records
  }
}
onMounted(() => {
  getSku()
})

// 修改每页展示数事件
const changeSize = () => {
  pageNo.value = 1
  getSku()
}

// SKU上架与下架事件
const updateSale = async (row: SkuData) => {
  if (row.isSale === 1) {
    await reqCancelSaleSku((row.id as number))
    ElMessage({ type: 'success', message: '下架成功' })
    getSku()
  } else {
    await reqOnSaleSku((row.id as number))
    ElMessage({ type: 'success', message: '上架成功' })
    getSku()
  }
}

// 点击详情打开抽屉事件
const drawer = ref<boolean>(false)
const skuInfoData = ref<any>({})
const viewDrawer = async (row: SkuData) => {
  // 请求商品详情数据
  const res: SkuInfoData = await reqSkuInfo((row.id as number))
  skuInfoData.value = res.data

  drawer.value = true
}

// 确认删除SKU事件
const deleteSku = async (id: number) => {
  const res: any = await reqDeleteSku(id)
  if (res.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getSku()
    pageNo.value = skuData.value.length > 1 ? pageNo.value : pageNo.value - 1
  }
}
</script>

<template>
  <el-card>
    <el-table border style="margin: 10px 0;" :data="skuData">
      <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
      <el-table-column label="名称" width="150px" prop="skuName"></el-table-column>
      <el-table-column label="描述" width="250px" prop="skuDesc"></el-table-column>
      <el-table-column label="图片" width="180px" align="center">
        <template #="{ row, $index }">
          <img :src="row.skuDefaultImg" alt="图图裂开了" style="width: 100px;height: 100px;">
        </template>
      </el-table-column>
      <el-table-column label="重量" width="150px" prop="weight" align="center"></el-table-column>
      <el-table-column label="价格" width="150px" prop="price" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="220px">
        <template #="{ row, $index }">
          <el-button :type="row.isSale ? 'info' : 'primary'" size="small" :icon="row.isSale ? 'Bottom' : 'Top'"
            @click="updateSale(row)"></el-button>
          <el-button type="warning" size="small" icon="Edit"
            @click="ElMessage({ type: 'warning', message: '此功能正在研发中...' })"></el-button>
          <el-button type="success" size="small" icon="InfoFilled" @click="viewDrawer(row)"></el-button>
          <el-popconfirm title="是否确认删除此项？" @confirm="deleteSku(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[10, 20, 30]"
      layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @current-change="getSku"
      @size-change="changeSize" />
    <!--抽屉组件:展示SKU详情-->
    <el-drawer v-model="drawer" size="40%">
      <template #header>
        <h4>查看SKU详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfoData.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfoData.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfoData.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag v-for="item in skuInfoData.skuAttrValueList" :key="item.id" style="margin: 0 5px;">{{ item.valueName
            }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag v-for="item in skuInfoData.skuSaleAttrValueList" :key="item.id" style="margin: 0 5px;">{{
              item.saleAttrValueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="5">商品图片</el-col>
          <el-col :span="19">
            <el-carousel :interval="4000" type="card" height="200px" indicator-position="outside" trigger="click">
              <el-carousel-item v-for="item in skuInfoData.skuImageList" :key="item.id">
                <img :src="item.imgUrl" alt="" style="width: 100%;height: 100%;">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
