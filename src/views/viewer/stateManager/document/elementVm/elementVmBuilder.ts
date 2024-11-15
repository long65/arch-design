import { BaseElement } from "../elements/baseElement";
import { DoorWindow } from "../elements/doorWindow";
import { EntityElement } from "../elements/entityElement";
import { Floor } from "../elements/floor";
import { Furniture } from "../elements/furniture";
import { Room } from "../elements/room";
import { Wall } from "../elements/wall";
import { SuspendedCeiling } from "../elements/suspendedCeiling";

import { RoomVm } from "./roomVm";
import { DoorWindowVm } from "./doorWindowVm";
import { ElementVm } from "./elementVm";
import { EntityElementVm } from "./entityElementVm";
import { FloorVm } from "./floorVm";
import { FurnitureVm } from "./furnitureVm";
import { WallVm } from "./wallVm";
import { SuspendedCeilingVm } from "./suspendedCeilingVm";
import { WallTile } from "../elements/wallTile";
import { WallTileVm } from "./wallTileVm";

export const ElementVmBuilder = {
  build(element: BaseElement) {
    if (element instanceof Room) {
      return RoomVm.fromElement(element)
    } else if (element instanceof Wall) {
      return WallVm.fromElement(element)
    } else if (element instanceof Floor) {
      return FloorVm.fromElement(element)
    } else if (element instanceof SuspendedCeiling) {
      return SuspendedCeilingVm.fromElement(element)
    } else if (element instanceof WallTile) {
      return WallTileVm.fromElement(element)
    } else if (element instanceof Furniture) {
      return FurnitureVm.fromElement(element)
    } else if (element instanceof DoorWindow) {
      return DoorWindowVm.fromElement(element)
    } else if (element instanceof EntityElement) {
      return EntityElementVm.fromElement(element)
    } else {
      return ElementVm.fromElement(element)
    }
  }
}
