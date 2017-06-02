/**
 * Created by exialym on 2017/2/22.
 */
let utils = {};
let $wait = $('#wait');
let $waitTips = $wait.find('.waitTips');
let $waitButton = $wait.find('.waitButton');
let $waitLoader = $wait.find('.loading');
let $waitWarning = $wait.find('.waitWarning');
let $waitOK = $wait.find('.waitOK');
let $tipBox = $('.tipBox');
utils.showWaitingModel = function(event, tips, model, callback) {
  $wait.off(event);
  $waitTips.html(tips);
  utils.switchMod(model);
  $wait.on(event,callback);
  $wait.modal({backdrop: 'static', keyboard: false});
};
utils.changeWaitingTips = function (tips) {
  $waitTips.html(tips);
};
utils.closeWaitingModel = function () {
  $wait.modal('hide');
};
utils.switchMod = function (model) {
  switch (model) {
    case 'Warning':
      $waitButton.show();
      $waitLoader.hide();
      $waitWarning.show();
      $waitOK.hide();
      break;
    case 'OK':
      $waitButton.show();
      $waitLoader.hide();
      $waitWarning.hide();
      $waitOK.show();
      break;
    case 'Processing':
      $waitButton.hide();
      $waitLoader.show();
      $waitWarning.hide();
      $waitOK.hide();
      break;
    default:
      $waitButton.hide();
      $waitLoader.show();
      $waitWarning.hide();
      $waitOK.hide();
  }
};
utils.colorMap = generateColorMap();
utils.showTipBox = function (x,y,text) {
  $tipBox.css({left:x+'px',top:y+'px'});
  $tipBox.html(text);
  $tipBox.show();
};
utils.hideTipBox = function () {
  $tipBox.hide();
};
module.exports = utils;




function generateColorMap() {
  let colors = gradientColor([0,255,0],[255,255,0],50);
  colors  = colors.concat(gradientColor([255,255,0],[255,0,0],50));
  return colors;
}

function gradientColor(startRGB,endRGB,step){

  let startR = startRGB[0];
  let startG = startRGB[1];
  let startB = startRGB[2];

  let endR = endRGB[0];
  let endG = endRGB[1];
  let endB = endRGB[2];

  let sR = (endR-startR)/step;//总差值
  let sG = (endG-startG)/step;
  let sB = (endB-startB)/step;

  let colorArr = [];
  for(let i=0;i<step;i++){
    //计算每一步的hex值
    let hex = 'rgb('+parseInt((sR*i+startR))+','+parseInt((sG*i+startG))+','+parseInt((sB*i+startB))+')';
    colorArr.push(hex);
  }
  return colorArr;
}