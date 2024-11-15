import { SpaceNode } from '@/views/types/receiveType'
import * as THREE from 'three'
import { Wall } from '../elements/wall'
import { ElementType } from '@/views/types/elementType'
import { LineSegment2 } from '@/math/lineSegment2'
import { TOLERANCE } from '@/math/config'
import { boxGeometry, dwParams, wallMaterial } from '@/assets/defaultData'
import { equals } from '@/math/common'
import { BSP } from '@/math/bsp'

export const generateWalls = (spaces: SpaceNode[]) => {
  const thickness = 0.12
  const wallHeight = 2.7
  const walls: Wall[] = []
  const corners: THREE.Vector2[] = []
  spaces.forEach(space => {
    const wallData = space.struct_polygon.find(s => s.edge_type === ElementType.Wall)
    const doorWindows = space.struct_polygon.filter(s => s.edge_type === ElementType.Door || s.edge_type === ElementType.Window)
    if (wallData) {
      for (let i = 0; i < wallData.coordinates.length; i++) {
        const curve2d = new LineSegment2(
          new THREE.Vector2(wallData.coordinates[i][0], wallData.coordinates[i][1]),
          new THREE.Vector2(wallData.coordinates[(i + 1) % wallData.coordinates.length][0], wallData.coordinates[(i + 1) % wallData.coordinates.length][1])
        )
        wallData.curve2d = curve2d
        if (walls.every(w => !(w.curve2d.isEqual(curve2d)) || w.curve2d.isOpposite(curve2d))) {
          const wall = new Wall(ElementType.Wall)
          wall.uuid = THREE.MathUtils.generateUUID()
          wall.name = ElementType.Wall
          wall.type = ElementType.Wall
          wall.thickness = thickness
          wall.height = wallHeight
          wall.curve2d.copy(curve2d)

          const cutStart = wall.curve2d.start.clone()
          const cutEnd = wall.curve2d.end.clone()
          const offset = wall.curve2d.direction.clone().multiplyScalar(thickness / 2)
          if (corners.some((c) => c.distanceTo(cutStart) <= TOLERANCE)) {
            cutStart.add(offset)
          } else {
            cutStart.sub(offset)
            corners.push(wall.curve2d.start)
          }
          if (corners.some((c) => c.distanceTo(cutEnd) <= TOLERANCE)) {
            cutEnd.sub(offset)
          } else {
            cutEnd.add(offset)
            corners.push(wall.curve2d.end)
          }
          const cutLineSegment = new LineSegment2(cutStart, cutEnd)
          wall.realCurve2d.copy(cutLineSegment)

          let mesh: THREE.Mesh = new THREE.Mesh(boxGeometry, wallMaterial)
          mesh.scale.set(cutLineSegment.length, thickness, wallHeight)
          const angle = cutLineSegment.direction.angle()
          mesh.rotateZ(angle)
          mesh.position.set(cutLineSegment.middle.x, cutLineSegment.middle.y, wallHeight / 2)
          mesh.updateMatrix()
          const box3 = new THREE.Box3().setFromObject(mesh)
          wall.box3.copy(box3)
          wall.modelData = { model: mesh }

          walls.push(wall)
        }
      }
    }
    if (doorWindows.length) {
      doorWindows.forEach(dw => {
        const dwCurve2d = new LineSegment2(
          new THREE.Vector2(dw.coordinates[0][0], dw.coordinates[0][1]),
          new THREE.Vector2(dw.coordinates[1][0], dw.coordinates[1][1])
        )
        dw.curve2d = dwCurve2d

        const dwParam = (dwParams as any)[dw.edge_type]
        dw.attrs = dwParam

        const wall = walls.find(w => w.curve2d.containLine(dwCurve2d))
        if (wall) {
          dw.attachId = wall.elementId

          const direction = dwCurve2d.direction
          const angle = direction.angle()

          const newCenter = dwCurve2d.middle
          const len = dwCurve2d.length
          const boxMesh = new THREE.Mesh(boxGeometry, wallMaterial)
          boxMesh.rotateZ(angle)
          const holeInfo = {
            start: dwCurve2d.start,
            end: dwCurve2d.end,
            height: 0,
            bottom: 0
          }
          boxMesh.scale.set(len, thickness, dwParam.height)
          boxMesh.position.set(newCenter.x, newCenter.y, dwParam.height / 2 + dwParam.bottom)
          holeInfo.height = dwParam.height
          holeInfo.bottom = dwParam.bottom
          const holeBox = new THREE.Box3().setFromObject(boxMesh)

          if (!wall.holes.some((h) => equals(h, holeBox))) {
            wall.holes.push(holeBox)
            wall.holeInfos.push(holeInfo)
            const meshBsp = new BSP(wall.modelData.model as THREE.Mesh)
            const boxBsp = new BSP(boxMesh)
            const result = meshBsp.subtract(boxBsp)
            const resultMesh = result.toMesh(wallMaterial, false, true)
            wall.modelData.model = resultMesh
          }
        }
      })
    }
  })
  return walls
}