import { create } from 'zustand';
import type { Fan, Category } from '@/types/fan';
import { fetchFans, fetchCategories } from '@/services/fanApi';

interface FanState {
  fans: Fan[];
  categories: Category[];
  selectedCategory: string;
  searchKeyword: string;
  loading: boolean;
  error: string | null;

  setSelectedCategory: (category: string) => void;
  setSearchKeyword: (keyword: string) => void;
  loadFans: () => Promise<void>;
  loadCategories: () => Promise<void>;
}

export const useFanStore = create<FanState>((set, get) => ({
  fans: [],
  categories: [],
  selectedCategory: 'all',
  searchKeyword: '',
  loading: false,
  error: null,

  setSelectedCategory: (category: string) => {
    set({ selectedCategory: category });
    get().loadFans();
  },

  setSearchKeyword: (keyword: string) => {
    set({ searchKeyword: keyword });
    get().loadFans();
  },

  loadFans: async () => {
    const { selectedCategory, searchKeyword } = get();
    set({ loading: true, error: null });

    try {
      const fans = await fetchFans(
        selectedCategory === 'all' ? undefined : selectedCategory,
        searchKeyword || undefined
      );
      set({ fans, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load fans',
        loading: false,
      });
    }
  },

  loadCategories: async () => {
    set({ loading: true, error: null });

    try {
      const categories = await fetchCategories();
      set({ categories, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load categories',
        loading: false,
      });
    }
  },
}));
