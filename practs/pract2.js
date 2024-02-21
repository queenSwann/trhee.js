/**
 * EscenaAnimada.js
 * 
 * Practica AGM #2. Escena basica con interfaz y animacion
 * Se trata de añadir un interfaz de usuario que permita 
 * disparar animaciones sobre los objetos de la escena con Tween
 * 
 * @author 
 * 
 */

// Modulos necesarios
/*******************
 * TO DO: Cargar los modulos necesarios
 *******************/
import * as THREE from "../lib/three.module.js";
import {OrbitControls} from "../lib/OrbitControls.module.js";
import {TWEEN} from "../lib/tween.module.min.js";
import {GUI} from "../lib/lil-gui.module.min.js";

// Variables de consenso
let renderer, scene, camera;

// Otras globales
/*******************
 * TO DO: Variables globales de la aplicacion
 *******************/
let cameraControls, effectController;
let objetos;
let radio = 2;

let figuras = [];
let material

// Acciones
init();
loadScene();
loadGUI();
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
    /*******************
    * TO DO: Añadir manejador de camara (OrbitControls)
    *******************/
    cameraControls = new OrbitControls( camera, renderer.domElement );
    cameraControls.target.set(0,1,0);
    camera.lookAt(0,1,0);

    camera.lookAt( new THREE.Vector3(0,1,0) );

    renderer.domElement.addEventListener('click', animate );
}

function loadScene()
{
    /*******************
    * TO DO: Misma escena que en la practica anterior
    *******************/
    material = new THREE.MeshNormalMaterial({ color: 'yellow', wireframe: false });
    const sueloMaterial = new THREE.MeshBasicMaterial({ color: 0x474133 });

    const suelo = new THREE.Mesh( new THREE.PlaneGeometry(10,10, 10,10), sueloMaterial );
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);

    objetos = new THREE.Object3D();
    scene.add(objetos)

    const geometries = [new THREE.BoxGeometry(1,1,1),new THREE.ConeGeometry(0.5, 1),new THREE.TorusGeometry(0.5,0.2),new THREE.LatheGeometry(),new THREE.CapsuleGeometry(0.5)];
    
    const cube = new THREE.Mesh(geometries[0], material);
    const angle = (0 / 5) * Math.PI * 2;
    cube.position.set(Math.cos(angle) * radio, 1, Math.sin(angle) * radio);
    objetos.add(cube);
    figuras.push(cube);

    const cube1 = new THREE.Mesh(geometries[1], material);
    const angle1 = (1 / 5) * Math.PI * 2;
    cube1.position.set(Math.cos(angle1) * radio, 1, Math.sin(angle1) * radio);
    objetos.add(cube1);
    figuras.push(cube1)

    const cube2 = new THREE.Mesh(geometries[2], material);
    const angle2 = (2 / 5) * Math.PI * 2;
    cube2.position.set(Math.cos(angle2) * radio, 1, Math.sin(angle2) * radio);
    objetos.add(cube2);
    figuras.push(cube2)

    const cube3 = new THREE.Mesh(geometries[3], material);
    const angle3 = (3 / 5) * Math.PI * 2;
    cube3.position.set(Math.cos(angle3) * radio, 1, Math.sin(angle3) * radio);
    objetos.add(cube3);
    figuras.push(cube3)

    const cube4 = new THREE.Mesh(geometries[4], material);
    const angle4 = (4 / 5) * Math.PI * 2;
    cube4.position.set(Math.cos(angle4) * radio, 1, Math.sin(angle4) * radio);
    objetos.add(cube4);
    figuras.push(cube4)

    const loader = new THREE.ObjectLoader();

    loader.load( 'models/soldado/soldado.json', 
        function(objeto){
            const soldado = new THREE.Object3D();
            soldado.add(objeto);
            suelo.add(soldado);
            objeto.position.set(0, 0, 0);
            objeto.rotation.x = Math.PI / 2;
            objeto.rotation.y = Math.PI / 2;
            soldado.name = 'soldado';
        }
    )

    suelo.add( new THREE.AxesHelper(3) );
}

function loadGUI()
{
    // Interfaz de usuario
    /*******************
    * TO DO: Crear la interfaz de usuario con la libreria lil-gui.js
    * - Funcion de disparo de animaciones. Las animaciones deben ir
    *   encadenadas
    * - Slider de control de radio del pentagono
    * - Checkbox para alambrico/solido
    *******************/

    //SLIDER CONTROL DE RADIO DEL PENTAGONO & CHECKBOX
   // Definicion de los controles
	effectController = {
        radio: 2,
        alambres: false
	};
    // Creacion interfaz
	const gui = new GUI();

	// Construccion del menu
	const h = gui.addFolder("Control escena");
	h.add(effectController, "radio", 0.0, 4.0, 0.1).name("Radio pentágono");
    h.add(effectController, "alambres").name("Mostrar alambres")

}

function animate(event)
{
    // Capturar y normalizar
    let x= event.clientX;
    let y = event.clientY;
    x = ( x / window.innerWidth ) * 2 - 1;
    y = -( y / window.innerHeight ) * 2 + 1;

    // Construir el rayo y detectar la interseccion
    const rayo = new THREE.Raycaster();
    rayo.setFromCamera(new THREE.Vector2(x,y), camera);
    const soldado = scene.getObjectByName('soldado');
    let intersecciones = rayo.intersectObjects(soldado.children,true);

    if( intersecciones.length > 0 ){
        new TWEEN.Tween( soldado.position ).
        to( {x:[0,0],y:[0,0],z:[10,0]}, 5000 ).
        interpolation( TWEEN.Interpolation.Bezier ).
        easing( TWEEN.Easing.Quadratic.InOut ).
        onUpdate(function() {
            // Esta función se ejecutará en cada fotograma de la animación
            soldado.rotation.z += 0.6; // Ajusta el ángulo de rotación
        }).
        start();
    }
}

function update(delta)
{
    /*******************
    * TO DO: Actualizar tween
    *******************/
    TWEEN.update();

   radio = effectController.radio
   for(let i = 0; i<5; i++){
    const angle = (i / 5) * Math.PI * 2;
    figuras[i].position.set(Math.cos(angle) * radio, 1, Math.sin(angle) * radio);
   }

   material.wireframe = effectController.alambres
   
}

function render(delta)
{
    requestAnimationFrame( render );
    update(delta);
    renderer.render( scene, camera );
}