import { useEffect } from 'react';
import { useFanStore } from '@/store/useFanStore';
import Hero from '@/components/Hero';
import CategoryFilter from '@/components/CategoryFilter';
import FanCard from '@/components/FanCard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { fans, loading, error, loadFans, loadCategories, selectedCategory } = useFanStore();

  useEffect(() => {
    loadCategories();
    loadFans();
  }, []);

  const scrollToSection = (category: string) => {
    const section = document.getElementById('fans-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-paper-50">
      <Hero />

      <section id="fans-section" className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
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

          <div className="mb-12">
            <CategoryFilter />
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-vermilion-500 animate-spin" />
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
              <p className="text-ink-500 font-serif-sc text-lg">未找到相关扇子</p>
              <p className="text-ink-400 text-sm mt-2">试试其他关键词或分类吧</p>
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
