import * as THREE from 'three'
import { Context3d } from './context3d'

export class GraphicContext {
  private context3d: Context3d

  entityGroup: THREE.Group
  nonEntityGroup: THREE.Group
  spriteGroup: THREE.Group

  constructor(c: Context3d) {
    this.context3d = c
    this.entityGroup = new THREE.Group()
    this.entityGroup.name = 'entityGroup'
    this.nonEntityGroup = new THREE.Group()
    this.nonEntityGroup.name = 'nonEntityGroup'
    this.spriteGroup = new THREE.Group()
    this.spriteGroup.name = 'spriteGroup'
    this.context3d.env.scene.add(this.entityGroup, this.nonEntityGroup, this.spriteGroup)
  }

  addEntity(obj: THREE.Object3D) {
    this.entityGroup.add(obj)
  }

  deleteEntity(obj: THREE.Object3D) {
    this.entityGroup.remove(obj)
  }

  addSprite(sprite: THREE.Sprite) {
    this.spriteGroup.add(sprite)
  }

  removeSprite(sprite: THREE.Sprite) {
    this.spriteGroup.remove(sprite)
  }
}
