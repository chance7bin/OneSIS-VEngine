<template>
  <el-dialog v-model="isPolylineUniqueValueRenderDialogShow" title="线矢量唯一值制图" width="20%" center @close="closeThisDialog">
    <el-form ref="ruleFormRef" :model="formData.data" label-width="120px" label-position="right" :rules="rules">
      <el-form-item label="输入图层：" size="default" prop="layer">
        <el-select v-model="formData.data.layer" class="m-2" placeholder="请选择输入图层" @change="handleSelectChange">
          <el-option v-for="item in layerList" :key="item.id" :label="item.layerName" :value="item.sourceLayer" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.data.layer" label="图层类型：" size="default" prop="type" required>
        <el-tag class="ml-2" type="info">{{ formData.data.type }}</el-tag>
      </el-form-item>
      <el-form-item label="选择字段：" size="default" prop="field" required>
        <el-select v-model="formData.data.field" class="m-2" placeholder="请选择输入字段" @change="handleFieldSelectChange">
          <el-option v-for="item in fieldList" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择色带：" size="default" prop="colorRamp" required>
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
      <el-form-item label="样式设置：" size="default" prop="option">
        <el-button type="info" @click="openPolygonStyleSetting" size="small">线样式设置...</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default"
        @click="polygonSingleValueRender(ruleFormRef as FormInstance)">确定</el-button>
      <el-button type="primary" size="default" @click="closeThisDialog">取消</el-button>
    </template>
  </el-dialog>
  <PolylineStyleSettingDialog :is-polygon-style-setting-dialog-show="isPolylineStyleSettingDialogShow"
    @close-polyline-style-setting-dialog="isPolylineStyleSettingDialogShow = false"
    @confirm-polyline-style-setting="handleConfirmPolylineStyleSetting" render-type="unique-value-render" />
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
  isPolylineUniqueValueRenderDialogShow: {
    type: Boolean,
    default: false
  },
  // layerList: {
  //   type: Array<any>,
  //   default: () => []
  // }
})
const layerList = inject('layerList') as any
const emit = defineEmits(['closePolylineUniqueValueRenderDialog', 'confirmPolylineUniqueValueRenderDialog'])
const { isPolylineUniqueValueRenderDialogShow } = toRefs(props)
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  layer: [
    { required: true, message: '请选择输入图层！', trigger: 'blur' },
  ],
  color: [
    { required: true, message: '请选择颜色！', trigger: 'blur' },
  ]
})
const formData = reactive({
  data: {
    layer: '',
    type: '',
    field: '',
    uniqueValues: [],
    colorRamp: 'ramp1',
    option: {
      layout: {
        'visibility': 'visible',
        'line-cap': 'butt',
        'line-join': 'miter'
      },
      paint: {
        'line-blur': 0,
        // 'line-color': '#FFFFFF',
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
watch(isPolylineUniqueValueRenderDialogShow, (val) => {
  if (val) {
    ruleFormRef.value?.resetFields()
  }
})
onMounted(() => {
  console.log(layerList)
})
const closeThisDialog = () => {
  emit('closePolylineUniqueValueRenderDialog')
}
const polygonSingleValueRender = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      emit('closePolylineUniqueValueRenderDialog')
      emit('confirmPolylineUniqueValueRenderDialog', formData.data)
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
  // formData.data.option.paint['line-color'] = data.paint['line-color']
  formData.data.option.paint['line-width'] = data.paint['line-width']
  formData.data.option.paint['line-dasharray'] = data.paint['line-dasharray']
  formData.data.option.paint['line-gap-width'] = data.paint['line-gap-width']
  formData.data.option.paint['line-opacity'] = data.paint['opacity'] / 100
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
