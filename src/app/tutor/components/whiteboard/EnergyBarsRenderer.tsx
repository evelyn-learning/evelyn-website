'use client';

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

const VIEWBOX_W = 520;
const VIEWBOX_H = 360;

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
  const yRange = yPositiveMax - yNegativeMin;
  const maxTotal = yPositiveMax;  // kept for total-line auto-detect logic

  // Auto-detect total-invariance if the caller didn't set showTotalLine explicitly.
  const firstTotal = totals[0];
  const allSame = totals.every((t) => Math.abs(t - firstTotal) < 0.01 * Math.max(maxTotal, 1));
  const drawTotalLine = showTotalLine ?? allSame;

  // Layout.
  const plotLeft = 70;
  const plotRight = VIEWBOX_W - 20;
  const plotTop = 50;
  const plotBottom = VIEWBOX_H - 70;
  const plotHeight = plotBottom - plotTop;
  const plotWidth = plotRight - plotLeft;

  const columnWidth = plotWidth / positions.length;
  const barWidth = Math.min(60, columnWidth * 0.55);

  // y=0 may not be at plotBottom anymore; place it according to where
  // zero falls between yNegativeMin and yPositiveMax.
  const zeroY = plotBottom - ((0 - yNegativeMin) / yRange) * plotHeight;
  const yForValue = (v: number): number => plotBottom - ((v - yNegativeMin) / yRange) * plotHeight;

  // Y-axis ticks. Span from yNegativeMin to yPositiveMax in 5 steps.
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((frac) => {
    const value = yNegativeMin + frac * yRange;
    return { y: plotBottom - frac * plotHeight, label: formatValue(value) };
  });

  const totalLineY = yForValue(firstTotal);

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
          {title}
        </div>
      )}
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', maxHeight: 380 }}
      >
        {/* Gridlines */}
        {yTicks.map((t, i) => (
          <line
            key={i}
            x1={plotLeft}
            y1={t.y}
            x2={plotRight}
            y2={t.y}
            stroke={COLORS.grid}
            strokeWidth={1}
          />
        ))}

        {/* Y-axis */}
        <line
          x1={plotLeft}
          y1={plotTop}
          x2={plotLeft}
          y2={plotBottom}
          stroke={COLORS.axis}
          strokeWidth={1.5}
        />
        {/* X-axis (baseline at 0) */}
        <line
          x1={plotLeft}
          y1={plotBottom}
          x2={plotRight}
          y2={plotBottom}
          stroke={COLORS.axis}
          strokeWidth={1.5}
        />

        {/* Y-axis tick labels + axis title */}
        {yTicks.map((t, i) => (
          <text
            key={i}
            x={plotLeft - 8}
            y={t.y + 4}
            fontSize={11}
            fill={COLORS.muted}
            textAnchor="end"
          >
            {t.label}
          </text>
        ))}
        <text
          x={16}
          y={plotTop + plotHeight / 2}
          fontSize={12}
          fill={COLORS.muted}
          textAnchor="middle"
          transform={`rotate(-90 16 ${plotTop + plotHeight / 2})`}
        >
          {yAxisLabel}
        </text>

        {/* Total-energy line */}
        {drawTotalLine && (
          <g {...feat('total-line', { cx: (plotLeft + plotRight) / 2, cy: totalLineY, w: plotRight - plotLeft + 20, h: 20 }, { width: VIEWBOX_W, height: VIEWBOX_H })}>
            <line
              x1={plotLeft}
              y1={totalLineY}
              x2={plotRight}
              y2={totalLineY}
              stroke={COLORS.axis}
              strokeWidth={1.5}
              strokeDasharray="6 4"
            />
            <text
              x={plotRight}
              y={totalLineY - 6}
              fontSize={11}
              fill={COLORS.axis}
              textAnchor="end"
              fontStyle="italic"
            >
              Total energy (conserved)
            </text>
          </g>
        )}

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
            if (h > 16) {
              segments.push(
                <text
                  key={`v-${j}`}
                  x={centerX}
                  y={y + h / 2 + 4}
                  fontSize={11}
                  fill="white"
                  fontWeight={600}
                  textAnchor="middle"
                >
                  {formatValue(value)}
                </text>,
              );
            }
            if (value > 0) posTop = y;
            else negBottom = y + h;
          });

          const total = (p.ke ?? 0) + (p.pe ?? 0) + (p.spring ?? 0) + (p.thermal ?? 0);
          const barName = p.label ? `bar-${featSlug(p.label)}` : `bar-${i + 1}`;
          return (
            <g key={p.label} {...feat(barName, { cx: centerX, cy: plotBottom - plotHeight / 2, w: barWidth + 16, h: plotHeight }, { width: VIEWBOX_W, height: VIEWBOX_H })}>
              {segments}
              {/* Column label below */}
              <text
                x={centerX}
                y={plotBottom + 18}
                fontSize={12}
                fill={COLORS.text}
                fontWeight={600}
                textAnchor="middle"
              >
                {p.label}
              </text>
              {/* Total above the stack, if shown */}
              {!drawTotalLine && total > 0 && (
                <text
                  x={centerX}
                  y={yForValue(total) - 6}
                  fontSize={11}
                  fill={COLORS.muted}
                  textAnchor="middle"
                >
                  {formatValue(total)}
                </text>
              )}
            </g>
          );
        })}

        {/* Legend */}
        {(() => {
          const shown = LEGEND_ENTRIES.filter((e) => {
            if (e.key === 'ke') return hasKE;
            if (e.key === 'pe') return hasPE;
            if (e.key === 'spring') return hasSpring;
            if (e.key === 'thermal') return hasThermal;
            return false;
          });
          const legendY = plotTop - 20;
          const slotWidth = Math.min(160, plotWidth / Math.max(shown.length, 1));
          return shown.map((e, i) => {
            const lx = plotLeft + i * slotWidth;
            return (
              <g key={e.key}>
                <rect x={lx} y={legendY - 9} width={12} height={12} fill={e.color} />
                <text x={lx + 18} y={legendY} fontSize={12} fill={COLORS.text} dominantBaseline="middle">
                  {e.label}
                </text>
              </g>
            );
          });
        })()}

        {notes && (
          <text
            x={VIEWBOX_W / 2}
            y={VIEWBOX_H - 10}
            fontSize={12}
            fill={COLORS.muted}
            textAnchor="middle"
          >
            {notes}
          </text>
        )}
      </svg>
    </div>
  );
}

function formatValue(v: number): string {
  if (v === 0) return '0';
  const abs = Math.abs(v);
  if (abs >= 100) return v.toFixed(0);
  if (abs >= 10) return v.toFixed(1);
  return v.toFixed(2).replace(/\.?0+$/, '');
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
