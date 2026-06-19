import { useState } from 'react';
import { useRepairStore } from '@/store/useRepairStore';
import { useWorkshopStore } from '@/store/useWorkshopStore';
import { REPAIR_STEPS, APPRENTICE_LEVELS } from '@/types/fan';
import type { RepairCommission, RepairTechnique, RepairStep, DamageInfo } from '@/types/fan';
import {
  Wrench,
  Scroll,
  Archive,
  Coins,
  Star,
  Sparkles,
  ChevronRight,
  X,
  Check,
  Lock,
  TrendingUp,
  MapPin,
  Calendar,
  AlertTriangle,
  Play,
  RefreshCw,
  Trophy,
  Crown,
  Award,
  BookOpen,
  Gift,
  Clock,
} from 'lucide-react';

const STATUS_INFO: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: '待接受', color: 'text-ink-500', bgColor: 'bg-ink-100' },
  in_progress: { label: '修复中', color: 'text-gold-600', bgColor: 'bg-gold-100' },
  completed: { label: '已完成', color: 'text-bamboo-600', bgColor: 'bg-bamboo-100' },
  delivered: { label: '已交付', color: 'text-vermilion-600', bgColor: 'bg-vermilion-100' },
};

const QUALITY_INFO: Record<string, { label: string; color: string; bgColor: string }> = {
  '完美修复': { label: '完美修复', color: 'text-vermilion-600', bgColor: 'bg-vermilion-100' },
  '精良修复': { label: '精良修复', color: 'text-gold-600', bgColor: 'bg-gold-100' },
  '合格修复': { label: '合格修复', color: 'text-bamboo-600', bgColor: 'bg-bamboo-100' },
  '基础修复': { label: '基础修复', color: 'text-ink-500', bgColor: 'bg-ink-100' },
};

export default function Restoration() {
  const {
    commissions,
    restoredFans,
    activeCommission,
    isRepairing,
    repairProgress,
    showRepairResult,
    lastRepairedCommission,
    selectCommission,
    clearActiveCommission,
    selectTechnique,
    clearTechnique,
    getTotalRepairCost,
    getEstimatedQuality,
    canStartRepair,
    startRepair,
    deliverCommission,
    refreshCommissions,
    setShowRepairResult,
    getTechniquesByStep,
    getRequiredTechniques,
  } = useRepairStore();

  const { coins, level, experience, getLevelProgress } = useWorkshopStore();
  const [activeTab, setActiveTab] = useState<'commissions' | 'workshop' | 'archive'>('commissions');

  const pendingCommissions = commissions.filter(c => c.status === 'pending');
  const inProgressCommissions = commissions.filter(c => c.status === 'in_progress');
  const completedCommissions = commissions.filter(c => c.status === 'completed');

  const totalRepairCost = getTotalRepairCost();
  const estimatedQuality = getEstimatedQuality();
  const canRepair = canStartRepair();
  const levelInfo = APPRENTICE_LEVELS[level];

  const getTechniqueForStep = (step: RepairStep) => {
    return activeCommission?.selectedTechniques[step] || null;
  };

  const handleStartRepair = async () => {
    await startRepair();
  };

  return (
    <div className="min-h-screen bg-paper-50 pt-20 md:pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-vermilion-600 to-vermilion-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-3 mb-2">
                <span className="w-px h-4 bg-white/40" />
                <span className="text-white/80 font-serif-sc text-sm tracking-widest">古扇修复坊</span>
                <span className="w-px h-4 bg-white/40" />
              </div>
              <h1 className="font-serif-sc text-3xl md:text-4xl font-bold mb-2">妙手回春</h1>
              <p className="text-white/70 text-sm">
                修复残损古扇，传承千年技艺，解锁尘封历史
              </p>
            </div>

            <div className="flex items-center gap-4">
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
                        style={{ width: `${getLevelProgress()}%` }}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-white/60 mt-1.5">经验: {experience}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('commissions')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-serif-sc text-sm transition-all whitespace-nowrap ${
              activeTab === 'commissions'
                ? 'bg-vermilion-500 text-white shadow-md'
                : 'bg-white text-ink-600 border border-paper-200 hover:border-vermilion-300'
            }`}
          >
            <Scroll size={16} />
            修复委托
            {pendingCommissions.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'commissions' ? 'bg-white/20' : 'bg-vermilion-100 text-vermilion-600'
              }`}>
                {pendingCommissions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('workshop')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-serif-sc text-sm transition-all whitespace-nowrap ${
              activeTab === 'workshop'
                ? 'bg-vermilion-500 text-white shadow-md'
                : 'bg-white text-ink-600 border border-paper-200 hover:border-vermilion-300'
            }`}
          >
            <Wrench size={16} />
            修复工作台
            {inProgressCommissions.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'workshop' ? 'bg-white/20' : 'bg-gold-100 text-gold-600'
              }`}>
                {inProgressCommissions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-serif-sc text-sm transition-all whitespace-nowrap ${
              activeTab === 'archive'
                ? 'bg-vermilion-500 text-white shadow-md'
                : 'bg-white text-ink-600 border border-paper-200 hover:border-vermilion-300'
            }`}
          >
            <Archive size={16} />
            历史档案
            {restoredFans.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'archive' ? 'bg-white/20' : 'bg-bamboo-100 text-bamboo-600'
              }`}>
                {restoredFans.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'commissions' && (
          <CommissionsSection
            commissions={commissions}
            onSelectCommission={selectCommission}
            onRefresh={refreshCommissions}
            activeCommissionId={activeCommission?.id}
          />
        )}

        {activeTab === 'workshop' && (
          activeCommission ? (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <FanDamageCard commission={activeCommission} onClear={clearActiveCommission} />
                
                <div className="bg-white rounded-2xl shadow-elegant p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center">
                      <Wrench size={20} />
                    </div>
                    <div>
                      <h3 className="font-serif-sc text-lg font-bold text-ink-800">修复工序</h3>
                      <p className="text-sm text-ink-400">根据损坏情况选择合适的修复工艺</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {getRequiredTechniques().map((stepKey, index) => {
                      const stepInfo = REPAIR_STEPS.find(s => s.key === stepKey);
                      if (!stepInfo) return null;
                      
                      return (
                        <RepairStepCard
                          key={stepKey}
                          step={stepInfo}
                          index={index}
                          selectedTechnique={getTechniqueForStep(stepKey)}
                          techniques={getTechniquesByStep(stepKey)}
                          onSelect={(tech) => selectTechnique(tech)}
                          onClear={() => clearTechnique(stepKey)}
                          currentLevel={level}
                          isRepairing={isRepairing}
                          currentStep={activeCommission.currentStep}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <RepairSummary
                    commission={activeCommission}
                    totalCost={totalRepairCost}
                    estimatedQuality={estimatedQuality}
                    canRepair={canRepair}
                    isRepairing={isRepairing}
                    repairProgress={repairProgress}
                    onStartRepair={handleStartRepair}
                    coins={coins}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-elegant p-12 text-center">
              <div className="text-6xl mb-4">🔧</div>
              <h3 className="font-serif-sc text-xl font-bold text-ink-800 mb-2">暂无修复任务</h3>
              <p className="text-ink-400 mb-6">请先从修复委托列表中选择一项委托开始修复</p>
              <button
                onClick={() => setActiveTab('commissions')}
                className="px-6 py-2.5 bg-vermilion-500 text-white font-serif-sc rounded-xl hover:bg-vermilion-600 transition-colors"
              >
                查看委托
              </button>
            </div>
          )
        )}

        {activeTab === 'archive' && (
          <ArchiveSection
            restoredFans={restoredFans}
            onDeliver={deliverCommission}
            completedCommissions={completedCommissions}
          />
        )}
      </div>

      {showRepairResult && lastRepairedCommission && (
        <RepairResultModal
          commission={lastRepairedCommission}
          onClose={() => setShowRepairResult(false)}
        />
      )}
    </div>
  );
}

function CommissionsSection({
  commissions,
  onSelectCommission,
  onRefresh,
  activeCommissionId,
}: {
  commissions: RepairCommission[];
  onSelectCommission: (commission: RepairCommission) => void;
  onRefresh: () => void;
  activeCommissionId?: string;
}) {
  const pendingCommissions = commissions.filter(c => c.status === 'pending');
  const inProgressCommissions = commissions.filter(c => c.status === 'in_progress');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif-sc text-xl font-bold text-ink-800">待修复委托</h2>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-paper-200 rounded-xl text-ink-600 hover:border-vermilion-300 transition-colors"
        >
          <RefreshCw size={16} />
          <span className="text-sm">刷新委托</span>
        </button>
      </div>

      {inProgressCommissions.length > 0 && (
        <div>
          <h3 className="font-serif-sc text-base font-bold text-ink-700 mb-3 flex items-center gap-2">
            <Clock size={16} className="text-gold-500" />
            进行中
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {inProgressCommissions.map((commission, index) => (
              <CommissionCard
                key={commission.id}
                commission={commission}
                onSelect={onSelectCommission}
                isActive={activeCommissionId === commission.id}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {pendingCommissions.length > 0 ? (
        <div>
          <h3 className="font-serif-sc text-base font-bold text-ink-700 mb-3 flex items-center gap-2">
            <Scroll size={16} className="text-ink-500" />
            待接受
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pendingCommissions.map((commission, index) => (
              <CommissionCard
                key={commission.id}
                commission={commission}
                onSelect={onSelectCommission}
                isActive={activeCommissionId === commission.id}
                index={index}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-elegant p-12 text-center">
          <div className="text-6xl mb-4">📜</div>
          <h3 className="font-serif-sc text-xl font-bold text-ink-800 mb-2">暂无新委托</h3>
          <p className="text-ink-400 mb-6">目前没有需要修复的古扇委托</p>
          <button
            onClick={onRefresh}
            className="px-6 py-2.5 bg-vermilion-500 text-white font-serif-sc rounded-xl hover:bg-vermilion-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            刷新委托
          </button>
        </div>
      )}
    </div>
  );
}

function CommissionCard({
  commission,
  onSelect,
  isActive,
  index,
}: {
  commission: RepairCommission;
  onSelect: (commission: RepairCommission) => void;
  isActive: boolean;
  index: number;
}) {
  const statusInfo = STATUS_INFO[commission.status];
  const totalDamage = commission.damages.reduce((sum, d) => sum + d.severity, 0);
  const avgDamage = Math.round(totalDamage / commission.damages.length);

  return (
    <div
      className={`bg-white rounded-2xl shadow-elegant overflow-hidden transition-all duration-300 hover:shadow-elegant-hover hover:-translate-y-1 opacity-0 animate-fade-in-up ${
        isActive ? 'ring-2 ring-vermilion-500' : ''
      }`}
      style={{
        animationDelay: `${index * 0.08}s`,
        animationFillMode: 'forwards',
      }}
    >
      <div className="relative h-48 bg-gradient-to-br from-paper-100 to-paper-200">
        <img
          src={commission.fanImage}
          alt={commission.fanName}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
          {statusInfo.label}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full">
          <AlertTriangle size={12} className={avgDamage > 60 ? 'text-vermilion-500' : 'text-gold-500'} />
          <span className="text-xs font-bold text-ink-700">损坏 {avgDamage}%</span>
        </div>
        {commission.status === 'in_progress' && commission.repairProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-paper-200">
            <div
              className="h-full bg-gold-500 transition-all duration-500"
              style={{ width: `${commission.repairProgress}%` }}
            />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-serif-sc font-bold text-ink-800 text-lg">{commission.fanName}</h4>
          <span className="text-xs text-ink-400 bg-paper-100 px-2 py-0.5 rounded-full">
            {commission.dynasty}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-ink-500 mb-3">
          <MapPin size={12} />
          <span>{commission.origin}</span>
        </div>

        <p className="text-sm text-ink-600 mb-3 line-clamp-2">{commission.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {commission.damages.slice(0, 3).map((damage) => (
            <span
              key={damage.type}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-vermilion-50 text-vermilion-600 text-xs rounded-full"
            >
              <span>{damage.icon}</span>
              {damage.name}
            </span>
          ))}
          {commission.damages.length > 3 && (
            <span className="px-2 py-0.5 bg-ink-50 text-ink-500 text-xs rounded-full">
              +{commission.damages.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-paper-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-gold-600">
              <Gift size={14} />
              <span className="text-sm font-bold">{commission.reward}</span>
            </div>
            <div className="flex items-center gap-1 text-bamboo-600">
              <Star size={14} />
              <span className="text-sm font-bold">+{commission.expReward} EXP</span>
            </div>
          </div>
          {commission.status === 'completed' ? (
            <button
              disabled
              className="flex items-center gap-1 px-3 py-1.5 bg-bamboo-100 text-bamboo-600 text-sm rounded-lg cursor-not-allowed"
            >
              <Check size={14} />
              已完成
            </button>
          ) : commission.status === 'delivered' ? (
            <button
              disabled
              className="flex items-center gap-1 px-3 py-1.5 bg-vermilion-100 text-vermilion-600 text-sm rounded-lg cursor-not-allowed"
            >
              <Archive size={14} />
              已交付
            </button>
          ) : (
            <button
              onClick={() => onSelect(commission)}
              className="flex items-center gap-1 px-3 py-1.5 bg-vermilion-500 text-white text-sm rounded-lg hover:bg-vermilion-600 transition-colors"
            >
              {commission.status === 'in_progress' ? (
                <>
                  <Wrench size={14} />
                  继续修复
                </>
              ) : (
                <>
                  <Play size={14} />
                  接受委托
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FanDamageCard({
  commission,
  onClear,
}: {
  commission: RepairCommission;
  onClear: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
      <div className="relative h-56 bg-gradient-to-br from-paper-100 to-paper-200">
        <img
          src={commission.fanImage}
          alt={commission.fanName}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <button
          onClick={onClear}
          className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors text-white"
        >
          <X size={18} />
        </button>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
              {commission.dynasty}
            </span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
              {commission.origin}
            </span>
          </div>
          <h3 className="font-serif-sc text-2xl font-bold">{commission.fanName}</h3>
        </div>
      </div>

      <div className="p-5">
        <p className="text-ink-600 text-sm mb-4">{commission.description}</p>

        <h4 className="font-serif-sc font-bold text-ink-800 mb-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-vermilion-500" />
          损坏情况
        </h4>

        <div className="space-y-3">
          {commission.damages.map((damage) => (
            <DamageItem key={damage.type} damage={damage} />
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-paper-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gold-600">
              <Gift size={16} />
              <span className="font-bold">报酬 {commission.reward} 银两</span>
            </div>
            <div className="flex items-center gap-1 text-bamboo-600">
              <Star size={16} />
              <span className="font-bold">经验 +{commission.expReward}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DamageItem({ damage }: { damage: DamageInfo }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-paper-50 rounded-xl">
      <div className="w-10 h-10 rounded-lg bg-vermilion-100 text-vermilion-600 flex items-center justify-center text-xl flex-shrink-0">
        {damage.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h5 className="font-medium text-ink-800 text-sm">{damage.name}</h5>
          <span className="text-xs text-ink-500">修复费 {damage.repairCost}</span>
        </div>
        <p className="text-xs text-ink-500 mb-2">{damage.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-400">损坏程度</span>
          <div className="flex-1 h-1.5 bg-paper-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                damage.severity > 70 ? 'bg-vermilion-500' : damage.severity > 50 ? 'bg-gold-500' : 'bg-bamboo-500'
              }`}
              style={{ width: `${damage.severity}%` }}
            />
          </div>
          <span className="text-xs font-medium text-ink-600">{damage.severity}%</span>
        </div>
      </div>
    </div>
  );
}

function RepairStepCard({
  step,
  index,
  selectedTechnique,
  techniques,
  onSelect,
  onClear,
  currentLevel,
  isRepairing,
  currentStep,
}: {
  step: { key: RepairStep; name: string; icon: string; description: string };
  index: number;
  selectedTechnique: RepairTechnique | null;
  techniques: RepairTechnique[];
  onSelect: (technique: RepairTechnique) => void;
  onClear: () => void;
  currentLevel: string;
  isRepairing: boolean;
  currentStep: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const levelOrder = ['apprentice', 'craftsman', 'master', 'grandmaster'];
  const currentLevelIndex = levelOrder.indexOf(currentLevel);
  const isCompleted = currentStep > index;
  const isCurrent = currentStep === index;

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${
      selectedTechnique ? 'border-gold-300 bg-gold-50/50' : 
      isCompleted ? 'border-bamboo-300 bg-bamboo-50/50' :
      isCurrent && isRepairing ? 'border-vermilion-300 bg-vermilion-50/50' :
      'border-paper-200'
    }`}>
      <button
        onClick={() => !isRepairing && setExpanded(!expanded)}
        disabled={isRepairing}
        className="w-full p-4 flex items-center gap-3 hover:bg-paper-50 transition-colors disabled:cursor-not-allowed"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
          isCompleted ? 'bg-bamboo-500 text-white' :
          isCurrent && isRepairing ? 'bg-vermilion-500 text-white animate-pulse' :
          selectedTechnique ? 'bg-gold-500 text-white' : 'bg-paper-100 text-ink-500'
        }`}>
          {isCompleted ? <Check size={18} /> : step.icon}
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
            {isCurrent && isRepairing && (
              <span className="px-2 py-0.5 bg-vermilion-100 text-vermilion-600 text-xs rounded-full animate-pulse">
                修复中...
              </span>
            )}
          </div>
          <p className="text-xs text-ink-400 mt-0.5">{step.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedTechnique && !isRepairing && (
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  e.preventDefault();
                  onClear();
                }
              }}
              className="p-1.5 text-ink-400 hover:text-vermilion-500 hover:bg-vermilion-50 rounded-lg transition-colors cursor-pointer"
            >
              <X size={14} />
            </div>
          )}
          {!isRepairing && (
            <ChevronRight
              size={18}
              className={`text-ink-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
            />
          )}
        </div>
      </button>

      {expanded && !isRepairing && (
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
                    <span className="text-ink-400">
                      {tech.timeCost}工时
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

function RepairSummary({
  commission,
  totalCost,
  estimatedQuality,
  canRepair,
  isRepairing,
  repairProgress,
  onStartRepair,
  coins,
}: {
  commission: RepairCommission;
  totalCost: number;
  estimatedQuality: number;
  canRepair: boolean;
  isRepairing: boolean;
  repairProgress: number;
  onStartRepair: () => void;
  coins: number;
}) {
  const selectedTechniques = Object.values(commission.selectedTechniques);
  const requiredSteps = useRepairStore.getState().getRequiredTechniques();

  return (
    <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
      <div className="bg-gradient-to-r from-vermilion-500 to-gold-500 p-5 text-white">
        <h3 className="font-serif-sc text-xl font-bold mb-1">修复预览</h3>
        <p className="text-white/70 text-sm">确认修复工艺后开始修复</p>
      </div>

      <div className="p-5 space-y-4">
        <div className="p-3 bg-paper-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-ink-500 text-sm">修复对象</span>
            <span className="font-medium text-ink-800 text-sm">{commission.fanName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-500 text-sm">年代</span>
            <span className="font-medium text-ink-800 text-sm">{commission.dynasty}</span>
          </div>
        </div>

        <div className="p-3 bg-paper-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-ink-500 text-sm">修复工序</span>
            <span className="text-sm text-ink-600">{selectedTechniques.length} / {requiredSteps.length} 项</span>
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
            <p className="text-ink-400 text-sm">请选择修复工艺</p>
          )}
        </div>

        <div className="border-t border-paper-200 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-ink-500">预估品质</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-paper-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    estimatedQuality >= 90
                      ? 'bg-vermilion-500'
                      : estimatedQuality >= 75
                      ? 'bg-gold-500'
                      : estimatedQuality >= 55
                      ? 'bg-bamboo-500'
                      : 'bg-ink-300'
                  }`}
                  style={{ width: `${estimatedQuality}%` }}
                />
              </div>
              <span className={`font-bold ${
                estimatedQuality >= 90
                  ? 'text-vermilion-600'
                  : estimatedQuality >= 75
                  ? 'text-gold-600'
                  : estimatedQuality >= 55
                  ? 'text-bamboo-600'
                  : 'text-ink-500'
              }`}>
                {estimatedQuality}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-ink-500">修复费用</span>
            <span className="flex items-center gap-1 text-gold-600 font-bold text-lg">
              <Coins size={18} />
              {totalCost}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-ink-500">预计报酬</span>
            <span className="flex items-center gap-1 text-vermilion-600 font-bold text-lg">
              <Gift size={18} />
              +{commission.reward}
            </span>
          </div>
        </div>

        {isRepairing && (
          <div className="py-2">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-ink-500">修复中...</span>
              <span className="text-vermilion-600 font-medium">{repairProgress}%</span>
            </div>
            <div className="h-3 bg-paper-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-vermilion-500 to-gold-500 rounded-full transition-all duration-300"
                style={{ width: `${repairProgress}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={onStartRepair}
          disabled={!canRepair || isRepairing}
          className={`w-full py-3.5 rounded-xl font-serif-sc font-bold text-lg transition-all flex items-center justify-center gap-2 ${
            canRepair && !isRepairing
              ? 'bg-gradient-to-r from-vermilion-500 to-gold-500 text-white hover:shadow-lg hover:shadow-vermilion-500/30 active:scale-[0.98]'
              : 'bg-paper-200 text-ink-400 cursor-not-allowed'
          }`}
        >
          {isRepairing ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              精心修复中...
            </>
          ) : (
            <>
              <Wrench size={20} />
              开始修复
            </>
          )}
        </button>

        {!canRepair && !isRepairing && (
          <p className="text-center text-sm text-ink-400">
            {selectedTechniques.length !== requiredSteps.length
              ? `请选择全部 ${requiredSteps.length} 项修复工艺`
              : coins < totalCost
              ? '银两不足'
              : '无法开始修复'}
          </p>
        )}
      </div>
    </div>
  );
}

function ArchiveSection({
  restoredFans,
  onDeliver,
  completedCommissions,
}: {
  restoredFans: { commission: RepairCommission; fan: import('@/types/fan').Fan; restoredAt: string }[];
  onDeliver: (commissionId: string) => void;
  completedCommissions: RepairCommission[];
}) {
  if (restoredFans.length === 0 && completedCommissions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-elegant p-12 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="font-serif-sc text-xl font-bold text-ink-800 mb-2">暂无档案</h3>
        <p className="text-ink-400 mb-6">成功修复古扇后，将解锁其历史档案</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {completedCommissions.length > 0 && (
        <div>
          <h3 className="font-serif-sc text-base font-bold text-ink-700 mb-3 flex items-center gap-2">
            <Gift size={16} className="text-bamboo-500" />
            待交付
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {completedCommissions.map((commission, index) => (
              <ArchiveCard
                key={commission.id}
                commission={commission}
                fan={commission.unlockedArchive}
                index={index}
                onDeliver={onDeliver}
              />
            ))}
          </div>
        </div>
      )}

      {restoredFans.length > 0 && (
        <div>
          <h3 className="font-serif-sc text-base font-bold text-ink-700 mb-3 flex items-center gap-2">
            <BookOpen size={16} className="text-vermilion-500" />
            已归档
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {restoredFans.map((item, index) => (
              <ArchiveCard
                key={item.commission.id}
                commission={item.commission}
                fan={item.fan}
                index={index}
                onDeliver={onDeliver}
                isArchived
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const MATERIAL_NAMES: Record<string, string> = {
  bamboo: '竹',
  jade: '玉',
  silk: '丝绢',
  paper: '宣纸',
  gold: '金箔',
  kesi: '缂丝',
  lacquer: '大漆',
  ivory: '象牙',
  feather: '羽毛',
  sandalwood: '檀香木',
  embroidery: '刺绣',
};

const USAGE_NAMES: Record<string, string> = {
  cooling: '纳凉',
  ceremony: '礼仪',
  wedding: '婚嫁',
  gift: '馈赠',
  art: '书画',
  collection: '收藏',
  performance: '表演',
  dance: '舞蹈',
  military: '军事',
};

function ArchiveCard({
  commission,
  fan,
  index,
  onDeliver,
  isArchived = false,
}: {
  commission: RepairCommission;
  fan?: import('@/types/fan').Fan;
  index: number;
  onDeliver: (commissionId: string) => void;
  isArchived?: boolean;
}) {
  const qualityLabel = commission.finalQuality ? (
    commission.finalQuality >= 90 ? '完美修复' :
    commission.finalQuality >= 75 ? '精良修复' :
    commission.finalQuality >= 55 ? '合格修复' : '基础修复'
  ) : '基础修复';
  const qualityInfo = QUALITY_INFO[qualityLabel];

  return (
    <div
      className="bg-white rounded-2xl shadow-elegant overflow-hidden transition-all duration-300 hover:shadow-elegant-hover opacity-0 animate-fade-in-up"
      style={{
        animationDelay: `${index * 0.08}s`,
        animationFillMode: 'forwards',
      }}
    >
      <div className="relative h-48 bg-gradient-to-br from-paper-100 to-paper-200">
        <img
          src={commission.fanImage}
          alt={commission.fanName}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${qualityInfo.bgColor} ${qualityInfo.color}`}>
          {qualityLabel}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full">
          <Star size={12} className="text-gold-500 fill-gold-500" />
          <span className="text-xs font-bold text-ink-700">{commission.finalQuality || 0}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-serif-sc font-bold text-lg text-ink-800">{commission.fanName}</h4>
          <span className="text-xs text-ink-400 bg-paper-100 px-2 py-0.5 rounded-full whitespace-nowrap">
            {commission.dynasty}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {fan?.tags?.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 bg-vermilion-50 text-vermilion-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {fan && (
          <div className="space-y-3 mb-4">
            <div className="bg-paper-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <BookOpen size={13} className="text-vermilion-500" />
                <span className="text-xs font-bold text-ink-700">历史背景</span>
              </div>
              <p className="text-xs text-ink-600 leading-relaxed line-clamp-3">
                {fan.history || fan.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-paper-50 rounded-lg p-2.5">
                <div className="flex items-center gap-1 mb-1">
                  <MapPin size={11} className="text-bamboo-500" />
                  <span className="text-xs font-medium text-ink-600">产地</span>
                </div>
                <p className="text-xs text-ink-500 truncate">{fan.origin}</p>
              </div>
              <div className="bg-paper-50 rounded-lg p-2.5">
                <div className="flex items-center gap-1 mb-1">
                  <Calendar size={11} className="text-gold-500" />
                  <span className="text-xs font-medium text-ink-600">朝代</span>
                </div>
                <p className="text-xs text-ink-500 truncate">{fan.dynasty}</p>
              </div>
            </div>

            <div className="bg-paper-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles size={13} className="text-gold-500" />
                <span className="text-xs font-bold text-ink-700">材质工艺</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {fan.materials?.map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center px-1.5 py-0.5 bg-gold-50 text-gold-600 text-xs rounded"
                  >
                    {MATERIAL_NAMES[m] || m}
                  </span>
                ))}
              </div>
            </div>

            {fan.material && (
              <div className="text-xs text-ink-500 leading-relaxed bg-bamboo-50/50 rounded-lg p-2.5 border-l-2 border-bamboo-300">
                {fan.material}
              </div>
            )}

            <div className="bg-paper-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Scroll size={13} className="text-bamboo-500" />
                <span className="text-xs font-bold text-ink-700">传统用途</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-1.5">
                {fan.usages?.map((u) => (
                  <span
                    key={u}
                    className="inline-flex items-center px-1.5 py-0.5 bg-bamboo-50 text-bamboo-600 text-xs rounded"
                  >
                    {USAGE_NAMES[u] || u}
                  </span>
                ))}
              </div>
              {fan.usage && (
                <p className="text-xs text-ink-500 leading-relaxed line-clamp-2 mt-1.5 pt-1.5 border-t border-paper-100">
                  {fan.usage}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-1.5 pt-3 border-t border-paper-100">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-ink-500">
              <Gift size={12} className="text-gold-500" />
              修复报酬
            </span>
            <span className="font-medium text-gold-600">{commission.reward} 银两</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-ink-500">
              <Calendar size={12} />
              修复时间
            </span>
            <span className="font-medium text-ink-600">
              {commission.completedAt ? new Date(commission.completedAt).toLocaleDateString() : '-'}
            </span>
          </div>
        </div>

        {!isArchived && commission.status === 'completed' && (
          <div className="mt-4">
            <button
              onClick={() => onDeliver(commission.id)}
              className="w-full flex items-center justify-center gap-1 px-3 py-2.5 bg-bamboo-500 text-white text-sm rounded-lg hover:bg-bamboo-600 transition-colors"
            >
              <Gift size={14} />
              交付委托
            </button>
          </div>
        )}
        {isArchived && (
          <div className="mt-4">
            <div className="flex items-center justify-center gap-1 px-3 py-2.5 bg-paper-100 text-ink-500 text-sm rounded-lg">
              <Archive size={14} />
              档案已永久保存
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RepairResultModal({ commission, onClose }: { commission: RepairCommission; onClose: () => void }) {
  const qualityLabel = commission.finalQuality ? (
    commission.finalQuality >= 90 ? '完美修复' :
    commission.finalQuality >= 75 ? '精良修复' :
    commission.finalQuality >= 55 ? '合格修复' : '基础修复'
  ) : '基础修复';
  const qualityInfo = QUALITY_INFO[qualityLabel];

  const getQualityIcon = () => {
    switch (qualityLabel) {
      case '完美修复':
        return <Crown size={32} className="text-gold-400" />;
      case '精良修复':
        return <Trophy size={32} className="text-gold-500" />;
      case '合格修复':
        return <Award size={32} className="text-bamboo-500" />;
      default:
        return <Star size={32} className="text-ink-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-800/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-elegant-hover w-full max-w-md overflow-hidden opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
        <div className={`relative p-6 text-center ${
          qualityLabel === '完美修复'
            ? 'bg-gradient-to-br from-gold-400 via-vermilion-500 to-gold-400'
            : qualityLabel === '精良修复'
            ? 'bg-gradient-to-br from-gold-400 to-gold-600'
            : qualityLabel === '合格修复'
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
            {qualityInfo.label}
          </div>

          <h3 className="font-serif-sc text-3xl font-bold mb-2">{commission.fanName}</h3>
          <p className="text-white/80 text-sm">修复完成！</p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-12 h-px bg-white/30" />
            <span className="text-5xl">🪭</span>
            <div className="w-12 h-px bg-white/30" />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="text-center p-3 bg-paper-50 rounded-xl">
              <p className="text-ink-400 text-xs mb-1">修复评分</p>
              <p className="text-2xl font-bold text-vermilion-600">{commission.finalQuality || 0}</p>
            </div>
            <div className="text-center p-3 bg-paper-50 rounded-xl">
              <p className="text-ink-400 text-xs mb-1">获得报酬</p>
              <p className="text-2xl font-bold text-gold-600">+{commission.reward}</p>
            </div>
          </div>

          <div className="p-4 bg-gold-50 rounded-xl mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gold-600">历史档案已解锁</p>
                <p className="text-sm font-medium text-ink-800">
                  {commission.fanName} 的详细信息
                </p>
              </div>
            </div>
            <p className="text-xs text-ink-500 mt-2">
              您可以在"历史档案"中查看这把古扇的完整历史档案，了解其背后的故事。
            </p>
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
