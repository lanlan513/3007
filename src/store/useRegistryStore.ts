import { create } from 'zustand';
import type { FanRegistryEntry, RegistryClue, FanRegistryRarity, FanRegistryStatus } from '@/types/fan';
import { registryEntries } from '@/data/registryData';

interface RegistryStoreState {
  entries: FanRegistryEntry[];
  selectedEntryId: string | null;
  showDetailModal: boolean;
  showClueModal: boolean;
  activeClue: RegistryClue | null;
  clueAnswer: string;
  clueError: string;
  showFieldModal: boolean;
  activeFieldEntryId: string | null;
  activeFieldKey: string;
  fieldValue: string;
  newlyDiscovered: string | null;
  newlyUnlocked: string | null;
  searchKeyword: string;
  filterRarity: FanRegistryRarity | 'all';
  filterStatus: FanRegistryStatus | 'all';

  getVisibleEntries: () => FanRegistryEntry[];
  getEntryById: (id: string) => FanRegistryEntry | undefined;
  getSelectedEntry: () => FanRegistryEntry | undefined;
  getCluesForEntry: (entryId: string) => RegistryClue[];
  getUnsolvedCluesForEntry: (entryId: string) => RegistryClue[];
  getStats: () => { total: number; discovered: number; locked: number; unlocked: number; completed: number; undiscovered: number };

  discoverEntry: (entryId: string) => void;
  selectEntry: (entryId: string | null) => void;
  setShowDetailModal: (show: boolean) => void;
  setShowClueModal: (show: boolean) => void;
  setActiveClue: (clue: RegistryClue | null) => void;
  setClueAnswer: (answer: string) => void;
  setClueError: (error: string) => void;
  submitClueAnswer: () => boolean;
  setShowFieldModal: (show: boolean) => void;
  openFieldForEdit: (entryId: string, fieldKey: string) => void;
  setFieldValue: (value: string) => void;
  submitFieldValue: () => boolean;
  setSearchKeyword: (keyword: string) => void;
  setFilterRarity: (rarity: FanRegistryRarity | 'all') => void;
  setFilterStatus: (status: FanRegistryStatus | 'all') => void;
  resetNewlyDiscovered: () => void;
  resetNewlyUnlocked: () => void;
  attemptRandomDiscovery: () => void;
}

export const useRegistryStore = create<RegistryStoreState>((set, get) => ({
  entries: [...registryEntries],
  selectedEntryId: null,
  showDetailModal: false,
  showClueModal: false,
  activeClue: null,
  clueAnswer: '',
  clueError: '',
  showFieldModal: false,
  activeFieldEntryId: null,
  activeFieldKey: '',
  fieldValue: '',
  newlyDiscovered: null,
  newlyUnlocked: null,
  searchKeyword: '',
  filterRarity: 'all',
  filterStatus: 'all',

  getVisibleEntries: () => {
    const state = get();
    let entries = state.entries;

    if (state.searchKeyword) {
      const kw = state.searchKeyword.toLowerCase();
      entries = entries.filter(e =>
        e.status !== 'undiscovered' && (
          e.name.toLowerCase().includes(kw) ||
          e.registryNumber.toLowerCase().includes(kw) ||
          e.origin.toLowerCase().includes(kw) ||
          e.dynasty.toLowerCase().includes(kw) ||
          e.tags.some(t => t.toLowerCase().includes(kw))
        )
      );
    }

    if (state.filterRarity !== 'all') {
      entries = entries.filter(e => e.rarity === state.filterRarity);
    }

    if (state.filterStatus !== 'all') {
      entries = entries.filter(e => e.status === state.filterStatus);
    }

    return entries;
  },

  getEntryById: (id) => get().entries.find(e => e.id === id),

  getSelectedEntry: () => {
    const state = get();
    if (!state.selectedEntryId) return undefined;
    return state.entries.find(e => e.id === state.selectedEntryId);
  },

  getCluesForEntry: (entryId) => {
    const entry = get().entries.find(e => e.id === entryId);
    return entry?.clues || [];
  },

  getUnsolvedCluesForEntry: (entryId) => {
    const entry = get().entries.find(e => e.id === entryId);
    return entry?.clues.filter(c => !c.solved) || [];
  },

  getStats: () => {
    const entries = get().entries;
    return {
      total: entries.length,
      discovered: entries.filter(e => e.status === 'discovered').length,
      locked: entries.filter(e => e.status === 'locked').length,
      unlocked: entries.filter(e => e.status === 'unlocked').length,
      completed: entries.filter(e => e.status === 'completed').length,
      undiscovered: entries.filter(e => e.status === 'undiscovered').length,
    };
  },

  discoverEntry: (entryId) => {
    set(state => {
      const entry = state.entries.find(e => e.id === entryId);
      if (!entry || entry.status !== 'undiscovered') return state;

      const newStatus: FanRegistryStatus = entry.clues.length > 0 ? 'locked' : 'discovered';

      return {
        entries: state.entries.map(e =>
          e.id === entryId
            ? { ...e, status: newStatus, discoveredAt: new Date().toISOString() }
            : e
        ),
        newlyDiscovered: newStatus === 'discovered' ? entryId : null,
        newlyUnlocked: null,
      };
    });
  },

  selectEntry: (entryId) => set({ selectedEntryId: entryId, showDetailModal: !!entryId }),

  setShowDetailModal: (show) => set({ showDetailModal: show, selectedEntryId: show ? get().selectedEntryId : null }),

  setShowClueModal: (show) => set({
    showClueModal: show,
    activeClue: show ? get().activeClue : null,
    clueAnswer: '',
    clueError: '',
  }),

  setActiveClue: (clue) => set({ activeClue: clue, clueAnswer: '', clueError: '' }),

  setClueAnswer: (answer) => set({ clueAnswer: answer }),

  setClueError: (error) => set({ clueError: error }),

  submitClueAnswer: () => {
    const state = get();
    if (!state.activeClue) return false;

    const answer = state.clueAnswer.trim();
    const correctAnswer = state.activeClue.answer;

    if (answer === correctAnswer) {
      const clueId = state.activeClue.id;
      const entryId = state.activeClue.relatedEntryId;

      set(state => {
        const entry = state.entries.find(e => e.id === entryId);
        if (!entry) return state;

        const updatedClues = entry.clues.map(c =>
          c.id === clueId ? { ...c, solved: true } : c
        );

        const allSolved = updatedClues.every(c => c.solved);

        let newStatus: FanRegistryStatus = entry.status;
        let newlyUnlocked: string | null = null;

        if (allSolved && entry.status === 'locked') {
          newStatus = 'unlocked';
          newlyUnlocked = entryId;
        }

        return {
          entries: state.entries.map(e =>
            e.id === entryId
              ? { ...e, clues: updatedClues, status: newStatus }
              : e
          ),
          activeClue: null,
          clueAnswer: '',
          clueError: '',
          showClueModal: false,
          newlyUnlocked,
        };
      });

      return true;
    } else {
      set({ clueError: '推理有误，再想想看……' });
      return false;
    }
  },

  setShowFieldModal: (show) => set({
    showFieldModal: show,
    activeFieldEntryId: show ? get().activeFieldEntryId : null,
    activeFieldKey: show ? get().activeFieldKey : '',
    fieldValue: '',
  }),

  openFieldForEdit: (entryId, fieldKey) => {
    const entry = get().entries.find(e => e.id === entryId);
    if (!entry) return;
    const field = entry.missingFields.find(f => f.key === fieldKey);
    set({
      activeFieldEntryId: entryId,
      activeFieldKey: fieldKey,
      fieldValue: field?.value || '',
      showFieldModal: true,
    });
  },

  setFieldValue: (value) => set({ fieldValue: value }),

  submitFieldValue: () => {
    const state = get();
    if (!state.activeFieldEntryId || !state.activeFieldKey) return false;

    const entryId = state.activeFieldEntryId;
    const fieldKey = state.activeFieldKey;
    const value = state.fieldValue.trim();

    set(state => {
      const entry = state.entries.find(e => e.id === entryId);
      if (!entry) return state;

      const field = entry.missingFields.find(f => f.key === fieldKey);
      if (!field) return state;

      if (value !== field.correctValue) {
        return { fieldValue: '' };
      }

      const updatedMissingFields = entry.missingFields.map(f =>
        f.key === fieldKey ? { ...f, filled: true, value } : f
      );

      const totalFields = 6;
      const completeness = Math.round(((totalFields - updatedMissingFields.filter(f => !f.filled).length) / totalFields) * 100);

      let newStatus: FanRegistryStatus = entry.status;
      if (updatedMissingFields.every(f => f.filled) && entry.status !== 'completed') {
        newStatus = 'completed';
      } else if (entry.status === 'discovered' && completeness > entry.completeness) {
        newStatus = 'discovered';
      }

      return {
        entries: state.entries.map(e =>
          e.id === entryId
            ? { ...e, missingFields: updatedMissingFields, completeness, status: newStatus }
            : e
        ),
        showFieldModal: false,
        activeFieldEntryId: null,
        activeFieldKey: '',
        fieldValue: '',
      };
    });

    return true;
  },

  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  setFilterRarity: (rarity) => set({ filterRarity: rarity }),

  setFilterStatus: (status) => set({ filterStatus: status }),

  resetNewlyDiscovered: () => set({ newlyDiscovered: null }),

  resetNewlyUnlocked: () => set({ newlyUnlocked: null }),

  attemptRandomDiscovery: () => {
    const state = get();
    const undiscovered = state.entries.filter(e => e.status === 'undiscovered');
    if (undiscovered.length === 0) return;

    const random = undiscovered[Math.floor(Math.random() * undiscovered.length)];
    get().discoverEntry(random.id);
  },
}));
