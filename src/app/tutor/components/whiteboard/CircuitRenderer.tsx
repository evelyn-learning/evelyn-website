'use client';

/**
 * Circuit Renderer
 *
 * Schematic circuit diagrams for AP Physics 2 / Physics C E&M / college intro.
 * Components are placed between nodes in a normalized 0–100 coordinate system.
 * Standard IEEE schematic symbols (zigzag resistors, parallel-plate capacitors,
 * battery cells, etc.).
 *
 * This is a teaching renderer — not a SPICE simulator. The LLM provides
 * component values and placements; we just draw them.
 */

import React from 'react';

export type CircuitComponentType =
  | 'resistor'
  | 'capacitor'
  | 'inductor'
  | 'battery'
  | 'wire'
  | 'switch-open'
  | 'switch-closed'
  | 'bulb'
  | 'voltmeter'
  | 'ammeter'
  | 'ground';

export interface CircuitNode {
  id: string;
  x: number; // 0–100
  y: number; // 0–100
}

export interface CircuitComponent {
  type: CircuitComponentType;
  from: string; // node id
  to: string; // node id
  value?: string;
  unit?: string;
  label?: string;
}

export interface CircuitRendererProps {
  title?: string;
  nodes: CircuitNode[];
  components: CircuitComponent[];
  /** Optional current arrow label (e.g. "I") drawn on a circuit loop. */
  currentLabel?: string;
  /** Show small circles at each node. */
  showNodes?: boolean;
}

const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;

function toSvg(x: number, y: number): [number, number] {
  const inset = 30;
  return [
    inset + (x / 100) * (SVG_WIDTH - 2 * inset),
    inset + (y / 100) * (SVG_HEIGHT - 2 * inset),
  ];
}

/**
 * Draw a schematic component between two SVG points. Components are drawn
 * centered on the midpoint with the symbol aligned to the segment axis,
 * and straight wire segments on either side.
 */
function ComponentShape({
  type,
  from,
  to,
  value,
  unit,
  label,
}: {
  type: CircuitComponentType;
  from: [number, number];
  to: [number, number];
  value?: string;
  unit?: string;
  label?: string;
}) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  const SYMBOL_HALF_LEN: Record<CircuitComponentType, number> = {
    resistor: 20,
    capacitor: 8,
    inductor: 20,
    battery: 8,
    wire: 0,
    'switch-open': 18,
    'switch-closed': 18,
    bulb: 14,
    voltmeter: 14,
    ammeter: 14,
    ground: 0,
  };
  const half = SYMBOL_HALF_LEN[type] ?? 0;

  // Wire endpoints (the part of the wire that sits OUTSIDE the symbol)
  const w1x = mx - ux * half;
  const w1y = my - uy * half;
  const w2x = mx + ux * half;
  const w2y = my + uy * half;

  // Label position: perpendicular offset from midpoint
  const nx = -uy;
  const ny = ux;
  const labelOffset = 22;
  const labelX = mx + nx * labelOffset;
  const labelY = my + ny * labelOffset;

  const symbol = (() => {
    switch (type) {
      case 'resistor': {
        // Zigzag: 6 peaks over 40px
        const peaks = 6;
        const peakHeight = 6;
        const step = (half * 2) / peaks;
        let path = `M ${-half},0`;
        for (let i = 0; i < peaks; i++) {
          const x = -half + (i + 0.5) * step;
          const y = (i % 2 === 0 ? -1 : 1) * peakHeight;
          path += ` L ${x},${y}`;
        }
        path += ` L ${half},0`;
        return <path d={path} fill="none" stroke="#1f2937" strokeWidth={2} />;
      }
      case 'capacitor': {
        // Two parallel lines, gap of ~8px
        const gap = 5;
        const plateLen = 12;
        return (
          <>
            <line x1={-gap} y1={-plateLen} x2={-gap} y2={plateLen} stroke="#1f2937" strokeWidth={2.5} />
            <line x1={gap} y1={-plateLen} x2={gap} y2={plateLen} stroke="#1f2937" strokeWidth={2.5} />
          </>
        );
      }
      case 'inductor': {
        // 4 loops
        const loops = 4;
        const loopR = 5;
        const loopSpacing = (half * 2 - loopR * 2) / (loops - 1);
        const arcs: React.ReactElement[] = [];
        for (let i = 0; i < loops; i++) {
          const cx = -half + loopR + i * loopSpacing;
          arcs.push(
            <path
              key={i}
              d={`M ${cx - loopR},0 A ${loopR},${loopR} 0 0 1 ${cx + loopR},0`}
              fill="none"
              stroke="#1f2937"
              strokeWidth={2}
            />
          );
        }
        return <>{arcs}</>;
      }
      case 'battery': {
        // Long line (positive) + short line (negative)
        return (
          <>
            <line x1={-2} y1={-10} x2={-2} y2={10} stroke="#1f2937" strokeWidth={2.5} />
            <line x1={3} y1={-14} x2={3} y2={14} stroke="#1f2937" strokeWidth={2.5} />
            <text x={-2} y={-16} textAnchor="middle" fontSize={11} fill="#1f2937" fontWeight={600}>
              +
            </text>
            <text x={3} y={24} textAnchor="middle" fontSize={11} fill="#1f2937" fontWeight={600}>
              −
            </text>
          </>
        );
      }
      case 'switch-open':
        return (
          <>
            <line x1={-half} y1={0} x2={-5} y2={0} stroke="#1f2937" strokeWidth={2} />
            <line x1={-5} y1={0} x2={half - 2} y2={-12} stroke="#1f2937" strokeWidth={2} />
            <circle cx={-5} cy={0} r={2} fill="#1f2937" />
            <circle cx={half - 2} cy={0} r={2} fill="#1f2937" />
          </>
        );
      case 'switch-closed':
        return (
          <>
            <line x1={-half} y1={0} x2={half} y2={0} stroke="#1f2937" strokeWidth={2} />
            <circle cx={-5} cy={0} r={2} fill="#1f2937" />
            <circle cx={half - 2} cy={0} r={2} fill="#1f2937" />
          </>
        );
      case 'bulb':
        return (
          <>
            <circle cx={0} cy={0} r={12} fill="#fef3c7" stroke="#1f2937" strokeWidth={2} />
            <line x1={-8} y1={-8} x2={8} y2={8} stroke="#1f2937" strokeWidth={1.5} />
            <line x1={-8} y1={8} x2={8} y2={-8} stroke="#1f2937" strokeWidth={1.5} />
          </>
        );
      case 'voltmeter':
        return (
          <>
            <circle cx={0} cy={0} r={12} fill="#fff" stroke="#1f2937" strokeWidth={2} />
            <text x={0} y={4} textAnchor="middle" fontSize={13} fill="#1f2937" fontWeight={700}>
              V
            </text>
          </>
        );
      case 'ammeter':
        return (
          <>
            <circle cx={0} cy={0} r={12} fill="#fff" stroke="#1f2937" strokeWidth={2} />
            <text x={0} y={4} textAnchor="middle" fontSize={13} fill="#1f2937" fontWeight={700}>
              A
            </text>
          </>
        );
      case 'ground':
        return (
          <>
            <line x1={0} y1={-10} x2={0} y2={0} stroke="#1f2937" strokeWidth={2} />
            <line x1={-10} y1={0} x2={10} y2={0} stroke="#1f2937" strokeWidth={2} />
            <line x1={-6} y1={4} x2={6} y2={4} stroke="#1f2937" strokeWidth={2} />
            <line x1={-3} y1={8} x2={3} y2={8} stroke="#1f2937" strokeWidth={2} />
          </>
        );
      case 'wire':
      default:
        return null;
    }
  })();

  const hasLabel = !!(label || value);
  const displayLabel = label
    ? value
      ? `${label} = ${value}${unit ? ' ' + unit : ''}`
      : label
    : value
    ? `${value}${unit ? ' ' + unit : ''}`
    : '';

  return (
    <g>
      {/* Wires on both sides of the symbol */}
      {half > 0 && (
        <>
          <line x1={x1} y1={y1} x2={w1x} y2={w1y} stroke="#1f2937" strokeWidth={2} />
          <line x1={w2x} y1={w2y} x2={x2} y2={y2} stroke="#1f2937" strokeWidth={2} />
        </>
      )}
      {half === 0 && (
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1f2937" strokeWidth={2} />
      )}
      {/* Symbol, rotated and centered on midpoint */}
      {symbol && (
        <g transform={`translate(${mx}, ${my}) rotate(${angle})`}>{symbol}</g>
      )}
      {hasLabel && (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          fontSize={12}
          fill="#1f2937"
          fontWeight={500}
        >
          {displayLabel}
        </text>
      )}
    </g>
  );
}

export default function CircuitRenderer({
  title,
  nodes,
  components,
  showNodes = true,
}: CircuitRendererProps) {
  const nodeMap = new Map(nodes.map((n) => [n.id, toSvg(n.x, n.y)]));

  return (
    <div className="circuit-renderer">
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

        {components.map((c, i) => {
          const from = nodeMap.get(c.from);
          const to = nodeMap.get(c.to);
          if (!from || !to) return null;
          return (
            <ComponentShape
              key={`c-${i}`}
              type={c.type}
              from={from}
              to={to}
              value={c.value}
              unit={c.unit}
              label={c.label}
            />
          );
        })}

        {showNodes &&
          nodes.map((n) => {
            const [nx, ny] = nodeMap.get(n.id)!;
            return (
              <circle
                key={`n-${n.id}`}
                cx={nx}
                cy={ny}
                r={3}
                fill="#1f2937"
              />
            );
          })}
      </svg>
    </div>
  );
}
