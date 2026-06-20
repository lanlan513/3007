import { useState, useMemo } from 'react';
import { useSolarTermStore } from '@/store/useSolarTermStore';
import { SOLAR_TERMS, SEASON_INFO, getCurrentSolarTerm, type SolarTermSeason, type SolarTermFan } from '@/data/solarTermsData';
import {
  BookOpen,
  Plus,
  Trash2,
  Calendar,
  Heart,
  Fan,
  Palette,
  Sparkles,
  ChevronDown,
  Edit3,
  Download,
  Share2,
  Award,
  Clock,
  Feather,
  Wind,
} from 'lucide-react';
import { Link } from 'react-router-dom';

function CreateYearbookModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (title: string, coverTermId: string) => string;
}) {
  const [title, setTitle] = useState('');
  const [coverTermId, setCoverTermId] = useState(getCurrentSolarTerm().id);

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreate(title.trim(), coverTermId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-ink-800/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-elegant-hover p-6 w-full max-w-md animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
        <h3 className="font-serif-sc text-xl font-bold text-ink-800 mb-4">创建文化年鉴</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-ink-600 font-serif-sc mb-1">年鉴名称</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="例：甲辰年扇韵年鉴"
              className="w-full px-4 py-2.5 rounded-xl border border-paper-200 bg-paper-50 text-ink-800 font-serif-sc focus:outline-none focus:border-vermilion-400 focus:ring-2 focus:ring-vermilion-100"
            />
          </div>

          <div>
            <label className="block text-sm text-ink-600 font-serif-sc mb-1">封面节气</label>
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {SOLAR_TERMS.map(term => (
                <button
                  key={term.id}
                  onClick={() => setCoverTermId(term.id)}
                  className={`p-2 rounded-lg text-center text-sm border transition-all ${
                    coverTermId === term.id
                      ? 'border-vermilion-400 bg-vermilion-50 text-vermilion-700 shadow-sm'
                      : 'border-paper-200 hover:border-paper-300 text-ink-500'
                  }`}
                >
                  <span className="block text-lg">{term.icon}</span>
                  <span className="font-serif-sc text-xs">{term.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-ink-500 hover:bg-paper-100 transition-colors font-serif-sc"
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            disabled={!title.trim()}
            className="px-5 py-2 rounded-xl text-sm bg-vermilion-500 text-white hover:bg-vermilion-600 transition-colors font-serif-sc disabled:opacity-50 disabled:cursor-not-allowed"
          >
            创建
          </button>
        </div>
      </div>
    </div>
  );
}

function ProgressRing({ progress, size = 80, strokeWidth = 6, color = '#C8102E' }: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#f5f0e8"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

function YearbookCard({
  yearbook,
  onExpand,
  onDelete,
  expanded,
}: {
  yearbook: ReturnType<typeof useSolarTermStore.getState>['yearbooks'][0];
  onExpand: () => void;
  onDelete: () => void;
  expanded: boolean;
}) {
  const { removeYearbookEntry } = useSolarTermStore();
  const coverTerm = SOLAR_TERMS.find(t => t.id === yearbook.coverTerm);
  const entriesWithTerms = yearbook.entries.map(entry => ({
    ...entry,
    term: SOLAR_TERMS.find(t => t.id === entry.termId),
  })).filter(e => e.term);

  const seasonCounts: Record<SolarTermSeason, number> = { spring: 0, summer: 0, autumn: 0, winter: 0 };
  entriesWithTerms.forEach(e => {
    if (e.term) seasonCounts[e.term.season]++;
  });

  const progress = Math.round((entriesWithTerms.length / 24) * 100);

  const fanStats = useMemo(() => {
    const stats: Record<string, number> = { round: 0, folding: 0, feather: 0 };
    entriesWithTerms.forEach(e => {
      if (e.term?.fan.category) {
        stats[e.term.fan.category] = (stats[e.term.fan.category] || 0) + 1;
      }
    });
    return stats;
  }, [entriesWithTerms]);

  const allKeywords = useMemo(() => {
    const keywordCount: Record<string, number> = {};
    entriesWithTerms.forEach(e => {
      e.term?.keywords.forEach(kw => {
        keywordCount[kw] = (keywordCount[kw] || 0) + 1;
      });
    });
    return Object.entries(keywordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);
  }, [entriesWithTerms]);

  const fanCategoryInfo: Record<string, { name: string; icon: React.ReactNode; color: string }> = {
    round: { name: '团扇', icon: <Clock size={14} />, color: 'text-pink-500' },
    folding: { name: '折扇', icon: <Fan size={14} />, color: 'text-amber-500' },
    feather: { name: '羽扇', icon: <Feather size={14} />, color: 'text-sky-500' },
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-elegant overflow-hidden transition-all duration-500 hover:shadow-elegant-hover"
      style={{
        borderTop: `4px solid ${coverTerm?.color || '#C8102E'}`,
      }}
    >
      <div
        className="p-6 cursor-pointer"
        onClick={onExpand}
        style={{
          background: expanded ? `linear-gradient(135deg, ${coverTerm?.colorLight || '#fef2f2'}, white)` : undefined,
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <ProgressRing progress={progress} size={56} strokeWidth={5} color={coverTerm?.color || '#C8102E'} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-ink-700">{progress}%</span>
              </div>
            </div>
            <div>
              <h3 className="font-serif-sc text-xl font-bold text-ink-800 mb-1">{yearbook.title}</h3>
              <p className="text-sm text-ink-400">
                {yearbook.year}年 · {entriesWithTerms.length}/24 节气
              </p>
              <div className="flex items-center gap-3 mt-2">
                {(Object.entries(seasonCounts) as [SolarTermSeason, number][])
                  .filter(([, count]) => count > 0)
                  .map(([season, count]) => {
                    const info = SEASON_INFO[season];
                    return (
                      <span key={season} className={`text-xs ${info.color} flex items-center gap-1`}>
                        {info.icon} {count}
                      </span>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 rounded-lg text-ink-300 hover:text-vermilion-500 hover:bg-vermilion-50 transition-colors"
            >
              <Trash2 size={16} />
            </button>
            <ChevronDown
              size={20}
              className={`text-ink-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-6 pb-6 animate-fade-in" style={{ animationDuration: '0.3s' }}>
          {entriesWithTerms.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen size={32} className="text-ink-200 mx-auto mb-3" />
              <p className="text-ink-400 font-serif-sc">暂无收录节气</p>
              <p className="text-ink-300 text-sm mt-1">在节气扇历中收藏节气，即可加入年鉴</p>
              <Link
                to="/solar-terms"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-vermilion-500 text-white rounded-xl text-sm font-serif-sc hover:bg-vermilion-600 transition-colors"
              >
                <Plus size={14} />
                前往收藏
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.entries(seasonCounts) as [SolarTermSeason, number][]).map(([season, count]) => {
                  const info = SEASON_INFO[season];
                  const seasonProgress = Math.round((count / 6) * 100);
                  return (
                    <div key={season} className={`p-3 rounded-xl ${info.bgColor} border ${info.borderColor}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{info.icon}</span>
                        <span className={`font-serif-sc font-bold ${info.color}`}>{info.name}季</span>
                      </div>
                      <div className="text-2xl font-serif-sc font-bold text-ink-800 mb-1">
                        {count}<span className="text-sm text-ink-400 font-normal">/6</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${seasonProgress}%`, background: info.color.includes('pink') ? '#ec4899' : info.color.includes('amber') ? '#f59e0b' : info.color.includes('orange') ? '#f97316' : '#0ea5e9' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-paper-50 border border-paper-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Fan size={16} className="text-vermilion-500" />
                    <span className="font-serif-sc font-bold text-ink-700">扇具类型</span>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(fanCategoryInfo).map(([key, info]) => {
                      const count = fanStats[key] || 0;
                      const total = entriesWithTerms.length || 1;
                      const percent = Math.round((count / total) * 100);
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm flex items-center gap-1.5 ${info.color}`}>
                              {info.icon} {info.name}
                            </span>
                            <span className="text-xs text-ink-400">{count}把 ({percent}%)</span>
                          </div>
                          <div className="w-full h-2 bg-paper-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${percent}%`, background: key === 'round' ? '#ec4899' : key === 'folding' ? '#f59e0b' : '#0ea5e9' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gold-50 border border-gold-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Award size={16} className="text-gold-500" />
                    <span className="font-serif-sc font-bold text-ink-700">成就进度</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: '初探节气', target: 3, icon: '🌱' },
                      { name: '节气过半', target: 12, icon: '📖' },
                      { name: '四季圆满', target: 24, icon: '🏆' },
                    ].map(achievement => {
                      const achieved = entriesWithTerms.length >= achievement.target;
                      const progress2 = Math.min(100, Math.round((entriesWithTerms.length / achievement.target) * 100));
                      return (
                        <div key={achievement.name} className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${achieved ? 'bg-gold-200' : 'bg-gold-100/50'}`}>
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-sm font-serif-sc ${achieved ? 'text-gold-700 font-bold' : 'text-ink-500'}`}>
                                {achievement.name}
                              </span>
                              <span className="text-xs text-ink-400">{achievement.target}节气</span>
                            </div>
                            <div className="w-full h-1.5 bg-gold-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gold-400 rounded-full transition-all duration-700"
                                style={{ width: `${progress2}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {allKeywords.length > 0 && (
                <div className="p-4 rounded-xl bg-bamboo-50 border border-bamboo-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-bamboo-600" />
                    <span className="font-serif-sc font-bold text-ink-700">年度关键词</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allKeywords.map(([keyword, count], index) => {
                      const sizes = ['text-xs', 'text-sm', 'text-base', 'text-lg'];
                      const sizeIndex = Math.min(Math.floor(count / 2), sizes.length - 1);
                      const colors = [
                        'bg-vermilion-100 text-vermilion-600',
                        'bg-gold-100 text-gold-600',
                        'bg-bamboo-100 text-bamboo-600',
                        'bg-sky-100 text-sky-600',
                      ];
                      const colorIndex = index % colors.length;
                      return (
                        <span
                          key={keyword}
                          className={`px-3 py-1 rounded-full font-serif-sc ${sizes[sizeIndex]} ${colors[colorIndex]} transition-transform hover:scale-105`}
                        >
                          #{keyword}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-serif-sc font-bold text-ink-700">收录节气</span>
                  <span className="text-xs text-ink-400">{entriesWithTerms.length}/24</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {entriesWithTerms.map(entry => (
                    <div
                      key={entry.termId}
                      className="flex items-center gap-3 p-3 rounded-xl bg-paper-50 border border-paper-200 hover:border-paper-300 transition-colors group"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                        style={{ background: entry.term!.colorLight }}
                      >
                        {entry.term!.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-serif-sc font-bold text-ink-800 text-sm">{entry.term!.name}</span>
                          <span className="text-xs text-ink-400">{entry.term!.month}月{entry.term!.day}日</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-ink-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Fan size={10} /> {entry.fanChoice || entry.term!.fan.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Palette size={10} /> {entry.artChoice || entry.term!.arts[0]?.title}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeYearbookEntry(yearbook.id, entry.termId)}
                        className="p-1.5 rounded-lg text-ink-300 hover:text-vermilion-500 hover:bg-vermilion-50 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-gold-50 to-vermilion-50 border border-gold-200">
                <p className="text-sm text-ink-700 font-serif-sc leading-relaxed text-center">
                  {entriesWithTerms.length >= 24
                    ? '🏆 恭喜！您已收录全部二十四节气，文化年鉴圆满完成！'
                    : entriesWithTerms.length >= 12
                    ? `📖 您已收录过半节气，文化之旅渐入佳境。还差${24 - entriesWithTerms.length}个节气即可圆满。`
                    : `🌱 文化之旅方兴未艾，继续探索更多节气，丰富您的文化年鉴。还差${24 - entriesWithTerms.length}个节气。`
                  }
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/solar-terms"
                  className="flex items-center gap-2 px-4 py-2 bg-vermilion-500 text-white rounded-xl text-sm font-serif-sc hover:bg-vermilion-600 transition-colors"
                >
                  <Plus size={14} />
                  继续收藏
                </Link>
                <button className="flex items-center gap-2 px-4 py-2 border border-paper-300 text-ink-600 rounded-xl text-sm font-serif-sc hover:bg-paper-50 transition-colors">
                  <Share2 size={14} />
                  分享
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Yearbook() {
  const { yearbooks, createYearbook, deleteYearbook, favorites } = useSolarTermStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(yearbooks.length > 0 ? yearbooks[0].id : null);
  const currentTerm = getCurrentSolarTerm();

  const handleCreate = (title: string, coverTermId: string): string => {
    const id = createYearbook(title, coverTermId);
    setExpandedId(id);
    return id;
  };

  const totalEntries = useMemo(() => {
    return yearbooks.reduce((sum, yb) => sum + yb.entries.length, 0);
  }, [yearbooks]);

  const uniqueTerms = useMemo(() => {
    const terms = new Set<string>();
    yearbooks.forEach(yb => yb.entries.forEach(e => terms.add(e.termId)));
    return terms.size;
  }, [yearbooks]);

  const overallProgress = Math.round((uniqueTerms / 24) * 100);

  const favoriteSeason = useMemo(() => {
    const counts: Record<SolarTermSeason, number> = { spring: 0, summer: 0, autumn: 0, winter: 0 };
    yearbooks.forEach(yb => {
      yb.entries.forEach(entry => {
        const term = SOLAR_TERMS.find(t => t.id === entry.termId);
        if (term) counts[term.season]++;
      });
    });
    const sorted = (Object.entries(counts) as [SolarTermSeason, number][]).sort((a, b) => b[1] - a[1]);
    return sorted[0][1] > 0 ? sorted[0] : null;
  }, [yearbooks]);

  return (
    <div className="min-h-screen bg-paper-50 pt-20 md:pt-24 pb-12">
      <div
        className="relative mb-8 overflow-hidden"
        style={{ background: currentTerm.gradient }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-20 text-[120px] font-serif-sc text-ink-800/10 select-none pointer-events-none animate-float">
            📖
          </div>
          <div className="absolute bottom-10 left-10 text-[80px] text-ink-800/10 select-none pointer-events-none animate-float" style={{ animationDelay: '1s' }}>
            🌸
          </div>
          <div className="absolute top-20 left-1/4 text-[60px] text-ink-800/10 select-none pointer-events-none animate-float" style={{ animationDelay: '2s' }}>
            🍂
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/30 backdrop-blur-sm rounded-full mb-3">
                <BookOpen size={14} className="text-ink-600" />
                <span className="text-ink-700 text-sm font-serif-sc">个人文化年鉴</span>
              </div>
              <h1 className="font-serif-sc text-3xl md:text-4xl font-bold text-ink-800 mb-2">
                文化年鉴
              </h1>
              <p className="text-ink-600 max-w-xl text-sm leading-relaxed">
                收藏您喜爱的节气内容，编织属于个人的文化年鉴。
                将四季风雅、扇韵诗词凝结成册，记录您的文化探索之旅。
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <ProgressRing progress={overallProgress} size={80} strokeWidth={6} color="#C8102E" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-ink-800">{overallProgress}%</span>
                  <span className="text-[10px] text-ink-500">完成度</span>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3.5 bg-vermilion-500 text-white rounded-2xl font-serif-sc hover:bg-vermilion-600 transition-colors shadow-lg hover:shadow-xl"
              >
                <Plus size={18} />
                创建年鉴
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={16} className="text-gold-600" />
                <span className="text-xs text-ink-600 font-serif-sc">年鉴数量</span>
              </div>
              <div className="text-2xl font-serif-sc font-bold text-ink-800">{yearbooks.length}</div>
            </div>
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex items-center gap-2 mb-1">
                <Heart size={16} className="text-vermilion-500" />
                <span className="text-xs text-ink-600 font-serif-sc">节气收藏</span>
              </div>
              <div className="text-2xl font-serif-sc font-bold text-ink-800">{favorites.length}</div>
            </div>
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={16} className="text-bamboo-600" />
                <span className="text-xs text-ink-600 font-serif-sc">收录节气</span>
              </div>
              <div className="text-2xl font-serif-sc font-bold text-ink-800">{uniqueTerms}<span className="text-sm text-ink-500 font-normal">/24</span></div>
            </div>
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-gold-500" />
                <span className="text-xs text-ink-600 font-serif-sc">最爱季节</span>
              </div>
              <div className="text-2xl font-serif-sc font-bold text-ink-800">
                {favoriteSeason ? `${SEASON_INFO[favoriteSeason[0]].icon} ${SEASON_INFO[favoriteSeason[0]].name}` : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {yearbooks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="font-serif-sc text-2xl font-bold text-ink-700 mb-3">尚无年鉴</h3>
            <p className="text-ink-400 max-w-md mx-auto mb-8">
              创建您的第一本文化年鉴，将收藏的节气内容编织成册，
              记录您与四季风雅的故事。
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-vermilion-500 text-white rounded-2xl font-serif-sc hover:bg-vermilion-600 transition-colors shadow-md"
            >
              <Plus size={18} />
              创建第一本年鉴
            </button>

            <div className="mt-16 max-w-2xl mx-auto">
              <h4 className="font-serif-sc text-lg font-bold text-ink-600 mb-6">如何使用文化年鉴？</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-2xl shadow-elegant">
                  <div className="w-12 h-12 rounded-xl bg-vermilion-100 text-vermilion-600 flex items-center justify-center mx-auto mb-3">
                    <Calendar size={24} />
                  </div>
                  <h5 className="font-serif-sc font-bold text-ink-700 mb-2">探索节气</h5>
                  <p className="text-sm text-ink-400">浏览二十四节气，了解每个节气的扇具、诗词与艺术</p>
                </div>
                <div className="text-center p-6 bg-white rounded-2xl shadow-elegant">
                  <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center mx-auto mb-3">
                    <Heart size={24} />
                  </div>
                  <h5 className="font-serif-sc font-bold text-ink-700 mb-2">收藏内容</h5>
                  <p className="text-sm text-ink-400">收藏您喜爱的节气，加入您的文化年鉴</p>
                </div>
                <div className="text-center p-6 bg-white rounded-2xl shadow-elegant">
                  <div className="w-12 h-12 rounded-xl bg-bamboo-100 text-bamboo-600 flex items-center justify-center mx-auto mb-3">
                    <BookOpen size={24} />
                  </div>
                  <h5 className="font-serif-sc font-bold text-ink-700 mb-2">生成年鉴</h5>
                  <p className="text-sm text-ink-400">将收藏编制成册，打造专属的文化年鉴</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {yearbooks.map(yb => (
              <YearbookCard
                key={yb.id}
                yearbook={yb}
                expanded={expandedId === yb.id}
                onExpand={() => setExpandedId(expandedId === yb.id ? null : yb.id)}
                onDelete={() => {
                  deleteYearbook(yb.id);
                  if (expandedId === yb.id) setExpandedId(null);
                }}
              />
            ))}

            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full py-8 border-2 border-dashed border-paper-300 rounded-2xl text-ink-400 hover:border-vermilion-300 hover:text-vermilion-500 transition-colors font-serif-sc flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              创建新年鉴
            </button>
          </div>
        )}

        <section className="mt-16">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="w-12 h-px bg-gold-400" />
              <span className="text-gold-500 font-serif-sc text-sm tracking-widest">节气索引</span>
              <span className="w-12 h-px bg-gold-400" />
            </div>
            <h2 className="font-serif-sc text-2xl md:text-3xl font-bold text-ink-800">
              二十四节气一览
            </h2>
            <p className="text-ink-400 text-sm mt-2">点击探索更多节气文化</p>
          </div>

          {(['spring', 'summer', 'autumn', 'winter'] as SolarTermSeason[]).map(season => {
            const info = SEASON_INFO[season];
            const seasonTerms = SOLAR_TERMS.filter(t => t.season === season);
            return (
              <div key={season} className="mb-6">
                <div className={`flex items-center gap-2 mb-3 ${info.color}`}>
                  <span className="text-xl">{info.icon}</span>
                  <span className="font-serif-sc font-bold">{info.name}季</span>
                  <span className="text-xs text-ink-400 ml-2">{seasonTerms.length}个节气</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {seasonTerms.map(term => {
                    const isFav = favorites.some(f => f.termId === term.id);
                    return (
                      <Link
                        key={term.id}
                        to="/solar-terms"
                        className={`text-center p-3 rounded-xl transition-all hover:-translate-y-0.5 relative group ${
                          isFav
                            ? 'bg-gradient-to-br from-white to-paper-50 shadow-elegant-hover'
                            : 'bg-white shadow-elegant hover:shadow-elegant-hover'
                        }`}
                      >
                        {isFav && (
                          <Heart size={10} className="text-vermilion-500 fill-vermilion-500 absolute top-1.5 right-1.5" />
                        )}
                        <div
                          className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center text-xl mb-1.5 transition-transform group-hover:scale-110"
                          style={{ background: term.colorLight }}
                        >
                          {term.icon}
                        </div>
                        <div className="font-serif-sc text-sm text-ink-700 font-medium">{term.name}</div>
                        <div className="text-[10px] text-ink-400 mt-0.5">{term.month}.{term.day}</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>
      </div>

      {showCreateModal && (
        <CreateYearbookModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
