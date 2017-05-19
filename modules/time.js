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
  for (let i = 0; i < this.dateList.length;i++) {
    this.nodes[this.dateList[i]] = new TimeNode(this.dateList[i],i*this.nodeWidth,obj[this.dateList[i]]);
  }
  canvas.onmousedown = function(ev) {
    let ev1=ev || window.event;
    beginPosition = ev1.clientX-canvas.offsetLeft;
    // canvas.onmousemove = function(ev){
    //
    // };
    canvas.onmouseup = function(ev){
      let ev1 = ev || window.event;
      endPosition = ev1.clientX-canvas.offsetLeft;
      let indexes = [];
      let nodes = [];
      for(let date in timeLine.nodes){
        if (timeLine.nodes[date].position>beginPosition&&timeLine.nodes[date].position<endPosition) {
          nodes.push(timeLine.nodes[date]);
          indexes = indexes.concat(timeLine.nodes[date].dataValid);
        }
      }
      drawTimeNode(nodes);
      eventDispatcher.emit('choose',indexes,'time');
      //canvas.onmousemove = null;
      canvas.onmouseup = null;
    };

  }



}
function drawTimeNode(nodes) {
  ctx.clearRect(0,0,canvasWidth,canvasHeight);
  let max = 0;
  let keys = Object.keys(nodes)
  for (let i = 0; i < keys.length;i++) {
    if (nodes[keys[i]].num>max) max = nodes[keys[i]].num;
  }


  for (let i = 0; i < keys.length;i++) {
    if (nodes[keys[i]].num===0) continue;
    ctx.fillStyle = colors[parseInt(nodes[keys[i]].num/max*100)];
    ctx.fillRect(nodes[keys[i]].position,0,timeLine.nodeWidth,canvasHeight);
  }

  // ctx.fillStyle = "green";
  // ctx.fillRect(1, 1, canvasWidth-1, canvasHeight-1);
}
function chooseNode(indexes,view) {

  if (view==='time') return;
  if (indexes.length===0)  {
    drawTimeNode(timeLine.nodes);
  } else {
    let nodes = [];
    let temp= {};
    for (let i = 0; i < indexes.length;i++) {
      let date = window.date[indexes[i]];
      if (temp[date]) temp[date].push(indexes[i]);
      else temp[date] = [indexes[i]];
    }
    let dates = Object.keys(temp);
    for (let i = 0; i < dates.length;i++) {
      let newNode = new TimeNode(dates[i],timeLine.nodes[dates[i]].position,temp[dates[i]]);
      nodes.push(newNode);
    }
    drawTimeNode(nodes);
  }

}
function TimeNode(time,position,dataValid) {
  this.time = time;
  this.position = position;
  this.dataValid = dataValid;
  this.num = dataValid.length;
}
TimeNode.prototype.setData = function (dataValid) {
  this.dataValid = dataValid;
  this.num = dataValid.length;
};
function init(dateList) {
  timeLine = new TimeLine(dateList);
  drawTimeNode(timeLine.nodes);
}
eventDispatcher.on('choose',chooseNode);
module.exports = {
  init:init,
};