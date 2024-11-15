import { LineSegment2 } from "@/math/lineSegment2";
import { Floor } from "../elements/floor";
import { EntityElementVm } from "./entityElementVm";

export interface FloorVm extends EntityElementVm {
  outline: LineSegment2[]
  positionZ: number
  imageUrl: string
}

export const FloorVm = {
  fromElement(element: Floor): FloorVm {
    return {
      ...EntityElementVm.fromElement(element),
      outline: [...element.outline],
      positionZ: element.positionZ,
      imageUrl: element.imageUrl
    }
  }
}