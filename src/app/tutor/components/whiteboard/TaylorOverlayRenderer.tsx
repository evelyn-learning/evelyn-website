'use client';

import React from 'react';
import {
  taylorPolynomialFeatureNames,
  type TaylorPolynomialOverlayFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/math-calculus';
import { smoothPath } from './_smoothPath';

const COLOR_AXIS = '#1f2937';
const COLOR_BASE = '#1f2937';
const COLOR_CENTER = '#dc2626';
const APPROX_PALETTE = ['#2563eb', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#be185d'];

export function TaylorOverlayRenderer({ figure }: { figure: TaylorPolynomialOverlayFigure }) {
  const { baseCurve, approximations, xMin, xMax, yMin, yMax, center, exprLabel, title } = figure;
  const N = taylorPolynomialFeatureNames;

  const W = 560;
  const H = 420;
  const PAD_L = 56;
  const PAD_R = 24;
  const PAD_T = 32;
  const PAD_B = 56;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const xAt = (x: number) => PAD_L + ((x - xMin) / (xMax - xMin)) * plotW;
  const yAt = (y: number) => PAD_T + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const xTicks: number[] = [];
  const xStep = (xMax - xMin) / 4;
  for (let i = 0; i <= 4; i += 1) xTicks.push(xMin + xStep * i);
  const yTicks: number[] = [];
  const yStep = (yMax - yMin) / 4;
  for (let i = 0; i <= 4; i += 1) yTicks.push(yMin + yStep * i);

  function clamp(p: { x: number; y: number }): { x: number; y: number } {
    return {
      x: Math.max(xMin, Math.min(xMax, p.x)),
      y: Math.max(yMin - (yMax - yMin) * 0.5, Math.min(yMax + (yMax - yMin) * 0.5, p.y)),
    };
  }
  function pathFor(curve: { x: number; y: number }[]): string {
    return smoothPath(curve.map(clamp), xAt, yAt);
  }

  const basePath = pathFor(baseCurve);

  return (
    <div
      className="taylor-overlay-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'Taylor overlay'}
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
        {/* clip box */}
        <defs>
          <clipPath id="taylor-clip">
            <rect x={PAD_L} y={PAD_T} width={plotW} height={plotH} />
          </clipPath>
        </defs>
        <g clipPath="url(#taylor-clip)">
          {/* approximations under base */}
          {approximations.map((a, i) => (
            <path
              key={`approx-${i}`}
              d={pathFor(a.curve)}
              fill="none"
              stroke={a.color ?? APPROX_PALETTE[i % APPROX_PALETTE.length]}
              strokeWidth={2}
              strokeDasharray="6 4"
              data-feature={N.approximation(a.degree)}
              data-feature-label={`T${a.degree}(x)`}
              data-feature-cx={(PAD_L + plotW / 2) / W}
              data-feature-cy={(PAD_T + plotH / 2) / H}
              data-feature-w={40 / W}
              data-feature-h={24 / H}
            />
          ))}
          {/* base curve */}
          <path
            d={basePath} fill="none" stroke={COLOR_BASE} strokeWidth={2.6}
            data-feature={N.baseCurve}
            data-feature-label={exprLabel || 'f(x)'}
            data-feature-cx={(PAD_L + plotW / 2) / W}
            data-feature-cy={(PAD_T + plotH / 3) / H}
            data-feature-w={40 / W}
            data-feature-h={24 / H}
          />
        </g>

        {/* axes */}
        {yMin <= 0 && yMax >= 0 && (
          <line x1={PAD_L} y1={yAt(0)} x2={PAD_L + plotW} y2={yAt(0)} stroke={COLOR_AXIS} strokeWidth={1.2} />
        )}
        {xMin <= 0 && xMax >= 0 && (
          <line x1={xAt(0)} y1={PAD_T} x2={xAt(0)} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.2} />
        )}
        <rect x={PAD_L} y={PAD_T} width={plotW} height={plotH} fill="none" stroke={COLOR_AXIS} strokeWidth={1.5} />

        {/* center marker */}
        {center >= xMin && center <= xMax && (
          <>
            <line x1={xAt(center)} y1={PAD_T} x2={xAt(center)} y2={PAD_T + plotH} stroke={COLOR_CENTER} strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
            <text x={xAt(center)} y={PAD_T - 4} fontSize={11} fill={COLOR_CENTER} textAnchor="middle">
              c = {Number(center.toFixed(2))}
            </text>
          </>
        )}

        {/* tick labels */}
        {xTicks.map((tx, i) => (
          <text key={`tlx-${i}`} x={xAt(tx)} y={PAD_T + plotH + 16} fontSize={11} textAnchor="middle" fill="#374151">
            {Number(tx.toFixed(2))}
          </text>
        ))}
        {yTicks.map((ty, i) => (
          <text key={`tly-${i}`} x={PAD_L - 6} y={yAt(ty) + 4} fontSize={11} textAnchor="end" fill="#374151">
            {Number(ty.toFixed(2))}
          </text>
        ))}

        {/* labels */}
        {exprLabel && (
          <text
            x={PAD_L + 8} y={PAD_T + 14}
            fontSize={13} fontWeight={600} fill={COLOR_BASE}
            data-feature={N.exprLabel}
            data-feature-label={exprLabel}
            data-feature-cx={(PAD_L + 60) / W}
            data-feature-cy={(PAD_T + 12) / H}
            data-feature-w={160 / W}
            data-feature-h={18 / H}
          >
            {exprLabel}
          </text>
        )}
        <text x={PAD_L + plotW / 2} y={H - 24} fontSize={12} fontWeight={600} textAnchor="middle" fill="#374151">x</text>
        <text x={16} y={PAD_T + plotH / 2} fontSize={12} fontWeight={600} textAnchor="middle" fill="#374151" transform={`rotate(-90 16 ${PAD_T + plotH / 2})`}>y</text>

        {/* legend */}
        <g>
          <line x1={PAD_L + 8} y1={H - 8} x2={PAD_L + 32} y2={H - 8} stroke={COLOR_BASE} strokeWidth={2.6} />
          <text x={PAD_L + 38} y={H - 4} fontSize={11} fill="#374151">f(x)</text>
          {approximations.map((a, i) => {
            const xOff = PAD_L + 90 + i * 70;
            return (
              <g key={`leg-${i}`}>
                <line x1={xOff} y1={H - 8} x2={xOff + 24} y2={H - 8}
                  stroke={a.color ?? APPROX_PALETTE[i % APPROX_PALETTE.length]} strokeWidth={2} strokeDasharray="6 4" />
                <text x={xOff + 30} y={H - 4} fontSize={11} fill="#374151">T{a.degree}</text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
