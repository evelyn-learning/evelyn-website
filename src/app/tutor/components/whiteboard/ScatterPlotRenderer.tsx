'use client';

/**
 * Scatter Plot Renderer
 *
 * Labeled data points on an x-y plane with optional linear regression line
 * (least-squares) and R². Designed for stats/data-analysis lessons.
 */

import React from 'react';
import { DIAGRAM_COLORS, cycleColor } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, formatValue } from '@/lib/tutor/diagrams/layout';

export interface ScatterPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
  series?: string;
}

export interface ScatterPlotProps {
  title?: string;
  xLabel?: string;
  yLabel?: string;
  points: ScatterPoint[];
  xRange?: [number, number];
  yRange?: [number, number];
  /** If true, compute + draw the least-squares regression line and R². */
  showTrendLine?: boolean;
  /** Override the trend line equation to display (e.g. when taught by hand). */
  trendLineEquation?: string;
  notes?: string;
}

const VIEWBOX_W = DIAGRAM_VIEWBOX.width;
const VIEWBOX_H = DIAGRAM_VIEWBOX.height;

function linearRegression(pts: ScatterPoint[]): { m: number; b: number; r2: number } | null {
  const n = pts.length;
  if (n < 2) return null;
  let sx = 0, sy = 0, sxx = 0, sxy = 0, syy = 0;
  for (const p of pts) {
    sx += p.x; sy += p.y; sxx += p.x * p.x; sxy += p.x * p.y; syy += p.y * p.y;
  }
  const denom = n * sxx - sx * sx;
  if (Math.abs(denom) < 1e-12) return null;
  const m = (n * sxy - sx * sy) / denom;
  const b = (sy - m * sx) / n;
  const meanY = sy / n;
  let ssRes = 0, ssTot = 0;
  for (const p of pts) {
    const yhat = m * p.x + b;
    ssRes += (p.y - yhat) ** 2;
    ssTot += (p.y - meanY) ** 2;
  }
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
  return { m, b, r2 };
}

export default function ScatterPlotRenderer({
  title, xLabel = 'x', yLabel = 'y',
  points, xRange, yRange, showTrendLine, trendLineEquation, notes,
}: ScatterPlotProps) {
  const pad = { top: title ? 36 : 20, bottom: notes ? 40 : 32, left: 44, right: 16 };
  const plotW = VIEWBOX_W - pad.left - pad.right;
  const plotH = VIEWBOX_H - pad.top - pad.bottom;

  if (!points || points.length === 0) {
    return <div style={{ padding: 24, color: DIAGRAM_COLORS.muted, fontStyle: 'italic' }}>No scatter data.</div>;
  }

  // Auto-range with 10% padding.
  const xs = points.map((p) => p.x); const ys = points.map((p) => p.y);
  const xMinD = Math.min(...xs); const xMaxD = Math.max(...xs);
  const yMinD = Math.min(...ys); const yMaxD = Math.max(...ys);
  const xSpan = Math.max(1, xMaxD - xMinD); const ySpan = Math.max(1, yMaxD - yMinD);
  const [xMin, xMax] = xRange ?? [xMinD - 0.1 * xSpan, xMaxD + 0.1 * xSpan];
  const [yMin, yMax] = yRange ?? [yMinD - 0.1 * ySpan, yMaxD + 0.1 * ySpan];

  const sx = (x: number) => pad.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const sy = (y: number) => pad.top + ((yMax - y) / (yMax - yMin)) * plotH;

  const nTicks = 5;
  const xTickStep = (xMax - xMin) / nTicks;
  const yTickStep = (yMax - yMin) / nTicks;
  const xTicks = Array.from({ length: nTicks + 1 }, (_, i) => xMin + i * xTickStep);
  const yTicks = Array.from({ length: nTicks + 1 }, (_, i) => yMin + i * yTickStep);

  const reg = showTrendLine ? linearRegression(points) : null;

  // Series legend (group points by series)
  const seriesMap = new Map<string, string>();
  points.forEach((p, i) => {
    const key = p.series || '__default__';
    if (!seriesMap.has(key)) seriesMap.set(key, p.color || cycleColor(seriesMap.size));
  });
  const showLegend = seriesMap.size > 1 || (seriesMap.size === 1 && !seriesMap.has('__default__'));

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 6, color: DIAGRAM_COLORS.text }}>{title}</div>
      )}
      <svg viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        {/* Gridlines */}
        {xTicks.map((t, i) => (
          <line key={`gx${i}`} x1={sx(t)} y1={pad.top} x2={sx(t)} y2={pad.top + plotH} stroke={DIAGRAM_COLORS.grid} strokeWidth={0.5} />
        ))}
        {yTicks.map((t, i) => (
          <line key={`gy${i}`} x1={pad.left} y1={sy(t)} x2={pad.left + plotW} y2={sy(t)} stroke={DIAGRAM_COLORS.grid} strokeWidth={0.5} />
        ))}

        {/* Axes */}
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + plotH} stroke={DIAGRAM_COLORS.axis} strokeWidth={1.25} />
        <line x1={pad.left} y1={pad.top + plotH} x2={pad.left + plotW} y2={pad.top + plotH} stroke={DIAGRAM_COLORS.axis} strokeWidth={1.25} />

        {/* Tick labels */}
        {xTicks.map((t, i) => (
          <text key={`xl${i}`} x={sx(t)} y={pad.top + plotH + 14} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="middle">{formatValue(t)}</text>
        ))}
        {yTicks.map((t, i) => (
          <text key={`yl${i}`} x={pad.left - 6} y={sy(t) + 3} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="end">{formatValue(t)}</text>
        ))}

        {/* Axis titles */}
        <text x={pad.left + plotW / 2} y={VIEWBOX_H - (notes ? 18 : 8)} fontSize={11} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}>{xLabel}</text>
        <text x={12} y={pad.top + plotH / 2} fontSize={11} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600} transform={`rotate(-90 12 ${pad.top + plotH / 2})`}>{yLabel}</text>

        {/* Trend line */}
        {reg && (
          <g>
            <line x1={sx(xMin)} y1={sy(reg.m * xMin + reg.b)} x2={sx(xMax)} y2={sy(reg.m * xMax + reg.b)}
              stroke={DIAGRAM_COLORS.primary} strokeWidth={1.75} strokeDasharray="6 4" />
            <text x={pad.left + plotW - 6} y={pad.top + 14} fontSize={11} fill={DIAGRAM_COLORS.primary} textAnchor="end" fontWeight={600}>
              {trendLineEquation ?? `y = ${formatValue(reg.m)}x ${reg.b >= 0 ? '+' : '−'} ${formatValue(Math.abs(reg.b))}`}
            </text>
            <text x={pad.left + plotW - 6} y={pad.top + 28} fontSize={10} fill={DIAGRAM_COLORS.primary} textAnchor="end">
              R² = {formatValue(reg.r2)}
            </text>
          </g>
        )}

        {/* Points */}
        {points.map((p, i) => {
          const key = p.series || '__default__';
          const color = p.color || seriesMap.get(key) || DIAGRAM_COLORS.secondary;
          return (
            <g key={`pt${i}`}>
              <circle cx={sx(p.x)} cy={sy(p.y)} r={3.5} fill={color} stroke="white" strokeWidth={1} />
              {p.label && (
                <text x={sx(p.x) + 5} y={sy(p.y) - 5} fontSize={9} fill={DIAGRAM_COLORS.muted}>{p.label}</text>
              )}
            </g>
          );
        })}

        {/* Legend */}
        {showLegend && (
          <g transform={`translate(${pad.left + 6}, ${pad.top + 6})`}>
            {Array.from(seriesMap.entries()).map(([name, color], i) => (
              <g key={name} transform={`translate(0, ${i * 14})`}>
                <circle cx={5} cy={5} r={4} fill={color} />
                <text x={14} y={9} fontSize={10} fill={DIAGRAM_COLORS.text}>{name === '__default__' ? '' : name}</text>
              </g>
            ))}
          </g>
        )}

        {notes && (
          <text x={VIEWBOX_W / 2} y={VIEWBOX_H - 4} fontSize={10} fill={DIAGRAM_COLORS.muted} textAnchor="middle" fontStyle="italic">{notes}</text>
        )}
      </svg>
    </div>
  );
}
