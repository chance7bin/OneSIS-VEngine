<template>
  <el-dialog v-model="isPointCircleStyleSettingDialogShow" title="点样式设置" width="18%" center @close="closeThisDialog">
    <el-form ref="ruleFormRef" :model="formData.data" label-width="120px" label-position="right" :rules="rules">
      <!-- <el-form-item label="layout" size="large">

      </el-form-item> -->
      <span class="style-title">layout</span>
      <el-divider style="margin-bottom: 5px; margin-top: 15px;" />
      <el-form-item label="是否可见：" label-width="130px" size="default" prop="layout" required title="控制图层是否可见">
        <el-radio-group v-model="formData.data.layout.visibility" class="ml-4">
          <el-radio label="visible">是</el-radio>
          <el-radio label="none">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <span class="style-title">paint</span>
      <el-divider style="margin-bottom: 5px; margin-top: 15px;" />
      <el-form-item label="圆点模糊度：" label-width="130px" size="default" prop="paint" required title="圆点的模糊程度">
        <el-slider v-model.number="formData.data.paint['circle-blur']" placement="right" :format-tooltip="formatTooltip" />
      </el-form-item>
      <el-form-item v-if="renderType === 'hierarchical_circle-radius'" label="圆点颜色：" size="default" prop="paint" required
        title="圆点的颜色">
        <el-color-picker v-model="formData.data.paint['circle-color']" />
      </el-form-item>
      <el-form-item v-if="renderType !== 'hierarchical_circle-radius'" label="圆点半径：" size="default" prop="paint" required
        title="圆点的半径">
        <el-input v-model.number="formData.data.paint['circle-radius']" placeholder="Please input">
          <template #append>px</template>
        </el-input>
      </el-form-item>
      <el-form-item label="圆点不透明度：" label-width="130px" size="default" prop="paint" required title="圆点的不透明度">
        <el-slider v-model.number="formData.data.paint['circle-opacity']" placement="right" :format-tooltip="formatTooltip" />
      </el-form-item>
      <el-form-item label="圆点外轮廓线：" label-width="130px" size="default" prop="layout" required title="是否开启圆点的外轮廓线">
        <el-radio-group v-model="isOpenCircleStroke" @change="isOpenCircleStrokeChange" class="ml-4">
          <el-radio label="open">开启</el-radio>
          <el-radio label="close">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="isOpenCircleStroke === 'open'">
        <el-form-item label="外轮廓线颜色：" label-width="130px" size="default" prop="paint" required title="圆点的外轮廓线颜色">
          <el-color-picker v-model="formData.data.paint['circle-stroke-color']" />
        </el-form-item>
        <el-form-item label="外轮廓线线宽：" label-width="130px" size="default" prop="paint" required title="圆点外轮廓线的宽度">
          <el-input v-model.number="formData.data.paint['circle-stroke-width']" placeholder="Please input">
            <template #append>px</template>
          </el-input>
        </el-form-item>
        <el-form-item label="外轮廓线不透明度：" label-width="150px" size="default" prop="paint" required title="圆点外轮廓线的不透明度">
          <el-slider v-model.number="formData.data.paint['circle-stroke-opacity']" placement="right"
            :format-tooltip="formatTooltip" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default"
        @click="confirmPolygonStyleSetting(ruleFormRef as FormInstance)">确定</el-button>
      <el-button type="primary" size="default" @click="closeThisDialog">取消</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, inject, onMounted, watch } from 'vue'
import type { FormRules, FormInstance } from 'element-plus'
const props = defineProps({
  isPointCircleStyleSettingDialogShow: {
    type: Boolean,
    default: false
  },
  renderType: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['closePointStyleSettingDialog', 'confirmPointStyleSetting'])
const { isPointCircleStyleSettingDialogShow, renderType } = toRefs(props)
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '文件夹名称不能为空！', trigger: 'blur' },
  ]
})
const formData = reactive({
  data: {
    layout: {
      'visibility': 'visible',
    },
    paint: {
      'circle-blur': 0 as number,
      'circle-color': '#FF0000',
      'circle-radius': 5 as number,
      'circle-opacity': 100 as number,
      'circle-stroke-color': '#000000',
      'circle-stroke-width': 0 as number,
      'circle-stroke-opacity': 100 as number
    }
  }
})
const isOpenCircleStroke = ref('close')
onMounted(() => {
})
const closeThisDialog = () => {
  emit('closePointStyleSettingDialog')
}
const confirmPolygonStyleSetting = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      emit('confirmPointStyleSetting', formData.data)
      emit('closePointStyleSettingDialog')
    }
  })
}
const isOpenCircleStrokeChange = (val: string) => {
  console.log(val)
  if (val === 'open') {
    formData.data.paint['circle-stroke-width'] = 3 as number
  } else if(val === 'close'){
    formData.data.paint['circle-stroke-width'] = 0 as number
  }
}
const formatTooltip = (val: number) => {
  return val + '%'
}
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}

:deep(.el-dialog--center .el-dialog__body) {
  padding-bottom: 0;
}

:deep(.el-dialog__footer) {
  padding-top: 0px;
}

.style-title {
  font-size: 20px;
  font-weight: bold;
}
</style>
