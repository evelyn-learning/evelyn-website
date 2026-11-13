'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import { wrapLabel, estimateLabelWidth } from './fraction-bar-layout';
import {
  nutrientCycleFeatureNames,
  type NutrientCycleFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/nutrient-cycle';

const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9', '#14b8a6', '#f97316'];

/** Point on a rect's border in the direction of (tx,ty) from its center. */
function rectEdge(cx: number, cy: number, w: number, h: number, tx: number, ty: number) {
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const sx = Math.abs(dx) > 1e-6 ? (w / 2) / Math.abs(dx) : Infinity;
  const sy = Math.abs(dy) > 1e-6 ? (h / 2) / Math.abs(dy) : Infinity;
  const s = Math.min(sx, sy);
  return { x: cx + dx * s, y: cy + dy * s };
}

interface Box { x: number; y: number; w: number; h: number }
const overlapArea = (a: Box, b: Box): number => {
  const ox = Math.min(a.x + a.w / 2, b.x + b.w / 2) - Math.max(a.x - a.w / 2, b.x - b.w / 2);
  const oy = Math.min(a.y + a.h / 2, b.y + b.h / 2) - Math.max(a.y - a.h / 2, b.y - b.h / 2);
  return ox > 0 && oy > 0 ? ox * oy : 0;
};

export function CatalogNutrientCycleRenderer({ figure }: { figure: NutrientCycleFigure }) {
  const { reservoirs, fluxes, title } = figure;
  const N = nutrientCycleFeatureNames;
  // More reservoirs → a larger ring (the figure scales to fit its frame).
  const extra = Math.max(0, reservoirs.length - 6);
  const W = 660 + extra * 60;
  const H = reservoirs.length === 2 ? 240 : 520 + extra * 44;
  const cx = W / 2;
  const cy = H / 2;
  const ringX = W / 2 - 104;
  const ringY = H / 2 - 52;

  // Reservoir boxes on an oval ring, starting at the top. Long labels wrap to
  // tspans inside the box and the box grows vertically to fit; box centres are
  // clamped so the box stays inside the viewBox.
  const LINE_H = 15;
  const DESC_H = 12;
  const layout = reservoirs.map((r, i) => {
    // Two pools sit side by side (a tall, thin figure wastes the page).
    const a = (reservoirs.length === 2 ? Math.PI : -Math.PI / 2) + (i * 2 * Math.PI) / reservoirs.length;
    const lines = wrapLabel(r.label, 138);
    const descLines = r.description && r.description.trim() ? wrapLabel(r.description.trim(), 138 * (13 / 10)).slice(0, 2) : [];
    const lineW = Math.ceil(Math.max(
      ...lines.map((l) => estimateLabelWidth(l, 12.5)),
      ...descLines.map((l) => estimateLabelWidth(l, 10)),
    ));
    const w = Math.max(92, Math.min(160, lineW + 24));
    const h = Math.max(40, lines.length * LINE_H + descLines.length * DESC_H + 18);
    const clampW = Math.max(w, lineW); // a single unbreakable word can exceed the box cap
    return {
      ...r,
      lines,
      descLines,
      x: Math.max(4 + clampW / 2, Math.min(cx + ringX * Math.cos(a), W - 4 - clampW / 2)),
      y: Math.max(4 + h / 2, Math.min(cy + ringY * Math.sin(a), H - 4 - h / 2)),
      w,
      h,
      color: r.color || PALETTE[i % PALETTE.length],
    };
  });
  const byId = new Map(layout.map((l) => [l.id, l]));

  // ── Flux geometry ──
  // Every arrow bows to the LEFT of its own direction of travel, so a pair of
  // opposite fluxes (A→B and B→A) automatically separates into two lanes
  // instead of lying on top of each other. Repeats of the same directed pair
  // take a wider lane.
  const laneCount = new Map<string, number>();
  const hasReverse = (from: string, to: string) => fluxes.some((g) => g.from === to && g.to === from);
  const curves = fluxes.map((f) => {
    const a = byId.get(f.from);
    const b = byId.get(f.to);
    if (!a || !b || a === b) return null;
    const dx = b.x - a.x; const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = dy / len; const ny = -dx / len; // left normal (screen coords)
    const key = `${f.from}>${f.to}`;
    const lane = laneCount.get(key) ?? 0;
    laneCount.set(key, lane + 1);
    const paired = hasReverse(f.from, f.to);
    const bow = (paired ? Math.min(34, 14 + len * 0.07) : Math.min(22, len * 0.06)) + lane * 26;
    const ctrl = { x: (a.x + b.x) / 2 + nx * bow * 2, y: (a.y + b.y) / 2 + ny * bow * 2 };
    const s = rectEdge(a.x, a.y, a.w + 8, a.h + 8, ctrl.x, ctrl.y);
    const e = rectEdge(b.x, b.y, b.w + 10, b.h + 10, ctrl.x, ctrl.y);
    const at = (t: number) => ({
      x: (1 - t) * (1 - t) * s.x + 2 * (1 - t) * t * ctrl.x + t * t * e.x,
      y: (1 - t) * (1 - t) * s.y + 2 * (1 - t) * t * ctrl.y + t * t * e.y,
    });
    return { f, a, b, s, e, ctrl, at };
  });

  // ── Flux labels ──
  // Each label sits ON its own arrow (white plate, drawn above every arrow),
  // sliding along the curve to the first spot clear of the reservoir boxes and
  // of the labels already placed.
  const placedLabels: Box[] = [];
  const boxes: Box[] = layout.map((l) => ({ x: l.x, y: l.y, w: l.w + 10, h: l.h + 10 }));
  const labels = curves.map((c) => {
    if (!c || !c.f.label) return null;
    const lines = wrapLabel(c.f.label, 132);
    const lineW = Math.ceil(Math.max(...lines.map((l) => l.length * 6.1)));
    const rectW = lineW + 12;
    const rectH = 17 + (lines.length - 1) * 13;
    let best: Box | null = null; let bestCost = Infinity;
    // Normal to the arrow: a short arrow between neighbouring boxes has no
    // room for a plate ON it, so the plate may also sit just beside the line.
    const dx = c.e.x - c.s.x; const dy = c.e.y - c.s.y;
    const dl = Math.hypot(dx, dy) || 1;
    const nx = -dy / dl; const ny = dx / dl;
    const side = Math.abs(nx) * (rectW / 2) + Math.abs(ny) * (rectH / 2) + 5;
    search: for (const off of [0, side, -side]) {
      for (const t of [0.5, 0.42, 0.58, 0.34, 0.66, 0.27, 0.73]) {
        const p = c.at(t);
        const box: Box = {
          x: Math.max(4 + rectW / 2, Math.min(p.x + nx * off, W - 4 - rectW / 2)),
          y: Math.max(4 + rectH / 2, Math.min(p.y + ny * off, H - 4 - rectH / 2)),
          w: rectW, h: rectH,
        };
        let cost = Math.abs(t - 0.5) * 40 + (off === 0 ? 0 : 4);
        for (const b of boxes) cost += overlapArea(box, b) * 8;
        for (const b of placedLabels) cost += overlapArea({ ...box, w: box.w + 6, h: box.h + 4 }, b) * 8;
        if (cost < bestCost) { bestCost = cost; best = box; }
        if (cost < 9) break search;
      }
    }
    if (!best) return null;
    placedLabels.push(best);
    return { box: best, lines };
  });

  return (
    <div className="nutrient-cycle-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[680px]"
        data-feature={N.cycle}
        data-feature-label={title || 'nutrient cycle'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        <defs>
          <marker id="nc-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
          </marker>
        </defs>

        {/* Flux arrows (drawn first, under the boxes and the labels) */}
        {curves.map((c, i) => {
          if (!c) return null;
          const mid = labels[i]?.box ?? c.at(0.5);
          return (
            <g
              key={`flux-${i}`}
              data-feature={N.flux(c.f.from, c.f.to)}
              data-feature-label={c.f.label || `${c.a.label} → ${c.b.label}`}
              data-feature-cx={mid.x / W}
              data-feature-cy={mid.y / H}
              data-feature-w={80 / W}
              data-feature-h={40 / H}
            >
              <path
                d={`M ${c.s.x} ${c.s.y} Q ${c.ctrl.x} ${c.ctrl.y} ${c.e.x} ${c.e.y}`}
                fill="none"
                stroke="#475569"
                strokeWidth={1.75}
                markerEnd="url(#nc-arr)"
              />
            </g>
          );
        })}

        {/* Reservoir boxes */}
        {layout.map((r) => (
          <g
            key={r.id}
            data-feature={N.reservoir(r.id)}
            data-feature-label={r.label}
            data-feature-cx={r.x / W}
            data-feature-cy={r.y / H}
            data-feature-w={(r.w + 8) / W}
            data-feature-h={(r.h + 8) / H}
          >
            <rect x={r.x - r.w / 2} y={r.y - r.h / 2} width={r.w} height={r.h} rx={8} fill="#ffffff" />
            <rect
              x={r.x - r.w / 2}
              y={r.y - r.h / 2}
              width={r.w}
              height={r.h}
              rx={8}
              fill={/^#[0-9a-f]{6}$/i.test(r.color) ? r.color + '22' : '#f8fafc'}
              stroke={r.color}
              strokeWidth={2.5}
            />
            {(() => {
              const blockH = r.lines.length * LINE_H + r.descLines.length * DESC_H;
              const top = r.y - blockH / 2;
              return (
                <>
                  <text x={r.x} fontSize={12.5} textAnchor="middle" fill="#1f2937" fontWeight={700}>
                    {r.lines.map((ln, j) => (
                      <tspan key={j} x={r.x} y={top + 11.5 + j * LINE_H}>{ln}</tspan>
                    ))}
                  </text>
                  {r.descLines.length > 0 && (
                    <text x={r.x} fontSize={10} textAnchor="middle" fill="#475569">
                      {r.descLines.map((ln, j) => (
                        <tspan key={j} x={r.x} y={top + r.lines.length * LINE_H + 9.5 + j * DESC_H}>{ln}</tspan>
                      ))}
                    </text>
                  )}
                </>
              );
            })()}
          </g>
        ))}

        {/* Flux labels — above every arrow so a crossing line never strikes the text */}
        {labels.map((l, i) => l && (
          <g key={`fl-${i}`}>
            <rect x={l.box.x - l.box.w / 2} y={l.box.y - l.box.h / 2} width={l.box.w} height={l.box.h} rx={4} fill="#ffffff" stroke="#e2e8f0" strokeWidth={0.75} />
            <text x={l.box.x} fontSize={10.5} textAnchor="middle" fill="#0f766e" fontWeight={600}>
              {l.lines.map((ln, j) => (
                <tspan key={j} x={l.box.x} y={l.box.y - l.box.h / 2 + 12 + j * 13}>{ln}</tspan>
              ))}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
