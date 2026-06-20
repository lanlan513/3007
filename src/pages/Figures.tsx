import { useEffect, useState } from 'react';
import {
  Users, Network, Filter, X, Loader2, BookOpen, Trophy, ChevronDown,
} from 'lucide-react';
import { useFigureStore } from '@/store/useFigureStore';
import FigureCard from '@/components/FigureCard';
import FigureNetwork from '@/components/FigureNetwork';
import Empty from '@/components/Empty';
import type { FigureStatus } from '@/types/fan';

export default function Figures() {
  const {
    figures,
    filterOptions,
    loading,
    error,
    selectedDynasty,
    selectedStatus,
    selectedTag,
    loadFigures,
    loadFilterOptions,
    setSelectedDynasty,
    setSelectedStatus,
    setSelectedTag,
    resetFilters,
  } = useFigureStore();

  const [showNetwork, setShowNetwork] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    loadFigures();
    loadFilterOptions();
  }, [loadFigures, loadFilterOptions]);

  const activeFilterCount = [selectedDynasty, selectedStatus, selectedTag].filter(Boolean).length;

  const unlockedCount = figures.filter(f => f.status !== 'locked').length;
  const completedCount = figures.filter(f => f.status === 'completed').length;

  return (
    <div className="min-h-screen bg-paper-50 pt-20 md:pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-vermilion-500 to-gold-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-3 mb-2">
                <span className="w-px h-4 bg-white/40" />
                <span className="text-white/80 font-serif-sc text-sm tracking-widest">历史人物</span>
                <span className="w-px h-4 bg-white/40" />
              </div>
              <h1 className="font-serif-sc text-3xl md:text-4xl font-bold mb-2">扇韵流芳</h1>
              <p className="text-white/70 text-sm">
                探索历史名人与扇子的千年传奇故事，解锁人物传记，感受文化传承
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/15 backdrop-blur-sm rounded-xl">
                <Users size={18} />
                <div>
                  <div className="text-xs text-white/70">已解锁人物</div>
                  <div className="font-bold text-lg">
                    {unlockedCount}
                    <span className="text-white/50 text-sm font-normal"> / {figures.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-elegant p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-bamboo-100 text-bamboo-600 flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <div className="text-sm text-ink-400">历史人物总数</div>
                <div className="font-serif-sc text-xl font-bold text-ink-800">{figures.length} 位</div>
              </div>
            </div>
            <p className="text-xs text-ink-400">涵盖三国、明代等多个朝代</p>
          </div>

          <div className="bg-white rounded-2xl shadow-elegant p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center">
                <BookOpen size={20} />
              </div>
              <div>
                <div className="text-sm text-ink-400">已解锁传记</div>
                <div className="font-serif-sc text-xl font-bold text-ink-800">{unlockedCount} 位</div>
              </div>
            </div>
            <p className="text-xs text-ink-400">
              {figures.length > 0 ? `完成度 ${Math.round((unlockedCount / figures.length) * 100)}%` : ''}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-elegant p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-vermilion-100 text-vermilion-600 flex items-center justify-center">
                <Trophy size={20} />
              </div>
              <div>
                <div className="text-sm text-ink-400">已完成探索</div>
                <div className="font-serif-sc text-xl font-bold text-ink-800">{completedCount} 位</div>
              </div>
            </div>
            <p className="text-xs text-ink-400">完成所有任务、事件与收藏</p>
          </div>
        </div>

        {showNetwork && (
          <div className="bg-white rounded-2xl shadow-elegant overflow-hidden mb-6">
            <div className="p-4 border-b border-paper-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network size={20} className="text-vermilion-600" />
                <span className="font-serif-sc font-bold text-ink-800">人物关系网络图</span>
                <span className="text-xs text-ink-400">探索人物之间的文化联系</span>
              </div>
              <button
                onClick={() => setShowNetwork(false)}
                className="p-1.5 rounded-lg hover:bg-paper-100 text-ink-400 hover:text-ink-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <FigureNetwork figures={figures} />
            </div>
          </div>
        )}

        {!showNetwork && (
          <button
            onClick={() => setShowNetwork(true)}
            className="w-full bg-white rounded-2xl shadow-elegant p-4 mb-6 flex items-center justify-center gap-2 hover:bg-paper-50 transition-colors text-ink-600"
          >
            <Network size={18} />
            <span className="font-serif-sc">展开人物关系网络图</span>
            <ChevronDown size={16} />
          </button>
        )}

        <div className="bg-white rounded-2xl shadow-elegant mb-6 overflow-hidden">
          <div className="p-4 border-b border-paper-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-bamboo-600" />
              <span className="font-serif-sc font-bold text-ink-800">筛选人物</span>
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 bg-vermilion-100 text-vermilion-600 text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-ink-400 hover:text-vermilion-500 transition-colors"
                >
                  清除筛选
                </button>
              )}
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="md:hidden p-1.5 rounded-lg hover:bg-paper-100 transition-colors"
              >
                <Filter size={16} />
              </button>
            </div>
          </div>

          <div className={`p-4 border-b border-paper-100 ${filterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[180px]">
                <div className="text-xs text-ink-400 mb-2">朝代</div>
                <select
                  value={selectedDynasty}
                  onChange={e => setSelectedDynasty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-paper-200 text-sm text-ink-700 focus:outline-none focus:border-vermilion-300 bg-white"
                >
                  <option value="">全部朝代</option>
                  {filterOptions?.dynasties.map(d => (
                    <option key={d.value} value={d.value}>
                      {d.label} ({d.count})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[180px]">
                <div className="text-xs text-ink-400 mb-2">状态</div>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value as FigureStatus | '')}
                  className="w-full px-3 py-2 rounded-xl border border-paper-200 text-sm text-ink-700 focus:outline-none focus:border-vermilion-300 bg-white"
                >
                  <option value="">全部状态</option>
                  {filterOptions?.statuses.map(s => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[180px]">
                <div className="text-xs text-ink-400 mb-2">标签</div>
                <select
                  value={selectedTag}
                  onChange={e => setSelectedTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-paper-200 text-sm text-ink-700 focus:outline-none focus:border-vermilion-300 bg-white"
                >
                  <option value="">全部标签</option>
                  {filterOptions?.tags.map(t => (
                    <option key={t.value} value={t.value}>
                      {t.label} ({t.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin text-vermilion-500" size={32} />
              <p className="mt-4 text-ink-400">加载中...</p>
            </div>
          ) : error ? (
            <div className="col-span-full">
              <Empty
                icon={<span className="text-5xl">😔</span>}
                title="加载失败"
                description={error}
                onRetry={loadFigures}
              />
            </div>
          ) : figures.length === 0 ? (
            <div className="col-span-full">
              <Empty
                icon={<Users size={48} />}
                title="暂无符合条件的人物"
                description="试试调整筛选条件"
              />
            </div>
          ) : (
            figures.map((figure, index) => (
              <FigureCard key={figure.id} figure={figure} index={index} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
