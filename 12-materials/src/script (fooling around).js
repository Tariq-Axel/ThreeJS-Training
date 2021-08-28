import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'

import * as dat from 'dat.gui'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 'skyblue' );
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/*
* Textures
**/
const textureloader = new THREE.TextureLoader();
const doorAlphaTexture = textureloader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureloader.load('/textures/door/ambientOcclusion.jpg');
const doorColorTexture = textureloader.load('/textures/door/color.jpg');
const doorHeightTexture = textureloader.load('/textures/door/height.jpg');
const doorMetalnessTexture = textureloader.load('/textures/door/metalness.jpg');
const doorNormalTexture = textureloader.load('/textures/door/normal.jpg');
const doorRoughnessTexture = textureloader.load('/textures/door/roughness.jpg');

const gradientTexture = textureloader.load('/textures/gradients/3.jpg');
const matcapTexture = textureloader.load('/textures/matcaps/3.png');

/*
* Lights
**/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = pointLight.position.y = pointLight.position.z = 1
scene.add(pointLight)

/**
 * Objects
 */
//Material
// const material = new THREE.MeshBasicMaterial()
//__
// material.wireframe=true;
// material.opacity = 0.5
// material.side = THREE.DoubleSide
//_____
// material.transparent = true
// material.alphaMap = doorAlphaTexture
// //_____
// material.map = doorColorTexture


// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true


const material= new THREE.MeshMatcapMaterial();
material.matcap = matcapTexture;

// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial()

const materialplane = new THREE.MeshPhongMaterial()
materialplane.shininess=100
materialplane.specular = new THREE.Color(0xff0000)

// const material = new THREE.MeshToonMaterial()
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false
// material.gradientMap = gradientTexture

// const materialplane = new THREE.MeshStandardMaterial();
// materialplane.metalness = 0.45
// materialplane.roughness = 0.65




//Sphere
const sphereGeo = new THREE.SphereBufferGeometry(0.5, 16, 16)
const sphereMesh = new THREE.Mesh(sphereGeo, material);
sphereMesh.position.x = 3
scene.add(sphereMesh)
//Plane
const planeGeo = new THREE.PlaneBufferGeometry(1000,1000)
const planeMesh = new THREE.Mesh(planeGeo, materialplane);
planeMesh.rotation.x = Math.PI*1.50;
planeMesh.position.y = -0.50;
scene.add(planeMesh)
//Torus
const torusGeo = new THREE.TorusBufferGeometry(0.3,0.2,16,32)
const torusMesh = new THREE.Mesh(torusGeo, material);
torusMesh.position.x = -3
scene.add(torusMesh)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -4
camera.position.y = 0.75
camera.position.z = 0.5
camera.rotation.y = Math.PI*1.5
scene.add(camera)




/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Controls
 */


const controls = new PointerLockControls(camera, renderer.domElement)
// controls.enableDamping = true
controls.addEventListener( 'lock', function () {console.log("lock")} );
controls.addEventListener( 'unlock', function () {console.log("unlock")} );
document.addEventListener('click', () => {controls.connect();controls.lock()})

// Controls
let up = false
let down = false
let right = false;
let left = false
document.addEventListener('keydown',(event) => {
    switch (event.code) {
        case 'KeyW': up = true; break;
        case 'KeyA': left= true ; break;
        case 'KeyS': down= true ; break;
        case 'KeyD': right= true; break;
    }
})
document.addEventListener('keyup',(event) => {
    switch (event.code) {
        case 'KeyW': up   =false; break;
        case 'KeyA': left =false; break;
        case 'KeyS': down =false; break;
        case 'KeyD': right=false; break;
    }
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update objects positions
    // planeMesh.rotation.x = elapsedTime * 0.1;
    // planeMesh.rotation.y = elapsedTime * 0.15;
    // sphereMesh.rotation.x = elapsedTime * 0.1;
    // sphereMesh.rotation.y = elapsedTime * 0.15;
    // torusMesh.rotation.x = elapsedTime * 0.1;
    // torusMesh.rotation.y = elapsedTime * 0.15;

    // Update controls
    // controls.update()
    if(up){controls.moveForward(1); console.log("up"); torusMesh.position.x += 1; torusMesh.updateMatrix()}
    if(down){controls.moveForward(-1); console.log("down"); torusMesh.position.x -= 1; camera.position.x -=1}
    // if(right){controls.moveRight(1); console.log("right")}
    // if(left){controls.moveRight(-1); console.log("left")}

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()




/*
* DEBUG
**/
// const gui = new dat.GUI();
// const materialConf = gui.addFolder("Material")
// materialConf.add(materialplane, "metalness", 0, 1, 0.01)
// materialConf.add(materialplane, "roughness", 0, 1, 0.01)