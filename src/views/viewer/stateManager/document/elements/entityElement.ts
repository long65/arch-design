import { ElementType } from "@/views/types/elementType"
import { BaseElement } from "./baseElement";
import { ModelData } from "@/views/types/dataType";
import * as THREE from 'three'

export class EntityElement extends BaseElement {
  name: string
  uuid: string
  type: string
  roomIds: string[]
  box3: THREE.Box3
  modelData: ModelData
  info: any
  visible: boolean

  constructor(type: ElementType, elementId?: number) {
    super(type, elementId)
    this.name = ''
    this.uuid = ''
    this.type = ''
    this.roomIds = []
    this.box3 = new THREE.Box3()
    this.visible = true
  }
}
