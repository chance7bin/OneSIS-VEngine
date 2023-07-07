<template>
  <div class="selectDataCon">
    <p style="text-align: center; margin: 0 0 20px; font-size: 30px;font-weight: 600;">
      选择场景基础数据（非必要）
    </p>
    <el-divider border-style="hidden" />
    <div style="text-align: center">
      <el-transfer v-model="leftValue" style="text-align: left; display: inline-block" filterable
        :render-content="renderFunc" :titles="['个人数据', '场景数据']" :button-texts="['移出', '移入']" :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}',
        }" :data="transformObj.data" @change="handleChange">
      </el-transfer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, reactive, ref, toRefs, watch } from 'vue'
import type { VNode, VNodeProps } from 'vue'
import geofileApi from '~/http/api/geoFileApi'
import { useUserStore } from '~/store/user'
import { usePublicStore } from '~/store/publicStore'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'

interface Option {
  key: string
  label: string
  disabled?: boolean
}
interface layer {
  id: string,
  name: string
}
const userStore = useUserStore()
const publicStore = usePublicStore()
const { createSceneObj } = storeToRefs(publicStore)
const transformObj = reactive({
  data: [] as Option[]
})
const leftValue = ref([1])

onMounted(() => {
  transformObj.data = [] as Option[]
  publicStore.createSceneObj.layers = [] as layer[]
  geofileApi.getGeoDataList().then(res => {
    if (res.code === 200) {
      res.data.forEach((item: any) => {
        transformObj.data.push({
          key: item.id,
          label: item.displayName
        })
      })
    }
  }).catch(err => {
    ElMessage({
      type: 'error',
      message: err
    })
  })

})
const renderFunc = (
  h: (type: string, props: VNodeProps | null, children?: string) => VNode,
  option: Option
) => {
  return h('span', null, option.label)
}
const handleChange = (
  value: Array<string>,
  direction: 'left' | 'right',
  movedKeys: string[] | number[]
) => {
  publicStore.createSceneObj.layers = []
  value.forEach(val => {
    publicStore.createSceneObj.layers.push({
      id: val,
      name: getLayerName(val)
    })
  })
  console.log(value, direction, movedKeys)
}
const getLayerName = (id: string) => {
  return transformObj.data.find(item => item.key === id)?.label
}
</script>

<style scoped>
.transfer-footer {
  margin-left: 15px;
  padding: 6px 5px;
}

.selectDataCon {
  display: flex;
  flex-direction: column;
  width: 100%;
  /* height: 100%; */
  padding-top: 100px;
  padding-left: 100px;
  padding-right: 200px;
}
</style>
