import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '~/assets/css/iconfont.js'
import router from './router/index'
import { createPinia } from 'pinia'
import 'mapbox-gl/dist/mapbox-gl.css';

createApp(App).
  use(createPinia()).use(ElementPlus).use(router).mount('#app')
