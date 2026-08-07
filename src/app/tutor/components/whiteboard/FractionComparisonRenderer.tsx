'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { FractionComparisonFigure } from '@/lib/tutor/diagrams/catalog/kinds/fraction-comparison';
// Width-aware label layout (the FractionBar "anted square out" fix, commit
// 009dc645): labels used to get a fixed 68u left gutter (bars) / a fixed
// 140u-per-item canvas (circles), so any label longer than ~8 chars clipped
// at the viewBox edge. Reuse the shared wrap/estimate helpers so the gutter
// and per-item boxes grow to the (wrapped) label instead.
import { estimateLabelWidth, wrapLabel } from './fraction-bar-layout';

const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function FractionComparisonRenderer({ figure }: { figure: FractionComparisonFigure }) {
  const { fractions, style, title } = figure;
  return (
    <div className="fraction-comparison-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-3"><InlineMathText text={title} /></div>}
      {style === 'bar' ? <Bars fractions={fractions} /> : <Circles fractions={fractions} />}
    </div>
  );
}

function Bars({ fractions }: { fractions: FractionComparisonFigure['fractions'] }) {
  const BAR_H = 38;
  const BAR_GAP = 16;
  const LABEL_FONT = 14;
  const LABEL_LINE_H = 16;
  /** Max label line width in 14px units; wrapLabel estimates at 13px, so scale the cap. */
  const LABEL_WRAP = 190;
  const usableW = 460;

  // Wrap each label and size the left gutter to the widest wrapped line
  // (was a fixed 68u ≈ 8 chars).
  const labelLines = fractions.map((f) =>
    wrapLabel(f.label || `${f.numerator}/${f.denominator}`, (LABEL_WRAP * 13) / LABEL_FONT),
  );
  const gutterW = Math.max(
    68,
    ...labelLines.map((lines) => Math.max(...lines.map((l) => estimateLabelWidth(l, LABEL_FONT)))),
  );
  const PAD_X = Math.ceil(gutterW) + 12;
  const W = PAD_X + usableW + 60;

  // Rows grow when a wrapped label is taller than the bar.
  const rowH = labelLines.map((lines) => Math.max(BAR_H, lines.length * LABEL_LINE_H));
  const rowY: number[] = [];
  let cursor = 12;
  for (const h of rowH) {
    rowY.push(cursor);
    cursor += h + BAR_GAP;
  }
  const H = cursor - BAR_GAP + 12;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
      {fractions.map((f, i) => {
        const y = rowY[i] + (rowH[i] - BAR_H) / 2;
        const color = f.color || PALETTE[i % PALETTE.length];
        const cellW = usableW / f.denominator;
        const filled = f.numerator;
        const lines = labelLines[i];
        // Wrapped label lines, vertically centered on the bar.
        const firstLineY = y + BAR_H / 2 + 5 - ((lines.length - 1) * LABEL_LINE_H) / 2;
        return (
          <g key={i}>
            <text x={PAD_X - 12} y={firstLineY} fontSize={LABEL_FONT} textAnchor="end" fill="#374151" fontWeight={600}>
              {lines.map((line, li) => (
                <tspan key={li} x={PAD_X - 12} dy={li === 0 ? 0 : LABEL_LINE_H}>
                  {line}
                </tspan>
              ))}
            </text>
            {Array.from({ length: f.denominator }).map((_, j) => (
              <rect
                key={j}
                x={PAD_X + j * cellW}
                y={y}
                width={cellW}
                height={BAR_H}
                fill={j < filled ? color : '#f3f4f6'}
                stroke={color}
                strokeWidth={1.5}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function Circles({ fractions }: { fractions: FractionComparisonFigure['fractions'] }) {
  const R = 52;
  const MIN_ITEM_W = 140;
  const LABEL_LINE_H = 15;
  // 13px labels — estimateLabelWidth/wrapLabel defaults match.
  const items = fractions.map((f) => {
    const lines = wrapLabel(f.label || `${f.numerator}/${f.denominator}`);
    const labelW = Math.max(...lines.map((l) => estimateLabelWidth(l)));
    // Item box grows to the widest wrapped label line (was a fixed 140u
    // per item sized from the shape alone — the exact FractionBar disease).
    const w = Math.max(MIN_ITEM_W, Math.ceil(labelW) + 12);
    return { lines, w };
  });
  const W = Math.max(items.reduce((s, it) => s + it.w, 0), MIN_ITEM_W);
  const maxLines = Math.max(...items.map((it) => it.lines.length));
  const H = R * 2 + 16 + 22 + (maxLines - 1) * LABEL_LINE_H + 12;

  let xCursor = 0;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
      {fractions.map((f, i) => {
        const item = items[i];
        const cx = xCursor + item.w / 2;
        xCursor += item.w;
        const cy = R + 16;
        const color = f.color || PALETTE[i % PALETTE.length];
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={R} fill="#f3f4f6" stroke={color} strokeWidth={2} />
            {Array.from({ length: f.denominator }).map((_, j) => {
              const a0 = (-Math.PI / 2) + (j * 2 * Math.PI) / f.denominator;
              const a1 = (-Math.PI / 2) + ((j + 1) * 2 * Math.PI) / f.denominator;
              const x0 = cx + R * Math.cos(a0);
              const y0 = cy + R * Math.sin(a0);
              const x1 = cx + R * Math.cos(a1);
              const y1 = cy + R * Math.sin(a1);
              const large = (a1 - a0) > Math.PI ? 1 : 0;
              const d = `M ${cx} ${cy} L ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} Z`;
              return (
                <path
                  key={j}
                  d={d}
                  fill={j < f.numerator ? color : 'transparent'}
                  stroke={color}
                  strokeWidth={1.5}
                />
              );
            })}
            <text x={cx} y={cy + R + 22} fontSize={13} textAnchor="middle" fill="#374151" fontWeight={600}>
              {item.lines.map((line, li) => (
                <tspan key={li} x={cx} dy={li === 0 ? 0 : LABEL_LINE_H}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
