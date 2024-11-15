import { LineSegment2 } from "@/math/lineSegment2";
import { DoorWindow } from "../elements/doorWindow";
import { EntityElementVm } from "./entityElementVm";
import * as THREE from 'three'

export interface DoorWindowVm extends EntityElementVm {
  hostIds: number[]
  position: THREE.Vector3
  rotation: THREE.Euler
  scale: THREE.Vector3
  url: string
  curve2d: LineSegment2
}

export const DoorWindowVm = {
  fromElement(element: DoorWindow): DoorWindowVm {
    return {
      ...EntityElementVm.fromElement(element),
      hostIds: [...element.hostIds],
      position: element.position.clone(),
      rotation: element.rotation.clone(),
      scale: element.scale.clone(),
      url: element.url,
      curve2d: element.curve2d.clone()
    }
  }
}
