'use client';

import React from 'react';
import {
  riemannSumFeatureNames,
  type RiemannSumFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/math-calculus';
import { smoothPath } from './_smoothPath';

const COLOR_AXIS = '#1f2937';
const COLOR_CURVE = '#2563eb';
const COLOR_RECT_FILL = '#93c5fd';
const COLOR_RECT_STROKE = '#1d4ed8';
const COLOR_TRAP_FILL = '#fde68a';
const COLOR_TRAP_STROKE = '#b45309';

export function RiemannSumRenderer({ figure }: { figure: RiemannSumFigure }) {
  const { curve, rectangles, xMin, xMax, yMin, yMax, method, n, exprLabel, approxArea, exactArea, title } = figure;
  const N = riemannSumFeatureNames;

  const W = 560;
  const H = 380;
  const PAD_L = 60;
  const PAD_R = 24;
  const PAD_T = 32;
  const PAD_B = 50;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const xAt = (x: number) => PAD_L + ((x - xMin) / (xMax - xMin)) * plotW;
  const yAt = (y: number) => PAD_T + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const yZero = yAt(0);
  const useTrapezoid = method === 'trapezoidal';

  const curvePath = smoothPath(curve, xAt, yAt);

  const xTicks: number[] = [];
  const xStep = (xMax - xMin) / 4;
  for (let i = 0; i <= 4; i += 1) xTicks.push(xMin + xStep * i);
  const yTicks: number[] = [];
  const yStep = (yMax - yMin) / 4;
  for (let i = 0; i <= 4; i += 1) yTicks.push(yMin + yStep * i);

  // Bbox helper for the collective "rectangles" region.
  const rectMinX = rectangles.length ? Math.min(...rectangles.map((r) => xAt(r.x))) : PAD_L;
  const rectMaxX = rectangles.length ? Math.max(...rectangles.map((r) => xAt(r.x + r.width))) : PAD_L + plotW;
  const rectMinY = rectangles.length ? Math.min(...rectangles.map((r) => yAt(Math.max(0, r.height)))) : PAD_T;
  const rectMaxY = yZero;
  return (
    <div
      className="riemann-sum-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'Riemann sum'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {/* gridlines */}
        {xTicks.map((tx, i) => (
          <line key={`gx-${i}`} x1={xAt(tx)} y1={PAD_T} x2={xAt(tx)} y2={PAD_T + plotH} stroke="#e5e7eb" strokeWidth={1} />
        ))}
        {yTicks.map((ty, i) => (
          <line key={`gy-${i}`} x1={PAD_L} y1={yAt(ty)} x2={PAD_L + plotW} y2={yAt(ty)} stroke="#e5e7eb" strokeWidth={1} />
        ))}

        {/* rectangles (or trapezoids) — wrapped in a feature group so
            scribbling "rectangles" lands on the collective. */}
        <g
          data-feature={N.rectangles}
          data-feature-label={`${method} rectangles`}
          data-feature-cx={((rectMinX + rectMaxX) / 2) / W}
          data-feature-cy={((rectMinY + rectMaxY) / 2) / H}
          data-feature-w={Math.max(40, rectMaxX - rectMinX) / W}
          data-feature-h={Math.max(40, rectMaxY - rectMinY) / H}
        >
          {rectangles.map((r, i) => {
            if (useTrapezoid) {
              const xL = xAt(r.x);
              const xR = xAt(r.x + r.width);
              const heightLeft = (r as RiemannSumFigure['rectangles'][number] & { heightLeft?: number }).heightLeft;
              const yL = isFinite(heightLeft as number) ? yAt(heightLeft as number) : yAt(r.height);
              const yR = yAt(r.height);
              const yB = yZero;
              const points = `${xL},${yB} ${xL},${yL} ${xR},${yR} ${xR},${yB}`;
              return (
                <polygon
                  key={i}
                  points={points}
                  fill={COLOR_TRAP_FILL} fillOpacity={0.6} stroke={COLOR_TRAP_STROKE} strokeWidth={1.2}
                  data-feature={N.rectangle(i)}
                  data-feature-label={`rectangle ${i + 1}`}
                  data-feature-cx={((xL + xR) / 2) / W}
                  data-feature-cy={((Math.min(yL, yR) + yB) / 2) / H}
                  data-feature-w={Math.abs(xR - xL) / W}
                  data-feature-h={Math.abs(yB - Math.min(yL, yR)) / H}
                />
              );
            }
            const xL = xAt(r.x);
            const xR = xAt(r.x + r.width);
            const yTop = yAt(Math.max(0, r.height));
            const yBot = yAt(Math.min(0, r.height));
            const rx = Math.min(xL, xR);
            const ry = Math.min(yTop, yBot);
            const rw = Math.abs(xR - xL);
            const rh = Math.abs(yBot - yTop);
            return (
              <rect
                key={i}
                x={rx} y={ry} width={rw} height={rh}
                fill={COLOR_RECT_FILL} fillOpacity={0.55} stroke={COLOR_RECT_STROKE} strokeWidth={1.2}
                data-feature={N.rectangle(i)}
                data-feature-label={`rectangle ${i + 1}`}
                data-feature-cx={(rx + rw / 2) / W}
                data-feature-cy={(ry + rh / 2) / H}
                data-feature-w={rw / W}
                data-feature-h={rh / H}
              />
            );
          })}
        </g>

        {/* curve */}
        <path
          d={curvePath}
          fill="none" stroke={COLOR_CURVE} strokeWidth={2.5}
          data-feature={N.curve}
          data-feature-label={exprLabel || 'f(x)'}
          data-feature-cx={0.5}
          data-feature-cy={((PAD_T + plotH / 3)) / H}
          data-feature-w={plotW / W}
          data-feature-h={20 / H}
        />

        {/* axes (drawn over rects) */}
        {yMin <= 0 && yMax >= 0 && (
          <line x1={PAD_L} y1={yZero} x2={PAD_L + plotW} y2={yZero} stroke={COLOR_AXIS} strokeWidth={1.5} />
        )}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />

        {/* ticks */}
        {xTicks.map((tx, i) => (
          <g key={`tx-${i}`}>
            <line x1={xAt(tx)} y1={PAD_T + plotH} x2={xAt(tx)} y2={PAD_T + plotH + 4} stroke={COLOR_AXIS} strokeWidth={1} />
            <text x={xAt(tx)} y={PAD_T + plotH + 16} fontSize={11} textAnchor="middle" fill="#374151">
              {Number(tx.toFixed(2))}
            </text>
          </g>
        ))}
        {yTicks.map((ty, i) => (
          <g key={`ty-${i}`}>
            <line x1={PAD_L - 4} y1={yAt(ty)} x2={PAD_L} y2={yAt(ty)} stroke={COLOR_AXIS} strokeWidth={1} />
            <text x={PAD_L - 6} y={yAt(ty) + 4} fontSize={11} textAnchor="end" fill="#374151">
              {Number(ty.toFixed(2))}
            </text>
          </g>
        ))}

        {/* labels */}
        {exprLabel && (
          <text
            x={PAD_L + 8} y={PAD_T + 14}
            fontSize={13} fontWeight={600} fill={COLOR_CURVE}
            data-feature={N.exprLabel}
            data-feature-label={exprLabel}
            data-feature-cx={(PAD_L + 60) / W}
            data-feature-cy={(PAD_T + 12) / H}
            data-feature-w={120 / W}
            data-feature-h={18 / H}
          >
            {exprLabel}
          </text>
        )}
        <text x={PAD_L + plotW / 2} y={H - 8} fontSize={12} fontWeight={600} textAnchor="middle" fill="#374151">x</text>
        <text x={16} y={PAD_T + plotH / 2} fontSize={12} fontWeight={600} textAnchor="middle" fill="#374151" transform={`rotate(-90 16 ${PAD_T + plotH / 2})`}>y</text>

        {/* method + areas */}
        <text x={W - PAD_R - 4} y={PAD_T + 14} fontSize={11} textAnchor="end" fill="#374151" fontStyle="italic">
          {method} sum, n = {n}
        </text>
        {(approxArea !== undefined || exactArea !== undefined) && (
          <text x={W - PAD_R - 4} y={PAD_T + 30} fontSize={11} textAnchor="end" fill="#374151">
            {approxArea !== undefined && <tspan>≈ {Number(approxArea.toFixed(4))}</tspan>}
            {approxArea !== undefined && exactArea !== undefined && <tspan>  </tspan>}
            {exactArea !== undefined && <tspan fill="#16a34a">exact = {Number(exactArea.toFixed(4))}</tspan>}
          </text>
        )}
      </svg>
    </div>
  );
}
