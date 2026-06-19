import type { TimelineEvent } from '@/types/fan';
import { Clock, Sparkles } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  if (!events || events.length === 0) return null;

  return (
    <div className="relative">
      <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-vermilion-300 via-gold-400 to-vermilion-300" />

      <div className="space-y-8 md:space-y-10">
        {events.map((event, index) => (
          <TimelineItem key={index} event={event} index={index} isLast={index === events.length - 1} />
        ))}
      </div>
    </div>
  );
}

interface TimelineItemProps {
  event: TimelineEvent;
  index: number;
  isLast: boolean;
}

function TimelineItem({ event, index, isLast }: TimelineItemProps) {
  const isEven = index % 2 === 0;

  return (
    <div
      className="relative opacity-0 animate-fade-in-up"
      style={{
        animationDelay: `${0.1 + index * 0.1}s`,
        animationFillMode: 'forwards',
      }}
    >
      <div className="flex items-start gap-4 md:gap-8">
        <div className="relative z-10 shrink-0">
          <div
            className={`w-8 h-8 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
              isEven
                ? 'bg-gradient-to-br from-vermilion-500 to-vermilion-600'
                : 'bg-gradient-to-br from-gold-400 to-gold-500'
            }`}
          >
            {isLast ? (
              <Sparkles className="w-4 h-4 md:w-7 md:h-7 text-white" />
            ) : (
              <Clock className="w-4 h-4 md:w-7 md:h-7 text-white" />
            )}
          </div>

          <div className="absolute inset-0 rounded-full bg-vermilion-400/30 animate-ping opacity-60" style={{ animationDuration: '3s' }} />
        </div>

        <div className="flex-1 min-w-0 pb-2">
          <div className="bg-white rounded-2xl shadow-elegant border border-paper-100 overflow-hidden hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-0.5">
            <div
              className={`px-4 md:px-6 py-3 md:py-4 flex flex-wrap items-center gap-2 md:gap-3 ${
                isEven
                  ? 'bg-gradient-to-r from-vermilion-50 to-gold-50'
                  : 'bg-gradient-to-r from-gold-50 to-vermilion-50'
              }`}
            >
              <span
                className={`px-3 py-1 rounded-full text-sm md:text-base font-serif-sc font-bold ${
                  isEven
                    ? 'bg-vermilion-500 text-white'
                    : 'bg-gold-500 text-white'
                }`}
              >
                {event.period}
              </span>
              <span className="text-xs md:text-sm text-ink-500 font-sans-sc flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {event.year}
              </span>
            </div>

            <div className="px-4 md:px-6 py-4 md:py-5">
              <h4 className="font-serif-sc text-lg md:text-xl font-bold text-ink-800 mb-2 md:mb-3 flex items-center gap-2">
                {event.title}
              </h4>

              <p className="text-ink-600 leading-relaxed text-sm md:text-base mb-3">
                {event.description}
              </p>

              {event.significance && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-paper-50 border border-paper-200">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-gold-500 shrink-0 mt-0.5" />
                  <p className="text-xs md:text-sm text-ink-500 leading-relaxed">
                    <span className="font-medium text-gold-600">历史意义：</span>
                    {event.significance}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
