import { NonEntityElement } from "../elements/nonEntityElement";
import { ElementVm } from "./elementVm";

export interface NonEntityElementVm extends ElementVm {
  visible: boolean
}

export const NonEntityElementVm = {
  fromElement(element: NonEntityElement): NonEntityElementVm {
    return {
      ...ElementVm.fromElement(element),
      visible: element.visible
    }
  }
}