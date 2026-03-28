import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const readmePath = join(__dirname, '..', 'README.md');
const outputPath = join(__dirname, '..', 'web', 'src', 'assets', 'data', 'resources.json');

type ResourceType = 'article' | 'book' | 'video' | 'tool' | 'roadmap' | 'course' | 'other';

interface Resource {
  id: string;
  title: string;
  url: string;
  categoryId: string;
  subcategory?: string;
  type: ResourceType;
  unread: boolean;
  description?: string;
}

// Map README h2 section anchors/titles to hexagon IDs
const SECTION_MAP: Record<string, string> = {
  'software architecture': 'software-architecture',
  'product thinking': 'product-thinking',
  'code generation': 'code-generation',
  'code generation / writing': 'code-generation',
  'agentic orchestration': 'agentic-orchestration',
  'technical writing': 'technical-writing',
  'inference economy': 'inference-economy',
  'black box debug': 'black-box-debug',
  'black box debug & observability': 'black-box-debug',
  'technical debt management': 'tech-debt',
  'code review': 'code-review',
  'qa & testing strategy': 'qa-testing',
  'self marketing': 'self-marketing',
  'geo / llmo': 'geo-llmo',
  'legal, compliance & governance': 'legal-compliance',
  'cybersecurity': 'cybersecurity',
};

function guessType(title: string, url: string, rawLine: string): ResourceType {
  if (rawLine.includes('📚') || rawLine.toLowerCase().includes('(book)') || rawLine.toLowerCase().includes('book)')) return 'book';
  if (rawLine.includes('🎥') || url.includes('youtube.com') || url.includes('youtu.be')) return 'video';
  if (url.includes('roadmap.sh')) return 'roadmap';
  if (url.includes('openclassrooms.com') || url.includes('huggingface.co/learn') || url.includes('skilljar.com') || url.includes('cloud.google.com/blog/topics/training')) return 'course';
  if (url.includes('github.com') && !url.includes('/blog') && !url.includes('medium') && !url.includes('.md')) return 'tool';
  return 'article';
}

function slugify(text: string, categoryId: string, index: number): string {
  return `${categoryId}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}-${index}`;
}

const content = readFileSync(readmePath, 'utf-8');
const lines = content.split('\n');

const resources: Resource[] = [];
let currentCategory: string | null = null;
let currentSubcategory: string | undefined = undefined;
let resourceIndex = 0;

for (const line of lines) {
  // H2 section
  const h2Match = line.match(/^## (.+)$/);
  if (h2Match) {
    const title = h2Match[1]!.replace(/[^\w\s&/,]/g, '').trim().toLowerCase();
    const mapped = SECTION_MAP[title];
    if (mapped) {
      currentCategory = mapped;
      currentSubcategory = undefined;
    } else {
      // Skip non-category h2s (intro, "What to Focus On Now", etc.)
      currentCategory = null;
    }
    continue;
  }

  // H3/H4 subsections — become subcategory
  const h3Match = line.match(/^#{3,4} (.+)$/);
  if (h3Match && currentCategory) {
    currentSubcategory = h3Match[1]!.trim();
    continue;
  }

  if (!currentCategory) continue;

  // Link lines: `- [Title](url) — description 📌`
  const linkMatch = line.match(/^- (?:📚 |🎥 )?\[(.+?)\]\((.+?)\)(.*)?$/);
  if (!linkMatch) continue;

  const [, title, url, rest = ''] = linkMatch;
  if (!title || !url) continue;

  const unread = rest.includes('📌');
  const descMatch = rest.match(/ — (.+?)(?:\s*📌)?$/);
  const description = descMatch?.[1]?.trim() || undefined;
  const type = guessType(title, url, line);

  resources.push({
    id: slugify(title, currentCategory, resourceIndex++),
    title,
    url,
    categoryId: currentCategory,
    subcategory: currentSubcategory,
    type,
    unread,
    description,
  });
}

writeFileSync(outputPath, JSON.stringify(resources, null, 2));
console.log(`✅ Extracted ${resources.length} resources to ${outputPath}`);

// Print summary by category
const byCategory: Record<string, number> = {};
for (const r of resources) {
  byCategory[r.categoryId] = (byCategory[r.categoryId] ?? 0) + 1;
}
for (const [cat, count] of Object.entries(byCategory).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${cat}: ${count}`);
}
