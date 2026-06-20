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

export type FigureStatus = 'locked' | 'unlocked' | 'completed';

export type FanStoryCategory = 'invention' | 'masterpiece' | 'legend' | 'scholarship' | 'diplomacy';

export interface FigureFanStory {
  id: string;
  title: string;
  category: FanStoryCategory;
  categoryName: string;
  summary: string;
  fullStory: string;
  fanType?: FanCategory;
  relatedFanId?: string;
  year: string;
  significance: string;
  imagePrompt?: string;
}

export interface FigureUniqueEvent {
  id: string;
  title: string;
  description: string;
  trigger: string;
  reward: string;
  completed: boolean;
}

export interface FigureCollectionGoal {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  reward: string;
  type: 'story' | 'event' | 'fan' | 'related';
}

export interface FigureTask {
  id: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  completed: boolean;
  unlocksContent?: string[];
  reward: string;
}

export interface FigureRelation {
  targetFigureId: string;
  type: 'teacher' | 'student' | 'friend' | 'colleague' | 'family' | 'rival' | 'influencer';
  typeName: string;
  description: string;
  weight: number;
}

export interface HistoricalFigure {
  id: string;
  name: string;
  courtesyName?: string;
  title: string;
  dynasty: string;
  birthYear?: string;
  deathYear?: string;
  avatar: string;
  shortBio: string;
  fullBiography: string;
  status: FigureStatus;
  progress: number;
  fanStories: FigureFanStory[];
  uniqueEvents: FigureUniqueEvent[];
  collectionGoals: FigureCollectionGoal[];
  tasks: FigureTask[];
  relations: FigureRelation[];
  tags: string[];
  unlockCondition: string;
  signatureFanType?: FanCategory;
  achievements: string[];
}

export interface FigureDetailResponse {
  figure: HistoricalFigure;
  relatedFigures: HistoricalFigure[];
}

export interface FigureFilters {
  dynasty?: string;
  status?: FigureStatus;
  tag?: string;
}

export interface FigureDynastyOption {
  value: string;
  label: string;
  count: number;
}

export interface FigureTagOption {
  value: string;
  label: string;
  count: number;
}

export interface FigureFilterOptionsResponse {
  dynasties: FigureDynastyOption[];
  tags: FigureTagOption[];
  statuses: { value: FigureStatus; label: string }[];
}

export interface UpdateFigureTaskPayload {
  figureId: string;
  taskId: string;
  completed: boolean;
}

export interface UpdateEventPayload {
  figureId: string;
  eventId: string;
  completed: boolean;
}

export interface CreateFigurePayload {
  name: string;
  courtesyName?: string;
  title: string;
  dynasty: string;
  birthYear?: string;
  deathYear?: string;
  avatar: string;
  shortBio: string;
  fullBiography: string;
  fanStories?: FigureFanStory[];
  uniqueEvents?: FigureUniqueEvent[];
  collectionGoals?: FigureCollectionGoal[];
  tasks?: FigureTask[];
  relations?: FigureRelation[];
  tags?: string[];
  unlockCondition?: string;
  signatureFanType?: FanCategory;
  achievements?: string[];
}

export interface UpdateFigurePayload extends Partial<CreateFigurePayload> {
  id: string;
}
