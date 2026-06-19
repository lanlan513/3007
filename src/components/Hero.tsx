import SearchBar from './SearchBar';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-paper-100">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-paper-200 via-paper-100 to-paper-50" />

        <div className="absolute top-20 left-10 w-64 h-64 bg-vermilion-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-bamboo-200/20 rounded-full blur-3xl" />

        <div className="absolute top-1/4 left-1/4 text-[200px] font-serif-sc text-vermilion-500/5 select-none pointer-events-none">
          扇
        </div>
        <div className="absolute bottom-1/4 right-1/4 text-[150px] font-serif-sc text-gold-400/10 select-none pointer-events-none rotate-12">
          韵
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="opacity-0 animate-fade-in-down" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-vermilion-500/10 rounded-full mb-8">
            <span className="w-2 h-2 bg-vermilion-500 rounded-full animate-pulse" />
            <span className="text-vermilion-600 font-serif-sc text-sm">传承千年 · 扇韵流芳</span>
          </div>
        </div>

        <h1
          className="opacity-0 animate-fade-in-up font-serif-sc text-5xl md:text-7xl lg:text-8xl font-bold text-ink-800 mb-6 leading-tight"
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          扇韵东方
          <span className="block text-3xl md:text-4xl lg:text-5xl text-vermilion-500 mt-2 font-normal">
            千年风雅 · 一握清风
          </span>
        </h1>

        <p
          className="opacity-0 animate-fade-in-up text-lg md:text-xl text-ink-500 max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
        >
          探索团扇、折扇、羽扇的千年文化，感受东方美学的独特魅力。
          从宫廷御用到文人雅物，每一把扇子都承载着历史的厚重与艺术的精妙。
        </p>

        <div
          className="opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
        >
          <SearchBar variant="hero" />
        </div>

        <div
          className="opacity-0 animate-fade-in-up mt-16 flex justify-center gap-8 md:gap-16"
          style={{ animationDelay: '1s', animationFillMode: 'forwards' }}
        >
          <StatItem number="9+" label="珍品扇子" />
          <StatItem number="3" label="扇系分类" />
          <StatItem number="千年" label="文化传承" />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-ink-300 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-ink-400 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-serif-sc text-3xl md:text-4xl font-bold text-vermilion-500 mb-1">
        {number}
      </div>
      <div className="text-ink-500 text-sm">{label}</div>
    </div>
  );
}
