import { defineComponent, inject, onUnmounted, toRaw } from 'vue'
import * as THREE from 'three';
import { RootStateManager } from '@/views/viewer/state';
import { dispose } from '@/views/viewer/utils/util';
import { FloorVm } from '../../document/elementVm/floorVm';

export default defineComponent({
  name: 'FloorView',
  props: {
    floorVm: Object as () => FloorVm
  },
  setup(props) {
    const rootStateManager = inject('rootStateManager') as RootStateManager
    const gtx = rootStateManager.context3d.gtx
    const modelData = toRaw(props.floorVm.modelData)
    const model = modelData.model

    const floor = new THREE.Object3D()
    floor.name = props.floorVm.name
    floor.userData = {
      type: props.floorVm.elementType,
      roomIds: [...props.floorVm.roomIds],
      elementId: props.floorVm.elementId,
      elementType: props.floorVm.elementType,
      objectType: props.floorVm.type,
      box3: props.floorVm.box3
    }
    floor.add(model)
    gtx.addEntity(floor)

    onUnmounted(() => {
      gtx.deleteEntity(floor)
      dispose(floor)
    })

    return () => {
      return null
    }
  }
})