'use client';

/**
 * Spring-Mass Renderer
 *
 * Shows a horizontal (default) or vertical spring connected to a mass, with
 * the spring drawn at natural length, then at a displaced position. Labels
 * the spring constant k, displacement x, mass m, and derived angular frequency
 * ω = √(k/m) + period T = 2π/ω.
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, formatValue } from '@/lib/tutor/diagrams/layout';
import { ArrowMarkers } from '@/lib/tutor/diagrams/arrows';

export interface SpringMassProps {
  title?: string;
  /** Spring constant in N/m. */
  k: number;
  /** Mass in kg. */
  mass: number;
  /** Displacement from equilibrium in meters (negative = compressed). */
  displacement: number;
  /** Natural length of the spring in meters (for scaling only). Default 1. */
  naturalLength?: number;
  orientation?: 'horizontal' | 'vertical';
  notes?: string;
}

const W = DIAGRAM_VIEWBOX.width;
const H = DIAGRAM_VIEWBOX.height;

function springPath(x1: number, y1: number, x2: number, y2: number, coils = 6, amplitude = 12): string {
  // Draw a zig-zag spring between the two points with `coils` zigzags.
  const dx = x2 - x1; const dy = y2 - y1;
  const length = Math.hypot(dx, dy);
  const ux = dx / length; const uy = dy / length;
  const nx = -uy; const ny = ux;
  const segments = coils * 2;
  const step = length / segments;
  let path = `M ${x1} ${y1}`;
  for (let i = 1; i <= segments; i++) {
    const alongX = x1 + ux * step * i;
    const alongY = y1 + uy * step * i;
    const side = i % 2 === 1 ? 1 : -1;
    path += ` L ${alongX + nx * amplitude * side} ${alongY + ny * amplitude * side}`;
  }
  path += ` L ${x2} ${y2}`;
  return path;
}

export default function SpringMassRenderer({
  title, k, mass, displacement,
  naturalLength = 1,
  orientation = 'horizontal', notes,
}: SpringMassProps) {
  const omega = Math.sqrt(k / mass);
  const period = (2 * Math.PI) / omega;

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        <ArrowMarkers idPrefix="spr-arrow" />

        {orientation === 'horizontal' && (() => {
          const wallX = 60; const cy = H / 2 + 20;
          const naturalPx = 140;
          const pxPerM = naturalPx / Math.max(naturalLength, 0.1);
          const displacedPx = displacement * pxPerM;
          const massSize = 52;

          const naturalEnd = wallX + naturalPx;
          const displacedEnd = wallX + naturalPx + displacedPx;

          return (
            <g>
              {/* Wall */}
              <line x1={wallX} y1={cy - 50} x2={wallX} y2={cy + 50} stroke={DIAGRAM_COLORS.slate} strokeWidth={3} />
              {Array.from({ length: 5 }).map((_, i) => (
                <line key={i} x1={wallX - 14} y1={cy - 40 + i * 20} x2={wallX} y2={cy - 30 + i * 20} stroke={DIAGRAM_COLORS.slate} strokeWidth={1} />
              ))}

              {/* Ground */}
              <line x1={wallX} y1={cy + 28} x2={W - 30} y2={cy + 28} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.5} />

              {/* Natural-length reference spring (faint) */}
              <path d={springPath(wallX, cy, naturalEnd, cy)} stroke={DIAGRAM_COLORS.muted} strokeWidth={1.25} fill="none" opacity={0.35} />
              <rect x={naturalEnd} y={cy - massSize / 2} width={massSize} height={massSize} fill="none" stroke={DIAGRAM_COLORS.muted} strokeWidth={1} strokeDasharray="4 3" />
              <text x={naturalEnd + massSize / 2} y={cy - massSize / 2 - 4} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="middle">equilibrium</text>

              {/* Displaced spring */}
              <path d={springPath(wallX, cy, displacedEnd, cy)} stroke={DIAGRAM_COLORS.primary} strokeWidth={2} fill="none" />

              {/* Mass */}
              <rect x={displacedEnd} y={cy - massSize / 2} width={massSize} height={massSize} fill={DIAGRAM_COLORS.secondary} stroke="#7f1d1d" strokeWidth={1.5} />
              <text x={displacedEnd + massSize / 2} y={cy + 4} fontSize={12} fill="white" textAnchor="middle" fontWeight={700}>m</text>

              {/* Displacement annotation */}
              <line x1={naturalEnd} y1={cy + 44} x2={displacedEnd} y2={cy + 44} stroke={DIAGRAM_COLORS.warning} strokeWidth={1.5} markerStart="url(#spr-arrow-warning)" markerEnd="url(#spr-arrow-warning)" />
              <text x={(naturalEnd + displacedEnd) / 2} y={cy + 58} fontSize={11} fill={DIAGRAM_COLORS.warning} textAnchor="middle" fontWeight={600}>x = {formatValue(displacement)} m</text>

              {/* Labels */}
              <text x={wallX + naturalPx / 2} y={cy - 24} fontSize={11} fill={DIAGRAM_COLORS.primary} textAnchor="middle" fontWeight={600}>k = {formatValue(k)} N/m</text>
              <text x={displacedEnd + massSize / 2} y={cy + massSize / 2 + 14} fontSize={11} fill={DIAGRAM_COLORS.secondary} textAnchor="middle" fontWeight={600}>m = {formatValue(mass)} kg</text>
            </g>
          );
        })()}

        {orientation === 'vertical' && (() => {
          const topY = 40; const cx = W / 2;
          const naturalPx = 140;
          const pxPerM = naturalPx / Math.max(naturalLength, 0.1);
          const displacedPx = displacement * pxPerM;
          const massSize = 52;
          const naturalEnd = topY + naturalPx;
          const displacedEnd = topY + naturalPx + displacedPx;

          return (
            <g>
              {/* Ceiling */}
              <line x1={cx - 70} y1={topY} x2={cx + 70} y2={topY} stroke={DIAGRAM_COLORS.slate} strokeWidth={3} />
              {/* Natural-length reference */}
              <path d={springPath(cx, topY, cx, naturalEnd)} stroke={DIAGRAM_COLORS.muted} strokeWidth={1.25} fill="none" opacity={0.35} />
              <rect x={cx - massSize / 2} y={naturalEnd} width={massSize} height={massSize} fill="none" stroke={DIAGRAM_COLORS.muted} strokeWidth={1} strokeDasharray="4 3" />

              {/* Displaced */}
              <path d={springPath(cx, topY, cx, displacedEnd)} stroke={DIAGRAM_COLORS.primary} strokeWidth={2} fill="none" />
              <rect x={cx - massSize / 2} y={displacedEnd} width={massSize} height={massSize} fill={DIAGRAM_COLORS.secondary} stroke="#7f1d1d" strokeWidth={1.5} />
              <text x={cx} y={displacedEnd + massSize / 2 + 4} fontSize={12} fill="white" textAnchor="middle" fontWeight={700}>m</text>

              {/* Displacement annotation */}
              <line x1={cx + massSize / 2 + 20} y1={naturalEnd} x2={cx + massSize / 2 + 20} y2={displacedEnd} stroke={DIAGRAM_COLORS.warning} strokeWidth={1.5} markerStart="url(#spr-arrow-warning)" markerEnd="url(#spr-arrow-warning)" />
              <text x={cx + massSize / 2 + 26} y={(naturalEnd + displacedEnd) / 2} fontSize={11} fill={DIAGRAM_COLORS.warning} fontWeight={600}>x = {formatValue(displacement)} m</text>
            </g>
          );
        })()}

        {/* Readouts */}
        <text x={W - 18} y={H - 40} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="end">ω = √(k/m) = {formatValue(omega)} rad/s</text>
        <text x={W - 18} y={H - 26} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="end">T = 2π/ω = {formatValue(period)} s</text>

        {notes && (
          <text x={W / 2} y={H - 8} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="middle" fontStyle="italic">{notes}</text>
        )}
      </svg>
    </div>
  );
}
