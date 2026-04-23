'use client';

/**
 * Pendulum Renderer
 *
 * Shows a simple pendulum with its string swept out to ±amplitude, a dashed
 * equilibrium reference line, and optional labels for L (length), θ
 * (amplitude), and derived period T = 2π √(L/g).
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, formatValue } from '@/lib/tutor/diagrams/layout';

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

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        {/* Ceiling */}
        <line x1={pivotX - 80} y1={pivotY - 14} x2={pivotX + 80} y2={pivotY - 14} stroke={DIAGRAM_COLORS.slate} strokeWidth={3} />
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={i} x1={pivotX - 80 + i * 40} y1={pivotY - 14} x2={pivotX - 72 + i * 40} y2={pivotY - 4} stroke={DIAGRAM_COLORS.slate} strokeWidth={1} />
        ))}
        <circle cx={pivotX} cy={pivotY} r={5} fill={DIAGRAM_COLORS.slate} />

        {/* Equilibrium reference */}
        <line x1={pivotX} y1={pivotY} x2={equilX} y2={equilY} stroke={DIAGRAM_COLORS.muted} strokeWidth={1} strokeDasharray="4 3" />
        <circle cx={equilX} cy={equilY} r={6} fill="none" stroke={DIAGRAM_COLORS.muted} strokeWidth={1} strokeDasharray="2 2" />

        {/* Left extreme */}
        <line x1={pivotX} y1={pivotY} x2={leftX} y2={leftY} stroke={DIAGRAM_COLORS.primary} strokeWidth={1.75} />
        <circle cx={leftX} cy={leftY} r={12} fill={DIAGRAM_COLORS.primary} stroke={DIAGRAM_COLORS.primary} />

        {/* Right extreme */}
        <line x1={pivotX} y1={pivotY} x2={rightX} y2={rightY} stroke={DIAGRAM_COLORS.primary} strokeWidth={1.75} opacity={0.35} />
        <circle cx={rightX} cy={rightY} r={12} fill={DIAGRAM_COLORS.primary} opacity={0.35} />

        {/* Amplitude arc */}
        {showArc && (
          <path d={`M ${leftX} ${leftY} A ${L} ${L} 0 0 1 ${rightX} ${rightY}`} stroke={DIAGRAM_COLORS.warning} strokeWidth={1.5} strokeDasharray="4 3" fill="none" />
        )}

        {/* Theta arc near pivot */}
        <path d={`M ${pivotX} ${pivotY + 30} A 30 30 0 0 1 ${pivotX - 30 * Math.sin(theta)} ${pivotY + 30 * Math.cos(theta)}`}
          stroke={DIAGRAM_COLORS.secondary} strokeWidth={1.5} fill="none" />
        <text x={pivotX - 22 * Math.sin(theta / 2) - 8} y={pivotY + 40 + 10 * Math.cos(theta / 2)} fontSize={11} fill={DIAGRAM_COLORS.secondary} fontWeight={700}>θ = {formatValue(amplitude)}°</text>

        {/* Length label */}
        <text x={(pivotX + leftX) / 2 - 10} y={(pivotY + leftY) / 2} fontSize={11} fill={DIAGRAM_COLORS.primary} textAnchor="end" fontWeight={600}>L = {formatValue(length)} m</text>

        {/* Mass label */}
        {mass != null && (
          <text x={leftX} y={leftY + 22} fontSize={11} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}>m = {formatValue(mass)} kg</text>
        )}

        {/* Period readout */}
        <text x={W - 18} y={H - 42} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="end">T = 2π √(L/g) = {formatValue(period)} s</text>
        <text x={W - 18} y={H - 28} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="end">(small-angle approx)</text>

        {notes && (
          <text x={W / 2} y={H - 8} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="middle" fontStyle="italic">{notes}</text>
        )}
      </svg>
    </div>
  );
}
