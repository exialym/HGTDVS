/**
 * Created by exialym on 2017/5/7.
 */
// // MNIST fake
// let ST_SNE = ['',97.52,97.36,97.31,97.16,97.13,97.12,97.06,97.04,97.04,97.05];
// let BH_SNE = ['',97.42,97.17,97.05,97.00,96.86,96.81,96.79,96.79,96.77,96.72];
// // MNIST real
// let ST_SNE = ['',97.48,97.31,97.21,97.10,97.06,97.04,97.01,96.99,96.98,96.97];
// let BH_SNE = ['',97.54,97.31,97.18,97.11,97.04,97.00,96.97,96.94,96.93,96.91];
// // letter_UCI
// let ST_SNE = ['',93.95,92.35,90.91,90.06,88.85,87.90,86.95,85.01,83.50,81.75];
// let BH_SNE = ['',94.01,92.14,90.79,89.34,88.15,87.16,85.96,83.28,81.47,79.58];
// // USPS
// let ST_SNE = ['',97.49,97.25,96.99,96.98,96.99,96.98,96.98,96.98,96.98,96.96];
// let BH_SNE = ['',97.17,96.84,96.65,96.62,96.59,96.58,96.55,96.46,96.42,96.22];
// // COIL-20 avg
// let ST_SNE = ['',97.06,93.71,91.70,90.29,88.75,87.11,85.25,84.11,83.21,82.72];
// let BH_SNE = ['',97.79,94.72,92.44,90.84,89.29,87.75,85.75,84.54,83.49,82.73];
// COIL-20 sp
let ST_SNE = ['',97.70,96.18,94.93,94.23,92.50,90.97,89.44,87.43,86.87,86.66];
let BH_SNE = ['',97.84,96.04,94.79,93.88,92.29,90.13,88.81,87.15,85.13,84.37];
// //MNIST
// let ST_SNE = ['',10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00];
// let BH_SNE = ['',10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00];
// //MNIST
// let ST_SNE = ['',10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00];
// let BH_SNE = ['',10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00];
let myChart = echarts.init(document.getElementById('mydata'));
let lineOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['ST-SNE','BH-SNE']
    },
    toolbox: {
        show: true,
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
        }
    },
    xAxis:  {
        type: 'category',
        boundaryGap: false,
        data: ['0','10','20','30','40','50','60','70','80','90','100']
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value} %'
        },
        scale:true,
        // min:function(value) {
        //     return value.min - 2;
        // },
        // max:function(value) {
        //     return value.max + 2;
        // },
    },
    series: [
        {
            name:'ST-SNE',
            type:'line',
            data:ST_SNE,
            label: {
                normal: {
                    show: true,
                    position:'top'
                }
            },
            lineStyle:{
                normal:{
                    color:'#7CB5EC'
                }
            },
            itemStyle:{
                normal:{
                    color:'#7CB5EC'
                }
            }
        },
        {
            name:'BH-SNE',
            type:'line',
            data:BH_SNE,
            label: {
                normal: {
                    show: true,
                    position:'bottom'
                }
                
            },
            lineStyle:{
                normal:{
                    color:'#F7A35C'
                }
            },
            itemStyle:{
                normal:{
                    color:'#F7A35C'
                }
            }
        },
    ]
};
myChart.setOption(lineOption);
