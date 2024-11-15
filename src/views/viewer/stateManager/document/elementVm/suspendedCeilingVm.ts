import { SuspendedCeiling } from "../elements/suspendedCeiling";
import { EntityElementVm } from "./entityElementVm";
import * as THREE from 'three'

export interface SuspendedCeilingVm extends EntityElementVm {
  url: string
  bottom: number
  height: number
  center: THREE.Vector2
  size: THREE.Vector2
}

export const SuspendedCeilingVm = {
  fromElement(element: SuspendedCeiling): SuspendedCeilingVm {
    return {
      ...EntityElementVm.fromElement(element),
      url: element.url,
      bottom: element.bottom,
      height: element.height,
      center: element.center.clone(),
      size: element.size.clone()
    }
  }
}