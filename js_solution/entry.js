/**
 * Created by exialym on 2017/2/6.
 */
require('./public/main.css');
var $ = require('./lib/jquery-3.1.1');
var THREE = require('./lib/three/three');
require('./lib/three/TrackballControls');
require('./lib/three/TypedArrayUtils');


//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var renderer, scene, camera, controls, attributes;

var particles, uniforms, kdtree;

var PARTICLE_SIZE = 5;
var colorNormal = new THREE.Color(0x19A1F2);
var colorFloated = new THREE.Color(0x8800ff);
var colorChosen = new THREE.Color(0xFC021E);
var colorRelated = new THREE.Color(0xFFFF3A);
var colorFade = new THREE.Color(0xFFFFff);
var relatedPointsNum = 100;
var relatedPointsDistance = Infinity;

var raycaster, intersects;
var mouse, INTERSECTED, chosenPoint, preChooseFlag;
var relatedPointIndex = [];

init();
animate();

function init() {

  var container = document.getElementById( 'webgl' );

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 250;

  //

  controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed = 5.0;
  controls.zoomSpeed = 2.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.3;

  //

  var particleNum = 10000;

  var geometry = new THREE.BufferGeometry();

  var positions = new Float32Array( particleNum * 3 );
  var colors = new Float32Array( particleNum * 3 );
  //var sizes = new Float32Array( particleNum );



  var n = 100, n2 = n / 2; // particles spread in the cube

  for ( var i = 0; i < positions.length; i += 3 ) {

    // positions

    var x = Math.random() * n - n2;
    var y = Math.random() * n - n2;
    var z = Math.random() * n - n2;

    positions[ i ]     = x;
    positions[ i + 1 ] = y;
    positions[ i + 2 ] = z;

    colors[ i ]     = colorNormal.r;
    colors[ i + 1 ] = colorNormal.g;
    colors[ i + 2 ] = colorNormal.b;

    //sizes[ i ] = PARTICLE_SIZE * 1.5;

  }
  geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
  //geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

  geometry.computeBoundingSphere();

  var sprite = new THREE.TextureLoader().load( require("./public/img/disc.png") );
  var material = new THREE.PointsMaterial({
    size:PARTICLE_SIZE,
    vertexColors: THREE.VertexColors,
    sizeAttenuation: true,
    map: sprite,
    alphaTest: 0.5,
    transparent: true,
    opacity:0.7
  });
  particles = new THREE.Points( geometry, material );
  //create particles with buffer geometry
  var distanceFunction = function(a, b){
    return Math.pow(a[0] - b[0], 2) +  Math.pow(a[1] - b[1], 2) +  Math.pow(a[2] - b[2], 2);
  };
  kdtree = new THREE.TypedArrayUtils.Kdtree( positions, distanceFunction, 3 );
  scene.add( particles );

  //
  scene.add( new THREE.AxisHelper( 20 ) );


  //

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  //

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  //

  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  container.addEventListener('mousedown', onContainerMouseDown, false );
  container.addEventListener('mouseup', onContainerMouseUp, false );

}

function onContainerMouseDown(event) {
  event.preventDefault();
  //如果点击地方不是被选中的点
  if (chosenPoint !== INTERSECTED) {
    //点击的地方是个点时缓存这个点
    if (INTERSECTED) {
      preChooseFlag = INTERSECTED;
    } else {
      //chosenPoint = undifined;
    }
  }
  console.log(INTERSECTED);
  console.log(chosenPoint);
}
function onContainerMouseUp(event) {
  event.preventDefault();
  //如果鼠标落下时是一个有效的点
  if (preChooseFlag) {
    //如果鼠标抬起时和落下时鼠标下的点一样
    if (INTERSECTED && INTERSECTED.index === preChooseFlag.index) {
      //如果有选中的点，取消
      if (chosenPoint) {
        attributes.color.array[ chosenPoint.index*3 ] = colorNormal.r;
        attributes.color.array[ chosenPoint.index*3+1 ] = colorNormal.g;
        attributes.color.array[ chosenPoint.index*3+2 ] = colorNormal.b;
      }
      displayNearest(INTERSECTED);
      attributes.color.needsUpdate = true;
      chosenPoint = INTERSECTED;
    } else {
      //chosenPoint = null;
    }
  }
  console.log(INTERSECTED);
  console.log(chosenPoint);

}

function onDocumentMouseMove( event ) {

  event.preventDefault();

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function displayNearest(point) {
  var pos = [
    attributes.position.array[ point.index*3 ],
    attributes.position.array[ point.index*3+1 ],
    attributes.position.array[ point.index*3+2 ]
  ];
  // take the nearest 200 around him. distance^2 'cause we use the manhattan distance and no square is applied in the distance function
  var imagePositionsInRange = kdtree.nearest(pos, relatedPointsNum, relatedPointsDistance);
  for (var i = relatedPointIndex.length - 1;i >= 0;i--) {
    attributes.color.array[relatedPointIndex[i] * 3] = colorNormal.r;
    attributes.color.array[relatedPointIndex[i] * 3 + 1] = colorNormal.g;
    attributes.color.array[relatedPointIndex[i] * 3 + 2] = colorNormal.b;
  }
  relatedPointIndex = [];
  attributes.color.array[ point.index*3 ] = colorChosen.r;
  attributes.color.array[ point.index*3+1 ] = colorChosen.g;
  attributes.color.array[ point.index*3+2 ] = colorChosen.b;
  for ( var i = 0, il = imagePositionsInRange.length; i < il; i ++ ) {
    var object = imagePositionsInRange[i];
    var objectIndex = object[0].pos;
    relatedPointIndex.push(objectIndex);
    attributes.color.array[ objectIndex*3 ] = colorRelated.r;
    attributes.color.array[ objectIndex*3+1 ] = colorRelated.g;
    attributes.color.array[ objectIndex*3+2 ] = colorRelated.b;
    attributes.color.needsUpdate = true;

  }
}

function render() {

  var geometry = particles.geometry;
  attributes = geometry.attributes;

  raycaster.setFromCamera( mouse, camera );
  //获取鼠标下的点
  intersects = raycaster.intersectObject( particles );
  //如果鼠标下有点
  if ( intersects.length > 0 ) {
    //如果鼠标下点有变化
    if ( INTERSECTED != intersects[ 0 ] ) {
      //检查刚才鼠标下是否有点
      if (INTERSECTED) {
        //检查刚才的点是不是被选中的点，不是回归正常色，是回归选中色
        if (chosenPoint && chosenPoint.index === INTERSECTED.index) {
          attributes.color.array[INTERSECTED.index * 3] = colorChosen.r;
          attributes.color.array[INTERSECTED.index * 3 + 1] = colorChosen.g;
          attributes.color.array[INTERSECTED.index * 3 + 2] = colorChosen.b;
        } else  {
          attributes.color.array[INTERSECTED.index * 3] = colorNormal.r;
          attributes.color.array[INTERSECTED.index * 3 + 1] = colorNormal.g;
          attributes.color.array[INTERSECTED.index * 3 + 2] = colorNormal.b;

        }
      }

      //指向当前点，变为浮动色
      INTERSECTED = intersects[ 0 ];
      attributes.color.array[ INTERSECTED.index*3 ] = colorFloated.r;
      attributes.color.array[ INTERSECTED.index*3+1 ] = colorFloated.g;
      attributes.color.array[ INTERSECTED.index*3+2 ] = colorFloated.b;
      attributes.color.needsUpdate = true;
    }
  //当前鼠标下没有点，但刚才有
  } else if (INTERSECTED) {
    //检查刚才的点是不是被选中的点，不是回归正常色，是回归选中色
    if (chosenPoint && chosenPoint.index === INTERSECTED.index) {
      attributes.color.array[INTERSECTED.index * 3] = colorChosen.r;
      attributes.color.array[INTERSECTED.index * 3 + 1] = colorChosen.g;
      attributes.color.array[INTERSECTED.index * 3 + 2] = colorChosen.b;
    } else  {
      attributes.color.array[INTERSECTED.index * 3] = colorNormal.r;
      attributes.color.array[INTERSECTED.index * 3 + 1] = colorNormal.g;
      attributes.color.array[INTERSECTED.index * 3 + 2] = colorNormal.b;

    }
    attributes.color.needsUpdate = true;
    INTERSECTED = undefined;

  }
  controls.update();
  renderer.render( scene, camera );

}