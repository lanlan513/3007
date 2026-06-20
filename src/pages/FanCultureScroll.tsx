import { useEffect, useRef, useState, useCallback } from 'react';
import { scrollSections } from '@/data/scrollData';
import { useJourneyStore, getAchievementName } from '@/store/useJourneyStore';
import type { ScrollSection, ScrollStory, FanDevelopment, DynastyId, ScrollArtwork } from '../../shared/types';
import {
  BookOpen, Scroll as ScrollIcon, User, Award, MapPin, ChevronDown, X,
  Map, BookMarked, Users, Sparkles, RotateCcw, Compass, Clock, Layers
} from 'lucide-react';

const IMAGE_URL = (prompt: string, size: string = 'landscape_16_9') =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;

export default function FanCultureScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const storyRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const fanRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const figureRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastScrollPos = useRef(0);

  const {
    setCurrentSection, unlockStory, discoverFan, unlockFigure, addDistance,
    toggleJourneyPanel, newNotification, clearNotification,
    totalDistance, records, unlockedStories, discoveredFans, unlockedFigures,
    achievements, resetJourney,
  } = useJourneyStore();

  const [activeStoryModal, setActiveStoryModal] = useState<ScrollStory | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentDynastyIndex, setCurrentDynastyIndex] = useState(0);
  const [scrolledOnce, setScrolledOnce] = useState(false);

  const TOTAL_HEIGHT = scrollSections.length * 100;

  const handleScroll = useCallback(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const scrollTop = scrollEl.scrollTop;
    const scrollHeight = scrollEl.scrollHeight - scrollEl.clientHeight;
    const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
    setScrollProgress(progress);

    const delta = Math.abs(scrollTop - lastScrollPos.current);
    if (delta > 10) {
      addDistance(Math.round(delta));
      lastScrollPos.current = scrollTop;
    }

    if (!scrolledOnce && scrollTop > 50) {
      setScrolledOnce(true);
    }

    const sectionHeights = scrollSections.map((_, i) => (i + 1) * (scrollHeight / scrollSections.length));
    const idx = sectionHeights.findIndex(h => scrollTop < h);
    setCurrentDynastyIndex(idx === -1 ? scrollSections.length - 1 : idx);
  }, [addDistance, scrolledOnce]);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollEl.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            const id = entry.target.getAttribute('data-section-id');
            const section = scrollSections.find(s => s.id === id);
            if (section) {
              setCurrentSection(
                section.id,
                section.dynasty as DynastyId,
                section.dynastyName,
                section.title,
                entry.boundingClientRect.top
              );
            }
          }
        });
      },
      { threshold: [0.2, 0.5, 0.8] }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [setCurrentSection]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            const id = entry.target.getAttribute('data-story-id');
            if (id) unlockStory(id);
          }
        });
      },
      { threshold: [0.3, 0.6] }
    );

    Object.values(storyRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [unlockStory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            const id = entry.target.getAttribute('data-fan-id');
            if (id) discoverFan(id);
          }
        });
      },
      { threshold: [0.4, 0.7] }
    );

    Object.values(fanRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [discoverFan]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            const id = entry.target.getAttribute('data-figure-id');
            if (id) unlockFigure(id);
          }
        });
      },
      { threshold: [0.3, 0.6] }
    );

    Object.values(figureRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [unlockFigure]);

  useEffect(() => {
    if (newNotification) {
      const timer = setTimeout(clearNotification, 3500);
      return () => clearTimeout(timer);
    }
  }, [newNotification, clearNotification]);

  const scrollToSection = (index: number) => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    const target = (index / scrollSections.length) * (scrollEl.scrollHeight - scrollEl.clientHeight);
    scrollEl.scrollTo({ top: target, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 top-16 md:top-20 bg-ink-900 overflow-hidden font-sans-sc">
      <TopProgressBar progress={scrollProgress} />
      <LeftDynastyNav
        sections={scrollSections}
        currentIndex={currentDynastyIndex}
        onNavigate={scrollToSection}
      />
      <JourneyFloatingButton
        totalDistance={totalDistance}
        recordCount={records.length}
        onClick={toggleJourneyPanel}
      />

      <div
        ref={scrollRef}
        className="h-full overflow-y-auto overflow-x-hidden scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        {!scrolledOnce && <ScrollHintOverlay />}
        {scrollSections.map((section, idx) => (
          <DynastySection
            key={section.id}
            section={section}
            index={idx}
            sectionRef={(el) => (sectionRefs.current[section.id] = el)}
            storyRef={(el, id) => (storyRefs.current[id] = el)}
            fanRef={(el, id) => (fanRefs.current[id] = el)}
            figureRef={(el, id) => (figureRefs.current[id] = el)}
            onStoryClick={(story) => setActiveStoryModal(story)}
            unlockedStories={unlockedStories}
            discoveredFans={discoveredFans}
            unlockedFigures={unlockedFigures}
          />
        ))}
        <EndOfScroll achievements={achievements} />
      </div>

      {activeStoryModal && (
        <StoryModal story={activeStoryModal} onClose={() => setActiveStoryModal(null)} />
      )}

      <JourneyPanel />
      <NotificationToast message={newNotification} />
    </div>
  );
}

function TopProgressBar({ progress }: { progress: number }) {
  return (
    <div className="absolute top-0 left-0 right-0 h-1 z-50 bg-paper-900/50">
      <div
        className="h-full bg-gradient-to-r from-vermilion-500 via-gold-500 to-bamboo-500 transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function LeftDynastyNav({
  sections, currentIndex, onNavigate,
}: {
  sections: ScrollSection[];
  currentIndex: number;
  onNavigate: (idx: number) => void;
}) {
  return (
    <div className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-2">
      {sections.map((section, idx) => (
        <button
          key={section.id}
          onClick={() => onNavigate(idx)}
          className={`group flex items-center gap-3 transition-all duration-300 ${
            idx === currentIndex ? 'scale-100' : 'scale-90 opacity-70 hover:opacity-100'
          }`}
        >
          <span
            className={`font-serif-sc text-xs transition-all duration-300 w-14 text-right ${
              idx === currentIndex ? 'text-gold-400 opacity-100 translate-x-0' : 'text-paper-400 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'
            }`}
          >
            {section.dynastyName}
          </span>
          <span
            className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
              idx === currentIndex
                ? 'bg-gold-400 border-gold-400 shadow-[0_0_12px_rgba(201,169,89,0.6)] scale-125'
                : idx < currentIndex
                ? 'bg-vermilion-500/60 border-vermilion-500/60'
                : 'border-paper-500/40 bg-ink-800'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function JourneyFloatingButton({
  totalDistance, recordCount, onClick,
}: {
  totalDistance: number;
  recordCount: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="fixed right-6 bottom-6 z-50 flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-vermilion-500 to-gold-500 text-white rounded-2xl shadow-elegant hover:shadow-elegant-hover hover:-translate-y-1 transition-all duration-300"
    >
      <Compass size={22} />
      <div className="text-left">
        <div className="text-xs text-white/80">文化旅程</div>
        <div className="font-serif-sc font-bold text-sm">
          {recordCount} 站 · {totalDistance >= 1000 ? `${(totalDistance / 1000).toFixed(1)}km` : `${totalDistance}m`}
        </div>
      </div>
    </button>
  );
}

function ScrollHintOverlay() {
  return (
    <div className="fixed inset-0 top-16 md:top-20 z-30 pointer-events-none flex items-center justify-center bg-gradient-to-b from-ink-900/60 via-transparent to-ink-900/40 animate-fade-in">
      <div className="text-center animate-float">
        <div className="text-gold-400 font-serif-sc text-xl md:text-2xl mb-4 tracking-widest">
          徐徐展开千年扇卷
        </div>
        <div className="text-paper-300 text-sm mb-6">向下滚动，探索扇文化的千年历程</div>
        <ChevronDown size={32} className="mx-auto text-gold-400/80 animate-bounce" />
      </div>
    </div>
  );
}

function DynastySection({
  section, index, sectionRef, storyRef, fanRef, figureRef,
  onStoryClick, unlockedStories, discoveredFans, unlockedFigures,
}: {
  section: ScrollSection;
  index: number;
  sectionRef: (el: HTMLDivElement | null) => void;
  storyRef: (el: HTMLDivElement | null, id: string) => void;
  fanRef: (el: HTMLDivElement | null, id: string) => void;
  figureRef: (el: HTMLDivElement | null, id: string) => void;
  onStoryClick: (story: ScrollStory) => void;
  unlockedStories: string[];
  discoveredFans: string[];
  unlockedFigures: string[];
}) {
  const bg = section.visualStyle;
  const isEven = index % 2 === 0;

  return (
    <section
      ref={sectionRef}
      data-section-id={section.id}
      className="relative min-h-screen w-full"
      style={{
        background: `linear-gradient(180deg, ${bg.primaryColor}0A 0%, ${bg.primaryColor}15 50%, ${bg.secondaryColor}08 100%)`,
      }}
    >
      <BgPattern type={bg.bgPattern} primaryColor={bg.primaryColor} />

      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url(${IMAGE_URL(section.imagePrompt, 'landscape_16_9')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px) saturate(1.2)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-900/70 via-ink-900/50 to-ink-900/80" />

      <div className="relative z-10 container mx-auto px-6 py-20 md:py-28 lg:py-36 max-w-6xl">
        <SectionHeader section={section} index={index} primaryColor={bg.primaryColor} />

        <div className={`mt-12 md:mt-20 grid lg:grid-cols-12 gap-8 lg:gap-12 ${
          isEven ? '' : 'lg:[direction:rtl]'
        }`}>
          <div className="lg:col-span-7 lg:[direction:ltr] space-y-8">
            <FanDevelopments
              fans={section.fanDevelopments}
              fanRef={fanRef}
              discoveredFans={discoveredFans}
              primaryColor={bg.primaryColor}
            />
            <StoryEvents
              stories={section.stories}
              storyRef={storyRef}
              onStoryClick={onStoryClick}
              unlockedStories={unlockedStories}
              primaryColor={bg.primaryColor}
            />
          </div>

          <div className="lg:col-span-5 lg:[direction:ltr] space-y-8">
            <SectionArtwork artwork={section.artworks[0]} primaryColor={bg.primaryColor} />
            {section.historicalFigures.length > 0 && (
              <RelatedFigures
                figureIds={section.historicalFigures}
                figureRef={figureRef}
                unlockedFigures={unlockedFigures}
                primaryColor={bg.primaryColor}
              />
            )}
            <SectionDecorativeCard section={section} primaryColor={bg.primaryColor} />
          </div>
        </div>
      </div>

      <DynastyDivider primaryColor={bg.primaryColor} decorativeElement={bg.decorativeElement} />
    </section>
  );
}

function SectionHeader({
  section, index, primaryColor,
}: {
  section: ScrollSection;
  index: number;
  primaryColor: string;
}) {
  return (
    <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out">
      <div className="flex items-start gap-4 md:gap-6">
        <div
          className="flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-2xl flex items-center justify-center font-serif-sc text-3xl md:text-5xl font-bold text-white shadow-elegant"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}CC 100%)`,
            boxShadow: `0 8px 32px ${primaryColor}40`,
          }}
        >
          {index + 1}
        </div>

        <div className="flex-1 pt-2">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-serif-sc font-medium"
              style={{ backgroundColor: `${primaryColor}25`, color: primaryColor }}
            >
              <MapPin size={12} />
              {section.dynastyName}
            </span>
            <span className="inline-flex items-center gap-2 text-xs text-paper-400 font-serif-sc">
              <Clock size={12} />
              {section.era}
            </span>
          </div>

          <h2 className="font-serif-sc text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
            {section.title}
          </h2>
          <p className="text-lg md:text-xl text-gold-300/90 font-serif-sc mb-4">
            {section.subtitle}
          </p>
          <p className="text-paper-300/90 leading-relaxed max-w-2xl text-sm md:text-base">
            {section.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function FanDevelopments({
  fans, fanRef, discoveredFans, primaryColor,
}: {
  fans: FanDevelopment[];
  fanRef: (el: HTMLDivElement | null, id: string) => void;
  discoveredFans: string[];
  primaryColor: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span
          className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
          style={{ backgroundColor: `${primaryColor}25` }}
        >
          🪭
        </span>
        <h3 className="font-serif-sc text-lg md:text-xl font-bold text-white">扇器演进</h3>
      </div>

      <div className="space-y-4">
        {fans.map((fan) => {
          const discovered = discoveredFans.includes(fan.id);
          return (
            <div
              key={fan.id}
              ref={(el) => fanRef(el, fan.id)}
              data-fan-id={fan.id}
              className={`group relative rounded-2xl overflow-hidden transition-all duration-700 backdrop-blur-sm border ${
                discovered
                  ? 'bg-white/10 border-white/20'
                  : 'bg-white/5 border-white/10 opacity-70'
              } hover:bg-white/15 hover:border-white/25`}
            >
              <div className="flex flex-col sm:flex-row gap-4 p-4 md:p-5">
                <div className="sm:w-28 h-28 sm:h-auto flex-shrink-0 rounded-xl overflow-hidden bg-ink-800/60">
                  <img
                    src={IMAGE_URL(fan.imagePrompt, 'square')}
                    alt={fan.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-serif-sc font-bold text-white text-base md:text-lg">
                          {fan.name}
                        </h4>
                        {discovered && (
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                            style={{ backgroundColor: `${primaryColor}30`, color: primaryColor }}
                          >
                            <Sparkles size={10} />
                            已发现
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-paper-400">{fan.typeName}</span>
                        <span className="text-paper-500">·</span>
                        <span className="text-paper-400">{fan.year}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-paper-300/90 text-sm leading-relaxed mb-2">
                    {fan.description}
                  </p>
                  <p className="text-xs text-gold-300/80 leading-relaxed italic border-l-2 pl-3"
                    style={{ borderColor: `${primaryColor}60` }}
                  >
                    {fan.significance}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StoryEvents({
  stories, storyRef, onStoryClick, unlockedStories, primaryColor,
}: {
  stories: ScrollStory[];
  storyRef: (el: HTMLDivElement | null, id: string) => void;
  onStoryClick: (story: ScrollStory) => void;
  unlockedStories: string[];
  primaryColor: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span
          className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
          style={{ backgroundColor: `${primaryColor}25` }}
        >
          📜
        </span>
        <h3 className="font-serif-sc text-lg md:text-xl font-bold text-white">故事典故</h3>
      </div>

      <div className="space-y-3">
        {stories.map((story) => {
          const unlocked = unlockedStories.includes(story.id);
          return (
            <div
              key={story.id}
              ref={(el) => storyRef(el, story.id)}
              data-story-id={story.id}
              onClick={() => unlocked && onStoryClick(story)}
              className={`relative rounded-xl p-4 transition-all duration-700 cursor-pointer group ${
                unlocked
                  ? 'bg-white/8 hover:bg-white/15 border border-white/15 hover:border-white/30'
                  : 'bg-white/3 border border-white/5 cursor-default'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    unlocked ? 'scale-100' : 'grayscale opacity-50'
                  }`}
                  style={{ backgroundColor: `${primaryColor}25` }}
                >
                  {unlocked ? <BookOpen size={18} style={{ color: primaryColor }} /> : <X size={18} className="text-paper-500" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-serif-sc font-bold text-sm md:text-base ${
                      unlocked ? 'text-white' : 'text-paper-500'
                    }`}>
                      {unlocked ? story.title : '???'}
                    </h4>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      unlocked ? 'bg-white/10 text-paper-300' : 'bg-white/5 text-paper-600'
                    }`}>
                      {story.categoryName}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${
                    unlocked ? 'text-paper-300/90' : 'text-paper-600'
                  }`}>
                    {unlocked ? story.summary : '继续探索以解锁此故事...'}
                  </p>
                </div>

                {unlocked && (
                  <div className="flex-shrink-0 text-paper-400 group-hover:text-gold-400 transition-colors">
                    <ChevronDown size={18} className="rotate-[-90deg]" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionArtwork({
  artwork, primaryColor,
}: {
  artwork: ScrollArtwork | undefined;
  primaryColor: string;
}) {
  if (!artwork) return null;
  return (
    <div className="relative rounded-2xl overflow-hidden group bg-ink-800/40 backdrop-blur-sm border border-white/10">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={IMAGE_URL(artwork.imagePrompt, 'landscape_4_3')}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
        <div className="flex items-center gap-2 text-xs text-paper-400 mb-2">
          <Layers size={12} />
          <span>{artwork.year} · {artwork.artist}</span>
        </div>
        <h4 className="font-serif-sc font-bold text-white text-base md:text-lg mb-1">
          {artwork.title}
        </h4>
        <p className="text-paper-300/80 text-xs leading-relaxed line-clamp-2">
          {artwork.description}
        </p>
      </div>
    </div>
  );
}

function RelatedFigures({
  figureIds, figureRef, unlockedFigures, primaryColor,
}: {
  figureIds: string[];
  figureRef: (el: HTMLDivElement | null, id: string) => void;
  unlockedFigures: string[];
  primaryColor: string;
}) {
  const FIGURE_INFO: Record<string, { name: string; avatar: string; bio: string }> = {
    'tangbohu': { name: '唐寅', avatar: '🎨', bio: '吴门四家之一，画扇名家' },
    'wen-zhengming': { name: '文徵明', avatar: '🖌️', bio: '明楷第一，四绝全才' },
    'shenzhou': { name: '沈周', avatar: '🏔️', bio: '吴门画派创始人' },
    'sushi': { name: '苏轼', avatar: '📚', bio: '北宋文豪，题扇救人' },
  };

  return (
    <div className="rounded-2xl p-4 md:p-5 backdrop-blur-sm bg-white/5 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <span
          className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
          style={{ backgroundColor: `${primaryColor}25` }}
        >
          👥
        </span>
        <h3 className="font-serif-sc text-lg font-bold text-white">历史人物</h3>
      </div>

      <div className="space-y-3">
        {figureIds.map((fid) => {
          const info = FIGURE_INFO[fid] || { name: fid, avatar: '🎭', bio: '继续探索以了解更多' };
          const unlocked = unlockedFigures.includes(fid);
          return (
            <div
              key={fid}
              ref={(el) => figureRef(el, fid)}
              data-figure-id={fid}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-700 ${
                unlocked ? 'bg-white/8' : 'bg-white/3 opacity-60'
              }`}
            >
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-500 ${
                  unlocked ? 'scale-100' : 'grayscale'
                }`}
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                {unlocked ? info.avatar : '❓'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif-sc font-bold text-white text-sm mb-0.5">
                  {unlocked ? info.name : '神秘人物'}
                </div>
                <div className="text-xs text-paper-400 leading-tight">
                  {unlocked ? info.bio : '继续探索以结识...'}
                </div>
              </div>
              {unlocked && (
                <User size={16} className="text-gold-400 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionDecorativeCard({
  section, primaryColor,
}: {
  section: ScrollSection;
  primaryColor: string;
}) {
  return (
    <div
      className="relative rounded-2xl p-5 md:p-6 overflow-hidden border"
      style={{
        background: `linear-gradient(135deg, ${primaryColor}1A 0%, ${primaryColor}08 100%)`,
        borderColor: `${primaryColor}30`,
      }}
    >
      <div
        className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: primaryColor }}
      />
      <div className="relative">
        <div className="text-3xl mb-3">
          {section.visualStyle.decorativeElement === 'cloud' && '☁️'}
          {section.visualStyle.decorativeElement === 'phoenix' && '🦚'}
          {section.visualStyle.decorativeElement === 'dragon' && '🐉'}
          {section.visualStyle.decorativeElement === 'plum' && '🌸'}
          {section.visualStyle.decorativeElement === 'orchid' && '🌿'}
          {section.visualStyle.decorativeElement === 'bat' && '🦋'}
          {section.visualStyle.decorativeElement === 'swastika' && '✦'}
        </div>
        <div className="font-serif-sc text-white font-bold text-base mb-2">
          {section.dynastyName}·风韵
        </div>
        <p className="text-paper-300/80 text-xs leading-relaxed">
          {section.dynastyName}时期的扇文化，
          以「{section.title}」为特征，
          {section.subtitle.toLowerCase()}，
          是中华扇文化中不可或缺的精彩篇章。
        </p>
      </div>
    </div>
  );
}

function DynastyDivider({
  primaryColor, decorativeElement,
}: {
  primaryColor: string;
  decorativeElement: string;
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden pointer-events-none">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${primaryColor}60 50%, transparent 100%)`,
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl opacity-60"
        style={{ filter: `drop-shadow(0 0 8px ${primaryColor})` }}
      >
        {decorativeElement === 'cloud' && '❖'}
        {decorativeElement === 'phoenix' && '✦'}
        {decorativeElement === 'dragon' && '❈'}
        {decorativeElement === 'plum' && '✿'}
        {decorativeElement === 'orchid' && '❀'}
        {decorativeElement === 'bat' && '❂'}
        {decorativeElement === 'swastika' && '✧'}
      </div>
    </div>
  );
}

function BgPattern({
  type, primaryColor,
}: {
  type: string;
  primaryColor: string;
}) {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.07]"
      style={{
        backgroundImage: getPatternSVG(type, primaryColor),
        backgroundSize: type === 'ink' ? '80px 80px' : type === 'brocade' ? '60px 60px' : '100px 100px',
      }}
    />
  );
}

function getPatternSVG(type: string, color: string): string {
  const hex = color.replace('#', '');
  const svgPatterns: Record<string, string> = {
    bronze: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10 L90 50 L50 90 L10 50 Z' fill='none' stroke='%23${hex}' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='15' fill='none' stroke='%23${hex}' stroke-width='0.8'/%3E%3C/svg%3E")`,
    silk: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q25 30 50 50 T100 50' fill='none' stroke='%23${hex}' stroke-width='0.6'/%3E%3Cpath d='M0 70 Q25 50 50 70 T100 70' fill='none' stroke='%23${hex}' stroke-width='0.6'/%3E%3Cpath d='M0 30 Q25 10 50 30 T100 30' fill='none' stroke='%23${hex}' stroke-width='0.6'/%3E%3C/svg%3E")`,
    peony: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='8' fill='none' stroke='%23${hex}' stroke-width='0.8'/%3E%3Ccircle cx='50' cy='50' r='18' fill='none' stroke='%23${hex}' stroke-width='0.6' stroke-dasharray='4 3'/%3E%3Ccircle cx='50' cy='50' r='28' fill='none' stroke='%23${hex}' stroke-width='0.5' stroke-dasharray='2 5'/%3E%3C/svg%3E")`,
    bamboo: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='30' y1='0' x2='30' y2='100' stroke='%23${hex}' stroke-width='1.5'/%3E%3Cline x1='70' y1='0' x2='70' y2='100' stroke='%23${hex}' stroke-width='1.5'/%3E%3Cline x1='25' y1='20' x2='35' y2='20' stroke='%23${hex}' stroke-width='1'/%3E%3Cline x1='25' y1='55' x2='35' y2='55' stroke='%23${hex}' stroke-width='1'/%3E%3Cline x1='25' y1='85' x2='35' y2='85' stroke='%23${hex}' stroke-width='1'/%3E%3Cline x1='65' y1='35' x2='75' y2='35' stroke='%23${hex}' stroke-width='1'/%3E%3Cline x1='65' y1='70' x2='75' y2='70' stroke='%23${hex}' stroke-width='1'/%3E%3C/svg%3E")`,
    ink: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 Q40 5 70 10 Q75 40 70 70 Q40 75 10 70 Q5 40 10 10 Z' fill='none' stroke='%23${hex}' stroke-width='0.7'/%3E%3Ccircle cx='40' cy='40' r='3' fill='%23${hex}'/%3E%3C/svg%3E")`,
    brocade: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' fill='none' stroke='%23${hex}' stroke-width='0.6'/%3E%3Cpath d='M30 15 L45 30 L30 45 L15 30 Z' fill='none' stroke='%23${hex}' stroke-width='0.5'/%3E%3Crect x='28' y='28' width='4' height='4' fill='%23${hex}'/%3E%3C/svg%3E")`,
    newspaper: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='10' y1='20' x2='90' y2='20' stroke='%23${hex}' stroke-width='0.6'/%3E%3Cline x1='10' y1='28' x2='60' y2='28' stroke='%23${hex}' stroke-width='0.4'/%3E%3Cline x1='10' y1='36' x2='90' y2='36' stroke='%23${hex}' stroke-width='0.4'/%3E%3Cline x1='10' y1='44' x2='75' y2='44' stroke='%23${hex}' stroke-width='0.4'/%3E%3Cline x1='10' y1='60' x2='90' y2='60' stroke='%23${hex}' stroke-width='0.6'/%3E%3Cline x1='10' y1='68' x2='50' y2='68' stroke='%23${hex}' stroke-width='0.4'/%3E%3Cline x1='10' y1='76' x2='90' y2='76' stroke='%23${hex}' stroke-width='0.4'/%3E%3C/svg%3E")`,
  };
  return svgPatterns[type] || svgPatterns.bronze;
}

function StoryModal({
  story, onClose,
}: {
  story: ScrollStory;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl bg-gradient-to-br from-paper-50 to-paper-100 shadow-2xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 md:h-64 overflow-hidden">
          <img
            src={IMAGE_URL(story.imagePrompt || '', 'landscape_16_9')}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-paper-50 via-paper-50/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-ink-600 hover:bg-white hover:text-vermilion-500 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-vermilion-500 text-white mb-3">
              <BookOpen size={12} />
              {story.categoryName}
            </span>
            <h3 className="font-serif-sc text-2xl md:text-3xl font-bold text-ink-800">
              {story.title}
            </h3>
          </div>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto max-h-[40vh]">
          <div className="mb-5 p-4 rounded-xl bg-gold-50 border border-gold-200/60">
            <div className="flex items-start gap-2">
              <Sparkles size={16} className="text-gold-500 flex-shrink-0 mt-0.5" />
              <p className="text-ink-600 font-serif-sc text-sm leading-relaxed italic">
                {story.summary}
              </p>
            </div>
          </div>

          <div className="text-ink-700 leading-loose text-sm md:text-base space-y-4 font-serif-sc">
            {story.fullContent.split('\n\n').map((para, i) => (
              <p key={i} className="indent-8">
                {para}
              </p>
            ))}
          </div>
        </div>

        <div className="border-t border-paper-200 p-4 md:p-6 flex items-center justify-between bg-paper-50/80">
          <div className="text-xs text-ink-400 font-serif-sc">
            故事典故 · 扇文化之旅
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-ink-800 text-white text-sm font-serif-sc hover:bg-ink-700 transition-colors"
          >
            继续探索
          </button>
        </div>
      </div>
    </div>
  );
}

function JourneyPanel() {
  const {
    journeyPanelOpen, setJourneyPanelOpen,
    totalDistance, records, unlockedStories, discoveredFans, unlockedFigures,
    achievements, resetJourney,
  } = useJourneyStore();

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform transition-transform duration-500 ease-out ${
        journeyPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {journeyPanelOpen && (
        <div
          className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm -translate-x-full"
          onClick={() => setJourneyPanelOpen(false)}
        />
      )}

      <div className="relative h-full bg-gradient-to-b from-paper-50 to-paper-100 shadow-2xl flex flex-col">
        <div className="p-6 border-b border-paper-200 bg-gradient-to-r from-vermilion-500/10 to-gold-500/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Compass size={20} className="text-vermilion-500" />
                <h2 className="font-serif-sc text-xl font-bold text-ink-800">
                  我的文化旅程
                </h2>
              </div>
              <p className="text-xs text-ink-400 font-serif-sc">
                记录你探索扇文化的每一步
              </p>
            </div>
            <button
              onClick={() => setJourneyPanelOpen(false)}
              className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-ink-500 hover:text-vermilion-500 hover:shadow-md transition-all"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MiniStat
              icon={<Map size={14} />}
              label="探索距离"
              value={totalDistance >= 1000 ? `${(totalDistance / 1000).toFixed(1)} km` : `${totalDistance} m`}
              color="vermilion"
            />
            <MiniStat
              icon={<MapPin size={14} />}
              label="到达站点"
              value={`${records.length} / ${scrollSections.length}`}
              color="gold"
            />
            <MiniStat
              icon={<BookMarked size={14} />}
              label="解锁故事"
              value={`${unlockedStories.length}`}
              color="bamboo"
            />
            <MiniStat
              icon={<Users size={14} />}
              label="结识人物"
              value={`${unlockedFigures.length}`}
              color="ink"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {achievements.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Award size={16} className="text-gold-500" />
                <h3 className="font-serif-sc font-bold text-ink-700 text-sm">获得成就</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {achievements.map((aid) => {
                  const name = getAchievementName(aid) || aid;
                  return (
                    <div
                      key={aid}
                      className="p-3 rounded-xl bg-gradient-to-br from-gold-50 to-vermilion-50 border border-gold-200/60"
                    >
                      <div className="text-lg mb-1">🏆</div>
                      <div className="text-xs font-serif-sc font-bold text-ink-700">{name}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-vermilion-500" />
              <h3 className="font-serif-sc font-bold text-ink-700 text-sm">
                发现珍品 ({discoveredFans.length})
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {discoveredFans.length === 0 ? (
                <p className="text-xs text-ink-400 font-serif-sc p-2">开始探索以发现扇中珍品...</p>
              ) : (
                discoveredFans.map((fid) => (
                  <span
                    key={fid}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-vermilion-50 text-vermilion-700 text-xs font-serif-sc border border-vermilion-200/60"
                  >
                    🪭 {getFanShortName(fid)}
                  </span>
                ))
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={16} className="text-bamboo-600" />
              <h3 className="font-serif-sc font-bold text-ink-700 text-sm">
                解锁故事 ({unlockedStories.length})
              </h3>
            </div>
            <div className="space-y-2">
              {unlockedStories.length === 0 ? (
                <p className="text-xs text-ink-400 font-serif-sc p-2">滚动探索以解锁更多故事...</p>
              ) : (
                unlockedStories.map((sid) => (
                  <div
                    key={sid}
                    className="p-3 rounded-xl bg-white border border-paper-200 flex items-center gap-3"
                  >
                    <span className="text-xl">📜</span>
                    <span className="text-xs font-serif-sc font-medium text-ink-700">
                      {getStoryShortName(sid)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {records.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-gold-500" />
                <h3 className="font-serif-sc font-bold text-ink-700 text-sm">
                  旅程足迹
                </h3>
              </div>
              <div className="relative pl-6 space-y-4">
                <div className="absolute left-2.5 top-2 bottom-2 w-px bg-paper-300" />
                {records.slice().reverse().map((record, idx) => (
                  <div key={record.id} className="relative">
                    <div
                      className={`absolute -left-[18px] top-1.5 w-3 h-3 rounded-full border-2 ${
                        idx === 0 ? 'bg-gold-400 border-gold-500' : 'bg-white border-paper-400'
                      }`}
                    />
                    <div className="p-3 rounded-xl bg-white border border-paper-200">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-1.5 py-0.5 rounded bg-gold-100 text-gold-700 font-serif-sc">
                          {record.dynastyName}
                        </span>
                        <span className="text-[10px] text-ink-400">
                          {new Date(record.visitedAt).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      <div className="font-serif-sc font-bold text-ink-700 text-sm mb-1">
                        {record.title}
                      </div>
                      <div className="flex flex-wrap gap-1 text-[10px]">
                        {record.storiesUnlocked.length > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-bamboo-50 text-bamboo-600">
                            📜 {record.storiesUnlocked.length}
                          </span>
                        )}
                        {record.figuresUnlocked.length > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-gold-50 text-gold-600">
                            👥 {record.figuresUnlocked.length}
                          </span>
                        )}
                        {record.fansDiscovered.length > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-vermilion-50 text-vermilion-600">
                            🪭 {record.fansDiscovered.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="p-4 border-t border-paper-200">
          <button
            onClick={resetJourney}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs text-ink-400 hover:text-vermilion-500 hover:bg-vermilion-50 transition-colors"
          >
            <RotateCcw size={14} />
            重置旅程
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  icon, label, value, color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'vermilion' | 'gold' | 'bamboo' | 'ink';
}) {
  const colors = {
    vermilion: 'bg-vermilion-50 text-vermilion-600 border-vermilion-200/60',
    gold: 'bg-gold-50 text-gold-600 border-gold-200/60',
    bamboo: 'bg-bamboo-50 text-bamboo-600 border-bamboo-200/60',
    ink: 'bg-ink-50 text-ink-600 border-ink-200/60',
  };

  return (
    <div className={`p-3 rounded-xl border ${colors[color]}`}>
      <div className="flex items-center gap-1.5 mb-1 opacity-80">
        {icon}
        <span className="text-[10px] font-serif-sc">{label}</span>
      </div>
      <div className="font-bold font-serif-sc text-lg">{value}</div>
    </div>
  );
}

function NotificationToast({ message }: { message: string | null }) {
  return (
    <div
      className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        message ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-vermilion-500 to-gold-500 text-white text-sm font-serif-sc shadow-elegant flex items-center gap-2">
        <Sparkles size={16} />
        {message}
      </div>
    </div>
  );
}

function EndOfScroll({ achievements }: { achievements: string[] }) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/5 to-vermilion-500/10" />
      <div className="relative text-center px-6 max-w-2xl">
        <div className="text-6xl mb-6">🎋</div>
        <h2 className="font-serif-sc text-3xl md:text-4xl font-bold text-white mb-4">
          千年扇卷 · 至此览毕
        </h2>
        <p className="text-paper-300 leading-relaxed mb-8 text-sm md:text-base">
          从先秦的礼仪之器，到唐宋的文人风雅，
          再到明清的工艺臻绝，扇子承载了中华儿女数千年的情思与智慧。
          愿你在这次旅程中，有所感，有所得。
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="text-xs text-paper-400 font-serif-sc mb-1">获得成就</div>
            <div className="font-serif-sc font-bold text-white text-xl">
              {achievements.length} 项
            </div>
          </div>
          <div className="text-paper-500 font-serif-sc text-2xl">·</div>
          <div className="text-paper-300 text-sm font-serif-sc italic">
            旅程虽尽，风雅长存
          </div>
        </div>
      </div>
    </section>
  );
}

const FAN_SHORT_NAMES: Record<string, string> = {
  'dev-1': '五明扇', 'dev-2': '羽翣', 'dev-3': '素纨团扇',
  'dev-4': '合欢扇', 'dev-5': '宫绢团扇', 'dev-6': '孔雀羽扇',
  'dev-7': '高丽扇', 'dev-8': '山水团扇', 'dev-9': '乌骨泥金折扇',
  'dev-10': '竹骨纸面折扇', 'dev-11': '檀香木雕折扇',
  'dev-12': '象牙丝编织团扇', 'dev-13': '缂丝花鸟团扇',
  'dev-14': '名家书画折扇', 'dev-15': '广告折扇',
};

const STORY_SHORT_NAMES: Record<string, string> = {
  'story-1': '舜制五明扇', 'story-2': '班婕妤咏团扇',
  'story-3': '杨贵妃持扇避暑', 'story-4': '鉴真携扇东渡',
  'story-5': '苏轼题扇救人', 'story-6': '宋徽宗题扇',
  'story-7': '唐伯虎画扇', 'story-8': '文徵明四绝入扇',
  'story-9': '乾隆御题折扇', 'story-10': '曹雪芹与折扇',
  'story-11': '齐白石画虾扇', 'story-12': '张大千画荷扇',
};

function getFanShortName(id: string): string {
  return FAN_SHORT_NAMES[id] || id;
}

function getStoryShortName(id: string): string {
  return STORY_SHORT_NAMES[id] || id;
}
