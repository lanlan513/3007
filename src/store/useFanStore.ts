import { create } from 'zustand';
import type { Fan, Category, FilterOption, FilterOptionsResponse } from '@/types/fan';
import { fetchFans, fetchCategories, fetchFilterOptions } from '@/services/fanApi';

interface FanState {
  fans: Fan[];
  categories: Category[];
  filterOptions: FilterOptionsResponse | null;
  selectedCategory: string;
  selectedDynasty: string;
  selectedMaterial: string;
  selectedUsage: string;
  searchKeyword: string;
  loading: boolean;
  error: string | null;

  setSelectedCategory: (category: string) => void;
  setSelectedDynasty: (dynasty: string) => void;
  setSelectedMaterial: (material: string) => void;
  setSelectedUsage: (usage: string) => void;
  setSearchKeyword: (keyword: string) => void;
  resetFilters: () => void;
  loadFans: () => Promise<void>;
  loadCategories: () => Promise<void>;
  loadFilterOptions: () => Promise<void>;
}

export const useFanStore = create<FanState>((set, get) => ({
  fans: [],
  categories: [],
  filterOptions: null,
  selectedCategory: 'all',
  selectedDynasty: '',
  selectedMaterial: '',
  selectedUsage: '',
  searchKeyword: '',
  loading: false,
  error: null,

  setSelectedCategory: (category: string) => {
    set({ selectedCategory: category });
    get().loadFans();
  },

  setSelectedDynasty: (dynasty: string) => {
    set({ selectedDynasty: dynasty });
    get().loadFans();
  },

  setSelectedMaterial: (material: string) => {
    set({ selectedMaterial: material });
    get().loadFans();
  },

  setSelectedUsage: (usage: string) => {
    set({ selectedUsage: usage });
    get().loadFans();
  },

  setSearchKeyword: (keyword: string) => {
    set({ searchKeyword: keyword });
    get().loadFans();
  },

  resetFilters: () => {
    set({
      selectedCategory: 'all',
      selectedDynasty: '',
      selectedMaterial: '',
      selectedUsage: '',
      searchKeyword: '',
    });
    get().loadFans();
  },

  loadFans: async () => {
    const { selectedCategory, searchKeyword, selectedDynasty, selectedMaterial, selectedUsage } = get();
    set({ loading: true, error: null });

    try {
      const fans = await fetchFans({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        keyword: searchKeyword || undefined,
        dynasty: selectedDynasty || undefined,
        material: selectedMaterial || undefined,
        usage: selectedUsage || undefined,
      });
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

  loadFilterOptions: async () => {
    try {
      const filterOptions = await fetchFilterOptions();
      set({ filterOptions });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load filter options',
      });
    }
  },
}));
