'use client';

import React from 'react';
import type { VectorAdditionFigure } from '@/lib/tutor/diagrams/catalog/kinds/physics';

const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function CatalogVectorAdditionRenderer({ figure }: { figure: VectorAdditionFigure }) {
  const { vectors, resultant, method, title } = figure;
  const W = 520;
  const H = 380;
  // Compute bounding box of all tip-to-tail traversal + parallelogram if needed.
  let minX = 0, minY = 0, maxX = 0, maxY = 0;
  if (method === 'tip_to_tail') {
    let cx = 0, cy = 0;
    for (const v of vectors) {
      cx += v.x; cy += v.y;
      minX = Math.min(minX, cx); minY = Math.min(minY, cy);
      maxX = Math.max(maxX, cx); maxY = Math.max(maxY, cy);
    }
  } else {
    for (const v of vectors) {
      minX = Math.min(minX, v.x); minY = Math.min(minY, v.y);
      maxX = Math.max(maxX, v.x); maxY = Math.max(maxY, v.y);
    }
    minX = Math.min(minX, resultant.x); minY = Math.min(minY, resultant.y);
    maxX = Math.max(maxX, resultant.x); maxY = Math.max(maxY, resultant.y);
  }
  const span = Math.max(maxX - minX, maxY - minY, 4);
  const scale = (Math.min(W, H) - 80) / span;
  const ox = W / 2 - ((maxX + minX) / 2) * scale;
  const oy = H / 2 + ((maxY + minY) / 2) * scale;
  const px = (x: number) => ox + x * scale;
  const py = (y: number) => oy - y * scale; // flip y for screen
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[560px]">
        {/* Origin axis lines */}
        <line x1={px(minX) - 20} y1={py(0)} x2={px(maxX) + 20} y2={py(0)} stroke="#e5e7eb" strokeWidth={1} />
        <line x1={px(0)} y1={py(minY) - 20} x2={px(0)} y2={py(maxY) + 20} stroke="#e5e7eb" strokeWidth={1} />
        {method === 'tip_to_tail' ? renderTipToTail(vectors, px, py) : renderParallelogram(vectors, px, py)}
        {/* Resultant */}
        <Vec
          x1={px(0)} y1={py(0)} x2={px(resultant.x)} y2={py(resultant.y)}
          color={resultant.color || '#dc2626'}
          label={resultant.label || 'R'}
          dashed
        />
      </svg>
    </div>
  );
}

function renderTipToTail(vectors: VectorAdditionFigure['vectors'], px: (x: number) => number, py: (y: number) => number) {
  let cx = 0, cy = 0;
  return vectors.map((v, i) => {
    const x1 = px(cx), y1 = py(cy);
    cx += v.x; cy += v.y;
    const x2 = px(cx), y2 = py(cy);
    const color = v.color || PALETTE[i % PALETTE.length];
    return <Vec key={i} x1={x1} y1={y1} x2={x2} y2={y2} color={color} label={v.label || `v${i + 1}`} />;
  });
}

function renderParallelogram(vectors: VectorAdditionFigure['vectors'], px: (x: number) => number, py: (y: number) => number) {
  // Draw both vectors from origin + dotted parallelogram completion.
  return vectors.map((v, i) => {
    const color = v.color || PALETTE[i % PALETTE.length];
    return <Vec key={i} x1={px(0)} y1={py(0)} x2={px(v.x)} y2={py(v.y)} color={color} label={v.label || `v${i + 1}`} />;
  });
}

function Vec({ x1, y1, x2, y2, color, label, dashed }: { x1: number; y1: number; x2: number; y2: number; color: string; label: string; dashed?: boolean }) {
  const id = `vec-arr-${color.replace('#', '')}`;
  return (
    <g>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.5} markerEnd={`url(#${id})`} strokeDasharray={dashed ? '5 4' : undefined} />
      <text x={(x1 + x2) / 2 + 6} y={(y1 + y2) / 2} fontSize={13} fill={color} fontWeight={700}>{label}</text>
    </g>
  );
}
