/**
 * Created by exialym on 2017/2/6.
 */
import './public/main.css'

import $ from './lib/jquery-3.1.1'
import './lib/three/TrackballControls'
import './lib/three/TypedArrayUtils'
import * as threeDFigure from './modules/threeDimensionalFigure'
import Detector from './lib/three/Detector'
import * as fileReader from './modules/file2data'
import './lib/jqueryUI/jquery-ui'

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

window.relatedPointsNum = 100;
window.threepositions = new Float32Array([]);
window.beginTSNE = 0;//0:停止；1：进行；2：暂停


let $relatedNumSlider = $('#relatedNumSlider');
let $relatedNumLabel = $('#relatedNum');
let $beginTSNE = $('#beginTSNE');
let $rawData = $('#rawData');
let $clearFile = $('#clearFile');
let $DataSourceLabel = $('#DataSourceLabel');
let rawData = [];


$(document).ready(function () {
  threeDFigure.init(rawData);
  threeDFigure.animate();
  $relatedNumSlider.val(window.relatedPointsNum);
  $relatedNumSlider.attr('min','5');
  $relatedNumSlider.attr('max',window.particleNum+'');
  $relatedNumLabel.val(window.relatedPointsNum);
  $relatedNumSlider.bind('change', function () {
    window.relatedPointsNum = $relatedNumSlider.val();
    $relatedNumLabel.val(window.relatedPointsNum);
    threeDFigure.displayNearest();
  });
  $relatedNumLabel.bind('change', function () {
    let number = Number($relatedNumLabel.val());
    if (isNaN(number))
      return;
    number = number > Number(window.particleNum) ? Number(window.particleNum) : number;
    window.relatedPointsNum = number;
    $relatedNumSlider.val(window.relatedPointsNum);
    $relatedNumLabel.val(window.relatedPointsNum);
    threeDFigure.displayNearest();
  });
  $beginTSNE.bind('click',function () {
    if (window.beginTSNE==0) {
      window.beginTSNE = 1;
      threeDFigure.init(rawData);
      $relatedNumSlider.val(window.relatedPointsNum);
      $relatedNumSlider.attr('min','5');
      $relatedNumSlider.attr('max',window.particleNum+'');
      $relatedNumLabel.val(window.relatedPointsNum);
      $beginTSNE.val('pause');
    } else if (window.beginTSNE==1){
      window.beginTSNE = 2;
      $beginTSNE.val('continue');
    } else {
      window.beginTSNE = 1;
      $beginTSNE.val('pause');
    }
  });
  $rawData.bind('change', function (e) {
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
          $DataSourceLabel.html('Using ' + file.name + ':');
          $beginTSNE.val('begin');
          document.getElementById( 'tSNEState' ).innerHTML = '';
          $beginTSNE.removeAttr('disabled');
        } else {
          // rawData = [];
          // $DataSourceLabel.html('Using example data:');
          $beginTSNE.removeAttr('disabled');
        }
      };
      reader.onerror = function() {
        // rawData = [];
        // $DataSourceLabel.html('Using example data:');
        $beginTSNE.removeAttr('disabled');
      }
      reader.readAsText(file);
    }
  });
  $clearFile.bind('click',function () {
    $rawData.val('');
    window.beginTSNE = 0;
    $DataSourceLabel.html('Using example data:');
    $beginTSNE.val('begin');
    $beginTSNE.removeAttr('disabled');
    document.getElementById( 'tSNEState' ).innerHTML = '';
  });
  var $slider = $('#slider');
  if ($slider.length > 0) {
    $slider.slider({
      max: 15,
      step: 1,
      value: 3,
      orientation: 'horizontal',
      range: 'min'
    });
  }
});









