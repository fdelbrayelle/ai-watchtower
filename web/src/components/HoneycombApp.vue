<template>
  <div class="app-layout">
    <AppHeader />
    <div class="app-body">
      <main class="app-main" :class="{ 'panel-open': !!hexStore.selectedId }">
        <HoneycombGrid />
      </main>
      <ResourcePanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue';
import HoneycombGrid from './HoneycombGrid.vue';
import ResourcePanel from './ResourcePanel.vue';
import { useHexagonsStore } from '../stores/hexagons';

const hexStore = useHexagonsStore();
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.app-main {
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
</style>
