import { Router, type Request, type Response } from 'express';
import {
  getAllFans,
  getFanById,
  getCategories,
  getRelatedFans,
} from '../services/fanService.js';

const router = Router();

router.get('/', (req: Request, res: Response): void => {
  const { category, keyword } = req.query;

  try {
    const fans = getAllFans(
      category as string | undefined,
      keyword as string | undefined
    );

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
