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
utils.changeDataList = function(indexes) {
  let html = "";
  for ( let i = 0; i < indexes.length; i ++ ) {
    html += "<li data-index='"+ indexes[i] +"'>"
      +"<span>"+ indexes[i] +"</span>"
      +"<button class='btn btn-xs'>detail</button>"
      +"</li>";
  }
  $(".dataList").html(html);
};
module.exports = utils;