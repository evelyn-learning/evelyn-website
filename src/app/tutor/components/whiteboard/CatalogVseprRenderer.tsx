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
  const W = 460;
  const H = 400;
  const cx = W / 2;
  const cy = H / 2 + 6;
  const L = 92;
  const pts = layout(figure.geometry, L).map((p, i) => ({ ...p, label: figure.terminals[i] ?? 'X', sx: cx + p.x, sy: cy + p.y }));

  const bond = (a: [number, number], b: [number, number], style: Pos['bond'], key: number) => {
    const [ax, ay] = a, [bx, by] = b;
    const dx = bx - ax, dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const px = -uy, py = ux;
    // trim to the atom radii
    const sA: [number, number] = [ax + ux * 17, ay + uy * 17];
    const sB: [number, number] = [bx - ux * 15, by - uy * 15];
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

  // Lone pairs: dots placed opposite the "average" bond direction (i.e. where the
  // electron density sits — top for bent/pyramidal).
  const avg = pts.reduce((s, p) => [s[0] + p.x, s[1] + p.y], [0, 0]);
  const am = Math.hypot(avg[0], avg[1]) || 1;
  const lpDir: [number, number] = [-avg[0] / am, -avg[1] / am];
  const lonePairDots = () => {
    if (figure.lonePairs <= 0) return null;
    const base: [number, number] = [cx + lpDir[0] * 22, cy + lpDir[1] * 22];
    const perp: [number, number] = [-lpDir[1], lpDir[0]];
    const dots: React.ReactNode[] = [];
    for (let i = 0; i < figure.lonePairs; i++) {
      const off = (i - (figure.lonePairs - 1) / 2) * 12;
      const c: [number, number] = [base[0] + perp[0] * off + lpDir[0] * 6, base[1] + perp[1] * off + lpDir[1] * 6];
      dots.push(<circle key={`${i}a`} cx={c[0] + perp[0] * 3.5} cy={c[1] + perp[1] * 3.5} r={2.6} fill={LONE} />);
      dots.push(<circle key={`${i}b`} cx={c[0] - perp[0] * 3.5} cy={c[1] - perp[1] * 3.5} r={2.6} fill={LONE} />);
    }
    return <g data-feature={N.lonePairs} data-feature-label="lone pairs">{dots}</g>;
  };

  // Bond-angle arc between the first two bonds.
  const angleArc = () => {
    if (pts.length < 2) return null;
    const r = 30;
    const a0 = Math.atan2(pts[0].y, pts[0].x);
    const a1 = Math.atan2(pts[1].y, pts[1].x);
    const p0: [number, number] = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)];
    const p1: [number, number] = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
    let mid = (a0 + a1) / 2;
    if (Math.abs(a0 - a1) > Math.PI) mid += Math.PI;
    const lx = cx + 52 * Math.cos(mid), ly = cy + 52 * Math.sin(mid);
    const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
    const sweep = a1 > a0 ? 1 : 0;
    return (
      <g>
        <path d={`M ${p0[0]} ${p0[1]} A ${r} ${r} 0 ${large} ${sweep} ${p1[0]} ${p1[1]}`} fill="none" stroke="#b91c1c" strokeWidth={1.3} />
        <text x={lx} y={ly + 4} fontSize={12.5} fill="#b91c1c" fontWeight={700} textAnchor="middle">{figure.angle}</text>
      </g>
    );
  };

  const pretty = figure.geometry.replace(/_/g, ' ');
  return (
    <div className="vsepr-renderer w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[480px]"
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
        {angleArc()}
        {/* terminal atoms */}
        {pts.map((p, i) => (
          <g key={i} data-feature={N.bond(i)} data-feature-label={p.label}>
            <circle cx={p.sx} cy={p.sy} r={15} fill={ATOM_FILL} stroke={BOND} strokeWidth={1.5} />
            <text x={p.sx} y={p.sy + 4.5} fontSize={13} textAnchor="middle" fill="#1f2937" fontWeight={700}>{p.label}</text>
          </g>
        ))}
        {/* central atom */}
        <g data-feature={N.central} data-feature-label={figure.central}>
          <circle cx={cx} cy={cy} r={18} fill={CENTRAL_FILL} stroke="#1e3a8a" strokeWidth={1.5} />
          <text x={cx} y={cy + 5} fontSize={15} textAnchor="middle" fill="#fff" fontWeight={700}>{figure.central}</text>
        </g>
        <text x={W / 2} y={H - 10} fontSize={12.5} textAnchor="middle" fill="#6b7280">{pretty}</text>
      </svg>
    </div>
  );
}
