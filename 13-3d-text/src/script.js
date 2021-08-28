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
scene.background = new THREE.Color('skyblue')

// Axes helper
const axeshelper = new THREE.AxesHelper()
// scene.add(axeshelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcaptexture = textureLoader.load('/textures/matcaps/3.png')
/**
 * Fonts
 */
const fontloader = new THREE.FontLoader()
fontloader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (e) => {
        const textgeometry = new THREE.TextBufferGeometry(
            'Mozer', 
            {
                font: e, 
                size: 0.5, 
                height: 0.2, 
                curveSegments: 5, 
                bevelEnabled: true, //The bevel is the padding
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )
        //We move the geometry and not the Mesh
        // textgeometry.computeBoundingBox() //We create a bounding box (surrounding the geometry)
        // console.log(textgeometry.boundingBox)
        // textgeometry.translate( //We use the size of the bounding box to center the object (don't forget to get rid of the bevel)
        //     - (textgeometry.boundingBox.max.x - 0.02) * 0.5,
        //     - (textgeometry.boundingBox.max.y - 0.02) * 0.5,
        //     - (textgeometry.boundingBox.max.z - 0.03) * 0.5
        // ) 
        // textgeometry.computeBoundingBox() //We create a bounding box (surrounding the geometry)
        // console.log(textgeometry.boundingBox)
        textgeometry.center()

        const textmaterial = new THREE.MeshMatcapMaterial({matcap: matcaptexture})
        const text = new THREE.Mesh(textgeometry, textmaterial)
        scene.add(text)

        console.time('donut')

        const donutgeo = new THREE.TorusBufferGeometry(0.3,0.2,20,45)
        const donutmat = new THREE.MeshMatcapMaterial({matcap: matcaptexture})
        for(let i = 0; i<500; i++){
            const donut = new THREE.Mesh(donutgeo, donutmat)

            donut.position.x = (Math.random() - 0.5) * 50
            donut.position.y = (Math.random() - 0.5) * 50
            donut.position.z = (Math.random() - 0.5) * 50

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random() * 5
            donut.scale.set(scale,scale,scale)
            
            scene.add(donut)
        }
        console.timeEnd('donut')
    }
)



/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

// scene.add(cube)

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
camera.position.z = -41
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

const cameradebug = gui.addFolder("camera position")
cameradebug.add(camera.position, 'x', -45, 45, 0.2)
cameradebug.add(camera.position, 'y', -45, 45, 0.2)
cameradebug.add(camera.position, 'z', -45, 45, 0.2)

gsap.to(camera.position, {z:5, duration: 5})