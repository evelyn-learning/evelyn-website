'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import {
  businessCycleFeatureNames,
  type BusinessCycleFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/economics';

const COLOR_TREND = '#9ca3af';
const COLOR_CYCLE = '#1f2937';
const COLOR_GAP_POS = '#86efac';
const COLOR_GAP_NEG = '#fca5a5';
const COLOR_LABEL = '#374151';
const COLOR_MARKER = '#dc2626';

export function BusinessCycleRenderer({ figure }: { figure: BusinessCycleFigure }) {
  const { cycles, amplitude, trendSlope, showTrend, showOutputGap, labels, markers, title } = figure;
  const N = businessCycleFeatureNames;
  const W = 640;
  const H = 360;
  const PAD_L = 60;
  const PAD_R = 24;
  const PAD_T = 36;
  const PAD_B = 56;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const xAt = (t: number) => PAD_L + t * plotW;
  const trendAt = (t: number) => 0.5 + (t - 0.5) * (trendSlope * 0.5);
  const cycleAt = (t: number) => trendAt(t) + amplitude * Math.sin(t * cycles * 2 * Math.PI - Math.PI / 2);
  const yAt = (v: number) => PAD_T + plotH - v * plotH;

  const segments = 200;
  const cyclePath: string[] = [];
  const trendPath: string[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    cyclePath.push(`${i === 0 ? 'M' : 'L'} ${xAt(t).toFixed(2)} ${yAt(cycleAt(t)).toFixed(2)}`);
    trendPath.push(`${i === 0 ? 'M' : 'L'} ${xAt(t).toFixed(2)} ${yAt(trendAt(t)).toFixed(2)}`);
  }

  // Markers are populated by the solver (auto-detected if brain didn't
  // pass them). Renderer just renders what the figure carries.
  const drawnMarkers = markers ?? [];

  return (
    <div
      className="business-cycle-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'business cycle'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[680px]">
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke="#1f2937" strokeWidth={1.5} />
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke="#1f2937" strokeWidth={1.5} />

        {showOutputGap &&
          Array.from({ length: segments }).map((_, i) => {
            const t = i / segments;
            const tNext = (i + 1) / segments;
            const yc = yAt(cycleAt(t));
            const yt = yAt(trendAt(t));
            const ycN = yAt(cycleAt(tNext));
            const ytN = yAt(trendAt(tNext));
            const isAbove = cycleAt(t) > trendAt(t);
            return (
              <polygon
                key={`gap-${i}`}
                points={`${xAt(t).toFixed(2)},${yc.toFixed(2)} ${xAt(tNext).toFixed(2)},${ycN.toFixed(2)} ${xAt(tNext).toFixed(2)},${ytN.toFixed(2)} ${xAt(t).toFixed(2)},${yt.toFixed(2)}`}
                fill={isAbove ? COLOR_GAP_POS : COLOR_GAP_NEG}
                opacity={0.55}
              />
            );
          })}

        {showTrend && (
          <g
            data-feature={N.trend}
            data-feature-label="trend"
            data-feature-cx={xAt(0.5) / W}
            data-feature-cy={yAt(trendAt(0.5)) / H}
            data-feature-w={plotW / W}
            data-feature-h={20 / H}
          >
            <path d={trendPath.join(' ')} stroke={COLOR_TREND} strokeWidth={2} fill="none" strokeDasharray="6 4" />
            {labels !== 'none' && (
              <text x={xAt(0.96)} y={yAt(trendAt(0.96)) - 6} fontSize={11} fill={COLOR_TREND} textAnchor="end" fontStyle="italic">
                Long-run trend
              </text>
            )}
          </g>
        )}

        <g
          data-feature={N.cycle}
          data-feature-label="cycle"
          data-feature-cx={xAt(0.5) / W}
          data-feature-cy={(PAD_T + plotH / 2) / H}
          data-feature-w={plotW / W}
          data-feature-h={plotH / H}
        >
          <path d={cyclePath.join(' ')} stroke={COLOR_CYCLE} strokeWidth={2.5} fill="none" />
        </g>

        {drawnMarkers && drawnMarkers.map((m, i) => {
          const x = xAt(m.t);
          const yc = yAt(cycleAt(m.t));
          // Clamp the centered label into the viewBox (2026-08-07 clip
          // audit): markers at t≈0/1 centered their label half off-canvas.
          const half = (m.label.length * 11 * 0.55) / 2;
          const labelX = Math.max(2 + half, Math.min(x, W - 2 - half));
          return (
            <g
              key={`mk-${i}`}
              data-feature={N.marker(m.label, i)}
              data-feature-label={m.label}
              data-feature-cx={x / W}
              data-feature-cy={yc / H}
              data-feature-w={50 / W}
              data-feature-h={32 / H}
            >
              {(m.showLine ?? true) && (
                <line x1={x} y1={yc} x2={x} y2={PAD_T + plotH + 4} stroke={COLOR_MARKER} strokeDasharray="3 3" strokeWidth={1} />
              )}
              <circle cx={x} cy={yc} r={4} fill={COLOR_MARKER} />
              <text x={labelX} y={yc - 10} fontSize={11} fontWeight={600} fill={COLOR_MARKER} textAnchor="middle">
                {m.label}
              </text>
            </g>
          );
        })}

        <text x={PAD_L + plotW / 2} y={H - 16} fontSize={13} fontWeight={600} textAnchor="middle" fill={COLOR_LABEL}>
          Time
        </text>
        <text
          x={20}
          y={PAD_T + plotH / 2}
          fontSize={13}
          fontWeight={600}
          textAnchor="middle"
          fill={COLOR_LABEL}
          transform={`rotate(-90 20 ${PAD_T + plotH / 2})`}
        >
          Real GDP
        </text>
      </svg>
    </div>
  );
}
