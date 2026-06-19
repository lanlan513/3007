import { Router, type Request, type Response } from 'express';
import {
  getAllArtworks,
  getArtworkById,
  createArtwork,
  likeArtwork,
  getCommentsByArtworkId,
  addComment,
  getRanking,
  getArtCategories,
} from '../services/galleryService.js';
import type { ArtCategory, CreateArtworkPayload, CreateCommentPayload } from '../../shared/types.js';

const router = Router();

router.get('/', (req: Request, res: Response): void => {
  try {
    const category = req.query.category as ArtCategory | undefined;
    const artworks = getAllArtworks(category);
    res.json({ success: true, data: artworks });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch artworks' });
  }
});

router.get('/categories', (_req: Request, res: Response): void => {
  try {
    const categories = getArtCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch art categories' });
  }
});

router.get('/ranking', (req: Request, res: Response): void => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const ranking = getRanking(limit);
    res.json({ success: true, data: ranking });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch ranking' });
  }
});

router.get('/:id', (req: Request, res: Response): void => {
  try {
    const artwork = getArtworkById(req.params.id);
    if (!artwork) {
      res.status(404).json({ success: false, error: 'Artwork not found' });
      return;
    }
    const artworkComments = getCommentsByArtworkId(req.params.id);
    res.json({ success: true, data: { artwork, comments: artworkComments } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch artwork' });
  }
});

router.post('/', (req: Request, res: Response): void => {
  try {
    const payload: CreateArtworkPayload = req.body;
    if (!payload.title || !payload.author || !payload.category || !payload.image || !payload.description) {
      res.status(400).json({ success: false, error: 'Missing required fields' });
      return;
    }
    const artwork = createArtwork(payload);
    res.status(201).json({ success: true, data: artwork });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create artwork' });
  }
});

router.post('/:id/like', (req: Request, res: Response): void => {
  try {
    const artwork = likeArtwork(req.params.id);
    if (!artwork) {
      res.status(404).json({ success: false, error: 'Artwork not found' });
      return;
    }
    res.json({ success: true, data: artwork });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to like artwork' });
  }
});

router.post('/:id/comments', (req: Request, res: Response): void => {
  try {
    const payload: CreateCommentPayload = {
      artworkId: req.params.id,
      author: req.body.author,
      content: req.body.content,
    };
    if (!payload.author || !payload.content) {
      res.status(400).json({ success: false, error: 'Missing author or content' });
      return;
    }
    const comment = addComment(payload);
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add comment' });
  }
});

router.get('/:id/comments', (req: Request, res: Response): void => {
  try {
    const artworkComments = getCommentsByArtworkId(req.params.id);
    res.json({ success: true, data: artworkComments });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch comments' });
  }
});

export default router;
