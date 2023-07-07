<template>
  <el-dialog v-model="isPolylineSingleValueRenderDialogShow" title="线矢量单值制图" width="20%" center @close="closeThisDialog">
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
    @confirm-polyline-style-setting="handleConfirmPolylineStyleSetting" render-type="single-value-render" />
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, inject, onMounted, watch } from 'vue'
import type { FormRules, FormInstance } from 'element-plus'
import PolylineStyleSettingDialog from './PolylineStyleSettingDialog.vue'
const props = defineProps({
  isPolylineSingleValueRenderDialogShow: {
    type: Boolean,
    default: false
  },
  // layerList: {
  //   type: Array<any>,
  //   default: () => []
  // }
})
const layerList = inject('layerList') as any
const emit = defineEmits(['closePolylineSingleValueRenderDialog', 'confirmPolylineSingleValueRenderDialog'])
const { isPolylineSingleValueRenderDialogShow } = toRefs(props)
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  layer: [
    { required: true, message: '请选择输入图层！', trigger: 'blur' },
  ],
  color: [
    { required: true, message: '请选择颜色！', trigger: 'blur' },
  ]
})
const formData = reactive(
  {
    data:
    {
      layer: '',
      type: '',
      color: '#FF0000',
      option: {
        layout: {
          'visibility': 'visible',
          'line-cap': 'butt',
          'line-join': 'miter'
        },
        paint: {
          'line-blur': 0,
          'line-width': 1,
          'line-dasharray': [] as any[],
          'line-gap-width': 0,
          'line-opacity': 1
        }
      }
    }
  }
)
const isPolylineStyleSettingDialogShow = ref(false)
watch(isPolylineSingleValueRenderDialogShow, (val) => {
  if (val) {
    ruleFormRef.value?.resetFields()
  }
})
onMounted(() => {
  console.log(layerList)
})
const closeThisDialog = () => {
  emit('closePolylineSingleValueRenderDialog')
}
const polygonSingleValueRender = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      emit('closePolylineSingleValueRenderDialog')
      emit('confirmPolylineSingleValueRenderDialog', formData.data)
    }
  })
}
const openPolygonStyleSetting = () => {
  isPolylineStyleSettingDialogShow.value = true
  // console.log(isPolygonStyleSettingDialogShow.value)
}
const handleConfirmPolylineStyleSetting = (data: any) => {
  // console.log(data)
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
