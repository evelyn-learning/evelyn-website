'use client';

/**
 * Motion Diagram Renderer
 *
 * Plots position / velocity / acceleration vs time. Accepts any combination
 * of x(t), v(t), a(t) series as explicit sample points; renders each in its
 * own stacked sub-panel with a shared time axis for visual alignment.
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, formatValue } from '@/lib/tutor/diagrams/layout';

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

export default function MotionDiagramRenderer({
  title, timeLabel = 't (s)', series, notes,
}: MotionDiagramProps) {
  const valid = (series || []).filter((s) => s.points && s.points.length > 0);
  if (valid.length === 0) {
    return <div style={{ padding: 24, color: DIAGRAM_COLORS.muted, fontStyle: 'italic' }}>No motion data.</div>;
  }

  const pad = { top: title ? 30 : 14, bottom: notes ? 32 : 24, left: 42, right: 18 };
  const plotW = VIEWBOX_W - pad.left - pad.right;
  const plotH = VIEWBOX_H - pad.top - pad.bottom;

  // Shared x (time) range across all series.
  const allT = valid.flatMap((s) => s.points.map((p) => p.t));
  const tMin = Math.min(...allT); const tMax = Math.max(...allT);
  const panelH = plotH / valid.length;
  const gap = 6;

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
          const path = sorted.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.t)} ${sy(p.value)}`).join(' ');

          // Zero line (if value range crosses it)
          const zeroLineY = vLo <= 0 && vHi >= 0 ? sy(0) : null;

          return (
            <g key={idx}>
              {/* Panel frame */}
              <rect x={pad.left} y={panelTop} width={plotW} height={panelH - gap} fill={DIAGRAM_COLORS.panel} stroke={DIAGRAM_COLORS.border} strokeWidth={0.5} />
              {zeroLineY !== null && (
                <line x1={pad.left} y1={zeroLineY} x2={pad.left + plotW} y2={zeroLineY} stroke={DIAGRAM_COLORS.axis} strokeWidth={0.75} strokeDasharray="4 3" />
              )}
              {/* Curve */}
              <path d={path} stroke={color} strokeWidth={2} fill="none" />
              {/* Y-label */}
              <text x={pad.left - 6} y={panelTop + 12} fontSize={10} fill={color} textAnchor="end" fontWeight={600}>{label}</text>
              {/* Y range min/max */}
              <text x={pad.left - 4} y={panelTop + 8} fontSize={9} fill={DIAGRAM_COLORS.muted} textAnchor="end">{formatValue(vHi)}</text>
              <text x={pad.left - 4} y={panelBottom} fontSize={9} fill={DIAGRAM_COLORS.muted} textAnchor="end">{formatValue(vLo)}</text>
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

        {notes && (
          <text x={VIEWBOX_W / 2} y={VIEWBOX_H - 4} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="middle" fontStyle="italic">{notes}</text>
        )}
      </svg>
    </div>
  );
}
