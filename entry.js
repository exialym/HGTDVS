/**
 * Created by exialym on 2017/2/6.
 */
import './public/main.css'
import $ from './lib/jquery-3.1.1'

import './lib/three/TrackballControls'
import './lib/three/TypedArrayUtils'
import threeDFigure from './modules/threeDimensionalFigure'
import Detector from './lib/three/Detector'
//import fileReader from './modules/file2data'

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

window.relatedPointsNum = 100;
window.threepositions = new Float32Array([]);
window.beginTSNE = false;


let $relatedNumSlider = $('#relatedNumSlider');
let $relatedNumLabel = $('#relatedNum');
let $beginTSNE = $('#beginTSNE');
let $rawData = $('#rawData');
let $clearFile = $('#clearFile');
var rawData = [];


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
    if (window.beginTSNE) {
      window.beginTSNE = false;
      $beginTSNE.val('continue');
    } else {
      window.beginTSNE = true;
      $beginTSNE.val('stop');
    }
  });
  $rawData.bind('change', function (e) {
    let files = e.target.files;
    if (files.length) {
      let file = files[0];

    }
  });
  $clearFile.bind('click',function () {
    $rawData.val('');
  })
});







