'use client';

import React from 'react';
import type { InclinedPlaneFigure } from '@/lib/tutor/diagrams/catalog/kinds/physics';
import { deoverlapLabels, type DeoverlapLabel, type DeoverlapObstacle } from '@/lib/tutor/whiteboard/label-deoverlap';

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
  // Mass caption drawn unrotated at absolute coordinates (visual center of
  // the rotated block) so the layout pass below can measure it. Absolute
  // position of the block-local point (0, -blockH/2 + 5) under
  // translate(blockX blockY) rotate(-angle).
  const massLabel = mass !== undefined ? `${mass} kg` : null;
  const massLabelX = blockX - 13 * Math.sin(rad);
  const massLabelY = blockY - 13 * Math.cos(rad);
  // Force arrow geometry (all arrows start at the block's visual center).
  const arrowCy = blockY - blockH / 2;
  const arrowLen = 60;
  const forceGeoms = showForces
    ? [
        { key: 'W', color: '#16a34a', text: 'W', x2: blockX, y2: arrowCy + arrowLen },
        { key: 'N', color: '#3b82f6', text: 'N', x2: blockX + arrowLen * Math.sin(rad), y2: arrowCy - arrowLen * Math.cos(rad) },
        ...(showFriction
          ? [{ key: 'f', color: '#f59e0b', text: 'f', x2: blockX - arrowLen * 0.7 * Math.cos(rad), y2: arrowCy + arrowLen * 0.7 * Math.sin(rad) }]
          : []),
      ]
    : [];
  // ── Label layout pass (2026-07-19 renderer label-collision audit):
  // force labels seeded at their historical tip-offset spots — the
  // friction label used to sit back on its own down-slope shaft. One
  // deoverlapLabels pass with the shafts / block / mass caption as
  // obstacles nudges only what collides. ──
  const blockCorners = [
    [-blockW / 2, 0], [blockW / 2, 0], [-blockW / 2, -blockH], [blockW / 2, -blockH],
  ].map(([lx, ly]) => ({
    x: blockX + lx * Math.cos(rad) + ly * Math.sin(rad),
    y: blockY - lx * Math.sin(rad) + ly * Math.cos(rad),
  }));
  const labelObstacles: DeoverlapObstacle[] = [
    ...forceGeoms.map((g): DeoverlapObstacle => ({
      left: Math.min(blockX, g.x2) - 5,
      right: Math.max(blockX, g.x2) + 5,
      top: Math.min(arrowCy, g.y2) - 5,
      bottom: Math.max(arrowCy, g.y2) + 5,
    })),
    {
      left: Math.min(...blockCorners.map((c) => c.x)),
      right: Math.max(...blockCorners.map((c) => c.x)),
      top: Math.min(...blockCorners.map((c) => c.y)),
      bottom: Math.max(...blockCorners.map((c) => c.y)),
    },
  ];
  if (massLabel) {
    const halfW = (massLabel.length * 13 * 0.55) / 2;
    labelObstacles.push({ left: massLabelX - halfW, right: massLabelX + halfW, top: massLabelY - 13, bottom: massLabelY + 4 });
  }
  type PlaneLabel = DeoverlapLabel & { key: string };
  const resolvedLabels = deoverlapLabels(
    [
      ...forceGeoms.map((g): PlaneLabel => ({
        key: g.key, x: g.x2 + 8, y: g.y2 + 4, text: g.text, fontSize: 13, anchor: 'start',
        preferDir: g.y2 > arrowCy ? 'down' : 'up',
      })),
      { key: 'angle', x: startX + 70, y: baseY - 10, text: `${angle}°`, fontSize: 14, anchor: 'start' },
    ],
    { width: W, height: H },
    { obstacles: labelObstacles, baseline: 'alphabetic' },
  );
  const labelPos = new Map(resolvedLabels.map((l) => [l.key, { x: l.x, y: l.y }]));
  const anglePos = labelPos.get('angle') ?? { x: startX + 70, y: baseY - 10 };
  return (
    <div className="incline-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[600px]">
        {/* Triangle */}
        <polygon points={`${startX},${baseY} ${apexX},${baseY} ${apexX},${apexY}`} fill="#f3f4f6" stroke="#374151" strokeWidth={2} />
        {/* Block — rotated to sit on slope (caption drawn unrotated below) */}
        <g transform={`translate(${blockX} ${blockY}) rotate(${-angle})`}>
          <rect x={-blockW / 2} y={-blockH} width={blockW} height={blockH} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} rx={3} />
        </g>
        {massLabel && (
          <text x={massLabelX} y={massLabelY} fontSize={13} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>
            {massLabel}
          </text>
        )}
        {/* Angle arc + label */}
        <path
          d={`M ${startX + 50} ${baseY} A 50 50 0 0 0 ${startX + 50 * Math.cos(rad)} ${baseY - 50 * Math.sin(rad)}`}
          fill="none"
          stroke="#dc2626"
          strokeWidth={2}
        />
        <text x={anglePos.x} y={anglePos.y} fontSize={14} fill="#dc2626" fontWeight={700}>
          {angle}°
        </text>
        {/* Forces */}
        {forceGeoms.map((g) => (
          <Arrow
            key={g.key}
            x1={blockX}
            y1={arrowCy}
            x2={g.x2}
            y2={g.y2}
            color={g.color}
            label={g.text}
            labelX={labelPos.get(g.key)?.x ?? g.x2 + 8}
            labelY={labelPos.get(g.key)?.y ?? g.y2 + 4}
          />
        ))}
      </svg>
    </div>
  );
}

function Arrow({ x1, y1, x2, y2, color, label, labelX, labelY }: {
  x1: number; y1: number; x2: number; y2: number; color: string; label: string;
  labelX?: number; labelY?: number;
}) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.5} markerEnd={`url(#arrow-${color})`} />
      <defs>
        <marker id={`arrow-${color}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      <text x={labelX ?? x2 + 8} y={labelY ?? y2 + 4} fontSize={13} fill={color} fontWeight={700}>{label}</text>
    </g>
  );
}
