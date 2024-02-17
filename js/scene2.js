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

    //FIGURA 1
    let geometry1 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    let figura1 = new THREE.Mesh(geometry1, material);
    let angle1 = (0 / 5) * Math.PI * 2;
    figura1.position.set(Math.cos(angle1) * 2, 0, Math.sin(angle1) * 2);
    objetos.add(figura1);

    //FIGURA 2
    let geometry2 = new THREE.RingGeometry(0.5, 0.5, 0.5);
    let figura2 = new THREE.Mesh(geometry2, material);
    let angle2 = (1 / 5) * Math.PI * 2;
    figura2.position.set(Math.cos(angle2) * 2, 0, Math.sin(angle2) * 2);
    objetos.add(figura2);

    //FIGURA 3
    let geometry3 = new THREE.CapsuleGeometry(0.5, 0.5, 0.5);
    let figura3 = new THREE.Mesh(geometry3, material);
    let angle3 = (2 / 5) * Math.PI * 2;
    figura3.position.set(Math.cos(angle3) * 2, 0, Math.sin(angle3) * 2);
    objetos.add(figura3);

    //FIGURA 4
    let geometry4 = new THREE.ConeGeometry(0.5, 0.5, 0.5);
    let figura4 = new THREE.Mesh(geometry4, material);
    let angle4 = (3 / 5) * Math.PI * 2;
    figura4.position.set(Math.cos(angle4) * 2, 0, Math.sin(angle4) * 2);
    objetos.add(figura4);

    //FIGURA 5
    let geometry5 = new THREE.TubeGeometry(0.5, 0.5, 0.5);
    let figura5 = new THREE.Mesh(geometry5, material);
    let angle5 = (4 / 5) * Math.PI * 2;
    figura5.position.set(Math.cos(angle5) * 2, 0, Math.sin(angle5) * 2);
    objetos.add(figura5);

    

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