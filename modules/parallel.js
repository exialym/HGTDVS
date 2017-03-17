/**
 * Created by exialym on 2017/3/5.
 */
import * as threeDFigure from './threeDimensionalFigure'
let myChart = echarts.init(document.getElementById('parallel'));
let init = function () {
  let parallelAxis = [];
  for (let i = 0;i < window.rawData[0].length;i++) {
    parallelAxis.push({dim: i, name: i});
  }
  let option = {
    backgroundColor: '#333',
    parallelAxis: parallelAxis,
    brush: {
      geoIndex: 0,
      brushLink: 'all',
      inBrush: {
        opacity: 1
      },
      outOfBrush: {
        color: '#b99e2a',
        symbolSize: 4,
        opacity: 0.1
      }
    },
    parallel: {
      left: 0,
      right: 1,
      bottom: 20,
      top:20,
      axisExpandable: true,
      axisExpandCenter: 15,
      axisExpandCount: 10,
      axisExpandWidth: 100,
      parallelAxisDefault: {
        type: 'value',
        name: 'AQI指数',
        nameLocation: 'end',
        nameGap: 20,
        nameTextStyle: {
          color: '#fff',
          fontSize: 12
        },
        axisLine: {
          lineStyle: {
            color: '#aaa'
          }
        },
        axisTick: {
          lineStyle: {
            color: '#777'
          }
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#fff'
          }
        }
      }
    },
    series: [
      {
        name: 'dataPoints',
        type: 'parallel',
        smooth: true,
        lineStyle: {
          normal: {
            color: '#577ceb',
            width: 0.5,
            opacity: 0.6
          }
        },
        blendMode: 'lighter',
        data: window.rawData
      }
    ]
  };
  myChart.setOption(option);
  myChart.on('axisareaselected', function () {
    let series = myChart.getModel().getSeries()[0];
    let indices = series.getRawIndicesByActiveState('active');
    threeDFigure.choosePoints(indices);
  });
};
let highLightData = function(indexes) {
  console.log(indexes);
  myChart.dispatchAction({
    type: 'brush',
    areas: [ // areas 表示选框的集合，可以指定多个选框。
      { // 选框一：
        //geoIndex: 0, // 指定此选框属于 index 为 0 的 geo 坐标系。
                     // 也可以通过 xAxisIndex 或 yAxisIndex 来指定此选框属于直角坐标系。
                     // 如果没有指定，则此选框属于『全局选框』。不属于任何坐标系。
                     // 属于『坐标系选框』，可以随坐标系一起缩放平移。属于全局的选框不行。
        brushType: 'lineY', // 指定选框的类型。还可以为 'rect', 'lineX', 'lineY'
        range: [20,100]
      },
    ]
  });
};
let parallelView = {
  init:init,
  highLightData:highLightData,
};
module.exports = parallelView;