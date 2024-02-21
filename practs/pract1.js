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

// Variables de consenso
let renderer, scene, camera;

// Otras globales
/*******************
 * TO DO: Variables globales de la aplicacion
 *******************/
let objetos;
let angulo = 0;
let robot;


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
    scene.background = new THREE.Color(0.5,0.5,0.5);
    
    // Camara
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1,1000);
    camera.position.set( 0.5, 2, 7 );
    camera.lookAt( new THREE.Vector3(0,1,0) );
}

function loadScene()
{
    const material = new THREE.MeshNormalMaterial({ color: 'yellow', wireframe: false });
    const sueloMaterial = new THREE.MeshBasicMaterial({ color: 0x474133 });

    /*******************
    * TO DO: Construir un suelo en el plano XZ
    *******************/
    const suelo = new THREE.Mesh( new THREE.PlaneGeometry(10,10, 10,10), sueloMaterial );
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);

    /*******************
    * TO DO: Construir una escena con 5 figuras diferentes posicionadas
    * en los cinco vertices de un pentagono regular alredor del origen
    *******************/
    objetos = new THREE.Object3D();
    scene.add(objetos)

    const geometries = [new THREE.BoxGeometry(1,1,1),new THREE.ConeGeometry(0.5, 1),new THREE.TorusGeometry(0.5,0.2),new THREE.LatheGeometry(),new THREE.CapsuleGeometry(0.5)];
    for (let i = 0; i < 5; i++) {
        const cube = new THREE.Mesh(geometries[i], material);
        const angle = (i / 5) * Math.PI * 2;
        cube.position.set(Math.cos(angle) * 2, 1, Math.sin(angle) * 2);
        objetos.add(cube);
    }

    

    /*******************
    * TO DO: Añadir a la escena un modelo importado en el centro del pentagono
    *******************/
    const loader = new THREE.ObjectLoader();

    loader.load( 'models/soldado/soldado.json', 
        function(objeto){
            robot = objeto;
            suelo.add(objeto);
            objeto.position.set(0, 0, 0);
            objeto.rotation.x = Math.PI / 2;
            objeto.rotation.y = Math.PI / 2;
        }
    )

    /*******************
    * TO DO: Añadir a la escena unos ejes
    *******************/
    suelo.add( new THREE.AxesHelper(3) );
}

function update()
{
    /*******************
    * TO DO: Modificar el angulo de giro de cada objeto sobre si mismo
    * y del conjunto pentagonal sobre el objeto importado
    *******************/
    angulo += 0.1;
    objetos.rotation.y = angulo
    robot.rotation.y = angulo

}

function render()
{
    requestAnimationFrame( render );
    update();
    renderer.render( scene, camera );
}