'use client';

import React from 'react';
import type {
  PhasesOfMoonFigure,
  SolarSystemFigure,
  EarthLayersFigure,
  EclipseDiagramFigure,
  SeasonsDiagramFigure,
  PlateTectonicsFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/earth-space';

const PLANETS = [
  { name: 'Mercury', color: '#9ca3af', size: 6 },
  { name: 'Venus',   color: '#fbbf24', size: 9 },
  { name: 'Earth',   color: '#3b82f6', size: 9 },
  { name: 'Mars',    color: '#dc2626', size: 7 },
  { name: 'Jupiter', color: '#f59e0b', size: 22 },
  { name: 'Saturn',  color: '#fde68a', size: 18 },
  { name: 'Uranus',  color: '#67e8f9', size: 14 },
  { name: 'Neptune', color: '#1d4ed8', size: 13 },
];

export function CatalogPhasesOfMoonRenderer({ figure }: { figure: PhasesOfMoonFigure }) {
  const { phase, lightFromRight, illuminationFraction, title } = figure;
  const W = 240;
  const H = 280;
  const cx = W / 2;
  const cy = 100;
  const r = 70;
  return (
    <div className="moon-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[280px]">
        <defs>
          <clipPath id="moon-mask">
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>
        </defs>
        {/* Dark side */}
        <circle cx={cx} cy={cy} r={r} fill="#1f2937" stroke="#9ca3af" strokeWidth={1.5} />
        {/* Lit side: split by phase */}
        {illuminationFraction > 0 && (
          <g clipPath="url(#moon-mask)">
            {illuminationFraction === 1 ? (
              <circle cx={cx} cy={cy} r={r} fill="#fef3c7" />
            ) : (
              <ellipse
                cx={cx + (lightFromRight === 0 ? 0 : 0)}
                cy={cy}
                rx={r * Math.cos(Math.PI * (1 - 2 * illuminationFraction))}
                ry={r}
                fill="#fef3c7"
                transform={`translate(${lightFromRight > 0 ? r * 0 : 0} 0)`}
              />
            )}
            {illuminationFraction !== 0 && illuminationFraction !== 1 && (
              <rect
                x={lightFromRight >= 0 ? cx : cx - r}
                y={cy - r}
                width={r}
                height={r * 2}
                fill={illuminationFraction >= 0.5 ? '#fef3c7' : '#1f2937'}
              />
            )}
            {illuminationFraction !== 0 && illuminationFraction !== 1 && (
              <ellipse
                cx={cx}
                cy={cy}
                rx={Math.abs(r * (illuminationFraction - 0.5) * 2)}
                ry={r}
                fill={illuminationFraction >= 0.5 ? '#1f2937' : '#fef3c7'}
                transform={`translate(${lightFromRight * (illuminationFraction >= 0.5 ? -r * (1 - illuminationFraction) : r * illuminationFraction)} 0)`}
              />
            )}
          </g>
        )}
        <text x={cx} y={cy + r + 30} fontSize={13} textAnchor="middle" fill="#374151" fontWeight={600}>
          {phase.replace(/_/g, ' ')}
        </text>
      </svg>
    </div>
  );
}

export function CatalogSolarSystemRenderer({ figure }: { figure: SolarSystemFigure }) {
  const { highlight, title } = figure;
  const W = 720;
  const H = 200;
  return (
    <div className="solar-system-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[760px]">
        {/* Sun */}
        <circle cx={40} cy={H / 2} r={28} fill="#facc15" stroke="#ca8a04" strokeWidth={2} />
        <text x={40} y={H / 2 + 4} fontSize={11} textAnchor="middle" fill="#7c2d12" fontWeight={700}>Sun</text>
        {PLANETS.map((p, i) => {
          const x = 100 + i * 78;
          const lit = highlight.includes(p.name);
          return (
            <g key={p.name}>
              <circle cx={x} cy={H / 2} r={p.size} fill={p.color} stroke={lit ? '#dc2626' : '#374151'} strokeWidth={lit ? 3 : 1} />
              <text x={x} y={H / 2 + p.size + 14} fontSize={11} textAnchor="middle" fill={lit ? '#dc2626' : '#374151'} fontWeight={lit ? 700 : 400}>
                {p.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function CatalogEarthLayersRenderer({ figure }: { figure: EarthLayersFigure }) {
  const { layers, title } = figure;
  // Circle area kept centered around cx=180, but viewBox W extended to
  // 540 so the right-side labels (e.g. "Outer Core", "Inner Core") fit
  // inside the SVG. Earlier W=360 cut labels at ~360 px even though
  // text started at x=354 — observed 2026-04-30 cell-bio session
  // export, where every page showed only the first letter of each
  // label.
  const W = 540;
  const H = 360;
  const cx = 180;
  const cy = H / 2;
  const maxR = 150;
  const step = maxR / layers.length;
  return (
    <div className="earth-layers-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[560px]">
        {layers.map((l, i) => {
          const r = maxR - i * step;
          return <circle key={i} cx={cx} cy={cy} r={r} fill={l.color || '#9ca3af'} stroke="#1f2937" strokeWidth={1} />;
        })}
        {/* Labels on the right */}
        {layers.map((l, i) => {
          const r = maxR - (i + 0.5) * step;
          return (
            <g key={`lbl-${i}`}>
              <line x1={cx + r} y1={cy} x2={cx + maxR + 20} y2={cy - i * 20} stroke="#374151" strokeWidth={1} />
              <text x={cx + maxR + 24} y={cy - i * 20 + 4} fontSize={12} fill="#1f2937" fontWeight={600}>
                {l.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function CatalogEclipseDiagramRenderer({ figure }: { figure: EclipseDiagramFigure }) {
  const { type, title } = figure;
  const W = 640;
  const H = 200;
  return (
    <div className="eclipse-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[680px]">
        {type === 'solar' ? (
          <g>
            <circle cx={60} cy={H / 2} r={32} fill="#facc15" />
            <text x={60} y={H / 2 + 50} fontSize={12} textAnchor="middle" fill="#374151">Sun</text>
            <circle cx={300} cy={H / 2} r={14} fill="#1f2937" />
            <text x={300} y={H / 2 + 30} fontSize={12} textAnchor="middle" fill="#374151">Moon</text>
            <circle cx={540} cy={H / 2} r={26} fill="#3b82f6" />
            <text x={540} y={H / 2 + 44} fontSize={12} textAnchor="middle" fill="#374151">Earth</text>
            <line x1={92} y1={H / 2} x2={540} y2={H / 2} stroke="#9ca3af" strokeWidth={1} strokeDasharray="4 3" />
          </g>
        ) : (
          <g>
            <circle cx={60} cy={H / 2} r={32} fill="#facc15" />
            <text x={60} y={H / 2 + 50} fontSize={12} textAnchor="middle" fill="#374151">Sun</text>
            <circle cx={340} cy={H / 2} r={26} fill="#3b82f6" />
            <text x={340} y={H / 2 + 44} fontSize={12} textAnchor="middle" fill="#374151">Earth</text>
            <circle cx={560} cy={H / 2} r={14} fill="#1f2937" />
            <text x={560} y={H / 2 + 30} fontSize={12} textAnchor="middle" fill="#374151">Moon</text>
            <line x1={92} y1={H / 2} x2={560} y2={H / 2} stroke="#9ca3af" strokeWidth={1} strokeDasharray="4 3" />
          </g>
        )}
      </svg>
    </div>
  );
}

export function CatalogSeasonsDiagramRenderer({ figure }: { figure: SeasonsDiagramFigure }) {
  const { hemisphere, title } = figure;
  const W = 520;
  const H = 320;
  const cx = W / 2;
  const cy = H / 2;
  const orbitRx = 200;
  const orbitRy = 90;
  const stops = [
    { name: 'Summer', deg: 0 },
    { name: 'Autumn', deg: 90 },
    { name: 'Winter', deg: 180 },
    { name: 'Spring', deg: 270 },
  ];
  return (
    <div className="seasons-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[560px]">
        <ellipse cx={cx} cy={cy} rx={orbitRx} ry={orbitRy} fill="none" stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="4 3" />
        <circle cx={cx} cy={cy} r={22} fill="#facc15" stroke="#ca8a04" strokeWidth={2} />
        <text x={cx} y={cy + 5} fontSize={12} textAnchor="middle" fill="#7c2d12" fontWeight={700}>Sun</text>
        {stops.map((s, i) => {
          const a = (s.deg * Math.PI) / 180;
          const x = cx + orbitRx * Math.cos(a);
          const y = cy + orbitRy * Math.sin(a);
          // Earth tilt visual: small tilted axis line
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle r={14} fill="#3b82f6" stroke="#1e3a8a" strokeWidth={2} />
              <line x1={-12} y1={12} x2={12} y2={-12} stroke="#fff" strokeWidth={2.5} />
              <text y={32} fontSize={12} textAnchor="middle" fill="#374151" fontWeight={700}>{s.name}</text>
            </g>
          );
        })}
        <text x={cx} y={H - 12} fontSize={12} textAnchor="middle" fill="#6b7280">{hemisphere} hemisphere</text>
      </svg>
    </div>
  );
}

export function CatalogPlateTectonicsRenderer({ figure }: { figure: PlateTectonicsFigure }) {
  const { boundary, labels, title } = figure;
  const W = 600;
  const H = 240;
  const cy = 120;
  const arrowL = boundary === 'divergent' ? -1 : boundary === 'convergent' ? 1 : 1;
  const arrowR = boundary === 'divergent' ? 1 : boundary === 'convergent' ? -1 : -1;
  return (
    <div className="plate-tectonics-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {/* Two plates */}
        <rect x={20} y={cy - 30} width={W / 2 - 40} height={60} fill="#92400e" stroke="#451a03" strokeWidth={2} />
        <rect x={W / 2 + 20} y={cy - 30} width={W / 2 - 40} height={60} fill="#a16207" stroke="#451a03" strokeWidth={2} />
        {/* Arrows showing motion */}
        <ArrowH x1={W / 4 - 30} y={cy - 50} dir={arrowL} color="#1f2937" />
        <ArrowH x1={3 * W / 4 - 30} y={cy - 50} dir={arrowR} color="#1f2937" />
        {/* Labels */}
        <text x={W / 4} y={cy + 60} fontSize={13} textAnchor="middle" fill="#374151" fontWeight={600}>{labels?.left || 'Plate A'}</text>
        <text x={3 * W / 4} y={cy + 60} fontSize={13} textAnchor="middle" fill="#374151" fontWeight={600}>{labels?.right || 'Plate B'}</text>
        <text x={W / 2} y={H - 16} fontSize={13} textAnchor="middle" fill="#dc2626" fontWeight={700} className="capitalize">
          {boundary} boundary
        </text>
      </svg>
    </div>
  );
}

function ArrowH({ x1, y, dir, color }: { x1: number; y: number; dir: number; color: string }) {
  const len = 60;
  const x2 = x1 + dir * len;
  return (
    <g>
      <defs>
        <marker id={`pt-arr-${color.replace('#', '')}-${dir}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={3} markerEnd={`url(#pt-arr-${color.replace('#', '')}-${dir})`} />
    </g>
  );
}
