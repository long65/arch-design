import { PolygonNode } from "@/views/types/receiveType";
import * as THREE from 'three'
import { DoorWindow } from '../elements/doorWindow'
import { ElementType } from "@/views/types/elementType";
import { ModelData } from "@/views/types/dataType";
import { BaseElement } from "../elements/baseElement";

export const generateDoorWindow = (dw: PolygonNode, modelData: ModelData, elements: BaseElement[]) => {
  if (dw.attachId !== undefined && !elements.some(e => (e instanceof DoorWindow && (e.curve2d.isEqual(dw.curve2d) || e.curve2d.isOpposite(dw.curve2d))))) {
    const type = dw.edge_type.includes('door') ? ElementType.Door : ElementType.Window
    const doorWindow = new DoorWindow(type)
    doorWindow.uuid = THREE.MathUtils.generateUUID()
    doorWindow.name = type
    doorWindow.type = type
    doorWindow.curve2d.copy(dw.curve2d)

    const originBox = modelData.originBox
    const model = modelData.model.clone()
    const oldPosition = originBox.getCenter(new THREE.Vector3())
    const oldScale = originBox.getSize(new THREE.Vector3())
    const oldQuaternion = new THREE.Quaternion()
    const oldMatrix = new THREE.Matrix4().compose(oldPosition, oldQuaternion, oldScale)
    const inverseOldMatrix = oldMatrix.clone().invert()
  
    const width = dw.curve2d.length
    const length = 0.12 * 0.8
    const height = dw.attrs.height
    const centerZ = dw.attrs.height / 2 + dw.attrs.bottom

    doorWindow.url = modelData.url

    const point1 = new THREE.Vector3(dw.curve2d.start.x, dw.curve2d.start.y, centerZ)
    const point2 = new THREE.Vector3(dw.curve2d.end.x, dw.curve2d.end.y, centerZ)
    const angle = new THREE.Vector3().subVectors(point2, point1).angleTo(new THREE.Vector3(1, 0, 0))
    const newPosition = new THREE.Vector3().addVectors(point1, point2).multiplyScalar(0.5)
    const newQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle)
    const newScale = new THREE.Vector3(width, length, height)
    const newMatrix = new THREE.Matrix4().compose(newPosition, newQuaternion, newScale)
    const finalMatrix = new THREE.Matrix4().multiplyMatrices(newMatrix, inverseOldMatrix)
    const box3 = originBox.clone().applyMatrix4(finalMatrix)

    const position = new THREE.Vector3().setFromMatrixPosition(finalMatrix)
    const rotation = new THREE.Euler().setFromRotationMatrix(finalMatrix)
    const scale = new THREE.Vector3().setFromMatrixScale(finalMatrix)
    doorWindow.position.copy(position)
    doorWindow.rotation.copy(rotation)
    doorWindow.scale.copy(scale)
    doorWindow.box3.copy(box3)

    doorWindow.modelData = {
      model,
      originBox,
      url: modelData.url
    }

    return doorWindow
  } else {
    return undefined
  }
}