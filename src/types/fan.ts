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
