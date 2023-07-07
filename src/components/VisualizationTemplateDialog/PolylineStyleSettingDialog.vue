<template>
  <el-dialog v-model="isPolygonStyleSettingDialogShow" title="线样式设置" width="18%" center @close="closeThisDialog">
    <el-form ref="ruleFormRef" :model="formData.data" label-width="120px" label-position="right" :rules="rules">
      <!-- <el-form-item label="layout" size="large">

      </el-form-item> -->
      <span class="style-title">layout</span>
      <el-divider style="margin-bottom: 5px; margin-top: 15px;" />
      <el-form-item label="是否可见：" size="default" prop="layout" required title="控制图层是否可见">
        <el-radio-group v-model="formData.data.layout.visibility" class="ml-4">
          <el-radio label="visible">是</el-radio>
          <el-radio label="none">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="线帽：" size="default" prop="layout" required title="线的尾部样式：方形(确切端点)、圆形(端点之外)、方形(端点之外)">
        <el-select v-model="formData.data.layout['line-cap']" class="m-2" placeholder="请选择线帽样式">
          <el-option v-for="item in lineCapList" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="线连接：" size="default" prop="layout" required title="线相交时的样式：方形、圆形、锐角">
        <el-select v-model="formData.data.layout['line-join']" class="m-2" placeholder="请选择线连接处样式">
          <el-option v-for="item in lineJoinList" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <span class="style-title">paint</span>
      <el-divider style="margin-bottom: 5px; margin-top: 15px;" />
      <el-form-item label="线模糊度：" size="default" prop="paint" required title="线的模糊程度">
        <el-slider v-model="formData.data.paint['line-blur']" placement="right" :format-tooltip="formatTooltip" />
      </el-form-item>
      <el-form-item v-if="renderType === 'hierarchical_line-width'" label="线色：" size="default" prop="paint" required title="线的颜色">
        <el-color-picker v-model="formData.data.paint['line-color']" />
      </el-form-item>
      <el-form-item v-if="renderType !== 'hierarchical_line-width'" label="线宽：" size="default" prop="paint" required title="线的宽度">
        <el-input-number v-model="formData.data.paint['line-width']" :min="1" :max="10" />
      </el-form-item>
      <el-form-item label="线型：" size="default" prop="paint" required title="线的类型：实线、虚线、双实线、双虚线">
        <el-select v-model="currentLineType" class="m-2" placeholder="请选择线型" @change="changeLineType">
          <el-option v-for="item in lineTypeList" :key="item.id" :label="item.label" :value="item.value">
            <el-row type="flex" :gutter="20" justify="center">
              <el-col :span="18">
                <img :src="item.imgUrl" style="height:30px;float: left">
              </el-col>
              <el-col :span="6">
                <span>{{ item.label }}</span>
              </el-col>
            </el-row>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="currentLineType === 'dashed' || currentLineType === 'double_dashed'" label="虚线设置："
        size="default" prop="paint" required title="设置虚线的间隔样式">
        <el-row style="width: 300px;">
          <el-col :span="12">
            <span>虚线实部：</span>
          </el-col>
          <el-col :span="12">
            <el-input v-model="formData.data.paint['line-dasharray'][0]" placeholder="Please input">
              <template #append>px</template>
            </el-input>
          </el-col>
        </el-row>
        <el-row style="width: 300px;">
          <el-col :span="12">
            <span>虚线虚部：</span>
          </el-col>
          <el-col :span="12">
            <el-input v-model="formData.data.paint['line-dasharray'][1]" placeholder="Please input">
              <template #append>px</template>
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-if="currentLineType === 'double_solid' || currentLineType === 'double_dashed'" label="双线间隔："
        size="default" prop="paint" required title="设置双线的间隔大小">
        <el-input v-model="formData.data.paint['line-gap-width']" placeholder="Please input">
          <template #append>px</template>
        </el-input>
      </el-form-item>
      <el-form-item label="线不透明度：" size="default" prop="paint" required title="线的不透明度">
        <el-slider v-model="formData.data.paint['opacity']" placement="right" :format-tooltip="formatTooltip" />
      </el-form-item>
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
  isPolygonStyleSettingDialogShow: {
    type: Boolean,
    default: false
  },
  renderType: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['closePolylineStyleSettingDialog', 'confirmPolylineStyleSetting'])
const { isPolygonStyleSettingDialogShow, renderType } = toRefs(props)
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
      'line-cap': 'butt',
      'line-join': 'miter'
    },
    paint: {
      'line-blur': 0,
      'line-color': '#FFFFFF',
      'line-width': 1,
      'line-dasharray': [] as any[],
      'line-gap-width': 0,
      'opacity': 100
    }
  }
})
const lineCapList = ref<any>([
  {
    id: 1,
    label: '方形(确切端点)',
    value: 'butt'
  },
  {
    id: 2,
    label: '圆形(端点之外)',
    value: 'round'
  },
  {
    id: 3,
    label: '方形(端点之外)',
    value: 'square'
  }
])
const lineJoinList = ref<any>([
  {
    id: 1,
    label: '方形端点的连接',
    value: 'bevel'
  },
  {
    id: 2,
    label: '圆形端点的连接',
    value: 'round'
  },
  {
    id: 3,
    label: '带有锐角的连接',
    value: 'miter'
  }
])
const lineTypeList = ref<any>([
  {
    id: 1,
    label: '实线',
    value: 'solid',
    imgUrl: '/lineType/solid.png'
  },
  {
    id: 2,
    label: '虚线',
    value: 'dashed',
    imgUrl: '/lineType/dashed.png'
  },
  {
    id: 3,
    label: '双实线',
    value: 'double_solid',
    imgUrl: '/lineType/double_solid.png'
  },
  {
    id: 4,
    label: '双虚线',
    value: 'double_dashed',
    imgUrl: '/lineType/double_dashed.png'
  }
])
const currentLineType = ref('solid')
onMounted(() => {
})
const closeThisDialog = () => {
  emit('closePolylineStyleSettingDialog')
}
const confirmPolygonStyleSetting = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      emit('confirmPolylineStyleSetting', formData.data)
      emit('closePolylineStyleSettingDialog')
    }
  })
}
const formatTooltip = (val: number) => {
  return val + '%'
}
const changeLineType = (val: any) => {
  switch (val) {
    case 'solid':
      formData.data.paint['line-dasharray'] = []
      formData.data.paint['line-gap-width'] = 0
      break;
    case 'dashed':
      formData.data.paint['line-dasharray'] = [3, 3]
      formData.data.paint['line-gap-width'] = 0
      break;
    case 'double_solid':
      formData.data.paint['line-dasharray'] = []
      formData.data.paint['line-gap-width'] = 5
      break;
    case 'double_dashed':
      formData.data.paint['line-dasharray'] = [3, 3]
      formData.data.paint['line-gap-width'] = 5
      break;
  }
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
