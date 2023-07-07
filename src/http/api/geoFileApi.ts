import http from '~/http/Http'
type ResponseType =
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text'
  | 'stream';
interface DeleteOrImportShp {
  userId: string,
  catalogId: string,
  fileId: string
}
const getGeoDataList = () => {
  return http.get('/geofile/list')
}
const getGeoPreview = (fileId: any) => {
  return http.get('/geofile/getShpPreview?fileId=' + fileId)
}

const getShpFeatures = (fileName: any) => {
  return http.get('/geofile/getAtrr?shpName=' + fileName)
}
const getFields = (geoId: string) => {
  return http.get('/geofile/getFields?geoId=' + geoId)
}
const getUniqueValues = (ptName: string, field: string, method: string) => {
  return http.get('/geofile/getUniqueValues?ptName=' + ptName + '&field=' + field + '&method=' + method)
}
const uploadShp = (uploadFormData: any, config: any) => {
  return http.upload('/geofile', uploadFormData, config)
}

const deleteShp = (deleteObj: DeleteOrImportShp) => {
  return http.delete('/geofile', deleteObj)
}

const downloadFile = (fileId: any) => {
  return new Promise((resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
    try {
      window.location.href = 'http://localhost:8998/geofile/download?fileId=' + fileId 
      // http.download('http://localhost:8998/file/download?fileId=' + fileId)
      resolve(true)
    } catch (err) {
      reject(err)
    }
  })
}


const importShpResource = (importShpResourceObj: DeleteOrImportShp) => {
  return http.post('/geofile/importShpResource', importShpResourceObj)
}
export default {
  getGeoDataList,
  uploadShp,
  deleteShp,
  downloadFile,
  getGeoPreview,
  getShpFeatures,
  getFields,
  getUniqueValues,
  importShpResource
}