
import { LineSegment2 } from "@/math/lineSegment2";
import { RoomInnerDirection } from "@/views/types/dataType";
import { Room } from "../elements/room";
import { NonEntityElementVm } from "./nonEntityElementVm";
import * as THREE from 'three'

export interface RoomVm extends NonEntityElementVm {
  id: string
  type: string
  innerBox3: THREE.Box3
  box3: THREE.Box3
  originLines: LineSegment2[]
  mergeLines: LineSegment2[]
  innerLines: LineSegment2[]
  wallIds: number[]
  innerDirection: RoomInnerDirection
  shape: THREE.Vector2[]
  info: any
  wallTileUrl: string
  border: THREE.Object3D
  mergeEdges: LineSegment2[]
}

export const RoomVm = {
  fromElement(element: Room): RoomVm {
    return {
      ...NonEntityElementVm.fromElement(element),
      id: element.id,
      type: element.type,
      innerBox3: element.innerBox3.clone(),
      box3: element.box3.clone(),
      originLines: [...element.originLines],
      mergeLines: [...element.mergeLines],
      innerLines: [...element.innerLines],
      wallIds: [...element.wallIds],
      // contours: element.contours,
      innerDirection: element.innerDirection,
      shape: [...element.shape],
      info: element.info,
      wallTileUrl: element.wallTileUrl,
      border: element.border,
      mergeEdges: [...element.mergeEdges]
    }
  }
}
