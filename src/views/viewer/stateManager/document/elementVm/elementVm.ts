import { ElementType } from "@/views/types/elementType"
import { BaseElement } from "../elements/baseElement";

export interface ElementVm {
  elementId: number
  elementType: ElementType
}

export const ElementVm = {
  fromElement(element: BaseElement): ElementVm {
    return {
      elementId: element.elementId,
      elementType: element.elementType
    }
  }
}
