import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { SavedTemplate, CustomLink } from '../types';

const STORAGE_KEY = 'watchtower-templates';
const ACTIVE_KEY = 'watchtower-active-template';

function loadTemplates(): SavedTemplate[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function createDefaultTemplate(): SavedTemplate {
  return {
    id: crypto.randomUUID(),
    name: 'My Watchtower',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readStatus: {},
    notes: {},
    customLinks: {},
  };
}

export const useTemplatesStore = defineStore('templates', () => {
  const stored = loadTemplates();
  const templates = ref<SavedTemplate[]>(stored.length > 0 ? stored : [createDefaultTemplate()]);
  const activeId = ref<string>(
    (typeof localStorage !== 'undefined' && localStorage.getItem(ACTIVE_KEY)) ||
    templates.value[0]!.id
  );

  const active = ref<SavedTemplate>(
    templates.value.find(t => t.id === activeId.value) ?? templates.value[0]!
  );

  watch(templates, val => {
    if (typeof localStorage !== 'undefined')
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  }, { deep: true });

  watch(activeId, val => {
    if (typeof localStorage !== 'undefined')
      localStorage.setItem(ACTIVE_KEY, val);
    active.value = templates.value.find(t => t.id === val) ?? templates.value[0]!;
  });

  function switchTemplate(id: string) {
    activeId.value = id;
  }

  function createTemplate(name: string): SavedTemplate {
    const t: SavedTemplate = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readStatus: {},
      notes: {},
      customLinks: {},
    };
    templates.value.push(t);
    switchTemplate(t.id);
    return t;
  }

  function deleteTemplate(id: string) {
    if (templates.value.length === 1) return;
    const idx = templates.value.findIndex(t => t.id === id);
    if (idx === -1) return;
    templates.value.splice(idx, 1);
    if (activeId.value === id) switchTemplate(templates.value[0]!.id);
  }

  function setNote(hexId: string, note: string) {
    active.value.notes[hexId] = note;
    active.value.updatedAt = new Date().toISOString();
  }

  function addCustomLink(hexId: string, link: CustomLink) {
    if (!active.value.customLinks[hexId]) active.value.customLinks[hexId] = [];
    active.value.customLinks[hexId]!.push(link);
    active.value.updatedAt = new Date().toISOString();
  }

  function removeCustomLink(hexId: string, index: number) {
    active.value.customLinks[hexId]?.splice(index, 1);
    active.value.updatedAt = new Date().toISOString();
  }

  function exportJson(): string {
    return JSON.stringify(active.value, null, 2);
  }

  function exportMarkdown(resources: { id: string; title: string; url: string; categoryId: string }[]): string {
    const lines = [`# ${active.value.name}`, `Exported: ${new Date().toLocaleDateString()}`, ''];
    const byCategory: Record<string, typeof resources> = {};
    for (const r of resources) {
      if (!byCategory[r.categoryId]) byCategory[r.categoryId] = [];
      byCategory[r.categoryId]!.push(r);
    }
    for (const [catId, items] of Object.entries(byCategory)) {
      lines.push(`## ${catId}`);
      for (const r of items) {
        const read = active.value.readStatus[r.id] ?? false;
        lines.push(`- [${read ? 'x' : ' '}] [${r.title}](${r.url})`);
      }
      if (active.value.notes[catId]) lines.push(`\n> ${active.value.notes[catId]}`);
      if (active.value.customLinks[catId]?.length) {
        lines.push('\n**My links:**');
        for (const l of active.value.customLinks[catId]!) {
          lines.push(`- [${l.title}](${l.url})`);
        }
      }
      lines.push('');
    }
    return lines.join('\n');
  }

  return {
    templates,
    activeId,
    active,
    switchTemplate,
    createTemplate,
    deleteTemplate,
    setNote,
    addCustomLink,
    removeCustomLink,
    exportJson,
    exportMarkdown,
  };
});
