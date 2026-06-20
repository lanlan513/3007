import { useEffect, useState, useRef } from 'react';
import {
  BookOpen,
  Sparkles,
  Users,
  MapPin,
  Clock,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  ScrollText,
  Trophy,
  Heart,
  Calendar,
  Tag,
  PlayCircle,
  PauseCircle,
  User,
} from 'lucide-react';
import { useFanJourneyStore } from '@/store/useFanJourneyStore';
import type { Fan, LifecycleEvent, FanLifeStory } from '@/types/fan';
import { LIFECYCLE_STAGE_INFO, PRESERVATION_GRADES } from '@/types/fan';

const EMOTIONAL_TONE_INFO: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  joyful: { label: '喜悦', color: 'text-vermilion-600', bg: 'bg-vermilion-50 border-vermilion-200', icon: '😊' },
  melancholic: { label: '惆怅', color: 'text-ink-500', bg: 'bg-ink-50 border-ink-200', icon: '🌿' },
  heroic: { label: '豪迈', color: 'text-gold-600', bg: 'bg-gold-50 border-gold-200', icon: '⚔️' },
  serene: { label: '恬淡', color: 'text-bamboo-600', bg: 'bg-bamboo-50 border-bamboo-200', icon: '🌙' },
  dramatic: { label: '跌宕', color: 'text-vermilion-500', bg: 'bg-paper-100 border-paper-300', icon: '🌊' },
  mysterious: { label: '神秘', color: 'text-gold-500', bg: 'bg-paper-50 border-gold-300', icon: '🔮' },
};

const CATEGORY_GRADIENT: Record<string, string> = {
  round: 'from-vermilion-500 via-gold-400 to-vermilion-500',
  folding: 'from-gold-500 via-vermilion-400 to-gold-500',
  feather: 'from-bamboo-500 via-gold-400 to-bamboo-500',
};

const PRESERVATION_GRADE_INFO: Record<string, { border: string; badge: string; seal: string }> = {
  ordinary: {
    border: 'border-ink-200',
    badge: 'bg-ink-100 text-ink-600',
    seal: '📜',
  },
  fine: {
    border: 'border-bamboo-300 shadow-[0_0_15px_rgba(125,155,106,0.15)]',
    badge: 'bg-bamboo-100 text-bamboo-700',
    seal: '🏛️',
  },
  rare: {
    border: 'border-gold-300 shadow-[0_0_20px_rgba(201,169,89,0.25)]',
    badge: 'bg-gold-100 text-gold-700',
    seal: '⚜️',
  },
  national_treasure: {
    border: 'border-vermilion-300 shadow-[0_0_30px_rgba(200,16,46,0.25)]',
    badge: 'bg-vermilion-100 text-vermilion-700',
    seal: '👑',
  },
};

export default function FanJourney() {
  const {
    allFans,
    selectedFan,
    lifeStory,
    activeEventId,
    isGenerating,
    loadAllFans,
    selectFan,
    setActiveEvent,
    regenerateStory,
    clearSelection,
  } = useFanJourneyStore();

  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const timelineRef = useRef<HTMLDivElement>(null);
  const eventRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    loadAllFans();
  }, [loadAllFans]);

  useEffect(() => {
    if (!isAutoPlaying || !lifeStory) return;

    const events = lifeStory.lifecycleEvents;
    const currentIndex = events.findIndex((e) => e.id === activeEventId);

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % events.length;
      setActiveEvent(events[nextIndex].id);

      const targetEl = eventRefs.current[events[nextIndex].id];
      if (targetEl && timelineRef.current) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      if (nextIndex === events.length - 1) {
        setIsAutoPlaying(false);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, lifeStory, activeEventId, setActiveEvent]);

  const filteredFans = allFans.filter((fan) => {
    const categoryMatch = filterCategory === 'all' || fan.category === filterCategory;
    const keywordMatch =
      !searchKeyword ||
      fan.name.includes(searchKeyword) ||
      fan.description.includes(searchKeyword) ||
      fan.tags.some((t) => t.includes(searchKeyword)) ||
      fan.dynasty.includes(searchKeyword);
    return categoryMatch && keywordMatch;
  });

  const activeEvent = lifeStory?.lifecycleEvents.find((e) => e.id === activeEventId);

  return (
    <div className="min-h-screen bg-paper-50 pt-20 md:pt-24 pb-12">
      <div className="container mx-auto px-6">
        <PageHeader
          selectedFan={selectedFan}
          onBack={clearSelection}
        />

        {!selectedFan ? (
          <FanSelectionView
            fans={filteredFans}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            onSelectFan={selectFan}
          />
        ) : lifeStory ? (
          <StoryView
            lifeStory={lifeStory}
            activeEvent={activeEvent}
            activeEventId={activeEventId}
            eventRefs={eventRefs}
            timelineRef={timelineRef}
            isAutoPlaying={isAutoPlaying}
            setIsAutoPlaying={setIsAutoPlaying}
            setActiveEvent={setActiveEvent}
            onRegenerate={regenerateStory}
            onBack={clearSelection}
          />
        ) : (
          <LoadingView isGenerating={isGenerating} fanName={selectedFan.name} />
        )}
      </div>
    </div>
  );
}

function PageHeader({ selectedFan, onBack }: { selectedFan: Fan | null; onBack: () => void }) {
  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-vermilion-500 via-gold-500 to-vermilion-500 rounded-2xl p-6 md:p-8 text-white shadow-lg overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10">
          {selectedFan && (
            <button
              onClick={onBack}
              className="mb-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">返回扇子列表</span>
            </button>
          )}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-3 mb-3">
                <span className="w-px h-4 bg-white/40" />
                <span className="text-white/80 font-serif-sc text-sm tracking-widest">
                  {selectedFan ? '扇子的虚拟一生' : '文化故事生成器'}
                </span>
                <span className="w-px h-4 bg-white/40" />
              </div>
              <h1 className="font-serif-sc text-3xl md:text-4xl font-bold mb-2">
                {selectedFan ? `${selectedFan.name} · 前世今生` : '一扇一世界'}
              </h1>
              <p className="text-white/70 text-sm md:text-base max-w-2xl leading-relaxed">
                {selectedFan
                  ? `这把${selectedFan.categoryName}自诞生以来，跨越千年岁月，见证历史风云。每一道纹理都是故事，每一处磨损都饱含沧桑。`
                  : '选择一把扇子，探索它从诞生到成为文化遗产的传奇一生。基于扇子、人物、朝代和事件数据库，智能生成专属的文化故事时间线。'}
              </p>
            </div>

            {selectedFan && (
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/15 backdrop-blur-sm overflow-hidden border border-white/20">
                  <img
                    src={selectedFan.image}
                    alt={selectedFan.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FanSelectionView({
  fans,
  filterCategory,
  setFilterCategory,
  searchKeyword,
  setSearchKeyword,
  onSelectFan,
}: {
  fans: Fan[];
  filterCategory: string;
  setFilterCategory: (v: string) => void;
  searchKeyword: string;
  setSearchKeyword: (v: string) => void;
  onSelectFan: (id: string) => void;
}) {
  const categories = [
    { value: 'all', label: '全部扇子', icon: '🪭' },
    { value: 'round', label: '团扇', icon: '🪭' },
    { value: 'folding', label: '折扇', icon: '🪭' },
    { value: 'feather', label: '羽扇', icon: '🪶' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-elegant p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="搜索扇子名称、朝代、材质、标签..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-paper-200 bg-paper-50 focus:border-vermilion-400 focus:bg-white focus:outline-none transition-all"
            />
            <ScrollText size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilterCategory(cat.value)}
                className={`px-4 py-2 rounded-xl border-2 transition-all text-sm font-serif-sc ${
                  filterCategory === cat.value
                    ? 'border-vermilion-500 bg-vermilion-50 text-vermilion-700 shadow-md'
                    : 'border-paper-200 hover:border-vermilion-300 text-ink-600'
                }`}
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-ink-400">
          <span>共找到 {fans.length} 把扇子可供生成故事</span>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-gold-500" />
            <span>点击扇子卡片，开启它的一生</span>
          </div>
        </div>
      </div>

      {fans.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {fans.map((fan, index) => (
            <FanCardWrapper
              key={fan.id}
              fan={fan}
              index={index}
              onClick={() => onSelectFan(fan.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-elegant p-12 text-center">
          <div className="text-6xl mb-4 opacity-50">🔍</div>
          <h3 className="font-serif-sc text-xl text-ink-600 mb-2">没有找到匹配的扇子</h3>
          <p className="text-ink-400">试试调整筛选条件或搜索关键词</p>
        </div>
      )}
    </div>
  );
}

function FanCardWrapper({ fan, index, onClick }: { fan: Fan; index: number; onClick: () => void }) {
  const dynastyBadgeColor = ['唐代', '汉代', '先秦'].includes(fan.dynasty)
    ? 'bg-vermilion-100 text-vermilion-700'
    : ['宋代', '明代', '清代', '民国'].includes(fan.dynasty)
    ? 'bg-gold-100 text-gold-700'
    : 'bg-bamboo-100 text-bamboo-700';

  return (
    <div
      onClick={onClick}
      className="opacity-0 animate-fade-in-up bg-white rounded-2xl shadow-elegant overflow-hidden cursor-pointer group hover:shadow-elegant-hover hover:-translate-y-1 transition-all duration-300"
      style={{ animationDelay: `${0.05 * index}s`, animationFillMode: 'forwards' }}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={fan.image}
          alt={fan.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-serif-sc font-medium ${dynastyBadgeColor} shadow-md`}>
            {fan.dynasty}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full text-xs bg-white/90 backdrop-blur-sm text-ink-600 shadow-md">
            {fan.categoryName}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
          <div className="bg-gradient-to-r from-vermilion-500 to-gold-500 rounded-xl py-2.5 text-center text-white text-sm font-serif-sc font-medium shadow-lg flex items-center justify-center gap-2">
            <Sparkles size={16} />
            生成它的一生
            <ChevronRight size={16} />
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-serif-sc text-lg font-bold text-ink-800 mb-2 group-hover:text-vermilion-600 transition-colors">
          {fan.name}
        </h3>
        <p className="text-sm text-ink-500 line-clamp-2 mb-3 leading-relaxed">
          {fan.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {fan.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md text-xs bg-paper-100 text-ink-500"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoadingView({ isGenerating, fanName }: { isGenerating: boolean; fanName: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-elegant p-12 md:p-16 text-center">
      <div className="inline-block relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-vermilion-400 to-gold-400 animate-pulse flex items-center justify-center">
          <Sparkles size={40} className="text-white animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-vermilion-300 to-gold-300 animate-ping opacity-30" />
      </div>
      <h3 className="font-serif-sc text-2xl font-bold text-ink-800 mb-3">
        正在为{fanName}撰写一生...
      </h3>
      <p className="text-ink-500 max-w-md mx-auto leading-relaxed">
        我们正在从浩瀚的史料中，梳理它的出生、它的主人、它的奇遇、它的传奇...
        <br />
        请稍候，一段跨越千年的故事即将展开。
      </p>
      <div className="mt-8 max-w-sm mx-auto space-y-2">
        {[
          { label: '考据历史年代...', delay: 0 },
          { label: '匹配相关人物...', delay: 0.2 },
          { label: '串联重大事件...', delay: 0.4 },
          { label: '润色传奇故事...', delay: 0.6 },
        ].map((step, i) => (
          <div
            key={i}
            className="opacity-0 animate-fade-in-up flex items-center gap-3 text-left"
            style={{ animationDelay: `${step.delay + 0.3}s`, animationFillMode: 'forwards' }}
          >
            <div className="w-2 h-2 rounded-full bg-vermilion-400 animate-pulse" />
            <span className="text-sm text-ink-500">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StoryView({
  lifeStory,
  activeEvent,
  activeEventId,
  eventRefs,
  timelineRef,
  isAutoPlaying,
  setIsAutoPlaying,
  setActiveEvent,
  onRegenerate,
  onBack,
}: {
  lifeStory: FanLifeStory;
  activeEvent: LifecycleEvent | undefined;
  activeEventId: string | null;
  eventRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  timelineRef: React.RefObject<HTMLDivElement>;
  isAutoPlaying: boolean;
  setIsAutoPlaying: (v: boolean) => void;
  setActiveEvent: (id: string | null) => void;
  onRegenerate: () => void;
  onBack: () => void;
}) {
  const gradeInfo = PRESERVATION_GRADE_INFO[lifeStory.preservationGrade];
  const gradeDisplay = PRESERVATION_GRADES[lifeStory.preservationGrade];

  return (
    <div className="space-y-6">
      <StoryOverview lifeStory={lifeStory} gradeInfo={gradeInfo} gradeDisplay={gradeDisplay} />

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-elegant overflow-hidden sticky top-24">
            <div className="bg-gradient-to-r from-gold-50 to-vermilion-50 px-6 py-4 border-b border-paper-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-vermilion-600" />
                <span className="font-serif-sc font-bold text-ink-800">一生时间线</span>
                <span className="text-xs text-ink-400">共 {lifeStory.lifecycleEvents.length} 个节点</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`p-2 rounded-lg transition-colors ${
                    isAutoPlaying
                      ? 'bg-vermilion-100 text-vermilion-600'
                      : 'bg-paper-100 text-ink-500 hover:bg-paper-200'
                  }`}
                  title={isAutoPlaying ? '暂停自动播放' : '自动播放'}
                >
                  {isAutoPlaying ? <PauseCircle size={20} /> : <PlayCircle size={20} />}
                </button>
                <button
                  onClick={onRegenerate}
                  className="p-2 rounded-lg bg-paper-100 text-ink-500 hover:bg-paper-200 transition-colors"
                  title="重新生成故事"
                >
                  <RefreshCw size={20} />
                </button>
              </div>
            </div>

            <div
              ref={timelineRef}
              className="max-h-[70vh] overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-paper-300 scrollbar-track-transparent"
            >
              <TimelineView
                events={lifeStory.lifecycleEvents}
                activeEventId={activeEventId}
                eventRefs={eventRefs}
                onSelectEvent={setActiveEvent}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {activeEvent ? (
            <EventDetailCard
              event={activeEvent}
              fanName={lifeStory.fanName}
              fanImage={lifeStory.fanImage}
            />
          ) : (
            <div className="bg-white rounded-2xl shadow-elegant p-12 text-center">
              <div className="text-6xl mb-4">👆</div>
              <h3 className="font-serif-sc text-xl text-ink-600 mb-2">选择时间线上的节点</h3>
              <p className="text-ink-400">点击左侧时间线的任意节点，查看详细故事</p>
            </div>
          )}

          <RelatedFiguresCard figures={lifeStory.relatedFigures} />

          <StorySummaryCard lifeStory={lifeStory} />
        </div>
      </div>
    </div>
  );
}

function StoryOverview({
  lifeStory,
  gradeInfo,
  gradeDisplay,
}: {
  lifeStory: FanLifeStory;
  gradeInfo: typeof PRESERVATION_GRADE_INFO[keyof typeof PRESERVATION_GRADE_INFO];
  gradeDisplay: typeof PRESERVATION_GRADES[keyof typeof PRESERVATION_GRADES];
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-elegant overflow-hidden border-2 ${gradeInfo.border}`}>
      <div className="grid md:grid-cols-3 gap-0">
        <div className="md:col-span-1 relative">
          <div className="aspect-square md:aspect-auto md:h-full overflow-hidden bg-gradient-to-br from-paper-50 to-paper-100">
            <img
              src={lifeStory.fanImage}
              alt={lifeStory.fanName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-4 left-4">
            <div
              className={`px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg ${gradeInfo.badge} backdrop-blur-sm`}
            >
              <span className="text-xl">{gradeInfo.seal}</span>
              <span className="font-serif-sc font-bold">{gradeDisplay.name}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs bg-vermilion-100 text-vermilion-700 font-medium">
                  {lifeStory.dynasty}
                </span>
                <span className="px-3 py-1 rounded-full text-xs bg-gold-100 text-gold-700 font-medium">
                  {lifeStory.fanCategoryName}
                </span>
                <span className="px-3 py-1 rounded-full text-xs bg-bamboo-100 text-bamboo-700 font-medium">
                  {lifeStory.origin}
                </span>
              </div>
              <h2 className="font-serif-sc text-2xl md:text-3xl font-bold text-ink-800">
                {lifeStory.fanName}
              </h2>
            </div>
          </div>

          <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-paper-50 to-gold-50 border border-paper-100">
            <div className="flex items-start gap-3">
              <BookOpen size={20} className="text-gold-500 shrink-0 mt-0.5" />
              <p className="text-ink-600 leading-relaxed italic">
                「{lifeStory.poeticPrologue}」
              </p>
            </div>
          </div>

          <p className="text-ink-600 leading-relaxed mb-5">
            {lifeStory.summary}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <InfoChip
              icon={<Calendar size={16} />}
              label="诞生年代"
              value={lifeStory.estimatedAges.creation}
            />
            <InfoChip
              icon={<Clock size={16} />}
              label="存世岁月"
              value={lifeStory.estimatedAges.modern}
            />
            <InfoChip
              icon={<MapPin size={16} />}
              label="诞生地"
              value={lifeStory.origin}
            />
            <InfoChip
              icon={<Trophy size={16} />}
              label="跨越时长"
              value={lifeStory.timelineDuration.split('跨越')[1]}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {lifeStory.keyThemes.map((theme) => (
              <span
                key={theme}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-paper-50 border border-paper-200 text-sm text-ink-600"
              >
                <Tag size={12} className="text-gold-500" />
                {theme}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-paper-50 border border-paper-100">
      <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
        <span className="text-gold-500">{icon}</span>
        {label}
      </div>
      <div className="text-sm font-medium text-ink-700 truncate" title={value}>
        {value}
      </div>
    </div>
  );
}

function TimelineView({
  events,
  activeEventId,
  eventRefs,
  onSelectEvent,
}: {
  events: LifecycleEvent[];
  activeEventId: string | null;
  eventRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  onSelectEvent: (id: string | null) => void;
}) {
  return (
    <div className="relative">
      <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-vermilion-200 via-gold-300 to-bamboo-200 rounded-full" />

      <div className="space-y-4">
        {events.map((event, index) => {
          const stageInfo = LIFECYCLE_STAGE_INFO[event.stage];
          const isActive = event.id === activeEventId;

          return (
            <div
              key={event.id}
              ref={(el) => {
                eventRefs.current[event.id] = el;
              }}
              onClick={() => onSelectEvent(event.id)}
              className={`relative cursor-pointer opacity-0 animate-fade-in-up transition-all duration-300 ${
                isActive
                  ? 'scale-[1.02] z-10'
                  : 'hover:scale-[1.01]'
              }`}
              style={{ animationDelay: `${0.05 * index}s`, animationFillMode: 'forwards' }}
            >
              <div className="flex items-start gap-4">
                <div className="relative z-10 shrink-0 mt-1">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all ${
                      isActive
                        ? stageInfo.color === 'vermilion'
                          ? 'bg-gradient-to-br from-vermilion-500 to-vermilion-600 scale-110 ring-4 ring-vermilion-100'
                          : stageInfo.color === 'gold'
                          ? 'bg-gradient-to-br from-gold-500 to-gold-600 scale-110 ring-4 ring-gold-100'
                          : stageInfo.color === 'bamboo'
                          ? 'bg-gradient-to-br from-bamboo-500 to-bamboo-600 scale-110 ring-4 ring-bamboo-100'
                          : 'bg-gradient-to-br from-ink-500 to-ink-600 scale-110 ring-4 ring-ink-100'
                        : stageInfo.color === 'vermilion'
                        ? 'bg-gradient-to-br from-vermilion-400 to-vermilion-500'
                        : stageInfo.color === 'gold'
                        ? 'bg-gradient-to-br from-gold-400 to-gold-500'
                        : stageInfo.color === 'bamboo'
                        ? 'bg-gradient-to-br from-bamboo-400 to-bamboo-500'
                        : 'bg-gradient-to-br from-ink-400 to-ink-500'
                    }`}
                  >
                    <span className="text-lg text-white drop-shadow">{event.icon || stageInfo.icon}</span>
                  </div>
                  {isActive && (
                    <div
                      className={`absolute inset-0 rounded-full animate-ping opacity-40 ${
                        stageInfo.color === 'vermilion'
                          ? 'bg-vermilion-400'
                          : stageInfo.color === 'gold'
                          ? 'bg-gold-400'
                          : stageInfo.color === 'bamboo'
                          ? 'bg-bamboo-400'
                          : 'bg-ink-400'
                      }`}
                      style={{ animationDuration: '2s' }}
                    />
                  )}
                </div>

                <div
                  className={`flex-1 min-w-0 rounded-xl border-2 p-3 transition-all ${
                    isActive
                      ? stageInfo.color === 'vermilion'
                        ? 'bg-vermilion-50/80 border-vermilion-300 shadow-lg'
                        : stageInfo.color === 'gold'
                        ? 'bg-gold-50/80 border-gold-300 shadow-lg'
                        : stageInfo.color === 'bamboo'
                        ? 'bg-bamboo-50/80 border-bamboo-300 shadow-lg'
                        : 'bg-ink-50/80 border-ink-300 shadow-lg'
                      : 'bg-white border-paper-200 hover:border-paper-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span
                      className={`text-xs font-serif-sc font-bold px-2 py-0.5 rounded-md ${
                        stageInfo.color === 'vermilion'
                          ? 'bg-vermilion-100 text-vermilion-700'
                          : stageInfo.color === 'gold'
                          ? 'bg-gold-100 text-gold-700'
                          : stageInfo.color === 'bamboo'
                          ? 'bg-bamboo-100 text-bamboo-700'
                          : 'bg-ink-100 text-ink-700'
                      }`}
                    >
                      {event.stageName}
                    </span>
                    <span className="text-xs text-ink-400 flex items-center gap-1">
                      <Calendar size={10} />
                      {event.year}
                    </span>
                  </div>

                  <h4 className={`font-serif-sc font-bold text-sm mb-1 ${
                    isActive ? 'text-ink-800' : 'text-ink-700'
                  }`}>
                    {event.title}
                  </h4>

                  <p className="text-xs text-ink-500 line-clamp-2 leading-relaxed">
                    {event.description.slice(0, 50)}...
                  </p>

                  {event.protagonist && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-ink-400">
                      <User size={10} />
                      <span>{event.protagonist}</span>
                      <span className="mx-1">·</span>
                      <MapPin size={10} />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventDetailCard({
  event,
  fanName,
  fanImage,
}: {
  event: LifecycleEvent;
  fanName: string;
  fanImage: string;
}) {
  const toneInfo = EMOTIONAL_TONE_INFO[event.emotionalTone] || EMOTIONAL_TONE_INFO.serene;
  const stageInfo = LIFECYCLE_STAGE_INFO[event.stage];

  return (
    <div className="bg-white rounded-2xl shadow-elegant overflow-hidden border-2 border-paper-100">
      <div
        className={`px-6 py-5 border-b border-paper-100 relative overflow-hidden ${
          stageInfo.color === 'vermilion'
            ? 'bg-gradient-to-r from-vermilion-50 via-gold-50 to-vermilion-50'
            : stageInfo.color === 'gold'
            ? 'bg-gradient-to-r from-gold-50 via-vermilion-50 to-gold-50'
            : stageInfo.color === 'bamboo'
            ? 'bg-gradient-to-r from-bamboo-50 via-gold-50 to-bamboo-50'
            : 'bg-gradient-to-r from-ink-50 via-paper-50 to-ink-50'
        }`}
      >
        <div className="absolute top-0 right-0 opacity-10">
          <div className="text-[120px] leading-none">
            {event.icon}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-serif-sc font-bold ${
                stageInfo.color === 'vermilion'
                  ? 'bg-vermilion-500 text-white'
                  : stageInfo.color === 'gold'
                  ? 'bg-gold-500 text-white'
                  : stageInfo.color === 'bamboo'
                  ? 'bg-bamboo-500 text-white'
                  : 'bg-ink-500 text-white'
              } shadow-md`}
            >
              <span>{event.icon}</span>
              {event.stageName}
            </span>

            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${toneInfo.bg} ${toneInfo.color}`}>
              <span>{toneInfo.icon}</span>
              {toneInfo.label}
            </span>
          </div>

          <h3 className="font-serif-sc text-2xl md:text-3xl font-bold text-ink-800 mb-2">
            {event.title}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-sm text-ink-500">
            <span className="flex items-center gap-1.5">
              <Calendar size={16} className="text-gold-500" />
              {event.year}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={16} className="text-vermilion-500" />
              {event.location}
            </span>
            {event.period && (
              <span className="flex items-center gap-1.5">
                <Clock size={16} className="text-bamboo-500" />
                {event.period}
              </span>
            )}
            {event.protagonist && (
              <span className="flex items-center gap-1.5">
                <User size={16} className="text-ink-500" />
                {event.protagonist}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="md:w-48 shrink-0">
            <div className="aspect-square rounded-xl overflow-hidden border-2 border-paper-100 shadow-md">
              <img src={fanImage} alt={fanName} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <h4 className="font-serif-sc text-lg font-bold text-ink-700 mb-3 flex items-center gap-2">
                <ScrollText size={18} className="text-gold-500" />
                事件详情
              </h4>
              <p className="text-ink-600 leading-[2] text-base">
                {event.description}
              </p>
            </div>

            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-paper-100 text-ink-500"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {event.historicalSignificance && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-gold-50 via-paper-50 to-gold-50 border border-gold-200">
            <h4 className="font-serif-sc text-lg font-bold text-gold-700 mb-3 flex items-center gap-2">
              <Sparkles size={18} />
              历史意义
            </h4>
            <p className="text-ink-600 leading-[2]">
              {event.historicalSignificance}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RelatedFiguresCard({
  figures,
}: {
  figures: FanLifeStory['relatedFigures'];
}) {
  if (figures.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
      <div className="px-6 py-4 border-b border-paper-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-bamboo-100 text-bamboo-600 flex items-center justify-center">
          <Users size={18} />
        </div>
        <div>
          <h3 className="font-serif-sc font-bold text-ink-800">相关历史人物</h3>
          <p className="text-xs text-ink-400">与这把扇子有过交集的历史名人</p>
        </div>
      </div>

      <div className="p-5 grid sm:grid-cols-2 gap-3">
        {figures.map((fig, index) => (
          <div
            key={fig.id}
            className="opacity-0 animate-fade-in-up p-4 rounded-xl bg-paper-50 border border-paper-100 hover:border-bamboo-200 hover:bg-bamboo-50/50 transition-all"
            style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-bamboo-100 to-gold-100 flex items-center justify-center text-2xl shadow-sm shrink-0">
                {fig.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-serif-sc font-bold text-ink-800 mb-0.5 truncate">
                  {fig.name}
                </h4>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-vermilion-100 text-vermilion-600">
                    {fig.dynasty}
                  </span>
                </div>
                <p className="text-xs text-ink-500 line-clamp-2 leading-relaxed">
                  {fig.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StorySummaryCard({ lifeStory }: { lifeStory: FanLifeStory }) {
  return (
    <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
      <div className="px-6 py-4 border-b border-paper-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-vermilion-100 text-vermilion-600 flex items-center justify-center">
          <Heart size={18} />
        </div>
        <div>
          <h3 className="font-serif-sc font-bold text-ink-800">故事结语</h3>
          <p className="text-xs text-ink-400">千年流转，扇韵长存</p>
        </div>
      </div>

      <div className="p-6">
        <div className="p-5 rounded-xl bg-gradient-to-br from-vermilion-50 via-gold-50 to-bamboo-50 border border-paper-200 mb-4">
          <p className="font-serif-sc text-ink-600 text-lg leading-loose text-center italic">
            「{lifeStory.poeticEpilogue}」
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatBlock
            label="历史节点"
            value={lifeStory.lifecycleEvents.length.toString()}
            icon="📜"
          />
          <StatBlock
            label="关联人物"
            value={lifeStory.relatedFigures.length.toString()}
            icon="👥"
          />
          <StatBlock
            label="主题关键词"
            value={lifeStory.keyThemes.length.toString()}
            icon="🏷️"
          />
        </div>
      </div>
    </div>
  );
}

function StatBlock({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="p-4 rounded-xl bg-paper-50 border border-paper-100 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-serif-sc text-xl font-bold text-ink-800 mb-0.5">{value}</div>
      <div className="text-xs text-ink-400">{label}</div>
    </div>
  );
}
