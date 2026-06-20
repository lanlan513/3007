import { Link } from 'react-router-dom';
import { Lock, CheckCircle2, ChevronRight, Star } from 'lucide-react';
import type { HistoricalFigure } from '@/types/fan';

interface FigureCardProps {
  figure: HistoricalFigure;
  index?: number;
}

const STATUS_STYLES: Record<string, { label: string; bg: string; text: string; iconBg: string }> = {
  unlocked: { label: '探索中', bg: 'bg-bamboo-50', text: 'text-bamboo-600', iconBg: 'bg-bamboo-100' },
  locked: { label: '未解锁', bg: 'bg-ink-50', text: 'text-ink-400', iconBg: 'bg-ink-100' },
  completed: { label: '已完结', bg: 'bg-gold-50', text: 'text-gold-600', iconBg: 'bg-gold-100' },
};

export default function FigureCard({ figure, index = 0 }: FigureCardProps) {
  const animationDelay = `${index * 0.1}s`;
  const isLocked = figure.status === 'locked';
  const statusStyle = STATUS_STYLES[figure.status];

  return (
    <Link
      to={`/figure/${figure.id}`}
      className={`group block opacity-0 animate-fade-in-up ${isLocked ? 'cursor-not-allowed' : ''}`}
      style={{ animationDelay }}
      onClick={e => {
        if (isLocked) e.preventDefault();
      }}
    >
      <div
        className={`relative overflow-hidden rounded-2xl bg-white shadow-elegant transition-all duration-500 ${
          isLocked ? 'opacity-70' : 'group-hover:shadow-elegant-hover group-hover:-translate-y-2'
        }`}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-paper-100 via-paper-50 to-ink-50">
          <div
            className={`absolute inset-0 flex items-center justify-center text-7xl transition-transform duration-700 ease-out ${
              isLocked ? '' : 'group-hover:scale-110'
            }`}
          >
            {isLocked ? '❓' : figure.avatar}
          </div>

          <div
            className={`absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/20 to-transparent opacity-0 ${
              isLocked ? '' : 'group-hover:opacity-100'
            } transition-opacity duration-500`}
          />

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 ${statusStyle.iconBg} ${statusStyle.text} text-sm font-serif-sc rounded-full backdrop-blur-sm`}
            >
              {figure.status === 'completed' ? (
                <CheckCircle2 size={14} />
              ) : figure.status === 'locked' ? (
                <Lock size={14} />
              ) : (
                <Star size={14} />
              )}
              {statusStyle.label}
            </span>
          </div>

          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-vermilion-500/90 backdrop-blur-sm text-white text-xs font-serif-sc rounded-full">
              {figure.dynasty}
            </span>
          </div>

          {!isLocked && (
            <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <ChevronRight size={16} className="text-white" />
                查看人物详情
              </div>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3
                className={`font-serif-sc text-xl font-bold transition-colors ${
                  isLocked ? 'text-ink-400' : 'text-ink-800 group-hover:text-vermilion-500'
                }`}
              >
                {isLocked ? '???' : figure.name}
              </h3>
              {figure.courtesyName && !isLocked && (
                <p className="text-sm text-ink-400 font-serif-sc mt-0.5">字 {figure.courtesyName}</p>
              )}
            </div>
          </div>

          <p
            className={`text-sm ${isLocked ? 'text-ink-300' : 'text-ink-500'} mb-3 line-clamp-2`}
          >
            {isLocked ? figure.unlockCondition : figure.title}
          </p>

          {!isLocked && (
            <p className="text-xs text-ink-400 mb-4 line-clamp-2">{figure.shortBio}</p>
          )}

          {!isLocked && (
            <>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-ink-400">探索进度</span>
                  <span className="text-xs font-medium text-vermilion-500">{figure.progress}%</span>
                </div>
                <div className="h-1.5 bg-paper-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${figure.progress}%`,
                      background:
                        figure.progress >= 100
                          ? 'linear-gradient(90deg, #C9A959, #e8c875)'
                          : 'linear-gradient(90deg, #7D9B6A, #C8102E)',
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {figure.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-paper-100 text-ink-500 text-xs rounded-full border border-paper-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}

          {isLocked && (
            <div className="flex items-center gap-2 p-3 bg-ink-50 rounded-xl border border-ink-100">
              <Lock size={16} className="text-ink-400" />
              <span className="text-xs text-ink-400">{figure.unlockCondition}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
