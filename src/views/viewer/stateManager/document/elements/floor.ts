import { ElementType } from "@/views/types/elementType"
import { EntityElement } from "./entityElement";
import { LineSegment2 } from "@/math/lineSegment2";

export class Floor extends EntityElement {
  outline: LineSegment2[]
  positionZ: number
  imageUrl: string

  constructor(type: ElementType, elementId?: number) {
    super(type, elementId)
    this.outline = []
    this.positionZ = 0
    this.imageUrl = ''
  }
}