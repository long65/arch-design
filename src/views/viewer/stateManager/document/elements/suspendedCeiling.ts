import { ElementType } from "@/views/types/elementType"
import { EntityElement } from "./entityElement";
import * as THREE from 'three'

export class SuspendedCeiling extends EntityElement {
  url: string
  bottom: number
  height: number
  center: THREE.Vector2
  size: THREE.Vector2
  constructor(elementId?: number) {
    super(ElementType.SuspendedCeiling, elementId)
    this.url = ''
    this.bottom = 0
    this.height = 0.3
    this.center = new THREE.Vector2()
    this.size = new THREE.Vector2()
  }
}