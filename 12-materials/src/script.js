import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

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
//Object textures
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

//Environment map textures
const cubetextureloader = new THREE.CubeTextureLoader();
const environmentmaptexture = cubetextureloader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
])

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


// const material= new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess=100
// material.specular = new THREE.Color(0xff0000)

// const material = new THREE.MeshToonMaterial()
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false
// material.gradientMap = gradientTexture

// const material = new THREE.MeshStandardMaterial();
// material.metalness = 0
// material.roughness = 0.40
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture //You need to add UV2 attributes to the object
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.05
// material.normalMap = doorNormalTexture
// material.alphaMap = doorAlphaTexture
// material.transparent=true

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7
material.roughness = 0.2
material.envMap = environmentmaptexture

//Sphere
const sphereGeo = new THREE.SphereBufferGeometry(0.5, 16, 16)
const sphereMesh = new THREE.Mesh(sphereGeo, material);
sphereMesh.position.x = 3
scene.add(sphereMesh)
//Plane
const planeGeo = new THREE.PlaneBufferGeometry(1,1,100,100)
const planeMesh = new THREE.Mesh(planeGeo, material);

planeMesh.geometry.setAttribute('uv2',new THREE.BufferAttribute(planeMesh.geometry.attributes.uv.array,2))
scene.add(planeMesh)
//Torus
const torusGeo = new THREE.TorusBufferGeometry(0.3,0.2,64,138)
const torusMesh = new THREE.Mesh(torusGeo, material);
torusMesh.position.x = -3
scene.add(torusMesh)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 5
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

    //Update objects positions
    // planeMesh.rotation.x = elapsedTime * 0.1;
    // planeMesh.rotation.y = elapsedTime * 0.15;
    // sphereMesh.rotation.x = elapsedTime * 0.1;
    // sphereMesh.rotation.y = elapsedTime * 0.15;
    // torusMesh.rotation.x = elapsedTime * 0.1;
    // torusMesh.rotation.y = elapsedTime * 0.15;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

/*
* DEBUG
**/
const gui = new dat.GUI();
const materialConf = gui.addFolder("Material")
materialConf.add(material, "metalness", 0, 1, 0.01)
materialConf.add(material, "roughness", 0, 1, 0.01)
materialConf.add(material, "displacementScale", 0, 1, 0.01)
