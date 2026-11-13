'use client';

import React from 'react';
import {
  conicSectionsFeatureNames,
  CONIC_CUT,
  type ConicSectionsFigure,
  type ConicSlice,
} from '@/lib/tutor/diagrams/catalog/kinds/conic-sections';

const COLOR: Record<ConicSlice, string> = {
  circle: '#dc2626',
  ellipse: '#2563eb',
  parabola: '#16a34a',
  hyperbola: '#d97706',
};
const TITLECASE: Record<ConicSlice, string> = {
  circle: 'Circle',
  ellipse: 'Ellipse',
  parabola: 'Parabola',
  hyperbola: 'Hyperbola',
};

// One cell: a double cone (bowtie) cut by a plane at the characteristic angle,
// with the resulting conic drawn in the slice's color. Local coords 0..CW × 0..CH.
const CW = 280;
const CH = 250;
const CX = 140;
const WAIST = 104;
const NAPPE = 74;
const RX = 50;
const RY = 16;
const TOPY = WAIST - NAPPE; // 30
const BOTY = WAIST + NAPPE; // 178

function DoubleCone() {
  const g = '#94a3b8';
  return (
    <g>
      {/* slants */}
      <line x1={CX} y1={WAIST} x2={CX - RX} y2={TOPY} stroke={g} strokeWidth={1.5} />
      <line x1={CX} y1={WAIST} x2={CX + RX} y2={TOPY} stroke={g} strokeWidth={1.5} />
      <line x1={CX} y1={WAIST} x2={CX - RX} y2={BOTY} stroke={g} strokeWidth={1.5} />
      <line x1={CX} y1={WAIST} x2={CX + RX} y2={BOTY} stroke={g} strokeWidth={1.5} />
      {/* base ellipses: dashed back arc + solid front arc */}
      {[TOPY, BOTY].map((cy, i) => (
        <g key={i}>
          <path d={`M ${CX - RX} ${cy} A ${RX} ${RY} 0 0 1 ${CX + RX} ${cy}`} fill="none" stroke={g} strokeWidth={1.2} strokeDasharray="3 3" />
          <path d={`M ${CX - RX} ${cy} A ${RX} ${RY} 0 0 0 ${CX + RX} ${cy}`} fill="none" stroke={g} strokeWidth={1.5} />
        </g>
      ))}
    </g>
  );
}

// ── True slices ──────────────────────────────────────────────────────────
// The cone is a real cone (apex at the waist, radius K·|h| at height h) and
// each cut is a real plane n·P = d; the curve is where they meet, projected
// with the same tilt as the rims. So the curve always lies ON the surface.
type V3 = [number, number, number]; // [x (right), h (up), z (toward the viewer)]
const K = RX / NAPPE;
const TILT = RY / RX;
const proj = (p: V3): [number, number] => [CX + p[0], WAIST - p[1] + p[2] * TILT];
const norm = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };

interface Cut { n: V3; d: number; centre: V3; u: V3; v: V3; hu: number; hv: number }

const DEG = Math.PI / 180;
function cutFor(slice: ConicSlice): Cut {
  if (slice === 'circle') {
    return { n: [0, 1, 0], d: 40, centre: [0, 40, 0], u: [1, 0, 0], v: [0, 0, 1], hu: 46, hv: 40 };
  }
  if (slice === 'ellipse') {
    const b = 24 * DEG;
    const n: V3 = [-Math.sin(b), Math.cos(b), 0];
    return { n, d: 40 * Math.cos(b), centre: [0, 40, 0], u: [Math.cos(b), Math.sin(b), 0], v: [0, 0, 1], hu: 58, hv: 40 };
  }
  if (slice === 'parabola') {
    // Parallel to the generator at angle g; the curve opens on the far side of it.
    const g = -62 * DEG;
    const n = norm([Math.cos(g), -K, Math.sin(g)]);
    const vertexH = 20;
    const vertex: V3 = [K * vertexH * Math.cos(g + Math.PI), vertexH, K * vertexH * Math.sin(g + Math.PI)];
    const d = n[0] * vertex[0] + n[1] * vertex[1] + n[2] * vertex[2];
    const u = norm([K * Math.cos(g), 1, K * Math.sin(g)]);
    const v: V3 = [-Math.sin(g), 0, Math.cos(g)];
    return { n, d, centre: [vertex[0] + u[0] * 24, vertex[1] + u[1] * 24, vertex[2] + u[2] * 24], u, v, hu: 44, hv: 40 };
  }
  // hyperbola: a plane parallel to the axis, off-centre, through both nappes
  const a = 58 * DEG;
  const n: V3 = [Math.cos(a), 0, Math.sin(a)];
  const d = 15;
  return { n, d, centre: [n[0] * d, 0, n[2] * d], u: [0, 1, 0], v: [-Math.sin(a), 0, Math.cos(a)], hu: NAPPE + 8, hv: 46 };
}

/** The cut's curve as runs of screen points (one run per branch on the cone). */
function cutRuns(cut: Cut): Array<Array<[number, number]>> {
  const runs: Array<Array<[number, number]>> = [];
  let cur: Array<[number, number]> = [];
  let curSign = 0;
  const STEPS = 720;
  // Start where the curve is off the cone if there is such a place, so a
  // branch is never split across the wrap-around.
  const hAt = (phi: number) => {
    const den = cut.n[0] * K * Math.cos(phi) + cut.n[1] + cut.n[2] * K * Math.sin(phi);
    return Math.abs(den) < 1e-9 ? Infinity : cut.d / den;
  };
  let start = 0;
  for (let i = 0; i < STEPS; i++) { if (Math.abs(hAt((i / STEPS) * 2 * Math.PI)) > NAPPE) { start = i; break; } }
  for (let j = 0; j <= STEPS; j++) {
    const phi = ((start + j) / STEPS) * 2 * Math.PI;
    const h = hAt(phi);
    const ok = Number.isFinite(h) && Math.abs(h) <= NAPPE && Math.abs(h) > 1e-6;
    const sign = h > 0 ? 1 : -1;
    if (!ok || (cur.length > 0 && sign !== curSign)) { if (cur.length > 1) runs.push(cur); cur = []; }
    if (ok) { cur.push(proj([K * h * Math.cos(phi), h, K * h * Math.sin(phi)])); curSign = sign; }
  }
  if (cur.length > 1) runs.push(cur);
  return runs;
}

function ConeCell({ slice, hi }: { slice: ConicSlice; hi: boolean }) {
  const c = COLOR[slice];
  const w = hi ? 3.25 : 2.5;
  const cut = cutFor(slice);
  const corner = (su: number, sv: number): [number, number] => proj([
    cut.centre[0] + cut.u[0] * cut.hu * su + cut.v[0] * cut.hv * sv,
    cut.centre[1] + cut.u[1] * cut.hu * su + cut.v[1] * cut.hv * sv,
    cut.centre[2] + cut.u[2] * cut.hu * su + cut.v[2] * cut.hv * sv,
  ]);
  const quad = [corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)];
  const runs = cutRuns(cut);
  const pathOf = (r: Array<[number, number]>) => `M ${r.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ')}`;
  const closed = slice === 'circle' || slice === 'ellipse';
  return (
    <>
      {/* the cutting plane, behind the cone lines */}
      <polygon
        points={quad.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')}
        fill={c} fillOpacity={0.09} stroke={c} strokeOpacity={0.55} strokeWidth={1} strokeDasharray="4 3" strokeLinejoin="round"
      />
      <DoubleCone />
      {runs.map((r, i) => (
        <path key={i} d={pathOf(r) + ' Z'} fill={c} fillOpacity={0.2} stroke="none" />
      ))}
      {runs.map((r, i) => (
        <path key={`c${i}`} d={pathOf(r) + (closed ? ' Z' : '')} fill="none" stroke={c} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" />
      ))}
      <text x={CX} y={214} fontSize={15} textAnchor="middle" fill={c} fontWeight={700}>{TITLECASE[slice]}</text>
      <text x={CX} y={232} fontSize={11.5} textAnchor="middle" fill="#6b7280">{CONIC_CUT[slice]}</text>
    </>
  );
}

export function CatalogConicSectionsRenderer({ figure }: { figure: ConicSectionsFigure }) {
  const N = conicSectionsFeatureNames;
  const cols = figure.slices.length <= 1 ? 1 : 2;
  const rows = Math.ceil(figure.slices.length / cols);
  const W = cols * CW;
  const H = rows * CH;

  return (
    <div className="conic-sections-renderer w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2 text-center">{figure.title}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[600px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'conic sections'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {figure.slices.map((slice, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const w = (slice === figure.highlight) || (figure.slices.length === 1);
          return (
            <g
              key={slice}
              transform={`translate(${col * CW} ${row * CH})`}
              data-feature={N.slice(slice)}
              data-feature-label={TITLECASE[slice]}
              data-feature-cx={(col * CW + CX) / W}
              data-feature-cy={(row * CH + WAIST) / H}
              data-feature-w={CW / W}
              data-feature-h={(CH - 40) / H}
            >
              <ConeCell slice={slice} hi={w} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
