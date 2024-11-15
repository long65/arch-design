import * as THREE from 'three'
import { Room } from '../../document/elements/room'
import { SpaceNode } from '@/views/types/receiveType'
import { Wall } from '../elements/wall'
import { ElementType } from '@/views/types/elementType'
import { LineSegment2 } from '@/math/lineSegment2'
import { RoomInnerDirection } from '@/views/types/dataType'

export const generateRooms = (spaces: SpaceNode[]) => {
  const rooms: Room[] = []
  spaces.forEach(space => {
    const wallData = space.struct_polygon.find(s => s.edge_type === ElementType.Wall)
    if (wallData) {
      const thickness = 0.12
      const wallHeight = 2.7
  
      const coordinates: THREE.Vector2[] = []
      for (let i = 0; i <= wallData.coordinates.length; i++) {
        const coordinate = new THREE.Vector2(wallData.coordinates[i % wallData.coordinates.length][0], wallData.coordinates[i % wallData.coordinates.length][1])
        coordinates.push(coordinate)
      }
      const data = LineSegment2.getDatas(coordinates, thickness)
  
      const room = new Room()
      room.id = space.id
      room.type = space.space_type
      room.innerDirection = data.innerDirection as RoomInnerDirection
      room.coordinates = coordinates
      room.originLines = data.originLineSegments
  
      room.mergeLines = data.mergeLineSegments
      room.innerLines = data.innerLineSegments
      room.innerBox3.set(new THREE.Vector3(data.innerBox2.min.x, data.innerBox2.min.y, 0), new THREE.Vector3(data.innerBox2.max.x, data.innerBox2.max.y, wallHeight))
      room.box3.set(new THREE.Vector3(data.outerBox2.min.x, data.outerBox2.min.y, 0), new THREE.Vector3(data.outerBox2.max.x, data.outerBox2.max.y, wallHeight))
  
      rooms.push(room)
    }
  })
  return rooms
}
