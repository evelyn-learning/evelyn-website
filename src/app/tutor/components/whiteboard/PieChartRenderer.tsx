'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { PieChartFigure } from '@/lib/tutor/diagrams/catalog/kinds/pie-chart';

const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const LEGEND_BOX_X = 340;
const LEGEND_TEXT_X = 362;
const LEGEND_LINE_H = 17;

/** Average-glyph width heuristic — same 0.55 factor as fraction-bar-layout.ts. */
function estW(text: string, fontSize: number): number {
  return text.length * fontSize * 0.55;
}

/** Greedy word wrap on the estimated width (fraction-bar-layout.ts pattern). */
function wrapWords(text: string, maxWidth: number, fontSize: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [text];
  const lines: string[] = [];
  let line = words[0];
  for (const word of words.slice(1)) {
    const candidate = `${line} ${word}`;
    if (estW(candidate, fontSize) <= maxWidth) line = candidate;
    else { lines.push(line); line = word; }
  }
  lines.push(line);
  return lines;
}

export function PieChartRenderer({ figure }: { figure: PieChartFigure }) {
  const { slices, title } = figure;
  // Legend labels wrap at the space right of the pie; rows and the viewBox
  // grow to fit the wrapped lines (audit 2026-08-07).
  const legendLines = slices.map((s) => wrapWords(`${s.label} (${s.value})`, 480 - LEGEND_TEXT_X - 8, 13));
  const legendYs: number[] = [];
  let legendCursor = 40;
  for (const lines of legendLines) {
    legendYs.push(legendCursor);
    legendCursor += Math.max(22, lines.length * LEGEND_LINE_H + 5);
  }
  const maxLegendLineW = Math.max(0, ...legendLines.flatMap((ls) => ls.map((l) => estW(l, 13))));
  const W = Math.max(480, LEGEND_TEXT_X + maxLegendLineW + 8); // over-cap single words widen the canvas
  const H = Math.max(360, legendCursor + 4);
  const cx = 180;
  const cy = 170;
  const r = 130;
  let acc = 0;
  return (
    <div className="pie-chart-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[520px]">
        {slices.map((s, i) => {
          const a0 = -Math.PI / 2 + acc * 2 * Math.PI;
          acc += s.proportion;
          const a1 = -Math.PI / 2 + acc * 2 * Math.PI;
          const large = (a1 - a0) > Math.PI ? 1 : 0;
          const x0 = cx + r * Math.cos(a0);
          const y0 = cy + r * Math.sin(a0);
          const x1 = cx + r * Math.cos(a1);
          const y1 = cy + r * Math.sin(a1);
          const color = s.color || PALETTE[i % PALETTE.length];
          const aMid = (a0 + a1) / 2;
          const lblX = cx + (r * 0.62) * Math.cos(aMid);
          const lblY = cy + (r * 0.62) * Math.sin(aMid);
          const d = s.proportion >= 1
            ? `M ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} Z`
            : `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
          return (
            <g key={i}>
              <path d={d} fill={color} stroke="#fff" strokeWidth={2} />
              {s.proportion >= 0.06 && (
                <text x={lblX} y={lblY} fontSize={12} textAnchor="middle" fill="#fff" fontWeight={700}>
                  {Math.round(s.proportion * 100)}%
                </text>
              )}
            </g>
          );
        })}
        {/* Legend on the right */}
        {slices.map((s, i) => {
          const color = s.color || PALETTE[i % PALETTE.length];
          const ly = legendYs[i];
          return (
            <g key={`lg-${i}`}>
              <rect x={LEGEND_BOX_X} y={ly - 10} width={14} height={14} fill={color} />
              <text x={LEGEND_TEXT_X} y={ly + 1} fontSize={13} fill="#374151">
                {legendLines[i].map((line, li) => (
                  <tspan key={li} x={LEGEND_TEXT_X} y={ly + 1 + li * LEGEND_LINE_H}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
