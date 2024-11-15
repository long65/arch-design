import { ElementType } from "@/views/types/elementType"
import { EntityElement } from "./entityElement";
import * as THREE from 'three'

export class Furniture extends EntityElement {
  position: THREE.Vector3
  rotation: THREE.Euler
  scale: THREE.Vector3
  url: string
  mainModels: string
  parentId: string
  materialInfo: any

  constructor(elementId?: number) {
    super(ElementType.Furniture, elementId)
    this.position = new THREE.Vector3()
    this.rotation = new THREE.Euler()
    this.scale = new THREE.Vector3()
    this.url = ''
    this.mainModels = ''
    this.parentId = ''
    this.materialInfo = {}
  }
}
