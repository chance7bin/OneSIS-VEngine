<template>
  <div class="all">
    <div class="custom-tree-container">
      <div class="header">
        <div class="btnCon">
          <el-icon size="30" class="backBtn" title="收起可视化模板列表" @click="closeToolPannel">
            <Back />
          </el-icon>
        </div>
        <div class="title">
          <span>可视化模板</span>
        </div>
      </div>
      <el-divider style="margin-top: 0; margin-bottom: 0px;"></el-divider>
      <el-scrollbar style="height: 90%">
        <el-row v-for="tool in toolLab" style="padding-top: 15px; display: flex; justify-content: center;">
          <el-card :body-style="{ padding: '0px' }" @click="selectTool(tool)">
            <img :src="'data:image/jpeg;base64,' + tool.toolImg.data" class="image" />
            <div style="padding: 14px; text-align: center;">
              <span>{{ tool.label }}</span>
            </div>
          </el-card>
        </el-row>
      </el-scrollbar>

    </div>
  </div>
  <PolygonSingleValueRenderDialog :is-dialog-show="polygonSingleValueRenderDialogShow"
    @close-polygon-single-value-render-dialog="polygonSingleValueRenderDialogShow = false" :layer-list="layers"
    @confirm-polygon-single-value-render-dialog="handleConfirmPolygonSingleValueRender" />
  <PolygonUniqueValueRenderDialog :is-polygon-unique-value-render-dialog-show="polygonUniqueValueRenderDialogShow"
    @close-polygon-unique-value-render-dialog="polygonUniqueValueRenderDialogShow = false"
    @confirm-polygon-unique-value-render-dialog="handleConfirmPolygonUniqueValueRender" />
  <PolygonHierarchicalRenderDialog :is-polygon-hierarchical-render-dialog-show="polygonHierarchicalRenderDialogShow"
    @close-polygon-hierarchical-render-dialog="polygonHierarchicalRenderDialogShow = false"
    @confirm-polygon-hierarchical-render-dialog="handleConfirmPolygonHierarchicalRender" />
  <PolygonGradualValueRenderDialog :is-polygon-gradual-value-render-dialog-show="polygonGradualValueRenderDialogShow"
    @close-polygon-gradual-value-render-dialog="polygonGradualValueRenderDialogShow = false"
    @confirm-polygon-gradual-value-render-dialog="handleConfirmPolygonGradualValueRender" />
  <PolylineSingleValueRenderDialog :is-polyline-single-value-render-dialog-show="polylineSingleValueRenderDialogShow"
    @close-polyline-single-value-render-dialog="polylineSingleValueRenderDialogShow = false"
    @confirm-polyline-single-value-render-dialog="handleConfirmPolylineSingleValueRender" />
  <PolylineUniqueValueRenderDialog :is-polyline-unique-value-render-dialog-show="polylineUniqueValueRenderDialogShow"
    @close-polyline-unique-value-render-dialog="polylineUniqueValueRenderDialogShow = false"
    @confirm-polyline-unique-value-render-dialog="handleConfirmPolylineUniqueValueRender" />
  <PolylineHierarchicalRenderDialog :is-polyline-hierarchical-render-dialog-show="polylineHierarchicalRenderDialogShow"
    @close-polyline-hierarchical-render-dialog="polylineHierarchicalRenderDialogShow = false"
    @confirm-polyline-hierarchical-render-dialog="handleConfirmPolylineHierarchicalRender" />
  <PolylineGradualValueRenderDialog :is-polyline-gradual-value-render-dialog-show="polylineGradualValueRenderDialogShow"
    @close-polyline-gradual-value-render-dialog="polylineGradualValueRenderDialogShow = false"
    @confirm-polyline-gradual-value-render-dialog="handleConfirmPolylineGradualValueRender" />
  <PointCircleSingleValueRenderDialog :is-point-single-value-render-dialog-show="pointSingleValueRenderDialogShow"
    @close-point-single-value-render-dialog="pointSingleValueRenderDialogShow = false"
    @confirm-point-single-value-render-dialog="handleConfirmPointSingleValueRender" />
  <PointCircleUniqueValueRenderDialog :is-point-unique-value-render-dialog-show="pointUniqueValueRenderDialogShow"
    @close-point-unique-value-render-dialog="pointUniqueValueRenderDialogShow = false"
    @confirm-point-unique-value-render-dialog="handleConfirmPointUniqueValueRender" />
  <PointCircleHierarchicalRenderDialog :is-point-hierarchical-render-dialog-show="pointHierarchicalRenderDialogShow"
    @close-point-hierarchical-render-dialog="pointHierarchicalRenderDialogShow = false"
    @confirm-point-hierarchical-render-dialog="handleConfirmPointHierarchicalRender" />
  <PointCircleGradualValueRenderDialog :is-point-gradual-value-render-dialog-show="pointGradualValueRenderDialogShow"
    @close-point-gradual-value-render-dialog="pointGradualValueRenderDialogShow = false"
    @confirm-point-gradual-value-render-dialog="handleConfirmPointGradualValueRender" />
</template>

<script setup lang="ts">
import { toRefs, ref, watch, onMounted, reactive } from 'vue'
import {
  Back,
  Delete,
  Upload,
  Link,
  Tools,
  InfoFilled
} from '@element-plus/icons-vue'
import PolygonSingleValueRenderDialog from '~/components/VisualizationTemplateDialog/PolygonSingleValueRenderDialog.vue'
import PolygonUniqueValueRenderDialog from './VisualizationTemplateDialog/PolygonUniqueValueRenderDialog.vue'
import PolygonHierarchicalRenderDialog from './VisualizationTemplateDialog/PolygonHierarchicalRenderDialog.vue'
import PolygonGradualValueRenderDialog from './VisualizationTemplateDialog/PolygonGradualValueRenderDialog.vue'
import PolylineSingleValueRenderDialog from './VisualizationTemplateDialog/PolylineSingleValueRenderDialog.vue'
import PolylineUniqueValueRenderDialog from './VisualizationTemplateDialog/PolylineUniqueValueRenderDialog.vue'
import PolylineHierarchicalRenderDialog from './VisualizationTemplateDialog/PolylineHierarchicalRenderDialog.vue'
import PolylineGradualValueRenderDialog from './VisualizationTemplateDialog/PolylineGradualValueRenderDialog.vue'
import PointCircleSingleValueRenderDialog from './VisualizationTemplateDialog/PointCircleSingleValueRenderDialog.vue'
import PointCircleUniqueValueRenderDialog from './VisualizationTemplateDialog/PointCircleUniqueValueRenderDialog.vue'
import PointCircleHierarchicalRenderDialog from './VisualizationTemplateDialog/PointCircleHierarchicalRenderDialog.vue'
import PointCircleGradualValueRenderDialog from './VisualizationTemplateDialog/PointCircleGradualValueRenderDialog.vue'
import { useSceneStore } from '~/store/scene'
const props = defineProps({
  menuWidth: {
    type: String,
    default: '65px'
  },
  toolLab: {
    type: Array<any>,
    default: () => []
  }
})
const sceneStore = useSceneStore()
// const filterText = ref('')
// const selectedTool = reactive({} as any)
const polygonSingleValueRenderDialogShow = ref(false)
const polygonUniqueValueRenderDialogShow = ref(false)
const polygonHierarchicalRenderDialogShow = ref(false)
const polygonGradualValueRenderDialogShow = ref(false)
const polylineSingleValueRenderDialogShow = ref(false)
const polylineUniqueValueRenderDialogShow = ref(false)
const polylineHierarchicalRenderDialogShow = ref(false)
const polylineGradualValueRenderDialogShow = ref(false)
const pointSingleValueRenderDialogShow = ref(false)
const pointUniqueValueRenderDialogShow = ref(false)
const pointHierarchicalRenderDialogShow = ref(false)
const pointGradualValueRenderDialogShow = ref(false)
const layers = ref([] as any[])
onMounted(() => {
  console.log(props.toolLab)
  layers.value = sceneStore.currentSceneConfig.sceneLayerGroup
})
const emit = defineEmits(['closeServiceDataVSceneToolPannel', 'polygonSingleValueRender', 'polygonUniqueValueRender'
  , 'polygonHierarchicalRender', 'polygonGradualValueRender', 'polylineSingleValueRender', 'polylineUniqueValueRender'
  , 'polylineHierarchicalRender', 'polylineGradualValueRender', 'pointSingleValueRender', 'pointUniqueValueRender'
  , 'pointHierarchicalRender', 'pointGradualValueRender'])
const { menuWidth, toolLab } = toRefs(props)

const closeToolPannel = () => {
  emit('closeServiceDataVSceneToolPannel')
}

const selectTool = (tool: any) => {
  console.log(tool)
  switch (tool.name) {
    case 'polygon_singleRender':
      polygonSingleValueRenderDialogShow.value = true
      break;
    case 'polygon_uniqueValueRender':
      polygonUniqueValueRenderDialogShow.value = true
      break;
    case 'polygon_hierarchicalRender':
      polygonHierarchicalRenderDialogShow.value = true
      break;
    case 'polygon_gradualValueRender':
      polygonGradualValueRenderDialogShow.value = true
      break;
    case 'polyline_singleValueRender':
      polylineSingleValueRenderDialogShow.value = true
      break;
    case "polyline_uniqueValueRender":
      polylineUniqueValueRenderDialogShow.value = true
      break;
    case "polyline_hierarchicalRender":
      polylineHierarchicalRenderDialogShow.value = true
      break;
    case "polyline_gradualValueRender":
      polylineGradualValueRenderDialogShow.value = true
      break;
    case "point_singleValueRender":
      pointSingleValueRenderDialogShow.value = true
      break;
    case "point_uniqueValueRender":
      pointUniqueValueRenderDialogShow.value = true
      break;
    case "point_hierarchicalRender":
      pointHierarchicalRenderDialogShow.value = true
      break;
    case "point_gradualValueRender":
      pointGradualValueRenderDialogShow.value = true
      break;
  }
}
const handleConfirmPolygonSingleValueRender = (option: any) => {
  emit('polygonSingleValueRender', option)
}
const handleConfirmPolygonUniqueValueRender = (option: any) => {
  emit('polygonUniqueValueRender', option)
}
const handleConfirmPolygonHierarchicalRender = (option: any) => {
  emit('polygonHierarchicalRender', option)
}
const handleConfirmPolygonGradualValueRender = (option: any) => {
  emit('polygonGradualValueRender', option)
}
const handleConfirmPolylineSingleValueRender = (option: any) => {
  emit('polylineSingleValueRender', option)
}
const handleConfirmPolylineUniqueValueRender = (option: any) => {
  emit('polylineUniqueValueRender', option)
}
const handleConfirmPolylineHierarchicalRender = (hierarchicalRenderOption: any) => {
  const { layer, type, field, method, colorRamp, "line-width-range": lineWidthRange, uniqueValues, level, option } = hierarchicalRenderOption
  let polylineHierarchicalRenderOption = {
    layerId: layer,
    layerType: type,
    renderField: field,
    hierarchicalMethod: method,
    colorRamp: colorRamp,
    lineWidthRange: lineWidthRange,
    uniqueValues: uniqueValues,
    level: level,
    layerOptions: option
  }
  if (hierarchicalRenderOption.method === 'hierarchical_line-color') {
    // formData.data.option.paint['line-color'] = data.paint['line-color']
    delete polylineHierarchicalRenderOption.lineWidthRange
    delete polylineHierarchicalRenderOption.layerOptions.paint['line-color']
  } else if (hierarchicalRenderOption.method === 'hierarchical_line-width') {
    // formData.data.option.paint['line-width'] = data.paint['line-width']
    delete polylineHierarchicalRenderOption.colorRamp
    delete polylineHierarchicalRenderOption.layerOptions.paint['line-width']
  }
  emit('polylineHierarchicalRender', polylineHierarchicalRenderOption)
}
const handleConfirmPolylineGradualValueRender = (gradualValueRenderOption: any) => {
  // console.log(gradualValueRenderOption)
  let polylineGradualValueRenderOption = {
    layerId: gradualValueRenderOption.layer,
    layerType: gradualValueRenderOption.type,
    renderField: gradualValueRenderOption.field,
    colorRamp: gradualValueRenderOption.colorRamp,
    uniqueValues: gradualValueRenderOption.uniqueValues,
    layerOptions: gradualValueRenderOption.option
  }
  emit('polylineGradualValueRender', polylineGradualValueRenderOption)
  // console.log(polylineGradualValueRenderOption)
}
const handleConfirmPointSingleValueRender = (singleValueRenderOption: any) => {
  let pointSingleValueRenderOption = {
    layerId: singleValueRenderOption.layer,
    layerType: singleValueRenderOption.type,
    singleColor: singleValueRenderOption.color,
    layerOptions: singleValueRenderOption.option
  }
  emit('pointSingleValueRender', pointSingleValueRenderOption)
  console.log(pointSingleValueRenderOption)
}
const handleConfirmPointUniqueValueRender = (uniqueValueRenderOption: any) => {
  console.log(uniqueValueRenderOption)
  let pointUniqueValueRenderOption = {
    layerId: uniqueValueRenderOption.layer,
    layerType: uniqueValueRenderOption.type,
    renderField: uniqueValueRenderOption.field,
    uniqueValues: uniqueValueRenderOption.uniqueValues,
    colorRamp: uniqueValueRenderOption.colorRamp,
    layerOptions: uniqueValueRenderOption.option
  }
  emit('pointUniqueValueRender', pointUniqueValueRenderOption)
}
const handleConfirmPointHierarchicalRender = (hierarchicalRenderOption: any) => {
  console.log(hierarchicalRenderOption)
  console.log(hierarchicalRenderOption["cicle-radius-range"])
  const { layer, type, field, method, colorRamp, uniqueValues, level, option } = hierarchicalRenderOption
  let pointHierarchicalRenderOption = {
    layerId: layer,
    layerType: type,
    renderField: field,
    hierarchicalMethod: method,
    colorRamp: colorRamp,
    circleRadiusRange: hierarchicalRenderOption["cicle-radius-range"],
    uniqueValues: uniqueValues,
    level: level,
    layerOptions: option
  }
  if (hierarchicalRenderOption.method === 'hierarchical_circle-color') {
    delete pointHierarchicalRenderOption.circleRadiusRange
    delete pointHierarchicalRenderOption.layerOptions.paint['circle-color']
  } else if (hierarchicalRenderOption.method === 'hierarchical_circle-radius') {
    delete pointHierarchicalRenderOption.colorRamp
    delete pointHierarchicalRenderOption.layerOptions.paint['circle-radius']
  }
  emit('pointHierarchicalRender', pointHierarchicalRenderOption)
}
const handleConfirmPointGradualValueRender = (gradualValueRenderOption: any) => {
  console.log(gradualValueRenderOption)
  let pointGradualValueRenderOption = {
    layerId: gradualValueRenderOption.layer,
    layerType: gradualValueRenderOption.type,
    renderField: gradualValueRenderOption.field,
    colorRamp: gradualValueRenderOption.colorRamp,
    uniqueValues: gradualValueRenderOption.uniqueValues,
    layerOptions: gradualValueRenderOption.option
  }
  emit('pointGradualValueRender', pointGradualValueRenderOption)
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
  font-size: 18px;
  padding-right: 8px;
  line-height: 20px;
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
  justify-content: flex-end;
  align-items: center;
  /* width: 100%; */
  height: 5%;
  padding: 10px;
}

.info:hover {
  transform: scale(1.15);
  cursor: pointer;
}

.image {
  width: 250px;
  height: 150px;
}

.image:hover {
  opacity: 0.8;
  background-color: rgb(0, 0, 0);
  cursor: pointer;
}

/* .el-card:hover {
  cursor: pointer;
  transform: scale(1.05);
} */
</style>