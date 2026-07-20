'use client';

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
  const scale = (Math.min(W, H) - 80) / span;
  const ox = W / 2 - ((maxX + minX) / 2) * scale;
  const oy = H / 2 + ((maxY + minY) / 2) * scale;
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
    const perpX = len > 0 ? (-dy / len) * 12 * g.labelSide : 6;
    const perpY = len > 0 ? (dx / len) * 12 * g.labelSide : 0;
    const halfW = (g.label.length * 13 * 0.55) / 2;
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
  }
  const placed = deoverlapLabels(seeds, { width: W, height: H }, { obstacles, baseline: 'middle' });

  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[560px]">
        {/* Origin axis lines */}
        <line x1={px(minX) - 20} y1={py(0)} x2={px(maxX) + 20} y2={py(0)} stroke="#e5e7eb" strokeWidth={1} />
        <line x1={px(0)} y1={py(minY) - 20} x2={px(0)} y2={py(maxY) + 20} stroke="#e5e7eb" strokeWidth={1} />
        {screenGeoms.map((g, i) => (
          <Vec
            key={i}
            x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2}
            color={g.color} label={g.label} dashed={g.dashed}
            labelX={placed[i].x} labelY={placed[i].y}
          />
        ))}
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

function Vec({ x1, y1, x2, y2, color, label, dashed, labelX, labelY }: { x1: number; y1: number; x2: number; y2: number; color: string; label: string; dashed?: boolean; labelX: number; labelY: number }) {
  const id = `vec-arr-${color.replace('#', '')}`;
  return (
    <g>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.5} markerEnd={`url(#${id})`} strokeDasharray={dashed ? '5 4' : undefined} />
      <text x={labelX} y={labelY} fontSize={13} fill={color} fontWeight={700} textAnchor="middle" dominantBaseline="middle">{label}</text>
    </g>
  );
}
