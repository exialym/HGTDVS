/**
 * Created by exialym on 2017/2/6.
 */
require('./public/main.css');
var $ = require('./lib/jquery-3.1.1');

require('./lib/three/TrackballControls');
require('./lib/three/TypedArrayUtils');
var threeDFigure = require('./modules/threeDimensionalFigure');


//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();



window.particleNum = 10000;
window.relatedPointsNum = 100;


var $relatedNumSlider = $('#relatedNum');
var $relatedNumLable = $relatedNumSlider.next();


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
});



