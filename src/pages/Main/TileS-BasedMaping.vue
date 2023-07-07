<template>
  <div class="all">
    <el-row class="header">
      <el-col :span="24" class="headerFlex">
        <div class="createBtnCon">
          <el-button class="create-scene-btn" type="primary" :icon="Plus" size="large" @click="createScene"
            text>新建场景</el-button>
        </div>
        <el-divider style="margin-left: 20px;margin-right: 20px;" direction="vertical" />
        <div class="searchCon">
          <el-input v-model="inputVal" class="w-50 m-2" size="large" placeholder="搜索场景" :prefix-icon="Search" />
        </div>
        <el-divider style="margin-left: 20px;margin-right: 20px;" direction="vertical" />
        <div class="rightBtnCon">
          <el-dropdown size="large" @command="handleCommand" trigger="click">
            <span class="el-dropdown-link">
              <el-icon size="30" v-if="activeSceneDisplayType.label == '格网' ? true : false">
                <Grid />
              </el-icon>
              <el-icon size="30" v-else>
                <List />
              </el-icon>
              &nbsp;
              {{ activeSceneDisplayType.label }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="grid" :icon="Grid">格网</el-dropdown-item>
                <el-dropdown-item command="list" :icon="List">列表</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-divider border-style="hidden" style="margin-left: 20px;" direction="vertical" />
          <el-dropdown size="large" @command="handleSortCommand" trigger="click">
            <span class="el-dropdown-link">
              <el-icon size="30">
                <Sort />
              </el-icon>
              &nbsp;
              {{ activeSortefField.label }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="name">场景名称</el-dropdown-item>
                <el-dropdown-item command="createTime">创建时间</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
    <el-row class="body">
      <el-col :span="24" style="height: 100%;">
        <el-scrollbar class="scrollbarA">
          <el-row :gutter="30" v-for="(row, rowIndex) in Math.floor(sceneList.data.length / 4) + 1">
            <el-col :span="6"
              v-for="scene in sceneList.data.filter((item, index) => index >= rowIndex * 4 && index < (rowIndex + 1) * 4)">
              <el-card :body-style="{ padding: '0px' }">
                <div class="image" title="进入场景" @click="enterScene(scene)">
                  <img class="image" v-if="scene.sceneImg" :src="'data:image/png;base64,' + scene.sceneImg.data" />
                  <el-empty v-else :image-size="150" description="未编辑" />
                </div>
                <div class="sceneInfo">
                  <span class="sceneTitle">{{ scene.sceneName }}</span>
                  <div class="scene-type">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#onesis-earth_"></use>
                    </svg>&nbsp;&nbsp;
                    <span style="font-size: 16px;">{{ displaySceneType(scene.sceneType) }}</span>
                    <!-- <i class = "iconfont icon-daohanglan"></i> -->
                  </div>
                  <div class="bottom">
                    <div class="createTime">
                      <span style="font-size:13px;color:#6D5D6E;">创建时间：</span>
                      <time class="time">{{ scene.createTime }}</time>
                    </div>
                    <el-divider style="margin-top: 2px;margin-bottom:2px;" border-style="hidden"></el-divider>
                    <div class="lastUpdatedTime">
                      <span style="font-size:13px;color:#6D5D6E;">最后更新时间：</span>
                      <time class="time">{{ scene.lastUpdatedTime }}</time>
                    </div>
                    <el-divider style="margin-top: 2px;margin-bottom:2px;" border-style="hidden"></el-divider>
                    <div class="editNum">
                      <span style="font-size:13px;color:#6D5D6E;">编辑次数：</span>
                      <time class="time">{{ scene.editNum }}</time>
                    </div>
                  </div>
                </div>
                <el-divider style="margin-top: 3px;margin-bottom:3px;" />
                <div class="scene-bottom">
                  <div>
                    <span style="font-size:13px;color:#6D5D6E;">所有者：</span>
                    <time class="time">陈清彬</time>
                  </div>
                  <div style="padding-right: 14px;">
                    <el-button type="primary" :icon="Edit" circle @click="enterScene(scene)" />
                    <el-button type="info" :icon="Message" circle />
                    <el-button type="warning" :icon="Star" circle />
                    <el-button type="danger" :icon="Delete" circle @click="deleteScene(scene.sceneId)" />
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-divider border-style="hidden" style="margin-top: 10px;margin-bottom:10px;" />
          </el-row>
        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/store/user'
import { useSceneStore } from '~/store/scene'
import sceneApi from '~/http/api/sceneApi'
import '~/assets/css/iconfont'
import {
  Plus,
  Search,
  ArrowDown,
  Grid,
  List,
  Sort,
  Edit,
  Message,
  Star,
  Delete
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
interface Scene {
  sceneId: string,
  sceneName: string,
  sceneType: string,
  createTime: string,
  lastUpdatedTime: string,
  userId: string,
  editNum: number,
  sceneImg?: any,
  dataSet: Array<any>,
  toolSet: Array<any>
}
import mapIcon from '/map.png'
// const userStore = useUserStore()
const router = useRouter()
const sceneStore = useSceneStore()
const currentDate = ref(new Date())
const inputVal = ref('')
const sceneList = reactive({
  data: [] as Scene[]
})
const activeSceneDisplayType = ref(
  {
    label: '格网',
    value: 'grid'
  }
)
const displaySceneType = (scneType: string) => {
  switch (scneType) {
    case 'analysis':
      return '数据分析场景'
    case 'visualization_service':
      return '服务式数据可视场景'
    case 'visualization_code':
      return '编码式数据可视场景'
    case 'tag':
      return '数据标注场景'
  }
}
const activeSortefField = ref({
  label: '创建时间',
  value: 'createTime'
})
onMounted(() => {
  console.log("刷新场景")
  flushSceneList()

})
const handleCommand = (command: string | number | object) => {
  console.log(command)
  if (command === 'grid') {
    activeSceneDisplayType.value.label = '格网'
    activeSceneDisplayType.value.value = 'grid'
  } else {
    activeSceneDisplayType.value.label = '列表'
    activeSceneDisplayType.value.value = 'list'
  }
}
const handleSortCommand = (command: string | number | object) => {
  if (command === 'name') {
    activeSortefField.value.label = '场景名称'
    activeSortefField.value.value = 'name'
  } else if (command === 'createTime') {
    activeSortefField.value.label = '创建时间'
    activeSortefField.value.value = 'createTime'
  }
}
const createScene = () => {
  router.push('/createScene')
}
const flushSceneList = () => {
  sceneApi.getSceneList().then(res => {
    console.log(res)
    sceneList.data = res.data
  })
}
const enterScene = (scene: Scene) => {
  console.log(scene)
  sceneStore.setEditingScene(scene)
  router.push('/mapDataSceneEditor/' + scene.sceneId)
}
const deleteScene = (sceneId: string) => {
  sceneApi.deleteScene(sceneId).then(res => {
    if (res.code === 200) {
      flushSceneList()
      ElMessage.success('场景删除成功')
    } else {
      ElMessage.error('场景删除失败')
    }
  })
}
</script>

<style scoped>
.all {
  /* background-color: aqua; */
  height: 100%;
  /* margin-left: 100px;
  margin-right: 100px; */
  /* padding-left: 100px;
  padding-right: 100px; */
  /* overflow-y: scroll; */
  background-color: rgb(245, 243, 243);
}

.header {
  background-color: rgb(255, 255, 255);
  height: 8%;
  padding-left: 100px;
  padding-right: 100px;
  /* top: 10px; */
  /* border-bottom: 1px solid gray; */
}

.body {
  /* background-color: blue; */
  /* background-color: rgb(245, 243, 243); */
  padding-left: 100px;
  padding-right: 100px;
  padding-top: 20px;
  padding-bottom: 20px;
  height: 92%;
}

.headerFlex {
  display: flex;
  align-items: center;
}

.create-scene-btn {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}

.create-scene-btn:hover {
  background-color: #3f9eff;
  color: rgb(20, 49, 129);
  border-color: #3f9eff;
}


.searchCon {
  flex: 2;
}

.rightBtnCon {
  /* flex: 1; */
  display: flex;
  justify-content: flex-end;
}

.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  font-size: 20px;
}

.el-divider--vertical {
  height: 50%;
  margin-bottom: 30px;
  margin-top: 30px;
}

.scrollbarA {
  /* background-color: #409eff; */
  height: 100%;
  overflow: hidden;
}

.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-between;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
  height: 240px;
}

.image:hover {
  /* position: absolute; */
  opacity: 0.7;
  background-color: rgb(0, 0, 0);
  cursor: pointer;
}

.sceneInfo {
  padding: 14px;
}

.scene-bottom {
  padding-left: 14px;
  padding-bottom: 5px;
  padding-left: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sceneTitle {
  color: rgb(6, 52, 177);
  font-weight: 600;

}

.sceneTitle:hover {
  cursor: pointer;
  color: rgb(37, 94, 216)
}

.icon {
  width: 1.3em;
  height: 1.3em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.scene-type {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>