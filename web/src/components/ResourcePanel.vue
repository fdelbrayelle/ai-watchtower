<template>
  <Transition name="panel">
    <aside v-if="hex" class="resource-panel" :style="{ '--hex-color': hex.strokeColor, '--hex-fill': hex.fillColor }">
      <!-- Header -->
      <div class="panel-header">
        <div class="panel-title-row">
          <span class="panel-emoji">{{ hex.emoji }}</span>
          <div>
            <h2 class="panel-title">{{ hex.label }}</h2>
            <p class="panel-tagline">{{ hex.tagline }}</p>
          </div>
        </div>
        <div class="panel-actions">
          <button v-if="resources.length" class="btn-small" @click="resourcesStore.markAllRead(hex.id)">Mark all read</button>
          <button class="btn-close" @click="hexStore.clear()">✕</button>
        </div>
      </div>

      <!-- Progress bar -->
      <div v-if="counts" class="panel-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${(counts.read / counts.total) * 100}%`, background: hex.strokeColor }"></div>
        </div>
        <span class="progress-label">{{ counts.read }}/{{ counts.total }} read</span>
      </div>

      <!-- Resources by subcategory -->
      <div class="panel-body">
        <div v-for="(group, sub) in groupedResources" :key="sub" class="resource-group">
          <h3 v-if="sub !== '__none__'" class="subcat-label">{{ sub }}</h3>
          <ResourceCard v-for="r in group" :key="r.id" :resource="r" />
        </div>

        <!-- Notes -->
        <div class="notes-section">
          <h3 class="subcat-label">My Notes</h3>
          <textarea
            class="notes-input"
            placeholder="Add notes for this hexagon..."
            :value="templateStore.active.notes[hex.id] ?? ''"
            @input="e => templateStore.setNote(hex.id, (e.target as HTMLTextAreaElement).value)"
          ></textarea>
        </div>

        <!-- Custom links -->
        <div class="custom-links-section">
          <h3 class="subcat-label">My Links</h3>
          <div v-for="(link, i) in (templateStore.active.customLinks[hex.id] ?? [])" :key="i" class="custom-link-row">
            <a :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.title }}</a>
            <button class="btn-remove" @click="templateStore.removeCustomLink(hex.id, i)">✕</button>
          </div>
          <div class="add-link-form">
            <input v-model="newLinkTitle" class="link-input" placeholder="Title" />
            <input v-model="newLinkUrl" class="link-input" placeholder="https://..." />
            <button class="btn-small" @click="addLink" :disabled="!newLinkTitle || !newLinkUrl">Add</button>
          </div>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useHexagonsStore } from '../stores/hexagons';
import { useResourcesStore } from '../stores/resources';
import { useTemplatesStore } from '../stores/templates';
import ResourceCard from './ResourceCard.vue';
import type { Resource } from '../types';

const hexStore = useHexagonsStore();
const resourcesStore = useResourcesStore();
const templateStore = useTemplatesStore();

const hex = computed(() => hexStore.selectedHexagon);
const resources = computed(() => hex.value ? resourcesStore.byCategory(hex.value.id) : []);
const counts = computed(() => hex.value ? (resourcesStore.countByCategory[hex.value.id] ?? null) : null);

const groupedResources = computed(() => {
  const groups: Record<string, Resource[]> = {};
  for (const r of resources.value) {
    const key = r.subcategory ?? '__none__';
    if (!groups[key]) groups[key] = [];
    groups[key]!.push(r);
  }
  return groups;
});

const newLinkTitle = ref('');
const newLinkUrl = ref('');

function addLink() {
  if (!hex.value || !newLinkTitle.value || !newLinkUrl.value) return;
  templateStore.addCustomLink(hex.value.id, { title: newLinkTitle.value, url: newLinkUrl.value });
  newLinkTitle.value = '';
  newLinkUrl.value = '';
}
</script>

<style scoped>
.resource-panel {
  width: 380px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-panel);
  border-left: 1px solid var(--border);
  height: 100%;
  overflow: hidden;
}

.panel-header {
  padding: 16px 16px 12px;
  border-bottom: 3px solid var(--hex-color, #1971c2);
  background: color-mix(in srgb, var(--hex-fill, #a5d8ff) 30%, var(--bg-panel));
}

.panel-title-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 8px;
}

.panel-emoji { font-size: 40px; line-height: 1; flex-shrink: 0; }

.panel-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.2;
}

.panel-tagline {
  font-size: 16px;
  color: var(--text-muted);
  margin-top: 4px;
  line-height: 1.4;
  font-style: italic;
}

.panel-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
}

.btn-close {
  border: none;
  background: none;
  color: var(--text-muted);
  font-size: 16px;
  padding: 4px 6px;
  border-radius: 4px;
  transition: background 0.15s;
}
.btn-close:hover { background: var(--bg-hover); color: var(--text); }

.btn-small {
  font-size: 15px;
  font-weight: 600;
  padding: 4px 10px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg-panel);
  color: var(--text);
  transition: background 0.15s;
}
.btn-small:hover { background: var(--bg-hover); }
.btn-small:disabled { opacity: 0.4; cursor: not-allowed; }

.panel-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-bottom: 1px solid var(--border);
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-label {
  font-size: 15px;
  color: var(--text-muted);
  font-weight: 600;
  white-space: nowrap;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 16px;
}

.resource-group { margin-top: 12px; }

.subcat-label {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 8px 0 4px;
}

.notes-section, .custom-links-section { margin-top: 16px; }

.notes-input {
  width: 100%;
  min-height: 72px;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  font-family: inherit;
  font-size: 16px;
  resize: vertical;
  margin-top: 4px;
}

.custom-link-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 0;
  font-size: 16px;
}

.btn-remove {
  border: none;
  background: none;
  color: var(--text-muted);
  font-size: 11px;
  padding: 2px 4px;
  border-radius: 3px;
  flex-shrink: 0;
}
.btn-remove:hover { background: var(--bg-hover); color: var(--text); }

.add-link-form {
  display: flex;
  gap: 6px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.link-input {
  flex: 1;
  min-width: 80px;
  padding: 5px 8px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg);
  color: var(--text);
  font-size: 12px;
}

/* Transition */
.panel-enter-active, .panel-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.panel-enter-from, .panel-leave-to { transform: translateX(40px); opacity: 0; }
</style>
