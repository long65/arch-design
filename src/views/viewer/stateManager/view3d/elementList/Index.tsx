import { ElementType } from "@/views/types/elementType";
import { RootStateManager } from "@/views/viewer/state";
import { Component, defineComponent, inject } from "vue";
import { ElementVm } from "../../document/elementVm/elementVm";
import WallView from "./WallView";
import DoorWindowView from "./DoorWindowView";
import FloorView from "./FloorView";

export default defineComponent({
  name: "ElementList",
  setup() {
    const rootStateManager = inject("rootStateManager") as RootStateManager;
    return () => {
      const elementArr: Component[] =
        rootStateManager.rootState.document.elementVms.map((vm: ElementVm) => {
          // const selected = rootStateManager.rootState.selection.findIndex(s => s.elementId === vm.elementId) >= 0
          // const hint = rootStateManager.rootState.hint.findIndex(s => s.elementId === vm.elementId) >= 0
          switch (vm.elementType) {
            case ElementType.Wall:
            case ElementType.Sill:
              return <WallView key={vm.elementId} wallVm={vm} />;
            case ElementType.Door:
            case ElementType.Window:
              return <DoorWindowView key={vm.elementId} doorWindowVm={vm} />;
            case ElementType.Floor:
            case ElementType.Ceiling:
            case ElementType.SuspendedCeiling:
              return <FloorView key={vm.elementId} floorVm={vm} />;
            default:
              return null;
          }
        });
      return elementArr;
    };
  },
});
