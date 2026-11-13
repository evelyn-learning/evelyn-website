'use client';

import React from 'react';
import {
  vseprFeatureNames,
  type VseprFigure,
  type VseprGeometry,
} from '@/lib/tutor/diagrams/catalog/kinds/vsepr';

type Pos = { x: number; y: number; bond: 'plane' | 'wedge' | 'dash' };
const CENTRAL_FILL = '#1d4ed8';
const ATOM_FILL = '#e2e8f0';
const BOND = '#334155';
const LONE = '#9333ea';

/** Terminal positions (relative to the central atom) + bond depth per geometry. */
function layout(geom: VseprGeometry, L: number): Pos[] {
  const P = (x: number, y: number, bond: Pos['bond'] = 'plane'): Pos => ({ x, y, bond });
  switch (geom) {
    case 'linear':
      return [P(-L, 0), P(L, 0)];
    case 'trigonal_planar':
      return [P(0, -L), P(-L * 0.87, L * 0.5), P(L * 0.87, L * 0.5)];
    case 'bent':
      return [P(-L * 0.79, L * 0.61), P(L * 0.79, L * 0.61)];
    case 'tetrahedral':
      return [P(-L * 0.72, L * 0.6), P(L * 0.72, L * 0.6), P(-L * 0.5, -L * 0.62, 'dash'), P(L * 0.5, -L * 0.62, 'wedge')];
    case 'trigonal_pyramidal':
      return [P(0, L * 0.82, 'wedge'), P(-L * 0.76, L * 0.32), P(L * 0.76, L * 0.32)];
    case 'trigonal_bipyramidal':
      return [P(0, -L), P(0, L), P(-L * 0.82, L * 0.12), P(L * 0.62, -L * 0.22, 'dash'), P(L * 0.34, L * 0.5, 'wedge')];
    case 'octahedral':
      return [P(0, -L), P(0, L), P(-L * 0.64, -L * 0.3, 'dash'), P(L * 0.64, -L * 0.3, 'dash'), P(-L * 0.64, L * 0.3, 'wedge'), P(L * 0.64, L * 0.3, 'wedge')];
  }
}

export function CatalogVseprRenderer({ figure }: { figure: VseprFigure }) {
  const N = vseprFeatureNames;
  // The frame is cropped close to the molecule so the shape fills the board.
  const W = 380;
  const H = 300;
  const cx = W / 2;
  const cy = H / 2 - 8;
  const L = 96;
  const pts = layout(figure.geometry, L).map((p, i) => ({ ...p, label: figure.terminals[i] ?? 'X', sx: cx + p.x, sy: cy + p.y }));

  const bond = (a: [number, number], b: [number, number], style: Pos['bond'], key: number) => {
    const [ax, ay] = a, [bx, by] = b;
    const dx = bx - ax, dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const px = -uy, py = ux;
    // trim to the atom radii
    const sA: [number, number] = [ax + ux * 17, ay + uy * 17];
    const sB: [number, number] = [bx - ux * 16, by - uy * 16];
    if (style === 'wedge') {
      const w = 6;
      return <polygon key={key} points={`${sA[0]},${sA[1]} ${sB[0] + px * w},${sB[1] + py * w} ${sB[0] - px * w},${sB[1] - py * w}`} fill={BOND} />;
    }
    if (style === 'dash') {
      const segs = [];
      const n = 6;
      for (let i = 1; i <= n; i++) {
        const t = i / (n + 1);
        const mx = sA[0] + (sB[0] - sA[0]) * t, my = sA[1] + (sB[1] - sA[1]) * t;
        const hw = 1.5 + 5 * t; // grows toward the atom (perspective)
        segs.push(<line key={i} x1={mx + px * hw} y1={my + py * hw} x2={mx - px * hw} y2={my - py * hw} stroke={BOND} strokeWidth={1.6} />);
      }
      return <g key={key}>{segs}</g>;
    }
    return <line key={key} x1={sA[0]} y1={sA[1]} x2={sB[0]} y2={sB[1]} stroke={BOND} strokeWidth={2.2} />;
  };

  // Lone pairs sit opposite the "average" bond direction (top for bent /
  // pyramidal), fanned out so each pair reads as its own pair of dots.
  const avg = pts.reduce((s, p) => [s[0] + p.x, s[1] + p.y], [0, 0]);
  const am = Math.hypot(avg[0], avg[1]);
  const lpBase = am > 1 ? Math.atan2(-avg[1], -avg[0]) : -Math.PI / 2;
  const lonePairDots = () => {
    const n = Math.min(figure.lonePairs, 3);
    if (n <= 0) return null;
    const step = n === 2 ? 1.24 : 1.0; // radians between neighbouring pairs
    const out: React.ReactNode[] = [];
    for (let i = 0; i < n; i++) {
      const a = lpBase + (i - (n - 1) / 2) * step;
      const d: [number, number] = [Math.cos(a), Math.sin(a)];
      const t: [number, number] = [-d[1], d[0]];
      const c: [number, number] = [cx + d[0] * 31, cy + d[1] * 31];
      out.push(
        <g key={i}>
          <ellipse cx={cx + d[0] * 30} cy={cy + d[1] * 30} rx={9} ry={13} transform={`rotate(${(a * 180) / Math.PI + 90} ${cx + d[0] * 30} ${cy + d[1] * 30})`} fill={LONE} opacity={0.13} />
          <circle cx={c[0] + t[0] * 4.5} cy={c[1] + t[1] * 4.5} r={3} fill={LONE} />
          <circle cx={c[0] - t[0] * 4.5} cy={c[1] - t[1] * 4.5} r={3} fill={LONE} />
        </g>,
      );
    }
    return <g data-feature={N.lonePairs} data-feature-label="lone pairs">{out}</g>;
  };

  // Bond-angle arcs. Which pair of bonds carries the label depends on the
  // shape: it must be a pair that really makes the stated angle.
  const isDefaultTbp = figure.geometry === 'trigonal_bipyramidal' && /90.*120/.test(figure.angle);
  const arcs: Array<{ i: number; j: number; text: string }> = isDefaultTbp
    ? [{ i: 0, j: 2, text: '90°' }, { i: 3, j: 4, text: '120°' }]
    : figure.geometry === 'octahedral' ? [{ i: 0, j: 3, text: figure.angle }]
    : figure.geometry === 'trigonal_bipyramidal' ? [{ i: 0, j: 2, text: figure.angle }]
    : pts.length >= 2 ? [{ i: 0, j: 1, text: figure.angle }] : [];
  const angleArc = (i: number, j: number, text: string, key: number) => {
    const r = 32;
    const a0 = Math.atan2(pts[i].y, pts[i].x);
    let a1 = Math.atan2(pts[j].y, pts[j].x);
    // Always sweep the short way round from bond i to bond j; a straight
    // (linear) pair sweeps on the side away from the lone pairs / other atoms.
    let delta = a1 - a0;
    while (delta > Math.PI) delta -= 2 * Math.PI;
    while (delta < -Math.PI) delta += 2 * Math.PI;
    if (Math.abs(Math.abs(delta) - Math.PI) < 1e-6) delta = Math.PI;
    a1 = a0 + delta;
    const p0: [number, number] = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)];
    const p1: [number, number] = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
    const mid = a0 + delta / 2;
    const halfW = text.length * 3.6 + 2;
    // Push the label outward until it clears every atom.
    let lr = r + 20;
    for (let k = 0; k < 6; k++) {
      const lx = cx + lr * Math.cos(mid), ly = cy + lr * Math.sin(mid);
      const hit = pts.some((p) => Math.abs(p.sx - lx) < 17 + halfW && Math.abs(p.sy - ly) < 17 + 8);
      if (!hit) break;
      lr += 9;
    }
    const lx = cx + lr * Math.cos(mid), ly = cy + lr * Math.sin(mid);
    return (
      <g key={key}>
        <path d={`M ${p0[0]} ${p0[1]} A ${r} ${r} 0 0 ${delta > 0 ? 1 : 0} ${p1[0]} ${p1[1]}`} fill="none" stroke="#b91c1c" strokeWidth={1.4} />
        <text x={lx} y={ly + 4.5} fontSize={13} fill="#b91c1c" fontWeight={700} textAnchor="middle" stroke="#ffffff" strokeWidth={3.5} paintOrder="stroke" strokeLinejoin="round">{text}</text>
      </g>
    );
  };

  const pretty = figure.geometry.replace(/_/g, ' ');
  const caption = pretty.charAt(0).toUpperCase() + pretty.slice(1)
    + (figure.lonePairs > 0 ? ` · ${figure.lonePairs} lone pair${figure.lonePairs === 1 ? '' : 's'} on ${figure.central}` : '');
  return (
    <div className="vsepr-renderer w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2 text-center">{figure.title}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[520px]"
        data-feature={N.molecule}
        data-feature-label={figure.title || pretty}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* bonds (under atoms) */}
        {pts.map((p, i) => bond([cx, cy], [p.sx, p.sy], p.bond, i))}
        {lonePairDots()}
        {arcs.map((a, k) => angleArc(a.i, a.j, a.text, k))}
        {/* terminal atoms */}
        {pts.map((p, i) => (
          <g key={i} data-feature={N.bond(i)} data-feature-label={p.label}>
            <circle cx={p.sx} cy={p.sy} r={16} fill={ATOM_FILL} stroke={BOND} strokeWidth={1.5} />
            <text x={p.sx} y={p.sy + 4.5} fontSize={13} textAnchor="middle" fill="#1f2937" fontWeight={700}>{p.label}</text>
          </g>
        ))}
        {/* central atom */}
        <g data-feature={N.central} data-feature-label={figure.central}>
          <circle cx={cx} cy={cy} r={18} fill={CENTRAL_FILL} stroke="#1e3a8a" strokeWidth={1.5} />
          <text x={cx} y={cy + 5} fontSize={15} textAnchor="middle" fill="#fff" fontWeight={700}>{figure.central}</text>
        </g>
        <text x={W / 2} y={H - 8} fontSize={13} textAnchor="middle" fill="#475569" fontWeight={600}>{caption}</text>
      </svg>
    </div>
  );
}
