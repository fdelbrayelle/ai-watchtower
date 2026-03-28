<template>
  <div class="template-manager">
    <!-- Template selector -->
    <select class="template-select" :value="templateStore.activeId" @change="e => templateStore.switchTemplate((e.target as HTMLSelectElement).value)">
      <option v-for="t in templateStore.templates" :key="t.id" :value="t.id">{{ t.name }}</option>
    </select>

    <!-- Actions -->
    <button class="btn-icon" title="New template" @click="showCreate = true">＋</button>
    <button class="btn-icon" title="Export JSON" @click="exportJson">⬇ JSON</button>
    <button class="btn-icon" title="Delete template" @click="deleteActive" :disabled="templateStore.templates.length === 1">🗑</button>

    <!-- Create modal -->
    <div v-if="showCreate" class="modal-overlay" @click.self="showCreate = false">
      <div class="modal">
        <h3>New Template</h3>
        <p class="modal-hint">Give this template a name — a project, mission, or career path.</p>
        <input
          v-model="newName"
          class="modal-input"
          placeholder="e.g. My 2026 Mission"
          @keydown.enter="createTemplate"
          autofocus
        />
        <div class="modal-actions">
          <button class="btn-small" @click="showCreate = false">Cancel</button>
          <button class="btn-primary" @click="createTemplate" :disabled="!newName.trim()">Create</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTemplatesStore } from '../stores/templates';
import { useResourcesStore } from '../stores/resources';

const templateStore = useTemplatesStore();
const resourcesStore = useResourcesStore();

const showCreate = ref(false);
const newName = ref('');

function createTemplate() {
  if (!newName.value.trim()) return;
  templateStore.createTemplate(newName.value.trim());
  newName.value = '';
  showCreate.value = false;
}

function deleteActive() {
  if (templateStore.templates.length === 1) return;
  if (confirm(`Delete "${templateStore.active.name}"?`)) {
    templateStore.deleteTemplate(templateStore.activeId);
  }
}

function exportJson() {
  const json = templateStore.exportJson();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${templateStore.active.name.replace(/[^a-z0-9]/gi, '-')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.template-manager {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.template-select {
  padding: 5px 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-panel);
  color: var(--text);
  font-size: 13px;
  font-family: inherit;
  max-width: 180px;
}

.btn-icon {
  padding: 5px 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-panel);
  color: var(--text);
  font-size: 12px;
  font-weight: 600;
  transition: background 0.15s;
  white-space: nowrap;
}
.btn-icon:hover { background: var(--bg-hover); }
.btn-icon:disabled { opacity: 0.35; cursor: not-allowed; }

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  width: 360px;
  box-shadow: 0 20px 40px var(--shadow-lg);
}

.modal h3 { font-size: 16px; margin-bottom: 6px; }
.modal-hint { font-size: 13px; color: var(--text-muted); margin-bottom: 14px; }

.modal-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
  margin-bottom: 16px;
}

.modal-actions { display: flex; gap: 8px; justify-content: flex-end; }

.btn-small {
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  font-size: 13px;
  font-weight: 600;
}
.btn-small:hover { background: var(--bg-hover); }

.btn-primary {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  background: #1971c2;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}
.btn-primary:hover { background: #1562a8; }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
