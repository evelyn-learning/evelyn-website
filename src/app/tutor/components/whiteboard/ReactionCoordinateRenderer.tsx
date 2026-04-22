'use client';

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
const SVG_HEIGHT = 340;
const MARGIN = { left: 70, right: 140, top: 34, bottom: 46 };
const PLOT_W = SVG_WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = SVG_HEIGHT - MARGIN.top - MARGIN.bottom;

// Horizontal extents (0..1) for the reactants / hump / products regions
const REACT_END_X = 0.2;
const PEAK_X = 0.5;
const PROD_START_X = 0.8;

const CURVE_PALETTE = ['#dc2626', '#2563eb', '#16a34a', '#9333ea', '#ea580c'];

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

  return (
    <div className="reaction-coordinate-renderer">
      {title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-2">
          {title}
        </div>
      )}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-auto"
        style={{ maxWidth: SVG_WIDTH, maxHeight: SVG_HEIGHT }}
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
                fontSize={11}
                fill="#64748b"
              >
                {t}
              </text>
            </g>
          );
        })}

        {/* Y-axis line */}
        <line
          x1={MARGIN.left}
          y1={MARGIN.top}
          x2={MARGIN.left}
          y2={SVG_HEIGHT - MARGIN.bottom}
          stroke="#475569"
          strokeWidth={1.5}
        />

        {/* X-axis line at the minY boundary (not necessarily at y=0) */}
        <line
          x1={MARGIN.left}
          y1={SVG_HEIGHT - MARGIN.bottom}
          x2={SVG_WIDTH - MARGIN.right}
          y2={SVG_HEIGHT - MARGIN.bottom}
          stroke="#475569"
          strokeWidth={1.5}
        />
        <text
          x={MARGIN.left + PLOT_W / 2}
          y={SVG_HEIGHT - MARGIN.bottom + 28}
          textAnchor="middle"
          fontSize={12}
          fill="#334155"
          fontWeight={500}
        >
          Reaction Progress →
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

        {/* Reactants baseline + label */}
        <text
          x={xReactStart - 6}
          y={yReact - 8}
          textAnchor="start"
          fontSize={12}
          fontWeight={600}
          fill="#1f2937"
        >
          {reactant_label}
          {reactants_energy !== 0 && ` (${reactants_energy} ${units})`}
        </text>

        {/* Products baseline + label (on right) */}
        <text
          x={xProdEnd + 8}
          y={yProd - 8}
          textAnchor="start"
          fontSize={12}
          fontWeight={600}
          fill="#1f2937"
        >
          {product_label}
        </text>
        <text
          x={xProdEnd + 8}
          y={yProd + 8}
          textAnchor="start"
          fontSize={11}
          fill="#64748b"
        >
          ({products_energy} {units})
        </text>

        {/* One curve per activation energy */}
        {eas.map((ea, i) => {
          const color = CURVE_PALETTE[i % CURVE_PALETTE.length];
          const yTop = yToSvg(reactants_energy + ea);
          return (
            <g key={`curve-${i}`}>
              <path
                d={humpPath(ea)}
                fill="none"
                stroke={color}
                strokeWidth={2.2}
              />
              {/* Ea label near the peak */}
              <text
                x={xPeak}
                y={yTop - 8}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill={color}
              >
                E_a = {ea} {units}
              </text>
            </g>
          );
        })}

        {/* ΔH arrow: vertical arrow between reactants and products levels,
            placed in the "products" region to the right of the hump. */}
        {deltaH !== 0 && (() => {
          const xH = xProdEnd - 18;
          const yTop = Math.min(yReact, yProd);
          const yBot = Math.max(yReact, yProd);
          return (
            <g>
              <line
                x1={xH}
                y1={yTop}
                x2={xH}
                y2={yBot}
                stroke="#475569"
                strokeWidth={1.2}
                markerStart="url(#rxn-arrowhead)"
                markerEnd="url(#rxn-arrowhead)"
              />
              <text
                x={xH - 6}
                y={(yTop + yBot) / 2 + 4}
                textAnchor="end"
                fontSize={11}
                fontWeight={600}
                fill="#334155"
              >
                ΔH = {deltaH > 0 ? '+' : ''}
                {deltaH} {units}
              </text>
            </g>
          );
        })()}

        {/* Legend for multi-curve */}
        {eas.length > 1 && (
          <g transform={`translate(${MARGIN.left + 12}, ${MARGIN.top + 10})`}>
            <rect
              x={-6}
              y={-12}
              width={140}
              height={eas.length * 16 + 8}
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth={0.8}
              rx={3}
            />
            {eas.map((_, i) => {
              const color = CURVE_PALETTE[i % CURVE_PALETTE.length];
              const label = curve_labels?.[i] ?? `Curve ${i + 1}`;
              return (
                <g key={`legend-${i}`} transform={`translate(0, ${i * 16})`}>
                  <line
                    x1={0}
                    y1={0}
                    x2={18}
                    y2={0}
                    stroke={color}
                    strokeWidth={2.2}
                  />
                  <text x={24} y={4} fontSize={11} fill="#1f2937">
                    {label}
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
