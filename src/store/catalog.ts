import { defineStore } from 'pinia'

export const useCatalogStore = defineStore('catalog', {
  state: () => {
    return {
      rootCatalog: null as any,
      currentCatalogId: '',
      breadcrumb: [] as any
    }
  },
  actions: {
    setRootCatalog(catalog: any) {
      this.rootCatalog = catalog
    },
    updateCurrentCatalogId(currentCatalogId: string) {
      this.currentCatalogId = currentCatalogId
    },
    setBreadCrumb(breadcrumbData: any) {
      this.breadcrumb = breadcrumbData
    },
    initCatalog() {
      this.rootCatalog = null
      this.currentCatalogId = ''
      this.breadcrumb = []
    }
  }
})