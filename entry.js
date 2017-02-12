/**
 * Created by exialym on 2017/2/6.
 */
require('./public/main.css');
var $ = require('./lib/jquery-3.1.1');

require('./lib/three/TrackballControls');
require('./lib/three/TypedArrayUtils');
var threeDFigure = require('./modules/threeDimensionalFigure');




//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();




window.relatedPointsNum = 100;
window.threepositions = new Float32Array([]);
window.beginTSNE = false;


var $relatedNumSlider = $('#relatedNum');
var $relatedNumLable = $relatedNumSlider.next();
var $beginTSNE = $('#beginTSNE');


$(document).ready(function () {
  threeDFigure.init();
  threeDFigure.animate();
  $relatedNumSlider.val(window.relatedPointsNum);
  $relatedNumSlider.attr('min','5');
  $relatedNumSlider.attr('max',window.particleNum+'');
  $relatedNumLable.html(window.relatedPointsNum);
  $relatedNumSlider.bind('change', function () {
    window.relatedPointsNum = $('#relatedNum').val();
    $relatedNumLable.html(window.relatedPointsNum);
    threeDFigure.displayNearest();
  });
  $beginTSNE.bind('click',function () {
    window.beginTSNE = !window.beginTSNE;
  })
});







