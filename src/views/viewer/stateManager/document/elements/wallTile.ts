import { ElementType } from "@/views/types/elementType"
import { EntityElement } from "./entityElement";

export class WallTile extends EntityElement {
  hostIds: number[]
  constructor(elementId?: number) {
    super(ElementType.WallTile, elementId)
    this.hostIds = []
  }
}