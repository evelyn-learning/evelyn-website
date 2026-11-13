'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Reaction Coordinate Renderer
 *
 * The classic chemistry energy-profile diagram: a reactants baseline on the
 * left, a products baseline on the right (often at a different energy), and
 * one or more bezier humps representing activation-energy barriers between
 * them. Supports multi-curve comparison (with vs without catalyst) and
 * auto-annotates ΔH and Ea.
 *
 * This replaces the old pattern of the tutor hand-rolling a Desmos function
 * graph for this shape — which reliably got the y-axis wrong (products at
 * y=0 instead of y=ΔH) and couldn't show negative energies.
 */

import React from 'react';
import { feat, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

export interface ReactionCoordinateProps {
  title?: string;
  /** Energy of reactants. Usually 0 (reference) but can be any number. */
  reactants_energy?: number;
  /** Energy of products. Negative for exothermic, positive for endothermic. */
  products_energy: number;
  /**
   * Activation energies, one per curve. A single number draws one hump;
   * multiple numbers draw multiple curves (e.g. [50, 30] for catalyst vs no
   * catalyst). All curves share the same reactants/products levels.
   */
  activation_energies: number[];
  /** Optional label per curve — used in the legend. Length must match activation_energies. */
  curve_labels?: string[];
  reactant_label?: string;
  product_label?: string;
  /** Energy units shown on axis and ΔH/Ea annotations. */
  units?: string;
}

const SVG_WIDTH = 640;
const BASE_HEIGHT = 340;
const MARGIN = { left: 70, right: 140, top: 34, bottom: 46 };
const PLOT_W = SVG_WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = BASE_HEIGHT - MARGIN.top - MARGIN.bottom;
/** Height of one legend row (multi-curve figures list their curves under the plot). */
const LEGEND_ROW = 19;

// Horizontal extents (0..1) for the reactants / hump / products regions
const REACT_END_X = 0.2;
const PEAK_X = 0.5;
const PROD_START_X = 0.8;

const CURVE_PALETTE = ['#dc2626', '#2563eb', '#16a34a', '#9333ea', '#ea580c'];

/** Numbers in labels use a real minus sign. */
function fmtNum(n: number): string {
  return String(n).replace('-', '−');
}

/**
 * A species label with chemical subscripts: the digits that follow an element
 * symbol or a closing bracket drop below the line ("H2O2(aq)" → H₂O₂(aq)).
 * Leading coefficients ("2 H2O") and plain words are left as they are.
 */
function chemTspans(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /([A-Z][a-z]?|\))(\d+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    out.push(text.slice(last, m.index) + m[1]);
    out.push(<tspan key={k++} baselineShift="sub" fontSize="0.72em">{m[2]}</tspan>);
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return out;
}

const HALO = { stroke: '#fafbfc', strokeWidth: 3.5, paintOrder: 'stroke' as const, strokeLinejoin: 'round' as const };

function niceTickStep(range: number): number {
  // Pick a "nice" axis tick step based on the total y-range.
  const exponent = Math.floor(Math.log10(range));
  const base = Math.pow(10, exponent);
  const normalized = range / base;
  let nice;
  if (normalized < 1.5) nice = 0.2;
  else if (normalized < 3) nice = 0.5;
  else if (normalized < 7) nice = 1;
  else nice = 2;
  return nice * base;
}

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 */
export function buildReactionCoordinateManifest(props: ReactionCoordinateProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const units = props.units ?? 'kJ/mol';
  const reactantName = props.reactant_label ?? 'Reactants';
  const productName = props.product_label ?? 'Products';
  entries.push({
    name: 'reactants',
    kind: 'label',
    description: `reactants baseline label (${reactantName})`,
    labels: ['reactants', 'reactant', 'the reactants', 'starting material', 'starting materials', 'LHS', 'left-hand side', 'left side', 'initial state', reactantName, reactantName.toLowerCase()],
  });
  entries.push({
    name: 'products',
    kind: 'label',
    description: `products baseline label (${productName}, ${props.products_energy} ${units})`,
    labels: ['products', 'product', 'the products', 'RHS', 'right-hand side', 'right side', 'output', 'final state', productName, productName.toLowerCase()],
  });
  const eas = props.activation_energies && props.activation_energies.length > 0 ? props.activation_energies : [50];
  eas.forEach((ea, i) => {
    const curveName = eas.length > 1 ? `curve-${i + 1}` : 'curve';
    const label = props.curve_labels?.[i];
    const curveLabels = new Set<string>([
      curveName,
      'curve',
      'energy profile',
      'reaction curve',
      'energy profile curve',
      'energy diagram',
      `curve ${i + 1}`,
    ]);
    if (label) {
      curveLabels.add(label);
      curveLabels.add(label.toLowerCase());
      curveLabels.add(`the ${label.toLowerCase()}`);
    }
    entries.push({
      name: curveName,
      kind: 'curve',
      description: label ? `energy profile curve (${label}, Ea = ${ea} ${units})` : `energy profile curve (Ea = ${ea} ${units})`,
      labels: Array.from(curveLabels),
    });
    const tsLabels = new Set<string>([
      `ts-${i + 1}`,
      'transition state',
      'transition-state',
      'TS',
      'activated complex',
      'peak',
      `transition state ${i + 1}`,
      `TS ${i + 1}`,
      `peak ${i + 1}`,
    ]);
    if (label) tsLabels.add(`transition state for ${label}`);
    entries.push({
      name: `ts-${i + 1}`,
      kind: 'point',
      description: `transition state at peak of curve ${i + 1}`,
      labels: Array.from(tsLabels),
    });
    const eaLabels = new Set<string>([
      `ea-${i + 1}`,
      'activation energy',
      'activation-energy',
      'Ea',
      'Ea barrier',
      'energy barrier',
      'activation barrier',
      `Ea ${i + 1}`,
      `activation energy ${i + 1}`,
    ]);
    if (label) eaLabels.add(`activation energy for ${label}`);
    entries.push({
      name: `ea-${i + 1}`,
      kind: 'annotation',
      description: `activation energy label (Ea = ${ea} ${units}) for curve ${i + 1}`,
      labels: Array.from(eaLabels),
    });
  });
  return entries;
}

export default function ReactionCoordinateRenderer({
  title,
  reactants_energy = 0,
  products_energy,
  activation_energies,
  curve_labels,
  reactant_label = 'Reactants',
  product_label = 'Products',
  units = 'kJ/mol',
}: ReactionCoordinateProps) {
  const eas = activation_energies.length > 0 ? activation_energies : [50];
  const maxEa = Math.max(...eas);
  const multi = eas.length > 1;
  // The plot keeps its size; a multi-curve legend adds rows underneath it.
  const PLOT_BOTTOM = BASE_HEIGHT - MARGIN.bottom;
  const SVG_HEIGHT = multi ? BASE_HEIGHT + eas.length * LEGEND_ROW + 6 : BASE_HEIGHT;

  // Y-axis range: include reactants, products, and the highest peak, with
  // generous padding so labels don't crash into the axis top.
  const rawMaxY = reactants_energy + maxEa;
  const rawMinY = Math.min(products_energy, reactants_energy, 0);
  const padTop = Math.max((rawMaxY - rawMinY) * 0.12, 15);
  const padBot = Math.max((rawMaxY - rawMinY) * 0.08, 10);
  const maxY = rawMaxY + padTop;
  const minY = rawMinY - padBot;

  const yToSvg = (y: number): number =>
    MARGIN.top + PLOT_H * (1 - (y - minY) / (maxY - minY));
  const xToSvg = (t: number): number => MARGIN.left + PLOT_W * t;

  // Y-axis ticks
  const tickStep = niceTickStep(maxY - minY);
  const ticks: number[] = [];
  const firstTick = Math.ceil(minY / tickStep) * tickStep;
  for (let t = firstTick; t <= maxY + 0.001; t += tickStep) {
    ticks.push(Math.round(t * 1000) / 1000); // guard against floating drift
  }

  // Baseline y positions
  const yReact = yToSvg(reactants_energy);
  const yProd = yToSvg(products_energy);
  const yZero = yToSvg(0);

  // Reactants segment pixels
  const xReactStart = xToSvg(0);
  const xReactEnd = xToSvg(REACT_END_X);
  const xPeak = xToSvg(PEAK_X);
  const xProdStart = xToSvg(PROD_START_X);
  const xProdEnd = xToSvg(1);

  /**
   * Build the hump as TWO quadratic Bezier halves meeting at the peak.
   *
   *   Left half:  (xReactEnd, yReact) → control (xCtrlL, yTop) → (xPeak, yTop)
   *   Right half: (xPeak, yTop)       → control (xCtrlR, yTop) → (xProdStart, yProd)
   *
   * For a quadratic Bezier B(t) = (1-t)² P0 + 2t(1-t) P1 + t² P2, when both
   * P1.y and P2.y equal yTop, the expression reduces to
   *   B(t).y = (1-t)² yReact + t(2-t) yTop
   * which is monotonic from yReact to yTop with no overshoot. The two halves
   * meet at (xPeak, yTop) with horizontal tangents from both sides, so the
   * join is C¹-smooth — and the peak lands EXACTLY at the stated activation
   * energy (previously a cubic bezier let the peak drift off yTop).
   */
  const humpPath = (ea: number): string => {
    const yTop = yToSvg(reactants_energy + ea);
    const xCtrlL = (xReactEnd + xPeak) / 2;
    const xCtrlR = (xPeak + xProdStart) / 2;
    return [
      `M ${xReactStart} ${yReact}`,
      `L ${xReactEnd} ${yReact}`,
      `Q ${xCtrlL} ${yTop}, ${xPeak} ${yTop}`,
      `Q ${xCtrlR} ${yTop}, ${xProdStart} ${yProd}`,
      `L ${xProdEnd} ${yProd}`,
    ].join(' ');
  };

  const deltaH = products_energy - reactants_energy;

  // ── Baseline label wrapping (2026-08-07 clip audit) ──
  // The products label starts at xProdEnd+8 with only ~132u of right margin
  // (≈20 chars at fontSize 12), so any qualified label ("Ammonia products
  // (2 NH₃ molecules)") ran off the viewBox. Wrap to the margin budget and
  // clamp each line for unsplittable words. The reactants label gets the same
  // wrap at a conservative cap so long labels stack instead of running
  // through the hump (it can't clip — anchor=start near x=64 — but overlaps).
  const estTextW = (s: string, fs: number) => s.length * fs * 0.55;
  const wrapWords = (text: string, maxChars: number): string[] => {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let cur = '';
    for (const w of words) {
      const next = cur ? `${cur} ${w}` : w;
      if (next.length > maxChars && cur) { lines.push(cur); cur = w; }
      else cur = next;
    }
    if (cur) lines.push(cur);
    return lines.length > 0 ? lines : [text];
  };
  const prodBudget = Math.max(8, Math.floor((SVG_WIDTH - 4 - (xProdEnd + 8)) / (12 * 0.55)));
  const prodLines = wrapWords(product_label, prodBudget);
  const prodLineX = (ln: string) => Math.min(xProdEnd + 8, SVG_WIDTH - 4 - estTextW(ln, 12));
  const prodEnergyLines = wrapWords(`(${fmtNum(products_energy)} ${units})`, Math.max(8, Math.floor((SVG_WIDTH - 4 - (xProdEnd + 8)) / (11 * 0.55))));
  const prodEnergyLineX = (ln: string) => Math.min(xProdEnd + 8, SVG_WIDTH - 4 - estTextW(ln, 11));
  const reactText = `${reactant_label}${reactants_energy !== 0 ? ` (${fmtNum(reactants_energy)} ${units})` : ''}`;
  // The label must end before the hump starts rising (the flat reactants run is short).
  const reactLines = wrapWords(reactText, 14);

  return (
    <div className="reaction-coordinate-renderer w-full flex flex-col items-center">
      {title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-2">
          <InlineMathText text={title} />
        </div>
      )}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-auto"
        style={{ maxWidth: 720 }}
      >
        <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="#fafbfc" rx={4} />

        <defs>
          <marker
            id="rxn-arrowhead"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
          </marker>
          <marker
            id="rxn-arrowhead-ea"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#b91c1c" />
          </marker>
        </defs>

        {/* Y-axis grid + tick labels */}
        {ticks.map((t, i) => {
          const y = yToSvg(t);
          return (
            <g key={`tick-${i}`}>
              <line
                x1={MARGIN.left}
                y1={y}
                x2={SVG_WIDTH - MARGIN.right}
                y2={y}
                stroke={t === 0 ? '#94a3b8' : '#e2e8f0'}
                strokeWidth={t === 0 ? 1.2 : 0.7}
                strokeDasharray={t === 0 ? undefined : '2,3'}
              />
              <text
                x={MARGIN.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize={11.5}
                fill="#64748b"
              >
                {fmtNum(t)}
              </text>
            </g>
          );
        })}

        {/* Y-axis line */}
        <line
          x1={MARGIN.left}
          y1={MARGIN.top}
          x2={MARGIN.left}
          y2={PLOT_BOTTOM}
          stroke="#475569"
          strokeWidth={1.5}
        />

        {/* X-axis line at the minY boundary (not necessarily at y=0) */}
        <line
          x1={MARGIN.left}
          y1={PLOT_BOTTOM}
          x2={SVG_WIDTH - MARGIN.right}
          y2={PLOT_BOTTOM}
          stroke="#475569"
          strokeWidth={1.5}
        />
        <text
          x={MARGIN.left + PLOT_W / 2}
          y={PLOT_BOTTOM + 28}
          textAnchor="middle"
          fontSize={12}
          fill="#334155"
          fontWeight={500}
        >
          Reaction progress →
        </text>

        {/* Y-axis label (vertical) */}
        <text
          x={18}
          y={MARGIN.top + PLOT_H / 2}
          transform={`rotate(-90 18 ${MARGIN.top + PLOT_H / 2})`}
          textAnchor="middle"
          fontSize={12}
          fill="#334155"
          fontWeight={500}
        >
          Energy ({units})
        </text>

        {/* Reactants baseline + label (wrapped lines stack upward), inside the
            plot so it never sits on the energy axis */}
        <text
          textAnchor="start"
          fontSize={12.5}
          fontWeight={600}
          fill="#1f2937"
          {...HALO}
          {...feat('reactants', { cx: (xReactStart + xReactEnd) / 2, cy: yReact, w: xReactEnd - xReactStart + 40, h: 40 }, { width: SVG_WIDTH, height: SVG_HEIGHT })}
        >
          {reactLines.map((ln, i) => (
            <tspan key={i} x={xReactStart + 8} y={yReact - 9 - (reactLines.length - 1 - i) * 14}>{chemTspans(ln)}</tspan>
          ))}
        </text>

        {/* Products baseline + label (on right; wrapped lines stack upward) */}
        <text
          textAnchor="start"
          fontSize={12}
          fontWeight={600}
          fill="#1f2937"
          {...feat('products', { cx: (xProdStart + xProdEnd) / 2, cy: yProd, w: xProdEnd - xProdStart + 40, h: 40 }, { width: SVG_WIDTH, height: SVG_HEIGHT })}
        >
          {prodLines.map((ln, i) => (
            <tspan key={i} x={prodLineX(ln)} y={yProd - 8 - (prodLines.length - 1 - i) * 16}>{chemTspans(ln)}</tspan>
          ))}
        </text>
        <text
          textAnchor="start"
          fontSize={11}
          fill="#64748b"
        >
          {prodEnergyLines.map((ln, i) => (
            <tspan key={i} x={prodEnergyLineX(ln)} y={yProd + 8 + i * 12}>{ln}</tspan>
          ))}
        </text>

        {/* One curve per activation energy */}
        {eas.map((ea, i) => {
          const color = CURVE_PALETTE[i % CURVE_PALETTE.length];
          const yTop = yToSvg(reactants_energy + ea);
          return (
            <g key={`curve-${i}`} {...feat(eas.length > 1 ? `curve-${i + 1}` : 'curve', { cx: xPeak, cy: (yReact + yTop) / 2, w: xProdStart - xReactEnd + 20, h: Math.max(40, yReact - yTop + 20) }, { width: SVG_WIDTH, height: SVG_HEIGHT })}>
              <path
                d={humpPath(ea)}
                fill="none"
                stroke={color}
                strokeWidth={2.2}
              />
              {/* Transition state / activation-energy markers */}
              <g {...feat(`ts-${i + 1}`, { cx: xPeak, cy: yTop, w: 30, h: 30 }, { width: SVG_WIDTH, height: SVG_HEIGHT })} />
              {/* Activation energy. One curve: a dashed arrow from the reactants
                  level up to the peak, with the value above the peak. Several
                  curves: the values go in the legend under the plot (their
                  peaks share one x, so labels there would pile up). */}
              {!multi && (
                <>
                  <line x1={xReactEnd} y1={yReact} x2={xPeak + 14} y2={yReact} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
                  <line x1={xPeak} y1={yReact - 2} x2={xPeak} y2={yTop + 3} stroke={color} strokeWidth={1.2} strokeDasharray="4 3" markerStart="url(#rxn-arrowhead-ea)" markerEnd="url(#rxn-arrowhead-ea)" />
                </>
              )}
              <text
                x={xPeak}
                y={yTop - 9}
                textAnchor="middle"
                fontSize={12.5}
                fontWeight={700}
                fill={color}
                {...feat(`ea-${i + 1}`, { cx: xPeak, cy: (yReact + yTop) / 2, w: 60, h: Math.max(20, yReact - yTop) }, { width: SVG_WIDTH, height: SVG_HEIGHT })}
              >
                {!multi && (<>E<tspan baselineShift="sub" fontSize="0.72em">a</tspan>{` = ${fmtNum(ea)} ${units}`}</>)}
              </text>
            </g>
          );
        })}

        {/* ΔH arrow: vertical arrow between reactants and products levels,
            placed in the "products" region to the right of the hump. */}
        {deltaH !== 0 && (() => {
          const xH = xProdEnd - 12;
          const yTop = Math.min(yReact, yProd);
          const yBot = Math.max(yReact, yProd);
          // The value sits in the right margin beside the arrow. When the two
          // levels are close, the middle of the arrow is where the products
          // label is, so the value moves beyond the reactants end instead.
          const roomy = (yBot - yTop) / 2 > 16 * prodLines.length + 26;
          // Not roomy: clear of the whole products block — above it when the
          // products sit lower (exothermic), below it when they sit higher.
          const blockTop = yProd - 8 - prodLines.length * 16;
          const blockBottom = yProd + 8 + prodEnergyLines.length * 12;
          const ty = roomy ? (yTop + yBot) / 2 + 4 : (yProd > yReact ? Math.min(blockTop - 4, yReact - 8) : Math.max(blockBottom + 6, yReact + 16));
          const tall = yBot - yTop >= 18; // room for two arrowheads
          const text = `ΔH = ${deltaH > 0 ? '+' : ''}${fmtNum(deltaH)} ${units}`;
          return (
            <g>
              {/* reactants level carried across to the arrow */}
              <line x1={xProdStart - 30} y1={yReact} x2={xProdEnd + 4} y2={yReact} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
              <line
                x1={xH}
                y1={yTop + (tall ? 2 : 0)}
                x2={xH}
                y2={yBot - (tall ? 2 : 0)}
                stroke="#475569"
                strokeWidth={tall ? 1.3 : 2}
                markerStart={tall ? 'url(#rxn-arrowhead)' : undefined}
                markerEnd={tall ? 'url(#rxn-arrowhead)' : undefined}
              />
              <text
                x={Math.min(xProdEnd + 8, SVG_WIDTH - 4 - estTextW(text, 12))}
                y={ty}
                textAnchor="start"
                fontSize={12}
                fontWeight={700}
                fill="#334155"
                {...HALO}
              >
                {text}
              </text>
            </g>
          );
        })()}

        {/* Legend for multi-curve figures: under the plot, one row per curve,
            each with its activation energy. */}
        {multi && (
          <g transform={`translate(${MARGIN.left + 6}, ${BASE_HEIGHT + 4})`}>
            {eas.map((ea, i) => {
              const color = CURVE_PALETTE[i % CURVE_PALETTE.length];
              const label = curve_labels?.[i] ?? `Curve ${i + 1}`;
              return (
                <g key={`legend-${i}`} transform={`translate(0, ${i * LEGEND_ROW})`}>
                  <line x1={0} y1={0} x2={22} y2={0} stroke={color} strokeWidth={2.6} />
                  <text x={30} y={4} fontSize={12.5} fill="#1f2937">
                    <tspan fontWeight={600}>{label}</tspan>
                    <tspan fill={color} fontWeight={700}>{'  ·  E'}<tspan baselineShift="sub" fontSize="0.72em">a</tspan>{` = ${fmtNum(ea)} ${units}`}</tspan>
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
