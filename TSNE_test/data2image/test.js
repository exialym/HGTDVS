/**
 * Created by exialym on 2017/5/7.
 */
let colorIndex = 0;
let $rawData = $('#rawData');
let $chooseFile = $('#chooseFile');
$chooseFile.bind('click',function () {
  $rawData.click();
});
$rawData.bind('change', function (e) {

    let files = e.target.files;
    if (files.length) {
      let file = files[0];
      let reader = new FileReader();//new一个FileReader实例
      reader.onload = function() {
        let res = linedata(this.result);
        let myChart = echarts.init(document.getElementById('mydata'));
        lineOption.xAxis.data = [];
        lineOption.legend.data = lineOption.legend.data.concat(res.legend);
        for (let i = 0;i < res.data.length;i++) {
          lineOption.series.push({
            name:res.legend[i],
            type:'line',
            data:res.data[i],
            itemStyle:{
              normal:{
                color:lineOption.color[colorIndex]
              }
            }
          })
        }
        for (let i = 0;i < res.data[0].length;i++) {
          lineOption.xAxis.data.push(i+1);
        }
        colorIndex++;
        myChart.setOption(lineOption);
      };
      reader.readAsText(file);
    }

});
function linedata(txt) {
  let res = {
    isValid:true,
    error:'',
    data:[],
    legend:[],
  };
  txt = txt.replace(/\t\r\n/g,"\t\n");
  let lines = txt.split("\t\n");
  let data = [];
  let legend = [];
  for(let i = 0;i < lines.length;i++) {
    let row = lines[i];
    let cells = row.split('\t');
    for(let j = 2;j < cells.length;j++) {
      if (i===0) {
        legend.push(cells[j]+colorIndex);
        data.push([]);
      } else {
        data[j-2].push(cells[j]);
      }
    }
  }
  res.data = data;
  res.legend = legend;
  return res;
}
let lineOption = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value',
    min:'dataMin',
    max:'dataMax',
  },
  series: [],
  color:['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
};