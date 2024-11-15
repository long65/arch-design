import { ModelData } from "@/views/types/dataType";
import { EntityElement } from "../elements/entityElement";
import { ElementVm } from "./elementVm";
import * as THREE from 'three'

export interface EntityElementVm extends ElementVm {
  name: string
  uuid: string
  type: string
  roomIds: string[]
  box3: THREE.Box3
  modelData: ModelData
  info: any
  visible: boolean
}

export const EntityElementVm = {
  fromElement(element: EntityElement): EntityElementVm {
    return {
      ...ElementVm.fromElement(element),
      name: element.name,
      uuid: element.uuid,
      type: element.type,
      roomIds: [...element.roomIds],
      box3: element.box3.clone(),
      modelData: element.modelData,
      info: {...element.info},
      visible: element.visible
    }
  }
}