'use client';

import React from 'react';
import {
  scatterRegressionFeatureNames,
  type ScatterRegressionFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/math-statistics';

const COLOR_AXIS = '#1f2937';
const COLOR_POINT = '#2563eb';
const COLOR_LINE = '#dc2626';
const COLOR_RESID = '#9ca3af';
const COLOR_HL = '#16a34a';

export function ScatterRegressionRenderer({ figure }: { figure: ScatterRegressionFigure }) {
  const {
    points, regression, xMin, xMax, yMin, yMax,
    equationLabel, rValue, rSquared, highlightPoint, showResiduals,
    xLabel, yLabel, title,
  } = figure;
  const N = scatterRegressionFeatureNames;

  const W = 560;
  const H = 420;
  const PAD_L = 60;
  const PAD_R = 24;
  const PAD_T = 32;
  const PAD_B = 56;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const xAt = (x: number) => PAD_L + ((x - xMin) / (xMax - xMin)) * plotW;
  const yAt = (y: number) => PAD_T + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const xTicks: number[] = [];
  const xStep = (xMax - xMin) / 5;
  for (let i = 0; i <= 5; i += 1) xTicks.push(xMin + xStep * i);
  const yTicks: number[] = [];
  const yStep = (yMax - yMin) / 5;
  for (let i = 0; i <= 5; i += 1) yTicks.push(yMin + yStep * i);

  // Regression line endpoints clipped to viewport.
  let lineX1 = 0, lineY1 = 0, lineX2 = 0, lineY2 = 0;
  if (regression) {
    const yLeft = regression.intercept + regression.slope * xMin;
    const yRight = regression.intercept + regression.slope * xMax;
    // Clip y to viewport (basic, may exceed slightly).
    lineX1 = xMin; lineY1 = yLeft;
    lineX2 = xMax; lineY2 = yRight;
  }

  return (
    <div
      className="scatter-regression-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'scatterplot'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        <defs>
          <clipPath id="scatter-reg-clip">
            <rect x={PAD_L} y={PAD_T} width={plotW} height={plotH} />
          </clipPath>
        </defs>

        {/* gridlines */}
        {xTicks.map((tx, i) => (
          <line key={`gx-${i}`} x1={xAt(tx)} y1={PAD_T} x2={xAt(tx)} y2={PAD_T + plotH} stroke="#e5e7eb" strokeWidth={1} />
        ))}
        {yTicks.map((ty, i) => (
          <line key={`gy-${i}`} x1={PAD_L} y1={yAt(ty)} x2={PAD_L + plotW} y2={yAt(ty)} stroke="#e5e7eb" strokeWidth={1} />
        ))}

        {/* residual segments (under points) */}
        {showResiduals && regression && (
          <g
            clipPath="url(#scatter-reg-clip)"
            data-feature={N.residuals}
            data-feature-label="residuals"
            data-feature-cx={(PAD_L + plotW / 2) / W}
            data-feature-cy={(PAD_T + plotH / 2) / H}
            data-feature-w={plotW / W}
            data-feature-h={plotH / H}
          >
            {points.map((p, i) => {
              const yHat = regression.intercept + regression.slope * p.x;
              return (
                <line
                  key={`res-${i}`}
                  x1={xAt(p.x)} y1={yAt(p.y)}
                  x2={xAt(p.x)} y2={yAt(yHat)}
                  stroke={COLOR_RESID} strokeWidth={1.2} strokeDasharray="2 2"
                />
              );
            })}
          </g>
        )}

        {/* regression line */}
        {regression && (
          <g
            clipPath="url(#scatter-reg-clip)"
            data-feature={N.regression}
            data-feature-label="LSRL"
            data-feature-cx={((xAt(lineX1) + xAt(lineX2)) / 2) / W}
            data-feature-cy={((yAt(lineY1) + yAt(lineY2)) / 2) / H}
            data-feature-w={40 / W}
            data-feature-h={24 / H}
          >
            <line
              x1={xAt(lineX1)} y1={yAt(lineY1)}
              x2={xAt(lineX2)} y2={yAt(lineY2)}
              stroke={COLOR_LINE} strokeWidth={2.4}
            />
          </g>
        )}

        {/* points — wrapped so "data points" collective resolves. */}
        <g
          data-feature={N.points}
          data-feature-label="data points"
          data-feature-cx={(PAD_L + plotW / 2) / W}
          data-feature-cy={(PAD_T + plotH / 2) / H}
          data-feature-w={plotW / W}
          data-feature-h={plotH / H}
        >
          {points.map((p, i) => {
            const isHighlight =
              highlightPoint &&
              Math.abs(p.x - highlightPoint.x) < 1e-9 &&
              Math.abs(p.y - highlightPoint.y) < 1e-9;
            return (
              <circle
                key={`pt-${i}`}
                cx={xAt(p.x)} cy={yAt(p.y)}
                r={isHighlight ? 5.5 : 3.5}
                fill={isHighlight ? COLOR_HL : COLOR_POINT} stroke="#fff" strokeWidth={1.2}
              />
            );
          })}
        </g>

        {/* highlighted point label */}
        {highlightPoint && (
          <g
            data-feature={N.highlightPoint}
            data-feature-label={highlightPoint.label || `(${highlightPoint.x}, ${highlightPoint.y})`}
            data-feature-cx={xAt(highlightPoint.x) / W}
            data-feature-cy={yAt(highlightPoint.y) / H}
            data-feature-w={32 / W}
            data-feature-h={32 / H}
          >
            <text
              x={xAt(highlightPoint.x) + 8} y={yAt(highlightPoint.y) - 6}
              fontSize={11} fill={COLOR_HL} fontWeight={600}
            >
              {highlightPoint.label ?? `(${Number(highlightPoint.x.toFixed(2))}, ${Number(highlightPoint.y.toFixed(2))})`}
            </text>
          </g>
        )}

        {/* axes */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />

        {/* tick labels */}
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

        {/* equation + r */}
        {equationLabel && (
          <text
            x={PAD_L + 8} y={PAD_T + 14}
            fontSize={13} fontWeight={600} fill={COLOR_LINE}
            data-feature={N.equation}
            data-feature-label={equationLabel}
            data-feature-cx={(PAD_L + 80) / W}
            data-feature-cy={(PAD_T + 12) / H}
            data-feature-w={180 / W}
            data-feature-h={18 / H}
          >
            {equationLabel}
          </text>
        )}
        {(rValue !== undefined || rSquared !== undefined) && (
          <text
            x={W - PAD_R - 4} y={PAD_T + 14}
            fontSize={11} textAnchor="end" fill="#374151"
            data-feature={rValue !== undefined ? N.rValue : N.rSquared}
            data-feature-label={rValue !== undefined ? `r = ${rValue}` : `r² = ${rSquared}`}
            data-feature-cx={(W - PAD_R - 50) / W}
            data-feature-cy={(PAD_T + 12) / H}
            data-feature-w={120 / W}
            data-feature-h={18 / H}
          >
            {rValue !== undefined && <tspan>r = {Number(rValue.toFixed(3))}</tspan>}
            {rValue !== undefined && rSquared !== undefined && <tspan>  </tspan>}
            {rSquared !== undefined && <tspan>r² = {Number(rSquared.toFixed(3))}</tspan>}
          </text>
        )}

        {/* axis titles */}
        {xLabel && (
          <text x={PAD_L + plotW / 2} y={H - 14} fontSize={12} fontWeight={600} textAnchor="middle" fill="#374151">
            {xLabel}
          </text>
        )}
        {yLabel && (
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
        )}
      </svg>
    </div>
  );
}
