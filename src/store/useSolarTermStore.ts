import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SolarTermData, SolarTermSeason } from '@/data/solarTermsData';
import { SOLAR_TERMS } from '@/data/solarTermsData';

interface FavoriteTerm {
  termId: string;
  addedAt: string;
  note: string;
}

interface YearbookEntry {
  termId: string;
  note: string;
  fanChoice: string;
  poemChoice: string;
  artChoice: string;
  createdAt: string;
}

interface Yearbook {
  id: string;
  title: string;
  year: number;
  entries: YearbookEntry[];
  createdAt: string;
  coverTerm: string;
}

interface SolarTermState {
  favorites: FavoriteTerm[];
  yearbooks: Yearbook[];
  selectedSeason: SolarTermSeason | 'all';
  selectedTerm: SolarTermData | null;
  detailOpen: boolean;

  setSelectedSeason: (season: SolarTermSeason | 'all') => void;
  setSelectedTerm: (term: SolarTermData | null) => void;
  setDetailOpen: (open: boolean) => void;
  toggleFavorite: (termId: string) => void;
  isFavorite: (termId: string) => boolean;
  addNote: (termId: string, note: string) => void;
  createYearbook: (title: string, coverTermId: string, importFavorites?: boolean) => string;
  addYearbookEntry: (yearbookId: string, entry: YearbookEntry) => void;
  removeYearbookEntry: (yearbookId: string, termId: string) => void;
  deleteYearbook: (yearbookId: string) => void;
  importFavoritesToYearbook: (yearbookId: string) => number;
  getTermById: (id: string) => SolarTermData | undefined;
}

export const useSolarTermStore = create<SolarTermState>()(
  persist(
    (set, get) => ({
      favorites: [],
      yearbooks: [],
      selectedSeason: 'all',
      selectedTerm: null,
      detailOpen: false,

      setSelectedSeason: (season) => set({ selectedSeason: season }),

      setSelectedTerm: (term) => set({ selectedTerm: term, detailOpen: !!term }),

      setDetailOpen: (open) => set({ detailOpen: open, selectedTerm: open ? get().selectedTerm : null }),

      toggleFavorite: (termId) => {
        const { favorites } = get();
        const existing = favorites.find(f => f.termId === termId);
        if (existing) {
          set({ favorites: favorites.filter(f => f.termId !== termId) });
        } else {
          set({
            favorites: [
              ...favorites,
              { termId, addedAt: new Date().toISOString(), note: '' },
            ],
          });
        }
      },

      isFavorite: (termId) => {
        return get().favorites.some(f => f.termId === termId);
      },

      addNote: (termId, note) => {
        const { favorites } = get();
        set({
          favorites: favorites.map(f =>
            f.termId === termId ? { ...f, note } : f
          ),
        });
      },

      createYearbook: (title, coverTermId, importFavorites = false) => {
        const id = `yearbook_${Date.now()}`;
        const entries: YearbookEntry[] = [];

        if (importFavorites) {
          get().favorites.forEach(fav => {
            const term = SOLAR_TERMS.find(t => t.id === fav.termId);
            if (term) {
              entries.push({
                termId: term.id,
                note: fav.note,
                fanChoice: term.fan.name,
                poemChoice: term.poems[0]?.title || '',
                artChoice: term.arts[0]?.title || '',
                createdAt: new Date().toISOString(),
              });
            }
          });
        }

        const newYearbook: Yearbook = {
          id,
          title,
          year: new Date().getFullYear(),
          entries,
          createdAt: new Date().toISOString(),
          coverTerm: coverTermId,
        };
        set({ yearbooks: [...get().yearbooks, newYearbook] });
        return id;
      },

      importFavoritesToYearbook: (yearbookId) => {
        const { favorites, yearbooks } = get();
        let importedCount = 0;

        const updatedYearbooks = yearbooks.map(yb => {
          if (yb.id !== yearbookId) return yb;

          const newEntries = [...yb.entries];
          favorites.forEach(fav => {
            const term = SOLAR_TERMS.find(t => t.id === fav.termId);
            const exists = newEntries.some(e => e.termId === fav.termId);
            if (term && !exists) {
              newEntries.push({
                termId: term.id,
                note: fav.note,
                fanChoice: term.fan.name,
                poemChoice: term.poems[0]?.title || '',
                artChoice: term.arts[0]?.title || '',
                createdAt: new Date().toISOString(),
              });
              importedCount++;
            }
          });

          return { ...yb, entries: newEntries };
        });

        set({ yearbooks: updatedYearbooks });
        return importedCount;
      },

      addYearbookEntry: (yearbookId, entry) => {
        set({
          yearbooks: get().yearbooks.map(yb =>
            yb.id === yearbookId
              ? {
                  ...yb,
                  entries: [...yb.entries.filter(e => e.termId !== entry.termId), entry],
                }
              : yb
          ),
        });
      },

      removeYearbookEntry: (yearbookId, termId) => {
        set({
          yearbooks: get().yearbooks.map(yb =>
            yb.id === yearbookId
              ? { ...yb, entries: yb.entries.filter(e => e.termId !== termId) }
              : yb
          ),
        });
      },

      deleteYearbook: (yearbookId) => {
        set({ yearbooks: get().yearbooks.filter(yb => yb.id !== yearbookId) });
      },

      getTermById: (id) => {
        return SOLAR_TERMS.find(t => t.id === id);
      },
    }),
    {
      name: 'solar-term-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        yearbooks: state.yearbooks,
      }),
    }
  )
);
