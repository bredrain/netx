import * as THREE from "../build/three.module.js";

import { OrbitControls } from "../jsm/controls/OrbitControls.js";
import { GLTFLoader } from "../jsm/loaders/GLTFLoader.js";
//import { RGBELoader } from "./jsm/loaders/RGBELoader.js";
//import { RoughnessMipmapper } from "./jsm/utils/RoughnessMipmapper.js";

let camera,
  scene,
  renderer,
  angle = 0,
  rad = 1;
let renderRequested = false;
init();

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
  camera.position.set(-5, 1, 5);
  rad = Math.sqrt(
    Math.pow(camera.position.x, 2) + Math.pow(camera.position.z, 2)
  );

  scene = new THREE.Scene();

  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  const loader = new GLTFLoader().setPath("models/gltf/timeship/");

  loader.load("t7.gltf", function (gltf) {
    scene.add(gltf.scene);
    render();
  });

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(viewWidth, viewHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  render();
  animate();

  function animate() {
    angle = angle + 0.01 > Math.PI * 2 ? 0 : angle + 0.01;
    camera.position.x = rad * Math.cos(angle);
    camera.position.z = rad * Math.sin(angle);

    camera.lookAt(0, 2, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  const parent = document.querySelector("#slide_1_scene");
  if (!parent) {
    return;
  }

  const viewHeight = parent.clientHeight;
  const viewWidth = parent.clientWidth;

  camera.aspect = viewWidth / viewHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(viewWidth, viewHeight);
}
function render() {
  renderer.render(scene, camera);
}

// function scrollWheel(e) {
//   e = window.event || e;
//   var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
//   console.log("---D---", delta);
//   document.querySelector(".slide_1_full").scrollLeft -= delta * 10; // Multiplied by 10
//   e.preventDefault();
// }
function scrollHandler(e) {
  e = window.event || e;
  //console.log(e)
  let delta = 0;
  let step = 0;
  if (e.type == 'keydown' ) {

  } else if ( e.type == 'wheel' ||  e.type == 'DOMMouseScroll' || e.type == 'onmousewheel') {
    delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
    step = Math.abs(e.deltaY);
    //console.log(step);
  }
  const scrollGrid = document.querySelector(".story_grid");
  const scrollFull = document.querySelector(".slide_1_full");

  if (delta == 1 || e.code === "ArrowUp") {
    //console.log('ArrUp')
    if (
      scrollFull.getBoundingClientRect().top > 0 &&
      scrollFull.getBoundingClientRect().top < window.innerHeight &&
      scrollFull.getBoundingClientRect().bottom > 0 &&
      scrollFull.getBoundingClientRect().bottom < window.innerHeight &&
      scrollFull.scrollLeft > 0
    ) {
      scrollFull.scrollLeft -= 50;
      e.preventDefault();
    } else if (  scrollGrid.getBoundingClientRect().top > 0 &&
      scrollGrid.getBoundingClientRect().top < window.innerHeight &&    
      scrollGrid.scrollTop  > 0) {
      scrollGrid.scrollTop -= 20;
      e.preventDefault();
    } else if (
      scrollFull.getBoundingClientRect().top < 0 &&
      scrollFull.getBoundingClientRect().top < window.innerHeight &&
      scrollFull.getBoundingClientRect().bottom > 0 &&
      scrollFull.getBoundingClientRect().bottom < window.innerHeight 
    ) {
      window.scrollBy(0, -20);
      e.preventDefault();
    }else if (step > scrollFull.clientHeight/2) {
      window.scrollBy(0, -50);
      e.preventDefault();
    }
  }
  if (delta == -1 || e.code === "ArrowDown") {
    //console.log('ArrDown')
    if (
      scrollGrid.getBoundingClientRect().top > 0 &&
      scrollGrid.getBoundingClientRect().top < window.innerHeight &&      
      Math.floor(
        scrollGrid.scrollHeight -
          scrollGrid.scrollTop -
          scrollGrid.clientHeight) >
          0      
    ) {
      scrollGrid.scrollTop += 20;
      e.preventDefault();
    } else if (
      scrollFull.getBoundingClientRect().top > 0 &&
      scrollFull.getBoundingClientRect().top < window.innerHeight &&
      scrollFull.getBoundingClientRect().bottom > 0 &&
      scrollFull.getBoundingClientRect().bottom < window.innerHeight &&
      Math.floor(
        scrollFull.scrollWidth - scrollFull.scrollLeft - scrollFull.clientWidth
      ) > 0
    ) {
      scrollFull.scrollLeft += 50;
      e.preventDefault();
    } else if (
      scrollFull.getBoundingClientRect().top > 0 &&
      scrollFull.getBoundingClientRect().top < window.innerHeight &&
      scrollFull.getBoundingClientRect().bottom > 0 &&
      scrollFull.getBoundingClientRect().bottom > window.innerHeight 
    ) {
      
        window.scrollBy(0, 20);
        e.preventDefault();      
    } else if (step > scrollFull.clientHeight/2) {
      window.scrollBy(0, 50);
      e.preventDefault();
    }
  }
  // var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

  // document.querySelector('.slide_1_full').scrollLeft -= (delta*10); // Multiplied by 10
  // e.preventDefault();
}
// if (document.querySelector(".slide_1_full").addEventListener) {
//   // IE9, Chrome, Safari, Opera
//   document
//     .querySelector(".slide_1_full")
//     .addEventListener("mousewheel", scrollHandler, false);
//   // Firefox
//   document
//     .querySelector(".slide_1_full")
//     .addEventListener("DOMMouseScroll", scrollHandler, false);
// } else {
//   // IE 6/7/8
//   document
//     .querySelector(".slide_1_full")
//     .attachEvent("onmousewheel", scrollHandler);
// }


if (window.addEventListener) {
  // IE9, Chrome, Safari, Opera
  window.addEventListener("wheel", scrollHandler, {passive: false});
  // Firefox
  window.addEventListener("DOMMouseScroll", scrollHandler, {passive: false});
} 


// let last_known_scroll_position;
// let ticking = false;

// const scrollGrid = document.querySelector(".story_grid");

//scrollGrid.addEventListener("scroll", function (e) {
  // console.log("--H--", scrollGrid.scrollHeight);
  // console.log("--T--", scrollGrid.scrollTop);
  // let res = Math.floor(
  //   scrollGrid.scrollHeight - scrollGrid.scrollTop - scrollGrid.clientHeight
  // );
  // console.log("--R--", res);
  // last_known_scroll_position = window.scrollY;

  // if (!ticking) {
  //   window.requestAnimationFrame(function() {
  //     console.log(last_known_scroll_position);
  //     ticking = false;
  //   });

  //   ticking = true;
  // }
//});

window.addEventListener("keydown", scrollHandler);
