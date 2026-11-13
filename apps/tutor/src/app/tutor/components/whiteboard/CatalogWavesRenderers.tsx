'use client';

import React from 'react';
import {
  dopplerFeatureNames,
  standingWaveFeatureNames,
  interferenceFeatureNames,
  type DopplerFigure,
  type StandingWaveFigure,
  type InterferenceFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/waves';

const BLUE = '#2563eb';
const RED = '#dc2626';
const ORANGE = '#ea580c';
const GRAY = '#94a3b8';
const FAINT = '#cbd5e1';
const INK = '#374151';

// ── doppler_effect ────────────────────────────────────────────────────────────
export function CatalogDopplerRenderer({ figure }: { figure: DopplerFigure }) {
  const N = dopplerFeatureNames;
  const W = 640;
  const H = 372;
  const cy = 176;
  const dir = figure.movingRight ? 1 : -1;
  const nRings = figure.nRings;
  const beta = figure.beta;
  // The largest ring must stay inside the middle band (the side columns hold
  // the observers and their notes), so the wavelength shrinks with more rings.
  const R_MAX = 132;
  const lambda0 = Math.min(34, R_MAX / nRings);
  const rMax = nRings * lambda0;
  // Wavefront k (emitted k periods ago) is centered where the source WAS then:
  // center = source − dir·k·β·λ₀, radius = k·λ₀. Ahead-front spacing λ₀(1−β)
  // (compressed), behind spacing λ₀(1+β) (stretched). The outermost ring is
  // centred on the frame, so the source sits ahead of the centre by n·β·λ₀.
  const sourceX = W / 2 + dir * nRings * beta * lambda0;

  const rings = [];
  for (let k = 1; k <= nRings; k++) {
    const cx = sourceX - dir * k * beta * lambda0;
    rings.push({ cx, r: k * lambda0, k });
  }

  // Motion arrow: starts at the source, drawn over the rings with a white halo.
  const arrowLen = 50;
  const arrowX2 = sourceX + dir * arrowLen;
  const colW = W / 2 - rMax; // width of each side column
  const aheadX = figure.movingRight ? W - colW / 2 : colW / 2;
  const behindX = figure.movingRight ? colW / 2 : W - colW / 2;
  const speed = `${Number(beta.toFixed(2))} × wave speed`;
  const caption = `source moving ${figure.movingRight ? 'right' : 'left'} at v = ${speed}`;
  const capW = caption.length * 6.3 + 18;

  const side = (x: number, color: string, head: string, l1: string, l2: string) => (
    <>
      <text x={x} y={cy - 74} fontSize={13} textAnchor="middle" fill={color} fontWeight={700}>
        <tspan x={x}>{head}</tspan>
        <tspan x={x} dy={16}>wavefronts</tspan>
      </text>
      <text x={x} y={cy - 36} fontSize={11.5} textAnchor="middle" fill={color}>{l1}</text>
      <text x={x} y={cy - 21} fontSize={11.5} textAnchor="middle" fill={color}>{l2}</text>
      {figure.showObservers && (
        <>
          {/* observer: a small listener figure standing clear of the text */}
          <circle cx={x} cy={cy} r={7} fill="#fff" stroke={color} strokeWidth={2} />
          <path d={`M ${x - 9} ${cy + 24} Q ${x - 9} ${cy + 10} ${x} ${cy + 10} Q ${x + 9} ${cy + 10} ${x + 9} ${cy + 24}`} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <text x={x} y={cy + 42} fontSize={11.5} textAnchor="middle" fill={color} fontWeight={600}>observer</text>
        </>
      )}
    </>
  );

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-base font-semibold text-gray-800 mb-2">{figure.title || 'Doppler effect: a moving source'}</div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[680px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Doppler effect'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <marker id="dop-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={INK} />
          </marker>
        </defs>

        {/* wavefront rings */}
        {rings.map((ring) => (
          <circle
            key={ring.k}
            cx={ring.cx}
            cy={cy}
            r={ring.r}
            fill="none"
            stroke={BLUE}
            strokeWidth={nRings > 4 ? 1.6 : 2}
            opacity={0.85}
          />
        ))}

        {/* motion arrow (white underlay so it reads across the rings) */}
        <line x1={sourceX} y1={cy} x2={arrowX2 - dir * 2} y2={cy} stroke="#fff" strokeWidth={7} strokeLinecap="round" />
        <line x1={sourceX} y1={cy} x2={arrowX2} y2={cy} stroke={INK} strokeWidth={2.5} markerEnd="url(#dop-arr)" />
        <text x={sourceX + dir * (arrowLen / 2 + 4)} y={cy - 9} fontSize={15} textAnchor="middle" fill={INK} fontWeight={700} fontStyle="italic" stroke="#fff" strokeWidth={4} paintOrder="stroke" strokeLinejoin="round">
          v
        </text>

        {/* source (named in the caption key, so no label sits among the rings) */}
        <g data-feature={N.source} data-feature-label="Source">
          <circle cx={sourceX} cy={cy} r={6.5} fill={RED} stroke="#fff" strokeWidth={1.5} />
        </g>

        <g data-feature={N.ahead} data-feature-label="Ahead (compressed)">
          {side(aheadX, RED, 'compressed', 'higher frequency', '(higher pitch)')}
        </g>
        <g data-feature={N.behind} data-feature-label="Behind (stretched)">
          {side(behindX, BLUE, 'stretched', 'lower frequency', '(lower pitch)')}
        </g>

        {/* caption with the source key */}
        <circle cx={W / 2 - capW / 2 + 6} cy={H - 20} r={5} fill={RED} />
        <text x={W / 2 - capW / 2 + 18} y={H - 16} fontSize={12} textAnchor="start" fill={INK}>{caption}</text>
      </svg>
    </div>
  );
}

// ── standing_wave ─────────────────────────────────────────────────────────────
export function CatalogStandingWaveRenderer({ figure }: { figure: StandingWaveFigure }) {
  const N = standingWaveFeatureNames;
  const n = figure.harmonic;
  const W = 640;
  const H = 318;
  const PAD = 56;
  const cy = 146;
  const L = W - PAD * 2;
  const A = 92;
  const x0 = PAD;

  // Envelope: y = ± A sin(n π (x - x0)/L)
  const upper: string[] = [];
  const lower: string[] = [];
  const SAMPLES = 240;
  for (let i = 0; i <= SAMPLES; i++) {
    const x = x0 + (i / SAMPLES) * L;
    const s = Math.sin((n * Math.PI * (x - x0)) / L);
    upper.push(`${x.toFixed(1)},${(cy - A * Math.abs(s)).toFixed(1)}`);
    lower.push(`${x.toFixed(1)},${(cy + A * Math.abs(s)).toFixed(1)}`);
  }
  // A representative instantaneous snapshot (signed), dashed.
  const snapshot: string[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const x = x0 + (i / SAMPLES) * L;
    const s = Math.sin((n * Math.PI * (x - x0)) / L);
    snapshot.push(`${x.toFixed(1)},${(cy - A * s).toFixed(1)}`);
  }

  const nodes: number[] = [];
  for (let k = 0; k <= n; k++) nodes.push(x0 + (k * L) / n);
  const antinodes: number[] = [];
  for (let k = 0; k < n; k++) antinodes.push(x0 + ((k + 0.5) * L) / n);

  const ordinal = ['', '1st', '2nd', '3rd', '4th', '5th'][n] || `${n}th`;

  return (
    <div className="w-full flex flex-col items-center">
      {figure.title
        ? <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>
        : <div className="text-base font-semibold text-gray-800 mb-2">{`Standing wave — ${ordinal} harmonic (n = ${n})`}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[680px]"
        data-feature={N.figure}
        data-feature-label={figure.title || `Standing wave (n = ${n})`}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* fixed-end walls */}
        {[x0, x0 + L].map((wx, i) => (
          <g key={i}>
            <line x1={wx} y1={cy - A - 20} x2={wx} y2={cy + A + 20} stroke={INK} strokeWidth={3} />
          </g>
        ))}

        {/* equilibrium axis */}
        <line x1={x0} y1={cy} x2={x0 + L} y2={cy} stroke={GRAY} strokeWidth={1} strokeDasharray="4 4" />

        {/* envelope lobes (filled) */}
        <polygon
          points={`${upper.join(' ')} ${lower.slice().reverse().join(' ')}`}
          fill={BLUE}
          opacity={0.1}
        />
        <polyline points={upper.join(' ')} fill="none" stroke={BLUE} strokeWidth={2.5} />
        <polyline points={lower.join(' ')} fill="none" stroke={BLUE} strokeWidth={2.5} />

        {/* instantaneous snapshot */}
        <polyline points={snapshot.join(' ')} fill="none" stroke={BLUE} strokeWidth={1.5} strokeDasharray="5 4" opacity={0.55} />

        {figure.showNodes && (
          <>
            {/* nodes */}
            <g data-feature={N.nodes} data-feature-label="Nodes">
              {nodes.map((nx, i) => (
                <g key={`nd-${i}`}>
                  <circle cx={nx} cy={cy} r={4.5} fill={RED} stroke="#fff" strokeWidth={1} />
                  <text x={nx} y={cy + A + 38} fontSize={12} textAnchor="middle" fill={RED} fontWeight={700}>N</text>
                </g>
              ))}
            </g>
            {/* antinodes */}
            <g data-feature={N.antinodes} data-feature-label="Antinodes">
              {antinodes.map((ax, i) => (
                <g key={`an-${i}`}>
                  <line x1={ax} y1={cy - A} x2={ax} y2={cy + A} stroke={ORANGE} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
                  <text x={ax} y={cy - A - 8} fontSize={12} textAnchor="middle" fill={ORANGE} fontWeight={700}>A</text>
                </g>
              ))}
            </g>
          </>
        )}

        {figure.showNodes && (
          <text x={W / 2} y={H - 10} fontSize={12} textAnchor="middle" fill={INK}>
            N = node (no motion)   ·   A = antinode (maximum displacement)
          </text>
        )}
      </svg>
    </div>
  );
}

// ── interference_pattern ──────────────────────────────────────────────────────
function hyperbolaPoints(
  aAbs: number,
  c: number,
  branchSign: number,
  cx: number,
  cy: number,
  yMax: number,
): string {
  // x²/a² − y²/b² = 1, foci on the horizontal axis at ±c. branchSign = ±1.
  if (aAbs < 1e-6) {
    // central line (perpendicular bisector)
    return `${cx},${cy - yMax} ${cx},${cy + yMax}`;
  }
  const b2 = c * c - aAbs * aAbs;
  const b = Math.sqrt(Math.max(b2, 1e-6));
  const pts: string[] = [];
  const STEPS = 60;
  for (let i = 0; i <= STEPS; i++) {
    const yy = -yMax + (2 * yMax * i) / STEPS;
    const x = branchSign * aAbs * Math.sqrt(1 + (yy * yy) / (b * b));
    pts.push(`${(cx + x).toFixed(1)},${(cy - yy).toFixed(1)}`);
  }
  return pts.join(' ');
}

export function CatalogInterferenceRenderer({ figure }: { figure: InterferenceFigure }) {
  const N = interferenceFeatureNames;
  const W = 640;
  const H = 452;
  // The pattern lives in its own frame; the legend has a band above it.
  const FX = 24, FY = 40, FW = W - 48, FH = H - FY - 12;
  const cx = W / 2;
  const cy = FY + FH / 2;
  const lambda = figure.wavelength;
  const d = figure.sourceSep;
  const c = d / 2;
  const s1x = cx - c;
  const s2x = cx + c;
  const yMax = FH / 2 + 4;
  // enough rings to fill the frame from either source, so the clip is even
  const ringCount = Math.ceil(Math.hypot(FW / 2 + c, FH / 2) / lambda);
  const halo = { stroke: '#fff', strokeWidth: 4, paintOrder: 'stroke' as const, strokeLinejoin: 'round' as const };

  return (
    <div className="w-full flex flex-col items-center">
      {figure.title
        ? <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>
        : <div className="text-base font-semibold text-gray-800 mb-2">Two-source interference</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[680px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'Interference pattern'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <clipPath id="ifr-clip"><rect x={FX} y={FY} width={FW} height={FH} rx={8} /></clipPath>
        </defs>

        {/* legend band */}
        <g>
          <line x1={W / 2 - 196} y1={18} x2={W / 2 - 166} y2={18} stroke={BLUE} strokeWidth={2.6} />
          <text x={W / 2 - 160} y={22} fontSize={12} fill={BLUE} fontWeight={700}>constructive (antinodal)</text>
          <line x1={W / 2 + 28} y1={18} x2={W / 2 + 58} y2={18} stroke={ORANGE} strokeWidth={2} strokeDasharray="6 5" />
          <text x={W / 2 + 64} y={22} fontSize={12} fill={ORANGE} fontWeight={700}>destructive (nodal)</text>
        </g>

        <rect x={FX} y={FY} width={FW} height={FH} rx={8} fill="#f8fafc" />
        <g clipPath="url(#ifr-clip)">
          {/* concentric wavefronts from each source */}
          {[s1x, s2x].map((sx, si) =>
            Array.from({ length: ringCount }, (_, i) => i + 1).map((k) => (
              <circle
                key={`c-${si}-${k}`}
                cx={sx}
                cy={cy}
                r={k * lambda}
                fill="none"
                stroke={FAINT}
                strokeWidth={1}
              />
            )),
          )}

          {/* nodal (destructive) hyperbolas — dashed */}
          <g data-feature={N.destructive} data-feature-label="Destructive (nodal)">
            {figure.nodalOrders.map((order) => (
              <polyline
                key={`nod-${order}`}
                points={hyperbolaPoints(Math.abs(order) * lambda / 2, c, Math.sign(order), cx, cy, yMax)}
                fill="none"
                stroke={ORANGE}
                strokeWidth={2}
                strokeDasharray="6 5"
              />
            ))}
          </g>

          {/* antinodal (constructive) hyperbolas — solid */}
          <g data-feature={N.constructive} data-feature-label="Constructive (antinodal)">
            {figure.antinodalOrders.map((m) => (
              <polyline
                key={`ant-${m}`}
                points={hyperbolaPoints(Math.abs(m) * lambda / 2, c, m === 0 ? 1 : Math.sign(m), cx, cy, yMax)}
                fill="none"
                stroke={BLUE}
                strokeWidth={2.6}
              />
            ))}
          </g>
        </g>
        <rect x={FX} y={FY} width={FW} height={FH} rx={8} fill="none" stroke={FAINT} strokeWidth={1.2} />

        {/* sources: named on the outer side, on the axis, where no line crosses */}
        <g data-feature={N.sources} data-feature-label="Sources">
          {([[s1x, 'S₁', -1], [s2x, 'S₂', 1]] as [number, string, number][]).map(([sx, lbl, sideSign], i) => (
            <g key={i}>
              <circle cx={sx} cy={cy} r={6.5} fill={RED} stroke="#fff" strokeWidth={1.5} />
              <text x={sx + sideSign * 12} y={cy + 4.5} fontSize={13} textAnchor={sideSign < 0 ? 'end' : 'start'} fill={RED} fontWeight={700} {...halo}>{lbl}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
