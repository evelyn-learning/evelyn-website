'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Wave Renderer
 *
 * Sinusoidal wave with annotated wavelength (λ), amplitude (A), and optional
 * frequency / period labels. Optionally overlays a second wave to show
 * interference, phase shift, or beat patterns.
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { formatValue, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';

/** See RayDiagramRenderer for documentation. */
function feat(name: string, bbox: { cx: number; cy: number; w: number; h: number }, viewbox: { width: number; height: number }) {
  return {
    'data-feature': name,
    'data-feature-cx': (bbox.cx / viewbox.width).toFixed(3),
    'data-feature-cy': (bbox.cy / viewbox.height).toFixed(3),
    'data-feature-w': (bbox.w / viewbox.width).toFixed(3),
    'data-feature-h': (bbox.h / viewbox.height).toFixed(3),
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

// 520 wide: the label-collision fixtures assume this viewBox.
const W = 520;

function sample(spec: WaveSpec, x: number): number {
  const k = (2 * Math.PI) / (spec.wavelength > 0 ? spec.wavelength : 1);
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

  // Crest / trough markers — the same lists the JSX below walks (phase included).
  const xExtent = xExtentFor(props);
  const crestCount = extremaXs(props.wave, xExtent, 'crest').length;
  const troughCount = extremaXs(props.wave, xExtent, 'trough').length;
  [0, 1, 2].forEach((n) => {
    if (n < crestCount) {
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
    if (n < troughCount) {
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
      description: `wavelength bracket λ = ${formatValue(props.wave.wavelength)} above the plot`,
      labels: ['wavelength', 'lambda', 'λ', 'the wavelength', 'wave length', 'λ bracket'],
    });
    entries.push({
      name: 'amplitude',
      kind: 'annotation',
      description: `amplitude indicator A = ${formatValue(props.wave.amplitude)} at the right of the plot`,
      labels: ['amplitude', 'A', 'the amplitude', 'wave height', 'height', 'amplitude bracket'],
    });
  }

  return entries;
}

const SUPERSCRIPTS: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };

/** A given quantity: up to `sig` significant figures, no trailing zeros, 3.5×10⁻⁴ for very small or large. */
function formatQuantity(v: number, sig = 6): string {
  if (!Number.isFinite(v)) return '';
  if (v === 0) return '0';
  const abs = Math.abs(v);
  let text: string;
  if (abs >= 1e6 || abs < 1e-3) {
    const [mant, exp] = abs.toExponential(Math.min(sig, 4) - 1).split('e');
    const power = String(Number(exp)).split('').map((ch) => SUPERSCRIPTS[ch] ?? ch).join('');
    text = `${Number(mant)}×10${power}`;
  } else {
    const [int, frac] = String(Number(abs.toPrecision(sig))).split('.');
    const grouped = int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : int;
    text = frac ? `${grouped}.${frac}` : grouped;
  }
  return (v < 0 ? '−' : '') + text;
}

/** A value with an SI prefix on its unit: 4.17 μs, 239.7 kHz. */
function formatWithPrefix(v: number, unit: string, sig: number): string {
  const abs = Math.abs(v);
  if (!Number.isFinite(v) || abs === 0) return `0 ${unit}`;
  const prefixes: Array<[number, string]> = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'μ'], [1e-9, 'n']];
  // Plain units from 0.01 up to 10 000: "0.2 s", "440 Hz".
  if (abs >= 0.01 && abs < 1e4) return `${formatQuantity(v, sig)} ${unit}`;
  const [size, prefix] = prefixes.find(([s]) => abs >= s) ?? prefixes[prefixes.length - 1];
  return `${formatQuantity(v / size, sig)} ${prefix}${unit}`;
}

function niceStep(span: number, target: number): number {
  if (!(span > 0) || !Number.isFinite(span)) return 1;
  const raw = span / Math.max(1, target);
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const frac = raw / pow;
  return (frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 2.5 ? 2.5 : frac <= 5 ? 5 : 10) * pow;
}

function ticksBetween(lo: number, hi: number, step: number): number[] {
  const out: number[] = [];
  for (let k = Math.ceil(lo / step - 1e-6); k * step <= hi + step * 1e-6 && out.length < 60; k++) {
    const v = Number((k * step).toPrecision(12));
    out.push(v === 0 ? 0 : v);
  }
  return out;
}

function estWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.56;
}

const safeWavelength = (spec: WaveSpec): number => (spec.wavelength > 0 && Number.isFinite(spec.wavelength) ? spec.wavelength : 1);

/** Length of x shown: three wavelengths, or one whole beat when two close wavelengths are summed. */
function xExtentFor(props: Pick<WaveProps, 'wave' | 'secondary' | 'showSuperposition'>): number {
  const l1 = safeWavelength(props.wave);
  if (!props.secondary) return l1 * 3;
  const l2 = safeWavelength(props.secondary);
  const base = Math.max(l1, l2) * 3;
  const ratio = Math.max(l1, l2) / Math.min(l1, l2);
  if (props.showSuperposition && ratio > 1.001 && ratio < 1.5) {
    const beat = (l1 * l2) / Math.abs(l1 - l2);
    return Math.max(base, Math.min(beat, 24 * Math.min(l1, l2)));
  }
  return base;
}

/** x of the first (up to three) crests or troughs of a wave inside the plot, phase included. */
function extremaXs(spec: WaveSpec, xExtent: number, kind: 'crest' | 'trough'): number[] {
  const lambda = safeWavelength(spec);
  // sin(kx + φ) peaks where kx + φ = 90° (crest) or 270° (trough); a negative amplitude swaps them.
  const peakDeg = (kind === 'crest') === (spec.amplitude >= 0) ? 90 : 270;
  const first = (((peakDeg - (spec.phase ?? 0)) / 360) % 1 + 1) % 1 * lambda;
  const out: number[] = [];
  for (let n = 0; out.length < 3; n++) {
    const x = first + n * lambda;
    if (x > xExtent + lambda * 1e-9) break;
    out.push(x);
  }
  return out;
}

export default function WaveRenderer({
  title, wave, secondary, showSuperposition, frequency, showAnnotations = true,
  xLabel = 'distance (m)', notes,
}: WaveProps) {
  const primaryColor = wave.color || DIAGRAM_COLORS.primary;
  const secondaryColor = secondary?.color || DIAGRAM_COLORS.secondary;
  const sumShown = !!(showSuperposition && secondary);
  const amp = Math.abs(wave.amplitude) || 0;
  const lambda = safeWavelength(wave);
  const xExtent = xExtentFor({ wave, secondary, showSuperposition });

  // Vertical scale follows the largest displacement drawn, however small the numbers are.
  const amp2 = Math.abs(secondary?.amplitude ?? 0);
  const maxA = (sumShown ? amp + amp2 : Math.max(amp, amp2)) || 1;

  const TICK_FS = 11.5;
  const yStep = niceStep(2 * maxA, 4);
  const yTicks = ticksBetween(-maxA, maxA, yStep);
  // Tick labels share the step's precision so 0.0002 and 0.0004 do not turn into mixed forms.
  const yTickLabels = yTicks.map((v) => formatQuantity(v, 3));
  const xStep = niceStep(xExtent, 6);
  const xTicks = ticksBetween(0, xExtent, xStep);

  const ampText = `A = ${formatQuantity(amp)}`;
  const lambdaText = `λ = ${formatQuantity(lambda)}`;
  const readout = frequency != null && frequency > 0
    ? `f = ${formatWithPrefix(frequency, 'Hz', 4)}   ·   T = 1/f = ${formatWithPrefix(1 / frequency, 's', 3)}`
    : '';

  // Legend: only when there is something to tell apart, in rows of its own under the plot.
  const truncate = (s: string, max = 44): string => (s.length > max ? `${s.slice(0, max - 1)}…` : s);
  const legendItems: { text: string; color: string; strokeWidth: number; dash?: string }[] = [];
  if (secondary || wave.label) {
    legendItems.push({ text: truncate(wave.label || 'wave 1'), color: primaryColor, strokeWidth: 2.25 });
  }
  if (secondary) {
    legendItems.push({ text: truncate(secondary.label || 'wave 2'), color: secondaryColor, strokeWidth: 2.25, dash: '6 3' });
  }
  if (sumShown) {
    legendItems.push({ text: 'sum of the two', color: DIAGRAM_COLORS.accent, strokeWidth: 3.25 });
  }

  const pad = {
    left: Math.max(44, 10 + Math.max(...yTickLabels.map((l) => estWidth(l, TICK_FS))) + 10),
    right: showAnnotations ? Math.max(40, 30 + estWidth(ampText, 12.5) + 10) : 24,
    // First row: the y-axis title (left) and the f / T readout (right).
    top: 22 + (showAnnotations ? 38 : 6),
  };
  const plotW = W - pad.left - pad.right;
  const plotH = 200;
  const plotRight = pad.left + plotW;
  const plotBottom = pad.top + plotH;
  const axisY = pad.top + plotH / 2;

  const legendRows: Array<Array<{ item: (typeof legendItems)[number]; x: number }>> = [[]];
  {
    let lx = 0;
    for (const item of legendItems) {
      const w = 30 + estWidth(item.text, 12) + 24;
      if (lx > 0 && lx + w - 24 > plotW) { legendRows.push([]); lx = 0; }
      legendRows[legendRows.length - 1].push({ item, x: lx });
      lx += w;
    }
  }
  const legendTop = plotBottom + 58;
  const viewH = legendItems.length > 0 ? legendTop + (legendRows.length - 1) * 18 + 12 : plotBottom + 46;

  const sx = (x: number) => pad.left + (x / xExtent) * plotW;
  const sy = (v: number) => axisY - (v / maxA) * (plotH / 2 - 10);
  const vb = { width: W, height: viewH };

  const steps = 600;
  const pathOf = (fn: (x: number) => number) =>
    Array.from({ length: steps + 1 }, (_, i) => {
      const x = (i / steps) * xExtent;
      return `${i === 0 ? 'M' : 'L'} ${sx(x).toFixed(2)} ${sy(fn(x)).toFixed(2)}`;
    }).join(' ');

  const crests = extremaXs(wave, xExtent, 'crest');
  const troughs = extremaXs(wave, xExtent, 'trough');
  const crestY = sy(amp);

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}><InlineMathText text={title} /></div>
      )}
      <svg viewBox={`0 0 ${W} ${viewH}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: 'auto', maxWidth: 720, margin: '0 auto' }}>
        {/* Frequency / period readout, in its own row above everything */}
        {readout && (
          <text x={plotRight} y={14} fontSize={12} fill={DIAGRAM_COLORS.muted} textAnchor="end" >{readout}</text>
        )}

        {/* Light grid on round numbers */}
        {xTicks.map((t, i) => (
          <line key={`gx-${i}`} x1={sx(t)} y1={pad.top} x2={sx(t)} y2={plotBottom} stroke={DIAGRAM_COLORS.grid} strokeWidth={1} />
        ))}
        {yTicks.map((v, i) => (
          <line key={`gy-${i}`} x1={pad.left} y1={sy(v)} x2={plotRight} y2={sy(v)} stroke={DIAGRAM_COLORS.grid} strokeWidth={1} />
        ))}

        {/* Axes */}
        <g {...feat('axis', { cx: pad.left + plotW / 2, cy: axisY, w: plotW, h: 4 }, vb)}>
          <line x1={pad.left} y1={axisY} x2={plotRight} y2={axisY} stroke={DIAGRAM_COLORS.axis} strokeWidth={1.25} />
          <line x1={pad.left} y1={pad.top} x2={pad.left} y2={plotBottom} stroke={DIAGRAM_COLORS.axis} strokeWidth={1.25} />
        </g>
        {yTicks.map((v, i) => (
          <g key={`ty-${i}`}>
            <line x1={pad.left - 4} y1={sy(v)} x2={pad.left} y2={sy(v)} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} />
            <text x={pad.left - 7} y={sy(v) + 4} fontSize={TICK_FS} fill={DIAGRAM_COLORS.muted} textAnchor="end">{yTickLabels[i]}</text>
          </g>
        ))}
        {xTicks.map((t, i) => (
          <g key={`tx-${i}`}>
            <line x1={sx(t)} y1={plotBottom} x2={sx(t)} y2={plotBottom + 4} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} />
            <text x={sx(t)} y={plotBottom + 17} fontSize={TICK_FS} fill={DIAGRAM_COLORS.muted} textAnchor="middle">{formatQuantity(t, 6)}</text>
          </g>
        ))}
        {/* Y-axis title set level at the head of the axis (not rotated: it stays readable and audit-friendly). */}
        <text x={4} y={14} fontSize={12} fill={DIAGRAM_COLORS.text} fontWeight={600}>displacement</text>
        <text x={pad.left + plotW / 2} y={plotBottom + 36} fontSize={12.5} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}>{xLabel}</text>

        {/* Component waves; with a sum on top they step back a little */}
        <g {...feat('wave', { cx: pad.left + plotW / 2, cy: axisY, w: plotW, h: plotH }, vb)}>
          <path d={pathOf((x) => sample(wave, x))} stroke={primaryColor} strokeWidth={2.25} fill="none" opacity={sumShown ? 0.8 : 1} />
        </g>
        {secondary && (
          <path d={pathOf((x) => sample(secondary, x))} stroke={secondaryColor} strokeWidth={2.25} fill="none" strokeDasharray="6 3" opacity={sumShown ? 0.8 : 1} />
        )}
        {sumShown && secondary && (
          <path d={pathOf((x) => sample(wave, x) + sample(secondary, x))} stroke={DIAGRAM_COLORS.accent} strokeWidth={3.25} fill="none" strokeLinejoin="round" />
        )}

        {/* Crest / trough features of the primary wave so the tutor can say "circle crest-1". */}
        {crests.map((x, n) => (
          <g key={`crest-${n + 1}`} {...feat(`crest-${n + 1}`, { cx: sx(x), cy: crestY, w: 24, h: 24 }, vb)} />
        ))}
        {troughs.map((x, n) => (
          <g key={`trough-${n + 1}`} {...feat(`trough-${n + 1}`, { cx: sx(x), cy: sy(-amp), w: 24, h: 24 }, vb)} />
        ))}

        {/* Annotations: both belong to the primary wave and take its colour */}
        {showAnnotations && (() => {
          // λ: a dimension line in the band above the plot, between two successive crests.
          const c1 = crests[0];
          const c2 = crests.length > 1 ? crests[1] : c1 + lambda;
          const x1 = sx(c1);
          const x2 = Math.min(sx(c2), plotRight);
          const dimY = pad.top - 12;
          const lambdaW = estWidth(lambdaText, 12.5);
          const lambdaX = Math.max(pad.left + lambdaW / 2, Math.min((x1 + x2) / 2, plotRight - lambdaW / 2));
          const head = Math.min(7, (x2 - x1) / 3);
          // A: a dimension line in the right margin, from the axis up to the crest level.
          const ax = plotRight + 14;
          const aHead = Math.min(7, Math.abs(axisY - crestY) / 3);
          return (
            <g>
              <g {...feat('wavelength', { cx: (x1 + x2) / 2, cy: dimY - 6, w: x2 - x1 + 20, h: 28 }, vb)}>
                {/* Witness lines down to the two crests */}
                <line x1={x1} y1={dimY - 5} x2={x1} y2={crestY - 3} stroke={primaryColor} strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
                <line x1={x2} y1={dimY - 5} x2={x2} y2={crestY - 3} stroke={primaryColor} strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
                <line x1={x1 + head} y1={dimY} x2={x2 - head} y2={dimY} stroke={primaryColor} strokeWidth={1.5} />
                <polygon points={`${x1},${dimY} ${x1 + head},${dimY - 3.5} ${x1 + head},${dimY + 3.5}`} fill={primaryColor} />
                <polygon points={`${x2},${dimY} ${x2 - head},${dimY - 3.5} ${x2 - head},${dimY + 3.5}`} fill={primaryColor} />
                <text x={lambdaX} y={dimY - 9} fontSize={12.5} fill={primaryColor} textAnchor="middle" fontWeight={700}>{lambdaText}</text>
              </g>
              <g {...feat('amplitude', { cx: ax + 20, cy: (axisY + crestY) / 2, w: 70, h: Math.abs(axisY - crestY) + 12 }, vb)}>
                {/* Guide from the last crest in view out to the margin */}
                <line x1={sx(crests[crests.length - 1] ?? 0)} y1={crestY} x2={ax + 5} y2={crestY} stroke={primaryColor} strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
                <line x1={plotRight} y1={axisY} x2={ax + 5} y2={axisY} stroke={primaryColor} strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
                <line x1={ax} y1={axisY - aHead} x2={ax} y2={crestY + aHead} stroke={primaryColor} strokeWidth={1.5} />
                <polygon points={`${ax},${crestY} ${ax - 3.5},${crestY + aHead} ${ax + 3.5},${crestY + aHead}`} fill={primaryColor} />
                <polygon points={`${ax},${axisY} ${ax - 3.5},${axisY - aHead} ${ax + 3.5},${axisY - aHead}`} fill={primaryColor} />
                <text x={ax + 9} y={(axisY + crestY) / 2 + 4} fontSize={12.5} fill={primaryColor} fontWeight={700}>{ampText}</text>
              </g>
            </g>
          );
        })()}

        {/* Legend */}
        {legendRows.map((row, ri) =>
          row.map(({ item, x }, i) => {
            const ly = legendTop + ri * 18;
            return (
              <g key={`legend-${ri}-${i}`}>
                <line x1={pad.left + x} y1={ly - 4} x2={pad.left + x + 24} y2={ly - 4} stroke={item.color} strokeWidth={item.strokeWidth} strokeDasharray={item.dash} />
                <text x={pad.left + x + 30} y={ly} fontSize={12} fill={DIAGRAM_COLORS.text}>{item.text}</text>
              </g>
            );
          }),
        )}
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}
