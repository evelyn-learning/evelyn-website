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
  const H = 380;
  const cy = 208;
  const dir = figure.movingRight ? 1 : -1;
  const lambda0 = 30;
  const nRings = figure.nRings;
  const beta = figure.beta;
  const rMax = nRings * lambda0;
  // Wavefront k (emitted k periods ago) is centered where the source WAS then:
  // center = source − dir·k·β·λ₀, radius = k·λ₀. Ahead-front spacing λ₀(1−β)
  // (compressed), behind spacing λ₀(1+β) (stretched). The rings' bounding box
  // has width 2·rMax and midpoint (source − dir·rMax·β), so anchor the source
  // to center that box in the frame.
  const sourceX = W / 2 + dir * nRings * beta * lambda0;

  const rings = [];
  for (let k = 1; k <= nRings; k++) {
    const cx = sourceX - dir * k * beta * lambda0;
    rings.push({ cx, r: k * lambda0, k });
  }

  const arrowX2 = sourceX + dir * 56;
  const aheadX = figure.movingRight ? W - 24 : 24;
  const behindX = figure.movingRight ? 24 : W - 24;
  const aheadAnchor: 'start' | 'end' = figure.movingRight ? 'end' : 'start';
  const behindAnchor: 'start' | 'end' = figure.movingRight ? 'start' : 'end';

  return (
    <div className="w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
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
            strokeWidth={2}
            opacity={0.85}
          />
        ))}

        {/* motion arrow */}
        <line x1={sourceX} y1={cy} x2={arrowX2} y2={cy} stroke={INK} strokeWidth={2.5} markerEnd="url(#dop-arr)" />
        <text x={sourceX + dir * 30} y={cy - 10} fontSize={14} textAnchor="middle" fill={INK} fontWeight={700} fontStyle="italic">
          v
        </text>

        {/* source */}
        <g data-feature={N.source} data-feature-label="Source">
          <circle cx={sourceX} cy={cy} r={6.5} fill={RED} stroke="#fff" strokeWidth={1.5} />
          <text x={sourceX} y={cy + 24} fontSize={12.5} textAnchor="middle" fill={RED} fontWeight={700}>
            source
          </text>
        </g>

        {/* ahead (compressed) label + observer */}
        <g data-feature={N.ahead} data-feature-label="Ahead (compressed)">
          <circle cx={aheadX + (figure.movingRight ? -14 : 14)} cy={62} r={7} fill="none" stroke={RED} strokeWidth={2} />
          <text x={aheadX} y={44} fontSize={13} textAnchor={aheadAnchor} fill={RED} fontWeight={700}>
            compressed wavefronts
          </text>
          <text x={aheadX} y={62} fontSize={11.5} textAnchor={aheadAnchor} fill={RED}>
            higher frequency
          </text>
          <text x={aheadX} y={78} fontSize={11.5} textAnchor={aheadAnchor} fill={RED}>
            (higher pitch)
          </text>
        </g>

        {/* behind (stretched) label + observer */}
        <g data-feature={N.behind} data-feature-label="Behind (stretched)">
          <circle cx={behindX + (figure.movingRight ? 14 : -14)} cy={62} r={7} fill="none" stroke={BLUE} strokeWidth={2} />
          <text x={behindX} y={44} fontSize={13} textAnchor={behindAnchor} fill={BLUE} fontWeight={700}>
            stretched wavefronts
          </text>
          <text x={behindX} y={62} fontSize={11.5} textAnchor={behindAnchor} fill={BLUE}>
            lower frequency
          </text>
          <text x={behindX} y={78} fontSize={11.5} textAnchor={behindAnchor} fill={BLUE}>
            (lower pitch)
          </text>
        </g>

        {figure.showObservers && (
          <text x={W / 2} y={H - 14} fontSize={11.5} textAnchor="middle" fill={INK}>
            {`source moving at v = ${beta.toFixed(2)}c toward the ${figure.movingRight ? 'right' : 'left'}`}
          </text>
        )}
      </svg>
    </div>
  );
}

// ── standing_wave ─────────────────────────────────────────────────────────────
export function CatalogStandingWaveRenderer({ figure }: { figure: StandingWaveFigure }) {
  const N = standingWaveFeatureNames;
  const n = figure.harmonic;
  const W = 640;
  const H = 300;
  const PAD = 56;
  const cy = 150;
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
                  <text x={nx} y={cy + A + 40} fontSize={12} textAnchor="middle" fill={RED} fontWeight={700}>N</text>
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
          <text x={W / 2} y={H - 8} fontSize={11.5} textAnchor="middle" fill={INK}>
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
  const H = 440;
  const cx = 320;
  const cy = 214;
  const lambda = figure.wavelength;
  const d = figure.sourceSep;
  const c = d / 2;
  const s1x = cx - c;
  const s2x = cx + c;
  const yMax = 188;
  const ringCount = 4;

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

        {/* sources */}
        <g data-feature={N.sources} data-feature-label="Sources">
          {[[s1x, 'S₁'], [s2x, 'S₂']].map(([sx, lbl], i) => (
            <g key={i}>
              <circle cx={sx as number} cy={cy} r={6.5} fill={RED} stroke="#fff" strokeWidth={1.5} />
              <text x={sx as number} y={cy + 22} fontSize={13} textAnchor="middle" fill={RED} fontWeight={700}>{lbl as string}</text>
            </g>
          ))}
        </g>

        {/* legend */}
        <g>
          <line x1={W / 2 - 150} y1={20} x2={W / 2 - 120} y2={20} stroke={BLUE} strokeWidth={2.6} />
          <text x={W / 2 - 114} y={24} fontSize={12} fill={BLUE} fontWeight={700}>constructive (antinodal)</text>
          <line x1={W / 2 + 44} y1={20} x2={W / 2 + 74} y2={20} stroke={ORANGE} strokeWidth={2} strokeDasharray="6 5" />
          <text x={W / 2 + 80} y={24} fontSize={12} fill={ORANGE} fontWeight={700}>destructive (nodal)</text>
        </g>
      </svg>
    </div>
  );
}
