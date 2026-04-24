'use client';

/**
 * Motion Diagram Renderer
 *
 * Plots position / velocity / acceleration vs time. Accepts any combination
 * of x(t), v(t), a(t) series as explicit sample points; renders each in its
 * own stacked sub-panel with a shared time axis for visual alignment.
 *
 * Series labels (x(t), v(t), a(t)) live in the far-left margin (rotated)
 * so they don't collide with the numeric min/max tick labels in the gutter
 * just left of each panel. Curves are drawn with quadratic-Bezier midpoint
 * smoothing so sparse sample sets (e.g. 4 points of x = ½gt²) still look
 * like a curve rather than a broken polyline.
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, formatValue } from '@/lib/tutor/diagrams/layout';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';

export interface MotionSample {
  t: number;
  value: number;
}

export interface MotionSeries {
  /** "position", "velocity", or "acceleration" — controls color + default label. */
  kind: 'position' | 'velocity' | 'acceleration';
  points: MotionSample[];
  label?: string;
  color?: string;
  yLabel?: string;
}

export interface MotionDiagramProps {
  title?: string;
  timeLabel?: string;
  series: MotionSeries[];
  notes?: string;
}

/** See RayDiagramRenderer for documentation. */
function feat(name: string, bbox: { cx: number; cy: number; w: number; h: number }) {
  return {
    'data-feature': name,
    'data-feature-cx': (bbox.cx / DIAGRAM_VIEWBOX.width).toFixed(3),
    'data-feature-cy': (bbox.cy / DIAGRAM_VIEWBOX.height).toFixed(3),
    'data-feature-w': (bbox.w / DIAGRAM_VIEWBOX.width).toFixed(3),
    'data-feature-h': (bbox.h / DIAGRAM_VIEWBOX.height).toFixed(3),
  };
}

const VIEWBOX_W = DIAGRAM_VIEWBOX.width;
const VIEWBOX_H = DIAGRAM_VIEWBOX.height;

const KIND_COLORS = {
  position: DIAGRAM_COLORS.primary,
  velocity: DIAGRAM_COLORS.secondary,
  acceleration: DIAGRAM_COLORS.accent,
};

const KIND_DEFAULT_LABEL = {
  position: 'x (m)',
  velocity: 'v (m/s)',
  acceleration: 'a (m/s²)',
};

/** Quadratic-Bezier midpoint smoothing so sparse samples render as a smooth
 * curve rather than connected line segments. */
function smoothPath(pts: Array<{ x: number; y: number }>): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  if (pts.length === 2) return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const midX = (pts[i].x + pts[i + 1].x) / 2;
    const midY = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q ${pts[i].x} ${pts[i].y} ${midX} ${midY}`;
  }
  d += ` T ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
  return d;
}

export default function MotionDiagramRenderer({
  title, timeLabel = 't (s)', series, notes,
}: MotionDiagramProps) {
  const valid = (series || []).filter((s) => s.points && s.points.length > 0);
  if (valid.length === 0) {
    return <div style={{ padding: 24, color: DIAGRAM_COLORS.muted, fontStyle: 'italic' }}>No motion data.</div>;
  }

  // Left margin is wide enough for: rotated series label (~20 px), numeric
  // tick gutter (~36 px for "-48.5"-style values), plus a small breathing gap.
  const pad = { top: title ? 30 : 14, bottom: notes ? 34 : 28, left: 72, right: 18 };
  const plotW = VIEWBOX_W - pad.left - pad.right;
  const plotH = VIEWBOX_H - pad.top - pad.bottom;

  // Shared x (time) range across all series.
  const allT = valid.flatMap((s) => s.points.map((p) => p.t));
  const tMin = Math.min(...allT); const tMax = Math.max(...allT);
  const panelH = plotH / valid.length;
  const gap = 8;

  const sx = (t: number) => pad.left + ((t - tMin) / (tMax - tMin || 1)) * plotW;

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        {valid.map((s, idx) => {
          const color = s.color || KIND_COLORS[s.kind];
          const label = s.label || KIND_DEFAULT_LABEL[s.kind];
          const panelTop = pad.top + idx * panelH;
          const panelBottom = panelTop + panelH - gap;
          const vMin = Math.min(...s.points.map((p) => p.value));
          const vMax = Math.max(...s.points.map((p) => p.value));
          const vSpan = Math.max(1e-6, vMax - vMin);
          const vLo = vMin - 0.1 * vSpan;
          const vHi = vMax + 0.1 * vSpan;
          const sy = (v: number) => panelBottom - ((v - vLo) / (vHi - vLo)) * (panelH - gap);

          const sorted = [...s.points].sort((a, b) => a.t - b.t);
          const pxPts = sorted.map((p) => ({ x: sx(p.t), y: sy(p.value) }));
          const path = smoothPath(pxPts);

          // Zero line (if value range crosses it)
          const zeroLineY = vLo <= 0 && vHi >= 0 ? sy(0) : null;

          const midY = (panelTop + panelBottom) / 2;

          // Expose each panel as a feature named after its series kind
          // (e.g. "x-panel", "v-panel", "a-panel") so the tutor can point
          // at a specific panel without coordinate guessing.
          const featureName = `${s.kind}-panel`;

          return (
            <g key={idx} {...feat(featureName, { cx: pad.left + plotW / 2, cy: (panelTop + panelBottom) / 2, w: plotW, h: panelH - gap })}>
              {/* Panel frame */}
              <rect x={pad.left} y={panelTop} width={plotW} height={panelH - gap} fill={DIAGRAM_COLORS.panel} stroke={DIAGRAM_COLORS.border} strokeWidth={0.5} />
              {zeroLineY !== null && (
                <line x1={pad.left} y1={zeroLineY} x2={pad.left + plotW} y2={zeroLineY} stroke={DIAGRAM_COLORS.axis} strokeWidth={0.75} strokeDasharray="4 3" />
              )}
              {/* Curve */}
              <path d={path} stroke={color} strokeWidth={2} fill="none" />

              {/* Rotated series label in the far-left margin (well clear of
                  the numeric min/max tick labels in the gutter). */}
              <text
                x={18}
                y={midY}
                fontSize={12}
                fill={color}
                textAnchor="middle"
                fontWeight={700}
                transform={`rotate(-90 18 ${midY})`}
              >
                {label}
              </text>

              {/* Numeric min/max ticks in the gutter immediately left of the panel. */}
              <text x={pad.left - 6} y={panelTop + 10} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="end">{formatValue(vHi)}</text>
              <text x={pad.left - 6} y={panelBottom - 2} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="end">{formatValue(vLo)}</text>
            </g>
          );
        })}

        {/* Shared x-axis at the very bottom */}
        <line x1={pad.left} y1={pad.top + plotH} x2={pad.left + plotW} y2={pad.top + plotH} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} />
        {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
          const t = tMin + frac * (tMax - tMin);
          return (
            <text key={i} x={sx(t)} y={pad.top + plotH + 12} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="middle">{formatValue(t)}</text>
          );
        })}
        <text x={pad.left + plotW / 2} y={pad.top + plotH + 24} fontSize={11} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}>{timeLabel}</text>
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}
