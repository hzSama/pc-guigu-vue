<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { getTime } from '@/utils/time'
const userStore = useUserStore()
</script>

<template>
  <el-card>
    <div class="box">
      <img :src="userStore.userInfo.avatar" alt="" class="avatar">
      <div class="body">
        <h3 class="title">{{ getTime() }}好，{{ userStore.userInfo.name }}!</h3>
        <p class="sub">硅谷甄选运营平台</p>
      </div>
    </div>
  </el-card>
  <div class="bottom">
    <SvgIcon name="welcome" width="600px" height="400px"></SvgIcon>
  </div>
</template>

<style scoped lang="scss">
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .body {
    margin-left: 20px;

    .title {
      font-size: 28px;
      font-weight: 900;
      margin-bottom: 30px;
    }

    .sub {
      font-style: italic;
      color: skyblue;
    }
  }
}

.bottom {
  display: flex;
  justify-content: center;
}
</style>