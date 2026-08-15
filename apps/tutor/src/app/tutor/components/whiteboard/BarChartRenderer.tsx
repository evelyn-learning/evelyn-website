'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { BarChartFigure } from '@/lib/tutor/diagrams/catalog/kinds/bar-chart';

const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

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

/** Clamp a label's x so its estimated box stays inside the viewBox
 *  (ProjectileMotionRenderer clampX pattern). */
function clampX(x: number, w: number, viewW: number): number {
  const left = x - w / 2;
  const shift = Math.max(3 - left, 0) - Math.max(left + w - (viewW - 3), 0);
  return x + shift;
}

export function BarChartRenderer({ figure }: { figure: BarChartFigure }) {
  const { categories, values, yMin, yMax, yStep, yLabel, colors, title } = figure;
  const W = 640;
  const PAD_R = 24;
  const PAD_T = 32;
  const plotH = 380 - PAD_T - 60; // fixed plot height; H grows below for extra label lines
  // Rotated y-label wraps at the plot height (its vertical budget); the left
  // pad grows one line-height per extra rotated line (audit 2026-08-07).
  const yLabelLines = yLabel ? wrapWords(yLabel, plotH, 12) : [];
  const PAD_L = 60 + Math.max(0, yLabelLines.length - 1) * 14;
  const plotW = W - PAD_L - PAD_R;
  // Category labels wrap at the column width; the bottom pad grows per line.
  const catLines = categories.map((c) => wrapWords(c, plotW / categories.length, 12));
  const maxCatLines = Math.max(1, ...catLines.map((l) => l.length));
  const PAD_B = 60 + (maxCatLines - 1) * 14;
  const H = PAD_T + plotH + PAD_B;
  const yToPx = (v: number) => PAD_T + (1 - (v - yMin) / (yMax - yMin)) * plotH;
  const barW = (plotW / categories.length) * 0.7;
  const barGap = (plotW / categories.length) * 0.3;
  const ticks: number[] = [];
  for (let v = yMin; v <= yMax + 1e-9; v += yStep) {
    ticks.push(Number(v.toFixed(10)));
  }
  return (
    <div className="bar-chart-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[680px]">
        {/* Axis */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke="#1f2937" strokeWidth={1.5} />
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke="#1f2937" strokeWidth={1.5} />
        {/* Y ticks + grid */}
        {ticks.map((t) => {
          const y = yToPx(t);
          return (
            <g key={`yt-${t}`}>
              <line x1={PAD_L - 4} y1={y} x2={PAD_L + plotW} y2={y} stroke="#e5e7eb" strokeWidth={1} />
              <text x={PAD_L - 8} y={y + 4} fontSize={11} textAnchor="end" fill="#6b7280">
                {t}
              </text>
            </g>
          );
        })}
        {/* Y label */}
        {yLabel && (
          <text
            x={20}
            y={PAD_T + plotH / 2}
            fontSize={12}
            textAnchor="middle"
            fill="#374151"
            transform={`rotate(-90 20 ${PAD_T + plotH / 2})`}
            fontWeight={600}
          >
            {yLabelLines.map((line, li) => (
              <tspan key={li} x={20} dy={li === 0 ? 0 : 14}>
                {line}
              </tspan>
            ))}
          </text>
        )}
        {/* Bars */}
        {categories.map((_, i) => {
          const v = values[i];
          const xCenter = PAD_L + (plotW / categories.length) * i + (plotW / categories.length) / 2;
          const x = xCenter - barW / 2;
          const yTop = yToPx(Math.max(v, 0));
          const yBot = yToPx(Math.min(v, 0));
          const h = yBot - yTop;
          const color = colors?.[i] || PALETTE[i % PALETTE.length];
          return (
            <g key={i}>
              <rect x={x} y={yTop} width={barW} height={Math.max(h, 1)} fill={color} stroke={color} strokeWidth={1} />
              <text x={xCenter} y={yTop - 6} fontSize={12} textAnchor="middle" fill="#1f2937" fontWeight={600}>
                {v}
              </text>
              <text x={xCenter} y={PAD_T + plotH + 18} fontSize={12} textAnchor="middle" fill="#374151">
                {catLines[i].map((line, li) => (
                  <tspan key={li} x={clampX(xCenter, estW(line, 12), W)} y={PAD_T + plotH + 18 + li * 14}>
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
