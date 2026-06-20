import SearchBar from './SearchBar';
import { getCurrentSolarTerm, getNextSolarTerm, getDaysUntilNextTerm, SEASON_INFO, SOLAR_TERMS } from '@/data/solarTermsData';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Fan, BookOpen, Calendar } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface HeroProps {
  onSearch?: () => void;
}

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
  opacity: number;
}

function getSeasonPattern(season: string, count: number): { icon: string; size: number; x: number; y: number; delay: number; duration: number }[] {
  const patterns: Record<string, string[]> = {
    spring: ['🌸', '🌺', '🌷', '🍃', '🦋', '🌼', '💮', '🌿'],
    summer: ['☀️', '🌻', '🦗', '🌴', '🍉', '🌸', '🦋', '🌿'],
    autumn: ['🍂', '🍁', '🌰', '🍃', '🦅', '🌾', '🍇', '🥀'],
    winter: ['❄️', '⛄', '🌨️', '❄️', '🍂', '🧊', '🌬️', '❄️'],
  };
  
  const icons = patterns[season] || patterns.spring;
  const result = [];
  
  for (let i = 0; i < count; i++) {
    result.push({
      icon: icons[i % icons.length],
      size: 16 + Math.random() * 24,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 6,
    });
  }
  
  return result;
}

export default function Hero({ onSearch }: HeroProps) {
  const currentTerm = getCurrentSolarTerm();
  const nextTerm = getNextSolarTerm();
  const daysUntil = getDaysUntilNextTerm();
  const seasonInfo = SEASON_INFO[currentTerm.season];
  
  const currentIndex = SOLAR_TERMS.findIndex(t => t.id === currentTerm.id);
  const prevTerm = SOLAR_TERMS[(currentIndex - 1 + SOLAR_TERMS.length) % SOLAR_TERMS.length];
  
  const floatingParticles = useMemo(
    () => getSeasonPattern(currentTerm.season, 20),
    [currentTerm.season]
  );
  
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const progressRatio = useMemo(() => {
    const termDay = currentTerm.day;
    const nextTermDay = nextTerm.day;
    const nextMonth = nextTerm.month;
    const now = new Date();
    const currentDay = now.getDate();
    
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    
    let totalDays: number;
    let passedDays: number;
    
    if (currentTerm.month === nextMonth) {
      totalDays = nextTermDay - termDay;
      passedDays = currentDay - termDay;
    } else {
      totalDays = (daysInMonth - termDay) + nextTermDay;
      passedDays = currentDay >= termDay 
        ? currentDay - termDay 
        : (daysInMonth - termDay) + currentDay;
    }
    
    return Math.min(1, Math.max(0, passedDays / totalDays));
  }, [currentTerm, nextTerm]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 transition-all duration-1000"
          style={{
            background: `linear-gradient(180deg, ${currentTerm.colorLight} 0%, #fdfcf9 50%, ${currentTerm.colorLight}80 100%)`,
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />

        <div
          className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl opacity-60 animate-pulse"
          style={{ 
            backgroundColor: `${currentTerm.color}30`,
            animationDuration: '4s',
          }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-40 animate-pulse"
          style={{ 
            backgroundColor: `${currentTerm.colorDark}25`,
            animationDuration: '6s',
            animationDelay: '1s',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: `${currentTerm.color}20` }}
        />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingParticles.map((particle, i) => (
            <div
              key={i}
              className="absolute select-none opacity-20 animate-float"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                fontSize: `${particle.size}px`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
                transform: `translateY(${scrollY * 0.5 * (i % 2 === 0 ? 1 : -1)}px)`,
              }}
            >
              {particle.icon}
            </div>
          ))}
        </div>

        <div
          className="absolute top-1/4 left-1/4 text-[200px] font-serif-sc select-none pointer-events-none opacity-[0.04]"
          style={{ 
            color: currentTerm.colorDark,
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        >
          {currentTerm.name.charAt(0)}
        </div>
        <div
          className="absolute bottom-1/4 right-1/4 text-[150px] font-serif-sc select-none pointer-events-none rotate-12 opacity-[0.06]"
          style={{ 
            color: currentTerm.color,
            transform: `translateY(${scrollY * -0.15}px) rotate(12deg)`,
          }}
        >
          {currentTerm.icon}
        </div>

        <svg className="absolute bottom-0 left-0 w-full h-32 opacity-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z"
            fill={currentTerm.colorLight}
            opacity="0.5"
          />
          <path
            d="M0,80 C150,40 350,100 550,60 C750,20 950,100 1200,40 L1200,120 L0,120 Z"
            fill={currentTerm.color}
            opacity="0.3"
          />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="opacity-0 animate-fade-in-down" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm"
            style={{
              backgroundColor: `${currentTerm.color}18`,
              border: `1px solid ${currentTerm.color}30`,
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentTerm.colorDark }} />
            <span className="font-serif-sc text-sm" style={{ color: currentTerm.colorDark }}>
              {currentTerm.icon} {currentTerm.name} · {currentTerm.month}月{currentTerm.day}日
            </span>
            <Sparkles size={12} style={{ color: currentTerm.color }} />
          </div>
        </div>

        <div className="opacity-0 animate-fade-in-down" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <Link
            to="/solar-terms"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors border border-white/60 text-sm group"
          >
            <span style={{ color: currentTerm.colorDark }} className="font-serif-sc">
              距{nextTerm.name}还有 {daysUntil} 天
            </span>
            <div className="w-20 h-1.5 bg-white/40 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000"
                style={{ 
                  width: `${progressRatio * 100}%`,
                  backgroundColor: currentTerm.color,
                }}
              />
            </div>
            <ArrowRight size={14} style={{ color: currentTerm.colorDark }} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <h1
          className="opacity-0 animate-fade-in-up font-serif-sc text-5xl md:text-7xl lg:text-8xl font-bold text-ink-800 mb-6 leading-tight"
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          扇韵东方
          <span
            className="block text-3xl md:text-4xl lg:text-5xl mt-2 font-normal"
            style={{ color: currentTerm.colorDark }}
          >
            {currentTerm.description.split('。')[0]}
          </span>
        </h1>

        <p
          className="opacity-0 animate-fade-in-up text-lg md:text-xl text-ink-500 max-w-2xl mx-auto mb-8 leading-relaxed"
          style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
        >
          以二十四节气为经，以扇文化为纬。
          <br className="hidden md:block" />
          探索团扇、折扇、羽扇的千年风雅，感受四季流转中的东方美学。
        </p>

        <div
          className="opacity-0 animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}
        >
          <Link
            to="/solar-terms"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-serif-sc text-sm text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 group"
            style={{ backgroundColor: currentTerm.colorDark }}
          >
            <Calendar size={16} />
            节气扇历
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            to="/yearbook"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-serif-sc text-sm border-2 hover:shadow-md transition-all group"
            style={{
              borderColor: currentTerm.color,
              color: currentTerm.colorDark,
              backgroundColor: `${currentTerm.color}10`,
            }}
          >
            <BookOpen size={16} />
            文化年鉴
            <Sparkles size={14} className="group-hover:scale-110 transition-transform" />
          </Link>
        </div>

        <div
          className="opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
        >
          <SearchBar variant="hero" onSearch={onSearch} />
        </div>

        <div
          className="opacity-0 animate-fade-in-up mt-16 flex justify-center gap-8 md:gap-16"
          style={{ animationDelay: '1s', animationFillMode: 'forwards' }}
        >
          <StatItem number="24" label="节气" icon="📅" color={currentTerm.colorDark} />
          <StatItem number="3" label="扇系" icon="🪭" color={currentTerm.colorDark} />
          <StatItem number="千年" label="传承" icon="📜" color={currentTerm.colorDark} />
        </div>

        <div
          className="opacity-0 animate-fade-in-up mt-12 flex flex-wrap justify-center gap-3 max-w-2xl mx-auto"
          style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}
        >
          {currentTerm.keywords.map((kw, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-sm font-serif-sc backdrop-blur-sm"
              style={{
                backgroundColor: `${currentTerm.color}15`,
                color: currentTerm.colorDark,
                border: `1px solid ${currentTerm.color}25`,
              }}
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 rounded-full flex justify-center pt-2" style={{ borderColor: `${currentTerm.colorDark}40` }}>
          <div className="w-1.5 h-3 rounded-full animate-pulse" style={{ backgroundColor: `${currentTerm.colorDark}60` }} />
        </div>
      </div>

      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4">
        <div 
          className="text-center p-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 cursor-pointer hover:bg-white/60 transition-colors group"
          title={`上一节气: ${prevTerm.name}`}
        >
          <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{prevTerm.icon}</div>
          <div className="text-xs font-serif-sc text-ink-600">{prevTerm.name}</div>
        </div>
      </div>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4">
        <div 
          className="text-center p-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 cursor-pointer hover:bg-white/60 transition-colors group"
          title={`下一节气: ${nextTerm.name}`}
        >
          <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{nextTerm.icon}</div>
          <div className="text-xs font-serif-sc text-ink-600">{nextTerm.name}</div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ number, label, icon, color }: { number: string; label: string; icon: string; color: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-serif-sc text-3xl md:text-4xl font-bold mb-1" style={{ color }}>
        {number}
      </div>
      <div className="text-ink-500 text-sm">{label}</div>
    </div>
  );
}
