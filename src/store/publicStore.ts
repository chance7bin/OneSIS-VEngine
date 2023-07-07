import { defineStore } from 'pinia'


export const usePublicStore = defineStore('public', {
  state: () => {
    return {
      activeIndex: '1',
      createSceneObj: {
        name: '',
        type: '',
        userId: '',
        layers: [] as any,
        toolLab: [] as any
      },
      createSceneCurrentStep: 1
    }
  },
  actions: {
    updateActiveIndex(currentIndex: string) {
      this.$state.activeIndex = currentIndex
    },
    setCreateSceneCurrentStep(step: number) {
      this.$state.createSceneCurrentStep = step
    }
  }
})