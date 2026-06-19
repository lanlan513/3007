import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchFanDetail } from '@/services/fanApi';
import type { Fan } from '@/types/fan';
import FanCard from '@/components/FanCard';
import { ArrowLeft, Calendar, MapPin, Tag, BookOpen, Hammer, Heart } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function FanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fan, setFan] = useState<Fan | null>(null);
  const [relatedFans, setRelatedFans] = useState<Fan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchFanDetail(id);
        setFan(data.fan);
        setRelatedFans(data.relatedFans);
        window.scrollTo(0, 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-vermilion-500 animate-spin mx-auto mb-4" />
          <p className="text-ink-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !fan) {
    return (
      <div className="min-h-screen bg-paper-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-vermilion-500 text-lg mb-4">{error || '扇子未找到'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-vermilion-500 text-white rounded-xl hover:bg-vermilion-600 transition-colors"
          >
            <ArrowLeft size={18} />
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-50">
      <div className="sticky top-0 z-40 bg-paper-100/80 backdrop-blur-md border-b border-paper-200">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-ink-600 hover:text-vermilion-500 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-serif-sc">返回</span>
          </button>
        </div>
      </div>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-vermilion-500/10 to-gold-400/10 rounded-3xl blur-2xl opacity-60" />

                <div className="relative overflow-hidden rounded-2xl shadow-elegant-hover bg-white">
                  {!imageLoaded && (
                    <div className="aspect-[4/5] bg-paper-200 animate-pulse" />
                  )}
                  <img
                    src={fan.image}
                    alt={fan.name}
                    className={`w-full aspect-[4/5] object-cover transition-all duration-700 ${
                      imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                  />

                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-vermilion-500/90 backdrop-blur-sm text-white font-serif-sc rounded-full">
                      {fan.categoryName}
                    </span>
                  </div>

                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                      isLiked
                        ? 'bg-vermilion-500 text-white'
                        : 'bg-white/80 text-ink-400 hover:text-vermilion-500 hover:bg-white'
                    }`}
                  >
                    <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            </div>

            <div
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
            >
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-100 text-gold-600 rounded-full text-sm mb-4">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                  <span>{fan.dynasty} · {fan.origin}</span>
                </div>

                <h1 className="font-serif-sc text-4xl md:text-5xl font-bold text-ink-800 mb-4">
                  {fan.name}
                </h1>

                <p className="text-lg text-ink-500 leading-relaxed mb-6">
                  {fan.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {fan.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-paper-100 text-ink-600 text-sm rounded-full border border-paper-300"
                    >
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InfoCard icon={<Calendar size={18} />} label="起源年代" value={fan.dynasty} />
                  <InfoCard icon={<MapPin size={18} />} label="产地" value={fan.origin} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <DetailSection
              icon={<BookOpen size={24} />}
              title="历史背景"
              content={fan.history}
              delay={0.1}
            />

            <DetailSection
              icon={<Hammer size={24} />}
              title="材质工艺"
              content={fan.material}
              delay={0.2}
            />

            <DetailSection
              icon={<Heart size={24} />}
              title="文化用途"
              content={fan.usage}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {relatedFans.length > 0 && (
        <section className="py-16 md:py-24 bg-paper-100">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-gold-400" />
                <span className="text-gold-500 font-serif-sc text-sm tracking-widest">更多精彩</span>
                <span className="w-8 h-px bg-gold-400" />
              </div>
              <h2 className="font-serif-sc text-3xl md:text-4xl font-bold text-ink-800">
                相关推荐
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              {relatedFans.map((relatedFan, index) => (
                <FanCard key={relatedFan.id} fan={relatedFan} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-gradient-to-r from-vermilion-500 to-vermilion-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-serif-sc text-3xl md:text-4xl font-bold text-white mb-4">
            感受千年扇韵之美
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            探索更多传统扇子，了解背后的文化故事与匠心工艺
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-vermilion-600 font-serif-sc font-medium rounded-xl hover:bg-paper-100 transition-colors shadow-lg"
          >
            浏览全部扇子
            <ArrowLeft size={18} className="rotate-180" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-paper-50 rounded-xl border border-paper-200">
      <div className="p-2 bg-vermilion-100 text-vermilion-500 rounded-lg">
        {icon}
      </div>
      <div>
        <div className="text-xs text-ink-400 mb-0.5">{label}</div>
        <div className="font-medium text-ink-700">{value}</div>
      </div>
    </div>
  );
}

function DetailSection({
  icon,
  title,
  content,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  delay?: number;
}) {
  return (
    <div
      className="mb-12 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-vermilion-50 text-vermilion-500 rounded-xl">
          {icon}
        </div>
        <div>
          <h3 className="font-serif-sc text-2xl font-bold text-ink-800">{title}</h3>
          <div className="h-0.5 w-12 bg-gradient-to-r from-vermilion-500 to-gold-400 mt-2 rounded-full" />
        </div>
      </div>

      <div className="pl-0 md:pl-16">
        <p className="text-ink-600 leading-loose text-base md:text-lg whitespace-pre-line">
          {content}
        </p>
      </div>
    </div>
  );
}
