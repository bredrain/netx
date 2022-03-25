import * as THREE from "../build/three.module.js";

      import { OrbitControls } from "../jsm/controls/OrbitControls.js";
      import { GLTFLoader } from "../jsm/loaders/GLTFLoader.js";
      //import { RGBELoader } from "./jsm/loaders/RGBELoader.js";
      //import { RoughnessMipmapper } from "./jsm/utils/RoughnessMipmapper.js";

      let camera, scene, renderer;

      init();
      render();

      function init() {
        const container = document.createElement("div");
        const parent = document.querySelector('#slide_1_scene')
        if (!parent) {
          return;
        }

        const viewHeight = parent.clientHeight;
        const viewWidth = parent.clientWidth;
        parent.appendChild(container);

        camera = new THREE.PerspectiveCamera(
          45,
          viewWidth / viewHeight,
          0.25,
          20
        );
        camera.position.set(-1.8, 0.6, 2.7);

        scene = new THREE.Scene();

        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);

        const loader = new GLTFLoader().setPath("models/gltf/Duck/gLTF/");
        loader.load("Duck.gltf", function (gltf) {
          scene.add(gltf.scene);
          render();
        });

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
        controls.target.set(0, 0, -0.2);
        controls.autoRotate = true;
		    controls.autoRotateSpeed =60;
		    animate();
        function animate() {
          requestAnimationFrame(animate);

          controls.update();

          renderer.render(scene, camera);
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
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        document.querySelector('.slide_1_full').scrollLeft -= (delta*10); // Multiplied by 10
        e.preventDefault();
    }
    if (document.querySelector('.slide_1_full').addEventListener) {
        // IE9, Chrome, Safari, Opera
        document.querySelector('.slide_1_full').addEventListener("mousewheel", scrollHorizontally, false);
        // Firefox
        document.querySelector('.slide_1_full').addEventListener("DOMMouseScroll", scrollHorizontally, false);
    } else {
        // IE 6/7/8
        document.querySelector('.slide_1_full').attachEvent("onmousewheel", scrollHorizontally);
    }