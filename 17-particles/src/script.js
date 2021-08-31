import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'
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
const textureLoader = new THREE.TextureLoader()
const particulestexture = textureLoader.load('/textures/particles/2.png')
/**
 * Particles
 */

 const particlesGeo = new THREE.BufferGeometry()
 const particlesMat = new THREE.PointsMaterial({
     size:0.1, 
     sizeAttenuation:true //So that particles are bigger when close to the camera and smaller when far from the camera
 })
 particlesMat.color = new THREE.Color('#ff88cc')
 particlesMat.alphaMap = particulestexture; 
 particlesMat.transparent=true;
 particlesMat.alphaTest = 0.001; //To hide the black background of the png image
//  particlesMat.depthTest = false //To tell webgl to not care about what is in front of what, Let's not do that because it can create bugs
particlesMat.depthWrite=false //to tell webgl to test depth but not write particles in the depth buffer so that between particles we don't care about depth
particlesMat.blending = THREE.AdditiveBlending //When particles are above the other we add the colors (a particle behing another one will make the color of the particle 2 times shinier)
particlesMat.vertexColors = true //To be able to set the attribute color (line below)

 const numberOfPoints = 5000;
 const vertices = new Float32Array(numberOfPoints*3)
 const colors = new Float32Array(numberOfPoints*3)
 for(let i = 0 ; i < numberOfPoints * 3; i++) {
    vertices[i] = (Math.random()-0.5) * 6
    colors[i] = (Math.random())
 }
 particlesGeo.setAttribute( 'position', new THREE.BufferAttribute(vertices, 3 ) );
 particlesGeo.setAttribute( 'color', new THREE.BufferAttribute(colors, 3 ) )

 
 const particles = new THREE.Points(particlesGeo,particlesMat)
 scene.add(particles)

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

    //Update particles
    // *** Snow
    // particles.position.y = -elapsedTime*0.2; 

    // *** Waves / Flag : BAD SOLUTION BECAUSE UPDATING TOO MANY ARRAY ELEMENTS, THE GOOD WAY IS BY USING A CUSTOM SHADER
    for(let i = 0; i<numberOfPoints*3; i+=3){
        const x = particlesGeo.attributes.position.array[i]
        particlesGeo.attributes.position.array[i+1] = Math.sin(elapsedTime+x)
    }
    particlesGeo.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()