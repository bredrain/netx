import * as THREE from "../build/three.module.js";

//import { OrbitControls } from "../jsm/controls/OrbitControls.js";
import { GLTFLoader } from "../jsm/loaders/GLTFLoader.js";
//import { RGBELoader } from "./jsm/loaders/RGBELoader.js";
//import { RoughnessMipmapper } from "./jsm/utils/RoughnessMipmapper.js";

import LocomotiveScroll from '../build/locomotive-scroll.esm.js';

//(function () {
 // document.addEventListener('DOMContentLoaded', function(){
window.addEventListener("load", function () {
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

  const viewWidth =  parent.clientWidth;
  const viewHeight = viewWidth/window.devicePixelRatio;//parent.clientHeight;
  
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
    // angle = angle + 0.01 > Math.PI * 2 ? 0 : angle + 0.01;
    // camera.position.x = rad * Math.cos(angle);
    // camera.position.z = rad * Math.sin(angle);

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

  const viewWidth =  parent.clientWidth;
  const viewHeight = viewWidth/window.devicePixelRatio;//parent.clientHeight;

  camera.aspect = viewWidth / viewHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(viewWidth, viewHeight);
}
function render() {
  renderer.render(scene, camera);
}


const pageContainer = document.querySelector('[data-scroll-container]');

/* SMOOTH SCROLL */
const scrollerNew = new LocomotiveScroll({
  el: pageContainer,
  smooth: true
});


scrollerNew.on("scroll", ScrollTrigger.update);

ScrollTrigger.scrollerProxy(pageContainer, {
  scrollTop(value) {
    return arguments.length
      ? scrollerNew.scrollTo(value, 0, 0)
      : scrollerNew.scroll.instance.scroll.y;
  },
  getBoundingClientRect() {
    return {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };
  },
  pinType: pageContainer.style.transform ? "transform" : "fixed"
});

//window.addEventListener("load", function () {
  let pinBoxes = document.querySelectorAll(".slide_1_full > *");
  let pinWrap = document.querySelector(".slide_1_full");
  let pinWrapWidth = pinWrap.offsetWidth;
  let horizontalScrollLength = pinWrapWidth - window.innerWidth;

  // Pinning and horizontal scrolling

  gsap.to(".slide_1_full", {
    scrollTrigger: {
      scroller: pageContainer, //locomotive-scroll
      scrub: true,
      trigger: "#full_contain",
      pin: true,
      // anticipatePin: 1,
      start: "top top",
      end: pinWrapWidth
    },
    x: -horizontalScrollLength,
    ease: "none"
  });

  ScrollTrigger.addEventListener("refresh", () => scrollerNew.update()); //locomotive-scroll

  ScrollTrigger.refresh();
  //scrollerNew.update()
//});

  });
//})();