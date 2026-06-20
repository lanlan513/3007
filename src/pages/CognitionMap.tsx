import { useState, useEffect, useRef } from 'react';
import { useTechTreeStore } from '@/store/useTechTreeStore';
import { Map as MapIcon, Network, GitBranch, Clock, Calendar, Sparkles, Edit3, Save, Download, Share2, RefreshCw, BookOpen, Award, TrendingUp, Layers } from 'lucide-react';
import type { CognitionMapStyle } from '../../shared/types';

export default function CognitionMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');

  const {
    techTree,
    cognitionMap,
    userProgress,
    init,
    updateCognitionMapStyle,
    updateCognitionMapMetadata,
    generateCognitionMapInsights,
  } = useTechTreeStore();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    setTitleInput(cognitionMap.title || '');
    setDescInput(cognitionMap.description || '');
  }, [cognitionMap.title, cognitionMap.description]);

  useEffect(() => {
    if (cognitionMap.insights.length === 0) {
      generateCognitionMapInsights();
    }
  }, [cognitionMap.insights.length, generateCognitionMapInsights]);

  useEffect(() => {
    if (cognitionMap.style === 'tree' || cognitionMap.style === 'radial') {
      drawCanvasMap();
    }
  }, [cognitionMap, techTree]);

  const drawCanvasMap = () => {
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

    ctx.clearRect(0, 0, width, height);

    const exploredNodeIds = cognitionMap.nodes.map(n => n.nodeId);
    const exploredNodes = techTree.nodes.filter(n => exploredNodeIds.includes(n.id));

    if (exploredNodes.length === 0) return;

    const centerX = width / 2;
    const centerY = height / 2;

    if (cognitionMap.style === 'radial') {
      const maxDepth = Math.max(...cognitionMap.nodes.map(n => n.depth));
      const radiusStep = Math.min(width, height) / (maxDepth + 2) / 2;

      const nodePositions: Map<string, { x: number; y: number }> = new (window.Map)();

      cognitionMap.nodes.forEach((cogNode, idx) => {
        const node = techTree.nodes.find(n => n.id === cogNode.nodeId);
        if (!node) return;

        const categoryInfo = techTree.categories.find(c => c.value === node.category);

        if (cogNode.depth === 0) {
          nodePositions.set(cogNode.nodeId, { x: centerX, y: centerY });
        } else {
          const nodesAtDepth = cognitionMap.nodes.filter(n => n.depth === cogNode.depth);
          const angle = (2 * Math.PI * nodesAtDepth.findIndex(n => n.nodeId === cogNode.nodeId)) / nodesAtDepth.length;
          const radius = radiusStep * (cogNode.depth + 1);
          nodePositions.set(cogNode.nodeId, {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
          });
        }
      });

      cognitionMap.nodes.forEach(cogNode => {
        const pos = nodePositions.get(cogNode.nodeId);
        if (!pos) return;

        cogNode.connections.forEach(connId => {
          const connPos = nodePositions.get(connId);
          if (!connPos) return;

          const node = techTree.nodes.find(n => n.id === cogNode.nodeId);
          const categoryInfo = techTree.categories.find(c => c.value === node?.category);

          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
          ctx.lineTo(connPos.x, connPos.y);
          ctx.strokeStyle = categoryInfo?.color || '#C9A959';
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.3;
          ctx.stroke();
          ctx.globalAlpha = 1;
        });
      });

      cognitionMap.nodes.forEach(cogNode => {
        const pos = nodePositions.get(cogNode.nodeId);
        const node = techTree.nodes.find(n => n.id === cogNode.nodeId);
        if (!pos || !node) return;

        const categoryInfo = techTree.categories.find(c => c.value === node.category);
        const nodeRadius = 24;

        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, nodeRadius);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, categoryInfo?.color || '#C9A959');

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
        ctx.strokeStyle = categoryInfo?.color || '#C9A959';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(categoryInfo?.icon || '🪭', pos.x, pos.y);

        ctx.font = 'bold 10px "Noto Serif SC", serif';
        ctx.fillStyle = '#1A1A1A';
        ctx.fillText(node.name, pos.x, pos.y + nodeRadius + 12);
      });
    } else if (cognitionMap.style === 'tree') {
      const layers: Map<number, string[]> = new (window.Map)();
      cognitionMap.nodes.forEach(cogNode => {
        const existing = layers.get(cogNode.depth) || [];
        layers.set(cogNode.depth, [...existing, cogNode.nodeId]);
      });

      const maxLayerSize = Math.max(...Array.from(layers.values()).map(l => l.length));
      const layerWidth = width / (layers.size + 1);
      const nodeHeight = height / (maxLayerSize + 1);

      const nodePositions: Map<string, { x: number; y: number }> = new (window.Map)();

      layers.forEach((nodeIds, depth) => {
        const x = layerWidth * (depth + 1);
        nodeIds.forEach((nodeId, idx) => {
          const y = nodeHeight * (idx + 1);
          nodePositions.set(nodeId, { x, y });
        });
      });

      cognitionMap.nodes.forEach(cogNode => {
        const pos = nodePositions.get(cogNode.nodeId);
        if (!pos) return;

        cogNode.connections.forEach(connId => {
          const connPos = nodePositions.get(connId);
          if (!connPos) return;

          const node = techTree.nodes.find(n => n.id === cogNode.nodeId);
          const categoryInfo = techTree.categories.find(c => c.value === node?.category);

          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
          ctx.bezierCurveTo(
            (pos.x + connPos.x) / 2, pos.y,
            (pos.x + connPos.x) / 2, connPos.y,
            connPos.x, connPos.y
          );
          ctx.strokeStyle = categoryInfo?.color || '#C9A959';
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.3;
          ctx.stroke();
          ctx.globalAlpha = 1;
        });
      });

      cognitionMap.nodes.forEach(cogNode => {
        const pos = nodePositions.get(cogNode.nodeId);
        const node = techTree.nodes.find(n => n.id === cogNode.nodeId);
        if (!pos || !node) return;

        const categoryInfo = techTree.categories.find(c => c.value === node.category);
        const nodeRadius = 22;

        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, nodeRadius);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, categoryInfo?.color || '#C9A959');

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
        ctx.strokeStyle = categoryInfo?.color || '#C9A959';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(categoryInfo?.icon || '🪭', pos.x, pos.y);

        ctx.font = 'bold 10px "Noto Serif SC", serif';
        ctx.fillStyle = '#1A1A1A';
        ctx.fillText(node.name, pos.x + nodeRadius + 10, pos.y + 3);
      });
    }
  };

  const handleSaveTitle = () => {
    updateCognitionMapMetadata(titleInput, undefined);
    setIsEditingTitle(false);
  };

  const handleSaveDesc = () => {
    updateCognitionMapMetadata(undefined, descInput);
    setIsEditingDesc(false);
  };

  const styleOptions: { value: CognitionMapStyle; label: string; icon: typeof MapIcon }[] = [
    { value: 'tree', label: '树形布局', icon: GitBranch },
    { value: 'radial', label: '放射布局', icon: Network },
    { value: 'timeline', label: '时间轴', icon: Clock },
    { value: 'network', label: '网络视图', icon: MapIcon },
  ];

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-paper-50 pt-20 md:pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-bamboo-500 via-vermilion-500 to-gold-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-3 mb-2">
                <span className="w-px h-4 bg-white/40" />
                <span className="text-white/80 font-serif-sc text-sm tracking-widest">个人认知地图</span>
                <span className="w-px h-4 bg-white/40" />
              </div>
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    value={titleInput}
                    onChange={e => setTitleInput(e.target.value)}
                    className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-white font-serif-sc text-3xl md:text-4xl font-bold focus:outline-none focus:ring-2 focus:ring-white/30"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Save size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="font-serif-sc text-3xl md:text-4xl font-bold mb-2">
                    {cognitionMap.title}
                  </h1>
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              )}
              {isEditingDesc ? (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    value={descInput}
                    onChange={e => setDescInput(e.target.value)}
                    className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 w-full max-w-md"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveDesc}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors shrink-0"
                  >
                    <Save size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-white/70 text-sm">
                    {cognitionMap.description}
                  </p>
                  <button
                    onClick={() => setIsEditingDesc(true)}
                    className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <Calendar size={18} />
                <div className="text-right">
                  <div className="text-xs text-white/70">创建于</div>
                  <div className="text-sm font-medium">{formatDate(cognitionMap.createdAt)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <TrendingUp size={18} />
                <div className="text-right">
                  <div className="text-xs text-white/70">已探索</div>
                  <div className="text-sm font-medium">{cognitionMap.exploredPercentage}%</div>
                </div>
              </div>
              <button
                onClick={() => generateCognitionMapInsights()}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
              >
                <RefreshCw size={18} />
                <span className="text-sm">生成洞察</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-elegant p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Layers size={20} className="text-vermilion-600" />
                  <span className="font-serif-sc font-bold text-ink-800">视图切换</span>
                </div>
                <div className="flex gap-2">
                  {styleOptions.map(style => (
                    <button
                      key={style.value}
                      onClick={() => updateCognitionMapStyle(style.value)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all ${
                        cognitionMap.style === style.value
                          ? 'bg-vermilion-500 text-white shadow-lg'
                          : 'bg-paper-100 text-ink-600 hover:bg-paper-200'
                      }`}
                    >
                      <style.icon size={16} />
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {cognitionMap.style === 'timeline' ? (
                <TimelineView />
              ) : cognitionMap.style === 'network' ? (
                <NetworkView />
              ) : (
                <div className="relative" style={{ height: '500px' }}>
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    style={{ background: 'linear-gradient(180deg, #fdfcf9 0%, #f9f6ed 100%)' }}
                  />
                  {cognitionMap.nodes.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapIcon size={48} className="text-paper-300 mx-auto mb-3" />
                        <p className="text-ink-400 font-serif-sc">还没有探索记录</p>
                        <p className="text-sm text-ink-400 mt-1">去科技树探索扇文化吧</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {cognitionMap.insights.length > 0 && (
              <div className="bg-white rounded-2xl shadow-elegant p-6">
                <h3 className="font-serif-sc text-xl font-bold text-ink-800 mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-gold-500" />
                  我的学习洞察
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {cognitionMap.insights.map((insight, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gradient-to-br from-paper-50 to-white rounded-xl border border-paper-100"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vermilion-100 to-gold-100 flex items-center justify-center text-vermilion-600 font-serif-sc font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-ink-700 leading-relaxed">{insight}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-elegant p-6">
              <h3 className="font-serif-sc text-xl font-bold text-ink-800 mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-bamboo-600" />
                探索轨迹
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {[...cognitionMap.nodes]
                  .sort((a, b) => b.exploredAt - a.exploredAt)
                  .map((cogNode, idx) => {
                    const node = techTree.nodes.find(n => n.id === cogNode.nodeId);
                    if (!node) return null;
                    const categoryInfo = techTree.categories.find(c => c.value === node.category);
                    return (
                      <div
                        key={cogNode.nodeId}
                        className="flex items-center gap-4 p-4 bg-paper-50 rounded-xl hover:bg-paper-100 transition-colors"
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${categoryInfo?.color}20` }}
                        >
                          {categoryInfo?.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ backgroundColor: `${categoryInfo?.color}20`, color: categoryInfo?.color }}
                            >
                              {categoryInfo?.label}
                            </span>
                            <span className="text-xs text-ink-400">
                              {formatDate(cogNode.exploredAt)}
                            </span>
                          </div>
                          <h4 className="font-serif-sc font-bold text-ink-800">{node.name}</h4>
                          {cogNode.notes && (
                            <p className="text-sm text-ink-500 mt-1 line-clamp-1">{cogNode.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-ink-400">深度</div>
                          <div className="font-serif-sc font-bold text-ink-700">{cogNode.depth}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white rounded-2xl shadow-elegant p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="font-serif-sc text-lg font-bold text-ink-800">学习成就</h3>
                  <p className="text-sm text-ink-400">已解锁成就</p>
                </div>
              </div>
              <div className="space-y-2">
                {userProgress.achievements
                  .filter(a => a.unlocked)
                  .slice(0, 6)
                  .map(achievement => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-3 p-2.5 bg-gradient-to-r from-gold-50 to-vermilion-50 rounded-xl"
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif-sc font-bold text-ink-800 text-sm truncate">
                          {achievement.name}
                        </p>
                        <p className="text-xs text-ink-500 truncate">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                {userProgress.achievements.filter(a => a.unlocked).length === 0 && (
                  <div className="text-center py-6 text-ink-400">
                    <Award size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">还没有解锁成就</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-elegant p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-bamboo-100 text-bamboo-600 flex items-center justify-center">
                  <Download size={20} />
                </div>
                <div>
                  <h3 className="font-serif-sc text-lg font-bold text-ink-800">导出地图</h3>
                  <p className="text-sm text-ink-400">保存你的认知地图</p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (!canvas) return;
                    const link = document.createElement('a');
                    link.download = `${cognitionMap.title || '我的扇文化认知地图'}.png`;
                    link.href = canvas.toDataURL();
                    link.click();
                  }}
                  disabled={cognitionMap.nodes.length === 0}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-vermilion-500 to-gold-500 text-white rounded-xl font-serif-sc font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={18} />
                  导出为图片
                </button>
                <button
                  onClick={() => {
                    const data = {
                      title: cognitionMap.title,
                      description: cognitionMap.description,
                      insights: cognitionMap.insights,
                      nodes: cognitionMap.nodes.map(n => {
                        const node = techTree.nodes.find(tn => tn.id === n.nodeId);
                        return {
                          name: node?.name,
                          era: node?.era,
                          notes: n.notes,
                          exploredAt: new Date(n.exploredAt).toLocaleDateString(),
                        };
                      }),
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = `${cognitionMap.title || '我的扇文化认知地图'}.json`;
                    link.href = url;
                    link.click();
                  }}
                  disabled={cognitionMap.nodes.length === 0}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-paper-100 text-ink-700 rounded-xl font-serif-sc hover:bg-paper-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Share2 size={18} />
                  导出数据
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-elegant p-5">
              <h3 className="font-serif-sc font-bold text-ink-800 mb-4 flex items-center gap-2">
                <Layers size={18} className="text-vermilion-600" />
                分类探索统计
              </h3>
              <div className="space-y-3">
                {techTree.categories.map(category => {
                  const total = techTree.nodes.filter(n => n.category === category.value).length;
                  const explored = cognitionMap.nodes.filter(n => {
                    const node = techTree.nodes.find(tn => tn.id === n.nodeId);
                    return node?.category === category.value;
                  }).length;
                  const percentage = total > 0 ? Math.round((explored / total) * 100) : 0;

                  return (
                    <div key={category.value} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span className="font-serif-sc text-ink-700">{category.label}</span>
                        </div>
                        <span className="text-ink-500">{explored}/{total}</span>
                      </div>
                      <div className="h-2 bg-paper-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: category.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineView() {
  const { techTree, cognitionMap } = useTechTreeStore();

  const sortedNodes = [...cognitionMap.nodes]
    .sort((a, b) => a.exploredAt - b.exploredAt)
    .map(cogNode => {
      const node = techTree.nodes.find(n => n.id === cogNode.nodeId);
      return { ...cogNode, ...node };
    });

  if (sortedNodes.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height: '500px' }}>
        <div className="text-center">
          <Clock size={48} className="text-paper-300 mx-auto mb-3" />
          <p className="text-ink-400 font-serif-sc">还没有探索记录</p>
          <p className="text-sm text-ink-400 mt-1">去科技树探索扇文化吧</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ height: '500px', overflowX: 'auto' }}>
      <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-vermilion-300 via-gold-400 to-bamboo-400" />
      <div className="space-y-6 py-4 px-4" style={{ minWidth: '600px' }}>
        {sortedNodes.map((node, idx) => {
          const categoryInfo = techTree.categories.find(c => c.value === node.category);
          return (
            <div key={node.nodeId} className="relative pl-8">
              <div
                className="absolute left-0 top-0 w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: categoryInfo?.color || '#C9A959' }}
              >
                {idx + 1}
              </div>
              <div className="bg-paper-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{categoryInfo?.icon}</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: `${categoryInfo?.color}20`, color: categoryInfo?.color }}
                      >
                        {categoryInfo?.label}
                      </span>
                    </div>
                    <h4 className="font-serif-sc font-bold text-ink-800 text-lg">{node.name}</h4>
                  </div>
                  <div className="text-right text-xs text-ink-400">
                    <div>{node.era}</div>
                    <div>探索于 {new Date(node.exploredAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <p className="text-sm text-ink-600">{node.description}</p>
                {node.notes && (
                  <div className="mt-3 p-3 bg-white rounded-lg border-l-4 border-gold-400">
                    <p className="text-sm text-ink-500">
                      <span className="font-medium text-ink-700">我的笔记：</span>
                      {node.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NetworkView() {
  const { techTree, cognitionMap } = useTechTreeStore();
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    if (svgContainerRef.current) {
      const rect = svgContainerRef.current.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    }
  }, []);

  const exploredNodeIds = cognitionMap.nodes.map(n => n.nodeId);

  const nodes = techTree.nodes
    .filter(n => exploredNodeIds.includes(n.id))
    .map(node => {
      const cogNode = cognitionMap.nodes.find(cn => cn.nodeId === node.id);
      return { ...node, ...cogNode };
    });

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height: '500px' }}>
        <div className="text-center">
          <Network size={48} className="text-paper-300 mx-auto mb-3" />
          <p className="text-ink-400 font-serif-sc">还没有探索记录</p>
          <p className="text-sm text-ink-400 mt-1">去科技树探索扇文化吧</p>
        </div>
      </div>
    );
  }

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  const nodePositions = new (window.Map)<string, { x: number; y: number }>();

  nodes.forEach((node, idx) => {
    const angle = (2 * Math.PI * idx) / nodes.length;
    const radius = Math.min(dimensions.width, dimensions.height) * 0.35;
    nodePositions.set(node.id, {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  });

  return (
    <div ref={svgContainerRef} style={{ height: '500px' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {nodes.map(node =>
          node.connections?.map(connId => {
            const fromPos = nodePositions.get(node.id);
            const toPos = nodePositions.get(connId);
            if (!fromPos || !toPos) return null;

            const categoryInfo = techTree.categories.find(c => c.value === node.category);

            return (
              <line
                key={`${node.id}-${connId}`}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke={categoryInfo?.color || '#C9A959'}
                strokeWidth="2"
                opacity="0.3"
              />
            );
          })
        )}

        {nodes.map(node => {
          const pos = nodePositions.get(node.id);
          if (!pos) return null;

          const categoryInfo = techTree.categories.find(c => c.value === node.category);

          return (
            <g key={node.id} className="cursor-pointer">
              <circle
                cx={pos.x}
                cy={pos.y}
                r="28"
                fill={`url(#gradient-${node.id})`}
                stroke={categoryInfo?.color || '#C9A959'}
                strokeWidth="2"
                filter="url(#glow)"
              />
              <defs>
                <radialGradient id={`gradient-${node.id}`}>
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor={categoryInfo?.color || '#C9A959'} />
                </radialGradient>
              </defs>
              <text
                x={pos.x}
                y={pos.y + 6}
                textAnchor="middle"
                fontSize="20"
                fill="#ffffff"
              >
                {categoryInfo?.icon || '🪭'}
              </text>
              <text
                x={pos.x}
                y={pos.y + 50}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#1A1A1A"
                fontFamily="'Noto Serif SC', serif"
              >
                {node.name}
              </text>
            </g>
          );
        })}

        <circle
          cx={centerX}
          cy={centerY}
          r="40"
          fill="url(#center-gradient)"
          stroke="#C8102E"
          strokeWidth="3"
          filter="url(#glow)"
        />
        <defs>
          <radialGradient id="center-gradient">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#C8102E" />
          </radialGradient>
        </defs>
        <text
          x={centerX}
          y={centerY + 6}
          textAnchor="middle"
          fontSize="24"
          fill="#ffffff"
        >
          🪭
        </text>
        <text
          x={centerX}
          y={centerY + 65}
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill="#C8102E"
          fontFamily="'Noto Serif SC', serif"
        >
          扇文化
        </text>
      </svg>
    </div>
  );
}
