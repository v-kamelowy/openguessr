import './style.css';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

const loadManager = new THREE.LoadingManager();
loadManager.onStart = function () {
};
loadManager.onLoad = function () {
  fadeOutEffect();
};

function fadeOutEffect() {
  var fadeTarget = document.getElementById("loader-wrapper");
  var fadeEffect = setInterval(function () {
      if (!fadeTarget.style.opacity) {
          fadeTarget.style.opacity = 1;
      }
      if (fadeTarget.style.opacity > 0) {
          fadeTarget.style.opacity -= 0.05;
      } else {
          fadeTarget.style.display = "none";
          clearInterval(fadeEffect);
      }
  }, 1);
}

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

camera.position.setZ(30);

renderer.render(scene, camera);

const earthGeometry = new THREE.SphereGeometry(6, 32, 32);

const earthTexture = new THREE.TextureLoader(loadManager).load('img/earth_day.jpg');
const earthNormal = new THREE.TextureLoader(loadManager).load('img/earth_normal.jpg');
const earthSpecular = new THREE.TextureLoader(loadManager).load('img/earth_specular.jpg');

//const earthMaterial = new THREE.MeshStandardMaterial ({map: earthTexture});
const earthMaterial = new THREE.MeshPhongMaterial ({
  map: earthTexture,
  normalMap: earthNormal,
  specularMap: earthSpecular,
  shininess: 10,
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);

scene.add(earth);

const cloudsGeometry = new THREE.SphereGeometry(6.05, 32, 32);

const cloudsTexture = new THREE.TextureLoader().load('img/earth_clouds.jpg');

var cloudsMaterial = new THREE.MeshLambertMaterial( { 
  color: 0xffffff, 
  map: cloudsTexture,                            
  depthTest  : 0,
  blending   : THREE.AdditiveBlending,
  transparent: true,
  opacity: 0.9,                                                  
  } );

const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);

scene.add(clouds);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);

const pointLight = new THREE.PointLight(0xffffff, 0.75, 0, 10);
pointLight.position.set(20, 20, 20);

scene.add(ambientLight, pointLight);

const lightHelper = new THREE.PointLightHelper(pointLight, 2);
const gridHelper = new THREE.GridHelper(200, 50);

//Pomocnicze linie
//scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
//controls.minDistance = 30;
//controls.maxDistance = 30;
controls.enableDamping = true;
controls.dampingFactor = 0.01;

function starsController() {
  const geometry = new THREE.SphereGeometry(0.025, 2, 2);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));
  star.position.set(x,y,z);
  scene.add(star);
}

Array(400).fill().forEach(starsController);

function animate(){
  requestAnimationFrame(animate);
  //earth.rotation.z += 0.001;
  earth.rotation.y += 0.001;
  clouds.rotation.y += 0.0025;
  //earth.rotation.x += 0.001;
  controls.update();
  renderer.render(scene, camera);
}

animate();

let bgMesh;
{
  const loader = new THREE.TextureLoader(loadManager);
  const texture = loader.load(
    'img/8k_milkyway.jpg',
  );
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
 
  const shader = THREE.ShaderLib.equirect;
    const material = new THREE.ShaderMaterial({
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
    side: THREE.BackSide,
  });
  material.uniforms.tEquirect.value = texture;
  const plane = new THREE.BoxBufferGeometry(200, 200, 200);
  bgMesh = new THREE.Mesh(plane, material);
  scene.add(bgMesh);
}