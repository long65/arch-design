import { ElementType } from "@/views/types/elementType"

import { EntityElement } from "./entityElement";
import * as THREE from 'three'
import { LineSegment2 } from "@/math/lineSegment2";
import { HoleInfo } from "@/views/types/dataType";

export class Wall extends EntityElement {
  edgeId: number
  curve2d: LineSegment2
  realCurve2d: LineSegment2
  height: number
  thickness: number
  attachIds: number[]
  holes: THREE.Box3[]
  holeInfos: HoleInfo[]

  constructor(type: ElementType, elementId?: number) {
    super(type, elementId)
    this.edgeId = 0
    this.height = 0
    this.thickness = 0
    this.curve2d = new LineSegment2(new THREE.Vector2(), new THREE.Vector2(1, 0))
    this.realCurve2d = new LineSegment2(new THREE.Vector2(), new THREE.Vector2(1, 0))
    this.attachIds = []
    this.holes = []
    this.holeInfos = []
    this.roomIds.push('outside', 'outside')
  }
}
