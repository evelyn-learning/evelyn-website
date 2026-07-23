'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import {
  phasesOfMoonFeatureNames,
  solarSystemFeatureNames,
  earthLayersFeatureNames,
  eclipseDiagramFeatureNames,
  seasonsDiagramFeatureNames,
  plateTectonicsFeatureNames,
  geologicCrossSectionFeatureNames,
  hrDiagramFeatureNames,
  volcanoCrossSectionFeatureNames,
  atmosphereLayersFeatureNames,
  atmosphereLayerMeta,
  type PhasesOfMoonFigure,
  type SolarSystemFigure,
  type EarthLayersFigure,
  type EclipseDiagramFigure,
  type SeasonsDiagramFigure,
  type PlateTectonicsFigure,
  type GeologicCrossSectionFigure,
  type HRDiagramFigure,
  type VolcanoCrossSectionFigure,
  type AtmosphereLayersFigure,
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
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
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
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
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
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
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
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
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
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
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
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
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

// ── geologic_cross_section ─────────────────────────────────────────
/** Wavy horizontal path (erosional unconformity surface). */
function wavyPath(x0: number, x1: number, y: number, amp = 5, waves = 9): string {
  const span = x1 - x0;
  const seg = span / waves;
  let d = `M ${x0} ${y}`;
  for (let i = 0; i < waves; i++) {
    const cx = x0 + seg * (i + 0.5);
    const nx = x0 + seg * (i + 1);
    const dir = i % 2 === 0 ? -1 : 1;
    d += ` Q ${cx} ${y + dir * amp} ${nx} ${y}`;
  }
  return d;
}

export function CatalogGeologicCrossSectionRenderer({ figure }: { figure: GeologicCrossSectionFigure }) {
  const { showFault, faultType, showUnconformity, title } = figure;
  const N = geologicCrossSectionFeatureNames;
  const W = 720;
  const H = 430;
  const bx = 60;
  const bw = 400;
  const bxR = bx + bw;
  const bTop = 80;
  const bBot = 390;
  const unconfY = 120;
  // Strata top→bottom (youngest at top, oldest at bottom = superposition).
  const strata = [
    { id: 'conglomerate', name: 'Conglomerate', color: '#cdb173', yTop: bTop, yBot: unconfY },
    { id: 'limestone', name: 'Limestone', color: '#a9cdd9', yTop: unconfY, yBot: 188 },
    { id: 'shale', name: 'Shale', color: '#818893', yTop: 188, yBot: 256 },
    { id: 'sandstone', name: 'Sandstone', color: '#e3c178', yTop: 256, yBot: 324 },
    { id: 'basement', name: 'Granite (basement)', color: '#bd8a8a', yTop: 324, yBot: bBot },
  ];
  const dy = showFault ? (faultType === 'normal' ? 26 : -26) : 0;
  // Fault plane (dips down-left); right block is the hanging wall.
  const fTopX = bx + bw * 0.6;
  const fBotX = bx + bw * 0.52;
  // Intrusion (dike) — narrow igneous column cutting up through the left block.
  const dikePts = `130,${bBot} 148,${bBot} 168,150 152,150`;

  const StrataGroup = () => (
    <>
      {strata.map((s) => (
        <rect key={s.id} x={bx} y={s.yTop} width={bw} height={s.yBot - s.yTop} fill={s.color} />
      ))}
      {showUnconformity && (
        <path d={wavyPath(bx, bxR, unconfY)} fill="none" stroke="#5b3a1e" strokeWidth={2.5} />
      )}
    </>
  );

  return (
    <div
      className="geologic-cross-section-renderer w-full flex flex-col items-center"
      data-feature={N.section}
      data-feature-label={title || 'geologic cross-section'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[720px]">
        <defs>
          <clipPath id="geo-left">
            <path d={`M ${bx} ${bTop} L ${fTopX} ${bTop} L ${fBotX} ${bBot} L ${bx} ${bBot} Z`} />
          </clipPath>
          <clipPath id="geo-right">
            <path d={`M ${fTopX} ${bTop} L ${bxR} ${bTop} L ${bxR} ${bBot} L ${fBotX} ${bBot} Z`} />
          </clipPath>
        </defs>
        {/* Background fill so the offset block's top gap reads as the surface layer. */}
        <rect x={bx} y={bTop} width={bw} height={bBot - bTop} fill="#cdb173" />
        {/* Left (footwall) block — unshifted. */}
        <g clipPath="url(#geo-left)"><StrataGroup /></g>
        {/* Right (hanging-wall) block — displaced by the fault. */}
        <g clipPath="url(#geo-right)">
          <g transform={`translate(0 ${dy})`}><StrataGroup /></g>
        </g>
        {/* Igneous intrusion (dike). */}
        <polygon
          points={dikePts}
          fill="#6d2f1a" stroke="#3f1a0e" strokeWidth={1}
          data-feature={N.intrusion}
          data-feature-label="igneous intrusion"
          data-feature-cx={158 / W}
          data-feature-cy={((150 + bBot) / 2) / H}
          data-feature-w={40 / W}
          data-feature-h={(bBot - 150) / H}
        />
        {/* Block outline (scribble target for the whole strata sequence). */}
        <rect
          x={bx} y={bTop} width={bw} height={bBot - bTop}
          fill="transparent" stroke="#1f2937" strokeWidth={2}
          data-feature={N.strata}
          data-feature-label="strata"
          data-feature-cx={(bx + bw / 2) / W}
          data-feature-cy={((bTop + bBot) / 2) / H}
          data-feature-w={bw / W}
          data-feature-h={(bBot - bTop) / H}
        />
        {/* Fault plane. */}
        {showFault && (
          <>
            <line
              x1={fTopX} y1={bTop} x2={fBotX} y2={bBot}
              stroke="#111827" strokeWidth={2.5}
              data-feature={N.fault}
              data-feature-label={`${faultType} fault`}
              data-feature-cx={((fTopX + fBotX) / 2) / W}
              data-feature-cy={((bTop + bBot) / 2) / H}
              data-feature-w={40 / W}
              data-feature-h={(bBot - bTop) / H}
            />
            {/* relative-motion half-arrows */}
            <line x1={fTopX + 16} y1={bTop + 24} x2={fTopX + 16} y2={bTop + 54} stroke="#111827" strokeWidth={2} markerEnd="url(#geo-arr)" />
            <line x1={fBotX - 16} y1={bBot - 54} x2={fBotX - 16} y2={bBot - 84} stroke="#111827" strokeWidth={2} markerEnd="url(#geo-arr)" />
            <defs>
              <marker id="geo-arr" viewBox="0 0 10 10" refX="5" refY="9" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 5 10 L 10 0 z" fill="#111827" />
              </marker>
            </defs>
          </>
        )}
        {/* Right-side strata labels (leaders to the unshifted footwall). */}
        {strata.map((s) => {
          const my = (s.yTop + s.yBot) / 2;
          return (
            <g key={`lbl-${s.id}`}>
              <line x1={bxR} y1={my} x2={bxR + 16} y2={my} stroke="#6b7280" strokeWidth={1} />
              <text x={bxR + 20} y={my + 4} fontSize={12} fill="#1f2937" fontWeight={600}>{s.name}</text>
            </g>
          );
        })}
        {/* Structure callouts. */}
        {showUnconformity && (
          <text x={bxR + 20} y={unconfY - 4} fontSize={11} fill="#5b3a1e" fontWeight={700}
            data-feature={N.unconformity} data-feature-label="unconformity"
            data-feature-cx={(bxR + 60) / W} data-feature-cy={(unconfY - 8) / H} data-feature-w={120 / W} data-feature-h={16 / H}>
            ⟿ Unconformity
          </text>
        )}
        {showFault && (
          <text x={fTopX + 6} y={bTop - 6} fontSize={12} fill="#b91c1c" fontWeight={700} className="capitalize">{faultType} fault</text>
        )}
        <text x={158} y={bBot + 20} fontSize={11} textAnchor="middle" fill="#6d2f1a" fontWeight={700}>Igneous intrusion (dike)</text>
        <text x={bx + bw / 2} y={H - 6} fontSize={11} textAnchor="middle" fill="#6b7280">Oldest layer at the bottom — law of superposition</text>
      </svg>
    </div>
  );
}

// ── hr_diagram ─────────────────────────────────────────────────────
export function CatalogHRDiagramRenderer({ figure }: { figure: HRDiagramFigure }) {
  const { highlight, title } = figure;
  const N = hrDiagramFeatureNames;
  const W = 700;
  const H = 460;
  const px0 = 96, px1 = 610, py0 = 56, py1 = 380;
  // Temperature reversed (hot left → cool right), log scale.
  const logTHot = Math.log10(30000), logTCool = Math.log10(2500);
  const tempToX = (t: number) => px0 + (logTHot - Math.log10(t)) / (logTHot - logTCool) * (px1 - px0);
  // Luminosity log scale (faint bottom → bright top).
  const lumToY = (l: number) => py1 - (Math.log10(l) + 4) / 10 * (py1 - py0);
  const dim = (g: string) => (highlight && highlight !== g ? 0.28 : 1);

  const mainSeq = [
    { t: 30000, l: 1e5, c: '#9db4ff' },
    { t: 15000, l: 6e3, c: '#aec6ff' },
    { t: 9000, l: 60, c: '#d6e0ff' },
    { t: 7000, l: 6, c: '#f4f4ff' },
    { t: 5800, l: 1, c: '#fff2b0' },
    { t: 4600, l: 0.25, c: '#ffcf94' },
    { t: 3400, l: 0.02, c: '#ff9d6e' },
  ];
  const giants = [
    { t: 5200, l: 90 }, { t: 4400, l: 260 }, { t: 3900, l: 800 }, { t: 3500, l: 2200 },
  ];
  const dwarfs = [
    { t: 18000, l: 0.004 }, { t: 12000, l: 0.008 }, { t: 9000, l: 0.02 },
  ];
  const tempTicks = [30000, 10000, 6000, 4000, 3000];
  const lumTicks = [
    { l: 1e6, s: '10⁶' }, { l: 1e4, s: '10⁴' }, { l: 1e2, s: '10²' }, { l: 1, s: '1' }, { l: 1e-2, s: '10⁻²' }, { l: 1e-4, s: '10⁻⁴' },
  ];

  return (
    <div
      className="hr-diagram-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'H–R diagram'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[700px]">
        {/* Plot background (space). */}
        <rect x={px0} y={py0} width={px1 - px0} height={py1 - py0} fill="#0b1026" />
        {/* Grid + ticks */}
        {tempTicks.map((t) => {
          const x = tempToX(t);
          return (
            <g key={`tx-${t}`}>
              <line x1={x} y1={py0} x2={x} y2={py1} stroke="#26305a" strokeWidth={1} />
              <text x={x} y={py1 + 16} fontSize={11} textAnchor="middle" fill="#374151">{t.toLocaleString()}</text>
            </g>
          );
        })}
        {lumTicks.map((tk) => {
          const y = lumToY(tk.l);
          return (
            <g key={`ly-${tk.s}`}>
              <line x1={px0} y1={y} x2={px1} y2={y} stroke="#26305a" strokeWidth={1} />
              <text x={px0 - 8} y={y + 4} fontSize={11} textAnchor="end" fill="#374151">{tk.s}</text>
            </g>
          );
        })}
        {/* Main sequence band + line + stars */}
        <g opacity={dim('main_sequence')}
          data-feature={N.mainSequence} data-feature-label="main sequence"
          data-feature-cx={((tempToX(30000) + tempToX(3400)) / 2) / W}
          data-feature-cy={((lumToY(1e5) + lumToY(0.02)) / 2) / H}
          data-feature-w={(tempToX(3400) - tempToX(30000)) / W}
          data-feature-h={(lumToY(0.02) - lumToY(1e5)) / H}
        >
          <polyline
            points={mainSeq.map((s) => `${tempToX(s.t)},${lumToY(s.l)}`).join(' ')}
            fill="none" stroke="#7f9bd6" strokeWidth={12} strokeLinecap="round" opacity={0.35}
          />
          {mainSeq.map((s, i) => (
            <circle key={i} cx={tempToX(s.t)} cy={lumToY(s.l)} r={5} fill={s.c} stroke="#1f2937" strokeWidth={0.5} />
          ))}
          <text x={tempToX(9000)} y={lumToY(60) - 12} fontSize={12} fill="#cdd8ff" fontWeight={600} transform={`rotate(30 ${tempToX(9000)} ${lumToY(60) - 12})`}>Main sequence</text>
        </g>
        {/* Giants */}
        <g opacity={dim('giants')}
          data-feature={N.giants} data-feature-label="giants"
          data-feature-cx={(tempToX(4300)) / W} data-feature-cy={(lumToY(500)) / H}
          data-feature-w={140 / W} data-feature-h={120 / H}
        >
          {giants.map((s, i) => (
            <circle key={i} cx={tempToX(s.t)} cy={lumToY(s.l)} r={7} fill="#ff7b5a" stroke="#7f1d1d" strokeWidth={0.6} />
          ))}
          <text x={tempToX(4200)} y={lumToY(2600)} fontSize={13} textAnchor="middle" fill="#ffb59e" fontWeight={700}>Giants</text>
        </g>
        {/* White dwarfs */}
        <g opacity={dim('white_dwarfs')}
          data-feature={N.whiteDwarfs} data-feature-label="white dwarfs"
          data-feature-cx={(tempToX(12000)) / W} data-feature-cy={(lumToY(0.008)) / H}
          data-feature-w={140 / W} data-feature-h={80 / H}
        >
          {dwarfs.map((s, i) => (
            <circle key={i} cx={tempToX(s.t)} cy={lumToY(s.l)} r={5} fill="#e8f0ff" stroke="#64748b" strokeWidth={0.6} />
          ))}
          <text x={tempToX(12000)} y={lumToY(0.0006)} fontSize={12} textAnchor="middle" fill="#cbd5e1" fontWeight={700}>White dwarfs</text>
        </g>
        {/* Sun */}
        <g opacity={dim('sun')}>
          <circle
            cx={tempToX(5800)} cy={lumToY(1)} r={7} fill="#fde047" stroke="#a16207" strokeWidth={1.5}
            data-feature={N.sun} data-feature-label="Sun"
            data-feature-cx={tempToX(5800) / W} data-feature-cy={lumToY(1) / H}
            data-feature-w={30 / W} data-feature-h={30 / H}
          />
          <text x={tempToX(5800) + 12} y={lumToY(1) + 4} fontSize={12} fill="#fde047" fontWeight={700}>☉ Sun</text>
        </g>
        {/* Axis labels */}
        <text x={(px0 + px1) / 2} y={py1 + 34} fontSize={12} textAnchor="middle" fill="#374151" fontWeight={600}>Surface temperature (K) — hot ← → cool</text>
        <text x={22} y={(py0 + py1) / 2} fontSize={12} textAnchor="middle" fill="#374151" fontWeight={600} transform={`rotate(-90 22 ${(py0 + py1) / 2})`}>Luminosity (L / L☉)</text>
      </svg>
    </div>
  );
}

// ── volcano_cross_section ──────────────────────────────────────────
export function CatalogVolcanoCrossSectionRenderer({ figure }: { figure: VolcanoCrossSectionFigure }) {
  const { showSideVent, title } = figure;
  const N = volcanoCrossSectionFeatureNames;
  const W = 700;
  const H = 470;
  const groundY = 300;
  const apexX = 330, apexY = 96;
  const baseL = 120, baseR = 540;
  const craterHalf = 22;
  const ventX = apexX;
  // Nested chevron layers (alternating hardened lava / ash).
  const layerColors = ['#8a8f98', '#5f463a', '#9aa0a8', '#6d5040', '#a9afb6', '#7b5a48'];
  const cones = layerColors.map((c, i) => {
    const t = 1 - i / layerColors.length; // 1 (outer) → small
    const hw = (baseR - baseL) / 2 * t;
    const cx = apexX;
    const ay = apexY + (groundY - apexY) * (1 - t);
    const bl = cx - hw, br = cx + hw;
    return { c, pts: `${cx},${ay} ${br},${groundY} ${bl},${groundY}`, ay };
  });

  return (
    <div
      className="volcano-cross-section-renderer w-full flex flex-col items-center"
      data-feature={N.volcano}
      data-feature-label={title || 'stratovolcano'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[700px]">
        {/* Sky */}
        <rect x={0} y={0} width={W} height={groundY} fill="#dbeafe" />
        {/* Crust below ground */}
        <rect x={0} y={groundY} width={W} height={H - groundY} fill="#6b4f35" />
        <line x1={0} y1={groundY} x2={W} y2={groundY} stroke="#3f2d1c" strokeWidth={2} />
        <line x1={0} y1={groundY + 55} x2={W} y2={groundY + 55} stroke="#4d3826" strokeWidth={1} strokeDasharray="6 4" />
        {/* Cone layers (outer → inner). */}
        {cones.map((c, i) => (
          <polygon key={i} points={c.pts} fill={c.c} stroke="#2f261f" strokeWidth={0.6} />
        ))}
        {/* Layer-scribble target (whole cone). */}
        <polygon
          points={`${apexX},${apexY} ${baseR},${groundY} ${baseL},${groundY}`}
          fill="transparent"
          data-feature={N.layers} data-feature-label="lava & ash layers"
          data-feature-cx={apexX / W} data-feature-cy={((apexY + groundY) / 2) / H}
          data-feature-w={(baseR - baseL) / W} data-feature-h={(groundY - apexY) / H}
        />
        {/* Magma chamber */}
        <ellipse
          cx={330} cy={385} rx={98} ry={44}
          fill="#e8662a" stroke="#7c2d12" strokeWidth={2}
          data-feature={N.magmaChamber} data-feature-label="magma chamber"
          data-feature-cx={330 / W} data-feature-cy={385 / H}
          data-feature-w={200 / W} data-feature-h={92 / H}
        />
        {/* Central conduit */}
        <path
          d={`M ${ventX - 9} ${apexY + 6} L ${ventX - 7} 360 L ${ventX + 7} 360 L ${ventX + 9} ${apexY + 6} Z`}
          fill="#d9432f" stroke="#7c2d12" strokeWidth={1.5}
          data-feature={N.vent} data-feature-label="conduit / vent"
          data-feature-cx={ventX / W} data-feature-cy={((apexY + 360) / 2) / H}
          data-feature-w={30 / W} data-feature-h={(360 - apexY) / H}
        />
        {/* Crater notch */}
        <path d={`M ${apexX - craterHalf} ${apexY + 6} L ${apexX - 8} ${apexY - 8} L ${apexX + 8} ${apexY - 8} L ${apexX + craterHalf} ${apexY + 6}`}
          fill="none" stroke="#7c2d12" strokeWidth={2} />
        <circle
          cx={apexX} cy={apexY + 2} r={7} fill="#fb923c"
          data-feature={N.crater} data-feature-label="crater"
          data-feature-cx={apexX / W} data-feature-cy={apexY / H}
          data-feature-w={60 / W} data-feature-h={40 / H}
        />
        {/* Side (parasitic) vent */}
        {showSideVent && (
          <g data-feature={N.sideVent} data-feature-label="side vent"
            data-feature-cx={452 / W} data-feature-cy={250 / H} data-feature-w={70 / W} data-feature-h={90 / H}>
            <path d={`M ${ventX + 4} 250 Q 410 250 452 236`} fill="none" stroke="#d9432f" strokeWidth={6} />
            <polygon points={`452,236 476,270 428,270`} fill="#7b5a48" stroke="#2f261f" strokeWidth={0.6} />
            <circle cx={452} cy={238} r={4} fill="#fb923c" />
          </g>
        )}
        {/* Labels */}
        <Leader x1={apexX + 26} y1={apexY - 2} x2={apexX + 90} y2={72} text="Crater" />
        <Leader x1={ventX + 9} y1={200} x2={150} y2={150} text="Conduit / vent" anchor="end" />
        <Leader x1={402} y1={385} x2={560} y2={400} text="Magma chamber" />
        <Leader x1={230} y1={250} x2={110} y2={252} text="Lava & ash layers" anchor="end" />
        {showSideVent && <Leader x1={470} y1={250} x2={600} y2={224} text="Side vent" />}
      </svg>
    </div>
  );
}

function Leader({ x1, y1, x2, y2, text, anchor = 'start' }: { x1: number; y1: number; x2: number; y2: number; text: string; anchor?: 'start' | 'end' }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth={1} />
      <circle cx={x1} cy={y1} r={2} fill="#374151" />
      <text x={anchor === 'end' ? x2 - 4 : x2 + 4} y={y2 + 4} fontSize={12} textAnchor={anchor} fill="#1f2937" fontWeight={600}>{text}</text>
    </g>
  );
}

// ── atmosphere_layers ──────────────────────────────────────────────
export function CatalogAtmosphereLayersRenderer({ figure }: { figure: AtmosphereLayersFigure }) {
  const { highlight, title } = figure;
  const N = atmosphereLayersFeatureNames;
  const W = 700;
  const H = 470;
  const px0 = 150, px1 = 470;
  const py0 = 70, py1 = 410;
  const bandH = (py1 - py0) / 5;
  // Bottom→top; index 0 = troposphere (ground) at the bottom band.
  const bands = [
    { id: 'troposphere', name: 'Troposphere', color: '#bfe0f7', text: '#1e3a5f' },
    { id: 'stratosphere', name: 'Stratosphere', color: '#7aa8dd', text: '#0b2545' },
    { id: 'mesosphere', name: 'Mesosphere', color: '#3f4f9c', text: '#eef2ff' },
    { id: 'thermosphere', name: 'Thermosphere', color: '#1e2358', text: '#eef2ff' },
    { id: 'exosphere', name: 'Exosphere', color: '#0b1026', text: '#c7d2fe' },
  ];
  // y of the TOP of band i (i=0 bottom).
  const bandTop = (i: number) => py1 - (i + 1) * bandH;
  const bandBot = (i: number) => py1 - i * bandH;
  const boundaries = [
    { y: py1, label: '0 km' },
    { y: bandTop(0), label: '12 km' },
    { y: bandTop(1), label: '50 km' },
    { y: bandTop(2), label: '85 km' },
    { y: bandTop(3), label: '600 km' },
    { y: py0, label: '10,000 km' },
  ];
  // Temperature-vs-altitude profile (schematic zigzag). x: cold-left → warm-right.
  const tcold = px0 + 30, twarm = px1 - 20;
  const profile: Array<[number, number]> = [
    [px0 + 150, py1],            // ground, mild
    [tcold, bandTop(0)],         // tropopause, cold
    [twarm - 10, bandTop(1)],    // stratopause, warm (ozone heating)
    [px0 + 15, bandTop(2)],      // mesopause, coldest
    [twarm, bandTop(3)],         // thermosphere, hot
    [twarm + 8, py0 + 12],       // exosphere, hot
  ];
  const ozoneTop = bandTop(1) + bandH * 0.35;
  const ozoneBot = bandTop(1) + bandH * 0.65;

  return (
    <div
      className="atmosphere-layers-renderer w-full flex flex-col items-center"
      data-feature={N.atmosphere}
      data-feature-label={title || "Earth's atmosphere"}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[700px]">
        {/* Layer bands */}
        {bands.map((b, i) => {
          const meta = atmosphereLayerMeta[i];
          const yTop = bandTop(i);
          const dimmed = highlight && highlight !== b.id ? 0.5 : 1;
          return (
            <g key={b.id} opacity={dimmed}>
              <rect
                x={px0} y={yTop} width={px1 - px0} height={bandH}
                fill={b.color} stroke="#ffffff" strokeWidth={0.75}
                data-feature={N.layer(meta.id)} data-feature-label={meta.name}
                data-feature-cx={((px0 + px1) / 2) / W} data-feature-cy={(yTop + bandH / 2) / H}
                data-feature-w={(px1 - px0) / W} data-feature-h={bandH / H}
              />
              <text x={px0 + 14} y={yTop + bandH / 2 + 4} fontSize={13} fill={b.text} fontWeight={700}>{b.name}</text>
            </g>
          );
        })}
        {/* Ozone layer (within the stratosphere). */}
        <rect
          x={px0} y={ozoneTop} width={px1 - px0} height={ozoneBot - ozoneTop}
          fill="#a855f7" opacity={0.55} stroke="#6b21a8" strokeWidth={0.75}
          data-feature={N.ozone} data-feature-label="ozone layer"
          data-feature-cx={((px0 + px1) / 2) / W} data-feature-cy={((ozoneTop + ozoneBot) / 2) / H}
          data-feature-w={(px1 - px0) / W} data-feature-h={(ozoneBot - ozoneTop) / H}
        />
        <text x={px1 - 10} y={(ozoneTop + ozoneBot) / 2 + 4} fontSize={10} textAnchor="end" fill="#3b0764" fontWeight={700}>Ozone layer</text>
        {/* Ground */}
        <rect x={px0} y={py1} width={px1 - px0} height={10} fill="#5b7f43" />
        {/* Altitude axis (left). */}
        {boundaries.map((bd, i) => (
          <g key={`b-${i}`}>
            <line x1={px0 - 6} y1={bd.y} x2={px0} y2={bd.y} stroke="#374151" strokeWidth={1} />
            <text x={px0 - 10} y={bd.y + 4} fontSize={11} textAnchor="end" fill="#374151">{bd.label}</text>
          </g>
        ))}
        <text x={40} y={(py0 + py1) / 2} fontSize={12} textAnchor="middle" fill="#374151" fontWeight={600} transform={`rotate(-90 40 ${(py0 + py1) / 2})`}>Altitude</text>
        {/* Temperature profile. */}
        <polyline
          points={profile.map((p) => `${p[0]},${p[1]}`).join(' ')}
          fill="none" stroke="#ef4444" strokeWidth={2.5} strokeLinejoin="round"
          data-feature={N.profile} data-feature-label="temperature profile"
          data-feature-cx={((px0 + px1) / 2) / W} data-feature-cy={((py0 + py1) / 2) / H}
          data-feature-w={(px1 - px0) / W} data-feature-h={(py1 - py0) / H}
        />
        {profile.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={2.5} fill="#ef4444" />
        ))}
        <text x={px1 + 16} y={py0 + 40} fontSize={11} fill="#ef4444" fontWeight={700}>Temperature</text>
        <text x={px1 + 16} y={py0 + 54} fontSize={11} fill="#ef4444" fontWeight={700}>profile</text>
        {/* Temp axis hint */}
        <text x={(px0 + px1) / 2} y={H - 8} fontSize={11} textAnchor="middle" fill="#6b7280">Temperature: colder ← → hotter</text>
      </svg>
    </div>
  );
}
