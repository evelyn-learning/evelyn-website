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
      {title && <div className="text-base font-semibold text-gray-800 mb-3 text-center"><InlineMathText text={title} /></div>}
      {style === 'bar' ? <Bars fractions={fractions} /> : <Circles fractions={fractions} />}
    </div>
  );
}

type Frac = FractionComparisonFigure['fractions'][number];

/** How many whole shapes a fraction needs (5/3 → 2; 3/4 → 1; 0/5 → 1). */
function shapesFor(f: Frac): number {
  return Math.max(1, Math.ceil(f.numerator / f.denominator - 1e-9));
}

/** A row is named by its fraction. A caller's own label replaces it (it may
 *  be deliberate, e.g. "?" when the student is to name the fraction). */
function nameOf(f: Frac): { main: string; note?: string } {
  const frac = `${f.numerator}/${f.denominator}`;
  const label = f.label?.trim();
  if (!label || label.replace(/\s+/g, '') === frac) return { main: frac };
  // Short labels read as a name; long ones are set smaller and wrapped.
  return label.length <= 8 ? { main: label } : { main: '', note: label };
}

function Bars({ fractions }: { fractions: Frac[] }) {
  const BAR_H = 38;
  const BAR_GAP = 16;
  const MAIN_FONT = 15;
  const NOTE_FONT = 12;
  const NOTE_LINE_H = 14;
  const NOTE_WRAP = 150;
  const usableW = 460;
  const WHOLE_GAP = 10;

  const names = fractions.map(nameOf);
  const noteLines = names.map((n) => (n.note ? wrapLabel(n.note, (NOTE_WRAP * 13) / NOTE_FONT) : []));
  const gutterW = Math.max(
    56,
    ...names.map((n) => estimateLabelWidth(n.main, MAIN_FONT)),
    ...noteLines.flatMap((lines) => lines.map((l) => estimateLabelWidth(l, NOTE_FONT))),
  );
  const PAD_X = Math.ceil(gutterW) + 22;
  const W = PAD_X + usableW + 24;

  // One whole has the same width in every row, so the bars compare by eye.
  // A fraction above 1 is drawn as that many wholes side by side.
  const maxShapes = Math.max(...fractions.map(shapesFor));
  const unitW = (usableW - (maxShapes - 1) * WHOLE_GAP) / maxShapes;

  const rowH = noteLines.map((lines, i) => Math.max(BAR_H, (names[i].main ? 18 : 2) + lines.length * NOTE_LINE_H));
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
        const cellW = unitW / f.denominator;
        const lines = noteLines[i];
        const hasMain = names[i].main !== '';
        const blockH = (hasMain ? 16 : 0) + lines.length * NOTE_LINE_H;
        const mainY = y + BAR_H / 2 - blockH / 2 + (hasMain ? 14 : -3);
        const shapes = shapesFor(f);
        return (
          <g key={i}>
            <text x={PAD_X - 14} y={mainY} fontSize={MAIN_FONT} textAnchor="end" fill="#1f2937" fontWeight={700}>
              {names[i].main}
            </text>
            {lines.length > 0 && (
              <text fontSize={NOTE_FONT} textAnchor="end" fill="#4b5563" fontWeight={600}>
                {lines.map((line, li) => (
                  <tspan key={li} x={PAD_X - 14} y={mainY + 15 + li * NOTE_LINE_H}>{line}</tspan>
                ))}
              </text>
            )}
            {Array.from({ length: shapes }).map((_, w) => {
              const x0 = PAD_X + w * (unitW + WHOLE_GAP);
              const filledCells = Math.max(0, Math.min(f.denominator, f.numerator - w * f.denominator));
              const filledW = filledCells * cellW;
              return (
                <g key={w}>
                  <rect x={x0} y={y} width={unitW} height={BAR_H} fill="#f3f4f6" />
                  {filledW > 0 && <rect x={x0} y={y} width={filledW} height={BAR_H} fill={color} />}
                  {/* Partition lines: white across the shaded part, tinted across the rest.
                      Left out only when the parts are too thin to tell apart. */}
                  {cellW >= 2.5 && Array.from({ length: f.denominator - 1 }).map((__, j) => {
                    const lx = x0 + (j + 1) * cellW;
                    const inFilled = j + 1 < filledCells + 1e-9 && j + 1 <= filledCells;
                    return (
                      <line
                        key={j}
                        x1={lx}
                        y1={y}
                        x2={lx}
                        y2={y + BAR_H}
                        stroke={inFilled ? '#ffffff' : color}
                        strokeOpacity={inFilled ? 0.9 : 0.55}
                        strokeWidth={cellW < 6 ? 0.75 : 1.5}
                      />
                    );
                  })}
                  <rect x={x0} y={y} width={unitW} height={BAR_H} fill="none" stroke={color} strokeWidth={2} />
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

function Circles({ fractions }: { fractions: Frac[] }) {
  const R = 52;
  const GAP = 10;          // between the wholes of one fraction
  const ITEM_PAD = 18;
  const NOTE_LINE_H = 14;
  const names = fractions.map(nameOf);
  const items = fractions.map((f, i) => {
    const shapes = shapesFor(f);
    const lines = names[i].note ? wrapLabel(names[i].note as string, 200) : [];
    const labelW = Math.max(estimateLabelWidth(names[i].main, 15), ...lines.map((l) => estimateLabelWidth(l, 12)));
    const shapesW = shapes * 2 * R + (shapes - 1) * GAP;
    const w = Math.max(shapesW, Math.ceil(labelW)) + 2 * ITEM_PAD;
    return { lines, w, shapes, shapesW };
  });
  const W = items.reduce((s, it) => s + it.w, 0);
  const maxLines = Math.max(...items.map((it) => it.lines.length));
  const H = R * 2 + 16 + 24 + maxLines * NOTE_LINE_H + 10;

  let xCursor = 0;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxWidth: Math.min(700, W * 1.25) }}>
      {fractions.map((f, i) => {
        const item = items[i];
        const mid = xCursor + item.w / 2;
        xCursor += item.w;
        const cy = R + 16;
        const color = f.color || PALETTE[i % PALETTE.length];
        const drawLines = f.denominator <= 60;
        return (
          <g key={i}>
            {Array.from({ length: item.shapes }).map((_, w) => {
              const cx = mid - item.shapesW / 2 + R + w * (2 * R + GAP);
              const filled = Math.max(0, Math.min(f.denominator, f.numerator - w * f.denominator));
              const frac = filled / f.denominator;
              const a0 = -Math.PI / 2;
              const a1 = a0 + frac * 2 * Math.PI;
              const sector = frac >= 1 - 1e-9
                ? null
                : `M ${cx} ${cy} L ${cx + R * Math.cos(a0)} ${cy + R * Math.sin(a0)} A ${R} ${R} 0 ${frac > 0.5 ? 1 : 0} 1 ${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)} Z`;
              return (
                <g key={w}>
                  <circle cx={cx} cy={cy} r={R} fill={frac >= 1 - 1e-9 ? color : '#f3f4f6'} />
                  {sector && frac > 0 && <path d={sector} fill={color} />}
                  {/* Partition spokes: white inside the shaded part, tinted outside. */}
                  {drawLines && f.denominator > 1 && Array.from({ length: f.denominator }).map((__, j) => {
                    const a = -Math.PI / 2 + (j * 2 * Math.PI) / f.denominator;
                    const inFilled = j > 0 && j < filled;
                    const edge = j === 0 || j === filled;
                    return (
                      <line
                        key={j}
                        x1={cx}
                        y1={cy}
                        x2={cx + R * Math.cos(a)}
                        y2={cy + R * Math.sin(a)}
                        stroke={inFilled || (edge && filled > 0 && filled >= f.denominator) ? '#ffffff' : color}
                        strokeOpacity={inFilled ? 0.9 : edge ? 1 : 0.55}
                        strokeWidth={1.5}
                      />
                    );
                  })}
                  <circle cx={cx} cy={cy} r={R} fill="none" stroke={color} strokeWidth={2} />
                </g>
              );
            })}
            {names[i].main && (
              <text x={mid} y={cy + R + 24} fontSize={15} textAnchor="middle" fill="#1f2937" fontWeight={700}>
                {names[i].main}
              </text>
            )}
            {item.lines.length > 0 && (
              <text fontSize={12} textAnchor="middle" fill="#4b5563" fontWeight={600}>
                {item.lines.map((line, li) => (
                  <tspan key={li} x={mid} y={cy + R + (names[i].main ? 40 : 22) + li * NOTE_LINE_H}>{line}</tspan>
                ))}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
