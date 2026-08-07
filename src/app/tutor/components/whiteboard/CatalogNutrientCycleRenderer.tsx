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

export function CatalogNutrientCycleRenderer({ figure }: { figure: NutrientCycleFigure }) {
  const { reservoirs, fluxes, title } = figure;
  const N = nutrientCycleFeatureNames;
  const W = 600;
  const H = 500;
  const cx = W / 2;
  const cy = H / 2 + 6;
  const ring = Math.min(W, H) / 2 - 90;

  // Reservoir boxes on a ring, starting at the top. Long labels wrap to
  // tspans inside the box and the box grows vertically to fit (2026-08-07
  // clip audit: the old single-line width estimate was capped at 168 and
  // never fed the viewBox, so a long centered label on the ring's rightmost
  // box at x≈460 of W=600 escaped the frame). Box centers are then clamped
  // so the box — and the wider of box/label — stays inside the viewBox.
  const boxH = 42;
  const LINE_H = 15;
  const layout = reservoirs.map((r, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / reservoirs.length;
    const lines = wrapLabel(r.label, 144);
    const lineW = Math.ceil(Math.max(...lines.map((l) => estimateLabelWidth(l, 12.5))));
    const w = Math.max(96, Math.min(168, lineW + 24));
    const h = Math.max(boxH, lines.length * LINE_H + 18);
    const clampW = Math.max(w, lineW); // a single unbreakable word can exceed the box cap
    return {
      ...r,
      lines,
      x: Math.max(4 + clampW / 2, Math.min(cx + ring * Math.cos(a), W - 4 - clampW / 2)),
      y: Math.max(4 + h / 2, Math.min(cy + ring * Math.sin(a), H - 4 - h / 2)),
      w,
      h,
      color: r.color || PALETTE[i % PALETTE.length],
    };
  });
  const byId = new Map(layout.map((l) => [l.id, l]));

  // Track A→B vs B→A pairs so opposing fluxes bow to opposite sides.
  const seen = new Map<string, number>();

  return (
    <div className="nutrient-cycle-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[600px]"
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

        {/* Flux arrows (drawn first, under the boxes) */}
        {fluxes.map((f, i) => {
          const a = byId.get(f.from);
          const b = byId.get(f.to);
          if (!a || !b) return null;
          const s = rectEdge(a.x, a.y, a.w + 6, a.h + 6, b.x, b.y);
          const e = rectEdge(b.x, b.y, b.w + 6, b.h + 6, a.x, a.y);
          const mx = (s.x + e.x) / 2;
          const my = (s.y + e.y) / 2;
          const dirX = e.x - s.x;
          const dirY = e.y - s.y;
          const len = Math.hypot(dirX, dirY) || 1;
          // Unit perpendicular, oriented to point AWAY from the canvas center so
          // arcs + labels bow outward into the empty margin rather than piling up
          // in the crowded middle. Opposing pairs (A→B then B→A) take opposite
          // sides so their arcs separate.
          let px = -dirY / len;
          let py = dirX / len;
          if ((mx - cx) * px + (my - cy) * py < 0) { px = -px; py = -py; }
          const key = [f.from, f.to].sort().join('|');
          const order = seen.get(key) ?? 0;
          seen.set(key, order + 1);
          const side = order % 2 === 0 ? 1 : -1;
          const bow = 24 * side;
          const ctrlX = mx + px * bow;
          const ctrlY = my + py * bow;
          const labelX = mx + px * (Math.abs(bow) + 16) * side;
          const labelY = my + py * (Math.abs(bow) + 16) * side;
          return (
            <g
              key={`flux-${i}`}
              data-feature={N.flux(f.from, f.to)}
              data-feature-label={f.label || `${a.label} → ${b.label}`}
              data-feature-cx={ctrlX / W}
              data-feature-cy={ctrlY / H}
              data-feature-w={80 / W}
              data-feature-h={40 / H}
            >
              <path
                d={`M ${s.x} ${s.y} Q ${ctrlX} ${ctrlY} ${e.x} ${e.y}`}
                fill="none"
                stroke="#475569"
                strokeWidth={1.75}
                markerEnd="url(#nc-arr)"
              />
              {f.label && (() => {
                // Wrap long flux labels so they stay inside the backing rect,
                // and clamp the whole block into the viewBox (2026-08-07 clip
                // audit: the rect capped at 158 while the text kept growing).
                const lines = wrapLabel(f.label, 142);
                const lineW = Math.ceil(Math.max(...lines.map((l) => l.length * 6.6)));
                const rectW = Math.min(150, lineW) + 8;
                const rectH = 16 + (lines.length - 1) * 13;
                const clampW = Math.max(rectW, lineW + 8);
                const lx = Math.max(4 + clampW / 2, Math.min(labelX, W - 4 - clampW / 2));
                const lyTop = Math.max(4, Math.min(labelY - 9, H - 4 - rectH));
                return (
                  <g>
                    <rect
                      x={lx - rectW / 2}
                      y={lyTop}
                      width={rectW}
                      height={rectH}
                      rx={3}
                      fill="#ffffff"
                      opacity={0.92}
                    />
                    <text x={lx} fontSize={10.5} textAnchor="middle" fill="#b91c1c" fontWeight={600}>
                      {lines.map((ln, j) => (
                        <tspan key={j} x={lx} y={lyTop + 12 + j * 13}>{ln}</tspan>
                      ))}
                    </text>
                  </g>
                );
              })()}
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
            <rect
              x={r.x - r.w / 2}
              y={r.y - r.h / 2}
              width={r.w}
              height={r.h}
              rx={8}
              fill={r.color + '22'}
              stroke={r.color}
              strokeWidth={2.5}
            />
            <text x={r.x} fontSize={12.5} textAnchor="middle" fill="#1f2937" fontWeight={700}>
              {r.lines.map((ln, j) => (
                <tspan key={j} x={r.x} y={r.y + 4 - ((r.lines.length - 1) * LINE_H) / 2 + j * LINE_H}>{ln}</tspan>
              ))}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
