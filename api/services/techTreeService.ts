import { techTreeData } from '../data/techTree.js';
import { fans } from '../data/fans.js';
import { historicalFigures } from '../data/figures.js';
import type {
  TechTree,
  TechTreeNode,
  TechTreeBranch,
  TechTreeAchievement,
  TechTreeNodeCategoryInfo,
  Fan,
  HistoricalFigure,
} from '../../shared/types.js';

export function getTechTree(): TechTree {
  return techTreeData;
}

export function getAllNodes(): TechTreeNode[] {
  return techTreeData.nodes;
}

export function getNodeById(id: string): TechTreeNode | undefined {
  return techTreeData.nodes.find(node => node.id === id);
}

export function getNodesByCategory(category: string): TechTreeNode[] {
  return techTreeData.nodes.filter(node => node.category === category);
}

export function getBranches(): TechTreeBranch[] {
  return techTreeData.branches;
}

export function getBranchById(id: string): TechTreeBranch | undefined {
  return techTreeData.branches.find(branch => branch.id === id);
}

export function getAchievements(): TechTreeAchievement[] {
  return techTreeData.achievements || [];
}

export function getAchievementById(id: string): TechTreeAchievement | undefined {
  return techTreeData.achievements?.find(achievement => achievement.id === id);
}

export function getCategories(): TechTreeNodeCategoryInfo[] {
  return techTreeData.categories;
}

export function getStartingNode(): TechTreeNode | undefined {
  return techTreeData.nodes.find(node => node.id === techTreeData.startingNodeId);
}

export function getPrerequisiteNodes(nodeId: string): TechTreeNode[] {
  const node = getNodeById(nodeId);
  if (!node || !node.prerequisiteIds) return [];
  
  return techTreeData.nodes.filter(n => node.prerequisiteIds!.includes(n.id));
}

export function getDependentNodes(nodeId: string): TechTreeNode[] {
  return techTreeData.nodes.filter(n => 
    n.prerequisiteIds && n.prerequisiteIds.includes(nodeId)
  );
}

export function getRelatedFans(nodeId: string): Fan[] {
  const node = getNodeById(nodeId);
  if (!node || !node.relatedFanIds) return [];
  
  return fans.filter(fan => node.relatedFanIds!.includes(fan.id));
}

export function getRelatedFigures(nodeId: string): HistoricalFigure[] {
  const node = getNodeById(nodeId);
  if (!node || !node.relatedFigureIds) return [];
  
  return historicalFigures.filter(figure => node.relatedFigureIds!.includes(figure.id));
}

export function getNodeDetail(nodeId: string): {
  node: TechTreeNode;
  prerequisites: TechTreeNode[];
  dependents: TechTreeNode[];
  relatedFans: Fan[];
  relatedFigures: HistoricalFigure[];
} | null {
  const node = getNodeById(nodeId);
  if (!node) return null;
  
  return {
    node,
    prerequisites: getPrerequisiteNodes(nodeId),
    dependents: getDependentNodes(nodeId),
    relatedFans: getRelatedFans(nodeId),
    relatedFigures: getRelatedFigures(nodeId),
  };
}

export function getNodesByEra(era: string): TechTreeNode[] {
  return techTreeData.nodes.filter(node => node.era === era);
}

export function getNodesByDifficulty(difficulty: number): TechTreeNode[] {
  return techTreeData.nodes.filter(node => node.difficulty === difficulty);
}

export function getTechTreeStats(): {
  totalNodes: number;
  totalBranches: number;
  totalAchievements: number;
  totalCategories: number;
  earliestYear: number;
  latestYear: number;
  totalRewardPoints: number;
} {
  const nodes = techTreeData.nodes;
  const years = nodes.map(n => n.yearNumeric).filter(y => y !== undefined);
  
  return {
    totalNodes: nodes.length,
    totalBranches: techTreeData.branches.length,
    totalAchievements: techTreeData.achievements?.length || 0,
    totalCategories: techTreeData.categories.length,
    earliestYear: Math.min(...years),
    latestYear: Math.max(...years),
    totalRewardPoints: nodes.reduce((sum, node) => sum + node.rewardPoints, 0),
  };
}

export function searchNodes(keyword: string): TechTreeNode[] {
  const lowerKeyword = keyword.toLowerCase();
  return techTreeData.nodes.filter(node =>
    node.name.toLowerCase().includes(lowerKeyword) ||
    node.description.toLowerCase().includes(lowerKeyword) ||
    node.era.toLowerCase().includes(lowerKeyword) ||
    node.categoryName.toLowerCase().includes(lowerKeyword) ||
    node.historicalBackground.toLowerCase().includes(lowerKeyword) ||
    node.culturalSignificance.toLowerCase().includes(lowerKeyword)
  );
}
