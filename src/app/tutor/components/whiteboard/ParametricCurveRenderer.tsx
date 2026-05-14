'use client';

import React from 'react';
import {
  parametricCurveFeatureNames,
  type ParametricCurveFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/math-calculus';
import { smoothPath } from './_smoothPath';

const COLOR_AXIS = '#1f2937';
const COLOR_CURVE = '#7c3aed';
const COLOR_HL = '#16a34a';
const COLOR_TAN = '#dc2626';

export function ParametricCurveRenderer({ figure }: { figure: ParametricCurveFigure }) {
  const { curve, xMin, xMax, yMin, yMax, highlightT, tangentAtT, exprLabel, title } = figure;
  const N = parametricCurveFeatureNames;

  const W = 520;
  const H = 440;
  const PAD_L = 56;
  const PAD_R = 28;
  const PAD_T = 32;
  const PAD_B = 50;
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

  const path = smoothPath(curve, xAt, yAt);

  // Direction-of-travel arrow at midpoint.
  const midIdx = Math.floor(curve.length / 2);
  const midA = curve[Math.max(0, midIdx - 1)];
  const midB = curve[Math.min(curve.length - 1, midIdx + 1)];

  // Tangent vector (clamp length).
  let tanLine: { x1: number; y1: number; x2: number; y2: number } | null = null;
  if (tangentAtT) {
    const xScale = plotW / (xMax - xMin);
    const yScale = plotH / (yMax - yMin);
    const vxScr = tangentAtT.dx * xScale;
    const vyScr = -tangentAtT.dy * yScale;
    const lenPx = tangentAtT.length ?? 70;
    const mag = Math.hypot(vxScr, vyScr) || 1;
    const ux = (vxScr / mag) * lenPx;
    const uy = (vyScr / mag) * lenPx;
    tanLine = {
      x1: xAt(tangentAtT.x),
      y1: yAt(tangentAtT.y),
      x2: xAt(tangentAtT.x) + ux,
      y2: yAt(tangentAtT.y) + uy,
    };
  }

  return (
    <div
      className="parametric-curve-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'parametric curve'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[600px]">
        <defs>
          <marker id="arrowhead-param" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill={COLOR_CURVE} />
          </marker>
          <marker id="arrowhead-tan" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill={COLOR_TAN} />
          </marker>
        </defs>

        {/* gridlines */}
        {xTicks.map((tx, i) => (
          <line key={`gx-${i}`} x1={xAt(tx)} y1={PAD_T} x2={xAt(tx)} y2={PAD_T + plotH} stroke="#e5e7eb" strokeWidth={1} />
        ))}
        {yTicks.map((ty, i) => (
          <line key={`gy-${i}`} x1={PAD_L} y1={yAt(ty)} x2={PAD_L + plotW} y2={yAt(ty)} stroke="#e5e7eb" strokeWidth={1} />
        ))}

        {/* axes */}
        {yMin <= 0 && yMax >= 0 && (
          <line x1={PAD_L} y1={yAt(0)} x2={PAD_L + plotW} y2={yAt(0)} stroke={COLOR_AXIS} strokeWidth={1.2} />
        )}
        {xMin <= 0 && xMax >= 0 && (
          <line x1={xAt(0)} y1={PAD_T} x2={xAt(0)} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.2} />
        )}
        <rect x={PAD_L} y={PAD_T} width={plotW} height={plotH} fill="none" stroke={COLOR_AXIS} strokeWidth={1.5} />

        {/* curve */}
        <path
          d={path} fill="none" stroke={COLOR_CURVE} strokeWidth={2.5}
          data-feature={N.curve}
          data-feature-label={exprLabel || 'curve'}
          data-feature-cx={(PAD_L + plotW / 2) / W}
          data-feature-cy={(PAD_T + plotH / 2) / H}
          data-feature-w={40 / W}
          data-feature-h={24 / H}
        />

        {/* direction arrow */}
        {midA && midB && midA !== midB && (
          <line
            x1={xAt((midA.x + midB.x) / 2 - (midB.x - midA.x) * 0.05)}
            y1={yAt((midA.y + midB.y) / 2 - (midB.y - midA.y) * 0.05)}
            x2={xAt((midA.x + midB.x) / 2 + (midB.x - midA.x) * 0.05)}
            y2={yAt((midA.y + midB.y) / 2 + (midB.y - midA.y) * 0.05)}
            stroke={COLOR_CURVE}
            strokeWidth={2}
            markerEnd="url(#arrowhead-param)"
          />
        )}

        {/* tangent vector */}
        {tanLine && (
          <g
            data-feature={N.tangent}
            data-feature-label="tangent vector"
            data-feature-cx={((tanLine.x1 + tanLine.x2) / 2) / W}
            data-feature-cy={((tanLine.y1 + tanLine.y2) / 2) / H}
            data-feature-w={40 / W}
            data-feature-h={24 / H}
          >
            <line x1={tanLine.x1} y1={tanLine.y1} x2={tanLine.x2} y2={tanLine.y2}
              stroke={COLOR_TAN} strokeWidth={2} markerEnd="url(#arrowhead-tan)" />
            <text x={tanLine.x2 + 4} y={tanLine.y2 - 4} fontSize={11} fill={COLOR_TAN}>tangent</text>
          </g>
        )}

        {/* highlight point */}
        {highlightT && (
          <g
            data-feature={N.highlightT}
            data-feature-label={highlightT.label || (highlightT.t !== undefined ? `t = ${highlightT.t}` : 'highlight point')}
            data-feature-cx={xAt(highlightT.x) / W}
            data-feature-cy={yAt(highlightT.y) / H}
            data-feature-w={36 / W}
            data-feature-h={32 / H}
          >
            <circle cx={xAt(highlightT.x)} cy={yAt(highlightT.y)} r={5} fill={COLOR_HL} stroke="#fff" strokeWidth={2} />
            <text x={xAt(highlightT.x) + 8} y={yAt(highlightT.y) - 8} fontSize={11} fill={COLOR_HL} fontWeight={600}>
              {highlightT.label ?? (highlightT.t !== undefined ? `t = ${Number(highlightT.t.toFixed(3))}` : '')}
            </text>
          </g>
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
            fontSize={13} fontWeight={600} fill={COLOR_CURVE}
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
        <text x={PAD_L + plotW / 2} y={H - 8} fontSize={12} fontWeight={600} textAnchor="middle" fill="#374151">x</text>
        <text x={16} y={PAD_T + plotH / 2} fontSize={12} fontWeight={600} textAnchor="middle" fill="#374151" transform={`rotate(-90 16 ${PAD_T + plotH / 2})`}>y</text>
      </svg>
    </div>
  );
}
