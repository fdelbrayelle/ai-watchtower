<template>
  <header class="app-header">
    <div class="header-left">
      <div class="header-title-group">
        <h1 class="header-title">🔭 AI Watchtower</h1>
        <p class="header-subtitle">Agents write the code — Engineers own everything around it</p>
      </div>
    </div>
    <div class="header-right">
      <TemplateManager />
      <ThemeToggle />
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue';
import TemplateManager from './TemplateManager.vue';
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-panel);
  gap: 16px;
  flex-wrap: wrap;
}

.header-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.02em;
}

.header-subtitle {
  font-size: 16px;
  color: var(--text-muted);
  font-style: italic;
  margin-top: 4px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
