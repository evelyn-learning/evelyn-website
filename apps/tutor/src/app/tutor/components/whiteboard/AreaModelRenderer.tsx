'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { AreaModelFigure } from '@/lib/tutor/diagrams/catalog/kinds/area-model';

const PALETTE = ['#dbeafe', '#dcfce7', '#fef3c7', '#fee2e2', '#ede9fe', '#fce7f3'];
const STROKE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const FONT = 14;
const MAX_W = 520;   // widest the rectangle is drawn
const MAX_H = 300;   // tallest — the whole figure must sit on one board
const MIN_CELL_H = 40;

function estW(text: string, fontSize: number): number {
  return text.length * fontSize * 0.6;
}

function fmtNum(v: number): string {
  const r = Math.round(v * 1e6) / 1e6;
  const s = Math.abs(r) >= 1000 ? r.toLocaleString('en-US') : String(r);
  return s.replace(/^-/, '−');
}

/**
 * Split `total` px among parts in proportion to `values`, but never give a
 * part less than its own minimum (the room its label needs). Parts pinned
 * at their minimum are taken out and the rest re-shared, so the big parts
 * stay in proportion to each other. Returns the sizes and whether any part
 * had to be enlarged (the drawing is then no longer to scale).
 */
function fitSizes(values: number[], mins: number[], total: number): { sizes: number[]; toScale: boolean } {
  const n = values.length;
  const sumMin = mins.reduce((s, v) => s + v, 0);
  if (sumMin >= total) return { sizes: mins.slice(), toScale: n === 1 };
  const pinned = new Array<boolean>(n).fill(false);
  let sizes = new Array<number>(n).fill(0);
  for (let pass = 0; pass < n + 1; pass++) {
    const freeTotal = total - mins.reduce((s, m, i) => s + (pinned[i] ? m : 0), 0);
    const freeSum = values.reduce((s, v, i) => s + (pinned[i] ? 0 : v), 0);
    sizes = values.map((v, i) => (pinned[i] ? mins[i] : (v / freeSum) * freeTotal));
    let changed = false;
    sizes.forEach((sz, i) => {
      if (!pinned[i] && sz < mins[i]) { pinned[i] = true; changed = true; }
    });
    if (!changed) break;
  }
  return { sizes, toScale: !pinned.some(Boolean) };
}

export function AreaModelRenderer({ figure }: { figure: AreaModelFigure }) {
  const { rows, cols, cellLabels, rowLabels, colLabels, showProducts, title } = figure;
  const totalH = rows.reduce((s, v) => s + v, 0);
  const totalW = cols.reduce((s, v) => s + v, 0);

  // Headers. With explicit cell labels over all-1 placeholder sides (an
  // algebra model such as (x + 2)(x + 3)) the numeric "1" headers would be
  // false, so they are left off unless header text is supplied.
  const placeholders = !!cellLabels && rows.every((v) => v === 1) && cols.every((v) => v === 1);
  const colHead = cols.map((c, j) => colLabels?.[j] ?? (placeholders ? '' : fmtNum(c)));
  const rowHead = rows.map((r, i) => rowLabels?.[i] ?? (placeholders ? '' : fmtNum(r)));
  const hasColHead = colHead.some(Boolean);
  const hasRowHead = rowHead.some(Boolean);

  const cellText = (i: number, j: number): string => {
    const o = cellLabels?.[i]?.[j];
    if (o !== undefined && o !== '') return o;
    return showProducts ? fmtNum(rows[i] * cols[j]) : `${fmtNum(rows[i])} × ${fmtNum(cols[j])}`;
  };

  // Each column is at least as wide as its widest label (cell or header).
  const colMin = cols.map((_, j) =>
    Math.max(44, estW(colHead[j], FONT) + 14, ...rows.map((__, i) => estW(cellText(i, j), FONT) + 18)));
  const rowMin = rows.map(() => MIN_CELL_H);

  // The rectangle keeps its true shape, as large as the board allows; it is
  // stretched only when a side would otherwise be too small for its labels.
  const sumColMin = colMin.reduce((s, v) => s + v, 0);
  const sumRowMin = rowMin.reduce((s, v) => s + v, 0);
  const scale = Math.min(MAX_W / totalW, MAX_H / totalH);
  const idealW = totalW * scale;
  const idealH = totalH * scale;
  const rectW = Math.max(idealW, sumColMin, 160);
  const rectH = Math.max(idealH, sumRowMin, 90);
  const cw = fitSizes(cols, colMin, rectW);
  const rh = fitSizes(rows, rowMin, rectH);
  // To scale only if neither side was distorted AND the aspect is the true one.
  const aspectTrue = Math.abs(rectH - idealH) < 1 && Math.abs(rectW - idealW) < 1;
  const toScale = cw.toScale && rh.toScale && aspectTrue;

  const leftPad = hasRowHead ? Math.max(40, ...rowHead.map((t) => estW(t, FONT) + 20)) : 16;
  const topPad = hasColHead ? 30 : 10;
  const W = leftPad + rectW + 16;
  const H = topPad + rectH + (toScale ? 10 : 26);

  const xs: number[] = [];
  let acc = leftPad;
  for (const w of cw.sizes) { xs.push(acc); acc += w; }
  const ys: number[] = [];
  acc = topPad;
  for (const h of rh.sizes) { ys.push(acc); acc += h; }

  return (
    <div className="area-model-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: Math.min(640, W * 1.15) }}>
        {/* Column headers along the top */}
        {colHead.map((t, j) => t && (
          <text key={`ch-${j}`} x={xs[j] + cw.sizes[j] / 2} y={topPad - 10} fontSize={FONT} textAnchor="middle" fill="#374151" fontWeight={600}>
            {t}
          </text>
        ))}
        {rows.map((_, i) => (
          <g key={i}>
            {rowHead[i] && (
              <text x={leftPad - 10} y={ys[i] + rh.sizes[i] / 2 + 5} fontSize={FONT} textAnchor="end" fill="#374151" fontWeight={600}>
                {rowHead[i]}
              </text>
            )}
            {cols.map((__, j) => {
              const k = (i * cols.length + j) % PALETTE.length;
              return (
                <g key={`cell-${i}-${j}`}>
                  <rect x={xs[j]} y={ys[i]} width={cw.sizes[j]} height={rh.sizes[i]} fill={PALETTE[k]} stroke={STROKE[k]} strokeWidth={1.5} />
                  <text x={xs[j] + cw.sizes[j] / 2} y={ys[i] + rh.sizes[i] / 2 + 5} fontSize={FONT} textAnchor="middle" fill="#1f2937" fontWeight={600}>
                    {cellText(i, j)}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
        {/* Outer frame, so the whole reads as one rectangle */}
        <rect x={leftPad} y={topPad} width={rectW} height={rectH} fill="none" stroke="#334155" strokeWidth={2} />
        {!toScale && (
          <text x={leftPad + rectW} y={topPad + rectH + 17} fontSize={11} textAnchor="end" fill="#6b7280" fontStyle="italic">
            not drawn to scale
          </text>
        )}
      </svg>
    </div>
  );
}
