export type FanRegistryRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type FanRegistryStatus = 'undiscovered' | 'discovered' | 'locked' | 'unlocked' | 'completed';
export type FanRegistryFieldKey = 'origin' | 'craftsmanship' | 'material' | 'dynasty' | 'usage' | 'story';

export interface InheritanceRecord {
  id: string;
  owner: string;
  period: string;
  event: string;
  description: string;
}

export interface RegistryClue {
  id: string;
  text: string;
  hint: string;
  answer: string;
  relatedEntryId: string;
  solved: boolean;
}

export interface MissingField {
  key: FanRegistryFieldKey;
  label: string;
  placeholder: string;
  filled: boolean;
  value: string;
  correctValue: string;
}

export interface FanRegistryEntry {
  id: string;
  registryNumber: string;
  fanId: string;
  name: string;
  category: FanCategory;
  categoryName: string;
  image: string;
  rarity: FanRegistryRarity;
  status: FanRegistryStatus;
  origin: string;
  craftsmanship: string;
  material: string;
  dynasty: string;
  usage: string;
  story: string;
  tags: string[];
  inheritanceRecords: InheritanceRecord[];
  clues: RegistryClue[];
  missingFields: MissingField[];
  completeness: number;
  discoveredAt?: string;
  unlockCondition?: string;
  sealImage?: string;
}

export interface UserRegistryState {
  discoveredEntries: string[];
  unlockedEntries: string[];
  completedEntries: string[];
  solvedClues: string[];
  filledFields: Record<string, Record<string, string>>;
  totalDiscovered: number;
}

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

export type DynastyId = 'pre-qin' | 'han' | 'tang' | 'song' | 'ming' | 'qing' | 'minguo';

export interface ScrollSection {
  id: string;
  dynasty: DynastyId;
  dynastyName: string;
  era: string;
  title: string;
  subtitle: string;
  description: string;
  visualStyle: {
    primaryColor: string;
    secondaryColor: string;
    bgPattern: string;
    decorativeElement: string;
  };
  fanDevelopments: FanDevelopment[];
  stories: ScrollStory[];
  historicalFigures: string[];
  artworks: ScrollArtwork[];
  scrollPosition: number;
  imagePrompt: string;
}

export interface FanDevelopment {
  id: string;
  name: string;
  type: FanCategory;
  typeName: string;
  description: string;
  significance: string;
  imagePrompt: string;
  year: string;
}

export interface ScrollStory {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  category: 'legend' | 'history' | 'art' | 'custom' | 'literature';
  categoryName: string;
  triggerPosition: number;
  relatedFanId?: string;
  relatedFigureId?: string;
  imagePrompt?: string;
}

export interface ScrollArtwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  imagePrompt: string;
  year: string;
}

export interface JourneyRecord {
  id: string;
  sectionId: string;
  dynasty: DynastyId;
  dynastyName: string;
  title: string;
  visitedAt: number;
  scrollPosition: number;
  storiesUnlocked: string[];
  figuresUnlocked: string[];
  fansDiscovered: string[];
  notes?: string;
}

export interface UserJourneyState {
  records: JourneyRecord[];
  totalDistance: number;
  currentSectionId?: string;
  unlockedFigures: string[];
  unlockedStories: string[];
  discoveredFans: string[];
  achievements: string[];
}
