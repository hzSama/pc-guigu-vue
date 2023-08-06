<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SpuData, AllTrademark, Trademark, SpuImgs, Img, SaleAttrResData, SaleAttr, HasSaleAttrResData, HasSaleAttr, SaleAttrValue } from '@/api/product/spu/type'
import { reqAllTrademark, reqSpuImages, reqSpuAttrList, reqSpuSaleAttr, reqAddOrUpdateSpu } from '@/api/product/spu'
import { ElMessage } from 'element-plus'

// 点击取消事件(向父组件传递flag)
const emit = defineEmits(['changeCardFlag'])
const cancel = () => {
  emit('changeCardFlag', 0)
}

// 编辑或新增SPU所需数据
const spuParams = ref<SpuData>({
  category3Id: '',
  spuName: '',
  description: '',
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: []
})
const allTrademark = ref<Trademark[]>([])
const spuImages = ref<Img[]>([])
const saleAttrData = ref<SaleAttr[]>([])
const allSaleAttrData = ref<HasSaleAttr[]>([])
// 初始化需要编辑的那条spu函数
const initSpu = async (row: SpuData) => {
  spuParams.value = row
  // 请求所需数据
  const res: AllTrademark = await reqAllTrademark()
  const res1: SpuImgs = await reqSpuImages(row.id)
  const res2: SaleAttrResData = await reqSpuSaleAttr(row.id)
  const res3: HasSaleAttrResData = await reqSpuAttrList()
  allTrademark.value = res.data
  spuImages.value = res1.data.map(item => { return { name: item.imgName, url: item.imgUrl } })
  saleAttrData.value = res2.data
  allSaleAttrData.value = res3.data
}
// 新增spu初始化函数
const initAddSpu = async (category3Id: number | string) => {
  // 清空数据
  Object.assign(spuParams.value, {
    category3Id: '',
    spuName: '',
    description: '',
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: []
  })
  spuImages.value = []
  saleAttrData.value = []
  saleAttrIdAndName.value = ''

  spuParams.value.category3Id = category3Id
  // 请求所需数据
  const res: AllTrademark = await reqAllTrademark()
  const res1: HasSaleAttrResData = await reqSpuAttrList()
  allTrademark.value = res.data
  allSaleAttrData.value = res1.data
}

// 暴露initSpu给父组件
defineExpose({ initSpu, initAddSpu })

// 点击照片墙预览事件
const dialogVisible = ref<boolean>(false)
const dialogImageUrl = ref<string>('')
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url // 存储预览图片的地址在对话框中打开
  dialogVisible.value = true // 展示对话框
}
// 点击移除图片事件
const handleRemove = () => {

}
// 上传照片前触发事件(约束上传文件类型与大小)
const handleUpload = (file: any) => {
  if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif') {
    if (file.siez / 1024 / 1024 < 6) {
      return true
    } else {
      ElMessage({ type: 'error', message: '请上传小于6M的文件!' })
      return false
    }
  } else {
    ElMessage({ type: 'error', message: '请上传图片类型文件!' })
    return false
  }
}

// 计算属性计算还未添加的销售属性
const unSeleSaleAttr = computed(() => {
  return allSaleAttrData.value.filter(item => {
    return saleAttrData.value.every(item1 => item.name != item1.saleAttrName)
  })
})

// 点击添加一条销售属性事件
const saleAttrIdAndName = ref<string>('') // 收集新填的销售属性名与id
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndName.value.split('-')
  const needAddAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: []
  }
  saleAttrData.value.push(needAddAttr)
  saleAttrIdAndName.value = ''
}

// 编辑属性值模式事件
const toEdit = (row: SaleAttr) => {
  row.saleAttrValue = ''
  row.flag = true
}
// 查看属性值模式事件
const toLook = (row: SaleAttr) => {
  // 处理新增属性值对象
  const { baseSaleAttrId, saleAttrValue } = row
  const newValue = {
    baseSaleAttrId,
    saleAttrValueName: (saleAttrValue as string)
  }
  // 判断新增属性值是否为空及是否重复
  if ((saleAttrValue as string).trim() === '') {
    ElMessage({ type: 'error', message: '新增属性值不能为空!' })
    delete row.flag
    return
  }
  if (row.spuSaleAttrValueList.find(item => item.saleAttrValueName === saleAttrValue)) {
    ElMessage({ type: 'error', message: '新增属性值不能重复!' })
    delete row.flag
    return
  }
  // 往属性值数组push新增属性值对象
  row.spuSaleAttrValueList.push(newValue)
  delete row.saleAttrValue
  delete row.flag
}

// 点击保存事件
const save = async () => {
  // 整理参数
  spuParams.value.spuImageList = spuImages.value.map((item: any) => {
    return { imgName: item.name, imgUrl: item.response ? item.response.data : item.url }
  })
  spuParams.value.spuSaleAttrList = saleAttrData.value

  // 发送请求
  const res: any = await reqAddOrUpdateSpu(spuParams.value)
  if (res.code === 200) {
    ElMessage({ type: 'success', message: spuParams.value.id ? '更新成功' : '添加成功' })
    emit('changeCardFlag', 0)
  } else {
    ElMessage({ type: 'error', message: spuParams.value.id ? '更新失败' : '添加失败' })
  }
}
</script>

<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请你输入SPU名称" v-model="spuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="spuParams.tmId">
        <el-option v-for="item in allTrademark" :key="item.id" :label="item.tmName" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="请你输入描述..." v-model="spuParams.description"></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload v-model:file-list="spuImages" action="/api/admin/product/fileUpload" list-type="picture-card"
        :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-beforeUpload="handleUpload">
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible" width="400px" height="400px">
        <img w-full :src="dialogImageUrl" alt="图片裂开了" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select v-model="saleAttrIdAndName">
        <el-option v-for="item in unSeleSaleAttr" :key="item.id" :label="item.name"
          :value="`${item.id}-${item.name}`"></el-option>
      </el-select>
      <el-button type="primary" icon="Plus" style="margin: 0 10px;" :disabled="saleAttrIdAndName ? false : true"
        @click="addSaleAttr">添加销售属性</el-button>
      <el-table border style="margin: 10px 0;" :data="saleAttrData">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="销售属性名" width="120px" prop="saleAttrName"></el-table-column>
        <el-table-column label="销售属性值">
          <template #="{ row, $index }">
            <el-tag v-for="(item, i) in row.spuSaleAttrValueList" :key="row.id" class="mx-1" closable
              @close="row.spuSaleAttrValueList.splice(i, 1)">
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input v-if="row.flag === true" placeholder="请输入属性值" size="small" style="width: 100px;"
              v-model="row.saleAttrValue" @blur="toLook(row)"></el-input>
            <el-button v-else type="success" size="small" icon="Plus" @click="toEdit(row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ row, $index }">
            <el-button type="danger" size="small" icon="Delete" @click="saleAttrData.splice($index, 1)"></el-button>
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
