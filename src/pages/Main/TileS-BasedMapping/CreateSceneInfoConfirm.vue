<template>
  <div class="all">
    <el-form ref="ruleFormRef" :rules="rules" label-position="right" label-width="150px" :model="createSceneInfo"
      style="max-width: 800px;">
      <el-form-item label="场景名称：" prop="name">
        <el-input size="default" v-model="createSceneInfo.name" @input="handleInput" />
      </el-form-item>
      <el-divider border-style="hidden" />

      <el-form-item label="场景类型：" prop="type">
        <el-input size="default" v-model="createSceneInfo.type" disabled />
      </el-form-item>
      <el-divider border-style="hidden" />

      <el-form-item label="场景数据：" prop="layers">
        <!-- <el-input v-model="createSceneInfo.layers" disabled /> -->
        <el-tag size="large" v-for="tag in createSceneInfo.layers" :key="tag.id" class="mx-1" closable type="primary">
          {{ tag.name }}
        </el-tag>
      </el-form-item>
      <el-divider border-style="hidden" />

      <el-form-item label="场景工具：" prop="toolLab">
        <el-tag size="large" v-for="tag in createSceneInfo.toolLab" :key="tag.id" class="mx-1" closable type="primary">
          {{ tag.name }}
        </el-tag>
      </el-form-item>
      <el-divider border-style="hidden" />

      <el-form-item label="场景作者：" required>
        <el-input size="default" v-model="createSceneInfo.user" read-only="true" disabled />
      </el-form-item>
      <el-divider border-style="hidden" />
      <el-form-item class="btnPos">
        <el-button type="primary" size="large" class="createSceneBtn"
          @click="submitCreateScene(ruleFormRef as FormInstance)">创建场景</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { usePublicStore } from '~/store/publicStore';
import { useUserStore } from '~/store/user';
import { ElLoading, ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import sceneApi from '~/http/api/sceneApi';
import { useRouter } from 'vue-router';
const publicStore = usePublicStore()
const userStore = useUserStore()
const createSceneInfo = reactive({
  name: publicStore.createSceneObj.name,
  type: '基于瓦片服务的制图场景',
  user: '陈清彬',
  layers: publicStore.createSceneObj.layers,
  toolLab: publicStore.createSceneObj.toolLab
})
const router = useRouter()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入场景名称', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请选择场景类型', trigger: 'blur' },
  ]
})
const ruleFormRef = ref<FormInstance>()
const handleInput = (val: string) => {
  createSceneInfo.name = val
  publicStore.createSceneObj.name = val
}
const submitCreateScene = (formEl: FormInstance) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log(createSceneInfo)
      const loadingState = ElLoading.service({
        lock: true,
        text: '场景创建中...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      sceneApi.createScene({ name: createSceneInfo.name, type: 'visualization_service', userId: 'admin', dataSet: createSceneInfo.layers, toolSet: createSceneInfo.toolLab }).then(res => {
        if (res.code === 200) {
          console.log(res)
          ElMessage.success('场景创建成功')
          router.push("/tileMap")
        }
        loadingState.close()
      }).catch(err => {
        loadingState.close()
        ElMessage.error(err + '场景创建失败')
      })
    } else {
      ElMessage.error('缺少参数，创建场景失败！')
    }
  })
}
</script>

<style scoped>
.all {
  width: 100%;
  height: 100%;
  padding-left: 25%;
  padding-right: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.btnPos .el-form-item__content) {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-form-item) {
  display: flex;
  /* justify-content: center; */
  align-items: center;
}

.createSceneBtn {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}

.createSceneBtn:hover {
  background-color: #3f9eff;
  color: rgb(20, 49, 129);
  border-color: #3f9eff;
}

:deep(.el-form-item--small .el-form-item__label) {
  height: 24px;
  line-height: 24px;
  font-size: 20px;
  font-style: italic;
}
</style>