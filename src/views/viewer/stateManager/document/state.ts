import { RootStateManager } from "../../state";
import { Room } from "./elements/room";
import { GenerateManager } from "./generate/state";
import { IDocument } from "./iDocument";
import * as THREE from 'three'

export class DocumentManager {
  rootStateManager: RootStateManager
  document: IDocument
  generate: GenerateManager

  constructor(rootStateManager: RootStateManager) {
    this.rootStateManager = rootStateManager
    this.document = rootStateManager.rootState.document
    this.generate = new GenerateManager(rootStateManager)
  }

  dispose() {
    this.generate.dispose()
  }

  load(data: any, callBack?: Function) {
    this.generate.load(data, () => {
      const box = this.getBoundingBox()
      const center = box.getCenter(new THREE.Vector3())
      center.z = 0
      const position = new THREE.Vector3(3, 3, 8).add(box.max)
      this.rootStateManager.context3d.controller.initializeCamera(position, center)
      this.rootStateManager.context3d.env.lights.position.copy(center)
      this.document.box3.copy(box)
      if (callBack) {
        callBack()
      }
    })
  }

  getBoundingBox() {
    const boundingBox = new THREE.Box3()
    this.document.elements.forEach(e => {
      if (e instanceof Room) {
        boundingBox.union(e.box3)
      }
    })
    return boundingBox
  }
}