/**
 * Created by exialym on 2017/2/6.
 */
import Detector from './lib/three/Detector'
import utils from './modules/utils'
if (!(/firefox/.test(navigator.userAgent.toLowerCase())||/webkit/.test(navigator.userAgent.toLowerCase()))||!Detector.webgl) {
  utils.showWaitingModel('shown.bs.modal', 'Please Use Chrome or Firefox for better experience!', 'Warning');
}
import './lib/three/TrackballControls'
import * as threeDFigure from './modules/threeDimensionalFigure'
import * as fileReader from './modules/file2data'
import exampleRaw from './modules/example_data'
import parallelView from './modules/parallel'


window.relatedPointsNum = 100;
window.threepositions = new Float32Array([]);
window.beginTSNE = 0;//0:停止；1：进行；2：暂停
window.rawData = exampleRaw;




$(document).ready(function () {
  let $perplexitySlider = $('#perplexitySlider');
  let $learnRateSlider = $('#learnRateSlider');
  let $relatedNumSlider = $('#relatedNumSlider');
  let $relatedNumLabel = $('#relatedNumLabel');
  let $beginTSNE = $('#beginTSNE');
  let $chooseFile = $('#chooseFile');
  let $rawData = $('#rawData');
  let $clearFile = $('#clearFile');
  let $DataSourceLabel = $('#DataSourceLabel');

  //utils.showWaitingModel('shown.bs.modal', 'Please Use Chrome or Firefox for better experience!', 'Warning');
  //utils.showWaitingModel('shown.bs.modal', 'Use Chrome or Firefox for better experience!', 'Processing');
  //utils.showWaitingModel('shown.bs.modal', 'Please Use Chrome or Firefox for better experience!', 'OK');




  //threeDFigure.init(rawData);
  parallelView.init();
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
  $perplexitySlider.next().html(25);
  $perplexitySlider.slider({
    min: 2,
    max: 100,
    step: 1,
    value: 25,
    orientation: 'horizontal',
    range: 'min',
    change:function () {
      $perplexitySlider.next().html($perplexitySlider.slider( "value" ));
    }
  });
  $learnRateSlider.next().html(10);
  $learnRateSlider.slider({
    min: 0.001,
    max: 100,
    step: 0.001,
    value: 10,
    orientation: 'horizontal',
    range: 'min',
    change:function () {
      $learnRateSlider.next().html($learnRateSlider.slider( "value" ));
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
      threeDFigure.init();
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
    utils.showWaitingModel('shown.bs.modal', 'Analysing Your File, Please Wait.', 'Processing', function () {
      console.log('readfile modal');
      let files = e.target.files;
      if (files.length) {
        $beginTSNE.attr('disabled','disabled');
        let file = files[0];
        let reader = new FileReader();//new一个FileReader实例
        reader.onload = function() {
          let res = fileReader.readRawFile(this.result);
          if (res.isValid) {
            window.rawData = res.data;
            window.beginTSNE = 0;
            $DataSourceLabel.html('Source:' + file.name);
            $beginTSNE.html('begin');
            document.getElementById( 'tSNEState' ).innerHTML = '';
            $beginTSNE.removeAttr('disabled');
            utils.switchMod('OK');
            utils.changeWaitingTips('Success, You Can Use Your File Now.');
          } else {
            utils.switchMod('Warning');
            utils.changeWaitingTips(res.error);
            $beginTSNE.removeAttr('disabled');
          }
        };
        reader.onerror = function() {
          utils.switchMod('Warning');
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
    window.rawData = exampleRaw;
    $DataSourceLabel.html('Source:example data');
    $beginTSNE.html('begin');
    $beginTSNE.removeAttr('disabled');
    document.getElementById( 'tSNEState' ).innerHTML = '';
  });



});









