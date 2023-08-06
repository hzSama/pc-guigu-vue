<script setup lang="ts">
import { useLayoutSettingStore } from '@/stores/setting'
const layoutSettingStore = useLayoutSettingStore()
</script>

<template>
  <div class="logo">
    <img src="../../../../public/logo.jpg">
    <p :class="{ fold: layoutSettingStore.fold ? true : false }">硅谷甄选运营平台</p>
  </div>
</template>

<style scoped lang="scss">
.logo {
  display: flex;
  align-items: center;
  width: 100%;
  height: $base-menu-logo-height;
  padding: 0 10px;
  color: white;

  img {
    width: 40px;
    height: 40px;
    background: none;
  }

  p {
    white-space: nowrap;
    font-size: $base-logo-title-fontsize;
    margin-left: 10px;
    transition: all 1s;

    &.fold {
      opacity: 0;
    }
  }
}
</style>
