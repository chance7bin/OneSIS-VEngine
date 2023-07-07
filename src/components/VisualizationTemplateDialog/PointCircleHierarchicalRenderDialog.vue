<template>
  <el-dialog v-model="isPointHierarchicalRenderDialogShow" title="点矢量分级制图" width="20%" center @close="closeThisDialog">
    <el-form ref="ruleFormRef" :model="formData.data" label-width="120px" label-position="right" :rules="rules">
      <el-form-item label="输入图层：" size="default" prop="layer">
        <el-select v-model="formData.data.layer" class="m-2" placeholder="请选择输入图层" @change="handleSelectChange">
          <el-option v-for="item in layerList" :key="item.id" :label="item.layerName" :value="item.sourceLayer" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.data.layer" label="图层类型：" size="default" prop="type" required>
        <el-tag class="ml-2" type="info">{{ formData.data.type }}</el-tag>
      </el-form-item>
      <el-form-item label="分级字段：" size="default" prop="field" required>
        <el-select v-model="formData.data.field" class="m-2" placeholder="请选择输入字段" @change="handleFieldSelectChange">
          <el-option v-for="item in fieldList" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="分级方式：" size="default" prop="method" required>
        <el-radio-group v-model="formData.data.method" class="ml-4">
          <el-radio label="hierarchical_circle-color">分级颜色</el-radio>
          <el-radio label="hierarchical_circle-radius">分级半径</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.data.method === 'hierarchical_circle-color'" label="色带选择：" size="default"
        prop="colorRamp" required>
        <el-select v-model="formData.data.colorRamp" class="m-2" placeholder="请选择输入色带">
          <el-option v-for="item in colorRampList" :key="item.id" :label="item.label" :value="item.value">
            <el-row type="flex" :gutter="20" justify="center">
              <el-col :span="18">
                <img :src="item.image" style="height:30px;float: left">
              </el-col>
              <el-col :span="6">
                <span>{{ item.label }}</span>
              </el-col>
            </el-row>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.data.method === 'hierarchical_circle-radius'" label="半径选择：" size="default" required>
        <el-row style="width: 200px;">
          <el-col :span="8">
            <span>Min：</span>
          </el-col>
          <el-col :span="16">
            <el-input v-model.number="formData.data['cicle-radius-range']![0]" placeholder="Please input">
              <template #append>px</template>
            </el-input>
          </el-col>
        </el-row>
        <el-row style="width: 200px;">
          <el-col :span="8">
            <span>Max：</span>
          </el-col>
          <el-col :span="16">
            <el-input v-model.number="formData.data['cicle-radius-range']![1]" placeholder="Please input">
              <template #append>px</template>
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-if="formData.data.uniqueValues.length !== 0" label="分级数：" size="default" prop="level" required>
        <el-input-number v-model="formData.data.level" :min="1" :max="formData.data.uniqueValues.length" />
      </el-form-item>
      <el-form-item label="样式设置：" size="default" prop="option">
        <el-button type="info" @click="openPolygonStyleSetting" size="small">点样式设置...</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default"
        @click="polygonUniqueValueRender(ruleFormRef as FormInstance)">确定</el-button>
      <el-button type="primary" size="default" @click="closeThisDialog">取消</el-button>
    </template>
  </el-dialog>
  <PointCircleStyleSettingDialog :is-point-circle-style-setting-dialog-show="isPointStyleSettingDialogShow"
    @close-point-style-setting-dialog="isPointStyleSettingDialogShow = false"
    @confirm-point-style-setting="confirmPointStyleSetting" :render-type="formData.data.method" />
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, inject, onMounted, watch } from 'vue'
import type { FormRules, FormInstance } from 'element-plus'
import PointCircleStyleSettingDialog from './PointCircleStyleSettingDialog.vue'
import geoFileApi from '~/http/api/geoFileApi'

interface ColorRampItem {
  id: number,
  label: string,
  value: string,
  image: string
}
const props = defineProps({
  isPointHierarchicalRenderDialogShow: {
    type: Boolean,
    default: false
  },
  // layerList: {
  //   type: Array<any>,
  //   default: () => []
  // }
})
const layerList = inject('layerList') as any
const emit = defineEmits(['closePointHierarchicalRenderDialog', 'confirmPointHierarchicalRenderDialog'])
const { isPointHierarchicalRenderDialogShow } = toRefs(props)
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  layer: [
    { required: true, message: '请选择输入图层！', trigger: 'blur' },
  ],
  field: [
    { required: true, message: '请选择输入字段！', trigger: 'blur' },
  ],
  colorRamp: [
    { required: true, message: '请选择色带！', trigger: 'blur' },
  ]
})
const formData = reactive({
  data: {
    layer: '',
    type: '',
    field: '',
    method: 'hierarchical_circle-color',
    uniqueValues: [],
    colorRamp: 'ramp1',
    'cicle-radius-range': [1, 10] as Array<number>,
    level: 1,
    option: {
      layout: {
        'visibility': 'visible',
      },
      paint: {
        'circle-blur': 0 as number,
        'circle-color': '#FF0000' as string,
        'circle-radius': 5 as number,
        'circle-opacity': 1 as number,
        'circle-stroke-color': '#000000',
        'circle-stroke-width': 0 as number,
        'circle-stroke-opacity': 1 as number
      }
    }
  }
})
const isPointStyleSettingDialogShow = ref(false)
const fieldList = ref<Array<any>>()
const colorRampList = ref<Array<ColorRampItem>>([
  {
    id: 1,
    label: '随机颜色',
    value: 'ramp1',
    image: '/colorRampImg/ramp1.png'
  },
  {
    id: 2,
    label: '色带1',
    value: 'ramp2',
    image: '/colorRampImg/ramp2.png'
  }
])
const fieldUniqueValues = ref<Array<any>>([])
watch(isPointHierarchicalRenderDialogShow, (val) => {
  if (val) {
    ruleFormRef.value?.resetFields()
  }
})
onMounted(() => {
  console.log(layerList)
})
const closeThisDialog = () => {
  emit('closePointHierarchicalRenderDialog')
}
const polygonUniqueValueRender = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      // console.log(formData.data)
      emit('closePointHierarchicalRenderDialog')
      emit('confirmPointHierarchicalRenderDialog', formData.data)
    }
  })
}
const openPolygonStyleSetting = () => {
  isPointStyleSettingDialogShow.value = true
  // console.log(isPolygonStyleSettingDialogShow.value)
}
const confirmPointStyleSetting = (data: any) => {
  console.log(data)
  formData.data.option.layout['visibility'] = data.layout['visibility']
  formData.data.option.paint['circle-blur'] = data.paint['circle-blur'] / 10
  formData.data.option.paint['circle-color'] = data.paint['circle-color']
  formData.data.option.paint['circle-radius'] = parseFloat(data.paint['circle-radius'])
  formData.data.option.paint['circle-opacity'] = data.paint['circle-opacity'] / 100
  formData.data.option.paint['circle-stroke-color'] = data.paint['circle-stroke-color']
  formData.data.option.paint['circle-stroke-width'] = parseFloat(data.paint['circle-stroke-width'])
  formData.data.option.paint['circle-stroke-opacity'] = data.paint['circle-stroke-opacity'] / 100
}
const handleSelectChange = (val: any) => {
  console.log(val)
  layerList.value.map((item: any) => {
    if (item.sourceLayer === val) {
      formData.data.type = item.dataType
      console.log(item)
      geoFileApi.getFields(item.id).then((res: any) => {
        if (res.code === 200) {
          // console.log(res.data)
          fieldList.value = res.data
        }
      })
    }
  })
}
const handleFieldSelectChange = (val: any) => {
  geoFileApi.getUniqueValues(formData.data.layer, val, '').then((res: any) => {
    if (res.code === 200) {
      formData.data.uniqueValues = res.data
    }
  })
}
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}

.el-dialog--center .el-dialog__body {
  padding-bottom: 0;
}

:deep(.el-dialog__footer) {
  padding-top: 0px;
}
</style>
