/**
 * Created by exialym on 2017/2/6.
 */
require('./public/main.css');
var $ = require('./lib/jquery-3.1.1');

require('./lib/three/TrackballControls');
require('./lib/three/TypedArrayUtils');
var threeDFigure = require('./modules/threeDimensionalFigure');
var Detector = require('./lib/three/Detector');

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

window.relatedPointsNum = 100;
window.threepositions = new Float32Array([]);
window.beginTSNE = false;


var $relatedNumSlider = $('#relatedNumSlider');
var $relatedNumLabel = $('#relatedNum');
var $beginTSNE = $('#beginTSNE');


$(document).ready(function () {
  threeDFigure.init();
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
    var number = Number($relatedNumLabel.val());
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
  })
});







