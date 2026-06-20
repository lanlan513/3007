import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';
import type { HistoricalFigure } from '@/types/fan';

interface FigureNetworkProps {
  figures: HistoricalFigure[];
  centerFigureId?: string;
  width?: number;
  height?: number;
}

interface NodePosition {
  x: number;
  y: number;
}

const RELATION_COLORS: Record<string, string> = {
  teacher: '#7D9B6A',
  student: '#7D9B6A',
  friend: '#C9A959',
  colleague: '#C8102E',
  family: '#d4788a',
  rival: '#6b7280',
  influencer: '#8b5cf6',
};

function calculatePositions(
  centerFigure: HistoricalFigure | undefined,
  relatedFigures: HistoricalFigure[],
  width: number,
  height: number,
): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>();
  const centerX = width / 2;
  const centerY = height / 2;

  if (centerFigure) {
    positions.set(centerFigure.id, { x: centerX, y: centerY });

    const radius = Math.min(width, height) * 0.3;
    const angleStep = (2 * Math.PI) / Math.max(relatedFigures.length, 1);

    relatedFigures.forEach((figure, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions.set(figure.id, { x, y });
    });
  } else {
    const cols = Math.ceil(Math.sqrt(figures.length));
    const rows = Math.ceil(figures.length / cols);
    const cellW = width / (cols + 1);
    const cellH = height / (rows + 1);

    figures.forEach((figure, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = cellW * (col + 1);
      const y = cellH * (row + 1);
      positions.set(figure.id, { x, y });
    });
  }

  return positions;
}

export default function FigureNetwork({
  figures,
  centerFigureId,
  width = 700,
  height = 450,
}: FigureNetworkProps) {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const centerFigure = useMemo(
    () => figures.find(f => f.id === centerFigureId),
    [figures, centerFigureId],
  );

  const displayFigures = useMemo(() => {
    if (centerFigure) {
      const relatedIds = new Set(centerFigure.relations.map(r => r.targetFigureId));
      relatedIds.add(centerFigure.id);
      return figures.filter(f => relatedIds.has(f.id));
    }
    return figures;
  }, [figures, centerFigure]);

  const positions = useMemo(
    () => calculatePositions(centerFigure, displayFigures.filter(f => f.id !== centerFigureId), width, height),
    [centerFigure, displayFigures, centerFigureId, width, height],
  );

  const linesData = useMemo(() => {
    const lines: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color: string;
      label: string;
      weight: number;
    }[] = [];

    if (centerFigure) {
      const centerPos = positions.get(centerFigure.id);
      if (!centerPos) return lines;

      centerFigure.relations.forEach(relation => {
        const targetPos = positions.get(relation.targetFigureId);
        if (targetPos) {
          lines.push({
            x1: centerPos.x,
            y1: centerPos.y,
            x2: targetPos.x,
            y2: targetPos.y,
            color: RELATION_COLORS[relation.type] || '#9ca3af',
            label: relation.typeName,
            weight: relation.weight,
          });
        }
      });
    } else {
      const processed = new Set<string>();
      figures.forEach(figure => {
        figure.relations.forEach(relation => {
          const key = [figure.id, relation.targetFigureId].sort().join('-');
          if (processed.has(key)) return;
          processed.add(key);

          const pos1 = positions.get(figure.id);
          const pos2 = positions.get(relation.targetFigureId);
          if (pos1 && pos2) {
            lines.push({
              x1: pos1.x,
              y1: pos1.y,
              x2: pos2.x,
              y2: pos2.y,
              color: RELATION_COLORS[relation.type] || '#9ca3af',
              label: relation.typeName,
              weight: relation.weight,
            });
          }
        });
      });
    }

    return lines;
  }, [centerFigure, figures, positions]);

  const handleNodeClick = (figureId: string) => {
    navigate(`/figure/${figureId}`);
  };

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    figure: HistoricalFigure;
  } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (tooltip && svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setTooltip(prev =>
          prev
            ? {
                ...prev,
                x: e.clientX - rect.left + 12,
                y: e.clientY - rect.top + 12,
              }
            : prev,
        );
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [tooltip]);

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ aspectRatio: `${width}/${height}` }}
      >
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(200, 16, 46, 0.15)" />
            <stop offset="100%" stopColor="rgba(200, 16, 46, 0)" />
          </radialGradient>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
          </filter>
        </defs>

        <rect x="0" y="0" width={width} height={height} fill="url(#paperBg)" rx="16" />

        {linesData.map((line, i) => {
          const isHighlighted =
            hoveredId &&
            (positions.get(hoveredId)?.x === line.x1 && positions.get(hoveredId)?.y === line.y1) ||
            (positions.get(hoveredId)?.x === line.x2 && positions.get(hoveredId)?.y === line.y2);

          return (
            <g key={i}>
              <line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={line.color}
                strokeWidth={isHighlighted ? 3 : 1.5 + line.weight}
                strokeOpacity={isHighlighted ? 0.9 : hoveredId ? 0.2 : 0.5}
                strokeDasharray={line.weight < 0.7 ? '6 4' : undefined}
                className="transition-all duration-300"
              />
              <text
                x={(line.x1 + line.x2) / 2}
                y={(line.y1 + line.y2) / 2 - 6}
                textAnchor="middle"
                fontSize="11"
                fill={line.color}
                opacity={isHighlighted ? 1 : hoveredId ? 0.3 : 0.7}
                className="font-serif-sc transition-opacity duration-300"
              >
                {line.label}
              </text>
            </g>
          );
        })}

        {displayFigures.map(figure => {
          const pos = positions.get(figure.id);
          if (!pos) return null;
          const isCenter = figure.id === centerFigureId;
          const isHovered = hoveredId === figure.id;
          const nodeRadius = isCenter ? 36 : 28;
          const isLocked = figure.status === 'locked';

          return (
            <g
              key={figure.id}
              transform={`translate(${pos.x}, ${pos.y})`}
              className="cursor-pointer"
              onClick={() => handleNodeClick(figure.id)}
              onMouseEnter={() => {
                setHoveredId(figure.id);
                setTooltip({ x: pos.x, y: pos.y, figure });
              }}
              onMouseLeave={() => {
                setHoveredId(null);
                setTooltip(null);
              }}
            >
              {isCenter && (
                <circle r={nodeRadius + 20} fill="url(#centerGlow)" className="animate-pulse" />
              )}

              <circle
                r={nodeRadius}
                fill={isLocked ? '#f5f0e8' : 'white'}
                stroke={isCenter ? '#C8102E' : isHovered ? '#7D9B6A' : '#e5e1d8'}
                strokeWidth={isCenter ? 3 : isHovered ? 2.5 : 1.5}
                filter="url(#shadow)"
                className="transition-all duration-300"
                style={{
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  transformOrigin: 'center',
                }}
              />

              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isCenter ? 32 : 24}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {isLocked ? '❓' : figure.avatar}
              </text>

              <text
                y={nodeRadius + 16}
                textAnchor="middle"
                fontSize="12"
                fill={isLocked ? '#9ca3af' : '#1a1a1a'}
                fontWeight={isCenter ? 700 : 500}
                className="font-serif-sc"
                style={{ pointerEvents: 'none' }}
              >
                {isLocked ? '???' : figure.name}
              </text>

              <text
                y={nodeRadius + 30}
                textAnchor="middle"
                fontSize="9"
                fill="#9ca3af"
                className="font-serif-sc"
                style={{ pointerEvents: 'none' }}
              >
                {figure.dynasty}
              </text>
            </g>
          );
        })}
      </svg>

      {tooltip && (
        <div
          className="absolute bg-white rounded-xl shadow-elegant p-3 border border-paper-200 pointer-events-none z-10 min-w-[180px]"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{tooltip.figure.avatar}</span>
            <div>
              <div className="font-serif-sc font-bold text-ink-800">{tooltip.figure.name}</div>
              {tooltip.figure.courtesyName && (
                <div className="text-xs text-ink-400">字 {tooltip.figure.courtesyName}</div>
              )}
            </div>
          </div>
          <div className="text-xs text-ink-500 mb-2">{tooltip.figure.title}</div>
          <div className="flex flex-wrap gap-1">
            {tooltip.figure.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-paper-100 text-ink-500 text-[10px] rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs text-ink-400 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2">
        <Info size={14} />
        <span>点击人物节点查看详情</span>
        <div className="flex items-center gap-2 ml-2 border-l border-paper-200 pl-2">
          {Object.entries(RELATION_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[10px]">
                {type === 'teacher' || type === 'student'
                  ? '师徒'
                  : type === 'friend'
                  ? '挚友'
                  : type === 'colleague'
                  ? '君臣同僚'
                  : type === 'family'
                  ? '亲属'
                  : type === 'rival'
                  ? '对手'
                  : '影响者'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
