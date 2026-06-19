import type { Fan, Category, FanDetailResponse, ApiResponse } from '@/types/fan';

const API_BASE = '/api/fans';

export async function fetchFans(category?: string, keyword?: string): Promise<Fan[]> {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (keyword) params.set('keyword', keyword);

  const url = params.toString() ? `${API_BASE}?${params.toString()}` : API_BASE;

  const response = await fetch(url);
  const data: ApiResponse<Fan[]> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch fans');
  }

  return data.data;
}

export async function fetchFanDetail(id: string): Promise<FanDetailResponse> {
  const response = await fetch(`${API_BASE}/${id}`);
  const data: ApiResponse<FanDetailResponse> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch fan detail');
  }

  return data.data;
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/categories`);
  const data: ApiResponse<Category[]> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch categories');
  }

  return data.data;
}
