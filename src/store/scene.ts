import { defineStore } from 'pinia'

export const useSceneStore = defineStore('scene', {
  state: () => {
    return {
      editingScene: {
        sceneId: '',
        sceneName: '',
        sceneType: '',
        sceneUserId: '',
        createTime: '',
        lastUpdatedTime: '',
        userId: '',
        editNum: 0,
        sceneImg: '',
        dataSet: [],
        toolSet: []
      },
      currentSceneConfig: {
      } as any
    }
  },
  actions: {
    setEditingScene(scene: any) {
      this.editingScene = scene
    },
    setCurrentSceneConfig(scene: any) {
      this.currentSceneConfig = scene
    },
    updateCurrentSceneConfigLayerGroup(layer: any) {
      this.currentSceneConfig.layerGroup.forEach((layer: any) => {
        
      });
    }
  }
})