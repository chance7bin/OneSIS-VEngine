<template>
  <el-dialog v-model="isPointSingleValueRenderDialogShow" title="点矢量单值制图" width="20%" center @close="closeThisDialog">
    <el-form ref="ruleFormRef" :model="formData.data" label-width="120px" label-position="right" :rules="rules">
      <el-form-item label="输入图层：" size="default" prop="layer">
        <el-select v-model="formData.data.layer" class="m-2" placeholder="请选择输入图层" @change="handleSelectChange">
          <el-option v-for="item in layerList" :key="item.id" :label="item.layerName" :value="item.sourceLayer" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.data.layer" label="图层类型：" size="default" prop="type" required>
        <el-tag class="ml-2" type="info">{{ formData.data.type }}</el-tag>
      </el-form-item>
      <el-form-item label="单值颜色：" size="default" prop="color">
        <el-color-picker v-model="formData.data.color" />
      </el-form-item>
      <el-form-item label="样式设置：" size="default" prop="option">
        <el-button type="info" @click="openPolygonStyleSetting" size="small">点样式设置...</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default"
        @click="polygonSingleValueRender(ruleFormRef as FormInstance)">确定</el-button>
      <el-button type="primary" size="default" @click="closeThisDialog">取消</el-button>
    </template>
  </el-dialog>
  <PointCircleStyleSettingDialog :is-point-circle-style-setting-dialog-show="isPointStyleSettingDialogShow"
    @close-point-style-setting-dialog="isPointStyleSettingDialogShow = false"
    @confirm-point-style-setting="confirmPointStyleSetting" />
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, inject, onMounted, watch } from 'vue'
import type { FormRules, FormInstance } from 'element-plus'
import PointCircleStyleSettingDialog from './PointCircleStyleSettingDialog.vue'
const props = defineProps({
  isPointSingleValueRenderDialogShow: {
    type: Boolean,
    default: false
  },
  // layerList: {
  //   type: Array<any>,
  //   default: () => []
  // }
})
const layerList = inject('layerList') as any
const emit = defineEmits(['closePointSingleValueRenderDialog', 'confirmPointSingleValueRenderDialog'])
const { isPointSingleValueRenderDialogShow } = toRefs(props)
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
    color: '#FF0000',
    option: {
      layout: {
        'visibility': 'visible',
      },
      paint: {
        'circle-blur': 0 as number,
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
watch(isPointSingleValueRenderDialogShow, (val) => {
  if (val) {
    ruleFormRef.value?.resetFields()
  }
})
onMounted(() => {
  console.log(layerList)
})
const closeThisDialog = () => {
  emit('closePointSingleValueRenderDialog')
}
const polygonSingleValueRender = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      emit('closePointSingleValueRenderDialog')
      emit('confirmPointSingleValueRenderDialog', formData.data)
    }
  })
}
const openPolygonStyleSetting = () => {
  isPointStyleSettingDialogShow.value = true

  // console.log(isPolygonStyleSettingDialogShow.value)
}
const confirmPointStyleSetting = (data: any) => {
  formData.data.option.layout['visibility'] = data.layout['visibility']
  formData.data.option.paint['circle-blur'] = data.paint['circle-blur'] / 10
  formData.data.option.paint['circle-radius'] = data.paint['circle-radius']
  formData.data.option.paint['circle-opacity'] = data.paint['circle-opacity'] / 100
  formData.data.option.paint['circle-stroke-color'] = data.paint['circle-stroke-color']
  formData.data.option.paint['circle-stroke-width'] = data.paint['circle-stroke-width']
  formData.data.option.paint['circle-stroke-opacity'] = data.paint['circle-stroke-opacity'] / 100
  console.log(data)
}

const handleSelectChange = (val: any) => {
  console.log(val)
  layerList.value.map((item: any) => {
    if (item.sourceLayer === val) {
      formData.data.type = item.dataType
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
