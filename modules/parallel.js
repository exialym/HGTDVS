/**
 * Created by exialym on 2017/3/5.
 */
// Schema:
// date,AQIindex,PM2.5,PM10,CO,NO2,SO2
let init = function () {
  var parallelAxis = [];
  for (var i = 0;i < window.rawData[0].length;i++) {
    parallelAxis.push({dim: i, name: i});
  }

  var lineStyle = {
    normal: {
      width: 1,
      opacity: 0.5
    }
  };

  var option = {
    backgroundColor: '#333',
    parallelAxis: parallelAxis,
    parallel: {
      left: 0,
      right: 1,
      bottom: 20,
      top:20,
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
        lineStyle: lineStyle,
        data: window.rawData
      }
    ]
  };
  var myChart = echarts.init(document.getElementById('parallel'));
  myChart.setOption(option);
};
let parallelView = {
  init:init,
}
module.exports = parallelView;