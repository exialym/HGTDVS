/**
 * Created by exialym on 2017/5/18 0018.
 */
import * as utils from './utils'
import eventDispatcher from './event'
let canvas;
let ctx;
let canvasWidth;
let canvasHeight;
let colors = utils.colorMap;
let timeLine;
let beginPosition;
let endPosition;
let canvasFont = "12px serif";
let labelLength = 0;
let lastHover;

function TimeLine () {
  let $canvasContainer =  $(".canvasContainer");
  let $timeLine = $(".timeLine");
  let obj = {};

  for (let i = 0; i < window.date.length;i++) {
    if (obj[window.date[i]]) {
      obj[window.date[i]].push(i);
    } else {
      obj[window.date[i]] = [i];
    }
  }
  //this.dateObj = obj;
  this.dateList = Object.keys(obj).sort();
  this.num = this.dateList.length;
  this.nodes = {};
  $canvasContainer.height($timeLine.height());
  $canvasContainer.width($timeLine.width());

  canvas = document.getElementById("timeLineCanvas");
  ctx = canvas.getContext("2d");
  canvasWidth = $canvasContainer.width();
  canvasHeight = $canvasContainer.height();
  canvas.setAttribute('height', canvasHeight);
  canvas.setAttribute('width', canvasWidth);
  canvasHeight--;
  canvasWidth--;
  this.nodeWidth = canvasWidth/this.num;
  labelLength = this.dateList[0].length*5;
  for (let i = 0; i < this.dateList.length;i++) {
    this.nodes[this.dateList[i]] = new TimeNode(this.dateList[i],i*this.nodeWidth,obj[this.dateList[i]],obj[this.dateList[i]]);
  }
  canvas.onmousedown = function(ev) {
    let ev1=ev || window.event;
    beginPosition = ev1.clientX+canvas.offsetLeft;


    canvas.onmouseup = function(ev){
      let ev1 = ev || window.event;
      endPosition = ev1.clientX-canvas.offsetLeft;
      let indexes = [];
      let nodes = {};
      for(let date in timeLine.nodes){
        if (timeLine.nodes.hasOwnProperty(date)) {
          timeLine.nodes[date].setDataValid([]);
        }
      }
      for(let date in timeLine.nodes){
        if (timeLine.nodes.hasOwnProperty(date)) {
          if (timeLine.nodes[date].position>beginPosition&&timeLine.nodes[date].position+timeLine.nodeWidth<endPosition) {
            timeLine.nodes[date].setDataValid(timeLine.nodes[date].data);
            indexes = indexes.concat(timeLine.nodes[date].data);
          }
        }
      }
      drawTimeNode();
      eventDispatcher.emit('choose',indexes,'time');
      canvas.onmouseup = null;
    };

  };
  canvas.onmousemove = function(ev){
    let ev1 = ev || window.event;
    let mousePosition = [ev1.offsetX,ev1.offsetY,ev1.offsetX+$(ev1.target).offset().left,ev1.offsetY+$(ev1.target).offset().top];
    if (lastHover&&lastHover.position<mousePosition[0]&&lastHover.position+timeLine.nodeWidth>mousePosition[0]) {
      utils.showTipBox(mousePosition[2],mousePosition[3]-40,lastHover.time);
    } else {
      for(let date in timeLine.nodes){
        if (timeLine.nodes.hasOwnProperty(date)) {
          if (timeLine.nodes[date].position<mousePosition[0]&&timeLine.nodes[date].position+timeLine.nodeWidth>mousePosition[0]) {
            utils.showTipBox(mousePosition[2],mousePosition[3]-40,date);
            if (lastHover)
              eventDispatcher.emit('hover',lastHover.dataValid,false,'time');
            eventDispatcher.emit('hover',timeLine.nodes[date].dataValid,true,'time');
            lastHover = timeLine.nodes[date];
            break;
          }
        }
      }
    }

  };
  canvas.onmouseout = function(ev){
    if (lastHover)
      eventDispatcher.emit('hover',lastHover.dataValid,false,'time');
    lastHover = null;
    utils.hideTipBox();
  };



}
function drawTimeNode() {
  lastHover = null;
  let lastTextPosition = -labelLength;
  ctx.clearRect(0,0,canvasWidth,canvasHeight);
  let max = 0;
  let keys = Object.keys(timeLine.nodes).sort();
  for (let i = 0; i < keys.length;i++) {
    if (timeLine.nodes[keys[i]].num>max) max = timeLine.nodes[keys[i]].num;
  }



  for (let i = 0; i < keys.length;i++) {
    if (timeLine.nodes[keys[i]].num===0) continue;
    let colorIndex = parseInt(timeLine.nodes[keys[i]].num/max*100);
    ctx.fillStyle = colors[colorIndex===100?99:colorIndex];
    ctx.fillRect(timeLine.nodes[keys[i]].position,0,timeLine.nodeWidth,canvasHeight-12);
    ctx.font = canvasFont;
    if (timeLine.nodes[keys[i]].position>lastTextPosition) {
      ctx.strokeText(keys[i], timeLine.nodes[keys[i]].position, canvasHeight, labelLength);
      lastTextPosition = timeLine.nodes[keys[i]].position + labelLength;
    }

  }

  // ctx.fillStyle = "green";
  // ctx.fillRect(1, 1, canvasWidth-1, canvasHeight-1);
}
function chooseNode(indexes,view) {

  if (view==='time') return;
  console.time("Time,chooseNode:");
  if (indexes.length===0)  {
    for(let date in timeLine.nodes){
      if (timeLine.nodes.hasOwnProperty(date)) {
        timeLine.nodes[date].setDataValid(timeLine.nodes[date].data);
      }
    }
  } else {
    let nodes = {};
    let temp= {};
    for (let i = 0; i < indexes.length;i++) {
      let date = window.date[indexes[i]];
      if (temp[date]) temp[date].push(indexes[i]);
      else temp[date] = [indexes[i]];
    }
    for(let date in timeLine.nodes){
      if (timeLine.nodes.hasOwnProperty(date)) {
        timeLine.nodes[date].setDataValid([]);
      }
    }
    let dates = Object.keys(temp);
    for (let i = 0; i < dates.length;i++) {
      timeLine.nodes[dates[i]].setDataValid(temp[dates[i]]);
    }

  }
  drawTimeNode();
  console.timeEnd("Time,chooseNode:");
}
function TimeNode(time,position,data,dataValid) {
  this.time = time;
  this.position = position;
  this.data = data;
  if (dataValid) {
    this.dataValid = dataValid;
    this.num = dataValid.length;
  }

}
TimeNode.prototype.setDataValid = function (dataValid) {
  this.dataValid = dataValid;
  this.num = dataValid.length;
};
function init(dateList) {
  timeLine = new TimeLine(dateList);
  drawTimeNode();
}
eventDispatcher.on('choose',chooseNode);
module.exports = {
  init:init,
};