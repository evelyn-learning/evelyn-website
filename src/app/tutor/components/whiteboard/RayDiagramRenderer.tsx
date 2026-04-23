'use client';

/**
 * Ray Diagram Renderer
 *
 * Thin-lens / spherical-mirror ray diagram with object, image, focal points,
 * and principal rays. Uses the thin-lens equation 1/f = 1/do + 1/di and
 * magnification m = -di/do to compute image position + height.
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, formatValue } from '@/lib/tutor/diagrams/layout';
import { ArrowMarkers, arrowMarkerId } from '@/lib/tutor/diagrams/arrows';

export interface RayDiagramProps {
  title?: string;
  /** 'converging' (convex lens), 'diverging' (concave lens), 'concave' (concave mirror), 'convex' (convex mirror). */
  type: 'converging' | 'diverging' | 'concave-mirror' | 'convex-mirror';
  /** Focal length (cm). Sign: positive for converging/concave-mirror, negative for diverging/convex-mirror. */
  focalLength: number;
  /** Object distance (cm, positive in front of the optical element). */
  objectDistance: number;
  /** Object height (cm, positive for upright). Default 2. */
  objectHeight?: number;
  /** Show labels/annotations. Default true. */
  showLabels?: boolean;
  notes?: string;
}

const W = DIAGRAM_VIEWBOX.width;
const H = DIAGRAM_VIEWBOX.height;

export default function RayDiagramRenderer({
  title, type, focalLength, objectDistance, objectHeight = 2, showLabels = true, notes,
}: RayDiagramProps) {
  const isMirror = type === 'concave-mirror' || type === 'convex-mirror';
  const f = type === 'diverging' || type === 'convex-mirror' ? -Math.abs(focalLength) : Math.abs(focalLength);
  const doObj = Math.abs(objectDistance);
  // Thin lens / mirror equation: 1/f = 1/do + 1/di  →  1/di = 1/f − 1/do
  const diInv = 1 / f - 1 / doObj;
  const di = Math.abs(diInv) < 1e-9 ? Infinity : 1 / diInv;
  const magnification = Number.isFinite(di) ? -di / doObj : 0;
  const hi = magnification * objectHeight;

  // Lay out the optical axis horizontally, with the element at center.
  const cx = W / 2; const axisY = H / 2 + 10;
  // Scale cm → px so that max(|do|, |di|, 2|f|) spans 180 px on one side.
  const maxExtent = Math.max(doObj, Math.abs(Number.isFinite(di) ? di : doObj * 2), Math.abs(f) * 2.2, 1);
  const pxPerCm = 180 / maxExtent;

  // Positions on axis. Object is to the LEFT of the element.
  const objX = cx - doObj * pxPerCm;
  const objTopY = axisY - objectHeight * pxPerCm;
  const f1X = cx - Math.abs(f) * pxPerCm;
  const f2X = cx + Math.abs(f) * pxPerCm;
  // Image: positive di → right (real); negative di → left of element (virtual).
  const imageReal = Number.isFinite(di) && di > 0;
  const imageX = cx + (Number.isFinite(di) ? di : 0) * pxPerCm;
  const imageTopY = axisY - hi * pxPerCm;

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        <ArrowMarkers idPrefix="ry-arrow" />

        {/* Optical axis */}
        <line x1={20} y1={axisY} x2={W - 20} y2={axisY} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} strokeDasharray="4 3" />

        {/* Lens / mirror */}
        {renderElement(type, cx, axisY)}

        {/* Focal points */}
        <circle cx={f1X} cy={axisY} r={3} fill={DIAGRAM_COLORS.warning} />
        <text x={f1X} y={axisY + 16} fontSize={10} fill={DIAGRAM_COLORS.warning} textAnchor="middle" fontWeight={600}>F</text>
        <circle cx={f2X} cy={axisY} r={3} fill={DIAGRAM_COLORS.warning} />
        <text x={f2X} y={axisY + 16} fontSize={10} fill={DIAGRAM_COLORS.warning} textAnchor="middle" fontWeight={600}>F'</text>

        {/* Object — upright arrow */}
        <line x1={objX} y1={axisY} x2={objX} y2={objTopY} stroke={DIAGRAM_COLORS.secondary} strokeWidth={2.5} markerEnd={`url(#${arrowMarkerId(DIAGRAM_COLORS.secondary, 'ry-arrow')})`} />
        {showLabels && (
          <text x={objX - 4} y={objTopY - 4} fontSize={11} fill={DIAGRAM_COLORS.secondary} textAnchor="end" fontWeight={700}>Object</text>
        )}

        {/* Ray 1: parallel → through F' (lens) or reflects through F (mirror) */}
        <line x1={objX} y1={objTopY} x2={cx} y2={objTopY} stroke={DIAGRAM_COLORS.primary} strokeWidth={1.5} />
        <line x1={cx} y1={objTopY} x2={isMirror ? objX : W - 20} y2={isMirror ? axisY - (cx - objX) * ((objTopY - axisY) / (cx - f1X)) * (-1) : axisY + (W - 20 - cx) * ((objTopY - axisY) / (cx - f2X))}
          stroke={DIAGRAM_COLORS.primary} strokeWidth={1.5} />

        {/* Ray 2: through center → undeflected (lens) / through C for mirrors (simplified) */}
        <line x1={objX} y1={objTopY} x2={W - 20} y2={axisY + (W - 20 - objX) * ((axisY - objTopY) / (objX - cx))} stroke={DIAGRAM_COLORS.success} strokeWidth={1.25} strokeDasharray="4 3" />

        {/* Image */}
        {Number.isFinite(di) && (
          <g>
            <line x1={imageX} y1={axisY} x2={imageX} y2={imageTopY}
              stroke={DIAGRAM_COLORS.accent} strokeWidth={2.5}
              strokeDasharray={imageReal ? undefined : '6 4'}
              markerEnd={`url(#${arrowMarkerId(DIAGRAM_COLORS.accent, 'ry-arrow')})`} />
            {showLabels && (
              <text x={imageX + 4} y={imageTopY - 4} fontSize={11} fill={DIAGRAM_COLORS.accent} fontWeight={700}>Image{imageReal ? '' : ' (virtual)'}</text>
            )}
          </g>
        )}

        {/* Readout */}
        <g transform={`translate(18, ${H - 68})`}>
          <text x={0} y={0} fontSize={10} fill={DIAGRAM_COLORS.muted}>f = {formatValue(f)} cm</text>
          <text x={0} y={14} fontSize={10} fill={DIAGRAM_COLORS.muted}>d_o = {formatValue(doObj)} cm</text>
          <text x={0} y={28} fontSize={10} fill={DIAGRAM_COLORS.muted}>d_i = {Number.isFinite(di) ? formatValue(di) : '∞'} cm</text>
          <text x={0} y={42} fontSize={10} fill={DIAGRAM_COLORS.muted}>m = {formatValue(magnification)}</text>
        </g>

        {notes && (
          <text x={W / 2} y={H - 8} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="middle" fontStyle="italic">{notes}</text>
        )}
      </svg>
    </div>
  );
}

function renderElement(type: RayDiagramProps['type'], cx: number, axisY: number): React.ReactElement {
  const height = 110;
  if (type === 'converging') {
    return (
      <g>
        <ellipse cx={cx} cy={axisY} rx={10} ry={height / 2} fill="#dbeafe" stroke={DIAGRAM_COLORS.primary} strokeWidth={2} />
        <polygon points={`${cx - 10},${axisY - height / 2} ${cx - 18},${axisY - height / 2 + 10} ${cx - 10},${axisY - height / 2 + 16}`} fill={DIAGRAM_COLORS.primary} />
        <polygon points={`${cx + 10},${axisY - height / 2} ${cx + 18},${axisY - height / 2 + 10} ${cx + 10},${axisY - height / 2 + 16}`} fill={DIAGRAM_COLORS.primary} />
      </g>
    );
  }
  if (type === 'diverging') {
    return (
      <g>
        <ellipse cx={cx} cy={axisY} rx={6} ry={height / 2} fill="#fef3c7" stroke={DIAGRAM_COLORS.warning} strokeWidth={2} />
        <polygon points={`${cx - 6},${axisY - height / 2} ${cx - 16},${axisY - height / 2 - 6} ${cx + 4},${axisY - height / 2 - 2}`} fill={DIAGRAM_COLORS.warning} />
        <polygon points={`${cx + 6},${axisY + height / 2} ${cx + 16},${axisY + height / 2 + 6} ${cx - 4},${axisY + height / 2 + 2}`} fill={DIAGRAM_COLORS.warning} />
      </g>
    );
  }
  if (type === 'concave-mirror') {
    return (
      <path d={`M ${cx - 6} ${axisY - height / 2} A 40 ${height / 2} 0 0 0 ${cx - 6} ${axisY + height / 2}`} stroke={DIAGRAM_COLORS.slate} strokeWidth={3} fill="none" />
    );
  }
  // convex-mirror
  return (
    <path d={`M ${cx + 6} ${axisY - height / 2} A 40 ${height / 2} 0 0 1 ${cx + 6} ${axisY + height / 2}`} stroke={DIAGRAM_COLORS.slate} strokeWidth={3} fill="none" />
  );
}
