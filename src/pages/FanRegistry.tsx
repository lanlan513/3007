import { useState, useEffect } from 'react';
import { Search, Lock, Compass, X, Lightbulb, Scroll, ChevronRight, Sparkles } from 'lucide-react';
import { useRegistryStore } from '@/store/useRegistryStore';
import { REGISTRY_RARITY_INFO, REGISTRY_STATUS_INFO } from '@/types/fan';
import type { FanRegistryEntry, FanRegistryRarity, FanRegistryStatus } from '@/types/fan';

function RegistryCard({ entry, onClick }: { entry: FanRegistryEntry; onClick: () => void }) {
  const rarity = REGISTRY_RARITY_INFO[entry.rarity];
  const status = REGISTRY_STATUS_INFO[entry.status];

  if (entry.status === 'undiscovered') {
    return (
      <button
        onClick={onClick}
        className="relative group bg-paper-200/50 border-2 border-dashed border-paper-400 rounded-2xl p-6 text-center transition-all hover:border-paper-500 hover:bg-paper-200/80 min-h-[220px] flex flex-col items-center justify-center"
      >
        <div className="text-5xl mb-3 opacity-40 group-hover:opacity-60 transition-opacity">❓</div>
        <div className="font-serif-sc text-ink-400 text-sm mb-1">{entry.registryNumber}</div>
        <div className="text-ink-300 text-xs">点击探索</div>
        <div className="absolute top-3 right-3">
          <span className="text-xs text-ink-300 bg-paper-300/50 px-2 py-0.5 rounded-full">{status.icon} {status.label}</span>
        </div>
      </button>
    );
  }

  if (entry.status === 'locked') {
    return (
      <button
        onClick={onClick}
        className={`relative group bg-gradient-to-br from-ink-800/90 to-ink-900/90 border-2 ${rarity.border} rounded-2xl p-5 text-left transition-all hover:scale-[1.02] min-h-[220px] flex flex-col ${rarity.glow}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-vermilion-500/5 to-gold-500/5 rounded-2xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-serif-sc px-2 py-0.5 rounded-full ${rarity.bgColor} ${rarity.color} border ${rarity.border}`}>
              {rarity.seal} {rarity.label}
            </span>
            <span className="flex items-center gap-1 text-xs text-vermilion-400">
              <Lock size={12} /> 封印
            </span>
          </div>
          <div className="font-serif-sc text-xl font-bold text-gold-300 mb-1">{entry.name}</div>
          <div className="text-ink-400 text-xs mb-3 font-serif-sc">{entry.registryNumber}</div>
          <div className="text-ink-400 text-xs mb-3 leading-relaxed line-clamp-2">{entry.unlockCondition}</div>
          <div className="mt-auto flex items-center gap-2">
            <div className="flex -space-x-1">
              {entry.clues.map((clue, i) => (
                <div
                  key={clue.id}
                  className={`w-6 h-6 rounded-full border-2 border-ink-800 flex items-center justify-center text-xs ${
                    clue.solved ? 'bg-bamboo-500 text-white' : 'bg-ink-700 text-ink-400'
                  }`}
                >
                  {clue.solved ? '✓' : i + 1}
                </div>
              ))}
            </div>
            <span className="text-ink-500 text-xs">
              {entry.clues.filter(c => c.solved).length}/{entry.clues.length} 线索
            </span>
          </div>
        </div>
        <div className="absolute top-2 left-2 opacity-20 text-4xl">🔒</div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`relative group bg-white border-2 ${rarity.border} rounded-2xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-elegant-hover min-h-[220px] flex flex-col text-left ${rarity.glow}`}
    >
      <div className="h-32 overflow-hidden relative">
        <img
          src={entry.image}
          alt={entry.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        <div className="absolute top-2 left-2">
          <span className={`text-xs font-serif-sc px-2 py-0.5 rounded-full ${rarity.bgColor} ${rarity.color} border ${rarity.border} backdrop-blur-sm`}>
            {rarity.seal} {rarity.label}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <span className={`text-xs px-2 py-0.5 rounded-full bg-white/80 ${status.color} flex items-center gap-1`}>
            {status.icon} {status.label}
          </span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="font-serif-sc text-lg font-bold text-ink-800 mb-0.5">{entry.name}</div>
        <div className="text-ink-400 text-xs font-serif-sc mb-2">{entry.registryNumber} · {entry.categoryName} · {entry.dynasty}</div>
        <div className="text-ink-500 text-xs leading-relaxed line-clamp-2 mb-3 flex-1">{entry.origin} · {entry.material}</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 min-w-[60px] bg-paper-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${entry.completeness}%`,
                  background: entry.completeness === 100
                    ? 'linear-gradient(90deg, #7D9B6A, #abc49b)'
                    : entry.completeness >= 60
                    ? 'linear-gradient(90deg, #C9A959, #d4bd82)'
                    : 'linear-gradient(90deg, #C8102E, #f87171)',
                }}
              />
            </div>
            <span className="text-xs text-ink-400">{entry.completeness}%</span>
          </div>
          {entry.completeness < 100 && (
            <span className="text-xs text-vermilion-500">{entry.missingFields.filter(f => !f.filled).length}项待补</span>
          )}
        </div>
      </div>
    </button>
  );
}

function DetailModal() {
  const { getSelectedEntry, showDetailModal, setShowDetailModal, setActiveClue, setShowClueModal } = useRegistryStore();

  const entry = getSelectedEntry();

  if (!showDetailModal || !entry) return null;

  const rarity = REGISTRY_RARITY_INFO[entry.rarity];
  const status = REGISTRY_STATUS_INFO[entry.status];

  const unsolvedClues = entry.clues.filter(c => !c.solved);
  const solvedClues = entry.clues.filter(c => c.solved);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowDetailModal(false)}>
      <div className="absolute inset-0 bg-ink-800/60 backdrop-blur-sm" />
      <div
        className="relative bg-paper-50 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-ink-spread"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-paper-50/95 backdrop-blur-md z-10 px-6 py-4 border-b border-paper-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-serif-sc ${rarity.bgColor} ${rarity.color} border ${rarity.border}`}>
              {rarity.seal} {rarity.label}
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-xs ${status.color} bg-white border border-paper-200`}>
              {status.icon} {status.label}
            </span>
            <span className="font-serif-sc text-sm text-ink-500">{entry.registryNumber}</span>
          </div>
          <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-paper-200 rounded-full transition-colors">
            <X size={20} className="text-ink-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="md:w-2/5">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-elegant">
                <img src={entry.image} alt={entry.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="md:w-3/5">
              <h2 className="font-serif-sc text-3xl font-bold text-ink-800 mb-2">{entry.name}</h2>
              <div className="flex items-center gap-3 mb-4 text-sm text-ink-500">
                <span>{entry.categoryName}</span>
                <span className="w-1 h-1 bg-ink-300 rounded-full" />
                <span>{entry.dynasty}</span>
                <span className="w-1 h-1 bg-ink-300 rounded-full" />
                <span>{entry.origin}</span>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-ink-600 font-serif-sc">完善度</span>
                  <span className={`text-sm font-bold ${entry.completeness === 100 ? 'text-bamboo-600' : 'text-gold-600'}`}>{entry.completeness}%</span>
                </div>
                <div className="h-2.5 bg-paper-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${entry.completeness}%`,
                      background: entry.completeness === 100
                        ? 'linear-gradient(90deg, #7D9B6A, #abc49b)'
                        : entry.completeness >= 60
                        ? 'linear-gradient(90deg, #C9A959, #d4bd82)'
                        : 'linear-gradient(90deg, #C8102E, #f87171)',
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {entry.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-paper-100 text-ink-600 text-xs rounded-lg border border-paper-200">
                    {tag}
                  </span>
                ))}
              </div>

              {entry.status === 'locked' && unsolvedClues.length > 0 && (
                <div className="bg-vermilion-50 border border-vermilion-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock size={16} className="text-vermilion-500" />
                    <span className="font-serif-sc font-bold text-vermilion-700 text-sm">封印线索</span>
                  </div>
                  <div className="space-y-2">
                    {unsolvedClues.map((clue, i) => (
                      <button
                        key={clue.id}
                        onClick={() => { setActiveClue(clue); setShowClueModal(true); }}
                        className="w-full text-left p-3 bg-white rounded-lg border border-vermilion-100 hover:border-vermilion-300 transition-colors group"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-vermilion-400 text-xs mt-0.5">线索{i + 1}</span>
                          <span className="text-sm text-ink-700 flex-1 line-clamp-2">{clue.text}</span>
                          <ChevronRight size={14} className="text-vermilion-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {solvedClues.length > 0 && (
                <div className="bg-bamboo-50 border border-bamboo-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-bamboo-600 text-sm">✓</span>
                    <span className="font-serif-sc font-bold text-bamboo-700 text-sm">已解线索</span>
                  </div>
                  <div className="space-y-2">
                    {solvedClues.map((clue, i) => (
                      <div key={clue.id} className="p-3 bg-white/60 rounded-lg border border-bamboo-100">
                        <div className="flex items-start gap-2">
                          <span className="text-bamboo-500 text-xs mt-0.5">线索{i + 1}</span>
                          <span className="text-sm text-ink-600 flex-1 line-clamp-2">{clue.text}</span>
                          <span className="text-bamboo-500 text-xs">已解</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InfoField label="产地" value={entry.origin} entryId={entry.id} fieldKey="origin" />
            <InfoField label="年代" value={entry.dynasty} entryId={entry.id} fieldKey="dynasty" />
            <InfoField label="材质" value={entry.material} entryId={entry.id} fieldKey="material" />
            <InfoField label="用途" value={entry.usage} entryId={entry.id} fieldKey="usage" />
          </div>

          <InfoField label="制作工艺" value={entry.craftsmanship} entryId={entry.id} fieldKey="craftsmanship" fullWidth />
          <InfoField label="扇中典故" value={entry.story} entryId={entry.id} fieldKey="story" fullWidth />

          {entry.inheritanceRecords.length > 0 && (
            <div className="mt-6">
              <h3 className="font-serif-sc font-bold text-ink-800 mb-3 flex items-center gap-2">
                <Scroll size={18} className="text-gold-500" />
                传承记录
              </h3>
              <div className="space-y-3">
                {entry.inheritanceRecords.map((record, i) => (
                  <div key={record.id} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-gold-400 border-2 border-gold-200" />
                      {i < entry.inheritanceRecords.length - 1 && <div className="w-0.5 h-full bg-gold-200" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-serif-sc font-medium text-ink-800 text-sm">{record.owner}</span>
                        <span className="text-xs text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full">{record.event}</span>
                        <span className="text-xs text-ink-400">{record.period}</span>
                      </div>
                      <p className="text-xs text-ink-500 leading-relaxed">{record.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value, entryId, fieldKey, fullWidth }: { label: string; value: string; entryId: string; fieldKey: string; fullWidth?: boolean }) {
  const { getEntryById, openFieldForEdit } = useRegistryStore();
  const entry = getEntryById(entryId);
  const missingField = entry?.missingFields.find(f => f.key === fieldKey);
  const isMissing = missingField && !missingField.filled;

  return (
    <div className={fullWidth ? 'mb-4' : ''}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-ink-400 font-serif-sc">{label}</span>
        {isMissing && (
          <button
            onClick={() => openFieldForEdit(entryId, fieldKey)}
            className="text-xs text-vermilion-500 hover:text-vermilion-600 flex items-center gap-1 transition-colors"
          >
            <Sparkles size={10} />
            待补全
          </button>
        )}
      </div>
      {isMissing ? (
        <div
          onClick={() => openFieldForEdit(entryId, fieldKey)}
          className="p-3 bg-paper-100/50 border border-dashed border-paper-300 rounded-xl text-ink-300 text-sm cursor-pointer hover:border-vermilion-300 hover:bg-vermilion-50/30 transition-colors"
        >
          {missingField.placeholder}
        </div>
      ) : (
        <p className="text-sm text-ink-700 leading-relaxed">{value}</p>
      )}
    </div>
  );
}

function ClueModal() {
  const { showClueModal, setShowClueModal, activeClue, clueAnswer, setClueAnswer, clueError, submitClueAnswer } = useRegistryStore();

  if (!showClueModal || !activeClue) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setShowClueModal(false)}>
      <div className="absolute inset-0 bg-ink-800/70 backdrop-blur-sm" />
      <div className="relative bg-paper-50 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-story-unlock" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-vermilion-100 text-vermilion-600 flex items-center justify-center text-2xl">
            🔍
          </div>
          <div>
            <h3 className="font-serif-sc text-lg font-bold text-ink-800">解封线索</h3>
            <p className="text-xs text-ink-400">根据线索推理，输入你的答案</p>
          </div>
        </div>

        <div className="bg-ink-800 rounded-xl p-4 mb-4">
          <p className="text-gold-200 font-serif-sc text-sm leading-relaxed mb-3">{activeClue.text}</p>
          <div className="flex items-center gap-2 text-ink-400 text-xs">
            <Lightbulb size={12} className="text-gold-400" />
            <span>提示：{activeClue.hint}</span>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={clueAnswer}
            onChange={e => setClueAnswer(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submitClueAnswer(); }}
            placeholder="输入你的推理答案……"
            className="w-full px-4 py-3 border-2 border-paper-300 rounded-xl text-ink-800 font-serif-sc focus:border-vermilion-400 focus:outline-none transition-colors bg-white"
            autoFocus
          />
          {clueError && (
            <p className="text-vermilion-500 text-xs mt-2">{clueError}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowClueModal(false)}
            className="flex-1 py-3 rounded-xl border border-paper-300 text-ink-600 hover:bg-paper-100 transition-colors text-sm"
          >
            放弃
          </button>
          <button
            onClick={() => submitClueAnswer()}
            className="flex-1 py-3 rounded-xl bg-vermilion-500 text-white hover:bg-vermilion-600 transition-colors text-sm font-serif-sc font-bold"
          >
            提交推理
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldFillModal() {
  const { showFieldModal, setShowFieldModal, activeFieldEntryId, activeFieldKey, fieldValue, setFieldValue, submitFieldValue, getEntryById } = useRegistryStore();
  const [error, setError] = useState('');

  if (!showFieldModal || !activeFieldEntryId) return null;

  const entry = getEntryById(activeFieldEntryId);
  if (!entry) return null;

  const field = entry.missingFields.find(f => f.key === activeFieldKey);
  if (!field) return null;

  const handleSubmit = () => {
    if (!fieldValue.trim()) {
      setError('请选择或输入答案');
      return;
    }
    const success = submitFieldValue();
    if (!success && fieldValue.trim() !== field.correctValue) {
      setError('此答案有误，请再想想');
      setFieldValue('');
    } else {
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setShowFieldModal(false)}>
      <div className="absolute inset-0 bg-ink-800/70 backdrop-blur-sm" />
      <div className="relative bg-paper-50 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-story-unlock" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-bamboo-100 text-bamboo-600 flex items-center justify-center text-2xl">
            ✍️
          </div>
          <div>
            <h3 className="font-serif-sc text-lg font-bold text-ink-800">补全扇谱</h3>
            <p className="text-xs text-ink-400">{entry.name} · {field.label}</p>
          </div>
        </div>

        <div className="bg-paper-100 rounded-xl p-4 mb-4">
          <p className="text-ink-600 text-sm">{field.placeholder}</p>
        </div>

        {field.options.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-xs text-ink-400 mb-2 font-serif-sc">选择你认为正确的答案：</p>
            {field.options.map((option) => (
              <button
                key={option}
                onClick={() => { setFieldValue(option); setError(''); }}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all text-sm font-serif-sc ${
                  fieldValue === option
                    ? 'border-bamboo-400 bg-bamboo-50 text-bamboo-700'
                    : 'border-paper-200 bg-white text-ink-600 hover:border-paper-300 hover:bg-paper-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    fieldValue === option ? 'border-bamboo-500' : 'border-paper-300'
                  }`}>
                    {fieldValue === option && <div className="w-2.5 h-2.5 rounded-full bg-bamboo-500" />}
                  </div>
                  <span className="line-clamp-2">{option}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mb-4">
          <p className="text-xs text-ink-400 mb-2 font-serif-sc">或者自行输入答案：</p>
          <textarea
            value={fieldValue}
            onChange={e => { setFieldValue(e.target.value); setError(''); }}
            placeholder="输入你所知的信息……"
            className="w-full px-4 py-3 border-2 border-paper-300 rounded-xl text-ink-800 font-serif-sc focus:border-bamboo-400 focus:outline-none transition-colors bg-white resize-none"
            rows={2}
          />
        </div>

        {error && (
          <p className="text-vermilion-500 text-xs mb-3">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => { setShowFieldModal(false); setError(''); }}
            className="flex-1 py-3 rounded-xl border border-paper-300 text-ink-600 hover:bg-paper-100 transition-colors text-sm"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-bamboo-500 text-white hover:bg-bamboo-600 transition-colors text-sm font-serif-sc font-bold"
          >
            确认提交
          </button>
        </div>
      </div>
    </div>
  );
}

function UnlockAnimation() {
  const { newlyUnlocked, resetNewlyUnlocked, getEntryById } = useRegistryStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (newlyUnlocked) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        resetNewlyUnlocked();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [newlyUnlocked, resetNewlyUnlocked]);

  if (!show || !newlyUnlocked) return null;

  const entry = getEntryById(newlyUnlocked);
  if (!entry) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none">
      <div className="animate-story-unlock text-center">
        <div className="text-6xl mb-4 animate-float">🔓</div>
        <div className="font-serif-sc text-2xl font-bold text-gold-400 drop-shadow-lg mb-2">封印已解</div>
        <div className="font-serif-sc text-lg text-white drop-shadow-lg">{entry.name}</div>
        <div className="text-sm text-gold-300/80 mt-1">{entry.registryNumber}</div>
      </div>
    </div>
  );
}

function DiscoveryAnimation() {
  const { newlyDiscovered, resetNewlyDiscovered, getEntryById } = useRegistryStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (newlyDiscovered) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        resetNewlyDiscovered();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [newlyDiscovered, resetNewlyDiscovered]);

  if (!show || !newlyDiscovered) return null;

  const entry = getEntryById(newlyDiscovered);
  if (!entry) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none">
      <div className="animate-ink-spread text-center">
        <div className="text-5xl mb-3">📜</div>
        <div className="font-serif-sc text-xl font-bold text-bamboo-600 drop-shadow-lg mb-1">发现新扇谱！</div>
        <div className="font-serif-sc text-lg text-ink-800 drop-shadow-lg">{entry.name}</div>
        <div className="text-sm text-ink-500 mt-1">{entry.registryNumber}</div>
      </div>
    </div>
  );
}

export default function FanRegistry() {
  const {
    getVisibleEntries,
    getStats,
    selectEntry,
    discoverEntry,
    searchKeyword,
    setSearchKeyword,
    filterRarity,
    setFilterRarity,
    filterStatus,
    setFilterStatus,
    attemptRandomDiscovery,
  } = useRegistryStore();

  const entries = getVisibleEntries();
  const stats = getStats();

  const handleCardClick = (entry: FanRegistryEntry) => {
    if (entry.status === 'undiscovered') {
      discoverEntry(entry.id);
    } else {
      selectEntry(entry.id);
    }
  };

  const rarityFilters: { value: FanRegistryRarity | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: '全部', icon: '📖' },
    { value: 'common', label: '寻常', icon: '📜' },
    { value: 'rare', label: '珍品', icon: '🏛️' },
    { value: 'epic', label: '名器', icon: '⚜️' },
    { value: 'legendary', label: '神品', icon: '👑' },
  ];

  const statusFilters: { value: FanRegistryStatus | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: '全部', icon: '📋' },
    { value: 'discovered', label: '已发现', icon: '📖' },
    { value: 'locked', label: '封印', icon: '🔒' },
    { value: 'unlocked', label: '解封', icon: '🔓' },
    { value: 'completed', label: '完备', icon: '✅' },
  ];

  return (
    <div className="min-h-screen bg-paper-50 pt-20 md:pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-ink-800 to-ink-900 rounded-2xl p-6 mb-6 text-white shadow-elegant relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-8 text-6xl font-serif-sc text-gold-400/30">天</div>
            <div className="absolute bottom-4 right-8 text-6xl font-serif-sc text-gold-400/30">扇</div>
          </div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-3 mb-2">
                  <span className="w-px h-4 bg-gold-400/40" />
                  <span className="text-gold-400 font-serif-sc text-sm tracking-widest">武林秘籍</span>
                  <span className="w-px h-4 bg-gold-400/40" />
                </div>
                <h1 className="font-serif-sc text-3xl md:text-4xl font-bold mb-2">天下扇谱</h1>
                <p className="text-ink-400 text-sm">
                  每一把扇子都有独立编号、来源、工艺与传承记录。发现新扇谱，补全缺失信息，解锁封印条目。
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={attemptRandomDiscovery}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gold-500/20 backdrop-blur-sm rounded-xl hover:bg-gold-500/30 transition-colors border border-gold-500/30"
                >
                  <Compass size={18} className="text-gold-400" />
                  <span className="text-sm text-gold-300">探索扇谱</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-5">
              <StatCard icon="📖" label="已发现" value={stats.discovered + stats.unlocked + stats.completed} color="text-bamboo-400" />
              <StatCard icon="🔒" label="封印中" value={stats.locked} color="text-vermilion-400" />
              <StatCard icon="🔓" label="已解封" value={stats.unlocked} color="text-gold-400" />
              <StatCard icon="✅" label="已完备" value={stats.completed} color="text-bamboo-300" />
              <StatCard icon="❓" label="未发现" value={stats.undiscovered} color="text-ink-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-elegant p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
              <input
                type="text"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                placeholder="搜索扇谱名称、产地、朝代……"
                className="w-full pl-10 pr-4 py-2.5 border border-paper-300 rounded-xl text-sm focus:border-vermilion-400 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-ink-400 whitespace-nowrap">品级</span>
              {rarityFilters.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilterRarity(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                    filterRarity === f.value
                      ? 'bg-vermilion-500 text-white shadow-sm'
                      : 'bg-paper-100 text-ink-500 hover:bg-paper-200'
                  }`}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-ink-400 whitespace-nowrap">状态</span>
              {statusFilters.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilterStatus(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                    filterStatus === f.value
                      ? 'bg-vermilion-500 text-white shadow-sm'
                      : 'bg-paper-100 text-ink-500 hover:bg-paper-200'
                  }`}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {entries.map(entry => (
            <RegistryCard
              key={entry.id}
              entry={entry}
              onClick={() => handleCardClick(entry)}
            />
          ))}
        </div>

        {entries.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📜</div>
            <p className="font-serif-sc text-ink-400 text-lg">暂无匹配的扇谱条目</p>
            <p className="text-ink-300 text-sm mt-2">尝试调整筛选条件或探索新扇谱</p>
          </div>
        )}
      </div>

      <DetailModal />
      <ClueModal />
      <FieldFillModal />
      <UnlockAnimation />
      <DiscoveryAnimation />
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
      <div className="text-lg mb-0.5">{icon}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-ink-500 text-xs">{label}</div>
    </div>
  );
}
