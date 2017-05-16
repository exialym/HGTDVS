/**
 * Created by exialym on 2017/2/11.
 */
import * as THREE from '../lib/three/three'
import tsnejs from '../lib/tsne'
import utils from './utils'
import * as exampleRaw from './example_data'
import KdTreeUtil from '../lib/three/kdTree'
import eventDispatcher from './event'

//export function
module.exports = {
  init : init,
  animate : animate,
  displayNearest : displayNearest,
  choosePoints : choosePoints,
  listHoverPoints : listHoverPoints
};

//init pram
let PARTICLE_SIZE = 5;
let relatedPointsDistance = Infinity;
const colorNormal = new THREE.Color(0x19A1F2);
const colorFloated = new THREE.Color(0x8800ff);
const colorChosen = new THREE.Color(0xFC021E);
const colorRelated = new THREE.Color(0xFFFF3A);
const colorFade = new THREE.Color(0x3B51A6);






//init WebGL

let mouseFlag = [];
let relatedPointIndex = [];
let isKdTreeUpdated = false;
let animationFlag;
let tsne;

let container = document.getElementById( 'webgl' );

let webglW = container.offsetWidth;
let webglH = container.offsetHeight;

let camera = new THREE.PerspectiveCamera( 45, webglW / webglH, 1, 10000 );
camera.position.z = 250;

let controls = new THREE.TrackballControls( camera, container );
controls.rotateSpeed = 2.0;
controls.zoomSpeed = 2.2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = false;
controls.dynamicDampingFactor = 0.3;


let geometry = new THREE.BufferGeometry();
let attributes = geometry.attributes;
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
let particles = new THREE.Points( geometry, material );

let scene = new THREE.Scene();
scene.add( particles );
scene.add( new THREE.AxisHelper( 20 ) );

let renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( webglW, webglH );

container.appendChild( renderer.domElement );
container.style.height = webglH + 'px';

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

window.addEventListener( 'resize', onWindowResize, false );
container.addEventListener( 'mousemove', onDocumentMouseMove, false );
container.addEventListener('mousedown', onContainerMouseDown, false );
container.addEventListener('mouseup', onContainerMouseUp, false );

window.particleNum = exampleRaw.data.length;
$('relatedNumSlider').slider( "max" , window.particleNum);
let intersectedPoint = undefined;
let chosenPoint = undefined;
let positions = new Float32Array( window.particleNum * 3 );
let colors = new Float32Array( window.particleNum * 3 );

let n = 100, n2 = n / 2; // particles spread in the cube
for ( let i = 0; i < positions.length; i += 3 ) {
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

//init points
geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
geometry.computeBoundingSphere();

//build kdtree
function positionArr2Obj(positionArr) {
  let temp = [];
  let index = 0;
  for ( let i = 0; i < positionArr.length; i += 3 ) {
    temp[index] = {x:positionArr[ i ],y:positionArr[ i + 1 ],z:positionArr[ i + 2 ],i:index};
    index++;
  }
  return temp;
}

let kdtree = new KdTreeUtil.KdTree( positionArr2Obj(positions), distanceFunction, ["x", "y", "z"]);
isKdTreeUpdated = true;
animate();


function init() {
  if (animationFlag) {
    cancelAnimationFrame(animationFlag);
    animationFlag = undefined;
  }
  utils.showWaitingModel('shown.bs.modal', 'Initializing t-SNE, Won\'t be long.', 'Processing', function () {
    console.log('init Webgl modal');
    if (window.rawData.length===0)
      window.rawData = exampleRaw.data;

    //init TSNE
    let opt = {};
    opt.epsilon = $('#learnRateSlider').slider( "value" );; // epsilon is learning rate (10 = default)
    opt.perplexity = $('#perplexitySlider').slider( "value" );; // roughly how many neighbors each point influences (30 = default)
    opt.dim = 3; // dimensionality of the embedding (2 = default)
    tsne = new tsnejs.tSNE(opt); // create a tSNE instance
    tsne.initDataRaw(window.rawData);

    window.particleNum = window.rawData.length;
    $('#relatedNumSlider').slider({
      min: 5,
      max: window.particleNum,
      step: 1,
      value: window.relatedPointsNum,
      orientation: 'horizontal',
      range: 'min',
      change:function () {
        window.relatedPointsNum = $('#relatedNumSlider').slider( "value" );
        $('#relatedNumLabel').val(window.relatedPointsNum);
        displayNearest();
      }
    });
    intersectedPoint = undefined;
    chosenPoint = undefined;
    positions = new Float32Array( window.particleNum * 3 );
    colors = new Float32Array( window.particleNum * 3 );

    for ( let i = 0; i < positions.length; i += 3 ) {
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
    //Todo
    // 不想开始tsne前都先random位置，但是使用tsne的第一步来初始化位置会使得鼠标交互识别不到鼠标下的点，原因未知
    // positions = Float32Array.from(tsne.getSolution().reduce(function(a, b){
    //   return a.concat(b)
    // }));

    //init points
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    geometry.computeBoundingSphere();

    //build kdtree
    kdtree = new KdTreeUtil.KdTree( positionArr2Obj(positions), distanceFunction, ["x", "y", "z"]);
    isKdTreeUpdated = true;
    utils.closeWaitingModel();
    if (!animationFlag)
      animate();
  });
}

//鼠标按下时触发
function onContainerMouseDown(event) {
  event.preventDefault();
  mouseFlag[0] = mouse.x;
  mouseFlag[1] = mouse.y;
}
//鼠标抬起时触发
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
      //计算当前选中点的最近邻居
      displayNearest(intersectedPoint);
      attributes.color.needsUpdate = true;
      chosenPoint = intersectedPoint;
    } else {
      //鼠标下没有点的时候，取消选中，平行坐标取消选中，列表清空
      chosenPoint = undefined;
      relatedPointIndex = [];
      for (let i = 0;i < particleNum;i++) {
        changeColor(i,colorNormal);
      }
      eventDispatcher.emit('choose',relatedPointIndex);
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
  animationFlag = requestAnimationFrame( animate );
  render();
}

function distanceFunction (a, b){
  return Math.pow(a.x - b.x, 2) +  Math.pow(a.y - b.y, 2) +  Math.pow(a.z - b.z, 2);
};

function displayNearest(point) {
  if (!point&&chosenPoint)
    point = chosenPoint;
  else if (!point)
    return;
  let pos = {
    x:attributes.position.array[ point.index*3 ],
    y:attributes.position.array[ point.index*3+1 ],
    z:attributes.position.array[ point.index*3+2 ]
  };
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
    let objectIndex = object[0].i;
    relatedPointIndex.push(objectIndex);
    changeColor(objectIndex,colorRelated);
  }
  eventDispatcher.emit('choose',relatedPointIndex);
  changeColor(point.index,colorChosen);
  attributes.color.needsUpdate = true;
}

function render() {

  raycaster.setFromCamera( mouse, camera );
  //获取鼠标下的点
  let intersects = raycaster.intersectObject( particles );
  //如果鼠标下有点
  if ( intersects.length > 0 ) {
    //如果鼠标下点有变化
    if ( intersectedPoint != intersects[ 0 ] ) {
      //检查刚才鼠标下是否有点
      if (intersectedPoint) {
        //检查刚才的点是不是被选中的点，不是回归正常色，是回归选中色
        if (chosenPoint && chosenPoint.index === intersectedPoint.index) {
          changeColor(intersectedPoint.index,colorChosen);
        } else if  (relatedPointIndex.length!=0) {
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
    } else if  (relatedPointIndex.length!==0) {
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
  if (window.beginTSNE===1) {
    let cost = tsne.step();
    document.getElementById( 'tSNEState' ).innerHTML = 'Cost:' + cost.toFixed(10) + '<br>' + 'Iteration:' + tsne.iter;
    positions = Float32Array.from(tsne.getSolution().reduce(function(a, b){
      return a.concat(b)
    }));
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    attributes.position.needsUpdate = true;
    isKdTreeUpdated = false;
  } else if (window.beginTSNE===2) {
    if (!isKdTreeUpdated) {
      isKdTreeUpdated = true;
      kdtree = new KdTreeUtil.KdTree( positionArr2Obj(positions), distanceFunction, ["x", "y", "z"]);
    }
  }
}
function changeColor(index,color) {
  attributes.color.array[index * 3] = color.r;
  attributes.color.array[index * 3 + 1] = color.g;
  attributes.color.array[index * 3 + 2] = color.b;
}
function choosePoints(indexes) {
  relatedPointIndex = indexes;
  chosenPoint = null;
  if (relatedPointIndex.length===0) {
    for (let i = 0;i < particleNum;i++) {
      changeColor(i,colorNormal);
    }
  } else {
    for (let i = 0;i < particleNum;i++) {
      changeColor(i,colorFade);
    }
  }
  for (let i = 0;i < indexes.length;i++) {
    changeColor(indexes[i],colorRelated);
  }
  attributes.color.needsUpdate = true;
}
function listHoverPoints(index,hoverFlag) {
  index = Number(index);
  if (hoverFlag) {
    changeColor(index,colorChosen);
  } else {
    if (chosenPoint && chosenPoint.index === index) {
      changeColor(index,colorChosen);
    } else if  (relatedPointIndex.length!==0) {
      let flag = false;
      for (let i = relatedPointIndex.length - 1;i >= 0;i--) {
        if (index===relatedPointIndex[i]) {
          changeColor(index,colorRelated);
          flag = true;
          break;
        }
      }
      if (!flag) {
        changeColor(index,colorFade);
      }
    } else {
      changeColor(index,colorNormal);
    }
  }

  attributes.color.needsUpdate = true;
}
eventDispatcher.on('choose',choosePoints);