<template>
  <div class="allcontainer">
    <div class="menuCon">
      <div class="menu-btn" :title="isCollapse ? '展开' : '折叠'">
        <el-button size="large" type="text" :icon="isCollapse ? Expand : Fold"
          @click="isCollapse = !isCollapse"></el-button>
      </div>
      <el-menu :default-active="activatedMenu" class="el-menu-vertical-demo" :collapse="isCollapse" @select="handleSelect"
        @close="handleClose" :collapse-transition="false">
        <div class="menuTop">
          <el-menu-item index="1">
            <el-icon>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#onesis-layergroup-fill"></use>
              </svg>
            </el-icon>
            <template #title>
              图层
            </template>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#onesis-gongjuxiang"></use>
              </svg>
            </el-icon>
            <template #title>工具箱</template>
          </el-menu-item>
        </div>
        <div class="menuBottom">
          <el-menu-item index="3" @click="backScene">
            <el-icon>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#onesis-fanhui"></use>
              </svg>
            </el-icon>
            <template #title>返回</template>
          </el-menu-item>
          <el-menu-item index="4" @click="handleSaveBtnClick">
            <el-icon>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#onesis-baocun"></use>
              </svg>
            </el-icon>
            <template #title>保存</template>
          </el-menu-item>
          <el-menu-item index="5">
            <el-icon>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#onesis-yonghu"></use>
              </svg>
            </el-icon>
            <template #title>用户</template>
          </el-menu-item>
        </div>
      </el-menu>
    </div>
    <div id="mapContainer">
    </div>
    <LayerPannel v-if="activatedMenu === '1'" :menu-width="isCollapse ? '65px' : '113px'"
      @close-layer-pannel="activatedMenu = '0'" :layer-list="sceneLayersGroup"></LayerPannel>
    <ServiceDataVSceneToolPannel
      v-if="activatedMenu === '2' && sceneStore.editingScene.sceneType === 'visualization_service'"
      :menu-width="isCollapse ? '65px' : '113px'" @close-service-data-v-scene-tool-pannel="activatedMenu = '0'"
      :tool-lab="toolLab" @polygon-single-value-render="handlePolygonSingleValueRender"
      @polygon-unique-value-render="handlePolygonUniqueValueRender"
      @polygon-hierarchical-render="handlePolygonHierarchicalRender"
      @polygon-gradual-value-render="handlePolygonGradualValueRender"
      @polyline-single-value-render="handlePolylineSingleValueRender"
      @polyline-unique-value-render="handlePolylineUniqueValueRender"
      @polyline-hierarchical-render="handlePolylineHierarchicalRender"
      @polyline-gradual-value-render="handlePolylineGradualValueRender"
      @point-single-value-render="handlePointSingleValueRender" @point-unique-value-render="handlePointUniqueValueRender"
      @point-hierarchical-render="handlePointHierarchicalRender"
      @point-gradual-value-render="handlePointGradualValueRender" />
  </div>
</template>

<script setup lang="ts">
import mapboxGl from 'mapbox-gl'
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { onMounted, reactive, ref, watch, provide } from 'vue';
import { useRouter } from 'vue-router';
import { ElLoading, ElMessage } from 'element-plus'
import LayerPannel from '~/components/LayerPannel.vue'
import ServiceDataVSceneToolPannel from '~/components/ServiceDataVSceneToolPannel.vue';
import sceneApi from '~/http/api/sceneApi';
import { useSceneStore } from '~/store/scene';
import '~/assets/css/iconfont'
import {
  Fold,
  Expand,
} from '@element-plus/icons-vue'
import SingleValueRender from '~/assets/VisualizationTemplateCode/SingleValueRender.js'
import UniqueValueRender from '~/assets/VisualizationTemplateCode/UniqueValueRender.js'
// import UniqueValueRender from 'http://localhost:8998/js/UniqueValueRender.js'
import HierarchicalRender from '~/assets/VisualizationTemplateCode/HierarchicalRender.js'
import GradualValueRender from '~/assets/VisualizationTemplateCode/GradualValueRender.js'
import formatDateTime from '~/utils/formatDateTime'
import dataURLtoFile from '~/utils/dataURLtoFile'
import cryptoUtil from '~/utils/cryptoUtil';

interface PolygonSingleValueRenderOption {
  layerType: string,
  layerId: string,
  singleColor: string,
  layerOptions: PolygonRenderLayerOption
}
interface PolygonRenderLayerOption {
  layout: any,
  paint: any
}
interface PolygonUniqueValueRenderOption {
  layerId: string,
  layerType: string,
  renderField: string,
  uniqueValues: Array<any>,
  colorRamp: string,
  layerOptions: PolygonRenderLayerOption
}

mapboxGl.accessToken = 'pk.eyJ1IjoibmluamFhIiwiYSI6ImNsYXYzd3JwaDAyMGwzdm44ZmI3M212eHQifQ.h_dGMMOvQXNfmheNd0_j8A'
const sceneStore = useSceneStore()
const mapbox = reactive({
  map: null as any
})
const router = useRouter()
const isCollapse = ref(true)
const sceneLayersGroup = ref([] as any)
const toolLab = ref([] as any)
const activatedMenu = ref('0')
const loadingText = ref('场景加载中...')
let singleValueRender = null as any
let uniqueValueRender = null as any
let hierarchicalRender = null as any
let gradualValueRender = null as any
// watch(() => sceneStore.currentSceneConfig.sceneLayerGroup.length, (val: any) => {
//   //场景中layer数量变了说明需要渲染sceneStore中新加的的layer了
//   sceneLayersGroup.value = sceneStore.currentSceneConfig.sceneLayerGroup
//   const loadingStatus = ElLoading.service({
//     lock: false,
//     text: '图层加载中...',
//     background: 'rgba(0, 0, 0, 0.7)'
//   })
//   loadNewLayerToMap(sceneLayersGroup.value[val - 1]).then((res: any) => {
//     loadingStatus.close()
//     ElMessage({
//       type: 'success',
//       message: res
//     })
//   })
// }
// )
provide('layerList', sceneLayersGroup)
onMounted(async () => {
  const sceneLoading = ElLoading.service({
    lock: true,
    text: loadingText.value,
    background: 'rgba(0, 0, 0, 0.7)'
  })
  sceneLoading.setText('初始化地图中，请稍后...')
  sceneLoading.setText(await initMap() as string)
  sceneLoading.setText(await requestMapConfig() as string)
  sceneLoading.setText(await renderSceneLayersInMap() as string)
  singleValueRender = new SingleValueRender(mapbox.map)
  uniqueValueRender = new UniqueValueRender(mapbox.map)
  hierarchicalRender = new HierarchicalRender(mapbox.map)
  gradualValueRender = new GradualValueRender(mapbox.map)
  ElMessage({
    type: 'success',
    message: '场景 ' + sceneStore.editingScene.sceneName + ' 加载成功!'
  })
  sceneLoading.close()
  //初始化图层组（数据）、初始化工具库、easeTo飞向数据
  //可以在scene中加入isEditing属性,判断是否在编辑状态
})
const initMap = () => {
  return new Promise(resolve => {
    mapbox.map = new mapboxGl.Map({
      container: 'mapContainer', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [118.9, 32.08], // starting position [lng, lat]
      zoom: 11, // starting zoom
      preserveDrawingBuffer: true
    })
    mapbox.map.addControl(new MapboxLanguage({
      defaultLanguage: 'zh-Hans'
    }));
    mapbox.map.addControl(
      new mapboxGl.NavigationControl({
        visualizePitch: true,
      })
    );
    // 添加比例尺
    let scale = new mapboxGl.ScaleControl({
      maxWidth: 120,
    });
    mapbox.map.addControl(scale)
    scale.setUnit("metric");


    // 添加全局缩放
    mapbox.map.addControl(new mapboxGl.FullscreenControl());

    //添加定位控件
    mapbox.map.addControl(
      new mapboxGl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );
    mapbox.map.on('load', () => {
      console.log("地图初始化成功！正在加载场景配置项...")
        resolve("地图初始化成功！正在加载场景配置项...")
    })
  })
}
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key)
  activatedMenu.value = key
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
}
const requestMapConfig = () => {
  return new Promise(resolve => {
    sceneApi.getSceneConfig(sceneStore.editingScene.sceneType, sceneStore.editingScene.sceneId).then(res => {
      sceneStore.setCurrentSceneConfig(res.data)
      sceneLayersGroup.value = res.data.sceneLayerGroup
      toolLab.value = res.data.sceneToolLab
      console.log(toolLab.value)
        resolve("地图场景配置项加载完毕！正在渲染数据...")
    })
  })
}
const renderSceneLayersInMap = () => {
  return new Promise(resolve => {
    loadLayersToMap().then(res => {
      console.log(res)
      flyToDataBounds()
    })
      resolve('图层渲染完毕！')
  })
}
const loadLayersToMap = () => {
  return new Promise(resolve => {
    for (let i = 0; i < sceneLayersGroup.value.length; i++) {
      let source_id = sceneLayersGroup.value[i].sourceLayer
      let source_config = {
        type: 'vector',
        tiles: [sceneLayersGroup.value[i].mvtUrl]
      }
      mapbox.map.addSource(source_id, source_config)
      let layerConfig = {
        id: source_id,
        type: sceneLayersGroup.value[i].type,
        source: source_id,
        "source-layer": source_id,
        layout: sceneLayersGroup.value[i].layout,
        paint: sceneLayersGroup.value[i].paint
      }
      console.log(sceneLayersGroup.value[i].layerName)
      mapbox.map.addLayer(layerConfig)
    }
    resolve('加载图层完毕')
  })
}
const flyToDataBounds = () => {
  mapbox.map.fitBounds(sceneStore.currentSceneConfig.sceneEnvelop, {
    pitch: sceneStore.currentSceneConfig.pitch,
    bearing: sceneStore.currentSceneConfig.bearing,
    padding: { top: 10, bottom: 25, left: 15, right: 5 },
  });
}
const loadNewLayerToMap = (layerConfig: any) => {
  return new Promise(resolve => {
    let source_id = layerConfig.sourceLayer
    let source_config = {
      type: 'vector',
      tiles: [layerConfig.mvtUrl]
    }
    mapbox.map.addSource(source_id, source_config)
    let layerPaintConfig = {
      id: source_id,
      type: layerConfig.type,
      source: source_id,
      "source-layer": source_id,
      paint: layerConfig.paint
    }
    mapbox.map.addLayer(layerPaintConfig)
    sceneStore.currentSceneConfig.sceneLayerGroup.push(layerConfig)
    resolve("图层加载成功！")
  })

}
const renderSceneLayerGroup = (layer: any) => {
  loadNewLayerToMap(layer)
}
const backScene = () => {
  router.back()
}
const handleSaveBtnClick = async () => {
  const sceneLoading = ElLoading.service({
    lock: true,
    text: loadingText.value,
    background: 'rgba(0, 0, 0, 0.7)'
  })
  sceneLoading.setText("正在保存场景配置项...")
  sceneLoading.setText(await beforeSceneSave() as string)
  sceneLoading.close()
  ElMessage.success('场景保存成功')
}
const beforeSceneSave = () => {
  return new Promise(resolve => {
    const bearing = mapbox.map.getBearing()
    const pitch = mapbox.map.getPitch()
    const zoom = mapbox.map.getZoom()
    const { lng, lat } = mapbox.map.getCenter()
    const { _sw: { lng: swLng, lat: swLat }, _ne: { lng: nelng, lat: nelat } } = mapbox.map.getBounds()
    const sceneImg = mapbox.map.getCanvas().toDataURL()
    console.log(bearing, pitch, zoom, lng, lat, swLng, swLat, nelng, nelat, sceneImg)
    sceneStore.currentSceneConfig.bearing = bearing
    sceneStore.currentSceneConfig.pitch = pitch
    sceneStore.currentSceneConfig.zoom = zoom
    sceneStore.currentSceneConfig.center = [lng, lat]
    sceneStore.currentSceneConfig.sceneEnvelop = [swLng, swLat, nelng, nelat]
    const sceneConfigObj = {
      id: sceneStore.currentSceneConfig.id,
      bearing: bearing,
      pitch: pitch,
      zoom: zoom,
      center: [lng, lat],
      sceneEnvelop: [swLng, swLat, nelng, nelat],
      sceneLayerGroup: sceneStore.currentSceneConfig.sceneLayerGroup
    }
    sceneStore.editingScene.sceneImg = sceneImg.replace('data:image/png;base64,', '')
    const sceneEditNum = ++sceneStore.editingScene.editNum
    const sceneLastUpdateTime = sceneStore.editingScene.lastUpdatedTime = formatDateTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
    const sceneImgFile = dataURLtoFile(sceneImg, cryptoUtil.Encrypt(Date.now()))
    const saveSceneData = new FormData()
    saveSceneData.append("sceneId", sceneStore.editingScene.sceneId)
    saveSceneData.append("sceneImg", sceneImgFile)
    saveSceneData.append("sceneType", sceneStore.editingScene.sceneType)
    saveSceneData.append("editNum", sceneEditNum.toString())
    saveSceneData.append("lastUpdatedTime", sceneLastUpdateTime)
    saveSceneData.append("sceneConfig", JSON.stringify(sceneConfigObj))
    console.log(saveSceneData.get("sceneImg"))
    console.log(saveSceneData.get("editNum"))
    console.log(saveSceneData.get("lastUpdatedTime"))
    sceneApi.saveScene(saveSceneData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      if (res.code === 200) {
          resolve("保存场景成功！")
      }
    })
    // console.log(file)
    //TODO:获取场景图层

    //TODO:获取场景工具集
  })

}
const handlePolygonSingleValueRender = (options: any) => {
  const polygonSingleRenderOption = {
    layerType: options.type,
    layerId: options.layer,
    singleColor: options.color,
    layerOptions: {
      layout: options.option.layout,
      paint: options.option.paint
    } as PolygonRenderLayerOption
  } as PolygonSingleValueRenderOption
  singleValueRender.singleValueRenderEntry(polygonSingleRenderOption)
  sceneStore.currentSceneConfig.sceneLayerGroup.forEach((layer: any) => {
    if (layer.sourceLayer === polygonSingleRenderOption.layerId) {
      layer.paint = polygonSingleRenderOption.layerOptions.paint
      layer.layout = polygonSingleRenderOption.layerOptions.layout
    }
  })
}
const handlePolygonUniqueValueRender = async (options: any) => {
  // console.log(options)
  const polygonUniqueValueRenderOption = {
    layerId: options.layer,
    layerType: options.type,
    renderField: options.field,
    uniqueValues: options.uniqueValues,
    colorRamp: options.colorRamp,
    layerOptions: options.option as PolygonRenderLayerOption
  } as PolygonUniqueValueRenderOption
  // console.log(polygonUniqueValueRenderOption)
  uniqueValueRender.uniqueValueRenderEntry(polygonUniqueValueRenderOption)
  sceneStore.currentSceneConfig.sceneLayerGroup.forEach((layer: any) => {
    if (layer.sourceLayer === polygonUniqueValueRenderOption.layerId) {
      layer.paint = polygonUniqueValueRenderOption.layerOptions.paint
      layer.layout = polygonUniqueValueRenderOption.layerOptions.layout
    }
  })
}

const handlePolygonHierarchicalRender = (options: any) => {
  const polygonHierarchicalRenderOption = {
    layerId: options.layer,
    layerType: options.type,
    renderField: options.field,
    uniqueValues: options.uniqueValues,
    colorRamp: options.colorRamp,
    level: options.level,
    layerOptions: options.option as PolygonRenderLayerOption
  }
  hierarchicalRender.hierarchicalRenderEntry(polygonHierarchicalRenderOption)
  sceneStore.currentSceneConfig.sceneLayerGroup.forEach((layer: any) => {
    if (layer.sourceLayer === polygonHierarchicalRenderOption.layerId) {
      layer.paint = polygonHierarchicalRenderOption.layerOptions.paint
      layer.layout = polygonHierarchicalRenderOption.layerOptions.layout
    }
  })
}

const handlePolygonGradualValueRender = (options: any) => {
  const polygonGradualValueRenderOption = {
    layerId: options.layer,
    layerType: options.type,
    renderField: options.field,
    uniqueValues: options.uniqueValues,
    colorRamp: options.colorRamp,
    layerOptions: options.option as PolygonRenderLayerOption
  }
  gradualValueRender.gradualValueRenderEntry(polygonGradualValueRenderOption)
  sceneStore.currentSceneConfig.sceneLayerGroup.forEach((layer: any) => {
    if (layer.sourceLayer === polygonGradualValueRenderOption.layerId) {
      layer.paint = polygonGradualValueRenderOption.layerOptions.paint
      layer.layout = polygonGradualValueRenderOption.layerOptions.layout
    }
  })
}

const handlePolylineSingleValueRender = (options: any) => {
  const polylineSingleValueRenderOption = {
    layerId: options.layer,
    layerType: options.type,
    singleColor: options.color,
    layerOptions: options.option
  }
  singleValueRender.singleValueRenderEntry(polylineSingleValueRenderOption)
  sceneStore.currentSceneConfig.sceneLayerGroup.forEach((layer: any) => {
    if (layer.sourceLayer === polylineSingleValueRenderOption.layerId) {
      layer.paint = polylineSingleValueRenderOption.layerOptions.paint
      layer.paint["line-color"] = mapbox.map.getPaintProperty(polylineSingleValueRenderOption.layerId, 'line-color')
      layer.layout = polylineSingleValueRenderOption.layerOptions.layout
    }
  })
}
// const polylineSingleValueRenderOption =
// {
//   layerId: '<layer_id>',
//   layerType: 'MULTILINESTRING',
//   singleColor: '#ff0000',
//   layerOptions: {
//     layout: {
//       'visibility': 'visible',
//       'line-cap': 'butt',
//       'line-join': 'miter'
//     },
//     paint: {
//       'line-blur': 0,
//       'line-width': 1,
//       'line-dasharray': [] as any[],
//       'line-gap-width': 0,
//       'line-opacity': 1
//     }
//   }
// }
// const polylineUniqueValueRenderOption =
// {
//   layerId: '<layer_id>',
//   layerType: 'MULTILINESTRING',
//   renderField: '<render_field>',
//   uniqueValues: ['unique_value_1', 'unique_value_2', '...'],
//   colorRamp: 'ramp1',
//   layerOptions: {
//     layout: {
//       'visibility': 'visible',
//       'line-cap': 'butt',
//       'line-join': 'miter'
//     },
//     paint: {
//       'line-blur': 0,
//       'line-width': 1,
//       'line-dasharray': [] as any[],
//       'line-gap-width': 0,
//       'line-opacity': 1
//     }
//   }
// }
// const polylineHierarchicalRenderOption =
// {
//   layerId: '<layer_id>',
//   layerType: 'MULTILINESTRING',
//   renderField: '<render_field>',
//   hierarchicalMethod: 'hierarchical_color',
//   uniqueValues: ['unique_value_1', 'unique_value_2', '...'],
//   lineWidthRange: ['<min_width>', '<max_width>'],
//   colorRamp: 'ramp1',
//   level: '<level>',
//   layerOptions: {
//     layout: {
//       'visibility': 'visible',
//       'line-cap': 'butt',
//       'line-join': 'miter'
//     },
//     paint: {
//       'line-blur': 0,
//       'line-width': 1,
//       'line-dasharray': [] as any[],
//       'line-gap-width': 0,
//       'line-opacity': 1
//     }
//   }
// }
// const heatMapOption =
// {
//   layerId: '<layer_id>',
//   layerType: 'POINT',
//   layerOptions: {
//     layout: {
//       'visibility': 'visible',
//     },
//     paint: {
//       'heatmap-color': [
//         "interpolate",
//         ["linear"],
//         ["heatmap-density"],
//         0, "rgba(0, 0, 255, 0)",
//         0.1, "royalblue",
//         0.3, "cyan",
//         0.5, "lime",
//         0.7, "yellow",
//         1, "red"
//       ],
//       'heatmap-intensity': 1,
//       'heatmap-opacity': [] as any[],
//       'heatmap-radius': 0,
//       'heatmap-weight': 1
//     }
//   }
// }

// console.log(polylineUniqueValueRenderOption)
const handlePolylineUniqueValueRender = (options: any) => {
  const polylineUniqueValueRenderOption = {
    layerId: options.layer,
    layerType: options.type,
    renderField: options.field,
    uniqueValues: options.uniqueValues,
    colorRamp: options.colorRamp,
    layerOptions: options.option
  }
  uniqueValueRender.uniqueValueRenderEntry(polylineUniqueValueRenderOption)
  sceneStore.currentSceneConfig.sceneLayerGroup.forEach((layer: any) => {
    if (layer.sourceLayer === polylineUniqueValueRenderOption.layerId) {
      layer.paint = polylineUniqueValueRenderOption.layerOptions.paint
      layer.paint["line-color"] = mapbox.map.getPaintProperty(polylineUniqueValueRenderOption.layerId, 'line-color')
      layer.layout = polylineUniqueValueRenderOption.layerOptions.layout
    }
  })
}

const handlePolylineHierarchicalRender = (polylineHierarchicalRenderOption: any) => {
  // console.log(polylineHierarchicalRenderOption)
  hierarchicalRender.hierarchicalRenderEntry(polylineHierarchicalRenderOption)
  sceneStore.currentSceneConfig.sceneLayerGroup.forEach((layer: any) => {
    if (layer.sourceLayer === polylineHierarchicalRenderOption.layerId) {
      layer.paint = polylineHierarchicalRenderOption.layerOptions.paint
      layer.paint["line-color"] = mapbox.map.getPaintProperty(polylineHierarchicalRenderOption.layerId, 'line-color')
      layer.layout = polylineHierarchicalRenderOption.layerOptions.layout
    }
  })
}

const handlePolylineGradualValueRender = (polylineGradualValueRenderOption: any) => {
  console.log(polylineGradualValueRenderOption)
  gradualValueRender.gradualValueRenderEntry(polylineGradualValueRenderOption)
  console.log(sceneStore.currentSceneConfig.sceneLayerGroup)
  // console.log(mapbox.map.getPaintProperty(polylineGradualValueRenderOption.layerId, 'line-color'))
  sceneStore.currentSceneConfig.sceneLayerGroup.forEach((layer: any) => {
    if (layer.sourceLayer === polylineGradualValueRenderOption.layerId) {
      layer.paint = polylineGradualValueRenderOption.layerOptions.paint
      layer.paint["line-color"] = mapbox.map.getPaintProperty(polylineGradualValueRenderOption.layerId, 'line-color')
      layer.layout = polylineGradualValueRenderOption.layerOptions.layout
    }
  })
  console.log(sceneStore.currentSceneConfig.sceneLayerGroup[0])
}

const handlePointSingleValueRender = (pointSingleValueRenderOption: any) => {
  singleValueRender.singleValueRenderEntry(pointSingleValueRenderOption)
  sceneStore.currentSceneConfig.sceneLayerGroup.forEach((layer: any) => {
    if (layer.sourceLayer === pointSingleValueRenderOption.layerId) {
      layer.paint = pointSingleValueRenderOption.layerOptions.paint
      layer.paint["circle-color"] = mapbox.map.getPaintProperty(pointSingleValueRenderOption.layerId, 'circle-color')
      layer.layout = pointSingleValueRenderOption.layerOptions.layout
    }
  })
}

const handlePointUniqueValueRender = (pointUniqueValueRenderOption: any) => {
  uniqueValueRender.uniqueValueRenderEntry(pointUniqueValueRenderOption)
  sceneStore.currentSceneConfig.sceneLayerGroup.forEach((layer: any) => {
    if (layer.sourceLayer === pointUniqueValueRenderOption.layerId) {
      layer.paint = pointUniqueValueRenderOption.layerOptions.paint
      layer.paint["circle-color"] = mapbox.map.getPaintProperty(pointUniqueValueRenderOption.layerId, 'circle-color')
      layer.layout = pointUniqueValueRenderOption.layerOptions.layout
    }
  })
}

const handlePointHierarchicalRender = (pointHierarchicalRenderOption: any) => {
  console.log(pointHierarchicalRenderOption)
  hierarchicalRender.hierarchicalRenderEntry(pointHierarchicalRenderOption)
  sceneStore.currentSceneConfig.sceneLayerGroup.forEach((layer: any) => {
    if (layer.sourceLayer === pointHierarchicalRenderOption.layerId) {
      layer.paint = pointHierarchicalRenderOption.layerOptions.paint
      if(pointHierarchicalRenderOption.hierarchicalMethod === 'hierarchical_circle-color'){
        layer.paint["circle-color"] = mapbox.map.getPaintProperty(pointHierarchicalRenderOption.layerId, 'circle-color')
      } else {
        layer.paint["circle-radius"] = mapbox.map.getPaintProperty(pointHierarchicalRenderOption.layerId, 'circle-radius')
      }
      layer.layout = pointHierarchicalRenderOption.layerOptions.layout
    }
  })
}

const handlePointGradualValueRender = (pointGradualValueRenderOption: any) => {
  console.log(pointGradualValueRenderOption)
  gradualValueRender.gradualValueRenderEntry(pointGradualValueRenderOption)
  sceneStore.currentSceneConfig.sceneLayerGroup.forEach((layer: any) => {
    if (layer.sourceLayer === pointGradualValueRenderOption.layerId) {
      layer.paint = pointGradualValueRenderOption.layerOptions.paint
      layer.paint["circle-color"] = mapbox.map.getPaintProperty(pointGradualValueRenderOption.layerId, 'circle-color')
      layer.layout = pointGradualValueRenderOption.layerOptions.layout
    }
  })
}
// const getFieldUniqueValues = (ptName: string, field: string) => {
//   return new Promise(resolve => {
//     geoFileApi.getUniqueValues(ptName, field).then(res => {
//       if (res.code === 200) {
//         resolve(res.data)
//       }
//     })
//   })
// }
</script>

<style scoped>
.menuCon {
  /* background-color: #545c64; */
  border-right: 1px solid rgb(168, 166, 166);
  height: 100%;
  display: flex;
  flex-direction: column;
}

#mapContainer {
  width: 100%;
  height: 100%;
}

.allcontainer {
  width: 100%;
  height: 100%;
  display: flex;
}

.menuItemsCon {
  height: 100%;
}

.menu-btn {
  height: 50px;

}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.el-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
</style>