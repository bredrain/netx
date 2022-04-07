import * as THREE from "../build/three.module.js";

import { OrbitControls } from "../jsm/controls/OrbitControls.js";
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
  controls,
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

  const headMain = document.querySelector('.main_header');
  const headBlock = document.querySelector('.heading');
  const button = document.querySelector('.book_button');
  if (!headMain || !headBlock || !button) {  
    return;
  }   
  const viewWidth =  parent.clientWidth;
  //const viewHeight = viewWidth/window.devicePixelRatio;//parent.clientHeight;
  const viewHeight = window.innerHeight - headMain.clientHeight - headBlock.clientHeight- button.clientHeight;
  parent.appendChild(container);

  camera = new THREE.PerspectiveCamera(45, viewWidth / viewHeight, 0.25, 20);
  camera.position.set(-5, 0, 5);
  // rad = Math.sqrt(
  //   Math.pow(camera.position.x, 2) + Math.pow(camera.position.z, 2)
  // );
  

  scene = new THREE.Scene();

  const color = 0x10BFE3;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  // const pointLight = new THREE.PointLight(0xffffff, 0.8);
  // camera.add(pointLight);
  // scene.add(camera);
  // camera.lookAt( scene.position );



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

  const controls = new OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render ); // use if there is no animation loop
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.enablePan = false;
  controls.enableZoom = false;
  // controls.minAzimuthAngle = 0;
  // controls.maxAzimuthAngle = 0;
  controls.minPolarAngle = Math.PI /2;
  controls.maxPolarAngle = Math.PI /2;
  //controls.position.set(-15, 1, 15);
  controls.target.set( 0, 1, 0 );
  controls.update();

  render();
 // animate();

  function animate() {
    // angle = angle + 0.01 > Math.PI * 2 ? 0 : angle + 0.01;
    // camera.position.x = rad * Math.cos(angle);
    // camera.position.z = rad * Math.sin(angle);
     //camera.lookAt(0, 2, 0);


    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  //window.addEventListener("resize", onWindowResize);
  let observer = new ResizeObserver(doResize);
  const node = document.querySelector('#slide_1_scene');
  const config = {
    attributes: true,
    childList: true,
    subtree: true
};
  observer.observe(node, config);

}

function doResize(entries) {

  // entries.forEach(entry => {
  //   console.log('width', entry.contentRect.width);
  //   console.log('height', entry.contentRect.height);
  // });

  const parent = document.querySelector("#slide_1_scene");
  if (!parent) {
    return;
  }
  const headMain = document.querySelector('.main_header');
  const headBlock = document.querySelector('.heading');
  const button = document.querySelector('.book_button');
  if (headMain && headBlock && button) {

  const viewWidth =  parent.clientWidth;
  const viewHeight = window.innerHeight - headMain.clientHeight - headBlock.clientHeight- button.clientHeight;
  //const viewHeight = viewWidth/window.devicePixelRatio;//parent.clientHeight;

  camera.aspect = viewWidth / viewHeight;
 
  camera.updateProjectionMatrix();
 
  renderer.setSize(viewWidth, viewHeight);
  //controls.update();
  render();
  }
}


//var doTimer;
// function onWindowResize() {
//   clearTimeout(doTimer);
//   doTimer = setTimeout(doResize, 300);
// }
function render() {
  renderer.render(scene, camera);
}

gsap.to("#left_slide", {
  scrollTrigger: {
    //scroller: "#scroll_cont", 
    trigger: "#right_slide",
    pin: "#left_slide",
    scrub: 1,
    // anticipatePin: 1,
    start: "top "+ document.querySelector('header').clientHeight,
    end: () => "+=" + (document.querySelector('#right_col').offsetHeight - document.querySelector('.heading').offsetHeight - document.querySelector('.slide1_canvas').offsetHeight - document.querySelector('.book_button').offsetHeight ), //- document.querySelector('#left_slide').offsetHeight
    markers: true, //for tests
    invalidateOnRefresh: true 
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
console.log(pinFull.offsetWidth - this.window.innerWidth);
 const margin = 0.3;
  if ((typeof(pinFull) != 'undefined' && pinFull != null)) {
    let sections = gsap.utils.toArray('.rotate');
    gsap.to(sections, {
      //xPercent: -100 * (sections.length - 1),
      x: -(pinFull.offsetWidth - pinWrap.clientWidth) ,
      ease: "none",
      scrollTrigger: {
        trigger: pinFull,
        markers: true, // for tests
        invalidateOnRefresh: true ,
        scrub: 1,
        pin: true,
        onUpdate: self => {

          //console.log("progress:", self.progress);
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
          //console.log("scale:", scale);
          document.querySelector('.fly_obj').style.transform = "translateY(-50%) scale(" + scale + ")";
        },
        //snap: 1 / (sections.length - 1),
        start: "top 20%",
        end: () => "+=" + (pinFull.offsetWidth - this.window.innerWidth) 
      },
    });
  }

  
  const persons = document.querySelectorAll('.person');
  const testimonials =document.querySelector('.testimonials');
  if (testimonials) {
    testimonials.addEventListener('click', (event) => {
      if (event.target.closest(".person")) {
        console.log('---ID---', event.target.closest(".person").id);
      }
    });
  } 






  const calendar = new HelloWeek({
    selector: '#ticket_calendar',
    nav: ['', ''],
    onSelect: (arg_select) => { console.log(arg_select) },
    onNavigation: (arg_nav) => { 
      console.log('Current Month: ', calendar.getMonth());
        console.log('Current Year: ', calendar.getYear());
     }, 
   // beforeCreateDay: (data) => {console.log(data)},
    //lang: 'it',
    todayHighlight: true,
});

  });
