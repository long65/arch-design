import { ElementType } from "@/views/types/elementType"
import { EntityElement } from "./entityElement";
import * as THREE from 'three'

export class ParametricModeling extends EntityElement {
  shape: THREE.Vector2[]
  holes: THREE.Vector2[][]

  constructor(elementId?: number) {
    super(ElementType.ParametricModeling, elementId)
    this.shape = []
    this.holes = []
  }
}