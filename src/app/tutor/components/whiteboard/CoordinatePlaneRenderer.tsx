'use client';

/**
 * Coordinate Plane Renderer
 *
 * Textbook 2D coordinate plane with optional labeled points, directed
 * segments, and vectors. Broader than show_geometry: has no required
 * points array, always shows axes + gridlines + numeric ticks, and
 * handles vectors-from-origin as first-class citizens.
 */

import React from 'react';
import { DIAGRAM_COLORS, cycleColor } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX } from '@/lib/tutor/diagrams/layout';
import { ArrowMarkers, arrowMarkerId } from '@/lib/tutor/diagrams/arrows';

export interface CoordinatePlanePoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
}

export interface CoordinatePlaneSegment {
  from: { x: number; y: number };
  to: { x: number; y: number };
  label?: string;
  color?: string;
  dashed?: boolean;
  arrow?: boolean;
}

export interface CoordinatePlaneVector {
  /** Tail — defaults to origin. */
  from?: { x: number; y: number };
  /** Tip. */
  to: { x: number; y: number };
  label?: string;
  color?: string;
}

export interface CoordinatePlaneProps {
  title?: string;
  xRange?: [number, number];
  yRange?: [number, number];
  xLabel?: string;
  yLabel?: string;
  points?: CoordinatePlanePoint[];
  segments?: CoordinatePlaneSegment[];
  vectors?: CoordinatePlaneVector[];
  /** Default true — shows faint gridlines at every unit. */
  showGrid?: boolean;
  notes?: string;
}

const VIEWBOX_W = DIAGRAM_VIEWBOX.width;
const VIEWBOX_H = DIAGRAM_VIEWBOX.height;

export default function CoordinatePlaneRenderer({
  title,
  xRange = [-10, 10],
  yRange = [-10, 10],
  xLabel = 'x',
  yLabel = 'y',
  points = [],
  segments = [],
  vectors = [],
  showGrid = true,
  notes,
}: CoordinatePlaneProps) {
  const pad = { top: title ? 36 : 20, bottom: notes ? 36 : 24, left: 32, right: 20 };
  const plotW = VIEWBOX_W - pad.left - pad.right;
  const plotH = VIEWBOX_H - pad.top - pad.bottom;

  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;

  const sx = (x: number) => pad.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const sy = (y: number) => pad.top + ((yMax - y) / (yMax - yMin)) * plotH;

  const xTicks: number[] = [];
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) xTicks.push(x);
  const yTicks: number[] = [];
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) yTicks.push(y);

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 6, color: DIAGRAM_COLORS.text }}>
          {title}
        </div>
      )}
      <svg viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        <ArrowMarkers idPrefix="cp-arrow" />

        {/* Gridlines */}
        {showGrid && xTicks.map((t) => (
          <line key={`gx${t}`} x1={sx(t)} y1={pad.top} x2={sx(t)} y2={pad.top + plotH} stroke={DIAGRAM_COLORS.grid} strokeWidth={0.5} />
        ))}
        {showGrid && yTicks.map((t) => (
          <line key={`gy${t}`} x1={pad.left} y1={sy(t)} x2={pad.left + plotW} y2={sy(t)} stroke={DIAGRAM_COLORS.grid} strokeWidth={0.5} />
        ))}

        {/* Axes — through origin when in range, else along the edges */}
        {(() => {
          const axisY = yMin <= 0 && yMax >= 0 ? sy(0) : pad.top + plotH;
          const axisX = xMin <= 0 && xMax >= 0 ? sx(0) : pad.left;
          return (
            <g>
              <line x1={pad.left} y1={axisY} x2={pad.left + plotW} y2={axisY} stroke={DIAGRAM_COLORS.axis} strokeWidth={1.25} />
              <line x1={axisX} y1={pad.top} x2={axisX} y2={pad.top + plotH} stroke={DIAGRAM_COLORS.axis} strokeWidth={1.25} />
              {/* Axis labels */}
              <text x={pad.left + plotW - 2} y={axisY - 4} fontSize={11} fill={DIAGRAM_COLORS.axis} textAnchor="end">{xLabel}</text>
              <text x={axisX + 4} y={pad.top + 10} fontSize={11} fill={DIAGRAM_COLORS.axis}>{yLabel}</text>
              {/* Tick numbers (skip origin duplication) */}
              {xTicks.filter((t) => t !== 0).map((t) => (
                <text key={`xl${t}`} x={sx(t)} y={axisY + 12} fontSize={9} fill={DIAGRAM_COLORS.muted} textAnchor="middle">{t}</text>
              ))}
              {yTicks.filter((t) => t !== 0).map((t) => (
                <text key={`yl${t}`} x={axisX - 4} y={sy(t) + 3} fontSize={9} fill={DIAGRAM_COLORS.muted} textAnchor="end">{t}</text>
              ))}
            </g>
          );
        })()}

        {/* Segments */}
        {segments.map((s, i) => {
          const color = s.color || cycleColor(i);
          const x1 = sx(s.from.x); const y1 = sy(s.from.y);
          const x2 = sx(s.to.x); const y2 = sy(s.to.y);
          return (
            <g key={`seg${i}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2} strokeDasharray={s.dashed ? '6 4' : undefined}
                markerEnd={s.arrow ? `url(#${arrowMarkerId(color, 'cp-arrow')})` : undefined} />
              {s.label && (
                <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} fontSize={11} fill={color} textAnchor="middle" fontWeight={600}>{s.label}</text>
              )}
            </g>
          );
        })}

        {/* Vectors (default tail = origin) */}
        {vectors.map((v, i) => {
          const color = v.color || DIAGRAM_COLORS.primary;
          const fx = v.from?.x ?? 0; const fy = v.from?.y ?? 0;
          const x1 = sx(fx); const y1 = sy(fy);
          const x2 = sx(v.to.x); const y2 = sy(v.to.y);
          return (
            <g key={`vec${i}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.5}
                markerEnd={`url(#${arrowMarkerId(color, 'cp-arrow')})`} />
              {v.label && (
                <text x={x2 + 6} y={y2 - 4} fontSize={12} fill={color} fontWeight={700}>{v.label}</text>
              )}
            </g>
          );
        })}

        {/* Points */}
        {points.map((p, i) => {
          const color = p.color || DIAGRAM_COLORS.secondary;
          const cx = sx(p.x); const cy = sy(p.y);
          return (
            <g key={`pt${i}`}>
              <circle cx={cx} cy={cy} r={4} fill={color} stroke="white" strokeWidth={1.5} />
              {p.label && (
                <text x={cx + 6} y={cy - 6} fontSize={11} fill={DIAGRAM_COLORS.text} fontWeight={600}>{p.label}</text>
              )}
            </g>
          );
        })}

        {notes && (
          <text x={VIEWBOX_W / 2} y={VIEWBOX_H - 8} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="middle" fontStyle="italic">{notes}</text>
        )}
      </svg>
    </div>
  );
}
