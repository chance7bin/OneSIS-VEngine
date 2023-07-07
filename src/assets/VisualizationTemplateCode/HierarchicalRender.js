class HierarchicalRender {
  constructor(map) {
    this.map = map
    this.colorRampList = [
      {
        name: 'ramp1',
        type: 'random',
        colors: []
      },
      {
        name: 'ramp2',
        type: 'diy',
        colors: [
          {
            R: 255,
            G: 0,
            B: 0
          },
          {
            R: 0,
            G: 255,
            B: 0
          },
          {
            R: 0,
            G: 0,
            B: 255
          }
        ]
      }
    ]
  }

  hierarchicalRenderEntry(options) {
    switch (options.layerType) {
      case 'MULTIPOLYGON':
        return this.polygonHierarchicalRender(options)
      case 'MULTILINESTRING':
        return this.polylineHierarchicalRender(options)
      case 'POINT':
        return this.pointHierarchicalRender(options)
    }
  }

  polygonHierarchicalRender(options) {
    const { layerId, renderField, uniqueValues, level, colorRamp, layerOptions } = options
    const layout = layerOptions.layout
    const paint = layerOptions.paint
    const colorRampArray = this.getColorRampArray(colorRamp, level)
    const paintExpressionArr = new Array()
    if (uniqueValues.length <= level) {
      paintExpressionArr.push('case')
      // paintExpressionArr.push(['get', renderField])
      for (let i = 0; i < uniqueValues.length; i++) {
        paintExpressionArr.push(['==', ['get', renderField], uniqueValues[i]])
        paintExpressionArr.push(colorRampArray[i])
      }
      paintExpressionArr.push('#000000')
    } else {
      const breakPointArr = this.getBreakPointArr(uniqueValues, level)
      paintExpressionArr.push('case')
      // paintExpressionArr.push(['get', renderField])
      for (let i = 0; i < level - 1; i++) {
        paintExpressionArr.push(['<', ['get', renderField], breakPointArr[i]])
        paintExpressionArr.push(colorRampArray[i])
      }
      paintExpressionArr.push(['<=', ['get', renderField], uniqueValues[uniqueValues.length - 1]])
      paintExpressionArr.push(colorRampArray[level - 1])
      paintExpressionArr.push('#000000')
    }
    console.log(paintExpressionArr)
    Object.keys(layout).forEach(key => {
      this.map.setLayoutProperty(layerId, key, layout[key])
    })
    Object.keys(paint).forEach(key => {
      this.map.setPaintProperty(layerId, key, paint[key])
    })
    this.map.setPaintProperty(layerId, 'fill-color', paintExpressionArr)
  }

  polylineHierarchicalRender(options) {
    if (options.hierarchicalMethod === "hierarchical_line-color") {
      this.polylineHierarchicalColorRender(options)
    } else {
      this.polylineHierarchicalLineWidthRender(options)
    }
  }

  polylineHierarchicalColorRender(options) {
    const { layerId, renderField, uniqueValues, colorRamp, level, layerOptions } = options
    const layout = layerOptions.layout
    const paint = layerOptions.paint
    const colorRampArray = this.getColorRampArray(colorRamp, level)
    const paintExpressionArr = new Array()
    const breakPointArr = this.getBreakPointArr(uniqueValues, level)
    const breakPoinIndextArr = this.getBreakPointArr2(uniqueValues, level)
    console.log(breakPoinIndextArr)
    paintExpressionArr.push('case')
    // paintExpressionArr.push(['get', renderField])
    for (let i = 0; i < breakPoinIndextArr.length - 1; i++) {
      for (let j = breakPoinIndextArr[i]; j < breakPoinIndextArr[i + 1]; j++) {
        // paintExpressionArr.push([uniqueValues[j], colorRampArray[i]])
        paintExpressionArr.push(['==', ['get', renderField], uniqueValues[j]])
        paintExpressionArr.push(colorRampArray[i])
      }
    }
    paintExpressionArr.push('#000000')
    Object.keys(layout).forEach(key => {
      this.map.setLayoutProperty(layerId, key, layout[key])
    })
    Object.keys(paint).forEach(key => {
      this.map.setPaintProperty(layerId, key, paint[key])
    })
    this.map.setPaintProperty(layerId, 'line-color', paintExpressionArr)
    // for (let i = 0; i < level - 1; i++) {
    //   paintExpressionArr.push(['<', ['get', renderField], breakPointArr[i]])
    //   paintExpressionArr.push(colorRampArray[i])
    // }
    // paintExpressionArr.push(['<=', ['get', renderField], uniqueValues[uniqueValues.length - 1]])
    // paintExpressionArr.push(colorRampArray[level - 1])
    // paintExpressionArr.push('#000000')
    // console.log(paintExpressionArr)
    // Object.keys(layout).forEach(key => {
    //   this.map.setLayoutProperty(layerId, key, layout[key])
    // })
    // Object.keys(paint).forEach(key => {
    //   this.map.setPaintProperty(layerId, key, paint[key])
    // })
    // this.map.setPaintProperty(layerId, 'line-color', paintExpressionArr)
  }
  polylineHierarchicalLineWidthRender(options) {
    const { layerId, renderField, uniqueValues, lineWidthRange, level, layerOptions } = options
  }

  pointHierarchicalRender(options) {
    if (options.hierarchicalMethod === "hierarchical_circle-color") {
      this.pointHierarchicalCircleColorRender(options)
    } else {
      this.pointHierarchicalCircleRadiusRender(options)
    }
  }

  /**
   * Renders color for a hierarchical circle based on given options.
   *
   * @param {Object} options - An object that contains render options.
   * @param {string} options.layerId - The ID of the layer.
   * @param {string} options.renderField - The field to be rendered.
   * @param {Array} options.uniqueValues - The unique values of the field.
   * @param {string} options.colorRamp - The color ramp used for rendering.
   * @param {number} options.level - The level of the rendering.
   * @param {Object} options.layerOptions - The options of the layer.
   * @param {Object} options.layerOptions.layout - The layout options of the layer.
   * @param {Object} options.layerOptions.paint - The paint options of the layer.
   *
   * @return {void}
   */
  pointHierarchicalCircleColorRender(options) {
    const { layerId, renderField, uniqueValues, colorRamp, level, layerOptions } = options
    const layout = layerOptions.layout
    const paint = layerOptions.paint
    const colorRampArray = this.getColorRampArray(colorRamp, level)
    const paintExpressionArr = new Array()
    const breakPoinIndextArr = this.getBreakPointArr2(uniqueValues, level)
    console.log(breakPoinIndextArr)
    paintExpressionArr.push('case')
    // paintExpressionArr.push(['get', renderField])
    for (let i = 0; i < breakPoinIndextArr.length - 1; i++) {
      for (let j = breakPoinIndextArr[i]; j < breakPoinIndextArr[i + 1]; j++) {
        // paintExpressionArr.push([uniqueValues[j], colorRampArray[i]])
        paintExpressionArr.push(['==', ['get', renderField], uniqueValues[j]])
        paintExpressionArr.push(colorRampArray[i])
      }
    }
    paintExpressionArr.push('#000000')
    console.log(paintExpressionArr)
    Object.keys(layout).forEach(key => {
      this.map.setLayoutProperty(layerId, key, layout[key])
    })
    Object.keys(paint).forEach(key => {
      this.map.setPaintProperty(layerId, key, paint[key])
    })
    this.map.setPaintProperty(layerId, 'circle-color', paintExpressionArr)
  }
  pointHierarchicalCircleRadiusRender(options) {
    const { layerId, renderField, uniqueValues, circleRadiusRange, level, layerOptions } = options
    const layout = layerOptions.layout
    const paint = layerOptions.paint
    const circleRadiusArr = this.getCircleRadiusArr(circleRadiusRange, level)
    const paintExpressionArr = new Array()
    const breakPoinIndextArr = this.getBreakPointArr2(uniqueValues, level)
    paintExpressionArr.push('case')
    for (let i = 0; i < breakPoinIndextArr.length - 1; i++) {
      for (let j = breakPoinIndextArr[i]; j < breakPoinIndextArr[i + 1]; j++) {
        paintExpressionArr.push(['==', ['get', renderField], uniqueValues[j]])
        paintExpressionArr.push(circleRadiusArr[i])
      }
    }
    paintExpressionArr.push(1)
    console.log(paintExpressionArr)
    Object.keys(layout).forEach(key => {
      this.map.setLayoutProperty(layerId, key, layout[key])
    })
    Object.keys(paint).forEach(key => {
      this.map.setPaintProperty(layerId, key, paint[key])
    })
    this.map.setPaintProperty(layerId, 'circle-radius', paintExpressionArr)
  }


  getColorRampArray(colorRamp, level) {
    const colorRampItem = this.colorRampList.find(ramp => ramp.name === colorRamp)
    let colorRampArr = new Array()
    if (colorRampItem.type === 'random') {
      for (let i = 0; i < level; i++) {
        colorRampArr.push(this.getRandomColor())
      }
    } else if (colorRampItem.type === 'diy') {

    }
    return colorRampArr
  }
  getCircleRadiusArr(circleRadiusRange, level) {
    const circleRadiusArr = new Array()
    const perNum = parseFloat(((circleRadiusRange[1] - circleRadiusRange[0]) / (level - 1)).toFixed(2))
    for (let i = 0; i < level - 1; i++) {
      circleRadiusArr.push(circleRadiusRange[0] + i * perNum)
    }
    circleRadiusArr.push(circleRadiusRange[1])
    console.log(circleRadiusArr)
    return circleRadiusArr
  }
  getRandomColor() {
    return '#' + Math.random().toString(16).slice(2, 8)
  }

  getBreakPointArr(uniqueValues, level) {
    const perNum = parseInt(uniqueValues.length / level)
    let remain = uniqueValues.length % level
    const breakPointArr = new Array()
    const tempArr = new Array()
    for (let i = 1; i <= level; i++) {
      if (remain > 0) {
        tempArr.push(perNum + 1)
        remain--
      } else {
        tempArr.push(perNum)
      }
    }
    console.log(tempArr)
    let index = 0
    for (let i = 0; i < tempArr.length - 1; i++) {
      index += tempArr[i]
      breakPointArr.push(uniqueValues[index])
    }
    console.log(breakPointArr)
    return breakPointArr
  }
  getBreakPointArr2(uniqueValues, level) {
    const perNum = parseInt(uniqueValues.length / level)
    let remain = uniqueValues.length % level
    const breakPointArr = new Array()
    const tempArr = new Array()
    for (let i = 1; i <= level; i++) {
      if (remain > 0) {
        tempArr.push(perNum + 1)
        remain--
      } else {
        tempArr.push(perNum)
      }
    }
    console.log(tempArr)
    let index = 0
    breakPointArr.push(index)
    for (let i = 0; i < tempArr.length; i++) {
      index += tempArr[i]
      breakPointArr.push(index)
    }
    console.log(breakPointArr)
    return breakPointArr
  }

}

export default HierarchicalRender