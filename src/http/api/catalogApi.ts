import type { AxiosRequestConfig } from 'axios'
import http from '~/http/Http'

interface GetCatalogList {
  userId: string,
  catalogId: string
}
interface GetRootCatalog {
  parentId: string,
  userId: string
}
interface CreateCatalog {
  userId: string,
  parentCatalogId: string,
  catalogName: string
}

const getCatalogList = (getCatalogListObj: GetCatalogList) => {
  return http.get('/catalog/getList', { params: getCatalogListObj } as AxiosRequestConfig)
}

const getRootCatalog = (getRootCatalogObj: GetRootCatalog) => {
  return http.get('/catalog/getRoot', { params: getRootCatalogObj } as AxiosRequestConfig)
}

const getCatalogBreadCrumb = (catalogId: string) => {
  return http.get('/catalog/getCatalogBreadCrumb?catalogId=' + catalogId)
}

const createNewCatalog = (createNewCatalogObj: CreateCatalog) => {
  return http.post('/catalog', createNewCatalogObj)
}

const deleteCatalog = (deleteObj: GetRootCatalog) => {
  return http.delete('/catalog', deleteObj)
}
export default {
  getCatalogList,
  getRootCatalog,
  getCatalogBreadCrumb,
  createNewCatalog,
  deleteCatalog
}