'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import { wrapLabel } from './fraction-bar-layout';
import { cycleStagesFeatureNames, type CycleStagesFigure } from '@/lib/tutor/diagrams/catalog/kinds/chem-bio';

const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export function CatalogCycleStagesRenderer({ figure }: { figure: CycleStagesFigure }) {
  const { stages, title } = figure;
  const N = cycleStagesFeatureNames;
  const W = 520;
  const H = 460;
  const cx = W / 2;
  const cy = H / 2;
  const r = 170;
  const nodeR = 42;
  const positions = stages.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / stages.length;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
  return (
    <div className="cycle-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      {/* `data-feature` on the inner SVG flips the ScribbleOverlays
          measurer into SVG mode. The whole-cycle feature is the
          full viewBox; per-stage features carry normalized
          cx/cy/w/h on each <g>. */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[560px]"
        data-feature={N.cycle}
        data-feature-label={title || 'cycle'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* Arrows between consecutive stages along the circle */}
        {positions.map((p, i) => {
          const next = positions[(i + 1) % positions.length];
          // Draw arc from p outward to next.
          const a0 = Math.atan2(p.y - cy, p.x - cx);
          const a1 = Math.atan2(next.y - cy, next.x - cx);
          const startA = a0 + 0.18;
          const endA = a1 - 0.18;
          const sx = cx + (r) * Math.cos(startA);
          const sy = cy + (r) * Math.sin(startA);
          const ex = cx + (r) * Math.cos(endA);
          const ey = cy + (r) * Math.sin(endA);
          return (
            <path
              key={`arr-${i}`}
              d={`M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`}
              fill="none"
              stroke="#6b7280"
              strokeWidth={2}
              markerEnd="url(#cyc-arr)"
            />
          );
        })}
        <defs>
          <marker id="cyc-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" />
          </marker>
        </defs>
        {/* Nodes */}
        {stages.map((s, i) => {
          const p = positions[i];
          const color = s.color || PALETTE[i % PALETTE.length];
          // SVG-mode bbox is normalized to viewBox.
          const cxFrac = p.x / W;
          const cyFrac = p.y / H;
          // Slight oversize on the bbox so tick/highlight visually
          // encloses the node circle rather than sitting on its edge.
          const sideFrac = (2 * nodeR * 1.05) / Math.min(W, H);
          return (
            <g
              key={i}
              data-feature={N.stage(i)}
              data-feature-label={s.label}
              data-feature-cx={cxFrac}
              data-feature-cy={cyFrac}
              data-feature-w={sideFrac * (H / W)}
              data-feature-h={sideFrac}
            >
              <circle cx={p.x} cy={p.y} r={nodeR} fill={color + '22'} stroke={color} strokeWidth={2.5} />
              {/* Long stage labels wrap to tspans near the node width and each
                  line clamps into the viewBox (2026-08-07 clip audit: ring
                  nodes sit at x=90/430 of W=520, so a long centered label
                  escaped the frame). Ring geometry is unchanged. */}
              <text x={p.x} fontSize={12} textAnchor="middle" fill="#1f2937" fontWeight={700}>
                {(() => {
                  const lines = wrapLabel(s.label, 96);
                  const lineH = 13;
                  return lines.map((ln, j) => {
                    const lw = ln.length * 12 * 0.55;
                    const lx = Math.max(3 + lw / 2, Math.min(p.x, W - 3 - lw / 2));
                    return (
                      <tspan key={j} x={lx} y={p.y + 4 - ((lines.length - 1) * lineH) / 2 + j * lineH}>{ln}</tspan>
                    );
                  });
                })()}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
