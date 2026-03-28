<template>
  <div
    class="hex-wrapper"
    :class="{ selected: isSelected, 'hex-center': hex.ring === 0 }"
    :style="{ left: `calc(50% + ${hex.x}px)`, top: `calc(50% + ${hex.y}px)` }"
    :title="hex.tagline"
    @click="hexStore.select(hex.id)"
  >
    <div class="hex-outer" :style="{ background: hex.strokeColor }">
      <div class="hex-inner" :style="{ background: hex.fillColor }">
        <span class="hex-emoji">{{ hex.emoji }}</span>
        <span class="hex-label" :style="{ color: hex.strokeColor }">{{ hex.label }}</span>
      </div>
    </div>
    <span v-if="counts" class="hex-badge">{{ counts.read }}/{{ counts.total }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useHexagonsStore } from '../stores/hexagons';
import { useResourcesStore } from '../stores/resources';
import type { HexagonDef } from '../types';

const props = defineProps<{ hex: HexagonDef }>();

const hexStore = useHexagonsStore();
const resourcesStore = useResourcesStore();

const isSelected = computed(() => hexStore.selectedId === props.hex.id);
const counts = computed(() => resourcesStore.countByCategory[props.hex.id] ?? null);
</script>
