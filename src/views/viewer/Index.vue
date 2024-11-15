<script setup lang="ts">
import View2d from '@/views/viewer/stateManager/view2d/Index.vue'
import View3d from '@/views/viewer/stateManager/view3d/Index.vue'
import { inject, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { RootStateManager } from './state';
import { SceneMode } from '../types/viewMode';

const rootStateManager = inject('rootStateManager') as RootStateManager

onMounted(() => {
  window.addEventListener('keypress', onKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keypress', onKeyPress)
})

const onKeyPress = (event: KeyboardEvent) => {
  if (event.key === '2') {
    rootStateManager.rootState.sceneMode = SceneMode.Scene2d
    nextTick(() => {
      rootStateManager.context3d.resize()
    });
  } else if (event.key === '3') {
    rootStateManager.rootState.sceneMode = SceneMode.Scene3d
    nextTick(() => {
      rootStateManager.context3d.resize()
    });
  }
}

</script>

<template>
  <div class="viewer">
    <View2d :class="rootStateManager.rootState.sceneMode === SceneMode.Scene2d ? 'main-viewer' : 'small-viewer'" />
    <View3d :class="rootStateManager.rootState.sceneMode === SceneMode.Scene3d ? 'main-viewer' : 'small-viewer'" />
  </div>
</template>

<style scoped>
.viewer {
  width: 100%;
  height: 100%;
  background-color: white;
  overflow: hidden;
  user-select: none;

  .main-viewer {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
  }

  .small-viewer {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 240px;
    height: 180px;
    z-index: 10;
    overflow: hidden;
    border: 1px solid #666666;
  }
}
</style>
