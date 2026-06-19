import type { Artwork, Comment, ArtCategory, CreateArtworkPayload, CreateCommentPayload, ApiResponse } from '@/types/fan';

const API_BASE = '/api/gallery';

export async function fetchArtworks(category?: ArtCategory): Promise<Artwork[]> {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  const url = params.toString() ? `${API_BASE}?${params.toString()}` : API_BASE;
  const response = await fetch(url);
  const data: ApiResponse<Artwork[]> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error || 'Failed to fetch artworks');
  return data.data;
}

export async function fetchArtworkDetail(id: string): Promise<{ artwork: Artwork; comments: Comment[] }> {
  const response = await fetch(`${API_BASE}/${id}`);
  const data: ApiResponse<{ artwork: Artwork; comments: Comment[] }> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error || 'Failed to fetch artwork');
  return data.data;
}

export async function createArtwork(payload: CreateArtworkPayload): Promise<Artwork> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data: ApiResponse<Artwork> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error || 'Failed to create artwork');
  return data.data;
}

export async function likeArtwork(id: string): Promise<Artwork> {
  const response = await fetch(`${API_BASE}/${id}/like`, { method: 'POST' });
  const data: ApiResponse<Artwork> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error || 'Failed to like artwork');
  return data.data;
}

export async function fetchComments(artworkId: string): Promise<Comment[]> {
  const response = await fetch(`${API_BASE}/${artworkId}/comments`);
  const data: ApiResponse<Comment[]> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error || 'Failed to fetch comments');
  return data.data;
}

export async function addComment(artworkId: string, author: string, content: string): Promise<Comment> {
  const payload: CreateCommentPayload = { artworkId, author, content };
  const response = await fetch(`${API_BASE}/${artworkId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data: ApiResponse<Comment> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error || 'Failed to add comment');
  return data.data;
}

export async function fetchRanking(limit: number = 10): Promise<Artwork[]> {
  const response = await fetch(`${API_BASE}/ranking?limit=${limit}`);
  const data: ApiResponse<Artwork[]> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error || 'Failed to fetch ranking');
  return data.data;
}

export async function fetchArtCategories(): Promise<{ value: ArtCategory; label: string }[]> {
  const response = await fetch(`${API_BASE}/categories`);
  const data: ApiResponse<{ value: ArtCategory; label: string }[]> = await response.json();
  if (!data.success || !data.data) throw new Error(data.error || 'Failed to fetch categories');
  return data.data;
}
