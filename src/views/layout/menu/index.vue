<script setup lang="ts">
import { useRouter } from 'vue-router'

// 获取路由数组
defineProps(['menuList'])

// 点击menu跳转路由事件
const $router = useRouter()
const goRoute = (vc: any) => {
  $router.push(vc.index)
}
</script>

<template>
  <!--循环遍历路由项-->
  <template v-for="(item, i) in menuList" :key="item.path">
    <!--没有子路由-->
    <el-menu-item v-if="!item.children && !item.meta.hidden" :index="item.path" @click="goRoute">
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <template #title>
        <span>{{ item.meta.title }}</span>
      </template>
    </el-menu-item>
    <!--有一个子路由-->
    <el-menu-item v-if="item.children && item.children.length == 1 && !item.children[0].meta.hidden"
      :index="item.children[0].path" @click="goRoute">
      <el-icon>
        <component :is="item.children[0].meta.icon"></component>
      </el-icon>
      <template #title>
        <span>{{ item.children[0].meta.title }}</span>
      </template>
    </el-menu-item>
    <!--有至少两个子路由-->
    <el-sub-menu v-if="item.children && item.children.length > 1 && item.children && !item.meta.hidden"
      :index="item.path">
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <!--将子路由组件递归-->
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>
<script lang="ts">
export default {
  name: 'Menu'
}
</script>

<style scoped lang="scss"></style>
