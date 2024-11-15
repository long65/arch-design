import { Room } from '../../document/elements/room';
import { Floor } from '../../document/elements/floor';
import * as THREE from 'three'
import { ElementType } from '@/views/types/elementType';

export const generateFloor = (room: Room, material: {url: string, mtrl: THREE.MeshStandardMaterial}) => {
  const floor = new Floor(ElementType.Floor)
  floor.name = 'floor'
  floor.type = 'floor'
  floor.roomIds.push(room.id)
  floor.imageUrl = material.url

  const shape = new THREE.Shape()
  shape.moveTo(room.mergeLines[0].start.x, room.mergeLines[0].start.y)
  for (let i = 1; i < room.mergeLines.length; i++) {
    shape.lineTo(room.mergeLines[i].start.x, room.mergeLines[i].start.y)
  }
  shape.closePath()

  const geometry = new THREE.ShapeGeometry(shape)
  const mesh = new THREE.Mesh(geometry, material.mtrl)
  mesh.position.z = 0
  mesh.updateMatrix()

  const box3 = new THREE.Box3().setFromObject(mesh)

  floor.modelData = {model: mesh}
  floor.box3.copy(box3)
  floor.outline = [...room.mergeLines]
  floor.positionZ = 0

  return floor
}
