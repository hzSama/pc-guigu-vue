<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { reqHasSpu, reqAllSku } from '@/api/product/spu'
import type { SpuResData, Records, SpuData, SkuInfoData, SkuData } from '@/api/product/spu/type'
import { useCategoryStore } from '@/stores/category'
import Spu from './spu.vue'
import Sku from './sku.vue'
const categoryStore = useCategoryStore()

// 判断展示卡片flag
const cardFlag = ref<number>(0)

// 监听三级分类id的变化
const pageNo = ref<number>(1) // 分页器数据
const limit = ref<number>(3)
const total = ref<number>(0)
watch(() => categoryStore.seleC3Id, () => {
  if (!categoryStore.seleC3Id) return
  getSpu()
})
// 请求SPU数据方法
const records = ref<Records>([])
const getSpu = async () => {
  const res: SpuResData = await reqHasSpu(pageNo.value, limit.value, categoryStore.seleC3Id)
  if (res.code === 200) {
    records.value = res.data.records
    total.value = res.data.total
  }
}

// 修改每页展示数事件
const changeSize = () => {
  pageNo.value = 1
  getSpu()
}

// 点击添加SPU事件
const addSpu = () => {
  // 使用子组件暴露的init函数，请求init所需数据
  spuRef.value.initAddSpu(categoryStore.seleC3Id)
  cardFlag.value = 1
}
// 点击修改SPU事件
const spuRef = ref() // 获取spu子组件
const editSpu = (row: SpuData) => {
  // 使用子组件暴露的init函数，请求init所需数据
  spuRef.value.initSpu(row)
  cardFlag.value = 1
}

// 子组件传递的cardFlag变化事件
const changeCardFlag = (flag: number) => {
  cardFlag.value = flag
  getSpu()
}

// 添加SKU事件
const skuRef = ref()
const addSku = (row: SpuData) => {
  skuRef.value.initSku(categoryStore.seleC1Id, categoryStore.seleC2Id, categoryStore.seleC3Id, row)
  cardFlag.value = 2
}

// 点击查看SPU下的SKU事件
const dialogFlag = ref<boolean>(false) // 展示或隐藏dialog的flag
const allSkuData = ref<SkuData[]>([])
const viewSku = async (row: SpuData) => {
  const res: SkuInfoData = await reqAllSku((row.id as number))
  if (res.code === 200) {
    allSkuData.value = res.data
    dialogFlag.value = true
  }
}


// 路由跳转时清空三级分类数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<template>
  <!--三级分类-->
  <category :cardFlag="cardFlag"></category>

  <!--card组件-->
  <el-card style="margin: 10px 0;">
    <!--card 0:展示SPU-->
    <div v-show="cardFlag === 0">
      <el-button type="primary" icon="Plus" :disabled="categoryStore.seleC3Id ? false : true"
        @click="addSpu">添加SPU</el-button>
      <!--表格组件-->
      <el-table style="margin: 10px 0;" border :data="records">
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column label="SPU名称" prop="spuName"></el-table-column>
        <el-table-column label="SPU描述" prop="description"></el-table-column><!--show-overflow-tooltip-->
        <el-table-column label="SPU操作">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="Plus" title="添加SKU" @click="addSku(row)"></el-button>
            <el-button type="success" size="small" icon="View" title="查看SKU列表" @click="viewSku(row)"></el-button>
            <el-button type="warning" size="small" icon="Edit" title="修改SPU" @click="editSpu(row)"></el-button>
            <el-button type="danger" size="small" icon="Delete" title="删除SPU"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页器组件-->
      <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]"
        layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @current-change="getSpu"
        @size-change="changeSize" />
    </div>

    <!--card 1:添加和修改SPU-->
    <Spu v-show="cardFlag === 1" @changeCardFlag="changeCardFlag" ref="spuRef"></Spu>

    <!--card 2:添加SKU-->
    <Sku v-show="cardFlag === 2" @changeCardFlag="changeCardFlag" ref="skuRef"></Sku>

    <!--dialog:展示SPU下所有SKU-->
    <el-dialog title="SKU列表" v-model="dialogFlag">
      <el-table border :data="allSkuData">
        <el-table-column label="SKU名称" prop="skuName"></el-table-column>
        <el-table-column label="SKU价格" prop="price"></el-table-column>
        <el-table-column label="SKU重量" prop="weight"></el-table-column>
        <el-table-column label="SKU图片">
          <template #="{ row, $index }">
            <img :src="row.skuDefaultImg" alt="图图裂开了">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>

<style scoped lang="scss"></style>
