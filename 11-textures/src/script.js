import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/*
*Texture
**/
//URLs
const alpha = '/textures/door/alpha.jpg';
const ambientOcclusion = '/textures/door/ambientOcclusion.jpg';
// const color = '/textures/door/color.jpg';
const color = '/textures/minecraft.png';
const height = '/textures/door/height.jpg';
const metalness = '/textures/door/metalness.jpg';
const normal = '/textures/door/normal.jpg';
const roughness = '/textures/door/roughness.jpg';

// //Using Images
// const img = new Image();
// let texture = new THREE.Texture(img);
// img.onload = () => {
//     texture.needsUpdate = true;
// }
// img.src = color;

//Using Texture loader
//loading manager to know the progress (50% of materials have been loaded for example)
const loadingmanager = new THREE.LoadingManager()
loadingmanager.onStart = () => {console.log('loading starting')}
loadingmanager.onProgress = () => {console.log('loading progressing')}
loadingmanager.onLoad = () => {console.log('loading finished')}

//You can load as many textures as you want with one loader
const textureloader = new THREE.TextureLoader(loadingmanager);
const alphatexture = textureloader.load(alpha)
const ambientOcclusiontexture = textureloader.load(ambientOcclusion)
const colortexture = textureloader.load(color)
// const heighttexture = textureloader.load(height)
// const metalnesstexture = textureloader.load(metalness)
// const normaltexture = textureloader.load(normal)
// const roughnesstexture = textureloader.load(roughness)

//We can play with textures 
// colortexture.repeat.x = 2
// colortexture.repeat.y = 3
// colortexture.wrapS = THREE.RepeatWrapping //S = X
// colortexture.wrapT = THREE.MirroredRepeatWrapping // T = Y

// colortexture.offset.x= 0.5
// colortexture.offset.y= 0.5

// colortexture.rotation = Math.PI / 4
// colortexture.center.x = 0.5
// colortexture.center.y = 0.5

//To make the texture sharper 
colortexture.minFilter = THREE.NearestFilter
colortexture.magFilter = THREE.NearestFilter //If the texture si too small

//If we are using THEE.NearestFilter on minFilter, we don't need mipmaps
colortexture.generateMipmaps = false

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
 
/**
 * Object
 */
const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
console.log(geometry.attributes.position)
const material = new THREE.MeshBasicMaterial({ map : colortexture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()