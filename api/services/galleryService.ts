import { artworks, comments, getNextId, getNextCommentId, artCategoryMap } from '../data/gallery.js';
import type { Artwork, Comment, ArtCategory, CreateArtworkPayload, CreateCommentPayload } from '../../shared/types.js';

export function getAllArtworks(category?: ArtCategory): Artwork[] {
  if (category && category !== 'all' as unknown as ArtCategory) {
    return artworks.filter(a => a.category === category);
  }
  return [...artworks];
}

export function getArtworkById(id: string): Artwork | undefined {
  return artworks.find(a => a.id === id);
}

export function createArtwork(payload: CreateArtworkPayload): Artwork {
  const artwork: Artwork = {
    id: getNextId(),
    title: payload.title,
    author: payload.author,
    category: payload.category,
    categoryName: artCategoryMap[payload.category],
    image: payload.image,
    description: payload.description,
    likes: 0,
    commentCount: 0,
    createdAt: new Date().toISOString(),
  };
  artworks.unshift(artwork);
  return artwork;
}

export function likeArtwork(id: string): Artwork | null {
  const artwork = artworks.find(a => a.id === id);
  if (!artwork) return null;
  artwork.likes++;
  return artwork;
}

export function getCommentsByArtworkId(artworkId: string): Comment[] {
  return comments.filter(c => c.artworkId === artworkId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addComment(payload: CreateCommentPayload): Comment {
  const comment: Comment = {
    id: getNextCommentId(),
    artworkId: payload.artworkId,
    author: payload.author,
    content: payload.content,
    createdAt: new Date().toISOString(),
  };
  comments.unshift(comment);
  const artwork = artworks.find(a => a.id === payload.artworkId);
  if (artwork) {
    artwork.commentCount++;
  }
  return comment;
}

export function getRanking(limit: number = 10): Artwork[] {
  return [...artworks].sort((a, b) => b.likes - a.likes).slice(0, limit);
}

export function getArtCategories(): { value: ArtCategory; label: string }[] {
  return Object.entries(artCategoryMap).map(([value, label]) => ({
    value: value as ArtCategory,
    label,
  }));
}
