'use client';

import React from 'react';
import {
  phaseDiagramFeatureNames,
  type PhaseDiagramFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/phase-diagram';

const AX = '#475569';
const SOLID_C = '#3b82f6';
const LIQUID_C = '#10b981';
const GAS_C = '#f59e0b';

export function CatalogPhaseDiagramRenderer({ figure }: { figure: PhaseDiagramFigure }) {
  const N = phaseDiagramFeatureNames;
  const W = 540;
  const H = 420;
  const x0 = 70, xR = W - 34, yTop = 54, yBot = H - 62;
  const mx = (t: number) => x0 + t * (xR - x0);
  const my = (p: number) => yBot - p * (yBot - yTop);

  const T: [number, number] = [mx(figure.triple.t), my(figure.triple.p)];
  const C: [number, number] = [mx(figure.critical.t), my(figure.critical.p)];
  const tripleText = figure.triple.label || 'triple point';
  const criticalText = figure.critical.label || 'critical point';
  const O: [number, number] = [x0, yBot];
  const fTopT = figure.triple.t + (figure.fusionSlope === 'positive' ? 0.06 : -0.06);
  const F: [number, number] = [mx(fTopT), yTop];

  // boundary control points (curve bows down-right → concave-up)
  const sc: [number, number] = [(O[0] + T[0]) / 2 + 8, (O[1] + T[1]) / 2 + 20];
  const vc: [number, number] = [(T[0] + C[0]) / 2 + 12, (T[1] + C[1]) / 2 + 14];
  const sub = `Q ${sc[0]} ${sc[1]} ${T[0]} ${T[1]}`;
  const vap = `Q ${vc[0]} ${vc[1]} ${C[0]} ${C[1]}`;

  // Point labels: try the positions around the point and keep the one that
  // stays in the plot and covers the least of the curves, the region names and
  // the labels already placed (2026-11-13: "critical point (…)" sat on "Liquid").
  const FS = 11.5;
  const LH = 14;
  const estW = (s: string) => s.length * FS * 0.56;
  type Box = { x: number; y: number; w: number; h: number };
  const hit = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  const qPts = (p0: [number, number], c: [number, number], p1: [number, number]): [number, number][] =>
    Array.from({ length: 41 }, (_, i) => {
      const t = i / 40, u = 1 - t;
      return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]];
    });
  const curvePts: [number, number][] = [
    ...qPts(O, sc, T), ...qPts(T, vc, C),
    ...Array.from({ length: 41 }, (_, i): [number, number] => [T[0] + (F[0] - T[0]) * (i / 40), T[1] + (F[1] - T[1]) * (i / 40)]),
  ];
  const solidAt: [number, number] = [(x0 + T[0]) / 2 - 6, (yTop + T[1]) / 2 + 18];
  const liquidAt: [number, number] = [(T[0] + C[0]) / 2 + 6, yTop + 42];
  const gasAt: [number, number] = [(T[0] + xR) / 2 + 14, (T[1] + yBot) / 2 + 28];
  const regionBox = (p: [number, number], w: number): Box => ({ x: p[0] - w / 2 - 4, y: p[1] - 15, w: w + 8, h: 21 });
  const taken: Box[] = [regionBox(solidAt, 38), regionBox(liquidAt, 46), regionBox(gasAt, 30)];
  const dots: [number, number][] = [T, C];
  if (figure.marker) dots.push([mx(figure.marker.t), my(figure.marker.p)]);
  const wrap = (text: string): string[] => {
    if (estW(text) <= 150) return [text];
    // break at the space nearest the middle (a bracketed value moves to line two)
    const paren = text.indexOf(' (');
    let cut = paren > 0 ? paren : -1;
    if (cut < 0) {
      const mid = text.length / 2;
      for (let i = 0; i < text.length; i++) if (text[i] === ' ' && (cut < 0 || Math.abs(i - mid) < Math.abs(cut - mid))) cut = i;
    }
    return cut > 0 ? [text.slice(0, cut), text.slice(cut + 1)] : [text];
  };
  const placePointLabel = (pt: [number, number], text: string) => {
    const lines = wrap(text);
    const w = Math.max(...lines.map(estW));
    const h = lines.length * LH;
    const g = 8;
    // [box left, box top, anchor]
    const cands: [number, number, 'start' | 'end' | 'middle'][] = [
      [pt[0] + g, pt[1] + 5, 'start'],          // below right
      [pt[0] + g, pt[1] - h / 2, 'start'],      // right
      [pt[0] + g, pt[1] - h - 4, 'start'],      // above right
      [pt[0] - g - w, pt[1] - h - 4, 'end'],    // above left
      [pt[0] - g - w, pt[1] - h / 2, 'end'],    // left
      [pt[0] - g - w, pt[1] + 5, 'end'],        // below left
      [pt[0] - w / 2, pt[1] + 9, 'middle'],     // below
      [pt[0] - w / 2, pt[1] - h - 9, 'middle'], // above
    ];
    let best = { score: Infinity, box: { x: 0, y: 0, w, h } as Box, anchor: 'start' as 'start' | 'end' | 'middle' };
    cands.forEach(([bx, by, anchor], order) => {
      const box: Box = { x: bx, y: by, w, h };
      let score = order;
      if (box.x < x0 + 4 || box.x + w > W - 4 || box.y < yTop - 6 || box.y + h > yBot - 4) score += 1000;
      for (const t of taken) if (hit(box, t)) score += 200;
      const pad: Box = { x: box.x - 6, y: box.y - 4, w: w + 12, h: h + 8 };
      for (const [qx, qy] of curvePts) if (qx > pad.x && qx < pad.x + pad.w && qy > pad.y && qy < pad.y + pad.h) score += 12;
      for (const d of dots) if (d !== pt && d[0] > pad.x - 5 && d[0] < pad.x + pad.w + 5 && d[1] > pad.y - 5 && d[1] < pad.y + pad.h + 5) score += 200;
      if (score < best.score) best = { score, box, anchor };
    });
    taken.push(best.box);
    const tx = best.anchor === 'start' ? best.box.x : best.anchor === 'end' ? best.box.x + w : best.box.x + w / 2;
    return { lines, x: tx, y: best.box.y + FS - 1, anchor: best.anchor };
  };
  const labelText = (l: { lines: string[]; x: number; y: number; anchor: 'start' | 'end' | 'middle' }, fill: string) => (
    <text fontSize={FS} fill={fill} fontWeight={600} textAnchor={l.anchor}>
      {l.lines.map((ln, i) => <tspan key={i} x={l.x} y={l.y + i * LH}>{ln}</tspan>)}
    </text>
  );
  const criticalL = placePointLabel(C, criticalText);
  const tripleL = placePointLabel(T, tripleText);
  const markerL = figure.marker?.label ? placePointLabel(dots[2], figure.marker.label) : null;

  return (
    <div className="phase-diagram-renderer w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[560px]"
        data-feature={N.diagram}
        data-feature-label={figure.title || 'phase diagram'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <marker id="pd-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={AX} />
          </marker>
        </defs>

        {/* region fills (paths reuse the boundary curves → no seam) */}
        <path data-feature={N.solid} d={`M ${x0} ${yTop} L ${F[0]} ${F[1]} L ${T[0]} ${T[1]} Q ${sc[0]} ${sc[1]} ${x0} ${yBot} Z`} fill={SOLID_C} fillOpacity={0.12} />
        <path data-feature={N.liquid} d={`M ${F[0]} ${F[1]} L ${T[0]} ${T[1]} ${vap} L ${C[0]} ${yTop} Z`} fill={LIQUID_C} fillOpacity={0.12} />
        <path data-feature={N.gas} d={`M ${x0} ${yBot} ${sub} ${vap} L ${xR} ${C[1]} L ${xR} ${yBot} Z`} fill={GAS_C} fillOpacity={0.12} />

        {/* phase boundaries */}
        <path d={`M ${O[0]} ${O[1]} ${sub}`} fill="none" stroke={AX} strokeWidth={2} />
        <line x1={T[0]} y1={T[1]} x2={F[0]} y2={F[1]} stroke={AX} strokeWidth={2} />
        <path d={`M ${T[0]} ${T[1]} ${vap}`} fill="none" stroke={AX} strokeWidth={2} />

        {/* region labels */}
        <text x={solidAt[0]} y={solidAt[1]} fontSize={14} fill={SOLID_C} fontWeight={700} textAnchor="middle">Solid</text>
        <text x={liquidAt[0]} y={liquidAt[1]} fontSize={14} fill={LIQUID_C} fontWeight={700} textAnchor="middle">Liquid</text>
        <text x={gasAt[0]} y={gasAt[1]} fontSize={14} fill={'#b45309'} fontWeight={700} textAnchor="middle">Gas</text>

        {/* triple + critical points */}
        <g data-feature={N.triple} data-feature-label="triple point">
          <circle cx={T[0]} cy={T[1]} r={4} fill="#dc2626" />
          {labelText(tripleL, '#dc2626')}
        </g>
        <g data-feature={N.critical} data-feature-label="critical point">
          <circle cx={C[0]} cy={C[1]} r={4} fill="#7c3aed" />
          {labelText(criticalL, '#7c3aed')}
        </g>

        {/* optional state marker */}
        {figure.marker && (
          <g>
            <circle cx={dots[2][0]} cy={dots[2][1]} r={4.5} fill="none" stroke="#111827" strokeWidth={2} />
            {markerL && labelText(markerL, '#111827')}
          </g>
        )}

        {/* axes */}
        <line x1={x0} y1={yBot} x2={xR + 6} y2={yBot} stroke={AX} strokeWidth={1.5} markerEnd="url(#pd-arr)" />
        <line x1={x0} y1={yBot} x2={x0} y2={yTop - 6} stroke={AX} strokeWidth={1.5} markerEnd="url(#pd-arr)" />
        <text x={(x0 + xR) / 2} y={H - 22} fontSize={13} fill={AX} fontWeight={600} textAnchor="middle">{figure.tLabel} →</text>
        <text x={20} y={(yTop + yBot) / 2} fontSize={13} fill={AX} fontWeight={600} textAnchor="middle" transform={`rotate(-90 20 ${(yTop + yBot) / 2})`}>{figure.pLabel} →</text>
      </svg>
    </div>
  );
}
