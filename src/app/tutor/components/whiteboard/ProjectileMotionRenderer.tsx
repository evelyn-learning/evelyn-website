'use client';

/**
 * Projectile Motion Renderer
 *
 * Plots the trajectory y(x) of a projectile launched at initial speed v0 and
 * angle θ (from horizontal) under gravity g, with optional launch height y0.
 * Draws the parabolic path, decomposed initial-velocity vector (vx, vy), and
 * annotated time-of-flight / max height / range.
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, formatValue } from '@/lib/tutor/diagrams/layout';
import { ArrowMarkers } from '@/lib/tutor/diagrams/arrows';

export interface ProjectileMotionProps {
  title?: string;
  /** Initial speed. */
  v0: number;
  /** Launch angle in degrees from horizontal. */
  angle: number;
  /** Launch height above landing plane. Default 0. */
  y0?: number;
  /** Gravitational acceleration. Default 9.8. */
  g?: number;
  /** Show the decomposed vx/vy vectors at launch. Default true. */
  showComponents?: boolean;
  /** Plot N sample markers along the trajectory to mark equal-time intervals. Default 5. */
  sampleCount?: number;
  /** Units label for speed — default "m/s". */
  speedUnit?: string;
  /** Units label for distance — default "m". */
  distanceUnit?: string;
  notes?: string;
}

const VIEWBOX_W = DIAGRAM_VIEWBOX.width;
const VIEWBOX_H = DIAGRAM_VIEWBOX.height;

export default function ProjectileMotionRenderer({
  title, v0, angle, y0 = 0, g = 9.8,
  showComponents = true, sampleCount = 5,
  speedUnit = 'm/s', distanceUnit = 'm',
  notes,
}: ProjectileMotionProps) {
  const theta = (angle * Math.PI) / 180;
  const vx = v0 * Math.cos(theta);
  const vy = v0 * Math.sin(theta);

  // Total time of flight: y(t) = y0 + vy t - ½ g t² = 0 → quadratic.
  // t = (vy + sqrt(vy² + 2 g y0)) / g
  const tFlight = (vy + Math.sqrt(vy * vy + 2 * g * y0)) / g;
  const range = vx * tFlight;
  const tMaxH = vy / g;
  const maxH = y0 + vy * tMaxH - 0.5 * g * tMaxH * tMaxH;

  const pad = { top: title ? 36 : 18, bottom: notes ? 44 : 36, left: 36, right: 20 };
  const plotW = VIEWBOX_W - pad.left - pad.right;
  const plotH = VIEWBOX_H - pad.top - pad.bottom;

  const xMin = 0; const xMax = range * 1.1 || 10;
  const yMin = 0; const yMax = Math.max(maxH * 1.2, y0 * 1.2 + 1);

  const sx = (x: number) => pad.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const sy = (y: number) => pad.top + ((yMax - y) / (yMax - yMin)) * plotH;

  // Trajectory path
  const steps = 60;
  const path = Array.from({ length: steps + 1 }, (_, i) => {
    const t = (i / steps) * tFlight;
    const x = vx * t;
    const y = y0 + vy * t - 0.5 * g * t * t;
    return `${i === 0 ? 'M' : 'L'} ${sx(x)} ${sy(Math.max(0, y))}`;
  }).join(' ');

  // Equal-time sample markers
  const samples: Array<{ x: number; y: number; t: number }> = [];
  for (let i = 1; i < sampleCount; i++) {
    const t = (i / sampleCount) * tFlight;
    samples.push({ t, x: vx * t, y: y0 + vy * t - 0.5 * g * t * t });
  }

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        <ArrowMarkers idPrefix="pm-arrow" />

        {/* Ground */}
        <line x1={pad.left} y1={sy(0)} x2={pad.left + plotW} y2={sy(0)} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.25} />
        {/* Axes */}
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={sy(0)} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} />

        {/* Trajectory */}
        <path d={path} stroke={DIAGRAM_COLORS.primary} strokeWidth={2.5} fill="none" />
        {/* Samples */}
        {samples.map((s, i) => (
          <circle key={i} cx={sx(s.x)} cy={sy(Math.max(0, s.y))} r={3} fill={DIAGRAM_COLORS.primary} stroke="white" strokeWidth={1} />
        ))}

        {/* Initial velocity vector */}
        {(() => {
          const scale = Math.min(plotW / (2 * Math.max(Math.abs(vx), 1)), plotH / (2 * Math.max(Math.abs(vy), 1))) * 0.35;
          const x0 = sx(0); const y0px = sy(y0);
          const xEnd = x0 + vx * scale; const yEnd = y0px - vy * scale;
          return (
            <g>
              <line x1={x0} y1={y0px} x2={xEnd} y2={yEnd} stroke={DIAGRAM_COLORS.secondary} strokeWidth={2.5}
                markerEnd="url(#pm-arrow-secondary)" />
              <text x={xEnd + 4} y={yEnd - 4} fontSize={11} fill={DIAGRAM_COLORS.secondary} fontWeight={700}>v₀ = {formatValue(v0)} {speedUnit}</text>
              {showComponents && (
                <g>
                  <line x1={x0} y1={y0px} x2={x0 + vx * scale} y2={y0px} stroke={DIAGRAM_COLORS.secondary} strokeWidth={1.25} strokeDasharray="4 3" markerEnd="url(#pm-arrow-secondary)" />
                  <text x={x0 + vx * scale / 2} y={y0px + 12} fontSize={10} fill={DIAGRAM_COLORS.secondary} textAnchor="middle">vₓ = {formatValue(vx)}</text>
                  <line x1={x0} y1={y0px} x2={x0} y2={y0px - vy * scale} stroke={DIAGRAM_COLORS.secondary} strokeWidth={1.25} strokeDasharray="4 3" markerEnd="url(#pm-arrow-secondary)" />
                  <text x={x0 - 4} y={y0px - vy * scale / 2} fontSize={10} fill={DIAGRAM_COLORS.secondary} textAnchor="end">vᵧ = {formatValue(vy)}</text>
                </g>
              )}
              {/* Angle arc */}
              <path d={`M ${x0 + 18} ${y0px} A 18 18 0 0 0 ${x0 + 18 * Math.cos(theta)} ${y0px - 18 * Math.sin(theta)}`}
                stroke={DIAGRAM_COLORS.muted} strokeWidth={1} fill="none" />
              <text x={x0 + 22} y={y0px - 4} fontSize={10} fill={DIAGRAM_COLORS.muted}>{formatValue(angle)}°</text>
            </g>
          );
        })()}

        {/* Max height marker */}
        {maxH > 0 && (
          <g>
            <line x1={sx(vx * tMaxH)} y1={sy(maxH)} x2={sx(vx * tMaxH)} y2={sy(0)} stroke={DIAGRAM_COLORS.success} strokeWidth={1} strokeDasharray="3 3" />
            <text x={sx(vx * tMaxH) + 4} y={sy(maxH) - 4} fontSize={10} fill={DIAGRAM_COLORS.success} fontWeight={600}>h = {formatValue(maxH)} {distanceUnit}</text>
          </g>
        )}

        {/* Range annotation */}
        {range > 0 && (
          <g>
            <line x1={sx(0)} y1={sy(0) + 18} x2={sx(range)} y2={sy(0) + 18} stroke={DIAGRAM_COLORS.warning} strokeWidth={1} markerEnd="url(#pm-arrow-warning)" markerStart="url(#pm-arrow-warning)" />
            <text x={sx(range / 2)} y={sy(0) + 30} fontSize={10} fill={DIAGRAM_COLORS.warning} textAnchor="middle" fontWeight={600}>Range = {formatValue(range)} {distanceUnit}</text>
          </g>
        )}

        {/* Axis captions */}
        <text x={pad.left - 6} y={pad.top + 8} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="end">y ({distanceUnit})</text>
        <text x={pad.left + plotW} y={sy(0) + 12} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="end">x ({distanceUnit})</text>

        {notes && (
          <text x={VIEWBOX_W / 2} y={VIEWBOX_H - 8} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="middle" fontStyle="italic">{notes}</text>
        )}
      </svg>
    </div>
  );
}
