import { create } from 'zustand';
import type {
  SchoolId,
  SchoolFragment,
  CollectedFragment,
  TradeOffer,
  UserProfile,
  QuizQuestion,
  FragmentType,
} from '@/types/fan';
import { SCHOOLS, generateFragmentsForSchool } from '@/types/fan';

interface SchoolStoreState {
  collectedFragments: CollectedFragment[];
  completedSchools: SchoolId[];
  currentExploringSchool: SchoolId | null;
  exploreProgress: number;
  quizHistory: Record<string, boolean>;
  tradeOffers: TradeOffer[];
  activeFragment: SchoolFragment | null;
  showFragmentModal: boolean;
  showQuizModal: boolean;
  showTradeModal: boolean;
  selectedSchoolForQuiz: SchoolId | null;
  users: UserProfile[];
  currentUserId: string;
  craftingSchoolRewards: Record<string, number>;
  showRewardModal: boolean;
  rewardFragment: SchoolFragment | null;

  getAllFragments: () => SchoolFragment[];
  getFragmentsBySchool: (schoolId: SchoolId) => SchoolFragment[];
  getCollectedFragmentsBySchool: (schoolId: SchoolId) => CollectedFragment[];
  getFragmentById: (fragmentId: string) => SchoolFragment | null;
  isFragmentCollected: (fragmentId: string) => boolean;
  getFragmentCount: (fragmentId: string) => number;
  getSchoolProgress: (schoolId: SchoolId) => number;
  isFragmentCollectedByType: (schoolId: SchoolId, type: FragmentType) => boolean;
  getRandomUncollectedFragment: (schoolId: SchoolId, type?: FragmentType) => SchoolFragment | null;

  collectFragment: (fragmentId: string, source: 'explore' | 'quiz' | 'crafting' | 'trade' | 'gift') => void;

  startExploration: (schoolId: SchoolId) => void;
  progressExploration: () => SchoolFragment | null;
  cancelExploration: () => void;

  getQuizQuestions: (schoolId: SchoolId) => QuizQuestion[];
  answerQuiz: (questionId: string, isCorrect: boolean) => SchoolFragment | null;
  openQuiz: (schoolId: SchoolId) => void;
  closeQuiz: () => void;

  setActiveFragment: (fragment: SchoolFragment | null) => void;
  setShowFragmentModal: (show: boolean) => void;
  setShowTradeModal: (show: boolean) => void;
  setShowRewardModal: (show: boolean) => void;

  createTradeOffer: (offeredFragmentId: string, requestedFragmentId: string) => void;
  acceptTradeOffer: (offerId: string) => void;
  rejectTradeOffer: (offerId: string) => void;
  getReceivedTradeOffers: () => TradeOffer[];
  getSentTradeOffers: () => TradeOffer[];

  getTotalCollectedCount: () => number;
  getTotalFragmentCount: () => number;
  checkSchoolCompletion: (schoolId: SchoolId) => boolean;
  grantCraftingReward: (schoolId: SchoolId) => SchoolFragment | null;
}

function generateId(): string {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

const MOCK_USERS: UserProfile[] = [
  { id: 'user_2', name: '扇韵轩主', avatar: '🎋', level: 12 },
  { id: 'user_3', name: '清风居士', avatar: '🍃', level: 8 },
  { id: 'user_4', name: '紫竹道人', avatar: '🎍', level: 15 },
  { id: 'user_5', name: '墨香阁主', avatar: '🎨', level: 10 },
];

export const useSchoolStore = create<SchoolStoreState>((set, get) => ({
  collectedFragments: [],
  completedSchools: [],
  currentExploringSchool: null,
  exploreProgress: 0,
  quizHistory: {},
  tradeOffers: [],
  activeFragment: null,
  showFragmentModal: false,
  showQuizModal: false,
  showTradeModal: false,
  selectedSchoolForQuiz: null,
  users: MOCK_USERS,
  currentUserId: 'user_1',
  craftingSchoolRewards: {},
  showRewardModal: false,
  rewardFragment: null,

  getAllFragments: () => {
    const allFragments: SchoolFragment[] = [];
    SCHOOLS.forEach((school) => {
      allFragments.push(...generateFragmentsForSchool(school.id));
    });
    return allFragments;
  },

  getFragmentsBySchool: (schoolId) => {
    return generateFragmentsForSchool(schoolId);
  },

  getCollectedFragmentsBySchool: (schoolId) => {
    return get().collectedFragments.filter((f) => f.schoolId === schoolId);
  },

  getFragmentById: (fragmentId) => {
    return get().getAllFragments().find((f) => f.id === fragmentId) || null;
  },

  isFragmentCollected: (fragmentId) => {
    return get().collectedFragments.some((f) => f.fragmentId === fragmentId);
  },

  getFragmentCount: (fragmentId) => {
    const fragment = get().collectedFragments.find((f) => f.fragmentId === fragmentId);
    return fragment?.count || 0;
  },

  getSchoolProgress: (schoolId) => {
    const allFragments = get().getFragmentsBySchool(schoolId);
    const collected = get().getCollectedFragmentsBySchool(schoolId);
    if (allFragments.length === 0) return 0;
    return Math.round((collected.length / allFragments.length) * 100);
  },

  isFragmentCollectedByType: (schoolId, type) => {
    const fragments = get().getFragmentsBySchool(schoolId).filter((f) => f.type === type);
    return fragments.some((f) => get().isFragmentCollected(f.id));
  },

  getRandomUncollectedFragment: (schoolId, type) => {
    let fragments = get().getFragmentsBySchool(schoolId);
    if (type) {
      fragments = fragments.filter((f) => f.type === type);
    }
    const uncollected = fragments.filter((f) => !get().isFragmentCollected(f.id));
    if (uncollected.length === 0) {
      if (fragments.length === 0) return null;
      return fragments[Math.floor(Math.random() * fragments.length)];
    }
    return uncollected[Math.floor(Math.random() * uncollected.length)];
  },

  collectFragment: (fragmentId, source) => {
    set((state) => {
      const existing = state.collectedFragments.find((f) => f.fragmentId === fragmentId);
      let newCollected: CollectedFragment[];

      if (existing) {
        newCollected = state.collectedFragments.map((f) =>
          f.fragmentId === fragmentId ? { ...f, count: f.count + 1 } : f
        );
      } else {
        const fragment = get().getFragmentById(fragmentId);
        if (!fragment) return state;
        newCollected = [
          ...state.collectedFragments,
          {
            fragmentId,
            schoolId: fragment.schoolId,
            collectedAt: new Date().toISOString(),
            source,
            count: 1,
          },
        ];
      }

      const fragment = get().getFragmentById(fragmentId);
      const schoolId = fragment?.schoolId;
      let newCompleted = state.completedSchools;
      if (schoolId && !state.completedSchools.includes(schoolId)) {
        if (getStateCompletion(schoolId, newCollected)) {
          newCompleted = [...state.completedSchools, schoolId];
        }
      }

      return {
        collectedFragments: newCollected,
        completedSchools: newCompleted,
      };
    });
  },

  startExploration: (schoolId) => {
    set({ currentExploringSchool: schoolId, exploreProgress: 0 });
  },

  progressExploration: () => {
    const state = get();
    if (!state.currentExploringSchool) return null;

    const newProgress = Math.min(100, state.exploreProgress + 25 + Math.floor(Math.random() * 20));
    set({ exploreProgress: newProgress });

    if (newProgress >= 100) {
      const fragmentTypes: ('style' | 'craft' | 'story')[] = ['style', 'craft', 'story'];
      const randomType = fragmentTypes[Math.floor(Math.random() * fragmentTypes.length)];
      let fragment = state.getRandomUncollectedFragment(state.currentExploringSchool, randomType);
      
      if (!fragment) {
        fragment = state.getRandomUncollectedFragment(state.currentExploringSchool);
      }
      
      if (fragment) {
        get().collectFragment(fragment.id, 'explore');
      }
      set({ currentExploringSchool: null, exploreProgress: 0, activeFragment: fragment, showFragmentModal: !!fragment });
      return fragment;
    }
    return null;
  },

  cancelExploration: () => {
    set({ currentExploringSchool: null, exploreProgress: 0 });
  },

  getQuizQuestions: (schoolId) => {
    const school = SCHOOLS.find((s) => s.id === schoolId);
    return school?.quizQuestions || [];
  },

  answerQuiz: (questionId, isCorrect) => {
    set((state) => ({
      quizHistory: { ...state.quizHistory, [questionId]: isCorrect },
    }));

    if (isCorrect) {
      const state = get();
      const school = SCHOOLS.find((s) =>
        s.quizQuestions.some((q) => q.id === questionId)
      );
      if (school) {
        const fragmentTypes: ('quiz' | 'craft' | 'story' | 'style')[] = ['quiz', 'craft', 'story', 'style'];
        const randomType = fragmentTypes[Math.floor(Math.random() * fragmentTypes.length)];
        let fragment = state.getRandomUncollectedFragment(school.id, randomType);
        
        if (!fragment) {
          fragment = state.getRandomUncollectedFragment(school.id);
        }
        
        if (fragment) {
          state.collectFragment(fragment.id, 'quiz');
          set({ activeFragment: fragment, showFragmentModal: true });
          return fragment;
        }
      }
    }
    return null;
  },

  openQuiz: (schoolId) => {
    set({ selectedSchoolForQuiz: schoolId, showQuizModal: true });
  },

  closeQuiz: () => {
    set({ showQuizModal: false, selectedSchoolForQuiz: null });
  },

  setActiveFragment: (fragment) => {
    set({ activeFragment: fragment });
  },

  setShowFragmentModal: (show) => {
    set({ showFragmentModal: show });
  },

  setShowTradeModal: (show) => {
    set({ showTradeModal: show });
  },

  setShowRewardModal: (show) => {
    set({ showRewardModal: show, rewardFragment: show ? get().rewardFragment : null });
  },

  createTradeOffer: (offeredFragmentId, requestedFragmentId) => {
    const offered = get().getFragmentById(offeredFragmentId);
    const requested = get().getFragmentById(requestedFragmentId);
    if (!offered || !requested) return;

    const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];

    const offer: TradeOffer = {
      id: generateId(),
      fromUserId: get().currentUserId,
      fromUserName: '我',
      offeredFragment: offered,
      offeredCount: 1,
      requestedFragment: requested,
      requestedCount: 1,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    const receivedOffer: TradeOffer = {
      id: generateId(),
      fromUserId: randomUser.id,
      fromUserName: randomUser.name,
      offeredFragment: requested,
      offeredCount: 1,
      requestedFragment: offered,
      requestedCount: 1,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    set((state) => ({
      tradeOffers: [...state.tradeOffers, offer, receivedOffer],
    }));
  },

  acceptTradeOffer: (offerId) => {
    set((state) => {
      const offer = state.tradeOffers.find((o) => o.id === offerId);
      if (!offer || offer.status !== 'pending') return state;

      if (offer.fromUserId !== state.currentUserId) {
        const newCollected = [...state.collectedFragments];

        const offeredExisting = newCollected.find(
          (f) => f.fragmentId === offer.offeredFragment.id
        );
        if (offeredExisting) {
          offeredExisting.count += 1;
        } else {
          newCollected.push({
            fragmentId: offer.offeredFragment.id,
            schoolId: offer.offeredFragment.schoolId,
            collectedAt: new Date().toISOString(),
            source: 'trade',
            count: 1,
          });
        }

        const requestedExisting = newCollected.find(
          (f) => f.fragmentId === offer.requestedFragment.id
        );
        if (requestedExisting) {
          requestedExisting.count = Math.max(0, requestedExisting.count - 1);
        }

        return {
          tradeOffers: state.tradeOffers.map((o) =>
            o.id === offerId ? { ...o, status: 'accepted' as const } : o
          ),
          collectedFragments: newCollected.filter((f) => f.count > 0),
        };
      }

      return {
        tradeOffers: state.tradeOffers.map((o) =>
          o.id === offerId ? { ...o, status: 'accepted' as const } : o
        ),
      };
    });
  },

  rejectTradeOffer: (offerId) => {
    set((state) => ({
      tradeOffers: state.tradeOffers.map((o) =>
        o.id === offerId ? { ...o, status: 'rejected' as const } : o
      ),
    }));
  },

  getReceivedTradeOffers: () => {
    return get().tradeOffers.filter((o) => o.fromUserId !== get().currentUserId);
  },

  getSentTradeOffers: () => {
    return get().tradeOffers.filter((o) => o.fromUserId === get().currentUserId);
  },

  getTotalCollectedCount: () => {
    return get().collectedFragments.length;
  },

  getTotalFragmentCount: () => {
    return get().getAllFragments().length;
  },

  checkSchoolCompletion: (schoolId) => {
    return getStateCompletion(schoolId, get().collectedFragments);
  },

  grantCraftingReward: (schoolId) => {
    const school = SCHOOLS.find((s) => s.id === schoolId);
    if (!school) return null;

    const fragment = get().getRandomUncollectedFragment(schoolId, 'crafting');
    if (fragment) {
      get().collectFragment(fragment.id, 'crafting');
      set({ rewardFragment: fragment, showRewardModal: true });
      return fragment;
    }
    return null;
  },
}));

function getStateCompletion(schoolId: SchoolId, collectedFragments: CollectedFragment[]): boolean {
  const allFragments = generateFragmentsForSchool(schoolId);
  return allFragments.every((f) =>
    collectedFragments.some((c) => c.fragmentId === f.id)
  );
}
