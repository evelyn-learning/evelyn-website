'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { FractionComparisonFigure } from '@/lib/tutor/diagrams/catalog/kinds/fraction-comparison';

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
  const W = 600;
  const BAR_H = 38;
  const BAR_GAP = 16;
  const PAD_X = 80;
  const usableW = W - PAD_X - 60;
  const H = 24 + fractions.length * (BAR_H + BAR_GAP);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
      {fractions.map((f, i) => {
        const y = 12 + i * (BAR_H + BAR_GAP);
        const color = f.color || PALETTE[i % PALETTE.length];
        const cellW = usableW / f.denominator;
        const filled = f.numerator;
        return (
          <g key={i}>
            <text x={PAD_X - 12} y={y + BAR_H / 2 + 5} fontSize={14} textAnchor="end" fill="#374151" fontWeight={600}>
              {f.label || `${f.numerator}/${f.denominator}`}
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
  const SP = 140;
  const W = Math.max(fractions.length * SP, SP);
  const H = R * 2 + 60;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
      {fractions.map((f, i) => {
        const cx = SP / 2 + i * SP;
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
              {f.label || `${f.numerator}/${f.denominator}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
