<template>
  <div class="container">
    <div class="title">
      <span class="itemName" type="text">OneSIS-<span class="color">V</span>Engine
      </span>
    </div>
    <!-- <el-divider /> -->
    <div class="menuContainer">
      <el-menu active-text-color="#ffa04b" background-color="rgb(9, 2, 42)" class="el-menu-vertical-demo"
        default-active="1" text-color="#fff" @open="handleOpen" @close="handleClose" router="true">
        <el-menu-item index="1" route="/data">
          <template #title>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#onesis-wulitu_shujuku"></use>
            </svg>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span class="menuFont">数据资源</span>
          </template>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#onesis-dituzhitu"></use>
            </svg>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span class="menuFont">制图服务</span>
          </template>
          <el-menu-item index="2-1" route="/tileMap">基于瓦片服务制图</el-menu-item>
          <el-menu-item index="2-2" route="/featureMap">基于要素服务制图</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#onesis-fenlei1"></use>
            </svg>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span class="menuFont">功能分类</span>
          </template>
          <el-menu-item-group title="二维">
            <el-menu-item index="3-1">基本功能</el-menu-item>
            <el-menu-item index="3-2">空间分析</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="三维">
            <el-menu-item index="3-3">Geometry</el-menu-item>
            <el-menu-item index="3-4">OGC服务</el-menu-item>
            <el-menu-item index="3-5">CZML</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item index="4">
          <template #title>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#onesis-yingyongshangdian-"></use>
            </svg>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span class="menuFont">主题应用</span>
          </template>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
</script>

<style scoped>
@import url('../assets/fonts/fonts.css');

.container {
  height: 100%;
  width: 100%;
}

.itemName {
  font-size: 25px;
  color: #ffffff;
  text-align: center;
  line-height: 10px;
  /* position: fixed; */
  left: 65px;
  font-family: 'Kaushan Script';
  padding-left: 8px;
  /* top:0px; */
  /* text-shadow: (2px 1px 3px red); */
}

.color {
  color: #ff0000;
}

.title {
  height: 8%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menuFont {
  font-size: 18px;
}

/* :deep(.el-sub-menu__title) {
  justify-content: space-evenly;
} */

.icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>