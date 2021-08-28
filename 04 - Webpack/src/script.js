import './style.css'
import * as THREE from "three";

const scene = new THREE.Scene();

//Cube
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color:0xff0000}); //color can be expressed in multiple ways : 0xFFF, '#FFF', 'red', Color class
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//Camera
const rendersizes = {
    width: 800,
    height: 600
}
//Camera parameters : 
// FOV (field of view) : vertical vision angle in degrees (usually : 45 or 55)
// The Aspect Ratio : width/height of the render
const camera = new THREE.PerspectiveCamera(75,  rendersizes.width/rendersizes.height); 
scene.add(camera)

//Move our objects
camera.position.z = 3;
camera.position.y = 3;
camera.rotation.x=-0.5;

//Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize(rendersizes.width, rendersizes.height); //It adjusts automatically the canvas
renderer.render(scene,camera);

