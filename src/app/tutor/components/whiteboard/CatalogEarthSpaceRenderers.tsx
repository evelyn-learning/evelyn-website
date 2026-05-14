'use client';

import React from 'react';
import {
  phasesOfMoonFeatureNames,
  solarSystemFeatureNames,
  earthLayersFeatureNames,
  eclipseDiagramFeatureNames,
  seasonsDiagramFeatureNames,
  plateTectonicsFeatureNames,
  type PhasesOfMoonFigure,
  type SolarSystemFigure,
  type EarthLayersFigure,
  type EclipseDiagramFigure,
  type SeasonsDiagramFigure,
  type PlateTectonicsFigure,
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
  const N = phasesOfMoonFeatureNames;
  const W = 240;
  const H = 280;
  const cx = W / 2;
  const cy = 100;
  const r = 70;
  const phaseHuman = phase.replace(/_/g, ' ');
  const DARK = '#1f2937';
  const LIGHT = '#fef3c7';
  // Terminator math: the day/night terminator projects to a vertical
  // ellipse on the disc with semi-major r (vertical) and semi-minor
  // a (horizontal). a = r at new/full, a = 0 at half phases.
  const a = r * Math.abs(1 - 2 * illuminationFraction);
  // Disc base = the color of the MAJORITY half. Then we overlay a
  // half-rectangle of the OPPOSITE color on the side we want to
  // change, and finally draw a "carve-back" ellipse in the base color
  // to round the terminator. (Both overlay and carve are clipped to
  // the disc circle.)
  const baseColor = illuminationFraction >= 0.5 ? LIGHT : DARK;
  const overlayColor = illuminationFraction >= 0.5 ? DARK : LIGHT;
  // Which side does the overlay (minority color) go on?
  // - Waxing crescent (illum<0.5, lightFromRight=+1): lit minority on RIGHT.
  // - Waxing gibbous (illum>0.5, lightFromRight=+1): dark minority on LEFT.
  // - Waning crescent (illum<0.5, lightFromRight=-1): lit minority on LEFT.
  // - Waning gibbous (illum>0.5, lightFromRight=-1): dark minority on RIGHT.
  const overlayOnRight =
    (illuminationFraction >= 0.5 ? -1 : 1) * lightFromRight >= 0;
  // Lit-side bbox (for scribble) — covers the lit half of the disc.
  const litLeftPx = lightFromRight >= 0 ? cx : cx - r;
  const darkLeftPx = lightFromRight >= 0 ? cx - r : cx;
  return (
    <div
      className="moon-renderer w-full flex flex-col items-center"
      data-feature={N.moon}
      data-feature-label={title || `${phaseHuman} moon`}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[280px]">
        <defs>
          <clipPath id="moon-mask">
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>
        </defs>
        {/* Disc base — majority color. */}
        <circle cx={cx} cy={cy} r={r} fill={baseColor} stroke="#9ca3af" strokeWidth={1.5} />
        {/* Minority-color overlay (only for partial phases). */}
        {illuminationFraction > 0 && illuminationFraction < 1 && (
          <g clipPath="url(#moon-mask)">
            <rect
              x={overlayOnRight ? cx : cx - r}
              y={cy - r}
              width={r}
              height={r * 2}
              fill={overlayColor}
            />
            {a > 0 && (
              <ellipse cx={cx} cy={cy} rx={a} ry={r} fill={baseColor} />
            )}
          </g>
        )}
        {/* Invisible dark-side hit region (under transparent rect for scribble). */}
        <rect
          x={darkLeftPx}
          y={cy - r}
          width={r}
          height={r * 2}
          fill="transparent"
          data-feature={N.darkSide}
          data-feature-label="dark side"
          data-feature-cx={(darkLeftPx + r / 2) / W}
          data-feature-cy={cy / H}
          data-feature-w={r / W}
          data-feature-h={(r * 2) / H}
        />
        {/* Invisible lit-side hit region. */}
        <rect
          x={litLeftPx}
          y={cy - r}
          width={r}
          height={r * 2}
          fill="transparent"
          data-feature={N.litSide}
          data-feature-label="lit side"
          data-feature-cx={(litLeftPx + r / 2) / W}
          data-feature-cy={cy / H}
          data-feature-w={r / W}
          data-feature-h={(r * 2) / H}
        />
        <text
          x={cx} y={cy + r + 30}
          fontSize={13} textAnchor="middle" fill="#374151" fontWeight={600}
          data-feature={N.phaseLabel}
          data-feature-label={phaseHuman}
          data-feature-cx={cx / W}
          data-feature-cy={(cy + r + 26) / H}
          data-feature-w={140 / W}
          data-feature-h={20 / H}
        >
          {phaseHuman}
        </text>
      </svg>
    </div>
  );
}

export function CatalogSolarSystemRenderer({ figure }: { figure: SolarSystemFigure }) {
  const { highlight, title } = figure;
  const N = solarSystemFeatureNames;
  const W = 720;
  const H = 200;
  return (
    <div
      className="solar-system-renderer w-full flex flex-col items-center"
      data-feature={N.system}
      data-feature-label={title || 'solar system'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[760px]">
        {/* Sun */}
        <circle
          cx={40} cy={H / 2} r={28}
          fill="#facc15" stroke="#ca8a04" strokeWidth={2}
          data-feature={N.sun}
          data-feature-label="Sun"
          data-feature-cx={40 / W}
          data-feature-cy={(H / 2) / H}
          data-feature-w={56 / W}
          data-feature-h={56 / H}
        />
        <text x={40} y={H / 2 + 4} fontSize={11} textAnchor="middle" fill="#7c2d12" fontWeight={700}>Sun</text>
        {PLANETS.map((p, i) => {
          const x = 100 + i * 78;
          const lit = highlight.includes(p.name);
          return (
            <g key={p.name}>
              <circle
                cx={x} cy={H / 2} r={p.size}
                fill={p.color} stroke={lit ? '#dc2626' : '#374151'} strokeWidth={lit ? 3 : 1}
                data-feature={N.planet(p.name)}
                data-feature-label={p.name}
                data-feature-cx={x / W}
                data-feature-cy={(H / 2) / H}
                data-feature-w={(p.size * 2 + 8) / W}
                data-feature-h={(p.size * 2 + 8) / H}
              />
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

function slugLocal(label: string): string {
  return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function CatalogEarthLayersRenderer({ figure }: { figure: EarthLayersFigure }) {
  const { layers, title } = figure;
  const N = earthLayersFeatureNames;
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
    <div
      className="earth-layers-renderer w-full flex flex-col items-center"
      data-feature={N.earth}
      data-feature-label={title || "Earth's layers"}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[560px]">
        {layers.map((l, i) => {
          const rOuter = maxR - i * step;
          const layerName = l.name;
          // Use the outer-circle bbox per layer; tick lands at the visible
          // rightmost edge of that layer's ring.
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={rOuter}
              fill={l.color || '#9ca3af'} stroke="#1f2937" strokeWidth={1}
              data-feature={N.layer(layerName)}
              data-feature-label={layerName}
              data-feature-cx={cx / W}
              data-feature-cy={cy / H}
              data-feature-w={(rOuter * 2) / W}
              data-feature-h={(rOuter * 2) / H}
            />
          );
        })}
        {/* Labels on the right */}
        {layers.map((l, i) => {
          const r = maxR - (i + 0.5) * step;
          return (
            <g key={`lbl-${i}`}>
              <line x1={cx + r} y1={cy} x2={cx + maxR + 20} y2={cy - i * 20} stroke="#374151" strokeWidth={1} />
              <text
                x={cx + maxR + 24}
                y={cy - i * 20 + 4}
                fontSize={12}
                fill="#1f2937"
                fontWeight={600}
                data-feature={`label-${slugLocal(l.name)}`}
                data-feature-label={l.name}
                data-feature-cx={(cx + maxR + 24 + 40) / W}
                data-feature-cy={(cy - i * 20) / H}
                data-feature-w={100 / W}
                data-feature-h={18 / H}
              >
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
  const N = eclipseDiagramFeatureNames;
  const W = 640;
  const H = 200;
  // Positions differ by eclipse type.
  const sun = { cx: 60, cy: H / 2, r: 32 };
  const middle = type === 'solar' ? { cx: 300, cy: H / 2, r: 14 } : { cx: 340, cy: H / 2, r: 26 };
  const right = type === 'solar' ? { cx: 540, cy: H / 2, r: 26 } : { cx: 560, cy: H / 2, r: 14 };
  return (
    <div
      className="eclipse-renderer w-full flex flex-col items-center"
      data-feature={N.eclipse}
      data-feature-label={title || `${type} eclipse`}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[680px]">
        <circle
          cx={sun.cx} cy={sun.cy} r={sun.r}
          fill="#facc15"
          data-feature={N.sun}
          data-feature-label="Sun"
          data-feature-cx={sun.cx / W}
          data-feature-cy={sun.cy / H}
          data-feature-w={(sun.r * 2) / W}
          data-feature-h={(sun.r * 2) / H}
        />
        <text x={sun.cx} y={H / 2 + 50} fontSize={12} textAnchor="middle" fill="#374151">Sun</text>
        {type === 'solar' ? (
          <>
            <circle
              cx={middle.cx} cy={middle.cy} r={middle.r}
              fill="#1f2937"
              data-feature={N.moon}
              data-feature-label="Moon"
              data-feature-cx={middle.cx / W}
              data-feature-cy={middle.cy / H}
              data-feature-w={(middle.r * 2 + 8) / W}
              data-feature-h={(middle.r * 2 + 8) / H}
            />
            <text x={middle.cx} y={H / 2 + 30} fontSize={12} textAnchor="middle" fill="#374151">Moon</text>
            <circle
              cx={right.cx} cy={right.cy} r={right.r}
              fill="#3b82f6"
              data-feature={N.earth}
              data-feature-label="Earth"
              data-feature-cx={right.cx / W}
              data-feature-cy={right.cy / H}
              data-feature-w={(right.r * 2) / W}
              data-feature-h={(right.r * 2) / H}
            />
            <text x={right.cx} y={H / 2 + 44} fontSize={12} textAnchor="middle" fill="#374151">Earth</text>
          </>
        ) : (
          <>
            <circle
              cx={middle.cx} cy={middle.cy} r={middle.r}
              fill="#3b82f6"
              data-feature={N.earth}
              data-feature-label="Earth"
              data-feature-cx={middle.cx / W}
              data-feature-cy={middle.cy / H}
              data-feature-w={(middle.r * 2) / W}
              data-feature-h={(middle.r * 2) / H}
            />
            <text x={middle.cx} y={H / 2 + 44} fontSize={12} textAnchor="middle" fill="#374151">Earth</text>
            <circle
              cx={right.cx} cy={right.cy} r={right.r}
              fill="#1f2937"
              data-feature={N.moon}
              data-feature-label="Moon"
              data-feature-cx={right.cx / W}
              data-feature-cy={right.cy / H}
              data-feature-w={(right.r * 2 + 8) / W}
              data-feature-h={(right.r * 2 + 8) / H}
            />
            <text x={right.cx} y={H / 2 + 30} fontSize={12} textAnchor="middle" fill="#374151">Moon</text>
          </>
        )}
        <line
          x1={sun.cx + sun.r} y1={H / 2}
          x2={right.cx} y2={H / 2}
          stroke="#9ca3af" strokeWidth={1} strokeDasharray="4 3"
          data-feature={N.alignmentLine}
          data-feature-label="alignment line"
          data-feature-cx={((sun.cx + sun.r + right.cx) / 2) / W}
          data-feature-cy={(H / 2) / H}
          data-feature-w={(right.cx - sun.cx - sun.r) / W}
          data-feature-h={12 / H}
        />
      </svg>
    </div>
  );
}

export function CatalogSeasonsDiagramRenderer({ figure }: { figure: SeasonsDiagramFigure }) {
  const { hemisphere, title } = figure;
  const N = seasonsDiagramFeatureNames;
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
    <div
      className="seasons-renderer w-full flex flex-col items-center"
      data-feature={N.orbit}
      data-feature-label={title || 'seasons diagram'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[560px]">
        <ellipse cx={cx} cy={cy} rx={orbitRx} ry={orbitRy} fill="none" stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="4 3" />
        <circle
          cx={cx} cy={cy} r={22}
          fill="#facc15" stroke="#ca8a04" strokeWidth={2}
          data-feature={N.sun}
          data-feature-label="Sun"
          data-feature-cx={cx / W}
          data-feature-cy={cy / H}
          data-feature-w={44 / W}
          data-feature-h={44 / H}
        />
        <text x={cx} y={cy + 5} fontSize={12} textAnchor="middle" fill="#7c2d12" fontWeight={700}>Sun</text>
        {stops.map((s, i) => {
          const a = (s.deg * Math.PI) / 180;
          const x = cx + orbitRx * Math.cos(a);
          const y = cy + orbitRy * Math.sin(a);
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle
                r={14}
                fill="#3b82f6" stroke="#1e3a8a" strokeWidth={2}
                data-feature={N.season(s.name)}
                data-feature-label={s.name}
                data-feature-cx={x / W}
                data-feature-cy={(y + 12) / H}
                data-feature-w={56 / W}
                data-feature-h={64 / H}
              />
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
  const N = plateTectonicsFeatureNames;
  const W = 600;
  const H = 240;
  const cy = 120;
  const arrowL = boundary === 'divergent' ? -1 : boundary === 'convergent' ? 1 : 1;
  const arrowR = boundary === 'divergent' ? 1 : boundary === 'convergent' ? -1 : -1;
  const leftLabel = labels?.left || 'Plate A';
  const rightLabel = labels?.right || 'Plate B';
  return (
    <div
      className="plate-tectonics-renderer w-full flex flex-col items-center"
      data-feature={N.boundary}
      data-feature-label={title || `${boundary} boundary`}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {/* Two plates */}
        <rect
          x={20} y={cy - 30} width={W / 2 - 40} height={60}
          fill="#92400e" stroke="#451a03" strokeWidth={2}
          data-feature={N.plateA}
          data-feature-label={leftLabel}
          data-feature-cx={((20 + W / 2 - 20) / 2) / W}
          data-feature-cy={cy / H}
          data-feature-w={(W / 2 - 40) / W}
          data-feature-h={60 / H}
        />
        <rect
          x={W / 2 + 20} y={cy - 30} width={W / 2 - 40} height={60}
          fill="#a16207" stroke="#451a03" strokeWidth={2}
          data-feature={N.plateB}
          data-feature-label={rightLabel}
          data-feature-cx={((W / 2 + 20 + W - 20) / 2) / W}
          data-feature-cy={cy / H}
          data-feature-w={(W / 2 - 40) / W}
          data-feature-h={60 / H}
        />
        {/* Arrows showing motion */}
        <ArrowH x1={W / 4 - 30} y={cy - 50} dir={arrowL} color="#1f2937" />
        <ArrowH x1={3 * W / 4 - 30} y={cy - 50} dir={arrowR} color="#1f2937" />
        {/* Labels */}
        <text x={W / 4} y={cy + 60} fontSize={13} textAnchor="middle" fill="#374151" fontWeight={600}>{leftLabel}</text>
        <text x={3 * W / 4} y={cy + 60} fontSize={13} textAnchor="middle" fill="#374151" fontWeight={600}>{rightLabel}</text>
        <text
          x={W / 2} y={H - 16}
          fontSize={13} textAnchor="middle" fill="#dc2626" fontWeight={700} className="capitalize"
          data-feature={N.boundaryLabel}
          data-feature-label={`${boundary} boundary`}
          data-feature-cx={0.5}
          data-feature-cy={(H - 20) / H}
          data-feature-w={200 / W}
          data-feature-h={20 / H}
        >
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
