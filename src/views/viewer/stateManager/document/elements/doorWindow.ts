import { ElementType } from "@/views/types/elementType"
import { EntityElement } from "./entityElement";
import * as THREE from 'three'
import { LineSegment2 } from "@/math/lineSegment2";

export class DoorWindow extends EntityElement {
  hostIds: number[]
  position: THREE.Vector3
  rotation: THREE.Euler
  scale: THREE.Vector3
  url: string
  curve2d: LineSegment2

  constructor(type: ElementType, elementId?: number) {
    super(type, elementId)
    this.hostIds = []
    this.position = new THREE.Vector3()
    this.rotation = new THREE.Euler()
    this.scale = new THREE.Vector3()
    this.url = ''
    this.curve2d = new LineSegment2(new THREE.Vector2(), new THREE.Vector2(1, 0))
  }
}