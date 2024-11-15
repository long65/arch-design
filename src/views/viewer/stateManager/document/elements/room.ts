import { ElementType } from "@/views/types/elementType"
import { NonEntityElement } from './nonEntityElement';
import * as THREE from 'three'
import { RoomInnerDirection } from "@/views/types/dataType";
import { LineSegment2 } from "@/math/lineSegment2";

export class Room extends NonEntityElement {
  id: string
  type: string
  innerBox3: THREE.Box3
  box3: THREE.Box3
  coordinates: THREE.Vector2[]
  originLines: LineSegment2[]
  mergeLines: LineSegment2[]
  innerLines: LineSegment2[]
  wallIds: number[]
  innerDirection: RoomInnerDirection
  shape: THREE.Vector2[]
  info: any
  wallTileUrl: string
  border: THREE.Object3D
  mergeEdges: LineSegment2[]

  constructor(elementId?: number) {
    super(ElementType.Room, elementId)
    this.id = ''
    this.type = ''
    this.innerBox3 = new THREE.Box3()
    this.box3 = new THREE.Box3()
    this.coordinates = []
    this.originLines = []
    this.mergeLines = []
    this.innerLines = []
    this.wallIds = []
    this.innerDirection = RoomInnerDirection.Unknown
    this.shape = []
    this.wallTileUrl = ''
    this.mergeEdges = []
  }
}
