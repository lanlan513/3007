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

export type LifecycleStage =
  | 'creation'
  | 'first_owner'
  | 'famous_encounter'
  | 'historical_event'
  | 'scholarly_affair'
  | 'inheritance'
  | 'loss_rediscovery'
  | 'modern_collection'
  | 'cultural_heritage';

export interface LifecycleEvent {
  id: string;
  stage: LifecycleStage;
  stageName: string;
  period: string;
  year: string;
  yearNumeric: number;
  title: string;
  description: string;
  location: string;
  protagonist?: string;
  protagonistId?: string;
  relatedFigureName?: string;
  emotionalTone: 'joyful' | 'melancholic' | 'heroic' | 'serene' | 'dramatic' | 'mysterious';
  historicalSignificance?: string;
  tags: string[];
  icon: string;
  color: string;
  imagePrompt?: string;
}

export interface FanLifeStory {
  fanId: string;
  fanName: string;
  fanCategory: FanCategory;
  fanCategoryName: string;
  fanImage: string;
  origin: string;
  dynasty: string;
  summary: string;
  poeticPrologue: string;
  poeticEpilogue: string;
  keyThemes: string[];
  lifecycleEvents: LifecycleEvent[];
  relatedFigures: {
    id: string;
    name: string;
    role: string;
    dynasty: string;
    avatar: string;
  }[];
  timelineDuration: string;
  estimatedAges: {
    creation: string;
    modern: string;
  };
  preservationGrade: 'ordinary' | 'fine' | 'rare' | 'national_treasure';
  preservationGradeName: string;
}

export type TechTreeNodeStatus = 'locked' | 'unlocked' | 'completed';

export type TechTreeNodeCategory =
  | 'obstruction'
  | 'feather'
  | 'round'
  | 'folding'
  | 'craft'
  | 'modern';

export interface TechTreeNodeCategoryInfo {
  value: TechTreeNodeCategory;
  label: string;
  description: string;
  color: string;
  icon: string;
}

export interface TechTreeNode {
  id: string;
  name: string;
  category: TechTreeNodeCategory;
  categoryName: string;
  era: string;
  year: string;
  yearNumeric: number;
  description: string;
  historicalBackground: string;
  craftsmanship: string;
  culturalSignificance: string;
  unlockCondition: string;
  prerequisiteIds: string[];
  position: {
    x: number;
    y: number;
    layer: number;
  };
  imagePrompt: string;
  relatedFanIds?: string[];
  relatedFigureIds?: string[];
  achievements: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  rewardPoints: number;
}

export interface TechTreeBranch {
  id: string;
  name: string;
  description: string;
  category: TechTreeNodeCategory;
  categoryName?: string;
  startNodeId?: string;
  endNodeId?: string;
  nodeIds: string[];
  color?: string;
  position?: { x: number; y: number };
}

export interface TechTreeAchievement {
  id: string;
  name: string;
  description: string;
  condition: string;
  icon: string;
  category: 'exploration' | 'completion' | 'lore' | 'milestone' | 'branch';
  points: number;
  unlocked?: boolean;
  unlockedAt?: number;
  relatedNodeIds?: string[];
  requirement?: string;
}

export interface UserTechTreeProgress {
  unlockedNodeIds: string[];
  completedNodeIds: string[];
  currentNodeId?: string;
  totalPoints: number;
  achievements: TechTreeAchievement[];
  explorationNotes: Record<string, string>;
  lastVisitedAt?: number;
}

export interface TechTree {
  id: string;
  name: string;
  description: string;
  categories: TechTreeNodeCategoryInfo[];
  nodes: TechTreeNode[];
  branches: TechTreeBranch[];
  startingNodeId: string;
  achievements?: TechTreeAchievement[];
}

export type CognitionMapStyle = 'tree' | 'timeline' | 'network' | 'radial';

export interface CognitionMapNode {
  nodeId: string;
  exploredAt: number;
  notes?: string;
  connections: string[];
  depth: number;
}

export interface UserCognitionMap {
  userId: string;
  createdAt: number;
  updatedAt: number;
  nodes: CognitionMapNode[];
  style: CognitionMapStyle;
  title?: string;
  description?: string;
  insights: string[];
  exploredPercentage: number;
}

export interface TechTreeResponse {
  techTree: TechTree;
  userProgress: UserTechTreeProgress;
}

export interface NodeDetailResponse {
  node: TechTreeNode;
  relatedFans: Fan[];
  relatedFigures: HistoricalFigure[];
  userProgress: UserTechTreeProgress;
}

export interface UnlockNodePayload {
  nodeId: string;
  notes?: string;
}

export interface UpdateCognitionMapPayload {
  style?: CognitionMapStyle;
  title?: string;
  description?: string;
  nodeNotes?: Record<string, string>;
}
