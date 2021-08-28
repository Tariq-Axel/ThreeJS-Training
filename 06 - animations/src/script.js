import './style.css'
import * as THREE from 'three'
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 'green' })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)


//VERSION WITH TIME
// let time = Date.now();

// //Animation
// const tick = () => {
//     //We have to use time to have a universal controller. Right now it is using the framerate which can be different for each person
    
//     let currentTime = Date.now();
//     let deltaTime = currentTime-time; //In milliseconds 
//     time = currentTime;

//     mesh.rotation.y += 0.0005 * deltaTime;
//     mesh.rotation.x += 0.0005 * deltaTime;

//     renderer.render(scene, camera)
//     window.requestAnimationFrame(tick)

// }

// tick()


// //VERSION WITH CLOCK
// const clock = new THREE.Clock()

// //Animation
// const tick = () => {
//     //We have to use time to have a universal controller. Right now it is using the framerate which can be different for each person
    
//     const elapsedTime = clock.getElapsedTime(); //In seconds

//     camera.position.y = Math.sin(elapsedTime);
//     camera.position.x = Math.cos(elapsedTime);
//     camera.lookAt(mesh.position)
//     // mesh.rotation.x += Math.PI * elapsedTime;

//     renderer.render(scene, camera)
//     window.requestAnimationFrame(tick)

// }

// tick()



//VERSION WITH GSAP

gsap.to(mesh.position, {duration: 1, delay: 1, x:2})
gsap.to(mesh.position, {duration: 1, delay: 2, x:0})


//Animation
const tick = () => {
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()