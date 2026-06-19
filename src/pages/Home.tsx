import { useEffect, useRef, useState } from 'react';
import { useFanStore } from '@/store/useFanStore';
import Hero from '@/components/Hero';
import CategoryFilter from '@/components/CategoryFilter';
import FanCard from '@/components/FanCard';
import AdvancedFilter from '@/components/AdvancedFilter';
import { Loader2, Search, X, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';

export default function Home() {
  const {
    fans,
    loading,
    error,
    loadFans,
    loadCategories,
    loadFilterOptions,
    selectedCategory,
    searchKeyword,
    selectedDynasty,
    selectedMaterial,
    selectedUsage,
    setSearchKeyword,
    setSelectedCategory,
    resetFilters,
  } = useFanStore();
  const [localSearch, setLocalSearch] = useState(searchKeyword);
  const [filterSticky, setFilterSticky] = useState(false);
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);
  const fansSectionRef = useRef<HTMLElement>(null);
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCategories();
    loadFilterOptions();
    loadFans();
  }, []);

  useEffect(() => {
    setLocalSearch(searchKeyword);
  }, [searchKeyword]);

  useEffect(() => {
    const handleScroll = () => {
      if (filterContainerRef.current && fansSectionRef.current) {
        const sectionTop = fansSectionRef.current.offsetTop + 100;
        const scrollY = window.scrollY;
        setFilterSticky(scrollY >= sectionTop);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToResults = () => {
    if (fansSectionRef.current) {
      const offsetTop = fansSectionRef.current.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchKeyword(localSearch.trim());
    scrollToResults();
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    setSearchKeyword('');
    searchInputRef.current?.focus();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    scrollToResults();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedDynasty) count++;
    if (selectedMaterial) count++;
    if (selectedUsage) count++;
    if (searchKeyword) count++;
    return count;
  };

  const hasAnyFilter = () => {
    return selectedCategory !== 'all' || selectedDynasty || selectedMaterial || selectedUsage || searchKeyword;
  };

  const getResultSummary = () => {
    const parts: string[] = [];

    if (searchKeyword) {
      parts.push(`"${searchKeyword}"`);
    }

    const categoryLabel = selectedCategory === 'all' ? '' :
      selectedCategory === 'round' ? '团扇' :
      selectedCategory === 'folding' ? '折扇' : '羽扇';

    if (categoryLabel) parts.push(categoryLabel);

    if (selectedDynasty) {
      const map: Record<string, string> = {
        shang: '商代', zhou: '周代', han: '汉代', sanguo: '三国',
        jin: '魏晋', tang: '唐代', song: '宋代', ming: '明代',
        qing: '清代', minguo: '民国',
      };
      parts.push(map[selectedDynasty] || selectedDynasty);
    }
    if (selectedMaterial) {
      const map: Record<string, string> = {
        silk: '丝绸', paper: '宣纸', bamboo: '竹', jade: '玉石',
        sandalwood: '檀香木', ivory: '象牙', kesi: '缂丝', gold: '金箔',
        feather: '羽毛', lacquer: '漆器', embroidery: '刺绣',
      };
      parts.push(map[selectedMaterial] || selectedMaterial);
    }
    if (selectedUsage) {
      const map: Record<string, string> = {
        cooling: '纳凉', ceremony: '礼仪', art: '书画', collection: '收藏',
        performance: '戏曲', dance: '舞蹈', gift: '馈赠', wedding: '婚礼',
        military: '军事', religion: '宗教',
      };
      parts.push(map[selectedUsage] || selectedUsage);
    }

    const resultText = parts.length > 0
      ? `${parts.join(' · ')} · 找到 ${fans.length} 把扇子`
      : `共 ${fans.length} 把扇子`;

    return resultText;
  };

  return (
    <div className="min-h-screen bg-paper-50">
      <Hero onSearch={scrollToResults} />

      <section ref={fansSectionRef} id="fans-section" className="relative pt-16 pb-20 md:pt-20 md:pb-28">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-12 h-px bg-gold-400" />
              <span className="text-gold-500 font-serif-sc text-sm tracking-widest">珍品鉴赏</span>
              <span className="w-12 h-px bg-gold-400" />
            </div>
            <h2 className="font-serif-sc text-3xl md:text-5xl font-bold text-ink-800 mb-4">
              扇中乾坤
            </h2>
            <p className="text-ink-500 max-w-xl mx-auto">
              从团扇的端庄典雅，到折扇的开合自如，再到羽扇的飘逸出尘，
              每一种扇子都有其独特的韵味与故事。
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="mb-8 max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-vermilion-500 to-gold-500 rounded-2xl opacity-20 group-focus-within:opacity-40 blur transition-opacity duration-500" />

              <div className="relative flex items-center bg-white rounded-2xl shadow-elegant overflow-hidden transition-all duration-300 focus-within:shadow-gold-glow ring-1 ring-paper-200">
                <div className="pl-5 text-ink-400">
                  <Search size={20} />
                </div>

                <input
                  ref={searchInputRef}
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="搜索扇子名称、类型、标签..."
                  className="flex-1 px-4 py-3.5 bg-transparent text-ink-800 placeholder-ink-300 font-sans-sc text-base outline-none"
                />

                {localSearch && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-2 mr-2 text-ink-400 hover:text-ink-600 transition-colors"
                    aria-label="清除"
                  >
                    <X size={18} />
                  </button>
                )}

                <button
                  type="submit"
                  className="h-full px-6 py-3.5 bg-vermilion-500 text-white font-serif-sc hover:bg-vermilion-600 active:bg-vermilion-700 transition-colors"
                >
                  搜索
                </button>
              </div>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-ink-500">
              <Filter size={16} />
              <span>{getResultSummary()}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setAdvancedFilterOpen(!advancedFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300 border ${
                  advancedFilterOpen || getActiveFilterCount() > 0
                    ? 'bg-vermilion-500 text-white border-vermilion-500 shadow-md'
                    : 'bg-white text-ink-600 border-paper-200 hover:border-vermilion-300 hover:text-vermilion-600'
                }`}
              >
                <SlidersHorizontal size={16} />
                <span>高级筛选</span>
                {getActiveFilterCount() > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    advancedFilterOpen ? 'bg-white/20 text-white' : 'bg-vermilion-100 text-vermilion-600'
                  }`}>
                    {getActiveFilterCount()}
                  </span>
                )}
                <ChevronDown size={14} className={`transition-transform duration-300 ${advancedFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {hasAnyFilter() && (
                <button
                  onClick={() => {
                    resetFilters();
                    setLocalSearch('');
                  }}
                  className="flex items-center gap-1 text-sm text-vermilion-500 hover:text-vermilion-600 transition-colors px-3 py-2"
                >
                  <X size={14} />
                  重置筛选
                </button>
              )}
            </div>
          </div>

          {advancedFilterOpen && (
            <div className="mb-6 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
              <AdvancedFilter />
            </div>
          )}
        </div>

        <div ref={filterContainerRef} className="relative z-20">
          <div
            className={`transition-all duration-300 ${
              filterSticky
                ? 'fixed top-16 md:top-20 left-0 right-0 bg-paper-50/95 backdrop-blur-md shadow-elegant border-b border-paper-200 py-4'
                : 'py-2'
            }`}
          >
            <div className="container mx-auto px-6">
              <CategoryFilter onChange={handleCategoryChange} />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 mt-8">
          {loading && (
            <div className="flex justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-10 h-10 text-vermilion-500 animate-spin mx-auto mb-3" />
                <p className="text-ink-400 text-sm">加载中...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-vermilion-500">{error}</p>
            </div>
          )}

          {!loading && !error && fans.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-ink-500 font-serif-sc text-lg mb-2">未找到相关扇子</p>
              <p className="text-ink-400 text-sm mb-6">
                {searchKeyword ? `没有找到与 "${searchKeyword}" 相关的扇子` : '该分类暂无扇子'}
              </p>
              <button
                onClick={() => {
                  resetFilters();
                  setLocalSearch('');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-vermilion-500 text-white rounded-xl hover:bg-vermilion-600 transition-colors text-sm"
              >
                查看全部扇子
              </button>
            </div>
          )}

          {!loading && !error && fans.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {fans.map((fan, index) => (
                <FanCard key={fan.id} fan={fan} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-paper-100 to-paper-200">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <FeatureCard
              icon="🏛️"
              title="历史悠久"
              description="扇子在中国已有数千年历史，从商周时期的仪仗用扇，到唐宋明清的艺术珍品，见证了中华文明的发展。"
            />
            <FeatureCard
              icon="🎨"
              title="工艺精湛"
              description="缂丝、刺绣、雕刻、书画... 扇子融合了多种传统工艺，每一件都是匠人心血的结晶，艺术价值极高。"
            />
            <FeatureCard
              icon="📜"
              title="文化深厚"
              description="扇子不仅是纳凉工具，更是文化载体。文人题诗作画，佳人执扇掩面，承载了东方人的审美与情思。"
            />
          </div>
        </div>
      </section>

      <footer className="py-12 bg-ink-800 text-paper-200">
        <div className="container mx-auto px-6 text-center">
          <div className="text-3xl font-serif-sc font-bold text-gold-400 mb-2">
            扇韵东方
          </div>
          <p className="text-paper-400 text-sm mb-6">
            传承千年风雅 · 品味东方美学
          </p>
          <div className="border-t border-ink-700 pt-6">
            <p className="text-ink-400 text-sm">
              © 2024 扇韵东方 · 弘扬中华传统文化
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-1">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-serif-sc text-xl font-bold text-ink-800 mb-3">{title}</h3>
      <p className="text-ink-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
