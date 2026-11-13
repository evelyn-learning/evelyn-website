'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import {
  histogramFeatureNames,
  type HistogramFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/math-statistics';

const COLOR_AXIS = '#1f2937';
const COLOR_BAR_FILL = '#93c5fd';
const COLOR_BAR_STROKE = '#1d4ed8';
const COLOR_MEAN = '#dc2626';
const COLOR_MEDIAN = '#16a34a';

export function HistogramRenderer({ figure }: { figure: HistogramFigure }) {
  const { bins, xMin, xMax, yMax: yMaxIn, xLabel, yLabel, title, showCounts, mean, median, mode } = figure;
  const N = histogramFeatureNames;

  const W = 560;
  const H = 392;
  const PAD_L = 60;
  const PAD_R = 24;
  const PAD_T = 44;
  const PAD_B = 56;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  // The axis ends on a round tick at or above the tallest bar, so the top gridline carries a number.
  const yStep = niceStep(yMaxIn / 5);
  const yMax = Math.ceil(yMaxIn / yStep - 1e-9) * yStep;
  const yTicks: number[] = [];
  for (let k = 0; k * yStep <= yMax + yStep * 1e-6; k += 1) yTicks.push(Number((k * yStep).toFixed(10)));

  const xAt = (x: number) => PAD_L + ((x - xMin) / (xMax - xMin)) * plotW;
  const yAt = (y: number) => PAD_T + plotH - (y / yMax) * plotH;
  const labelW = (t: string, size: number) => t.length * size * 0.58;

  // Count labels above the bars. A label wider than its bar may still be drawn, but never on top
  // of a label already placed (thin neighbouring bars of like height would print over each other).
  const countLabels: { i: number; x: number; y: number; text: string }[] = [];
  if (showCounts) {
    const placed: { l: number; r: number; t: number; b: number }[] = [];
    const order = bins.map((b, i) => ({ b, i })).filter(({ b }) => b.count > 0).sort((p, q) => q.b.count - p.b.count);
    for (const { b, i } of order) {
      const text = mode === 'relative' ? String(Number(b.count.toFixed(3))) : String(b.count);
      const cxm = (xAt(b.lower) + xAt(b.upper)) / 2;
      const w = labelW(text, 11);
      const box = { l: cxm - w / 2 - 2, r: cxm + w / 2 + 2, t: yAt(b.count) - 16, b: yAt(b.count) - 2 };
      if (placed.some((p) => box.l < p.r && box.r > p.l && box.t < p.b && box.b > p.t)) continue;
      placed.push(box);
      countLabels.push({ i, x: cxm, y: yAt(b.count) - 5, text });
    }
  }

  // Tick labels at the bin edges; where edges crowd, every edge keeps its tick mark but only the
  // labels that have room are printed.
  const edges = Array.from(new Set(bins.flatMap((b) => [b.lower, b.upper]))).sort((a, b) => a - b);
  const edgeLabelled = new Set<number>();
  {
    let lastRight = -Infinity;
    for (const e of edges) {
      const w = labelW(String(Number(e.toFixed(2))), 10);
      const cxm = xAt(e);
      if (cxm - w / 2 >= lastRight + 5) { edgeLabelled.add(e); lastRight = cxm + w / 2; }
    }
  }

  return (
    <div
      className="histogram-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'histogram'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {/* horizontal gridlines */}
        {yTicks.map((ty, i) => (
          <line key={`gy-${i}`} x1={PAD_L} y1={yAt(ty)} x2={PAD_L + plotW} y2={yAt(ty)} stroke="#e5e7eb" strokeWidth={1} />
        ))}

        {/* bars (touching) — wrapped so "bars" collective resolves. */}
        <g
          data-feature={N.bars}
          data-feature-label="bars"
          data-feature-cx={(PAD_L + plotW / 2) / W}
          data-feature-cy={(PAD_T + plotH / 2) / H}
          data-feature-w={plotW / W}
          data-feature-h={plotH / H}
        >
          {bins.map((b, i) => {
            const x1 = xAt(b.lower);
            const x2 = xAt(b.upper);
            const y1 = yAt(b.count);
            const yBottom = yAt(0);
            const bw = Math.max(1, x2 - x1);
            const bh = Math.max(0, yBottom - y1);
            return (
              <g
                key={i}
                data-feature={N.bin(i)}
                data-feature-label={`bin [${b.lower}, ${b.upper})`}
                data-feature-cx={(x1 + bw / 2) / W}
                data-feature-cy={(y1 + bh / 2) / H}
                data-feature-w={bw / W}
                data-feature-h={Math.max(bh, 20) / H}
              >
                <rect
                  x={x1} y={y1}
                  width={bw} height={bh}
                  fill={COLOR_BAR_FILL} fillOpacity={0.7} stroke={COLOR_BAR_STROKE} strokeWidth={1.2}
                />
              </g>
            );
          })}
        </g>

        {/* mean / median markers. Their labels sit above the plot, clear of the bars and the
            counts; when the two lines are close the labels open outwards from the pair. */}
        {(() => {
          const meanX = mean !== undefined && mean >= xMin && mean <= xMax ? xAt(mean) : null;
          const medianX = median !== undefined && median >= xMin && median <= xMax ? xAt(median) : null;
          const meanText = mean !== undefined ? `mean = ${Number(mean.toFixed(2))}` : '';
          const medianText = median !== undefined ? `median = ${Number(median.toFixed(2))}` : '';
          const mw = labelW(meanText, 11), dw = labelW(medianText, 11);
          const clampX = (x: number, w: number) => Math.min(Math.max(x, PAD_L + w / 2), PAD_L + plotW - w / 2);
          let meanLX = meanX !== null ? clampX(meanX, mw) : 0;
          let medianLX = medianX !== null ? clampX(medianX, dw) : 0;
          let meanLY = PAD_T - 8, medianLY = PAD_T - 8;
          if (meanX !== null && medianX !== null && Math.abs(meanLX - medianLX) < (mw + dw) / 2 + 10) {
            const meanLeft = (mean as number) <= (median as number);
            const mid = (meanX + medianX) / 2;
            const leftW = meanLeft ? mw : dw, rightW = meanLeft ? dw : mw;
            let leftC = mid - 5 - leftW / 2, rightC = mid + 5 + rightW / 2;
            if (leftC - leftW / 2 < PAD_L || rightC + rightW / 2 > PAD_L + plotW) {
              // no room side by side at this spot: stack them
              leftC = clampX(mid, leftW); rightC = clampX(mid, rightW);
              if (meanLeft) { meanLY = PAD_T - 22; } else { medianLY = PAD_T - 22; }
            }
            if (meanLeft) { meanLX = leftC; medianLX = rightC; } else { medianLX = leftC; meanLX = rightC; }
          }
          return (
            <>
              {meanX !== null && (
                <g
                  data-feature={N.mean}
                  data-feature-label={`mean = ${mean}`}
                  data-feature-cx={meanX / W}
                  data-feature-cy={(PAD_T + plotH / 2) / H}
                  data-feature-w={28 / W}
                  data-feature-h={plotH / H}
                >
                  <line x1={meanX} y1={PAD_T - 3} x2={meanX} y2={PAD_T + plotH} stroke={COLOR_MEAN} strokeWidth={2} strokeDasharray="6 4" />
                  <text x={meanLX} y={meanLY} fontSize={11} fill={COLOR_MEAN} fontWeight={600} textAnchor="middle">{meanText}</text>
                </g>
              )}
              {medianX !== null && (
                <g
                  data-feature={N.median}
                  data-feature-label={`median = ${median}`}
                  data-feature-cx={medianX / W}
                  data-feature-cy={(PAD_T + plotH / 2) / H}
                  data-feature-w={28 / W}
                  data-feature-h={plotH / H}
                >
                  <line x1={medianX} y1={PAD_T - 3} x2={medianX} y2={PAD_T + plotH} stroke={COLOR_MEDIAN} strokeWidth={2} strokeDasharray="2 3" />
                  <text x={medianLX} y={medianLY} fontSize={11} fill="#15803d" fontWeight={600} textAnchor="middle">{medianText}</text>
                </g>
              )}
            </>
          );
        })()}

        {/* counts, over the marker lines so a line never strikes a number through */}
        {countLabels.map((c) => (
          <text key={`cnt-${c.i}`} x={c.x} y={c.y} fontSize={11} textAnchor="middle" fill={COLOR_BAR_STROKE} fontWeight={600} stroke="#fff" strokeWidth={3} paintOrder="stroke">
            {c.text}
          </text>
        ))}

        {/* axes */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />

        {/* x-axis tick labels at bin edges (use distinct edges to avoid clutter) */}
        {edges.map((tx, i) => (
          <g key={`tx-${i}`}>
            <line x1={xAt(tx)} y1={PAD_T + plotH} x2={xAt(tx)} y2={PAD_T + plotH + (edgeLabelled.has(tx) ? 5 : 3)} stroke={COLOR_AXIS} strokeWidth={1} />
            {edgeLabelled.has(tx) && (
              <text x={xAt(tx)} y={PAD_T + plotH + 17} fontSize={10} textAnchor="middle" fill="#374151">
                {Number(tx.toFixed(2))}
              </text>
            )}
          </g>
        ))}
        {/* y-axis tick labels */}
        {yTicks.map((ty, i) => (
          <g key={`ty-${i}`}>
            <line x1={PAD_L - 4} y1={yAt(ty)} x2={PAD_L} y2={yAt(ty)} stroke={COLOR_AXIS} strokeWidth={1} />
            <text x={PAD_L - 6} y={yAt(ty) + 4} fontSize={11} textAnchor="end" fill="#374151">
              {Number(ty.toFixed(4))}
            </text>
          </g>
        ))}

        {/* axis titles */}
        {xLabel && (
          <text x={PAD_L + plotW / 2} y={H - 14} fontSize={12} fontWeight={600} textAnchor="middle" fill="#374151">
            {xLabel}
          </text>
        )}
        <text
          x={16}
          y={PAD_T + plotH / 2}
          fontSize={12}
          fontWeight={600}
          textAnchor="middle"
          fill="#374151"
          transform={`rotate(-90 16 ${PAD_T + plotH / 2})`}
        >
          {yLabel}
        </text>
      </svg>
    </div>
  );
}

function niceStep(raw: number): number {
  if (raw <= 0) return 1;
  const exp = Math.floor(Math.log10(raw));
  const base = Math.pow(10, exp);
  const norm = raw / base;
  let step: number;
  if (norm < 1.5) step = 1;
  else if (norm < 3.5) step = 2;
  else if (norm < 7.5) step = 5;
  else step = 10;
  return step * base;
}
