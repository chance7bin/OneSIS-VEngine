import http from '~/http/Http'
import axios from 'axios'

interface DeleteOrImportPdfFileParams {
  id: string,
  userId: string,
  catalogId: string
}


const uploadPdf = (uploadParams: any, config: any) => {
  return http.upload('/pdffile', uploadParams, config)
}

const deletePdf = (deletePdfParams: DeleteOrImportPdfFileParams) => {
  return http.delete('/pdffile', deletePdfParams)
}

const downloadFile = (fileId: string) => {
  return new Promise((resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
    try {
      window.location.href = 'http://localhost:8998/pdffile/download?fileId=' + fileId
      resolve(true)
    } catch (err) {
      reject(err)
    }
  })
}

const importPdfResource = (importPdfResourceObj: DeleteOrImportPdfFileParams) => {
  console.log(importPdfResourceObj)
  return http.post('/pdffile/importSharedPdfFile', importPdfResourceObj)
}

export default {
  uploadPdf,
  deletePdf,
  downloadFile,
  importPdfResource
}

