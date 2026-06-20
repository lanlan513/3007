import { useState, useEffect } from 'react';
import { useSolarTermStore } from '@/store/useSolarTermStore';
import {
  SOLAR_TERMS,
  SEASON_INFO,
  getCurrentSolarTerm,
  getNextSolarTerm,
  getDaysUntilNextTerm,
  getSolarTermsBySeason,
  type SolarTermData,
  type SolarTermSeason,
} from '@/data/solarTermsData';
import {
  Calendar,
  Heart,
  BookOpen,
  Palette,
  Fan,
  ChevronRight,
  X,
  Clock,
  ArrowRight,
  Sparkles,
  Bookmark,
  Share2,
  ChevronLeft,
  Image,
  Quote,
  ScrollText,
  Sparkles as SparklesIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';

function SeasonFilter({
  selected,
  onChange,
}: {
  selected: SolarTermSeason | 'all';
  onChange: (s: SolarTermSeason | 'all') => void;
}) {
  const options: { key: SolarTermSeason | 'all'; label: string; icon: string }[] = [
    { key: 'all', label: '全部', icon: '🔄' },
    { key: 'spring', label: '春', icon: '🌸' },
    { key: 'summer', label: '夏', icon: '☀️' },
    { key: 'autumn', label: '秋', icon: '🍂' },
    { key: 'winter', label: '冬', icon: '❄️' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {options.map(opt => {
        const isActive = selected === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-serif-sc whitespace-nowrap transition-all duration-300 border-2 ${
              isActive
                ? opt.key === 'spring'
                  ? 'border-pink-300 bg-pink-50 text-pink-700 shadow-md'
                  : opt.key === 'summer'
                  ? 'border-amber-300 bg-amber-50 text-amber-700 shadow-md'
                  : opt.key === 'autumn'
                  ? 'border-orange-300 bg-orange-50 text-orange-700 shadow-md'
                  : opt.key === 'winter'
                  ? 'border-sky-300 bg-sky-50 text-sky-700 shadow-md'
                  : 'border-vermilion-400 bg-vermilion-50 text-vermilion-700 shadow-md'
                : 'border-paper-200 bg-white text-ink-500 hover:border-paper-300'
            }`}
          >
            <span>{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function TermCard({
  term,
  isCurrent,
  isFavorite,
  onClick,
  onFavorite,
}: {
  term: SolarTermData;
  isCurrent: boolean;
  isFavorite: boolean;
  onClick: () => void;
  onFavorite: (e: React.MouseEvent) => void;
}) {
  const seasonInfo = SEASON_INFO[term.season];

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-elegant-hover animate-on-scroll opacity-0 translate-y-8 ${
        isCurrent ? 'ring-2 ring-vermilion-400 shadow-lg' : 'shadow-elegant'
      }`}
      style={{
        background: term.gradient,
      }}
      onClick={onClick}
    >
      {isCurrent && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-vermilion-500 text-white text-xs rounded-full font-serif-sc shadow-md">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          当令
        </div>
      )}

      <button
        onClick={onFavorite}
        className="absolute top-3 left-3 z-10 p-1.5 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white transition-colors"
      >
        <Heart
          size={16}
          className={isFavorite ? 'text-vermilion-500 fill-vermilion-500' : 'text-ink-400'}
        />
      </button>

      <div className="absolute top-1/2 right-4 -translate-y-1/2 text-6xl opacity-20 group-hover:opacity-30 transition-opacity group-hover:scale-110 duration-500">
        {term.icon}
      </div>

      <div className="p-5 relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-3xl mb-1">{term.icon}</div>
            <h3 className="font-serif-sc text-2xl font-bold text-ink-800">{term.name}</h3>
            <p className="text-xs text-ink-500 font-serif-sc">{term.alias}</p>
          </div>
          <div className={`px-2 py-0.5 rounded-md text-xs font-serif-sc ${seasonInfo.bgColor} ${seasonInfo.color} ${seasonInfo.borderColor} border`}>
            {seasonInfo.icon} {seasonInfo.name}
          </div>
        </div>

        <p className="text-sm text-ink-600 leading-relaxed mb-3 line-clamp-2">{term.description}</p>

        <div className="flex items-center gap-2 mb-3">
          {term.keywords.slice(0, 3).map((kw, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md text-xs font-serif-sc bg-white/40 text-ink-600"
            >
              {kw}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-400">
            {term.month}月{term.day}日
          </span>
          <div className="flex items-center gap-1 text-xs text-ink-400 group-hover:text-ink-600 transition-colors">
            <span>探索</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TermDetail({
  term,
  isFavorite,
  onClose,
  onFavorite,
  onPrevTerm,
  onNextTerm,
  hasPrev,
  hasNext,
}: {
  term: SolarTermData;
  isFavorite: boolean;
  onClose: () => void;
  onFavorite: () => void;
  onPrevTerm: () => void;
  onNextTerm: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const { addYearbookEntry, yearbooks } = useSolarTermStore();
  const [activeTab, setActiveTab] = useState<'fan' | 'poem' | 'art' | 'custom'>('fan');

  const fanCategoryLabel = term.fan.category === 'round' ? '团扇' : term.fan.category === 'folding' ? '折扇' : '羽扇';

  const tabs = [
    { key: 'fan' as const, label: '推荐扇', icon: <Fan size={16} /> },
    { key: 'poem' as const, label: '诗词', icon: <BookOpen size={16} /> },
    { key: 'art' as const, label: '艺术', icon: <Palette size={16} /> },
    { key: 'custom' as const, label: '习俗', icon: <Sparkles size={16} /> },
  ];

  const handleAddToYearbook = (yearbookId: string) => {
    addYearbookEntry(yearbookId, {
      termId: term.id,
      note: '',
      fanChoice: term.fan.name,
      poemChoice: term.poems[0]?.title || '',
      artChoice: term.arts[0]?.title || '',
      createdAt: new Date().toISOString(),
    });
  };

  const fanImageUrl = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(term.fan.imagePrompt)}&image_size=square_hd`;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-ink-800/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-4xl max-h-[90vh] md:rounded-2xl rounded-t-2xl overflow-hidden animate-fade-in-up shadow-elegant-hover"
        style={{ animationDuration: '0.4s' }}
      >
        <div
          className="relative p-6 md:p-8 overflow-y-auto max-h-[90vh]"
          style={{ background: `linear-gradient(180deg, ${term.colorLight} 0%, #fdfcf9 40%)` }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors z-20"
          >
            <X size={20} className="text-ink-600" />
          </button>

          {hasPrev && (
            <button
              onClick={onPrevTerm}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all hover:scale-110 shadow-md hidden md:flex"
              title="上一个节气"
            >
              <ChevronLeft size={24} className="text-ink-600" />
            </button>
          )}
          {hasNext && (
            <button
              onClick={onNextTerm}
              className="absolute right-16 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all hover:scale-110 shadow-md hidden md:flex"
              title="下一个节气"
            >
              <ChevronRight size={24} className="text-ink-600" />
            </button>
          )}

          <div className="flex items-start gap-4 mb-6">
            <div className="text-5xl">{term.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="font-serif-sc text-3xl md:text-4xl font-bold text-ink-800">{term.name}</h2>
                <span className="text-sm text-ink-400 font-serif-sc">{term.alias}</span>
              </div>
              <p className="text-ink-500 text-sm">{term.month}月{term.day}日 · {SEASON_INFO[term.season].icon} {SEASON_INFO[term.season].name}季</p>
            </div>
            <button
              onClick={onFavorite}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm transition-all duration-300 border-2 ${
                isFavorite
                  ? 'border-vermilion-400 bg-vermilion-50 text-vermilion-600'
                  : 'border-paper-200 bg-white text-ink-500 hover:border-vermilion-300'
              }`}
            >
              <Heart size={16} className={isFavorite ? 'fill-vermilion-500 text-vermilion-500' : ''} />
              <span className="font-serif-sc">{isFavorite ? '已收藏' : '收藏'}</span>
            </button>
          </div>

          <p className="text-ink-600 leading-relaxed mb-4">{term.description}</p>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/80">
            <p className="text-ink-500 text-sm leading-relaxed">
              <span className="font-serif-sc font-bold text-ink-700 mr-1">民俗注记：</span>
              {term.culturalNote}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {term.keywords.map((kw, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm font-serif-sc"
                style={{
                  backgroundColor: `${term.color}20`,
                  color: term.colorDark,
                  border: `1px solid ${term.color}30`,
                }}
              >
                #{kw}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-6 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-serif-sc whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-ink-800 text-white shadow-md'
                    : 'bg-white/60 text-ink-600 hover:bg-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'fan' && (
            <div className="space-y-4 animate-fade-in" style={{ animationDuration: '0.3s' }}>
              <div
                className="rounded-2xl overflow-hidden shadow-elegant"
                style={{ background: `linear-gradient(135deg, ${term.colorLight}, white)` }}
              >
                <div className="relative h-48 md:h-64 overflow-hidden">
                  <img
                    src={fanImageUrl}
                    alt={term.fan.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="flex items-center justify-center h-full">
                            <div class="text-center">
                              <div class="text-6xl mb-2">${term.fan.category === 'round' ? '🪭' : term.fan.category === 'folding' ? '🪭' : '🪶'}</div>
                              <p class="text-ink-400 text-sm font-serif-sc">${term.fan.name}</p>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span
                      className="px-2 py-1 rounded-md text-xs font-serif-sc text-white"
                      style={{ backgroundColor: `${term.color}dd` }}
                    >
                      {fanCategoryLabel}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white/80 shadow-elegant flex items-center justify-center text-3xl shrink-0">
                      {term.fan.category === 'round' ? '🪭' : term.fan.category === 'folding' ? '🪭' : '🪶'}
                    </div>
                    <div>
                      <h3 className="font-serif-sc text-xl font-bold text-ink-800 mb-1">{term.fan.name}</h3>
                      <p className="text-ink-500 leading-relaxed">{term.fan.reason}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-white/80 text-center border border-paper-200">
                  <Fan size={20} className="mx-auto mb-2 text-ink-400" />
                  <p className="text-xs text-ink-400 font-serif-sc">类型</p>
                  <p className="font-serif-sc text-sm font-bold text-ink-700">{fanCategoryLabel}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/80 text-center border border-paper-200">
                  <Image size={20} className="mx-auto mb-2 text-ink-400" />
                  <p className="text-xs text-ink-400 font-serif-sc">主题</p>
                  <p className="font-serif-sc text-sm font-bold text-ink-700">{term.name}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/80 text-center border border-paper-200">
                  <SparklesIcon size={20} className="mx-auto mb-2 text-ink-400" />
                  <p className="text-xs text-ink-400 font-serif-sc">季节</p>
                  <p className="font-serif-sc text-sm font-bold text-ink-700">{SEASON_INFO[term.season].name}季</p>
                </div>
                <div className="p-4 rounded-xl bg-white/80 text-center border border-paper-200">
                  <Heart size={20} className="mx-auto mb-2 text-ink-400" />
                  <p className="text-xs text-ink-400 font-serif-sc">寓意</p>
                  <p className="font-serif-sc text-sm font-bold text-ink-700">{term.keywords[0]}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'poem' && (
            <div className="space-y-4 animate-fade-in" style={{ animationDuration: '0.3s' }}>
              {term.poems.map((poem, i) => (
                <div key={i} className="bg-white/80 rounded-2xl p-6 shadow-elegant border border-paper-100 relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-6xl opacity-5">
                    <Quote size={80} />
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen size={16} style={{ color: term.colorDark }} />
                    <h4 className="font-serif-sc text-lg font-bold text-ink-800">{poem.title}</h4>
                    <span className="text-sm text-ink-400">
                      〔{poem.dynasty}〕{poem.author}
                    </span>
                  </div>
                  <div className="space-y-2 pl-4 border-l-2" style={{ borderColor: term.color }}>
                    {poem.lines.map((line, j) => (
                      <p key={j} className="font-serif-sc text-ink-700 text-lg leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'art' && (
            <div className="space-y-4 animate-fade-in" style={{ animationDuration: '0.3s' }}>
              {term.arts.map((art, i) => {
                const artImageUrl = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(`Chinese traditional painting ${art.title} ${art.description} ${term.name} solar term`)}&image_size=landscape_4_3`;
                return (
                  <div key={i} className="bg-white/80 rounded-2xl overflow-hidden shadow-elegant border border-paper-100">
                    <div
                      className="h-48 md:h-56 flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${term.colorLight} 0%, ${term.color}40 100%)`,
                      }}
                    >
                      <img
                        src={artImageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="text-center">
                                <Palette size={32} class="text-ink-300 mx-auto mb-2" />
                                <p class="text-ink-400 text-sm font-serif-sc">${art.title}</p>
                              </div>
                            `;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="px-2 py-0.5 rounded text-xs text-white" style={{ backgroundColor: `${term.color}dd` }}>
                          {art.dynasty}代
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Palette size={16} style={{ color: term.colorDark }} />
                        <h4 className="font-serif-sc text-lg font-bold text-ink-800">{art.title}</h4>
                        <span className="text-sm text-ink-400">
                          〔{art.dynasty}〕{art.artist}
                        </span>
                      </div>
                      <p className="text-ink-500 text-sm leading-relaxed">{art.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="animate-fade-in" style={{ animationDuration: '0.3s' }}>
              <div className="grid grid-cols-2 gap-3">
                {term.customs.map((custom, i) => (
                  <div
                    key={i}
                    className="bg-white/80 rounded-xl p-5 shadow-elegant border border-paper-100 text-center hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-0.5 group"
                  >
                    <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">
                      {['🎉', '🏮', '🍵', '🎶', '🎭', '🏺'][i % 6]}
                    </span>
                    <span className="font-serif-sc text-ink-700 font-medium">{custom}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {yearbooks.length > 0 && (
            <div className="mt-6 pt-4 border-t border-paper-200">
              <p className="text-sm text-ink-400 font-serif-sc mb-3 flex items-center gap-2">
                <Bookmark size={14} style={{ color: term.colorDark }} />
                加入文化年鉴
              </p>
              <div className="flex flex-wrap gap-2">
                {yearbooks.map(yb => (
                  <button
                    key={yb.id}
                    onClick={() => handleAddToYearbook(yb.id)}
                    className="px-3 py-1.5 rounded-lg bg-gold-50 border border-gold-200 text-gold-700 text-sm font-serif-sc hover:bg-gold-100 transition-colors flex items-center gap-1"
                  >
                    <Bookmark size={12} />
                    {yb.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between md:hidden">
            <button
              onClick={onPrevTerm}
              disabled={!hasPrev}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-serif-sc transition-colors ${
                hasPrev ? 'text-ink-600 hover:bg-white/60' : 'text-ink-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={16} />
              上一个
            </button>
            <button
              onClick={onNextTerm}
              disabled={!hasNext}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-serif-sc transition-colors ${
                hasNext ? 'text-ink-600 hover:bg-white/60' : 'text-ink-300 cursor-not-allowed'
              }`}
            >
              下一个
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SolarTermCalendar() {
  const {
    selectedSeason,
    setSelectedSeason,
    selectedTerm,
    setSelectedTerm,
    detailOpen,
    setDetailOpen,
    toggleFavorite,
    isFavorite,
    favorites,
    yearbooks,
  } = useSolarTermStore();

  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  const currentTerm = getCurrentSolarTerm();
  const nextTerm = getNextSolarTerm();
  const daysUntil = getDaysUntilNextTerm();

  const filteredTerms =
    selectedSeason === 'all'
      ? SOLAR_TERMS
      : getSolarTermsBySeason(selectedSeason as SolarTermSeason);

  useEffect(() => {
    if (selectedTerm && detailOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedTerm, detailOpen]);

  const springTerms = getSolarTermsBySeason('spring');
  const summerTerms = getSolarTermsBySeason('summer');
  const autumnTerms = getSolarTermsBySeason('autumn');
  const winterTerms = getSolarTermsBySeason('winter');

  const seasonGroups = [
    { season: 'spring' as SolarTermSeason, terms: springTerms },
    { season: 'summer' as SolarTermSeason, terms: summerTerms },
    { season: 'autumn' as SolarTermSeason, terms: autumnTerms },
    { season: 'winter' as SolarTermSeason, terms: winterTerms },
  ];

  const currentIndex = selectedTerm
    ? SOLAR_TERMS.findIndex(t => t.id === selectedTerm.id)
    : -1;

  const handlePrevTerm = () => {
    if (currentIndex > 0) {
      setSelectedTerm(SOLAR_TERMS[currentIndex - 1]);
    }
  };

  const handleNextTerm = () => {
    if (currentIndex < SOLAR_TERMS.length - 1) {
      setSelectedTerm(SOLAR_TERMS[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-paper-50 pt-20 md:pt-24 pb-12">
      <div
        className="relative mb-8 overflow-hidden"
        style={{ background: currentTerm.gradient }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-[120px] font-serif-sc text-ink-800 select-none pointer-events-none">
            {currentTerm.name}
          </div>
          <div className="absolute bottom-5 right-10 text-[80px] font-serif-sc text-ink-800 select-none pointer-events-none rotate-12">
            {currentTerm.icon}
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/30 backdrop-blur-sm rounded-full mb-3">
                <Calendar size={14} className="text-ink-600" />
                <span className="text-ink-700 text-sm font-serif-sc">二十四节气 · 扇历</span>
              </div>
              <h1 className="font-serif-sc text-3xl md:text-5xl font-bold text-ink-800 mb-2">
                节气扇历
              </h1>
              <p className="text-ink-600 max-w-xl">
                以二十四节气为经，以扇文化为纬，编织一年四季的风雅画卷。
                每个节气推荐应景扇具、诗词与艺术作品。
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-elegant border border-white/80">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{currentTerm.icon}</div>
                  <div>
                    <p className="text-xs text-ink-400 font-serif-sc">当前节气</p>
                    <p className="font-serif-sc text-xl font-bold text-ink-800">{currentTerm.name}</p>
                    <p className="text-xs text-ink-500">
                      距{nextTerm.name}还有 <span className="font-bold text-vermilion-500">{daysUntil}</span> 天
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/yearbook"
                className="flex items-center gap-2 px-5 py-3 bg-white/60 backdrop-blur-sm rounded-2xl shadow-elegant border border-white/80 hover:bg-white/80 transition-colors"
              >
                <BookOpen size={18} className="text-gold-600" />
                <span className="font-serif-sc text-ink-700 text-sm">文化年鉴</span>
                <ArrowRight size={14} className="text-ink-400" />
              </Link>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-6 text-sm text-ink-500">
            <div className="flex items-center gap-1.5">
              <Heart size={14} className="text-vermilion-500" />
              <span>已收藏 {favorites.length} 个节气</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen size={14} className="text-gold-500" />
              <span>{yearbooks.length} 本年鉴</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <SeasonFilter selected={selectedSeason} onChange={setSelectedSeason} />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-ink-800 text-white' : 'text-ink-400 hover:bg-paper-200'}`}
            >
              <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                <div className="bg-current rounded-sm" />
                <div className="bg-current rounded-sm" />
                <div className="bg-current rounded-sm" />
                <div className="bg-current rounded-sm" />
              </div>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'timeline' ? 'bg-ink-800 text-white' : 'text-ink-400 hover:bg-paper-200'}`}
            >
              <Clock size={16} />
            </button>
          </div>
        </div>

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTerms.map(term => (
              <TermCard
                key={term.id}
                term={term}
                isCurrent={term.id === currentTerm.id}
                isFavorite={isFavorite(term.id)}
                onClick={() => setSelectedTerm(term)}
                onFavorite={(e) => {
                  e.stopPropagation();
                  toggleFavorite(term.id);
                }}
              />
            ))}
          </div>
        )}

        {viewMode === 'timeline' && (
          <div className="space-y-8">
            {seasonGroups.map(({ season, terms }) => {
              const info = SEASON_INFO[season];
              return (
                <div key={season}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{info.icon}</span>
                    <h2 className={`font-serif-sc text-2xl font-bold ${info.color}`}>
                      {info.name}季
                    </h2>
                    <span className="text-sm text-ink-400">{terms.length}个节气</span>
                    <div className="flex-1 h-px bg-paper-300" />
                  </div>
                  <div className="relative pl-8 border-l-2 border-paper-300 space-y-4">
                    {terms.map(term => {
                      const isCurr = term.id === currentTerm.id;
                      const isFav = isFavorite(term.id);
                      return (
                        <div
                          key={term.id}
                          className={`relative -left-[25px] flex items-start gap-4 cursor-pointer group`}
                          onClick={() => setSelectedTerm(term)}
                        >
                          <div
                            className={`w-3 h-3 rounded-full border-2 mt-2 shrink-0 ${
                              isCurr
                                ? 'border-vermilion-500 bg-vermilion-500 shadow-[0_0_8px_rgba(200,16,46,0.4)]'
                                : 'border-paper-400 bg-white'
                            }`}
                          />
                          <div
                            className={`flex-1 rounded-xl p-4 transition-all duration-300 group-hover:shadow-elegant-hover ${
                              isCurr ? 'shadow-elegant' : 'shadow-sm'
                            }`}
                            style={{
                              background: isCurr
                                ? term.gradient
                                : 'white',
                            }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{term.icon}</span>
                                <span className="font-serif-sc text-lg font-bold text-ink-800">{term.name}</span>
                                <span className="text-xs text-ink-400">{term.alias}</span>
                                {isCurr && (
                                  <span className="px-2 py-0.5 bg-vermilion-500 text-white text-xs rounded-full font-serif-sc">
                                    当令
                                  </span>
                                )}
                                {isFav && (
                                  <Heart size={12} className="text-vermilion-500 fill-vermilion-500" />
                                )}
                              </div>
                              <span className="text-xs text-ink-400">
                                {term.month}月{term.day}日
                              </span>
                            </div>
                            <p className="text-sm text-ink-500 line-clamp-1">{term.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <section className="mt-16 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-px bg-gold-400" />
            <span className="text-gold-500 font-serif-sc text-sm tracking-widest">节气轮转</span>
            <span className="w-12 h-px bg-gold-400" />
          </div>
          <h2 className="font-serif-sc text-3xl md:text-4xl font-bold text-ink-800 mb-8 text-center">
            四时风雅
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {seasonGroups.map(({ season, terms }) => {
              const info = SEASON_INFO[season];
              return (
                <div
                  key={season}
                  className="bg-white rounded-2xl shadow-elegant p-5 hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => setSelectedSeason(season)}
                >
                  <div className="text-3xl mb-2">{info.icon}</div>
                  <h3 className={`font-serif-sc text-xl font-bold mb-2 ${info.color}`}>
                    {info.name}季
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {terms.map(t => (
                      <span
                        key={t.id}
                        className="text-xs px-2 py-0.5 rounded-md bg-paper-100 text-ink-600 font-serif-sc"
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {favorites.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center gap-3 mb-4">
              <Heart size={18} className="text-vermilion-500" />
              <h3 className="font-serif-sc text-xl font-bold text-ink-800">我的收藏</h3>
              <span className="text-sm text-ink-400">{favorites.length}个节气</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {favorites.map(fav => {
                const term = SOLAR_TERMS.find(t => t.id === fav.termId);
                if (!term) return null;
                return (
                  <div
                    key={fav.termId}
                    className="shrink-0 w-32 bg-white rounded-xl shadow-elegant p-3 text-center cursor-pointer hover:shadow-elegant-hover transition-all hover:-translate-y-0.5"
                    style={{ borderTop: `3px solid ${term.color}` }}
                    onClick={() => setSelectedTerm(term)}
                  >
                    <div className="text-2xl mb-1">{term.icon}</div>
                    <p className="font-serif-sc font-bold text-ink-800 text-sm">{term.name}</p>
                    <p className="text-xs text-ink-400">{term.month}月{term.day}日</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {selectedTerm && detailOpen && (
        <TermDetail
          term={selectedTerm}
          isFavorite={isFavorite(selectedTerm.id)}
          onClose={() => setDetailOpen(false)}
          onFavorite={() => toggleFavorite(selectedTerm.id)}
          onPrevTerm={handlePrevTerm}
          onNextTerm={handleNextTerm}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < SOLAR_TERMS.length - 1}
        />
      )}
    </div>
  );
}
