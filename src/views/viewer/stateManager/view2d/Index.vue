<script setup lang="ts">
import { inject, defineProps, defineEmits, ref,onMounted,watch } from 'vue'

</script>
<template>
  <div class="view-2d">
    <div class="view-2d-container" ref="viewer2dRef"></div>
  </div>
</template>
<style scoped>
.view-2d {
  .view-2d-container {
    width: 100%;
    height: 100%;
  }

  .view-2d-tools {
    position: absolute;
    top: 0px;
    left: 0px;
  }
}
</style>
