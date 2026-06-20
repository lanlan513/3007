import { Router, type Request, type Response } from 'express';
import {
  getAllFigures,
  getFigure,
  getRelated,
  getFilterOptions,
  updateFigureTask,
  updateFigureEvent,
  updateCollectionGoal,
  unlockFigure,
  createFigure,
  updateFigure,
  deleteFigure,
  addFanStory,
  addRelation,
} from '../services/figureService.js';
import type {
  FigureFilters,
  UpdateFigureTaskPayload,
  UpdateEventPayload,
  CreateFigurePayload,
  UpdateFigurePayload,
  HistoricalFigure,
} from '../../shared/types.js';

const router = Router();

router.get('/', (req: Request, res: Response): void => {
  const { dynasty, status, tag } = req.query;

  try {
    const filters: FigureFilters = {
      dynasty: dynasty as string | undefined,
      status: status as FigureFilters['status'],
      tag: tag as string | undefined,
    };

    const figures = getAllFigures(filters);

    res.json({
      success: true,
      data: figures,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch historical figures',
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
  } catch {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch filter options',
    });
  }
});

router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;

  try {
    const figure = getFigure(id);

    if (!figure) {
      res.status(404).json({
        success: false,
        error: 'Historical figure not found',
      });
      return;
    }

    const relatedFigures = getRelated(id);

    res.json({
      success: true,
      data: {
        figure,
        relatedFigures,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch figure detail',
    });
  }
});

router.get('/:id/related', (req: Request, res: Response): void => {
  const { id } = req.params;

  try {
    const relatedFigures = getRelated(id);

    res.json({
      success: true,
      data: relatedFigures,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch related figures',
    });
  }
});

router.post('/:id/unlock', (req: Request, res: Response): void => {
  const { id } = req.params;

  try {
    const figure = unlockFigure(id);

    if (!figure) {
      res.status(404).json({
        success: false,
        error: 'Historical figure not found',
      });
      return;
    }

    res.json({
      success: true,
      data: figure,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Failed to unlock figure',
    });
  }
});

router.post('/tasks', (req: Request, res: Response): void => {
  try {
    const payload = req.body as UpdateFigureTaskPayload;
    const figure = updateFigureTask(payload);

    if (!figure) {
      res.status(404).json({
        success: false,
        error: 'Historical figure not found',
      });
      return;
    }

    res.json({
      success: true,
      data: figure,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Failed to update task',
    });
  }
});

router.post('/events', (req: Request, res: Response): void => {
  try {
    const payload = req.body as UpdateEventPayload;
    const figure = updateFigureEvent(payload);

    if (!figure) {
      res.status(404).json({
        success: false,
        error: 'Historical figure not found',
      });
      return;
    }

    res.json({
      success: true,
      data: figure,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Failed to update event',
    });
  }
});

router.post('/:figureId/goals/:goalId', (req: Request, res: Response): void => {
  const { figureId, goalId } = req.params;
  const { currentCount } = req.body as { currentCount: number };

  try {
    const figure = updateCollectionGoal(figureId, goalId, currentCount);

    if (!figure) {
      res.status(404).json({
        success: false,
        error: 'Historical figure or goal not found',
      });
      return;
    }

    res.json({
      success: true,
      data: figure,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Failed to update collection goal',
    });
  }
});

router.post('/', (req: Request, res: Response): void => {
  try {
    const payload = req.body as CreateFigurePayload;
    const newFigure = createFigure(payload);

    res.status(201).json({
      success: true,
      data: newFigure,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Failed to create historical figure',
    });
  }
});

router.put('/', (req: Request, res: Response): void => {
  try {
    const payload = req.body as UpdateFigurePayload;
    const updatedFigure = updateFigure(payload);

    if (!updatedFigure) {
      res.status(404).json({
        success: false,
        error: 'Historical figure not found',
      });
      return;
    }

    res.json({
      success: true,
      data: updatedFigure,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Failed to update historical figure',
    });
  }
});

router.delete('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;

  try {
    const deleted = deleteFigure(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Historical figure not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Historical figure deleted successfully',
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Failed to delete historical figure',
    });
  }
});

router.post('/:id/stories', (req: Request, res: Response): void => {
  const { id } = req.params;

  try {
    const story = req.body as HistoricalFigure['fanStories'][number];
    const figure = addFanStory(id, story);

    if (!figure) {
      res.status(404).json({
        success: false,
        error: 'Historical figure not found',
      });
      return;
    }

    res.json({
      success: true,
      data: figure,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Failed to add fan story',
    });
  }
});

router.post('/:id/relations', (req: Request, res: Response): void => {
  const { id } = req.params;

  try {
    const relation = req.body as HistoricalFigure['relations'][number];
    const figure = addRelation(id, relation);

    if (!figure) {
      res.status(404).json({
        success: false,
        error: 'Historical figure not found',
      });
      return;
    }

    res.json({
      success: true,
      data: figure,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Failed to add relation',
    });
  }
});

export default router;
