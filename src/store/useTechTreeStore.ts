import { create } from 'zustand';
import type {
  TechTreeNode,
  UserTechTreeProgress,
  UserCognitionMap,
  CognitionMapNode,
  CognitionMapStyle,
  TechTreeAchievement,
} from '../../shared/types';
import { techTreeData, defaultUserProgress, allAchievements } from '@/data/techTreeData';
import { mockFans } from '@/data/mockFans';
import { historicalFigures } from '@/data/historicalFigures';

interface TechTreeState {
  techTree: typeof techTreeData;
  userProgress: UserTechTreeProgress;
  cognitionMap: UserCognitionMap;
  selectedNodeId: string | null;
  selectedNodeDetail: TechTreeNode | null;
  isModalOpen: boolean;
  loading: boolean;
  error: string | null;
  filterCategory: string | null;

  init: () => void;
  selectNode: (nodeId: string) => void;
  unlockNode: (nodeId: string, notes?: string) => void;
  completeNode: (nodeId: string) => void;
  closeModal: () => void;
  openModal: (nodeId: string) => void;
  setFilterCategory: (category: string | null) => void;
  addExplorationNote: (nodeId: string, notes: string) => void;
  updateCognitionMapStyle: (style: CognitionMapStyle) => void;
  updateCognitionMapMetadata: (title?: string, description?: string) => void;
  generateCognitionMapInsights: () => void;
  resetProgress: () => void;
  getNodeStatus: (nodeId: string) => 'locked' | 'unlocked' | 'completed';
  canUnlockNode: (nodeId: string) => boolean;
  getRelatedFans: (nodeId: string) => typeof mockFans;
  getRelatedFigures: (nodeId: string) => typeof historicalFigures;
  checkAchievements: () => void;
  getExploredPercentage: () => number;
}

const STORAGE_KEY = 'fan-tech-tree-progress';
const COGNITION_KEY = 'fan-cognition-map';

const loadProgress = (): UserTechTreeProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load progress:', e);
  }
  return { ...defaultUserProgress };
};

const saveProgress = (progress: UserTechTreeProgress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
};

const loadCognitionMap = (): UserCognitionMap => {
  try {
    const saved = localStorage.getItem(COGNITION_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load cognition map:', e);
  }
  return {
    userId: 'guest',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    nodes: [],
    style: 'tree',
    title: '我的扇文化认知地图',
    description: '探索扇文化五千年的演化历程，记录属于你的独特认知轨迹',
    insights: [],
    exploredPercentage: 0,
  };
};

const saveCognitionMap = (map: UserCognitionMap) => {
  try {
    localStorage.setItem(COGNITION_KEY, JSON.stringify(map));
  } catch (e) {
    console.error('Failed to save cognition map:', e);
  }
};

export const useTechTreeStore = create<TechTreeState>((set, get) => ({
  techTree: techTreeData,
  userProgress: loadProgress(),
  cognitionMap: loadCognitionMap(),
  selectedNodeId: null,
  selectedNodeDetail: null,
  isModalOpen: false,
  loading: false,
  error: null,
  filterCategory: null,

  init: () => {
    const progress = loadProgress();
    const cognitionMap = loadCognitionMap();
    set({ userProgress: progress, cognitionMap });
    get().checkAchievements();
  },

  selectNode: (nodeId: string) => {
    const node = get().techTree.nodes.find(n => n.id === nodeId);
    set({ selectedNodeId: nodeId, selectedNodeDetail: node || null });
  },

  unlockNode: (nodeId: string, notes?: string) => {
    const { userProgress, cognitionMap, techTree } = get();
    
    if (userProgress.unlockedNodeIds.includes(nodeId)) return;
    if (!get().canUnlockNode(nodeId)) return;

    const node = techTree.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const newUnlockedIds = [...userProgress.unlockedNodeIds, nodeId];
    const newPoints = userProgress.totalPoints + node.rewardPoints;

    const newProgress: UserTechTreeProgress = {
      ...userProgress,
      unlockedNodeIds: newUnlockedIds,
      totalPoints: newPoints,
      lastVisitedAt: Date.now(),
      explorationNotes: notes ? { ...userProgress.explorationNotes, [nodeId]: notes } : userProgress.explorationNotes,
    };

    const existingCognitionNode = cognitionMap.nodes.find(n => n.nodeId === nodeId);
    let newCognitionNodes: CognitionMapNode[];
    
    if (existingCognitionNode) {
      newCognitionNodes = cognitionMap.nodes.map(n =>
        n.nodeId === nodeId ? { ...n, exploredAt: Date.now(), notes: notes || n.notes } : n
      );
    } else {
      const depth = node.position.layer;
      const connections = [...node.prerequisiteIds];
      
      techTree.nodes.forEach(n => {
        if (n.prerequisiteIds.includes(nodeId)) {
          connections.push(n.id);
        }
      });

      const newNode: CognitionMapNode = {
        nodeId,
        exploredAt: Date.now(),
        notes,
        connections,
        depth,
      };
      newCognitionNodes = [...cognitionMap.nodes, newNode];
    }

    const exploredPercentage = Math.round((newUnlockedIds.length / techTree.nodes.length) * 100);
    
    const newCognitionMap: UserCognitionMap = {
      ...cognitionMap,
      nodes: newCognitionNodes,
      updatedAt: Date.now(),
      exploredPercentage,
    };

    set({
      userProgress: newProgress,
      cognitionMap: newCognitionMap,
    });

    saveProgress(newProgress);
    saveCognitionMap(newCognitionMap);

    get().checkAchievements();
  },

  completeNode: (nodeId: string) => {
    const { userProgress } = get();
    
    if (userProgress.completedNodeIds.includes(nodeId)) return;

    const newCompletedIds = [...userProgress.completedNodeIds, nodeId];
    const newProgress: UserTechTreeProgress = {
      ...userProgress,
      completedNodeIds: newCompletedIds,
      lastVisitedAt: Date.now(),
    };

    set({ userProgress: newProgress });
    saveProgress(newProgress);
    get().checkAchievements();
  },

  closeModal: () => {
    set({ isModalOpen: false, selectedNodeId: null, selectedNodeDetail: null });
  },

  openModal: (nodeId: string) => {
    const node = get().techTree.nodes.find(n => n.id === nodeId);
    set({
      isModalOpen: true,
      selectedNodeId: nodeId,
      selectedNodeDetail: node || null,
    });
  },

  setFilterCategory: (category: string | null) => {
    set({ filterCategory: category });
  },

  addExplorationNote: (nodeId: string, notes: string) => {
    const { userProgress, cognitionMap } = get();
    
    const newProgress: UserTechTreeProgress = {
      ...userProgress,
      explorationNotes: { ...userProgress.explorationNotes, [nodeId]: notes },
    };

    const newCognitionMap: UserCognitionMap = {
      ...cognitionMap,
      nodes: cognitionMap.nodes.map(n =>
        n.nodeId === nodeId ? { ...n, notes } : n
      ),
      updatedAt: Date.now(),
    };

    set({
      userProgress: newProgress,
      cognitionMap: newCognitionMap,
    });

    saveProgress(newProgress);
    saveCognitionMap(newCognitionMap);
  },

  updateCognitionMapStyle: (style: CognitionMapStyle) => {
    const { cognitionMap } = get();
    const newMap = { ...cognitionMap, style, updatedAt: Date.now() };
    set({ cognitionMap: newMap });
    saveCognitionMap(newMap);
  },

  updateCognitionMapMetadata: (title?: string, description?: string) => {
    const { cognitionMap } = get();
    const newMap = {
      ...cognitionMap,
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      updatedAt: Date.now(),
    };
    set({ cognitionMap: newMap });
    saveCognitionMap(newMap);
  },

  generateCognitionMapInsights: () => {
    const { cognitionMap, techTree, userProgress } = get();
    const insights: string[] = [];

    const totalNodes = techTree.nodes.length;
    const exploredNodes = cognitionMap.nodes.length;
    const percentage = Math.round((exploredNodes / totalNodes) * 100);

    insights.push(`你已探索 ${exploredNodes}/${totalNodes} 个扇文化节点，完成度 ${percentage}%`);

    if (exploredNodes >= totalNodes * 0.3) {
      insights.push('你已具备初步的扇文化知识体系，继续探索将解锁更多深度内容');
    }

    const categoryStats: Record<string, number> = {};
    cognitionMap.nodes.forEach(cn => {
      const node = techTree.nodes.find(n => n.id === cn.nodeId);
      if (node) {
        categoryStats[node.category] = (categoryStats[node.category] || 0) + 1;
      }
    });

    const maxCategory = Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0];
    if (maxCategory) {
      const categoryInfo = techTree.categories.find(c => c.value === maxCategory[0]);
      if (categoryInfo) {
        insights.push(`你最感兴趣的是${categoryInfo.label}领域，共探索了 ${maxCategory[1]} 个相关节点`);
      }
    }

    const avgDepth = cognitionMap.nodes.reduce((sum, n) => sum + n.depth, 0) / Math.max(1, cognitionMap.nodes.length);
    if (avgDepth > 2) {
      insights.push('你的探索具有相当的深度，展现了对扇文化的深入理解');
    }

    if (userProgress.totalPoints > 500) {
      insights.push(`你的探索积分已达 ${userProgress.totalPoints} 分，堪称扇文化达人！`);
    }

    const unlockedAchievements = userProgress.achievements.filter(a => a.unlocked).length;
    insights.push(`你已解锁 ${unlockedAchievements}/${userProgress.achievements.length} 个成就`);

    const newMap = { ...cognitionMap, insights, updatedAt: Date.now() };
    set({ cognitionMap: newMap });
    saveCognitionMap(newMap);
  },

  resetProgress: () => {
    const newProgress = { ...defaultUserProgress };
    const newCognitionMap: UserCognitionMap = {
      userId: 'guest',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      nodes: [],
      style: 'tree',
      title: '我的扇文化认知地图',
      description: '探索扇文化五千年的演化历程，记录属于你的独特认知轨迹',
      insights: [],
      exploredPercentage: 0,
    };
    set({
      userProgress: newProgress,
      cognitionMap: newCognitionMap,
      selectedNodeId: null,
      selectedNodeDetail: null,
      isModalOpen: false,
    });
    saveProgress(newProgress);
    saveCognitionMap(newCognitionMap);
  },

  getNodeStatus: (nodeId: string) => {
    const { userProgress } = get();
    if (userProgress.completedNodeIds.includes(nodeId)) return 'completed';
    if (userProgress.unlockedNodeIds.includes(nodeId)) return 'unlocked';
    return 'locked';
  },

  canUnlockNode: (nodeId: string) => {
    const { userProgress, techTree } = get();
    const node = techTree.nodes.find(n => n.id === nodeId);
    if (!node) return false;
    if (node.prerequisiteIds.length === 0) return true;
    return node.prerequisiteIds.some(preId => userProgress.unlockedNodeIds.includes(preId));
  },

  getRelatedFans: (nodeId: string) => {
    const node = get().techTree.nodes.find(n => n.id === nodeId);
    if (!node || !node.relatedFanIds) return [];
    return mockFans.filter(f => node.relatedFanIds?.includes(f.id));
  },

  getRelatedFigures: (nodeId: string) => {
    const node = get().techTree.nodes.find(n => n.id === nodeId);
    if (!node || !node.relatedFigureIds) return [];
    return historicalFigures.filter(f => node.relatedFigureIds?.includes(f.id));
  },

  checkAchievements: () => {
    const { userProgress, techTree } = get();
    const newAchievements: TechTreeAchievement[] = [];

    allAchievements.forEach(achievementDef => {
      const existing = userProgress.achievements.find(a => a.id === achievementDef.id);
      
      let unlocked = existing?.unlocked || false;

      if (!unlocked) {
        if (achievementDef.relatedNodeIds.length > 0) {
          unlocked = achievementDef.relatedNodeIds.every(nodeId =>
            userProgress.unlockedNodeIds.includes(nodeId)
          );
        } else {
          switch (achievementDef.id) {
            case 'achievement-12':
              unlocked = userProgress.unlockedNodeIds.length === techTree.nodes.length;
              break;
            case 'achievement-13':
              unlocked = ['node-0-1', 'node-0-2', 'node-0-3', 'node-1-1', 'node-1-2', 'node-2-1', 'node-2-2', 'node-2-3', 'node-2-4', 'node-2-5']
                .every(id => userProgress.unlockedNodeIds.includes(id));
              break;
            case 'achievement-14':
              unlocked = techTree.nodes.filter(n => n.category === 'round')
                .every(n => userProgress.unlockedNodeIds.includes(n.id));
              break;
            case 'achievement-15':
              unlocked = techTree.nodes.filter(n => n.category === 'folding')
                .every(n => userProgress.unlockedNodeIds.includes(n.id));
              break;
          }
        }
      }

      newAchievements.push({
        ...achievementDef,
        unlocked,
        unlockedAt: unlocked ? (existing?.unlockedAt || Date.now()) : undefined,
      });
    });

    const newProgress: UserTechTreeProgress = {
      ...userProgress,
      achievements: newAchievements,
    };

    set({ userProgress: newProgress });
    saveProgress(newProgress);
  },

  getExploredPercentage: () => {
    const { userProgress, techTree } = get();
    return Math.round((userProgress.unlockedNodeIds.length / techTree.nodes.length) * 100);
  },
}));
