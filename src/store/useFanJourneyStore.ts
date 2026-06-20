import { create } from 'zustand';
import type { Fan, FanLifeStory } from '@/types/fan';
import {
  generateFanLifeStory,
  getAllFansForJourney,
} from '@/services/fanLifecycleStoryService';

interface FanJourneyState {
  allFans: Fan[];
  selectedFan: Fan | null;
  lifeStory: FanLifeStory | null;
  activeEventId: string | null;
  isGenerating: boolean;
  loading: boolean;
  error: string | null;
  storyHistory: Record<string, FanLifeStory>;

  loadAllFans: () => void;
  selectFan: (fanId: string) => void;
  generateStory: (fanId?: string) => void;
  setActiveEvent: (eventId: string | null) => void;
  regenerateStory: () => void;
  clearSelection: () => void;
}

export const useFanJourneyStore = create<FanJourneyState>((set, get) => ({
  allFans: [],
  selectedFan: null,
  lifeStory: null,
  activeEventId: null,
  isGenerating: false,
  loading: false,
  error: null,
  storyHistory: {},

  loadAllFans: () => {
    set({ loading: true });
    try {
      const fans = getAllFansForJourney();
      set({ allFans: fans, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '加载扇子列表失败',
        loading: false,
      });
    }
  },

  selectFan: (fanId: string) => {
    const { allFans } = get();
    const fan = allFans.find((f) => f.id === fanId);
    if (fan) {
      set({ selectedFan: fan, activeEventId: null });
      get().generateStory(fanId);
    }
  },

  generateStory: (fanId?: string) => {
    const { selectedFan, allFans, storyHistory } = get();
    const targetFanId = fanId || selectedFan?.id;

    if (!targetFanId) return;

    if (storyHistory[targetFanId]) {
      const fan = allFans.find((f) => f.id === targetFanId) || selectedFan;
      set({
        lifeStory: storyHistory[targetFanId],
        selectedFan: fan || null,
        activeEventId: storyHistory[targetFanId].lifecycleEvents[0]?.id || null,
      });
      return;
    }

    const fan = allFans.find((f) => f.id === targetFanId) || selectedFan;
    if (!fan) return;

    set({ isGenerating: true });

    try {
      setTimeout(() => {
        const story = generateFanLifeStory(fan);
        set((state) => ({
          lifeStory: story,
          isGenerating: false,
          storyHistory: {
            ...state.storyHistory,
            [targetFanId]: story,
          },
          activeEventId: story.lifecycleEvents[0]?.id || null,
          selectedFan: fan,
        }));
      }, 600);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '生成故事失败',
        isGenerating: false,
      });
    }
  },

  setActiveEvent: (eventId: string | null) => {
    set({ activeEventId: eventId });
  },

  regenerateStory: () => {
    const { selectedFan } = get();
    if (!selectedFan) return;

    set((state) => {
      const newHistory = { ...state.storyHistory };
      delete newHistory[selectedFan.id];
      return { storyHistory: newHistory };
    });

    get().generateStory(selectedFan.id);
  },

  clearSelection: () => {
    set({ selectedFan: null, lifeStory: null, activeEventId: null });
  },
}));
