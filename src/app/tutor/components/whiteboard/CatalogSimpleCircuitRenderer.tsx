'use client';

import React from 'react';
import type { SimpleCircuitFigure, CircuitComponent } from '@/lib/tutor/diagrams/catalog/kinds/physics';

const W = 600;
const H = 320;
const PAD = 60;
const RECT = { x: PAD, y: PAD, w: W - 2 * PAD, h: H - 2 * PAD };

export function CatalogSimpleCircuitRenderer({ figure }: { figure: SimpleCircuitFigure }) {
  const { components, title } = figure;
  // Place components evenly along the rectangular loop (perimeter).
  const perim = 2 * (RECT.w + RECT.h);
  const positions = components.map((_, i) => {
    const t = (i / components.length) * perim;
    return placeOnPerimeter(t);
  });
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {/* Loop wire */}
        <rect
          x={RECT.x}
          y={RECT.y}
          width={RECT.w}
          height={RECT.h}
          fill="none"
          stroke="#1f2937"
          strokeWidth={2.5}
        />
        {components.map((c, i) => {
          const p = positions[i];
          return (
            <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.angle})`}>
              <ComponentSymbol c={c} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function placeOnPerimeter(t: number): { x: number; y: number; angle: number } {
  const { x, y, w, h } = RECT;
  const top = w, right = h, bottom = w, left = h;
  if (t < top) return { x: x + t, y: y, angle: 0 };
  if (t < top + right) return { x: x + w, y: y + (t - top), angle: 90 };
  if (t < top + right + bottom) return { x: x + w - (t - top - right), y: y + h, angle: 180 };
  return { x: x, y: y + h - (t - top - right - bottom), angle: 270 };
}

function ComponentSymbol({ c }: { c: CircuitComponent }) {
  const label = c.label || c.value || '';
  if (c.type === 'battery') {
    return (
      <g>
        <rect x={-26} y={-12} width={52} height={24} fill="#fff" stroke="#1f2937" strokeWidth={1.5} />
        <line x1={-10} y1={-14} x2={-10} y2={14} stroke="#1f2937" strokeWidth={4} />
        <line x1={6} y1={-8} x2={6} y2={8} stroke="#1f2937" strokeWidth={2} />
        <text x={0} y={36} fontSize={12} textAnchor="middle" fill="#1f2937" fontWeight={600}>{label || 'V'}</text>
      </g>
    );
  }
  if (c.type === 'resistor') {
    return (
      <g>
        <path d="M -28 0 L -22 0 L -18 -10 L -10 10 L -2 -10 L 6 10 L 14 -10 L 22 10 L 26 0 L 28 0" fill="none" stroke="#1f2937" strokeWidth={2} />
        <text x={0} y={28} fontSize={12} textAnchor="middle" fill="#1f2937" fontWeight={600}>{label || 'R'}</text>
      </g>
    );
  }
  if (c.type === 'bulb') {
    return (
      <g>
        <circle cx={0} cy={0} r={14} fill="#fef3c7" stroke="#f59e0b" strokeWidth={2} />
        <line x1={-10} y1={-10} x2={10} y2={10} stroke="#f59e0b" strokeWidth={1.5} />
        <line x1={10} y1={-10} x2={-10} y2={10} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={0} y={32} fontSize={12} textAnchor="middle" fill="#1f2937" fontWeight={600}>{label}</text>
      </g>
    );
  }
  if (c.type === 'switch') {
    const closed = c.closed === true;
    return (
      <g>
        <circle cx={-14} cy={0} r={3} fill="#1f2937" />
        <circle cx={14} cy={0} r={3} fill="#1f2937" />
        <line x1={-14} y1={0} x2={closed ? 14 : 12} y2={closed ? 0 : -12} stroke="#1f2937" strokeWidth={2} />
        <text x={0} y={28} fontSize={12} textAnchor="middle" fill="#1f2937" fontWeight={600}>{label || (closed ? 'closed' : 'open')}</text>
      </g>
    );
  }
  if (c.type === 'ammeter' || c.type === 'voltmeter') {
    return (
      <g>
        <circle cx={0} cy={0} r={14} fill="#fff" stroke="#1f2937" strokeWidth={2} />
        <text x={0} y={5} fontSize={14} textAnchor="middle" fill="#1f2937" fontWeight={700}>{c.type === 'ammeter' ? 'A' : 'V'}</text>
        <text x={0} y={32} fontSize={11} textAnchor="middle" fill="#1f2937">{label}</text>
      </g>
    );
  }
  return null;
}
