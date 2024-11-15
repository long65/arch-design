import { ParametricModeling } from "../elements/parametricModeling";
import { EntityElementVm } from "./entityElementVm";
import * as THREE from 'three'

export interface ParametricModelingVm extends EntityElementVm {
  shape: THREE.Vector2[]
  holes: THREE.Vector2[][]
}

export const ParametricModelingVm = {
  fromElement(element: ParametricModeling) : ParametricModelingVm {
    return {
      ...EntityElementVm.fromElement(element),
      shape: [...element.shape],
      holes: [...element.holes]
    }
  }
}