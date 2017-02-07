/**
 * Created by exialym on 2017/2/6.
 */
require('./main.css');
var $ = require('./lib/jquery-3.1.1');
var THREE = require('./lib/three/three');

var $webgl = $('#webgl');

function initDisplay() {
  $webgl.width(window.innerWidth).height(window.innerHeight);
}

initDisplay();
$(window).resize(function() {
  initDisplay();
});

//初始化渲染器
var webgl = document.getElementById('webgl');
var webglWidth = webgl.clientWidth;
var webglHeight = webgl.clientHeight;
var renderer;//定义一个全局变量renderer
function initThree(){
  //生成渲染器对象（属性：抗锯齿效果为设置有效）
  renderer=new THREE.WebGLRenderer({
    antialias:true,//antialias:true/false是否开启反锯齿
    precision:"highp",//precision:highp/mediump/lowp着色精度选择
    alpha:true,//alpha:true/false是否可以设置背景色透明
    premultipliedAlpha:false,//?
    stencil:false,//?
    preserveDrawingBuffer:true,//preserveDrawingBuffer:true/false是否保存绘图缓冲
    maxLights:1//maxLights:最大灯光数
  });
  //指定渲染器的高宽（和画布框大小一致）
  renderer.setSize(webglWidth, webglHeight );
  //将创建的canvas元素（此处的canvas元素为three.js创建）添加到html文档当中
  webgl.appendChild(renderer.domElement);
  //设置渲染器的清除色
}

//初始化相机
var camera;
function initCamera() {
  camera = new THREE.PerspectiveCamera(45,webglWidth/webglHeight,1,10000);
  //此处为设置透视投影的相机，默认情况下，相机的上方向为Y轴，右方向为X轴，沿着Z轴垂直朝里（视野角：fov； 纵横比：aspect； 相机离视最近的距离：near； 相机离视体积最远距离：far）
  camera.position.x = 400;//设置相机的位置坐标
  camera.position.y = 0;
  camera.position.z = 0;
  //设置相机的上为z轴方向
  camera.up.x = 0;
  camera.up.y = 0;
  camera.up.z = 1;
  //设置视野的中心坐标
  camera.lookAt({x:0, y:0, z:0});
}


/*
 *设置场景，所有的元素只有在添加到场景当中之后才能够生效
 */
var scene;
function initScene() {
  scene = new THREE.Scene();
}

/*
 *设置光源
 */
var light;
function initLight() {
  light = new THREE.DirectionalLight(0x0000FF,1.0,0);//设置平行光DirectionalLight
  light.position.set(50,50,50);//光源向量，即光源的位置
  //还可以添加多个光源，多行注释中即为添加2、3号光源
  /*light2 = new THREE.DirectionalLight(0xFF00CC,1.0,0);
   light2.position.set(0,50,0);
   light3 = new THREE.DirectionalLight(0x0000CC,1.0,0);
   light3.position.set(50,0,0);*/
  scene.add(light);//追加光源到场景
  /*scene.add(light2);
   scene.add(light3);*/
}

/*
 *设置物体
 */
var cube=Array();
function initObject() {
  for(var i=0;i<4;i++){
    cube[i]=new THREE.Mesh(//mesh是three.js的一个类
      new THREE.CubeGeometry(50,50,50),//形状 (宽 高 深度)
      new THREE.MeshLambertMaterial({color:0x0000FF})//材质
    );
    scene.add(cube[i]);
    cube[i].position.set(0,-120+80*i,0);
  }
}

function threeStart() {
  initThree();
  initCamera();
  initScene();
  initLight();
  initObject();
  //loop();
  renderer.clear();
  renderer.render(scene,camera);
}
threeStart();