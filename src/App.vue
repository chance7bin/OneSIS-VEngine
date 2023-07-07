<template>
  <el-row style="height: 100%; width: 100%;">
    <el-col style="background-color: rgb(9, 2, 42);" :span="3">
      <Menu />
    </el-col>
    <el-col :span="21">
      <RouterView />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import Menu from '~/pages/Menu.vue'
</script>

<style scoped>

:deep(.el-menu) {
  border-right: 0px;
}
</style>
