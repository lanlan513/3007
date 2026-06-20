export type FanCategory = 'round' | 'folding' | 'feather';

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

export const REGISTRY_RARITY_INFO: Record<FanRegistryRarity, { label: string; color: string; bgColor: string; border: string; seal: string; glow: string }> = {
  common: { label: '寻常', color: 'text-ink-600', bgColor: 'bg-paper-100', border: 'border-paper-300', seal: '📜', glow: '' },
  rare: { label: '珍品', color: 'text-bamboo-600', bgColor: 'bg-bamboo-50', border: 'border-bamboo-300', seal: '🏛️', glow: 'shadow-[0_0_15px_rgba(125,155,106,0.2)]' },
  epic: { label: '名器', color: 'text-gold-600', bgColor: 'bg-gold-50', border: 'border-gold-300', seal: '⚜️', glow: 'shadow-[0_0_20px_rgba(201,169,89,0.3)]' },
  legendary: { label: '神品', color: 'text-vermilion-600', bgColor: 'bg-vermilion-50', border: 'border-vermilion-300', seal: '👑', glow: 'shadow-[0_0_25px_rgba(200,16,46,0.25)]' },
};

export const REGISTRY_STATUS_INFO: Record<FanRegistryStatus, { label: string; color: string; icon: string }> = {
  undiscovered: { label: '未发现', color: 'text-ink-300', icon: '❓' },
  discovered: { label: '已发现', color: 'text-paper-600', icon: '📖' },
  locked: { label: '封印中', color: 'text-vermilion-500', icon: '🔒' },
  unlocked: { label: '已解封', color: 'text-bamboo-600', icon: '🔓' },
  completed: { label: '已完备', color: 'text-gold-600', icon: '✅' },
};

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

export type DamageType = 'torn_surface' | 'broken_frame' | 'faded_calligraphy' | 'loose_rivets' | 'stained_surface' | 'missing_tassel';

export interface DamageInfo {
  type: DamageType;
  name: string;
  description: string;
  severity: number;
  repairCost: number;
  icon: string;
}

export type RepairStep = 'assessment' | 'cleaning' | 'mending' | 'restoration' | 'polishing' | 'final_check';

export interface RepairTechnique {
  id: string;
  step: RepairStep;
  name: string;
  description: string;
  qualityBonus: number;
  costMultiplier: number;
  timeCost: number;
  requiredLevel: ApprenticeLevel;
}

export type CommissionStatus = 'pending' | 'in_progress' | 'completed' | 'delivered';

export interface RepairCommission {
  id: string;
  fanId: string;
  fanName: string;
  fanImage: string;
  dynasty: string;
  origin: string;
  description: string;
  damages: DamageInfo[];
  reward: number;
  expReward: number;
  deadline?: string;
  status: CommissionStatus;
  currentStep: number;
  repairProgress: number;
  selectedTechniques: Record<string, RepairTechnique>;
  finalQuality?: number;
  startedAt?: string;
  completedAt?: string;
  unlockedArchive?: Fan;
}

export interface RestoredFan {
  commissionId: string;
  fan: Fan;
  restoredAt: string;
  restorationQuality: number;
  repairNotes: string;
}

export const DAMAGE_TYPES: Record<DamageType, Omit<DamageInfo, 'severity' | 'repairCost'>> = {
  torn_surface: {
    type: 'torn_surface',
    name: '破损扇面',
    description: '扇面有撕裂或破洞，需要重新裱糊修复',
    icon: '📄',
  },
  broken_frame: {
    type: 'broken_frame',
    name: '断裂扇骨',
    description: '扇骨有断裂或损坏，需要拼接或更换',
    icon: '🦴',
  },
  faded_calligraphy: {
    type: 'faded_calligraphy',
    name: '褪色题字',
    description: '扇面题字或绘画褪色，需要重新描摹或补色',
    icon: '✍️',
  },
  loose_rivets: {
    type: 'loose_rivets',
    name: '铆钉松动',
    description: '扇骨铆钉松动，需要重新加固或更换',
    icon: '🔩',
  },
  stained_surface: {
    type: 'stained_surface',
    name: '污渍浸染',
    description: '扇面有污渍或水渍，需要专业清洁',
    icon: '💧',
  },
  missing_tassel: {
    type: 'missing_tassel',
    name: '坠饰缺失',
    description: '扇坠或流苏缺失，需要重新配制',
    icon: '🧵',
  },
};

export const REPAIR_STEPS: { key: RepairStep; name: string; icon: string; description: string }[] = [
  { key: 'assessment', name: '诊断评估', icon: '🔍', description: '仔细检查古扇损坏情况，制定修复方案' },
  { key: 'cleaning', name: '清洁除尘', icon: '🧹', description: '清除表面灰尘和污渍，为修复做准备' },
  { key: 'mending', name: '修补破损', icon: '🪡', description: '修补扇面破洞、接断裂扇骨' },
  { key: 'restoration', name: '原貌恢复', icon: '🎨', description: '恢复褪色题字、缺失纹饰' },
  { key: 'polishing', name: '打磨上光', icon: '✨', description: '打磨扇骨，上蜡保护' },
  { key: 'final_check', name: '最终检验', icon: '✅', description: '检查修复质量，确保完好如初' },
];

export type SchoolId = 'suzhou' | 'hangzhou' | 'sichuan' | 'guangdong' | 'beijing' | 'xiangtan';

export interface SchoolStyle {
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface CraftFeature {
  id: string;
  name: string;
  description: string;
  detail: string;
}

export interface CulturalStory {
  id: string;
  title: string;
  content: string;
  era?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FanSchool {
  id: SchoolId;
  name: string;
  shortName: string;
  origin: string;
  description: string;
  style: SchoolStyle;
  representativeFans: string[];
  craftFeatures: CraftFeature[];
  culturalStories: CulturalStory[];
  quizQuestions: QuizQuestion[];
  history: string;
  famousArtisans: string[];
  materials: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'master';
}

export type FragmentType = 'style' | 'craft' | 'story' | 'quiz' | 'crafting';

export interface SchoolFragment {
  id: string;
  schoolId: SchoolId;
  type: FragmentType;
  title: string;
  description: string;
  content: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
}

export interface CollectedFragment {
  fragmentId: string;
  schoolId: SchoolId;
  collectedAt: string;
  source: 'explore' | 'quiz' | 'crafting' | 'trade' | 'gift';
  count: number;
}

export interface TradeOffer {
  id: string;
  fromUserId: string;
  fromUserName: string;
  offeredFragment: SchoolFragment;
  offeredCount: number;
  requestedFragment: SchoolFragment;
  requestedCount: number;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  level: number;
}

export interface SchoolCollectionState {
  collectedFragments: CollectedFragment[];
  completedSchools: SchoolId[];
  currentExploringSchool: SchoolId | null;
  exploreProgress: number;
  quizHistory: Record<string, boolean>;
  tradeOffers: TradeOffer[];
  activeFragment: SchoolFragment | null;
  showFragmentModal: boolean;
  showQuizModal: boolean;
  showTradeModal: boolean;
  selectedSchoolForQuiz: SchoolId | null;
  users: UserProfile[];
  currentUserId: string;
}

export const FRAGMENT_RARITY_INFO: Record<string, { label: string; color: string; bgColor: string }> = {
  common: { label: '普通', color: 'text-ink-500', bgColor: 'bg-ink-100' },
  rare: { label: '稀有', color: 'text-bamboo-600', bgColor: 'bg-bamboo-100' },
  epic: { label: '史诗', color: 'text-gold-600', bgColor: 'bg-gold-100' },
  legendary: { label: '传世', color: 'text-vermilion-600', bgColor: 'bg-vermilion-100' },
};

export const FRAGMENT_TYPE_INFO: Record<FragmentType, { label: string; icon: string; source: string }> = {
  style: { label: '风格鉴赏', icon: '🎨', source: '探索流派获得' },
  craft: { label: '工艺探秘', icon: '🔧', source: '探索或答题获得' },
  story: { label: '文化故事', icon: '📖', source: '探索或答题获得' },
  quiz: { label: '知识问答', icon: '❓', source: '答对题目获得' },
  crafting: { label: '制作成就', icon: '✨', source: '工坊制作珍品扇子获得' },
};

export const SCHOOLS: FanSchool[] = [
  {
    id: 'suzhou',
    name: '苏扇',
    shortName: '苏',
    origin: '江苏苏州',
    description: '苏扇历史悠久，以雅致精巧著称，是中国折扇的代表流派。',
    style: {
      name: '雅致精巧',
      description: '苏扇讲究文人雅趣，注重书画结合，风格清丽脱俗',
      icon: '🏯',
      color: 'vermilion',
    },
    representativeFans: ['水磨骨折扇', '檀香扇', '绢宫扇'],
    craftFeatures: [
      {
        id: 'suzhou_craft_1',
        name: '水磨骨工艺',
        description: '苏扇扇骨需经过数十道工序打磨',
        detail: '水磨骨是苏扇的核心工艺，选用上等竹材，经过锯、劈、削、磨等数十道工序，最终达到光可鉴人、温润如玉的效果。',
      },
      {
        id: 'suzhou_craft_2',
        name: '扇面书画',
        description: '名家书画是苏扇的灵魂',
        detail: '苏扇扇面多请名家绘制，山水、花鸟、人物无所不包，集诗书画印于一体，堪称袖珍艺术品。',
      },
      {
        id: 'suzhou_craft_3',
        name: '雕花烫花',
        description: '扇骨雕刻是苏扇的点睛之笔',
        detail: '苏扇扇骨常以浅刻、浮雕、烫花等技法装饰，题材多为山水、花鸟、诗文，玲珑剔透，雅趣盎然。',
      },
    ],
    culturalStories: [
      {
        id: 'suzhou_story_1',
        title: '唐寅画扇',
        content: '明代唐伯虎曾在扇面作画，一画值千金，传为美谈。据说他为朋友画的一扇面，以水墨写竹石，意境清远，被收藏家视为珍宝。',
        era: '明代',
      },
      {
        id: 'suzhou_story_2',
        title: '檀香扇传奇',
        content: '苏州檀香扇以名贵檀香木制成，香气馥郁持久。清代时作为贡品进献宫廷，深受皇室喜爱，被誉为"扇中之王"。',
        era: '清代',
      },
    ],
    quizQuestions: [
      {
        id: 'suzhou_quiz_1',
        question: '苏扇的核心工艺"水磨骨"主要是指什么？',
        options: ['用水浸泡扇骨', '经过数十道工序打磨扇骨', '在扇骨上绘制水纹', '用特殊水漆涂饰'],
        correctIndex: 1,
        explanation: '水磨骨是苏扇的传统工艺，选用上等竹材，经过锯、劈、削、磨等数十道工序精心打磨，使扇骨光可鉴人、温润如玉。',
      },
      {
        id: 'suzhou_quiz_2',
        question: '以下哪种扇子是苏扇的代表？',
        options: ['竹丝扇', '水磨骨折扇', '葵花扇', '黑纸扇'],
        correctIndex: 1,
        explanation: '水磨骨折扇是苏扇最具代表性的品种，以其精湛的打磨工艺和文人雅趣的风格闻名于世。',
      },
    ],
    history: '苏扇起源于宋代，盛于明清。苏州自古为文化名城，文人墨客云集，折扇自宋代传入后迅速发展。明代苏州制扇名家辈出，如柳玉台、蒋苏台等，所制折扇被称为"吴扇"，享誉天下。清代苏扇制作技艺达到顶峰，成为宫廷贡品。',
    famousArtisans: ['柳玉台', '蒋苏台', '赵昆山', '陈寅生'],
    materials: ['紫竹', '檀香木', '宣纸', '丝绢', '大漆'],
    difficulty: 'intermediate',
  },
  {
    id: 'hangzhou',
    name: '杭扇',
    shortName: '杭',
    origin: '浙江杭州',
    description: '杭扇与丝绸、茶叶并称"杭州三绝"，以黑纸扇最为著名。',
    style: {
      name: '古朴典雅',
      description: '杭扇以实用为主，兼具美观，风格朴实大方、经久耐用',
      icon: '🏔️',
      color: 'bamboo',
    },
    representativeFans: ['黑纸扇', '白纸扇', '檀香扇', '团扇'],
    craftFeatures: [
      {
        id: 'hangzhou_craft_1',
        name: '柿漆涂面',
        description: '黑纸扇表面需反复涂刷柿漆',
        detail: '杭扇黑纸扇需用柿漆反复涂刷数十遍，经过日晒雨淋，最终呈现乌黑油亮的色泽，防水耐潮，可遮阳避雨。',
      },
      {
        id: 'hangzhou_craft_2',
        name: '棕竹骨工艺',
        description: '选用优质棕竹制作扇骨',
        detail: '杭扇扇骨多采用棕竹，质地坚韧，色泽深沉，经打磨后光滑温润，手感极佳。',
      },
      {
        id: 'hangzhou_craft_3',
        name: '金银箔贴花',
        description: '高档杭扇以金银箔装饰',
        detail: '高档杭扇常在扇面或扇骨上贴金银箔，绘制山水花鸟图案，华丽精致，具有很高的艺术价值。',
      },
    ],
    culturalStories: [
      {
        id: 'hangzhou_story_1',
        title: '西湖借伞',
        content: '《白蛇传》中白娘子与许仙在西湖断桥相遇，以伞为媒，成就千年爱情佳话。这把伞正是杭州传统的油纸伞。',
        era: '宋代（传说）',
      },
      {
        id: 'hangzhou_story_2',
        title: '王星记扇庄',
        content: '清光绪元年，杭州王星记扇庄创立，所制黑纸扇被誉为"一把扇子半把伞"，不仅能遮阳还能避雨，成为杭州名片。',
        era: '清代',
      },
    ],
    quizQuestions: [
      {
        id: 'hangzhou_quiz_1',
        question: '杭扇最著名的品种是？',
        options: ['团扇', '黑纸扇', '羽毛扇', '竹丝扇'],
        correctIndex: 1,
        explanation: '黑纸扇是杭扇最著名的代表品种，以柿漆涂面，防水耐潮，被誉为"一把扇子半把伞"。',
      },
      {
        id: 'hangzhou_quiz_2',
        question: '杭扇"黑纸扇"的扇面需要用什么反复涂刷？',
        options: ['墨汁', '柿漆', '桐油', '黑漆'],
        correctIndex: 1,
        explanation: '黑纸扇需用柿漆反复涂刷数十遍，经过日晒雨淋，呈现乌黑油亮的色泽，可防水耐潮。',
      },
    ],
    history: '杭扇历史悠久，南宋时杭州作为都城，制扇业十分发达。明清时期，杭扇与丝绸、茶叶并称"杭州三绝"。清代王星记扇庄的创立，将杭扇制作推向新的高峰。',
    famousArtisans: ['王星斋', '陈英', '朱念慈'],
    materials: ['棕竹', '毛竹', '桑皮纸', '柿漆', '金银箔'],
    difficulty: 'beginner',
  },
  {
    id: 'sichuan',
    name: '川扇',
    shortName: '川',
    origin: '四川成都',
    description: '川扇以竹丝编织为特色，精巧绝伦，被誉为"蜀中一绝"。',
    style: {
      name: '精巧编织',
      description: '川扇以细竹丝编织而成，工艺精湛，图案精美，独具巴蜀风韵',
      icon: '🎋',
      color: 'bamboo',
    },
    representativeFans: ['竹丝扇', '瓷胎竹编扇', '龚扇'],
    craftFeatures: [
      {
        id: 'sichuan_craft_1',
        name: '竹丝编织',
        description: '川扇以细竹丝编织为核心工艺',
        detail: '制作川扇需将竹材劈成细如发丝的竹丝，然后经纬交织编织成扇面。每把扇子需要数千根竹丝，工艺极为精细。',
      },
      {
        id: 'sichuan_craft_2',
        name: '图案编织',
        description: '编织时直接形成各种精美图案',
        detail: '川扇编织时利用竹丝的深浅色差，直接编出花鸟、山水、人物等图案，栩栩如生，巧夺天工。',
      },
      {
        id: 'sichuan_craft_3',
        name: '龚扇绝技',
        description: '自贡龚扇是川扇中的极品',
        detail: '龚扇由清代龚爵五创立，用竹丝细如蚕丝编织，扇面薄如蝉翼，透光可见图案，被誉为"天下第一扇"。',
      },
    ],
    culturalStories: [
      {
        id: 'sichuan_story_1',
        title: '龚扇传奇',
        content: '清代自贡工匠龚爵五，受民间竹编启发，经多年钻研，创作出竹丝细如蚕丝的竹编扇。其扇薄如蝉翼，透光可见花纹，曾获巴拿马万国博览会金奖。',
        era: '清代',
      },
      {
        id: 'sichuan_story_2',
        title: '诸葛亮与羽扇',
        content: '相传三国时期诸葛亮手摇羽扇，运筹帷幄。羽扇便产自蜀地，后逐渐发展为以竹丝编织的川扇。',
        era: '三国（传说）',
      },
    ],
    quizQuestions: [
      {
        id: 'sichuan_quiz_1',
        question: '川扇最核心的工艺是？',
        options: ['雕刻扇骨', '竹丝编织', '绘制扇面', '上漆推光'],
        correctIndex: 1,
        explanation: '川扇以竹丝编织为核心工艺，将竹材劈成细如发丝的竹丝，经纬交织编织成扇面。',
      },
      {
        id: 'sichuan_quiz_2',
        question: '被誉为"天下第一扇"的是？',
        options: ['苏扇', '杭扇', '龚扇', '京扇'],
        correctIndex: 2,
        explanation: '自贡龚扇是川扇中的极品，竹丝细如蚕丝，扇面薄如蝉翼，被誉为"天下第一扇"。',
      },
    ],
    history: '川扇起源于汉代，四川盛产翠竹，为制扇提供了优良原料。唐宋时期四川竹编工艺已十分发达。清代自贡龚爵五创立龚扇，将川扇技艺推向巅峰，成为中国四大名扇之一。',
    famousArtisans: ['龚爵五', '龚玉璋', '龚道勇'],
    materials: ['慈竹', '楠竹', '丝绸', '牛角'],
    difficulty: 'advanced',
  },
  {
    id: 'guangdong',
    name: '粤扇',
    shortName: '粤',
    origin: '广东广州',
    description: '粤扇以火画扇和葵扇著称，具有浓郁的岭南特色。',
    style: {
      name: '岭南风情',
      description: '粤扇融中西工艺，造型新颖，装饰华丽，充满南国风情',
      icon: '🌴',
      color: 'gold',
    },
    representativeFans: ['火画扇', '葵扇', '檀香扇', '象牙扇'],
    craftFeatures: [
      {
        id: 'guangdong_craft_1',
        name: '火画工艺',
        description: '以烙铁代笔在扇面上作画',
        detail: '火画扇是粤扇一绝，工匠用特制的烙铁在葵扇或檀香扇上烫出深浅不同的褐色痕迹，形成山水花鸟等图案，永不褪色。',
      },
      {
        id: 'guangdong_craft_2',
        name: '葵扇编织',
        description: '广东新会葵扇闻名全国',
        detail: '新会盛产蒲葵，当地人将葵叶晾晒加工后编织成扇。葵扇轻便实用，价廉物美，深受百姓喜爱。',
      },
      {
        id: 'guangdong_craft_3',
        name: '牙雕镶嵌',
        description: '高档粤扇常以象牙雕刻装饰',
        detail: '广东牙雕技艺精湛，高档粤扇扇骨多以象牙雕刻而成，玲珑剔透，镶嵌珠宝，极尽奢华。',
      },
    ],
    culturalStories: [
      {
        id: 'guangdong_story_1',
        title: '新会葵扇',
        content: '广东新会素有"葵乡"之称，葵扇制作已有千年历史。据说唐代高僧鉴真东渡日本时，曾携带新会葵扇，将这一技艺传至东瀛。',
        era: '唐代',
      },
      {
        id: 'guangdong_story_2',
        title: '十三行外销扇',
        content: '清代广州十三行时期，粤扇大量外销欧洲。工匠们将中西工艺结合，制作出深受西方贵族喜爱的外销扇，成为海上丝绸之路上的珍品。',
        era: '清代',
      },
    ],
    quizQuestions: [
      {
        id: 'guangdong_quiz_1',
        question: '粤扇的"火画"工艺是指什么？',
        options: ['用火烧制扇骨', '以烙铁代笔在扇面作画', '用彩色火焰装饰', '扇面绘制火焰图案'],
        correctIndex: 1,
        explanation: '火画扇是粤扇的特色工艺，工匠用特制烙铁在扇面上烫出深浅不同的褐色痕迹形成图案，永不褪色。',
      },
      {
        id: 'guangdong_quiz_2',
        question: '广东新会以什么扇子闻名？',
        options: ['竹丝扇', '葵扇', '黑纸扇', '团扇'],
        correctIndex: 1,
        explanation: '广东新会素有"葵乡"之称，葵扇制作已有千年历史，是当地著名特产。',
      },
    ],
    history: '粤扇历史悠久，广东地处热带亚热带，扇子是日常生活必需品。汉代粤扇已具雏形，唐宋时期工艺日趋成熟。清代广州十三行的繁荣，推动粤扇大量外销，中西工艺融合，形成独特风格。',
    famousArtisans: ['陈尧臣', '余景云', '赵仲壶'],
    materials: ['蒲葵叶', '檀香木', '象牙', '玳瑁', '银箔'],
    difficulty: 'intermediate',
  },
  {
    id: 'beijing',
    name: '京扇',
    shortName: '京',
    origin: '北京',
    description: '京扇融合各地精华，宫廷风格浓厚，尽显皇家气派。',
    style: {
      name: '皇家气派',
      description: '京扇雍容华贵，做工考究，融合南北工艺，体现皇家审美',
      icon: '🏛️',
      color: 'gold',
    },
    representativeFans: ['宫廷团扇', '清宫折扇', '象牙劈丝扇'],
    craftFeatures: [
      {
        id: 'beijing_craft_1',
        name: '缂丝扇面',
        description: '京扇扇面常采用缂丝工艺',
        detail: '缂丝是中国传统丝织工艺中的极品，有"一寸缂丝一寸金"之说。京扇采用缂丝扇面，图案精细，色彩丰富，极具皇家气派。',
      },
      {
        id: 'beijing_craft_2',
        name: '象牙劈丝',
        description: '将象牙劈成细丝编织成扇',
        detail: '京扇中的极品采用象牙劈丝工艺，将象牙劈成细如发丝的丝线，然后编织成扇面，再以染色处理，工艺难度极高。',
      },
      {
        id: 'beijing_craft_3',
        name: '宫廷造办处制扇',
        description: '清宫造办处代表制扇最高水平',
        detail: '清代宫廷造办处聚集全国制扇高手，所制折扇扇骨选材名贵，雕刻精细，扇面多为宫廷画家手笔，极尽奢华。',
      },
    ],
    culturalStories: [
      {
        id: 'beijing_story_1',
        title: '乾隆御扇',
        content: '乾隆皇帝酷爱折扇，常命造办处制作御用笔折扇。他喜欢在扇面上题诗作画，赏赐给大臣。一把乾隆御笔折扇，在当时已是无价之宝。',
        era: '清代',
      },
      {
        id: 'beijing_story_2',
        title: '慈禧与团扇',
        content: '慈禧太后钟爱团扇，宫中专门设有制坊为她制作。她所用团扇多以缂丝、刺绣为面，象牙、白玉为柄，极尽奢华。',
        era: '清代',
      },
    ],
    quizQuestions: [
      {
        id: 'beijing_quiz_1',
        question: '京扇中"一寸缂丝一寸金"指的是哪种工艺？',
        options: ['刺绣工艺', '缂丝扇面工艺', '象牙劈丝工艺', '火画工艺'],
        correctIndex: 1,
        explanation: '缂丝是中国传统丝织工艺中的极品，有"一寸缂丝一寸金"之说，京扇缂丝扇面图案精细，色彩丰富。',
      },
      {
        id: 'beijing_quiz_2',
        question: '清代宫廷制作扇子的专门机构是？',
        options: ['内务府', '造办处', '工部', '御用监'],
        correctIndex: 1,
        explanation: '清代宫廷造办处聚集全国制扇高手，专门为皇室制作各类工艺品，包括折扇、团扇等。',
      },
    ],
    history: '京扇起源于元代建都北京之后，明清两代作为帝都，汇集天下能工巧匠。京扇融合苏、杭、川、粤各流派精华，又深受宫廷审美影响，形成雍容华贵、做工考究的独特风格。',
    famousArtisans: ['张廷济', '杨澥', '金西厓'],
    materials: ['象牙', '白玉', '翡翠', '缂丝', '大漆'],
    difficulty: 'master',
  },
  {
    id: 'xiangtan',
    name: '湘扇',
    shortName: '湘',
    origin: '湖南湘潭',
    description: '湘扇以油纸扇和羽毛扇闻名，承载着湖湘文化底蕴。',
    style: {
      name: '湖湘韵味',
      description: '湘扇质朴实用，兼具楚文化浪漫色彩，风格清新自然',
      icon: '🌺',
      color: 'vermilion',
    },
    representativeFans: ['油纸扇', '鹅毛扇', '孔明扇'],
    craftFeatures: [
      {
        id: 'xiangtan_craft_1',
        name: '油纸扇工艺',
        description: '以棉纸和桐油制作防水油纸扇',
        detail: '湘扇油纸扇选用优质棉纸，刷以桐油，反复数十遍，形成透明坚韧的扇面。防水防潮，既可遮阳又可避雨。',
      },
      {
        id: 'xiangtan_craft_2',
        name: '羽毛扇制作',
        description: '鹅毛扇是湘扇的代表',
        detail: '湘扇羽毛扇选用优质鹅翎，经过清洗、晾晒、剪裁、拼接等工序制成。扇出的风柔和温润，特别适合老人和病人使用。',
      },
      {
        id: 'xiangtan_craft_3',
        name: '扇面彩绘',
        description: '湘扇扇面多绘制湖湘山水人物',
        detail: '湘扇扇面常绘制岳阳楼、洞庭湖、橘子洲头等湖南名胜，以及屈原、贾谊等历史人物，具有浓郁的湖湘文化特色。',
      },
    ],
    culturalStories: [
      {
        id: 'xiangtan_story_1',
        title: '诸葛孔明扇',
        content: '相传诸葛亮手持的羽毛扇产自湘江之滨。鹅毛扇扇出的风柔和不伤人，体现了诸葛亮的儒雅风度和仁爱之心。湖南鹅毛扇从此名扬天下。',
        era: '三国（传说）',
      },
      {
        id: 'xiangtan_story_2',
        title: '湘潭油纸扇',
        content: '清代湘潭制扇业发达，油纸扇远销长江流域各地。当地有"湘潭扇子甲天下"之说，一把好的油纸扇可以使用十余年。',
        era: '清代',
      },
    ],
    quizQuestions: [
      {
        id: 'xiangtan_quiz_1',
        question: '相传诸葛亮所持的羽毛扇产自哪里？',
        options: ['苏州', '杭州', '湖南湘江之滨', '四川'],
        correctIndex: 2,
        explanation: '相传诸葛亮手持的羽毛扇产自湘江之滨，鹅毛扇扇出的风柔和温润，体现了诸葛亮的儒雅风度。',
      },
      {
        id: 'xiangtan_quiz_2',
        question: '湘扇油纸扇主要用什么材料制作扇面？',
        options: ['丝绢', '棉纸和桐油', '竹丝', '宣纸'],
        correctIndex: 1,
        explanation: '湘扇油纸扇选用优质棉纸，刷以桐油，反复数十遍，形成透明坚韧的防水扇面。',
      },
    ],
    history: '湘扇历史可追溯到战国时期的楚国，屈原在《九歌》中已有扇子的描述。湖南地处江南，夏季炎热，制扇业自古发达。明清时期湘潭成为湘扇制作中心，产品远销各地。',
    famousArtisans: ['周义和', '陈复兴', '黄聚泰'],
    materials: ['鹅毛', '棉纸', '桐油', '楠竹', '丝绸'],
    difficulty: 'beginner',
  },
];

export function generateFragmentsForSchool(schoolId: SchoolId): SchoolFragment[] {
  const school = SCHOOLS.find(s => s.id === schoolId);
  if (!school) return [];

  const fragments: SchoolFragment[] = [];

  fragments.push({
    id: `${schoolId}_style_1`,
    schoolId,
    type: 'style',
    title: `${school.name}风格特征`,
    description: `了解${school.name}的独特艺术风格`,
    content: `${school.style.description}。${school.name}发源于${school.origin}，以"${school.style.name}"的艺术特色闻名于世。`,
    rarity: 'common',
    icon: '🎨',
  });

  school.craftFeatures.forEach((craft, index) => {
    fragments.push({
      id: craft.id,
      schoolId,
      type: 'craft',
      title: craft.name,
      description: craft.description,
      content: craft.detail,
      rarity: index === 0 ? 'rare' : index === 1 ? 'epic' : 'legendary',
      icon: '🔧',
    });
  });

  school.culturalStories.forEach((story, index) => {
    fragments.push({
      id: story.id,
      schoolId,
      type: 'story',
      title: story.title,
      description: `${story.era ? story.era + ' · ' : ''}${school.name}文化故事`,
      content: story.content,
      rarity: index === 0 ? 'rare' : 'epic',
      icon: '📖',
    });
  });

  fragments.push({
    id: `${schoolId}_history_1`,
    schoolId,
    type: 'story',
    title: `${school.name}发展历史`,
    description: `追溯${school.name}的千年传承`,
    content: school.history,
    rarity: 'epic',
    icon: '📜',
  });

  fragments.push({
    id: `${schoolId}_quiz_master`,
    schoolId,
    type: 'quiz',
    title: `${school.name}知识达人`,
    description: `答对题目获得的荣誉徽章`,
    content: `你对${school.name}的文化知识了如指掌，堪称${school.name}文化达人！这份荣誉是你智慧与学识的见证。`,
    rarity: 'rare',
    icon: '🏆',
  });

  fragments.push({
    id: `${schoolId}_crafting_master`,
    schoolId,
    type: 'crafting',
    title: `${school.name}制扇名师`,
    description: `制作${school.name}珍品扇子的成就`,
    content: `你已掌握${school.name}制扇技艺的精髓，能够制作出品质上乘的${school.name}珍品。这是你不懈努力和匠心精神的最好证明。`,
    rarity: 'epic',
    icon: '⭐',
  });

  return fragments;
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

export const REPAIR_TECHNIQUES: RepairTechnique[] = [
  {
    id: 'basic_assessment',
    step: 'assessment',
    name: '基础检查',
    description: '目视检查损坏情况，记录问题',
    qualityBonus: 5,
    costMultiplier: 1.0,
    timeCost: 1,
    requiredLevel: 'apprentice',
  },
  {
    id: 'detailed_assessment',
    step: 'assessment',
    name: '详细鉴定',
    description: '使用专业工具分析材质和年代',
    qualityBonus: 15,
    costMultiplier: 1.2,
    timeCost: 2,
    requiredLevel: 'craftsman',
  },
  {
    id: 'expert_assessment',
    step: 'assessment',
    name: '专家鉴定',
    description: '结合史料研究，制定最佳修复方案',
    qualityBonus: 25,
    costMultiplier: 1.5,
    timeCost: 3,
    requiredLevel: 'master',
  },
  {
    id: 'dry_cleaning',
    step: 'cleaning',
    name: '干法清洁',
    description: '用软毛刷和橡皮擦轻轻除尘',
    qualityBonus: 5,
    costMultiplier: 1.0,
    timeCost: 1,
    requiredLevel: 'apprentice',
  },
  {
    id: 'wet_cleaning',
    step: 'cleaning',
    name: '湿法清洁',
    description: '用专用清洁剂处理顽固污渍',
    qualityBonus: 15,
    costMultiplier: 1.3,
    timeCost: 2,
    requiredLevel: 'craftsman',
  },
  {
    id: 'professional_cleaning',
    step: 'cleaning',
    name: '专业清洗',
    description: '使用古法配方进行全面清洗',
    qualityBonus: 25,
    costMultiplier: 1.6,
    timeCost: 3,
    requiredLevel: 'master',
  },
  {
    id: 'paper_patching',
    step: 'mending',
    name: '纸捻修补',
    description: '用传统纸捻法修补扇面破洞',
    qualityBonus: 10,
    costMultiplier: 1.1,
    timeCost: 2,
    requiredLevel: 'apprentice',
  },
  {
    id: 'invisible_mending',
    step: 'mending',
    name: '无痕修补',
    description: '采用隐形织补技术，修补后看不出痕迹',
    qualityBonus: 25,
    costMultiplier: 1.8,
    timeCost: 4,
    requiredLevel: 'craftsman',
  },
  {
    id: 'master_mending',
    step: 'mending',
    name: '大师级修复',
    description: '恢复如初，甚至更胜原作',
    qualityBonus: 40,
    costMultiplier: 2.5,
    timeCost: 6,
    requiredLevel: 'master',
  },
  {
    id: 'color_touchup',
    step: 'restoration',
    name: '颜色补全',
    description: '用矿物颜料补全褪色部分',
    qualityBonus: 10,
    costMultiplier: 1.2,
    timeCost: 2,
    requiredLevel: 'apprentice',
  },
  {
    id: 'trace_restoration',
    step: 'restoration',
    name: '描摹复原',
    description: '根据残存痕迹，描摹恢复原作',
    qualityBonus: 25,
    costMultiplier: 1.8,
    timeCost: 4,
    requiredLevel: 'craftsman',
  },
  {
    id: 'artistic_restoration',
    step: 'restoration',
    name: '艺术还原',
    description: '查阅史料，完全恢复原作神韵',
    qualityBonus: 40,
    costMultiplier: 2.5,
    timeCost: 5,
    requiredLevel: 'master',
  },
  {
    id: 'basic_polishing',
    step: 'polishing',
    name: '基础打磨',
    description: '用细砂纸轻轻打磨，手感顺滑',
    qualityBonus: 5,
    costMultiplier: 1.0,
    timeCost: 1,
    requiredLevel: 'apprentice',
  },
  {
    id: 'wax_polishing',
    step: 'polishing',
    name: '上蜡抛光',
    description: '天然蜂蜡抛光，光泽温润',
    qualityBonus: 15,
    costMultiplier: 1.3,
    timeCost: 2,
    requiredLevel: 'craftsman',
  },
  {
    id: 'lacquer_polishing',
    step: 'polishing',
    name: '大漆推光',
    description: '传统大漆工艺，光可鉴人',
    qualityBonus: 30,
    costMultiplier: 2.0,
    timeCost: 4,
    requiredLevel: 'master',
  },
  {
    id: 'basic_check',
    step: 'final_check',
    name: '常规检查',
    description: '检查开合是否顺畅，外观是否完好',
    qualityBonus: 5,
    costMultiplier: 1.0,
    timeCost: 0.5,
    requiredLevel: 'apprentice',
  },
  {
    id: 'quality_inspection',
    step: 'final_check',
    name: '质量检验',
    description: '逐项检查修复质量，确保达到标准',
    qualityBonus: 15,
    costMultiplier: 1.2,
    timeCost: 1,
    requiredLevel: 'craftsman',
  },
  {
    id: 'certification',
    step: 'final_check',
    name: '专家认证',
    description: '出具修复证书，保证品质',
    qualityBonus: 25,
    costMultiplier: 1.5,
    timeCost: 2,
    requiredLevel: 'master',
  },
];
