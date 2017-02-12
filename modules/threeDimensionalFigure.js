/**
 * Created by exialym on 2017/2/11.
 */
var THREE = require('../lib/three/three');
var tsnejs = require('../lib/tsne');
var exampleRaw = require('./example_data');
module.exports = {
  init : init,
  animate : animate,
  displayNearest : displayNearest,
}

var PARTICLE_SIZE = 5;
var relatedPointsDistance = Infinity;
var colorNormal = new THREE.Color(0x19A1F2);
var colorFloated = new THREE.Color(0x8800ff);
var colorChosen = new THREE.Color(0xFC021E);
var colorRelated = new THREE.Color(0xFFFF3A);
var colorFade = new THREE.Color(0x3B51A6);

var renderer, scene, camera, controls, attributes;

var particles, kdtree;

var raycaster, intersects;
var mouse, INTERSECTED, chosenPoint;
var mouseFlag = [];
var relatedPointIndex = [];

var webglW, webglH;

var positions;

var opt = {}
opt.epsilon = 10; // epsilon is learning rate (10 = default)
opt.perplexity = 30; // roughly how many neighbors each point influences (30 = default)
opt.dim = 3; // dimensionality of the embedding (2 = default)

var tsne = new tsnejs.tSNE(opt); // create a tSNE instance

// initialize data. Here we have 3 points and some example pairwise dissimilarities




function init(rawData) {
  if (!rawData)
    rawData = exampleRaw;
  tsne.initDataRaw(rawData);
  window.particleNum = rawData.length;
  var container = document.getElementById( 'webgl' );

  webglW = container.offsetWidth;
  webglH = container.offsetHeight;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 45, webglW / webglH, 1, 10000 );
  camera.position.z = 250;

  //

  controls = new THREE.TrackballControls( camera, container );
  controls.rotateSpeed = 2.0;
  controls.zoomSpeed = 2.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.3;

  //



  var geometry = new THREE.BufferGeometry();

  var positions = new Float32Array( window.particleNum * 3 );
  var colors = new Float32Array( window.particleNum * 3 );

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
  }
  geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  //geometry.addAttribute( 'position', new THREE.BufferAttribute( window.threepositions, 3 ) );
  geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

  geometry.computeBoundingSphere();

  var sprite = new THREE.TextureLoader().load( require("../public/img/disc.png") );
  var material = new THREE.PointsMaterial({
    size:PARTICLE_SIZE,
    vertexColors: THREE.VertexColors,
    sizeAttenuation: true,
    map: sprite,
    alphaTest: 0.5,
    transparent: true,
    opacity:0.7,
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
  renderer.setSize( webglW, webglH );
  container.appendChild( renderer.domElement );

  //

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  //

  window.addEventListener( 'resize', onWindowResize, false );
  container.addEventListener( 'mousemove', onDocumentMouseMove, false );
  container.addEventListener('mousedown', onContainerMouseDown, false );
  container.addEventListener('mouseup', onContainerMouseUp, false );

}

function onContainerMouseDown(event) {
  event.preventDefault();
  mouseFlag[0] = mouse.x;
  mouseFlag[1] = mouse.y;
}
function onContainerMouseUp(event) {
  event.preventDefault();
  //如果鼠标抬起时和落下时位置一样
  if (mouseFlag[0] === mouse.x && mouseFlag[1] === mouse.y) {
    //如果鼠标下有点
    if (INTERSECTED) {
      //如果有选中的点，取消
      if (chosenPoint) {
        changeColor(chosenPoint.index,colorFade);
      }
      displayNearest(INTERSECTED);
      attributes.color.needsUpdate = true;
      chosenPoint = INTERSECTED;
    } else {
      chosenPoint = undefined;
      for (var i = 0;i < particleNum;i++) {
        changeColor(i,colorNormal);
      }
      attributes.color.needsUpdate = true;
    }
  }
}

function onDocumentMouseMove( event ) {

  event.preventDefault();
  mouse.x = ( event.offsetX / webglW ) * 2 - 1;
  mouse.y = - ( event.offsetY / webglH ) * 2 + 1;

}

function onWindowResize() {

  camera.aspect = webglW / webglH;
  camera.updateProjectionMatrix();

  renderer.setSize( webglW, webglH );

}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function displayNearest(point) {
  if (!point&&chosenPoint)
    point = chosenPoint;
  else if (!point)
    return;
  var pos = [
    attributes.position.array[ point.index*3 ],
    attributes.position.array[ point.index*3+1 ],
    attributes.position.array[ point.index*3+2 ]
  ];
  // take the nearest 200 around him. distance^2 'cause we use the manhattan distance and no square is applied in the distance function
  var imagePositionsInRange = kdtree.nearest(pos, Number(relatedPointsNum)+1, relatedPointsDistance);
  if (chosenPoint) {
    for (var i = relatedPointIndex.length - 1;i >= 0;i--) {
      changeColor(relatedPointIndex[i],colorFade);
    }
  } else {
    for (i = 0;i < particleNum;i++) {
      changeColor(i,colorFade);
    }
  }

  relatedPointIndex = [];

  for ( var j = 0, il = imagePositionsInRange.length; j < il; j ++ ) {
    var object = imagePositionsInRange[j];
    var objectIndex = object[0].pos;
    relatedPointIndex.push(objectIndex);
    changeColor(objectIndex,colorRelated);
  }
  changeColor(point.index,colorChosen);
  attributes.color.needsUpdate = true;
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
          changeColor(INTERSECTED.index,colorChosen);
        } else if  (chosenPoint) {
          var flag = false;
          for (var i = relatedPointIndex.length - 1;i >= 0;i--) {
            if (INTERSECTED.index===relatedPointIndex[i]) {
              changeColor(INTERSECTED.index,colorRelated);
              flag = true;
              break;
            }
          }
          if (!flag) {
            changeColor(INTERSECTED.index,colorFade);
          }
        } else {
          changeColor(INTERSECTED.index,colorNormal);
        }
      }

      //指向当前点，变为浮动色
      INTERSECTED = intersects[ 0 ];
      changeColor(INTERSECTED.index,colorFloated);
      attributes.color.needsUpdate = true;
    }
    //当前鼠标下没有点，但刚才有
  } else if (INTERSECTED) {
    //检查刚才的点是不是被选中的点，不是回归正常色，是回归选中色
    if (chosenPoint && chosenPoint.index === INTERSECTED.index) {
      changeColor(INTERSECTED.index,colorChosen);
    } else if  (chosenPoint) {
      var flag = false;
      for (var i = relatedPointIndex.length - 1;i >= 0;i--) {
        if (INTERSECTED.index===relatedPointIndex[i]) {
          changeColor(INTERSECTED.index,colorRelated);
          flag = true;
          break;
        }
      }
      if (!flag) {
        changeColor(INTERSECTED.index,colorFade);
      }
    } else {
      changeColor(INTERSECTED.index,colorNormal);
    }
    attributes.color.needsUpdate = true;
    INTERSECTED = undefined;

  }
  controls.update();
  renderer.render( scene, camera );
  if (window.beginTSNE) {
    tsne.step();
    var flattened = tsne.getSolution().reduce(function(a, b){
      return a.concat(b)
    });
    geometry.addAttribute( 'position', new THREE.BufferAttribute( Float32Array.from(flattened), 3 ) );
    attributes.position.needsUpdate = true;
  }
}
function changeColor(index,color) {
  attributes.color.array[index * 3] = color.r;
  attributes.color.array[index * 3 + 1] = color.g;
  attributes.color.array[index * 3 + 2] = color.b;
}