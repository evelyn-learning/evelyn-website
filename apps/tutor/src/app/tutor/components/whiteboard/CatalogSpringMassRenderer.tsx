'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { SpringMassFigure } from '@/lib/tutor/diagrams/catalog/kinds/physics';

export function CatalogSpringMassRenderer({ figure }: { figure: SpringMassFigure }) {
  const { displacement, showEquilibrium, orientation, mass, k, title } = figure;
  const isVert = orientation === 'vertical';
  const W = isVert ? 320 : 480;
  const H = isVert ? 420 : 220;
  if (isVert) {
    const ceilingY = 30;
    const eqY = 220;
    const massY = eqY + displacement;
    const massSize = 50;
    return (
      <div className="w-full flex flex-col items-center">
        {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[360px]">
          <line x1={50} y1={ceilingY} x2={W - 50} y2={ceilingY} stroke="#374151" strokeWidth={3} />
          <SpringV cx={W / 2} y1={ceilingY} y2={massY - massSize / 2} />
          <rect x={W / 2 - massSize / 2} y={massY - massSize / 2} width={massSize} height={massSize} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} rx={4} />
          {mass !== undefined && <text x={W / 2} y={massY + 5} fontSize={14} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>{mass}</text>}
          {showEquilibrium && (
            <g>
              <line x1={50} y1={eqY} x2={W - 50} y2={eqY} stroke="#9ca3af" strokeDasharray="6 4" strokeWidth={1.5} />
              <text x={W - 50} y={eqY - 4} fontSize={11} textAnchor="end" fill="#6b7280">equilibrium</text>
            </g>
          )}
          {k !== undefined && <text x={W / 2} y={H - 12} fontSize={13} textAnchor="middle" fill="#374151" fontWeight={600}>k = {k}</text>}
        </svg>
      </div>
    );
  }
  const wallX = 40;
  const cy = H / 2;
  const eqX = W - 100;
  const massX = eqX + displacement;
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[520px]">
        <line x1={wallX} y1={cy - 60} x2={wallX} y2={cy + 60} stroke="#374151" strokeWidth={4} />
        <SpringH cx={cy} x1={wallX} x2={massX - 25} />
        <rect x={massX - 25} y={cy - 25} width={50} height={50} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} rx={4} />
        {mass !== undefined && <text x={massX} y={cy + 5} fontSize={14} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>{mass}</text>}
        {showEquilibrium && (
          <g>
            <line x1={eqX} y1={cy - 50} x2={eqX} y2={cy + 50} stroke="#9ca3af" strokeDasharray="6 4" strokeWidth={1.5} />
            <text x={eqX} y={cy - 56} fontSize={11} textAnchor="middle" fill="#6b7280">equilibrium</text>
          </g>
        )}
      </svg>
    </div>
  );
}

function SpringV({ cx, y1, y2 }: { cx: number; y1: number; y2: number }) {
  const coils = 8;
  const w = 18;
  const segH = (y2 - y1) / coils;
  let path = `M ${cx} ${y1}`;
  for (let i = 0; i < coils; i++) {
    const yMid = y1 + (i + 0.5) * segH;
    const yEnd = y1 + (i + 1) * segH;
    path += ` L ${cx + (i % 2 === 0 ? w : -w)} ${yMid} L ${cx} ${yEnd}`;
  }
  return <path d={path} fill="none" stroke="#374151" strokeWidth={2} />;
}
function SpringH({ cx, x1, x2 }: { cx: number; x1: number; x2: number }) {
  const coils = 8;
  const h = 18;
  const segW = (x2 - x1) / coils;
  let path = `M ${x1} ${cx}`;
  for (let i = 0; i < coils; i++) {
    const xMid = x1 + (i + 0.5) * segW;
    const xEnd = x1 + (i + 1) * segW;
    path += ` L ${xMid} ${cx + (i % 2 === 0 ? h : -h)} L ${xEnd} ${cx}`;
  }
  return <path d={path} fill="none" stroke="#374151" strokeWidth={2} />;
}
