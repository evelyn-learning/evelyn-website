'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { PulleyFigure, AtwoodSide } from '@/lib/tutor/diagrams/catalog/kinds/physics';
import { deoverlapLabels, type DeoverlapLabel, type DeoverlapObstacle } from '@/lib/tutor/whiteboard/label-deoverlap';

// Estimated text width — same char heuristic as label-deoverlap.
const estTextW = (s: string, fontSize: number): number => s.length * fontSize * 0.55;

export function PulleySystemRenderer({ figure }: { figure: PulleyFigure }) {
  const W = 480;
  const H = 380;
  const ceilingY = 40;
  const { mode, title } = figure;

  if (mode === 'atwood' || mode === 'table-pulley' || mode === 'incline-pulley') {
    return (
      <div className="pulley-renderer w-full flex flex-col items-center">
        {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[520px]">
          <pattern id="pulley-hatch" width={10} height={10} patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="10" y2="10" stroke="#9ca3af" strokeWidth="1" />
          </pattern>
          {mode === 'atwood' && (
            <AtwoodScene W={W} H={H} ceilingY={ceilingY} left={figure.leftSide} right={figure.rightSide} />
          )}
          {mode === 'table-pulley' && (
            <TablePulleyScene W={W} H={H} ceilingY={ceilingY} left={figure.leftSide} right={figure.rightSide} />
          )}
          {mode === 'incline-pulley' && (
            <InclinePulleyScene
              W={W}
              H={H}
              angle={figure.inclineAngle ?? 30}
              left={figure.leftSide}
              right={figure.rightSide}
            />
          )}
        </svg>
      </div>
    );
  }

  const { fixedCount, movableCount, weightLabel, mechanicalAdvantage, effort, weight } = figure;
  const fixedSpacing = 50;
  const fixedStartX = (W - fixedCount * fixedSpacing) / 2 + fixedSpacing / 2;
  const movableY = ceilingY + 180;
  const movableStartX = (W - Math.max(movableCount, 1) * fixedSpacing) / 2 + fixedSpacing / 2;
  return (
    <div className="pulley-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[520px]">
        {/* Ceiling */}
        <line x1={20} y1={ceilingY} x2={W - 20} y2={ceilingY} stroke="#6b7280" strokeWidth={3} />
        <pattern id="hatch" width={10} height={10} patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="10" y2="10" stroke="#9ca3af" strokeWidth="1" />
        </pattern>
        <rect x={20} y={ceilingY - 14} width={W - 40} height={14} fill="url(#hatch)" />
        {/* Fixed pulleys */}
        {Array.from({ length: fixedCount }).map((_, i) => {
          const cx = fixedStartX + i * fixedSpacing;
          return <circle key={`f-${i}`} cx={cx} cy={ceilingY + 14} r={12} fill="#e5e7eb" stroke="#374151" strokeWidth={2} />;
        })}
        {/* Movable pulleys */}
        {Array.from({ length: movableCount }).map((_, i) => {
          const cx = movableStartX + i * fixedSpacing;
          return <circle key={`m-${i}`} cx={cx} cy={movableY} r={12} fill="#fde68a" stroke="#92400e" strokeWidth={2} />;
        })}
        {/* Rope (schematic vertical lines) */}
        {Array.from({ length: mechanicalAdvantage }).map((_, k) => {
          const x = (W / (mechanicalAdvantage + 1)) * (k + 1);
          return <line key={`r-${k}`} x1={x} y1={ceilingY + 14} x2={x} y2={movableY} stroke="#1f2937" strokeWidth={1.5} />;
        })}
        {/* Weight */}
        <rect x={W / 2 - 32} y={movableY + 20} width={64} height={50} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} rx={4} />
        <text x={W / 2} y={movableY + 50} fontSize={14} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>
          {weightLabel}
          {weight !== undefined ? ` = ${weight}` : ''}
        </text>
        {/* Effort label */}
        <text x={W - 40} y={ceilingY + 60} fontSize={13} textAnchor="end" fill="#92400e" fontWeight={600}>
          Effort{effort !== undefined ? ` = ${effort.toFixed(2)}` : ''}
        </text>
        <text x={W / 2} y={H - 12} fontSize={13} textAnchor="middle" fill="#374151" fontWeight={600}>
          Mechanical advantage = {mechanicalAdvantage}
        </text>
      </svg>
    </div>
  );
}

function MassBlock({
  cx, cy, label, weight, width = 64, height = 50, weightPos,
}: {
  cx: number; cy: number; label: string; weight?: string; width?: number; height?: number;
  /** Resolved weight-caption spot from a scene's deoverlap pass; defaults to
   *  the historical below-block position. */
  weightPos?: { x: number; y: number; anchor?: 'start' | 'middle' | 'end' };
}) {
  return (
    <g>
      <rect x={cx - width / 2} y={cy - height / 2} width={width} height={height} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} rx={4} />
      <text x={cx} y={cy + 5} fontSize={14} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>
        {label}
      </text>
      {weight && (
        <text
          x={weightPos?.x ?? cx}
          y={weightPos?.y ?? cy + height / 2 + 16}
          fontSize={12}
          textAnchor={weightPos?.anchor ?? 'middle'}
          fill="#374151"
        >
          {weight}
        </text>
      )}
    </g>
  );
}

function PulleyWheel({ cx, cy, r = 16 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#e5e7eb" stroke="#374151" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={3} fill="#374151" />
    </g>
  );
}

function AtwoodScene({
  W, H, ceilingY, left, right,
}: { W: number; H: number; ceilingY: number; left?: AtwoodSide; right?: AtwoodSide }) {
  // A real Atwood machine has the rope wrapping over the pulley and the two
  // masses hanging directly below the pulley's contact points. Use a wide
  // pulley so the masses don't visually overlap.
  const pulleyCx = W / 2;
  const pulleyCy = ceilingY + 30;
  const pulleyR = 36;
  const massY = pulleyCy + 200;
  const leftMassCx = pulleyCx - pulleyR;
  const rightMassCx = pulleyCx + pulleyR;
  const ll = left ?? { label: 'm₁' };
  const rr = right ?? { label: 'm₂' };
  // ── Weight-caption layout (2026-07-19 renderer label-collision audit):
  // both captions render at massY + 42, so long strings overlap across the
  // pulley centerline. One deoverlapLabels pass, seeded at the historical
  // spots, with the blocks / in-block labels / pulley as obstacles. ──
  const obstacles: DeoverlapObstacle[] = [
    { left: 20, right: W - 20, top: ceilingY - 14, bottom: ceilingY + 2 },
    { left: pulleyCx - pulleyR, right: pulleyCx + pulleyR, top: pulleyCy - pulleyR, bottom: pulleyCy + pulleyR },
    ...[
      { x: leftMassCx, label: ll.label },
      { x: rightMassCx, label: rr.label },
    ].flatMap((b): DeoverlapObstacle[] => [
      { left: b.x - 28, right: b.x + 28, top: massY - 22, bottom: massY + 22 },
      { left: b.x - estTextW(b.label, 14) / 2, right: b.x + estTextW(b.label, 14) / 2, top: massY - 6, bottom: massY + 10 },
    ]),
  ];
  const resolvedWeights = deoverlapLabels(
    [
      { key: 'left', cx: leftMassCx, side: ll },
      { key: 'right', cx: rightMassCx, side: rr },
    ]
      .filter((s) => s.side.weight)
      .map((s): DeoverlapLabel & { key: string } => ({
        key: s.key, x: s.cx, y: massY + 22 + 16, text: s.side.weight!, fontSize: 12, preferDir: 'down',
      })),
    { width: W, height: H },
    { obstacles, baseline: 'alphabetic' },
  );
  const weightPos = new Map(resolvedWeights.map((l) => [l.key, { x: l.x, y: l.y }]));
  return (
    <g>
      {/* Ceiling */}
      <line x1={20} y1={ceilingY} x2={W - 20} y2={ceilingY} stroke="#6b7280" strokeWidth={3} />
      <rect x={20} y={ceilingY - 14} width={W - 40} height={14} fill="url(#pulley-hatch)" />
      {/* Pulley support bracket */}
      <line x1={pulleyCx} y1={ceilingY} x2={pulleyCx} y2={pulleyCy - pulleyR} stroke="#374151" strokeWidth={2} />
      {/* Pulley wheel */}
      <PulleyWheel cx={pulleyCx} cy={pulleyCy} r={pulleyR} />
      {/* Rope: drape over the top half of the pulley, then drop straight down
          on each side from the contact points (9 o'clock and 3 o'clock). */}
      <path
        d={`M ${leftMassCx} ${massY - 22} L ${leftMassCx} ${pulleyCy} A ${pulleyR} ${pulleyR} 0 0 1 ${rightMassCx} ${pulleyCy} L ${rightMassCx} ${massY - 22}`}
        fill="none"
        stroke="#1f2937"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      {/* Masses, slightly narrower than the pulley diameter so they don't
          collide visually. */}
      <MassBlock cx={leftMassCx} cy={massY} label={ll.label} weight={ll.weight} width={56} height={44} weightPos={weightPos.get('left')} />
      <MassBlock cx={rightMassCx} cy={massY} label={rr.label} weight={rr.weight} width={56} height={44} weightPos={weightPos.get('right')} />
    </g>
  );
}

function InclinePulleyScene({
  W, H, angle, left, right,
}: { W: number; H: number; angle: number; left?: AtwoodSide; right?: AtwoodSide }) {
  // Layout: ramp on the left rising left→right, pulley at the ramp's top-right
  // vertex, rope goes from incline block UP the ramp to the pulley, around the
  // pulley, then DOWN to a hanging block on the right.
  const baseY = H - 60;
  const baseXStart = 50;
  const baseXEnd = W - 130;          // leave room on the right for the hanging mass
  const run = baseXEnd - baseXStart;
  const rad = (angle * Math.PI) / 180;
  const rise = Math.min(run * Math.tan(rad), 200);
  const topX = baseXEnd;
  const topY = baseY - rise;
  // Pulley sits at the top vertex, lifted slightly above the corner.
  const pulleyR = 14;
  const pulleyCx = topX + pulleyR;
  const pulleyCy = topY - pulleyR;
  // Block on incline at ~50% up the slope.
  const t = 0.45;
  const slopeX = baseXStart + run * t;
  const slopeY = baseY - rise * t;
  const blockHalf = 22;
  const clearance = blockHalf + 4;
  const blockCx = slopeX - Math.sin(rad) * clearance;
  const blockCy = slopeY - Math.cos(rad) * clearance;
  // Hanging block centered below the pulley.
  const hangCx = pulleyCx + pulleyR;
  const hangCy = Math.min(pulleyCy + 130, H - 30);
  // Rope on the incline goes from the upper-right corner of the block tangent
  // to the pulley's leftmost point. For a clean schematic we just draw a
  // straight line from the block edge along the slope direction up to the
  // pulley's 9-o'clock contact point.
  const blockTopRightX = blockCx + Math.cos(rad) * blockHalf;
  const blockTopRightY = blockCy - Math.sin(rad) * blockHalf;
  const ll = left ?? { label: 'm₁' };
  const rr = right ?? { label: 'm₂' };
  // ── Caption layout (2026-07-19 renderer label-collision audit): a
  // shallow ramp bottom-clamps the hanging block to H - 30, which pushed
  // its weight caption below the viewbox. Seed that caption beside the
  // block when the below-slot doesn't fit, then run one deoverlapLabels
  // pass over the θ / weight captions with the blocks, pulley and rope
  // drop as obstacles. ──
  const inclineExtent = blockHalf * (Math.cos(rad) + Math.sin(rad));
  const hangBelowY = hangCy + 22 + 16;
  const hangSeed = hangBelowY <= H - 8
    ? { x: hangCx, y: hangBelowY, anchor: 'middle' as const }
    : { x: hangCx - 32, y: hangCy + 4, anchor: 'end' as const };
  type SceneLabel = DeoverlapLabel & { key: string };
  const sceneLabels: SceneLabel[] = [
    { key: 'theta', x: baseXStart + 32, y: baseY - 6, text: `θ = ${Math.round(angle)}°`, fontSize: 12, anchor: 'start', preferDir: 'up' },
  ];
  if (ll.weight) {
    sceneLabels.push({ key: 'lw', x: blockCx, y: blockCy + blockHalf + 22, text: ll.weight, fontSize: 12, preferDir: 'down' });
  }
  if (rr.weight) {
    sceneLabels.push({ key: 'rw', x: hangSeed.x, y: hangSeed.y, text: rr.weight, fontSize: 12, anchor: hangSeed.anchor, preferDir: 'down' });
  }
  const sceneObstacles: DeoverlapObstacle[] = [
    { left: blockCx - inclineExtent, right: blockCx + inclineExtent, top: blockCy - inclineExtent, bottom: blockCy + inclineExtent },
    { left: hangCx - 28, right: hangCx + 28, top: hangCy - 22, bottom: hangCy + 22 },
    { left: hangCx - estTextW(rr.label, 14) / 2, right: hangCx + estTextW(rr.label, 14) / 2, top: hangCy - 6, bottom: hangCy + 10 },
    { left: pulleyCx - pulleyR, right: pulleyCx + pulleyR, top: pulleyCy - pulleyR, bottom: pulleyCy + pulleyR },
    { left: hangCx - 3, right: hangCx + 3, top: pulleyCy, bottom: hangCy - 22 },
  ];
  const resolvedScene = deoverlapLabels(
    sceneLabels,
    { width: W, height: H },
    { obstacles: sceneObstacles, baseline: 'alphabetic' },
  );
  const scenePos = new Map(resolvedScene.map((l) => [l.key, { x: l.x, y: l.y }]));
  const thetaPos = scenePos.get('theta') ?? { x: baseXStart + 32, y: baseY - 6 };
  return (
    <g>
      {/* Floor under everything (purely visual reference) */}
      <line x1={20} y1={baseY} x2={W - 20} y2={baseY} stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="4,3" />
      {/* Ramp triangle */}
      <polygon
        points={`${baseXStart},${baseY} ${baseXEnd},${baseY} ${topX},${topY}`}
        fill="#f1f5f9"
        stroke="#64748b"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {/* Slope hatching */}
      <SlopeHatchingLocal x1={baseXStart} y1={baseY} x2={topX} y2={topY} />
      {/* Angle arc + label */}
      <path
        d={`M ${baseXStart + 26} ${baseY} A 26 26 0 0 0 ${baseXStart + 26 * Math.cos(rad)} ${baseY - 26 * Math.sin(rad)}`}
        fill="none"
        stroke="#475569"
        strokeWidth={1.5}
      />
      <text x={thetaPos.x} y={thetaPos.y} fontSize={12} fill="#475569" fontStyle="italic">
        θ = {Math.round(angle)}°
      </text>
      {/* Pulley wheel + tiny support to the wall on the right */}
      <line x1={pulleyCx} y1={pulleyCy - pulleyR} x2={pulleyCx} y2={topY - 18} stroke="#374151" strokeWidth={2} />
      <line x1={pulleyCx - 6} y1={topY - 18} x2={pulleyCx + 6} y2={topY - 18} stroke="#374151" strokeWidth={2} />
      <PulleyWheel cx={pulleyCx} cy={pulleyCy} r={pulleyR} />
      {/* Rope segment 1: from incline block up the slope to the pulley's
          9-o'clock contact point. */}
      <line
        x1={blockTopRightX}
        y1={blockTopRightY}
        x2={pulleyCx - pulleyR}
        y2={pulleyCy}
        stroke="#1f2937"
        strokeWidth={1.8}
      />
      {/* Arc over the pulley + drop to hanging block */}
      <path
        d={`M ${pulleyCx - pulleyR} ${pulleyCy} A ${pulleyR} ${pulleyR} 0 0 1 ${pulleyCx + pulleyR} ${pulleyCy} L ${hangCx} ${hangCy - 22}`}
        fill="none"
        stroke="#1f2937"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      {/* Block on incline (rotated to match slope) */}
      <g transform={`rotate(${-angle} ${blockCx} ${blockCy})`}>
        <rect
          x={blockCx - blockHalf}
          y={blockCy - blockHalf}
          width={blockHalf * 2}
          height={blockHalf * 2}
          fill="#dbeafe"
          stroke="#3b82f6"
          strokeWidth={2}
          rx={4}
        />
        <text x={blockCx} y={blockCy + 4} fontSize={13} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>
          {ll.label}
        </text>
      </g>
      {ll.weight && (
        <text
          x={scenePos.get('lw')?.x ?? blockCx}
          y={scenePos.get('lw')?.y ?? blockCy + blockHalf + 22}
          fontSize={12}
          textAnchor="middle"
          fill="#374151"
        >
          {ll.weight}
        </text>
      )}
      {/* Hanging block */}
      <MassBlock
        cx={hangCx}
        cy={hangCy}
        label={rr.label}
        weight={rr.weight}
        width={56}
        height={44}
        weightPos={rr.weight ? { ...(scenePos.get('rw') ?? hangSeed), anchor: hangSeed.anchor } : undefined}
      />
    </g>
  );
}

// Slope hatching local to the incline-pulley scene (perpendicular ticks below
// the hypotenuse). Duplicated from the FBD renderer to keep this file
// self-contained.
function SlopeHatchingLocal({
  x1, y1, x2, y2, length = 8, spacing = 14,
}: { x1: number; y1: number; x2: number; y2: number; length?: number; spacing?: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const perpX = uy;
  const perpY = -ux;
  const lines: React.ReactElement[] = [];
  for (let d = 0; d <= len; d += spacing) {
    const sx = x1 + ux * d;
    const sy = y1 + uy * d;
    lines.push(
      <line
        key={d}
        x1={sx}
        y1={sy}
        x2={sx - perpX * length}
        y2={sy - perpY * length}
        stroke="#94a3b8"
        strokeWidth={1}
      />,
    );
  }
  return <g>{lines}</g>;
}

function TablePulleyScene({
  W, H, ceilingY, left, right,
}: { W: number; H: number; ceilingY: number; left?: AtwoodSide; right?: AtwoodSide }) {
  // Block A on a horizontal table, rope runs right along the table top, wraps
  // over a small pulley at the table edge, then drops vertically to a hanging
  // mass.
  const tableY = ceilingY + 110;
  const tableLeft = 60;
  const tableRight = W - 130;
  const pulleyR = 12;
  const pulleyCx = tableRight + pulleyR;
  const pulleyCy = tableY;
  const tableBlockCx = tableLeft + 100;
  const blockHalf = 22;
  const ropeY = tableY - blockHalf;          // rope sits at the level of the block's center-of-rope-attach
  const hangingMassCx = pulleyCx + pulleyR;
  const hangingMassY = Math.min(tableY + 130, H - 30);
  const ll = left ?? { label: 'A' };
  const rr = right ?? { label: 'B' };
  return (
    <g>
      {/* Table top */}
      <line x1={tableLeft} y1={tableY} x2={tableRight} y2={tableY} stroke="#6b7280" strokeWidth={3} />
      <rect x={tableLeft} y={tableY} width={tableRight - tableLeft} height={10} fill="url(#pulley-hatch)" />
      {/* Table legs */}
      <line x1={tableLeft + 10} y1={tableY + 10} x2={tableLeft + 10} y2={H - 30} stroke="#6b7280" strokeWidth={2} />
      <line x1={tableRight - 10} y1={tableY + 10} x2={tableRight - 10} y2={H - 30} stroke="#6b7280" strokeWidth={2} />
      {/* Pulley */}
      <PulleyWheel cx={pulleyCx} cy={pulleyCy} r={pulleyR} />
      {/* Rope: horizontal from block edge → wrap quarter-arc around pulley →
          vertical drop to hanging block. One continuous path. */}
      <path
        d={`M ${tableBlockCx + blockHalf} ${ropeY} L ${pulleyCx} ${ropeY} A ${pulleyR} ${pulleyR} 0 0 1 ${hangingMassCx} ${pulleyCy} L ${hangingMassCx} ${hangingMassY - 22}`}
        fill="none"
        stroke="#1f2937"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      {/* Block on table */}
      <MassBlock cx={tableBlockCx} cy={tableY - blockHalf} label={ll.label} weight={ll.weight} width={blockHalf * 2} height={blockHalf * 2} />
      {/* Hanging block */}
      <MassBlock cx={hangingMassCx} cy={hangingMassY} label={rr.label} weight={rr.weight} width={56} height={44} />
    </g>
  );
}
