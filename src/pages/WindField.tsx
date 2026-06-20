import { useState, useRef, useEffect, useCallback } from 'react';
import { Wind, Settings2, Gauge, Target, Heart, RotateCcw, Play, Pause, Thermometer, Waves, BarChart3 } from 'lucide-react';

interface WindParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
}

interface FlowLine {
  points: { x: number; y: number; age: number }[];
  life: number;
  maxLife: number;
}

interface VortexParticle {
  x: number;
  y: number;
  angle: number;
  radius: number;
  angularSpeed: number;
  life: number;
  maxLife: number;
  size: number;
}

type FanType = 'round' | 'folding' | 'feather';

interface FanConfig {
  type: FanType;
  ribCount: number;
  surfaceSize: number;
  openAngle: number;
  swingSpeed: number;
}

interface WindMetrics {
  windForce: number;
  coverage: number;
  comfort: number;
  efficiency: number;
}

interface WindHistoryPoint {
  time: number;
  force: number;
  comfort: number;
}

const FAN_PRESETS: Record<FanType, { name: string; icon: string; defaultRibs: number; minRibs: number; maxRibs: number; defaultOpenAngle: number; desc: string; color: string }> = {
  round: { name: '团扇', icon: '🪭', defaultRibs: 0, minRibs: 0, maxRibs: 0, defaultOpenAngle: 160, desc: '圆形扇面，风力均匀柔和，覆盖范围宽', color: 'vermilion' },
  folding: { name: '折扇', icon: '🪭', defaultRibs: 18, minRibs: 9, maxRibs: 40, defaultOpenAngle: 120, desc: '折扇开合，风力集中强劲，扇骨导流', color: 'gold' },
  feather: { name: '羽扇', icon: '🪶', defaultRibs: 0, minRibs: 0, maxRibs: 0, defaultOpenAngle: 100, desc: '羽毛轻盈，风力温润细腻，舒适度最高', color: 'bamboo' },
};

const DEFAULT_SURFACE_SIZE = 50;
const DEFAULT_SWING_SPEED = 1.0;

const DEFAULT_CONFIGS: Record<FanType, FanConfig> = {
  round: {
    type: 'round',
    ribCount: FAN_PRESETS.round.defaultRibs,
    surfaceSize: DEFAULT_SURFACE_SIZE,
    openAngle: FAN_PRESETS.round.defaultOpenAngle,
    swingSpeed: DEFAULT_SWING_SPEED,
  },
  folding: {
    type: 'folding',
    ribCount: FAN_PRESETS.folding.defaultRibs,
    surfaceSize: DEFAULT_SURFACE_SIZE,
    openAngle: FAN_PRESETS.folding.defaultOpenAngle,
    swingSpeed: DEFAULT_SWING_SPEED,
  },
  feather: {
    type: 'feather',
    ribCount: FAN_PRESETS.feather.defaultRibs,
    surfaceSize: DEFAULT_SURFACE_SIZE,
    openAngle: FAN_PRESETS.feather.defaultOpenAngle,
    swingSpeed: DEFAULT_SWING_SPEED,
  },
};

function calculateMetrics(config: FanConfig): WindMetrics {
  const angleRad = (config.openAngle / 180) * Math.PI;
  let windForce: number;
  let coverage: number;
  let comfort: number;

  switch (config.type) {
    case 'round':
      windForce = config.surfaceSize * 0.08 * (1 + config.swingSpeed * 0.3);
      coverage = config.surfaceSize * 0.6 * Math.sqrt(angleRad);
      comfort = Math.max(0, 100 - windForce * 0.8 + config.surfaceSize * 0.15);
      break;
    case 'folding': {
      const ribFactor = 1 + (config.ribCount - 9) * 0.02;
      windForce = config.surfaceSize * 0.1 * ribFactor * (1 + config.swingSpeed * 0.4) * angleRad;
      coverage = config.surfaceSize * 0.5 * angleRad * (1 + config.ribCount * 0.01);
      comfort = Math.max(0, 100 - windForce * 0.6 + coverage * 0.1);
      break;
    }
    case 'feather':
      windForce = config.surfaceSize * 0.06 * (1 + config.swingSpeed * 0.25);
      coverage = config.surfaceSize * 0.45 * angleRad;
      comfort = Math.max(0, 100 - windForce * 0.4 + config.surfaceSize * 0.25);
      break;
    default:
      windForce = 0;
      coverage = 0;
      comfort = 50;
  }

  windForce = Math.min(100, Math.max(0, windForce));
  coverage = Math.min(100, Math.max(0, coverage));
  comfort = Math.min(100, Math.max(0, comfort));

  const efficiency = coverage > 0 ? (comfort * windForce) / (coverage * 2) : 0;

  return {
    windForce: Math.round(windForce * 10) / 10,
    coverage: Math.round(coverage * 10) / 10,
    comfort: Math.round(comfort * 10) / 10,
    efficiency: Math.min(100, Math.round(efficiency * 10) / 10),
  };
}

function normalizeAngle(angle: number): number {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

function drawBackgroundGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.strokeStyle = 'rgba(212, 196, 168, 0.12)';
  ctx.lineWidth = 0.5;
  const gridSize = 40;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

function drawPressureField(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  config: FanConfig,
  metrics: WindMetrics,
) {
  const fanCenterX = w * 0.35;
  const fanCenterY = h * 0.65;
  const fanRadius = Math.min(w, h) * 0.28 * (config.surfaceSize / 50);
  const swingAngle = Math.sin(time * config.swingSpeed * 2) * 0.4;
  const angleRad = (config.openAngle / 180) * Math.PI;
  const forceIntensity = metrics.windForce / 100;

  const dirAngle = -Math.PI / 2 + swingAngle;

  let coneHalf: number;
  if (config.type === 'round') {
    coneHalf = Math.PI * 0.45;
  } else if (config.type === 'folding') {
    coneHalf = angleRad / 2;
  } else {
    coneHalf = Math.PI * 0.3;
  }

  const maxDist = fanRadius * 4;
  const steps = 12;

  for (let i = steps; i >= 1; i--) {
    const ratio = i / steps;
    const dist = fanRadius * 0.8 + (maxDist - fanRadius * 0.8) * ratio;
    const alpha = (1 - ratio) * 0.06 * forceIntensity;

    ctx.save();
    ctx.translate(fanCenterX, fanCenterY);
    ctx.rotate(dirAngle);

    const grad = ctx.createRadialGradient(0, -dist * 0.4, 0, 0, -dist * 0.4, dist * 0.8);
    if (config.type === 'round') {
      grad.addColorStop(0, `rgba(200, 16, 46, ${alpha})`);
      grad.addColorStop(1, `rgba(200, 16, 46, 0)`);
    } else if (config.type === 'folding') {
      grad.addColorStop(0, `rgba(201, 169, 89, ${alpha})`);
      grad.addColorStop(1, `rgba(201, 169, 89, 0)`);
    } else {
      grad.addColorStop(0, `rgba(125, 155, 106, ${alpha})`);
      grad.addColorStop(1, `rgba(125, 155, 106, 0)`);
    }

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, dist, -Math.PI / 2 - coneHalf * ratio, -Math.PI / 2 + coneHalf * ratio);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.restore();
  }

  const swingForce = Math.cos(time * config.swingSpeed * 2);
  const activeAlpha = Math.abs(swingForce) * 0.03 * forceIntensity;

  if (activeAlpha > 0.005) {
    ctx.save();
    ctx.translate(fanCenterX, fanCenterY);
    ctx.rotate(dirAngle);

    const activeGrad = ctx.createRadialGradient(0, -maxDist * 0.3, 0, 0, -maxDist * 0.3, maxDist * 0.5);
    activeGrad.addColorStop(0, `rgba(255, 255, 255, ${activeAlpha * 2})`);
    activeGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, maxDist * 0.6, -Math.PI / 2 - coneHalf, -Math.PI / 2 + coneHalf);
    ctx.closePath();
    ctx.fillStyle = activeGrad;
    ctx.fill();

    ctx.restore();
  }
}

function drawCoverageArcs(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  config: FanConfig,
  _metrics: WindMetrics,
) {
  const fanCenterX = w * 0.35;
  const fanCenterY = h * 0.65;
  const fanRadius = Math.min(w, h) * 0.28 * (config.surfaceSize / 50);
  const swingAngle = Math.sin(time * config.swingSpeed * 2) * 0.4;
  const angleRad = (config.openAngle / 180) * Math.PI;

  const dirAngle = -Math.PI / 2 + swingAngle;

  let coneHalf: number;
  if (config.type === 'round') {
    coneHalf = Math.PI * 0.45;
  } else if (config.type === 'folding') {
    coneHalf = angleRad / 2;
  } else {
    coneHalf = Math.PI * 0.3;
  }

  const arcs = [
    { dist: fanRadius * 1.5, label: '强', color: 'rgba(200, 16, 46, 0.3)' },
    { dist: fanRadius * 2.5, label: '中', color: 'rgba(201, 169, 89, 0.25)' },
    { dist: fanRadius * 3.5, label: '弱', color: 'rgba(125, 155, 106, 0.2)' },
  ];

  ctx.save();
  ctx.translate(fanCenterX, fanCenterY);
  ctx.rotate(dirAngle);

  arcs.forEach(arc => {
    ctx.beginPath();
    ctx.arc(0, 0, arc.dist, -Math.PI / 2 - coneHalf, -Math.PI / 2 + coneHalf);
    ctx.strokeStyle = arc.color;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.save();
    ctx.translate(0, 0);
    const labelAngle = -Math.PI / 2 + coneHalf + 0.05;
    const labelX = Math.cos(labelAngle) * (arc.dist + 8);
    const labelY = Math.sin(labelAngle) * (arc.dist + 8);
    ctx.rotate(-dirAngle);
    ctx.font = '9px sans-serif';
    ctx.fillStyle = arc.color;
    ctx.fillText(arc.label, fanCenterX + labelX - fanCenterX, fanCenterY + labelY - fanCenterY);
    ctx.restore();
  });

  ctx.restore();
}

function drawFan(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  config: FanConfig,
) {
  const fanCenterX = w * 0.35;
  const fanCenterY = h * 0.65;
  const fanRadius = Math.min(w, h) * 0.28 * (config.surfaceSize / 50);
  const swingAngle = Math.sin(time * config.swingSpeed * 2) * 0.4;
  const angleRad = (config.openAngle / 180) * Math.PI;
  const swingVelocity = Math.cos(time * config.swingSpeed * 2) * config.swingSpeed * 2;

  ctx.save();
  ctx.translate(fanCenterX, fanCenterY);

  const motionBlurAlpha = Math.min(0.15, Math.abs(swingVelocity) * 0.04);
  if (motionBlurAlpha > 0.02) {
    ctx.save();
    ctx.rotate(swingAngle - swingVelocity * 0.03);
    ctx.globalAlpha = motionBlurAlpha;
    drawFanShape(ctx, fanRadius, config, angleRad);
    ctx.restore();

    ctx.save();
    ctx.rotate(swingAngle + swingVelocity * 0.03);
    ctx.globalAlpha = motionBlurAlpha * 0.5;
    drawFanShape(ctx, fanRadius, config, angleRad);
    ctx.restore();
  }

  ctx.rotate(swingAngle);
  ctx.globalAlpha = 1;
  drawFanShape(ctx, fanRadius, config, angleRad);

  ctx.restore();
}

function drawFanShape(
  ctx: CanvasRenderingContext2D,
  fanRadius: number,
  config: FanConfig,
  angleRad: number,
) {
  if (config.type === 'round') {
    const gradient = ctx.createRadialGradient(0, -fanRadius * 0.5, 0, 0, -fanRadius * 0.5, fanRadius * 0.8);
    gradient.addColorStop(0, 'rgba(200, 16, 46, 0.15)');
    gradient.addColorStop(0.4, 'rgba(201, 169, 89, 0.1)');
    gradient.addColorStop(0.8, 'rgba(125, 155, 106, 0.05)');
    gradient.addColorStop(1, 'rgba(200, 16, 46, 0.02)');

    ctx.beginPath();
    ctx.arc(0, -fanRadius * 0.5, fanRadius * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.shadowColor = 'rgba(200, 16, 46, 0.15)';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(0, -fanRadius * 0.5, fanRadius * 0.78, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(200, 16, 46, 0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -fanRadius * 0.5, fanRadius * 0.6, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(200, 16, 46, 0.1)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 / 6) * i;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * fanRadius * 0.1, -fanRadius * 0.5 + Math.sin(a) * fanRadius * 0.1);
      ctx.lineTo(Math.cos(a) * fanRadius * 0.75, -fanRadius * 0.5 + Math.sin(a) * fanRadius * 0.75);
      ctx.strokeStyle = 'rgba(200, 16, 46, 0.06)';
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -fanRadius * 0.5);
    ctx.strokeStyle = 'rgba(26, 26, 26, 0.5)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200, 16, 46, 0.7)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fill();
  } else if (config.type === 'folding') {
    const startAngle = -Math.PI / 2 - angleRad / 2;
    const endAngle = -Math.PI / 2 + angleRad / 2;

    const surfaceGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, fanRadius);
    surfaceGradient.addColorStop(0, 'rgba(200, 16, 46, 0.18)');
    surfaceGradient.addColorStop(0.3, 'rgba(201, 169, 89, 0.12)');
    surfaceGradient.addColorStop(0.7, 'rgba(201, 169, 89, 0.06)');
    surfaceGradient.addColorStop(1, 'rgba(201, 169, 89, 0.02)');

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, fanRadius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = surfaceGradient;
    ctx.shadowColor = 'rgba(201, 169, 89, 0.15)';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, fanRadius, startAngle, endAngle);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(200, 16, 46, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const ribCount = config.ribCount;
    for (let i = 0; i <= ribCount; i++) {
      const angle = startAngle + (angleRad / ribCount) * i;
      const isEdge = i === 0 || i === ribCount;
      const isMain = i % Math.max(1, Math.floor(ribCount / 6)) === 0;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * fanRadius, Math.sin(angle) * fanRadius);

      if (isEdge) {
        ctx.strokeStyle = 'rgba(26, 26, 26, 0.6)';
        ctx.lineWidth = 3;
      } else if (isMain) {
        ctx.strokeStyle = 'rgba(26, 26, 26, 0.3)';
        ctx.lineWidth = 1.5;
      } else {
        ctx.strokeStyle = 'rgba(26, 26, 26, 0.12)';
        ctx.lineWidth = 0.8;
      }
      ctx.stroke();

      if (isEdge || isMain) {
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * fanRadius * 0.7, Math.sin(angle) * fanRadius * 0.7);
        ctx.lineTo(Math.cos(angle) * fanRadius, Math.sin(angle) * fanRadius);
        ctx.strokeStyle = 'rgba(26, 26, 26, 0.08)';
        ctx.lineWidth = fanRadius * 0.06;
        ctx.stroke();
      }
    }

    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200, 16, 46, 0.7)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();

    const handleLen = fanRadius * 0.45;
    const handleGrad = ctx.createLinearGradient(0, 0, 0, handleLen);
    handleGrad.addColorStop(0, 'rgba(107, 91, 66, 0.7)');
    handleGrad.addColorStop(0.5, 'rgba(138, 112, 78, 0.6)');
    handleGrad.addColorStop(1, 'rgba(107, 91, 66, 0.5)');

    ctx.beginPath();
    ctx.moveTo(-2.5, 2);
    ctx.lineTo(-1.5, handleLen);
    ctx.lineTo(1.5, handleLen);
    ctx.lineTo(2.5, 2);
    ctx.closePath();
    ctx.fillStyle = handleGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(26, 26, 26, 0.3)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, handleLen, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200, 16, 46, 0.4)';
    ctx.fill();
  } else if (config.type === 'feather') {
    ctx.beginPath();
    ctx.ellipse(0, -fanRadius * 0.4, fanRadius * 0.35, fanRadius * 0.7, 0, 0, Math.PI * 2);
    const featherGradient = ctx.createRadialGradient(0, -fanRadius * 0.4, 0, 0, -fanRadius * 0.4, fanRadius * 0.7);
    featherGradient.addColorStop(0, 'rgba(125, 155, 106, 0.18)');
    featherGradient.addColorStop(0.4, 'rgba(201, 169, 89, 0.1)');
    featherGradient.addColorStop(0.8, 'rgba(125, 155, 106, 0.05)');
    featherGradient.addColorStop(1, 'rgba(125, 155, 106, 0.02)');
    ctx.fillStyle = featherGradient;
    ctx.shadowColor = 'rgba(125, 155, 106, 0.15)';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.ellipse(0, -fanRadius * 0.4, fanRadius * 0.33, fanRadius * 0.68, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(125, 155, 106, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const featherLines = 12;
    for (let i = 0; i < featherLines; i++) {
      const t = i / (featherLines - 1);
      const angle = -Math.PI * 0.35 + Math.PI * 0.7 * t;
      const len = fanRadius * (0.5 + 0.15 * Math.sin(t * Math.PI));
      const endX = Math.cos(angle - Math.PI / 2) * len;
      const endY = Math.sin(angle - Math.PI / 2) * len - fanRadius * 0.1;
      const cp1x = endX * 0.3 + (Math.random() - 0.5) * 2;
      const cp1y = endY * 0.3;

      ctx.beginPath();
      ctx.moveTo(0, -fanRadius * 0.05);
      ctx.quadraticCurveTo(cp1x, cp1y, endX, endY);
      ctx.strokeStyle = `rgba(125, 155, 106, ${0.08 + t * 0.05})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();

      for (let j = 1; j <= 3; j++) {
        const bt = j / 4;
        const bx = (1 - bt) * (1 - bt) * 0 + 2 * (1 - bt) * bt * cp1x + bt * bt * endX;
        const by = (1 - bt) * (1 - bt) * (-fanRadius * 0.05) + 2 * (1 - bt) * bt * cp1y + bt * bt * endY;
        const barbLen = 6 * (1 - Math.abs(bt - 0.5) * 2);
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + barbLen, by - barbLen * 0.5);
        ctx.moveTo(bx, by);
        ctx.lineTo(bx - barbLen * 0.3, by + barbLen * 0.3);
        ctx.strokeStyle = 'rgba(125, 155, 106, 0.06)';
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }
    }

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -fanRadius * 0.4);
    ctx.strokeStyle = 'rgba(26, 26, 26, 0.5)';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(125, 155, 106, 0.7)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();
  }
}

function drawWindForceIndicator(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  metrics: WindMetrics,
) {
  const indicatorX = w - 60;
  const indicatorY = h - 60;
  const radius = 25;

  ctx.save();
  ctx.beginPath();
  ctx.arc(indicatorX, indicatorY, radius + 2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 196, 168, 0.5)';
  ctx.lineWidth = 1;
  ctx.stroke();

  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 / 8) * i - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(indicatorX + Math.cos(a) * (radius - 2), indicatorY + Math.sin(a) * (radius - 2));
    ctx.lineTo(indicatorX + Math.cos(a) * (radius - 5), indicatorY + Math.sin(a) * (radius - 5));
    ctx.strokeStyle = 'rgba(26, 26, 26, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const angle = -Math.PI / 2 + Math.sin(time * 2) * 0.5;
  const len = radius * 0.7 * (metrics.windForce / 100);
  ctx.beginPath();
  ctx.moveTo(indicatorX, indicatorY);
  ctx.lineTo(indicatorX + Math.cos(angle) * len, indicatorY + Math.sin(angle) * len);
  ctx.strokeStyle = 'rgba(200, 16, 46, 0.7)';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(indicatorX, indicatorY, 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(200, 16, 46, 0.7)';
  ctx.fill();

  ctx.font = '10px sans-serif';
  ctx.fillStyle = 'rgba(26, 26, 26, 0.5)';
  ctx.textAlign = 'center';
  ctx.fillText('风力', indicatorX, indicatorY + radius + 15);
  ctx.restore();
}

function drawMiniGraph(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  history: WindHistoryPoint[],
) {
  ctx.save();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 6);
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 196, 168, 0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  const padding = 8;
  const graphW = w - padding * 2;
  const graphH = h - padding * 2 - 12;
  const graphX = x + padding;
  const graphY = y + padding + 12;

  ctx.font = '9px sans-serif';
  ctx.fillStyle = 'rgba(26, 26, 26, 0.4)';
  ctx.textAlign = 'left';
  ctx.fillText('风速历史', x + padding, y + padding + 8);

  ctx.strokeStyle = 'rgba(212, 196, 168, 0.2)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 4; i++) {
    const ly = graphY + (graphH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(graphX, ly);
    ctx.lineTo(graphX + graphW, ly);
    ctx.stroke();
  }

  if (history.length < 2) {
    ctx.restore();
    return;
  }

  const maxTime = history[history.length - 1].time;
  const minTime = maxTime - 10;

  const drawLine = (key: 'force' | 'comfort', color: string) => {
    ctx.beginPath();
    let started = false;
    for (const point of history) {
      if (point.time < minTime) continue;
      const px = graphX + ((point.time - minTime) / 10) * graphW;
      const py = graphY + graphH - (point[key] / 100) * graphH;
      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  };

  drawLine('force', 'rgba(200, 16, 46, 0.6)');
  drawLine('comfort', 'rgba(125, 155, 106, 0.6)');

  ctx.font = '7px sans-serif';
  ctx.fillStyle = 'rgba(200, 16, 46, 0.5)';
  ctx.textAlign = 'right';
  ctx.fillText('风力', x + w - padding, y + padding + 8);
  ctx.fillStyle = 'rgba(125, 155, 106, 0.5)';
  ctx.fillText('舒适', x + w - padding - 24, y + padding + 8);

  ctx.restore();
}

function getParticleColor(type: FanType, opacity: number): string {
  switch (type) {
    case 'round':
      return `rgba(200, 16, 46, ${opacity})`;
    case 'folding':
      return `rgba(201, 169, 89, ${opacity})`;
    case 'feather':
      return `rgba(125, 155, 106, ${opacity})`;
    default:
      return `rgba(26, 26, 26, ${opacity})`;
  }
}

function getFlowLineColor(type: FanType, opacity: number): string {
  switch (type) {
    case 'round':
      return `rgba(200, 16, 46, ${opacity})`;
    case 'folding':
      return `rgba(156, 118, 61, ${opacity})`;
    case 'feather':
      return `rgba(93, 122, 78, ${opacity})`;
    default:
      return `rgba(26, 26, 26, ${opacity})`;
  }
}

function getGlowColor(type: FanType): string {
  switch (type) {
    case 'round':
      return 'rgba(200, 16, 46, 0.4)';
    case 'folding':
      return 'rgba(201, 169, 89, 0.4)';
    case 'feather':
      return 'rgba(125, 155, 106, 0.4)';
    default:
      return 'rgba(26, 26, 26, 0.4)';
  }
}

function getAnalysisText(config: FanConfig, metrics: WindMetrics): string {
  const typeName = FAN_PRESETS[config.type].name;
  let text = `当前${typeName}配置：`;

  if (metrics.windForce > 70) {
    text += '风力强劲，适合炎热天气快速降温。';
  } else if (metrics.windForce > 40) {
    text += '风力适中，日常使用舒适宜人。';
  } else {
    text += '风力轻柔，适合老人和孩童使用。';
  }

  if (metrics.coverage > 60) {
    text += '覆盖范围广，可为多人同时纳凉。';
  } else {
    text += '覆盖范围集中，适合单人使用。';
  }

  if (metrics.comfort > 70) {
    text += '整体舒适度优秀，久扇不倦。';
  } else if (metrics.comfort > 40) {
    text += '舒适度尚可，注意控制摇扇力度。';
  } else {
    text += '风力偏硬，建议降低扇面或放慢速度。';
  }

  return text;
}

function getComfortEmoji(comfort: number): string {
  if (comfort >= 80) return '😌';
  if (comfort >= 60) return '😊';
  if (comfort >= 40) return '😐';
  if (comfort >= 20) return '😟';
  return '😣';
}

function getComfortLabel(comfort: number): string {
  if (comfort >= 80) return '极度舒适';
  if (comfort >= 60) return '比较舒适';
  if (comfort >= 40) return '一般';
  if (comfort >= 20) return '略显不适';
  return '不太舒适';
}

function getComfortColor(comfort: number): string {
  if (comfort >= 80) return 'text-bamboo-600';
  if (comfort >= 60) return 'text-bamboo-500';
  if (comfort >= 40) return 'text-gold-600';
  if (comfort >= 20) return 'text-vermilion-500';
  return 'text-vermilion-600';
}

export default function WindField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<WindParticle[]>([]);
  const flowLinesRef = useRef<FlowLine[]>([]);
  const vortexRef = useRef<VortexParticle[]>([]);
  const timeRef = useRef(0);
  const windHistoryRef = useRef<WindHistoryPoint[]>([]);
  const lastHistoryTimeRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentType, setCurrentType] = useState<FanType>('folding');
  const [configsByType, setConfigsByType] = useState<Record<FanType, FanConfig>>(DEFAULT_CONFIGS);

  const config = configsByType[currentType];
  const metrics = calculateMetrics(config);
  const preset = FAN_PRESETS[currentType];

  const resetParticles = useCallback(() => {
    particlesRef.current = [];
    flowLinesRef.current = [];
    vortexRef.current = [];
    windHistoryRef.current = [];
    lastHistoryTimeRef.current = 0;
  }, []);

  useEffect(() => {
    resetParticles();
  }, [currentType, resetParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const getWindVector = (px: number, py: number, time: number) => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;

      const fanCenterX = w * 0.35;
      const fanCenterY = h * 0.65;
      const fanRadius = Math.min(w, h) * 0.28 * (config.surfaceSize / 50);
      const swingAngle = Math.sin(time * config.swingSpeed * 2) * 0.4;
      const angleRad = (config.openAngle / 180) * Math.PI;

      const dx = px - fanCenterX;
      const dy = py - fanCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 10) return { vx: 0, vy: 0 };

      const fanDirAngle = -Math.PI / 2 + swingAngle;
      let inFanCone = false;

      if (config.type === 'round') {
        const pointAngle = Math.atan2(dy, dx);
        const angleDiff = Math.abs(normalizeAngle(pointAngle - fanDirAngle));
        inFanCone = angleDiff < Math.PI * 0.5 && dist < fanRadius * 4;
      } else if (config.type === 'folding') {
        const pointAngle = Math.atan2(dy, dx);
        const startAngle = fanDirAngle - angleRad / 2;
        const endAngle = fanDirAngle + angleRad / 2;
        const angleDiff = normalizeAngle(pointAngle - startAngle);
        const coneAngle = normalizeAngle(endAngle - startAngle);
        inFanCone = angleDiff > 0 && angleDiff < coneAngle && dist < fanRadius * 4;
      } else {
        const pointAngle = Math.atan2(dy, dx);
        const angleDiff = Math.abs(normalizeAngle(pointAngle - fanDirAngle));
        inFanCone = angleDiff < Math.PI * 0.35 && dist < fanRadius * 3.5;
      }

      if (!inFanCone) return { vx: 0, vy: 0 };

      const forceMultiplier = config.type === 'folding'
        ? config.surfaceSize * 0.001 * (1 + config.ribCount * 0.005)
        : config.type === 'feather'
        ? config.surfaceSize * 0.0008
        : config.surfaceSize * 0.001;

      const distDecay = Math.max(0, 1 - dist / (fanRadius * 4));
      const swingForce = Math.cos(time * config.swingSpeed * 2);

      const dirX = dx / dist;
      const dirY = dy / dist;

      const spreadFactor = config.type === 'round' ? 0.3 : config.type === 'feather' ? 0.2 : 0.15;

      const turbulence = 1 + Math.sin(time * 7 + dist * 0.02) * 0.08 * (1 - distDecay);

      return {
        vx: (dirX + (Math.random() - 0.5) * spreadFactor) * forceMultiplier * distDecay * swingForce * 3 * turbulence,
        vy: (dirY + (Math.random() - 0.5) * spreadFactor) * forceMultiplier * distDecay * swingForce * 3 * turbulence,
      };
    };

    const animate = () => {
      if (!isPlaying) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      timeRef.current += 0.016;
      const time = timeRef.current;
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;

      ctx.clearRect(0, 0, w, h);

      drawBackgroundGrid(ctx, w, h);

      drawPressureField(ctx, w, h, time, config, metrics);

      drawCoverageArcs(ctx, w, h, time, config, metrics);

      if (Math.random() < 0.35 + metrics.windForce * 0.025) {
        const fanCenterX = w * 0.35;
        const fanCenterY = h * 0.65;
        const fanRadius = Math.min(w, h) * 0.28 * (config.surfaceSize / 50);
        const swingAngle = Math.sin(time * config.swingSpeed * 2) * 0.4;
        const angleRad = (config.openAngle / 180) * Math.PI;

        let spawnAngle: number;
        if (config.type === 'round') {
          spawnAngle = -Math.PI / 2 + swingAngle + (Math.random() - 0.5) * Math.PI * 0.6;
        } else if (config.type === 'folding') {
          spawnAngle = -Math.PI / 2 + swingAngle + (Math.random() - 0.5) * angleRad;
        } else {
          spawnAngle = -Math.PI / 2 + swingAngle + (Math.random() - 0.5) * Math.PI * 0.4;
        }

        const spawnDist = fanRadius * 0.5 + Math.random() * fanRadius * 0.3;
        const px = fanCenterX + Math.cos(spawnAngle) * spawnDist;
        const py = fanCenterY + Math.sin(spawnAngle) * spawnDist;

        particlesRef.current.push({
          x: px,
          y: py,
          vx: 0,
          vy: 0,
          life: 0,
          maxLife: 60 + Math.random() * 80,
          size: 1.5 + Math.random() * 2.5,
          opacity: 0.4 + Math.random() * 0.5,
        });
      }

      if (Math.random() < 0.06 + metrics.windForce * 0.006) {
        const fanCenterX = w * 0.35;
        const fanCenterY = h * 0.65;
        const fanRadius = Math.min(w, h) * 0.28 * (config.surfaceSize / 50);
        const swingAngle = Math.sin(time * config.swingSpeed * 2) * 0.4;
        const angleRad = (config.openAngle / 180) * Math.PI;

        let spawnAngle: number;
        if (config.type === 'round') {
          spawnAngle = -Math.PI / 2 + swingAngle + (Math.random() - 0.5) * Math.PI * 0.5;
        } else if (config.type === 'folding') {
          spawnAngle = -Math.PI / 2 + swingAngle + (Math.random() - 0.5) * angleRad;
        } else {
          spawnAngle = -Math.PI / 2 + swingAngle + (Math.random() - 0.5) * Math.PI * 0.3;
        }

        const spawnDist = fanRadius * (0.3 + Math.random() * 0.4);
        const startX = fanCenterX + Math.cos(spawnAngle) * spawnDist;
        const startY = fanCenterY + Math.sin(spawnAngle) * spawnDist;

        flowLinesRef.current.push({
          points: [{ x: startX, y: startY, age: 0 }],
          life: 0,
          maxLife: 100 + Math.random() * 60,
        });
      }

      if (Math.random() < 0.02 * (metrics.windForce / 50)) {
        const fanCenterX = w * 0.35;
        const fanCenterY = h * 0.65;
        const fanRadius = Math.min(w, h) * 0.28 * (config.surfaceSize / 50);
        const swingAngle = Math.sin(time * config.swingSpeed * 2) * 0.4;
        const angleRad = (config.openAngle / 180) * Math.PI;

        const edgeAngle = -Math.PI / 2 + swingAngle + (Math.random() > 0.5 ? 1 : -1) * angleRad * 0.5;
        const edgeX = fanCenterX + Math.cos(edgeAngle) * fanRadius * 0.9;
        const edgeY = fanCenterY + Math.sin(edgeAngle) * fanRadius * 0.9;

        vortexRef.current.push({
          x: edgeX,
          y: edgeY,
          angle: Math.random() * Math.PI * 2,
          radius: 5 + Math.random() * 10,
          angularSpeed: (Math.random() > 0.5 ? 1 : -1) * (0.05 + Math.random() * 0.08),
          life: 0,
          maxLife: 40 + Math.random() * 30,
          size: 2 + Math.random() * 3,
        });
      }

      const glowColor = getGlowColor(config.type);

      particlesRef.current = particlesRef.current.filter(p => {
        const wind = getWindVector(p.x, p.y, time);
        p.vx = p.vx * 0.92 + wind.vx * 0.8;
        p.vy = p.vy * 0.92 + wind.vy * 0.8;
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const lifeRatio = 1 - p.life / p.maxLife;
        const currentOpacity = p.opacity * lifeRatio;

        if (currentOpacity > 0.01) {
          ctx.save();
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = 6 * lifeRatio;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * lifeRatio, 0, Math.PI * 2);
          ctx.fillStyle = getParticleColor(config.type, currentOpacity);
          ctx.fill();

          if (Math.abs(p.vx) + Math.abs(p.vy) > 0.8) {
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            const tailLen = Math.min(speed * 4, 12);
            const angle = Math.atan2(p.vy, p.vx);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - Math.cos(angle) * tailLen, p.y - Math.sin(angle) * tailLen);
            ctx.strokeStyle = getParticleColor(config.type, currentOpacity * 0.5);
            ctx.lineWidth = p.size * lifeRatio * 0.6;
            ctx.stroke();
          }

          ctx.restore();
        }

        return p.life < p.maxLife && p.x > -50 && p.x < w + 50 && p.y > -50 && p.y < h + 50;
      });

      flowLinesRef.current = flowLinesRef.current.filter(line => {
        line.life++;
        const lastPoint = line.points[line.points.length - 1];
        const wind = getWindVector(lastPoint.x, lastPoint.y, time);

        const newX = lastPoint.x + wind.vx * 2.5 + (Math.random() - 0.5) * 0.3;
        const newY = lastPoint.y + wind.vy * 2.5 + (Math.random() - 0.5) * 0.3;

        if (line.life < line.maxLife && newX > -50 && newX < w + 50 && newY > -50 && newY < h + 50) {
          line.points.push({ x: newX, y: newY, age: line.life });

          if (line.points.length > 3) {
            const lifeRatio = 1 - line.life / line.maxLife;

            ctx.save();
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 4 * lifeRatio;

            ctx.beginPath();
            ctx.moveTo(line.points[0].x, line.points[0].y);

            for (let i = 1; i < line.points.length - 1; i++) {
              const xc = (line.points[i].x + line.points[i + 1].x) / 2;
              const yc = (line.points[i].y + line.points[i + 1].y) / 2;
              ctx.quadraticCurveTo(line.points[i].x, line.points[i].y, xc, yc);
            }

            const last = line.points[line.points.length - 1];
            ctx.lineTo(last.x, last.y);

            ctx.strokeStyle = getFlowLineColor(config.type, lifeRatio * 0.4);
            ctx.lineWidth = 2 * lifeRatio;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();

            const tip = line.points[line.points.length - 1];
            ctx.beginPath();
            ctx.arc(tip.x, tip.y, 2.5 * lifeRatio, 0, Math.PI * 2);
            ctx.fillStyle = getFlowLineColor(config.type, lifeRatio * 0.7);
            ctx.shadowBlur = 8 * lifeRatio;
            ctx.fill();

            ctx.restore();
          }
          return true;
        }
        return false;
      });

      vortexRef.current = vortexRef.current.filter(v => {
        v.life++;
        v.angle += v.angularSpeed;
        v.radius += 0.3;

        const lifeRatio = 1 - v.life / v.maxLife;
        const drawX = v.x + Math.cos(v.angle) * v.radius;
        const drawY = v.y + Math.sin(v.angle) * v.radius;

        if (lifeRatio > 0.01) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(drawX, drawY, v.size * lifeRatio, 0, Math.PI * 2);
          ctx.fillStyle = getParticleColor(config.type, lifeRatio * 0.3);
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = 4 * lifeRatio;
          ctx.fill();

          const trailAngle = v.angle - v.angularSpeed * 8;
          const trailX = v.x + Math.cos(trailAngle) * (v.radius - 2);
          const trailY = v.y + Math.sin(trailAngle) * (v.radius - 2);
          ctx.beginPath();
          ctx.moveTo(drawX, drawY);
          ctx.lineTo(trailX, trailY);
          ctx.strokeStyle = getParticleColor(config.type, lifeRatio * 0.15);
          ctx.lineWidth = v.size * lifeRatio * 0.5;
          ctx.stroke();
          ctx.restore();
        }

        return v.life < v.maxLife;
      });

      drawFan(ctx, w, h, time, config);

      drawWindForceIndicator(ctx, w, h, time, metrics);

      if (time - lastHistoryTimeRef.current > 0.2) {
        windHistoryRef.current.push({
          time,
          force: metrics.windForce,
          comfort: metrics.comfort,
        });
        lastHistoryTimeRef.current = time;
        if (windHistoryRef.current.length > 200) {
          windHistoryRef.current = windHistoryRef.current.slice(-150);
        }
      }

      drawMiniGraph(ctx, 10, h - 80, 140, 70, windHistoryRef.current);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [config, metrics, isPlaying]);

  const updateConfig = useCallback((updates: Partial<FanConfig>) => {
    setConfigsByType(prev => ({
      ...prev,
      [currentType]: { ...prev[currentType], ...updates },
    }));
  }, [currentType]);

  const handleTypeChange = (type: FanType) => {
    setCurrentType(type);
  };

  const handleReset = () => {
    setConfigsByType({ ...DEFAULT_CONFIGS });
    setCurrentType('folding');
    resetParticles();
  };

  const comfortEmoji = getComfortEmoji(metrics.comfort);
  const comfortLabel = getComfortLabel(metrics.comfort);
  const comfortColor = getComfortColor(metrics.comfort);

  return (
    <div className="min-h-screen bg-paper-50 pt-20 md:pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-bamboo-500 to-gold-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-3 mb-2">
                <span className="w-px h-4 bg-white/40" />
                <span className="text-white/80 font-serif-sc text-sm tracking-widest">风场模拟</span>
                <span className="w-px h-4 bg-white/40" />
              </div>
              <h1 className="font-serif-sc text-3xl md:text-4xl font-bold mb-2">清风徐来</h1>
              <p className="text-white/70 text-sm">
                调节扇骨、扇面与开合角度，实时感受不同扇子的风场效果
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                <span className="text-sm">{isPlaying ? '暂停' : '播放'}</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
              >
                <RotateCcw size={18} />
                <span className="text-sm">重置</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
              <div className="p-4 border-b border-paper-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind size={20} className="text-bamboo-600" />
                  <span className="font-serif-sc font-bold text-ink-800">风场可视化</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-ink-400">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-vermilion-400" />
                    强风区
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-400 ml-2" />
                    中风区
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-bamboo-400 ml-2" />
                    弱风区
                  </div>
                  <div className="flex items-center gap-2 text-xs text-ink-400">
                    <span className="inline-block w-2 h-2 rounded-full bg-bamboo-400 animate-pulse" />
                    实时模拟中
                  </div>
                </div>
              </div>
              <canvas
                ref={canvasRef}
                className="w-full"
                style={{ height: '500px', background: 'linear-gradient(135deg, #f7f7f2 0%, #f5f0e8 50%, #f9f6ed 100%)' }}
              />
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <MetricCard
                icon={<Gauge size={20} />}
                label="风力强度"
                value={metrics.windForce}
                unit="/100"
                color="vermilion"
              />
              <MetricCard
                icon={<Target size={20} />}
                label="覆盖范围"
                value={metrics.coverage}
                unit="/100"
                color="gold"
              />
              <MetricCard
                icon={<Heart size={20} />}
                label="舒适度"
                value={metrics.comfort}
                unit="/100"
                color="bamboo"
              />
              <MetricCard
                icon={<Wind size={20} />}
                label="综合效率"
                value={metrics.efficiency}
                unit="/100"
                color="ink"
              />
            </div>

            <div className="mt-4 bg-white rounded-2xl shadow-elegant p-5">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{comfortEmoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`font-serif-sc font-bold text-lg ${comfortColor}`}>{comfortLabel}</span>
                    <span className="text-sm text-ink-400">舒适度评分 {metrics.comfort}/100</span>
                  </div>
                  <div className="h-3 bg-paper-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${metrics.comfort}%`,
                        background: `linear-gradient(90deg, ${
                          metrics.comfort >= 80 ? '#7D9B6A' :
                          metrics.comfort >= 60 ? '#8aa675' :
                          metrics.comfort >= 40 ? '#C9A959' :
                          metrics.comfort >= 20 ? '#b8924a' : '#C8102E'
                        }, ${
                          metrics.comfort >= 80 ? '#abc49b' :
                          metrics.comfort >= 60 ? '#7D9B6A' :
                          metrics.comfort >= 40 ? '#d4bd82' :
                          metrics.comfort >= 20 ? '#C9A959' : '#f87171'
                        })`,
                      }}
                    />
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs text-ink-400">
                  <div className="flex items-center gap-1.5">
                    <Thermometer size={14} className="text-vermilion-400" />
                    <span>风力 {metrics.windForce}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Waves size={14} className="text-bamboo-400" />
                    <span>覆盖 {metrics.coverage}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BarChart3 size={14} className="text-gold-400" />
                    <span>效率 {metrics.efficiency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white rounded-2xl shadow-elegant p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-vermilion-100 text-vermilion-600 flex items-center justify-center">
                  <span className="text-lg">🪭</span>
                </div>
                <div>
                  <h3 className="font-serif-sc text-lg font-bold text-ink-800">扇子类型</h3>
                  <p className="text-sm text-ink-400">选择不同扇型观察风场差异</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {(Object.keys(FAN_PRESETS) as FanType[]).map(type => {
                  const p = FAN_PRESETS[type];
                  const isActive = config.type === type;
                  return (
                    <button
                      key={type}
                      onClick={() => handleTypeChange(type)}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        isActive
                          ? 'border-vermilion-500 bg-vermilion-50 shadow-md scale-105'
                          : 'border-paper-200 hover:border-vermilion-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="text-2xl mb-1">{p.icon}</div>
                      <div className={`text-xs font-serif-sc font-bold ${isActive ? 'text-vermilion-600' : 'text-ink-600'}`}>
                        {p.name}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="bg-paper-50 rounded-xl p-3 mb-4">
                <p className="text-xs text-ink-500 leading-relaxed">{preset.desc}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-elegant p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center">
                  <Settings2 size={20} />
                </div>
                <div>
                  <h3 className="font-serif-sc text-lg font-bold text-ink-800">参数调节</h3>
                  <p className="text-sm text-ink-400">拖动滑块实时调整扇子参数</p>
                </div>
              </div>

              <div className="space-y-5">
                {config.type === 'folding' && (
                  <SliderControl
                    label="扇骨数量"
                    value={config.ribCount}
                    min={preset.minRibs}
                    max={preset.maxRibs}
                    step={1}
                    onChange={v => updateConfig({ ribCount: v })}
                    formatValue={v => `${v} 根`}
                  />
                )}

                <SliderControl
                  label="扇面大小"
                  value={config.surfaceSize}
                  min={20}
                  max={100}
                  step={1}
                  onChange={v => updateConfig({ surfaceSize: v })}
                  formatValue={v => `${v} cm`}
                />

                {config.type === 'folding' && (
                  <SliderControl
                    label="开合角度"
                    value={config.openAngle}
                    min={30}
                    max={180}
                    step={1}
                    onChange={v => updateConfig({ openAngle: v })}
                    formatValue={v => `${v}°`}
                  />
                )}

                <SliderControl
                  label="摇摆速度"
                  value={config.swingSpeed}
                  min={0.2}
                  max={3.0}
                  step={0.1}
                  onChange={v => updateConfig({ swingSpeed: v })}
                  formatValue={v => `${v.toFixed(1)}x`}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-elegant p-6">
              <h3 className="font-serif-sc font-bold text-ink-800 mb-4 flex items-center gap-2">
                <Wind size={18} className="text-bamboo-600" />
                风力分析
              </h3>
              <div className="space-y-3">
                <AnalysisBar label="风力" value={metrics.windForce} color="bg-vermilion-500" />
                <AnalysisBar label="覆盖" value={metrics.coverage} color="bg-gold-500" />
                <AnalysisBar label="舒适" value={metrics.comfort} color="bg-bamboo-500" />
                <AnalysisBar label="效率" value={metrics.efficiency} color="bg-ink-400" />
              </div>

              <div className="mt-4 p-3 bg-paper-50 rounded-xl">
                <p className="text-xs text-ink-500 leading-relaxed">
                  {getAnalysisText(config, metrics)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-elegant p-6">
              <h3 className="font-serif-sc font-bold text-ink-800 mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-gold-600" />
                扇型对比
              </h3>
              <div className="space-y-3">
                {(Object.keys(FAN_PRESETS) as FanType[]).map(type => {
                  const typeConfig: FanConfig = {
                    ...config,
                    type,
                    ribCount: type === 'folding' ? config.ribCount : FAN_PRESETS[type].defaultRibs,
                  };
                  const typeMetrics = calculateMetrics(typeConfig);
                  const isActive = config.type === type;
                  return (
                    <div
                      key={type}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? 'border-vermilion-300 bg-vermilion-50/50'
                          : 'border-paper-200 hover:border-paper-300 bg-paper-50/50'
                      }`}
                      onClick={() => handleTypeChange(type)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-serif-sc font-medium text-ink-700">
                          {FAN_PRESETS[type].icon} {FAN_PRESETS[type].name}
                        </span>
                        {isActive && (
                          <span className="text-xs text-vermilion-500 font-medium">当前</span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-xs text-ink-400">风力</div>
                          <div className="text-sm font-bold text-vermilion-600">{Math.round(typeMetrics.windForce)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-ink-400">覆盖</div>
                          <div className="text-sm font-bold text-gold-600">{Math.round(typeMetrics.coverage)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-ink-400">舒适</div>
                          <div className="text-sm font-bold text-bamboo-600">{Math.round(typeMetrics.comfort)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  unit,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  const colorMap: Record<string, { text: string; bg: string; bar: string }> = {
    vermilion: { text: 'text-vermilion-600', bg: 'bg-vermilion-50', bar: 'bg-vermilion-500' },
    gold: { text: 'text-gold-600', bg: 'bg-gold-50', bar: 'bg-gold-500' },
    bamboo: { text: 'text-bamboo-600', bg: 'bg-bamboo-50', bar: 'bg-bamboo-500' },
    ink: { text: 'text-ink-600', bg: 'bg-ink-50', bar: 'bg-ink-400' },
  };
  const c = colorMap[color] || colorMap.ink;

  return (
    <div className={`${c.bg} rounded-xl p-4 border border-paper-200 transition-shadow hover:shadow-md`}>
      <div className={`${c.text} mb-2`}>{icon}</div>
      <div className="text-xs text-ink-400 mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${c.text}`}>{value}</span>
        <span className="text-xs text-ink-400">{unit}</span>
      </div>
      <div className="mt-2 h-1.5 bg-paper-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${c.bar} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-ink-700">{label}</span>
        <span className="text-sm font-bold text-vermilion-600 bg-vermilion-50 px-2 py-0.5 rounded-md">
          {formatValue(value)}
        </span>
      </div>
      <div className="relative">
        <div className="h-2 bg-paper-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-vermilion-400 to-gold-400 rounded-full transition-all duration-200"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ height: '2rem', top: '-0.5rem' }}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-ink-400">{formatValue(min)}</span>
        <span className="text-xs text-ink-400">{formatValue(max)}</span>
      </div>
    </div>
  );
}

function AnalysisBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-ink-400 w-8">{label}</span>
      <div className="flex-1 h-2 bg-paper-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
      <span className="text-xs font-medium text-ink-600 w-8 text-right">{Math.round(value)}</span>
    </div>
  );
}
