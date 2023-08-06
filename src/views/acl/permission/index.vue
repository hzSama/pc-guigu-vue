<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { reqAllPermission, reqAddOrUpdatePermission, reqDeletePermission } from '@/api/acl/menu/index'
import type { PermissionResData, PermissionList, Permission, PermissionParams } from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'

// 获取菜单数据函数
const permissionData = ref<PermissionList>([])
const getAllPermission = async () => {
  const res: PermissionResData = await reqAllPermission()
  if (res.code === 200) {
    permissionData.value = res.data
  }
}
onMounted(() => {
  getAllPermission()
})

// 添加或编辑菜单事件
const dialogFlag = ref<boolean>(false)
const permissionParams = ref<PermissionParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0
})
const addPermission = (row: Permission) => {
  // 清理旧数据
  delete permissionParams.value.id
  Object.assign(permissionParams.value, {
    code: '',
    level: 0,
    name: '',
    pid: 0
  })
  // 收集数据
  permissionParams.value.level = row.level + 1
  permissionParams.value.pid = row.id
  dialogFlag.value = true
}
const updatePermission = (row: Permission) => {
  Object.assign(permissionParams.value, row)
  dialogFlag.value = true
}

// 点击确定事件
const save = async () => {
  const res: any = await reqAddOrUpdatePermission(permissionParams.value)
  if (res.code) {
    ElMessage({ type: 'success', message: permissionParams.value.id ? '更新成功' : '添加成功' })
    dialogFlag.value = false
    getAllPermission()
  }
}

// 删除菜单事件
const deletePermission = async (id: number) => {
  const res: any = await reqDeletePermission(id)
  if (res.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getAllPermission()
  }
} 
</script>

<template>
  <el-table style="width: 100%; margin-bottom: 20px" row-key="id" border :data="permissionData">
    <el-table-column label="名称" prop="name"> </el-table-column>
    <el-table-column label="权限值" prop="code"></el-table-column>
    <el-table-column label="修改时间" prop="updateTime"></el-table-column>
    <el-table-column label="操作">
      <template #="{ row, $index }">
        <el-button type="primary" size="small" :disabled="row.level === 4 ? true : false" @click="addPermission(row)">
          {{ row.level === 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button type="primary" size="small" :disabled="row.level === 1 ? true : false"
          @click="updatePermission(row)">编辑</el-button>
        <el-popconfirm title="确定删除此项吗？" width="220px" @confirm="deletePermission(row.id)">
          <template #reference>
            <el-button type="primary" size="small" :disabled="row.level === 1 ? true : false">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!--dialog:添加或编辑菜单-->
  <el-dialog v-model="dialogFlag" :title="permissionParams.id ? '编辑菜单' : '添加菜单'">
    <el-form label-width="60px">
      <el-form-item label="名称">
        <el-input placeholder="请输入名称" v-model="permissionParams.name"></el-input>
      </el-form-item>
      <el-form-item label="权限值">
        <el-input placeholder="请输入权限值" v-model="permissionParams.code"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="info" @click="dialogFlag = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
