<template>
  <div class="container">
    <el-row style="height: 8%;">
      <el-col :span="24">
        <el-steps :active="active" finish-status="success" simple>
          <el-step title="基础数据" />
          <el-step title="工具库" />
          <el-step title="场景确认" />
        </el-steps>
      </el-col>

    </el-row>
    <el-row style="height: 92%; width: 100%;">
      <RouterView />
    </el-row>
    <div class="backBtnCon" v-if="createSceneCurrentStep !== 1" title="返回上一步">
      <el-icon size="30" @click="backStep">
        <ArrowLeftBold />
      </el-icon>
    </div>
    <div class="nextStepCon" v-if="createSceneCurrentStep !== 3" title="下一步">
      <el-icon size="30" @click="nextStep">
        <ArrowRightBold />
      </el-icon>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, toRefs, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRightBold, ArrowLeftBold } from '@element-plus/icons-vue'
import { usePublicStore } from '~/store/publicStore'
// interface MapSceneLayer {
//   id: string,
//   mvtUrl: string,
//   type: string,
//   visibility: string,
//   paint: any,
//   sourceLayer: string
// }
interface CreateSceneObj {
  name: string,
  type: string,
  userId: string,
  layers: Array<string>,
  toolLab: Array<string>
}
const router = useRouter()
const publicStore = usePublicStore()
const active = ref(0)
// const isLoading = ref(true)
// const createSceneObj = reactive({
//   data: {} as CreateSceneObj
// })

const { createSceneCurrentStep } = toRefs(publicStore)
// watch(createSceneCurrentStep, (val) => {
//   console.log(val)
//   active.value = val
//   router.push(`/createScene/${val + 1}`)
// })

onMounted(() => {
  publicStore.createSceneObj.userId = 'admin'
})
onBeforeUnmount(() => {
  publicStore.createSceneObj = {} as CreateSceneObj
})

const backStep = () => {
  active.value -= 1
  publicStore.createSceneCurrentStep = active.value + 1
  router.push(`/createScene/${active.value + 1}`)
}
const nextStep = () => {
  active.value += 1
  publicStore.createSceneCurrentStep = active.value + 1
  router.push(`/createScene/${active.value + 1}`)
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}

.nextBtnCon {
  position: absolute;
  top: 15%;
  right: 15%;
}

.backBtnCon {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  position: absolute;
  top: 45%;
  left: 20%;
}

.backBtnCon:hover {
  transform: scale(1.2);
  cursor: pointer;
}

.nextStepCon {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  position: absolute;
  top: 45%;
  right: 15%;
}

.nextStepCon:hover {
  transform: scale(1.2);
  cursor: pointer;
}

.mainCon {
  width: 100%;
  height: 100%;
}



/* give me a quote that has margin and padding */
</style>