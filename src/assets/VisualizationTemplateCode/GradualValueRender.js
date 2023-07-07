class GradualValueRender {
  constructor(map) {
    this.map = map
    this.colorRampList = [
      {
        name: 'gradual_ramp1',
        ramp: {
          start:
          {
            R: 254,
            G: 240,
            B: 217
          },
          end: {
            R: 179,
            G: 0,
            B: 0
          }
        }
      },
      {
        name: 'gradual_ramp2',
        ramp: {
          start: {
            R: 237,
            G: 248,
            B: 251
          },
          end: {
            R: 0,
            G: 109,
            B: 44
          }
        }
      },
      {
        name: 'gradual_ramp3',
        ramp: {
          start: {
            R: 237,
            G: 248,
            B: 251
          },
          end: {
            R: 129,
            G: 15,
            B: 124
          }
        }
      },
      {
        name: 'gradual_ramp4',
        ramp: {
          start: {
            R: 241,
            G: 238,
            B: 246
          },
          end: {
            R: 4,
            G: 90,
            B: 141
          }
        }
      },
      {
        name: 'gradual_ramp5',
        ramp: {
          start: {
            R: 241,
            G: 238,
            B: 246
          },
          end: {
            R: 152,
            G: 0,
            B: 67
          }
        }
      },
      {
        name: 'gradual_ramp6',
        ramp: {
          start: {
            R: 254,
            G: 235,
            B: 226
          },
          end: {
            R: 122,
            G: 1,
            B: 119
          }
        }
      }
    ]
  }

  gradualValueRenderEntry(options) {
    switch (options.layerType) {
      case 'MULTIPOLYGON':
        return this.polygonGradualValueRender(options)
      case 'MULTILINESTRING':
        return this.polylineGradualValueRender(options)
      case 'POINT':
        return this.pointGradualValueRender(options)
    }
  }

  polygonGradualValueRender(options) {
    const { layerId, renderField, uniqueValues, colorRamp, layerOptions } = options
    const layout = layerOptions.layout
    const paint = layerOptions.paint
    const colorRampArray = this.getColorRampArray(colorRamp, uniqueValues.length)
    const paintExpressionArr = new Array()
    paintExpressionArr.push('case')

    for (let i = 0; i < uniqueValues.length; i++) {
      paintExpressionArr.push(['==', ['get', renderField], uniqueValues[i]])
      paintExpressionArr.push(colorRampArray[i])
    }
    paintExpressionArr.push('#000000')
    console.log(paintExpressionArr)
    Object.keys(layout).forEach(key => {
      this.map.setLayoutProperty(layerId, key, layout[key])
    })
    Object.keys(paint).forEach(key => {
      this.map.setPaintProperty(layerId, key, paint[key])
    })
    this.map.setPaintProperty(layerId, 'fill-color', paintExpressionArr)
  }

  polylineGradualValueRender(options) {
    const { layerId, renderField, uniqueValues, colorRamp, layerOptions } = options
    const layout = layerOptions.layout
    const paint = layerOptions.paint
    const colorRampArray = this.getColorRampArray(colorRamp, uniqueValues.length)
    const paintExpressionArr = new Array()
    paintExpressionArr.push('case')
    for (let i = 0; i < uniqueValues.length; i++) {
      paintExpressionArr.push(['==', ['get', renderField], uniqueValues[i]])
      paintExpressionArr.push(colorRampArray[i])
    }
    paintExpressionArr.push('#000000')
    Object.keys(layout).forEach(key => {
      this.map.setLayoutProperty(layerId, key, layout[key])
    })
    Object.keys(paint).forEach(key => {
      this.map.setPaintProperty(layerId, key, paint[key])
    })
    this.map.setPaintProperty(layerId, 'line-color', paintExpressionArr)
  }

  pointGradualValueRender(options) {
    const { layerId, renderField, uniqueValues, colorRamp, layerOptions } = options
    const layout = layerOptions.layout
    const paint = layerOptions.paint
    const colorRampArray = this.getColorRampArray(colorRamp, uniqueValues.length)
    const paintExpressionArr = new Array()
    paintExpressionArr.push('case')
    for (let i = 0; i < uniqueValues.length; i++) {
      paintExpressionArr.push(['==', ['get', renderField], uniqueValues[i]])
      paintExpressionArr.push(colorRampArray[i])
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

  getColorRampArray(colorRamp, uniqueValueNum) {
    const gradualRamp = this.colorRampList.find(ramp => ramp.name === colorRamp).ramp
    if (uniqueValueNum <= 2) {
      return [`rgb(${gradualRamp.start.R}, ${gradualRamp.start.G}, ${gradualRamp.start.B})`, `rgb(${gradualRamp.end.R}, ${gradualRamp.end.G}, ${gradualRamp.end.B})`]
    } else {

      const startR = gradualRamp.start.R
      const startG = gradualRamp.start.G
      const startB = gradualRamp.start.B

      const endR = gradualRamp.end.R
      const endG = gradualRamp.end.G
      const endB = gradualRamp.end.B

      const stepR = ((endR - startR) / (uniqueValueNum - 1)).toFixed(6)
      const stepG = ((endG - startG) / (uniqueValueNum - 1)).toFixed(6)
      const stepB = ((endB - startB) / (uniqueValueNum - 1)).toFixed(6)

      const colorRampArray = []
      for (let i = 0; i < uniqueValueNum - 1; i++) {
        colorRampArray.push(`rgb(${startR + stepR * i}, ${startG + stepG * i}, ${startB + stepB * i})`)
      }
      colorRampArray.push(`rgb(${endR}, ${endG}, ${endB})`)
      return colorRampArray

      // const startInt = parseInt(gradualRamp.start, 16)
      // const endInt = parseInt(gradualRamp.end, 16)
      // const step = (endInt - startInt) / (uniqueValueNum - 1)
      // const colorRampArray = []
      // for (let i = 0; i < uniqueValueNum - 1; i++) {
      //   let hexColor = parseInt(startInt + step * i).toString(16)
      //   if (hexColor.length === 5) {
      //     hexColor = '0' + hexColor
      //   }
      //   const color = '#' + hexColor
      //   colorRampArray.push(color)
      // }
      // colorRampArray.push('#' + gradualRamp.end)
      // return colorRampArray
    }
  }

}
// const a = 'eb'
// console.log(parseInt(a, 16))

export default GradualValueRender
