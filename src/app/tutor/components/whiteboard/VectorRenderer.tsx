'use client';

/**
 * Vector Renderer
 *
 * Draws one or more 2D vectors (tip-to-tail or from a common origin) with
 * optional resultant arrow, component decomposition, and magnitude/angle
 * labels. Distinct from show_coordinate_plane: simpler single-purpose
 * vector-drawing tool with a clean axes/grid overlay and automatic
 * scaling, for physics and precalc vector lessons.
 */

import React from 'react';
import { DIAGRAM_COLORS, cycleColor } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, formatValue, feat, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { ArrowMarkers, arrowMarkerId } from '@/lib/tutor/diagrams/arrows';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';

export interface VectorSpec {
  /** Magnitude. */
  magnitude: number;
  /** Direction in degrees (0° = East, 90° = North). */
  direction: number;
  label?: string;
  color?: string;
}

export interface VectorRendererProps {
  title?: string;
  vectors: VectorSpec[];
  /** "from-origin" (all vectors share the same tail at origin) or "tip-to-tail" (chained). Default "from-origin". */
  layout?: 'from-origin' | 'tip-to-tail';
  /** Show the resultant (sum) vector. */
  showResultant?: boolean;
  /** Label for the resultant. Default "R". */
  resultantLabel?: string;
  /** Show component decomposition (Vx, Vy dashed) for each vector. */
  showComponents?: boolean;
  /** Show x/y axes through the origin. Default true. */
  showAxes?: boolean;
  notes?: string;
}

const W = DIAGRAM_VIEWBOX.width;
const H = DIAGRAM_VIEWBOX.height;

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * Called by the command handler before the React render so the tutor receives
 * authoritative names in the tool-result JSON and doesn't have to guess.
 */
export function buildVectorManifest(props: VectorRendererProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const vectors = props.vectors ?? [];
  vectors.forEach((v, i) => {
    const slug = (v.label || `vector-${i + 1}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `vector-${i + 1}`;
    const labels = new Set<string>([
      `vector-${slug}`,
      `vector-${i + 1}`,
      `vector ${i + 1}`,
      `arrow ${i + 1}`,
    ]);
    if (v.label) {
      labels.add(v.label);
      labels.add(`vector ${v.label}`);
      labels.add(`${v.label} vector`);
      labels.add(`${v.label}-vector`);
      labels.add(`arrow ${v.label}`);
      labels.add(`the ${v.label} vector`);
    } else {
      labels.add(`v${i + 1}`);
    }
    entries.push({
      name: `vector-${slug}`,
      kind: 'line',
      description: v.label
        ? `vector "${v.label}" — magnitude ${formatValue(v.magnitude)}, direction ${formatValue(v.direction)}°`
        : `vector ${i + 1} — magnitude ${formatValue(v.magnitude)}, direction ${formatValue(v.direction)}°`,
      labels: Array.from(labels),
    });
    entries.push({
      name: `vector-${i + 1}`,
      kind: 'line',
      description: `vector ${i + 1} (positional alias)`,
      labels: [
        `vector-${i + 1}`,
        `vector ${i + 1}`,
        `arrow ${i + 1}`,
        `v${i + 1}`,
        `the ${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} vector`,
      ],
    });
  });
  if (props.showResultant && vectors.length > 0) {
    const rLabel = props.resultantLabel ?? 'R';
    entries.push({
      name: 'resultant',
      kind: 'line',
      description: `resultant vector "${rLabel}" (sum of all vectors)`,
      labels: [
        'resultant',
        'resultant vector',
        'the resultant',
        'sum',
        'vector sum',
        'sum vector',
        rLabel,
        `vector ${rLabel}`,
        `${rLabel}-vector`,
      ],
    });
  }
  return entries;
}

export default function VectorRenderer({
  title, vectors, layout = 'from-origin',
  showResultant, resultantLabel = 'R',
  showComponents, showAxes = true, notes,
}: VectorRendererProps) {
  if (!vectors || vectors.length === 0) {
    return <div style={{ padding: 24, color: DIAGRAM_COLORS.muted, fontStyle: 'italic' }}>No vectors.</div>;
  }

  // Compute endpoints in MATH coordinates (y+ = up). The sy() transform
  // below converts math-y to SVG-y, so we must NOT pre-flip here — doing
  // so (via degToVec, which returns SVG coords) double-flipped the result
  // and put every positive-angle vector below the axis.
  const tails: Array<{ x: number; y: number }> = [];
  const tips: Array<{ x: number; y: number }> = [];
  let cur = { x: 0, y: 0 };
  let totalX = 0, totalY = 0;
  for (const v of vectors) {
    const rad = (v.direction * Math.PI) / 180;
    const dx = Math.cos(rad);
    const dy = Math.sin(rad); // math: 90° → +y (up); sy() flips to SVG
    const end = { x: cur.x + v.magnitude * dx, y: cur.y + v.magnitude * dy };
    tails.push({ ...cur });
    tips.push(end);
    totalX += v.magnitude * dx;
    totalY += v.magnitude * dy;
    if (layout === 'tip-to-tail') cur = end;
  }
  const resultant = { x: totalX, y: totalY };
  const resMag = Math.hypot(totalX, totalY);
  const resAngle = (Math.atan2(totalY, totalX) * 180) / Math.PI;

  // Determine viewport in math coords, ~10% padding.
  const allX = [0, ...tails.map((t) => t.x), ...tips.map((t) => t.x), resultant.x];
  const allY = [0, ...tails.map((t) => t.y), ...tips.map((t) => t.y), resultant.y];
  const xMin = Math.min(...allX); const xMax = Math.max(...allX);
  const yMin = Math.min(...allY); const yMax = Math.max(...allY);
  const xSpan = Math.max(1e-6, xMax - xMin);
  const ySpan = Math.max(1e-6, yMax - yMin);
  const xLo = xMin - xSpan * 0.2; const xHi = xMax + xSpan * 0.2;
  const yLo = yMin - ySpan * 0.2; const yHi = yMax + ySpan * 0.2;

  const pad = { top: title ? 34 : 14, bottom: notes ? 36 : 22, left: 24, right: 24 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const sx = (x: number) => pad.left + ((x - xLo) / (xHi - xLo)) * plotW;
  const sy = (y: number) => pad.top + ((yHi - y) / (yHi - yLo)) * plotH;

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        <ArrowMarkers idPrefix="vr-arrow" />

        {showAxes && xLo <= 0 && xHi >= 0 && yLo <= 0 && yHi >= 0 && (
          <g>
            <line x1={pad.left} y1={sy(0)} x2={pad.left + plotW} y2={sy(0)} stroke={DIAGRAM_COLORS.axis} strokeWidth={0.75} />
            <line x1={sx(0)} y1={pad.top} x2={sx(0)} y2={pad.top + plotH} stroke={DIAGRAM_COLORS.axis} strokeWidth={0.75} />
          </g>
        )}

        {/* Individual vectors. Exposed as "vector-<N>" by position, plus
            "vector-<label-slug>" when the vector has a label — so the
            tutor can point at "vector-1" or at "vector-wind" by name. */}
        {vectors.map((v, i) => {
          const color = v.color || cycleColor(i);
          const tail = tails[i]; const tip = tips[i];
          const bbox = {
            cx: (sx(tail.x) + sx(tip.x)) / 2,
            cy: (sy(tail.y) + sy(tip.y)) / 2,
            w: Math.max(30, Math.abs(sx(tip.x) - sx(tail.x)) + 40),
            h: Math.max(20, Math.abs(sy(tip.y) - sy(tail.y)) + 30),
          };
          const slug = (v.label || `vector-${i + 1}`)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || `vector-${i + 1}`;
          return (
            <g key={`v${i}`} {...feat(`vector-${slug}`, bbox)}>
              {/* Also expose the positional alias so the tutor can use
                  "vector-1" / "vector-2" when labels are missing. */}
              <g {...feat(`vector-${i + 1}`, bbox)}>
                <line x1={sx(tail.x)} y1={sy(tail.y)} x2={sx(tip.x)} y2={sy(tip.y)}
                  stroke={color} strokeWidth={2.5}
                  markerEnd={`url(#${arrowMarkerId(color, 'vr-arrow')})`} />
              </g>
              {showComponents && (
                <g>
                  <line x1={sx(tail.x)} y1={sy(tail.y)} x2={sx(tip.x)} y2={sy(tail.y)} stroke={color} strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
                  <line x1={sx(tip.x)} y1={sy(tail.y)} x2={sx(tip.x)} y2={sy(tip.y)} stroke={color} strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
                </g>
              )}
              {(v.label || v.magnitude) && (
                <text x={(sx(tail.x) + sx(tip.x)) / 2 + 6} y={(sy(tail.y) + sy(tip.y)) / 2 - 6} fontSize={11} fill={color} fontWeight={700}>
                  {v.label || `v${i + 1}`} ({formatValue(v.magnitude)}, {formatValue(v.direction)}°)
                </text>
              )}
            </g>
          );
        })}

        {/* Resultant */}
        {showResultant && (
          <g {...feat('resultant', { cx: (sx(0) + sx(resultant.x)) / 2, cy: (sy(0) + sy(resultant.y)) / 2, w: Math.max(30, Math.abs(sx(resultant.x) - sx(0)) + 40), h: Math.max(20, Math.abs(sy(resultant.y) - sy(0)) + 30) })}>
            <line x1={sx(0)} y1={sy(0)} x2={sx(resultant.x)} y2={sy(resultant.y)}
              stroke={DIAGRAM_COLORS.primary} strokeWidth={3}
              strokeDasharray="8 4"
              markerEnd={`url(#${arrowMarkerId(DIAGRAM_COLORS.primary, 'vr-arrow')})`} />
            <text x={sx(resultant.x) + 6} y={sy(resultant.y) - 6} fontSize={12} fill={DIAGRAM_COLORS.primary} fontWeight={700}>
              {resultantLabel} ({formatValue(resMag)}, {formatValue(resAngle)}°)
            </text>
          </g>
        )}
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}
