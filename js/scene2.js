/**
 * Escena.js
 * 
 * Practica AGM #1. Escena basica en three.js
 * Seis objetos organizados en un grafo de escena con
 * transformaciones, animacion basica y modelos importados
 * 
 * @author 
 * 
 */

// Modulos necesarios
/*******************
 * TO DO: Cargar los modulos necesarios
 *******************/
import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "../lib/GLTFLoader.module.js";

// Variables de consenso
let renderer, scene, camera;

// Otras globales
/*******************
 * TO DO: Variables globales de la aplicacion
 *******************/
let objetos;
let angulo = 0;


// Acciones
init();
loadScene();
render();

function init()
{
    // Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    /*******************
    * TO DO: Completar el motor de render y el canvas
    *******************/
    document.getElementById('container').appendChild( renderer.domElement );

    // Escena
    scene = new THREE.Scene();
    
    // Camara
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1,1000);
    camera.position.set( 0.5, 2, 7 );
    camera.lookAt( new THREE.Vector3(0,1,0) );
}

function loadScene()
{
    const material = new THREE.MeshNormalMaterial({ color: 'yellow', wireframe: true });

    /*******************
    * TO DO: Construir un suelo en el plano XZ
    *******************/
    const suelo = new THREE.Mesh( new THREE.PlaneGeometry(10,10, 10,10), material );
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);

    /*******************
    * TO DO: Construir una escena con 5 figuras diferentes posicionadas
    * en los cinco vertices de un pentagono regular alredor del origen
    *******************/
    objetos = new THREE.Object3D();
    scene.add(objetos)

    let i = 0;
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const cube = new THREE.Mesh(geometry, material);
    const angle = (i / 5) * Math.PI * 2;
    cube.position.set(Math.cos(angle) * 2, 0, Math.sin(angle) * 2);
    objetos.add(cube);
    i++;

    const geometry1 = new THREE.SphereGeometry(0.5, 0.5, 0.5);
    const cube1 = new THREE.Mesh(geometry1, material);
    const angle1 = (i / 5) * Math.PI * 2;
    cube1.position.set(Math.cos(angle1) * 2, 0, Math.sin(angle1) * 2);
    objetos.add(cube1);
    i++;

    const geometry2 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const cube2 = new THREE.Mesh(geometry2, material);
    const angle2 = (i / 5) * Math.PI * 2;
    cube2.position.set(Math.cos(angle2) * 2, 0, Math.sin(angle2) * 2);
    objetos.add(cube2);
    i++;

    const geometry3 = new THREE.SphereGeometry(0.5, 0.5, 0.5);
    const cube3 = new THREE.Mesh(geometry3, material);
    const angle3 = (i / 5) * Math.PI * 2;
    cube3.position.set(Math.cos(angle3) * 2, 0, Math.sin(angle3) * 2);
    objetos.add(cube3);
    i++;

    

    /*******************
    * TO DO: Añadir a la escena un modelo importado en el centro del pentagono
    *******************/
    const loader = new THREE.ObjectLoader();
    loader.load( 'models/soldado/soldado.json', 
        function(objeto){
            cubo.add(objeto);
            objeto.position.y = 1;
        }
    )

    /*******************
    * TO DO: Añadir a la escena unos ejes
    *******************/
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
}

function update()
{
    /*******************
    * TO DO: Modificar el angulo de giro de cada objeto sobre si mismo
    * y del conjunto pentagonal sobre el objeto importado
    *******************/
    angulo += 0.01;
    objetos.rotation.y = angulo
}

function render()
{
    requestAnimationFrame( render );
    update();
    renderer.render( scene, camera );
}