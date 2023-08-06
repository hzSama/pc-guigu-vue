<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { reqHasTrademark, addOrUpdateTrademark, deleteTrademark } from '@/api/product/trademark/index'
import type { Records, TradeMarkResData, TradeMark } from '@/api/product/trademark/type'
//@ts-ignore
import type { UploadProps } from 'element-plus/es/components/index'
import { ElMessage } from 'element-plus'

// 请求已有品牌数据函数
const pageNo = ref<number>(1)
const limit = ref<number>(3)
const total = ref<number>(0)
const trademarkData = ref<Records>([])
const getHasTrademark = async () => {
  const res: TradeMarkResData = await reqHasTrademark(pageNo.value, limit.value)
  if (res.code === 200) {
    total.value = res.data.total
    trademarkData.value = res.data.records
  }
}
// 页面渲染完成发送请求
onMounted(() => {
  getHasTrademark()
})

// 改变页码事件
const changePageNo = () => {
  getHasTrademark()
}
// 改变每页展示条数事件
const sizeChange = () => {
  pageNo.value = 1 // 每次修改展示条数时，页码归一
  getHasTrademark()
}

// dialog对话框
const dialogVisible = ref<boolean>(false)
// 对话框收集的品牌数据
const trademarkParams = ref<TradeMark>({
  tmName: '',
  logoUrl: ''
})
// 添加品牌事件
const addTrademark = () => {
  // 清除校验错误提示
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
  // 清除数据
  delete trademarkParams.value.id
  trademarkParams.value.tmName = ''
  trademarkParams.value.logoUrl = ''
  dialogVisible.value = true
}
// 编辑品牌事件
const updateTrademark = (row: any) => {
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
  trademarkParams.value.id = row.id
  trademarkParams.value.tmName = row.tmName
  trademarkParams.value.logoUrl = row.logoUrl
  dialogVisible.value = true
}
// 点击确定事件
const confirm = async () => {
  // 发请求前完成对整个表单的校验(只有校验通过后才执行后续请求代码)
  await formRef.value.validate()

  // 使用接口添加或编辑品牌
  const res = await addOrUpdateTrademark(trademarkParams.value)
  if (res.code === 200) {
    ElMessage({ type: 'success', message: trademarkParams.value.id ? '编辑品牌成功' : '添加品牌成功' })
    getHasTrademark()
    dialogVisible.value = false
  } else {
    ElMessage({ type: 'error', message: trademarkParams.value.id ? '编辑品牌失败' : '添加品牌失败' })
  }
}
// 点击取消事件
const cancel = () => {
  dialogVisible.value = false
}

// 图片上传文件前触发的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile: any) => {
  if (rawFile.type === 'image/png' || rawFile.type === 'image/jpeg' || rawFile.type === 'image/gif') {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({ type: 'error', message: '请上传4M以下的文件' })
      return false
    }
  } else {
    ElMessage({ type: 'error', message: '请上传png/jpeg/gif类型文件' })
    return false
  }
}
// 图片文件上传成功触发的钩子
// response为此次上传图片成功后返回的数据(返回了图片地址)
const handleAvatarSuccess: UploadProps['onSuccess'] = (response: any, uploadFile: any) => {
  trademarkParams.value.logoUrl = response.data
  formRef.value.clearValidate('logoUrl')
}

// dialog内表单校验
const formRef = ref()
const rules = {
  tmName: [{
    required: true, trigger: 'change', validator: (rule: any, value: any, call: any) => {
      if (value.trim().length >= 2) {
        call()
      } else {
        call(new Error('*品牌名称字数需大于或等于两位'))
      }
    }
  }],
  logoUrl: [{
    required: true, validator: (rule: any, value: any, call: any) => {
      if (value) {
        call()
      } else {
        call(new Error('品牌logo不能为空'))
      }
    }
  }]
}

// 确定删除项事件
const removeTrademark = async (id: number) => {
  const res = await deleteTrademark(id)
  if (res.code === 200) {
    pageNo.value = trademarkData.value.length > 1 ? pageNo.value : pageNo.value - 1
    getHasTrademark()
    ElMessage({ type: 'success', message: '删除成功！' })
  } else {
    ElMessage({ type: 'error', message: '删除失败！' })
  }
}
</script>

<template>
  <el-card class="box-card">
    <el-button type="primary" icon="Plus" @click="addTrademark" v-has-btn="'btn.Trademark.add'">添加品牌</el-button>
    <!--表格组件-->
    <el-table border style="margin: 10px 0;" :data="trademarkData">
      <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
      <el-table-column label="名牌名称" align="center" prop="tmName"></el-table-column>
      <el-table-column label="品牌Logo" align="center">
        <template #="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px;height: 100px;">
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="Edit" @click="updateTrademark(row)"></el-button>
          <!--气泡确认框-->
          <el-popconfirm title="确定删除此项？" icon="Delete" @confirm="removeTrademark(row.id)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--分页器组件--> <!--pageNo与limit已使用v-model实现双向绑定-->
    <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]"
      layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @current-change="changePageNo"
      @size-change="sizeChange" />
  </el-card>
  <!--对话框组件-->
  <el-dialog v-model="dialogVisible" :title="trademarkParams.id ? '编辑品牌' : '添加品牌'">
    <el-form style="width: 80%;" :model="trademarkParams" :rules="rules" ref="formRef">
      <el-form-item label="品牌名称" prop="tmName">
        <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
      </el-form-item>
      <el-form-item label="品牌logo" prop="logoUrl">
        <!--action:图片上传路径;
            before-upload:在上传前触发钩子，可在钩子内限制上传文件的类型和大小;
            on-success:上传成功后触发的钩子;-->
        <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!--dialog底部具名插槽-->
    <template #footer>
      <el-button type="info" @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
