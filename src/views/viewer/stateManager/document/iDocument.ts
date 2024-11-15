import * as THREE from 'three'
import { BaseElement } from './elements/baseElement'
import { ElementType } from '@/views/types/elementType'
import { Room } from './elements/room'
import { EntityElement } from './elements/entityElement'

export class IDocument {
  box3: THREE.Box3
  elements: BaseElement[]
  elementVms: any

  constructor() {
    this.box3 = new THREE.Box3()
    this.elements = []
  }

  getElementByEId(id: number) {
    const ele = this.elements.find(e => e.elementId === id)
    return ele
  }

  getElementsByType(type: ElementType) {
    return this.elements.filter(e => e.elementType === type)
  }

  getElementsByTypes(types: ElementType[]) {
    return this.elements.filter(e => types.includes(e.elementType))
  }

  getRoomByRoomId(id: string) {
    const rooms = this.elements.filter(e => e.elementType === ElementType.Room) as Room[]
    const room = rooms.find(r => r.id === id)
    return room
  }

  getElementsByRoomId(roomId: string, exclusive: boolean) {
    return this.elements.filter(e => {
      if (e instanceof EntityElement) {
        if (exclusive) {
          return e.roomIds.length === 1 && e.roomIds[0] === roomId
        } else {
          return e.roomIds.includes(roomId)
        }
      } else {
        return false
      }
    })
  }

  dispose() {
    this.elements.splice(0, this.elements.length)
  }
}