//clase que genera las fichas
import * as THREE from "../lib/three.module.js";

export default class Ficha {
    static loadPeon(material, posX, posY) {
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
    
    static loadAlfil(material, posX, posY) {
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
    
    static loadTower(material, posX, posY) {
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
    
    static loadReina(material, posX, posY) {
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
    
    static loadRey(material, posX, posY) {
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
    
    static loadCaballo(material, posX, posY, north) {
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
}