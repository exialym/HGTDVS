/**
 * Created by exialym on 2017/2/6.
 */
require('./public/main.css');
var $ = require('./lib/jquery-3.1.1');
var THREE = require('./lib/three/three');


//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var renderer, scene, camera;

var particles, uniforms;

var PARTICLE_SIZE = 10;
var colorNormal = new THREE.Color(0x0088ff);
var colorFloated = new THREE.Color(0x8800ff);

var raycaster, intersects;
var mouse, INTERSECTED;

init();
animate();

function init() {

  var container = document.getElementById( 'webgl' );

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 250;

  //

  var particleNum = 5000;

  var geometry = new THREE.BufferGeometry();

  var positions = new Float32Array( particleNum * 3 );
  var colors = new Float32Array( particleNum * 3 );
  var sizes = new Float32Array( particleNum );



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

    sizes[ i ] = PARTICLE_SIZE * 1.5;

  }
  geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
  geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

  geometry.computeBoundingSphere();

  var sprite = new THREE.TextureLoader().load( require("./public/img/disc.png") );
  var material = new THREE.PointsMaterial( { size:PARTICLE_SIZE, vertexColors: THREE.VertexColors, sizeAttenuation: false, map: sprite, alphaTest: 0.5, transparent: true } );


  // var material = new THREE.ShaderMaterial( {
  //
  //   uniforms: {
  //     color:   { value: new THREE.Color( 0xffffff ) },
  //     texture: { value: new THREE.TextureLoader().load( require("./public/img/disc.png") ) }
  //   },
  //   vertexShader: document.getElementById( 'vertexshader' ).textContent,
  //   fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
  //
  //   alphaTest: 0.9
  //
  // } );

  //

  particles = new THREE.Points( geometry, material );
  scene.add( particles );

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

function render() {

  particles.rotation.x += 0.0005;
  particles.rotation.y += 0.001;

  var geometry = particles.geometry;
  var attributes = geometry.attributes;

  raycaster.setFromCamera( mouse, camera );

  intersects = raycaster.intersectObject( particles );

  if ( intersects.length > 0 ) {

    if ( INTERSECTED != intersects[ 0 ].index ) {

      attributes.color.array[ INTERSECTED*3 ] = colorNormal.r;
      attributes.color.array[ INTERSECTED*3+1 ] = colorNormal.g;
      attributes.color.array[ INTERSECTED*3+2 ] = colorNormal.b;

      INTERSECTED = intersects[ 0 ].index;

      attributes.color.array[ INTERSECTED*3 ] = colorFloated.r;
      attributes.color.array[ INTERSECTED*3+1 ] = colorFloated.g;
      attributes.color.array[ INTERSECTED*3+2 ] = colorFloated.b;
      attributes.color.needsUpdate = true;

    }

  } else if ( INTERSECTED !== null ) {

    attributes.color.array[ INTERSECTED*3 ] = colorNormal.r;
    attributes.color.array[ INTERSECTED*3+1 ] = colorNormal.g;
    attributes.color.array[ INTERSECTED*3+2 ] = colorNormal.b;
    attributes.color.needsUpdate = true;
    INTERSECTED = null;

  }

  renderer.render( scene, camera );

}