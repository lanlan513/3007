import { useState, useEffect } from 'react';
import { useSchoolStore } from '@/store/useSchoolStore';
import { SCHOOLS, FRAGMENT_RARITY_INFO, FRAGMENT_TYPE_INFO } from '@/types/fan';
import type { SchoolId, FanSchool, SchoolFragment } from '@/types/fan';
import {
  BookOpen,
  MapPin,
  Sparkles,
  Compass,
  HelpCircle,
  Hammer,
  Repeat,
  X,
  Check,
  Star,
  Lock,
  ChevronRight,
  Award,
  Crown,
  Users,
  Send,
  ArrowRightLeft,
  Package,
  Scroll,
  Brush,
  History,
  Gift,
} from 'lucide-react';

const DIFFICULTY_INFO: Record<string, { label: string; color: string; bgColor: string }> = {
  beginner: { label: '入门', color: 'text-bamboo-600', bgColor: 'bg-bamboo-100' },
  intermediate: { label: '进阶', color: 'text-gold-600', bgColor: 'bg-gold-100' },
  advanced: { label: '高级', color: 'text-vermilion-600', bgColor: 'bg-vermilion-100' },
  master: { label: '宗师', color: 'text-ink-700', bgColor: 'bg-ink-100' },
};

const SOURCE_INFO: Record<string, { label: string; icon: string }> = {
  explore: { label: '探索获得', icon: '🧭' },
  quiz: { label: '答题获得', icon: '❓' },
  crafting: { label: '制作获得', icon: '✨' },
  trade: { label: '交换获得', icon: '🔄' },
  gift: { label: '赠送获得', icon: '🎁' },
};

export default function SchoolCollection() {
  const {
    getSchoolProgress,
    completedSchools,
    currentExploringSchool,
    exploreProgress,
    activeFragment,
    showFragmentModal,
    showQuizModal,
    showTradeModal,
    getTotalCollectedCount,
    getTotalFragmentCount,
    setShowFragmentModal,
    setShowTradeModal,
    users,
  } = useSchoolStore();

  const [activeTab, setActiveTab] = useState<'collection' | 'explore' | 'trade'>('collection');
  const [selectedSchool, setSelectedSchool] = useState<SchoolId | null>(null);

  const totalCollected = getTotalCollectedCount();
  const totalFragments = getTotalFragmentCount();
  const overallProgress = Math.round((totalCollected / totalFragments) * 100);

  return (
    <div className="min-h-screen bg-paper-50 pt-20 md:pt-24 pb-12">
      <div className="container mx-auto px-6">
        <CollectionHeader
          totalCollected={totalCollected}
          totalFragments={totalFragments}
          overallProgress={overallProgress}
          completedCount={completedSchools.length}
        />

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <TabButton
            active={activeTab === 'collection'}
            onClick={() => setActiveTab('collection')}
            icon={<BookOpen size={16} />}
            label="流派图鉴"
          />
          <TabButton
            active={activeTab === 'explore'}
            onClick={() => setActiveTab('explore')}
            icon={<Compass size={16} />}
            label="探索获取"
            badge={currentExploringSchool ? 1 : 0}
          />
          <TabButton
            active={activeTab === 'trade'}
            onClick={() => setActiveTab('trade')}
            icon={<ArrowRightLeft size={16} />}
            label="碎片交换"
          />
        </div>

        {activeTab === 'collection' && (
          <CollectionSection
            selectedSchool={selectedSchool}
            onSelectSchool={setSelectedSchool}
            onSwitchTab={setActiveTab}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreSection />
        )}

        {activeTab === 'trade' && (
          <TradeSection />
        )}
      </div>

      {showFragmentModal && activeFragment && (
        <FragmentModal fragment={activeFragment} onClose={() => setShowFragmentModal(false)} />
      )}

      {showQuizModal && (
        <QuizModal />
      )}

      {showTradeModal && (
        <CreateTradeModal onClose={() => setShowTradeModal(false)} />
      )}
    </div>
  );
}

function CollectionHeader({
  totalCollected,
  totalFragments,
  overallProgress,
  completedCount,
}: {
  totalCollected: number;
  totalFragments: number;
  overallProgress: number;
  completedCount: number;
}) {
  return (
    <div className="bg-gradient-to-r from-vermilion-600 via-vermilion-500 to-gold-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-3 mb-2">
            <span className="w-px h-4 bg-white/40" />
            <span className="text-white/80 font-serif-sc text-sm tracking-widest">流派图鉴</span>
            <span className="w-px h-4 bg-white/40" />
          </div>
          <h1 className="font-serif-sc text-3xl md:text-4xl font-bold mb-2">扇韵千秋</h1>
          <p className="text-white/70 text-sm">
            探索六大名扇流派，收集图鉴碎片，传承千年扇文化
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[180px]">
            <div className="flex items-center gap-2 mb-2">
              <Package size={18} className="text-gold-300" />
              <span className="font-serif-sc font-bold text-lg">{totalCollected}</span>
              <span className="text-white/70 text-sm">/ {totalFragments} 碎片</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Crown size={16} className="text-gold-300" />
              <span className="text-sm">{completedCount} / {SCHOOLS.length} 流派</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-300 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-serif-sc text-sm transition-all whitespace-nowrap ${
        active
          ? 'bg-vermilion-500 text-white shadow-md'
          : 'bg-white text-ink-600 border border-paper-200 hover:border-vermilion-300'
      }`}
    >
      {icon}
      {label}
      {badge && badge > 0 && (
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          active ? 'bg-white/20' : 'bg-gold-100 text-gold-600'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function CollectionSection({
  selectedSchool,
  onSelectSchool,
  onSwitchTab,
}: {
  selectedSchool: SchoolId | null;
  onSelectSchool: (id: SchoolId | null) => void;
  onSwitchTab: (tab: 'collection' | 'explore' | 'trade') => void;
}) {
  const { getSchoolProgress, completedSchools } = useSchoolStore();

  if (selectedSchool) {
    return (
      <SchoolDetail
        schoolId={selectedSchool}
        onBack={() => onSelectSchool(null)}
        onSwitchTab={onSwitchTab}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {SCHOOLS.map((school, index) => {
        const progress = getSchoolProgress(school.id);
        const isCompleted = completedSchools.includes(school.id);

        return (
          <SchoolCard
            key={school.id}
            school={school}
            progress={progress}
            isCompleted={isCompleted}
            index={index}
            onClick={() => onSelectSchool(school.id)}
          />
        );
      })}
    </div>
  );
}

function SchoolCard({
  school,
  progress,
  isCompleted,
  index,
  onClick,
}: {
  school: FanSchool;
  progress: number;
  isCompleted: boolean;
  index: number;
  onClick: () => void;
}) {
  const difficultyInfo = DIFFICULTY_INFO[school.difficulty];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-elegant overflow-hidden transition-all duration-300 hover:shadow-elegant-hover hover:-translate-y-1 cursor-pointer opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'forwards' }}
    >
      <div className="relative h-36 bg-gradient-to-br from-paper-100 to-paper-200 flex items-center justify-center">
        <div className="text-6xl">{school.style.icon}</div>
        {isCompleted && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-gold-500 text-white rounded-full">
            <Crown size={12} />
            <span className="text-xs font-medium">已集齐</span>
          </div>
        )}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium ${difficultyInfo.bgColor} ${difficultyInfo.color}`}>
          {difficultyInfo.label}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-serif-sc font-bold text-xl text-ink-800">{school.name}</h4>
            <div className="flex items-center gap-1 text-xs text-ink-400 mt-0.5">
              <MapPin size={11} />
              <span>{school.origin}</span>
            </div>
          </div>
          <span className="text-2xl font-serif-sc text-paper-300">{school.shortName}</span>
        </div>

        <p className="text-sm text-ink-500 mb-4 line-clamp-2">{school.description}</p>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-ink-400">代表名扇:</span>
          <div className="flex flex-wrap gap-1">
            {school.representativeFans.slice(0, 2).map((fan) => (
              <span key={fan} className="px-1.5 py-0.5 bg-paper-100 text-ink-500 text-xs rounded">
                {fan}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-paper-100">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-ink-500">收集进度</span>
            <span className="font-bold text-vermilion-600">{progress}%</span>
          </div>
          <div className="h-2 bg-paper-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted ? 'bg-gradient-to-r from-gold-400 to-gold-500' : 'bg-gradient-to-r from-vermilion-400 to-vermilion-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SchoolDetail({
  schoolId,
  onBack,
  onSwitchTab,
}: {
  schoolId: SchoolId;
  onBack: () => void;
  onSwitchTab: (tab: 'collection' | 'explore' | 'trade') => void;
}) {
  const {
    getFragmentsBySchool,
    getCollectedFragmentsBySchool,
    isFragmentCollected,
    getFragmentCount,
    getSchoolProgress,
    completedSchools,
    setActiveFragment,
    setShowFragmentModal,
    startExploration,
    openQuiz,
    currentExploringSchool,
    grantCraftingReward,
  } = useSchoolStore();

  const school = SCHOOLS.find((s) => s.id === schoolId)!;
  const allFragments = getFragmentsBySchool(schoolId);
  const collected = getCollectedFragmentsBySchool(schoolId);
  const progress = getSchoolProgress(schoolId);
  const isCompleted = completedSchools.includes(schoolId);
  const isExploring = currentExploringSchool === schoolId;
  const difficultyInfo = DIFFICULTY_INFO[school.difficulty];

  const handleExplore = () => {
    startExploration(schoolId);
    onSwitchTab('explore');
  };

  const handleQuiz = () => {
    openQuiz(schoolId);
  };

  const handleCrafting = () => {
    const { getRandomUncollectedFragment, collectFragment, setShowRewardModal } = useSchoolStore.getState();
    const fragment = getRandomUncollectedFragment(schoolId, 'crafting');
    if (fragment) {
      collectFragment(fragment.id, 'crafting');
      setActiveFragment(fragment);
      setShowFragmentModal(true);
      setShowRewardModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-paper-200 rounded-xl text-ink-600 hover:border-vermilion-300 transition-colors"
      >
        <ChevronRight size={16} className="rotate-180" />
        返回流派列表
      </button>

      <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-paper-100 to-paper-200 flex items-center justify-center">
          <div className="text-8xl">{school.style.icon}</div>
          {isCompleted && (
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-gold-500 text-white rounded-full">
              <Crown size={16} />
              <span className="font-medium">该流派已集齐</span>
            </div>
          )}
          <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-medium ${difficultyInfo.bgColor} ${difficultyInfo.color}`}>
            {difficultyInfo.label}难度
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h2 className="font-serif-sc text-3xl font-bold text-ink-800 mb-2">{school.name}</h2>
              <div className="flex items-center gap-3 text-ink-500">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {school.origin}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Star size={14} />
                  {progress}% 收集进度
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ActionButton
                icon={<Compass size={16} />}
                label={isExploring ? '探索中...' : '探索流派'}
                onClick={handleExplore}
                variant="vermilion"
              />
              <ActionButton
                icon={<HelpCircle size={16} />}
                label="知识问答"
                onClick={handleQuiz}
                variant="gold"
              />
              <ActionButton
                icon={<Hammer size={16} />}
                label="制作获取"
                onClick={handleCrafting}
                variant="bamboo"
              />
            </div>
          </div>

          <p className="text-ink-600 leading-relaxed mb-6">{school.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <InfoCard
              icon={<Brush size={18} />}
              title="艺术风格"
              content={
                <div>
                  <h4 className="font-serif-sc font-bold text-ink-800 mb-1">{school.style.name}</h4>
                  <p className="text-sm text-ink-500">{school.style.description}</p>
                </div>
              }
            />
            <InfoCard
              icon={<Scroll size={18} />}
              title="发展历史"
              content={<p className="text-sm text-ink-500 leading-relaxed line-clamp-3">{school.history}</p>}
            />
          </div>

          <div className="mb-6">
            <h3 className="font-serif-sc font-bold text-lg text-ink-800 mb-3 flex items-center gap-2">
              <Users size={18} className="text-vermilion-500" />
              历代名家
            </h3>
            <div className="flex flex-wrap gap-2">
              {school.famousArtisans.map((artisan) => (
                <span
                  key={artisan}
                  className="px-3 py-1.5 bg-paper-50 text-ink-700 rounded-lg border border-paper-200 text-sm"
                >
                  {artisan}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-serif-sc font-bold text-lg text-ink-800 mb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-gold-500" />
              代表名扇
            </h3>
            <div className="flex flex-wrap gap-2">
              {school.representativeFans.map((fan) => (
                <span
                  key={fan}
                  className="px-3 py-1.5 bg-gold-50 text-gold-700 rounded-lg border border-gold-200 text-sm"
                >
                  {fan}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif-sc font-bold text-lg text-ink-800 mb-4 flex items-center gap-2">
              <Award size={18} className="text-bamboo-500" />
              图鉴碎片 ({collected.length} / {allFragments.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allFragments.map((fragment) => {
                const collected = isFragmentCollected(fragment.id);
                const count = getFragmentCount(fragment.id);
                const rarityInfo = FRAGMENT_RARITY_INFO[fragment.rarity];
                const typeInfo = FRAGMENT_TYPE_INFO[fragment.type];

                return (
                  <FragmentCard
                    key={fragment.id}
                    fragment={fragment}
                    collected={collected}
                    count={count}
                    rarityInfo={rarityInfo}
                    typeInfo={typeInfo}
                    onClick={() => {
                      if (collected) {
                        setActiveFragment(fragment);
                        setShowFragmentModal(true);
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant: 'vermilion' | 'gold' | 'bamboo';
}) {
  const variants = {
    vermilion: 'bg-vermilion-500 hover:bg-vermilion-600 text-white',
    gold: 'bg-gold-500 hover:bg-gold-600 text-white',
    bamboo: 'bg-bamboo-500 hover:bg-bamboo-600 text-white',
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-serif-sc text-sm transition-all shadow-md hover:shadow-lg ${variants[variant]}`}
    >
      {icon}
      {label}
    </button>
  );
}

function InfoCard({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}) {
  return (
    <div className="bg-paper-50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-white text-vermilion-500 flex items-center justify-center">
          {icon}
        </div>
        <h4 className="font-serif-sc font-bold text-ink-800">{title}</h4>
      </div>
      {content}
    </div>
  );
}

function FragmentCard({
  fragment,
  collected,
  count,
  rarityInfo,
  typeInfo,
  onClick,
}: {
  fragment: SchoolFragment;
  collected: boolean;
  count: number;
  rarityInfo: { label: string; color: string; bgColor: string };
  typeInfo: { label: string; icon: string };
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`relative p-4 rounded-xl border-2 transition-all ${
        collected
          ? 'border-paper-200 bg-white hover:border-vermilion-300 hover:shadow-md cursor-pointer'
          : 'border-paper-100 bg-paper-50 opacity-60'
      }`}
    >
      {!collected && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/50 backdrop-blur-[1px]">
          <Lock size={24} className="text-ink-400" />
        </div>
      )}

      {count > 1 && collected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-vermilion-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {count}
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="text-3xl">{collected ? fragment.icon : '❓'}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h5 className={`font-serif-sc font-bold text-sm truncate ${collected ? 'text-ink-800' : 'text-ink-400'}`}>
              {collected ? fragment.title : '???'}
            </h5>
          </div>
          <div className="flex flex-wrap gap-1">
            <span className={`px-1.5 py-0.5 rounded text-xs ${rarityInfo.bgColor} ${rarityInfo.color}`}>
              {rarityInfo.label}
            </span>
            <span className="px-1.5 py-0.5 rounded text-xs bg-paper-100 text-ink-500">
              {typeInfo.icon} {typeInfo.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExploreSection() {
  const {
    currentExploringSchool,
    exploreProgress,
    progressExploration,
    cancelExploration,
    startExploration,
  } = useSchoolStore();

  const [exploring, setExploring] = useState(false);

  const handleProgress = () => {
    if (exploring || !currentExploringSchool) return;
    setExploring(true);
    progressExploration();
    setTimeout(() => setExploring(false), 500);
  };

  useEffect(() => {
    if (!currentExploringSchool && exploring) {
      setExploring(false);
    }
  }, [currentExploringSchool, exploring]);

  if (!currentExploringSchool) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-elegant p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-vermilion-100 text-vermilion-600 flex items-center justify-center">
              <Compass size={20} />
            </div>
            <div>
              <h3 className="font-serif-sc text-lg font-bold text-ink-800">探索流派</h3>
              <p className="text-sm text-ink-400">选择一个流派开始探索，有机会获得图鉴碎片</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {SCHOOLS.map((school) => (
              <button
                key={school.id}
                onClick={() => startExploration(school.id)}
                className="p-4 rounded-xl border-2 border-paper-200 hover:border-vermilion-300 hover:bg-vermilion-50 transition-all text-center"
              >
                <div className="text-4xl mb-2">{school.style.icon}</div>
                <div className="font-serif-sc font-bold text-ink-800">{school.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-bamboo-50 to-paper-50 rounded-2xl p-6 border border-bamboo-200">
          <div className="flex items-start gap-3">
            <div className="text-3xl">💡</div>
            <div>
              <h4 className="font-serif-sc font-bold text-ink-800 mb-2">探索小提示</h4>
              <ul className="space-y-1 text-sm text-ink-600">
                <li>• 每次探索需要多次点击"继续探索"推进进度</li>
                <li>• 探索完成后有机会获得该流派的图鉴碎片</li>
                <li>• 首次探索某流派更容易获得稀有碎片</li>
                <li>• 还可以通过答题和制作扇子获得更多碎片</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const school = SCHOOLS.find((s) => s.id === currentExploringSchool)!;

  return (
    <div className="bg-white rounded-2xl shadow-elegant p-8">
      <div className="max-w-md mx-auto text-center">
        <div className="relative w-40 h-40 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-vermilion-100 to-gold-100 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-paper-100 to-paper-50 flex items-center justify-center">
            <span className="text-6xl">{school.style.icon}</span>
          </div>
        </div>

        <h3 className="font-serif-sc text-2xl font-bold text-ink-800 mb-2">正在探索{school.name}</h3>
        <p className="text-ink-500 mb-4">{school.origin} · {school.style.name}</p>

        <div className="bg-gradient-to-r from-bamboo-50 to-gold-50 rounded-xl p-4 mb-6 border border-bamboo-200">
          <div className="flex items-start gap-3 text-left">
            <div className="text-2xl">💡</div>
            <div className="flex-1">
              <p className="font-serif-sc font-bold text-ink-800 mb-1">探索指南</p>
              <p className="text-sm text-ink-600">点击下方「继续探索」按钮推进进度，进度满100%后有机会获得该流派的图鉴碎片！</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-ink-500">探索进度</span>
            <span className="font-bold text-vermilion-600 text-lg">{exploreProgress}%</span>
          </div>
          <div className="h-4 bg-paper-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-vermilion-400 via-vermilion-500 to-gold-400 rounded-full transition-all duration-500 relative"
              style={{ width: `${exploreProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-ink-400 mt-1">
            <span>起步</span>
            <span>深入</span>
            <span>发现</span>
            <span>收获</span>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-center">
          <button
            onClick={cancelExploration}
            className="px-5 py-2.5 border border-paper-200 rounded-xl text-ink-600 hover:bg-paper-50 transition-colors"
          >
            取消探索
          </button>
          <button
            onClick={handleProgress}
            disabled={exploring}
            className={`flex items-center gap-2 px-8 py-3 font-serif-sc font-bold rounded-xl hover:shadow-lg hover:shadow-vermilion-500/30 transition-all ${
              exploring
                ? 'bg-gradient-to-r from-ink-400 to-ink-500 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-vermilion-500 to-gold-500 text-white hover:shadow-lg hover:shadow-vermilion-500/30'
            }`}
          >
            <Compass size={18} className={exploring ? 'animate-spin' : ''} />
            {exploring ? '探索中...' : '继续探索'}
          </button>
        </div>

        <p className="text-xs text-ink-400 mt-4">
          提示：每次探索大约需要点击 3-5 次「继续探索」即可完成
        </p>
      </div>
    </div>
  );
}

function TradeSection() {
  const {
    getReceivedTradeOffers,
    getSentTradeOffers,
    acceptTradeOffer,
    rejectTradeOffer,
    setShowTradeModal,
    isFragmentCollected,
    getFragmentCount,
    getFragmentById,
    collectedFragments,
  } = useSchoolStore();

  const [tradeTab, setTradeTab] = useState<'received' | 'sent'>('received');

  const receivedOffers = getReceivedTradeOffers();
  const sentOffers = getSentTradeOffers();
  const duplicateFragments = collectedFragments.filter((f) => f.count > 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTradeTab('received')}
            className={`px-4 py-2 rounded-xl font-serif-sc text-sm transition-all ${
              tradeTab === 'received'
                ? 'bg-vermilion-500 text-white'
                : 'bg-white border border-paper-200 text-ink-600 hover:border-vermilion-300'
            }`}
          >
            收到的请求 ({receivedOffers.filter((o) => o.status === 'pending').length})
          </button>
          <button
            onClick={() => setTradeTab('sent')}
            className={`px-4 py-2 rounded-xl font-serif-sc text-sm transition-all ${
              tradeTab === 'sent'
                ? 'bg-vermilion-500 text-white'
                : 'bg-white border border-paper-200 text-ink-600 hover:border-vermilion-300'
            }`}
          >
            发出的请求 ({sentOffers.filter((o) => o.status === 'pending').length})
          </button>
        </div>
        <button
          onClick={() => setShowTradeModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white font-serif-sc text-sm rounded-xl hover:bg-gold-600 transition-colors"
        >
          <Send size={16} />
          发起交换
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
        {tradeTab === 'received' && receivedOffers.length === 0 ? (
          <EmptyState icon="📭" title="暂无收到的交换请求" description="耐心等待，其他藏友可能正在给你发送请求" />
        ) : tradeTab === 'sent' && sentOffers.length === 0 ? (
          <EmptyState icon="📤" title="暂无发出的交换请求" description="点击右上角发起交换，与其他藏友互通有无" />
        ) : (
          <div className="divide-y divide-paper-100">
            {(tradeTab === 'received' ? receivedOffers : sentOffers).map((offer) => (
              <TradeOfferCard
                key={offer.id}
                offer={offer}
                isReceived={tradeTab === 'received'}
                onAccept={() => acceptTradeOffer(offer.id)}
                onReject={() => rejectTradeOffer(offer.id)}
              />
            ))}
          </div>
        )}
      </div>

      {duplicateFragments.length > 0 && (
        <div className="bg-gradient-to-r from-gold-50 to-paper-50 rounded-2xl p-6 border border-gold-200">
          <h3 className="font-serif-sc font-bold text-ink-800 mb-4 flex items-center gap-2">
            <Gift size={18} className="text-gold-500" />
            可交换的重复碎片 ({duplicateFragments.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {duplicateFragments.map((cf) => {
              const fragment = getFragmentById(cf.fragmentId);
              if (!fragment) return null;
              const rarityInfo = FRAGMENT_RARITY_INFO[fragment.rarity];
              const school = SCHOOLS.find((s) => s.id === cf.schoolId);

              return (
                <div
                  key={cf.fragmentId}
                  className="p-3 bg-white rounded-lg border border-gold-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl">{fragment.icon}</span>
                    <span className="px-1.5 py-0.5 rounded text-xs bg-vermilion-100 text-vermilion-600">
                      x{cf.count - 1}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-ink-700 truncate">{fragment.title}</div>
                  <div className={`text-xs mt-0.5 ${rarityInfo.color}`}>
                    {school?.name} · {rarityInfo.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function TradeOfferCard({
  offer,
  isReceived,
  onAccept,
  onReject,
}: {
  offer: ReturnType<typeof useSchoolStore.getState>['tradeOffers'][0];
  isReceived: boolean;
  onAccept: () => void;
  onReject: () => void;
}) {
  const statusInfo = {
    pending: { label: '待处理', color: 'text-gold-600', bgColor: 'bg-gold-100' },
    accepted: { label: '已接受', color: 'text-bamboo-600', bgColor: 'bg-bamboo-100' },
    rejected: { label: '已拒绝', color: 'text-vermilion-600', bgColor: 'bg-vermilion-100' },
    expired: { label: '已过期', color: 'text-ink-500', bgColor: 'bg-ink-100' },
  }[offer.status];

  const offeredRarity = FRAGMENT_RARITY_INFO[offer.offeredFragment.rarity];
  const requestedRarity = FRAGMENT_RARITY_INFO[offer.requestedFragment.rarity];
  const offeredSchool = SCHOOLS.find((s) => s.id === offer.offeredFragment.schoolId);
  const requestedSchool = SCHOOLS.find((s) => s.id === offer.requestedFragment.schoolId);

  return (
    <div className="p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {isReceived && <span className="text-2xl">🧑‍🎨</span>}
          <div>
            <div className="font-serif-sc font-bold text-ink-800">
              {isReceived ? offer.fromUserName : '我'}
            </div>
            <div className="text-xs text-ink-400">
              {new Date(offer.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 p-3 bg-paper-50 rounded-xl">
          <div className="text-xs text-ink-400 mb-1">{isReceived ? '对方提供' : '我提供'}</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{offer.offeredFragment.icon}</span>
            <div>
              <div className="font-medium text-ink-800 text-sm">{offer.offeredFragment.title}</div>
              <div className={`text-xs ${offeredRarity.color}`}>
                {offeredSchool?.name} · {offeredRarity.label}
              </div>
            </div>
          </div>
        </div>

        <div className="text-2xl text-ink-300">
          <Repeat size={20} />
        </div>

        <div className="flex-1 p-3 bg-paper-50 rounded-xl">
          <div className="text-xs text-ink-400 mb-1">{isReceived ? '对方想要' : '我想要'}</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{offer.requestedFragment.icon}</span>
            <div>
              <div className="font-medium text-ink-800 text-sm">{offer.requestedFragment.title}</div>
              <div className={`text-xs ${requestedRarity.color}`}>
                {requestedSchool?.name} · {requestedRarity.label}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isReceived && offer.status === 'pending' && (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={onReject}
            className="px-4 py-2 border border-paper-200 rounded-xl text-ink-600 text-sm hover:bg-paper-50 transition-colors"
          >
            拒绝
          </button>
          <button
            onClick={onAccept}
            className="flex items-center gap-1 px-4 py-2 bg-bamboo-500 text-white text-sm rounded-xl hover:bg-bamboo-600 transition-colors"
          >
            <Check size={14} />
            接受交换
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-12 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="font-serif-sc text-xl font-bold text-ink-800 mb-2">{title}</h3>
      <p className="text-ink-400">{description}</p>
    </div>
  );
}

function FragmentModal({
  fragment,
  onClose,
}: {
  fragment: SchoolFragment;
  onClose: () => void;
}) {
  const { getFragmentCount, collectedFragments } = useSchoolStore();
  const count = getFragmentCount(fragment.id);
  const rarityInfo = FRAGMENT_RARITY_INFO[fragment.rarity];
  const typeInfo = FRAGMENT_TYPE_INFO[fragment.type];
  const school = SCHOOLS.find((s) => s.id === fragment.schoolId);
  const collected = collectedFragments.find((f) => f.fragmentId === fragment.id);
  const sourceInfo = collected ? SOURCE_INFO[collected.source] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-800/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-elegant-hover w-full max-w-md overflow-hidden opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
        <div className={`relative p-8 text-center ${
          fragment.rarity === 'legendary'
            ? 'bg-gradient-to-br from-gold-400 via-vermilion-500 to-gold-400'
            : fragment.rarity === 'epic'
            ? 'bg-gradient-to-br from-gold-400 to-gold-600'
            : fragment.rarity === 'rare'
            ? 'bg-gradient-to-br from-bamboo-400 to-bamboo-600'
            : 'bg-gradient-to-br from-ink-400 to-ink-600'
        } text-white`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>

          <div className="mb-4 flex justify-center">
            {fragment.rarity === 'legendary' ? (
              <Crown size={40} className="text-gold-300" />
            ) : fragment.rarity === 'epic' ? (
              <Award size={40} className="text-gold-300" />
            ) : (
              <Star size={40} className="text-white/80" />
            )}
          </div>

          <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-3">
            {rarityInfo.label}碎片
          </div>

          <div className="text-6xl mb-3">{fragment.icon}</div>
          <h3 className="font-serif-sc text-2xl font-bold mb-1">{fragment.title}</h3>
          <p className="text-white/70 text-sm">{school?.name} · {typeInfo.label}</p>
        </div>

        <div className="p-6">
          <div className="bg-paper-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <History size={14} className="text-vermilion-500" />
              <span className="text-xs font-bold text-ink-700">图鉴内容</span>
            </div>
            <p className="text-sm text-ink-600 leading-relaxed">{fragment.content}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3 bg-paper-50 rounded-xl text-center">
              <p className="text-ink-400 text-xs mb-1">持有数量</p>
              <p className="text-xl font-bold text-vermilion-600">{count}</p>
            </div>
            {sourceInfo && (
              <div className="p-3 bg-paper-50 rounded-xl text-center">
                <p className="text-ink-400 text-xs mb-1">获得方式</p>
                <p className="text-lg">{sourceInfo.icon} {sourceInfo.label}</p>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-vermilion-500 to-gold-500 text-white font-serif-sc font-bold rounded-xl hover:shadow-lg hover:shadow-vermilion-500/30 transition-all"
          >
            太好了
          </button>
        </div>
      </div>
    </div>
  );
}

function QuizModal() {
  const { selectedSchoolForQuiz, getQuizQuestions, answerQuiz, closeQuiz, setActiveFragment, setShowFragmentModal } = useSchoolStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [earnedFragment, setEarnedFragment] = useState<SchoolFragment | null>(null);

  if (!selectedSchoolForQuiz) return null;

  const questions = getQuizQuestions(selectedSchoolForQuiz);
  const question = questions[currentQuestionIndex];
  const school = SCHOOLS.find((s) => s.id === selectedSchoolForQuiz);

  if (!question || !school) return null;

  const handleSelectOption = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === question.correctIndex;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      const result = answerQuiz(question.id, true);
      setEarnedFragment(result);
    } else {
      answerQuiz(question.id, false);
      setEarnedFragment(null);
    }
  };

  const handleNext = () => {
    if (earnedFragment) {
      setActiveFragment(earnedFragment);
      setShowFragmentModal(true);
      setEarnedFragment(null);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      closeQuiz();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-800/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-elegant-hover w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-vermilion-500 to-gold-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/20 rounded-full text-sm mb-2">
                <HelpCircle size={14} />
                {school.name}知识问答
              </div>
              <h3 className="font-serif-sc text-2xl font-bold">第 {currentQuestionIndex + 1} / {questions.length} 题</h3>
            </div>
            <button onClick={closeQuiz} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="font-serif-sc text-lg font-bold text-ink-800 mb-5">{question.question}</p>

          <div className="space-y-2 mb-6">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrectOption = index === question.correctIndex;
              let optionStyle = 'border-paper-200 hover:border-vermilion-300';

              if (showResult) {
                if (isCorrectOption) {
                  optionStyle = 'border-bamboo-400 bg-bamboo-50';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'border-vermilion-400 bg-vermilion-50';
                } else {
                  optionStyle = 'border-paper-200 opacity-50';
                }
              } else if (isSelected) {
                optionStyle = 'border-vermilion-400 bg-vermilion-50';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                      isSelected ? 'bg-vermilion-500 text-white' : 'bg-paper-100 text-ink-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-ink-700">{option}</span>
                    {showResult && isCorrectOption && <Check size={18} className="ml-auto text-bamboo-500" />}
                    {showResult && isSelected && !isCorrect && <X size={18} className="ml-auto text-vermilion-500" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className={`p-4 rounded-xl mb-5 ${isCorrect ? 'bg-bamboo-50 border border-bamboo-200' : 'bg-vermilion-50 border border-vermilion-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <Check size={18} className="text-bamboo-600" />
                ) : (
                  <X size={18} className="text-vermilion-600" />
                )}
                <span className={`font-bold ${isCorrect ? 'text-bamboo-700' : 'text-vermilion-700'}`}>
                  {isCorrect ? '回答正确！' : '回答错误'}
                </span>
              </div>
              <p className="text-sm text-ink-600 mb-2">{question.explanation}</p>
              {isCorrect && earnedFragment && (
                <div className="mt-3 pt-3 border-t border-bamboo-200 flex items-center gap-3">
                  <div className="text-3xl">{earnedFragment.icon}</div>
                  <div className="flex-1">
                    <p className="font-bold text-ink-800 text-sm">🎁 获得碎片奖励</p>
                    <p className="text-xs text-ink-600">{earnedFragment.title}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    earnedFragment.rarity === 'legendary' ? 'bg-vermilion-100 text-vermilion-600' :
                    earnedFragment.rarity === 'epic' ? 'bg-gold-100 text-gold-600' :
                    earnedFragment.rarity === 'rare' ? 'bg-bamboo-100 text-bamboo-600' :
                    'bg-ink-100 text-ink-600'
                  }`}>
                    {FRAGMENT_RARITY_INFO[earnedFragment.rarity].label}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className={`flex-1 py-3 font-serif-sc font-bold rounded-xl transition-all ${
                  selectedOption !== null
                    ? 'bg-gradient-to-r from-vermilion-500 to-gold-500 text-white hover:shadow-lg hover:shadow-vermilion-500/30'
                    : 'bg-paper-200 text-ink-400 cursor-not-allowed'
                }`}
              >
                确认答案
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 py-3 bg-gradient-to-r from-vermilion-500 to-gold-500 text-white font-serif-sc font-bold rounded-xl hover:shadow-lg hover:shadow-vermilion-500/30 transition-all"
              >
                {currentQuestionIndex < questions.length - 1 ? '下一题' : '完成答题'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateTradeModal({ onClose }: { onClose: () => void }) {
  const {
    collectedFragments,
    getFragmentById,
    getAllFragments,
    isFragmentCollected,
    createTradeOffer,
    setShowTradeModal,
  } = useSchoolStore();

  const [offeredFragmentId, setOfferedFragmentId] = useState<string | null>(null);
  const [requestedFragmentId, setRequestedFragmentId] = useState<string | null>(null);
  const [step, setStep] = useState<'offer' | 'request'>('offer');

  const duplicateFragments = collectedFragments
    .filter((f) => f.count > 1)
    .map((f) => getFragmentById(f.fragmentId))
    .filter(Boolean) as SchoolFragment[];

  const uncollectedFragments = getAllFragments().filter((f) => !isFragmentCollected(f.id));

  const handleCreate = () => {
    if (offeredFragmentId && requestedFragmentId) {
      createTradeOffer(offeredFragmentId, requestedFragmentId);
      setShowTradeModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-800/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-elegant-hover w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-gold-500 to-vermilion-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/20 rounded-full text-sm mb-2">
                <Repeat size={14} />
                碎片交换
              </div>
              <h3 className="font-serif-sc text-2xl font-bold">
                {step === 'offer' ? '选择你要交换出去的碎片' : '选择你想要获得的碎片'}
              </h3>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex items-center gap-2 mb-5">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
              step === 'offer' ? 'bg-gold-100 text-gold-700' : 'bg-paper-100 text-ink-500'
            }`}>
              <span>1</span> 选择提供
            </div>
            <div className="flex-1 h-px bg-paper-200" />
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
              step === 'request' ? 'bg-vermilion-100 text-vermilion-700' : 'bg-paper-100 text-ink-500'
            }`}>
              <span>2</span> 选择想要
            </div>
          </div>

          {step === 'offer' ? (
            <div>
              {duplicateFragments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📦</div>
                  <h4 className="font-serif-sc font-bold text-ink-800 mb-2">暂无可交换的碎片</h4>
                  <p className="text-ink-400 text-sm">收集到重复碎片后才能发起交换</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {duplicateFragments.map((fragment) => {
                    const rarityInfo = FRAGMENT_RARITY_INFO[fragment.rarity];
                    const school = SCHOOLS.find((s) => s.id === fragment.schoolId);
                    const isSelected = offeredFragmentId === fragment.id;

                    return (
                      <button
                        key={fragment.id}
                        onClick={() => {
                          setOfferedFragmentId(fragment.id);
                          setStep('request');
                        }}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-gold-400 bg-gold-50'
                            : 'border-paper-200 hover:border-gold-300 hover:bg-paper-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{fragment.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-ink-800 truncate">{fragment.title}</div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className={`px-1.5 py-0.5 rounded text-xs ${rarityInfo.bgColor} ${rarityInfo.color}`}>
                                {rarityInfo.label}
                              </span>
                              <span className="text-xs text-ink-400">{school?.name}</span>
                            </div>
                          </div>
                          {isSelected && <Check size={18} className="text-gold-500" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              {uncollectedFragments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🎉</div>
                  <h4 className="font-serif-sc font-bold text-ink-800 mb-2">你已收集所有碎片！</h4>
                  <p className="text-ink-400 text-sm">太棒了，你是真正的扇文化收藏家</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {uncollectedFragments.map((fragment) => {
                    const rarityInfo = FRAGMENT_RARITY_INFO[fragment.rarity];
                    const school = SCHOOLS.find((s) => s.id === fragment.schoolId);
                    const isSelected = requestedFragmentId === fragment.id;

                    return (
                      <button
                        key={fragment.id}
                        onClick={() => setRequestedFragmentId(fragment.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-vermilion-400 bg-vermilion-50'
                            : 'border-paper-200 hover:border-vermilion-300 hover:bg-paper-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl opacity-60">{fragment.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-ink-800 truncate">{fragment.title}</div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className={`px-1.5 py-0.5 rounded text-xs ${rarityInfo.bgColor} ${rarityInfo.color}`}>
                                {rarityInfo.label}
                              </span>
                              <span className="text-xs text-ink-400">{school?.name}</span>
                            </div>
                          </div>
                          {isSelected && <Check size={18} className="text-vermilion-500" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-paper-100 flex items-center gap-3">
          {step === 'request' && (
            <button
              onClick={() => setStep('offer')}
              className="px-5 py-2.5 border border-paper-200 rounded-xl text-ink-600 hover:bg-paper-50 transition-colors"
            >
              上一步
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-5 py-2.5 border border-paper-200 rounded-xl text-ink-600 hover:bg-paper-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            disabled={step === 'request' && !requestedFragmentId}
            className={`flex-1 py-2.5 font-serif-sc font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              step === 'request' && requestedFragmentId
                ? 'bg-gradient-to-r from-vermilion-500 to-gold-500 text-white hover:shadow-lg hover:shadow-vermilion-500/30'
                : 'bg-paper-200 text-ink-400 cursor-not-allowed'
            }`}
          >
            <Send size={16} />
            发起交换
          </button>
        </div>
      </div>
    </div>
  );
}
