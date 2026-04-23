'use client';

/**
 * Projectile Motion Renderer
 *
 * Plots the trajectory y(x) of a projectile launched at initial speed v0 and
 * angle θ (from horizontal) under gravity g, with optional launch height y0.
 * Draws the parabolic path, decomposed initial-velocity vector (vx, vy), and
 * annotated time-of-flight / max height / range.
 *
 * Important: v0/vx/vy arrows are drawn in REAL-WORLD coords and transformed
 * through sx/sy, so the v0 arrow always lies along the parabola's initial
 * tangent (even when the x- and y-axes have different px-per-meter scales,
 * e.g. a horizontal launch from a cliff). A previous version scaled in
 * pixels and the arrow visibly diverged from the trajectory.
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
  const tFlight = (vy + Math.sqrt(vy * vy + 2 * g * y0)) / g;
  const range = vx * tFlight;
  const tMaxH = vy / g;
  const maxH = y0 + vy * tMaxH - 0.5 * g * tMaxH * tMaxH;

  // Extra bottom padding keeps the range-annotation arrow and the italic
  // notes caption from stacking on top of each other.
  const pad = { top: title ? 36 : 18, bottom: notes ? 56 : 42, left: 44, right: 24 };
  const plotW = VIEWBOX_W - pad.left - pad.right;
  const plotH = VIEWBOX_H - pad.top - pad.bottom;

  const xMin = 0;
  const xMax = Math.max(range * 1.1, 5);
  const yMin = 0;
  // Include launch height in the viewport for cliff launches.
  const yMax = Math.max(maxH * 1.15, y0 * 1.1, 1);

  // Equal-aspect (uniform px-per-meter) so the launch angle visually matches
  // its stated value — e.g. a 45° shot looks like 45° on the page. Without
  // this, a wide/shallow viewport (range=40m, height=10m) rendered 45° as
  // ~63° on screen. Trade-off: the parabola looks shorter than the plot box,
  // with dead space centered around the trajectory.
  const rawXScale = plotW / (xMax - xMin);
  const rawYScale = plotH / (yMax - yMin);
  const scale = Math.min(rawXScale, rawYScale);
  const usedW = scale * (xMax - xMin);
  const usedH = scale * (yMax - yMin);
  const xOffset = pad.left + (plotW - usedW) / 2;
  const yOffset = pad.top + (plotH - usedH) / 2;
  const sx = (x: number) => xOffset + (x - xMin) * scale;
  const sy = (y: number) => yOffset + (yMax - y) * scale;

  // Trajectory path
  const steps = 80;
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

  // v0 arrow length, in REAL-WORLD units. Picking 20% of the range (or of xMax)
  // gives a well-proportioned arrow. All arrow endpoints pass through sx/sy so
  // they stay on the parabola's tangent regardless of px-per-m asymmetry.
  const arrowRealLen = Math.max(xMax, yMax) * 0.25;
  const realScale = arrowRealLen / Math.max(v0, 1e-6);
  const vxReal = vx * realScale;
  const vyReal = vy * realScale;

  const originXpx = sx(0);
  const originYpx = sy(y0);

  const tipXpx = sx(vxReal);
  const tipYpx = sy(y0 + vyReal);

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        <ArrowMarkers idPrefix="pm-arrow" />

        {/* Ground (only along the actual plot width, not the whole pad) */}
        <line x1={xOffset} y1={sy(0)} x2={xOffset + usedW} y2={sy(0)} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.25} />
        {/* Y-axis */}
        <line x1={xOffset} y1={yOffset} x2={xOffset} y2={sy(0)} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} />

        {/* Trajectory */}
        <path d={path} stroke={DIAGRAM_COLORS.primary} strokeWidth={2.5} fill="none" />
        {/* Samples */}
        {samples.map((s, i) => (
          <circle key={i} cx={sx(s.x)} cy={sy(Math.max(0, s.y))} r={3} fill={DIAGRAM_COLORS.primary} stroke="white" strokeWidth={1} />
        ))}

        {/* Launch height indicator (for cliff / non-zero y0 launches). */}
        {y0 > 0 && (
          <g>
            <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(y0)} stroke={DIAGRAM_COLORS.success} strokeWidth={1} strokeDasharray="4 3" />
            <text x={sx(0) - 6} y={(sy(0) + sy(y0)) / 2} fontSize={10} fill={DIAGRAM_COLORS.success} textAnchor="end" fontWeight={600}>
              h₀ = {formatValue(y0)} {distanceUnit}
            </text>
          </g>
        )}

        {/* Initial velocity vector + components (all in real-world coords). */}
        <g>
          <line x1={originXpx} y1={originYpx} x2={tipXpx} y2={tipYpx}
            stroke={DIAGRAM_COLORS.secondary} strokeWidth={2.5}
            markerEnd="url(#pm-arrow-secondary)" />
          {/* v0 label: offset outward from the arrow so it doesn't sit on the trajectory. */}
          <text
            x={tipXpx + (vxReal >= 0 ? 6 : -6)}
            y={tipYpx + (vyReal >= 0 ? -6 : 14)}
            fontSize={11}
            fill={DIAGRAM_COLORS.secondary}
            fontWeight={700}
            textAnchor={vxReal >= 0 ? 'start' : 'end'}
          >
            v₀ = {formatValue(v0)} {speedUnit}
          </text>

          {showComponents && (
            <g>
              {/* Horizontal component: from origin to (vxReal, y0) */}
              <line
                x1={originXpx} y1={originYpx}
                x2={sx(vxReal)} y2={originYpx}
                stroke={DIAGRAM_COLORS.secondary} strokeWidth={1.25} strokeDasharray="4 3"
                markerEnd="url(#pm-arrow-secondary)"
              />
              <text
                x={(originXpx + sx(vxReal)) / 2}
                y={originYpx + 14}
                fontSize={10}
                fill={DIAGRAM_COLORS.secondary}
                textAnchor="middle"
              >
                vₓ = {formatValue(vx)}
              </text>
              {/* Vertical component: from origin to (0, y0 + vyReal). Only show when vy meaningfully nonzero. */}
              {Math.abs(vy) > 1e-6 && (
                <g>
                  <line
                    x1={originXpx} y1={originYpx}
                    x2={originXpx} y2={sy(y0 + vyReal)}
                    stroke={DIAGRAM_COLORS.secondary} strokeWidth={1.25} strokeDasharray="4 3"
                    markerEnd="url(#pm-arrow-secondary)"
                  />
                  <text
                    x={originXpx - 4}
                    y={(originYpx + sy(y0 + vyReal)) / 2}
                    fontSize={10}
                    fill={DIAGRAM_COLORS.secondary}
                    textAnchor="end"
                  >
                    vᵧ = {formatValue(vy)}
                  </text>
                </g>
              )}
            </g>
          )}

          {/* Angle arc — drawn in real-world coords so it matches the tangent. */}
          {Math.abs(angle) > 0.5 && (() => {
            const arcR = arrowRealLen * 0.3;
            const ax = sx(arcR);
            const bx = sx(arcR * Math.cos(theta));
            const by = sy(y0 + arcR * Math.sin(theta));
            return (
              <g>
                <path d={`M ${ax} ${originYpx} A ${(ax - originXpx)} ${(originYpx - sy(y0 + arcR))} 0 0 0 ${bx} ${by}`}
                  stroke={DIAGRAM_COLORS.muted} strokeWidth={1} fill="none" />
                <text
                  x={sx(arcR * 0.6 * Math.cos(theta / 2))}
                  y={sy(y0 + arcR * 0.6 * Math.sin(theta / 2))}
                  fontSize={10}
                  fill={DIAGRAM_COLORS.muted}
                >
                  {formatValue(angle)}°
                </text>
              </g>
            );
          })()}
        </g>

        {/* Max height marker — only when there's actual ascent. */}
        {maxH > y0 + 0.01 && (
          <g>
            <line x1={sx(vx * tMaxH)} y1={sy(maxH)} x2={sx(vx * tMaxH)} y2={sy(0)} stroke={DIAGRAM_COLORS.success} strokeWidth={1} strokeDasharray="3 3" />
            <text x={sx(vx * tMaxH) + 4} y={sy(maxH) - 4} fontSize={10} fill={DIAGRAM_COLORS.success} fontWeight={600}>h = {formatValue(maxH)} {distanceUnit}</text>
          </g>
        )}

        {/* Range annotation (just under the ground line, label further below). */}
        {range > 0 && (
          <g>
            <line x1={sx(0)} y1={sy(0) + 12} x2={sx(range)} y2={sy(0) + 12}
              stroke={DIAGRAM_COLORS.warning} strokeWidth={1}
              markerEnd="url(#pm-arrow-warning)" markerStart="url(#pm-arrow-warning)" />
            <text x={sx(range / 2)} y={sy(0) + 24} fontSize={10} fill={DIAGRAM_COLORS.warning} textAnchor="middle" fontWeight={600}>
              Range = {formatValue(range)} {distanceUnit}
            </text>
          </g>
        )}

        {/* Axis captions */}
        <text x={xOffset - 6} y={yOffset + 8} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="end">y ({distanceUnit})</text>
        <text x={xOffset + usedW} y={sy(0) + 12} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="end">x ({distanceUnit})</text>

        {notes && (
          <text x={VIEWBOX_W / 2} y={VIEWBOX_H - 6} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="middle" fontStyle="italic">{notes}</text>
        )}
      </svg>
    </div>
  );
}
