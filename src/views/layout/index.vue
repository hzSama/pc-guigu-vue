<script setup lang="ts">
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Tabbar from './tabbar/index.vue'
import { nextTick, ref, watch, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useLayoutSettingStore } from '@/stores/setting'
// import { useUserStore } from '@/stores/user'
// import { onBeforeRouteLeave, onBeforeRouteUpdate, useRouter } from 'vue-router'

// 菜单导航仓库
const menuStore = useUserStore()

// layout组件相关配置仓库
const layoutSettingStore = useLayoutSettingStore()

// 刷新内容区域(监听仓库中的数据是否变化，变化则刷新)
let flag = ref(true)
watch(() => layoutSettingStore.refresh, () => {
  flag.value = false
  // 数据变化后页面渲染完成后，再次创建组件完成刷新功能
  nextTick(() => { flag.value = true })
})

// Layout渲染完成后发起获取用户信息请求
// const userStore = useUserStore()
// const $router = useRouter()
// onMounted(async () => {
//   try {
//     await userStore.getUserInfo()
//   } catch (error) {
//     userStore.userLogout()
//     $router.push('/login')
//   }
// })
</script>

<template>
  <div class="layout_container">
    <!--左侧菜单--> <!--动态增加类fold-->
    <div class="layout_slider" :class="{ fold: layoutSettingStore.fold ? true : false }">
      <Logo></Logo>
      <!--滚动组件-->
      <el-scrollbar class="scrollbar">
        <!--菜单--> <!--:default-active为默认激活menu-item中index为本属性值那项-->
        <el-menu background-color="#001529" text-color="white" :default-active="$route.path"
          :collapse="layoutSettingStore.fold">
          <Menu :menuList="menuStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!--顶部导航-->
    <div class="layout_tabbar" :class="{ fold: layoutSettingStore.fold ? true : false }">
      <Tabbar></Tabbar>
    </div>
    <!--内容区域-->
    <div class="layout_main" :class="{ fold: layoutSettingStore.fold ? true : false }">
      <router-view v-if="flag"></router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-background;
    transition: all 0.2s;

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        border-right: none;
      }
    }

    // 若为折叠则添加动态类改变宽度
    &.fold {
      width: $base-menu-min-width;
    }
  }

  .layout_tabbar {
    position: fixed;
    top: 0px;
    left: $base-menu-width;
    z-index: 1;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    border-bottom: 1px solid #ededed;
    transition: all 0.2s;

    // 若为折叠则添加动态类改变宽度
    &.fold {
      width: calc(100% - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  .layout_main {
    position: absolute;
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    // 滚动条
    overflow: auto;
    transition: all 0.2s;

    // 若为折叠则添加动态类改变宽度
    &.fold {
      width: calc(100% - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>