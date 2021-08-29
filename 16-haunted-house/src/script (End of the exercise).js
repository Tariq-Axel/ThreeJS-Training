import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Fog
const fog = new THREE.Fog('#262837',1,15) //you have to put it as the renderer background renderer.setClearColor
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorcolor= textureLoader.load('/textures/door/color.jpg')
const dooralpha= textureLoader.load('/textures/door/alpha.jpg')
const doorambientOcclusion= textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorheight= textureLoader.load('/textures/door/height.jpg')
const doormetalness= textureLoader.load('/textures/door/metalness.jpg')
const doornormal= textureLoader.load('/textures/door/normal.jpg')
const doorroughness= textureLoader.load('/textures/door/roughness.jpg')

const wallcolor = textureLoader.load('/textures/bricks/color.jpg')
const wallambientOcclusion = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const wallnormal = textureLoader.load('/textures/bricks/normal.jpg')
const wallroughness= textureLoader.load('/textures/bricks/roughness.jpg')

const grasscolor = textureLoader.load('/textures/grass/color.jpg')
grasscolor.wrapS = THREE.RepeatWrapping
grasscolor.wrapT = THREE.RepeatWrapping
grasscolor.repeat.set(100,100) //100 is half the height and width of the floor
const grassambientOcclusion = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
grassambientOcclusion.wrapS = THREE.RepeatWrapping
grassambientOcclusion.wrapT = THREE.RepeatWrapping
grassambientOcclusion.repeat.set(100,100)
const grassnormal = textureLoader.load('/textures/grass/normal.jpg')
grassnormal.wrapS = THREE.RepeatWrapping
grassnormal.wrapT = THREE.RepeatWrapping
grassnormal.repeat.set(100,100)
const grassroughness= textureLoader.load('/textures/grass/roughness.jpg')
grassroughness.wrapS = THREE.RepeatWrapping
grassroughness.wrapT = THREE.RepeatWrapping
grassroughness.repeat.set(100,100)

/**
 * House
 */

// **** Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(200, 200),
    new THREE.MeshStandardMaterial({ map:grasscolor })
)
floor.material.aoMap=grassambientOcclusion; floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2));
floor.material.normalMap = grassnormal
floor.material.roughnessMap=grassroughness
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

// **** House
const house = new THREE.Group()
scene.add(house)
// ** walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4,2.5,4,50,50),
    new THREE.MeshStandardMaterial({map:wallcolor})
)
walls.material.aoMap=wallambientOcclusion; walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2));
walls.material.normalMap = wallnormal
walls.material.roughnessMap=wallroughness
walls.position.y = floor.position.y + walls.geometry.parameters.height/2
house.add(walls)
// ** roof
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(4,1,4),
    new THREE.MeshStandardMaterial({color:'#b35f45'})
)
roof.position.y = walls.geometry.parameters.height + roof.geometry.parameters.height/2
roof.rotation.y = Math.PI * 0.25
house.add(roof)
// ** door
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2,2,5,5),
    new THREE.MeshStandardMaterial({map:doorcolor})
)
door.material.alphaMap=dooralpha; door.material.transparent=true;
door.material.aoMap=doorambientOcclusion; door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2));
door.material.normalMap = doornormal
door.material.roughnessMap=doorroughness
door.material.displacementMap=doorheight; door.material.displacementScale = 0.1
door.material.metalnessMap=doormetalness

door.position.y = floor.position.y + door.geometry.parameters.height/2 - 0.10
door.position.z = walls.geometry.parameters.depth/2 + 0.000009
house.add(door)

// ** bush
const bushGeo = new THREE.SphereBufferGeometry(1,16,16)
const bushMat = new THREE.MeshStandardMaterial({color:"#89c854"})
const bush1 = new THREE.Mesh(bushGeo,bushMat);
bush1.scale.set(0.5,0.5,0.5)
bush1.position.set(0.8,0.2,2.2)
const bush2 = new THREE.Mesh(bushGeo,bushMat);
bush2.scale.set(0.25,0.25,0.25)
bush2.position.set(1.4,0.1,2.1)
const bush3 = new THREE.Mesh(bushGeo,bushMat);
bush3.scale.set(0.4,0.4,0.4)
bush3.position.set(-0.8,0.1,2.2)
const bush4 = new THREE.Mesh(bushGeo,bushMat);
bush4.scale.set(0.15,0.15,0.15)
bush4.position.set(-1,0.05,2.6)
house.add(bush1, bush2, bush3, bush4)

// **** Graves
const graves = new THREE.Group()
scene.add(graves)
const graveGeo = new THREE.BoxBufferGeometry(0.6,0.8,0.2)
const graveMat = new THREE.MeshStandardMaterial({color:'#b2b6b1'})

for(let i = 0; i < 50 ; i++){
    const angle = Math.random() * Math.PI*2; //Random angle
    const radius = walls.geometry.parameters.width + Math.random() * floor.geometry.parameters.width/4 //So that the graves don't get inside the door or outside of the map
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeo,graveMat)
    grave.position.set(x,floor.position.y + grave.geometry.parameters.height/2 -0.1,z)
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.castShadow=true;
    graves.add(grave)
}


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorlight = new THREE.PointLight('#ff7d46', 1, 7)
doorlight.position.set(0,2.2,2.7)
house.add(doorlight)

/**
 * Ghosts
 */

 const ghost1 = new THREE.PointLight('#ff00ff',2,3)
 const ghost2 = new THREE.PointLight('#00ffff',2,3)
 const ghost3 = new THREE.PointLight('#ffff00',2,3)
scene.add(ghost1,ghost2,ghost3)


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
camera.position.x = 0
camera.position.y = 2
camera.position.z = 30
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
renderer.setClearColor('#262837') //Same as the fog

/**
 * Shadows
 */
renderer.shadowMap.enabled = true; renderer.shadowMap.type= THREE.PCFSoftShadowMap
moonLight.castShadow = true;
doorlight.castShadow = true;doorlight.shadow.mapSize.width = 256; doorlight.shadow.mapSize.height =256; doorlight.shadow.mapSize.height =256; doorlight.shadow.camera.far=7
ghost1.castShadow = true; ghost1.shadow.mapSize.width = 256; ghost1.shadow.mapSize.height =256; ghost1.shadow.mapSize.height =256; ghost1.shadow.camera.far=7
ghost2.castShadow = true; ghost2.shadow.mapSize.width = 256; ghost2.shadow.mapSize.height =256; ghost2.shadow.mapSize.height =256; ghost2.shadow.camera.far=7
ghost3.castShadow = true; ghost3.shadow.mapSize.width = 256; ghost3.shadow.mapSize.height =256; ghost3.shadow.mapSize.height =256; ghost3.shadow.camera.far=7
walls.castShadow = true; 
// bush1.castShadow = true
// bush2.castShadow = true
// bush3.castShadow = true
// bush4.castShadow = true
//Grave shadow in the for loop up
floor.receiveShadow=true;


/**
 * Animate
 */
const clock = new THREE.Clock()



const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update ghosts
    const ghost1angle = elapsedTime*0.5
    ghost1.position.x = Math.cos(ghost1angle) *6
    ghost1.position.z = Math.sin(ghost1angle) *6
    ghost1.position.y = Math.sin(elapsedTime*3)

    const ghost2angle = elapsedTime*0.32
    ghost2.position.x = Math.cos(ghost2angle) *8
    ghost2.position.z = Math.sin(ghost2angle) *8
    ghost2.position.y = Math.sin(elapsedTime*4) + Math.sin(elapsedTime*2.5)

    const ghost3angle = elapsedTime*0.15
    ghost3.position.x = Math.cos(ghost3angle) *10
    ghost3.position.z = Math.sin(ghost3angle) *10
    ghost3.position.y = Math.sin(elapsedTime*2) * Math.sin(elapsedTime*5)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()