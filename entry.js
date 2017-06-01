/**
 * Created by exialym on 2017/2/6.
 */
import utils from './modules/utils'

import './lib/three/TrackballControls'
import eventDispatcher from './modules/event'
import * as threeDFigure from './modules/threeDimensionalFigure'
import * as fileReader from './modules/file2data'
import * as exampleRaw from './modules/example_data'
import * as parallelView from './modules/parallel'
import * as mapView from './modules/map'
import * as dataView from './modules/data_detial'
import * as timeView from './modules/time'


window.relatedPointsNum = 100;
window.threepositions = new Float32Array([]);
window.beginTSNE = 0;//0:停止；1：进行；2：暂停
window.rawData = exampleRaw.data;
window.date = exampleRaw.date;
window.gps = exampleRaw.gps;
window.colName = exampleRaw.colName;




$(document).ready(function () {
  let $perplexitySlider = $('#perplexitySlider');
  let $learnRateSlider = $('#learnRateSlider');
  let $relatedNumSlider = $('#relatedNumSlider');
  let $relatedNumLabel = $('#relatedNumLabel');
  let $beginTSNE = $('#beginTSNE');
  let $chooseFile = $('#chooseFile');
  let $chooseEmbeddingFile = $('#chooseEmbeddingFile');
  let $rawData = $('#rawData');
  let $embeddingData = $('#embeddingData');
  let $clearFile = $('#clearFile');
  let $DataSourceLabel = $('#DataSourceLabel');



  //utils.showWaitingModel('shown.bs.modal', 'Please Use Chrome or Firefox for better experience!', 'Warning');
  //utils.showWaitingModel('shown.bs.modal', 'Use Chrome or Firefox for better experience!', 'Processing');
  //utils.showWaitingModel('shown.bs.modal', 'Please Use Chrome or Firefox for better experience!', 'OK');




  //threeDFigure.init();
  parallelView.init(window.rawData);
  mapView.initPoints();
  timeView.init();
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
    if (window.beginTSNE===0) {
      window.beginTSNE = 1;
      threeDFigure.init();
      $relatedNumSlider.slider( "value" , window.relatedPointsNum);
      $relatedNumLabel.val(window.relatedPointsNum);
      $beginTSNE.html('pause');
    } else if (window.beginTSNE===1){
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
  $chooseEmbeddingFile.bind('click',function () {
    $embeddingData.click();
  });
  $embeddingData.bind('change', function (e) {
    utils.showWaitingModel('shown.bs.modal', 'Analysing Your Embedding File, Please Wait.', 'Processing', function () {
      let files = e.target.files;
      if (files.length) {
        $beginTSNE.attr('disabled','disabled');
        let file = files[0];
        let reader = new FileReader();//new一个FileReader实例
        reader.onload = function() {
          let res = fileReader.readEmbeddingFile(this.result);
          if (res.isValid) {
            window.embeddingData = res.embedding;
            window.rawData = res.data;
            window.gps = res.gps;
            window.date = res.date;
            window.colName  = res.colName;
            mapView.initPoints();
            parallelView.init(window.rawData);
            threeDFigure.showEmbedding();
            dataView.changeDataList([]);
            timeView.init();
            window.beginTSNE = 0;
            $DataSourceLabel.html('Embedding:' + file.name);
            $(".sne").hide();
            $beginTSNE.html('X');
            document.getElementById( 'tSNEState' ).innerHTML = '';
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
  $rawData.bind('change', function (e) {
    utils.showWaitingModel('shown.bs.modal', 'Analysing Your File, Please Wait.', 'Processing', function () {
      let files = e.target.files;
      if (files.length) {
        $beginTSNE.attr('disabled','disabled');
        let file = files[0];
        let reader = new FileReader();//new一个FileReader实例
        reader.onload = function() {
          let res = fileReader.readRawFile(this.result);
          if (res.isValid) {
            window.rawData = res.data;
            window.gps = res.gps;
            window.date = res.date;
            window.colName  = res.colName;
            mapView.initPoints();
            parallelView.init(window.rawData);
            dataView.changeDataList([]);
            timeView.init();
            $(".sne").show();
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
    $embeddingData.val('');
    window.beginTSNE = 0;
    window.rawData = exampleRaw.data;
    window.date = exampleRaw.date;
    window.gps = exampleRaw.gps;
    parallelView.init(window.rawData);
    mapView.initPoints();
    dataView.changeDataList([]);
    $(".sne").show();
    $DataSourceLabel.html('Source:example data');
    $beginTSNE.html('begin');
    $beginTSNE.removeAttr('disabled');
    document.getElementById( 'tSNEState' ).innerHTML = '';
  });
  // $Datas.on('mouseenter','li',function(e){
  //   if (e.target.dataset.index) {
  //     eventDispatcher.emit('hover',e.target.dataset.index,true,'list');
  //   }
  // });
  // $Datas.on('mouseleave','li',function(e){
  //   if (e.target.dataset.index) {
  //     eventDispatcher.emit('hover',e.target.dataset.index,false,'list');
  //   }
  // });
  // $Datas.height($RightNav.height()-$Ops.height());



});









