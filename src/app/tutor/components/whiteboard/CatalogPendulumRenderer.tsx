'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { PendulumFigure } from '@/lib/tutor/diagrams/catalog/kinds/physics';

export function CatalogPendulumRenderer({ figure }: { figure: PendulumFigure }) {
  const { length, angleDegrees, showVelocity, title } = figure;
  const W = 400;
  const H = Math.max(length + 100, 320);
  const pivotX = W / 2;
  const pivotY = 30;
  const rad = (angleDegrees * Math.PI) / 180;
  const bobX = pivotX + length * Math.sin(rad);
  const bobY = pivotY + length * Math.cos(rad);
  const restY = pivotY + length;
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[420px]">
        {/* Mount */}
        <line x1={pivotX - 40} y1={pivotY} x2={pivotX + 40} y2={pivotY} stroke="#374151" strokeWidth={3} />
        {/* Rest line */}
        <line x1={pivotX} y1={pivotY} x2={pivotX} y2={restY} stroke="#9ca3af" strokeDasharray="5 4" strokeWidth={1.5} />
        {/* Rod */}
        <line x1={pivotX} y1={pivotY} x2={bobX} y2={bobY} stroke="#1f2937" strokeWidth={2.5} />
        {/* Pivot */}
        <circle cx={pivotX} cy={pivotY} r={5} fill="#374151" />
        {/* Bob */}
        <circle cx={bobX} cy={bobY} r={20} fill="#fbbf24" stroke="#92400e" strokeWidth={2} />
        {/* Angle arc */}
        <path
          d={`M ${pivotX} ${pivotY + 40} A 40 40 0 0 ${angleDegrees > 0 ? 0 : 1} ${pivotX + 40 * Math.sin(rad)} ${pivotY + 40 * Math.cos(rad)}`}
          fill="none"
          stroke="#dc2626"
          strokeWidth={2}
        />
        <text x={pivotX + (angleDegrees > 0 ? 16 : -16)} y={pivotY + 30} fontSize={13} fill="#dc2626" fontWeight={700} textAnchor={angleDegrees > 0 ? 'start' : 'end'}>
          {Math.abs(angleDegrees)}°
        </text>
        {/* Velocity arrow */}
        {showVelocity && Math.abs(angleDegrees) > 1 && (
          <g>
            <Arrow
              x1={bobX}
              y1={bobY}
              x2={bobX + 50 * Math.cos(rad) * (angleDegrees > 0 ? -1 : 1)}
              y2={bobY - 50 * Math.sin(rad) * (angleDegrees > 0 ? -1 : 1)}
            />
          </g>
        )}
      </svg>
    </div>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g>
      <defs>
        <marker id="pend-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#16a34a" strokeWidth={2.5} markerEnd="url(#pend-arrow)" />
      <text x={x2 + 6} y={y2 + 4} fontSize={12} fill="#16a34a" fontWeight={700}>v</text>
    </g>
  );
}
