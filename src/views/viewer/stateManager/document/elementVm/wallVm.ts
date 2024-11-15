
import { LineSegment2 } from "@/math/lineSegment2";
import { HoleInfo } from "@/views/types/dataType";
import { Wall } from "../elements/wall";
import { EntityElementVm } from "./entityElementVm";
import * as THREE from 'three'

export interface WallVm extends EntityElementVm {
  edgeId: number
  curve2d: LineSegment2
  realCurve2d: LineSegment2
  height: number
  thickness: number
  attachIds: number[]
  holes: THREE.Box3[]
  holeInfos: HoleInfo[]
}

export const WallVm = {
  fromElement(element: Wall): WallVm {
    return {
      ...EntityElementVm.fromElement(element),
      edgeId: element.edgeId,
      curve2d: element.curve2d.clone(),
      realCurve2d: element.realCurve2d.clone(),
      height: element.height,
      thickness: element.thickness,
      attachIds: [...element.attachIds],
      holes: [...element.holes],
      holeInfos: [...element.holeInfos]
    }
  }
}