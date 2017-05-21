/**
 * Created by exialym on 2017/3/5.
 */
import eventDispatcher from './event'

let myChart;
let saveTimeId;
let init = function (data) {
  myChart = echarts.init(document.getElementById('parallel'));
  let parallelAxis = [];
  for (let i = 0;i < data[0].length;i++) {
    parallelAxis.push({dim: i, name: window.colName[i]});
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
        opacity: 0.02
      }
    },
    parallel: {
      left: 10,
      right: 10,
      bottom: 10,
      top:20,
      axisExpandable: false,
      axisExpandCenter: 15,
      axisExpandCount: 10,
      axisExpandWidth: 100,
      parallelAxisDefault: {
        type: 'value',
        name: 'parallelView',
        nameLocation: 'end',
        nameGap: 5,
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
          show: true,
        },
        axisLabel: {
          show:false,
          showMinLabel:true,
          formatter: function (value, index) {
            return value.toFixed(2);
          },
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
  //选中平行坐标中的数据触发的事件
  myChart.on('axisareaselected', function () {
    clearTimeout(saveTimeId);
    saveTimeId = setTimeout(dataSelect,500);
    // myChart.setOption({
    //   visualMap: [
    //     {
    //       show:false,
    //       dimension: data[0].length-1,
    //       selected: {
    //         0: false,
    //       },
    //       categories: [0,1],
    //       inRange: {
    //         color:"#577ceb",
    //         opacity: 1
    //       },
    //       outOfRange: {
    //         color: '#577ceb',
    //         opacity: 1
    //       }
    //     }
    //   ],
    // });

  });
};
function dataSelect() {
  let series = myChart.getModel().getSeries()[0];
  let indices = series.getRawIndicesByActiveState('active');
  eventDispatcher.emit('choose',indices,'parallel');
}
//高亮其他视图中选中的数据
let highLightData = function(indexes,view) {

  if (view==='parallel') return;
  console.time("parallel,highLightData:");
  let data = window.rawData;
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
          opacity: 0.02
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
            opacity: 1
          }
        },
        blendMode: 'lighter',
        data: data
      }
    ]
  });
  for (let i = 0; i < data.length;i++) {
    data[i].pop();
  }
  console.timeEnd("parallel,highLightData:");
};
let parallelView = {
  init:init,
  highLightData:highLightData,
};
eventDispatcher.on('choose',highLightData);
module.exports = parallelView;