import { defineComponent, inject, onUnmounted, toRaw } from 'vue'
import * as THREE from 'three';
import { RootStateManager } from '@/views/viewer/state';
import { dispose } from '@/views/viewer/utils/util';
import { WallVm } from '../../document/elementVm/wallVm';

export default defineComponent({
  name: 'WallView',
  props: {
    wallVm: Object as () => WallVm
  },
  setup(props) {
    const rootStateManager = inject('rootStateManager') as RootStateManager
    const gtx = rootStateManager.context3d.gtx

    const modelData = toRaw(props.wallVm.modelData)
    const model = modelData.model

    const wall = new THREE.Object3D()
    wall.name = 'wall'
    wall.userData = {
      ...props.wallVm.info,
      roomIds: [...props.wallVm.roomIds],
      elementId: props.wallVm.elementId,
      elementType: props.wallVm.elementType,
      type: props.wallVm.type,
      box3: props.wallVm.box3,
      curve2d: props.wallVm.curve2d,
    }
    wall.add(model)
    gtx.addEntity(wall)

    onUnmounted(() => {
      gtx.deleteEntity(wall)
      dispose(wall)
    })

    return () => {
      return null
    }
  }
})