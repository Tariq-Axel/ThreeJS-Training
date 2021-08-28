import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {RectAreaLightHelper} from 'three/examples/jsm/helpers/RectAreaLightHelper'

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
 * Lights
 */

//LOW COST LIGHTS

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5) //Light comes from everywhere
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.05).name('ambient intensity')
// scene.add(ambientLight)

const hemispherelight = new THREE.HemisphereLight('red', 'blue', 1) // Like two suns, one below the object and one above the object
scene.add(hemispherelight)


//MODERATE COST LIGHTS

const directionallight = new THREE.DirectionalLight('green', 0.5) //Like the sun
directionallight.position.set(1,0.25,1)
gui.add(directionallight, 'intensity').min(0).max(1).step(0.05).name('directional intensity')
scene.add(directionallight)

const pointlight = new THREE.PointLight(0xffffff, 0.5) // Like a lamp that illumnates in every direction
pointlight.distance = 100 //distance at which the light works
pointlight.decay = 1 //how much of the light intensity is lost with the distance
pointlight.position.x = 2
pointlight.position.y = 3
pointlight.position.z = 4
scene.add(pointlight)

//HIGH COST LIGHTS

const rectarealight = new THREE.RectAreaLight('purple', 1, 1, 1) //Photoshoot light : color, intensity, width, height / Only works with Standard and Physical Material
rectarealight.position.z = 1;
scene.add(rectarealight)

const spotlight = new THREE.SpotLight('blue' , 0.5, 6, Math.PI * 0.1 , 0.25 , 1) //flashlight
spotlight.position.set(0,2,3)
scene.add(spotlight)
spotlight.target.position.x = -0.75 //To Rotate a spotlight you need to use the target attribute and add it to the scene
scene.add(spotlight.target)


//Helpers
const hemispherelighthelper = new THREE.HemisphereLightHelper(hemispherelight, 0.2)
scene.add(hemispherelighthelper)

const directionallighthelper = new THREE.DirectionalLightHelper(directionallight, 0.2)
scene.add(directionallighthelper)

const pointlighthelper = new THREE.PointLightHelper(pointlight, 0.2)
scene.add(pointlighthelper)

const rectarealighthelper = new RectAreaLightHelper(rectarealight, 0.2)
scene.add(rectarealighthelper)

const spotlighthelper = new THREE.SpotLightHelper(spotlight, 0.2)
scene.add(spotlighthelper)
window.requestAnimationFrame(() => {spotlighthelper.update()}) //If not, the target 

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()