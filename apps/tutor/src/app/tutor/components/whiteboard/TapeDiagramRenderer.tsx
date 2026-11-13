'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Tape Diagram Renderer (bar model).
 *
 * Renders one or more horizontal bars with proportional segments.
 * When sharedScale is on (default), all bars share the same unit width
 * — the longest bar fills the canvas, others scale proportionally.
 */

import React from 'react';
import type { TapeFigure, TapeBar, TapeSegment } from '@/lib/tutor/diagrams/catalog/kinds/tape-diagram';

export interface TapeDiagramRendererProps {
  figure: TapeFigure;
}

const W = 720;
const PAD_X = 100; // minimum room for bar name on the left
const RIGHT_PAD = 32;
const BAR_H = 56;
const BAR_GAP = 28;
const BRACE_H = 22;
const NAME_FONT = 14;
const NAME_GAP = 12; // gap between the name's right edge and the bar
const NAME_LINE_H = 16;
/** Max estimated name-line width before wrapping — the gutter grows to the
 *  longest wrapped line so end-anchored names never clip (audit 2026-08-07). */
const NAME_WRAP_W = 150;

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
function clampX(x: number, w: number, anchor: 'start' | 'middle' | 'end'): number {
  const left = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
  const shift = Math.max(3 - left, 0) - Math.max(left + w - (W - 3), 0);
  return x + shift;
}

function totalOf(bar: TapeBar): number {
  return bar.segments.reduce((s, seg) => s + seg.length, 0);
}

const SEG_FONT = 14;
const OUT_FONT = 12;
const OUT_ROW_H = 16;

interface SegLayout {
  x: number;
  w: number;
  label?: string;
  /** 'in' = centred inside the segment; otherwise the row (0 = nearest the
   *  bar) of the callout above the bar, with its clamped centre x. */
  place: 'in' | 'out';
  row: number;
  cx: number;
}

/** Lay out one bar's segment labels. A label that fits its segment goes
 *  inside; one that does not is lifted above the bar as a callout with a
 *  short leader, and callouts are packed into rows so they never overlap. */
function layoutBar(bar: TapeBar, xStart: number, widthOf: (seg: TapeSegment) => number): { segs: SegLayout[]; outRows: number } {
  const segs: SegLayout[] = [];
  let cursor = xStart;
  const rows: Array<Array<{ left: number; right: number }>> = [];
  for (const seg of bar.segments) {
    const w = widthOf(seg);
    const label = seg.unknown && !seg.label ? '?' : seg.label || undefined;
    const lay: SegLayout = { x: cursor, w, label, place: 'in', row: 0, cx: cursor + w / 2 };
    if (label && estW(label, SEG_FONT) + 10 > w) {
      const lw = estW(label, OUT_FONT) + 4;
      const cx = clampX(cursor + w / 2, lw, 'middle');
      let r = 0;
      for (; r < rows.length; r++) {
        if (rows[r].every((b) => cx + lw / 2 + 6 <= b.left || cx - lw / 2 - 6 >= b.right)) break;
      }
      if (r === rows.length) rows.push([]);
      rows[r].push({ left: cx - lw / 2, right: cx + lw / 2 });
      lay.place = 'out';
      lay.row = r;
      lay.cx = cx;
    }
    segs.push(lay);
    cursor += w;
  }
  return { segs, outRows: rows.length };
}

export function TapeDiagramRenderer({ figure }: TapeDiagramRendererProps) {
  const { bars, title, sharedScale } = figure;

  // Left gutter sized from the longest wrapped bar name (min PAD_X).
  const nameLines = bars.map((bar) => (bar.name ? wrapWords(bar.name, NAME_WRAP_W, NAME_FONT) : []));
  const maxNameW = Math.max(0, ...nameLines.flatMap((ls) => ls.map((l) => estW(l, NAME_FONT))));
  const anyName = bars.some((b) => b.name);
  const padX = anyName ? Math.max(PAD_X, maxNameW + NAME_GAP + 8) : RIGHT_PAD;
  const usableW = W - padX - RIGHT_PAD;

  // When sharedScale is on, every bar uses the same px-per-unit so
  // segment lengths are visually comparable across bars.
  const maxTotal = Math.max(...bars.map(totalOf), 1);
  const pxPerUnit = sharedScale ? usableW / maxTotal : null;

  // Per-bar layout: callout rows above, optional total brace below.
  const laid = bars.map((bar) => {
    const total = totalOf(bar);
    const widthOf = (seg: TapeSegment) => (pxPerUnit !== null ? seg.length * pxPerUnit : (seg.length / total) * usableW);
    return layoutBar(bar, padX, widthOf);
  });
  const tops: number[] = [];
  let y = 12;
  bars.forEach((bar, bi) => {
    y += laid[bi].outRows * OUT_ROW_H + (laid[bi].outRows ? 8 : 0);
    tops.push(y);
    y += BAR_H + (bar.totalLabel ? BRACE_H + 12 : 0) + BAR_GAP;
  });
  const H = y - BAR_GAP + 12;

  return (
    <div className="tape-diagram-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[700px] h-auto" data-feature="tape-diagram">
        {bars.map((bar, bi) => {
          const total = totalOf(bar);
          const barW = pxPerUnit !== null ? total * pxPerUnit : usableW;
          const yTop = tops[bi];
          const xStart = padX;
          return (
            <g key={`bar-${bi}`} data-feature={`bar-${bi}`}>
              {/* Bar name on the left — wrapped tspans, centered on the bar */}
              {bar.name && (
                <text
                  x={padX - NAME_GAP}
                  y={yTop + BAR_H / 2 + 5}
                  fontSize={NAME_FONT}
                  textAnchor="end"
                  fill="#374151"
                  fontWeight={600}
                >
                  {nameLines[bi].map((line, li) => (
                    <tspan
                      key={li}
                      x={padX - NAME_GAP}
                      y={yTop + BAR_H / 2 + 5 + (li - (nameLines[bi].length - 1) / 2) * NAME_LINE_H}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              )}
              {/* Segments */}
              {bar.segments.map((seg: TapeSegment, si: number) => {
                const lay = laid[bi].segs[si];
                const fill = seg.unknown
                  ? '#fde68a'
                  : seg.color || PALETTE[si % PALETTE.length] + '33'; // 20% opacity hex
                const stroke = seg.unknown ? '#d97706' : seg.color || PALETTE[si % PALETTE.length];
                const calloutY = yTop - 8 - lay.row * OUT_ROW_H;
                return (
                  <g key={`seg-${bi}-${si}`} data-feature={`bar-${bi}-seg-${si}`}>
                    <rect
                      x={lay.x}
                      y={yTop}
                      width={lay.w}
                      height={BAR_H}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={lay.w < 6 ? 1 : 2}
                    />
                    {lay.label && lay.place === 'in' && (
                      <text
                        x={lay.x + lay.w / 2}
                        y={yTop + BAR_H / 2 + 5}
                        fontSize={SEG_FONT}
                        textAnchor="middle"
                        fill="#1f2937"
                        fontWeight={600}
                      >
                        {lay.label}
                      </text>
                    )}
                    {lay.label && lay.place === 'out' && (
                      <g>
                        <line
                          x1={lay.x + lay.w / 2}
                          y1={yTop - 1}
                          x2={Math.max(lay.cx - estW(lay.label, OUT_FONT) / 2 + 3, Math.min(lay.cx + estW(lay.label, OUT_FONT) / 2 - 3, lay.x + lay.w / 2))}
                          y2={calloutY + 3}
                          stroke="#6b7280"
                          strokeWidth={1}
                        />
                        <text
                          x={lay.cx}
                          y={calloutY}
                          fontSize={OUT_FONT}
                          textAnchor="middle"
                          fill="#1f2937"
                          fontWeight={600}
                        >
                          {lay.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
              {/* Total brace below */}
              {bar.totalLabel && (
                <g data-feature={`bar-${bi}-total`}>
                  <path
                    d={`M ${xStart} ${yTop + BAR_H + 6} L ${xStart} ${yTop + BAR_H + 12} L ${xStart + barW} ${yTop + BAR_H + 12} L ${xStart + barW} ${yTop + BAR_H + 6}`}
                    fill="none"
                    stroke="#6b7280"
                    strokeWidth={1.5}
                  />
                  <text
                    x={clampX(Math.max(xStart + barW / 2, xStart + estW(bar.totalLabel, 13) / 2), estW(bar.totalLabel, 13), 'middle')}
                    y={yTop + BAR_H + 27}
                    fontSize={13}
                    textAnchor="middle"
                    fill="#374151"
                    fontWeight={600}
                  >
                    {bar.totalLabel}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
