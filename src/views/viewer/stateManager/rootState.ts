import { SceneMode } from "@/views/types/viewMode"
import { IDocument } from "./document/iDocument"
import { ElementVm } from "./document/elementVm/elementVm"
import { View3dManager } from "./view3d/state"
import { View2dManager } from "./view2d/state"

export class RootState {
  view2d: View2dManager
  view3d: View3dManager

  sceneMode: SceneMode
  document: IDocument
  selection: ElementVm[]
  hint: ElementVm[]

  constructor() {
    this.view2d = new View2dManager()
    this.view3d = new View3dManager()

    this.sceneMode = SceneMode.Scene3d
    this.document = new IDocument()
    this.selection = []
    this.hint = []
  }

  dispose() {
    this.document.dispose()
    this.selection.splice(0, this.selection.length)
    this.hint.splice(0, this.hint.length)
  }
}