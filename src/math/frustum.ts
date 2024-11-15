import * as THREE from 'three'
import { MeshType } from '../types/interfaces'
import { ElementType } from '../types/elementType'

export class Frustum extends THREE.Frustum {
  setFromCamera(camera: THREE.PerspectiveCamera) {
    const projectionMatrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    this.setFromProjectionMatrix(projectionMatrix)
  }

  completeIntersectsBox(box: THREE.Box3) {
    for (let i = 0; i < 6; i++) {
      const plane = this.planes[i]

      const p1 = new THREE.Vector3(
        plane.normal.x > 0 ? box.min.x : box.max.x,
        plane.normal.y > 0 ? box.min.y : box.max.y,
        plane.normal.z > 0 ? box.min.z : box.max.z
      )
      const p2 = new THREE.Vector3(
        plane.normal.x > 0 ? box.max.x : box.min.x,
        plane.normal.y > 0 ? box.max.y : box.min.y,
        plane.normal.z > 0 ? box.max.z : box.min.z
      )
      const d1 = plane.distanceToPoint(p1)
      const d2 = plane.distanceToPoint(p2)

      if (d1 < 0 || d2 < 0) {
        return false
      }
    }
    return true
  }

  intersectsEntities(entityGroup: THREE.Object3D) {
    const intersects: THREE.Object3D[] = []
    entityGroup.children.forEach(element => {
      const model = element.children.find(c => c.userData.meshType === MeshType.Model)
      if (element.visible && model.visible && (
        element.userData.elementType !== ElementType.Wall && element.userData.elementType !== ElementType.Floor && element.userData.elementType !== ElementType.Ceiling
      )) {
        const box3 = element.userData.box3 as THREE.Box3
        const center = box3.getCenter(new THREE.Vector3())
        if (this.completeIntersectsBox(box3)) {
          intersects.push(element)
        } else if (this.containsPoint(center)) {
          intersects.push(element)
        } else if (this.intersectsBox(box3)){
          if (this.intersectsMesh(model)) {
            intersects.push(element)
          }
        }
      }
    })
    return intersects
  }

  intersectsMesh(obj: THREE.Object3D) {
    if (obj instanceof THREE.Mesh) {
      const array = (obj.geometry as THREE.BufferGeometry).attributes.position.array
      for (let i = 0; i < array.length; i += 3) {
        const worldPoint = new THREE.Vector3(array[i], array[i + 1], array[i + 2])
        worldPoint.applyMatrix4(obj.matrixWorld)
        if (this.containsPoint(worldPoint)) {
          return true
        }
      }
    } else if (obj.children.length){
      obj.children.forEach(c => {
        if (this.intersectsMesh(c)) {
          return true
        }
      })
    }
    return false
  }
}
