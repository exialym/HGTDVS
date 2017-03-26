/**
 * Created by exialym on 2017/3/5.
 */
import * as threeDFigure from './threeDimensionalFigure'
let myChart;
let init = function (data) {
  myChart = echarts.init(document.getElementById('parallel'));
  let parallelAxis = [];
  for (let i = 0;i < data[0].length;i++) {
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
        data: data
      }
    ]
  };
  myChart.setOption(option);
  myChart.on('axisareaselected', function () {
    myChart.setOption({
      visualMap: [
        {
          show:false,
          dimension: data[0].length-1,
          selected: {
            0: false,
          },
          categories: [0,1],
          inRange: {
            color:"#577ceb",
            opacity: 1
          },
          outOfRange: {
            color: '#577ceb',
            opacity: 1
          }
        }
      ],
    });
    let series = myChart.getModel().getSeries()[0];
    let indices = series.getRawIndicesByActiveState('active');
    threeDFigure.choosePoints(indices);
  });
};
let highLightData = function(dataRow,indexes) {
  let data = dataRow.concat();
  if (indexes.length===0) {
    for (let i = 0; i < data.length;i++) {
      data[i].push(1);
    }
  } else {
    for (let i = 0; i < data.length;i++) {
      data[i].push(0);
    }
  }

  for (let i = 0; i < indexes.length;i++) {
    data[indexes[i]].pop();
    data[indexes[i]].push(1);
  }
  myChart.setOption({
    visualMap: [
      {
        show:false,
        dimension: data[0].length-1,
        selected: {
          0: false,
        },
        categories: [0,1],
        inRange: {
          color:"#577ceb",
          opacity: 1
        },
        outOfRange: {
          color: '#b99e2a',
          opacity: 0.1
        }
      }
    ],
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
        data: data
      }
    ]
  });
};
let parallelView = {
  init:init,
  highLightData:highLightData,
};
module.exports = parallelView;