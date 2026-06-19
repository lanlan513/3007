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
