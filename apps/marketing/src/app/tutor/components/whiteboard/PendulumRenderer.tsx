'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Pendulum Renderer
 *
 * Shows a simple pendulum with its string swept out to ±amplitude, a dashed
 * equilibrium reference line, and optional labels for L (length), θ
 * (amplitude), and derived period T = 2π √(L/g).
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, formatValue, feat, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';
import { deoverlapLabels, type DeoverlapLabel, type DeoverlapObstacle } from '@/lib/tutor/whiteboard/label-deoverlap';

export interface PendulumProps {
  title?: string;
  /** String length (m). */
  length: number;
  /** Amplitude angle (deg). */
  amplitude: number;
  /** Bob mass (kg), optional — just shown as a label. */
  mass?: number;
  /** Gravity used to compute period. Default 9.8. */
  g?: number;
  /** Show arc between the two extremes. Default true. */
  showArc?: boolean;
  notes?: string;
}

const W = DIAGRAM_VIEWBOX.width;
const H = DIAGRAM_VIEWBOX.height;

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 */
export function buildPendulumManifest(props: PendulumProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  entries.push({
    name: 'ceiling',
    kind: 'object',
    description: 'fixed ceiling (hatched horizontal bar at top)',
    labels: ['ceiling', 'wall', 'support', 'attachment', 'top', 'pivot support', 'the ceiling', 'anchor'],
  });
  entries.push({
    name: 'pivot',
    kind: 'point',
    description: 'pivot point where the string attaches to the ceiling',
    labels: ['pivot', 'pivot point', 'attachment point', 'hinge', 'the pivot', 'fulcrum'],
  });
  entries.push({
    name: 'equilibrium',
    kind: 'annotation',
    description: 'dashed vertical reference line + dashed bob at equilibrium',
    labels: ['equilibrium', 'rest position', 'equilibrium position', 'reference line', 'vertical', 'plumb line'],
  });
  entries.push({
    name: 'string',
    kind: 'line',
    description: `pendulum string at left extreme, length L = ${formatValue(props.length)} m`,
    labels: ['string', 'the string', 'rope', 'wire', 'cord', 'pendulum string', 'L'],
  });
  entries.push({
    name: 'bob',
    kind: 'object',
    description: `bob (pendulum mass) at left extreme position${props.mass != null ? `, m = ${formatValue(props.mass)} kg` : ''}`,
    labels: ['bob', 'mass', 'ball', 'weight', 'the bob', 'pendulum bob', 'left bob', 'm'],
  });
  entries.push({
    name: 'bob-right',
    kind: 'object',
    description: 'faint bob shown at the right extreme of the swing',
    labels: ['bob-right', 'right bob', 'right mass', 'other bob', 'second bob', 'bob at right extreme'],
  });
  if (props.showArc ?? true) {
    entries.push({
      name: 'arc',
      kind: 'curve',
      description: `dashed swing arc between the extremes (amplitude ${formatValue(props.amplitude)}°)`,
      labels: ['arc', 'swing arc', 'path', 'swing path', 'the arc', 'trajectory'],
    });
  }
  entries.push({
    name: 'angle',
    kind: 'annotation',
    description: `amplitude angle θ = ${formatValue(props.amplitude)}° at the pivot`,
    labels: ['angle', 'θ', 'theta', 'amplitude angle', 'angle theta', 'the angle', 'angular amplitude'],
  });
  entries.push({
    name: 'length',
    kind: 'label',
    description: `length label "L = ${formatValue(props.length)} m" alongside the string`,
    labels: ['length', 'L', 'length label', 'string length', 'L label', 'the length'],
  });
  if (props.mass != null) {
    entries.push({
      name: 'mass-label',
      kind: 'label',
      description: `mass label "m = ${formatValue(props.mass)} kg" under the bob`,
      labels: ['mass-label', 'mass label', 'm label', 'mass value', 'bob mass label'],
    });
  }
  return entries;
}

export default function PendulumRenderer({
  title, length, amplitude, mass, g = 9.8, showArc = true, notes,
}: PendulumProps) {
  const pivotX = W / 2; const pivotY = 60;
  // Scale string length to fit nicely in the viewBox.
  const L = Math.min(220, H - pivotY - 60);
  const theta = (Math.abs(amplitude) * Math.PI) / 180;

  const leftX = pivotX - L * Math.sin(theta);
  const leftY = pivotY + L * Math.cos(theta);
  const rightX = pivotX + L * Math.sin(theta);
  const rightY = pivotY + L * Math.cos(theta);
  const equilX = pivotX;
  const equilY = pivotY + L;

  const period = 2 * Math.PI * Math.sqrt(length / g);

  // ── Label layout (2026-07-19 renderer label-collision audit) ──────────
  // θ, L and m captions are all data-positioned; when the bob swings near
  // or above horizontal the L and m captions converge in the string's
  // upper band. One deoverlapLabels pass, seeded with the historical
  // spots, resolves them around the fixed geometry.
  const labelObstacles: DeoverlapObstacle[] = [
    { left: pivotX - 80, right: pivotX + 80, top: pivotY - 16, bottom: pivotY - 4 }, // ceiling bar + hatching
    { left: pivotX - 3, right: pivotX + 3, top: pivotY - 3, bottom: pivotY + 3 },    // pivot dot
    { left: leftX - 10, right: leftX + 10, top: leftY - 10, bottom: leftY + 10 },    // bob
    { left: rightX - 10, right: rightX + 10, top: rightY - 10, bottom: rightY + 10 }, // faint right bob
    { left: equilX - 4, right: equilX + 4, top: equilY - 4, bottom: equilY + 4 },    // equilibrium bob
    { left: W - 158, right: W - 18, top: H - 52, bottom: H - 24 },                   // period readouts
  ];
  type PendLabel = DeoverlapLabel & { key: string };
  const pendLabels: PendLabel[] = [
    {
      key: 'theta',
      x: pivotX - 22 * Math.sin(theta / 2) - 8,
      y: pivotY + 40 + 10 * Math.cos(theta / 2),
      text: `θ = ${formatValue(amplitude)}°`,
      fontSize: 11,
      anchor: 'start',
      preferDir: 'down',
    },
    {
      key: 'length',
      x: (pivotX + leftX) / 2 - 10,
      y: (pivotY + leftY) / 2,
      text: `L = ${formatValue(length)} m`,
      fontSize: 11,
      anchor: 'end',
      preferDir: 'up',
    },
  ];
  if (mass != null) {
    pendLabels.push({
      key: 'mass',
      x: leftX,
      y: leftY + 22,
      text: `m = ${formatValue(mass)} kg`,
      fontSize: 11,
      preferDir: 'down',
    });
  }
  const resolvedPendLabels = new Map(
    deoverlapLabels(pendLabels, { width: W, height: H }, { obstacles: labelObstacles, baseline: 'alphabetic' })
      .map((l) => [l.key, { x: l.x, y: l.y }]),
  );
  const labelPos = (key: string, fallbackX: number, fallbackY: number) =>
    resolvedPendLabels.get(key) ?? { x: fallbackX, y: fallbackY };

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}><InlineMathText text={title} /></div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        {/* Ceiling */}
        <g {...feat('ceiling', { cx: pivotX, cy: pivotY - 14, w: 170, h: 20 })}>
          <line x1={pivotX - 80} y1={pivotY - 14} x2={pivotX + 80} y2={pivotY - 14} stroke={DIAGRAM_COLORS.slate} strokeWidth={3} />
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i} x1={pivotX - 80 + i * 40} y1={pivotY - 14} x2={pivotX - 72 + i * 40} y2={pivotY - 4} stroke={DIAGRAM_COLORS.slate} strokeWidth={1} />
          ))}
        </g>
        <circle cx={pivotX} cy={pivotY} r={5} fill={DIAGRAM_COLORS.slate} {...feat('pivot', { cx: pivotX, cy: pivotY, w: 20, h: 20 })} />

        {/* Equilibrium reference */}
        <g {...feat('equilibrium', { cx: equilX, cy: (pivotY + equilY) / 2, w: 30, h: L + 20 })}>
          <line x1={pivotX} y1={pivotY} x2={equilX} y2={equilY} stroke={DIAGRAM_COLORS.muted} strokeWidth={1} strokeDasharray="4 3" />
          <circle cx={equilX} cy={equilY} r={6} fill="none" stroke={DIAGRAM_COLORS.muted} strokeWidth={1} strokeDasharray="2 2" />
        </g>

        {/* String (left extreme) */}
        <line
          x1={pivotX} y1={pivotY} x2={leftX} y2={leftY}
          stroke={DIAGRAM_COLORS.primary} strokeWidth={1.75}
          {...feat('string', { cx: (pivotX + leftX) / 2, cy: (pivotY + leftY) / 2, w: Math.abs(leftX - pivotX) + 10, h: Math.abs(leftY - pivotY) + 10 })}
        />
        <circle
          cx={leftX} cy={leftY} r={12}
          fill={DIAGRAM_COLORS.primary} stroke={DIAGRAM_COLORS.primary}
          {...feat('bob', { cx: leftX, cy: leftY, w: 32, h: 32 })}
        />

        {/* Right extreme */}
        <line x1={pivotX} y1={pivotY} x2={rightX} y2={rightY} stroke={DIAGRAM_COLORS.primary} strokeWidth={1.75} opacity={0.35} />
        <circle
          cx={rightX} cy={rightY} r={12}
          fill={DIAGRAM_COLORS.primary} opacity={0.35}
          {...feat('bob-right', { cx: rightX, cy: rightY, w: 32, h: 32 })}
        />

        {/* Amplitude arc — sweep-flag=0 so the arc DIPS DOWN through the
            equilibrium point (how a pendulum actually swings). With
            sweep-flag=1 the arc lifts UP between the extremes, which
            looked like the bob rose rather than fell through equilibrium. */}
        {showArc && (
          <path
            d={`M ${leftX} ${leftY} A ${L} ${L} 0 0 0 ${rightX} ${rightY}`}
            stroke={DIAGRAM_COLORS.warning} strokeWidth={1.5} strokeDasharray="4 3" fill="none"
            {...feat('arc', { cx: pivotX, cy: (leftY + equilY) / 2, w: rightX - leftX + 20, h: equilY - leftY + 20 })}
          />
        )}

        {/* Theta arc near pivot */}
        <g {...feat('angle', { cx: pivotX - 15, cy: pivotY + 30, w: 60, h: 40 })}>
          <path d={`M ${pivotX} ${pivotY + 30} A 30 30 0 0 1 ${pivotX - 30 * Math.sin(theta)} ${pivotY + 30 * Math.cos(theta)}`}
            stroke={DIAGRAM_COLORS.secondary} strokeWidth={1.5} fill="none" />
          <text x={labelPos('theta', pivotX - 22 * Math.sin(theta / 2) - 8, pivotY + 40 + 10 * Math.cos(theta / 2)).x} y={labelPos('theta', pivotX - 22 * Math.sin(theta / 2) - 8, pivotY + 40 + 10 * Math.cos(theta / 2)).y} fontSize={11} fill={DIAGRAM_COLORS.secondary} fontWeight={700}>θ = {formatValue(amplitude)}°</text>
        </g>

        {/* Length label */}
        <text
          x={labelPos('length', (pivotX + leftX) / 2 - 10, (pivotY + leftY) / 2).x}
          y={labelPos('length', (pivotX + leftX) / 2 - 10, (pivotY + leftY) / 2).y}
          fontSize={11} fill={DIAGRAM_COLORS.primary} textAnchor="end" fontWeight={600}
          {...feat('length', { cx: (pivotX + leftX) / 2 - 30, cy: (pivotY + leftY) / 2, w: 80, h: 18 })}
        >L = {formatValue(length)} m</text>

        {/* Mass label */}
        {mass != null && (
          <text
            x={labelPos('mass', leftX, leftY + 22).x}
            y={labelPos('mass', leftX, leftY + 22).y}
            fontSize={11} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}
            {...feat('mass-label', { cx: leftX, cy: leftY + 22, w: 60, h: 14 })}
          >m = {formatValue(mass)} kg</text>
        )}

        {/* Period readout */}
        <text x={W - 18} y={H - 42} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="end">T = 2π √(L/g) = {formatValue(period)} s</text>
        <text x={W - 18} y={H - 28} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="end">(small-angle approx)</text>
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}
