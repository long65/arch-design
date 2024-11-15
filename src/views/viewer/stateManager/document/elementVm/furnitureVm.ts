import { Furniture } from "../elements/furniture";
import { EntityElementVm } from "./entityElementVm";
import * as THREE from 'three'

export interface FurnitureVm extends EntityElementVm {
  position: THREE.Vector3
  rotation: THREE.Euler
  scale: THREE.Vector3
  url: string
  mainModels: string
  parentId: string
  materialInfo: any
}

export const FurnitureVm = {
  fromElement(element: Furniture): FurnitureVm {
    return {
      ...EntityElementVm.fromElement(element),
      position: element.position.clone(),
      rotation: element.rotation.clone(),
      scale: element.scale.clone(),
      mainModels: element.mainModels,
      parentId: element.parentId,
      url: element.url,
      materialInfo: element.materialInfo
    }
  }
}