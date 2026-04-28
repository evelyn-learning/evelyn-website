'use client';

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
const PAD_X = 100; // room for bar name on the left
const RIGHT_PAD = 32;
const BAR_H = 56;
const BAR_GAP = 28;
const TOP_PAD = 36;
const BRACE_H = 22;

const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

function totalOf(bar: TapeBar): number {
  return bar.segments.reduce((s, seg) => s + seg.length, 0);
}

export function TapeDiagramRenderer({ figure }: TapeDiagramRendererProps) {
  const { bars, title, sharedScale } = figure;
  const usableW = W - PAD_X - RIGHT_PAD;

  // When sharedScale is on, every bar uses the same px-per-unit so
  // segment lengths are visually comparable across bars.
  const maxTotal = Math.max(...bars.map(totalOf), 1);
  const pxPerUnit = sharedScale ? usableW / maxTotal : null;

  // Each bar may have its own total label brace below — add space for it.
  const rowH = BAR_H + BAR_GAP + BRACE_H;
  const H = TOP_PAD + bars.length * rowH + 8;

  return (
    <div className="tape-diagram-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[700px] h-auto" data-feature="tape-diagram">
        {bars.map((bar, bi) => {
          const total = totalOf(bar);
          const barW = pxPerUnit !== null ? total * pxPerUnit : usableW;
          const yTop = TOP_PAD + bi * rowH;
          const xStart = PAD_X;
          let cursorX = xStart;
          return (
            <g key={`bar-${bi}`} data-feature={`bar-${bi}`}>
              {/* Bar name on the left */}
              {bar.name && (
                <text
                  x={PAD_X - 12}
                  y={yTop + BAR_H / 2 + 5}
                  fontSize={14}
                  textAnchor="end"
                  fill="#374151"
                  fontWeight={600}
                >
                  {bar.name}
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
                        x={x + segW / 2}
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
                    x={xStart + barW / 2}
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
