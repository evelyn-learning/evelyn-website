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
  const H = 216;
  const cx = W / 2;
  const cy = 84;
  const r = 70;
  const phaseHuman = phase.replace(/_/g, ' ');
  const phaseLabel = phaseHuman.charAt(0).toUpperCase() + phaseHuman.slice(1)
    + (phase === 'new' || phase === 'full' ? ' moon' : '');
  const litPct = Math.round(illuminationFraction * 100);
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
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[320px]">
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
          x={cx} y={cy + r + 28}
          fontSize={15} textAnchor="middle" fill="#1f2937" fontWeight={700}
          data-feature={N.phaseLabel}
          data-feature-label={phaseHuman}
          data-feature-cx={cx / W}
          data-feature-cy={(cy + r + 26) / H}
          data-feature-w={140 / W}
          data-feature-h={20 / H}
        >
          {phaseLabel}
        </text>
        <text x={cx} y={cy + r + 46} fontSize={11.5} textAnchor="middle" fill="#6b7280">
          {`about ${litPct}% of the face we see is lit`}
        </text>
      </svg>
    </div>
  );
}

export function CatalogSolarSystemRenderer({ figure }: { figure: SolarSystemFigure }) {
  const { highlight, title } = figure;
  const N = solarSystemFeatureNames;
  const W = 720;
  const H = 150;
  const cy = 58;
  const nameY = cy + 44; // one baseline for every name, below the largest planet
  const lower = highlight.map((h) => h.toLowerCase());
  return (
    <div
      className="solar-system-renderer w-full flex flex-col items-center"
      data-feature={N.system}
      data-feature-label={title || 'solar system'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[760px]">
        {/* Sun */}
        <circle
          cx={40} cy={cy} r={30}
          fill="#facc15" stroke="#ca8a04" strokeWidth={2}
          data-feature={N.sun}
          data-feature-label="Sun"
          data-feature-cx={40 / W}
          data-feature-cy={cy / H}
          data-feature-w={60 / W}
          data-feature-h={60 / H}
        />
        <text x={40} y={nameY} fontSize={12.5} textAnchor="middle" fill="#92400e" fontWeight={700}>Sun</text>
        {PLANETS.map((p, i) => {
          const x = 112 + i * 80;
          const lit = lower.includes(p.name.toLowerCase());
          return (
            <g key={p.name}>
              {/* highlight halo behind the planet (keeps the planet's own colour readable) */}
              {lit && <circle cx={x} cy={cy} r={p.size + 6} fill="#fee2e2" stroke="#dc2626" strokeWidth={2} />}
              {p.name === 'Saturn' && (
                <ellipse cx={x} cy={cy} rx={p.size + 11} ry={5} fill="none" stroke="#b45309" strokeWidth={2.2} transform={`rotate(-18 ${x} ${cy})`} />
              )}
              <circle
                cx={x} cy={cy} r={p.size}
                fill={p.color} stroke="#374151" strokeWidth={1}
                data-feature={N.planet(p.name)}
                data-feature-label={p.name}
                data-feature-cx={x / W}
                data-feature-cy={cy / H}
                data-feature-w={(p.size * 2 + 8) / W}
                data-feature-h={(p.size * 2 + 8) / H}
              />
              <text x={x} y={nameY} fontSize={12.5} textAnchor="middle" fill={lit ? '#b91c1c' : '#374151'} fontWeight={lit ? 700 : 500}>
                {p.name}
              </text>
            </g>
          );
        })}
        <text x={W / 2} y={H - 10} fontSize={11.5} textAnchor="middle" fill="#6b7280">
          Order from the Sun — sizes and distances are not to scale
        </text>
      </svg>
    </div>
  );
}

function slugLocal(label: string): string {
  return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** Greedy word wrap by character budget (labels are short; no measuring needed). */
function wrapChars(text: string, maxChars: number): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > maxChars) { lines.push(cur); cur = w; }
    else cur = cur ? `${cur} ${w}` : w;
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}

// Outside-in colours for layers that arrive without one: cool rock at the
// surface, hotter towards the centre.
const EARTH_RAMP = ['#8b6b4a', '#b45309', '#dc2626', '#ea580c', '#f59e0b', '#fcd34d', '#fef08a'];
function rampColour(i: number, n: number): string {
  if (n <= 1) return EARTH_RAMP[0];
  const t = (i / (n - 1)) * (EARTH_RAMP.length - 1);
  return EARTH_RAMP[Math.round(t)];
}

export function CatalogEarthLayersRenderer({ figure }: { figure: EarthLayersFigure }) {
  const { layers, title } = figure;
  const N = earthLayersFeatureNames;
  const n = layers.length;
  const cx = 176;
  const maxR = 150;
  const step = maxR / n;
  const labelX = cx + maxR + 44;
  const W = 620;
  const DESC_CHARS = 40;

  // Label blocks (name + optional wrapped description), outermost layer on
  // top. Each leader starts on its ring along one diagonal, so the leaders
  // are ordered like the labels and never cross.
  const blocks = layers.map((l) => {
    const desc = l.description && l.description.trim() ? wrapChars(l.description, DESC_CHARS) : [];
    return { desc, h: 16 + desc.length * 14 };
  });
  const GAP = 9;
  const sinA = Math.min(0.9, Math.max(0.55, 22 / step));
  const cosA = Math.sqrt(1 - sinA * sinA);
  const anchors = layers.map((_, i) => {
    const r = maxR - (i + 0.5) * step;
    return { x: cx + r * cosA, y: -r * sinA }; // y relative to the circle centre
  });
  // Ideal label y = its anchor's y; then push apart top-to-bottom, and centre
  // the column on the anchors so leaders stay short.
  const ys: number[] = [];
  blocks.forEach((b, i) => {
    const ideal = anchors[i].y - 5;
    ys.push(i === 0 ? ideal : Math.max(ideal, ys[i - 1] + blocks[i - 1].h + GAP));
  });
  const colTop = ys[0];
  const colBottom = ys[n - 1] + blocks[n - 1].h;
  const shift = Math.max(0, (colBottom - (anchors[n - 1].y + blocks[n - 1].h)) / 2);
  const top = Math.min(-maxR, colTop - shift) - 14;
  const bottom = Math.max(maxR, colBottom - shift) + 14;
  const H = bottom - top;
  const cy = -top;

  return (
    <div
      className="earth-layers-renderer w-full flex flex-col items-center"
      data-feature={N.earth}
      data-feature-label={title || "Earth's layers"}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {layers.map((l, i) => {
          const rOuter = maxR - i * step;
          const layerName = l.name;
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={rOuter}
              fill={l.color || rampColour(i, n)} stroke="#1f2937" strokeWidth={1}
              data-feature={N.layer(layerName)}
              data-feature-label={layerName}
              data-feature-cx={cx / W}
              data-feature-cy={cy / H}
              data-feature-w={(rOuter * 2) / W}
              data-feature-h={(rOuter * 2) / H}
            />
          );
        })}
        {/* Leaders + labels on the right */}
        {layers.map((l, i) => {
          const a = anchors[i];
          const ly = cy + ys[i] - shift;
          const ay = cy + a.y;
          const elbowX = cx + maxR + 14;
          return (
            <g key={`lbl-${i}`}>
              <polyline
                points={`${a.x},${ay} ${elbowX},${ay} ${labelX - 6},${ly + 5}`}
                fill="none" stroke="#1f2937" strokeWidth={1.1}
              />
              <circle cx={a.x} cy={ay} r={3} fill="#ffffff" stroke="#1f2937" strokeWidth={1.2} />
              <text
                x={labelX}
                y={ly + 10}
                fontSize={13.5}
                fill="#1f2937"
                fontWeight={700}
                data-feature={`label-${slugLocal(l.name)}`}
                data-feature-label={l.name}
                data-feature-cx={(labelX + 50) / W}
                data-feature-cy={(ly + 6) / H}
                data-feature-w={110 / W}
                data-feature-h={18 / H}
              >
                {l.name}
              </text>
              {blocks[i].desc.map((ln, j) => (
                <text key={j} x={labelX} y={ly + 25 + j * 14} fontSize={11.5} fill="#4b5563">{ln}</text>
              ))}
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
  const solar = type === 'solar';
  const W = 660;
  const cy = solar ? 104 : 128;
  const sun = { cx: 62, cy, r: 36 };
  // The body that CASTS the shadow, and the body the shadow FALLS on.
  const caster = solar ? { cx: 400, cy, r: 15 } : { cx: 320, cy, r: 30 };
  const target = solar ? { cx: 560, cy, r: 50 } : { cx: 540, cy, r: 13 };
  const earth = solar ? target : caster;
  const moon = solar ? caster : target;
  const d = caster.cx - sun.cx;
  const endX = solar ? target.cx : W - 16;

  // Tangent-line shadow construction (exact for two circles).
  // Umbra: outer tangents, narrowing behind the caster.
  const sinU = (sun.r - caster.r) / d;
  const cosU = Math.sqrt(1 - sinU * sinU);
  const uStart = { x: caster.cx + caster.r * sinU, h: caster.r * cosU };
  const uHalfAt = (x: number) => Math.max(0, uStart.h - (x - uStart.x) * (sinU / cosU));
  // Penumbra: inner tangents, widening behind the caster.
  const sinP = (sun.r + caster.r) / d;
  const cosP = Math.sqrt(1 - sinP * sinP);
  const pStart = { x: caster.cx - caster.r * sinP, h: caster.r * cosP };
  const pHalfAt = (x: number) => pStart.h + (x - pStart.x) * (sinP / cosP);
  const uEndX = Math.min(endX, uStart.x + uStart.h / (sinU / cosU));

  const label = (x: number, y: number, t: string, weight = 600, size = 13, fill = '#1f2937') => (
    <text x={x} y={y} fontSize={size} textAnchor="middle" fill={fill} fontWeight={weight}>{t}</text>
  );
  const nameY = cy + (solar ? 50 : pHalfAt(endX)) + 22;
  const H = solar ? nameY + 66 : nameY + 12;
  // Call-outs for the two shadow regions, on leaders, in the clear band below.
  const penX = solar ? 474 : 440;
  const umbX = solar ? 500 : 430;

  return (
    <div
      className="eclipse-renderer w-full flex flex-col items-center"
      data-feature={N.eclipse}
      data-feature-label={title || `${type} eclipse`}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[700px]">
        <defs>
          <clipPath id={`ecl-target-${type}`}><circle cx={target.cx} cy={target.cy} r={target.r} /></clipPath>
        </defs>
        {/* sunlight grazing the caster (the rays that bound the shadows) */}
        <g stroke="#f59e0b" strokeWidth={1} opacity={0.7} strokeDasharray="5 4">
          <line x1={sun.cx + sun.r * sinU} y1={cy - sun.r * cosU} x2={uStart.x} y2={cy - uStart.h} />
          <line x1={sun.cx + sun.r * sinU} y1={cy + sun.r * cosU} x2={uStart.x} y2={cy + uStart.h} />
          <line x1={sun.cx + sun.r * sinP} y1={cy - sun.r * cosP} x2={pStart.x} y2={cy + pStart.h} />
          <line x1={sun.cx + sun.r * sinP} y1={cy + sun.r * cosP} x2={pStart.x} y2={cy - pStart.h} />
        </g>
        {/* penumbra (partial shadow) then umbra (full shadow) */}
        <polygon
          points={`${pStart.x},${cy - pStart.h} ${endX},${cy - pHalfAt(endX)} ${endX},${cy + pHalfAt(endX)} ${pStart.x},${cy + pStart.h}`}
          fill="#94a3b8" opacity={0.35}
        />
        <polygon
          points={`${uStart.x},${cy - uStart.h} ${uEndX},${cy - uHalfAt(uEndX)} ${uEndX},${cy + uHalfAt(uEndX)} ${uStart.x},${cy + uStart.h}`}
          fill="#334155" opacity={0.75}
        />
        <line
          x1={sun.cx + sun.r} y1={cy}
          x2={target.cx} y2={cy}
          stroke="#9ca3af" strokeWidth={1} strokeDasharray="2 4" opacity={0.6}
          data-feature={N.alignmentLine}
          data-feature-label="alignment line"
          data-feature-cx={((sun.cx + sun.r + target.cx) / 2) / W}
          data-feature-cy={cy / H}
          data-feature-w={(target.cx - sun.cx - sun.r) / W}
          data-feature-h={12 / H}
        />
        {/* Sun */}
        <circle
          cx={sun.cx} cy={sun.cy} r={sun.r}
          fill="#facc15" stroke="#ca8a04" strokeWidth={2}
          data-feature={N.sun}
          data-feature-label="Sun"
          data-feature-cx={sun.cx / W}
          data-feature-cy={sun.cy / H}
          data-feature-w={(sun.r * 2) / W}
          data-feature-h={(sun.r * 2) / H}
        />
        {label(sun.cx, cy + sun.r + 20, 'Sun')}
        {/* Earth */}
        <circle
          cx={earth.cx} cy={earth.cy} r={earth.r}
          fill="#3b82f6" stroke="#1e3a8a" strokeWidth={1.5}
          data-feature={N.earth}
          data-feature-label="Earth"
          data-feature-cx={earth.cx / W}
          data-feature-cy={earth.cy / H}
          data-feature-w={(earth.r * 2) / W}
          data-feature-h={(earth.r * 2) / H}
        />
        {/* Moon — dim red inside Earth's umbra during a lunar eclipse */}
        <circle
          cx={moon.cx} cy={moon.cy} r={moon.r}
          fill={solar ? '#475569' : '#b4533c'} stroke={solar ? '#1f2937' : '#7f1d1d'} strokeWidth={1.5}
          data-feature={N.moon}
          data-feature-label="Moon"
          data-feature-cx={moon.cx / W}
          data-feature-cy={moon.cy / H}
          data-feature-w={(moon.r * 2 + 8) / W}
          data-feature-h={(moon.r * 2 + 8) / H}
        />
        {solar && (
          // Where the shadows land on Earth's day side.
          <g clipPath={`url(#ecl-target-${type})`}>
            <ellipse cx={earth.cx - earth.r} cy={cy} rx={13} ry={pHalfAt(earth.cx - earth.r + 6)} fill="#0f172a" opacity={0.3} />
            <ellipse cx={earth.cx - earth.r} cy={cy} rx={7} ry={Math.max(4, uHalfAt(earth.cx - earth.r + 3))} fill="#0f172a" opacity={0.85} />
          </g>
        )}
        {solar ? (
          <>
            {label(moon.cx, cy - moon.r - 12, 'Moon')}
            {label(earth.cx, cy + earth.r + 20, 'Earth')}
          </>
        ) : (
          <>
            {label(earth.cx, cy + earth.r + 20, 'Earth')}
            <text x={moon.cx + moon.r + 8} y={cy + 4.5} fontSize={13} fill="#ffffff" fontWeight={600}>Moon</text>
          </>
        )}
        {/* shadow call-outs */}
        {solar ? (
          // Little room between Moon and Earth: labels on leaders, in the clear band below.
          <g fontSize={12.5} fontWeight={600}>
            <line x1={umbX} y1={cy + 4} x2={umbX - 60} y2={nameY + 4} stroke="#334155" strokeWidth={1} />
            <circle cx={umbX} cy={cy + 4} r={2.5} fill="#ffffff" stroke="#334155" />
            <text x={umbX - 64} y={nameY + 18} textAnchor="end" fill="#1f2937">Umbra — total eclipse seen here</text>
            <line x1={penX} y1={cy + pHalfAt(penX) - 6} x2={penX + 10} y2={nameY + 24} stroke="#64748b" strokeWidth={1} />
            <circle cx={penX} cy={cy + pHalfAt(penX) - 6} r={2.5} fill="#ffffff" stroke="#64748b" />
            <text x={penX + 14} y={nameY + 38} textAnchor="middle" fill="#475569">Penumbra — partial eclipse</text>
          </g>
        ) : (
          // Earth's shadow is wide: the names go inside the regions they name.
          <g fontSize={12.5} fontWeight={600}>
            <text x={(earth.cx + earth.r + moon.cx - moon.r) / 2} y={cy - uHalfAt(430) / 2 - 1} textAnchor="middle" fill="#ffffff">Umbra (full shadow)</text>
            <text x={penX + 70} y={cy - (uHalfAt(penX + 70) + pHalfAt(penX + 70)) / 2 + 4} textAnchor="middle" fill="#334155">Penumbra (partial shadow)</text>
          </g>
        )}
        <text x={W / 2} y={H - 8} fontSize={11.5} textAnchor="middle" fill="#6b7280">
          {solar
            ? 'Solar eclipse: the Moon passes between the Sun and Earth — not to scale'
            : "Lunar eclipse: Earth passes between the Sun and the Moon — not to scale"}
        </text>
      </svg>
    </div>
  );
}

const SEASON_COLOUR: Record<string, string> = { Summer: '#dc2626', Autumn: '#b45309', Winter: '#2563eb', Spring: '#15803d' };

export function CatalogSeasonsDiagramRenderer({ figure }: { figure: SeasonsDiagramFigure }) {
  const { hemisphere, title } = figure;
  const N = seasonsDiagramFeatureNames;
  const W = 680;
  const H = 356;
  const cx = W / 2;
  const cy = 168;
  const orbitRx = 178;
  const orbitRy = 88;
  const north = hemisphere === 'northern';
  // Earth's axis leans the SAME way (north end to the right) at every point of
  // the orbit. On the right of the Sun the north end leans AWAY from it
  // (December); on the left it leans TOWARD it (June). The seasons follow
  // from that, and are opposite in the two hemispheres.
  const stops = [
    { month: 'December', deg: 0, northSeason: 'Winter', southSeason: 'Summer', tilt: north ? 'away from' : 'toward' },
    { month: 'March', deg: 270, northSeason: 'Spring', southSeason: 'Autumn', tilt: '' },
    { month: 'June', deg: 180, northSeason: 'Summer', southSeason: 'Winter', tilt: north ? 'toward' : 'away from' },
    { month: 'September', deg: 90, northSeason: 'Autumn', southSeason: 'Spring', tilt: '' },
  ].map((s) => ({ ...s, name: north ? s.northSeason : s.southSeason }));
  const pole = north ? 'North Pole' : 'South Pole';
  const TILT = (23.5 * Math.PI) / 180;
  const R = 17;
  const ax = Math.sin(TILT), ay = Math.cos(TILT);
  // Direction-of-travel arrowheads on the orbit (anticlockwise seen from the north).
  const travel = [315, 225, 135, 45].map((deg) => {
    const a = (deg * Math.PI) / 180;
    const x = cx + orbitRx * Math.cos(a), y = cy + orbitRy * Math.sin(a);
    const rot = (Math.atan2(-orbitRy * Math.cos(a), orbitRx * Math.sin(a)) * 180) / Math.PI;
    return { x, y, rot };
  });
  return (
    <div
      className="seasons-renderer w-full flex flex-col items-center"
      data-feature={N.orbit}
      data-feature-label={title || 'seasons diagram'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[700px]">
        <ellipse cx={cx} cy={cy} rx={orbitRx} ry={orbitRy} fill="none" stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="4 4" />
        {travel.map((t, i) => (
          <path key={i} d="M -6 -5 L 6 0 L -6 5 z" fill="#9ca3af" transform={`translate(${t.x} ${t.y}) rotate(${t.rot})`} />
        ))}
        <circle
          cx={cx} cy={cy} r={24}
          fill="#facc15" stroke="#ca8a04" strokeWidth={2}
          data-feature={N.sun}
          data-feature-label="Sun"
          data-feature-cx={cx / W}
          data-feature-cy={cy / H}
          data-feature-w={48 / W}
          data-feature-h={48 / H}
        />
        <text x={cx} y={cy + 4.5} fontSize={12.5} textAnchor="middle" fill="#7c2d12" fontWeight={700}>Sun</text>
        {stops.map((s, i) => {
          const a = (s.deg * Math.PI) / 180;
          const x = cx + orbitRx * Math.cos(a);
          const y = cy + orbitRy * Math.sin(a);
          const season = s.name;
          const colour = SEASON_COLOUR[season];
          const side = s.deg === 0 ? 'right' : s.deg === 180 ? 'left' : s.deg === 270 ? 'top' : 'bottom';
          const anchor = side === 'right' ? 'start' : side === 'left' ? 'end' : 'middle';
          const tx = side === 'right' ? R + 16 : side === 'left' ? -(R + 16) : 0;
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              {/* a white disc first, so the dashed orbit does not run through the globe */}
              <circle r={R + 3} fill="#ffffff" />
              <circle
                r={R}
                fill="#3b82f6" stroke="#1e3a8a" strokeWidth={1.8}
                data-feature={N.season(s.name)}
                data-feature-label={season}
                data-feature-cx={x / W}
                data-feature-cy={y / H}
                data-feature-w={60 / W}
                data-feature-h={64 / H}
              />
              {/* equator, then the tilted axis poking out of both poles */}
              <line x1={-R * ay} y1={-R * ax} x2={R * ay} y2={R * ax} stroke="#bfdbfe" strokeWidth={1.2} />
              <line x1={-(R + 9) * ax} y1={(R + 9) * ay} x2={(R + 9) * ax} y2={-(R + 9) * ay} stroke="#111827" strokeWidth={1.8} />
              <text x={(R + 9) * ax + 4} y={-(R + 9) * ay + 1} fontSize={10.5} fill="#111827" fontWeight={700}>N</text>
              {side === 'top' && (
                <text y={-(R + 20)} textAnchor="middle" fontSize={13} fontWeight={700} stroke="#ffffff" strokeWidth={4} paintOrder="stroke">
                  <tspan fill="#1f2937">{s.month} · </tspan><tspan fill={colour}>{season}</tspan>
                </text>
              )}
              {side === 'bottom' && (
                <text y={R + 30} textAnchor="middle" fontSize={13} fontWeight={700} stroke="#ffffff" strokeWidth={4} paintOrder="stroke">
                  <tspan fill="#1f2937">{s.month} · </tspan><tspan fill={colour}>{season}</tspan>
                </text>
              )}
              {(side === 'left' || side === 'right') && (
                <g textAnchor={anchor}>
                  <text x={tx} y={-10} fontSize={13} fontWeight={700} fill="#1f2937">{s.month}</text>
                  <text x={tx} y={7} fontSize={14} fontWeight={700} fill={colour}>{season}</text>
                  <text x={tx} y={23} fontSize={11} fill="#4b5563">{pole} tilted</text>
                  <text x={tx} y={36} fontSize={11} fill="#4b5563">{s.tilt} the Sun</text>
                </g>
              )}
            </g>
          );
        })}
        <text x={cx} y={H - 26} fontSize={12.5} textAnchor="middle" fill="#374151" fontWeight={600}>
          {`Seasons in the ${north ? 'Northern' : 'Southern'} Hemisphere`}
        </text>
        <text x={cx} y={H - 9} fontSize={11.5} textAnchor="middle" fill="#6b7280">
          Earth&apos;s axis stays tilted 23.5° in the same direction all year — not to scale
        </text>
      </svg>
    </div>
  );
}

const PT = {
  ocean: '#57534e', oceanEdge: '#292524',
  cont: '#b08968', contEdge: '#5c4033',
  mantle: '#fed7aa', mantleEdge: '#fdba74',
  magma: '#dc2626', ink: '#1f2937',
};

function PlateArrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hx = x2 - 11 * Math.cos(a), hy = y2 - 11 * Math.sin(a);
  const px = -Math.sin(a) * 6.5, py = Math.cos(a) * 6.5;
  return (
    <g>
      <line x1={x1} y1={y1} x2={hx} y2={hy} stroke={PT.ink} strokeWidth={3.2} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${hx + px},${hy + py} ${hx - px},${hy - py}`} fill={PT.ink} />
    </g>
  );
}

export function CatalogPlateTectonicsRenderer({ figure }: { figure: PlateTectonicsFigure }) {
  const { boundary, labels, title } = figure;
  const N = plateTectonicsFeatureNames;
  const W = 640;
  const H = 330;
  const leftLabel = labels?.left || 'Plate A';
  const rightLabel = labels?.right || 'Plate B';
  const mid = W / 2;
  const top = 96;      // plate surface
  const base = 146;    // underside of the plates
  const floor = 236;   // bottom of the drawn mantle
  const nameY = floor + 26;
  const plateName = (x: number, text: string) => {
    const lines = wrapChars(text, 34);
    return (
      <text fontSize={13.5} textAnchor="middle" fill={PT.ink} fontWeight={700}>
        {lines.map((ln, i) => <tspan key={i} x={x} y={nameY + i * 16}>{ln}</tspan>)}
      </text>
    );
  };
  const note = (x: number, y: number, text: string, anchor: 'start' | 'middle' | 'end' = 'middle', fill = PT.ink) => (
    <text x={x} y={y} fontSize={12} textAnchor={anchor} fill={fill} fontWeight={600} stroke="#ffffff" strokeWidth={3.5} paintOrder="stroke" strokeLinejoin="round">{text}</text>
  );
  const featA = { 'data-feature-label': leftLabel, 'data-feature-cx': 0.25, 'data-feature-cy': ((top + base) / 2) / H, 'data-feature-w': 0.42, 'data-feature-h': (base - top) / H };
  const featB = { 'data-feature-label': rightLabel, 'data-feature-cx': 0.75, 'data-feature-cy': ((top + base) / 2) / H, 'data-feature-w': 0.42, 'data-feature-h': (base - top) / H };
  const caption = boundary === 'divergent' ? 'Divergent boundary — the plates move apart'
    : boundary === 'convergent' ? 'Convergent boundary — the plates move together'
    : 'Transform boundary — the plates slide past each other';

  let body: React.ReactNode;
  if (boundary === 'transform') {
    // MAP VIEW (from above): the fault runs up the page, the two plates move
    // in opposite directions along it, and a marker line is offset across it.
    const t = 70, b = 236;
    body = (
      <>
        <rect x={24} y={t} width={mid - 24} height={b - t} fill="#d6c2a5" stroke={PT.contEdge} strokeWidth={1.5} data-feature={N.plateA} {...featA} />
        <rect x={mid} y={t} width={mid - 24} height={b - t} fill="#c4a882" stroke={PT.contEdge} strokeWidth={1.5} data-feature={N.plateB} {...featB} />
        {/* a road / river that used to be straight, now offset by the fault */}
        <line x1={24} y1={176} x2={mid} y2={176} stroke="#2563eb" strokeWidth={4} />
        <line x1={mid} y1={128} x2={W - 24} y2={128} stroke="#2563eb" strokeWidth={4} />
        <line x1={mid} y1={t - 10} x2={mid} y2={b + 10} stroke={PT.magma} strokeWidth={3} strokeDasharray="9 5" />
        <PlateArrow x1={mid - 40} y1={86} x2={mid - 40} y2={154} />
        <PlateArrow x1={mid + 40} y1={222} x2={mid + 40} y2={152} />
        {note(mid, t - 16, 'Fault (transform boundary)', 'middle', PT.magma)}
        {note(110, 168, 'offset feature', 'middle', '#1d4ed8')}
        {note(36, t + 18, 'Map view — seen from above', 'start', '#57534e')}
      </>
    );
  } else if (boundary === 'divergent') {
    const gap = 26;
    body = (
      <>
        {/* mantle with rising magma */}
        <rect x={24} y={base - 6} width={W - 48} height={floor - base + 6} fill={PT.mantle} stroke={PT.mantleEdge} strokeWidth={1} />
        <path d={`M ${mid - 60} ${floor} C ${mid - 30} ${floor - 30} ${mid - gap} ${base + 20} ${mid - gap / 2} ${top + 6} L ${mid + gap / 2} ${top + 6} C ${mid + gap} ${base + 20} ${mid + 30} ${floor - 30} ${mid + 60} ${floor} Z`} fill={PT.magma} opacity={0.85} />
        {/* the two plates, thinned and raised towards the ridge */}
        <path d={`M 24 ${top} L ${mid - 90} ${top} L ${mid - gap / 2} ${top - 16} L ${mid - gap / 2 - 8} ${base - 18} L ${mid - 90} ${base} L 24 ${base} Z`} fill={PT.ocean} stroke={PT.oceanEdge} strokeWidth={1.5} strokeLinejoin="round" data-feature={N.plateA} {...featA} />
        <path d={`M ${W - 24} ${top} L ${mid + 90} ${top} L ${mid + gap / 2} ${top - 16} L ${mid + gap / 2 + 8} ${base - 18} L ${mid + 90} ${base} L ${W - 24} ${base} Z`} fill={PT.ocean} stroke={PT.oceanEdge} strokeWidth={1.5} strokeLinejoin="round" data-feature={N.plateB} {...featB} />
        <PlateArrow x1={mid - 70} y1={top - 34} x2={mid - 150} y2={top - 34} />
        <PlateArrow x1={mid + 70} y1={top - 34} x2={mid + 150} y2={top - 34} />
        {note(mid, top - 62, 'Ridge / rift: new crust forms here')}
        <line x1={mid} y1={top - 56} x2={mid} y2={top - 14} stroke={PT.ink} strokeWidth={1} />
        {note(mid, floor - 14, 'Magma rises', 'middle', '#7f1d1d')}
        {note(100, floor - 40, 'Mantle', 'middle', '#9a3412')}
      </>
    );
  } else {
    // convergent: the left plate bends down under the right one (subduction)
    const tr = mid - 10; // trench x
    body = (
      <>
        <rect x={24} y={base - 6} width={W - 48} height={floor - base + 6} fill={PT.mantle} stroke={PT.mantleEdge} strokeWidth={1} />
        {/* subducting slab */}
        <path d={`M 24 ${top + 8} L ${tr - 40} ${top + 8} Q ${tr + 6} ${top + 10} ${tr + 50} ${base + 10} L ${tr + 150} ${floor - 4} L ${tr + 112} ${floor - 4} L ${tr + 20} ${base + 32} Q ${tr - 14} ${base + 2} ${tr - 50} ${base} L 24 ${base} Z`} fill={PT.ocean} stroke={PT.oceanEdge} strokeWidth={1.5} strokeLinejoin="round" data-feature={N.plateA} {...featA} />
        {/* overriding plate with a volcanic mountain */}
        <path d={`M ${tr + 6} ${top + 14} L ${tr + 40} ${top - 6} L ${tr + 96} ${top - 6} L ${tr + 128} ${top - 46} L ${tr + 160} ${top - 6} L ${W - 24} ${top - 6} L ${W - 24} ${base} L ${tr + 92} ${base} Z`} fill={PT.cont} stroke={PT.contEdge} strokeWidth={1.5} strokeLinejoin="round" data-feature={N.plateB} {...featB} />
        {/* melt rising from the slab to the volcano */}
        <path d={`M ${tr + 122} ${floor - 30} C ${tr + 112} ${base + 20} ${tr + 136} ${base - 10} ${tr + 128} ${top - 38}`} fill="none" stroke={PT.magma} strokeWidth={5} strokeLinecap="round" opacity={0.9} />
        <circle cx={tr + 122} cy={floor - 32} r={8} fill={PT.magma} opacity={0.9} />
        <PlateArrow x1={90} y1={top - 30} x2={170} y2={top - 30} />
        <PlateArrow x1={W - 70} y1={top - 44} x2={W - 150} y2={top - 44} />
        <line x1={tr + 4} y1={top - 30} x2={tr + 4} y2={top + 8} stroke={PT.ink} strokeWidth={1} />
        {note(tr + 4, top - 36, 'Trench')}
        {note(tr + 128, top - 56, 'Volcanoes / mountains')}
        {note(tr + 30, floor - 14, 'Subduction: one plate sinks', 'end', '#1f2937')}
        {note(W - 80, floor - 40, 'Mantle', 'middle', '#9a3412')}
      </>
    );
  }

  return (
    <div
      className="plate-tectonics-renderer w-full flex flex-col items-center"
      data-feature={N.boundary}
      data-feature-label={title || `${boundary} boundary`}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[680px]">
        {body}
        {plateName(W / 4, leftLabel)}
        {plateName((3 * W) / 4, rightLabel)}
        <text
          x={W / 2} y={H - 12}
          fontSize={13} textAnchor="middle" fill="#b91c1c" fontWeight={700}
          data-feature={N.boundaryLabel}
          data-feature-label={`${boundary} boundary`}
          data-feature-cx={0.5}
          data-feature-cy={(H - 16) / H}
          data-feature-w={360 / W}
          data-feature-h={20 / H}
        >
          {caption}
        </text>
      </svg>
    </div>
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
  const W = 760;
  const H = 444;
  const bx = 150;
  const bw = 400;
  const bxR = bx + bw;
  const bTop = 70;
  const bBot = 380;
  const unconfY = 110;
  // Strata top→bottom (youngest at top, oldest at bottom = superposition).
  const strata = [
    { id: 'conglomerate', name: 'Conglomerate', color: '#cdb173', yTop: bTop, yBot: unconfY },
    { id: 'limestone', name: 'Limestone', color: '#a9cdd9', yTop: unconfY, yBot: 178 },
    { id: 'shale', name: 'Shale', color: '#818893', yTop: 178, yBot: 246 },
    { id: 'sandstone', name: 'Sandstone', color: '#e3c178', yTop: 246, yBot: 314 },
    { id: 'basement', name: 'Granite (basement)', color: '#bd8a8a', yTop: 314, yBot: bBot },
  ];
  // The fault plane dips down to the RIGHT, so the right-hand block rests on
  // it: right = hanging wall, left = footwall. The right block stays put (its
  // layers line up with the labels); the footwall is drawn displaced.
  //   normal fault  — hanging wall moved DOWN  ⇒ footwall sits higher
  //   reverse fault — hanging wall moved UP    ⇒ footwall sits lower
  const THROW = 26;
  const dyLeft = showFault ? (faultType === 'normal' ? -THROW : THROW) : 0;
  const fTopX = bx + bw * 0.5;
  const fBotX = bx + bw * 0.62;
  const faultX = (y: number) => fTopX + ((fBotX - fTopX) * (y - bTop)) / (bBot - bTop);
  // Intrusion (dike) — narrow igneous column cutting up through the left block.
  const dikeX = bx + 78;
  const dikeTop = 150;
  const dikePts = `${dikeX - 9},${bBot + 40} ${dikeX + 9},${bBot + 40} ${dikeX + 29},${dikeTop} ${dikeX + 13},${dikeTop}`;

  const StrataGroup = () => (
    <>
      {/* the surface layer and the basement run on past the block edges, so a
          displaced block never shows a gap */}
      <rect x={bx} y={bTop - 60} width={bw} height={60} fill={strata[0].color} />
      <rect x={bx} y={bBot} width={bw} height={60} fill={strata[strata.length - 1].color} />
      {strata.map((s) => (
        <rect key={s.id} x={bx} y={s.yTop} width={bw} height={s.yBot - s.yTop} fill={s.color} />
      ))}
      {showUnconformity && (
        <path d={wavyPath(bx, bxR, unconfY)} fill="none" stroke="#5b3a1e" strokeWidth={2.5} />
      )}
    </>
  );
  const motionArrow = (x: number, yFrom: number, yTo: number, key: string) => {
    // short arrow parallel to the fault, offset to one side of it
    const dir = yTo > yFrom ? 1 : -1;
    const x2 = x + (faultX(yTo) - faultX(yFrom));
    return (
      <g key={key}>
        <line x1={x} y1={yFrom} x2={x2} y2={yTo - dir * 8} stroke="#111827" strokeWidth={2.4} strokeLinecap="round" />
        <polygon points={`${x2},${yTo} ${x2 - 5.5},${yTo - dir * 10} ${x2 + 5.5},${yTo - dir * 10}`} fill="#111827" />
      </g>
    );
  };
  const hangingDown = faultType === 'normal';
  const midY = (bTop + bBot) / 2;
  const halo = { stroke: '#ffffff', strokeWidth: 3.5, paintOrder: 'stroke' as const, strokeLinejoin: 'round' as const };

  return (
    <div
      className="geologic-cross-section-renderer w-full flex flex-col items-center"
      data-feature={N.section}
      data-feature-label={title || 'geologic cross-section'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[760px]">
        <defs>
          <clipPath id="geo-block">
            <rect x={bx} y={bTop} width={bw} height={bBot - bTop} />
          </clipPath>
          <clipPath id="geo-left">
            <path d={`M ${bx} ${bTop} L ${fTopX} ${bTop} L ${fBotX} ${bBot} L ${bx} ${bBot} Z`} />
          </clipPath>
          <clipPath id="geo-right">
            <path d={`M ${fTopX} ${bTop} L ${bxR} ${bTop} L ${bxR} ${bBot} L ${fBotX} ${bBot} Z`} />
          </clipPath>
        </defs>
        {showFault ? (
          <>
            {/* Right (hanging-wall) block — drawn in place. */}
            <g clipPath="url(#geo-right)"><StrataGroup /></g>
            {/* Left (footwall) block — displaced along the fault, dike included. */}
            <g clipPath="url(#geo-left)">
              <g transform={`translate(0 ${dyLeft})`}>
                <StrataGroup />
                <polygon points={dikePts} fill="#6d2f1a" stroke="#3f1a0e" strokeWidth={1} />
              </g>
            </g>
          </>
        ) : (
          <g clipPath="url(#geo-block)">
            <StrataGroup />
            <polygon points={dikePts} fill="#6d2f1a" stroke="#3f1a0e" strokeWidth={1} />
          </g>
        )}
        {/* Igneous intrusion scribble target. */}
        <rect
          x={dikeX - 12} y={dikeTop + dyLeft} width={44} height={bBot - dikeTop - dyLeft}
          fill="transparent"
          data-feature={N.intrusion}
          data-feature-label="igneous intrusion"
          data-feature-cx={(dikeX + 10) / W}
          data-feature-cy={((dikeTop + dyLeft + bBot) / 2) / H}
          data-feature-w={44 / W}
          data-feature-h={(bBot - dikeTop - dyLeft) / H}
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
              data-feature-w={56 / W}
              data-feature-h={(bBot - bTop) / H}
            />
            {/* relative motion on each side of the fault */}
            {hangingDown
              ? [motionArrow(faultX(midY - 22) + 18, midY - 22, midY + 22, 'hw'), motionArrow(faultX(midY + 22) - 18, midY + 22, midY - 22, 'fw')]
              : [motionArrow(faultX(midY + 22) + 18, midY + 22, midY - 22, 'hw'), motionArrow(faultX(midY - 22) - 18, midY - 22, midY + 22, 'fw')]}
            <text x={fBotX - 20} y={bBot - 10} fontSize={11.5} textAnchor="end" fill="#1f2937" fontWeight={700} {...halo}>Footwall</text>
            <text x={fBotX + 14} y={bBot - 10} fontSize={11.5} textAnchor="start" fill="#1f2937" fontWeight={700} {...halo}>Hanging wall</text>
          </>
        )}
        {/* Right-side strata labels (the right block is never displaced). */}
        {strata.map((s) => {
          const my = (s.yTop + s.yBot) / 2;
          return (
            <g key={`lbl-${s.id}`}>
              <line x1={bxR} y1={my} x2={bxR + 16} y2={my} stroke="#6b7280" strokeWidth={1} />
              <text x={bxR + 20} y={my + 4} fontSize={12.5} fill="#1f2937" fontWeight={600}>{s.name}</text>
            </g>
          );
        })}
        {/* Age arrow: superposition */}
        <g>
          <line x1={W - 34} y1={bBot - 6} x2={W - 34} y2={bTop + 14} stroke="#6b7280" strokeWidth={1.5} />
          <polygon points={`${W - 34},${bTop + 4} ${W - 39},${bTop + 15} ${W - 29},${bTop + 15}`} fill="#6b7280" />
          <text x={W - 34} y={bTop - 4} fontSize={11} textAnchor="middle" fill="#6b7280" fontWeight={600}>younger</text>
          <text x={W - 34} y={bBot + 10} fontSize={11} textAnchor="middle" fill="#6b7280" fontWeight={600}>older</text>
        </g>
        {/* Structure callouts. */}
        {showUnconformity && (
          <g data-feature={N.unconformity} data-feature-label="unconformity"
            data-feature-cx={(bx - 60) / W} data-feature-cy={(unconfY + dyLeft) / H} data-feature-w={120 / W} data-feature-h={30 / H}>
            <line x1={bx - 16} y1={Math.max(bTop + 4, unconfY + dyLeft)} x2={bx} y2={Math.max(bTop + 4, unconfY + dyLeft)} stroke="#5b3a1e" strokeWidth={1.5} />
            <text x={bx - 20} y={Math.max(bTop + 4, unconfY + dyLeft) + 1} fontSize={12.5} textAnchor="end" fill="#5b3a1e" fontWeight={700}>Unconformity</text>
            <text x={bx - 20} y={Math.max(bTop + 4, unconfY + dyLeft) + 15} fontSize={11} textAnchor="end" fill="#5b3a1e">(buried erosion surface)</text>
          </g>
        )}
        {showFault && (
          <text x={fTopX} y={bTop - 10} fontSize={12.5} textAnchor="middle" fill="#b91c1c" fontWeight={700}>
            {faultType === 'normal' ? 'Normal fault — hanging wall moved down' : 'Reverse fault — hanging wall moved up'}
          </text>
        )}
        <line x1={dikeX} y1={bBot} x2={dikeX} y2={bBot + 10} stroke="#6d2f1a" strokeWidth={1.5} />
        <text x={dikeX} y={bBot + 24} fontSize={12.5} textAnchor="middle" fill="#6d2f1a" fontWeight={700}>Igneous intrusion (dike)</text>
        <text x={bx + bw / 2} y={H - 10} fontSize={11.5} textAnchor="middle" fill="#6b7280">Oldest layer at the bottom — law of superposition</text>
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
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
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
          <text x={tempToX(5800) + 12} y={lumToY(1) + 4} fontSize={12} fill="#fde047" fontWeight={700}>Sun</text>
        </g>
        {/* Axis labels */}
        <text x={(px0 + px1) / 2} y={py1 + 34} fontSize={12} textAnchor="middle" fill="#374151" fontWeight={600}>Surface temperature (K) — hot ← → cool</text>
        <text x={22} y={(py0 + py1) / 2} fontSize={12} textAnchor="middle" fill="#374151" fontWeight={600} transform={`rotate(-90 22 ${(py0 + py1) / 2})`}>Luminosity (Sun = 1)</text>
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
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
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
        <Leader x1={230} y1={250} x2={158} y2={252} text="Lava & ash layers" anchor="end" />
        {showSideVent && <Leader x1={470} y1={250} x2={600} y2={224} text="Side vent" />}
      </svg>
    </div>
  );
}

function Leader({ x1, y1, x2, y2, text, anchor = 'start' }: { x1: number; y1: number; x2: number; y2: number; text: string; anchor?: 'start' | 'end' }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffffff" strokeWidth={3} opacity={0.7} />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth={1.2} />
      <circle cx={x1} cy={y1} r={3} fill="#ffffff" stroke="#374151" strokeWidth={1.2} />
      <text x={anchor === 'end' ? x2 - 5 : x2 + 5} y={y2 + 4.5} fontSize={13} textAnchor={anchor} fill="#1f2937" fontWeight={700} stroke="#ffffff" strokeWidth={4} paintOrder="stroke" strokeLinejoin="round">{text}</text>
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
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[700px]">
        {/* Layer bands */}
        {bands.map((b, i) => {
          const meta = atmosphereLayerMeta[i];
          const yTop = bandTop(i);
          const dimmed = highlight && highlight !== b.id ? 0.55 : 1;
          return (
            <g key={b.id} opacity={dimmed}>
              <rect
                x={px0} y={yTop} width={px1 - px0} height={bandH}
                fill={b.color} stroke="#ffffff" strokeWidth={0.75}
                data-feature={N.layer(meta.id)} data-feature-label={meta.name}
                data-feature-cx={((px0 + px1) / 2) / W} data-feature-cy={(yTop + bandH / 2) / H}
                data-feature-w={(px1 - px0) / W} data-feature-h={bandH / H}
              />
              {(() => {
                // The name goes in whichever left corner of the band the
                // temperature line stays further away from (and clear of the
                // ozone strip in the middle of the stratosphere).
                const [xa, ya] = profile[i];
                const [xb, yb] = profile[i + 1];
                const lineXAt = (y: number) => xa + ((xb - xa) * (y - ya)) / (yb - ya || 1);
                const topY = yTop + 19;
                const botY = yTop + bandH - 9;
                const y = lineXAt(topY - 4) >= lineXAt(botY - 4) ? topY : botY;
                return <text x={px0 + 12} y={y} fontSize={13.5} fill={b.text} fontWeight={700}>{b.name}</text>;
              })()}
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
        <text x={px1 - 10} y={(ozoneTop + ozoneBot) / 2 + 4} fontSize={11.5} textAnchor="end" fill="#3b0764" fontWeight={700}>Ozone layer</text>
        {/* Ground */}
        <rect x={px0} y={py1} width={px1 - px0} height={10} fill="#5b7f43" />
        {/* Altitude axis (left). */}
        {boundaries.map((bd, i) => (
          <g key={`b-${i}`}>
            <line x1={px0 - 6} y1={bd.y} x2={px0} y2={bd.y} stroke="#374151" strokeWidth={1} />
            <text x={px0 - 10} y={bd.y + 4} fontSize={11} textAnchor="end" fill="#374151">{bd.label}</text>
          </g>
        ))}
        <text x={40} y={(py0 + py1) / 2} fontSize={12} textAnchor="middle" fill="#374151" fontWeight={600} transform={`rotate(-90 40 ${(py0 + py1) / 2})`}>Altitude (not to scale)</text>
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
