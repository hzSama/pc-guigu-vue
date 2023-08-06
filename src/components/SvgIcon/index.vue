<!--全局svg icons组件-->
<template>
  <svg :style="{ width, height }">
    <use :xlink:href="`#icon-${name}`"></use>
  </svg>
</template>

<script setup lang="ts">
defineProps({
  name: String,
  color: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '16px'
  },
  height: {
    type: String,
    default: '16px'
  },
})
</script>

<style scoped></style>