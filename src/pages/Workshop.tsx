import { useState } from 'react';
import { useWorkshopStore } from '@/store/useWorkshopStore';
import { APPRENTICE_LEVELS } from '@/types/fan';
import type { FanMaterial, CraftTechnique, CraftedFan, CraftStep } from '@/types/fan';
import {
  Coins,
  Star,
  Hammer,
  Sparkles,
  ChevronRight,
  X,
  Check,
  Lock,
  TrendingUp,
  Package,
  Scroll,
  Paintbrush,
  Wrench,
  Gem,
  RefreshCw,
  Zap,
  Award,
  Crown,
  Medal,
  Trash2,
} from 'lucide-react';

const CRAFT_STEPS: { key: CraftStep; name: string; icon: React.ReactNode }[] = [
  { key: 'frame_carving', name: '扇骨雕刻', icon: <Scroll size={18} /> },
  { key: 'surface_painting', name: '扇面绘制', icon: <Paintbrush size={18} /> },
  { key: 'assembly', name: '装订工艺', icon: <Wrench size={18} /> },
  { key: 'decoration', name: '装饰坠饰', icon: <Gem size={18} /> },
  { key: 'polishing', name: '打磨抛光', icon: <Sparkles size={18} /> },
];

const QUALITY_INFO: Record<string, { label: string; color: string; bgColor: string }> = {
  basic: { label: '普通', color: 'text-ink-500', bgColor: 'bg-ink-100' },
  fine: { label: '精良', color: 'text-bamboo-600', bgColor: 'bg-bamboo-100' },
  exquisite: { label: '珍品', color: 'text-gold-600', bgColor: 'bg-gold-100' },
  masterpiece: { label: '传世', color: 'text-vermilion-600', bgColor: 'bg-vermilion-100' },
};

export default function Workshop() {
  const {
    coins,
    level,
    experience,
    craftedFans,
    selectedFrame,
    selectedSurface,
    selectedTechniques,
    isCrafting,
    craftProgress,
    showResult,
    lastCraftedFan,
    frameMaterials,
    surfaceMaterials,
    selectFrame,
    selectSurface,
    selectTechnique,
    clearTechnique,
    getTotalCost,
    getEstimatedScore,
    canCraft,
    startCrafting,
    setShowResult,
    sellFan,
    getLevelProgress,
    addCoins,
  } = useWorkshopStore();

  const [activeTab, setActiveTab] = useState<'craft' | 'collection'>('craft');
  const levelInfo = APPRENTICE_LEVELS[level];
  const totalCost = getTotalCost();
  const estimatedScore = getEstimatedScore();
  const canCraftNow = canCraft();

  const handleStartCraft = async () => {
    await startCrafting();
  };

  const getTechniqueForStep = (step: CraftStep) => {
    return selectedTechniques[step] || null;
  };

  return (
    <div className="min-h-screen bg-paper-50 pt-20 md:pt-24 pb-12">
      <div className="container mx-auto px-6">
        <WorkshopHeader
          coins={coins}
          level={level}
          levelInfo={levelInfo}
          experience={experience}
          levelProgress={getLevelProgress()}
          onAddCoins={() => addCoins(50)}
        />

        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('craft')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-serif-sc text-sm transition-all ${
              activeTab === 'craft'
                ? 'bg-vermilion-500 text-white shadow-md'
                : 'bg-white text-ink-600 border border-paper-200 hover:border-vermilion-300'
            }`}
          >
            <Hammer size={16} />
            制作扇子
          </button>
          <button
            onClick={() => setActiveTab('collection')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-serif-sc text-sm transition-all ${
              activeTab === 'collection'
                ? 'bg-vermilion-500 text-white shadow-md'
                : 'bg-white text-ink-600 border border-paper-200 hover:border-vermilion-300'
            }`}
          >
            <Package size={16} />
            我的收藏
            {craftedFans.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'collection' ? 'bg-white/20' : 'bg-vermilion-100 text-vermilion-600'
              }`}>
                {craftedFans.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'craft' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <MaterialSection
                title="选择扇骨"
                materials={frameMaterials}
                selected={selectedFrame}
                onSelect={selectFrame}
                currentLevel={level}
              />

              <MaterialSection
                title="选择扇面"
                materials={surfaceMaterials}
                selected={selectedSurface}
                onSelect={selectSurface}
                currentLevel={level}
              />

              <div className="bg-white rounded-2xl shadow-elegant p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif-sc text-lg font-bold text-ink-800">工艺步骤</h3>
                    <p className="text-sm text-ink-400">选择每一步的工艺，影响最终品质</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {CRAFT_STEPS.map((step, index) => (
                    <CraftStepCard
                      key={step.key}
                      step={step}
                      index={index}
                      selectedTechnique={getTechniqueForStep(step.key)}
                      techniques={useWorkshopStore.getState().getTechniquesByStep(step.key)}
                      onSelect={(tech) => selectTechnique(tech)}
                      onClear={() => clearTechnique(step.key)}
                      currentLevel={level}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <CraftSummary
                  selectedFrame={selectedFrame}
                  selectedSurface={selectedSurface}
                  selectedTechniques={Object.values(selectedTechniques)}
                  totalCost={totalCost}
                  estimatedScore={estimatedScore}
                  canCraft={canCraftNow}
                  isCrafting={isCrafting}
                  craftProgress={craftProgress}
                  onStartCraft={handleStartCraft}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'collection' && (
          <CollectionSection fans={craftedFans} onSell={sellFan} />
        )}
      </div>

      {showResult && lastCraftedFan && (
        <CraftResultModal
          fan={lastCraftedFan}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  );
}

function WorkshopHeader({
  coins,
  level,
  levelInfo,
  experience,
  levelProgress,
  onAddCoins,
}: {
  coins: number;
  level: string;
  levelInfo: { name: string; expRequired: number; icon: string };
  experience: number;
  levelProgress: number;
  onAddCoins: () => void;
}) {
  return (
    <div className="bg-gradient-to-r from-vermilion-500 to-gold-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-3 mb-2">
            <span className="w-px h-4 bg-white/40" />
            <span className="text-white/80 font-serif-sc text-sm tracking-widest">扇子工坊</span>
            <span className="w-px h-4 bg-white/40" />
          </div>
          <h1 className="font-serif-sc text-3xl md:text-4xl font-bold mb-2">匠心独运</h1>
          <p className="text-white/70 text-sm">
            从学徒到宗师，亲手打造属于你的传世宝扇
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onAddCoins}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
          >
            <Zap size={18} className="text-gold-300" />
            <span className="text-sm">领取银两</span>
          </button>

          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[180px]">
            <div className="flex items-center gap-2 mb-2">
              <Coins size={18} className="text-gold-300" />
              <span className="font-serif-sc font-bold text-lg">{coins}</span>
              <span className="text-white/70 text-sm">银两</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{levelInfo.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">{levelInfo.name}</span>
                  <span className="text-white/70">Lv.{['apprentice', 'craftsman', 'master', 'grandmaster'].indexOf(level) + 1}</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-300 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-white/60 mt-1.5">经验: {experience}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MaterialSection({
  title,
  materials,
  selected,
  onSelect,
  currentLevel,
}: {
  title: string;
  materials: FanMaterial[];
  selected: FanMaterial | null;
  onSelect: (material: FanMaterial) => void;
  currentLevel: string;
}) {
  const levelOrder = ['apprentice', 'craftsman', 'master', 'grandmaster'];
  const currentLevelIndex = levelOrder.indexOf(currentLevel);

  return (
    <div className="bg-white rounded-2xl shadow-elegant p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-bamboo-100 text-bamboo-600 flex items-center justify-center">
          <Scroll size={20} />
        </div>
        <div>
          <h3 className="font-serif-sc text-lg font-bold text-ink-800">{title}</h3>
          <p className="text-sm text-ink-400">不同材质影响成本和品质</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {materials.map((material) => {
          const isSelected = selected?.id === material.id;
          const isLocked = material.quality > 60 && currentLevelIndex < 1;

          return (
            <button
              key={material.id}
              onClick={() => !isLocked && onSelect(material)}
              disabled={isLocked}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-vermilion-500 bg-vermilion-50 shadow-md'
                  : isLocked
                  ? 'border-paper-200 bg-paper-50 opacity-60 cursor-not-allowed'
                  : 'border-paper-200 hover:border-vermilion-300 hover:bg-paper-50'
              }`}
            >
              {isLocked && (
                <div className="absolute top-2 right-2">
                  <Lock size={14} className="text-ink-400" />
                </div>
              )}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-vermilion-500 rounded-full flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
              <div className="text-3xl mb-2">{material.icon}</div>
              <h4 className="font-serif-sc font-bold text-ink-800 text-sm mb-1">
                {material.name}
              </h4>
              <div className="flex items-center gap-1 text-xs text-gold-600 mb-1">
                <Coins size={12} />
                <span>{material.cost}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={10} className="text-gold-400" />
                <div className="flex-1 h-1 bg-paper-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-400 rounded-full"
                    style={{ width: `${material.quality}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CraftStepCard({
  step,
  index,
  selectedTechnique,
  techniques,
  onSelect,
  onClear,
  currentLevel,
}: {
  step: { key: CraftStep; name: string; icon: React.ReactNode };
  index: number;
  selectedTechnique: CraftTechnique | null;
  techniques: CraftTechnique[];
  onSelect: (technique: CraftTechnique) => void;
  onClear: () => void;
  currentLevel: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const levelOrder = ['apprentice', 'craftsman', 'master', 'grandmaster'];
  const currentLevelIndex = levelOrder.indexOf(currentLevel);

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${
      selectedTechnique ? 'border-gold-300 bg-gold-50/50' : 'border-paper-200'
    }`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-3 hover:bg-paper-50 transition-colors"
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          selectedTechnique ? 'bg-gold-500 text-white' : 'bg-paper-100 text-ink-500'
        }`}>
          {step.icon}
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="font-serif-sc font-medium text-ink-800">
              {index + 1}. {step.name}
            </span>
            {selectedTechnique && (
              <span className="px-2 py-0.5 bg-gold-100 text-gold-600 text-xs rounded-full">
                {selectedTechnique.name}
              </span>
            )}
          </div>
          {selectedTechnique && (
            <p className="text-xs text-ink-400 mt-0.5">{selectedTechnique.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedTechnique && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="p-1.5 text-ink-400 hover:text-vermilion-500 hover:bg-vermilion-50 rounded-lg transition-colors"
            >
              <X size={14} />
            </button>
          )}
          <ChevronRight
            size={18}
            className={`text-ink-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
          />
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-paper-100 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {techniques.map((tech) => {
              const isSelected = selectedTechnique?.id === tech.id;
              const requiredLevelIndex = levelOrder.indexOf(tech.requiredLevel);
              const isLocked = requiredLevelIndex > currentLevelIndex;

              return (
                <button
                  key={tech.id}
                  onClick={() => !isLocked && onSelect(tech)}
                  disabled={isLocked}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-vermilion-400 bg-vermilion-50'
                      : isLocked
                      ? 'border-paper-200 bg-paper-50 opacity-50 cursor-not-allowed'
                      : 'border-paper-200 hover:border-vermilion-300 hover:bg-paper-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-ink-800">{tech.name}</span>
                    {isLocked && <Lock size={12} className="text-ink-400" />}
                    {isSelected && (
                      <div className="w-4 h-4 bg-vermilion-500 rounded-full flex items-center justify-center">
                        <Check size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-ink-400 mb-2 line-clamp-1">{tech.description}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gold-600 flex items-center gap-1">
                      <TrendingUp size={12} />
                      +{tech.qualityBonus}
                    </span>
                    <span className="text-ink-400">
                      费用 x{tech.costMultiplier}
                    </span>
                  </div>
                  {isLocked && (
                    <p className="text-xs text-vermilion-500 mt-1">
                      需要 {APPRENTICE_LEVELS[tech.requiredLevel].name} 等级
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function CraftSummary({
  selectedFrame,
  selectedSurface,
  selectedTechniques,
  totalCost,
  estimatedScore,
  canCraft,
  isCrafting,
  craftProgress,
  onStartCraft,
}: {
  selectedFrame: FanMaterial | null;
  selectedSurface: FanMaterial | null;
  selectedTechniques: CraftTechnique[];
  totalCost: number;
  estimatedScore: number;
  canCraft: boolean;
  isCrafting: boolean;
  craftProgress: number;
  onStartCraft: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
      <div className="bg-gradient-to-r from-vermilion-500 to-gold-500 p-5 text-white">
        <h3 className="font-serif-sc text-xl font-bold mb-1">制作预览</h3>
        <p className="text-white/70 text-sm">确认材料与工艺后开始制作</p>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between p-3 bg-paper-50 rounded-xl">
          <span className="text-ink-500 text-sm">扇骨材质</span>
          <span className="font-medium text-ink-800">
            {selectedFrame ? (
              <span className="flex items-center gap-1.5">
                <span>{selectedFrame.icon}</span>
                {selectedFrame.name}
              </span>
            ) : (
              <span className="text-ink-400">未选择</span>
            )}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-paper-50 rounded-xl">
          <span className="text-ink-500 text-sm">扇面材质</span>
          <span className="font-medium text-ink-800">
            {selectedSurface ? (
              <span className="flex items-center gap-1.5">
                <span>{selectedSurface.icon}</span>
                {selectedSurface.name}
              </span>
            ) : (
              <span className="text-ink-400">未选择</span>
            )}
          </span>
        </div>

        <div className="p-3 bg-paper-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-ink-500 text-sm">工艺步骤</span>
            <span className="text-sm text-ink-600">{selectedTechniques.length} 项</span>
          </div>
          {selectedTechniques.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {selectedTechniques.map((tech) => (
                <span
                  key={tech.id}
                  className="px-2 py-0.5 bg-white text-ink-600 text-xs rounded-md border border-paper-200"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-ink-400 text-sm">未选择工艺</p>
          )}
        </div>

        <div className="border-t border-paper-200 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-ink-500">预估品质</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-paper-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    estimatedScore >= 90
                      ? 'bg-vermilion-500'
                      : estimatedScore >= 70
                      ? 'bg-gold-500'
                      : estimatedScore >= 45
                      ? 'bg-bamboo-500'
                      : 'bg-ink-300'
                  }`}
                  style={{ width: `${estimatedScore}%` }}
                />
              </div>
              <span className={`font-bold ${
                estimatedScore >= 90
                  ? 'text-vermilion-600'
                  : estimatedScore >= 70
                  ? 'text-gold-600'
                  : estimatedScore >= 45
                  ? 'text-bamboo-600'
                  : 'text-ink-500'
              }`}>
                {estimatedScore}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-ink-500">制作费用</span>
            <span className="flex items-center gap-1 text-gold-600 font-bold text-lg">
              <Coins size={18} />
              {totalCost}
            </span>
          </div>
        </div>

        {isCrafting && (
          <div className="py-2">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-ink-500">制作中...</span>
              <span className="text-vermilion-600 font-medium">{craftProgress}%</span>
            </div>
            <div className="h-3 bg-paper-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-vermilion-500 to-gold-500 rounded-full transition-all duration-300"
                style={{ width: `${craftProgress}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={onStartCraft}
          disabled={!canCraft || isCrafting}
          className={`w-full py-3.5 rounded-xl font-serif-sc font-bold text-lg transition-all flex items-center justify-center gap-2 ${
            canCraft && !isCrafting
              ? 'bg-gradient-to-r from-vermilion-500 to-gold-500 text-white hover:shadow-lg hover:shadow-vermilion-500/30 active:scale-[0.98]'
              : 'bg-paper-200 text-ink-400 cursor-not-allowed'
          }`}
        >
          {isCrafting ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              精心制作中...
            </>
          ) : (
            <>
              <Hammer size={20} />
              开始制作
            </>
          )}
        </button>

        {!canCraft && !isCrafting && (
          <p className="text-center text-sm text-ink-400">
            {!selectedFrame || !selectedSurface
              ? '请选择扇骨和扇面材质'
              : selectedTechniques.length === 0
              ? '请选择至少一项工艺'
              : '银两不足'}
          </p>
        )}
      </div>
    </div>
  );
}

function CollectionSection({
  fans,
  onSell,
}: {
  fans: CraftedFan[];
  onSell: (fanId: string) => void;
}) {
  if (fans.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-elegant p-12 text-center">
        <div className="text-6xl mb-4">🎐</div>
        <h3 className="font-serif-sc text-xl font-bold text-ink-800 mb-2">暂无收藏</h3>
        <p className="text-ink-400 mb-6">快去制作你的第一把扇子吧！</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {fans.map((fan, index) => (
        <FanCollectionCard
          key={fan.id}
          fan={fan}
          index={index}
          onSell={onSell}
        />
      ))}
    </div>
  );
}

function FanCollectionCard({
  fan,
  index,
  onSell,
}: {
  fan: CraftedFan;
  index: number;
  onSell: (fanId: string) => void;
}) {
  const qualityInfo = QUALITY_INFO[fan.quality];
  const sellPrice = Math.round(fan.cost * (0.5 + fan.totalScore / 100));

  return (
    <div
      className="bg-white rounded-2xl shadow-elegant overflow-hidden transition-all duration-300 hover:shadow-elegant-hover hover:-translate-y-1 opacity-0 animate-fade-in-up"
      style={{
        animationDelay: `${index * 0.08}s`,
        animationFillMode: 'forwards',
      }}
    >
      <div className="relative h-40 bg-gradient-to-br from-paper-100 to-paper-200 flex items-center justify-center">
        <div className="text-6xl transform -rotate-12">🪭</div>
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${qualityInfo.bgColor} ${qualityInfo.color}`}>
          {qualityInfo.label}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full">
          <Star size={12} className="text-gold-500 fill-gold-500" />
          <span className="text-xs font-bold text-ink-700">{fan.totalScore}</span>
        </div>
      </div>

      <div className="p-4">
        <h4 className="font-serif-sc font-bold text-ink-800 mb-1">{fan.name}</h4>
        <p className="text-xs text-ink-400 mb-3">
          {fan.frameMaterial.name} + {fan.surfaceMaterial.name}
        </p>

        <div className="space-y-1.5 mb-4">
          <ScoreBar label="品质" value={fan.qualityScore} color="bg-gold-500" />
          <ScoreBar label="美观" value={fan.aestheticScore} color="bg-vermilion-500" />
          <ScoreBar label="工艺" value={fan.craftScore} color="bg-bamboo-500" />
          <ScoreBar label="创意" value={fan.creativityScore} color="text-ink-500" />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-paper-100">
          <div className="flex items-center gap-1 text-gold-600">
            <Coins size={14} />
            <span className="text-sm font-medium">售价 {sellPrice}</span>
          </div>
          <button
            onClick={() => onSell(fan.id)}
            className="flex items-center gap-1 px-3 py-1.5 bg-paper-100 text-ink-600 text-sm rounded-lg hover:bg-vermilion-100 hover:text-vermilion-600 transition-colors"
          >
            <Trash2 size={14} />
            出售
          </button>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-ink-400 w-8">{label}</span>
      <div className="flex-1 h-1.5 bg-paper-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-ink-500 w-6 text-right">{value}</span>
    </div>
  );
}

function CraftResultModal({ fan, onClose }: { fan: CraftedFan; onClose: () => void }) {
  const qualityInfo = QUALITY_INFO[fan.quality];

  const getQualityIcon = () => {
    switch (fan.quality) {
      case 'masterpiece':
        return <Crown size={32} className="text-gold-400" />;
      case 'exquisite':
        return <Award size={32} className="text-gold-500" />;
      case 'fine':
        return <Medal size={32} className="text-bamboo-500" />;
      default:
        return <Star size={32} className="text-ink-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-800/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-elegant-hover w-full max-w-md overflow-hidden opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
        <div className={`relative p-6 text-center ${
          fan.quality === 'masterpiece'
            ? 'bg-gradient-to-br from-gold-400 via-vermilion-500 to-gold-400'
            : fan.quality === 'exquisite'
            ? 'bg-gradient-to-br from-gold-400 to-gold-600'
            : fan.quality === 'fine'
            ? 'bg-gradient-to-br from-bamboo-400 to-bamboo-600'
            : 'bg-gradient-to-br from-ink-400 to-ink-600'
        } text-white`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>

          <div className="mb-4 flex justify-center">
            {getQualityIcon()}
          </div>

          <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-3">
            {qualityInfo.label}品质
          </div>

          <h3 className="font-serif-sc text-3xl font-bold mb-2">{fan.name}</h3>
          <p className="text-white/80 text-sm">制作完成！</p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-12 h-px bg-white/30" />
            <span className="text-5xl">🪭</span>
            <div className="w-12 h-px bg-white/30" />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="text-center p-3 bg-paper-50 rounded-xl">
              <p className="text-ink-400 text-xs mb-1">总分</p>
              <p className="text-2xl font-bold text-vermilion-600">{fan.totalScore}</p>
            </div>
            <div className="text-center p-3 bg-paper-50 rounded-xl">
              <p className="text-ink-400 text-xs mb-1">成本</p>
              <p className="text-2xl font-bold text-gold-600">{fan.cost}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <ScoreBar label="品质" value={fan.qualityScore} color="bg-gold-500" />
            <ScoreBar label="美观" value={fan.aestheticScore} color="bg-vermilion-500" />
            <ScoreBar label="工艺" value={fan.craftScore} color="bg-bamboo-500" />
            <ScoreBar label="创意" value={fan.creativityScore} color="text-ink-500" />
          </div>

          <div className="flex items-center justify-between p-3 bg-gold-50 rounded-xl mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gold-600">材料</p>
                <p className="text-sm font-medium text-ink-800">
                  {fan.frameMaterial.name} + {fan.surfaceMaterial.name}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-vermilion-500 to-gold-500 text-white font-serif-sc font-bold rounded-xl hover:shadow-lg hover:shadow-vermilion-500/30 transition-all"
          >
            太好了
          </button>
        </div>
      </div>
    </div>
  );
}
