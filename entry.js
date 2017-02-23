/**
 * Created by exialym on 2017/2/6.
 */
import Detector from './lib/three/Detector'
if (!(/firefox/.test(navigator.userAgent.toLowerCase())||/webkit/.test(navigator.userAgent.toLowerCase()))||!Detector.webgl) {
  $('#warning').modal();
}
import './lib/three/TrackballControls'
import './lib/three/TypedArrayUtils'
import utils from './modules/utils'
import * as threeDFigure from './modules/threeDimensionalFigure'
import * as fileReader from './modules/file2data'


window.relatedPointsNum = 100;
window.threepositions = new Float32Array([]);
window.beginTSNE = 0;//0:停止；1：进行；2：暂停





$(document).ready(function () {
  let $relatedNumSlider = $('#relatedNumSlider');
  let $relatedNumLabel = $('#relatedNumLabel');
  let $beginTSNE = $('#beginTSNE');
  let $chooseFile = $('#chooseFile');
  let $rawData = $('#rawData');
  let $clearFile = $('#clearFile');
  let $DataSourceLabel = $('#DataSourceLabel');
  let rawData = [];
  $('#wait').on('shown.bs.modal', function () {
    console.log('test modal');
  });
  //utils.showWaitingModel('shown.bs.modal', 'Test');



  //threeDFigure.init(rawData);
  $relatedNumSlider.slider({
    min: 5,
    max: window.particleNum,
    step: 1,
    value: window.relatedPointsNum,
    orientation: 'horizontal',
    range: 'min',
    change:function () {
      window.relatedPointsNum = $relatedNumSlider.slider( "value" );
      $relatedNumLabel.val(window.relatedPointsNum);
      threeDFigure.displayNearest();
    }
  });
  $relatedNumLabel.val(window.relatedPointsNum);
  $relatedNumLabel.bind('change', function () {
    let number = Number($relatedNumLabel.val());
    if (isNaN(number))
      return;
    number = number > Number(window.particleNum) ? Number(window.particleNum) : number;
    window.relatedPointsNum = number;
    $relatedNumSlider.slider( "value" , window.relatedPointsNum);
    $relatedNumLabel.val(window.relatedPointsNum);
    threeDFigure.displayNearest();
  });
  $beginTSNE.bind('click',function () {
    if (window.beginTSNE==0) {
      window.beginTSNE = 1;
      threeDFigure.init(rawData);
      $relatedNumSlider.slider( "value" , window.relatedPointsNum);
      $relatedNumLabel.val(window.relatedPointsNum);
      $beginTSNE.html('pause');
    } else if (window.beginTSNE==1){
      window.beginTSNE = 2;
      $beginTSNE.html('continue');
    } else {
      window.beginTSNE = 1;
      $beginTSNE.html('pause');
    }
  });
  $chooseFile.bind('click',function () {
    $rawData.click();
  });
  $rawData.bind('change', function (e) {
    utils.showWaitingModel('shown.bs.modal', 'Analysing Your File, Please Wait.', function () {
      console.log('readfile modal');
      let files = e.target.files;
      if (files.length) {
        $beginTSNE.attr('disabled','disabled');
        let file = files[0];
        let reader = new FileReader();//new一个FileReader实例
        reader.onload = function() {
          let res = fileReader.readRawFile(this.result);
          if (res.isValid) {
            rawData = res.data;
            window.beginTSNE = 0;
            $DataSourceLabel.html('Source:' + file.name);
            $beginTSNE.html('begin');
            document.getElementById( 'tSNEState' ).innerHTML = '';
            $beginTSNE.removeAttr('disabled');
            utils.toggleWaitingButtons(true);
            utils.changeWaitingTips('Success, You Can Use Your File Now.');
          } else {
            utils.toggleWaitingButtons(true);
            utils.changeWaitingTips(res.error);
            $beginTSNE.removeAttr('disabled');
          }
        };
        reader.onerror = function() {
          utils.toggleWaitingButtons(true);
          utils.changeWaitingTips('Something Wrong with Your File.');
          $beginTSNE.removeAttr('disabled');
        };
        reader.readAsText(file);
      }
    });
  });
  $clearFile.bind('click',function () {
    $rawData.val('');
    window.beginTSNE = 0;
    $DataSourceLabel.html('Source:example data');
    $beginTSNE.html('begin');
    $beginTSNE.removeAttr('disabled');
    document.getElementById( 'tSNEState' ).innerHTML = '';
  });



});









