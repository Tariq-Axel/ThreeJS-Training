import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'




/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Textures
 */
 const textureloader = new THREE.TextureLoader()
 const bakedshadow = textureloader.load('/textures/bakedShadow.jpg')
 
 const simpleshadow = textureloader.load('/textures/simpleShadow.jpg')
 const sphereshadow = new THREE.Mesh(
     new THREE.PlaneBufferGeometry(1.5,1.5),
     new THREE.MeshBasicMaterial({
         color: 0x000000,
         transparent: true,
         alphaMap : simpleshadow
     })
 )
 sphereshadow.rotation.x = -Math.PI*0.5
 sphereshadow.position.y = -0.49
 scene.add(sphereshadow)


/**
 * Lights 
 */
// Ambient light : Don't cast Shadow
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)

directionalLight.castShadow = true //Activate shadows

directionalLight.shadow.mapSize.width = 1024 //Give a better resolution to the shadow
directionalLight.shadow.mapSize.height = 1024 //Give a better resolution to the shadow
//Get a camera focused only on the object perimeter  to not waste performance
directionalLight.shadow.camera.near = 1 
directionalLight.shadow.camera.far = 6 
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.radius = 10 //Doesn't work with PCFSoftShadowMap algorithm on the renderer shadow

const spotlight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3)
spotlight.castShadow = true
spotlight.shadow.mapSize.width = 1024
spotlight.shadow.mapSize.height = 1024
spotlight.shadow.camera.near = 1
spotlight.shadow.camera.far = 6
spotlight.position.set(0,2,2)
scene.add(spotlight)
scene.add(spotlight.target)

const pointlight = new THREE.PointLight(0xffffff, 0.3)
pointlight.castShadow = true
pointlight.shadow.mapSize.width=1024
pointlight.shadow.mapSize.height=1024
pointlight.shadow.camera.near=0.1
pointlight.shadow.camera.far=5
pointlight.position.set(-1,1, 0)
scene.add(pointlight)

//ONLY DIRECTIONAL, POINT & SPOT LIGHT CAN CAST SHADOW

//Helper
const directionallighthelper = new THREE.DirectionalLightHelper(directionalLight, 0.2); //Normal
scene.add(directionallighthelper)
const spotlighthelper = new THREE.SpotLightHelper(spotlight, 0.2)
scene.add(spotlighthelper)

// const directionallightshadowhelper = new THREE.CameraHelper(directionalLight.shadow.camera, 0.2); //Shadow
// scene.add(directionallightshadowhelper)
// const spotlightcamerahelper = new THREE.CameraHelper(spotlight.shadow.camera, 0.2); //Shadow
// scene.add(spotlightcamerahelper)
// const pointlightcamerahelper = new THREE.CameraHelper(pointlight.shadow.camera, 0.2); //Shadow
// scene.add(pointlightcamerahelper)


/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true
sphere.receiveShadow = false // don't need to write this because it's the default value

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(5, 5), 
    material
    // new THREE.MeshBasicMaterial({map:bakedshadow})
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
plane.receiveShadow = true

scene.add(sphere, plane)

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
camera.position.z = 2
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

renderer.shadowMap.enabled = false//Shadow renderer
renderer.shadowMap.type = THREE.PCFSoftShadowMap //Another algorithm to have a better shadow but less performance

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update the sphere
    sphere.position.x = Math.sin(elapsedTime*Math.PI/2.8) * 1.5
    sphere.position.z = Math.cos(elapsedTime*Math.PI/2.8)
    sphere.position.y = Math.abs(Math.sin(elapsedTime*3*Math.PI/2.8))
    sphereshadow.position.x = Math.sin(elapsedTime*Math.PI/2.8) * 1.5
    sphereshadow.position.z = Math.cos(elapsedTime*Math.PI/2.8)
    sphereshadow.material.opacity = (1 - sphere.position.y) * 0.3

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()