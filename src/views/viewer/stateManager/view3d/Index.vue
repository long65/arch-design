<script setup lang="ts">
import { inject, defineProps, defineEmits, ref,onMounted,watch } from 'vue'
import { RootStateManager } from '../../state';
import ElementList from './elementList/Index'
import { archData } from '@/assets/data';

const rootStateManager = inject('rootStateManager') as RootStateManager
const view3dRef = ref()

onMounted(() => {
  rootStateManager.context3d.init({
    rootElement: view3dRef.value
  })
  rootStateManager.documentManager.load(archData)
})

</script>
<template>
  <div class="view-3d">
    <div class="view-3d-container" ref="view3dRef"></div>
    <ElementList />
  </div>
</template>
<style scoped>
.view-3d {
  .view-3d-container {
    width: 100%;
    height: 100%;
  }

  .view-3d-tools {
    position: absolute;
    top: 0px;
    left: 0px;
  }
}
</style>
