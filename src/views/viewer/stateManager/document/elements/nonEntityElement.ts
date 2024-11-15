import { ElementType } from "@/views/types/elementType"
import { BaseElement } from './baseElement';

export class NonEntityElement extends BaseElement {
  visible: boolean
  constructor(type: ElementType, elementId?: number) {
    super(type, elementId)
    this.visible = true
  }
}