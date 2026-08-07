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
const TOP_PAD = 36;
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

export function TapeDiagramRenderer({ figure }: TapeDiagramRendererProps) {
  const { bars, title, sharedScale } = figure;

  // Left gutter sized from the longest wrapped bar name (min PAD_X).
  const nameLines = bars.map((bar) => (bar.name ? wrapWords(bar.name, NAME_WRAP_W, NAME_FONT) : []));
  const maxNameW = Math.max(0, ...nameLines.flatMap((ls) => ls.map((l) => estW(l, NAME_FONT))));
  const padX = Math.max(PAD_X, maxNameW + NAME_GAP + 8);
  const usableW = W - padX - RIGHT_PAD;

  // When sharedScale is on, every bar uses the same px-per-unit so
  // segment lengths are visually comparable across bars.
  const maxTotal = Math.max(...bars.map(totalOf), 1);
  const pxPerUnit = sharedScale ? usableW / maxTotal : null;

  // Each bar may have its own total label brace below — add space for it.
  const rowH = BAR_H + BAR_GAP + BRACE_H;
  const H = TOP_PAD + bars.length * rowH + 8;

  return (
    <div className="tape-diagram-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[700px] h-auto" data-feature="tape-diagram">
        {bars.map((bar, bi) => {
          const total = totalOf(bar);
          const barW = pxPerUnit !== null ? total * pxPerUnit : usableW;
          const yTop = TOP_PAD + bi * rowH;
          const xStart = padX;
          let cursorX = xStart;
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
                const segW = pxPerUnit !== null ? seg.length * pxPerUnit : (seg.length / total) * usableW;
                const fill = seg.unknown
                  ? '#fde68a'
                  : seg.color || PALETTE[si % PALETTE.length] + '33'; // 20% opacity hex
                const stroke = seg.unknown ? '#d97706' : seg.color || PALETTE[si % PALETTE.length];
                const x = cursorX;
                cursorX += segW;
                const labelText = seg.unknown && !seg.label ? '?' : seg.label;
                return (
                  <g key={`seg-${bi}-${si}`} data-feature={`bar-${bi}-seg-${si}`}>
                    <rect
                      x={x}
                      y={yTop}
                      width={segW}
                      height={BAR_H}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={2}
                    />
                    {labelText && (
                      <text
                        x={clampX(x + segW / 2, estW(labelText, 14), 'middle')}
                        y={yTop + BAR_H / 2 + 5}
                        fontSize={14}
                        textAnchor="middle"
                        fill="#1f2937"
                        fontWeight={600}
                      >
                        {labelText}
                      </text>
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
                    x={clampX(xStart + barW / 2, estW(bar.totalLabel, 13), 'middle')}
                    y={yTop + BAR_H + 26}
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
