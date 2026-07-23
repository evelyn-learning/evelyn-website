'use client';

import { InlineMathText } from './InlineMathText';
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
import { DIAGRAM_VIEWBOX, formatValue, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { ArrowMarkers } from '@/lib/tutor/diagrams/arrows';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';
import { deoverlapLabels, type DeoverlapLabel, type DeoverlapObstacle } from '@/lib/tutor/whiteboard/label-deoverlap';

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

/** See RayDiagramRenderer for documentation. */
function feat(name: string, bbox: { cx: number; cy: number; w: number; h: number }) {
  return {
    'data-feature': name,
    'data-feature-cx': (bbox.cx / VIEWBOX_W).toFixed(3),
    'data-feature-cy': (bbox.cy / VIEWBOX_H).toFixed(3),
    'data-feature-w': (bbox.w / VIEWBOX_W).toFixed(3),
    'data-feature-h': (bbox.h / VIEWBOX_H).toFixed(3),
  };
}

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 */
export function buildProjectileMotionManifest(props: ProjectileMotionProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const g = props.g ?? 9.8;
  const y0 = props.y0 ?? 0;
  const theta = (props.angle * Math.PI) / 180;
  const vy = props.v0 * Math.sin(theta);

  entries.push({
    name: 'ground',
    kind: 'line',
    description: 'horizontal ground line (landing plane)',
    labels: ['ground', 'floor', 'bottom', 'surface', 'baseline', 'landing plane', 'x-axis'],
  });
  entries.push({
    name: 'y-axis',
    kind: 'axis',
    description: 'vertical axis on the left of the plot',
    labels: ['y-axis', 'y axis', 'vertical axis', 'height axis', 'left axis'],
  });
  entries.push({
    name: 'trajectory',
    kind: 'curve',
    description: `parabolic trajectory (v₀ = ${formatValue(props.v0)}, angle = ${formatValue(props.angle)}°, g = ${formatValue(g)}${props.notes ? ` — ${String(props.notes).slice(0, 100)}` : ''})`,
    labels: ['trajectory', 'path', 'parabola', 'the trajectory', 'flight path', 'curve', 'arc', 'projectile path'],
  });
  entries.push({
    name: 'launch',
    kind: 'point',
    description: `launch point at (0, ${formatValue(y0)})`,
    labels: ['launch', 'launch point', 'start', 'starting point', 'origin', 'release point', 'initial point'],
  });
  const tPeak = vy / g;
  if (Number.isFinite(tPeak) && tPeak > 0) {
    entries.push({
      name: 'peak',
      kind: 'point',
      description: 'peak (maximum height) of the trajectory',
      labels: ['peak', 'apex', 'maximum height', 'max height', 'top', 'highest point', 'the peak', 'h'],
    });
  }
  entries.push({
    name: 'landing',
    kind: 'point',
    description: 'landing point where the trajectory meets the ground',
    labels: ['landing', 'landing point', 'end', 'endpoint', 'impact', 'impact point', 'range point', 'touchdown'],
  });
  return entries;
}

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
  const trajPts = Array.from({ length: steps + 1 }, (_, i) => {
    const t = (i / steps) * tFlight;
    const x = vx * t;
    const y = y0 + vy * t - 0.5 * g * t * t;
    return { x: sx(x), y: sy(Math.max(0, y)) };
  });
  const path = trajPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

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
  const arcR = arrowRealLen * 0.3;

  // ── Shared annotation-label layout (2026-07-19 renderer label-collision
  // audit) ── h₀/v₀/vₓ/vᵧ/θ/h/Range and the axis captions were each placed
  // independently at data-derived coordinates: low-angle launches ran the vₓ
  // label through the range arrow and the θ label through both component
  // shafts; steep short-range launches parked the x-caption on the range
  // arrow and v₀ on the apex label. One deoverlapLabels pass over every
  // annotation, seeded at the historical spots (X clamped into the viewbox),
  // with the trajectory band, axes, ground and every arrow as obstacles.
  const estW = (s: string, fontSize: number) => s.length * fontSize * 0.55;
  const clampX = (x: number, w: number, anchor: 'start' | 'middle' | 'end') => {
    const left = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
    const shift = Math.max(3 - left, 0) - Math.max(left + w - (VIEWBOX_W - 3), 0);
    return x + shift;
  };
  type AnnLabel = DeoverlapLabel & { key: string };
  const annLabels: AnnLabel[] = [];
  const addAnn = (
    key: string, x: number, y: number, text: string, fontSize: number,
    anchor: 'start' | 'middle' | 'end', preferDir: 'up' | 'down',
  ) => annLabels.push({ key, x: clampX(x, estW(text, fontSize), anchor), y, text, fontSize, anchor, preferDir });

  if (y0 > 0) {
    addAnn('h0', sx(0) - 6, (sy(0) + sy(y0)) / 2, `h₀ = ${formatValue(y0)} ${distanceUnit}`, 10, 'end', 'up');
  }
  addAnn(
    'v0', tipXpx + (vxReal >= 0 ? 6 : -6), tipYpx + (vyReal >= 0 ? -6 : 14),
    `v₀ = ${formatValue(v0)} ${speedUnit}`, 11, vxReal >= 0 ? 'start' : 'end', vyReal >= 0 ? 'up' : 'down',
  );
  if (showComponents) {
    addAnn('vx', (originXpx + sx(vxReal)) / 2, originYpx + 14, `vₓ = ${formatValue(vx)}`, 10, 'middle', 'down');
    if (Math.abs(vy) > 1e-6) {
      addAnn('vy', originXpx - 4, (originYpx + sy(y0 + vyReal)) / 2, `vᵧ = ${formatValue(vy)}`, 10, 'end', 'up');
    }
  }
  if (Math.abs(angle) > 0.5) {
    addAnn('angle', sx(arcR * 0.6 * Math.cos(theta / 2)), sy(y0 + arcR * 0.6 * Math.sin(theta / 2)), `${formatValue(angle)}°`, 10, 'start', 'down');
  }
  if (maxH > y0 + 0.01) {
    addAnn('h', sx(vx * tMaxH) + 4, sy(maxH) - 4, `h = ${formatValue(maxH)} ${distanceUnit}`, 10, 'start', 'up');
  }
  if (range > 0) {
    addAnn('range', sx(range / 2), sy(0) + 24, `Range = ${formatValue(range)} ${distanceUnit}`, 10, 'middle', 'down');
  }
  addAnn('ycap', xOffset - 6, yOffset + 8, `y (${distanceUnit})`, 10, 'end', 'down');
  addAnn('xcap', xOffset + usedW, sy(0) + 12, `x (${distanceUnit})`, 10, 'end', 'down');

  const arrowBox = (x1: number, y1: number, x2: number, y2: number, pad: number): DeoverlapObstacle => ({
    left: Math.min(x1, x2) - pad, right: Math.max(x1, x2) + pad,
    top: Math.min(y1, y2) - pad, bottom: Math.max(y1, y2) + pad,
  });
  const annObstacles: DeoverlapObstacle[] = [
    { left: xOffset, right: xOffset + usedW, top: sy(0) - 2, bottom: sy(0) + 2 },   // ground
    { left: xOffset - 2, right: xOffset + 2, top: yOffset, bottom: sy(0) },         // y-axis
    arrowBox(originXpx, originYpx, tipXpx, tipYpx, 4),                              // v0 arrow
  ];
  // Trajectory as a chain of segment bands (a single bbox would swallow the plot).
  for (let i = 0; i < steps; i += 5) {
    const seg = trajPts.slice(i, Math.min(i + 6, steps + 1));
    annObstacles.push({
      left: Math.min(...seg.map((p) => p.x)) - 1.5, right: Math.max(...seg.map((p) => p.x)) + 1.5,
      top: Math.min(...seg.map((p) => p.y)) - 1.5, bottom: Math.max(...seg.map((p) => p.y)) + 1.5,
    });
  }
  if (showComponents) {
    annObstacles.push(arrowBox(originXpx, originYpx, sx(vxReal), originYpx, 4));
    if (Math.abs(vy) > 1e-6) annObstacles.push(arrowBox(originXpx, originYpx, originXpx, sy(y0 + vyReal), 4));
  }
  if (range > 0) annObstacles.push(arrowBox(sx(0), sy(0) + 12, sx(range), sy(0) + 12, 4));

  const resolvedAnn = new Map(
    deoverlapLabels(annLabels, { width: VIEWBOX_W, height: VIEWBOX_H }, { obstacles: annObstacles, baseline: 'alphabetic' })
      .map((l) => [l.key, { x: l.x, y: l.y }]),
  );
  const labelPos = (key: string, fallbackX: number, fallbackY: number) =>
    resolvedAnn.get(key) ?? { x: fallbackX, y: fallbackY };

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}><InlineMathText text={title} /></div>
      )}
      <svg viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        <ArrowMarkers idPrefix="pm-arrow" />

        {/* Ground (only along the actual plot width, not the whole pad) */}
        <g {...feat('ground', { cx: xOffset + usedW / 2, cy: sy(0), w: usedW, h: 4 })}>
          <line x1={xOffset} y1={sy(0)} x2={xOffset + usedW} y2={sy(0)} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.25} />
        </g>
        {/* Y-axis */}
        <g {...feat('y-axis', { cx: xOffset, cy: (yOffset + sy(0)) / 2, w: 4, h: Math.abs(sy(0) - yOffset) })}>
          <line x1={xOffset} y1={yOffset} x2={xOffset} y2={sy(0)} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} />
        </g>

        {/* Trajectory + key points on it. Peak is at t = vy/g (if positive). */}
        <g {...feat('trajectory', { cx: xOffset + usedW / 2, cy: (yOffset + sy(0)) / 2, w: usedW, h: Math.abs(sy(0) - yOffset) })}>
          <path d={path} stroke={DIAGRAM_COLORS.primary} strokeWidth={2.5} fill="none" />
        </g>
        {/* Launch point feature — at (0, y0) in real-world coords. */}
        <g {...feat('launch', { cx: sx(0), cy: sy(y0), w: 28, h: 28 })} />
        {/* Peak feature — at time-of-peak, if it exists above y=0. */}
        {(() => {
          const tPeak = vy / g;
          if (!Number.isFinite(tPeak) || tPeak <= 0) return null;
          const peakX = vx * tPeak;
          const peakY = y0 + vy * tPeak - 0.5 * g * tPeak * tPeak;
          return <g {...feat('peak', { cx: sx(peakX), cy: sy(peakY), w: 28, h: 28 })} />;
        })()}
        {/* Landing point — at (range, 0). */}
        <g {...feat('landing', { cx: sx(range), cy: sy(0), w: 28, h: 28 })} />
        {/* Samples */}
        {samples.map((s, i) => (
          <circle key={i} cx={sx(s.x)} cy={sy(Math.max(0, s.y))} r={3} fill={DIAGRAM_COLORS.primary} stroke="white" strokeWidth={1} />
        ))}

        {/* Launch height indicator (for cliff / non-zero y0 launches). */}
        {y0 > 0 && (
          <g>
            <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(y0)} stroke={DIAGRAM_COLORS.success} strokeWidth={1} strokeDasharray="4 3" />
            <text x={labelPos('h0', sx(0) - 6, (sy(0) + sy(y0)) / 2).x} y={labelPos('h0', sx(0) - 6, (sy(0) + sy(y0)) / 2).y} fontSize={10} fill={DIAGRAM_COLORS.success} textAnchor="end" fontWeight={600}>
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
            x={labelPos('v0', tipXpx + (vxReal >= 0 ? 6 : -6), tipYpx + (vyReal >= 0 ? -6 : 14)).x}
            y={labelPos('v0', tipXpx + (vxReal >= 0 ? 6 : -6), tipYpx + (vyReal >= 0 ? -6 : 14)).y}
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
                x={labelPos('vx', (originXpx + sx(vxReal)) / 2, originYpx + 14).x}
                y={labelPos('vx', (originXpx + sx(vxReal)) / 2, originYpx + 14).y}
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
                    x={labelPos('vy', originXpx - 4, (originYpx + sy(y0 + vyReal)) / 2).x}
                    y={labelPos('vy', originXpx - 4, (originYpx + sy(y0 + vyReal)) / 2).y}
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
            const ax = sx(arcR);
            const bx = sx(arcR * Math.cos(theta));
            const by = sy(y0 + arcR * Math.sin(theta));
            return (
              <g>
                <path d={`M ${ax} ${originYpx} A ${(ax - originXpx)} ${(originYpx - sy(y0 + arcR))} 0 0 0 ${bx} ${by}`}
                  stroke={DIAGRAM_COLORS.muted} strokeWidth={1} fill="none" />
                <text
                  x={labelPos('angle', sx(arcR * 0.6 * Math.cos(theta / 2)), sy(y0 + arcR * 0.6 * Math.sin(theta / 2))).x}
                  y={labelPos('angle', sx(arcR * 0.6 * Math.cos(theta / 2)), sy(y0 + arcR * 0.6 * Math.sin(theta / 2))).y}
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
            <text x={labelPos('h', sx(vx * tMaxH) + 4, sy(maxH) - 4).x} y={labelPos('h', sx(vx * tMaxH) + 4, sy(maxH) - 4).y} fontSize={10} fill={DIAGRAM_COLORS.success} fontWeight={600}>h = {formatValue(maxH)} {distanceUnit}</text>
          </g>
        )}

        {/* Range annotation (just under the ground line, label further below). */}
        {range > 0 && (
          <g>
            <line x1={sx(0)} y1={sy(0) + 12} x2={sx(range)} y2={sy(0) + 12}
              stroke={DIAGRAM_COLORS.warning} strokeWidth={1}
              markerEnd="url(#pm-arrow-warning)" markerStart="url(#pm-arrow-warning)" />
            <text x={labelPos('range', sx(range / 2), sy(0) + 24).x} y={labelPos('range', sx(range / 2), sy(0) + 24).y} fontSize={10} fill={DIAGRAM_COLORS.warning} textAnchor="middle" fontWeight={600}>
              Range = {formatValue(range)} {distanceUnit}
            </text>
          </g>
        )}

        {/* Axis captions */}
        <text x={labelPos('ycap', xOffset - 6, yOffset + 8).x} y={labelPos('ycap', xOffset - 6, yOffset + 8).y} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="end">y ({distanceUnit})</text>
        <text x={labelPos('xcap', xOffset + usedW, sy(0) + 12).x} y={labelPos('xcap', xOffset + usedW, sy(0) + 12).y} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="end">x ({distanceUnit})</text>
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}
