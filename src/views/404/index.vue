<script setup lang="ts"></script>

<template>
  <div class="box">
    <img src="../../assets/images/error_images/4041.png" alt="">
  </div>
  <div class="btn">
    <el-button type="primary" size="large" icon="back" @click="$router.replace('/home')">返回首页</el-button>
  </div>
</template>

<style scoped lang="scss">
.box {
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    background: none;
  }
}

.btn {
  display: flex;
  justify-content: center;
}
</style>