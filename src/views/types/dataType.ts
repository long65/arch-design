import * as THREE from 'three'

export interface ModelData {
  model: THREE.Object3D
  originBox?: THREE.Box3
  url?: string
}

export interface RoomInfo {
  roomIds: string[]
  roomType: string
}

export enum RoomInnerDirection {
  Unknown = 'unknown',
  Left = 'left',
  Right = 'right'
}

export interface HoleInfo {
  start: THREE.Vector2
  end: THREE.Vector2
  height: number
  bottom: number
}

export interface FurnitureInfo {
  id: string
  position: {
    x: number
    y: number
    z: number
  }
  euler: {
    x: number
    y: number
    z: number
  }
  scale: {
    x: number
    y: number
    z: number
  }
}