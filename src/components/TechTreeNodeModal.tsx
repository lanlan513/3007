import { useState, useEffect } from 'react';
import { useTechTreeStore } from '@/store/useTechTreeStore';
import {
  X,
  Unlock,
  CheckCircle,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  Hammer,
  Star,
  User,
  ChevronRight,
  Edit3,
  Save,
  Gift,
  Lock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TechTreeNodeModal() {
  const {
    isModalOpen,
    selectedNodeDetail,
    selectedNodeId,
    closeModal,
    unlockNode,
    completeNode,
    getNodeStatus,
    getRelatedFans,
    getRelatedFigures,
    userProgress,
    addExplorationNote,
    canUnlockNode,
  } = useTechTreeStore();

  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'craft' | 'culture'>('history');
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedNodeId && userProgress.explorationNotes[selectedNodeId]) {
      setNotes(userProgress.explorationNotes[selectedNodeId]);
    } else {
      setNotes('');
    }
  }, [selectedNodeId, userProgress.explorationNotes]);

  if (!isModalOpen || !selectedNodeDetail || !selectedNodeId) return null;

  const status = getNodeStatus(selectedNodeId);
  const canUnlock = canUnlockNode(selectedNodeId);
  const relatedFans = getRelatedFans(selectedNodeId);
  const relatedFigures = getRelatedFigures(selectedNodeId);

  const handleUnlock = () => {
    unlockNode(selectedNodeId, notes);
  };

  const handleComplete = () => {
    completeNode(selectedNodeId);
  };

  const handleSaveNotes = () => {
    addExplorationNote(selectedNodeId, notes);
    setIsEditingNotes(false);
  };

  const getCategoryColor = () => {
    const categoryMap: Record<string, string> = {
      obstruction: '#8B4513',
      feather: '#7D9B6A',
      round: '#C8102E',
      folding: '#C9A959',
      craft: '#8B008B',
      modern: '#4682B4',
    };
    return categoryMap[selectedNodeDetail.category] || '#C8102E';
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < difficulty ? 'text-gold-500 fill-gold-500' : 'text-paper-300'}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-fade-in-up">
        <div
          className="relative h-48 md:h-56 overflow-hidden"
          style={{ backgroundColor: `${getCategoryColor()}20` }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${getCategoryColor()}40 0%, transparent 70%)`,
            }}
          />
          
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-3">
                {status === 'locked' ? '🔒' : getCategoryIcon(selectedNodeDetail.category)}
              </div>
              <h2 className="font-serif-sc text-2xl md:text-3xl font-bold text-ink-800">
                {selectedNodeDetail.name}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${getCategoryColor()}20`, color: getCategoryColor() }}
                >
                  {selectedNodeDetail.categoryName}
                </span>
                <span className="text-sm text-ink-500">{selectedNodeDetail.era}</span>
              </div>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
          >
            <X size={20} className="text-ink-600" />
          </button>

          {status !== 'locked' && (
            <div
              className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5"
              style={{
                backgroundColor: status === 'completed' ? '#7D9B6A20' : '#C9A95920',
                color: status === 'completed' ? '#7D9B6A' : '#C9A959',
              }}
            >
              {status === 'completed' ? (
                <><CheckCircle size={14} /> 已完成</>
              ) : (
                <><Unlock size={14} /> 已解锁</>
              )}
            </div>
          )}
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(85vh-14rem)]">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-ink-400" />
              <span className="text-sm text-ink-500">{selectedNodeDetail.year}</span>
            </div>
            <div className="flex items-center gap-1">
              <Award size={14} className="text-gold-500" />
              <span className="text-sm text-ink-500">
                难度: <span className="flex items-center gap-0.5 ml-1">{getDifficultyStars(selectedNodeDetail.difficulty)}</span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-vermilion-500" />
              <span className="text-sm text-ink-500">
                奖励 <span className="font-bold text-vermilion-600">{selectedNodeDetail.rewardPoints}</span> 积分
              </span>
            </div>
          </div>

          <p className="text-ink-700 leading-relaxed mb-6">
            {selectedNodeDetail.description}
          </p>

          {status === 'locked' && (
            <div className="mb-6 p-4 bg-paper-50 rounded-2xl border-2 border-dashed border-paper-200">
              <div className="flex items-start gap-3">
                <Lock size={20} className="text-ink-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-serif-sc font-bold text-ink-700 mb-1">解锁条件</p>
                  <p className="text-sm text-ink-500">{selectedNodeDetail.unlockCondition}</p>
                  {canUnlock && (
                    <button
                      onClick={handleUnlock}
                      className="mt-3 px-4 py-2 bg-gradient-to-r from-vermilion-500 to-gold-500 text-white rounded-xl font-serif-sc font-bold text-sm hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <Unlock size={16} />
                      立即解锁
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {status !== 'locked' && (
            <>
              <div className="mb-6">
                <div className="flex items-center gap-1 border-b border-paper-200 mb-4">
                  {[
                    { key: 'history', label: '历史背景', icon: BookOpen },
                    { key: 'craft', label: '工艺突破', icon: Hammer },
                    { key: 'culture', label: '文化意义', icon: Sparkles },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as typeof activeTab)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-serif-sc transition-all border-b-2 -mb-px ${
                        activeTab === tab.key
                          ? 'text-vermilion-600 border-vermilion-500 font-bold'
                          : 'text-ink-500 border-transparent hover:text-ink-700'
                      }`}
                    >
                      <tab.icon size={16} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="animate-fade-in">
                  {activeTab === 'history' && (
                    <div className="p-4 bg-paper-50 rounded-xl">
                      <p className="text-ink-700 leading-relaxed">
                        {selectedNodeDetail.historicalBackground}
                      </p>
                    </div>
                  )}

                  {activeTab === 'craft' && (
                    <div className="p-4 bg-paper-50 rounded-xl">
                      <p className="text-ink-700 leading-relaxed">
                        {selectedNodeDetail.craftsmanship}
                      </p>
                    </div>
                  )}

                  {activeTab === 'culture' && (
                    <div className="p-4 bg-paper-50 rounded-xl">
                      <p className="text-ink-700 leading-relaxed">
                        {selectedNodeDetail.culturalSignificance}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {selectedNodeDetail.achievements.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-serif-sc font-bold text-ink-800 mb-3 flex items-center gap-2">
                    <Gift size={18} className="text-gold-500" />
                    可获得成就
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNodeDetail.achievements.map((achievement, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gradient-to-r from-gold-50 to-vermilion-50 text-gold-700 rounded-full text-sm font-serif-sc"
                      >
                        🏆 {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {relatedFans.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-serif-sc font-bold text-ink-800 mb-3">相关扇子</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {relatedFans.map(fan => (
                      <div
                        key={fan.id}
                        onClick={() => {
                          closeModal();
                          navigate(`/fan/${fan.id}`);
                        }}
                        className="flex items-center gap-3 p-3 bg-paper-50 rounded-xl cursor-pointer hover:bg-paper-100 transition-colors group"
                      >
                        <img
                          src={fan.image}
                          alt={fan.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-serif-sc font-bold text-ink-800 text-sm truncate">
                            {fan.name}
                          </p>
                          <p className="text-xs text-ink-500 truncate">{fan.dynasty}</p>
                        </div>
                        <ChevronRight size={16} className="text-ink-300 group-hover:text-vermilion-500 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {relatedFigures.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-serif-sc font-bold text-ink-800 mb-3 flex items-center gap-2">
                    <User size={18} className="text-bamboo-600" />
                    相关历史人物
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {relatedFigures.map(figure => (
                      <div
                        key={figure.id}
                        onClick={() => {
                          closeModal();
                          navigate(`/figure/${figure.id}`);
                        }}
                        className="flex items-center gap-3 p-3 bg-paper-50 rounded-xl cursor-pointer hover:bg-paper-100 transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-100 to-vermilion-100 flex items-center justify-center text-2xl">
                          {figure.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif-sc font-bold text-ink-800 text-sm truncate">
                            {figure.name}
                          </p>
                          <p className="text-xs text-ink-500 truncate">{figure.title}</p>
                        </div>
                        <ChevronRight size={16} className="text-ink-300 group-hover:text-vermilion-500 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif-sc font-bold text-ink-800 flex items-center gap-2">
                    <Edit3 size={18} className="text-vermilion-600" />
                    我的笔记
                  </h4>
                  {!isEditingNotes ? (
                    <button
                      onClick={() => setIsEditingNotes(true)}
                      className="text-sm text-vermilion-600 hover:text-vermilion-700 flex items-center gap-1"
                    >
                      <Edit3 size={14} />
                      编辑
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveNotes}
                      className="text-sm text-bamboo-600 hover:text-bamboo-700 flex items-center gap-1"
                    >
                      <Save size={14} />
                      保存
                    </button>
                  )}
                </div>
                {isEditingNotes ? (
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="记录你的学习心得和感悟..."
                    className="w-full p-4 border border-paper-200 rounded-xl focus:outline-none focus:border-vermilion-400 focus:ring-2 focus:ring-vermilion-100 text-sm leading-relaxed resize-none"
                    rows={4}
                  />
                ) : notes ? (
                  <div className="p-4 bg-paper-50 rounded-xl border border-paper-200">
                    <p className="text-sm text-ink-600 leading-relaxed whitespace-pre-wrap">
                      {notes}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-paper-50 rounded-xl border-2 border-dashed border-paper-200 text-center">
                    <p className="text-sm text-ink-400">点击编辑按钮记录你的学习心得</p>
                  </div>
                )}
              </div>

              {status === 'unlocked' && (
                <button
                  onClick={handleComplete}
                  className="w-full py-3.5 bg-gradient-to-r from-vermilion-500 to-gold-500 text-white rounded-xl font-serif-sc font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  标记为已学习完成
                </button>
              )}

              {status === 'completed' && (
                <div className="p-4 bg-gradient-to-r from-bamboo-50 to-gold-50 rounded-xl text-center">
                  <CheckCircle size={28} className="text-bamboo-500 mx-auto mb-2" />
                  <p className="font-serif-sc font-bold text-bamboo-700">恭喜你已完成此节点的学习！</p>
                  <p className="text-sm text-ink-500 mt-1">继续探索其他节点吧</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function getCategoryIcon(category: string) {
  const icons: Record<string, string> = {
    obstruction: '🏛️',
    feather: '🪶',
    round: '🎐',
    folding: '🪭',
    craft: '💎',
    modern: '✨',
  };
  return icons[category] || '🪭';
}
