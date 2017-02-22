/**
 * Created by exialym on 2017/2/22.
 */
let utils = {};
utils.showWaitingModel = function(event, tips, callback) {
  $('#wait').off(event);
  $('#wait .waitTips').html(tips);
  $('#wait .waitButton').hide();
  $('#wait').on(event,callback);
  $('#wait').modal({backdrop: 'static', keyboard: false});
};
utils.changeWaitingTips = function (tips) {
  $('#wait .waitTips').html(tips);
};
utils.toggleWaitingButtons = function (isShown) {
  if (isShown)
    $('#wait .waitButton').show();
  else
    $('#wait .waitButton').hide();
};
utils.closeWaitingModel = function () {
  $('#wait').modal('hide');
};
module.exports = utils;