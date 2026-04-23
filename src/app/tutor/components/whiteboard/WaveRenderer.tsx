'use client';

/**
 * Wave Renderer
 *
 * Sinusoidal wave with annotated wavelength (λ), amplitude (A), and optional
 * frequency / period labels. Optionally overlays a second wave to show
 * interference, phase shift, or beat patterns.
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, formatValue } from '@/lib/tutor/diagrams/layout';

export interface WaveSpec {
  amplitude: number;
  wavelength: number;
  /** Phase shift in degrees. 0 = starts at origin going up. */
  phase?: number;
  color?: string;
  label?: string;
}

export interface WaveProps {
  title?: string;
  /** Primary wave. */
  wave: WaveSpec;
  /** Optional second wave for overlays (interference / phase). */
  secondary?: WaveSpec;
  /** If true and `secondary` is set, plot the sum (constructive/destructive combined). */
  showSuperposition?: boolean;
  /** Frequency in Hz (shown as annotation; T = 1/f computed automatically). */
  frequency?: number;
  /** Show wavelength / amplitude annotation markers. Default true. */
  showAnnotations?: boolean;
  /** x-axis label. Default "distance". */
  xLabel?: string;
  notes?: string;
}

const W = DIAGRAM_VIEWBOX.width;
const H = DIAGRAM_VIEWBOX.height;

function sample(spec: WaveSpec, x: number): number {
  const k = (2 * Math.PI) / Math.max(spec.wavelength, 1e-6);
  const phi = ((spec.phase ?? 0) * Math.PI) / 180;
  return spec.amplitude * Math.sin(k * x + phi);
}

export default function WaveRenderer({
  title, wave, secondary, showSuperposition, frequency, showAnnotations = true,
  xLabel = 'distance (m)', notes,
}: WaveProps) {
  const pad = { top: title ? 36 : 16, bottom: notes ? 44 : 32, left: 40, right: 20 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const axisY = pad.top + plotH / 2;

  // Pick x-extent so we show ~3 wavelengths of the primary wave.
  const xExtent = Math.max(wave.wavelength * 3, secondary ? secondary.wavelength * 3 : 0);
  const maxA = Math.max(wave.amplitude, secondary?.amplitude ?? 0, 1) * (showSuperposition && secondary ? 2 : 1);
  const sx = (x: number) => pad.left + (x / xExtent) * plotW;
  const sy = (v: number) => axisY - (v / maxA) * (plotH / 2 - 4);

  const steps = 300;
  const pointsFor = (spec: WaveSpec) =>
    Array.from({ length: steps + 1 }, (_, i) => {
      const x = (i / steps) * xExtent;
      return `${i === 0 ? 'M' : 'L'} ${sx(x)} ${sy(sample(spec, x))}`;
    }).join(' ');

  const sumPoints = () =>
    Array.from({ length: steps + 1 }, (_, i) => {
      const x = (i / steps) * xExtent;
      const v = sample(wave, x) + (secondary ? sample(secondary, x) : 0);
      return `${i === 0 ? 'M' : 'L'} ${sx(x)} ${sy(v)}`;
    }).join(' ');

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        {/* Axis */}
        <line x1={pad.left} y1={axisY} x2={pad.left + plotW} y2={axisY} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} />
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + plotH} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} />

        {/* Primary wave */}
        <path d={pointsFor(wave)} stroke={wave.color || DIAGRAM_COLORS.primary} strokeWidth={2.25} fill="none" />
        {/* Secondary wave */}
        {secondary && (
          <path d={pointsFor(secondary)} stroke={secondary.color || DIAGRAM_COLORS.secondary} strokeWidth={2.25} fill="none" strokeDasharray="6 3" />
        )}
        {/* Superposition (sum) */}
        {showSuperposition && secondary && (
          <path d={sumPoints()} stroke={DIAGRAM_COLORS.accent} strokeWidth={2.5} fill="none" />
        )}

        {/* Annotations */}
        {showAnnotations && (() => {
          const wx1 = sx(0);
          const wx2 = sx(wave.wavelength);
          return (
            <g>
              {/* Wavelength bracket */}
              <line x1={wx1} y1={pad.top + 4} x2={wx2} y2={pad.top + 4} stroke={DIAGRAM_COLORS.warning} strokeWidth={1.25} />
              <line x1={wx1} y1={pad.top + 1} x2={wx1} y2={pad.top + 10} stroke={DIAGRAM_COLORS.warning} strokeWidth={1.25} />
              <line x1={wx2} y1={pad.top + 1} x2={wx2} y2={pad.top + 10} stroke={DIAGRAM_COLORS.warning} strokeWidth={1.25} />
              <text x={(wx1 + wx2) / 2} y={pad.top + 18} fontSize={11} fill={DIAGRAM_COLORS.warning} textAnchor="middle" fontWeight={700}>λ = {formatValue(wave.wavelength)}</text>

              {/* Amplitude bracket — at the first peak */}
              <line x1={sx(wave.wavelength / 4) + 6} y1={axisY} x2={sx(wave.wavelength / 4) + 6} y2={sy(wave.amplitude)} stroke={DIAGRAM_COLORS.success} strokeWidth={1.25} />
              <text x={sx(wave.wavelength / 4) + 10} y={(axisY + sy(wave.amplitude)) / 2} fontSize={11} fill={DIAGRAM_COLORS.success} fontWeight={700}>A = {formatValue(wave.amplitude)}</text>
            </g>
          );
        })()}

        {/* Frequency / period readout */}
        {frequency != null && (
          <g transform={`translate(${W - 18}, ${pad.top + 16})`}>
            <text x={0} y={0} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="end">f = {formatValue(frequency)} Hz</text>
            <text x={0} y={12} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="end">T = 1/f = {formatValue(1 / frequency)} s</text>
          </g>
        )}

        {/* X-label */}
        <text x={pad.left + plotW / 2} y={pad.top + plotH + 18} fontSize={11} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}>{xLabel}</text>

        {/* Legend */}
        <g transform={`translate(${pad.left + 10}, ${pad.top + plotH - 6})`}>
          <line x1={0} y1={0} x2={20} y2={0} stroke={wave.color || DIAGRAM_COLORS.primary} strokeWidth={2.25} />
          <text x={26} y={4} fontSize={10} fill={DIAGRAM_COLORS.text}>{wave.label || 'wave'}</text>
          {secondary && (
            <g transform="translate(90, 0)">
              <line x1={0} y1={0} x2={20} y2={0} stroke={secondary.color || DIAGRAM_COLORS.secondary} strokeWidth={2.25} strokeDasharray="6 3" />
              <text x={26} y={4} fontSize={10} fill={DIAGRAM_COLORS.text}>{secondary.label || 'wave 2'}</text>
            </g>
          )}
          {showSuperposition && secondary && (
            <g transform="translate(200, 0)">
              <line x1={0} y1={0} x2={20} y2={0} stroke={DIAGRAM_COLORS.accent} strokeWidth={2.5} />
              <text x={26} y={4} fontSize={10} fill={DIAGRAM_COLORS.text}>sum</text>
            </g>
          )}
        </g>

        {notes && (
          <text x={W / 2} y={H - 8} fontSize={11} fill={DIAGRAM_COLORS.muted} textAnchor="middle" fontStyle="italic">{notes}</text>
        )}
      </svg>
    </div>
  );
}
