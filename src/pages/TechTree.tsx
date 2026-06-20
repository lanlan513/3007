import { useState, useEffect, useRef, useCallback } from 'react';
import { useTechTreeStore } from '@/store/useTechTreeStore';
import { TreePine, Award, Map as MapIcon, Filter, RotateCcw, Info, Lock, Unlock, CheckCircle, Sparkles, Star, ChevronRight, ZoomIn, ZoomOut, Move } from 'lucide-react';
import TechTreeNodeModal from '@/components/TechTreeNodeModal';
import type { TechTreeNode } from '../../shared/types';

export default function TechTree() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);

  const {
    techTree,
    userProgress,
    filterCategory,
    init,
    openModal,
    unlockNode,
    setFilterCategory,
    resetProgress,
    getNodeStatus,
    canUnlockNode,
    getExploredPercentage,
  } = useTechTreeStore();

  useEffect(() => {
    init();
  }, [init]);

  const drawTree = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2 + offset.x;
    const centerY = 80 + offset.y;

    ctx.clearRect(0, 0, width, height);

    const nodePositions: Map<string, { x: number; y: number }> = new (window.Map)();

    techTree.nodes.forEach(node => {
      const x = centerX + (node.position.x - 50) * 6 * scale;
      const y = centerY + node.position.y * 70 * scale;
      nodePositions.set(node.id, { x, y });
    });

    techTree.branches.forEach(branch => {
      if (filterCategory && branch.category !== filterCategory) return;

      branch.nodeIds.forEach((nodeId, index) => {
        if (index < branch.nodeIds.length - 1) {
          const nextNodeId = branch.nodeIds[index + 1];
          const currentPos = nodePositions.get(nodeId);
          const nextPos = nodePositions.get(nextNodeId);

          if (currentPos && nextPos) {
            const status = getNodeStatus(nodeId);
            const nextStatus = getNodeStatus(nextNodeId);

            ctx.beginPath();
            ctx.moveTo(currentPos.x, currentPos.y + 30 * scale);
            ctx.lineTo(nextPos.x, nextPos.y - 30 * scale);

            if (status === 'completed' && nextStatus === 'completed') {
              ctx.strokeStyle = branch.color;
              ctx.lineWidth = 3 * scale;
              ctx.setLineDash([]);
            } else if (status === 'unlocked' || nextStatus === 'unlocked') {
              ctx.strokeStyle = branch.color;
              ctx.lineWidth = 2 * scale;
              ctx.setLineDash([]);
              ctx.globalAlpha = 0.6;
            } else {
              ctx.strokeStyle = '#d4c4a8';
              ctx.lineWidth = 1.5 * scale;
              ctx.setLineDash([5, 5]);
              ctx.globalAlpha = 0.4;
            }

            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.globalAlpha = 1;

            const midX = (currentPos.x + nextPos.x) / 2;
            const midY = (currentPos.y + nextPos.y) / 2;

            ctx.save();
            ctx.translate(midX, midY);
            const angle = Math.atan2(nextPos.y - currentPos.y, nextPos.x - currentPos.x);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(-5 * scale, -4 * scale);
            ctx.lineTo(0, 0);
            ctx.lineTo(-5 * scale, 4 * scale);
            ctx.fillStyle = branch.color;
            ctx.globalAlpha = status === 'completed' ? 1 : 0.5;
            ctx.fill();
            ctx.restore();
          }
        }
      });
    });

    techTree.nodes.forEach(node => {
      if (filterCategory && node.category !== filterCategory) return;

      const pos = nodePositions.get(node.id);
      if (!pos) return;

      const status = getNodeStatus(node.id);
      const canUnlock = canUnlockNode(node.id);
      const isHovered = hoveredNode === node.id;
      const categoryInfo = techTree.categories.find(c => c.value === node.category);

      const nodeRadius = 28 * scale;
      const glowRadius = nodeRadius + 8 * scale;

      if (isHovered && status !== 'locked') {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, glowRadius, 0, Math.PI * 2);
        const glowGradient = ctx.createRadialGradient(pos.x, pos.y, nodeRadius, pos.x, pos.y, glowRadius);
        glowGradient.addColorStop(0, categoryInfo?.color || '#C9A959');
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (status === 'completed') {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeRadius + 4 * scale, 0, Math.PI * 2);
        ctx.strokeStyle = categoryInfo?.color || '#C9A959';
        ctx.lineWidth = 3 * scale;
        ctx.globalAlpha = 0.8;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, nodeRadius);

      if (status === 'locked') {
        gradient.addColorStop(0, '#f5f0e8');
        gradient.addColorStop(1, '#e2d5be');
      } else if (status === 'unlocked') {
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, categoryInfo?.color || '#C9A959');
      } else {
        gradient.addColorStop(0, categoryInfo?.color || '#C9A959');
        gradient.addColorStop(1, '#C8102E');
      }

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
      ctx.strokeStyle = status === 'locked' ? '#d4c4a8' : categoryInfo?.color || '#C9A959';
      ctx.lineWidth = 2 * scale;
      ctx.stroke();

      ctx.font = `${20 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      if (status === 'locked') {
        ctx.fillStyle = '#a4a4a4';
        ctx.fillText('🔒', pos.x, pos.y);
      } else if (status === 'completed') {
        ctx.fillStyle = '#ffffff';
        ctx.fillText('✓', pos.x, pos.y);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillText(categoryInfo?.icon || '🪭', pos.x, pos.y);
      }

      const labelY = pos.y + nodeRadius + 18 * scale;
      ctx.font = `bold ${11 * scale}px "Noto Serif SC", serif`;
      ctx.fillStyle = status === 'locked' ? '#818181' : '#1A1A1A';
      ctx.fillText(node.name, pos.x, labelY);

      ctx.font = `${9 * scale}px "Noto Sans SC", sans-serif`;
      ctx.fillStyle = '#818181';
      ctx.fillText(node.era, pos.x, labelY + 14 * scale);

      if (status === 'unlocked' && canUnlock) {
        ctx.beginPath();
        ctx.arc(pos.x + nodeRadius - 5 * scale, pos.y - nodeRadius + 5 * scale, 8 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#7D9B6A';
        ctx.fill();
        ctx.font = `${10 * scale}px sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText('+', pos.x + nodeRadius - 5 * scale, pos.y - nodeRadius + 5 * scale + 1 * scale);
      }

      if (status === 'completed') {
        ctx.beginPath();
        ctx.arc(pos.x + nodeRadius - 5 * scale, pos.y - nodeRadius + 5 * scale, 8 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#C9A959';
        ctx.fill();
        ctx.font = `${10 * scale}px sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText('★', pos.x + nodeRadius - 5 * scale, pos.y - nodeRadius + 5 * scale + 1 * scale);
      }
    });
  }, [techTree, offset, scale, hoveredNode, filterCategory, getNodeStatus, canUnlockNode]);

  useEffect(() => {
    drawTree();
  }, [drawTree]);

  useEffect(() => {
    const handleResize = () => drawTree();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawTree]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - offset.x;
    const y = e.clientY - rect.top - offset.y;
    const centerX = rect.width / 2;
    const centerY = 80;

    for (const node of techTree.nodes) {
      if (filterCategory && node.category !== filterCategory) continue;

      const nodeX = centerX + (node.position.x - 50) * 6 * scale;
      const nodeY = centerY + node.position.y * 70 * scale;
      const nodeRadius = 28 * scale;

      const distance = Math.sqrt(Math.pow(x - nodeX, 2) + Math.pow(y - nodeY, 2));

      if (distance <= nodeRadius) {
        const status = getNodeStatus(node.id);
        if (status === 'unlocked') {
          openModal(node.id);
        } else if (status === 'locked' && canUnlockNode(node.id)) {
          unlockNode(node.id);
        } else if (status === 'locked') {
          openModal(node.id);
        } else {
          openModal(node.id);
        }
        return;
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - offset.x;
    const y = e.clientY - rect.top - offset.y;
    const centerX = rect.width / 2;
    const centerY = 80;

    let foundNode: string | null = null;
    for (const node of techTree.nodes) {
      if (filterCategory && node.category !== filterCategory) continue;

      const nodeX = centerX + (node.position.x - 50) * 6 * scale;
      const nodeY = centerY + node.position.y * 70 * scale;
      const nodeRadius = 28 * scale;

      const distance = Math.sqrt(Math.pow(x - nodeX, 2) + Math.pow(y - nodeY, 2));

      if (distance <= nodeRadius) {
        foundNode = node.id;
        break;
      }
    }

    setHoveredNode(foundNode);
    canvas.style.cursor = foundNode ? 'pointer' : isDragging ? 'grabbing' : 'grab';
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const getCategoryNodeCount = (category: string) => {
    return techTree.nodes.filter(n => n.category === category).length;
  };

  const getCategoryUnlockedCount = (category: string) => {
    return techTree.nodes.filter(n => n.category === category && userProgress.unlockedNodeIds.includes(n.id)).length;
  };

  const exploredPercentage = getExploredPercentage();

  return (
    <div className="min-h-screen bg-paper-50 pt-20 md:pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-vermilion-500 via-gold-500 to-bamboo-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-3 mb-2">
                <span className="w-px h-4 bg-white/40" />
                <span className="text-white/80 font-serif-sc text-sm tracking-widest">文明演化树</span>
                <span className="w-px h-4 bg-white/40" />
              </div>
              <h1 className="font-serif-sc text-3xl md:text-4xl font-bold mb-2">扇韵千秋</h1>
              <p className="text-white/70 text-sm">
                从远古障扇到现代工艺，穿越五千年扇文化演化历程，解锁每一个历史节点
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <Star size={18} />
                <span className="font-serif-sc font-bold">{userProgress.totalPoints}</span>
                <span className="text-white/70 text-sm">积分</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <Award size={18} />
                <span className="font-serif-sc font-bold">
                  {userProgress.achievements.filter(a => a.unlocked).length}/{userProgress.achievements.length}
                </span>
                <span className="text-white/70 text-sm">成就</span>
              </div>
              <button
                onClick={() => setShowAchievements(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
              >
                <Award size={18} />
                <span className="text-sm">成就墙</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
              <div className="p-4 border-b border-paper-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <TreePine size={20} className="text-vermilion-600" />
                  <span className="font-serif-sc font-bold text-ink-800">扇文化科技树</span>
                  <div className="flex items-center gap-1.5 text-xs text-ink-400 ml-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-vermilion-500 animate-pulse" />
                    已探索 {exploredPercentage}%
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setScale(prev => Math.min(2, prev + 0.2))}
                    className="p-2 rounded-lg bg-paper-100 hover:bg-paper-200 transition-colors"
                    title="放大"
                  >
                    <ZoomIn size={16} className="text-ink-600" />
                  </button>
                  <button
                    onClick={() => setScale(prev => Math.max(0.5, prev - 0.2))}
                    className="p-2 rounded-lg bg-paper-100 hover:bg-paper-200 transition-colors"
                    title="缩小"
                  >
                    <ZoomOut size={16} className="text-ink-600" />
                  </button>
                  <button
                    onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }); }}
                    className="p-2 rounded-lg bg-paper-100 hover:bg-paper-200 transition-colors"
                    title="重置视图"
                  >
                    <RotateCcw size={16} className="text-ink-600" />
                  </button>
                </div>
              </div>

              <div
                ref={containerRef}
                className="relative overflow-hidden"
                style={{ height: '600px' }}
              >
                <canvas
                  ref={canvasRef}
                  className="w-full h-full cursor-grab active:cursor-grabbing"
                  style={{ background: 'linear-gradient(180deg, #fdfcf9 0%, #f9f6ed 100%)' }}
                  onClick={handleCanvasClick}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                />

                <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                  <div className="text-xs text-ink-500 font-serif-sc mb-2">图例</div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-4 h-4 rounded-full bg-gradient-to-br from-vermilion-500 to-gold-500 flex items-center justify-center text-white text-[10px]">✓</span>
                      <span className="text-ink-600">已完成</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-4 h-4 rounded-full bg-gradient-to-br from-white to-gold-400 border border-gold-400 flex items-center justify-center text-white text-[10px]">🪭</span>
                      <span className="text-ink-600">已解锁</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-4 h-4 rounded-full bg-paper-200 border border-paper-300 flex items-center justify-center text-ink-400 text-[10px]">🔒</span>
                      <span className="text-ink-600">未解锁</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg flex items-center gap-1">
                  <Move size={14} className="text-ink-400" />
                  <span className="text-xs text-ink-500">拖拽移动</span>
                  <span className="text-ink-300 mx-1">|</span>
                  <span className="text-xs text-ink-500">滚轮缩放</span>
                </div>
              </div>
            </div>

            {hoveredNode && (
              <div className="mt-4 bg-white rounded-2xl shadow-elegant p-5 animate-fade-in-up">
                <NodePreview nodeId={hoveredNode} />
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white rounded-2xl shadow-elegant p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center">
                  <Filter size={20} />
                </div>
                <div>
                  <h3 className="font-serif-sc text-lg font-bold text-ink-800">分类筛选</h3>
                  <p className="text-sm text-ink-400">选择分支查看</p>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setFilterCategory(null)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    filterCategory === null
                      ? 'bg-vermilion-50 border-2 border-vermilion-300'
                      : 'bg-paper-50 border-2 border-transparent hover:bg-paper-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🌳</span>
                    <span className={`text-sm font-serif-sc ${filterCategory === null ? 'text-vermilion-700' : 'text-ink-700'}`}>
                      全部分支
                    </span>
                  </div>
                  <span className="text-xs text-ink-400">
                    {techTree.nodes.length} 节点
                  </span>
                </button>

                {techTree.categories.map(category => {
                  const total = getCategoryNodeCount(category.value);
                  const unlocked = getCategoryUnlockedCount(category.value);
                  return (
                    <button
                      key={category.value}
                      onClick={() => setFilterCategory(filterCategory === category.value ? null : category.value)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                        filterCategory === category.value
                          ? 'bg-vermilion-50 border-2 border-vermilion-300'
                          : 'bg-paper-50 border-2 border-transparent hover:bg-paper-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{category.icon}</span>
                        <span className={`text-sm font-serif-sc ${filterCategory === category.value ? 'text-vermilion-700' : 'text-ink-700'}`}>
                          {category.label}
                        </span>
                      </div>
                      <span className="text-xs text-ink-400">
                        {unlocked}/{total}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-elegant p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-bamboo-100 text-bamboo-600 flex items-center justify-center">
                  <Info size={20} />
                </div>
                <div>
                  <h3 className="font-serif-sc text-lg font-bold text-ink-800">探索指南</h3>
                  <p className="text-sm text-ink-400">如何解锁节点</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-paper-50 rounded-xl">
                  <Unlock size={16} className="text-bamboo-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-ink-700">点击可解锁节点</p>
                    <p className="text-xs text-ink-500 mt-0.5">绿色+号表示该节点可以解锁</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-paper-50 rounded-xl">
                  <Lock size={16} className="text-ink-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-ink-700">完成前置解锁</p>
                    <p className="text-xs text-ink-500 mt-0.5">解锁上游节点后才能解锁下游节点</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-paper-50 rounded-xl">
                  <CheckCircle size={16} className="text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-ink-700">学习完成节点</p>
                    <p className="text-xs text-ink-500 mt-0.5">查看详情后标记为完成，获得奖励</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-elegant p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-vermilion-100 text-vermilion-600 flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-serif-sc text-lg font-bold text-ink-800">探索进度</h3>
                  <p className="text-sm text-ink-400">你的学习轨迹</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-ink-600">总体进度</span>
                  <span className="font-bold text-vermilion-600">{exploredPercentage}%</span>
                </div>
                <div className="h-3 bg-paper-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-vermilion-500 to-gold-500 rounded-full transition-all duration-500"
                    style={{ width: `${exploredPercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-paper-50 rounded-xl">
                  <div className="text-2xl font-serif-sc font-bold text-vermilion-600">
                    {userProgress.unlockedNodeIds.length}
                  </div>
                  <div className="text-xs text-ink-500">已解锁</div>
                </div>
                <div className="text-center p-3 bg-paper-50 rounded-xl">
                  <div className="text-2xl font-serif-sc font-bold text-gold-600">
                    {userProgress.completedNodeIds.length}
                  </div>
                  <div className="text-xs text-ink-500">已完成</div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm('确定要重置所有探索进度吗？此操作不可恢复。')) {
                    resetProgress();
                  }
                }}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-paper-100 text-ink-500 rounded-xl hover:bg-paper-200 transition-colors text-sm"
              >
                <RotateCcw size={16} />
                重置进度
              </button>
            </div>
          </div>
        </div>
      </div>

      <TechTreeNodeModal />

      {showAchievements && (
        <AchievementsModal onClose={() => setShowAchievements(false)} />
      )}
    </div>
  );
}

function NodePreview({ nodeId }: { nodeId: string }) {
  const { techTree, getNodeStatus } = useTechTreeStore();
  const node = techTree.nodes.find(n => n.id === nodeId);

  if (!node) return null;

  const status = getNodeStatus(nodeId);
  const categoryInfo = techTree.categories.find(c => c.value === node.category);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div
        className="w-full sm:w-48 h-32 rounded-xl flex-shrink-0 flex items-center justify-center text-6xl"
        style={{ backgroundColor: `${categoryInfo?.color}15` }}
      >
        {status === 'locked' ? '🔒' : categoryInfo?.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${categoryInfo?.color}20`, color: categoryInfo?.color }}
          >
            {categoryInfo?.label}
          </span>
          <span className="text-xs text-ink-400">{node.era}</span>
        </div>
        <h4 className="font-serif-sc text-lg font-bold text-ink-800 mb-2">{node.name}</h4>
        <p className="text-sm text-ink-600 line-clamp-2 mb-3">{node.description}</p>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-gold-500" />
            <span className="text-ink-500">{node.rewardPoints} 积分</span>
          </div>
          <div className="flex items-center gap-1">
            <ChevronRight size={14} className="text-ink-400" />
            <span className="text-ink-500">点击查看详情</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AchievementsModal({ onClose }: { onClose: () => void }) {
  const { userProgress } = useTechTreeStore();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl animate-fade-in-up">
        <div className="p-6 border-b border-paper-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif-sc text-2xl font-bold text-ink-800">成就墙</h2>
              <p className="text-ink-500 text-sm mt-1">
                已解锁 {userProgress.achievements.filter(a => a.unlocked).length}/{userProgress.achievements.length} 个成就
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-paper-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid sm:grid-cols-2 gap-4">
            {userProgress.achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-gold-50 to-vermilion-50 border-gold-300'
                    : 'bg-paper-50 border-paper-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-4xl ${!achievement.unlocked && 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-serif-sc font-bold ${achievement.unlocked ? 'text-ink-800' : 'text-ink-500'}`}>
                      {achievement.name}
                    </h4>
                    <p className="text-sm text-ink-500 mt-1">{achievement.description}</p>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <p className="text-xs text-gold-600 mt-2">
                        解锁于 {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                    {!achievement.unlocked && (
                      <p className="text-xs text-ink-400 mt-2">
                        解锁条件：{achievement.requirement}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
