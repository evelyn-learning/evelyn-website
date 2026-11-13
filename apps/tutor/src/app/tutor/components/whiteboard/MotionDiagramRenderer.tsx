'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Motion Diagram Renderer
 *
 * Plots position / velocity / acceleration vs time. Accepts any combination
 * of x(t), v(t), a(t) series as explicit sample points; renders each in its
 * own stacked sub-panel with a shared time axis for visual alignment.
 *
 * Each panel has round-number ticks with a light grid; the axis title (quantity
 * and unit) is rotated in the far-left margin, clear of the tick labels. The
 * curve never overshoots the samples (see seriesPath).
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
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

const VIEWBOX_W = 640;

/** See RayDiagramRenderer for documentation. The height varies with the number of panels. */
function feat(name: string, bbox: { cx: number; cy: number; w: number; h: number }, viewH: number) {
  return {
    'data-feature': name,
    'data-feature-cx': (bbox.cx / VIEWBOX_W).toFixed(3),
    'data-feature-cy': (bbox.cy / viewH).toFixed(3),
    'data-feature-w': (bbox.w / VIEWBOX_W).toFixed(3),
    'data-feature-h': (bbox.h / viewH).toFixed(3),
  };
}

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

/** A round step (1, 2 or 5 × a power of ten) giving about `target` intervals. */
function niceStep(span: number, target: number): number {
  if (!(span > 0) || !Number.isFinite(span)) return 1;
  const raw = span / Math.max(1, target);
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const frac = raw / pow;
  return (frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10) * pow;
}

/** Multiples of `step` inside [lo, hi]. */
function ticksBetween(lo: number, hi: number, step: number): number[] {
  const out: number[] = [];
  for (let k = Math.ceil(lo / step - 1e-6); k * step <= hi + step * 1e-6 && out.length < 60; k++) {
    const v = Number((k * step).toPrecision(12));
    out.push(v === 0 ? 0 : v);
  }
  return out;
}

/** Tick label: only the decimals the step needs, a true minus, thousands grouped from 10 000. */
function formatTick(v: number, step: number): string {
  if (v === 0) return '0';
  const abs = Math.abs(v);
  let text: string;
  if (abs >= 1e7 || abs < 1e-4) {
    const [mant, exp] = abs.toExponential(2).split('e');
    text = `${Number(mant)}×10^${Number(exp)}`;
  } else {
    let decimals = 0;
    while (decimals < 8 && Math.abs(step * 10 ** decimals - Math.round(step * 10 ** decimals)) > 1e-6 * step * 10 ** decimals) decimals++;
    const [int, frac] = abs.toFixed(decimals).split('.');
    const grouped = int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : int;
    // No pointless trailing zeros: 1.0 → 1, 2.50 → 2.5.
    const trimmed = frac ? frac.replace(/0+$/, '') : '';
    text = trimmed ? `${grouped}.${trimmed}` : grouped;
  }
  return (v < 0 ? '−' : '') + text;
}

function estWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.56;
}

/**
 * Path through the samples that never overshoots them. Position is eased with a
 * monotone cubic (sparse samples of x = ½at² should read as a curve); velocity and
 * acceleration are joined by straight segments, so a piecewise-constant series stays
 * piecewise-constant. Two samples at the same t are a vertical step.
 */
function seriesPath(pts: Array<{ x: number; y: number }>, smooth: boolean): string {
  if (pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  if (!smooth || pts.length < 3) {
    for (let i = 1; i < pts.length; i++) d += ` L ${pts[i].x} ${pts[i].y}`;
    return d;
  }
  // Split into runs of strictly increasing x; runs are joined by a straight (vertical) line.
  const runs: Array<Array<{ x: number; y: number }>> = [[pts[0]]];
  for (let i = 1; i < pts.length; i++) {
    if (pts[i].x - pts[i - 1].x < 1e-6) runs.push([pts[i]]);
    else runs[runs.length - 1].push(pts[i]);
  }
  runs.forEach((run, r) => {
    if (r > 0) d += ` L ${run[0].x} ${run[0].y}`;
    const n = run.length;
    if (n === 1) return;
    if (n === 2) { d += ` L ${run[1].x} ${run[1].y}`; return; }
    // Fritsch–Carlson tangents.
    const h: number[] = [];
    const sec: number[] = [];
    for (let i = 0; i < n - 1; i++) {
      h.push(run[i + 1].x - run[i].x);
      sec.push((run[i + 1].y - run[i].y) / h[i]);
    }
    const m: number[] = new Array(n).fill(0);
    m[0] = sec[0];
    m[n - 1] = sec[n - 2];
    for (let i = 1; i < n - 1; i++) m[i] = sec[i - 1] * sec[i] <= 0 ? 0 : (sec[i - 1] + sec[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (Math.abs(sec[i]) < 1e-12) { m[i] = 0; m[i + 1] = 0; continue; }
      const a = m[i] / sec[i];
      const b = m[i + 1] / sec[i];
      const s = a * a + b * b;
      if (s > 9) {
        const k = 3 / Math.sqrt(s);
        m[i] = k * a * sec[i];
        m[i + 1] = k * b * sec[i];
      }
    }
    for (let i = 0; i < n - 1; i++) {
      const c1x = run[i].x + h[i] / 3;
      const c1y = run[i].y + (m[i] * h[i]) / 3;
      const c2x = run[i + 1].x - h[i] / 3;
      const c2y = run[i + 1].y - (m[i + 1] * h[i]) / 3;
      d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${run[i + 1].x} ${run[i + 1].y}`;
    }
  });
  return d;
}

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 */
export function buildMotionDiagramManifest(props: MotionDiagramProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const valid = (props.series || []).filter((s) => s.points && s.points.length > 0);
  for (const s of valid) {
    const label = s.label || KIND_DEFAULT_LABEL[s.kind];
    const panelLabels: string[] = [
      `${s.kind}-panel`,
      `${s.kind} panel`,
      `${s.kind} plot`,
      `${s.kind} graph`,
      `${s.kind} vs time`,
      `${s.kind} chart`,
      s.kind,
      `the ${s.kind}`,
      `${s.kind}(t)`,
    ];
    if (s.kind === 'position') {
      panelLabels.push('position-panel', 'x-panel', 'x(t) panel', 'x vs t', 'displacement panel', 'x', 'x(t)');
    } else if (s.kind === 'velocity') {
      panelLabels.push('velocity-panel', 'v-panel', 'v(t) panel', 'v vs t', 'speed panel', 'v', 'v(t)');
    } else if (s.kind === 'acceleration') {
      panelLabels.push('acceleration-panel', 'a-panel', 'a(t) panel', 'a vs t', 'a', 'a(t)');
    }
    if (s.label) panelLabels.push(s.label);
    entries.push({
      name: `${s.kind}-panel`,
      kind: 'region',
      description: `${s.kind} vs time panel (${label})`,
      labels: panelLabels,
    });
    // Data VALUES as a snapshot-visible feature (value-blindness audit,
    // 2026-07-23): the region entry above is filtered out of getSnapshot,
    // so the plotted numbers were entirely invisible to the brain.
    const pts = s.points.slice(0, 8).map((p) => `(${p.t}, ${p.value})`).join(' ');
    entries.push({
      name: `${s.kind}-data`,
      kind: 'other',
      description: `${s.kind} data (t, ${s.kind}): ${pts}${s.points.length > 8 ? ` … +${s.points.length - 8} more` : ''}`,
      labels: [`${s.kind}-data`, `${s.kind} data`, `${s.kind} values`],
    });
  }
  return entries;
}

export default function MotionDiagramRenderer({
  title, timeLabel = 't (s)', series, notes,
}: MotionDiagramProps) {
  const valid = (series || []).filter((s) => s.points && s.points.length > 0);
  if (valid.length === 0) {
    return <div style={{ padding: 24, color: DIAGRAM_COLORS.muted, fontStyle: 'italic' }}>No motion data.</div>;
  }

  const TICK_FS = 11.5;
  const panelH = valid.length === 1 ? 240 : valid.length === 2 ? 170 : 132;

  // Per panel: a round-number y range that contains the data, with 3–5 ticks.
  const panels = valid.map((s) => {
    const values = s.points.map((p) => p.value).filter((v) => Number.isFinite(v));
    let lo = Math.min(...values);
    let hi = Math.max(...values);
    if (hi - lo < 1e-9 * Math.max(1, Math.abs(hi))) {
      // A constant series sits mid-panel: 2 → 0…4, 0 → −1…1.
      const c = lo;
      lo = c === 0 ? -1 : c - Math.abs(c);
      hi = c === 0 ? 1 : c + Math.abs(c);
    }
    const step = niceStep(hi - lo, panelH > 200 ? 5 : 3.5);
    const axisLo = Math.floor(lo / step + 1e-6) * step;
    const axisHi = Math.ceil(hi / step - 1e-6) * step;
    const ticks = ticksBetween(axisLo, axisHi, step);
    // The axis carries the quantity and unit; a longer description becomes the panel's caption.
    const fallback = KIND_DEFAULT_LABEL[s.kind];
    const labelFits = !!s.label && estWidth(s.label, 12.5) <= panelH - 8;
    const axisTitle = s.yLabel || (labelFits ? s.label! : fallback);
    const caption = s.label && s.label !== axisTitle ? s.label : '';
    return { s, step, axisLo, axisHi, ticks, tickLabels: ticks.map((v) => formatTick(v, step)), axisTitle, caption };
  });

  const tickW = Math.max(...panels.flatMap((p) => p.tickLabels.map((l) => estWidth(l, TICK_FS))));
  const anyCaption = panels.some((p) => p.caption);
  const pad = { top: anyCaption ? 22 : 10, left: Math.max(64, 30 + tickW + 10), right: 22 };
  const gap = anyCaption ? 28 : 14;
  const plotW = VIEWBOX_W - pad.left - pad.right;
  const plotBottom = pad.top + panels.length * panelH + (panels.length - 1) * gap;
  const viewH = plotBottom + 44;

  // Shared x (time) range across all series, with ticks on round numbers.
  const allT = valid.flatMap((s) => s.points.map((p) => p.t)).filter((t) => Number.isFinite(t));
  let tMin = Math.min(...allT);
  let tMax = Math.max(...allT);
  if (tMax - tMin < 1e-9) { tMin -= 0.5; tMax += 0.5; }
  const tStep = niceStep(tMax - tMin, 8);
  const tTicks = ticksBetween(tMin, tMax, tStep);
  const sx = (t: number) => pad.left + ((t - tMin) / (tMax - tMin)) * plotW;

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}><InlineMathText text={title} /></div>
      )}
      <svg viewBox={`0 0 ${VIEWBOX_W} ${viewH}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: 'auto', maxWidth: 760, margin: '0 auto' }}>
        {panels.map((panel, idx) => {
          const { s, axisLo, axisHi, ticks, tickLabels, axisTitle, caption } = panel;
          const color = s.color || KIND_COLORS[s.kind];
          const panelTop = pad.top + idx * (panelH + gap);
          const panelBottom = panelTop + panelH;
          // A little air above and below the outer ticks so the curve never rides the frame.
          const inset = 10;
          const sy = (v: number) => panelBottom - inset - ((v - axisLo) / (axisHi - axisLo)) * (panelH - 2 * inset);

          // Stable sort: two samples at the same t keep their order, which is what makes a step.
          const sorted = [...s.points].filter((p) => Number.isFinite(p.t) && Number.isFinite(p.value)).sort((a, b) => a.t - b.t);
          const pxPts = sorted.map((p) => ({ x: sx(p.t), y: sy(p.value) }));
          const path = seriesPath(pxPts, s.kind === 'position');
          const midY = (panelTop + panelBottom) / 2;

          // Expose each panel as a feature named after its series kind
          // (e.g. "position-panel") so the tutor can point at a specific
          // panel without coordinate guessing.
          const featureName = `${s.kind}-panel`;

          return (
            <g key={idx} {...feat(featureName, { cx: pad.left + plotW / 2, cy: midY, w: plotW, h: panelH }, viewH)}>
              <rect x={pad.left} y={panelTop} width={plotW} height={panelH} fill={DIAGRAM_COLORS.panel} stroke={DIAGRAM_COLORS.border} strokeWidth={1} />
              {caption && (
                <text x={pad.left} y={panelTop - 7} fontSize={12} fill={color} fontWeight={600}>{caption}</text>
              )}
              {/* Light grid on the round ticks; the zero line is the reference, so it is darker. */}
              {tTicks.map((t, i) => (
                <line key={`gx-${i}`} x1={sx(t)} y1={panelTop} x2={sx(t)} y2={panelBottom} stroke={DIAGRAM_COLORS.grid} strokeWidth={1} />
              ))}
              {ticks.map((v, i) => (
                <g key={`gy-${i}`}>
                  <line
                    x1={pad.left}
                    y1={sy(v)}
                    x2={pad.left + plotW}
                    y2={sy(v)}
                    stroke={v === 0 ? DIAGRAM_COLORS.axis : DIAGRAM_COLORS.grid}
                    strokeWidth={1}
                  />
                  <line x1={pad.left - 4} y1={sy(v)} x2={pad.left} y2={sy(v)} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} />
                  <text x={pad.left - 7} y={sy(v) + 4} fontSize={TICK_FS} fill={DIAGRAM_COLORS.muted} textAnchor="end">{tickLabels[i]}</text>
                </g>
              ))}
              <line x1={pad.left} y1={panelTop} x2={pad.left} y2={panelBottom} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} />

              <path d={path} stroke={color} strokeWidth={2.25} fill="none" strokeLinejoin="round" strokeLinecap="round" />
              {/* The given samples, when few enough to read individually. */}
              {pxPts.length <= 12 && pxPts.map((p, i) => (
                <circle key={`p-${i}`} cx={p.x} cy={p.y} r={2.75} fill={color} />
              ))}

              <text
                x={15}
                y={midY}
                // A long title shrinks a little rather than run into the next panel.
                fontSize={Math.max(10.5, Math.min(12.5, (panelH + 8) / (axisTitle.length * 0.56)))}
                fill={color}
                textAnchor="middle"
                fontWeight={700}
                transform={`rotate(-90 15 ${midY})`}
              >
                {axisTitle}
              </text>
            </g>
          );
        })}

        {/* Shared time axis under the last panel */}
        <line x1={pad.left} y1={plotBottom} x2={pad.left + plotW} y2={plotBottom} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} />
        {tTicks.map((t, i) => (
          <g key={i}>
            <line x1={sx(t)} y1={plotBottom} x2={sx(t)} y2={plotBottom + 4} stroke={DIAGRAM_COLORS.axis} strokeWidth={1} />
            <text x={sx(t)} y={plotBottom + 17} fontSize={TICK_FS} fill={DIAGRAM_COLORS.muted} textAnchor="middle">{formatTick(t, tStep)}</text>
          </g>
        ))}
        <text x={pad.left + plotW / 2} y={plotBottom + 36} fontSize={12.5} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}>{timeLabel}</text>
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}
