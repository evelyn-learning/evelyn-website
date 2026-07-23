'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { BalanceScaleFigure, BalanceScaleItem } from '@/lib/tutor/diagrams/catalog/kinds/physics';

const W = 720;
const H = 320;
const CX = W / 2;
const FY = 220;
const HALF = 240;

export function BalanceScaleRenderer({ figure }: { figure: BalanceScaleFigure }) {
  const { left, right, state, title, caption } = figure;
  const angle = state === 'level' ? 0 : state === 'tilt_left' ? -8 : 8;
  const rad = (angle * Math.PI) / 180;
  const lx = CX - HALF * Math.cos(rad);
  const ly = FY - HALF * Math.sin(rad);
  const rx = CX + HALF * Math.cos(rad);
  const ry = FY + HALF * Math.sin(rad);
  return (
    <div className="balance-scale-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        <line x1={CX - 200} y1={FY + 80} x2={CX + 200} y2={FY + 80} stroke="#9ca3af" strokeWidth={1.5} />
        <polygon points={`${CX - 28},${FY + 80} ${CX + 28},${FY + 80} ${CX},${FY}`} fill="#6b7280" stroke="#374151" />
        <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="#374151" strokeWidth={5} strokeLinecap="round" />
        <Pan cx={lx} cy={ly + 32} items={left} />
        <Pan cx={rx} cy={ry + 32} items={right} />
      </svg>
      {caption && <div className="mt-3 text-lg font-mono text-gray-800">{caption}</div>}
    </div>
  );
}

function Pan({ cx, cy, items }: { cx: number; cy: number; items: BalanceScaleItem[] }) {
  return (
    <g>
      <path d={`M ${cx - 60} ${cy} Q ${cx} ${cy + 18} ${cx + 60} ${cy}`} fill="#e5e7eb" stroke="#6b7280" strokeWidth={1.5} />
      {items.map((it, i) => {
        const x = cx - (items.length - 1) * 18 + i * 36;
        const y = cy - 30;
        return (
          <g key={i}>
            <rect x={x - 16} y={y - 16} width={32} height={32} rx={4} fill={it.color || '#dbeafe'} stroke={it.color || '#3b82f6'} strokeWidth={2} />
            <text x={x} y={y + 5} fontSize={13} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>{it.label}</text>
          </g>
        );
      })}
    </g>
  );
}
