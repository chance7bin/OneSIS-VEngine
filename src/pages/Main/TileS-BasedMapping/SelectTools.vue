<template>
  <div class="all">
    <p style="text-align: center; margin: 0 0 50px; font-size: 30px;font-weight: 600;">
      添加场景默认工具（非必要）
    </p>
    <el-tree size="large" :props="treeProps" :load="loadNode" @node-click="handleTreeNodeClick" @check="handleCheckChange"
      show-checkbox lazy>
    </el-tree>
  </div>
  <el-tooltip ref="tooltipRef" v-model:visible="visible" :popper-options="{
    modifiers: [
      {
        name: 'computeStyles',
        options: {
          adaptive: false,
          enabled: false,
        },
      },
    ],
  }" :virtual-ref="buttonRef" virtual-triggering trigger="click" popper-class="singleton-tooltip">
    <template #content>
      <span> Some content </span>
    </template>
  </el-tooltip>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import toolApi from '~/http/api/toolApi'
import serviceDataVSceneToolApi from '~/http/api/serviceDataVSceneToolApi';
import { usePublicStore } from '~/store/publicStore';
import type Node from 'element-plus/es/components/tree/src/model/node'
import { ElMessage } from 'element-plus';


interface Tree {
  id: string,
  name: string,
  label?: string,
  type?: string,
  description: string,
  toolImg?: string,
  leaf?: boolean
}

interface GetCatalogList {
  userId: string,
  catalogId: string
}
interface CatalogListData {
  id: string,
  name: string,
  fileType: string,
  dataType: string,
  date: string,
}
const publicStore = usePublicStore()
watch(() => publicStore.createSceneObj.type, val => {
  console.log(val)
  tooFolder.value = val
})
const treeProps = {
  label: 'name',
  children: 'zones',
  isLeaf: 'leaf',
}
const props = defineProps({
  isCatalogTreeDialogShow: {
    type: Boolean,
    default: false
  }
})
const tooFolder = ref('')
onMounted(() => {
  tooFolder.value = publicStore.createSceneObj.type
})
const emit = defineEmits(["closeCatalogTreeDialog", "confirmSavePath"])
const clickNode = reactive({
  obj: null as any
})
const buttonRef = ref()
const tooltipRef = ref()

const visible = ref(false)
// const data = [] as Tree[]
const loadNode = async (node: Node, resolve: (data: Tree[]) => void) => {
  await handleTreeNodeClick()
  console.log(node)
  if (node.level === 0) {
    return resolve([{ name: 'OneSIS-VEngine-Tools', type: 'folder', id: 'tool_root_folder', description: "" }])
  }
  if (node.level === 1) {
    const toolList = await getToolList(publicStore.createSceneObj.type) as any
    console.log(toolList)
    const data: Tree[] = []
    toolList.forEach((tool: any) => {
      data.push({
        id: tool.id,
        name: tool.name,
        label: tool.label,
        type: tool.type ? tool.type : '',
        description: tool.description,
        toolImg: tool.toolImg ? tool.toolImg : '',
        leaf: true
      })
    })
    return resolve(data)
  }
}
const getToolList = (toolTye: string) => {
  return new Promise((resolve, reject) => {
    serviceDataVSceneToolApi.getServiceDataVSceneToolList().then(res => {
      if (res.code === 200) {
        resolve(res.data)
      }
    }).catch(err => {
      reject(err)
    })
  })
}
const handleTreeNodeClick = (node?: any) => {
  console.log(node)
  return new Promise(resolve => {
    clickNode.obj = node
    resolve(true)
  })
}
const handleCheckChange = (node: any, checked: any) => {
  console.log(checked)
  publicStore.createSceneObj.toolLab = []
  checked.checkedNodes.find((item: any) => {
    if (item.type !== 'folder') {
      publicStore.createSceneObj.toolLab.push(item)
    }
  })
}
</script>

<style scoped>
.all {
  font-size: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  /* height: 100%; */
  padding-top: 150px;
  padding-left: 550px;
  padding-right: 500px;
  /* background-color: aliceblue; */
  align-items: center;
}

.singleton-tooltip {
  transition: transform 0.3s var(--el-transition-function-fast-bezier);
}

.el-tree-node__label {
  width: auto;
  margin-top: 12px;
  float: right;
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  font-size: 20px;
  /* color: #999999; */
  line-height: 25px;
  letter-spacing: 1px;
}

:deep(.el-tree-node__content) {
  display: flex;
  align-items: center;
  height: 46px;
  cursor: pointer;
  width: 500px;
  /* background-color: ghostwhite; */
}

:deep(.el-tree-node>.el-tree-node__children) {
  width: 500px;
}

:deep(.el-tree) {
  color: #305aad;
}


.el-tree-node>.el-tree-node__content:hover {
  background-color: #0e67a1;
}
</style>