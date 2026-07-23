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
import { DIAGRAM_VIEWBOX, formatValue, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';
import { deoverlapLabels, type DeoverlapObstacle } from '@/lib/tutor/whiteboard/label-deoverlap';

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

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 */
export function buildWaveManifest(props: WaveProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  entries.push({
    name: 'axis',
    kind: 'axis',
    description: 'horizontal and vertical axes framing the plot',
    labels: ['axis', 'the axis', 'axes', 'plot axes', 'x-axis', 'y-axis'],
  });
  entries.push({
    name: 'wave',
    kind: 'curve',
    description: `primary wave (λ = ${formatValue(props.wave.wavelength)}, A = ${formatValue(props.wave.amplitude)}${props.frequency != null ? `, f = ${formatValue(props.frequency)} Hz` : ''})`,
    labels: ['wave', 'the wave', 'primary wave', 'sine wave', 'waveform', 'curve', props.wave.label || 'wave'],
  });

  // Crest / trough markers — same loop bounds as the JSX below (3 cycles).
  const xExtent = Math.max(
    props.wave.wavelength * 3,
    props.secondary ? props.secondary.wavelength * 3 : 0,
  );
  [0, 1, 2].forEach((n) => {
    if ((n + 0.25) * props.wave.wavelength <= xExtent) {
      const idx = n + 1;
      entries.push({
        name: `crest-${idx}`,
        kind: 'point',
        description: `crest ${idx} (positive peak of the primary wave)`,
        labels: [
          `crest-${idx}`,
          `crest ${idx}`,
          `peak ${idx}`,
          `top ${idx}`,
          idx === 1 ? 'first crest' : idx === 2 ? 'second crest' : 'third crest',
          idx === 1 ? 'first peak' : idx === 2 ? 'second peak' : 'third peak',
          ...(idx === 1 ? ['crest', 'peak', 'top of wave', 'the crest', 'the peak'] : []),
        ],
      });
    }
  });
  [0, 1, 2].forEach((n) => {
    if ((n + 0.75) * props.wave.wavelength <= xExtent) {
      const idx = n + 1;
      entries.push({
        name: `trough-${idx}`,
        kind: 'point',
        description: `trough ${idx} (negative peak of the primary wave)`,
        labels: [
          `trough-${idx}`,
          `trough ${idx}`,
          `valley ${idx}`,
          `bottom ${idx}`,
          idx === 1 ? 'first trough' : idx === 2 ? 'second trough' : 'third trough',
          idx === 1 ? 'first valley' : idx === 2 ? 'second valley' : 'third valley',
          ...(idx === 1 ? ['trough', 'valley', 'bottom of wave', 'the trough', 'the valley'] : []),
        ],
      });
    }
  });

  const showAnn = props.showAnnotations ?? true;
  if (showAnn) {
    entries.push({
      name: 'wavelength',
      kind: 'annotation',
      description: `wavelength bracket λ = ${formatValue(props.wave.wavelength)} at top of plot`,
      labels: ['wavelength', 'lambda', 'λ', 'the wavelength', 'wave length', 'λ bracket'],
    });
    entries.push({
      name: 'amplitude',
      kind: 'annotation',
      description: `amplitude indicator A = ${formatValue(props.wave.amplitude)} at first peak`,
      labels: ['amplitude', 'A', 'the amplitude', 'wave height', 'height', 'amplitude bracket'],
    });
  }

  return entries;
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

  // ── Label layout (2026-07-19 renderer label-collision audit) ─────────
  // Legend entries sat at fixed x-offsets (0 / 90 / 200) regardless of
  // label width, so verbose wave labels ran into the next entry. Flow the
  // entries width-aware (historical offsets kept as minimums, so short
  // labels stay pixel-identical), with a length cap mirroring the FBD
  // retrofit. λ / A annotation labels go through deoverlapLabels below.
  const truncate = (s: string, max = 26): string =>
    (s.length > max ? `${s.slice(0, max - 1)}…` : s);
  const legendX = pad.left + 10;
  const legendY = pad.top + plotH - 6;
  const legendEstW = (s: string): number => s.length * 10 * 0.55;
  const legendItems: { text: string; color: string; strokeWidth: number; dash?: string }[] = [
    { text: truncate(wave.label || 'wave'), color: wave.color || DIAGRAM_COLORS.primary, strokeWidth: 2.25 },
  ];
  if (secondary) {
    legendItems.push({ text: truncate(secondary.label || 'wave 2'), color: secondary.color || DIAGRAM_COLORS.secondary, strokeWidth: 2.25, dash: '6 3' });
  }
  if (showSuperposition && secondary) {
    legendItems.push({ text: 'sum', color: DIAGRAM_COLORS.accent, strokeWidth: 2.5 });
  }
  const legendOffsets = legendItems.reduce<number[]>((offs, _, i) => {
    if (i === 0) return [0];
    const prev = offs[i - 1];
    const historical = [0, 90, 200][i];
    offs.push(Math.max(historical, prev + 26 + legendEstW(legendItems[i - 1].text) + 12));
    return offs;
  }, []);

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        {/* Axis */}
        <g {...feat('axis', { cx: pad.left + plotW / 2, cy: axisY, w: plotW, h: 4 })}>
          <line x1={pad.left} y1={axisY} x2={pad.left + plotW} y2={axisY} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} />
          <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + plotH} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} />
        </g>

        {/* Primary wave — also expose crest and trough features of the
            first cycle so the tutor can say "circle crest-1" etc. */}
        <g {...feat('wave', { cx: pad.left + plotW / 2, cy: axisY, w: plotW, h: plotH })}>
          <path d={pointsFor(wave)} stroke={wave.color || DIAGRAM_COLORS.primary} strokeWidth={2.25} fill="none" />
        </g>
        {[0, 1, 2].filter((n) => (n + 0.25) * wave.wavelength <= xExtent).map((n) => {
          const crestX = sx((n + 0.25) * wave.wavelength);
          const crestY = sy(wave.amplitude);
          return (
            <g key={`crest-${n + 1}`} {...feat(`crest-${n + 1}`, { cx: crestX, cy: crestY, w: 24, h: 24 })} />
          );
        })}
        {[0, 1, 2].filter((n) => (n + 0.75) * wave.wavelength <= xExtent).map((n) => {
          const troughX = sx((n + 0.75) * wave.wavelength);
          const troughY = sy(-wave.amplitude);
          return (
            <g key={`trough-${n + 1}`} {...feat(`trough-${n + 1}`, { cx: troughX, cy: troughY, w: 24, h: 24 })} />
          );
        })}

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
          const ampX = sx(wave.wavelength / 4);
          const ampTopY = sy(wave.amplitude);
          // ── Label layout (2026-07-19 renderer label-collision audit) ──
          // λ / A are data-positioned: a secondary wave with a much longer
          // wavelength collapses the λ bracket to a sliver (label wider
          // than the bracket, sitting on its end ticks), and a small
          // relative amplitude parks the A label on the x-axis. One
          // deoverlapLabels pass, seeded with the historical spots.
          const annObstacles: DeoverlapObstacle[] = [
            { left: wx1 - 1, right: wx2 + 1, top: pad.top + 2.5, bottom: pad.top + 5.5 },  // bracket bar
            { left: wx1 - 1, right: wx1 + 1, top: pad.top + 1, bottom: pad.top + 10 },     // bracket end ticks
            { left: wx2 - 1, right: wx2 + 1, top: pad.top + 1, bottom: pad.top + 10 },
            { left: ampX + 5, right: ampX + 7, top: Math.min(axisY, ampTopY), bottom: Math.max(axisY, ampTopY) }, // amplitude bar
            { left: pad.left, right: pad.left + plotW, top: axisY - 1.5, bottom: axisY + 1.5 }, // x-axis
            ...(frequency != null
              ? [{ left: W - 116, right: W - 18, top: pad.top + 6, bottom: pad.top + 32 }]  // f / T readouts
              : []),
          ];
          const [lambdaLabel, ampLabel] = deoverlapLabels(
            [
              { x: (wx1 + wx2) / 2, y: pad.top + 18, text: `λ = ${formatValue(wave.wavelength)}`, fontSize: 11, preferDir: 'down' as const },
              { x: ampX + 10, y: (axisY + ampTopY) / 2, text: `A = ${formatValue(wave.amplitude)}`, fontSize: 11, anchor: 'start' as const, preferDir: 'up' as const },
            ],
            { width: W, height: H },
            { obstacles: annObstacles, baseline: 'alphabetic' },
          );
          return (
            <g>
              {/* Wavelength bracket */}
              <g {...feat('wavelength', { cx: (wx1 + wx2) / 2, cy: pad.top + 12, w: wx2 - wx1 + 20, h: 24 })}>
                <line x1={wx1} y1={pad.top + 4} x2={wx2} y2={pad.top + 4} stroke={DIAGRAM_COLORS.warning} strokeWidth={1.25} />
                <line x1={wx1} y1={pad.top + 1} x2={wx1} y2={pad.top + 10} stroke={DIAGRAM_COLORS.warning} strokeWidth={1.25} />
                <line x1={wx2} y1={pad.top + 1} x2={wx2} y2={pad.top + 10} stroke={DIAGRAM_COLORS.warning} strokeWidth={1.25} />
                <text x={lambdaLabel.x} y={lambdaLabel.y} fontSize={11} fill={DIAGRAM_COLORS.warning} textAnchor="middle" fontWeight={700}>λ = {formatValue(wave.wavelength)}</text>
              </g>

              {/* Amplitude bracket — at the first peak */}
              <g {...feat('amplitude', { cx: ampX + 30, cy: (axisY + ampTopY) / 2, w: 60, h: Math.abs(axisY - ampTopY) + 12 })}>
                <line x1={ampX + 6} y1={axisY} x2={ampX + 6} y2={ampTopY} stroke={DIAGRAM_COLORS.success} strokeWidth={1.25} />
                <text x={ampLabel.x} y={ampLabel.y} fontSize={11} fill={DIAGRAM_COLORS.success} fontWeight={700}>A = {formatValue(wave.amplitude)}</text>
              </g>
            </g>
          );
        })()}

        {/* Frequency / period readout — absolute coords (2026-07-19 audit:
            transform-relative text hid the real positions from the
            collision battery; same rendered spot). */}
        {frequency != null && (
          <g>
            <text x={W - 18} y={pad.top + 16} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="end">f = {formatValue(frequency)} Hz</text>
            <text x={W - 18} y={pad.top + 28} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="end">T = 1/f = {formatValue(1 / frequency)} s</text>
          </g>
        )}

        {/* X-label */}
        <text x={pad.left + plotW / 2} y={pad.top + plotH + 18} fontSize={11} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}>{xLabel}</text>

        {/* Legend — width-aware flow, absolute coords (2026-07-19 audit) */}
        <g>
          {legendItems.map((item, i) => (
            <g key={`legend-${i}`}>
              <line
                x1={legendX + legendOffsets[i]} y1={legendY} x2={legendX + legendOffsets[i] + 20} y2={legendY}
                stroke={item.color} strokeWidth={item.strokeWidth} strokeDasharray={item.dash}
              />
              <text x={legendX + legendOffsets[i] + 26} y={legendY + 4} fontSize={10} fill={DIAGRAM_COLORS.text}>{item.text}</text>
            </g>
          ))}
        </g>
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}
