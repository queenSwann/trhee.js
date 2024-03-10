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
import Ficha from "./fichas.js";


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
    scene.background = new THREE.Color(1, 1, 1);

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
    // var geometry = new THREE.PlaneGeometry(10000, 10000);
    // suelo = new THREE.Mesh(geometry, sueloMaterial);
    // suelo.rotation.x = -Math.PI / 2;
    // suelo.position.y = -1.05;
    // scene.add(suelo);

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

    // // Cargar la textura del gradiente
    const textureLoader = new THREE.TextureLoader();
    const gradientTexture = textureLoader.load('entregas/scene_e1/gradient_floor.png');
    const gradientMaterial = new THREE.MeshBasicMaterial({ map: gradientTexture });
    const gradientGeometry = new THREE.PlaneGeometry(25, 25);
    suelo = new THREE.Mesh(gradientGeometry, gradientMaterial);
    suelo.rotation.x = Math.PI * -0.5;
    suelo.position.y = -1;
    scene.add(suelo);

    //bordes del suelo
    let initialColor = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const geoBorde1 = new THREE.BoxGeometry(25, 0.1, 0.1);
    const borde1 = new THREE.Mesh(geoBorde1, initialColor);
    borde1.position.y = -1;
    borde1.position.z = 12.5;
    borde1.position.x = 0;
    scene.add(borde1);

    const geoBorde2 = new THREE.BoxGeometry(25, 0.1, 0.1);
    const borde2 = new THREE.Mesh(geoBorde2, initialColor);
    borde2.position.y = -1;
    borde2.position.z = 0;
    borde2.position.x = 12.5;
    borde2.rotation.y = Math.PI / 2;
    scene.add(borde2);



    const textureLoader2 = new THREE.TextureLoader();
    const gradientTexture2 = textureLoader2.load('entregas/scene_e1/concrete.jpg');
    let material = new THREE.MeshStandardMaterial({
        map: gradientTexture2, // Tu textura
        roughness: 0.7, // Ajusta la rugosidad según tus necesidades
        metalness: 0 // Ajusta la metalicidad según tus necesidades
    });
    let materialWhite = new THREE.MeshPhongMaterial({ color: 'white', specular: '#f0f0f0', shininess: brilloCasillas });
    let materialBlack = new THREE.MeshPhongMaterial({ color: 'black', specular: '#f0f0f0', shininess: brilloCasillas });

    // const loader = new THREE.CubeTextureLoader();
    // const cubemap = loader.load(["entregas/scene_e1/posx.jpg", "entregas/scene_e1/negx.jpg",
    //     "entregas/scene_e1/posy.jpg", "entregas/scene_e1/negy.jpg",
    //     "entregas/scene_e1/posz.jpg", "entregas/scene_e1/negz.jpg"]);
    // scene.background = cubemap;

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

function loadWhite() {
    let white = new THREE.MeshPhongMaterial({ color: 'white', specular: '#f0f0f0', shininess: brilloFichas });

    let list = [];
    for (let i = 0; i < 8; i++) {
        let peon = Ficha.loadPeon(white, 1, i)
        peon.name = whiteNames[i]
        list.push(peon)
    }

    let alfil1 = Ficha.loadAlfil(white, 0, 2)
    alfil1.name = whiteNames[8]
    let alfil2 = Ficha.loadAlfil(white, 0, 5)
    alfil2.name = whiteNames[9]
    list.push(alfil1)
    list.push(alfil2)

    let tower1 = Ficha.loadTower(white, 0, 0)
    tower1.name = whiteNames[10]
    let tower2 = Ficha.loadTower(white, 0, 7)
    tower2.name = whiteNames[11]
    list.push(tower1)
    list.push(tower2)

    let caballo1 = Ficha.loadCaballo(white, 0, 1, true);
    caballo1.name = whiteNames[12]
    let caballo2 = Ficha.loadCaballo(white, 0, 6, true);
    caballo2.name = whiteNames[13]
    list.push(caballo1)
    list.push(caballo2)

    let reina = Ficha.loadReina(white, 0, 4)
    reina.name = whiteNames[14]
    list.push(reina)

    let rey = Ficha.loadRey(white, 0, 3)
    rey.name = whiteNames[15]
    list.push(rey)

    return list;
}

function loadBlack() {
    let black = new THREE.MeshPhongMaterial({ color: 'black', specular: '#f0f0f0', shininess: brilloFichas });

    let list = [];
    for (let i = 0; i < 8; i++) {
        let peon = Ficha.loadPeon(black, 6, i)
        peon.name = blackNames[i]
        list.push(peon)
    }

    let alfil1 = Ficha.loadAlfil(black, 7, 2)
    alfil1.name = blackNames[8]
    let alfil2 = Ficha.loadAlfil(black, 7, 5)
    alfil2.name = blackNames[9]
    list.push(alfil1)
    list.push(alfil2)

    let tower1 = Ficha.loadTower(black, 7, 0)
    tower1.name = blackNames[10]
    let tower2 = Ficha.loadTower(black, 7, 7)
    tower2.name = blackNames[11]
    list.push(tower1)
    list.push(tower2)

    let caballo1 = Ficha.loadCaballo(black, 7, 1, false);
    caballo1.name = blackNames[12]
    let caballo2 = Ficha.loadCaballo(black, 7, 6, false);
    caballo2.name = blackNames[13]
    list.push(caballo1)
    list.push(caballo2)

    let reina = Ficha.loadReina(black, 7, 4)
    reina.name = blackNames[14]
    list.push(reina)

    let rey = Ficha.loadRey(black, 7, 3)
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
                let ficha = fichaSeleccionada;
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
                    updateWinner(ficha);
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
        });
    }
}

function updateWinner(ficha) {
    let initialPos = { x: ficha.position.x, z: ficha.position.z, y: ficha.position.y };
    if (!whiteNames.find((name) => name.includes('rey'))) {
        winner = 'b';
        blackNames.forEach((name) => {
            let f = scene.getObjectByName(name);
            setInterval(() => {
                new TWEEN.Tween(f.position).
                    to({ y: [initialPos.y + 0.15, initialPos.y] }, 1000).
                    interpolation(TWEEN.Interpolation.Bezier).
                    easing(TWEEN.Easing.Quadratic.InOut).
                    onUpdate(() => {
                        f.children.forEach((e) => {
                            e.rotation.y += 0.1;
                        }) 
                    }).
                    start();
            }
            , 1000);});
    } else if (!blackNames.find((name) => name.includes('rey'))) {
        winner = 'w';
        whiteNames.forEach((name) => {
            let f = scene.getObjectByName(name);
            setInterval(() => {
                new TWEEN.Tween(f.position).
                    to({ y: [initialPos.y + 0.15, initialPos.y] }, 1000).
                    interpolation(TWEEN.Interpolation.Bezier).
                    easing(TWEEN.Easing.Quadratic.InOut).
                    onUpdate(() => {
                        f.children.forEach((e) => {
                            e.rotation.y += 0.1;
                        }) 
                    }).
                    start();
            }
            , 1000);});
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
        },
        inst1: false,
        inst2: false,
        inst3: false,
        inst4: false,
        inst5: false,
        indi1: false,
        indi2: false,
        indi3: false,
    };

    // Creacion interfaz
    const gui = new GUI();

    // Construccion del menu
    const h = gui.addFolder("Controles del juego");
    h.add(effectController, "vistaBlancas").name("Vista blancas");
    h.add(effectController, "vistaNegras").name("Vsita negras");
    h.add(effectController, "restart").name("Volver a empezar");

    const indi = gui.addFolder("Indicadores del juego")
    indi.add(effectController, "indi1").name("El borde del tablero indicará el color del turno en que nos encontramos. Si es blanco, es el turo de las fichas blancas.");
    indi.add(effectController, "indi2").name("Al seleccionar una ficha, está se volverá de color ROJO para indicar que la hemos seleccionado correctamente.");
    indi.add(effectController, "inst3").name("Las casillas a las que podremos movernos se resaltarán de ROJO, en caso de ser un movimiento posible o en MORADO, en caso de poder matar una ficha enemiga");

    const inst = gui.addFolder("Instrucciones de uso")
    inst.add(effectController, "inst1").name("Click en una ficha para seleccionarla y ver sus posibles movimientos");
    inst.add(effectController, "inst2").name("Doble click en una casilla resaltada para mover la ficha seleccionada");
    inst.add(effectController, "inst3").name("Si hay una ficha enemiga al alcance, se marcará de color morado y se podrá eliminar");
    inst.add(effectController, "inst4").name("Si el rey es eliminado, el juego termina. La fichas del equipo ganador \"saltarán\".");
    inst.add(effectController, "inst5").name("Si la partida termina o se quiere reiniciar, pulsar el botón 'Volver a empezar'");

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