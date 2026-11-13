'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Energy Bar Chart Renderer
 *
 * Teaches conservation of energy visually — PE, KE, and (optional) thermal/
 * spring/total bars stacked at each labeled position in a scenario (e.g. top,
 * middle, bottom of a drop; compressed, natural length, released for a spring;
 * before/during/after for a collision with friction).
 *
 * Each position has its own column of stacked bars whose heights sum to the
 * total mechanical energy (or to total-plus-thermal when friction is present).
 * When all positions have the same total, that invariance IS the lesson —
 * and we draw a dashed "total" line across the top so students can see it.
 */

import React from 'react';
import { feat, featSlug, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';
import { estimateLabelWidth, wrapLabel } from './fraction-bar-layout';

export interface EnergyBarsPosition {
  label: string;        // e.g. "Top", "Middle", "Bottom", or "A", "B", "C"
  ke?: number;          // kinetic energy (J or arbitrary unit)
  pe?: number;          // potential energy
  spring?: number;      // elastic / spring potential energy
  thermal?: number;     // energy lost to friction/heat (bars "below the line")
}

export interface EnergyBarsProps {
  title?: string;
  positions: EnergyBarsPosition[];
  /** Label for the vertical axis. Default: "Energy (J)". */
  yAxisLabel?: string;
  /** When true, draw a dashed line across the top showing total energy invariance. Default: auto-detect (only if totals are within 1% of each other). */
  showTotalLine?: boolean;
  /** Short caption under the chart (e.g. "Neglecting air resistance"). */
  notes?: string;
}

// Minimum chart width; it grows with the number of positions.
const VIEWBOX_W = 520;

// Semantic colors matching the FBD renderer palette.
const COLORS = {
  ke: '#dc2626',       // red — motion
  pe: '#16a34a',       // green — height / gravity
  spring: '#2563eb',   // blue — spring PE
  thermal: '#9333ea',  // purple — friction loss
  axis: '#475569',
  text: '#0f172a',
  muted: '#64748b',
  grid: '#e2e8f0',
};

/** Exported so the tool-scope test can assert the brain-invisible legend
 *  still matches what show_energy_bars' description promises. */
export const LEGEND_ENTRIES: Array<{ key: keyof Omit<EnergyBarsPosition, 'label'>; label: string; color: string }> = [
  { key: 'ke', label: 'KE (kinetic)', color: COLORS.ke },
  { key: 'pe', label: 'PE (gravitational)', color: COLORS.pe },
  { key: 'spring', label: 'PE (spring)', color: COLORS.spring },
  { key: 'thermal', label: 'Thermal (lost)', color: COLORS.thermal },
];

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * Replicates the auto-detect logic for the total-energy line so the manifest
 * agrees with whatever the renderer draws.
 */
export function buildEnergyBarsManifest(props: EnergyBarsProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const positions = props.positions ?? [];
  if (positions.length === 0) return entries;

  const totals = positions.map(
    (p) => (p.ke ?? 0) + (p.pe ?? 0) + (p.spring ?? 0) + (p.thermal ?? 0),
  );
  const maxTotal = Math.max(...totals, 1);
  const firstTotal = totals[0];
  const allSame = totals.every((t) => Math.abs(t - firstTotal) < 0.01 * maxTotal);
  const drawTotalLine = props.showTotalLine ?? allSame;

  if (drawTotalLine) {
    entries.push({
      name: 'total-line',
      kind: 'line',
      description: `dashed total-energy line at ${formatValue(firstTotal)} J (conservation reference)`,
      labels: ['total-line', 'total line', 'total energy', 'total energy line', 'conservation line', 'total', 'E total', 'Etot'],
    });
  }

  const lastIdx = positions.length - 1;
  positions.forEach((p, i) => {
    // Strip parenthetical qualifiers from the label so "Release (10 m)"
    // becomes "Release" when generating natural-language aliases. The
    // model reliably says "Release", "the Release bar", "KE at Release"
    // — never "Release (10 m)" — so the parens form is useless as a
    // matching surface and actively breaks per-segment aliases.
    const fullLabel = p.label ?? '';
    const bareMatch = fullLabel.match(/^([^\(]+?)\s*\(/);
    const bare = bareMatch ? bareMatch[1].trim() : fullLabel.trim();
    const name = bare ? `bar-${featSlug(bare)}` : `bar-${i + 1}`;
    const ref = bare || `${i + 1}`;
    const barLabels: string[] = [name];
    if (fullLabel) {
      barLabels.push(
        fullLabel,
        `bar ${fullLabel}`,
        `the ${fullLabel} bar`,
        `${fullLabel} bar`,
        `position ${fullLabel}`,
        `at ${fullLabel}`,
        `bar at ${fullLabel}`,
      );
      if (bare && bare !== fullLabel) {
        barLabels.push(
          bare,
          `bar ${bare}`,
          `the ${bare} bar`,
          `${bare} bar`,
          `position ${bare}`,
          `at ${bare}`,
          `bar at ${bare}`,
          `bar-${featSlug(bare)}`,
        );
      }
    }
    // Positional aliases — added regardless of whether a label exists.
    // Model frequently says "bar 1" / "first bar" / "the last bar"
    // alongside named references, so both surfaces should resolve.
    barLabels.push(
      `bar ${i + 1}`,
      `bar-${i + 1}`,
      `${ordinal(i + 1)} bar`,
      `the ${ordinal(i + 1)} bar`,
      `position ${i + 1}`,
    );
    if (i === 0) barLabels.push('first bar', 'the first bar');
    if (i === lastIdx) barLabels.push('last bar', 'the last bar', 'final bar', 'the final bar');
    // Energy sub-segment aliases. Marking the whole bar is enough — the
    // colored stack is visually self-explanatory once circled. We add
    // every plausible tutor reference to each present component so
    // "kinetic at release", "release-KE", "KE in the rebound bar",
    // etc. all resolve to the bar. Use the BARE phase name for these
    // (parens-stripped) because that's what the model speaks.
    const seg = (full: string, abbr: string, present: boolean) => {
      if (!present) return;
      const segRefs = bare && bare !== fullLabel ? [bare, fullLabel] : [ref];
      for (const r of segRefs) {
        if (!r) continue;
        barLabels.push(
          `${full} at ${r}`, `${full} in ${r}`, `${full} of ${r}`,
          `${r} ${full}`, `${r}-${abbr.toLowerCase()}`, `${abbr.toLowerCase()}-${featSlug(r)}`,
          `${abbr} at ${r}`, `${abbr} in ${r}`, `${abbr} of ${r}`,
          `${r} ${abbr}`, `${r}'s ${abbr}`, `${r}'s ${full}`,
          `the ${abbr} ${r}`, `the ${abbr} bar at ${r}`,
          `the ${abbr} in the ${r} bar`, `${abbr} in the ${r} bar`,
        );
      }
    };
    seg('kinetic energy', 'KE', (p.ke ?? 0) !== 0);
    seg('gravitational potential energy', 'PE', (p.pe ?? 0) !== 0);
    seg('spring potential energy', 'spring PE', (p.spring ?? 0) !== 0);
    seg('thermal energy', 'thermal', (p.thermal ?? 0) !== 0);
    // Component VALUES in the description (value-blindness audit,
    // 2026-07-23): only the total survived; the per-component joules the
    // tutor narrates with were invisible to the board snapshot.
    const comps = [
      (p.ke ?? 0) !== 0 ? `KE ${formatValue(p.ke ?? 0)} J` : '',
      (p.pe ?? 0) !== 0 ? `PE ${formatValue(p.pe ?? 0)} J` : '',
      (p.spring ?? 0) !== 0 ? `spring ${formatValue(p.spring ?? 0)} J` : '',
      (p.thermal ?? 0) !== 0 ? `thermal ${formatValue(p.thermal ?? 0)} J` : '',
    ].filter(Boolean).join(', ');
    entries.push({
      name,
      kind: 'shape',
      description: `stacked energy bar at position "${fullLabel || i + 1}" (total ${formatValue(totals[i])} J${comps ? `: ${comps}` : ''})`,
      labels: Array.from(new Set(barLabels.filter(Boolean))),
    });
  });

  return entries;
}

function ordinal(n: number): string {
  const suffix = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
}

export default function EnergyBarsRenderer({
  title,
  positions,
  yAxisLabel = 'Energy (J)',
  showTotalLine,
  notes,
}: EnergyBarsProps) {
  // Defensive: render a placeholder if no positions provided.
  if (!positions || positions.length === 0) {
    return (
      <div style={{ padding: 24, color: COLORS.muted, fontStyle: 'italic' }}>
        No energy data to display.
      </div>
    );
  }

  // Which components are actually present across all positions?
  const hasKE = positions.some((p) => (p.ke ?? 0) !== 0);
  const hasPE = positions.some((p) => (p.pe ?? 0) !== 0);
  const hasSpring = positions.some((p) => (p.spring ?? 0) !== 0);
  const hasThermal = positions.some((p) => (p.thermal ?? 0) !== 0);

  const totals = positions.map(
    (p) => (p.ke ?? 0) + (p.pe ?? 0) + (p.spring ?? 0) + (p.thermal ?? 0),
  );
  // Y-axis range. Positive-stack ceiling = max of (sum of positive components)
  // across all positions. Negative-stack floor = min of (sum of negative
  // components) — only PE can go negative; KE/spring/thermal are validated
  // ≥ 0. Without considering negatives, a position with PE=-50 + KE=150
  // would draw a 150 J bar that overshoots a y-axis sized to total=100.
  const positiveStackPerPos = positions.map(
    (p) => Math.max(0, p.ke ?? 0) + Math.max(0, p.pe ?? 0) + Math.max(0, p.spring ?? 0) + Math.max(0, p.thermal ?? 0),
  );
  const negativeStackPerPos = positions.map(
    (p) => Math.min(0, p.pe ?? 0),  // only PE can be negative
  );
  const yPositiveMax = Math.max(...positiveStackPerPos, 1);
  const yNegativeMin = Math.min(...negativeStackPerPos, 0);
  const maxTotal = yPositiveMax;  // kept for total-line auto-detect logic

  // Auto-detect total-invariance if the caller didn't set showTotalLine explicitly.
  const firstTotal = totals[0];
  const allSame = totals.every((t) => Math.abs(t - firstTotal) < 0.01 * Math.max(maxTotal, 1));
  const drawTotalLine = showTotalLine ?? allSame;

  // Y axis on round numbers: the top tick clears the tallest stack, the bottom one any negative PE.
  const step = niceStep(yPositiveMax - yNegativeMin, 5);
  const axisMax = Math.ceil((yPositiveMax * 1.04) / step - 1e-9) * step;
  const axisMin = yNegativeMin < 0 ? Math.floor(yNegativeMin / step + 1e-9) * step : 0;
  const yRange = axisMax - axisMin;
  const tickValues: number[] = [];
  for (let k = Math.round(axisMin / step); k * step <= axisMax + step * 1e-6; k++) tickValues.push(Number((k * step).toPrecision(12)));
  // Very large or very small energies: factor a power of ten out into the axis title
  // (ticks 0, 5, 10 under "Energy (J) ×10⁹") instead of printing long numbers everywhere.
  const magnitude = Math.max(Math.abs(axisMax), Math.abs(axisMin));
  const unitPow = magnitude >= 1e6 || magnitude < 1e-2 ? 3 * Math.floor(Math.log10(magnitude) / 3 + 1e-9) : 0;
  const shown = (v: number): string => formatValue(unitPow ? Number((v / 10 ** unitPow).toPrecision(10)) : v);
  const axisTitle = unitPow ? `${yAxisLabel}  ×10${superscript(unitPow)}` : yAxisLabel;
  const tickLabels = tickValues.map(shown);
  const tickLabelW = Math.max(...tickLabels.map((l) => estimateLabelWidth(l, 12)));

  // Legend: its own rows above the plot, wrapped by measured entry widths.
  const shownLegend = LEGEND_ENTRIES.filter((e) => {
    if (e.key === 'ke') return hasKE;
    if (e.key === 'pe') return hasPE;
    if (e.key === 'spring') return hasSpring;
    if (e.key === 'thermal') return hasThermal;
    return false;
  });

  // Layout. The chart widens with the number of positions so columns keep a readable width.
  const plotLeft = Math.max(64, 30 + tickLabelW + 12);
  const viewW = Math.max(VIEWBOX_W, plotLeft + 20 + positions.length * 76);
  const plotRight = viewW - 20;
  const plotWidth = plotRight - plotLeft;
  const columnWidth = plotWidth / positions.length;
  const barWidth = Math.max(18, Math.min(64, columnWidth * 0.6));

  const legendRows: Array<Array<{ entry: (typeof LEGEND_ENTRIES)[number]; x: number }>> = [[]];
  {
    let lx = 0;
    for (const entry of shownLegend) {
      const w = 18 + estimateLabelWidth(entry.label, 12) + 22;
      if (lx > 0 && lx + w - 22 > plotWidth) { legendRows.push([]); lx = 0; }
      legendRows[legendRows.length - 1].push({ entry, x: lx });
      lx += w;
    }
  }
  const LEGEND_ROW_H = 18;
  const legendH = shownLegend.length > 0 ? legendRows.length * LEGEND_ROW_H : 0;
  // Room between legend and plot for the total-line caption and the per-bar totals.
  const plotTop = 10 + legendH + 30;
  const plotHeight = 240;
  const plotBottom = plotTop + plotHeight;

  // Column labels: wrapped to the column; if a single word is still too wide, all labels are angled instead.
  const LABEL_FS = 12;
  const labelCap = columnWidth - 8;
  const wrapped = positions.map((p) => wrapLabel(p.label ?? '', (labelCap * 13) / LABEL_FS));
  const angled = wrapped.some((lines) => lines.some((l) => estimateLabelWidth(l, LABEL_FS) > labelCap + 2));
  const longestLabel = Math.max(...positions.map((p) => estimateLabelWidth(p.label ?? '', LABEL_FS)));
  const labelsH = angled
    ? Math.sin((35 * Math.PI) / 180) * longestLabel + 22
    : Math.max(...wrapped.map((lines) => lines.length)) * 14 + 14;
  const viewH = plotBottom + labelsH + 4;

  const yForValue = (v: number): number => plotBottom - ((v - axisMin) / yRange) * plotHeight;
  const zeroY = yForValue(0);
  const yTicks = tickValues.map((value, i) => ({ y: yForValue(value), label: tickLabels[i], value }));
  const totalLineY = yForValue(firstTotal);
  const totalCaption = `${allSame ? 'Total energy (conserved)' : 'Total energy at the start'}: ${shown(firstTotal)}${unitPow ? ` ×10${superscript(unitPow)}` : ''}`;
  const totalCaptionW = estimateLabelWidth(totalCaption, 12) * 0.94;

  // Over the bars when they all stop at it; under them when some bar crosses it (negative PE),
  // so the line never strikes through a value printed in a bar.
  const totalUnderBars = firstTotal < 0 || positiveStackPerPos.some((v) => v > firstTotal * 1.001 + 1e-9);
  const totalLine = drawTotalLine ? (
          <g {...feat('total-line', { cx: (plotLeft + plotRight) / 2, cy: totalLineY, w: plotRight - plotLeft + 20, h: 20 }, { width: viewW, height: viewH })}>
            <line
              x1={plotLeft}
              y1={totalLineY}
              x2={plotRight}
              y2={totalLineY}
              stroke={COLORS.axis}
              strokeWidth={1.5}
              strokeDasharray="6 4"
            />
            {/* Its key sits in the clear row above the plot, where no bar can run into it. */}
            <line x1={plotRight - totalCaptionW - 34} y1={plotTop - 14} x2={plotRight - totalCaptionW - 8} y2={plotTop - 14} stroke={COLORS.axis} strokeWidth={1.5} strokeDasharray="6 4" />
            <text x={plotRight} y={plotTop - 10} fontSize={12} fill={COLORS.axis} textAnchor="end" fontStyle="italic">
              {totalCaption}
            </text>
          </g>
        ) : null;

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div
          style={{
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 8,
            color: COLORS.text,
          }}
        >
          <InlineMathText text={title} />
        </div>
      )}
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', height: 'auto', maxWidth: Math.max(680, viewW * 1.15), margin: '0 auto' }}
      >
        {/* Legend */}
        {legendRows.map((row, ri) =>
          row.map(({ entry, x }) => {
            const ly = 16 + ri * LEGEND_ROW_H;
            return (
              <g key={entry.key}>
                <rect x={plotLeft + x} y={ly - 6} width={12} height={12} rx={2} fill={entry.color} />
                <text x={plotLeft + x + 18} y={ly + 4} fontSize={12} fill={COLORS.text}>
                  {entry.label}
                </text>
              </g>
            );
          }),
        )}

        {/* Gridlines */}
        {yTicks.map((t, i) => (
          <line key={i} x1={plotLeft} y1={t.y} x2={plotRight} y2={t.y} stroke={COLORS.grid} strokeWidth={1} />
        ))}

        {/* Y-axis */}
        <line x1={plotLeft} y1={plotTop} x2={plotLeft} y2={plotBottom} stroke={COLORS.axis} strokeWidth={1.5} />
        {/* Baseline at 0 */}
        <line x1={plotLeft} y1={zeroY} x2={plotRight} y2={zeroY} stroke={COLORS.axis} strokeWidth={1.5} />

        {/* Y-axis tick labels + axis title */}
        {yTicks.map((t, i) => (
          <text key={i} x={plotLeft - 8} y={t.y + 4} fontSize={12} fill={COLORS.muted} textAnchor="end">
            {t.label}
          </text>
        ))}
        <text
          x={15}
          y={plotTop + plotHeight / 2}
          fontSize={12.5}
          fill={COLORS.muted}
          textAnchor="middle"
          transform={`rotate(-90 15 ${plotTop + plotHeight / 2})`}
        >
          {axisTitle}
        </text>

        {totalUnderBars && totalLine}

        {/* Bars */}
        {positions.map((p, i) => {
          const centerX = plotLeft + columnWidth * (i + 0.5);
          const x = centerX - barWidth / 2;
          // Stack order: thermal first (bottom), then PE (gravitational), then spring PE, then KE on top.
          const stack: Array<[number, string]> = [];
          if (hasThermal) stack.push([p.thermal ?? 0, COLORS.thermal]);
          if (hasPE) stack.push([p.pe ?? 0, COLORS.pe]);
          if (hasSpring) stack.push([p.spring ?? 0, COLORS.spring]);
          if (hasKE) stack.push([p.ke ?? 0, COLORS.ke]);

          // Positives stack upward from zeroY; negatives stack downward.
          // Track running edges separately so a position with mixed signs
          // (e.g. PE=-50 + KE=150) renders both: the −50 J segment below
          // the zero line in green, the 150 J segment above in red.
          const pxPerUnit = plotHeight / yRange;
          let posTop = zeroY;
          let negBottom = zeroY;

          const segments: React.ReactElement[] = [];
          stack.forEach(([value, color], j) => {
            if (value === 0) return;
            const h = Math.abs(value) * pxPerUnit;
            const y = value > 0 ? posTop - h : negBottom;
            segments.push(
              <rect
                key={j}
                x={x}
                y={y}
                width={barWidth}
                height={h}
                fill={color}
                stroke={darken(color)}
                strokeWidth={1}
              />,
            );
            // A value is printed only where it fits: full form, else compact, else left to the axis.
            const full = shown(value);
            const compact = unitPow ? full : formatCompact(value);
            const fits = (s: string) => estimateLabelWidth(s, 11.5) <= barWidth - 6;
            const text = fits(full) ? full : fits(compact) ? compact : '';
            if (h >= 17 && text) {
              segments.push(
                <text
                  key={`v-${j}`}
                  x={centerX}
                  y={y + h / 2 + 4}
                  fontSize={11.5}
                  fill="white"
                  fontWeight={600}
                  textAnchor="middle"
                >
                  {text}
                </text>,
              );
            }
            if (value > 0) posTop = y;
            else negBottom = y + h;
          });

          const total = (p.ke ?? 0) + (p.pe ?? 0) + (p.spring ?? 0) + (p.thermal ?? 0);
          const barName = p.label ? `bar-${featSlug(p.label)}` : `bar-${i + 1}`;
          return (
            <g key={`${p.label}-${i}`} {...feat(barName, { cx: centerX, cy: plotBottom - plotHeight / 2, w: barWidth + 16, h: plotHeight }, { width: viewW, height: viewH })}>
              {segments}
              {/* Column label below */}
              {angled ? (
                <text
                  x={centerX + 4}
                  y={plotBottom + 14}
                  fontSize={LABEL_FS}
                  fill={COLORS.text}
                  fontWeight={600}
                  textAnchor="end"
                  transform={`rotate(-35 ${centerX + 4} ${plotBottom + 14})`}
                >
                  {p.label}
                </text>
              ) : (
                <text x={centerX} y={plotBottom + 17} fontSize={LABEL_FS} fill={COLORS.text} fontWeight={600} textAnchor="middle">
                  {wrapped[i].map((line, li) => (
                    <tspan key={li} x={centerX} y={plotBottom + 17 + li * 14}>{line}</tspan>
                  ))}
                </text>
              )}
              {/* Total above the stack, if shown */}
              {!drawTotalLine && total > 0 && (
                <text x={centerX} y={yForValue(positiveStackPerPos[i]) - 6} fontSize={11.5} fill={COLORS.muted} textAnchor="middle">
                  {shown(total)}
                </text>
              )}
            </g>
          );
        })}

        {!totalUnderBars && totalLine}
      </svg>
      {/* Notes as wrapping HTML below the SVG (shared DiagramNotes idiom,
          matching the HTML title above — the in-SVG single-line version
          clipped long captions; 2026-08-07 clip audit). */}
      <DiagramNotes notes={notes} />
    </div>
  );
}

/** A round step (1, 2, 2.5 or 5 × a power of ten) giving about `target` intervals. */
function niceStep(span: number, target: number): number {
  if (!(span > 0) || !Number.isFinite(span)) return 1;
  const raw = span / target;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const frac = raw / pow;
  return (frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 2.5 ? 2.5 : frac <= 5 ? 5 : 10) * pow;
}

/** No pointless trailing zeros ("50", not "50.0"), a true minus, thousands grouped from 10 000. */
function formatValue(v: number): string {
  if (!Number.isFinite(v)) return '';
  if (v === 0) return '0';
  const abs = Math.abs(v);
  const sign = v < 0 ? '−' : '';
  if (abs >= 1e9 || abs < 1e-3) return sign + formatCompact(abs);
  const rounded = abs >= 1000 ? String(Number(abs.toFixed(1))) : String(Number(abs.toPrecision(4)));
  const [int, frac] = rounded.split('.');
  // Narrow no-break space between groups of three.
  const grouped = int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : int;
  return sign + (frac ? `${grouped}.${frac}` : grouped);
}

function superscript(n: number): string {
  const map: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  return String(n).split('').map((ch) => map[ch] ?? ch).join('');
}

/** Short form for a tight spot: 12 500 → "12.5k", 3 400 000 → "3.4M". */
function formatCompact(v: number): string {
  const abs = Math.abs(v);
  const sign = v < 0 ? '−' : '';
  const units: Array<[number, string]> = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k']];
  for (const [size, suffix] of units) {
    if (abs >= size) return `${sign}${Number((abs / size).toPrecision(3))}${suffix}`;
  }
  if (abs < 1e-3) {
    const [mant, exp] = abs.toExponential(1).split('e');
    return `${sign}${Number(mant)}×10^${Number(exp)}`;
  }
  return sign + String(Number(abs.toPrecision(3)));
}

// Slightly darkened stroke for each bar fill.
function darken(hex: string): string {
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - 40);
  const g = Math.max(0, ((n >> 8) & 0xff) - 40);
  const b = Math.max(0, (n & 0xff) - 40);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
