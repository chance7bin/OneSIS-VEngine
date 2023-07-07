class SingleValueRender {
  constructor(map) {
    this.map = map
    console.log(this.map)
  }

  singleValueRenderEntry(options) {
    console.log(this.map)
    switch (options.layerType) {
      case 'MULTIPOLYGON':
        return this.polygonSingleValueRender(options)
      case "MULTILINESTRING":
        return this.polylineSingleValueRender(options)
      case "POINT":
        return this.pointSingleValueRender(options)
    }
  }

  polygonSingleValueRender(options) {
    const layout = options.layerOptions.layout
    const paint = options.layerOptions.paint
    const layerId = options.layerId
    Object.keys(layout).forEach(key => {
      this.map.setLayoutProperty(layerId, key, layout[key])
    })
    this.map.setPaintProperty(layerId, 'fill-color', options.singleColor)
    Object.keys(paint).forEach(key => {
      this.map.setPaintProperty(layerId, key, paint[key])
    })
  }

  polylineSingleValueRender(options) {
    const { layerId, singleColor, layerOptions } = options
    const layout = layerOptions.layout
    const paint = layerOptions.paint
    Object.keys(layout).forEach(key => {
      this.map.setLayoutProperty(layerId, key, layout[key])
    })
    this.map.setPaintProperty(layerId, 'line-color', singleColor)
    Object.keys(paint).forEach(key => {
      this.map.setPaintProperty(layerId, key, paint[key])
    })
  }
  pointSingleValueRender(options) {
    const { layerId, singleColor, layerOptions } = options
    const layout = layerOptions.layout
    const paint = layerOptions.paint
    Object.keys(layout).forEach(key => {
      this.map.setLayoutProperty(layerId, key, layout[key])
    })
    this.map.setPaintProperty(layerId, 'circle-color', singleColor)
    Object.keys(paint).forEach(key => {
      this.map.setPaintProperty(layerId, key, paint[key])
    })
  }

}

export default SingleValueRender

// const options = {
//   layerType: '',
//   layerId: '',
//   singleColor: '',
//   layerOptions: {
//     layout: {
//       visibility: 'none'
//     },
//     paint: {
//       'fill-opacity': 0.5,
//       'fill-outline-color': '#ff0000'
//     }
//   },
// }