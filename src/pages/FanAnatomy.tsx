import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Layers,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Sparkles,
  Hammer,
  BookOpen,
  Info,
  ChevronRight,
  Gauge,
  Eye,
  Coins,
  X,
  Maximize2,
  Clock,
  History,
  Lightbulb,
  RotateCw,
} from 'lucide-react';
import {
  FAN_COMPONENTS,
  PRESET_FANS,
  calculateStats,
  type FanComponentType,
  type FanStructure,
} from '@/data/fanAnatomyData';

export default function FanAnatomy() {
  const [activePreset, setActivePreset] = useState<FanStructure>(PRESET_FANS[0]);
  const [exploded, setExploded] = useState(false);
  const [explodeProgress, setExplodeProgress] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [selectedComponent, setSelectedComponent] = useState<FanComponentType | null>(null);
  const [activeTab, setActiveTab] = useState<'intro' | 'craft' | 'culture' | 'material'>('intro');
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const stats = calculateStats(activePreset, FAN_COMPONENTS);

  useEffect(() => {
    const target = exploded ? 1 : 0;
    let cancelled = false;
    setExplodeProgress(prev => {
      const step = 0.05 * (target > prev ? 1 : -1);
      let current = prev;
      const interval = setInterval(() => {
        if (cancelled) {
          clearInterval(interval);
          return;
        }
        current += step;
        if ((step > 0 && current >= target) || (step < 0 && current <= target)) {
          current = target;
          clearInterval(interval);
        }
        setExplodeProgress(current);
      }, 16);
      return prev;
    });
    return () => {
      cancelled = true;
    };
  }, [exploded]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: rotateX,
      rotY: rotateY,
    };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setRotateY(Math.max(-90, Math.min(90, dragStart.current.rotY + dx * 0.3)));
    setRotateX(Math.max(-45, Math.min(45, dragStart.current.rotX - dy * 0.3)));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const resetView = () => {
    setRotateX(0);
    setRotateY(0);
    setZoom(1);
    setExploded(false);
    setSelectedComponent(null);
  };

  const getComponentOffset = (id: FanComponentType) => {
    const comp = FAN_COMPONENTS[id];
    return {
      x: comp.explodeOffset.x * explodeProgress,
      y: comp.explodeOffset.y * explodeProgress,
    };
  };

  const selectedComp = selectedComponent ? FAN_COMPONENTS[selectedComponent] : null;

  return (
    <div className="min-h-screen bg-paper-50 pt-20 md:pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-vermilion-500 via-gold-500 to-bamboo-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-3 mb-2">
                <span className="w-px h-4 bg-white/40" />
                <span className="text-white/80 font-serif-sc text-sm tracking-widest">工艺解剖</span>
                <span className="w-px h-4 bg-white/40" />
              </div>
              <h1 className="font-serif-sc text-3xl md:text-4xl font-bold mb-2">扇艺解构</h1>
              <p className="text-white/70 text-sm">
                拆解每一把扇子的组件，探索结构细节、传统工艺与文化内涵
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-sm"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-sm"
              >
                <ZoomOut size={16} />
              </button>
              <button
                onClick={() => setExploded(!exploded)}
                className={`flex items-center gap-1.5 px-4 py-2 backdrop-blur-sm rounded-xl transition-colors text-sm ${
                  exploded ? 'bg-white text-vermilion-600' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <Layers size={16} />
                <span>{exploded ? '收起部件' : '爆炸视图'}</span>
              </button>
              <button
                onClick={resetView}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-sm"
              >
                <RotateCcw size={16} />
                <span>重置</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid xl:grid-cols-4 gap-6">
          <div className="xl:col-span-1 space-y-5">
            <div className="bg-white rounded-2xl shadow-elegant p-5">
              <h3 className="font-serif-sc font-bold text-ink-800 mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-gold-600" />
                扇型选择
              </h3>
              <div className="space-y-2">
                {PRESET_FANS.map(fan => {
                  const active = fan.id === activePreset.id;
                  return (
                    <button
                      key={fan.id}
                      onClick={() => {
                        setActivePreset(fan);
                        setSelectedComponent(null);
                      }}
                      className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                        active
                          ? 'border-vermilion-400 bg-vermilion-50 shadow-md'
                          : 'border-paper-200 hover:border-gold-300 hover:bg-paper-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-serif-sc font-bold ${active ? 'text-vermilion-600' : 'text-ink-700'}`}>
                          {fan.name}
                        </span>
                        <span className="text-xs text-ink-400">
                          {fan.fanType === 'folding' ? '折扇' : fan.fanType === 'round' ? '团扇' : '羽扇'}
                        </span>
                      </div>
                      <div className="text-xs text-ink-400">{fan.era}</div>
                      <div className="flex gap-1 mt-2">
                        {fan.components.map(c => (
                          <span
                            key={c}
                            className="text-base"
                            title={FAN_COMPONENTS[c].name}
                          >
                            {FAN_COMPONENTS[c].icon}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-elegant p-5">
              <h3 className="font-serif-sc font-bold text-ink-800 mb-4 flex items-center gap-2">
                <Gauge size={18} className="text-vermilion-600" />
                属性评估
              </h3>
              <div className="space-y-4">
                <StatBar
                  icon={<Gauge size={16} />}
                  label="耐久度"
                  value={stats.durability}
                  color="vermilion"
                  hint={stats.durability >= 75 ? '坚固耐用' : stats.durability >= 50 ? '中等耐久' : '需小心呵护'}
                />
                <StatBar
                  icon={<Eye size={16} />}
                  label="美观度"
                  value={stats.aesthetics}
                  color="gold"
                  hint={stats.aesthetics >= 80 ? '精美绝伦' : stats.aesthetics >= 60 ? '雅致大方' : '朴素实用'}
                />
                <StatBar
                  icon={<Coins size={16} />}
                  label="制作成本"
                  value={stats.cost}
                  color="bamboo"
                  hint={stats.cost >= 80 ? '价值连城' : stats.cost >= 50 ? '价格不菲' : '经济实惠'}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-elegant p-5">
              <h3 className="font-serif-sc font-bold text-ink-800 mb-4 flex items-center gap-2">
                <Info size={18} className="text-bamboo-600" />
                操作指南
              </h3>
              <ul className="space-y-2 text-sm text-ink-500">
                <li className="flex items-start gap-2">
                  <Move size={14} className="mt-0.5 text-ink-400 flex-shrink-0" />
                  <span>在扇面区<span className="text-vermilion-600 font-medium">拖动鼠标</span>可3D旋转视角</span>
                </li>
                <li className="flex items-start gap-2">
                  <Maximize2 size={14} className="mt-0.5 text-ink-400 flex-shrink-0" />
                  <span>点击工具栏的<span className="text-vermilion-600 font-medium">+/-</span>按钮缩放</span>
                </li>
                <li className="flex items-start gap-2">
                  <Layers size={14} className="mt-0.5 text-ink-400 flex-shrink-0" />
                  <span>点击<span className="text-vermilion-600 font-medium">爆炸视图</span>查看部件拆分</span>
                </li>
                <li className="flex items-start gap-2">
                  <Info size={14} className="mt-0.5 text-ink-400 flex-shrink-0" />
                  <span>点击扇部件查看<span className="text-vermilion-600 font-medium">详细工艺</span></span>
                </li>
              </ul>
            </div>
          </div>

          <div className="xl:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
              <div className="p-4 border-b border-paper-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-vermilion-500" />
                  <span className="w-3 h-3 rounded-full bg-gold-500" />
                  <span className="w-3 h-3 rounded-full bg-bamboo-500" />
                  <span className="ml-3 font-serif-sc font-bold text-ink-800">{activePreset.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-ink-400">
                  <div className="flex items-center gap-1">
                    <RotateCw size={12} className={isDragging ? 'animate-spin text-vermilion-500' : ''} />
                    X:{Math.round(rotateX)}° Y:{Math.round(rotateY)}°
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize2 size={12} />
                    {Math.round(zoom * 100)}%
                  </div>
                </div>
              </div>
              <div
                className="relative cursor-grab active:cursor-grabbing select-none"
                style={{
                  height: '540px',
                  background: `
                    radial-gradient(circle at 50% 40%, rgba(201, 169, 89, 0.08) 0%, transparent 60%),
                    linear-gradient(135deg, #fdfcf9 0%, #f9f6ed 50%, #f5f0e8 100%)
                  `,
                }}
                onMouseDown={handleMouseDown}
              >
                <svg
                  ref={svgRef}
                  viewBox="-200 -260 400 520"
                  className="w-full h-full"
                  style={{
                    transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${zoom})`,
                    transformStyle: 'preserve-3d',
                    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                  }}
                >
                  <defs>
                    <radialGradient id="shadow-grad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(0,0,0,0.12)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                    </radialGradient>
                    <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient id="ribs-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#a38b63" />
                      <stop offset="50%" stopColor="#857050" />
                      <stop offset="100%" stopColor="#6c5b42" />
                    </linearGradient>
                    <linearGradient id="surface-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(200, 16, 46, 0.12)" />
                      <stop offset="40%" stopColor="rgba(201, 169, 89, 0.08)" />
                      <stop offset="100%" stopColor="rgba(200, 16, 46, 0.04)" />
                    </linearGradient>
                    <linearGradient id="handle-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#7d5d33" />
                      <stop offset="100%" stopColor="#543f28" />
                    </linearGradient>
                    <pattern id="surface-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M0 20 Q 10 10, 20 20 T 40 20" stroke="rgba(200,16,46,0.06)" fill="none" strokeWidth="0.8" />
                      <path d="M0 0 Q 10 -10, 20 0 T 40 0" stroke="rgba(201,169,89,0.04)" fill="none" strokeWidth="0.6" />
                    </pattern>
                  </defs>

                  <ellipse cx="0" cy="150" rx="100" ry="15" fill="url(#shadow-grad)" />

                  <FanVisual
                    preset={activePreset}
                    selectedComponent={selectedComponent}
                    onSelect={setSelectedComponent}
                    getOffset={getComponentOffset}
                    explodeProgress={explodeProgress}
                  />
                </svg>

                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                  {activePreset.components.map(c => {
                    const comp = FAN_COMPONENTS[c];
                    const isSelected = selectedComponent === c;
                    return (
                      <button
                        key={c}
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedComponent(isSelected ? null : c);
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-vermilion-500 text-white shadow-md scale-105'
                            : 'bg-white/80 backdrop-blur-sm text-ink-600 border border-paper-200 hover:bg-white hover:shadow-sm'
                        }`}
                      >
                        <span>{comp.icon}</span>
                        <span>{comp.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MiniInfoCard icon="🦴" title="扇骨" subtitle={activePreset.selectedMaterials.ribs} color="#9c763d" />
              <MiniInfoCard icon="📜" title="扇面" subtitle={activePreset.selectedMaterials.surface} color="#C8102E" />
              <MiniInfoCard icon="🔩" title="扇钉" subtitle={activePreset.selectedMaterials.pivot} color="#C9A959" />
              <MiniInfoCard icon="💎" title="坠饰" subtitle={activePreset.selectedMaterials.pendant} color="#7D9B6A" />
            </div>
          </div>

          <div className="xl:col-span-1 space-y-5">
            {selectedComp ? (
              <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
                <div
                  className="p-4 border-b border-paper-200 flex items-center justify-between"
                  style={{ background: `linear-gradient(135deg, ${selectedComp.color}12, transparent)` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md"
                      style={{ background: `${selectedComp.color}15`, color: selectedComp.color }}
                    >
                      {selectedComp.icon}
                    </div>
                    <div>
                      <h3 className="font-serif-sc font-bold text-ink-800 text-lg">{selectedComp.name}</h3>
                      <p className="text-xs text-ink-400">部件详情</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedComponent(null)}
                    className="w-8 h-8 rounded-lg bg-paper-100 hover:bg-paper-200 flex items-center justify-center text-ink-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="border-b border-paper-200">
                  <div className="flex">
                    {([
                      { k: 'intro', icon: <BookOpen size={14} />, label: '概述' },
                      { k: 'craft', icon: <Hammer size={14} />, label: '工艺' },
                      { k: 'material', icon: <Layers size={14} />, label: '材料' },
                      { k: 'culture', icon: <Lightbulb size={14} />, label: '文化' },
                    ] as const).map(tab => (
                      <button
                        key={tab.k}
                        onClick={() => setActiveTab(tab.k)}
                        className={`flex-1 px-2 py-3 text-xs font-medium flex flex-col items-center gap-1 transition-colors border-b-2 ${
                          activeTab === tab.k
                            ? 'border-vermilion-500 text-vermilion-600 bg-vermilion-50/50'
                            : 'border-transparent text-ink-500 hover:text-ink-700 hover:bg-paper-50'
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5 max-h-[480px] overflow-y-auto">
                  {activeTab === 'intro' && (
                    <div className="space-y-4">
                      <Section icon={<Info size={14} />} title="部件说明" color={selectedComp.color}>
                        <p className="text-sm text-ink-600 leading-relaxed">{selectedComp.description}</p>
                      </Section>
                      <Section icon={<History size={14} />} title="历史沿革" color="#C9A959">
                        <p className="text-sm text-ink-600 leading-relaxed">{selectedComp.history}</p>
                      </Section>
                    </div>
                  )}

                  {activeTab === 'craft' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-ink-700">
                          <Clock size={14} className="text-gold-500" />
                          <span>工艺流程 · {selectedComp.craftSteps.length}步</span>
                        </div>
                      </div>
                      <div className="relative pl-4 border-l-2 border-paper-200 space-y-4">
                        {selectedComp.craftSteps.map(step => (
                          <div key={step.step} className="relative">
                            <div
                              className="absolute -left-[25px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
                              style={{ background: selectedComp.color }}
                            >
                              {step.step}
                            </div>
                            <div className="bg-paper-50 rounded-xl p-3 border border-paper-100">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="font-serif-sc font-bold text-sm text-ink-800">{step.title}</span>
                                <ChevronRight size={12} className="text-ink-300" />
                              </div>
                              <p className="text-xs text-ink-500 leading-relaxed">{step.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'material' && (
                    <div className="space-y-3">
                      {selectedComp.materials.map(mat => (
                        <div
                          key={mat.name}
                          className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                            activePreset.selectedMaterials[selectedComp.id] === mat.name
                              ? 'border-vermilion-300 bg-vermilion-50/60'
                              : 'border-paper-100 bg-paper-50/60 hover:border-paper-200'
                          }`}
                          onClick={() => {
                            setActivePreset(prev => ({
                              ...prev,
                              selectedMaterials: {
                                ...prev.selectedMaterials,
                                [selectedComp.id]: mat.name,
                              },
                            }));
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-serif-sc font-bold text-ink-800 text-sm">{mat.name}</span>
                            {activePreset.selectedMaterials[selectedComp.id] === mat.name && (
                              <span className="text-xs text-vermilion-600 font-medium">已选用</span>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            <MiniStat label="耐久" value={mat.durability} color="text-vermilion-600" />
                            <MiniStat label="美观" value={mat.aesthetics} color="text-gold-600" />
                            <MiniStat label="成本" value={mat.cost} color="text-bamboo-600" />
                          </div>
                          <p className="text-xs text-ink-500 leading-relaxed">{mat.desc}</p>
                        </div>
                      ))}
                      <p className="text-xs text-ink-400 text-center mt-2">点击材料卡片可更换并观察属性变化</p>
                    </div>
                  )}

                  {activeTab === 'culture' && (
                    <div className="space-y-3">
                      {selectedComp.cultureNotes.map((note, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-gradient-to-br from-paper-50 to-white border border-paper-100 relative overflow-hidden"
                        >
                          <div
                            className="absolute top-0 right-0 w-12 h-12 rounded-full opacity-10 -mr-4 -mt-4"
                            style={{ background: selectedComp.color }}
                          />
                          <div className="flex items-start gap-2 relative">
                            <span
                              className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                              style={{ background: selectedComp.color }}
                            >
                              {i + 1}
                            </span>
                            <p className="text-sm text-ink-600 leading-relaxed">{note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-elegant p-6">
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-paper-100 flex items-center justify-center mx-auto mb-4">
                    <Info size={28} className="text-paper-400" />
                  </div>
                  <h3 className="font-serif-sc font-bold text-ink-700 mb-2">选择扇部件</h3>
                  <p className="text-sm text-ink-400 leading-relaxed">
                    点击左侧扇子可视化中的<br />任意部件，探索其工艺与文化
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FanVisual({
  preset,
  selectedComponent,
  onSelect,
  getOffset,
  explodeProgress,
}: {
  preset: FanStructure;
  selectedComponent: FanComponentType | null;
  onSelect: (id: FanComponentType | null) => void;
  getOffset: (id: FanComponentType) => { x: number; y: number };
  explodeProgress: number;
}) {
  const ribsOffset = preset.components.includes('ribs') ? getOffset('ribs') : { x: 0, y: 0 };
  const pivotOffset = preset.components.includes('pivot') ? getOffset('pivot') : { x: 0, y: 0 };
  const surfaceOffset = preset.components.includes('surface') ? getOffset('surface') : { x: 0, y: 0 };
  const pendantOffset = preset.components.includes('pendant') ? getOffset('pendant') : { x: 0, y: 0 };
  const handleOffset = preset.components.includes('handle') ? getOffset('handle') : { x: 0, y: 0 };

  const ribCount = preset.fanType === 'folding' ? 18 : preset.fanType === 'round' ? 8 : 10;
  const fanRadius = 170;
  const openAngle = preset.fanType === 'folding' ? 110 : preset.fanType === 'round' ? 360 : 90;
  const startRad = ((-90 - openAngle / 2) * Math.PI) / 180;
  const endRad = ((-90 + openAngle / 2) * Math.PI) / 180;

  const isSelected = (id: FanComponentType) => selectedComponent === id;
  const isDimmed = (id: FanComponentType) =>
    selectedComponent !== null && !isSelected(id) && preset.components.includes(id);

  const handleClick = (e: React.MouseEvent, id: FanComponentType) => {
    e.stopPropagation();
    onSelect(isSelected(id) ? null : id);
  };

  return (
    <g style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
      {/* 扇面 Surface */}
      {preset.components.includes('surface') && (
        <g
          transform={`translate(${surfaceOffset.x}, ${surfaceOffset.y})`}
          style={{
            cursor: 'pointer',
            opacity: isDimmed('surface') ? 0.25 : 1,
            transition: 'opacity 0.3s',
          }}
          onClick={e => handleClick(e, 'surface')}
        >
          {isSelected('surface') && (
            <path
              d={buildSurfacePath(startRad, endRad, fanRadius + 8)}
              fill="none"
              stroke="#C8102E"
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.6"
              className="animate-pulse"
            />
          )}
          {preset.fanType === 'round' ? (
            <>
              <circle cx="0" cy="-70" r="120" fill="url(#surface-grad)" />
              <circle cx="0" cy="-70" r="120" fill="url(#surface-pattern)" />
              <circle
                cx="0"
                cy="-70"
                r="120"
                fill="none"
                stroke="rgba(200,16,46,0.35)"
                strokeWidth="2.5"
                filter={isSelected('surface') ? 'url(#glow-filter)' : undefined}
              />
              <circle cx="0" cy="-70" r="90" fill="none" stroke="rgba(200,16,46,0.1)" strokeWidth="1" />
              <circle cx="0" cy="-70" r="60" fill="none" stroke="rgba(201,169,89,0.12)" strokeWidth="0.8" />
              <g opacity="0.18">
                {Array.from({ length: 16 }).map((_, i) => {
                  const a = (Math.PI * 2 * i) / 16;
                  return (
                    <line
                      key={i}
                      x1={Math.cos(a) * 30}
                      y1={-70 + Math.sin(a) * 30}
                      x2={Math.cos(a) * 115}
                      y2={-70 + Math.sin(a) * 115}
                      stroke="#C8102E"
                      strokeWidth="0.5"
                    />
                  );
                })}
              </g>
            </>
          ) : preset.fanType === 'feather' ? (
            <>
              <ellipse
                cx="0"
                cy="-85"
                rx="75"
                ry="135"
                fill="url(#surface-grad)"
                filter={isSelected('surface') ? 'url(#glow-filter)' : undefined}
              />
              <ellipse cx="0" cy="-85" rx="73" ry="133" fill="none" stroke="rgba(125,155,106,0.35)" strokeWidth="2" />
              {Array.from({ length: 14 }).map((_, i) => {
                const t = i / 13;
                const angle = -0.45 + t * 0.9;
                const len = 105 + 18 * Math.sin(t * Math.PI);
                const endX = Math.sin(angle) * len * 0.7;
                const endY = -85 - Math.cos(angle) * len;
                return (
                  <path
                    key={i}
                    d={`M 0 0 Q ${endX * 0.3} ${endY * 0.4} ${endX} ${endY}`}
                    stroke="rgba(125,155,106,0.22)"
                    strokeWidth="1.2"
                    fill="none"
                  />
                );
              })}
            </>
          ) : (
            <>
              <path
                d={buildSurfacePath(startRad, endRad, fanRadius)}
                fill="url(#surface-grad)"
                filter={isSelected('surface') ? 'url(#glow-filter)' : undefined}
              />
              <path d={buildSurfacePath(startRad, endRad, fanRadius)} fill="url(#surface-pattern)" />
              <path
                d={buildSurfacePath(startRad, endRad, fanRadius)}
                fill="none"
                stroke="rgba(200,16,46,0.3)"
                strokeWidth="2"
              />
              <path
                d={buildSurfacePath(startRad, endRad, fanRadius * 0.65)}
                fill="none"
                stroke="rgba(201,169,89,0.1)"
                strokeWidth="1"
              />
            </>
          )}
        </g>
      )}

      {/* 扇骨 Ribs */}
      {preset.components.includes('ribs') && (
        <g
          transform={`translate(${ribsOffset.x}, ${ribsOffset.y})`}
          style={{
            cursor: 'pointer',
            opacity: isDimmed('ribs') ? 0.25 : 1,
            transition: 'opacity 0.3s',
          }}
          onClick={e => handleClick(e, 'ribs')}
        >
          {isSelected('ribs') && (
            <path
              d={buildSurfacePath(startRad, endRad, fanRadius + 12)}
              fill="rgba(156, 118, 61, 0.08)"
              stroke="#9c763d"
              strokeWidth="2"
              strokeDasharray="6 4"
              className="animate-pulse"
            />
          )}
          {Array.from({ length: ribCount + 1 }).map((_, i) => {
            const t = i / ribCount;
            const angle = startRad + (endRad - startRad) * t;
            const isEdge = i === 0 || i === ribCount;
            const isMain = i % 3 === 0;
            const len = preset.fanType === 'round' ? 110 : preset.fanType === 'feather' ? 115 : fanRadius;
            const thickness = isEdge ? 5 : isMain ? 2.2 : 1.1;
            const startY = preset.fanType === 'round' ? -70 : 0;
            const endX = Math.cos(angle) * len + (preset.fanType === 'round' ? 0 : 0);
            const endY = (preset.fanType === 'round' ? -70 : 0) + Math.sin(angle) * len;
            return (
              <line
                key={i}
                x1={0}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="url(#ribs-grad)"
                strokeWidth={thickness}
                strokeLinecap="round"
                filter={isSelected('ribs') && isEdge ? 'url(#glow-filter)' : undefined}
              />
            );
          })}
          {preset.fanType === 'folding' &&
            [0, ribCount].map(i => {
              const t = i / ribCount;
              const angle = startRad + (endRad - startRad) * t;
              const endX = Math.cos(angle) * fanRadius;
              const endY = Math.sin(angle) * fanRadius;
              return (
                <path
                  key={`cover-${i}`}
                  d={`M ${0 - Math.cos(angle) * 3 - Math.sin(angle) * 2.5} ${0 - Math.sin(angle) * 3 + Math.cos(angle) * 2.5}
                      L ${endX - Math.sin(angle) * 3.5} ${endY + Math.cos(angle) * 3.5}
                      L ${endX + Math.sin(angle) * 3.5} ${endY - Math.cos(angle) * 3.5}
                      L ${0 + Math.cos(angle) * 3 - Math.sin(angle) * 2.5} ${0 + Math.sin(angle) * 3 + Math.cos(angle) * 2.5} Z`}
                  fill="url(#ribs-grad)"
                  opacity="0.85"
                />
              );
            })}
        </g>
      )}

      {/* 扇柄 Handle */}
      {preset.components.includes('handle') && (
        <g
          transform={`translate(${handleOffset.x}, ${handleOffset.y})`}
          style={{
            cursor: 'pointer',
            opacity: isDimmed('handle') ? 0.25 : 1,
            transition: 'opacity 0.3s',
          }}
          onClick={e => handleClick(e, 'handle')}
        >
          {isSelected('handle') && (
            <rect
              x="-11"
              y={preset.fanType === 'round' ? -10 : -5}
              width="22"
              height={preset.fanType === 'round' ? 180 : 100}
              rx="11"
              fill="rgba(107,91,66,0.08)"
              stroke="#6b5b42"
              strokeWidth="2"
              strokeDasharray="6 4"
              className="animate-pulse"
            />
          )}
          {preset.fanType === 'round' ? (
            <>
              <rect x="-6" y="-10" width="12" height="170" rx="6" fill="url(#handle-grad)" filter={isSelected('handle') ? 'url(#glow-filter)' : undefined} />
              <rect x="-5" y="-9" width="10" height="168" rx="5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
              <circle cx="0" cy="158" r="9" fill="#543f28" stroke="rgba(200,16,46,0.4)" strokeWidth="1.5" />
              <circle cx="0" cy="158" r="4" fill="rgba(200,16,46,0.3)" />
              {Array.from({ length: 6 }).map((_, i) => (
                <circle
                  key={i}
                  cx="0"
                  cy={10 + i * 25}
                  r="1.5"
                  fill="rgba(200,16,46,0.35)"
                />
              ))}
            </>
          ) : (
            <>
              <rect x="-5" y="-5" width="10" height="90" rx="5" fill="url(#handle-grad)" filter={isSelected('handle') ? 'url(#glow-filter)' : undefined} />
              <rect x="-4" y="-4" width="8" height="88" rx="4" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
              <ellipse cx="0" cy="82" rx="8" ry="5" fill="#543f28" />
            </>
          )}
        </g>
      )}

      {/* 扇钉 Pivot */}
      {preset.components.includes('pivot') && (
        <g
          transform={`translate(${pivotOffset.x}, ${pivotOffset.y})`}
          style={{
            cursor: 'pointer',
            opacity: isDimmed('pivot') ? 0.25 : 1,
            transition: 'opacity 0.3s',
          }}
          onClick={e => handleClick(e, 'pivot')}
        >
          {isSelected('pivot') && (
            <>
              <circle cx="0" cy="0" r="20" fill="rgba(201,169,89,0.1)" />
              <circle cx="0" cy="0" r="20" fill="none" stroke="#C9A959" strokeWidth="2" strokeDasharray="4 3" className="animate-pulse" />
            </>
          )}
          <circle cx="0" cy="0" r="11" fill="#6b5b42" opacity="0.25" />
          <circle cx="0" cy="0" r="9" fill="#b8924a" filter={isSelected('pivot') ? 'url(#glow-filter)' : undefined} />
          <circle cx="0" cy="0" r="7" fill="#C9A959" />
          <circle cx="0" cy="0" r="5" fill="#d4bd82" />
          <circle cx="-1.5" cy="-1.5" r="1.8" fill="rgba(255,255,255,0.45)" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (Math.PI * 2 * i) / 8;
            return (
              <circle
                key={i}
                cx={Math.cos(a) * 6.5}
                cy={Math.sin(a) * 6.5}
                r="0.6"
                fill="rgba(200,16,46,0.5)"
              />
            );
          })}
        </g>
      )}

      {/* 坠饰 Pendant */}
      {preset.components.includes('pendant') && (
        <g
          transform={`translate(${pendantOffset.x}, ${pendantOffset.y})`}
          style={{
            cursor: 'pointer',
            opacity: isDimmed('pendant') ? 0.25 : 1,
            transition: 'opacity 0.3s',
          }}
          onClick={e => handleClick(e, 'pendant')}
        >
          {isSelected('pendant') && (
            <g>
              <rect x="-22" y="30" width="44" height="110" rx="10" fill="rgba(125,155,106,0.08)" />
              <rect x="-22" y="30" width="44" height="110" rx="10" fill="none" stroke="#7D9B6A" strokeWidth="2" strokeDasharray="6 4" className="animate-pulse" />
            </g>
          )}
          <line x1="0" y1={preset.fanType === 'round' ? 165 : 85} x2="0" y2="95" stroke="rgba(200,16,46,0.55)" strokeWidth="1.2" strokeDasharray="2 1" />
          <g transform="translate(0, 100)">
            <path
              d="M -6 -15 L 0 -20 L 6 -15 L 8 -5 L 4 0 L -4 0 L -8 -5 Z"
              fill="#C8102E"
              opacity="0.75"
            />
            <path
              d="M -6 -15 L 0 -20 L 6 -15 L 8 -5 L 4 0 L -4 0 L -8 -5 Z"
              fill="none"
              stroke="rgba(200,16,46,0.4)"
              strokeWidth="0.8"
            />
          </g>
          <g transform="translate(0, 118)" filter={isSelected('pendant') ? 'url(#glow-filter)' : undefined}>
            <circle cx="0" cy="5" r="14" fill="#7D9B6A" opacity="0.25" />
            <circle cx="0" cy="5" r="11" fill="#8aa675" />
            <circle cx="0" cy="5" r="9" fill="#a3c090" />
            <path d="M -5 2 Q 0 -3 5 2 Q 0 9 -5 2 Z" fill="rgba(255,255,255,0.3)" />
            <circle cx="-3" cy="2" r="1.5" fill="rgba(255,255,255,0.5)" />
            <path
              d="M -2 5 Q 0 9 2 5"
              stroke="rgba(93,122,78,0.5)"
              strokeWidth="0.8"
              fill="none"
            />
          </g>
          <g transform="translate(0, 138)" opacity="0.75">
            <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(200,16,46,0.6)" strokeWidth="1" />
            {[-5, -2, 1, 4].map((x, i) => (
              <path
                key={i}
                d={`M ${x * 0.8} 10 Q ${x} 18 ${x * 1.2} 26`}
                stroke={i % 2 === 0 ? '#C8102E' : '#C9A959'}
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.65"
              />
            ))}
          </g>
        </g>
      )}

      {/* 连接线（爆炸视图时显示） */}
      {explodeProgress > 0.1 && (
        <g opacity={explodeProgress * 0.4}>
          {preset.components.map(c => {
            const offset = getOffset(c);
            if (Math.abs(offset.x) < 5 && Math.abs(offset.y) < 5) return null;
            return (
              <line
                key={`line-${c}`}
                x1="0"
                y1="0"
                x2={offset.x * explodeProgress}
                y2={offset.y * explodeProgress}
                stroke={FAN_COMPONENTS[c].color}
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}
        </g>
      )}
    </g>
  );
}

function buildSurfacePath(startRad: number, endRad: number, r: number): string {
  const sx = Math.cos(startRad) * r;
  const sy = Math.sin(startRad) * r;
  const ex = Math.cos(endRad) * r;
  const ey = Math.sin(endRad) * r;
  const largeArc = endRad - startRad > Math.PI ? 1 : 0;
  return `M 0 0 L ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey} Z`;
}

function StatBar({
  icon,
  label,
  value,
  color,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'vermilion' | 'gold' | 'bamboo';
  hint: string;
}) {
  const bgMap = {
    vermilion: 'from-vermilion-400 to-vermilion-500',
    gold: 'from-gold-400 to-gold-500',
    bamboo: 'from-bamboo-400 to-bamboo-500',
  };
  const textMap = {
    vermilion: 'text-vermilion-600',
    gold: 'text-gold-600',
    bamboo: 'text-bamboo-600',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={textMap[color]}>{icon}</span>
          <span className="text-sm font-medium text-ink-700">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-lg font-bold ${textMap[color]}`}>{value}</span>
          <span className="text-xs text-ink-300">/100</span>
        </div>
      </div>
      <div className="h-2.5 bg-paper-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${bgMap[color]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-xs text-ink-400">{hint}</span>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-paper-100 bg-gradient-to-br from-paper-50/60 to-white overflow-hidden">
      <div
        className="px-3 py-2 flex items-center gap-2"
        style={{ background: `linear-gradient(90deg, ${color}10, transparent)` }}
      >
        <span style={{ color }}>{icon}</span>
        <span className="font-serif-sc font-bold text-sm text-ink-700">{title}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-base font-bold ${color}`}>{value}</div>
      <div className="text-[10px] text-ink-400">{label}</div>
    </div>
  );
}

function MiniInfoCard({ icon, title, subtitle, color }: { icon: string; title: string; subtitle: string; color: string }) {
  return (
    <div
      className="rounded-xl p-3 border border-paper-100 bg-gradient-to-br from-white to-paper-50 hover:shadow-md transition-shadow cursor-pointer"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="font-serif-sc font-bold text-sm text-ink-700">{title}</span>
      </div>
      <div className="text-xs text-ink-400 truncate" style={{ color }}>{subtitle}</div>
    </div>
  );
}
