import { create } from 'zustand';
import type {
  HistoricalFigure,
  FigureDetailResponse,
  FigureFilterOptionsResponse,
  FigureStatus,
} from '@/types/fan';
import {
  fetchFigures,
  fetchFigureDetail,
  fetchFigureFilterOptions,
  unlockFigure as unlockFigureApi,
  updateFigureTask as updateFigureTaskApi,
  updateFigureEvent as updateFigureEventApi,
  updateCollectionGoal as updateCollectionGoalApi,
} from '@/services/figureApi';

interface FigureState {
  figures: HistoricalFigure[];
  currentFigure: HistoricalFigure | null;
  relatedFigures: HistoricalFigure[];
  filterOptions: FigureFilterOptionsResponse | null;
  selectedDynasty: string;
  selectedStatus: FigureStatus | '';
  selectedTag: string;
  loading: boolean;
  error: string | null;
  detailLoading: boolean;

  setSelectedDynasty: (dynasty: string) => void;
  setSelectedStatus: (status: FigureStatus | '') => void;
  setSelectedTag: (tag: string) => void;
  resetFilters: () => void;
  loadFigures: () => Promise<void>;
  loadFigureDetail: (id: string) => Promise<void>;
  loadFilterOptions: () => Promise<void>;
  unlockFigure: (id: string) => Promise<void>;
  completeTask: (figureId: string, taskId: string) => Promise<void>;
  completeEvent: (figureId: string, eventId: string) => Promise<void>;
  updateGoal: (figureId: string, goalId: string, count: number) => Promise<void>;
  clearCurrentFigure: () => void;
}

export const useFigureStore = create<FigureState>((set, get) => ({
  figures: [],
  currentFigure: null,
  relatedFigures: [],
  filterOptions: null,
  selectedDynasty: '',
  selectedStatus: '',
  selectedTag: '',
  loading: false,
  error: null,
  detailLoading: false,

  setSelectedDynasty: (dynasty: string) => {
    set({ selectedDynasty: dynasty });
    get().loadFigures();
  },

  setSelectedStatus: (status: FigureStatus | '') => {
    set({ selectedStatus: status });
    get().loadFigures();
  },

  setSelectedTag: (tag: string) => {
    set({ selectedTag: tag });
    get().loadFigures();
  },

  resetFilters: () => {
    set({
      selectedDynasty: '',
      selectedStatus: '',
      selectedTag: '',
    });
    get().loadFigures();
  },

  loadFigures: async () => {
    const { selectedDynasty, selectedStatus, selectedTag } = get();
    set({ loading: true, error: null });

    try {
      const figures = await fetchFigures({
        dynasty: selectedDynasty || undefined,
        status: selectedStatus || undefined,
        tag: selectedTag || undefined,
      });
      set({ figures, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load figures',
        loading: false,
      });
    }
  },

  loadFigureDetail: async (id: string) => {
    set({ detailLoading: true, error: null });

    try {
      const data: FigureDetailResponse = await fetchFigureDetail(id);
      set({
        currentFigure: data.figure,
        relatedFigures: data.relatedFigures,
        detailLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load figure detail',
        detailLoading: false,
      });
    }
  },

  loadFilterOptions: async () => {
    try {
      const filterOptions = await fetchFigureFilterOptions();
      set({ filterOptions });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load filter options',
      });
    }
  },

  unlockFigure: async (id: string) => {
    try {
      const updated = await unlockFigureApi(id);
      set(state => ({
        figures: state.figures.map(f => (f.id === id ? updated : f)),
        currentFigure: state.currentFigure?.id === id ? updated : state.currentFigure,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to unlock figure',
      });
    }
  },

  completeTask: async (figureId: string, taskId: string) => {
    try {
      const updated = await updateFigureTaskApi({
        figureId,
        taskId,
        completed: true,
      });
      set(state => ({
        figures: state.figures.map(f => (f.id === figureId ? updated : f)),
        currentFigure: state.currentFigure?.id === figureId ? updated : state.currentFigure,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to complete task',
      });
    }
  },

  completeEvent: async (figureId: string, eventId: string) => {
    try {
      const updated = await updateFigureEventApi({
        figureId,
        eventId,
        completed: true,
      });
      set(state => ({
        figures: state.figures.map(f => (f.id === figureId ? updated : f)),
        currentFigure: state.currentFigure?.id === figureId ? updated : state.currentFigure,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to complete event',
      });
    }
  },

  updateGoal: async (figureId: string, goalId: string, count: number) => {
    try {
      const updated = await updateCollectionGoalApi(figureId, goalId, count);
      set(state => ({
        figures: state.figures.map(f => (f.id === figureId ? updated : f)),
        currentFigure: state.currentFigure?.id === figureId ? updated : state.currentFigure,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update goal',
      });
    }
  },

  clearCurrentFigure: () => {
    set({ currentFigure: null, relatedFigures: [] });
  },
}));
