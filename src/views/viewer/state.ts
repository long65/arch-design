import { ElementVmBuilder } from "./stateManager/document/elementVm/elementVmBuilder";
import { RootState } from "./stateManager/rootState";
import { reactive } from 'vue'
import { bindArray } from "./utils/bind";
import { Context3d } from "./context3d/context3d";
import { Context2d } from "./context2d/context2d";
import { DocumentManager } from "./stateManager/document/state";

export class RootStateManager {
  rootState: RootState
  documentManager: DocumentManager
  context2d: Context2d;
  context3d: Context3d

  constructor() {
    this.rootState = reactive(new RootState()) as RootState
    this.rootState.document.elementVms = bindArray(this.rootState.document.elements, e => e.map(t => ElementVmBuilder.build(t)))
  
    this.documentManager = new DocumentManager(this)
    this.context2d = new Context2d()
    this.context3d = new Context3d()
  }

  dispose() {
    this.documentManager.dispose()
    this.rootState.dispose()
  }
}