<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { reqAllUserInfo, reqAddOrUpdateUser, reqRoleInfo, reqSetRole, reqDeleteUser, reqDeleteAllUser } from '@/api/acl/user/index'
import type { UserResData, User, RoleInfoResData, AllRole, SetRoleData } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
import { useLayoutSettingStore } from '@/stores/setting'

const pageNo = ref<number>(1)
const limit = ref<number>(5)
const total = ref<number>(0)

// 请求用户数据函数
const allUserInfo = ref<User[]>([])
const getAllUserInfo = async () => {
  const res: UserResData = await reqAllUserInfo(pageNo.value, limit.value, keyword.value)
  if (res.code === 200) {
    allUserInfo.value = res.data.records
    total.value = res.data.total
  }
}
onMounted(() => {
  getAllUserInfo()
})

// 改变limit事件
const changeSize = () => {
  getAllUserInfo()
  pageNo.value = 1
}

// 打开抽屉1组件事件
const drawer = ref<boolean>(false)
const userParams = ref<User>({
  username: '',
  password: '',
  name: '',
})
const addNewUser = () => {
  // 清理旧数据
  delete userParams.value.id
  Object.assign(userParams.value, {
    username: '',
    password: '',
    name: '',
  })
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
  drawer.value = true
}
const updateUser = (row: User) => {
  Object.assign(userParams.value, row)
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
  drawer.value = true
}

// 点击确认事件
const save = async () => {
  // 校验所有表单数据
  await formRef.value.validate()
  // 请求添加或编辑用户
  const res: any = await reqAddOrUpdateUser(userParams.value)
  if (res.code === 200) {
    drawer.value = false
    ElMessage({ type: 'success', message: userParams.value.id ? '更新成功' : '添加成功' })
    getAllUserInfo()
    window.location.reload()
  } else {
    drawer.value = false
    ElMessage({ type: 'error', message: userParams.value.id ? '更新失败' : '添加失败' })
  }
}
// 添加或编辑用户表单校验
const formRef = ref()
const rules = {
  username: [
    { required: true, trigger: 'blur', min: 5, max: 10, message: '用户名应为5-10位' }
  ],
  name: [
    { required: true, trigger: 'blur', min: 5, message: '用户昵称应为至少5位' }
  ],
  password: [
    { required: true, trigger: 'blur', min: 5, max: 11, message: '密码应为5-11位' }
  ]
}

// 打开抽屉2组件事件
const drawer2 = ref<boolean>(false)
const allRole = ref<AllRole>([])
const checkedRole = ref<AllRole>([])
const setRole = async (row: User) => {
  Object.assign(userParams.value, row)
  const res: RoleInfoResData = await reqRoleInfo((userParams.value.id as number))
  if (res.code === 200) {
    allRole.value = res.data.allRolesList
    checkedRole.value = res.data.assignRoles
    drawer2.value = true
  }
}

// checkbox系列事件
const checkAll = ref<boolean>(false)
const isIndeterminate = ref<boolean>(true)
// 全选change事件
const checkAllChange = (val: boolean) => {
  checkedRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
// 选项change事件
const checkChange = (value: string[]) => {
  checkAll.value = value.length === allRole.value.length
  isIndeterminate.value = value.length > 0 && value.length < allRole.value.length
}

// 点击确定分配角色事件
const saveRole = async () => {
  // 整理参数
  const data: SetRoleData = {
    userId: (userParams.value.id as number),
    roleIdList: checkedRole.value.map(item => item.id)
  }
  // 发送请求
  const res: any = await reqSetRole(data)
  if (res.code === 200) {
    ElMessage({ type: 'success', message: '分配成功' })
    drawer2.value = false
    getAllUserInfo()
  }
}

// 删除单个用户事件
const deleteUser = async (userId: number) => {
  const res: any = await reqDeleteUser(userId)
  if (res.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getAllUserInfo()
  }
}
// table复选框勾选事件
const seleId = ref<User[]>([])
const seleChange = (value: any) => {
  seleId.value = value
}
// 批量删除用户事件
const deleteAllUser = async () => {
  // 整理参数
  const idList: any = seleId.value.map(item => item.id)
  // 发送请求
  const res: any = await reqDeleteAllUser(idList)
  if (res.code === 200) {
    ElMessage({ type: 'success', message: '批量删除成功' })
    getAllUserInfo()
  }
}

// 搜索事件
const keyword = ref<string>('')
const search = () => {
  getAllUserInfo() // 搜索用户与获取所有用户的请求相同，但多了个keyword参数
  keyword.value = ''
}
// 重置事件
const setting = useLayoutSettingStore()
const reset = () => {
  setting.changeRefresh()
}
</script>

<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请你输入用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="keyword ? false : true" @click="search">搜索</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-button type="primary" @click="addNewUser">添加</el-button>
    <el-button type="danger" :disabled="seleId.length ? false : true" @click="deleteAllUser">批量删除</el-button>
    <el-table style="margin: 10px 0;" border :data="allUserInfo" @selection-change="seleChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="序号" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="用户名字" align="center" prop="username"></el-table-column>
      <el-table-column label="用户昵称" align="center" prop="name"></el-table-column>
      <el-table-column label="用户角色" align="center" prop="roleName"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
      <el-table-column label="更新事件" align="center" prop="updateTime"></el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
          <el-button type="warning" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
          <el-popconfirm title="确定删除此项吗" @confirm="deleteUser(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[5, 7, 9]"
      layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @current-change="getAllUserInfo"
      @size-change="changeSize" />
  </el-card>
  <!--抽屉组件:添加或编辑用户-->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '编辑用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户名字" prop="username">
          <el-input placeholder="请输入用户名字" v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" prop="name">
          <el-input placeholder="请输入用户昵称" v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="userParams.id ? false : true">
          <el-input placeholder="请输入用户密码" v-model="userParams.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="save">确认</el-button>
      </div>
    </template>
  </el-drawer>
  <!--抽屉组件:分配角色-->
  <el-drawer v-model="drawer2">
    <template #header>
      <h4>分配角色</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="checkAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="checkedRole" @change="checkChange">
            <el-checkbox v-for="(item, i) in allRole" :key="i" :label="item">{{ item.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer2 = false">取消</el-button>
        <el-button type="primary" @click="saveRole">确认</el-button>
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
