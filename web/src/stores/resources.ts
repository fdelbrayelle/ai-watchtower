import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Resource } from '../types';
import resourcesData from '../assets/data/resources.json';

const STORAGE_KEY = 'watchtower-read-status';

function loadReadStatus(): Record<string, boolean> {
  if (typeof localStorage === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function saveReadStatus(status: Record<string, boolean>) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
}

export const useResourcesStore = defineStore('resources', () => {
  const resources = ref<Resource[]>(resourcesData as Resource[]);
  const readStatus = ref<Record<string, boolean>>(loadReadStatus());

  function isRead(id: string): boolean {
    if (id in readStatus.value) return readStatus.value[id]!;
    const resource = resources.value.find(r => r.id === id);
    return resource ? !resource.unread : false;
  }

  function toggleRead(id: string) {
    readStatus.value = {
      ...readStatus.value,
      [id]: !isRead(id),
    };
    saveReadStatus(readStatus.value);
  }

  function markAllRead(categoryId: string) {
    const updates: Record<string, boolean> = {};
    resources.value
      .filter(r => r.categoryId === categoryId)
      .forEach(r => { updates[r.id] = true; });
    readStatus.value = { ...readStatus.value, ...updates };
    saveReadStatus(readStatus.value);
  }

  function byCategory(categoryId: string): Resource[] {
    return resources.value.filter(r => r.categoryId === categoryId);
  }

  const countByCategory = computed(() => {
    const counts: Record<string, { total: number; read: number }> = {};
    for (const r of resources.value) {
      if (!counts[r.categoryId]) counts[r.categoryId] = { total: 0, read: 0 };
      counts[r.categoryId]!.total++;
      if (isRead(r.id)) counts[r.categoryId]!.read++;
    }
    return counts;
  });

  return { resources, readStatus, isRead, toggleRead, markAllRead, byCategory, countByCategory };
});
