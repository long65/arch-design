import { WallTile } from "../elements/wallTile";
import { EntityElementVm } from "./entityElementVm";

export interface WallTileVm extends EntityElementVm {
  hostIds: number[]
}

export const WallTileVm = {
  fromElement(element: WallTile): WallTileVm {
    return {
      ...EntityElementVm.fromElement(element),
      hostIds: [...element.hostIds]
    }
  }
}