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
  const r = 168;
  // Nodes are as large as the ring allows (so one-word labels such as
  // "Condensation" sit inside with a margin) and shrink when there are many.
  const nodeR = Math.max(26, Math.min(48, r * Math.sin(Math.PI / stages.length) * 0.78));
  // Angle a node covers as seen from the ring centre: arrows start and stop
  // just outside it instead of running under the label.
  const nodeAngle = 2 * Math.asin(Math.min(1, nodeR / (2 * r)));
  const gapAngle = nodeAngle + 7 / r;
  const hasDescriptions = stages.some((s) => s.description && s.description.trim());
  // The longest single word must fit across the node; smaller nodes get smaller type.
  const longestWord = Math.max(1, ...stages.flatMap((s) => s.label.split(/\s+/).map((w) => w.length)));
  const labelFs = Math.max(9.5, Math.min(12.5, (nodeR * 2 - 12) / (longestWord * 0.6)));
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
          let sweep = a1 - a0;
          while (sweep <= 0) sweep += 2 * Math.PI;
          if (sweep <= 2 * gapAngle + 0.02) return null; // nodes touch: no room for an arrow
          const startA = a0 + gapAngle;
          const endA = a0 + sweep - gapAngle;
          const large = sweep - 2 * gapAngle > Math.PI ? 1 : 0;
          const sx = cx + (r) * Math.cos(startA);
          const sy = cy + (r) * Math.sin(startA);
          const ex = cx + (r) * Math.cos(endA);
          const ey = cy + (r) * Math.sin(endA);
          return (
            <path
              key={`arr-${i}`}
              d={`M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`}
              fill="none"
              stroke="#6b7280"
              strokeWidth={2}
              markerEnd="url(#cyc-arr)"
            />
          );
        })}
        <defs>
          <marker id="cyc-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
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
              <circle cx={p.x} cy={p.y} r={nodeR} fill={/^#[0-9a-f]{6}$/i.test(color) ? color + '22' : '#f8fafc'} stroke={color} strokeWidth={2.5} />
              {hasDescriptions && (
                <g>
                  <circle cx={p.x + nodeR * 0.72} cy={p.y - nodeR * 0.72} r={9} fill={color} stroke="#ffffff" strokeWidth={1.5} />
                  <text x={p.x + nodeR * 0.72} y={p.y - nodeR * 0.72 + 3.5} fontSize={10} textAnchor="middle" fill="#ffffff" fontWeight={700}>{i + 1}</text>
                </g>
              )}
              {/* Long stage labels wrap to tspans near the node width and each
                  line clamps into the viewBox (2026-08-07 clip audit: ring
                  nodes sit at x=90/430 of W=520, so a long centered label
                  escaped the frame). Ring geometry is unchanged. */}
              <text x={p.x} fontSize={labelFs} textAnchor="middle" fill="#1f2937" fontWeight={700}>
                {(() => {
                  const lines = wrapLabel(s.label, Math.max(56, nodeR * 2 - 12));
                  const lineH = 13;
                  return lines.map((ln, j) => {
                    const lw = ln.length * labelFs * 0.55;
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
      {/* What happens at each stage, keyed to the numbered badges. */}
      {hasDescriptions && (
        <ol className="mt-1 max-w-[560px] w-full grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1 text-[13px] leading-snug text-gray-700">
          {stages.map((s, i) => (s.description && s.description.trim() ? (
            <li key={i} className="flex gap-1.5">
              <span className="shrink-0 inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] font-bold text-white" style={{ background: s.color || PALETTE[i % PALETTE.length] }}>{i + 1}</span>
              <span><span className="font-semibold text-gray-900">{s.label}:</span> {s.description}</span>
            </li>
          ) : null))}
        </ol>
      )}
    </div>
  );
}
