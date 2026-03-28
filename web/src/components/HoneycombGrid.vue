<template>
  <div class="hive-container">
    <div class="hive-grid">
      <HexagonCell v-for="hex in HEXAGONS" :key="hex.id" :hex="hex" />
    </div>
    <!-- Zone legend -->
    <div class="hive-legend">
      <span class="legend-item input">
        <span class="legend-dot" style="background:#2f9e44"></span> Inputs
      </span>
      <span class="legend-item center">
        <span class="legend-dot" style="background:#1971c2"></span> AI Core
      </span>
      <span class="legend-item output">
        <span class="legend-dot" style="background:#9c36b5"></span> Outputs
      </span>
      <span class="legend-item transverse">
        <span class="legend-dot" style="background:#495057"></span> Transverse
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import HexagonCell from './HexagonCell.vue';
import { HEXAGONS } from '../stores/hexagons';
</script>

<style scoped>
.hive-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 24px 16px 8px;
}

/* The grid is a fixed-size relative container; hexagons are positioned absolutely inside */
.hive-grid {
  position: relative;
  width: 680px;
  height: 700px;
  flex-shrink: 0;
}

.hive-legend {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

@media (max-width: 720px) {
  .hive-grid {
    transform: scale(0.7);
    transform-origin: top center;
    margin-bottom: -200px;
  }
}
</style>
