<template>
  <el-dialog v-model="isPolygonStyleSettingDialogShow" title="面样式设置" width="18%" center @close="closeThisDialog">
    <el-form ref="ruleFormRef" :model="formData.data" label-width="120px" label-position="right" :rules="rules">
      <!-- <el-form-item label="layout" size="large">

      </el-form-item> -->
      <span class="style-title">layout</span>
      <el-divider style="margin-bottom: 5px; margin-top: 15px;" />
      <el-form-item label="是否可见：" size="default" prop="layout" required>
        <el-radio-group v-model="formData.data.layout.visibility" class="ml-4">
          <el-radio label="visible">是</el-radio>
          <el-radio label="none">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <span class="style-title">paint</span>
      <el-divider style="margin-bottom: 5px; margin-top: 15px;" />
      <el-form-item label="轮廓线颜色：" size="default" prop="paint" required>
        <el-color-picker v-model="formData.data.paint['outline-color']" />
      </el-form-item>
      <el-form-item label="不透明度：" size="default" prop="paint" required>
        <el-slider v-model="formData.data.paint['opacity']" placement="right" :format-tooltip="formatTooltip" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default"
        @click="confirmPolygonStyleSetting(ruleFormRef as FormInstance)">确定</el-button>
      <!-- &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp; -->
      <el-button type="primary" size="default" @click="closeThisDialog">取消</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, inject, onMounted, watch } from 'vue'
import type { FormRules, FormInstance } from 'element-plus'
const props = defineProps({
  isPolygonStyleSettingDialogShow: {
    type: Boolean,
    default: false
  },
  // layerList: {
  //   type: Array<any>,
  //   default: () => []
  // }
})

const emit = defineEmits(['closePolygonStyleSettingDialog', 'confirmPolygonStyleSetting'])
const { isPolygonStyleSettingDialogShow } = toRefs(props)
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '文件夹名称不能为空！', trigger: 'blur' },
  ]
})
const formData = reactive({
  data: {
    layout: {
      'visibility': 'visible'
    },
    paint: {
      'outline-color': '#FFFFFF',
      'opacity': 100
    }
  }
})
onMounted(() => {
})
const closeThisDialog = () => {
  emit('closePolygonStyleSettingDialog')
}
const confirmPolygonStyleSetting = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      emit('confirmPolygonStyleSetting', formData.data)
      emit('closePolygonStyleSettingDialog')
    }
  })
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
