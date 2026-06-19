import { Link } from 'react-router-dom';
import type { Fan } from '@/types/fan';

interface FanCardProps {
  fan: Fan;
  index?: number;
}

export default function FanCard({ fan, index = 0 }: FanCardProps) {
  const animationDelay = `${index * 0.1}s`;

  return (
    <Link
      to={`/fan/${fan.id}`}
      className="group block opacity-0 animate-fade-in-up"
      style={{ animationDelay }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-elegant transition-all duration-500 group-hover:shadow-elegant-hover group-hover:-translate-y-2">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={fan.image}
            alt={fan.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1 bg-vermilion-500/90 backdrop-blur-sm text-white text-sm font-serif-sc rounded-full">
              {fan.categoryName}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <p className="text-white/90 text-sm line-clamp-2">{fan.description}</p>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-serif-sc text-xl font-bold text-ink-800 group-hover:text-vermilion-500 transition-colors mb-2">
            {fan.name}
          </h3>

          <div className="flex items-center gap-2 text-sm text-ink-500 mb-3">
            <span className="flex items-center gap-1">
              <span className="text-gold-500">◆</span>
              {fan.dynasty}
            </span>
            <span className="text-paper-400">|</span>
            <span>{fan.origin}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {fan.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-paper-100 text-ink-500 text-xs rounded-full border border-paper-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
