import http from '~/http/Http'

const getServiceDataVSceneToolList = () => {
  return http.get('/serviceDataVSceneTool/list')
}

export default {
  getServiceDataVSceneToolList
}