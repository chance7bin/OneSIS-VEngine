<template>
  <div class="container">
    <el-row class="title">
      <div class="fontContainer">
        <span class="titleFont">数据资源</span>
      </div>
    </el-row>
    <el-row class="divider">
      <el-divider></el-divider>
    </el-row>
    <el-row class="fileCon">
      <el-row class="btnCon">
        <el-button type="primary" size="default" :icon="Upload" @click="uploadFile" text bg round>上传文件</el-button>
      </el-row>
      <el-row class="fileRow">
        <el-scrollbar class="realFileRow">
          <template v-if="catalogList.data.length">
            <el-row :gutter="20" v-for="(row, rowIndex) in Math.floor(catalogList.data.length / 6) + 1">
              <el-col
                v-for="file in catalogList.data.filter((item, index) => index >= rowIndex * 6 && index < (rowIndex + 1) * 6)"
                :key="file.id" :span="4">
                <el-card :body-style="{ padding: '0px', height: '200px', width: '150px' }">
                  <img :src="shpIcon" style="width: 160px;" />
                  <div
                    style="padding: 0px; text-align: center; width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                    <span>{{ file.displayName }}</span>
                  </div>
                </el-card>
              </el-col>
              <el-divider border-style="hidden" style="margin-bottom: 5px; margin-top: 5px;" />
            </el-row>
          </template>
          <template v-else>
            <div class="noData">
              <span class="noDataFont">无数据！</span>
            </div>
          </template>
        </el-scrollbar>
      </el-row>
    </el-row>
  </div>
  <!-- 上传文件对话框 -->
  <el-dialog v-model="uploadFileDialog" title="上传文件" width="auto" destroy-on-close align-center>
    <el-form ref="uploadRuleFormRef" :model="uploadFormData.data" label-width="120px" label-position="right"
      :rules="uploadRules">
      <el-form-item label="选择文件：" size="default" prop="file">
        <el-upload ref="uploadRef" class="upload-demo" :auto-upload="false" :before-upload="beforeUpload"
          :on-change="handleUploadChange" :file-list="fileList.data" drag>
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              矢量文件请遵循ESRI Shapefile规范，并上传无嵌套文件夹的zip压缩包，单文件大小 ≤ 5GB
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="文件名称：" size="default" prop="fileName">
        <el-input v-model.trim="uploadFormData.data.fileName" placeholder="请输入文件夹名" />
      </el-form-item>
      <el-form-item label="空间参考：" size="default" prop="srid">
        <el-select v-model="uploadFormData.data.srid" disabled>
          <el-option v-for="item in sricList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="编码方式：" size="default" prop="code">
        <el-select v-model="uploadFormData.data.code" @change="selectCodeChange">
          <el-option v-for="item in codeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-divider border-style="hidden" style="margin-bottom: 5px; margin-top: 5px;" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default"
          @click="submitUploadFile(uploadRuleFormRef as FormInstance)">上传</el-button>
        <el-divider direction="vertical" border-style="hidden" />
        <el-divider direction="vertical" border-style="hidden" />
        <el-divider direction="vertical" border-style="hidden" />
        <el-button type="primary" size="default" @click="uploadFileDialog = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <div class="loading" v-if="loading">
    <h4 class="tips">{{ tips }}</h4>
    <!--进度条-->
    <el-progress type="circle" :percentage="percentage" class="progress" :show-text="true"></el-progress>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import shpIcon from '/shp.png'
interface CatalogListData {
  id: string,
  displayName: string
}
import {
  Search,
  Plus,
  Upload,
  Back,
  Delete,
  View,
  Download,
  Folder,
  UploadFilled,
  Link
} from '@element-plus/icons-vue'
import type { UploadRawFile, UploadFile, FormInstance, FormRules, UploadInstance, UploadUserFile } from 'element-plus'
import geoFileApi from '~/http/api/geoFileApi';
import { ElMessage } from 'element-plus';
const uploadFileDialog = ref(false)
const uploadFormData = reactive({
  data: {
    file: null,
    fileName: '',
    fileTemplate: '',
    srid: '4326',
    code: 'UTF-8',
    discription: ''
  }
})
const catalogList = reactive({
  data: [
  ] as CatalogListData[]
})
const fileList = reactive(
  {
    data: [] as UploadUserFile[]
  }
)
const validateUploadFile = (rule: any, value: any, callback: (errors?: Error) => void) => {
  if (fileList.data.length === 0) {
    callback(new Error('未添加文件！'));
  } else {
    callback();
  }
}
const uploadRuleFormRef = ref<FormInstance>()
const uploadRef = ref<UploadInstance>()

const uploadRules = reactive<FormRules>({
  file: [
    { validator: validateUploadFile, required: true, trigger: 'change' },
  ],
  fileName: [
    { required: true, message: '文件名称不能为空！', trigger: 'blur' },
  ],
  srid: [
    { required: true, message: '空间参考不能为空！', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '编码方式不能为空！', trigger: 'blur' },
  ]
})
const sricList = reactive([
  {
    label: '4326(WGS-84坐标系)',
    value: '4326'
  }
])
const codeList = reactive([
  {
    label: 'UTF-8',
    value: 'UTF-8'
  },
  {
    label: 'LATIN1',
    value: 'LATIN1'
  }
])
const loading = ref(false)
const tips = ref("文件上传中...")
const percentage = ref(0)
onMounted(() => {
  flushCatalogList()
})

const flushCatalogList = () => {
  geoFileApi.getGeoDataList().then(res => {
    if (res.code === 200) {
      catalogList.data = res.data
    }
  })
}
const uploadFile = () => {
  uploadFileDialog.value = true
  // uploadFormData.data.fileName = ''
}
const submitUploadFile = (formEl: FormInstance) => {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      uploadFileDialog.value = false
      loading.value = true
      uploadRef.value!.submit()
    }
  })
}
const beforeUpload = (rawFile: UploadRawFile) => {
  console.log(rawFile)
  let formData = new FormData()
  let config = {
    onUploadProgress: (progressEvent: ProgressEvent) => {
      let complete = parseFloat((progressEvent.loaded / progressEvent.total).toFixed(2)) * 100;
      percentage.value = complete
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  formData.append('file', rawFile)
  formData.append('fileName', uploadFormData.data.fileName)
  formData.append('srid', uploadFormData.data.srid)
  formData.append('code', uploadFormData.data.code)
  formData.append('userId', 'admin')
  formData.append('catalogId', 'c11722c2-e7cb-4132-ae09-9fab07f04a13')
  geoFileApi.uploadShp(formData, config).then(res => {
    console.log(res)
    if (res.code == 200) {
      ElMessage({
        type: 'success',
        message: '文件上传成功！'
      })
    } else {
      ElMessage({
        type: 'error',
        message: res.msg
      })
    }
    loading.value = false
    percentage.value = 0
    flushCatalogList()
  })


}
const selectCodeChange = (val: any) => {
  console.log(val)
  uploadFormData.data.code = val
}
const handleUploadChange = (rawFile: UploadFile, uploadFileList: UploadUserFile[]) => {
  fileList.data = uploadFileList
  uploadFormData.data.fileName = rawFile.name.substring(0, rawFile.name.lastIndexOf("."))
}
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
}

.title {
  height: 8%;
}

.divider {
  height: 5%;
  padding-left: 50px;
  padding-right: 50px;
}

.fontContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.titleFont {
  font-size: 40px;
  font-family: "HeiTi";
  font-weight: bold;

}

.fileCon {
  height: 87%;
  padding-left: 100px;
  padding-right: 100px;
}

.btnCon {
  height: 5%;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.fileRow {
  height: 90%;
  width: 100%;
  border-style: outset;
  display: flex;
  /* background-color: aqua; */
}

.realFileRow {
  width: 100%;
  height: 90%;
  padding: 50px;
}

.noData {
  width: 120px;
  height: 120px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  /* 有了这个就自动居中了 */
  /* 50%为自身尺寸的一半 */

}

.noDataFont {
  font-size: 30px;
  font-style: italic;
  color: rgba(85, 84, 84, 0.7);
}

.el-button {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}

.el-button:hover {
  background-color: #3f9eff;
  color: rgb(20, 49, 129);
  border-color: #3f9eff;
}

.el-card {
  display: flex;
  justify-content: center;
  align-content: space-around;
}

:deep(.el-card__body) {
  padding: var(--el-card-padding);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

:deep(.el-card:hover) {
  background-color: rgba(69, 137, 240, 0.3);
  border-color: rgba(7, 57, 196, 0.781);
  cursor: pointer;
  transform: scale(0.95);
}

.loading {
  background: rgba(128, 128, 128, 0.5);
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  /* display: none; */
  z-index: 20;
  /* filter: alpha(opacity=60); */
  /* opacity: 0.5; */
}

.tips {
  color: #0b70d4;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -80px;
  margin-top: -150px;
  opacity: 1;
}

.progress {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -100px;
  margin-top: -100px;
}
</style>