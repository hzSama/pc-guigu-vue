<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { useLayoutSettingStore } from '@/stores/setting'
import { reqAllRoleList, reqAddOrUpdateRole, reqAllPermission, reqSetPermission, reqDeleteRole } from '@/api/acl/role'
import type { RoleResData, RoleData, PermissionResData, PermissionList } from '@/api/acl/role/type'
import { ElMessage } from 'element-plus'

// 分页器数据
const pageNo = ref<number>(1)
const limit = ref<number>(10)
const total = ref<number>(0)
// 改变每页展示数据量事件
const sizeChange = () => {
  getAllRoleList()
  pageNo.value = 1
}

// 请求数据函数
const roleList = ref<RoleData[]>([])
const getAllRoleList = async () => {
  const res: RoleResData = await reqAllRoleList(pageNo.value, limit.value, keyword.value)
  if (res.code === 200) {
    roleList.value = res.data.records
    total.value = res.data.total
  }
}
onMounted(() => {
  getAllRoleList()
})

// 搜索与重置事件
const keyword = ref<string>('')
const search = () => {
  getAllRoleList()
  keyword.value = ''
}
const setting = useLayoutSettingStore()
const reset = () => {
  setting.changeRefresh()
}

// 添加或编辑角色
const dialogFlag = ref<boolean>(false)
const roleParams = ref<RoleData>({
  roleName: ''
})
const addNewRole = () => {
  delete roleParams.value.id
  Object.assign(roleParams.value, { roleName: '' })
  nextTick(() => {
    formRef.value.clearValidate('roleName')
  })
  dialogFlag.value = true
}
const updateRole = (row: RoleData) => {
  Object.assign(roleParams.value, row)
  nextTick(() => {
    formRef.value.clearValidate('roleName')
  })
  dialogFlag.value = true
}
// 添加或编辑角色表单校验规则
const formRef = ref()
const rules = {
  roleName: [
    { required: true, trigger: 'blur', min: 2, message: '角色名称至少两位' }
  ]
}

// 点击确定添加或修改角色事件
const save = async () => {
  await formRef.value.validate()
  const res: any = await reqAddOrUpdateRole(roleParams.value)
  if (res.code === 200) {
    ElMessage({ type: 'success', message: roleParams.value.id ? '更新成功' : '添加成功' })
    dialogFlag.value = false
    pageNo.value = roleParams.value.id ? pageNo.value : 1
    getAllRoleList()
  }
}

// 分配权限事件
const defaultProps = {
  children: 'children',
  label: 'name',
}
const drawer = ref<boolean>(false)
const permissionData = ref<PermissionList>([])
const setPermission = async (row: RoleData) => {
  Object.assign(roleParams.value, row)
  const res: PermissionResData = await reqAllPermission((roleParams.value.id as number))
  if (res.code === 200) {
    permissionData.value = res.data
    defaultCheckedArr.value = filterdefaultArr(permissionData.value, []) // 调用筛选默认勾选函数
  }
  drawer.value = true
}
// 默认处理勾选角色
const defaultCheckedArr = ref<number[]>([])
const filterdefaultArr = (data: any, arr: any) => {
  data.forEach((item: any) => {
    if (item.children && item.children.length > 0) {
      filterdefaultArr(item.children, arr) // 递归只寻找4级默认已勾选的项
    }
    if (item.select && item.level == 4) {
      arr.push(item.id)
    }
  })
  return arr
}

// 确认保存权限事件
const treeRef = ref()
const savePermission = async () => {
  // 整理参数
  const roleId = roleParams.value.id
  const arr = treeRef.value.getCheckedKeys() // el-tree组件自带方法收集勾选id
  const arr1 = treeRef.value.getHalfCheckedKeys() // el-tree组件自带方法收集半选id
  const permissionId = arr.concat(arr1) // 将两数组结合到参数
  // 发送请求
  const res: any = await reqSetPermission((roleId as number), permissionId)
  if (res.code === 200) {
    ElMessage({ type: 'success', message: '分配权限成功' })
    drawer.value = false
    window.location.reload()
  }
}

// 删除角色事件
const deleteRole = async (roleId: number) => {
  const res: any = await reqDeleteRole(roleId)
  if (res.code === 200) {
    ElMessage({ type: 'success', message: '删除角色成功' })
    getAllRoleList()
    pageNo.value = roleList.value.length > 1 ? pageNo.value : pageNo.value - 1
  }
}
</script>

<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="角色名称:">
        <el-input placeholder="请输入角色名称" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="keyword ? false : true" @click="search">搜索</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-button type="primary" icon="Plus" @click="addNewRole">添加角色</el-button>
    <el-table style="margin: 10px 0;" border :data="roleList">
      <el-table-column type="index" align="center" label="序号" width="80px"></el-table-column>
      <el-table-column align="center" label="ID" prop="id"></el-table-column>
      <el-table-column align="center" label="角色名称" prop="roleName"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime"></el-table-column>
      <el-table-column align="center" label="更新事件" prop="updateTime"></el-table-column>
      <el-table-column align="center" label="操作" width="280px">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="Plus" @click="setPermission(row)">分配权限</el-button>
          <el-button type="warning" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
          <el-popconfirm title="确定删除此项吗？" width="220px" @confirm="deleteRole(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[10, 20, 30]"
      layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @current-change="getAllRoleList"
      @size-change="sizeChange" />
  </el-card>
  <!--dialog对话框:添加或编辑角色-->
  <el-dialog v-model="dialogFlag" :title="roleParams.id ? '编辑角色' : '添加角色'">
    <el-form :model="roleParams" :rules="rules" ref="formRef">
      <el-form-item label="角色名称" prop="roleName">
        <el-input placeholder="请输入角色名称" v-model="roleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="info" @click="dialogFlag = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!--抽屉组件:给角色分配权限-->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配权限</h4>
    </template>
    <template #default>
      <!--树形组件-->
      <el-tree :data="permissionData" show-checkbox node-key="id" default-expand-all
        :default-checked-keys="defaultCheckedArr" :props="defaultProps" ref="treeRef" />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="savePermission">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
