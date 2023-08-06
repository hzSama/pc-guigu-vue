<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/category'

const categoryStore = useCategoryStore()

// 请求一级分类函数
const getC1 = async () => {
  await categoryStore.getC1()
}
onMounted(() => {
  getC1()
})

// 一级下拉菜单选项变化事件
const c1Change = async () => {
  // 清空旧二级三级分类数据
  categoryStore.clearC2C3()
  // 请求新二级分类
  await categoryStore.getC2()
}

// 二级下拉菜单选项变化事件
const c2Change = async () => {
  // 清空旧三级分类数据
  categoryStore.clearC3()
  // 请求新三级分类
  await categoryStore.getC3()
}

// 三级下拉菜单选项变化事件
const c3Change = async () => {
  // 请求属性
}

// 获取父组件传递过来的Flag
defineProps(["cardFlag"])
</script>

<template>
  <el-card style="margin-bottom: 10px;">
    <el-form inline>
      <el-form-item label="一级分类">
        <el-select v-model="categoryStore.seleC1Id" @change="c1Change" :disabled="cardFlag === 0 ? false : true">
          <el-option v-for="(c1, i) in categoryStore.c1Data" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="categoryStore.seleC2Id" @change="c2Change" :disabled="cardFlag === 0 ? false : true">
          <el-option v-for="(c2, i) in categoryStore.c2Data" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="categoryStore.seleC3Id" @change="c3Change" :disabled="cardFlag === 0 ? false : true">
          <el-option v-for="(c3, i) in categoryStore.c3Data" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped lang="scss"></style>
