import * as THREE from 'three'
import { dispose } from '../utils/util'

export class Environment {
  scene: THREE.Scene
  lights: THREE.Group

  constructor() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xffffff)

    this.lights = new THREE.Group()
    this.lights.name = 'lights'
    this.scene.add(this.lights)

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
    this.lights.add(ambientLight)

    const distance = 50
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(distance, -distance, distance)
    this.lights.add(directionalLight)

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6)
    directionalLight2.position.set(-distance, -distance, distance)
    this.lights.add(directionalLight2)

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.7)
    directionalLight3.position.set(-distance, distance, -distance)
    this.lights.add(directionalLight3)

    const directionalLight4 = new THREE.DirectionalLight(0xffffff, 0.6)
    directionalLight4.position.set(distance, distance, distance)
    this.lights.add(directionalLight4)
  }

  dispose() {
    dispose(this.scene)
    this.scene.clear()
  }
}
