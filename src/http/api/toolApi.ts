import http from '~/http/Http'

const getToolList = (toolType: string) => {
  return http.get('/tool/getToolList?type=' + toolType)
}

const invokeTool = (invokeToolConfig: any) => {
  return http.post('/tool/invoke', invokeToolConfig)
}

export default {
  getToolList,
  invokeTool
}