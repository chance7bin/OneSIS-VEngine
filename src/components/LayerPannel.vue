<template>
  <div class="all">
    <div class="custom-tree-container">
      <div class="header">
        <div class="btnCon">
          <el-icon size="30" class="backBtn" title="收起图层列表" @click="closeLayerPannel">
            <Back />
          </el-icon>
        </div>
        <div class="title">
          <span>图层管理</span>
        </div>
      </div>
      <el-divider style="margin-top: 0; margin-bottom: 0px;"></el-divider>
      <div class="layerEditCon">
        <el-button type="primary" :icon="Plus" circle title="图层添加" />
        <el-button type="success" :icon="Link" circle title="图层分享" />
        <el-button type="primary" :icon="Upload" circle title="图层导出" />
        <el-button type="danger" :icon="Delete" circle title="图层删除" />
      </div>
      <el-divider style="margin-top: 0; margin-bottom: 0px;"></el-divider>
      <div class="treeCon">
        <el-tree :data="layerList" show-checkbox node-key="layerName" :default-checked-keys="checkedLayers"
          default-expand-all :expand-on-click-node="false">
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>
                <svg class="icon" aria-hidden="true">
                  <use v-if="data.dataType === 'POINT'" xlink:href="#icon-dian"></use>
                  <use v-else-if="data.dataType === 'MULTILINESTRING'" xlink:href="#icon-poly-line"></use>
                  <use v-else-if="data.dataType === 'MULTIPOLYGON'" xlink:href="#icon-polygon"></use>
                </svg>
                <el-divider direction="vertical" border-style="hidden"></el-divider>
                <span>{{ data.layerName }}</span>
              </span>
            </span>
          </template>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, toRefs } from 'vue'
import {
  Plus,
  Back,
  Delete,
  Upload,
  Link
} from '@element-plus/icons-vue'
import { ref, reactive, computed } from 'vue'
import { useSceneStore } from '~/store/scene'
interface Tree {
  id: number
  label: string,
  dataType: string,
  children?: Tree[]
}
const sceneStore = useSceneStore()
const props = defineProps({
  menuWidth: {
    type: String,
    default: '65px'
  },
  layerList: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['closeLayerPannel'])
const { menuWidth, layerList } = toRefs(props)

const checkedLayers = computed(() => {
  return layerList.value.map((item: any) => item.layerName)
})

const closeLayerPannel = () => {
  emit('closeLayerPannel')
}
</script>

<style scoped>
.all {
  display: flex;
  background-color: rgb(255, 255, 255);
  height: 100%;
  width: 300px;
  margin-left: v-bind(menuWidth);
  position: fixed;
  z-index: 999;
}

.custom-tree-container {
  width: 100%;
  height: 100%;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.el-tree {
  background-color: rgb(255, 255, 255);
}

.a {
  color: blue
}

.header {
  height: 8%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: rgb(73, 70, 70);
  width: 100%;
  height: 100%;
  padding: 10px;
}

.btnCon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  padding: 10px;
}

.treeCon {
  padding: 20px;
}

.backBtn:hover {
  transform: scale(1.15);
  cursor: pointer;
}

.layerEditCon {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  /* width: 100%; */
  height: 5%;
  padding: 10px;
}
</style>