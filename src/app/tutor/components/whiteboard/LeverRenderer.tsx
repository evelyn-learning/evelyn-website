'use client';

import React from 'react';
import type { LeverFigure } from '@/lib/tutor/diagrams/catalog/kinds/physics';

export function LeverRenderer({ figure }: { figure: LeverFigure }) {
  const { effort, load, effortDistance, loadDistance, fulcrumPosition, balanced, title } = figure;
  const W = 640;
  const H = 240;
  const PAD = 60;
  const usableW = W - PAD * 2;
  const cy = 130;
  const fx = PAD + fulcrumPosition * usableW;
  return (
    <div className="lever-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        <line x1={PAD} y1={cy} x2={W - PAD} y2={cy} stroke="#374151" strokeWidth={5} strokeLinecap="round" />
        <polygon points={`${fx - 18},${cy + 30} ${fx + 18},${cy + 30} ${fx},${cy + 4}`} fill="#6b7280" />
        {/* Load (left) */}
        <rect x={PAD - 22} y={cy - 40} width={44} height={36} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} rx={4} />
        <text x={PAD} y={cy - 18} fontSize={13} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>{`${load}N`}</text>
        <text x={PAD} y={cy + 56} fontSize={11} textAnchor="middle" fill="#6b7280">{`d = ${loadDistance}`}</text>
        {/* Effort (right) */}
        <polygon points={`${W - PAD - 14},${cy - 40} ${W - PAD + 14},${cy - 40} ${W - PAD},${cy - 4}`} fill="#fef3c7" stroke="#f59e0b" strokeWidth={2} />
        <text x={W - PAD} y={cy - 22} fontSize={13} textAnchor="middle" fill="#92400e" fontWeight={700}>{`${effort}N`}</text>
        <text x={W - PAD} y={cy + 56} fontSize={11} textAnchor="middle" fill="#6b7280">{`d = ${effortDistance}`}</text>
        <text x={W / 2} y={H - 12} fontSize={13} textAnchor="middle" fill={balanced ? '#16a34a' : '#dc2626'} fontWeight={600}>
          {balanced ? `Balanced: ${effort} × ${effortDistance} = ${load} × ${loadDistance}` : `Not balanced: ${effort * effortDistance} ≠ ${load * loadDistance}`}
        </text>
      </svg>
    </div>
  );
}
