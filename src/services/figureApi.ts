import type {
  HistoricalFigure,
  FigureDetailResponse,
  FigureFilterOptionsResponse,
  FigureFilters,
  ApiResponse,
  UpdateFigureTaskPayload,
  UpdateEventPayload,
} from '@/types/fan';

const API_BASE = '/api/figures';

export async function fetchFigures(filters: FigureFilters = {}): Promise<HistoricalFigure[]> {
  const { dynasty, status, tag } = filters;
  const params = new URLSearchParams();
  if (dynasty) params.set('dynasty', dynasty);
  if (status) params.set('status', status);
  if (tag) params.set('tag', tag);

  const url = params.toString() ? `${API_BASE}?${params.toString()}` : API_BASE;

  const response = await fetch(url);
  const data: ApiResponse<HistoricalFigure[]> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch figures');
  }

  return data.data;
}

export async function fetchFigureDetail(id: string): Promise<FigureDetailResponse> {
  const response = await fetch(`${API_BASE}/${id}`);
  const data: ApiResponse<FigureDetailResponse> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch figure detail');
  }

  return data.data;
}

export async function fetchRelatedFigures(id: string): Promise<HistoricalFigure[]> {
  const response = await fetch(`${API_BASE}/${id}/related`);
  const data: ApiResponse<HistoricalFigure[]> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch related figures');
  }

  return data.data;
}

export async function fetchFigureFilterOptions(): Promise<FigureFilterOptionsResponse> {
  const response = await fetch(`${API_BASE}/filter-options`);
  const data: ApiResponse<FigureFilterOptionsResponse> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch filter options');
  }

  return data.data;
}

export async function unlockFigure(id: string): Promise<HistoricalFigure> {
  const response = await fetch(`${API_BASE}/${id}/unlock`, {
    method: 'POST',
  });
  const data: ApiResponse<HistoricalFigure> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to unlock figure');
  }

  return data.data;
}

export async function updateFigureTask(
  payload: UpdateFigureTaskPayload,
): Promise<HistoricalFigure> {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data: ApiResponse<HistoricalFigure> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to update task');
  }

  return data.data;
}

export async function updateFigureEvent(
  payload: UpdateEventPayload,
): Promise<HistoricalFigure> {
  const response = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data: ApiResponse<HistoricalFigure> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to update event');
  }

  return data.data;
}

export async function updateCollectionGoal(
  figureId: string,
  goalId: string,
  currentCount: number,
): Promise<HistoricalFigure> {
  const response = await fetch(`${API_BASE}/${figureId}/goals/${goalId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentCount }),
  });
  const data: ApiResponse<HistoricalFigure> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to update collection goal');
  }

  return data.data;
}

export async function createFigure(payload: {
  name: string;
  title: string;
  dynasty: string;
  avatar: string;
  shortBio: string;
  fullBiography: string;
}): Promise<HistoricalFigure> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data: ApiResponse<HistoricalFigure> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to create figure');
  }

  return data.data;
}

export async function deleteFigureApi(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  const data: ApiResponse<void> = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to delete figure');
  }
}
