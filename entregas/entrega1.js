/**
 * Entrega1.js
 * 
 * Entrega AGM #1.
 * 
 * @author 
 * 
 */

import * as THREE from "../lib/three.module.js";
import { OrbitControls } from "../lib/OrbitControls.module.js";
import { TWEEN } from "../lib/tween.module.min.js";
import { GUI } from "../lib/lil-gui.module.min.js";

// Variables de consenso
let renderer, scene, camera, focal;

// Otras globales
/*******************
 * TO DO: Variables globales de la aplicacion
 *******************/
let cameraControls, effectController, estadoCamara;
let whiteInitialNames = ['w_peon1', 'w_peon2', 'w_peon3', 'w_peon4', 'w_peon5', 'w_peon6', 'w_peon7', 'w_peon8', 'w_alfil1', 'w_alfil2', 'w_tower1', 'w_tower2', 'w_caballo1', 'w_caballo2', 'w_reina', 'w_rey'];
let blackInitialNames = ['b_peon1', 'b_peon2', 'b_peon3', 'b_peon4', 'b_peon5', 'b_peon6', 'b_peon7', 'b_peon8', 'b_alfil1', 'b_alfil2', 'b_tower1', 'b_tower2', 'b_caballo1', 'b_caballo2', 'b_reina', 'b_rey'];

let whiteNames = ['w_peon1', 'w_peon2', 'w_peon3', 'w_peon4', 'w_peon5', 'w_peon6', 'w_peon7', 'w_peon8', 'w_alfil1', 'w_alfil2', 'w_tower1', 'w_tower2', 'w_caballo1', 'w_caballo2', 'w_reina', 'w_rey'];
let blackNames = ['b_peon1', 'b_peon2', 'b_peon3', 'b_peon4', 'b_peon5', 'b_peon6', 'b_peon7', 'b_peon8', 'b_alfil1', 'b_alfil2', 'b_tower1', 'b_tower2', 'b_caballo1', 'b_caballo2', 'b_reina', 'b_rey'];
let casillas = [];
let fichaSeleccionada;
let casillasPosibles = [];
let casillasPosiblesKill = [];

let winner = '';
let turno = 0;

let suelo;
var sueloMaterial = new THREE.MeshBasicMaterial({ color: 0x2a382a });

const ultimaCasilla = -2.975;
const primeraCasilla = -0;

const brilloFichas = 30;
const brilloCasillas = 15;
// Acciones
init();
loadScene();
loadGUI();
render();

function init() {
    // Motor de render
    renderer = new THREE.WebGLRenderer();
    const container = document.getElementById('container');
    // renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.antialias = true;
    renderer.shadowMap.enabled = true;

    container.appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 0.5, 0.5);

    // Camara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(3, 8, 0);
    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 1, 0);
    camera.lookAt(new THREE.Vector3(0, 1, 0));

    renderer.domElement.addEventListener('dblclick', animate);
    renderer.domElement.addEventListener('click', selectPosition);
}

function mirarBlancas() {
    new TWEEN.Tween(estadoCamara)
        .to({ x: 3, y: 8, z: 0 }, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut) // Utiliza un easing para la transición suave
        .onUpdate(function () {
            // Actualiza la posición de la cámara en cada fotograma de la animación
            camera.position.set(estadoCamara.x, estadoCamara.y, estadoCamara.z);

            camera.lookAt(new THREE.Vector3(0, 1, -0.01));
        })
        .start();

    new TWEEN.Tween(cameraControls.target)
        .to({ x: 0, y: 1, z: 0 }, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut) // Utiliza un easing para la transición suave
        .onUpdate(function () {
            // Actualiza la posición de la cámara en cada fotograma de la animación
            camera.position.set(estadoCamara.x, estadoCamara.y, estadoCamara.z);
        })
        .start();

}

function mirarNegras() {
    new TWEEN.Tween(estadoCamara)
        .to({ x: -3, y: 8, z: 0 }, 3000)
        .easing(TWEEN.Easing.Quadratic.InOut) // Utiliza un easing para la transición suave
        .onUpdate(function () {
            // Actualiza la posición de la cámara en cada fotograma de la animación
            camera.position.set(estadoCamara.x, estadoCamara.y, estadoCamara.z);

            camera.lookAt(new THREE.Vector3(0, 1, 0.01));
        })
        .start();

    new TWEEN.Tween(cameraControls.target)
        .to({ x: 0, y: 1, z: 0 }, 3000)
        .easing(TWEEN.Easing.Quadratic.InOut) // Utiliza un easing para la transición suave
        .onUpdate(function () {
            // Actualiza la posición de la cámara en cada fotograma de la animación
            camera.position.set(estadoCamara.x, estadoCamara.y, estadoCamara.z);
        })
        .start();
}

function loadScene() {
    turno = 0;
    scene.children = [];
    whiteNames = whiteInitialNames;
    blackNames = blackInitialNames;
    winner = '';
    casillas = [];
    fichaSeleccionada = { name: '' };
    casillasPosibles = [];
    casillasPosiblesKill = [];
    // Crear un material para el plano
    var geometry = new THREE.PlaneGeometry(10000, 10000);
    suelo = new THREE.Mesh(geometry, sueloMaterial);
    suelo.rotation.x = -Math.PI / 2;
    suelo.position.y = -1.05;
    scene.add(suelo);

    // Luces
    const ambiental = new THREE.AmbientLight(0x222222);
    scene.add(ambiental);
    const direccional = new THREE.DirectionalLight(0xFFFFFF, 0.3);
    direccional.position.set(-1, 1, -1);
    direccional.castShadow = true;
    scene.add(direccional);
    const puntual = new THREE.PointLight(0xFFFFFF, 0.5);
    puntual.position.set(4, 10, 4);
    scene.add(puntual);
    focal = new THREE.SpotLight(0xFFFFFF, 0.3);
    focal.position.set(-6, 7, 2);
    focal.target.position.set(0, 0, 0);
    focal.angle = Math.PI / 7;
    focal.penumbra = 0.3;
    focal.castShadow = true;
    focal.shadow.camera.far = 20;
    focal.shadow.camera.fov = 80;

    scene.add(focal);

    // scene.add(new THREE.CameraHelper(focal.shadow.camera));

    // Cargar la textura del gradiente
    const textureLoader = new THREE.TextureLoader();
    const gradientTexture = textureLoader.load('entregas/scene_e1/floor.jpg');
    const gradientMaterial = new THREE.MeshBasicMaterial({ map: gradientTexture });
    const gradientGeometry = new THREE.PlaneGeometry(10, 10);
    const gradientMesh = new THREE.Mesh(gradientGeometry, gradientMaterial);
    gradientMesh.rotation.x = Math.PI * -0.5;
    gradientMesh.position.y = -1;
    scene.add(gradientMesh);

    const textureLoader2 = new THREE.TextureLoader();
    const gradientTexture2 = textureLoader2.load('entregas/scene_e1/concrete.jpg');
    let material = new THREE.MeshStandardMaterial({
        map: gradientTexture2, // Tu textura
        roughness: 0.7, // Ajusta la rugosidad según tus necesidades
        metalness: 0 // Ajusta la metalicidad según tus necesidades
    });
    let materialWhite = new THREE.MeshPhongMaterial({ color: 'white', specular: '#f0f0f0', shininess: brilloCasillas });
    let materialBlack = new THREE.MeshPhongMaterial({ color: 'black', specular: '#f0f0f0', shininess: brilloCasillas });

    const loader = new THREE.CubeTextureLoader();
    const cubemap = loader.load(["entregas/scene_e1/posx.jpg", "entregas/scene_e1/negx.jpg",
        "entregas/scene_e1/posy.jpg", "entregas/scene_e1/negy.jpg",
        "entregas/scene_e1/posz.jpg", "entregas/scene_e1/negz.jpg"]);
    scene.background = cubemap;

    const mesa = loadMesa(material);
    const tablero = loadTablero(material, materialWhite, materialBlack);
    const bordes = loadBordes(material, materialWhite);
    tablero.name = 'tablero';
    const fichasBlancas = loadWhite();
    const fichasNegras = loadBlack();
    scene.add(mesa)
    scene.add(tablero)
    scene.add(bordes)
    fichasBlancas.forEach((e) => scene.add(e))
    fichasNegras.forEach((e) => scene.add(e))
}

function loadMesa(material) {
    const mesa = new THREE.Object3D();

    const geoTabla = new THREE.BoxGeometry(5, 0.3, 5)
    const tabla = new THREE.Mesh(geoTabla, material);
    tabla.position.y = 3
    mesa.add(tabla);

    const geoPata1 = new THREE.BoxGeometry(0.3, 4, 0.3)
    const pata1 = new THREE.Mesh(geoPata1, material);
    pata1.position.x = 2
    pata1.position.z = 2
    pata1.position.y = 1
    mesa.add(pata1);

    const geoPata2 = new THREE.BoxGeometry(0.3, 4, 0.3)
    const pata2 = new THREE.Mesh(geoPata2, material);
    pata2.position.x = 2
    pata2.position.z = -2
    pata2.position.y = 1
    mesa.add(pata2);

    const geoPata3 = new THREE.BoxGeometry(0.3, 4, 0.3)
    const pata3 = new THREE.Mesh(geoPata3, material);
    pata3.position.x = -2
    pata3.position.z = -2
    pata3.position.y = 1
    mesa.add(pata3);

    const geoPata4 = new THREE.BoxGeometry(0.3, 4, 0.3)
    const pata4 = new THREE.Mesh(geoPata4, material);
    pata4.position.x = -2
    pata4.position.z = 2
    pata4.position.y = 1
    mesa.add(pata4);
    return mesa;
}

function loadTablero(material, white, black) {
    let colors = [white, black];
    const tablero = new THREE.Object3D();

    const geoTabla = new THREE.BoxGeometry(3.4, 0.1, 3.4)
    const tabla = new THREE.Mesh(geoTabla, material);
    tabla.position.y = 3.2
    tablero.add(tabla);
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const geoCasilla = new THREE.BoxGeometry(0.425, 0.05, 0.425)
            const casilla = new THREE.Mesh(geoCasilla, colors[(i + j) % 2]);
            casilla.position.y = 3.25
            casilla.position.x = 1.487
            casilla.position.z = 1.487
            casilla.name = `casilla_m_${i}_${j}`
            casillas.push(casilla.name)
            const casillaObject = new THREE.Object3D();
            casillaObject.position.x = -(i * 0.425)
            casillaObject.position.z = -(j * 0.425)
            casillaObject.name = `casilla_${i}_${j}`
            casillaObject.add(casilla);
            tablero.add(casillaObject);
        }
    }

    return tablero;
}

function loadBordes(material, initialColor) {
    const bordes = new THREE.Object3D();

    const geoBorde1 = new THREE.BoxGeometry(3.4, 0.1, 0.1)
    const borde1 = new THREE.Mesh(geoBorde1, initialColor);
    borde1.position.y = 3.2
    borde1.position.z = 1.7
    bordes.add(borde1);

    const geoBorde2 = new THREE.BoxGeometry(3.4, 0.1, 0.1)
    const borde2 = new THREE.Mesh(geoBorde2, initialColor);
    borde2.position.y = 3.2
    borde2.position.z = -1.7
    bordes.add(borde2);

    const geoBorde3 = new THREE.BoxGeometry(0.1, 0.1, 3.4)
    const borde3 = new THREE.Mesh(geoBorde3, initialColor);
    borde3.position.y = 3.2
    borde3.position.x = 1.7
    bordes.add(borde3);

    const geoBorde4 = new THREE.BoxGeometry(0.1, 0.1, 3.4)
    const borde4 = new THREE.Mesh(geoBorde4, initialColor);
    borde4.position.y = 3.2
    borde4.position.x = -1.7
    bordes.add(borde4);

    //esquinas
    const esquinas = new THREE.Object3D();

    const geoEsquina1 = new THREE.BoxGeometry(0.09, 0.09, 0.09)
    const esquina1 = new THREE.Mesh(geoEsquina1, material);
    esquina1.position.y = 3.2
    esquina1.position.x = 1.7
    esquina1.position.z = 1.7
    esquinas.add(esquina1);

    const geoEsquina2 = new THREE.BoxGeometry(0.09, 0.09, 0.09)
    const esquina2 = new THREE.Mesh(geoEsquina2, material);
    esquina2.position.y = 3.2
    esquina2.position.x = 1.7
    esquina2.position.z = -1.7
    esquinas.add(esquina2);

    const geoEsquina3 = new THREE.BoxGeometry(0.09, 0.09, 0.09)
    const esquina3 = new THREE.Mesh(geoEsquina3, material);
    esquina3.position.y = 3.2
    esquina3.position.x = -1.7
    esquina3.position.z = 1.7
    esquinas.add(esquina3);

    const geoEsquina4 = new THREE.BoxGeometry(0.09, 0.09, 0.09)
    const esquina4 = new THREE.Mesh(geoEsquina4, material);
    esquina4.position.y = 3.2
    esquina4.position.x = -1.7
    esquina4.position.z = -1.7
    esquinas.add(esquina4);

    bordes.add(esquinas);

    bordes.name = 'bordes';

    return bordes;
}

function loadPeon(material, posX, posY) {
    const peon = new THREE.Object3D();
    peon.position.x = -(posX * 0.425)
    peon.position.z = -(posY * 0.425)

    const geoBase = new THREE.CylinderGeometry(0.08, 0.2, 0.1)
    const base = new THREE.Mesh(geoBase, material);
    base.position.x = 1.487
    base.position.z = 1.487
    base.position.y = 3.3
    peon.add(base);

    const geoBody = new THREE.CapsuleGeometry(0.08, 0.3, 0.5)
    const body = new THREE.Mesh(geoBody, material);
    body.position.x = 1.487
    body.position.z = 1.487
    body.position.y = 3.3
    peon.add(body);

    const geoBaseTop = new THREE.CylinderGeometry(0.1, 0.1, 0.03)
    const baseTop = new THREE.Mesh(geoBaseTop, material);
    baseTop.position.x = 1.487
    baseTop.position.z = 1.487
    baseTop.position.y = 3.52
    peon.add(baseTop);

    const geoTop = new THREE.SphereGeometry(0.08, 50, 50)
    const top = new THREE.Mesh(geoTop, material);
    top.position.x = 1.487
    top.position.z = 1.487
    top.position.y = 3.6
    peon.add(top);

    return peon
}

function loadAlfil(material, posX, posY) {
    const alfil = new THREE.Object3D();
    alfil.position.x = -(posX * 0.425)
    alfil.position.z = -(posY * 0.425)

    const geoBase = new THREE.CylinderGeometry(0.08, 0.2, 0.1)
    const base = new THREE.Mesh(geoBase, material);
    base.position.x = 1.487
    base.position.z = 1.487
    base.position.y = 3.3
    alfil.add(base);

    const geoBody = new THREE.CapsuleGeometry(0.08, 0.7, 0.5)
    const body = new THREE.Mesh(geoBody, material);
    body.position.x = 1.487
    body.position.z = 1.487
    body.position.y = 3.3
    alfil.add(body);

    const geoBaseTop = new THREE.CylinderGeometry(0.1, 0.1, 0.03)
    const baseTop = new THREE.Mesh(geoBaseTop, material);
    baseTop.position.x = 1.487
    baseTop.position.z = 1.487
    baseTop.position.y = 3.7
    alfil.add(baseTop);

    const geoTop = new THREE.SphereGeometry(0.07, 20, 50)
    const top = new THREE.Mesh(geoTop, material);
    top.position.x = 1.487
    top.position.z = 1.487
    top.position.y = 3.78
    alfil.add(top);

    const geoTop2 = new THREE.CapsuleGeometry(0.08, 0.1, 0.5)
    const top2 = new THREE.Mesh(geoTop2, material);
    top2.position.x = 1.487
    top2.position.z = 1.487
    top2.position.y = 3.77
    alfil.add(top2);

    return alfil
}

function loadTower(material, posX, posY) {
    const tower = new THREE.Object3D();
    tower.position.x = -(posX * 0.425)
    tower.position.z = -(posY * 0.425)

    const geoBase = new THREE.CylinderGeometry(0.08, 0.2, 0.1)
    const base = new THREE.Mesh(geoBase, material);
    base.position.x = 1.487
    base.position.z = 1.487
    base.position.y = 3.3
    tower.add(base);

    const geoBody = new THREE.CapsuleGeometry(0.08, 0.5, 0.5)
    const body = new THREE.Mesh(geoBody, material);
    body.position.x = 1.487
    body.position.z = 1.487
    body.position.y = 3.3
    tower.add(body);

    const geoBaseTop = new THREE.CylinderGeometry(0.1, 0.1, 0.05)
    const baseTop = new THREE.Mesh(geoBaseTop, material);
    baseTop.position.x = 1.487
    baseTop.position.z = 1.487
    baseTop.position.y = 3.61
    tower.add(baseTop);

    const geoTabla = new THREE.BoxGeometry(0.06, 0.05, 0.03)
    for (let i = 0; i < 5; i++) {
        const cube = new THREE.Mesh(geoTabla, material);
        const angle = (i / 5) * Math.PI * 2;
        cube.position.set(Math.cos(angle) * 0.085, 0.05, Math.sin(angle) * 0.085);
        cube.lookAt(new THREE.Vector3(0, 0.05, 0));
        baseTop.add(cube);
    }

    const geoRing = new THREE.TorusGeometry(0.086, 0.02);
    const ring = new THREE.Mesh(geoRing, material);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.03
    baseTop.add(ring)

    return tower
}

function loadReina(material, posX, posY) {
    const reina = new THREE.Object3D();
    reina.position.x = -(posX * 0.425)
    reina.position.z = -(posY * 0.425)

    const geoBase = new THREE.CylinderGeometry(0.08, 0.2, 0.1)
    const base = new THREE.Mesh(geoBase, material);
    base.position.x = 1.487
    base.position.z = 1.487
    base.position.y = 3.3
    reina.add(base);

    const geoBody = new THREE.CapsuleGeometry(0.08, 0.7, 0.5)
    const body = new THREE.Mesh(geoBody, material);
    body.position.x = 1.487
    body.position.z = 1.487
    body.position.y = 3.4
    reina.add(body);

    const geoBaseTop = new THREE.CylinderGeometry(0.1, 0.1, 0.03)
    const baseTop = new THREE.Mesh(geoBaseTop, material);
    baseTop.position.x = 1.487
    baseTop.position.z = 1.487
    baseTop.position.y = 3.8
    reina.add(baseTop);

    const geoCorona = new THREE.CylinderGeometry(0.09, 0.07, 0.1)
    const corona = new THREE.Mesh(geoCorona, material);
    corona.position.x = 1.487
    corona.position.z = 1.487
    corona.position.y = 3.85
    reina.add(corona);

    const geoTop = new THREE.SphereGeometry(0.05, 10, 10)
    const top = new THREE.Mesh(geoTop, material);
    top.position.x = 1.487
    top.position.z = 1.487
    top.position.y = 3.9
    reina.add(top);

    return reina
}

function loadRey(material, posX, posY) {
    const rey = new THREE.Object3D();
    rey.position.x = -(posX * 0.425)
    rey.position.z = -(posY * 0.425)

    const geoBase = new THREE.CylinderGeometry(0.08, 0.2, 0.1)
    const base = new THREE.Mesh(geoBase, material);
    base.position.x = 1.487
    base.position.z = 1.487
    base.position.y = 3.3
    rey.add(base);

    const geoBody = new THREE.CapsuleGeometry(0.08, 0.7, 0.5)
    const body = new THREE.Mesh(geoBody, material);
    body.position.x = 1.487
    body.position.z = 1.487
    body.position.y = 3.4
    rey.add(body);

    const geoBaseTop = new THREE.CylinderGeometry(0.1, 0.1, 0.03)
    const baseTop = new THREE.Mesh(geoBaseTop, material);
    baseTop.position.x = 1.487
    baseTop.position.z = 1.487
    baseTop.position.y = 3.8
    rey.add(baseTop);

    const geoCorona = new THREE.CylinderGeometry(0.09, 0.07, 0.1)
    const corona = new THREE.Mesh(geoCorona, material);
    corona.position.x = 1.487
    corona.position.z = 1.487
    corona.position.y = 3.85
    rey.add(corona);

    const geoTop1 = new THREE.BoxGeometry(0.05, 0.15, 0.05)
    const top1 = new THREE.Mesh(geoTop1, material);
    top1.position.x = 1.487
    top1.position.z = 1.487
    top1.position.y = 3.97
    rey.add(top1);

    const geoTop2 = new THREE.BoxGeometry(0.05, 0.05, 0.15)
    const top2 = new THREE.Mesh(geoTop2, material);
    top2.position.x = 1.487
    top2.position.z = 1.487
    top2.position.y = 3.98
    rey.add(top2);

    return rey
}

function loadCaballo(material, posX, posY, north) {
    let x = north ? 1.53 : 1.45;
    const caballo = new THREE.Object3D();
    caballo.position.x = -(posX * 0.425)
    caballo.position.z = -(posY * 0.425)

    const geoBase = new THREE.CylinderGeometry(0.08, 0.2, 0.1)
    const base = new THREE.Mesh(geoBase, material);
    base.position.x = 1.487
    base.position.z = 1.487
    base.position.y = 3.3
    caballo.add(base);

    const geoBody = new THREE.CapsuleGeometry(0.08, 0.3, 0.5)
    const body = new THREE.Mesh(geoBody, material);
    body.position.x = x
    body.position.z = 1.487
    body.position.y = 3.45
    body.rotation.z = north ? Math.PI / -8 : Math.PI / 8;
    caballo.add(body);

    const geoHead = new THREE.CapsuleGeometry(0.06, 0.2, 0.3)
    const head = new THREE.Mesh(geoHead, material);
    head.position.x = x
    head.position.z = 1.487
    head.position.y = 3.58
    head.rotation.z = north ? Math.PI / -2.3 : Math.PI / 2.3;
    caballo.add(head);

    const geoEar1 = new THREE.CapsuleGeometry(0.02, 0.4, 0.6)
    const ear1 = new THREE.Mesh(geoEar1, material);
    ear1.position.x = x
    ear1.position.z = 1.447
    ear1.position.y = 3.46
    ear1.rotation.z = north ? Math.PI / -8 : Math.PI / 8;
    caballo.add(ear1);

    const geoEar2 = new THREE.CapsuleGeometry(0.02, 0.4, 0.6)
    const ear2 = new THREE.Mesh(geoEar2, material);
    ear2.position.x = x
    ear2.position.z = 1.533
    ear2.position.y = 3.46
    ear2.rotation.z = north ? Math.PI / -8 : Math.PI / 8;
    caballo.add(ear2);

    return caballo;
}

function loadWhite() {
    let white = new THREE.MeshPhongMaterial({ color: 'white', specular: '#f0f0f0', shininess: brilloFichas });

    let list = [];
    for (let i = 0; i < 8; i++) {
        let peon = loadPeon(white, 1, i)
        peon.name = whiteNames[i]
        list.push(peon)
    }

    let alfil1 = loadAlfil(white, 0, 2)
    alfil1.name = whiteNames[8]
    let alfil2 = loadAlfil(white, 0, 5)
    alfil2.name = whiteNames[9]
    list.push(alfil1)
    list.push(alfil2)

    let tower1 = loadTower(white, 0, 0)
    tower1.name = whiteNames[10]
    let tower2 = loadTower(white, 0, 7)
    tower2.name = whiteNames[11]
    list.push(tower1)
    list.push(tower2)

    let caballo1 = loadCaballo(white, 0, 1, true);
    caballo1.name = whiteNames[12]
    let caballo2 = loadCaballo(white, 0, 6, true);
    caballo2.name = whiteNames[13]
    list.push(caballo1)
    list.push(caballo2)

    let reina = loadReina(white, 0, 4)
    reina.name = whiteNames[14]
    list.push(reina)

    let rey = loadRey(white, 0, 3)
    rey.name = whiteNames[15]
    list.push(rey)

    return list;
}

function loadBlack() {
    let black = new THREE.MeshPhongMaterial({ color: 'black', specular: '#f0f0f0', shininess: brilloFichas });

    let list = [];
    for (let i = 0; i < 8; i++) {
        let peon = loadPeon(black, 6, i)
        peon.name = blackNames[i]
        list.push(peon)
    }

    let alfil1 = loadAlfil(black, 7, 2)
    alfil1.name = blackNames[8]
    let alfil2 = loadAlfil(black, 7, 5)
    alfil2.name = blackNames[9]
    list.push(alfil1)
    list.push(alfil2)

    let tower1 = loadTower(black, 7, 0)
    tower1.name = blackNames[10]
    let tower2 = loadTower(black, 7, 7)
    tower2.name = blackNames[11]
    list.push(tower1)
    list.push(tower2)

    let caballo1 = loadCaballo(black, 7, 1, false);
    caballo1.name = blackNames[12]
    let caballo2 = loadCaballo(black, 7, 6, false);
    caballo2.name = blackNames[13]
    list.push(caballo1)
    list.push(caballo2)

    let reina = loadReina(black, 7, 4)
    reina.name = blackNames[14]
    list.push(reina)

    let rey = loadRey(black, 7, 3)
    rey.name = blackNames[15]
    list.push(rey)

    return list;
}

function animate(event) {
    // Capturar y normalizar
    let x = event.clientX;
    let y = event.clientY;
    x = (x / window.innerWidth) * 2 - 1;
    y = -(y / window.innerHeight) * 2 + 1;

    // Construir el rayo y detectar la interseccion
    const rayo = new THREE.Raycaster();
    rayo.setFromCamera(new THREE.Vector2(x, y), camera);
    for (let i = 0; i < casillas.length; i++) {
        let casilla = scene.getObjectByName('tablero').getObjectByName(casillas[i]).parent;
        let intersecciones = rayo.intersectObjects(casilla.children, true);
        if (intersecciones.length > 0) {
            if (casillasPosibles.find((c) => c.position.x == casilla.position.x && c.position.z == casilla.position.z) && fichaSeleccionada.name != '') {
                resetTablero();
                selectFicha({ name: '' })
                new TWEEN.Tween(fichaSeleccionada.position)
                    .to({ x: casilla.position.x, z: casilla.position.z }, 1000)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .start();


                updateTurno();
            }
            if (casillasPosiblesKill.find((c) => c.position.x == casilla.position.x && c.position.z == casilla.position.z) && fichaSeleccionada.name != '') {
                resetTablero();
                selectFicha({ name: '' })
                //obtener ficha que se encuentra en la posición de la casilla
                let fichaEliminar = scene.children.find((f) => f.position.x == casilla.position.x && f.position.z == casilla.position.z);

                new TWEEN.Tween(fichaSeleccionada.position)
                    .to({ x: casilla.position.x, z: casilla.position.z }, 1000)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .start();

                //hacer temblar
                let ladoTemblor = 1;
                setTimeout(() => {
                    new TWEEN.Tween(fichaEliminar.position).
                        to({
                            x: [fichaEliminar.position.x, fichaEliminar.position.x],
                            y: [fichaEliminar.position.y + 1.5, fichaEliminar.position.y - 5],
                            z: [fichaEliminar.position.z, fichaEliminar.position.z]
                        }, 3000).
                        interpolation(TWEEN.Interpolation.Bezier).
                        easing(TWEEN.Easing.Quadratic.InOut).
                        onUpdate(function () {
                            hacerTemblar(fichaEliminar, ladoTemblor)
                            ladoTemblor++;
                        }).
                        start();
                }, 500);

                setTimeout(() => {
                    //eliminar ficha
                    scene.children = scene.children.filter((f) => f.name != fichaEliminar.name);
                    whiteNames = whiteNames.filter((f) => f != fichaEliminar.name);
                    blackNames = blackNames.filter((f) => f != fichaEliminar.name);
                    updateWinner();
                    updateTurno();
                }, 3500);
            }



            fichaSeleccionada = { name: '' };
            return;
        }
    }
}

function hacerTemblar(ficha, lado) {
    if (lado % 2 == 0) {
        ficha.position.x += 0.02;
        ficha.position.z += 0.02;
    } else {
        ficha.position.x -= 0.02;
        ficha.position.z -= 0.02;
    }
}

function selectPosition(event) {
    // Capturar y normalizar
    let x = event.clientX;
    let y = event.clientY;
    x = (x / window.innerWidth) * 2 - 1;
    y = -(y / window.innerHeight) * 2 + 1;

    // Construir el rayo y detectar la interseccion
    const rayo = new THREE.Raycaster();
    rayo.setFromCamera(new THREE.Vector2(x, y), camera);

    let found = false;
    let ficha;

    if (turno % 2 == 0 && !winner) {
        for (let i = 0; i < whiteNames.length; i++) {
            let f = scene.getObjectByName(whiteNames[i]);
            let intersecciones = rayo.intersectObjects(f.children, true);
            if (!found && intersecciones.length > 0) {
                //si la ficha se encuentra en la lista de casillasPosiblesKill
                if (!casillasPosiblesKill.find((c) => c.position.x == f.position.x && c.position.z == f.position.z)) {
                    ficha = f
                    found = true;
                }
            }
        }
    }


    if (turno % 2 != 0 && !winner) {
        for (let i = 0; i < blackNames.length; i++) {
            let f = scene.getObjectByName(blackNames[i]);
            let intersecciones = rayo.intersectObjects(f.children, true);

            if (!found && intersecciones.length > 0) {
                if (!casillasPosiblesKill.find((c) => c.position.x == f.position.x && c.position.z == f.position.z)) {
                    ficha = f
                    found = true;
                }
            }
        }
    }

    if (found) {
        selectFicha(ficha)
        getPossitions(ficha);
    }
}

function getPossitions(ficha) {
    if (ficha.name.includes('peon')) {
        getPeonPositions(ficha);
    } else if (ficha.name.includes('tower')) {
        getTowerPositions(ficha);
    } else if (ficha.name.includes('alfil')) {
        getAlfilPositions(ficha);
    } else if (ficha.name.includes('caballo')) {
        getCaballoPositions(ficha);
    } else if (ficha.name.includes('reina')) {
        getReinaPositions(ficha);
    } else if (ficha.name.includes('rey')) {
        getReyPositions(ficha);
    } else {
        resetTablero();
    }
}

function selectFicha(ficha) {
    whiteNames.forEach((e) => {
        if (e != ficha.name) {
            let f = scene.getObjectByName(e);
            if (f) {
                f.children.forEach((e) => {
                    e.material = new THREE.MeshPhongMaterial({ color: 'white', specular: '#f0f0f0', shininess: brilloFichas });
                })
            }
        } else {
            fichaSeleccionada = ficha;
            ficha.children.forEach((e) => {
                e.material = new THREE.MeshPhongMaterial({ color: 'red', specular: '#f0f0f0', shininess: brilloFichas });
            })
        }
    });


    blackNames.forEach((e) => {
        if (e != ficha.name) {
            let f = scene.getObjectByName(e);
            if (f) {
                f.children.forEach((e) => {
                    e.material = new THREE.MeshPhongMaterial({ color: 'black', specular: '#f0f0f0', shininess: brilloFichas });
                })
            }
        } else {
            fichaSeleccionada = ficha;
            ficha.children.forEach((e) => {
                e.material = new THREE.MeshPhongMaterial({ color: 'red', specular: '#f0f0f0', shininess: brilloFichas });
            })
        }
    });


}

function resetTablero() {
    let white = new THREE.MeshPhongMaterial({ color: 'white', specular: '#f0f0f0', shininess: brilloCasillas });
    let black = new THREE.MeshPhongMaterial({ color: 'black', specular: '#f0f0f0', shininess: brilloCasillas });
    let colors = [white, black];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let casilla = scene.getObjectByName('tablero').getObjectByName(`casilla_${i}_${j}`);
            casilla.children[0].material = colors[(i + j) % 2];
        }
    }
    casillasPosibles = [];
    casillasPosiblesKill = [];
}

function getPeonPositions(ficha) {
    let positions = [];
    let killPositions = [];
    let fichaEncontrada = false;
    let initialPos;
    let i = 1;
    if (ficha.name.includes('w_')) {
        initialPos = { x: ficha.position.x - 0.425, z: ficha.position.z }
        let existe = existeFichaEnPosicion(initialPos.x, initialPos.z);
        if (existe) {
            fichaEncontrada = true;
        }
        if (!fichaEncontrada) {
            positions.push(initialPos);
            if (ficha.position.x == primeraCasilla - 0.425) {
                initialPos = { x: ficha.position.x - (0.425 * 2), z: ficha.position.z }
                existe = existeFichaEnPosicion(initialPos.x, initialPos.z);
                if (!existe) {
                    positions.push(initialPos);
                }
            }
        }

        let killIzq = { x: ficha.position.x - 0.425, z: ficha.position.z + 0.425 }
        let killDer = { x: ficha.position.x - 0.425, z: ficha.position.z - 0.425 }
        if (existeFichaEnPosicion(killIzq.x, killIzq.z).kill) {
            killPositions.push(killIzq);
        }
        if (existeFichaEnPosicion(killDer.x, killDer.z).kill) {
            killPositions.push(killDer);
        }
    } else {
        initialPos = { x: ficha.position.x + 0.425, z: ficha.position.z }
        let existe = existeFichaEnPosicion(initialPos.x, initialPos.z);
        if (existe) {
            fichaEncontrada = true;
        }
        if (!fichaEncontrada) {
            positions.push(initialPos);
            if (ficha.position.x.toFixed(2) == (ultimaCasilla + 0.425).toFixed(2)) {
                initialPos = { x: ficha.position.x + (0.425 * 2), z: ficha.position.z }
                existe = existeFichaEnPosicion(initialPos.x, initialPos.z);
                if (!existe) {
                    positions.push(initialPos);
                }
            }
        }

        let killIzq = { x: ficha.position.x + 0.425, z: ficha.position.z + 0.425 }
        let killDer = { x: ficha.position.x + 0.425, z: ficha.position.z - 0.425 }
        if (existeFichaEnPosicion(killIzq.x, killIzq.z).kill) {
            killPositions.push(killIzq);
        }
        if (existeFichaEnPosicion(killDer.x, killDer.z).kill) {
            killPositions.push(killDer);
        }
    }

    seleccionaCasillas(positions, killPositions);
    return positions;
}

function getTowerPositions(ficha) {
    let positions = [];
    let killPositions = [];
    let i = 2;
    let fichaEncontrada = false;
    let initialPos;

    ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x - 0.425, z: ficha.position.z }, positions, killPositions, fichaEncontrada));

    while (!fichaEncontrada && initialPos.x > ultimaCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x - (0.425 * i), z: ficha.position.z }, positions, killPositions, fichaEncontrada));
        i++;
    }

    i = 2;
    fichaEncontrada = false;
    ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x + 0.425, z: ficha.position.z }, positions, killPositions, fichaEncontrada));
    while (!fichaEncontrada && initialPos.x < primeraCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x + (0.425 * i), z: ficha.position.z }, positions, killPositions, fichaEncontrada));
        i++;
    }

    i = 2;
    fichaEncontrada = false;
    ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x, z: ficha.position.z + 0.425 }, positions, killPositions, fichaEncontrada));
    while (!fichaEncontrada && initialPos.z < primeraCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x, z: ficha.position.z + (0.425 * i) }, positions, killPositions, fichaEncontrada));
        i++;
    }

    i = 2;
    fichaEncontrada = false;
    ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x, z: ficha.position.z - 0.425 }, positions, killPositions, fichaEncontrada));
    while (!fichaEncontrada && initialPos.z > ultimaCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x, z: ficha.position.z - (0.425 * i) }, positions, killPositions, fichaEncontrada));

        i++;
    }

    seleccionaCasillas(positions, killPositions);
    return positions;
}

function getAlfilPositions(ficha) {
    let positions = [];
    let killPositions;
    let fichaEncontrada = false;
    let initialPos;

    let i = 2;
    ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x - 0.425, z: ficha.position.z - 0.425 }, positions, [], fichaEncontrada));
    while (!fichaEncontrada && initialPos.x > ultimaCasilla && initialPos.z > ultimaCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x - (0.425 * i), z: ficha.position.z - (0.425 * i) }, positions, killPositions, fichaEncontrada));
        i++;
    }

    i = 2;
    fichaEncontrada = false;
    ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x - 0.425, z: ficha.position.z + 0.425 }, positions, killPositions, fichaEncontrada));
    while (!fichaEncontrada && initialPos.x > ultimaCasilla && initialPos.z < primeraCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x - (0.425 * i), z: ficha.position.z + (0.425 * i) }, positions, killPositions, fichaEncontrada));
        i++;
    }

    i = 2;
    fichaEncontrada = false;
    ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x + 0.425, z: ficha.position.z + 0.425 }, positions, killPositions, fichaEncontrada));
    while (!fichaEncontrada && initialPos.x < primeraCasilla && initialPos.z < primeraCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x + (0.425 * i), z: ficha.position.z + (0.425 * i) }, positions, killPositions, fichaEncontrada));
        i++;
    }

    i = 2;
    fichaEncontrada = false;
    ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x + 0.425, z: ficha.position.z - 0.425 }, positions, killPositions, fichaEncontrada));
    while (!fichaEncontrada && initialPos.x < primeraCasilla && initialPos.z > ultimaCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x + (0.425 * i), z: ficha.position.z - (0.425 * i) }, positions, killPositions, fichaEncontrada));
        i++;
    }

    seleccionaCasillas(positions, killPositions);
    return positions;
}

function getCaballoPositions(ficha) {
    let positions = [];
    let killPositions = [];
    let fichaEncontrada = false;

    let initialPos = { x: ficha.position.x - (0.425 * 2), z: ficha.position.z - 0.425 };
    if (initialPos.x > ultimaCasilla && initialPos.z > ultimaCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x - (0.425 * 2), z: ficha.position.z - 0.425 }, positions, killPositions, fichaEncontrada));
    }

    fichaEncontrada = false;
    initialPos = { x: ficha.position.x - (0.425 * 2), z: ficha.position.z + 0.425 }
    if (initialPos.x >= ultimaCasilla && initialPos.z <= primeraCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x - (0.425 * 2), z: ficha.position.z + 0.425 }, positions, killPositions, fichaEncontrada));
    }

    fichaEncontrada = false;
    initialPos = { x: ficha.position.x - 0.425, z: ficha.position.z - (0.425 * 2) }
    if (initialPos.x >= ultimaCasilla && initialPos.z >= ultimaCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x - 0.425, z: ficha.position.z - (0.425 * 2) }, positions, killPositions, fichaEncontrada));
    }

    fichaEncontrada = false;
    initialPos = { x: ficha.position.x - 0.425, z: ficha.position.z + (0.425 * 2) }
    if (initialPos.x >= ultimaCasilla && initialPos.z <= primeraCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x - 0.425, z: ficha.position.z + (0.425 * 2) }, positions, killPositions, fichaEncontrada));
    }

    fichaEncontrada = false;
    initialPos = { x: ficha.position.x + (0.425 * 2), z: ficha.position.z - 0.425 }
    if (initialPos.x <= primeraCasilla && initialPos.z >= ultimaCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x + (0.425 * 2), z: ficha.position.z - 0.425 }, positions, killPositions, fichaEncontrada));
    }

    fichaEncontrada = false;
    initialPos = { x: ficha.position.x + (0.425 * 2), z: ficha.position.z + 0.425 }
    if (initialPos.x <= primeraCasilla && initialPos.z <= primeraCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x + (0.425 * 2), z: ficha.position.z + 0.425 }, positions, killPositions, fichaEncontrada));
    }

    fichaEncontrada = false;
    initialPos = { x: ficha.position.x + 0.425, z: ficha.position.z - (0.425 * 2) }
    if (initialPos.x <= primeraCasilla && initialPos.z >= ultimaCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x + 0.425, z: ficha.position.z - (0.425 * 2) }, positions, killPositions, fichaEncontrada));
    }

    fichaEncontrada = false;
    initialPos = { x: ficha.position.x + 0.425, z: ficha.position.z + (0.425 * 2) }
    if (initialPos.x <= primeraCasilla && initialPos.z <= primeraCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x + 0.425, z: ficha.position.z + (0.425 * 2) }, positions, killPositions, fichaEncontrada));
    }

    seleccionaCasillas(positions, killPositions);
    return positions;
}

function getReinaPositions(ficha) {
    let positions = [];
    let killPositions = [];
    let i = 2;
    let fichaEncontrada = false;
    let initialPos;

    ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x - 0.425, z: ficha.position.z - 0.425 }, positions, killPositions, fichaEncontrada));
    while (!fichaEncontrada && initialPos.x > ultimaCasilla && initialPos.z > ultimaCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x - (0.425 * i), z: ficha.position.z - (0.425 * i) }, positions, killPositions, fichaEncontrada));
        i++;
    }

    i = 2;
    fichaEncontrada = false;
    ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x - 0.425, z: ficha.position.z + 0.425 }, positions, killPositions, fichaEncontrada));
    while (!fichaEncontrada && initialPos.x > ultimaCasilla && initialPos.z < primeraCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x - (0.425 * i), z: ficha.position.z + (0.425 * i) }, positions, killPositions, fichaEncontrada));
        i++;
    }

    i = 2;
    fichaEncontrada = false;
    ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x + 0.425, z: ficha.position.z + 0.425 }, positions, killPositions, fichaEncontrada));
    while (!fichaEncontrada && initialPos.x < primeraCasilla && initialPos.z < primeraCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x + (0.425 * i), z: ficha.position.z + (0.425 * i) }, positions, killPositions, fichaEncontrada));
        i++;
    }

    i = 2;
    fichaEncontrada = false;
    ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x + 0.425, z: ficha.position.z - 0.425 }, positions, killPositions, fichaEncontrada));
    while (!fichaEncontrada && initialPos.x < primeraCasilla && initialPos.z > ultimaCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x + (0.425 * i), z: ficha.position.z - (0.425 * i) }, positions, killPositions, fichaEncontrada));
        i++;
    }

    i = 2;
    fichaEncontrada = false;
    ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x - 0.425, z: ficha.position.z }, positions, killPositions, fichaEncontrada));
    while (!fichaEncontrada && initialPos.x > ultimaCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x - (0.425 * i), z: ficha.position.z }, positions, killPositions, fichaEncontrada));
        i++;
    }

    i = 2;
    fichaEncontrada = false;
    ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x + 0.425, z: ficha.position.z }, positions, killPositions, fichaEncontrada));
    while (!fichaEncontrada && initialPos.x < primeraCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x + (0.425 * i), z: ficha.position.z }, positions, killPositions, fichaEncontrada));
        i++;
    }

    i = 2;
    fichaEncontrada = false;
    ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x, z: ficha.position.z - 0.425 }, positions, killPositions, fichaEncontrada));
    while (!fichaEncontrada && initialPos.z > ultimaCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x, z: ficha.position.z - (0.425 * i) }, positions, killPositions, fichaEncontrada));
        i++;
    }

    i = 2;
    fichaEncontrada = false;
    ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x, z: ficha.position.z + 0.425 }, positions, killPositions, fichaEncontrada));
    while (!fichaEncontrada && initialPos.z < primeraCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x, z: ficha.position.z + (0.425 * i) }, positions, killPositions, fichaEncontrada));
        i++;
    }

    seleccionaCasillas(positions, killPositions);
    return positions;
}

function getReyPositions(ficha) {
    let positions = [];
    let killPositions = [];
    let fichaEncontrada = false;

    let initialPos = { x: ficha.position.x - 0.425, z: ficha.position.z - 0.425 }
    if (initialPos.x >= ultimaCasilla && initialPos.z >= ultimaCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x - 0.425, z: ficha.position.z - 0.425 }, positions, killPositions, fichaEncontrada));
    }

    fichaEncontrada = false;
    initialPos = { x: ficha.position.x - 0.425, z: ficha.position.z }
    if (initialPos.x >= ultimaCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x - 0.425, z: ficha.position.z }, positions, killPositions, fichaEncontrada));
    }

    fichaEncontrada = false;
    initialPos = { x: ficha.position.x - 0.425, z: ficha.position.z + 0.425 }
    if (initialPos.x >= ultimaCasilla && initialPos.z <= primeraCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x - 0.425, z: ficha.position.z + 0.425 }, positions, killPositions, fichaEncontrada));
    }

    fichaEncontrada = false;
    initialPos = { x: ficha.position.x, z: ficha.position.z - 0.425 }
    if (initialPos.z >= ultimaCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x, z: ficha.position.z - 0.425 }, positions, killPositions, fichaEncontrada));
    }

    fichaEncontrada = false;
    initialPos = { x: ficha.position.x, z: ficha.position.z + 0.425 }
    if (initialPos.z <= primeraCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x, z: ficha.position.z + 0.425 }, positions, killPositions, fichaEncontrada));
    }

    fichaEncontrada = false;
    initialPos = { x: ficha.position.x + 0.425, z: ficha.position.z - 0.425 }
    if (initialPos.x <= primeraCasilla && initialPos.z >= ultimaCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x + 0.425, z: ficha.position.z - 0.425 }, positions, killPositions, fichaEncontrada));
    }

    fichaEncontrada = false;
    initialPos = { x: ficha.position.x + 0.425, z: ficha.position.z }
    if (initialPos.x <= primeraCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x + 0.425, z: ficha.position.z }, positions, killPositions, fichaEncontrada));
    }

    fichaEncontrada = false;
    initialPos = { x: ficha.position.x + 0.425, z: ficha.position.z + 0.425 }
    if (initialPos.x <= primeraCasilla && initialPos.z <= primeraCasilla) {
        ({ initialPos, positions, killPositions, fichaEncontrada } = actualizarPosiciones({ x: ficha.position.x + 0.425, z: ficha.position.z + 0.425 }, positions, killPositions, fichaEncontrada));
    }

    seleccionaCasillas(positions, killPositions);
    return positions;
}

function existeFichaEnPosicion(x, z) {
    for (let i = 0; i < whiteNames.length; i++) {
        let f = scene.getObjectByName(whiteNames[i]);
        if (f.position.x.toFixed(3) == x.toFixed(3) && f.position.z.toFixed(3) == z.toFixed(3)) {
            if (fichaSeleccionada.name.includes('b_')) {
                return { kill: true }
            }
            return true;
        }
    }
    for (let i = 0; i < blackNames.length; i++) {
        let f = scene.getObjectByName(blackNames[i]);
        if (f.position.x.toFixed(3) == x.toFixed(3) && f.position.z.toFixed(3) == z.toFixed(3)) {
            if (fichaSeleccionada.name.includes('w_')) {
                return { kill: true }
            }
            return true;
        }
    }
    return false;
}

function seleccionaCasillas(positions, killPositions = []) {
    let casillasSeleccionadas = [];
    let casillasKill = [];
    //quitar todas las posiciones que, una vez encontrada una ficha en cualquier dirección, no pueda seguir avanzando
    for (let i = 0; i < casillas.length; i++) {
        let casilla = scene.getObjectByName('tablero').getObjectByName(casillas[i]).parent;
        for (let p = 0; p < positions.length; p++) {
            if (positions[p].x.toFixed(3) == casilla.position.x.toFixed(3) && positions[p].z.toFixed(3) == casilla.position.z.toFixed(3)) {
                casillasSeleccionadas.push(casilla)
            }
        }

        for (let p = 0; p < killPositions.length; p++) {
            if (killPositions[p].x.toFixed(3) == casilla.position.x.toFixed(3) && killPositions[p].z.toFixed(3) == casilla.position.z.toFixed(3)) {
                casillasKill.push(casilla)
            }
        }
    }
    resetTablero();
    casillasSeleccionadas.forEach((e) => {
        e.children[0].material = new THREE.MeshPhongMaterial({ color: 'red', specular: '#f0f0f0', shininess: brilloCasillas });
    })
    casillasKill.forEach((e) => {
        e.children[0].material = new THREE.MeshPhongMaterial({ color: 'purple', specular: '#f0f0f0', shininess: brilloCasillas });
    })
    casillasPosibles = casillasSeleccionadas;
    casillasPosiblesKill = casillasKill;
}

function actualizarPosiciones(initialPos, positions, killPositions, fichaEncontrada) {
    let existe = existeFichaEnPosicion(initialPos.x, initialPos.z);
    if (existe && !fichaEncontrada) {
        if (existe.kill) {
            killPositions.push(initialPos);
        }

        fichaEncontrada = true;
    } else {
        positions.push(initialPos);
    }

    return { initialPos, positions, killPositions, fichaEncontrada }
}

function updateTurno() {
    if (winner.length) {

    } else {
        console.log('turno', turno);
        turno++;
        scene.getObjectByName('bordes').children.forEach((e) => {
            e.material = new THREE.MeshPhongMaterial({ color: turno % 2 ? 'black' : 'white', specular: '#f0f0f0', shininess: brilloFichas });
        }
        );
    }
}

function updateWinner() {
    if (!whiteNames.find((name) => name.includes('rey'))) {
        winner = 'b';
        suelo.material = new THREE.MeshStandardMaterial({ color: 'black', roughness: 0.7 });
    } else if (!blackNames.find((name) => name.includes('rey'))) {
        winner = 'w';
        suelo.material = new THREE.MeshStandardMaterial({ color: 'white', roughness: 0.7 });
    }
}

function loadGUI() {
    effectController = {
        vistaBlancas: () => {
            mirarBlancas();
        },
        vistaNegras: () => {
            mirarNegras();
        },
        restart: () => {
            loadScene();
        }
    };

    // Creacion interfaz
    const gui = new GUI();

    // Construccion del menu
    const h = gui.addFolder("Control vistas");
    h.add(effectController, "vistaBlancas").name("Vista blancas");
    h.add(effectController, "vistaNegras").name("Vsita negras");
    h.add(effectController, "restart").name("Volver a empezar");

}

function update(delta) {
    /*******************
    * TO DO: Actualizar tween
    *******************/
    TWEEN.update();
    estadoCamara = camera.position;
}

function render(delta) {
    requestAnimationFrame(render);
    update(delta);
    renderer.render(scene, camera);
}