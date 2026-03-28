<template>
  <div class="template-manager">
    <!-- Template selector -->
    <select class="template-select" :value="templateStore.activeId" @change="e => templateStore.switchTemplate((e.target as HTMLSelectElement).value)">
      <option v-for="t in templateStore.templates" :key="t.id" :value="t.id">{{ t.name }}</option>
    </select>

    <!-- Actions -->
    <span class="tip-wrap" data-tip="Create a new template">
      <button class="btn-icon" @click="showCreate = true">＋</button>
    </span>
    <span class="tip-wrap" data-tip="Export template to JSON file">
      <button class="btn-icon" @click="exportJson">⬆ JSON</button>
    </span>
    <span class="tip-wrap" data-tip="Import template from JSON file">
      <button class="btn-icon" @click="triggerImport">⬇ JSON</button>
    </span>
    <input ref="fileInput" type="file" accept=".json,application/json" class="file-input-hidden" @change="onFileSelected" />
    <span class="tip-wrap" data-tip="Delete this template">
      <button class="btn-icon" @click="deleteActive" :disabled="templateStore.templates.length === 1">🗑</button>
    </span>

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

const templateStore = useTemplatesStore();
const fileInput = ref<HTMLInputElement | null>(null);

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

function triggerImport() {
  fileInput.value?.click();
}

function onFileSelected(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const result = templateStore.importTemplate(reader.result as string);
    if (!result.ok) alert(`Import failed: ${result.error}`);
    // Reset so the same file can be re-imported if needed
    if (fileInput.value) fileInput.value.value = '';
  };
  reader.readAsText(file);
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
  gap: 10px;
  flex-wrap: wrap;
}

.template-select {
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-panel);
  color: var(--text);
  font-size: 16px;
  font-family: inherit;
  max-width: 220px;
}

.btn-icon {
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-panel);
  color: var(--text);
  font-size: 16px;
  font-weight: 600;
  transition: background 0.15s;
  white-space: nowrap;
}
.btn-icon:hover { background: var(--bg-hover); }
.btn-icon:disabled { opacity: 0.35; cursor: not-allowed; }

.file-input-hidden { display: none; }

/* CSS tooltip */
.tip-wrap {
  position: relative;
  display: inline-flex;
}

.tip-wrap::after {
  content: attr(data-tip);
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #1e1e1e;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  padding: 7px 14px;
  border-radius: 6px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
  z-index: 200;
}

.tip-wrap::before {
  content: '';
  position: absolute;
  top: calc(100% + 1px);
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-bottom-color: #1e1e1e;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
  z-index: 200;
}

.tip-wrap:hover::after,
.tip-wrap:hover::before {
  opacity: 1;
}

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
