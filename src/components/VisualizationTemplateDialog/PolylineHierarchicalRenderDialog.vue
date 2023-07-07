<template>
  <el-dialog v-model="isPolylineHierarchicalRenderDialogShow" title="线矢量分级制图" width="20%" center @close="closeThisDialog">
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
          <el-radio label="hierarchical_line-color">分级颜色</el-radio>
          <el-radio label="hierarchical_line-width">分级线宽</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.data.method === 'hierarchical_line-color'" label="色带选择：" size="default"
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
      <el-form-item v-if="formData.data.method === 'hierarchical_line-width'" label="线宽选择："
        size="default" required>
        <el-row style="width: 200px;">
          <el-col :span="8">
            <span>Min：</span>
          </el-col>
          <el-col :span="16">
            <el-input v-model="formData.data['line-width-range']![0]" placeholder="Please input">
              <template #append>px</template>
            </el-input>
          </el-col>
        </el-row>
        <el-row style="width: 200px;">
          <el-col :span="8">
            <span>Max：</span>
          </el-col>
          <el-col :span="16">
            <el-input v-model="formData.data['line-width-range']![1]" placeholder="Please input">
              <template #append>px</template>
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-if="formData.data.uniqueValues.length !== 0" label="分级数：" size="default" prop="level" required>
        <el-input-number v-model="formData.data.level" :min="1" :max="formData.data.uniqueValues.length" />
      </el-form-item>
      <el-form-item label="样式设置：" size="default" prop="option">
        <el-button type="info" @click="openPolygonStyleSetting" size="small">线样式设置...</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default"
        @click="polylineHierarchicalRender(ruleFormRef as FormInstance)">确定</el-button>
      <el-button type="primary" size="default" @click="closeThisDialog">取消</el-button>
    </template>
  </el-dialog>
  <PolylineStyleSettingDialog :is-polygon-style-setting-dialog-show="isPolylineStyleSettingDialogShow"
    @close-polyline-style-setting-dialog="isPolylineStyleSettingDialogShow = false"
    @confirm-polyline-style-setting="handleConfirmPolylineStyleSetting" :render-type="formData.data.method" />
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, inject, onMounted, watch } from 'vue'
import type { FormRules, FormInstance } from 'element-plus'
import PolylineStyleSettingDialog from './PolylineStyleSettingDialog.vue'
import geoFileApi from '~/http/api/geoFileApi'

interface ColorRampItem {
  id: number,
  label: string,
  value: string,
  image: string
}

const props = defineProps({
  isPolylineHierarchicalRenderDialogShow: {
    type: Boolean,
    default: false
  },
  // layerList: {
  //   type: Array<any>,
  //   default: () => []
  // }
})
const layerList = inject('layerList') as any
const emit = defineEmits(['closePolylineHierarchicalRenderDialog', 'confirmPolylineHierarchicalRenderDialog'])
const { isPolylineHierarchicalRenderDialogShow } = toRefs(props)
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  layer: [
    { required: true, message: '请选择输入图层！', trigger: 'blur' },
  ],
  color: [
    { required: true, message: '请选择颜色！', trigger: 'blur' },
  ]
})
const formData: {
  data: {
    layer: string,
    type: string,
    field: string,
    method: string,
    uniqueValues: Array<any>,
    colorRamp?: string,
    'line-width-range'?: Array<any>,
    level: number,
    option: {
      layout: {
        'visibility': string,
        'line-cap': string,
        'line-join': string
      },
      paint: {
        'line-blur': number,
        'line-color'?: string,
        'line-width'?: number,
        'line-dasharray': Array<any>,
        'line-gap-width': number,
        'line-opacity': number
      }
    }
  }
} = reactive({
  data: {
    layer: '',
    type: '',
    field: '',
    method: 'hierarchical_line-color',
    uniqueValues: [],
    colorRamp: 'ramp1',
    'line-width-range': [1, 10],
    level: 1,
    option: {
      layout: {
        'visibility': 'visible',
        'line-cap': 'butt',
        'line-join': 'miter'
      },
      paint: {
        'line-blur': 0,
        'line-color': '#FFFFFF',
        'line-width': 1,
        'line-dasharray': [] as any[],
        'line-gap-width': 0,
        'line-opacity': 1
      }
    }
  }
})
const isPolylineStyleSettingDialogShow = ref(false)
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
watch(isPolylineHierarchicalRenderDialogShow, (val) => {
  if (val) {
    ruleFormRef.value?.resetFields()
  }
})
onMounted(() => {
  console.log(layerList)
})
const closeThisDialog = () => {
  emit('closePolylineHierarchicalRenderDialog')
}
const polylineHierarchicalRender = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      emit('closePolylineHierarchicalRenderDialog')
      emit('confirmPolylineHierarchicalRenderDialog', formData.data)
    }
  })
}
const openPolygonStyleSetting = () => {
  isPolylineStyleSettingDialogShow.value = true
  // console.log(isPolygonStyleSettingDialogShow.value)
}
const handleConfirmPolylineStyleSetting = (data: any) => {
  console.log(data)
  formData.data.option.layout['visibility'] = data.layout['visibility']
  formData.data.option.layout['line-cap'] = data.layout['line-cap']
  formData.data.option.layout['line-join'] = data.layout['line-join']
  formData.data.option.paint['line-blur'] = data.paint['line-blur'] / 10
  formData.data.option.paint['line-color'] = data.paint['line-color']
  formData.data.option.paint['line-width'] = data.paint['line-width']
  formData.data.option.paint['line-dasharray'] = data.paint['line-dasharray']
  formData.data.option.paint['line-gap-width'] = data.paint['line-gap-width']
  formData.data.option.paint['line-opacity'] = data.paint['opacity'] / 100
  // if(data.method === 'hierarchical_line-color') {
  //   // formData.data.option.paint['line-color'] = data.paint['line-color']
  //   delete formData.data['line-width-range']
  //   delete formData.data.option.paint['line-color']
  // } else if(data.method === 'hierarchical_line-width') {
  //   // formData.data.option.paint['line-width'] = data.paint['line-width']
  //   delete formData.data['colorRamp']
  //   delete formData.data.option.paint['line-width']
  // }
  // console.log(formData.data)
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
  geoFileApi.getUniqueValues(formData.data.layer, val, 'ASC').then((res: any) => {
    if (res.code === 200) {
      console.log(res.data)
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
