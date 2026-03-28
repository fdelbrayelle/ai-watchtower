<template>
  <div class="resource-card" :class="{ read: isRead }">
    <button class="read-toggle" :title="isRead ? 'Mark unread' : 'Mark read'" @click="resourcesStore.toggleRead(resource.id)">
      <span class="check-icon">{{ isRead ? '✓' : '○' }}</span>
    </button>
    <div class="resource-body">
      <a :href="resource.url" target="_blank" rel="noopener noreferrer" class="resource-title">
        <span class="type-icon">{{ typeIcon }}</span>
        {{ resource.title }}
      </a>
      <p v-if="resource.description" class="resource-desc">{{ resource.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useResourcesStore } from '../stores/resources';
import type { Resource } from '../types';

const props = defineProps<{ resource: Resource }>();
const resourcesStore = useResourcesStore();

const isRead = computed(() => resourcesStore.isRead(props.resource.id));

const typeIcon = computed(() => ({
  book: '📚',
  video: '🎥',
  tool: '🔧',
  roadmap: '🗺️',
  course: '🎓',
  article: '📄',
  other: '🔗',
}[props.resource.type] ?? '🔗'));
</script>

<style scoped>
.resource-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  transition: opacity 0.2s;
}

.resource-card.read {
  opacity: 0.55;
}

.read-toggle {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border: none;
  background: none;
  color: var(--text-muted);
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.15s, color 0.15s;
  margin-top: 1px;
}

.read-toggle:hover {
  background: var(--bg-hover);
  color: var(--text);
}

.resource-card.read .read-toggle { color: #2f9e44; }

.resource-body { flex: 1; min-width: 0; }

.resource-title {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: var(--text);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
}

.resource-title:hover { color: var(--accent); text-decoration: none; }

.type-icon { margin-right: 4px; font-size: 15px; }

.resource-desc {
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 2px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
