import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/data',
    children: [
      {
        path: '/data',
        name: 'Data',
        component: () => import('~/pages/Main/DataService.vue')
      },
      {
        path: '/tileMap',
        name: 'TileMap',
        component: () => import('~/pages/Main/TileS-BasedMaping.vue')
      },
      {
        path: '/createScene',
        name: 'createScene',
        component: () => import('~/pages/Main/TileS-BasedMapping/CreateScene.vue'),
        children: [
          {
            path: '',
            name: 'defaultScene',
            redirect: '/createScene/1'
          },
          {
            path: '/createScene/1',
            name: 'createScene1',
            component: () => import('~/pages/Main/TileS-BasedMapping/SelectData.vue')
          },
          {
            path: '/createScene/2',
            name: 'createScene2',
            component: () => import('~/pages/Main/TileS-BasedMapping/SelectTools.vue')
          },
          {
            path: '/createScene/3',
            name: 'createScene3',
            component: () => import('~/pages/Main/TileS-BasedMapping/CreateSceneInfoConfirm.vue')
          }
        ]
      },
      {
        path: '/mapDataSceneEditor/:id',
        name: 'mapDataSceneEditor',
        component: () => import('~/pages/Main/MapDataSceneEditor.vue')
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router