<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLayoutSettingStore } from '@/stores/setting'
import { useUserStore } from '@/stores/user'
// 获取user仓库
const userStore = useUserStore()

// 点击菜单折叠事件
const layoutSettingStore = useLayoutSettingStore()
const changeIcon = () => {
  // 修改折叠图标
  layoutSettingStore.changeFold()
}

// 点击刷新事件
const updateRefresh = () => {
  layoutSettingStore.changeRefresh()
}

// 点击全屏事件
const fullScreen = () => {
  // document.fullscreenElement是DOM自带的判断是否全屏的属性
  let fullFlag = document.fullscreenElement
  if (!fullFlag) {
    document.documentElement.requestFullscreen() // Dom自带的打开全屏方法
  } else {
    document.exitFullscreen() // Dom自带的退出全屏方法
  }
}

// 点击退出登录事件
const $router = useRouter()
const $route = useRoute()
const logout = async () => {
  await userStore.userLogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}

// 设置事件
// 暗黑模式
const dark = ref<boolean>(false)
const changeDark = () => {
  const html = document.documentElement
  dark.value ? html.className = 'dark' : html.className = ''
}
// 主题色切换
const color = ref('#409eff')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
const setColor = () => {
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
  html.style.setProperty('--el-color-warning', color.value)
  html.style.setProperty('--el-color-danger', color.value)
}
</script>

<template>
  <div class="tabbar">
    <!--顶部左侧-->
    <div class="tabbar_left">
      <el-icon style="margin-right: 10px;" @click="changeIcon">
        <Expand v-if="!layoutSettingStore.fold"></Expand>
        <Fold v-if="layoutSettingStore.fold"></Fold>
      </el-icon>
      <!--面包屑-->
      <el-breadcrumb separator-icon="ArrowRight">
        <!--$route.matched可以拿到所处路由路径的所有路由信息-->
        <el-breadcrumb-item v-for="(item, i) in $route.matched" :key="item.path" v-show="item.meta.title" :to="item.path">
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--顶部右侧-->
    <div class="tabbar_right">
      <el-button size="small" circle icon="Refresh" @click="updateRefresh"></el-button>
      <el-button size="small" circle icon="FullScreen" @click="fullScreen"></el-button>
      <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
        <el-form>
          <el-form-item label="主题颜色">
            <el-color-picker v-model="color" show-alpha :predefine="predefineColors" size="small" @change="setColor" />
          </el-form-item>
          <el-form-item label="暗黑模式">
            <el-switch v-model="dark" size="default" inactive-icon="Sunny" active-icon="Moon" inline-prompt
              @change="changeDark" />
          </el-form-item>
        </el-form>
        <template #reference>
          <el-button size="small" circle icon="Setting"></el-button>
        </template>
      </el-popover>
      <img :src="userStore.userInfo.avatar" alt=""
        style="background-color: transparent;width: 24px;height: 24px;margin: 0 10px; border-radius: 50%;">
      <!--下拉菜单-->
      <el-dropdown>
        <span class="el-dropdown-link" style="outline: none">
          {{ userStore.userInfo.name }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </div>
  </div>
</template>

<style scoped lang="scss">
.tabbar {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  z-index: 2;

  .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }

  .tabbar_right {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
}
</style>
