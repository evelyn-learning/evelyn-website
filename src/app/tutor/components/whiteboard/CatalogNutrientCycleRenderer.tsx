'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
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

  // Reservoir boxes on a ring, starting at the top.
  const boxH = 42;
  const layout = reservoirs.map((r, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / reservoirs.length;
    const w = Math.max(96, Math.min(168, Math.round(r.label.length * 7.2) + 24));
    return {
      ...r,
      x: cx + ring * Math.cos(a),
      y: cy + ring * Math.sin(a),
      w,
      h: boxH,
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
                const rectW = Math.min(150, f.label.length * 6.6) + 8;
                return (
                  <g>
                    <rect
                      x={labelX - rectW / 2}
                      y={labelY - 9}
                      width={rectW}
                      height={16}
                      rx={3}
                      fill="#ffffff"
                      opacity={0.92}
                    />
                    <text x={labelX} y={labelY + 3} fontSize={10.5} textAnchor="middle" fill="#b91c1c" fontWeight={600}>
                      {f.label}
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
            <text x={r.x} y={r.y + 4} fontSize={12.5} textAnchor="middle" fill="#1f2937" fontWeight={700}>
              {r.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
