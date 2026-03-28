export type HexZone = 'center' | 'input' | 'output' | 'transverse';
export type HexRing = 0 | 1 | 2;
export type ResourceType = 'article' | 'book' | 'video' | 'tool' | 'roadmap' | 'course' | 'other';

export interface HexagonDef {
  id: string;
  label: string;
  emoji: string;
  zone: HexZone;
  ring: HexRing;
  position: number;
  x: number; // pixel offset from grid center
  y: number; // pixel offset from grid center
  fillColor: string;
  strokeColor: string;
  tagline: string;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  categoryId: string;
  subcategory?: string;
  type: ResourceType;
  unread: boolean;
  description?: string;
}

export interface CustomLink {
  title: string;
  url: string;
}

export interface SavedTemplate {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  readStatus: Record<string, boolean>;
  notes: Record<string, string>;
  customLinks: Record<string, CustomLink[]>;
}
