<script setup lang="ts">
import Viewer from '@/views/viewer/Index.vue'
import { RootStateManager } from '@/views/viewer/state';
import { provide } from 'vue';

const rootStateManager = new RootStateManager();
provide('rootStateManager', rootStateManager);
(window as any).rootStateManager = rootStateManager;
</script>

<template>
  <div class="root">
    <Viewer />
  </div>
</template>

<style scoped>
.root {
  width: 100%;
  height: 100%;
  background-color: white;
  overflow: hidden;
  user-select: none;
}
</style>
