import { create } from 'zustand';
import type { JourneyRecord, UserJourneyState, DynastyId } from '../../shared/types';

interface JourneyState extends UserJourneyState {
  journeyPanelOpen: boolean;
  newNotification: string | null;

  setCurrentSection: (sectionId: string, dynasty: DynastyId, dynastyName: string, title: string, scrollPos: number) => void;
  unlockStory: (storyId: string) => void;
  unlockFigure: (figureId: string) => void;
  discoverFan: (fanId: string) => void;
  addDistance: (distance: number) => void;
  addRecord: (record: Omit<JourneyRecord, 'id' | 'visitedAt'>) => void;
  addAchievement: (achievement: string) => void;
  addNote: (sectionId: string, note: string) => void;
  toggleJourneyPanel: () => void;
  setJourneyPanelOpen: (open: boolean) => void;
  clearNotification: () => void;
  resetJourney: () => void;
  _checkAchievements: () => void;
}

const STORAGE_KEY = 'fan-culture-journey';

const loadFromStorage = (): Partial<UserJourneyState> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load journey from storage');
  }
  return {};
};

const saveToStorage = (state: UserJourneyState) => {
  try {
    const toSave: UserJourneyState = {
      records: state.records,
      totalDistance: state.totalDistance,
      currentSectionId: state.currentSectionId,
      unlockedFigures: state.unlockedFigures,
      unlockedStories: state.unlockedStories,
      discoveredFans: state.discoveredFans,
      achievements: state.achievements,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn('Failed to save journey to storage');
  }
};

const stored = loadFromStorage();

const ACHIEVEMENTS: { id: string; name: string; condition: (s: UserJourneyState) => boolean }[] = [
  { id: 'first-step', name: '初入扇林', condition: (s) => s.records.length >= 1 },
  { id: 'dynasty-explorer', name: '朝代探索者', condition: (s) => new Set(s.records.map(r => r.dynasty)).size >= 3 },
  { id: 'history-buff', name: '历史爱好者', condition: (s) => s.records.length >= 5 },
  { id: 'story-collector', name: '故事收藏家', condition: (s) => s.unlockedStories.length >= 5 },
  { id: 'figure-hunter', name: '人物寻访者', condition: (s) => s.unlockedFigures.length >= 3 },
  { id: 'fan-connoisseur', name: '扇品鉴赏家', condition: (s) => s.discoveredFans.length >= 5 },
  { id: 'long-journey', name: '万里征途', condition: (s) => s.totalDistance >= 10000 },
  { id: 'culture-master', name: '扇文化大师', condition: (s) => s.records.length >= 7 && s.unlockedStories.length >= 10 },
];

export const useJourneyStore = create<JourneyState>((set, get) => ({
  records: stored.records || [],
  totalDistance: stored.totalDistance || 0,
  currentSectionId: stored.currentSectionId || undefined,
  unlockedFigures: stored.unlockedFigures || [],
  unlockedStories: stored.unlockedStories || [],
  discoveredFans: stored.discoveredFans || [],
  achievements: stored.achievements || [],
  journeyPanelOpen: false,
  newNotification: null,

  setCurrentSection: (sectionId, dynasty, dynastyName, title, scrollPos) => {
    const state = get();
    const existingRecord = state.records.find(r => r.sectionId === sectionId);

    if (!existingRecord) {
      const newRecord: JourneyRecord = {
        id: `record-${Date.now()}`,
        sectionId,
        dynasty,
        dynastyName,
        title,
        visitedAt: Date.now(),
        scrollPosition: scrollPos,
        storiesUnlocked: [],
        figuresUnlocked: [],
        fansDiscovered: [],
      };
      set(state => ({
        currentSectionId: sectionId,
        records: [...state.records, newRecord],
      }));
      get()._checkAchievements();
      saveToStorage(get());
    } else {
      set({ currentSectionId: sectionId });
      saveToStorage(get());
    }
  },

  unlockStory: (storyId) => {
    const state = get();
    if (!state.unlockedStories.includes(storyId)) {
      const storyInfo = getStoryInfo(storyId);
      set(state => {
        const updatedRecords = state.records.map(r => {
          if (state.currentSectionId && r.sectionId === state.currentSectionId && !r.storiesUnlocked.includes(storyId)) {
            return { ...r, storiesUnlocked: [...r.storiesUnlocked, storyId] };
          }
          return r;
        });
        return {
          unlockedStories: [...state.unlockedStories, storyId],
          records: updatedRecords,
          newNotification: storyInfo ? `✨ 解锁故事：${storyInfo}` : null,
        };
      });
      get()._checkAchievements();
      saveToStorage(get());
    }
  },

  unlockFigure: (figureId) => {
    const state = get();
    if (!state.unlockedFigures.includes(figureId)) {
      const figureInfo = getFigureInfo(figureId);
      set(state => {
        const updatedRecords = state.records.map(r => {
          if (state.currentSectionId && r.sectionId === state.currentSectionId && !r.figuresUnlocked.includes(figureId)) {
            return { ...r, figuresUnlocked: [...r.figuresUnlocked, figureId] };
          }
          return r;
        });
        return {
          unlockedFigures: [...state.unlockedFigures, figureId],
          records: updatedRecords,
          newNotification: figureInfo ? `🎭 结识人物：${figureInfo}` : null,
        };
      });
      get()._checkAchievements();
      saveToStorage(get());
    }
  },

  discoverFan: (fanId) => {
    const state = get();
    if (!state.discoveredFans.includes(fanId)) {
      const fanInfo = getFanInfo(fanId);
      set(state => {
        const updatedRecords = state.records.map(r => {
          if (state.currentSectionId && r.sectionId === state.currentSectionId && !r.fansDiscovered.includes(fanId)) {
            return { ...r, fansDiscovered: [...r.fansDiscovered, fanId] };
          }
          return r;
        });
        return {
          discoveredFans: [...state.discoveredFans, fanId],
          records: updatedRecords,
          newNotification: fanInfo ? `🪭 发现珍品：${fanInfo}` : null,
        };
      });
      get()._checkAchievements();
      saveToStorage(get());
    }
  },

  addDistance: (distance) => {
    set(state => ({ totalDistance: state.totalDistance + distance }));
    get()._checkAchievements();
    saveToStorage(get());
  },

  addRecord: (recordData) => {
    const state = get();
    const existingRecord = state.records.find(r => r.sectionId === recordData.sectionId);

    if (!existingRecord) {
      const newRecord: JourneyRecord = {
        ...recordData,
        id: `record-${Date.now()}`,
        visitedAt: Date.now(),
      };
      set(state => ({ records: [...state.records, newRecord] }));
      get()._checkAchievements();
      saveToStorage(get());
    }
  },

  addAchievement: (achievement) => {
    const state = get();
    if (!state.achievements.includes(achievement)) {
      set(state => ({
        achievements: [...state.achievements, achievement],
        newNotification: `🏆 获得成就：${achievement}`,
      }));
      saveToStorage(get());
    }
  },

  addNote: (sectionId, note) => {
    set(state => ({
      records: state.records.map(r =>
        r.sectionId === sectionId ? { ...r, notes: note } : r
      ),
    }));
    saveToStorage(get());
  },

  toggleJourneyPanel: () => {
    set(state => ({ journeyPanelOpen: !state.journeyPanelOpen }));
  },

  setJourneyPanelOpen: (open) => {
    set({ journeyPanelOpen: open });
  },

  clearNotification: () => {
    set({ newNotification: null });
  },

  resetJourney: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      records: [],
      totalDistance: 0,
      currentSectionId: undefined,
      unlockedFigures: [],
      unlockedStories: [],
      discoveredFans: [],
      achievements: [],
      newNotification: '旅程已重置',
    });
  },

  _checkAchievements: () => {
    const state = get();
    ACHIEVEMENTS.forEach(a => {
      if (!state.achievements.includes(a.id) && a.condition(state)) {
        set(s => ({
          achievements: [...s.achievements, a.id],
          newNotification: `🏆 获得成就：${a.name}`,
        }));
      }
    });
  },
}));

const STORY_NAMES: Record<string, string> = {
  'story-1': '舜制五明扇',
  'story-2': '班婕妤咏团扇',
  'story-3': '杨贵妃持扇避暑',
  'story-4': '鉴真携扇东渡',
  'story-5': '苏轼题扇救人',
  'story-6': '宋徽宗题扇',
  'story-7': '唐伯虎画扇',
  'story-8': '文徵明四绝入扇',
  'story-9': '乾隆御题折扇',
  'story-10': '曹雪芹与折扇',
  'story-11': '齐白石画虾扇',
  'story-12': '张大千画荷扇',
};

const FIGURE_NAMES: Record<string, string> = {
  'zhuge-liang': '诸葛亮',
  'tangbohu': '唐寅（唐伯虎）',
  'wen-zhengming': '文徵明',
  'shenzhou': '沈周',
  'liubei': '刘备',
  'qiuying': '仇英',
  'huangyueying': '黄月英',
  'zhouyu': '周瑜',
};

const FAN_NAMES: Record<string, string> = {
  'dev-1': '五明扇',
  'dev-2': '羽翣',
  'dev-3': '素纨团扇',
  'dev-4': '合欢扇',
  'dev-5': '宫绢团扇',
  'dev-6': '孔雀羽扇',
  'dev-7': '高丽扇',
  'dev-8': '山水团扇',
  'dev-9': '乌骨泥金折扇',
  'dev-10': '竹骨纸面折扇',
  'dev-11': '檀香木雕折扇',
  'dev-12': '象牙丝编织团扇',
  'dev-13': '缂丝花鸟团扇',
  'dev-14': '名家书画折扇',
  'dev-15': '广告折扇',
};

export function getStoryInfo(id: string): string | null {
  return STORY_NAMES[id] || null;
}

export function getFigureInfo(id: string): string | null {
  return FIGURE_NAMES[id] || null;
}

export function getFanInfo(id: string): string | null {
  return FAN_NAMES[id] || null;
}

export function getAchievementName(id: string): string | null {
  const found = ACHIEVEMENTS.find(a => a.id === id);
  return found ? found.name : null;
}
