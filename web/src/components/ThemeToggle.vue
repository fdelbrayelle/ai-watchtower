<template>
  <button class="theme-toggle" :title="`Switch to ${isDark ? 'light' : 'dark'} mode`" @click="toggle">
    {{ isDark ? '☀️' : '🌙' }}
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDark = ref(false);

onMounted(() => {
  isDark.value = document.documentElement.dataset.theme === 'dark';
});

function toggle() {
  isDark.value = !isDark.value;
  document.documentElement.dataset.theme = isDark.value ? 'dark' : 'light';
  localStorage.setItem('watchtower-theme', isDark.value ? 'dark' : 'light');
}
</script>

<style scoped>
.theme-toggle {
  border: 1px solid var(--border);
  background: var(--bg-panel);
  border-radius: 8px;
  width: 46px;
  height: 46px;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.theme-toggle:hover { background: var(--bg-hover); }
</style>
