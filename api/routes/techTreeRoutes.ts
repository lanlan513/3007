import { Router, type Request, type Response } from 'express';
import {
  getTechTree,
  getAllNodes,
  getNodeById,
  getNodesByCategory,
  getBranches,
  getBranchById,
  getAchievements,
  getAchievementById,
  getCategories,
  getStartingNode,
  getNodeDetail,
  getTechTreeStats,
  searchNodes,
} from '../services/techTreeService.js';
import type { TechTreeNode } from '../../shared/types.js';

const router = Router();

router.get('/', (_req: Request, res: Response): void => {
  try {
    const techTree = getTechTree();
    res.json({
      success: true,
      data: techTree,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tech tree',
    });
  }
});

router.get('/stats', (_req: Request, res: Response): void => {
  try {
    const stats = getTechTreeStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tech tree stats',
    });
  }
});

router.get('/nodes', (req: Request, res: Response): void => {
  const { category, era, difficulty, keyword } = req.query;

  try {
    let nodes: TechTreeNode[];

    if (keyword) {
      nodes = searchNodes(keyword as string);
    } else if (category) {
      nodes = getNodesByCategory(category as string);
    } else if (era) {
      const { getNodesByEra } = require('../services/techTreeService.js');
      nodes = getNodesByEra(era as string);
    } else if (difficulty) {
      const { getNodesByDifficulty } = require('../services/techTreeService.js');
      nodes = getNodesByDifficulty(parseInt(difficulty as string));
    } else {
      nodes = getAllNodes();
    }

    res.json({
      success: true,
      data: nodes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch nodes',
    });
  }
});

router.get('/nodes/starting', (_req: Request, res: Response): void => {
  try {
    const node = getStartingNode();
    
    if (!node) {
      res.status(404).json({
        success: false,
        error: 'Starting node not found',
      });
      return;
    }

    res.json({
      success: true,
      data: node,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch starting node',
    });
  }
});

router.get('/nodes/:id', (req: Request, res: Response): void => {
  const { id } = req.params;

  try {
    const detail = getNodeDetail(id);

    if (!detail) {
      res.status(404).json({
        success: false,
        error: 'Node not found',
      });
      return;
    }

    res.json({
      success: true,
      data: detail,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch node detail',
    });
  }
});

router.get('/categories', (_req: Request, res: Response): void => {
  try {
    const categories = getCategories();
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
    });
  }
});

router.get('/branches', (_req: Request, res: Response): void => {
  try {
    const branches = getBranches();
    res.json({
      success: true,
      data: branches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch branches',
    });
  }
});

router.get('/branches/:id', (req: Request, res: Response): void => {
  const { id } = req.params;

  try {
    const branch = getBranchById(id);

    if (!branch) {
      res.status(404).json({
        success: false,
        error: 'Branch not found',
      });
      return;
    }

    res.json({
      success: true,
      data: branch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch branch',
    });
  }
});

router.get('/achievements', (_req: Request, res: Response): void => {
  try {
    const achievements = getAchievements();
    res.json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch achievements',
    });
  }
});

router.get('/achievements/:id', (req: Request, res: Response): void => {
  const { id } = req.params;

  try {
    const achievement = getAchievementById(id);

    if (!achievement) {
      res.status(404).json({
        success: false,
        error: 'Achievement not found',
      });
      return;
    }

    res.json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch achievement',
    });
  }
});

router.get('/search', (req: Request, res: Response): void => {
  const { q } = req.query;

  try {
    if (!q) {
      res.status(400).json({
        success: false,
        error: 'Search query parameter "q" is required',
      });
      return;
    }

    const results = searchNodes(q as string);

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search nodes',
    });
  }
});

export default router;
