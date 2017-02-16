/**
 * Created by exialym on 2017/2/11.
 */
import * as THREE from '../lib/three/three'
import tsnejs from '../lib/tsne'
import exampleRaw from './example_data'
module.exports = {
  init : init,
  animate : animate,
  displayNearest : displayNearest,
};

let PARTICLE_SIZE = 5;
let relatedPointsDistance = Infinity;
const colorNormal = new THREE.Color(0x19A1F2);
const colorFloated = new THREE.Color(0x8800ff);
const colorChosen = new THREE.Color(0xFC021E);
const colorRelated = new THREE.Color(0xFFFF3A);
const colorFade = new THREE.Color(0x3B51A6);

let renderer, scene, camera, controls, attributes;

let particles, kdtree, positions;

let raycaster, intersects;
let mouse, intersectedPoint, chosenPoint;
let mouseFlag = [];
let relatedPointIndex = [];

let webglW, webglH;

let isKdTreeUpdated = false;

let opt = {};
opt.epsilon = 10; // epsilon is learning rate (10 = default)
opt.perplexity = 30; // roughly how many neighbors each point influences (30 = default)
opt.dim = 3; // dimensionality of the embedding (2 = default)

let tsne = new tsnejs.tSNE(opt); // create a tSNE instance

// initialize data. Here we have 3 points and some example pairwise dissimilarities




function init(rawData) {
  if (rawData.length===0)
    rawData = exampleRaw;
  tsne.initDataRaw(rawData);
  window.particleNum = rawData.length;
  let container = document.getElementById( 'webgl' );

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



  let geometry = new THREE.BufferGeometry();

  positions = new Float32Array( window.particleNum * 3 );
  let colors = new Float32Array( window.particleNum * 3 );

  let n = 100, n2 = n / 2; // particles spread in the cube

  for ( let i = 0; i < positions.length; i += 3 ) {

    // positions

    let x = Math.random() * n - n2;
    let y = Math.random() * n - n2;
    let z = Math.random() * n - n2;

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

  let sprite = new THREE.TextureLoader().load( require("../public/img/disc.png") );
  let material = new THREE.PointsMaterial({
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

  kdtree = new THREE.TypedArrayUtils.Kdtree( positions, distanceFunction, 3 );
  isKdTreeUpdated = true;
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
    if (intersectedPoint) {
      //如果有选中的点，取消
      if (chosenPoint) {
        changeColor(chosenPoint.index,colorFade);
      }
      displayNearest(intersectedPoint);
      attributes.color.needsUpdate = true;
      chosenPoint = intersectedPoint;
    } else {
      chosenPoint = undefined;
      for (let i = 0;i < particleNum;i++) {
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

function distanceFunction (a, b){
  return Math.pow(a[0] - b[0], 2) +  Math.pow(a[1] - b[1], 2) +  Math.pow(a[2] - b[2], 2);
}

function displayNearest(point) {
  if (!point&&chosenPoint)
    point = chosenPoint;
  else if (!point)
    return;
  let pos = [
    attributes.position.array[ point.index*3 ],
    attributes.position.array[ point.index*3+1 ],
    attributes.position.array[ point.index*3+2 ]
  ];
  // take the nearest 200 around him. distance^2 'cause we use the manhattan distance and no square is applied in the distance function
  let imagePositionsInRange = kdtree.nearest(pos, Number(relatedPointsNum)+1, relatedPointsDistance);
  if (chosenPoint) {
    for (let i = relatedPointIndex.length - 1;i >= 0;i--) {
      changeColor(relatedPointIndex[i],colorFade);
    }
  } else {
    for (let i = 0;i < particleNum;i++) {
      changeColor(i,colorFade);
    }
  }

  relatedPointIndex = [];

  for ( let j = 0, il = imagePositionsInRange.length; j < il; j ++ ) {
    let object = imagePositionsInRange[j];
    let objectIndex = object[0].pos;
    relatedPointIndex.push(objectIndex);
    changeColor(objectIndex,colorRelated);
  }
  changeColor(point.index,colorChosen);
  attributes.color.needsUpdate = true;
}

function render() {

  let geometry = particles.geometry;
  attributes = geometry.attributes;

  raycaster.setFromCamera( mouse, camera );
  //获取鼠标下的点
  intersects = raycaster.intersectObject( particles );
  //如果鼠标下有点
  if ( intersects.length > 0 ) {
    //如果鼠标下点有变化
    if ( intersectedPoint != intersects[ 0 ] ) {
      //检查刚才鼠标下是否有点
      if (intersectedPoint) {
        //检查刚才的点是不是被选中的点，不是回归正常色，是回归选中色
        if (chosenPoint && chosenPoint.index === intersectedPoint.index) {
          changeColor(intersectedPoint.index,colorChosen);
        } else if  (chosenPoint) {
          let flag = false;
          for (let i = relatedPointIndex.length - 1;i >= 0;i--) {
            if (intersectedPoint.index===relatedPointIndex[i]) {
              changeColor(intersectedPoint.index,colorRelated);
              flag = true;
              break;
            }
          }
          if (!flag) {
            changeColor(intersectedPoint.index,colorFade);
          }
        } else {
          changeColor(intersectedPoint.index,colorNormal);
        }
      }

      //指向当前点，变为浮动色
      intersectedPoint = intersects[ 0 ];
      changeColor(intersectedPoint.index,colorFloated);
      attributes.color.needsUpdate = true;
    }
    //当前鼠标下没有点，但刚才有
  } else if (intersectedPoint) {
    //检查刚才的点是不是被选中的点，不是回归正常色，是回归选中色
    if (chosenPoint && chosenPoint.index === intersectedPoint.index) {
      changeColor(intersectedPoint.index,colorChosen);
    } else if  (chosenPoint) {
      let flag = false;
      for (let i = relatedPointIndex.length - 1;i >= 0;i--) {
        if (intersectedPoint.index===relatedPointIndex[i]) {
          changeColor(intersectedPoint.index,colorRelated);
          flag = true;
          break;
        }
      }
      if (!flag) {
        changeColor(intersectedPoint.index,colorFade);
      }
    } else {
      changeColor(intersectedPoint.index,colorNormal);
    }
    attributes.color.needsUpdate = true;
    intersectedPoint = undefined;

  }
  controls.update();
  renderer.render( scene, camera );
  if (window.beginTSNE) {
    let cost = tsne.step();
    document.getElementById( 'tSNEState' ).innerHTML = 'cost:' + cost + '  ' + 'iteration:' + tsne.iter;
    positions = Float32Array.from(tsne.getSolution().reduce(function(a, b){
      return a.concat(b)
    }));
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    attributes.position.needsUpdate = true;
    //kdtree = new THREE.TypedArrayUtils.Kdtree( attributes.position.array, distanceFunction, 3 );
    isKdTreeUpdated = false;
    console.log('update');
    console.log(attributes.position.array);
  } else {
    if (!isKdTreeUpdated) {
      isKdTreeUpdated = true;
      console.log('kdtree before');
      console.log(attributes.position.array);
      kdtree = new THREE.TypedArrayUtils.Kdtree( attributes.position.array, distanceFunction, 3 );
      attributes.position.needsUpdate = true;
      console.log('kdtree after');
      console.log(attributes.position.array);
    }
  }
}
function changeColor(index,color) {
  attributes.color.array[index * 3] = color.r;
  attributes.color.array[index * 3 + 1] = color.g;
  attributes.color.array[index * 3 + 2] = color.b;
}