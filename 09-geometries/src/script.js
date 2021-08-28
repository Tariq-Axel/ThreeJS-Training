import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { BufferAttribute, Face } from 'three'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Sizes
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
*Object
**/
//Vertices
let vertices = [];

for(let i=0; i < (5000*3); i++){
    vertices.push((Math.random()-0.5),(Math.random()-0.5),(Math.random()-0.5))
}

//BufferAttribute + BufferGeometry
let bufferattribute = new THREE.BufferAttribute(new Float32Array(vertices), 3);
let geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', bufferattribute)

//MESH = Geometry + Material
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 , wireframe:true})
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

/*
*Render and Animate the Camera
**/
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()