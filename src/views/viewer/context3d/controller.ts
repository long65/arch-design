import { Context3d } from "./context3d"
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Controller {
  private context3d: Context3d

  enabled: boolean
  camera: THREE.PerspectiveCamera
  orbitControl: OrbitControls

  defaultCameraPosition: THREE.Vector3
  defaultTarget: THREE.Vector3

  constructor(c: Context3d) {
    this.context3d = c
    this.enabled = true

    const aspect = c.rootElement.clientWidth / c.rootElement.clientHeight
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100)
    this.camera.up.set(0, 0, 1)
    this.orbitControl = new OrbitControls(this.camera, c.renderer.domElement)
    this.orbitControl.maxDistance = 80
  }

  update() {
    this.orbitControl.update()
  }

  initializeCamera(position: THREE.Vector3, target: THREE.Vector3) {
    this.camera.position.copy(position)
    this.orbitControl.target.copy(target)

    this.defaultCameraPosition = position.clone()
    this.defaultTarget = target.clone()
  }

  resize(width: number, height: number) {
    const aspect = width / height
    this.camera.aspect = aspect
    this.camera.updateProjectionMatrix()
  }

  dispose () {
    this.orbitControl.dispose()
  }
}