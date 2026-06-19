import { Router, type Request, type Response } from 'express';
import {
  getAllFans,
  getFanById,
  getCategories,
  getRelatedFans,
  getFilterOptions,
} from '../services/fanService.js';
import type { FanFilters } from '../../shared/types.js';

const router = Router();

router.get('/', (req: Request, res: Response): void => {
  const { category, keyword, dynasty, material, usage } = req.query;

  try {
    const filters: FanFilters = {
      category: category as string | undefined,
      keyword: keyword as string | undefined,
      dynasty: dynasty as string | undefined,
      material: material as string | undefined,
      usage: usage as string | undefined,
    };

    const fans = getAllFans(filters);

    res.json({
      success: true,
      data: fans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fans',
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

router.get('/filter-options', (_req: Request, res: Response): void => {
  try {
    const options = getFilterOptions();

    res.json({
      success: true,
      data: options,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch filter options',
    });
  }
});

router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;

  try {
    const fan = getFanById(id);

    if (!fan) {
      res.status(404).json({
        success: false,
        error: 'Fan not found',
      });
      return;
    }

    const relatedFans = getRelatedFans(id, 3);

    res.json({
      success: true,
      data: {
        fan,
        relatedFans,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fan detail',
    });
  }
});

export default router;
