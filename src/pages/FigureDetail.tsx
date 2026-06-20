import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Unlock, Sparkles, Target, BookOpen,
  Star, Users, Award, ChevronRight, Clock, Trophy, Loader2, Network,
  X,
} from 'lucide-react';
import { useFigureStore } from '@/store/useFigureStore';
import FigureNetwork from '@/components/FigureNetwork';
import Empty from '@/components/Empty';
import FigureCard from '@/components/FigureCard';
import type { FigureFanStory, FigureTask, FigureUniqueEvent, FigureCollectionGoal } from '@/types/fan';

const STORY_CATEGORY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  invention: { bg: 'bg-bamboo-100', text: 'text-bamboo-600', label: '发明创造' },
  masterpiece: { bg: 'bg-gold-100', text: 'text-gold-600', label: '艺术名作' },
  legend: { bg: 'bg-vermilion-100', text: 'text-vermilion-600', label: '传说典故' },
  scholarship: { bg: 'bg-ink-100', text: 'text-ink-600', label: '文人雅事' },
  diplomacy: { bg: 'bg-bamboo-100', text: 'text-bamboo-600', label: '外交谋略' },
};

function DifficultyStars({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={12}
          className={i <= level ? 'text-gold-500 fill-gold-500' : 'text-paper-300'}
        />
      ))}
    </div>
  );
}

function StoryCard({ story }: { story: FigureFanStory }) {
  const [expanded, setExpanded] = useState(false);
  const style = STORY_CATEGORY_STYLES[story.category] || STORY_CATEGORY_STYLES.legend;

  return (
    <div className="bg-white rounded-2xl shadow-elegant overflow-hidden transition-all hover:shadow-elegant-hover">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${style.bg} ${style.text} mb-2`}>
              {style.label}
            </span>
            <h4 className="font-serif-sc text-lg font-bold text-ink-800">{story.title}</h4>
            <p className="text-xs text-ink-400 mt-1">{story.year}</p>
          </div>
          {story.fanType && (
            <span className="text-2xl">
              {story.fanType === 'feather' ? '🪶' : story.fanType === 'folding' ? '🪭' : '🎐'}
            </span>
          )}
        </div>

        <p className="text-sm text-ink-500 mb-3 leading-relaxed">{story.summary}</p>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-paper-100">
            <p className="text-sm text-ink-600 leading-relaxed whitespace-pre-line">
              {story.fullStory}
            </p>
            <div className="mt-4 p-3 bg-paper-50 rounded-xl">
              <div className="text-xs text-ink-400 mb-1 flex items-center gap-1">
                <Sparkles size={12} />
                文化意义
              </div>
              <p className="text-sm text-ink-600">{story.significance}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm text-vermilion-500 hover:text-vermilion-600 font-medium flex items-center gap-1"
        >
          {expanded ? '收起' : '阅读完整故事'}
          <ChevronRight size={14} className={expanded ? 'rotate-90 transition-transform' : 'transition-transform'} />
        </button>
      </div>
    </div>
  );
}

function TaskItem({ task, onComplete, figureId }: {
  task: FigureTask;
  onComplete: (figureId: string, taskId: string) => void;
  figureId: string;
}) {
  return (
    <div className={`p-4 rounded-xl border transition-all ${
      task.completed
        ? 'bg-bamboo-50 border-bamboo-200'
        : 'bg-white border-paper-200 hover:border-vermilion-300'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          task.completed ? 'bg-bamboo-500 text-white' : 'bg-paper-100 text-ink-400'
        }`}>
          {task.completed ? <CheckCircle2 size={16} /> : <Clock size={16} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h5 className={`font-serif-sc font-bold ${
              task.completed ? 'text-bamboo-700 line-through' : 'text-ink-800'
            }`}>
              {task.title}
            </h5>
            <DifficultyStars level={task.difficulty} />
          </div>
          <p className="text-sm text-ink-500 mb-2">{task.description}</p>
          <div className="flex items-center justify-between">
            <div className="text-xs text-gold-600 flex items-center gap-1">
              <Trophy size={12} />
              奖励: {task.reward}
            </div>
            {!task.completed && (
              <button
                onClick={() => onComplete(figureId, task.id)}
                className="px-3 py-1 bg-vermilion-50 text-vermilion-600 rounded-lg text-xs hover:bg-vermilion-100 transition-colors"
              >
                标记完成
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventItem({ event, onComplete, figureId }: {
  event: FigureUniqueEvent;
  onComplete: (figureId: string, eventId: string) => void;
  figureId: string;
}) {
  return (
    <div className={`p-4 rounded-xl border transition-all ${
      event.completed
        ? 'bg-gold-50 border-gold-200'
        : 'bg-white border-paper-200'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          event.completed ? 'bg-gold-500 text-white' : 'bg-gold-100 text-gold-600'
        }`}>
          <Sparkles size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h5 className={`font-serif-sc font-bold mb-1 ${
            event.completed ? 'text-gold-700' : 'text-ink-800'
          }`}>
            {event.title}
            {event.completed && <CheckCircle2 size={14} className="inline ml-1 text-gold-500" />}
          </h5>
          <p className="text-sm text-ink-500 mb-2">{event.description}</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-0.5 bg-bamboo-100 text-bamboo-600 rounded-full">
              触发: {event.trigger}
            </span>
            <span className="px-2 py-0.5 bg-gold-100 text-gold-600 rounded-full flex items-center gap-1">
              <Trophy size={10} />
              {event.reward}
            </span>
          </div>
          {!event.completed && (
            <button
              onClick={() => onComplete(figureId, event.id)}
              className="mt-2 px-3 py-1 bg-gold-50 text-gold-600 rounded-lg text-xs hover:bg-gold-100 transition-colors"
            >
              模拟触发
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function GoalItem({ goal }: { goal: FigureCollectionGoal }) {
  const progress = Math.min(100, (goal.currentCount / goal.targetCount) * 100);

  return (
    <div className={`p-4 rounded-xl border ${
      goal.completed ? 'bg-bamboo-50 border-bamboo-200' : 'bg-white border-paper-200'
    }`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          goal.completed ? 'bg-bamboo-500 text-white' : 'bg-bamboo-100 text-bamboo-600'
        }`}>
          <Target size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h5 className={`font-serif-sc font-bold ${
              goal.completed ? 'text-bamboo-700' : 'text-ink-800'
            }`}>
              {goal.title}
              {goal.completed && <CheckCircle2 size={14} className="inline ml-1 text-bamboo-500" />}
            </h5>
            <span className="text-xs font-bold text-ink-600">
              {goal.currentCount}/{goal.targetCount}
            </span>
          </div>
          <p className="text-sm text-ink-500">{goal.description}</p>
        </div>
      </div>

      <div className="h-2 bg-paper-100 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            goal.completed
              ? 'bg-gradient-to-r from-bamboo-500 to-gold-500'
              : 'bg-gradient-to-r from-bamboo-400 to-bamboo-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-xs text-gold-600 flex items-center gap-1">
        <Trophy size={12} />
        奖励: {goal.reward}
      </div>
    </div>
  );
}

export default function FigureDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentFigure,
    relatedFigures,
    figures,
    detailLoading,
    error,
    loadFigureDetail,
    completeTask,
    completeEvent,
    clearCurrentFigure,
    unlockFigure,
  } = useFigureStore();

  const [activeTab, setActiveTab] = useState<'stories' | 'tasks' | 'events' | 'goals'>('stories');
  const [showNetwork, setShowNetwork] = useState(false);

  useEffect(() => {
    if (id) {
      loadFigureDetail(id);
    }
    return () => clearCurrentFigure();
  }, [id, loadFigureDetail, clearCurrentFigure]);

  if (detailLoading) {
    return (
      <div className="min-h-screen bg-paper-50 flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-vermilion-500" size={40} />
          <p className="text-ink-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !currentFigure) {
    return (
      <div className="min-h-screen bg-paper-50 pt-20">
        <div className="container mx-auto px-6">
          <Empty
            icon={<span className="text-5xl">😔</span>}
            title="人物未找到"
            description={error || '该历史人物不存在或已被移除'}
            onRetry={() => id && loadFigureDetail(id)}
          />
          <div className="mt-4 flex justify-center">
            <Link
              to="/figures"
              className="inline-flex items-center gap-2 px-4 py-2 bg-vermilion-50 text-vermilion-600 rounded-xl hover:bg-vermilion-100 transition-colors"
            >
              <ArrowLeft size={16} />
              返回人物列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isLocked = currentFigure.status === 'locked';
  const completedTasks = currentFigure.tasks.filter(t => t.completed).length;
  const totalTasks = currentFigure.tasks.length;
  const completedEvents = currentFigure.uniqueEvents.filter(e => e.completed).length;
  const completedGoals = currentFigure.collectionGoals.filter(g => g.completed).length;

  return (
    <div className="min-h-screen bg-paper-50 pt-20 md:pt-24 pb-12">
      <div className="container mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 text-sm text-ink-500 hover:text-vermilion-500 transition-colors"
        >
          <ArrowLeft size={16} />
          返回
        </button>

        {isLocked ? (
          <div className="bg-white rounded-2xl shadow-elegant p-12 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="font-serif-sc text-2xl font-bold text-ink-800 mb-2">人物传记尚未解锁</h2>
            <p className="text-ink-500 mb-2">{currentFigure.unlockCondition}</p>
            <p className="text-ink-400 text-sm mb-6">完成对应任务后即可解锁该人物的完整传记</p>
            <button
              onClick={() => id && unlockFigure(id)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-vermilion-500 text-white rounded-xl hover:bg-vermilion-600 transition-colors font-medium"
            >
              <Unlock size={18} />
              立即解锁
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-ink-800 to-ink-900 rounded-2xl p-8 mb-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-vermilion-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative flex flex-col md:flex-row gap-6">
                <div className="w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-6xl flex-shrink-0 border-2 border-white/20">
                  {currentFigure.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 bg-vermilion-500/30 text-vermilion-200 text-xs rounded-full">
                      {currentFigure.dynasty}
                    </span>
                    {currentFigure.signatureFanType && (
                      <span className="px-2.5 py-0.5 bg-gold-500/30 text-gold-200 text-xs rounded-full">
                        {currentFigure.signatureFanType === 'feather' ? '代表: 羽扇' :
                         currentFigure.signatureFanType === 'folding' ? '代表: 折扇' : '代表: 团扇'}
                      </span>
                    )}
                    <span className={`px-2.5 py-0.5 text-xs rounded-full ${
                      currentFigure.status === 'completed' ? 'bg-gold-500/30 text-gold-200' : 'bg-bamboo-500/30 text-bamboo-200'
                    }`}>
                      {currentFigure.status === 'completed' ? '已完成探索' : '探索中'}
                    </span>
                  </div>
                  <h1 className="font-serif-sc text-3xl md:text-4xl font-bold mb-1">
                    {currentFigure.name}
                  </h1>
                  {currentFigure.courtesyName && (
                    <p className="text-white/60 text-sm mb-3">字 {currentFigure.courtesyName}</p>
                  )}
                  <p className="text-white/80 text-sm mb-2">{currentFigure.title}</p>
                  {(currentFigure.birthYear || currentFigure.deathYear) && (
                    <p className="text-white/50 text-xs mb-4">
                      {currentFigure.birthYear} - {currentFigure.deathYear}
                    </p>
                  )}
                  <p className="text-white/70 leading-relaxed mb-4 max-w-2xl">
                    {currentFigure.shortBio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentFigure.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-white/10 text-white/70 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:w-48 flex-shrink-0 flex flex-col justify-between">
                  <div>
                    <div className="text-white/60 text-xs mb-1 flex items-center gap-1">
                      <Award size={12} />
                      主要成就
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {currentFigure.achievements.slice(0, 4).map(a => (
                        <span key={a} className="px-2 py-0.5 bg-white/10 text-xs rounded text-white/80">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-white/60 text-xs flex items-center gap-1">
                        <Users size={12} />
                        探索进度
                      </span>
                      <span className="text-white font-bold text-sm">{currentFigure.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${currentFigure.progress}%`,
                          background: currentFigure.progress >= 100
                            ? 'linear-gradient(90deg, #C9A959, #e8c875)'
                            : 'linear-gradient(90deg, #7D9B6A, #C8102E)',
                        }}
                      />
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white/5 rounded-lg py-2">
                        <div className="font-bold">{completedTasks}/{totalTasks}</div>
                        <div className="text-[10px] text-white/50">任务</div>
                      </div>
                      <div className="bg-white/5 rounded-lg py-2">
                        <div className="font-bold">{completedEvents}/{currentFigure.uniqueEvents.length}</div>
                        <div className="text-[10px] text-white/50">事件</div>
                      </div>
                      <div className="bg-white/5 rounded-lg py-2">
                        <div className="font-bold">{completedGoals}/{currentFigure.collectionGoals.length}</div>
                        <div className="text-[10px] text-white/50">目标</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-elegant p-6 mb-6">
                  <h2 className="font-serif-sc text-xl font-bold text-ink-800 mb-4 flex items-center gap-2">
                    <BookOpen size={20} className="text-vermilion-500" />
                    人物传记
                  </h2>
                  <div className="text-sm text-ink-600 leading-relaxed whitespace-pre-line">
                    {currentFigure.fullBiography}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
                  <div className="p-4 border-b border-paper-100 flex gap-2 overflow-x-auto">
                    {[
                      { key: 'stories', label: '扇子故事', icon: <Sparkles size={16} />, count: currentFigure.fanStories.length },
                      { key: 'tasks', label: '解锁任务', icon: <Target size={16} />, count: totalTasks },
                      { key: 'events', label: '独特事件', icon: <Star size={16} />, count: currentFigure.uniqueEvents.length },
                      { key: 'goals', label: '收藏目标', icon: <Award size={16} />, count: currentFigure.collectionGoals.length },
                    ].map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as typeof activeTab)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                          activeTab === tab.key
                            ? 'bg-vermilion-50 text-vermilion-600'
                            : 'text-ink-500 hover:bg-paper-100'
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                        <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                          activeTab === tab.key
                            ? 'bg-vermilion-500/10 text-vermilion-600'
                            : 'bg-paper-200 text-ink-400'
                        }`}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="p-6">
                    {activeTab === 'stories' && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {currentFigure.fanStories.length === 0 ? (
                          <div className="col-span-full">
                            <Empty title="暂无扇子故事" description="敬请期待更多精彩内容" />
                          </div>
                        ) : (
                          currentFigure.fanStories.map(story => (
                            <StoryCard key={story.id} story={story} />
                          ))
                        )}
                      </div>
                    )}

                    {activeTab === 'tasks' && (
                      <div className="space-y-3">
                        {currentFigure.tasks.length === 0 ? (
                          <Empty title="暂无任务" description="该人物暂无解锁任务" />
                        ) : (
                          currentFigure.tasks.map(task => (
                            <TaskItem
                              key={task.id}
                              task={task}
                              onComplete={completeTask}
                              figureId={currentFigure.id}
                            />
                          ))
                        )}
                      </div>
                    )}

                    {activeTab === 'events' && (
                      <div className="space-y-3">
                        {currentFigure.uniqueEvents.length === 0 ? (
                          <Empty title="暂无独特事件" description="探索更多以解锁独特事件" />
                        ) : (
                          currentFigure.uniqueEvents.map(event => (
                            <EventItem
                              key={event.id}
                              event={event}
                              onComplete={completeEvent}
                              figureId={currentFigure.id}
                            />
                          ))
                        )}
                      </div>
                    )}

                    {activeTab === 'goals' && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {currentFigure.collectionGoals.length === 0 ? (
                          <div className="col-span-full">
                            <Empty title="暂无收藏目标" description="敬请期待更多收藏内容" />
                          </div>
                        ) : (
                          currentFigure.collectionGoals.map(goal => (
                            <GoalItem key={goal.id} goal={goal} />
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
                  <div className="p-4 border-b border-paper-100 flex items-center justify-between">
                    <h3 className="font-serif-sc font-bold text-ink-800 flex items-center gap-2">
                      <Network size={18} className="text-vermilion-500" />
                      人物关系
                    </h3>
                    <button
                      onClick={() => setShowNetwork(true)}
                      className="text-xs text-vermilion-500 hover:text-vermilion-600"
                    >
                      查看网络图
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    {relatedFigures.length === 0 ? (
                      <p className="text-sm text-ink-400 text-center py-4">暂无关联人物</p>
                    ) : (
                      currentFigure.relations.map(rel => {
                        const target = relatedFigures.find(f => f.id === rel.targetFigureId);
                        if (!target) return null;
                        return (
                          <Link
                            key={rel.targetFigureId}
                            to={`/figure/${target.id}`}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-paper-50 transition-colors group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-paper-100 flex items-center justify-center text-2xl">
                              {target.status === 'locked' ? '❓' : target.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-serif-sc font-bold text-ink-800 group-hover:text-vermilion-500 transition-colors">
                                  {target.status === 'locked' ? '???' : target.name}
                                </span>
                                <span className="px-1.5 py-0.5 text-[10px] bg-bamboo-100 text-bamboo-600 rounded-full">
                                  {rel.typeName}
                                </span>
                              </div>
                              <p className="text-xs text-ink-400 truncate">{rel.description}</p>
                            </div>
                            <ChevronRight size={16} className="text-paper-300 group-hover:text-vermilion-400 transition-colors" />
                          </Link>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-elegant p-5">
                  <h3 className="font-serif-sc font-bold text-ink-800 mb-3 flex items-center gap-2">
                    <Trophy size={18} className="text-gold-500" />
                    主要成就
                  </h3>
                  <div className="space-y-2">
                    {currentFigure.achievements.map(a => (
                      <div key={a} className="flex items-center gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                        <span className="text-ink-600">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {relatedFigures.length > 0 && (
              <div className="bg-white rounded-2xl shadow-elegant p-6">
                <h3 className="font-serif-sc text-xl font-bold text-ink-800 mb-4 flex items-center gap-2">
                  <Users size={20} className="text-bamboo-500" />
                  相关人物推荐
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedFigures.slice(0, 4).map((f, i) => (
                    <FigureCard key={f.id} figure={f} index={i} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {showNetwork && (
          <div className="fixed inset-0 z-50 bg-ink-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-auto">
              <div className="p-4 border-b border-paper-200 flex items-center justify-between sticky top-0 bg-white">
                <h3 className="font-serif-sc font-bold text-ink-800 flex items-center gap-2">
                  <Network size={18} className="text-vermilion-500" />
                  人物关系网络图 · {currentFigure.name}
                </h3>
                <button
                  onClick={() => setShowNetwork(false)}
                  className="p-1.5 rounded-lg hover:bg-paper-100 text-ink-400 hover:text-ink-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-6">
                <FigureNetwork
                  figures={[currentFigure, ...relatedFigures, ...figures.filter(f => !relatedFigures.find(r => r.id === f.id) && f.id !== currentFigure.id)]}
                  centerFigureId={currentFigure.id}
                  width={800}
                  height={500}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
