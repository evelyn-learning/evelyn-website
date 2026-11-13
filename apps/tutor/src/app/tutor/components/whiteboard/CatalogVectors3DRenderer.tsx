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
const LINE = '#0f766e';
const HALO: React.CSSProperties = { paintOrder: 'stroke', stroke: '#fff', strokeWidth: 3.5, strokeLinejoin: 'round' };

const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: Vec3): Vec3 => {
  const m = Math.hypot(...a) || 1;
  return [a[0] / m, a[1] / m, a[2] / m];
};

// ── label placement ──────────────────────────────────────────────────────
type Box = { x: number; y: number; w: number; h: number; wt?: number };
const hit = (a: Box, b: Box) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
const estW = (str: string, fontSize: number) => Math.max(1, str.length) * fontSize * 0.58;
function alongSegment(a: P, b: P, t = 6): Box[] {
  const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 8));
  const out: Box[] = [];
  for (let i = 0; i <= n; i++) out.push({ x: a[0] + ((b[0] - a[0]) * i) / n - t / 2, y: a[1] + ((b[1] - a[1]) * i) / n - t / 2, w: t, h: t });
  return out;
}
/** First candidate centre (clamped into the frame) that overlaps the fewest taken boxes. */
function place(taken: Box[], cands: P[], w: number, h: number, W: number, H: number): P {
  let best: P = cands[0], bestScore = Infinity;
  for (const c of cands) {
    const x = Math.min(Math.max(c[0], w / 2 + 3), W - w / 2 - 3);
    const y = Math.min(Math.max(c[1], h / 2 + 3), H - h / 2 - 3);
    const b = { x: x - w / 2, y: y - h / 2, w, h };
    let score = Math.hypot(x - c[0], y - c[1]) > 0.5 ? 0.5 : 0;
    for (const t of taken) if (hit(b, t)) score += t.wt ?? 1;
    score += cands.indexOf(c) * 0.01;
    if (score < bestScore) { bestScore = score; best = [x, y]; if (score < 0.2) break; }
  }
  taken.push({ x: best[0] - w / 2, y: best[1] - h / 2, w, h, wt: 12 });
  return best;
}
const around = (p: P, w: number, h: number, g = 7): P[] => [
  [p[0] + g + w / 2, p[1] - g - h / 2], [p[0] - g - w / 2, p[1] - g - h / 2],
  [p[0] + g + w / 2, p[1] + g + h / 2], [p[0] - g - w / 2, p[1] + g + h / 2],
  [p[0], p[1] - g - h / 2 - 3], [p[0], p[1] + g + h / 2 + 3],
  [p[0] + g + w / 2 + 3, p[1]], [p[0] - g - w / 2 - 3, p[1]],
  [p[0] + g * 3 + w / 2, p[1] - g * 3 - h / 2], [p[0] - g * 3 - w / 2, p[1] - g * 3 - h / 2],
  [p[0] + g * 3 + w / 2, p[1] + g * 3 + h / 2], [p[0] - g * 3 - w / 2, p[1] + g * 3 + h / 2],
  [p[0], p[1] - g * 4 - h / 2], [p[0], p[1] + g * 4 + h / 2],
];
function niceStep(span: number, maxTicks: number): number {
  const raw = span / Math.max(1, maxTicks);
  const pow = Math.pow(10, Math.floor(Math.log10(Math.max(raw, 1e-12))));
  for (const m of [1, 2, 5, 10]) if (m * pow >= raw - 1e-12) return m * pow;
  return 10 * pow;
}
const numText = (v: number) => String(Number(v.toFixed(4))).replace('-', '−');

export function CatalogVectors3DRenderer({ figure }: { figure: Vectors3DFigure }) {
  const N = vectors3DFeatureNames;
  const W = 540;
  const H = 440;
  const R = figure.range;
  const s = Math.min(140 / R, 44);
  const ox = W / 2 + 14;
  const oy = H * 0.54;
  // The textbook view, RIGHT-handed: y runs to the right, z runs up, and x
  // comes out of the page toward the viewer (down-left, foreshortened).
  const XU: P = [-0.5, 0.36];
  const proj = ([x, y, z]: Vec3): P => [ox + s * (y + x * XU[0]), oy + s * (x * XU[1] - z)];
  const O = proj([0, 0, 0]);

  const arrowHead = (tip: P, from: P, color: string, size = 9) => {
    const dx = tip[0] - from[0], dy = tip[1] - from[1];
    const len = Math.hypot(dx, dy) || 1;
    const sz = Math.min(size, len * 0.5);
    const ux = dx / len, uy = dy / len;
    const bx = tip[0] - ux * sz, by = tip[1] - uy * sz;
    const px = -uy, py = ux;
    return <polygon points={`${tip[0]},${tip[1]} ${bx + px * sz * 0.45},${by + py * sz * 0.45} ${bx - px * sz * 0.45},${by - py * sz * 0.45}`} fill={color} />;
  };

  // Plane parallelogram from point + normal.
  let planeQuad: P[] | null = null;
  if (figure.plane) {
    const n = norm(figure.plane.normal);
    const a: Vec3 = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    const u = norm(cross(n, a));
    const v = norm(cross(n, u));
    const p = figure.plane.point;
    const k = R * 0.62;
    const corner = (su: number, sv: number): Vec3 => [p[0] + su * k * u[0] + sv * k * v[0], p[1] + su * k * u[1] + sv * k * v[1], p[2] + su * k * u[2] + sv * k * v[2]];
    planeQuad = [proj(corner(1, 1)), proj(corner(-1, 1)), proj(corner(-1, -1)), proj(corner(1, -1))];
  }

  const unit = (ax: 0 | 1 | 2, k: number): Vec3 => (ax === 0 ? [k, 0, 0] : ax === 1 ? [0, k, 0] : [0, 0, k]);
  const AX = R * 1.12;
  // Numbered ticks on a round step along each positive axis.
  const step = niceStep(R, 5);
  const tickVals: number[] = [];
  for (let v = step; v <= R + step * 1e-6; v += step) tickVals.push(Number(v.toFixed(8)));

  // Drop guides: with only a few objects, the full "walk along x, then y,
  // then up" path; in a busy picture just the vertical drop and its foot.
  const objects = figure.vectors.length + figure.points.length;
  const fullGuides = objects <= 3;
  const guide = (to: Vec3, color: string, key: string) => {
    const tip = proj(to), foot = proj([to[0], to[1], 0]);
    const onX = proj([to[0], 0, 0]), onY = proj([0, to[1], 0]);
    const flat = Math.abs(to[2]) < 1e-9;
    const inPlaneOnly = Math.abs(to[0]) < 1e-9 || Math.abs(to[1]) < 1e-9;
    if (flat && (inPlaneOnly || !fullGuides)) return null;
    return (
      <g key={key} stroke={color} strokeWidth={1} strokeDasharray="3 3" strokeOpacity={0.55} fill="none">
        {fullGuides && !inPlaneOnly && <polyline points={`${onX[0]},${onX[1]} ${foot[0]},${foot[1]} ${onY[0]},${onY[1]}`} />}
        {!flat && <line x1={tip[0]} y1={tip[1]} x2={foot[0]} y2={foot[1]} />}
        {!flat && <circle cx={foot[0]} cy={foot[1]} r={2.2} fill={color} fillOpacity={0.6} stroke="none" />}
      </g>
    );
  };

  // ── labels: everything is placed against everything already drawn ──────
  const taken: Box[] = [];
  ([0, 1, 2] as const).forEach((ax) => taken.push(...alongSegment(proj(unit(ax, -R)), proj(unit(ax, AX)), 4)));
  const vecGeom = figure.vectors.map((v, i) => ({ v, color: v.color || PALETTE[i % PALETTE.length], from: proj(v.from), tip: proj(v.to) }));
  vecGeom.forEach((g) => taken.push(...alongSegment(g.from, g.tip).map((b) => ({ ...b, wt: 3 }))));
  const ptGeom = figure.points.map((p) => ({ p, color: p.color || POINT, sp: proj(p.at) }));
  ptGeom.forEach((g) => taken.push({ x: g.sp[0] - 6, y: g.sp[1] - 6, w: 12, h: 12, wt: 6 }));
  let lineEnds: [P, P] | null = null;
  if (figure.line) {
    const { point, dir } = figure.line;
    const d = norm(dir);
    const t = R * 1.1;
    lineEnds = [
      proj([point[0] - d[0] * t, point[1] - d[1] * t, point[2] - d[2] * t]),
      proj([point[0] + d[0] * t, point[1] + d[1] * t, point[2] + d[2] * t]),
    ];
    taken.push(...alongSegment(lineEnds[0], lineEnds[1]));
  }
  // axis letters and tick numbers claim their room first
  const axisLetters = ([0, 1, 2] as const).map((ax) => {
    const e = proj(unit(ax, AX));
    const pos: P = ax === 0 ? [e[0] - 9, e[1] + 9] : ax === 1 ? [e[0] + 11, e[1] + 1] : [e[0], e[1] - 11];
    taken.push({ x: pos[0] - 7, y: pos[1] - 8, w: 14, h: 16, wt: 12 });
    return { ax, pos };
  });
  const tickLabels = ([0, 1, 2] as const).flatMap((ax) => tickVals.map((v) => {
    const p = proj(unit(ax, v));
    const pos: P = ax === 0 ? [p[0] - 11, p[1] - 3] : ax === 1 ? [p[0], p[1] + 14] : [p[0] - 11, p[1] + 1];
    const w = estW(numText(v), 10.5);
    taken.push({ x: pos[0] - w / 2, y: pos[1] - 6, w, h: 12, wt: 6 });
    return { ax, v, p, pos };
  }));
  const vecLabels = vecGeom.map((g) => {
    if (!g.v.label) return null;
    const w = estW(g.v.label, 13), h = 15;
    const dx = g.tip[0] - g.from[0], dy = g.tip[1] - g.from[1];
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const beyond: P = [g.tip[0] + ux * (10 + w / 2 * Math.abs(ux)) + (Math.abs(ux) < 0.3 ? 0 : 0), g.tip[1] + uy * (10 + h / 2)];
    const mid: P = [(g.from[0] + g.tip[0]) / 2, (g.from[1] + g.tip[1]) / 2];
    const off = 10 + Math.abs(uy) * w / 2 + Math.abs(ux) * h / 2;
    const cands: P[] = [beyond, ...around(g.tip, w, h), [mid[0] - uy * off, mid[1] + ux * off], [mid[0] + uy * off, mid[1] - ux * off]];
    return place(taken, cands, w, h, W, H);
  });
  const ptLabels = ptGeom.map((g) => {
    if (!g.p.label) return null;
    const w = estW(g.p.label, 12.5), h = 15;
    return place(taken, around(g.sp, w, h), w, h, W, H);
  });
  let lineLabel: P | null = null;
  if (figure.line?.label && lineEnds) {
    const w = estW(figure.line.label, 12), h = 14;
    lineLabel = place(taken, [...around(lineEnds[1], w, h), ...around(lineEnds[0], w, h)], w, h, W, H);
  }
  let planeLabel: P | null = null;
  if (figure.plane?.label && planeQuad) {
    const w = estW(figure.plane.label, 12), h = 14;
    const cands: P[] = planeQuad.flatMap((c) => around(c, w, h, 5).slice(0, 8));
    planeLabel = place(taken, cands, w, h, W, H);
  }

  return (
    <div className="vectors-3d-renderer w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2 text-center">{figure.title}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[580px]"
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
            <polygon points={planeQuad.map((p) => p.join(',')).join(' ')} fill={PLANE} fillOpacity={0.12} stroke={PLANE} strokeWidth={1.3} strokeLinejoin="round" />
          </g>
        )}

        {/* axes: faint negative, solid positive with arrowheads, numbered ticks */}
        {([0, 1, 2] as const).map((ax) => {
          const e = proj(unit(ax, AX)), nEnd = proj(unit(ax, -R));
          return (
            <g key={ax}>
              <line x1={O[0]} y1={O[1]} x2={nEnd[0]} y2={nEnd[1]} stroke={AXIS} strokeWidth={1} strokeOpacity={0.35} strokeDasharray="2 3" />
              <line x1={O[0]} y1={O[1]} x2={e[0]} y2={e[1]} stroke={AXIS} strokeWidth={1.5} />
              {arrowHead(e, O, AXIS, 8)}
            </g>
          );
        })}
        {tickLabels.map((t, i) => (
          <g key={i}>
            {t.ax === 1
              ? <line x1={t.p[0]} y1={t.p[1] - 3} x2={t.p[0]} y2={t.p[1] + 3} stroke={AXIS} strokeWidth={1} />
              : <line x1={t.p[0] - 3} y1={t.p[1]} x2={t.p[0] + 3} y2={t.p[1]} stroke={AXIS} strokeWidth={1} />}
            <text x={t.pos[0]} y={t.pos[1] + 3.5} fontSize={10.5} fill="#94a3b8" textAnchor="middle">{numText(t.v)}</text>
          </g>
        ))}
        {axisLetters.map((a) => (
          <text key={a.ax} x={a.pos[0]} y={a.pos[1] + 4.5} fontSize={13.5} fill={AXIS} fontWeight={700} fontStyle="italic" textAnchor="middle">{['x', 'y', 'z'][a.ax]}</text>
        ))}

        {/* line r = p + t·d */}
        {figure.line && lineEnds && (
          <g data-feature={N.line} data-feature-label={figure.line.label || 'line'}>
            <line x1={lineEnds[0][0]} y1={lineEnds[0][1]} x2={lineEnds[1][0]} y2={lineEnds[1][1]} stroke={LINE} strokeWidth={2} />
          </g>
        )}

        {/* guides */}
        {vecGeom.map((g, i) => (g.v.from.every((c) => Math.abs(c) < 1e-9) || !fullGuides ? guide(g.v.to, g.color, `gv${i}`) : null))}
        {ptGeom.map((g, i) => guide(g.p.at, g.color, `gp${i}`))}

        {/* vectors */}
        {vecGeom.map((g, i) => {
          const len = Math.hypot(g.tip[0] - g.from[0], g.tip[1] - g.from[1]) || 1;
          const head = Math.min(10, len * 0.5);
          const bx = g.tip[0] - ((g.tip[0] - g.from[0]) / len) * head * 0.9;
          const by = g.tip[1] - ((g.tip[1] - g.from[1]) / len) * head * 0.9;
          return (
            <g key={i} data-feature={N.vector(i)} data-feature-label={g.v.label || `vector ${i + 1}`}>
              <line x1={g.from[0]} y1={g.from[1]} x2={bx} y2={by} stroke={g.color} strokeWidth={2.5} />
              {arrowHead(g.tip, g.from, g.color, 10)}
            </g>
          );
        })}

        {/* points */}
        {ptGeom.map((g, i) => (
          <g key={i} data-feature={N.point(i)} data-feature-label={g.p.label || `point ${i + 1}`}>
            <circle cx={g.sp[0]} cy={g.sp[1]} r={4} fill={g.color} stroke="#fff" strokeWidth={1.2} />
          </g>
        ))}

        {/* origin */}
        <circle cx={O[0]} cy={O[1]} r={2.5} fill={AXIS} />
        <text x={O[0] + 7} y={O[1] + 14} fontSize={11} fill={AXIS} style={HALO}>O</text>

        {/* labels on top of everything */}
        {planeLabel && figure.plane?.label && (
          <text x={planeLabel[0]} y={planeLabel[1] + 4} fontSize={12} fill={PLANE} fontWeight={700} textAnchor="middle" style={HALO}>{figure.plane.label}</text>
        )}
        {lineLabel && figure.line?.label && (
          <text x={lineLabel[0]} y={lineLabel[1] + 4} fontSize={12} fill={LINE} fontWeight={700} textAnchor="middle" style={HALO}>{figure.line.label}</text>
        )}
        {vecGeom.map((g, i) => vecLabels[i] && (
          <text key={`vl${i}`} x={vecLabels[i]![0]} y={vecLabels[i]![1] + 4.5} fontSize={13} fill={g.color} fontWeight={700} textAnchor="middle" style={HALO}>{g.v.label}</text>
        ))}
        {ptGeom.map((g, i) => ptLabels[i] && (
          <text key={`pl${i}`} x={ptLabels[i]![0]} y={ptLabels[i]![1] + 4.5} fontSize={12.5} fill={g.color} fontWeight={700} textAnchor="middle" style={HALO}>{g.p.label}</text>
        ))}
      </svg>
    </div>
  );
}
