'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { VectorAdditionFigure } from '@/lib/tutor/diagrams/catalog/kinds/physics';
import { deoverlapLabels, type DeoverlapLabel, type DeoverlapObstacle } from '@/lib/tutor/whiteboard/label-deoverlap';

const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

interface VecGeom {
  x1: number; y1: number; x2: number; y2: number;
  color: string;
  label: string;
  dashed?: boolean;
  /** Which side of the shaft the label seeds on (perpendicular offset). */
  labelSide: 1 | -1;
}

export function CatalogVectorAdditionRenderer({ figure }: { figure: VectorAdditionFigure }) {
  const { vectors, resultant, method, title } = figure;
  const W = 520;
  const H = 380;
  const PLOT_H = 350;
  // Compute bounding box of all tip-to-tail traversal + parallelogram if needed.
  let minX = 0, minY = 0, maxX = 0, maxY = 0;
  if (method === 'tip_to_tail') {
    let cx = 0, cy = 0;
    for (const v of vectors) {
      cx += v.x; cy += v.y;
      minX = Math.min(minX, cx); minY = Math.min(minY, cy);
      maxX = Math.max(maxX, cx); maxY = Math.max(maxY, cy);
    }
  } else {
    for (const v of vectors) {
      minX = Math.min(minX, v.x); minY = Math.min(minY, v.y);
      maxX = Math.max(maxX, v.x); maxY = Math.max(maxY, v.y);
    }
    minX = Math.min(minX, resultant.x); minY = Math.min(minY, resultant.y);
    maxX = Math.max(maxX, resultant.x); maxY = Math.max(maxY, resultant.y);
  }
  const span = Math.max(maxX - minX, maxY - minY, 4);
  const scale = (Math.min(W, PLOT_H) - 84) / span;
  const ox = W / 2 - ((maxX + minX) / 2) * scale;
  const oy = PLOT_H / 2 + ((maxY + minY) / 2) * scale;
  // Numbered ticks on a round step, so the lengths can be read off.
  const tickStep = niceTick(span, 7);
  const ticksBetween = (lo: number, hi: number): number[] => {
    const out: number[] = [];
    for (let k = Math.ceil(lo / tickStep - 1e-9); k <= Math.floor(hi / tickStep + 1e-9); k++) if (k !== 0) out.push(Number((k * tickStep).toFixed(8)));
    return out;
  };
  const padUnits = 20 / scale;
  const xTicks = ticksBetween(minX - padUnits, maxX + padUnits);
  const yTicks = ticksBetween(minY - padUnits, maxY + padUnits);
  const fmt = (v: number) => String(Number(v.toFixed(2))).replace('-', '\u2212');
  const px = (x: number) => ox + x * scale;
  const py = (y: number) => oy - y * scale; // flip y for screen

  const geoms: VecGeom[] =
    method === 'tip_to_tail' ? tipToTailGeoms(vectors) : parallelogramGeoms(vectors);
  // Resultant — labelSide pulls its label perpendicular to the line so it
  // doesn't sit on top of the parallelogram-method sum vectors that share
  // the same midpoint.
  geoms.push({
    x1: 0, y1: 0, x2: resultant.x, y2: resultant.y,
    color: resultant.color || '#dc2626',
    label: resultant.label || 'R',
    dashed: true,
    labelSide: 1,
  });
  const screenGeoms = geoms.map((g) => ({
    ...g, x1: px(g.x1), y1: py(g.y1), x2: px(g.x2), y2: py(g.y2),
  }));

  // ── Label layout (2026-07-19 renderer label-collision audit) ─────────
  // The alternating ±12px perpendicular stagger handles two clean
  // vectors, but out-and-back tip-to-tail chains and 3+ near-parallel
  // parallelogram vectors still composite their midpoint labels. Seed
  // each label at its historical perpendicular spot, then run one
  // deoverlapLabels pass with near-axis-aligned shafts as obstacles —
  // output stays identical when nothing collides.
  const seeds = screenGeoms.map((g, i): DeoverlapLabel & { key: number } => {
    const dx = g.x2 - g.x1; const dy = g.y2 - g.y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    // Falls back to the legacy "+6 right of midpoint" when the vector
    // has zero length.
    // The offset clears the label's own half-extent along the normal, so a
    // long label beside a steep arrow never sits on the shaft.
    const halfW = (g.label.length * 13 * 0.58) / 2;
    const nx = len > 0 ? -dy / len : 1; const ny = len > 0 ? dx / len : 0;
    const off = 9 + Math.abs(nx) * halfW + Math.abs(ny) * 8;
    const perpX = len > 0 ? nx * off * g.labelSide : 6;
    const perpY = len > 0 ? ny * off * g.labelSide : 0;
    return {
      key: i,
      x: Math.min(Math.max((g.x1 + g.x2) / 2 + perpX, halfW + 4), W - halfW - 4),
      y: (g.y1 + g.y2) / 2 + perpY,
      text: g.label, fontSize: 13, anchor: 'middle',
      preferDir: perpY < 0 ? 'up' : 'down',
    };
  });
  const obstacles: DeoverlapObstacle[] = [];
  for (const g of screenGeoms) {
    const box = {
      left: Math.min(g.x1, g.x2) - 3, right: Math.max(g.x1, g.x2) + 3,
      top: Math.min(g.y1, g.y2) - 3, bottom: Math.max(g.y1, g.y2) + 3,
    };
    // Near-axis-aligned shafts only — a diagonal's bounding box is
    // mostly empty space and would over-displace labels.
    if (Math.min(box.right - box.left, box.bottom - box.top) <= 24) obstacles.push(box);
    else {
      // A diagonal shaft: a chain of small boxes along it.
      const n = Math.ceil(Math.hypot(g.x2 - g.x1, g.y2 - g.y1) / 10);
      for (let k = 0; k <= n; k++) {
        const bx = g.x1 + ((g.x2 - g.x1) * k) / n, by = g.y1 + ((g.y2 - g.y1) * k) / n;
        obstacles.push({ left: bx - 4, right: bx + 4, top: by - 4, bottom: by + 4 });
      }
    }
  }
  // Tick numbers: one a vector runs over is left out; the rest are kept clear of labels.
  const shaftHits = (bx: { left: number; right: number; top: number; bottom: number }) => screenGeoms.some((g) => {
    const n = Math.max(1, Math.ceil(Math.hypot(g.x2 - g.x1, g.y2 - g.y1) / 6));
    for (let k = 0; k <= n; k++) {
      const qx = g.x1 + ((g.x2 - g.x1) * k) / n, qy = g.y1 + ((g.y2 - g.y1) * k) / n;
      if (qx > bx.left - 3 && qx < bx.right + 3 && qy > bx.top - 3 && qy < bx.bottom + 3) return true;
    }
    return false;
  });
  const xTickBox = (t: number) => ({ left: px(t) - 12, right: px(t) + 12, top: py(0) + 5, bottom: py(0) + 17 });
  const yTickBox = (t: number) => ({ left: px(0) - 30, right: px(0) - 5, top: py(t) - 6, bottom: py(t) + 6 });
  const xShown = xTicks.filter((t) => !shaftHits(xTickBox(t)));
  const yShown = yTicks.filter((t) => !shaftHits(yTickBox(t)));
  for (const t of xShown) obstacles.push(xTickBox(t));
  for (const t of yShown) obstacles.push(yTickBox(t));
  // Parallelogram rule with two vectors: the two completing sides.
  const sides = method === 'parallelogram' && vectors.length === 2
    ? vectors.map((v) => ({ x1: px(v.x), y1: py(v.y), x2: px(resultant.x), y2: py(resultant.y) }))
    : [];
  const placed = deoverlapLabels(seeds, { width: W, height: PLOT_H }, { obstacles, baseline: 'middle' });
  const rMag = Math.hypot(resultant.x, resultant.y);
  const rLabel = resultant.label || 'R';

  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[560px]">
        {/* Origin axis lines */}
        <line x1={Math.min(px(minX) - 22, ...xTicks.map((t) => px(t) - 6))} y1={py(0)} x2={Math.max(px(maxX) + 22, ...xTicks.map((t) => px(t) + 6))} y2={py(0)} stroke="#cbd5e1" strokeWidth={1} />
        <line x1={px(0)} y1={Math.max(py(minY) + 22, ...yTicks.map((t) => py(t) + 6))} x2={px(0)} y2={Math.min(py(maxY) - 22, ...yTicks.map((t) => py(t) - 6))} stroke="#cbd5e1" strokeWidth={1} />
        {xTicks.map((t) => (
          <g key={`x${t}`}>
            <line x1={px(t)} y1={py(0) - 3} x2={px(t)} y2={py(0) + 3} stroke="#94a3b8" strokeWidth={1} />
            {xShown.includes(t) && <text x={px(t)} y={py(0) + 14} fontSize={10.5} fill="#64748b" textAnchor="middle">{fmt(t)}</text>}
          </g>
        ))}
        {yTicks.map((t) => (
          <g key={`y${t}`}>
            <line x1={px(0) - 3} y1={py(t)} x2={px(0) + 3} y2={py(t)} stroke="#94a3b8" strokeWidth={1} />
            {yShown.includes(t) && <text x={px(0) - 6} y={py(t) + 3.5} fontSize={10.5} fill="#64748b" textAnchor="end">{fmt(t)}</text>}
          </g>
        ))}
        {sides.map((sd, i) => (
          <line key={`s${i}`} x1={sd.x1} y1={sd.y1} x2={sd.x2} y2={sd.y2} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3 4" />
        ))}
        {screenGeoms.map((g, i) => (
          <Vec
            key={i}
            x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2}
            color={g.color} label={g.label} dashed={g.dashed}
            labelX={placed[i].x} labelY={placed[i].y}
          />
        ))}
        <text x={W / 2} y={H - 8} fontSize={13} fontWeight={600} fill="#374151" textAnchor="middle">
          {rLabel} = ({fmt(resultant.x)}, {fmt(resultant.y)})<tspan dx={18}>|{rLabel}| {Math.abs(rMag - Number(rMag.toFixed(2))) < 1e-9 ? '=' : '≈'} {fmt(rMag)}</tspan>
        </text>
      </svg>
    </div>
  );
}

function tipToTailGeoms(vectors: VectorAdditionFigure['vectors']): VecGeom[] {
  let cx = 0, cy = 0;
  return vectors.map((v, i) => {
    const x1 = cx, y1 = cy;
    cx += v.x; cy += v.y;
    // Tip-to-tail vectors don't usually overlap (each starts where
    // the prior ended), so a tiny stagger keeps labels off the line
    // when consecutive vectors are nearly parallel.
    return {
      x1, y1, x2: cx, y2: cy,
      color: v.color || PALETTE[i % PALETTE.length],
      label: v.label || `v${i + 1}`,
      labelSide: (i % 2 === 0 ? 1 : -1) as 1 | -1,
    };
  });
}

function parallelogramGeoms(vectors: VectorAdditionFigure['vectors']): VecGeom[] {
  // Draw both vectors from origin + dotted parallelogram completion.
  // All vectors share the (0,0) start, so their label midpoints are
  // close together — alternating labelSide pushes each label to the
  // opposite side of its arrow.
  return vectors.map((v, i) => ({
    x1: 0, y1: 0, x2: v.x, y2: v.y,
    color: v.color || PALETTE[i % PALETTE.length],
    label: v.label || `v${i + 1}`,
    labelSide: (i % 2 === 0 ? 1 : -1) as 1 | -1,
  }));
}

function niceTick(span: number, maxTicks: number): number {
  const raw = span / Math.max(1, maxTicks);
  const pow = Math.pow(10, Math.floor(Math.log10(Math.max(raw, 1e-12))));
  for (const m of [1, 2, 5, 10]) if (m * pow >= raw - 1e-12) return m * pow;
  return 10 * pow;
}

function Vec({ x1, y1, x2, y2, color, label, dashed, labelX, labelY }: { x1: number; y1: number; x2: number; y2: number; color: string; label: string; dashed?: boolean; labelX: number; labelY: number }) {
  // The arrowhead is drawn to the vector's own length, so a short vector
  // keeps a visible shaft instead of vanishing under a full-size head.
  const len = Math.hypot(x2 - x1, y2 - y1);
  const head = Math.min(13, len * 0.45);
  const ux = len > 0 ? (x2 - x1) / len : 0; const uy = len > 0 ? (y2 - y1) / len : 0;
  const bx = x2 - ux * head, by = y2 - uy * head;
  const hw = head * 0.42;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={2.5} strokeDasharray={dashed ? '5 4' : undefined} />
      {len > 0 && (
        <polygon points={`${x2},${y2} ${bx - uy * hw},${by + ux * hw} ${bx + uy * hw},${by - ux * hw}`} fill={color} />
      )}
      <text x={labelX} y={labelY} fontSize={13} fill={color} fontWeight={700} textAnchor="middle" dominantBaseline="middle" style={{ paintOrder: 'stroke', stroke: '#fff', strokeWidth: 3.5, strokeLinejoin: 'round' }}>{label}</text>
    </g>
  );
}
