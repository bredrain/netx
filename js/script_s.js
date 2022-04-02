import * as THREE from "../build/three.module.js";

//import { OrbitControls } from "../jsm/controls/OrbitControls.js";
import { GLTFLoader } from "../jsm/loaders/GLTFLoader.js";
//import { RGBELoader } from "./jsm/loaders/RGBELoader.js";
//import { RoughnessMipmapper } from "./jsm/utils/RoughnessMipmapper.js";

//import LocomotiveScroll from '../build/locomotive-scroll.esm.js';

//(function () {
 // document.addEventListener('DOMContentLoaded', function(){
window.addEventListener("load", function () {
let camera,
  scene,
  renderer,
  angle = 0,
  rad = 1;
let renderRequested = false;
//init();

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

gsap.to("#left_slide", {
  scrollTrigger: {
    //scroller: "#scroll_cont", 
    trigger: "#right_slide",
    pin: "#left_slide",
    // anticipatePin: 1,
    start: "top "+ document.querySelector('header').clientHeight,
    end: () => "+=" + (document.querySelector('#right_col').offsetHeight - document.querySelector('.heading').offsetHeight - document.querySelector('.slide1_canvas').offsetHeight), //- document.querySelector('#left_slide').offsetHeight
    markers: true
  }
  
});

  let pinBoxes = document.querySelectorAll(".slide_1_full .rotate"); 
  let pinFull = document.querySelector(".slide_1_full");
  let pinWrap = document.querySelector(".scrl_container");
  let pinWrapWidth = pinWrap.offsetWidth;
  let horizontalScrollLength = pinWrapWidth - window.innerWidth;


// gsap.to(".slide_1_full", {
//   scrollTrigger: {
//     //scroller: "#scroll_cont",
//     // scrub: true,
//     trigger: "#full_contain",
//     pin: ".slide_1_full",
//     // anticipatePin: 1,
//     start: "bottom bottom",
//     end: pinWrapWidth,
//     markers: true
//   },
//   x: -horizontalScrollLength,
//   ease: "none"
// });

// let st = ScrollTrigger.create({
//   trigger: "#right_col",
//   pin: "#left_slide",
//   start: "top top",
//   end: "+=500"
// });

 const margin = 0.3;
  if ((typeof(pinFull) != 'undefined' && pinFull != null)) {
    let sections = gsap.utils.toArray('.rotate');
    gsap.to(sections, {
      //xPercent: -100 * (sections.length - 1),
      x: -(pinFull.offsetWidth - pinWrap.clientWidth) ,
      ease: "none",
      scrollTrigger: {
        trigger: pinFull,
        markers: true,
        scrub: 1,
        pin: true,
        onUpdate: self => {

          console.log("progress:", self.progress);
          const progress = self.progress;
          let scale;
          if (progress == 0 || progress == 1) {
            scale =1
          } else if (progress > margin && progress < (1 - margin) ) {
            scale =0;
          } else if (progress <= margin) {  
            scale = 1- progress/margin;
          } else  if (progress >= (1- margin)) {
            scale = (progress -1 +margin)/margin;
          }
          console.log("scale:", scale);
          document.querySelector('.fly_obj').style.transform = "scale(" + scale + ") translateY(-50%)";
        },
        //snap: 1 / (sections.length - 1),
        start: "top 20%",
        end: () => "+=" + (pinFull.offsetHeight + this.window.innerHeight * 0.2) 
      },
    });
  }


  });
