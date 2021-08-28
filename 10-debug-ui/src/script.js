import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

import * as dat from 'dat.gui'


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

//Parameters
let boxParameters = { 
    color: 0xff0000,
    spin: () => {gsap.to(mesh.rotation, {duration : 1, y : mesh.rotation.y + Math.PI * 2})}
}

//Instanciation
const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial(boxParameters)
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
camera.position.z = 3
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




/*
* Debug
**/ 
const gui = new dat.GUI()
let folder = gui.addFolder("Positions")
folder.add(mesh.position, 'x').min(- 3).max(3).step(0.01).name("redbox - x")
folder.add(mesh.position, 'y').min(- 3).max(3).step(0.01).name("redbox - y")
folder.add(mesh.position, 'z').min(- 3).max(3).step(0.01).name("redbox - z")
folder.add(boxParameters, 'spin')

let folder2 = gui.addFolder("Material")
folder2.add(mesh, 'visible').name("redbox - visible");
folder2.add(mesh.material, 'wireframe').name("redbox - wiref");
folder2.addColor(boxParameters, 'color').onChange(() => {mesh.material.color.set(boxParameters.color)})