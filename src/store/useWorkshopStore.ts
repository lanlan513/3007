import { create } from 'zustand';
import type {
  FanMaterial,
  CraftTechnique,
  CraftedFan,
  ApprenticeLevel,
  CraftQuality,
} from '@/types/fan';
import { APPRENTICE_LEVELS } from '@/types/fan';

const FRAME_MATERIALS: FanMaterial[] = [
  {
    id: 'bamboo_frame',
    name: '竹骨',
    type: 'frame',
    cost: 10,
    quality: 30,
    description: '普通竹制扇骨，轻盈质朴，是入门学徒的首选材料。',
    icon: '🎋',
  },
  {
    id: 'sandalwood_frame',
    name: '檀木骨',
    type: 'frame',
    cost: 50,
    quality: 60,
    description: '名贵檀香木制成，香气悠远，质地温润，乃扇中上品。',
    icon: '🌳',
  },
  {
    id: 'redwood_frame',
    name: '红木骨',
    type: 'frame',
    cost: 80,
    quality: 75,
    description: '珍贵红木打造，色泽沉稳，纹理优美，尽显华贵之气。',
    icon: '🪵',
  },
  {
    id: 'ivory_frame',
    name: '象牙骨',
    type: 'frame',
    cost: 200,
    quality: 90,
    description: '稀世象牙雕琢，洁白温润，雕刻难度极高，乃收藏级珍品。',
    icon: '🦷',
  },
  {
    id: 'jade_frame',
    name: '玉骨',
    type: 'frame',
    cost: 300,
    quality: 95,
    description: '和田美玉琢磨，冰清玉洁，温润如脂，堪称扇中极品。',
    icon: '💎',
  },
];

const SURFACE_MATERIALS: FanMaterial[] = [
  {
    id: 'paper_surface',
    name: '宣纸扇面',
    type: 'surface',
    cost: 5,
    quality: 25,
    description: '传统宣纸，吸墨性佳，适合书法绘画，是最常见的扇面材料。',
    icon: '📜',
  },
  {
    id: 'silk_surface',
    name: '丝绢扇面',
    type: 'surface',
    cost: 30,
    quality: 55,
    description: '上等丝绸织就，光泽柔润，质感细腻，尽显雅致之风。',
    icon: '🧣',
  },
  {
    id: 'gauze_surface',
    name: '纱罗扇面',
    type: 'surface',
    cost: 45,
    quality: 65,
    description: '轻薄纱罗，通透如雾，夏日使用更觉清凉，别具一格。',
    icon: '🌫️',
  },
  {
    id: 'brocade_surface',
    name: '云锦扇面',
    type: 'surface',
    cost: 120,
    quality: 85,
    description: '南京云锦织造，图案华美，金碧辉煌，乃皇家贡品级别。',
    icon: '🎀',
  },
];

const CRAFT_TECHNIQUES: CraftTechnique[] = [
  {
    id: 'basic_carving',
    step: 'frame_carving',
    name: '基础雕刻',
    description: '简单的线条雕刻，适合初学者练习。',
    qualityBonus: 10,
    costMultiplier: 1.0,
    timeCost: 1,
    requiredLevel: 'apprentice',
  },
  {
    id: 'fine_carving',
    step: 'frame_carving',
    name: '精细雕刻',
    description: '精雕细琢，花纹繁复，需要工匠级技艺。',
    qualityBonus: 25,
    costMultiplier: 1.5,
    timeCost: 2,
    requiredLevel: 'craftsman',
  },
  {
    id: 'master_carving',
    step: 'frame_carving',
    name: '大师级雕刻',
    description: '镂空透雕，巧夺天工，非大师不能为之。',
    qualityBonus: 45,
    costMultiplier: 2.5,
    timeCost: 4,
    requiredLevel: 'master',
  },
  {
    id: 'plain_painting',
    step: 'surface_painting',
    name: '素面无饰',
    description: '保持扇面本色，素雅清淡，别有风味。',
    qualityBonus: 5,
    costMultiplier: 0.8,
    timeCost: 0.5,
    requiredLevel: 'apprentice',
  },
  {
    id: 'ink_painting',
    step: 'surface_painting',
    name: '水墨丹青',
    description: '水墨山水，意境悠远，尽显文人雅士之风。',
    qualityBonus: 20,
    costMultiplier: 1.2,
    timeCost: 2,
    requiredLevel: 'apprentice',
  },
  {
    id: 'flower_bird_painting',
    step: 'surface_painting',
    name: '工笔花鸟',
    description: '工笔重彩，花鸟栩栩如生，需要深厚画功。',
    qualityBonus: 35,
    costMultiplier: 1.8,
    timeCost: 3,
    requiredLevel: 'craftsman',
  },
  {
    id: 'gold_foil_painting',
    step: 'surface_painting',
    name: '泥金彩绘',
    description: '金箔点缀，金碧辉煌，富丽堂皇之至。',
    qualityBonus: 50,
    costMultiplier: 3.0,
    timeCost: 5,
    requiredLevel: 'master',
  },
  {
    id: 'simple_assembly',
    step: 'assembly',
    name: '普通装订',
    description: '传统工艺装订，结实耐用。',
    qualityBonus: 5,
    costMultiplier: 1.0,
    timeCost: 0.5,
    requiredLevel: 'apprentice',
  },
  {
    id: 'silk_thread_assembly',
    step: 'assembly',
    name: '丝线穿缀',
    description: '五色丝线穿缀，美观又牢固。',
    qualityBonus: 15,
    costMultiplier: 1.3,
    timeCost: 1.5,
    requiredLevel: 'craftsman',
  },
  {
    id: 'rivet_assembly',
    step: 'assembly',
    name: '铜钉铆合',
    description: '铜钉铆合工艺，经久耐用，古色古香。',
    qualityBonus: 25,
    costMultiplier: 1.6,
    timeCost: 2,
    requiredLevel: 'craftsman',
  },
  {
    id: 'no_decoration',
    step: 'decoration',
    name: '不加装饰',
    description: '保持原貌，返璞归真。',
    qualityBonus: 0,
    costMultiplier: 1.0,
    timeCost: 0,
    requiredLevel: 'apprentice',
  },
  {
    id: 'tassel_decoration',
    step: 'decoration',
    name: '流苏坠饰',
    description: '精美流苏坠饰，摇曳生姿。',
    qualityBonus: 10,
    costMultiplier: 1.1,
    timeCost: 0.5,
    requiredLevel: 'apprentice',
  },
  {
    id: 'jade_pendant',
    step: 'decoration',
    name: '玉佩坠饰',
    description: '温润玉佩，彰显品味。',
    qualityBonus: 25,
    costMultiplier: 1.8,
    timeCost: 1,
    requiredLevel: 'craftsman',
  },
  {
    id: 'basic_polishing',
    step: 'polishing',
    name: '简单打磨',
    description: '基础打磨处理，手感顺滑。',
    qualityBonus: 5,
    costMultiplier: 1.0,
    timeCost: 0.5,
    requiredLevel: 'apprentice',
  },
  {
    id: 'wax_polishing',
    step: 'polishing',
    name: '上蜡抛光',
    description: '打蜡抛光，光泽温润，手感细腻。',
    qualityBonus: 15,
    costMultiplier: 1.2,
    timeCost: 1.5,
    requiredLevel: 'craftsman',
  },
  {
    id: 'lacquer_polishing',
    step: 'polishing',
    name: '大漆推光',
    description: '传统大漆工艺，光可鉴人，历久弥新。',
    qualityBonus: 35,
    costMultiplier: 2.0,
    timeCost: 3,
    requiredLevel: 'master',
  },
];

function calculateQuality(score: number): CraftQuality {
  if (score >= 90) return 'masterpiece';
  if (score >= 70) return 'exquisite';
  if (score >= 45) return 'fine';
  return 'basic';
}

function generateId(): string {
  return `fan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

interface WorkshopState {
  coins: number;
  level: ApprenticeLevel;
  experience: number;
  craftedFans: CraftedFan[];
  selectedFrame: FanMaterial | null;
  selectedSurface: FanMaterial | null;
  selectedTechniques: Record<string, CraftTechnique>;
  isCrafting: boolean;
  craftProgress: number;
  currentCraftStep: number;
  showResult: boolean;
  lastCraftedFan: CraftedFan | null;

  frameMaterials: FanMaterial[];
  surfaceMaterials: FanMaterial[];
  craftTechniques: CraftTechnique[];

  selectFrame: (material: FanMaterial) => void;
  selectSurface: (material: FanMaterial) => void;
  selectTechnique: (technique: CraftTechnique) => void;
  clearTechnique: (step: string) => void;

  getTotalCost: () => number;
  getEstimatedScore: () => number;
  canCraft: () => boolean;

  startCrafting: () => Promise<void>;
  setShowResult: (show: boolean) => void;
  sellFan: (fanId: string) => void;
  addCoins: (amount: number) => void;

  getLevelProgress: () => number;
  getTechniquesByStep: (step: string) => CraftTechnique[];
}

export const useWorkshopStore = create<WorkshopState>((set, get) => ({
  coins: 100,
  level: 'apprentice',
  experience: 0,
  craftedFans: [],
  selectedFrame: null,
  selectedSurface: null,
  selectedTechniques: {},
  isCrafting: false,
  craftProgress: 0,
  currentCraftStep: 0,
  showResult: false,
  lastCraftedFan: null,

  frameMaterials: FRAME_MATERIALS,
  surfaceMaterials: SURFACE_MATERIALS,
  craftTechniques: CRAFT_TECHNIQUES,

  selectFrame: (material) => {
    set({ selectedFrame: material });
  },

  selectSurface: (material) => {
    set({ selectedSurface: material });
  },

  selectTechnique: (technique) => {
    set((state) => ({
      selectedTechniques: {
        ...state.selectedTechniques,
        [technique.step]: technique,
      },
    }));
  },

  clearTechnique: (step) => {
    set((state) => {
      const newTechniques = { ...state.selectedTechniques };
      delete newTechniques[step];
      return { selectedTechniques: newTechniques };
    });
  },

  getTotalCost: () => {
    const { selectedFrame, selectedSurface, selectedTechniques } = get();
    if (!selectedFrame || !selectedSurface) return 0;

    let baseCost = selectedFrame.cost + selectedSurface.cost;
    let multiplier = 1;

    Object.values(selectedTechniques).forEach((tech) => {
      multiplier *= tech.costMultiplier;
    });

    return Math.round(baseCost * multiplier);
  },

  getEstimatedScore: () => {
    const { selectedFrame, selectedSurface, selectedTechniques, level } = get();
    if (!selectedFrame || !selectedSurface) return 0;

    let materialScore = (selectedFrame.quality + selectedSurface.quality) / 2;
    let techniqueBonus = 0;

    Object.values(selectedTechniques).forEach((tech) => {
      techniqueBonus += tech.qualityBonus;
    });

    const levelBonus = {
      apprentice: 0,
      craftsman: 5,
      master: 15,
      grandmaster: 25,
    }[level];

    const baseScore = materialScore + techniqueBonus + levelBonus;
    return Math.min(100, Math.round(baseScore));
  },

  canCraft: () => {
    const {
      selectedFrame,
      selectedSurface,
      selectedTechniques,
      coins,
      getTotalCost,
      level,
    } = get();

    if (!selectedFrame || !selectedSurface) return false;
    if (Object.keys(selectedTechniques).length === 0) return false;
    if (getTotalCost() > coins) return false;

    const levelOrder: ApprenticeLevel[] = ['apprentice', 'craftsman', 'master', 'grandmaster'];
    const currentLevelIndex = levelOrder.indexOf(level);

    for (const tech of Object.values(selectedTechniques)) {
      if (levelOrder.indexOf(tech.requiredLevel) > currentLevelIndex) {
        return false;
      }
    }

    return true;
  },

  startCrafting: async () => {
    const { selectedFrame, selectedSurface, selectedTechniques, canCraft, getTotalCost, getEstimatedScore, level } = get();
    if (!canCraft() || !selectedFrame || !selectedSurface) return;

    const totalCost = getTotalCost();
    const techniques = Object.values(selectedTechniques);

    set({ isCrafting: true, craftProgress: 0, currentCraftStep: 0 });

    const totalSteps = techniques.length + 2;
    let currentStep = 0;

    const stepDuration = 800;

    for (let i = 0; i < 3; i++) {
      await new Promise((resolve) => setTimeout(resolve, stepDuration));
      currentStep++;
      set({ craftProgress: Math.round((currentStep / totalSteps) * 100), currentCraftStep: currentStep });
    }

    for (const tech of techniques) {
      await new Promise((resolve) => setTimeout(resolve, stepDuration * tech.timeCost));
      currentStep++;
      set({ craftProgress: Math.round((currentStep / totalSteps) * 100), currentCraftStep: currentStep });
    }

    for (let i = 0; i < 2; i++) {
      await new Promise((resolve) => setTimeout(resolve, stepDuration));
      currentStep++;
      set({ craftProgress: Math.round((currentStep / totalSteps) * 100), currentCraftStep: currentStep });
    }

    const baseScore = getEstimatedScore();
    const randomFactor = 0.9 + Math.random() * 0.2;
    const finalScore = Math.min(100, Math.round(baseScore * randomFactor));

    const qualityScore = Math.round(finalScore * (0.8 + Math.random() * 0.4));
    const aestheticScore = Math.round(finalScore * (0.7 + Math.random() * 0.5));
    const craftScore = Math.round(finalScore * (0.75 + Math.random() * 0.45));
    const creativityScore = Math.round(finalScore * (0.6 + Math.random() * 0.6));

    const quality = calculateQuality(finalScore);

    const fanNames: Record<CraftQuality, string[]> = {
      basic: ['素面扇', '普通折扇', '家常扇'],
      fine: ['雅致扇', '精工扇', '文玩扇'],
      exquisite: ['珍品扇', '雅玩扇', '名家扇'],
      masterpiece: ['传世宝扇', '极品仙扇', '稀世珍扇'],
    };

    const namePool = fanNames[quality];
    const fanName = namePool[Math.floor(Math.random() * namePool.length)];

    const newFan: CraftedFan = {
      id: generateId(),
      name: fanName,
      frameMaterial: selectedFrame,
      surfaceMaterial: selectedSurface,
      techniques: techniques,
      totalScore: finalScore,
      qualityScore: Math.min(100, qualityScore),
      aestheticScore: Math.min(100, aestheticScore),
      craftScore: Math.min(100, craftScore),
      creativityScore: Math.min(100, creativityScore),
      cost: totalCost,
      craftedAt: new Date().toISOString(),
      quality,
    };

    const expGain = Math.round(finalScore / 5);
    const coinBonus = quality === 'masterpiece' ? 50 : quality === 'exquisite' ? 20 : 0;

    set((state) => {
      const newExp = state.experience + expGain;
      let newLevel = state.level;

      const levelOrder: ApprenticeLevel[] = ['apprentice', 'craftsman', 'master', 'grandmaster'];
      const currentIndex = levelOrder.indexOf(state.level);

      for (let i = currentIndex + 1; i < levelOrder.length; i++) {
        const nextLevel = levelOrder[i];
        if (newExp >= APPRENTICE_LEVELS[nextLevel].expRequired) {
          newLevel = nextLevel;
        } else {
          break;
        }
      }

      return {
        coins: state.coins - totalCost + coinBonus,
        experience: newExp,
        level: newLevel,
        craftedFans: [newFan, ...state.craftedFans],
        isCrafting: false,
        craftProgress: 100,
        showResult: true,
        lastCraftedFan: newFan,
      };
    });
  },

  setShowResult: (show) => {
    set({ showResult: show });
  },

  sellFan: (fanId) => {
    set((state) => {
      const fan = state.craftedFans.find((f) => f.id === fanId);
      if (!fan) return state;

      const sellPrice = Math.round(fan.cost * (0.5 + fan.totalScore / 100));

      return {
        coins: state.coins + sellPrice,
        craftedFans: state.craftedFans.filter((f) => f.id !== fanId),
      };
    });
  },

  addCoins: (amount) => {
    set((state) => ({ coins: state.coins + amount }));
  },

  getLevelProgress: () => {
    const { level, experience } = get();
    const levelOrder: ApprenticeLevel[] = ['apprentice', 'craftsman', 'master', 'grandmaster'];
    const currentIndex = levelOrder.indexOf(level);

    if (currentIndex === levelOrder.length - 1) return 100;

    const currentExpReq = APPRENTICE_LEVELS[level].expRequired;
    const nextLevel = levelOrder[currentIndex + 1];
    const nextExpReq = APPRENTICE_LEVELS[nextLevel].expRequired;

    const progress = ((experience - currentExpReq) / (nextExpReq - currentExpReq)) * 100;
    return Math.min(100, Math.max(0, progress));
  },

  getTechniquesByStep: (step) => {
    return get().craftTechniques.filter((t) => t.step === step);
  },
}));
