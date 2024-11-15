import { SpaceNode } from "@/views/types/receiveType"
import { RootStateManager } from "@/views/viewer/state"
import { LoaderManager } from "@/views/viewer/utils/loaderManager"
import { generateWalls } from "./generateWalls"
import { ElementType } from "@/views/types/elementType"
import { generateDoorWindow } from "./generateDoowWindow"
import { Wall } from "../elements/wall"
import { generateRooms } from "./generateRoom"
import { Room } from "../elements/room"
import { generateFloor } from "./generateFloor"
import { surfaceMaterial } from "@/assets/defaultData"

export class GenerateManager {
  rootStateManager: RootStateManager
  loader: LoaderManager

  constructor(rootStateManager: RootStateManager) {
    this.rootStateManager = rootStateManager
    this.loader = new LoaderManager()
  }

  load(spaces: SpaceNode[], callBack?: Function) {
    const walls = this.loadWalls(spaces)
    const rooms = this.loadRooms(spaces, walls)
    if (callBack) {
      callBack()
    }

    this.loadDoorWindows(spaces)
    this.loadFloors(rooms)
    this.loader.processQueue()
  }

  loadWalls(spaces: SpaceNode[]) {
    const walls = generateWalls(spaces)
    this.rootStateManager.rootState.document.elements.push(...walls)
    return walls
  }

  loadRooms(spaces: SpaceNode[], walls: Wall[]) {
    const rooms = generateRooms(spaces)
    this.rootStateManager.rootState.document.elements.push(...rooms)
    return rooms
  }

  loadDoorWindows(spaces: SpaceNode[]) {
    const elements = this.rootStateManager.rootState.document.elements
    spaces.forEach(space => {
      const doorWindows = space.struct_polygon.filter(s => s.edge_type === ElementType.Door || s.edge_type === ElementType.Window)
      if (doorWindows.length) {
        doorWindows.forEach(dw => {
          this.loader.add({url: dw.attrs.url}, modelData => {
            const doorWindow = generateDoorWindow(dw, modelData, elements)
            if (doorWindow) {
              elements.push(doorWindow)
            }
          })
        })
      }
    })
  }

  loadFloors(rooms: Room[]) {
    const floors = rooms.map(room => {
      return generateFloor(room, surfaceMaterial.wooden_flooring)
    })
    this.rootStateManager.rootState.document.elements.push(...floors)
  }

  dispose() {
    this.loader.dispose()
  }
}