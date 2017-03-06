/**
 * Created by exialym on 2017/3/5.
 */
import * as threeDFigure from './threeDimensionalFigure'
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
        name: '北京',
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
  let myChart = echarts.init(document.getElementById('parallel'));
  myChart.setOption(option);
  myChart.on('axisareaselected', function () {
    var series = myChart.getModel().getSeries()[0];
    var indices = series.getRawIndicesByActiveState('active');
    threeDFigure.choosePoints(indices);
  });
};
let parallelView = {
  init:init,
};
module.exports = parallelView;