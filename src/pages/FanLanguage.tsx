import { useState, useMemo } from 'react';
import {
  BookOpen,
  Hand,
  Palette,
  ScrollText,
  Brain,
  ChevronRight,
  ChevronDown,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Trophy,
  HelpCircle,
  Users,
  Clock,
  ArrowLeft,
  Sparkles,
  Eye,
} from 'lucide-react';
import {
  FAN_GESTURES,
  FAN_SCENARIOS,
  FAN_SYMBOLS,
  FAN_ETIQUETTE,
  FAN_PUZZLES,
} from '@/data/fanLanguageData';
import {
  SCENARIO_CATEGORIES,
  SYMBOL_CATEGORIES,
  type FanScenarioCategory,
  type FanSymbolCategory,
  type FanGesture,
  type FanScenario,
  type FanSymbol,
  type FanEtiquette,
  type FanPuzzle,
  type PuzzleQuestion,
} from '@/types/fan';

type TabType = 'gestures' | 'scenarios' | 'symbols' | 'etiquette' | 'puzzles';

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'gestures', label: '扇语手势', icon: <Hand size={18} /> },
  { id: 'scenarios', label: '场景扇语', icon: <BookOpen size={18} /> },
  { id: 'symbols', label: '扇子象征', icon: <Palette size={18} /> },
  { id: 'etiquette', label: '扇礼规范', icon: <ScrollText size={18} /> },
  { id: 'puzzles', label: '扇语解谜', icon: <Brain size={18} /> },
];

function getDifficultyColor(d: FanPuzzle['difficulty']) {
  if (d === 'easy') return 'text-bamboo-600 bg-bamboo-50 border-bamboo-200';
  if (d === 'medium') return 'text-gold-600 bg-gold-50 border-gold-200';
  return 'text-vermilion-600 bg-vermilion-50 border-vermilion-200';
}

function getDifficultyLabel(d: FanPuzzle['difficulty']) {
  if (d === 'easy') return '入门';
  if (d === 'medium') return '进阶';
  return '高深';
}

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vermilion-500 to-gold-500 text-white flex items-center justify-center shadow-elegant">
        {icon}
      </div>
      <div>
        <h2 className="font-serif-sc text-2xl font-bold text-ink-800">{title}</h2>
        <p className="text-sm text-ink-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function GestureCard({ gesture }: { gesture: FanGesture }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-elegant overflow-hidden transition-all hover:shadow-elegant-hover">
      <button
        className="w-full p-5 flex items-center justify-between text-left hover:bg-paper-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-paper-100 flex items-center justify-center text-3xl">
            {gesture.icon}
          </div>
          <div>
            <h3 className="font-serif-sc text-lg font-bold text-ink-800">{gesture.name}</h3>
            <p className="text-sm text-ink-400 mt-0.5">{gesture.description}</p>
          </div>
        </div>
        <div className="text-ink-300">
          {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </button>
      {expanded && (
        <div className="border-t border-paper-100 p-5 bg-paper-50/50">
          <div className="space-y-3">
            {gesture.meanings.map((m, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 border border-paper-100">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full bg-vermilion-50 text-vermilion-600 text-xs font-medium border border-vermilion-100">
                    {m.context}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-bamboo-50 text-bamboo-600 text-xs font-medium border border-bamboo-100">
                    {m.emotion}
                  </span>
                  {m.dynasty && (
                    <span className="px-2.5 py-1 rounded-full bg-gold-50 text-gold-600 text-xs font-medium border border-gold-100">
                      {m.dynasty}
                    </span>
                  )}
                </div>
                <p className="text-ink-600 text-sm leading-relaxed">{m.meaning}</p>
                {m.source && (
                  <p className="text-xs text-ink-400 mt-2 flex items-center gap-1">
                    <BookOpen size={12} />
                    出自{m.source}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GesturesSection() {
  return (
    <div>
      <SectionHeader
        icon={<Hand size={22} />}
        title="扇语手势"
        subtitle="一摇一扇皆有深意，古人的肢体语言密码"
      />
      <p className="text-ink-500 mb-6 leading-relaxed">
        扇子不仅是纳凉工具，更是传递情感、表达心意的重要媒介。
        古人通过扇子的开合、摇动、挥舞等动作，形成了一套独特的"扇语"体系。
        点击下方手势卡片，了解每种动作在不同场景下的深层含义。
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        {FAN_GESTURES.map((g) => (
          <GestureCard key={g.id} gesture={g} />
        ))}
      </div>
    </div>
  );
}

function ScenariosSection() {
  const [selectedCategory, setSelectedCategory] = useState<FanScenarioCategory | 'all'>('all');
  const [selectedScenario, setSelectedScenario] = useState<FanScenario | null>(null);

  const filteredScenarios = useMemo(() => {
    if (selectedCategory === 'all') return FAN_SCENARIOS;
    return FAN_SCENARIOS.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  if (selectedScenario) {
    return (
      <div>
        <button
          onClick={() => setSelectedScenario(null)}
          className="flex items-center gap-2 text-ink-500 hover:text-vermilion-500 mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-serif-sc">返回场景列表</span>
        </button>
        <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
          <div
            className={`p-6 bg-gradient-to-r ${
              selectedScenario.category === 'court'
                ? 'from-gold-500 to-gold-400'
                : selectedScenario.category === 'scholar'
                ? 'from-bamboo-500 to-bamboo-400'
                : selectedScenario.category === 'romance'
                ? 'from-vermilion-500 to-vermilion-400'
                : selectedScenario.category === 'war'
                ? 'from-ink-600 to-ink-500'
                : selectedScenario.category === 'performance'
                ? 'from-vermilion-400 to-gold-400'
                : 'from-paper-500 to-paper-400'
            } text-white`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{selectedScenario.icon}</span>
              <div>
                <div className="text-white/70 text-xs tracking-wider">
                  {selectedScenario.categoryName}
                </div>
                <h3 className="font-serif-sc text-2xl font-bold">{selectedScenario.title}</h3>
              </div>
            </div>
            <p className="text-white/90">{selectedScenario.description}</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-paper-50 rounded-xl p-4 border border-paper-200">
              <h4 className="font-serif-sc font-bold text-ink-700 mb-2 flex items-center gap-2">
                <Clock size={16} className="text-gold-500" />
                历史背景
              </h4>
              <p className="text-ink-600 text-sm leading-relaxed">
                {selectedScenario.historicalContext}
              </p>
            </div>

            <div>
              <h4 className="font-serif-sc font-bold text-ink-700 mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-vermilion-500" />
                场景中的扇语
              </h4>
              <div className="space-y-3">
                {selectedScenario.gestures.map((g, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-paper-200 rounded-xl p-4 hover:border-vermilion-200 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-vermilion-50 flex items-center justify-center text-xl shrink-0">
                        {FAN_GESTURES.find((fg) => fg.id === g.gestureId)?.icon || '🪭'}
                      </div>
                      <div className="flex-1">
                        <div className="font-serif-sc font-bold text-ink-800">
                          {g.gestureName}
                        </div>
                        <p className="text-vermilion-600 text-sm mt-1 font-medium">
                          含义：{g.meaning}
                        </p>
                        <p className="text-ink-500 text-sm mt-2 leading-relaxed">
                          <span className="text-gold-600 font-medium">典故：</span>
                          {g.usageExample}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-serif-sc font-bold text-ink-700 mb-3 flex items-center gap-2">
                <BookOpen size={16} className="text-bamboo-500" />
                相关典故
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedScenario.relatedStories.map((story, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-2 bg-paper-50 rounded-lg text-sm text-ink-600 border border-paper-200"
                  >
                    {story}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        icon={<BookOpen size={22} />}
        title="场景扇语"
        subtitle="不同场合，扇语各异——古人的社交情境指南"
      />
      <p className="text-ink-500 mb-6 leading-relaxed">
        扇语的含义并非一成不变，而是根据场合、对象、情境的不同而变化万千。
        在金殿之上是一个意思，在深闺之中又是另一番意味。
        选择场景分类，探索扇语在不同情境下的丰富内涵。
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl font-serif-sc text-sm transition-all ${
            selectedCategory === 'all'
              ? 'bg-vermilion-500 text-white shadow-md'
              : 'bg-white text-ink-600 border border-paper-200 hover:border-vermilion-300'
          }`}
        >
          全部场景
        </button>
        {Object.entries(SCENARIO_CATEGORIES).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key as FanScenarioCategory)}
            className={`px-4 py-2 rounded-xl font-serif-sc text-sm transition-all flex items-center gap-1.5 ${
              selectedCategory === key
                ? 'bg-vermilion-500 text-white shadow-md'
                : 'bg-white text-ink-600 border border-paper-200 hover:border-vermilion-300'
            }`}
          >
            <span>{info.icon}</span>
            {info.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredScenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedScenario(s)}
            className="bg-white rounded-2xl shadow-elegant overflow-hidden text-left hover:shadow-elegant-hover transition-all hover:-translate-y-1"
          >
            <div
              className={`p-5 text-white ${
                s.category === 'court'
                  ? 'bg-gradient-to-br from-gold-500 to-gold-400'
                  : s.category === 'scholar'
                  ? 'bg-gradient-to-br from-bamboo-500 to-bamboo-400'
                  : s.category === 'romance'
                  ? 'bg-gradient-to-br from-vermilion-500 to-vermilion-400'
                  : s.category === 'war'
                  ? 'bg-gradient-to-br from-ink-600 to-ink-500'
                  : s.category === 'performance'
                  ? 'bg-gradient-to-br from-vermilion-400 to-gold-400'
                  : 'bg-gradient-to-br from-paper-500 to-paper-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/70 text-xs mb-1">{s.categoryName}</div>
                  <h3 className="font-serif-sc text-xl font-bold">{s.title}</h3>
                </div>
                <span className="text-4xl">{s.icon}</span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-ink-500 text-sm leading-relaxed line-clamp-2">
                {s.description}
              </p>
              <div className="mt-3 flex items-center gap-1 text-vermilion-500 text-sm font-medium">
                <span>查看详情</span>
                <ChevronRight size={16} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SymbolsSection() {
  const [selectedCategory, setSelectedCategory] = useState<FanSymbolCategory | 'all'>('all');

  const filteredSymbols = useMemo(() => {
    if (selectedCategory === 'all') return FAN_SYMBOLS;
    return FAN_SYMBOLS.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div>
      <SectionHeader
        icon={<Palette size={22} />}
        title="扇子象征"
        subtitle="颜色、图案、材质、形制——扇子中的文化密码"
      />
      <p className="text-ink-500 mb-6 leading-relaxed">
        扇子的每一处细节都蕴含深意。朱砂红象征喜庆吉祥，竹青兰代表高洁清雅，
        牡丹寓意富贵，山水寄情林泉。读懂扇子的象征语言，才能真正领悟古人的审美与哲思。
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl font-serif-sc text-sm transition-all ${
            selectedCategory === 'all'
              ? 'bg-vermilion-500 text-white shadow-md'
              : 'bg-white text-ink-600 border border-paper-200 hover:border-vermilion-300'
          }`}
        >
          全部
        </button>
        {Object.entries(SYMBOL_CATEGORIES).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key as FanSymbolCategory)}
            className={`px-4 py-2 rounded-xl font-serif-sc text-sm transition-all flex items-center gap-1.5 ${
              selectedCategory === key
                ? 'bg-vermilion-500 text-white shadow-md'
                : 'bg-white text-ink-600 border border-paper-200 hover:border-vermilion-300'
            }`}
          >
            <span>{info.icon}</span>
            {info.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSymbols.map((s) => (
          <SymbolCard key={s.id} symbol={s} />
        ))}
      </div>
    </div>
  );
}

function SymbolCard({ symbol }: { symbol: FanSymbol }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-elegant overflow-hidden transition-all hover:shadow-elegant-hover">
      <button
        className="w-full p-5 text-left hover:bg-paper-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-paper-100 to-paper-200 flex items-center justify-center text-3xl shrink-0">
            {symbol.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-gold-50 text-gold-600 border border-gold-100">
                {symbol.categoryName}
              </span>
            </div>
            <h3 className="font-serif-sc text-lg font-bold text-ink-800">{symbol.name}</h3>
            <p className="text-vermilion-600 text-sm mt-1 font-medium">{symbol.meaning}</p>
          </div>
          <div className="text-ink-300">
            {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
        </div>
      </button>
      {expanded && (
        <div className="border-t border-paper-100 p-5 bg-paper-50/50 space-y-4">
          <div>
            <h4 className="font-serif-sc font-bold text-ink-700 text-sm mb-1.5 flex items-center gap-1.5">
              <Sparkles size={14} className="text-vermilion-500" />
              深层寓意
            </h4>
            <p className="text-ink-600 text-sm leading-relaxed">{symbol.deepMeaning}</p>
          </div>
          <div>
            <h4 className="font-serif-sc font-bold text-ink-700 text-sm mb-1.5 flex items-center gap-1.5">
              <Clock size={14} className="text-gold-500" />
              历史溯源
            </h4>
            <p className="text-ink-600 text-sm leading-relaxed">{symbol.historicalNote}</p>
          </div>
          <div>
            <h4 className="font-serif-sc font-bold text-ink-700 text-sm mb-2 flex items-center gap-1.5">
              <Eye size={14} className="text-bamboo-500" />
              实物举例
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {symbol.examples.map((ex, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-white rounded-lg text-xs text-ink-600 border border-paper-200"
                >
                  {ex}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EtiquetteSection() {
  return (
    <div>
      <SectionHeader
        icon={<ScrollText size={22} />}
        title="扇礼规范"
        subtitle="不学礼无以立——古人用扇的规矩与禁忌"
      />
      <p className="text-ink-500 mb-6 leading-relaxed">
        中国自古便是礼仪之邦，扇子虽小，用之有道。如何执扇、如何赠扇、如何藏扇，
        皆有成规。知晓这些礼仪，方能真正理解古人"扇虽微物，礼在其中"的深意。
      </p>
      <div className="space-y-4">
        {FAN_ETIQUETTE.map((e) => (
          <EtiquetteCard key={e.id} etiquette={e} />
        ))}
      </div>
    </div>
  );
}

function EtiquetteCard({ etiquette }: { etiquette: FanEtiquette }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-elegant overflow-hidden transition-all hover:shadow-elegant-hover">
      <button
        className="w-full p-5 flex items-center justify-between text-left hover:bg-paper-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center text-2xl">
            {etiquette.icon}
          </div>
          <div>
            <h3 className="font-serif-sc text-xl font-bold text-ink-800">{etiquette.title}</h3>
            <p className="text-sm text-ink-400 mt-0.5">{etiquette.context}</p>
          </div>
        </div>
        <div className="text-ink-300">
          {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </button>
      {expanded && (
        <div className="border-t border-paper-100 p-5 bg-paper-50/50 space-y-5">
          <div>
            <h4 className="font-serif-sc font-bold text-bamboo-700 mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} />
              礼之所宜
            </h4>
            <ul className="space-y-2">
              {etiquette.rules.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2 text-ink-600 text-sm">
                  <span className="text-bamboo-500 mt-0.5">•</span>
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-serif-sc font-bold text-vermilion-700 mb-3 flex items-center gap-2">
              <XCircle size={18} />
              礼之所忌
            </h4>
            <ul className="space-y-2">
              {etiquette.taboos.map((t, idx) => (
                <li key={idx} className="flex items-start gap-2 text-ink-600 text-sm">
                  <span className="text-vermilion-500 mt-0.5">•</span>
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl p-4 border border-paper-200">
            <h4 className="font-serif-sc font-bold text-gold-700 mb-2 flex items-center gap-2">
              <BookOpen size={16} />
              礼之来源
            </h4>
            <p className="text-ink-600 text-sm leading-relaxed">{etiquette.historicalNote}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function PuzzlesSection() {
  const [selectedPuzzle, setSelectedPuzzle] = useState<FanPuzzle | null>(null);

  if (selectedPuzzle) {
    return (
      <PuzzlePlayer
        puzzle={selectedPuzzle}
        onBack={() => setSelectedPuzzle(null)}
      />
    );
  }

  return (
    <div>
      <SectionHeader
        icon={<Brain size={22} />}
        title="扇语解谜"
        subtitle="察扇语，观人心——根据人物行为推断隐藏信息"
      />
      <p className="text-ink-500 mb-6 leading-relaxed">
        扇语是古人的"密码"。在历史故事的经典场景中，
        每个人物的持扇动作都暗藏深意。你能通过观察他们的扇语，
        推断出其真实意图和隐藏的信息吗？选择一个谜题开始挑战！
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FAN_PUZZLES.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPuzzle(p)}
            className="bg-white rounded-2xl shadow-elegant overflow-hidden text-left hover:shadow-elegant-hover transition-all hover:-translate-y-1"
          >
            <div className="p-5 bg-gradient-to-br from-ink-800 to-ink-600 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 text-7xl opacity-10">
                {p.icon}
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                      p.difficulty,
                    )}`}
                  >
                    {getDifficultyLabel(p.difficulty)}
                  </span>
                  <span className="text-3xl">{p.icon}</span>
                </div>
                <h3 className="font-serif-sc text-xl font-bold">{p.title}</h3>
                <p className="text-white/70 text-sm mt-1">{p.setting}</p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-4 mb-3 text-xs text-ink-400">
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  <span>{p.characters.length} 位人物</span>
                </div>
                <div className="flex items-center gap-1">
                  <HelpCircle size={12} />
                  <span>{p.questions.length} 道题</span>
                </div>
              </div>
              <p className="text-ink-500 text-sm leading-relaxed line-clamp-2">
                {p.historicalBackground}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-vermilion-500 text-sm font-medium">
                <Trophy size={16} />
                <span>开始解谜</span>
                <ChevronRight size={16} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PuzzlePlayer({
  puzzle,
  onBack,
}: {
  puzzle: FanPuzzle;
  onBack: () => void;
}) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState(false);

  const currentQ: PuzzleQuestion = puzzle.questions[currentQIndex];

  const correctCount = puzzle.questions.filter(
    (q) => selectedOptions[q.id] === q.correctOptionId,
  ).length;

  const handleSelect = (qid: string, optId: string) => {
    if (revealed[qid]) return;
    setSelectedOptions((prev) => ({ ...prev, [qid]: optId }));
  };

  const handleReveal = (qid: string) => {
    setRevealed((prev) => ({ ...prev, [qid]: true }));
  };

  const handleNext = () => {
    if (currentQIndex < puzzle.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQIndex(0);
    setSelectedOptions({});
    setRevealed({});
    setShowHint({});
    setCompleted(false);
  };

  if (completed) {
    const scorePercent = Math.round((correctCount / puzzle.questions.length) * 100);
    const pass = scorePercent >= 60;
    return (
      <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
        <div
          className={`p-8 text-center text-white ${
            pass
              ? 'bg-gradient-to-br from-bamboo-500 to-bamboo-400'
              : 'bg-gradient-to-br from-vermilion-500 to-vermilion-400'
          }`}
        >
          <div className="text-6xl mb-4">{pass ? '🎉' : '📚'}</div>
          <h2 className="font-serif-sc text-3xl font-bold mb-2">
            {pass ? '解谜成功！' : '再接再厉！'}
          </h2>
          <p className="text-white/80">
            你答对了 {correctCount}/{puzzle.questions.length} 题，正确率 {scorePercent}%
          </p>
        </div>
        <div className="p-6">
          {pass && (
            <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-3">
                <Trophy size={28} className="text-gold-500" />
                <div>
                  <div className="font-serif-sc font-bold text-gold-700">获得奖励</div>
                  <div className="text-gold-600 text-sm">{puzzle.reward}</div>
                </div>
              </div>
            </div>
          )}
          <h3 className="font-serif-sc font-bold text-ink-700 mb-3">答题回顾</h3>
          <div className="space-y-3 mb-6">
            {puzzle.questions.map((q, idx) => {
              const isCorrect = selectedOptions[q.id] === q.correctOptionId;
              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-xl border ${
                    isCorrect
                      ? 'bg-bamboo-50 border-bamboo-200'
                      : 'bg-vermilion-50 border-vermilion-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 size={18} className="text-bamboo-600 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle size={18} className="text-vermilion-600 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <div className="font-medium text-ink-700 text-sm">
                        {idx + 1}. {q.question}
                      </div>
                      <div className="text-xs text-ink-500 mt-1">
                        {isCorrect ? '回答正确' : '回答错误'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-1 py-3 rounded-xl border border-paper-200 text-ink-600 font-serif-sc hover:bg-paper-50 transition-colors"
            >
              返回谜题列表
            </button>
            <button
              onClick={handleRestart}
              className="flex-1 py-3 rounded-xl bg-vermilion-500 text-white font-serif-sc hover:bg-vermilion-600 transition-colors"
            >
              再次挑战
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-ink-500 hover:text-vermilion-500 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="font-serif-sc">返回谜题列表</span>
      </button>

      <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-ink-800 to-ink-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{puzzle.icon}</span>
              <div>
                <h2 className="font-serif-sc text-xl font-bold">{puzzle.title}</h2>
                <p className="text-white/70 text-sm">{puzzle.setting}</p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                puzzle.difficulty,
              )}`}
            >
              {getDifficultyLabel(puzzle.difficulty)}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            {puzzle.questions.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  idx < currentQIndex
                    ? selectedOptions[puzzle.questions[idx].id] ===
                      puzzle.questions[idx].correctOptionId
                      ? 'bg-bamboo-400'
                      : 'bg-vermilion-400'
                    : idx === currentQIndex
                    ? 'bg-white'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
          <div className="mt-2 text-right text-white/60 text-xs">
            {currentQIndex + 1} / {puzzle.questions.length}
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-serif-sc font-bold text-ink-700 mb-2 flex items-center gap-2">
              <BookOpen size={16} className="text-gold-500" />
              历史背景
            </h3>
            <p className="text-ink-600 text-sm leading-relaxed bg-paper-50 rounded-xl p-4 border border-paper-200">
              {puzzle.historicalBackground}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-serif-sc font-bold text-ink-700 mb-3 flex items-center gap-2">
              <Users size={16} className="text-vermilion-500" />
              在场人物
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {puzzle.characters.map((c) => (
                <div
                  key={c.id}
                  className="flex items-start gap-3 bg-paper-50 rounded-xl p-3 border border-paper-200"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-vermilion-100 to-gold-100 flex items-center justify-center text-2xl shrink-0">
                    {c.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="font-serif-sc font-bold text-ink-800">{c.name}</div>
                    <div className="text-xs text-vermilion-600">{c.role}</div>
                    <div className="text-xs text-ink-500 mt-1 leading-relaxed">
                      {c.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-serif-sc font-bold text-ink-700 mb-3 flex items-center gap-2">
              <Eye size={16} className="text-bamboo-500" />
              观察到的行为
            </h3>
            <div className="space-y-3">
              {puzzle.actions.map((a, idx) => {
                const char = puzzle.characters.find((c) => c.id === a.characterId);
                return (
                  <div
                    key={idx}
                    className="bg-white border-l-4 border-vermilion-300 rounded-r-xl p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-lg">{char?.avatar}</span>
                      <span className="font-serif-sc font-bold text-ink-700 text-sm">
                        {char?.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-vermilion-50 text-vermilion-600 text-xs border border-vermilion-100">
                        {a.gestureName}
                      </span>
                      <span className="text-xs text-ink-400">· {a.timing}</span>
                    </div>
                    <p className="text-ink-600 text-sm leading-relaxed">{a.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-paper-50 to-gold-50 rounded-2xl p-5 border border-gold-200">
            <h3 className="font-serif-sc font-bold text-ink-700 mb-4 flex items-center gap-2">
              <Brain size={18} className="text-gold-500" />
              第 {currentQIndex + 1} 问：{currentQ.question}
            </h3>

            {currentQ.hint && showHint[currentQ.id] && (
              <div className="mb-4 p-3 bg-bamboo-50 border border-bamboo-200 rounded-xl flex items-start gap-2">
                <Lightbulb size={16} className="text-bamboo-500 mt-0.5 shrink-0" />
                <p className="text-bamboo-700 text-sm">{currentQ.hint}</p>
              </div>
            )}

            <div className="space-y-2">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOptions[currentQ.id] === opt.id;
                const isRevealed = revealed[currentQ.id];
                const isCorrect = opt.id === currentQ.correctOptionId;

                let styles = 'bg-white border-paper-200 hover:border-vermilion-300 text-ink-700';
                if (isRevealed) {
                  if (isCorrect) {
                    styles = 'bg-bamboo-50 border-bamboo-400 text-bamboo-800';
                  } else if (isSelected) {
                    styles = 'bg-vermilion-50 border-vermilion-400 text-vermilion-800';
                  }
                } else if (isSelected) {
                  styles = 'bg-vermilion-50 border-vermilion-300 text-vermilion-700';
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isRevealed}
                    onClick={() => handleSelect(currentQ.id, opt.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${styles} ${
                      !isRevealed ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                          isRevealed && isCorrect
                            ? 'bg-bamboo-500 text-white'
                            : isRevealed && isSelected && !isCorrect
                            ? 'bg-vermilion-500 text-white'
                            : isSelected
                            ? 'bg-vermilion-500 text-white'
                            : 'bg-paper-100 text-ink-500'
                        }`}
                      >
                        {opt.id.toUpperCase()}
                      </div>
                      <span className="text-sm leading-relaxed">{opt.text}</span>
                      {isRevealed && isCorrect && (
                        <CheckCircle2 size={18} className="ml-auto text-bamboo-500" />
                      )}
                      {isRevealed && isSelected && !isCorrect && (
                        <XCircle size={18} className="ml-auto text-vermilion-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {revealed[currentQ.id] && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-paper-200">
                <h4 className="font-serif-sc font-bold text-ink-700 text-sm mb-2 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-gold-500" />
                  解析
                </h4>
                <p className="text-ink-600 text-sm leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {!revealed[currentQ.id] && currentQ.hint && !showHint[currentQ.id] && (
                <button
                  onClick={() =>
                    setShowHint((prev) => ({ ...prev, [currentQ.id]: true }))
                  }
                  className="px-4 py-2.5 rounded-xl border border-bamboo-200 text-bamboo-600 text-sm font-serif-sc hover:bg-bamboo-50 transition-colors flex items-center gap-1.5"
                >
                  <Lightbulb size={16} />
                  查看提示
                </button>
              )}

              {!revealed[currentQ.id] && selectedOptions[currentQ.id] && (
                <button
                  onClick={() => handleReveal(currentQ.id)}
                  className="px-5 py-2.5 rounded-xl bg-gold-500 text-white text-sm font-serif-sc hover:bg-gold-600 transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 size={16} />
                  确认答案
                </button>
              )}

              {revealed[currentQ.id] && (
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-vermilion-500 text-white text-sm font-serif-sc hover:bg-vermilion-600 transition-colors flex items-center gap-1.5 ml-auto"
                >
                  {currentQIndex < puzzle.questions.length - 1 ? (
                    <>
                      下一题
                      <ChevronRight size={16} />
                    </>
                  ) : (
                    <>
                      查看结果
                      <Trophy size={16} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FanLanguage() {
  const [activeTab, setActiveTab] = useState<TabType>('gestures');

  return (
    <div className="min-h-screen bg-paper-50 pt-20 md:pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-vermilion-500 via-vermilion-400 to-gold-500 rounded-2xl p-6 md:p-8 mb-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -top-10 text-9xl opacity-10">🪭</div>
          <div className="relative">
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="w-px h-4 bg-white/40" />
              <span className="text-white/80 font-serif-sc text-sm tracking-widest">
                扇语系统
              </span>
              <span className="w-px h-4 bg-white/40" />
            </div>
            <h1 className="font-serif-sc text-3xl md:text-4xl font-bold mb-3">
              一柄折扇，千般暗语
            </h1>
            <p className="text-white/80 max-w-2xl leading-relaxed">
              在没有手机的古代，扇子是人们传情达意的重要媒介。
              缓开疾合、轻摇重拍，每一个动作都蕴含深意。
              让我们穿越时空，解读古人藏在扇影中的秘密语言。
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-elegant p-2 mb-8 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-xl font-serif-sc text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-vermilion-500 text-white shadow-md'
                    : 'text-ink-600 hover:bg-paper-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'gestures' && <GesturesSection />}
        {activeTab === 'scenarios' && <ScenariosSection />}
        {activeTab === 'symbols' && <SymbolsSection />}
        {activeTab === 'etiquette' && <EtiquetteSection />}
        {activeTab === 'puzzles' && <PuzzlesSection />}
      </div>
    </div>
  );
}
