import { ElementType } from "@/views/types/elementType"

export class BaseElement {
  static _ElementId = 0

  readonly elementId: number
  readonly elementType: ElementType

  constructor(type: ElementType, elementId?: number) {
    this.elementId = elementId ?? BaseElement._ElementId++
    this.elementType = type
  }
}