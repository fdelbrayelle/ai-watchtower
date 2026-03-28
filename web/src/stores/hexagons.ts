import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { HexagonDef } from '../types';

// Flat-top hexagon geometry (circumradius R=70px):
// Width = 140px, Height ≈ 121px
// Horizontal step = 105px (1.5×R), Vertical step = 121px (√3×R), Half-step = 61px
export const HEXAGONS: HexagonDef[] = [
  // Ring 0 — center
  { id: 'code-generation', label: 'Code Generation', emoji: '✍️', zone: 'center', ring: 0, position: 0, x: 0, y: 0, fillColor: '#a5d8ff', strokeColor: '#1971c2', tagline: 'AI writes 80%+ of the code — your 20% is where judgment still matters' },
  // Ring 1 — inner (6 hexagons, arranged by zone)
  { id: 'software-architecture', label: 'Software Architecture', emoji: '🏗️', zone: 'input', ring: 1, position: 0, x: -105, y: -61, fillColor: '#d8f5a2', strokeColor: '#2f9e44', tagline: "System design and trade-offs don't prompt themselves" },
  { id: 'product-thinking', label: 'Product Thinking', emoji: '💡', zone: 'input', ring: 1, position: 1, x: -105, y: 61, fillColor: '#ffd8a8', strokeColor: '#e8590c', tagline: "Own the 'what' and 'why' before the agent writes the 'how'" },
  { id: 'agentic-orchestration', label: 'Agentic Orchestration', emoji: '🤖', zone: 'transverse', ring: 1, position: 2, x: 0, y: -121, fillColor: '#bac8ff', strokeColor: '#3b5bdb', tagline: 'Design, chain, and supervise AI agents' },
  { id: 'tech-debt', label: 'Tech Debt', emoji: '🧹', zone: 'output', ring: 1, position: 3, x: 105, y: -61, fillColor: '#d0bfff', strokeColor: '#7048e8', tagline: 'AI writes fast, but someone has to maintain it' },
  { id: 'code-review', label: 'Code Review', emoji: '👁️', zone: 'output', ring: 1, position: 4, x: 105, y: 61, fillColor: '#b2f2bb', strokeColor: '#2b8a3e', tagline: 'The last line of defense is now the main job' },
  { id: 'qa-testing', label: 'QA & Testing', emoji: '🧪', zone: 'output', ring: 1, position: 5, x: 0, y: 121, fillColor: '#e599f7', strokeColor: '#9c36b5', tagline: "If you didn't write it, you'd better know how to break it" },
  // Ring 2 — outer (7 hexagons, partial ring)
  { id: 'self-marketing', label: 'Self Marketing', emoji: '📣', zone: 'transverse', ring: 2, position: 0, x: -105, y: -182, fillColor: '#ffdeeb', strokeColor: '#c2255c', tagline: "Your work won't speak for itself" },
  { id: 'technical-writing', label: 'Technical Writing', emoji: '📝', zone: 'transverse', ring: 2, position: 1, x: 0, y: -242, fillColor: '#ffd43b', strokeColor: '#e67700', tagline: 'Specs, prompts, and docs are the new source code' },
  { id: 'inference-economy', label: 'Inference Economy', emoji: '💰', zone: 'transverse', ring: 2, position: 2, x: 105, y: -182, fillColor: '#c3fae8', strokeColor: '#087f5b', tagline: 'Save tokens, use simpler models when a frontier model is overkill' },
  { id: 'black-box-debug', label: 'Black Box Debug', emoji: '🔍', zone: 'transverse', ring: 2, position: 3, x: 210, y: 0, fillColor: '#ffc9c9', strokeColor: '#e03131', tagline: "You can't debug what you can't see" },
  { id: 'geo-llmo', label: 'GEO / LLMO', emoji: '🌐', zone: 'transverse', ring: 2, position: 4, x: 105, y: 182, fillColor: '#99e9f2', strokeColor: '#0c8599', tagline: 'Make your content discoverable by AI models' },
  { id: 'legal-compliance', label: 'Legal & Compliance', emoji: '⚖️', zone: 'transverse', ring: 2, position: 5, x: -105, y: 182, fillColor: '#ffec99', strokeColor: '#e67700', tagline: "GDPR, AI Act, licensing — the rules AI can't learn on its own" },
  { id: 'cybersecurity', label: 'Cybersecurity', emoji: '🔒', zone: 'transverse', ring: 2, position: 6, x: -210, y: 0, fillColor: '#ffa8a8', strokeColor: '#c92a2a', tagline: 'AI-generated code is only as secure as the reviewer' },
];

export const useHexagonsStore = defineStore('hexagons', () => {
  const selectedId = ref<string | null>(null);

  const selectedHexagon = computed(() =>
    selectedId.value ? HEXAGONS.find(h => h.id === selectedId.value) ?? null : null
  );

  function select(id: string) {
    selectedId.value = selectedId.value === id ? null : id;
  }

  function clear() {
    selectedId.value = null;
  }

  return { selectedId, selectedHexagon, select, clear };
});
