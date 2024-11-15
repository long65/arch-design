import { defineComponent, inject, onUnmounted, watch, toRaw } from 'vue'
import * as THREE from 'three';
import { RootStateManager } from '@/views/viewer/state';
import { dispose } from '@/views/viewer/utils/util';
import { DoorWindowVm } from '../../document/elementVm/doorWindowVm';

export default defineComponent({
  name: 'DoorWindowView',
  props: {
    doorWindowVm: Object as () => DoorWindowVm
  },
  setup(props) {
    const rootStateManager = inject('rootStateManager') as RootStateManager
    const gtx = rootStateManager.context3d.gtx

    const modelData = toRaw(props.doorWindowVm.modelData)
    const model = modelData.model
    const originBox = modelData.originBox

    const doorWindow = new THREE.Object3D()
    doorWindow.name = props.doorWindowVm.name
    doorWindow.userData = {
      ...props.doorWindowVm.info,
      elementId: props.doorWindowVm.elementId,
      elementType: props.doorWindowVm.elementType,
      objectType: props.doorWindowVm.type,
      box3: props.doorWindowVm.box3,
      hostIds: [...props.doorWindowVm.hostIds],
      roomIds: [...props.doorWindowVm.roomIds],
    }
    doorWindow.position.copy(props.doorWindowVm.position)
    doorWindow.rotation.copy(props.doorWindowVm.rotation)
    doorWindow.scale.copy(props.doorWindowVm.scale)

    doorWindow.add(model)
    gtx.addEntity(doorWindow)

    onUnmounted(() => {
      gtx.deleteEntity(doorWindow)
      dispose(doorWindow)
    })

    return () => {
      return null
    }
  }
})
