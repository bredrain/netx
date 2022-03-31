import * as THREE from "../build/three.module.js";

import { MTLLoader } from "../jsm/loaders/MTLLoader.js";
import { OBJLoader } from "../jsm/loaders/OBJLoader.js";
import { OrbitControls } from "../jsm/controls/OrbitControls.js";

let camera, scene, renderer;

let mouseX = 0,
  mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

init();
//animate();

function init() {
  const container = document.createElement("div");
  const parent = document.querySelector("#slide_1_scene");
  if (!parent) {
    return;
  }
  const viewHeight = parent.clientHeight;
  const viewWidth = parent.clientWidth;
  parent.appendChild(container);

  camera = new THREE.PerspectiveCamera(45, viewWidth / viewHeight, 0.25, 2000);
  camera.position.set(-30, 20, 20);
  //camera.position.z = 100;

  // scene

  scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointLight);
  scene.add(camera);

  // model

  const onProgress = function (xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete, 2) + "% downloaded");
    }
  };

  new MTLLoader()
    .setPath("models/")
    .load("timeship.0.6.mtl", function (materials) {
      materials.preload();

      new OBJLoader()
        .setMaterials(materials)
        .setPath("models/")
        .load(
          "timeship.0.6.obj",
          function (object) {
            //object.position.y = - 95;
            scene.add(object);
          },
          onProgress
        );
    });

  //

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(viewWidth, viewHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render); // use if there is no animation loop
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.target.set(0, 0, 0);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 60;
  //controls.enabled = false;
  
  var prevEpoch = Date.now();
  const frameTime = 40; // ~24fps, set 15 for 60fps
  animate();

  function animate() {
    // requestAnimationFrame(animate);
    // controls.update();
    // renderer.render(scene, camera);
   
    var epoch = Date.now();
    var delta = epoch - prevEpoch;
    prevEpoch = epoch;
    // Draw!
    renderer.render(scene, camera);
    // Schedule the next frame.
    if (delta > frameTime) {
      controls.update();
      requestAnimationFrame(animate);
    } else {
      window.setTimeout(animate, frameTime - delta);
    }
    
  }

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
	const parent = document.querySelector('#slide_1_scene')
	if (!parent) {
	  return;
	}

	const viewHeight = parent.clientHeight;
	const viewWidth = parent.clientWidth;

	camera.aspect = viewHeight / viewWidth;
	camera.updateProjectionMatrix();

	renderer.setSize(viewHeight, viewWidth);

	render();
  }
  function render() {
	renderer.render(scene, camera);
  }

function scrollHorizontally(e) {
  e = window.event || e;
  var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
  document.querySelector(".slide_1_full").scrollLeft -= delta * 10; // Multiplied by 10
  e.preventDefault();
}
if (document.querySelector(".slide_1_full").addEventListener) {
  // IE9, Chrome, Safari, Opera
  document
    .querySelector(".slide_1_full")
    .addEventListener("mousewheel", scrollHorizontally, false);
  // Firefox
  document
    .querySelector(".slide_1_full")
    .addEventListener("DOMMouseScroll", scrollHorizontally, false);
} else {
  // IE 6/7/8
  document
    .querySelector(".slide_1_full")
    .attachEvent("onmousewheel", scrollHorizontally);
}
