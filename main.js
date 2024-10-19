
import './style.css'
import * as Three from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import gsap from 'gsap'
// scene 
const scene = new Three.Scene();

// camera 
const camera = new Three.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 200)
camera.position.z = 4;




// renderer

const renderer = new Three.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
  antialias: true,
})


// To Get Great performance without sacrificing the resources 
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = Three.ACESFilmicToneMapping
renderer.toneMappingExposure = 1;
renderer.outputEncoding = Three.sRGBEncodig;




const pmremGenerator = new Three.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

let model;
new RGBELoader().load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/st_peters_square_night_4k.hdr', function (texture) {
  const envMap = pmremGenerator.fromEquirectangular(texture).texture
  scene.environment = envMap
  texture.dispose()
  pmremGenerator.dispose()


  const loader = new GLTFLoader();
  loader.load('./DamagedHelmet.gltf', (gltf) => {
    model = gltf.scene
    scene.add(model)
  }, undefined,)
})


window.addEventListener("mousemove", (e) => {
  if (model) {
    const rotationX = (e.clientX / window.innerWidth - .5) * (Math.PI * 0.3);
    const rotationY = (e.clientY / window.innerHeight - .5) * (Math.PI * 0.3);
    gsap.to(model.rotation, {
      x: rotationY,
      y: rotationX,
      duration: 0.9,
      ease: "power2.out"
    })
  }
})


window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
  // composer.setSize(window.innerWidth, window.innerHeight)
})

function animate() {
  window.requestAnimationFrame(animate);

  renderer.render(scene, camera)
}

animate();

