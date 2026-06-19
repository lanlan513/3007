export type FanCategory = 'round' | 'folding' | 'feather';

export interface TimelineEvent {
  period: string;
  year: string;
  title: string;
  description: string;
  significance?: string;
}

export interface Fan {
  id: string;
  name: string;
  category: FanCategory;
  categoryName: string;
  image: string;
  description: string;
  history: string;
  material: string;
  usage: string;
  origin: string;
  dynasty: string;
  tags: string[];
  materials: string[];
  usages: string[];
  popularDynasties: string[];
  timeline: TimelineEvent[];
  relatedFanIds?: string[];
}

export interface Category {
  value: string;
  label: string;
  description: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FanDetailResponse {
  fan: Fan;
  relatedFans: Fan[];
}

export interface FilterOptionsResponse {
  dynasties: FilterOption[];
  materials: FilterOption[];
  usages: FilterOption[];
}

export interface FanFilters {
  category?: string;
  keyword?: string;
  dynasty?: string;
  material?: string;
  usage?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type ArtCategory = 'calligraphy' | 'landscape' | 'flower-bird' | 'figure' | 'abstract' | 'other';

export interface Artwork {
  id: string;
  title: string;
  author: string;
  category: ArtCategory;
  categoryName: string;
  image: string;
  description: string;
  likes: number;
  commentCount: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  artworkId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface CreateArtworkPayload {
  title: string;
  author: string;
  category: ArtCategory;
  image: string;
  description: string;
}

export interface CreateCommentPayload {
  artworkId: string;
  author: string;
  content: string;
}

export type FanFrameMaterial = 'bamboo' | 'sandalwood' | 'redwood' | 'ivory' | 'jade';
export type FanSurfaceMaterial = 'silk' | 'paper' | 'gauze' | 'brocade';
export type CraftStep = 'frame_carving' | 'surface_painting' | 'assembly' | 'decoration' | 'polishing';
export type CraftQuality = 'basic' | 'fine' | 'exquisite' | 'masterpiece';
export type ApprenticeLevel = 'apprentice' | 'craftsman' | 'master' | 'grandmaster';

export interface FanMaterial {
  id: string;
  name: string;
  type: 'frame' | 'surface';
  cost: number;
  quality: number;
  description: string;
  icon: string;
}

export interface CraftTechnique {
  id: string;
  step: CraftStep;
  name: string;
  description: string;
  qualityBonus: number;
  costMultiplier: number;
  timeCost: number;
  requiredLevel: ApprenticeLevel;
}

export interface CraftedFan {
  id: string;
  name: string;
  frameMaterial: FanMaterial;
  surfaceMaterial: FanMaterial;
  techniques: CraftTechnique[];
  totalScore: number;
  qualityScore: number;
  aestheticScore: number;
  craftScore: number;
  creativityScore: number;
  cost: number;
  craftedAt: string;
  quality: CraftQuality;
}

export interface WorkshopState {
  coins: number;
  level: ApprenticeLevel;
  experience: number;
  experienceToNext: number;
  craftedFans: CraftedFan[];
  currentCraft: CraftedFan | null;
  isCrafting: boolean;
  craftProgress: number;
}

export const APPRENTICE_LEVELS: Record<ApprenticeLevel, { name: string; expRequired: number; icon: string }> = {
  apprentice: { name: '学徒', expRequired: 0, icon: '🌱' },
  craftsman: { name: '工匠', expRequired: 100, icon: '🔨' },
  master: { name: '大师', expRequired: 500, icon: '🎨' },
  grandmaster: { name: '宗师', expRequired: 2000, icon: '👑' },
};
