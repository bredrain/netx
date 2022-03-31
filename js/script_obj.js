import * as THREE from "../build/three.module.js";

import { MTLLoader } from "../jsm/loaders/MTLLoader.js";
import { OBJLoader } from "../jsm/loaders/OBJLoader.js";
// import { OrbitControls } from "../jsm/controls/OrbitControls.js";

let camera, scene, renderer, rad = 1, angle = 0;

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

  camera = new THREE.PerspectiveCamera(45, viewWidth / viewHeight, 0.25, 20);
  camera.position.set(-5, 2, 5);
  rad = Math.sqrt(Math.pow(camera.position.x, 2) + Math.pow(camera.position.z, 2)); 

  //camera.position.z = 100;

  // scene

  scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointLight);
  scene.add(camera);
  camera.lookAt( scene.position );

  // model

  const onProgress = function (xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete, 2) + "% downloaded");
    }
  };

  new MTLLoader()
    .setPath("models/")
    .load("t8.mtl", function (materials) {
      materials.preload();

      new OBJLoader()
        .setMaterials(materials)
        .setPath("models/")
        .load(
          "t8.obj",
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
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);
  
  animate();

  function animate() {
    angle = (angle + 0.01 > Math.PI *2) ? 0 : angle +0.01; 
    camera.position.x = rad * Math.cos(angle);
    camera.position.z = rad * Math.sin(angle);;

    camera.lookAt( scene.position );
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
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
  camera.aspect = viewWidth / viewHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(viewWidth, viewHeight );

	render();
  }
  function render() {
	renderer.render(scene, camera);
  }

// function scrollHorizontally(e) {
//   e = window.event || e;
//   var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
//   document.querySelector(".slide_1_full").scrollLeft -= delta * 10; // Multiplied by 10
//   e.preventDefault();
// }
// if (document.querySelector(".slide_1_full").addEventListener) {
//   // IE9, Chrome, Safari, Opera
//   document
//     .querySelector(".slide_1_full")
//     .addEventListener("mousewheel", scrollHorizontally, false);
//   // Firefox
//   document
//     .querySelector(".slide_1_full")
//     .addEventListener("DOMMouseScroll", scrollHorizontally, false);
// } else {
//   // IE 6/7/8
//   document
//     .querySelector(".slide_1_full")
//     .attachEvent("onmousewheel", scrollHorizontally);
// }

let  last_known_scroll_position = 0;
let ticking = false;
window.addEventListener('scroll', function(e) {
  const scrollGrid = document.querySelector('.story_grid');
    console.log(scrollGrid.scrollHeight);
    console.log(scrollGrid.scrollTop);

  // last_known_scroll_position = window.scrollY;

  // if (!ticking) {
  //   window.requestAnimationFrame(function() {
  //     console.log(last_known_scroll_position);
  //     ticking = false;
  //   });

  //   ticking = true;
  // }
});
