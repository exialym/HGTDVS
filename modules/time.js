/**
 * Created by exialym on 2017/5/18 0018.
 */
import * as utils from './utils'
let canvas;
let ctx;
let canvasWidth;
let canvasHeight;
let colors = utils.colorMap;
let timeLine;

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
function chooseNode(indexes) {
  let nodes = [];
  for (let i = 0; i < indexes.length;i++) {

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
module.exports = {
  init:init,
}