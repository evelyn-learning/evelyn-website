'use client';

import React from 'react';
import {
  vectors3DFeatureNames,
  type Vectors3DFigure,
  type Vec3,
} from '@/lib/tutor/diagrams/catalog/kinds/vectors-3d';

type P = [number, number];
const AXIS = '#64748b';
const PALETTE = ['#2563eb', '#16a34a', '#9333ea', '#0891b2', '#ca8a04'];
const POINT = '#dc2626';
const PLANE = '#9333ea';

const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: Vec3): Vec3 => {
  const m = Math.hypot(...a) || 1;
  return [a[0] / m, a[1] / m, a[2] / m];
};

export function CatalogVectors3DRenderer({ figure }: { figure: Vectors3DFigure }) {
  const N = vectors3DFeatureNames;
  const W = 520;
  const H = 440;
  const R = figure.range;
  const s = Math.min(150 / R, 42);
  const ox = W / 2 - 10;
  const oy = H * 0.58;
  // Isometric projection (z up).
  const proj = ([x, y, z]: Vec3): P => [ox + s * 0.866 * (x - y), oy + s * (0.5 * (x + y) - z)];
  const O = proj([0, 0, 0]);

  // Width-aware label placement (2026-08-07 clip audit): the isometric
  // projection deliberately fills the frame, so a start-anchored label at
  // tip+pad overflows the right edge for any tip in the right half. Flip to an
  // end anchor when the label would overflow; clamp into the viewBox either
  // way (same char-width estimate as ProjectileMotionRenderer).
  const estW = (str: string, fontSize: number) => str.length * fontSize * 0.55;
  const labelAt = (x: number, text: string, fontSize: number, pad = 6): { x: number; anchor: 'start' | 'end' } => {
    const w = estW(text, fontSize);
    if (x + pad + w > W - 3) {
      return { x: Math.min(W - 3, Math.max(x - pad, 3 + w)), anchor: 'end' };
    }
    return { x: Math.max(3, Math.min(x + pad, W - 3 - w)), anchor: 'start' };
  };

  const arrowHead = (tip: P, from: P, color: string, size = 9) => {
    const dx = tip[0] - from[0], dy = tip[1] - from[1];
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const bx = tip[0] - ux * size, by = tip[1] - uy * size;
    const px = -uy, py = ux;
    return <polygon points={`${tip[0]},${tip[1]} ${bx + px * size * 0.5},${by + py * size * 0.5} ${bx - px * size * 0.5},${by - py * size * 0.5}`} fill={color} />;
  };

  // Plane parallelogram from point + normal.
  let planeQuad: P[] | null = null;
  if (figure.plane) {
    const n = norm(figure.plane.normal);
    const a: Vec3 = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    const u = norm(cross(n, a));
    const v = norm(cross(n, u));
    const p = figure.plane.point;
    const k = R * 0.6;
    const corner = (su: number, sv: number): Vec3 => [p[0] + su * k * u[0] + sv * k * v[0], p[1] + su * k * u[1] + sv * k * v[1], p[2] + su * k * u[2] + sv * k * v[2]];
    planeQuad = [proj(corner(1, 1)), proj(corner(-1, 1)), proj(corner(-1, -1)), proj(corner(1, -1))];
  }

  const axisEnd = (ax: 0 | 1 | 2): P => proj(ax === 0 ? [R, 0, 0] : ax === 1 ? [0, R, 0] : [0, 0, R]);
  const axisNeg = (ax: 0 | 1 | 2): P => proj(ax === 0 ? [-R, 0, 0] : ax === 1 ? [0, -R, 0] : [0, 0, -R]);

  return (
    <div className="vectors-3d-renderer w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[560px]"
        data-feature={N.axes}
        data-feature-label={figure.title || '3D axes'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* plane (under everything) */}
        {planeQuad && (
          <g data-feature={N.plane} data-feature-label={figure.plane?.label || 'plane'}>
            <polygon points={planeQuad.map((p) => p.join(',')).join(' ')} fill={PLANE} fillOpacity={0.14} stroke={PLANE} strokeWidth={1.5} />
            {figure.plane?.label && (() => {
              const l = labelAt(planeQuad![0][0], figure.plane.label, 12, 0);
              return <text x={l.x} y={planeQuad![0][1] - 4} fontSize={12} fill={PLANE} fontWeight={700} textAnchor={l.anchor}>{figure.plane.label}</text>;
            })()}
          </g>
        )}

        {/* axes: faint negative, solid positive with arrowheads */}
        {([0, 1, 2] as const).map((ax) => {
          const e = axisEnd(ax), nEnd = axisNeg(ax);
          const lbl = ['x', 'y', 'z'][ax];
          return (
            <g key={ax}>
              <line x1={O[0]} y1={O[1]} x2={nEnd[0]} y2={nEnd[1]} stroke={AXIS} strokeWidth={1} strokeOpacity={0.35} />
              <line x1={O[0]} y1={O[1]} x2={e[0]} y2={e[1]} stroke={AXIS} strokeWidth={1.5} />
              {arrowHead(e, O, AXIS, 8)}
              <text x={e[0] + (ax === 0 ? 8 : ax === 1 ? -10 : 0)} y={e[1] + (ax === 2 ? -6 : 12)} fontSize={13} fill={AXIS} fontWeight={700} textAnchor="middle">{lbl}</text>
            </g>
          );
        })}

        {/* line r = p + t·d */}
        {figure.line && (() => {
          const { point, dir } = figure.line!;
          const d = norm(dir);
          const t = R * 1.2;
          const a = proj([point[0] - d[0] * t, point[1] - d[1] * t, point[2] - d[2] * t]);
          const b = proj([point[0] + d[0] * t, point[1] + d[1] * t, point[2] + d[2] * t]);
          return (
            <g data-feature={N.line} data-feature-label={figure.line!.label || 'line'}>
              <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#16a34a" strokeWidth={2.25} />
              {figure.line!.label && (() => {
                const l = labelAt(b[0], figure.line!.label!, 12);
                return <text x={l.x} y={b[1]} fontSize={12} fill="#16a34a" fontWeight={700} textAnchor={l.anchor}>{figure.line!.label}</text>;
              })()}
            </g>
          );
        })()}

        {/* vectors */}
        {figure.vectors.map((v, i) => {
          const color = v.color || PALETTE[i % PALETTE.length];
          const from = proj(v.from);
          const tip = proj(v.to);
          // dashed guide from tip down to the xy-plane (depth cue)
          const foot = proj([v.to[0], v.to[1], 0]);
          return (
            <g key={i} data-feature={N.vector(i)} data-feature-label={v.label || `vector ${i + 1}`}>
              {(v.to[2] !== 0) && <line x1={tip[0]} y1={tip[1]} x2={foot[0]} y2={foot[1]} stroke={color} strokeWidth={1} strokeDasharray="3 3" strokeOpacity={0.5} />}
              <line x1={from[0]} y1={from[1]} x2={tip[0]} y2={tip[1]} stroke={color} strokeWidth={2.5} />
              {arrowHead(tip, from, color, 10)}
              {v.label && (() => {
                const l = labelAt(tip[0], v.label!, 13);
                return <text x={l.x} y={tip[1] - 5} fontSize={13} fill={color} fontWeight={700} textAnchor={l.anchor}>{v.label}</text>;
              })()}
            </g>
          );
        })}

        {/* points */}
        {figure.points.map((p, i) => {
          const color = p.color || POINT;
          const sp = proj(p.at);
          const foot = proj([p.at[0], p.at[1], 0]);
          return (
            <g key={i} data-feature={N.point(i)} data-feature-label={p.label || `point ${i + 1}`}>
              {(p.at[2] !== 0) && <line x1={sp[0]} y1={sp[1]} x2={foot[0]} y2={foot[1]} stroke={color} strokeWidth={1} strokeDasharray="3 3" strokeOpacity={0.5} />}
              <circle cx={sp[0]} cy={sp[1]} r={4} fill={color} />
              {p.label && (() => {
                const l = labelAt(sp[0], p.label!, 12.5, 7);
                return <text x={l.x} y={sp[1] - 4} fontSize={12.5} fill={color} fontWeight={700} textAnchor={l.anchor}>{p.label}</text>;
              })()}
            </g>
          );
        })}

        {/* origin */}
        <circle cx={O[0]} cy={O[1]} r={2.5} fill={AXIS} />
        <text x={O[0] - 8} y={O[1] + 14} fontSize={11} fill={AXIS}>O</text>
      </svg>
    </div>
  );
}
