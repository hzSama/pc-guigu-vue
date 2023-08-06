<script setup lang="ts">
import { watch, ref, nextTick, onBeforeUnmount } from 'vue'
import { useCategoryStore } from '@/stores/category'
import { reqAttr, reqAddOrUpdateAttr, reqDeleteAttr } from '@/api/product/attr/index'
import type { AttrResData, AttrList, Attr, AttrValue } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'

const categoryStore = useCategoryStore()

// 监听三级分类id,判断是否请求属性数据
watch(() => categoryStore.seleC3Id, () => {
  attrData.value = []
  if (!categoryStore.seleC3Id) return
  getAttr()
})
// 请求数据函数
const attrData = ref<AttrList>([])
const getAttr = async () => {
  const { seleC1Id, seleC2Id, seleC3Id } = categoryStore
  const res: AttrResData = await reqAttr(seleC1Id, seleC2Id, seleC3Id)
  if (res.code === 200) {
    attrData.value = res.data
  }
}

// 展示卡片和添加属性卡片切换flag
const cardFlag = ref<number>(0)
// 点击添加属性事件
const addAttr = () => {
  // 清空添加属性卡片内的旧数据
  Object.assign(attrParams.value, {
    attrName: '',
    attrValueList: [],
    categoryId: '',
    categoryLevel: 3
  })
  cardFlag.value = 1
}
// 点击修改属性事件
const updateAttr = (row: Attr) => {
  // 直接把row赋值给attrParams参数即可在card1中显示此项属性数据
  Object.assign(attrParams.value, JSON.parse(JSON.stringify(row)))// 实现简单深拷贝，防止数据污染
  cardFlag.value = 1
}
// 点击删除属性事件
const deleteAttr = async (id: number) => {
  const res: any = await reqDeleteAttr(id)
  if (res.code === 200) {
    getAttr()
    ElMessage({ type: 'success', message: '删除成功' })
  } else {
    ElMessage({ type: 'error', message: '删除失败' })
  }
}

// 添加属性卡片内点击取消事件
const cancel = () => {
  cardFlag.value = 0
}
// 收集参数(需要新增的属性对象)
const attrParams = ref<Attr>({
  attrName: '',
  attrValueList: [],
  categoryId: '',
  categoryLevel: 3
})
// 点击添加属性值事件
const inputRef = ref<any>(null) // 获取新添加那项的input元素，实现自动聚焦
const addAttrValue = () => {
  // 向表格push一条数据
  attrParams.value.attrValueList.push({
    valueName: ''
  })
  // 表格添加一项，完成渲染后聚焦
  nextTick(() => {
    inputRef.value.focus()
  })
}
// 点击保存事件
const save = async () => {
  // 收集三级分类的id到参数
  attrParams.value.categoryId = categoryStore.seleC3Id
  // 发送添加属性请求
  const res: any = await reqAddOrUpdateAttr(attrParams.value)
  if (res.code === 200) {
    cardFlag.value = 0
    getAttr()
    ElMessage({ type: 'success', message: attrParams.value.id ? '修改成功' : '添加成功' })
  } else {
    ElMessage({ type: 'error', message: attrParams.value.id ? '修改失败' : '添加失败' })
  }
}

// input失去焦点
const toLook = (row: AttrValue, $index: number, e: any) => {
  // 判断属性值是否为空
  if (row.valueName.trim() === '') {
    attrParams.value.attrValueList.splice($index, 1)
    ElMessage({ type: 'error', message: '属性值不能为空！' })
    return
  }

  // 判断添加的属性值是否有重复
  const repeat = attrParams.value.attrValueList.find((item) => {
    if (item != row) return item.valueName === row.valueName
  })
  if (repeat) {
    attrParams.value.attrValueList.splice($index, 1)
    ElMessage({ type: 'error', message: '属性值不能重复！' })
    return
  }
}

// 路由跳转时清除下小仓库存储的数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<template>
  <!--全局三级分类表单组件-->
  <Category :cardFlag="cardFlag"></Category>

  <el-card>
    <!--属性展示组件-->
    <div v-if="cardFlag === 0">
      <el-button type="primary" icon="Plus" :disabled="categoryStore.seleC3Id ? false : true" @click="addAttr"
        v-has-btn="'btn.Attr.add'">添加属性</el-button>
      <el-table border style="margin: 10px 0;" :data="attrData">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
        <el-table-column label="属性值名称">
          <template #="{ row, $index }">
            <el-tag v-for="(item, i) in row.attrValueList" :key="item.id" style="margin: 5px;">{{ item.valueName
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ row, $index }">
            <el-button type="warning" size="small" icon="Edit" @click="updateAttr(row)"></el-button>
            <el-popconfirm title="确认删除此项？" @confirm="deleteAttr(row.id)">
              <template #reference>
                <el-button type="danger" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--添加属性组件-->
    <div v-if="cardFlag === 1">
      <el-form :inline="true">
        <el-form-item label="属性名称">
          <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="Plus" :disabled="attrParams.attrName ? false : true"
        @click="addAttrValue">添加属性值</el-button>
      <!-- <el-button type="info" @click="cancel">取消</el-button> -->
      <el-table border style="margin: 10px 0;" :data="attrParams.attrValueList">
        <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
        <el-table-column label="属性值名称">
          <template #="{ row, $index }">
            <!--@focus="toEdit(row, $event)"-->
            <el-input placeholder="请你输入属性值名称" v-model="row.valueName" @blur="toLook(row, $index, $event)" ref="inputRef"
              class="inputDeep"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button type="danger" size="small" icon="Delete"
              @click="attrParams.attrValueList.splice($index, 1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="save"
        :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
      <el-button type="info" @click="cancel">取消</el-button>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.inputDeep {
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    cursor: default;

    .el-input__inner {
      cursor: default !important;
    }
  }
}
</style>
