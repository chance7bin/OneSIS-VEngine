<template>
  <el-dialog v-model="isPointGradualValueRenderDialogShow" title="点矢量渐变制图" width="20%" center @close="closeThisDialog">
    <el-form ref="ruleFormRef" :model="formData.data" label-width="120px" label-position="right" :rules="rules">
      <el-form-item label="输入图层：" size="default" prop="layer">
        <el-select v-model="formData.data.layer" class="m-2" placeholder="请选择输入图层" @change="handleSelectChange">
          <el-option v-for="item in layerList" :key="item.id" :label="item.layerName" :value="item.sourceLayer" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.data.layer" label="图层类型：" size="default" prop="type" required>
        <el-tag class="ml-2" type="info">{{ formData.data.type }}</el-tag>
      </el-form-item>
      <el-form-item label="渐变字段：" size="default" prop="field" required>
        <el-select v-model="formData.data.field" class="m-2" placeholder="请选择输入字段" @change="handleFieldSelectChange">
          <el-option v-for="item in fieldList" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="渐变方式：" size="default" prop="sort" required>
        <el-radio-group v-model="formData.data.sort" class="ml-4" @change="handleSortChange">
          <el-radio label="ASC">按字段值升序</el-radio>
          <el-radio label="DESC">按字段值降序</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="渐变色带：" size="default" prop="colorRamp" required>
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
    @confirm-point-style-setting="confirmPointStyleSetting" render-type="gradualValueRender" />
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
  isPointGradualValueRenderDialogShow: {
    type: Boolean,
    default: false
  },
  // layerList: {
  //   type: Array<any>,
  //   default: () => []
  // }
})
const layerList = inject('layerList') as any
const emit = defineEmits(['closePointGradualValueRenderDialog', 'confirmPointGradualValueRenderDialog'])
const { isPointGradualValueRenderDialogShow } = toRefs(props)
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
    sort: 'ASC',
    uniqueValues: [],
    colorRamp: 'gradual_ramp1',
    option: {
      layout: {
        'visibility': 'visible',
      },
      paint: {
        'circle-blur': 0 as number,
        // 'circle-color': '#FF0000',
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
    label: '色带1',
    value: 'gradual_ramp1',
    image: '/colorRampImg/gradual_ramp1.png'
  },
  {
    id: 2,
    label: '色带2',
    value: 'gradual_ramp2',
    image: '/colorRampImg/gradual_ramp2.png'
  },
  {
    id: 3,
    label: '色带3',
    value: 'gradual_ramp3',
    image: '/colorRampImg/gradual_ramp3.png'
  },
  {
    id: 4,
    label: '色带4',
    value: 'gradual_ramp4',
    image: '/colorRampImg/gradual_ramp4.png'
  },
  {
    id: 5,
    label: '色带5',
    value: 'gradual_ramp5',
    image: '/colorRampImg/gradual_ramp5.png'
  },
  {
    id: 6,
    label: '色带6',
    value: 'gradual_ramp6',
    image: '/colorRampImg/gradual_ramp6.png'
  }
])
const fieldUniqueValues = ref<Array<any>>([])
watch(isPointGradualValueRenderDialogShow, (val) => {
  if (val) {
    ruleFormRef.value?.resetFields()
  }
})
onMounted(() => {
  console.log(layerList)
})
const closeThisDialog = () => {
  emit('closePointGradualValueRenderDialog')
}
const polygonUniqueValueRender = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      // console.log(formData.data)
      emit('closePointGradualValueRenderDialog')
      emit('confirmPointGradualValueRenderDialog', formData.data)
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
  formData.data.option.paint['circle-radius'] = data.paint['circle-radius']
  formData.data.option.paint['circle-opacity'] = data.paint['circle-opacity'] / 100
  formData.data.option.paint['circle-stroke-color'] = data.paint['circle-stroke-color']
  formData.data.option.paint['circle-stroke-width'] = data.paint['circle-stroke-width']
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
const handleSortChange = (val: any) => {
  geoFileApi.getUniqueValues(formData.data.layer, formData.data.field, val).then((res: any) => {
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
