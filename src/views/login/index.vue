<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'
import useUserStore from '@/stores/user'

// 收集表单数据
const loginForm = ref({ username: 'admin', password: 'atguigu123' })

// 点击登录按钮事件
const useStore = useUserStore()
const $router = useRouter()
const $route = useRoute()
const formEl = ref()
const login = () => {
  formEl.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        // 登录成功
        await useStore.userLogin(loginForm.value)
        const redirect: any = $route.query.redirect
        $router.push({ path: redirect || '/' })
        ElNotification({ type: 'success', message: '欢迎回来', title: `Hi,${getTime()}好!` })
      } catch (error) {
        // 登录失败
        ElNotification({ type: 'error', message: (error as Error).message })
      }
    } else {
      return false
    }
  })

}

// element-plus表单校验
const rules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名长度至少五位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 11, message: '密码长度至少六位', trigger: 'blur' }
  ]
}
</script>

<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="formEl">
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" :prefix-icon="Lock" show-password v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="login_btn" type="primary" size="default" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .login_form {
    width: 80%;
    position: relative;
    top: 27vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0px;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>