<template>
  <div ref="containerRef" class="hive-container" @click.self="hexStore.clear()">
    <div
      class="hive-grid"
      :style="{
        zoom: scale,
        width: `${GRID_W}px`,
        height: `${GRID_H}px`,
      }"
      @click.self="hexStore.clear()"
    >
      <HexagonCell v-for="hex in HEXAGONS" :key="hex.id" :hex="hex" />
    </div>
    <div class="hive-legend">
      <button
        v-for="z in zones"
        :key="z.id"
        class="legend-item"
        :class="{ active: hexStore.filteredZone === z.id }"
        @click="hexStore.toggleZoneFilter(z.id)"
        :title="`Filter to ${z.label} only`"
      >
        <span class="legend-dot" :style="{ background: z.color }"></span>
        <span class="legend-label">{{ z.label }}</span>
        <span class="legend-stat">{{ zoneStats[z.id]?.read ?? 0 }}/{{ zoneStats[z.id]?.total ?? 0 }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import HexagonCell from './HexagonCell.vue';
import { HEXAGONS, GRID_W, GRID_H } from '../stores/hexagons';
import { useHexagonsStore } from '../stores/hexagons';
import { useResourcesStore } from '../stores/resources';

const PANEL_W = 380;
const LEGEND_H = 48;
const HEADER_H = 65;
const PAD = 32;

const hexStore = useHexagonsStore();
const resourcesStore = useResourcesStore();
const containerRef = ref<HTMLElement | null>(null);
const scale = ref(1);

const zones = [
  { id: 'input',      label: 'Inputs',     color: '#2f9e44' },
  { id: 'center',     label: 'AI Core',    color: '#1971c2' },
  { id: 'output',     label: 'Outputs',    color: '#9c36b5' },
  { id: 'transverse', label: 'Transverse', color: '#495057' },
];

const zoneStats = computed(() => {
  const stats: Record<string, { read: number; total: number }> = {};
  for (const z of zones) {
    const hexIds = HEXAGONS.filter(h => h.zone === z.id).map(h => h.id);
    let read = 0, total = 0;
    for (const id of hexIds) {
      const counts = resourcesStore.countByCategory[id];
      if (counts) { read += counts.read; total += counts.total; }
    }
    stats[z.id] = { read, total };
  }
  return stats;
});

function computeScale() {
  const panelOpen = !!hexStore.selectedId;
  const availW = window.innerWidth - (panelOpen ? PANEL_W : 0) - PAD;
  const availH = window.innerHeight - HEADER_H - LEGEND_H - PAD;
  scale.value = Math.min(availW / GRID_W, availH / GRID_H);
}

onMounted(() => {
  computeScale();
  window.addEventListener('resize', computeScale);
});
onUnmounted(() => window.removeEventListener('resize', computeScale));
watch(() => hexStore.selectedId, () => {
  // small delay to let panel transition start before recomputing
  setTimeout(computeScale, 50);
});
</script>

<style scoped>
.hive-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
}

.hive-grid {
  position: relative;
  flex-shrink: 0;
  transform-origin: center center;
}

.hive-legend {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  flex-shrink: 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--bg-panel);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, opacity 0.15s;
  font-family: inherit;
}

.legend-item:hover {
  background: var(--bg-hover);
}

.legend-item.active {
  border-color: var(--text-muted);
  background: var(--bg-hover);
  box-shadow: inset 0 0 0 1px var(--text-muted);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.legend-stat {
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  background: var(--bg);
  border-radius: 10px;
  padding: 1px 7px;
}
</style>
