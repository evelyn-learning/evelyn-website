'use client';

import React from 'react';
import type { InclinedPlaneFigure } from '@/lib/tutor/diagrams/catalog/kinds/physics';

export function InclinedPlaneRenderer({ figure }: { figure: InclinedPlaneFigure }) {
  const { angle, mass, showForces, showFriction, title } = figure;
  const W = 600;
  const H = 360;
  const baseLen = 380;
  const startX = 80;
  const baseY = 280;
  const rad = (angle * Math.PI) / 180;
  const apexX = startX + baseLen;
  const apexY = baseY - baseLen * Math.tan(rad);
  // Block on the slope at midpoint
  const t = 0.55;
  const bx = startX + (apexX - startX) * (1 - t) + 0; // along base
  const slopeDx = (apexX - startX) * t;
  const slopeDy = -baseLen * Math.tan(rad) * t;
  const blockX = startX + slopeDx;
  const blockY = baseY + slopeDy;
  const blockW = 50;
  const blockH = 36;
  return (
    <div className="incline-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[600px]">
        {/* Triangle */}
        <polygon points={`${startX},${baseY} ${apexX},${baseY} ${apexX},${apexY}`} fill="#f3f4f6" stroke="#374151" strokeWidth={2} />
        {/* Block — rotated to sit on slope */}
        <g transform={`translate(${blockX} ${blockY}) rotate(${-angle})`}>
          <rect x={-blockW / 2} y={-blockH} width={blockW} height={blockH} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} rx={3} />
          {mass !== undefined && (
            <text x={0} y={-blockH / 2 + 5} fontSize={13} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>
              {mass} kg
            </text>
          )}
        </g>
        {/* Angle arc + label */}
        <path
          d={`M ${startX + 50} ${baseY} A 50 50 0 0 0 ${startX + 50 * Math.cos(rad)} ${baseY - 50 * Math.sin(rad)}`}
          fill="none"
          stroke="#dc2626"
          strokeWidth={2}
        />
        <text x={startX + 70} y={baseY - 10} fontSize={14} fill="#dc2626" fontWeight={700}>
          {angle}°
        </text>
        {/* Forces */}
        {showForces && <ForceArrows blockX={blockX} blockY={blockY - blockH / 2} angle={angle} showFriction={showFriction} />}
      </svg>
    </div>
  );
}

function ForceArrows({ blockX, blockY, angle, showFriction }: { blockX: number; blockY: number; angle: number; showFriction: boolean }) {
  const len = 60;
  const rad = (angle * Math.PI) / 180;
  // Weight: straight down
  const wx = blockX, wy = blockY + len;
  // Normal: perpendicular to slope (up-out)
  const nx = blockX + len * Math.sin(rad);
  const ny = blockY - len * Math.cos(rad);
  // Friction (parallel to slope, opposing motion if any)
  const fx = blockX - len * 0.7 * Math.cos(rad);
  const fy = blockY + len * 0.7 * Math.sin(rad);
  return (
    <g>
      <Arrow x1={blockX} y1={blockY} x2={wx} y2={wy} color="#16a34a" label="W" />
      <Arrow x1={blockX} y1={blockY} x2={nx} y2={ny} color="#3b82f6" label="N" />
      {showFriction && <Arrow x1={blockX} y1={blockY} x2={fx} y2={fy} color="#f59e0b" label="f" />}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color, label }: { x1: number; y1: number; x2: number; y2: number; color: string; label: string }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.5} markerEnd={`url(#arrow-${color})`} />
      <defs>
        <marker id={`arrow-${color}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      <text x={x2 + 8} y={y2 + 4} fontSize={13} fill={color} fontWeight={700}>{label}</text>
    </g>
  );
}
