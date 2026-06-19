import { create } from 'zustand';
import { useWorkshopStore } from './useWorkshopStore';
import type {
  RepairCommission,
  RepairTechnique,
  RepairStep,
  DamageInfo,
  Fan,
  ApprenticeLevel,
  DamageType,
} from '@/types/fan';
import { DAMAGE_TYPES, REPAIR_TECHNIQUES, APPRENTICE_LEVELS } from '@/types/fan';
import { mockFans as fans } from '@/data/mockFans';

function generateId(): string {
  return `commission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateDamage(severity: number, existingTypes: DamageType[]): DamageInfo | null {
  const allTypes: DamageType[] = ['torn_surface', 'broken_frame', 'faded_calligraphy', 'loose_rivets', 'stained_surface', 'missing_tassel'];
  const availableTypes = allTypes.filter(t => !existingTypes.includes(t));
  
  if (availableTypes.length === 0) return null;
  
  const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
  const baseInfo = DAMAGE_TYPES[type];
  
  return {
    ...baseInfo,
    severity,
    repairCost: Math.round(severity * 0.3 + Math.random() * 5),
  };
}

function generateMockCommissions(): RepairCommission[] {
  const selectedFans = fans.slice(0, 8);
  const commissions: RepairCommission[] = [];
  
  selectedFans.forEach((fan, index) => {
    const damageCount = Math.floor(Math.random() * 3) + 1;
    const damages: DamageInfo[] = [];
    const existingTypes: DamageType[] = [];
    
    for (let i = 0; i < damageCount; i++) {
      const severity = Math.floor(Math.random() * 50) + 30;
      const damage = generateDamage(severity, existingTypes);
      if (damage) {
        damages.push(damage);
        existingTypes.push(damage.type);
      }
    }
    
    const totalDamage = damages.reduce((sum, d) => sum + d.severity, 0);
    const baseReward = totalDamage * 2 + fan.materials.length * 30;
    
    const requiredLevel: ApprenticeLevel = totalDamage > 120 ? 'master' : totalDamage > 80 ? 'craftsman' : 'apprentice';
    
    commissions.push({
      id: generateId(),
      fanId: fan.id,
      fanName: fan.name,
      fanImage: fan.image,
      dynasty: fan.dynasty,
      origin: fan.origin,
      description: `这是一柄${fan.dynasty}时期的${fan.categoryName}，因年代久远${damages.map(d => d.name).join('、')}，诚邀技艺精湛的匠人修复此扇，重现往日光彩。`,
      damages,
      reward: Math.round(baseReward * (requiredLevel === 'master' ? 2 : requiredLevel === 'craftsman' ? 1.5 : 1)),
      expReward: Math.round(totalDamage / 3),
      status: index < 2 ? 'in_progress' : 'pending',
      currentStep: 0,
      repairProgress: 0,
      selectedTechniques: {},
    });
  });
  
  return commissions;
}

function calculateQuality(score: number): string {
  if (score >= 90) return '完美修复';
  if (score >= 75) return '精良修复';
  if (score >= 55) return '合格修复';
  return '基础修复';
}

interface RepairState {
  commissions: RepairCommission[];
  restoredFans: { commission: RepairCommission; fan: Fan; restoredAt: string }[];
  activeCommission: RepairCommission | null;
  isRepairing: boolean;
  repairProgress: number;
  currentRepairStep: number;
  showRepairResult: boolean;
  lastRepairedCommission: RepairCommission | null;
  repairTechniques: RepairTechnique[];

  selectCommission: (commission: RepairCommission) => void;
  clearActiveCommission: () => void;
  selectTechnique: (technique: RepairTechnique) => void;
  clearTechnique: (step: string) => void;

  getTotalRepairCost: () => number;
  getEstimatedQuality: () => number;
  canStartRepair: () => boolean;

  startRepair: () => Promise<void>;
  deliverCommission: (commissionId: string) => void;
  refreshCommissions: () => void;
  setShowRepairResult: (show: boolean) => void;

  getTechniquesByStep: (step: RepairStep) => RepairTechnique[];
  getRequiredTechniques: () => RepairStep[];
}

export const useRepairStore = create<RepairState>((set, get) => ({
  commissions: generateMockCommissions(),
  restoredFans: [],
  activeCommission: null,
  isRepairing: false,
  repairProgress: 0,
  currentRepairStep: 0,
  showRepairResult: false,
  lastRepairedCommission: null,
  repairTechniques: REPAIR_TECHNIQUES,

  selectCommission: (commission) => {
    const existingInProgress = get().commissions.find(c => c.status === 'in_progress' && c.id !== commission.id);
    if (existingInProgress) {
      set((state) => ({
        commissions: state.commissions.map(c => 
          c.id === existingInProgress.id 
            ? { ...c, status: 'pending' as const, currentStep: 0, repairProgress: 0, selectedTechniques: {} }
            : c
        ),
      }));
    }
    
    set({
      activeCommission: { ...commission, status: 'in_progress', startedAt: new Date().toISOString() },
    });
    
    set((state) => ({
      commissions: state.commissions.map(c => 
        c.id === commission.id 
          ? { ...c, status: 'in_progress' as const, startedAt: new Date().toISOString() }
          : c
      ),
    }));
  },

  clearActiveCommission: () => {
    const { activeCommission } = get();
    if (activeCommission) {
      set((state) => ({
        commissions: state.commissions.map(c => 
          c.id === activeCommission.id 
            ? { ...c, status: 'pending' as const, currentStep: 0, repairProgress: 0, selectedTechniques: {} }
            : c
        ),
      }));
    }
    set({ activeCommission: null });
  },

  selectTechnique: (technique) => {
    const { activeCommission } = get();
    if (!activeCommission) return;
    
    const updatedCommission = {
      ...activeCommission,
      selectedTechniques: {
        ...activeCommission.selectedTechniques,
        [technique.step]: technique,
      },
    };
    
    set({ activeCommission: updatedCommission });
    set((state) => ({
      commissions: state.commissions.map(c => 
        c.id === activeCommission.id ? updatedCommission : c
      ),
    }));
  },

  clearTechnique: (step) => {
    const { activeCommission } = get();
    if (!activeCommission) return;
    
    const newTechniques = { ...activeCommission.selectedTechniques };
    delete newTechniques[step];
    
    const updatedCommission = {
      ...activeCommission,
      selectedTechniques: newTechniques,
    };
    
    set({ activeCommission: updatedCommission });
    set((state) => ({
      commissions: state.commissions.map(c => 
        c.id === activeCommission.id ? updatedCommission : c
      ),
    }));
  },

  getTotalRepairCost: () => {
    const { activeCommission } = get();
    if (!activeCommission) return 0;
    
    const baseCost = activeCommission.damages.reduce((sum, d) => sum + d.repairCost, 0);
    let multiplier = 1;
    
    Object.values(activeCommission.selectedTechniques).forEach((tech) => {
      multiplier *= tech.costMultiplier;
    });
    
    return Math.round(baseCost * multiplier);
  },

  getEstimatedQuality: () => {
    const { activeCommission } = get();
    if (!activeCommission) return 0;
    
    const totalDamage = activeCommission.damages.reduce((sum, d) => sum + d.severity, 0);
    const baseScore = 100 - totalDamage / activeCommission.damages.length;
    
    let techniqueBonus = 0;
    Object.values(activeCommission.selectedTechniques).forEach((tech) => {
      techniqueBonus += tech.qualityBonus;
    });
    
    const levelBonus = {
      apprentice: 0,
      craftsman: 5,
      master: 15,
      grandmaster: 25,
    }[activeCommission.status === 'in_progress' ? 'apprentice' : 'apprentice'];
    
    return Math.min(100, Math.round(baseScore + techniqueBonus + levelBonus));
  },

  canStartRepair: () => {
    const { activeCommission, getTotalRepairCost } = get();
    if (!activeCommission) return false;
    
    const requiredSteps = get().getRequiredTechniques();
    const selectedCount = Object.keys(activeCommission.selectedTechniques).length;
    
    if (selectedCount !== requiredSteps.length) return false;
    
    const coins = useWorkshopStore.getState().coins;
    if (getTotalRepairCost() > coins) return false;
    
    return true;
  },

  startRepair: async () => {
    const { activeCommission, canStartRepair, getTotalRepairCost, getEstimatedQuality, getRequiredTechniques } = get();
    if (!canStartRepair() || !activeCommission) return;
    
    const totalCost = getTotalRepairCost();
    const techniques = Object.values(activeCommission.selectedTechniques);
    const workshopState = useWorkshopStore.getState();
    
    workshopState.addCoins(-totalCost);
    
    set({ isRepairing: true, repairProgress: 0, currentRepairStep: 0 });
    
    const requiredSteps = getRequiredTechniques();
    const totalSteps = requiredSteps.length;
    let currentStep = 0;
    
    const stepDuration = 1000;
    
    for (let i = 0; i < 2; i++) {
      await new Promise((resolve) => setTimeout(resolve, stepDuration / 2));
      currentStep++;
      set({ 
        repairProgress: Math.round((currentStep / (totalSteps + 2)) * 100), 
        currentRepairStep: currentStep 
      });
    }
    
    for (let i = 0; i < requiredSteps.length; i++) {
      const stepKey = requiredSteps[i];
      const tech = techniques.find(t => t.step === stepKey);
      const timeCost = tech ? tech.timeCost : 1;
      
      set((state) => ({
        activeCommission: state.activeCommission 
          ? { ...state.activeCommission, currentStep: i + 1, repairProgress: Math.round(((currentStep + 1) / (totalSteps + 2)) * 100) }
          : null,
        commissions: state.commissions.map(c => 
          c.id === activeCommission.id 
            ? { ...c, currentStep: i + 1, repairProgress: Math.round(((currentStep + 1) / (totalSteps + 2)) * 100) }
            : c
        ),
      }));
      
      await new Promise((resolve) => setTimeout(resolve, stepDuration * timeCost));
      currentStep++;
      set({ 
        repairProgress: Math.round((currentStep / (totalSteps + 2)) * 100), 
        currentRepairStep: currentStep 
      });
    }
    
    for (let i = 0; i < 2; i++) {
      await new Promise((resolve) => setTimeout(resolve, stepDuration / 2));
      currentStep++;
      set({ 
        repairProgress: Math.round((currentStep / (totalSteps + 2)) * 100), 
        currentRepairStep: currentStep 
      });
    }
    
    const baseQuality = getEstimatedQuality();
    const randomFactor = 0.85 + Math.random() * 0.25;
    const finalQuality = Math.min(100, Math.round(baseQuality * randomFactor));
    
    calculateQuality(finalQuality);
    
    const fanData = fans.find(f => f.id === activeCommission.fanId);
    
    const updatedCommission: RepairCommission = {
      ...activeCommission,
      status: 'completed',
      repairProgress: 100,
      finalQuality,
      completedAt: new Date().toISOString(),
      unlockedArchive: fanData,
    };
    
    const expGain = activeCommission.expReward + Math.round(finalQuality / 10);
    const coinBonus = finalQuality >= 90 ? 50 : finalQuality >= 75 ? 20 : 0;
    
    workshopState.addCoins(coinBonus);
    workshopState.addCoins(activeCommission.reward);
    
    const currentExp = workshopState.experience + expGain;
    let newLevel = workshopState.level;
    const levelOrder: ApprenticeLevel[] = ['apprentice', 'craftsman', 'master', 'grandmaster'];
    const currentIndex = levelOrder.indexOf(workshopState.level);
    
    for (let i = currentIndex + 1; i < levelOrder.length; i++) {
      const nextLevel = levelOrder[i];
      if (currentExp >= APPRENTICE_LEVELS[nextLevel].expRequired) {
        newLevel = nextLevel;
      } else {
        break;
      }
    }
    
    if (newLevel !== workshopState.level) {
      useWorkshopStore.setState({ level: newLevel, experience: currentExp });
    } else {
      useWorkshopStore.setState({ experience: currentExp });
    }
    
    if (fanData) {
      set((state) => ({
        restoredFans: [
          { commission: updatedCommission, fan: fanData, restoredAt: new Date().toISOString() },
          ...state.restoredFans,
        ],
      }));
    }
    
    set((state) => ({
      commissions: state.commissions.map(c => 
        c.id === activeCommission.id ? updatedCommission : c
      ),
      activeCommission: updatedCommission,
      isRepairing: false,
      repairProgress: 100,
      showRepairResult: true,
      lastRepairedCommission: updatedCommission,
    }));
  },

  deliverCommission: (commissionId) => {
    set((state) => ({
      commissions: state.commissions.map(c => 
        c.id === commissionId ? { ...c, status: 'delivered' as const } : c
      ),
    }));
  },

  refreshCommissions: () => {
    const newCommissions = generateMockCommissions();
    const existingIds = get().commissions.map(c => c.fanId);
    const filteredNew = newCommissions.filter(c => !existingIds.includes(c.fanId));
    
    set((state) => ({
      commissions: [...state.commissions.filter(c => c.status !== 'delivered'), ...filteredNew.slice(0, 3)],
    }));
  },

  setShowRepairResult: (show) => {
    set({ showRepairResult: show });
  },

  getTechniquesByStep: (step) => {
    return get().repairTechniques.filter((t) => t.step === step);
  },

  getRequiredTechniques: () => {
    const { activeCommission } = get();
    if (!activeCommission) return [];
    
    const requiredSteps: RepairStep[] = ['assessment'];
    
    activeCommission.damages.forEach(damage => {
      switch (damage.type) {
        case 'torn_surface':
        case 'broken_frame':
        case 'loose_rivets':
        case 'missing_tassel':
          if (!requiredSteps.includes('mending')) requiredSteps.push('mending');
          break;
        case 'stained_surface':
          if (!requiredSteps.includes('cleaning')) requiredSteps.push('cleaning');
          break;
        case 'faded_calligraphy':
          if (!requiredSteps.includes('restoration')) requiredSteps.push('restoration');
          break;
      }
    });
    
    if (activeCommission.damages.some(d => d.severity > 60) && !requiredSteps.includes('cleaning')) {
      requiredSteps.push('cleaning');
    }
    
    if (!requiredSteps.includes('polishing')) requiredSteps.push('polishing');
    if (!requiredSteps.includes('final_check')) requiredSteps.push('final_check');
    
    return requiredSteps.sort((a, b) => {
      const order: RepairStep[] = ['assessment', 'cleaning', 'mending', 'restoration', 'polishing', 'final_check'];
      return order.indexOf(a) - order.indexOf(b);
    });
  },
}));
