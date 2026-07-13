'use client';

import React from 'react';
import {
  polarGraphFeatureNames,
  type PolarGraphFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/math-calculus';
import { smoothPath } from './_smoothPath';
import { texToSvgText } from '@/lib/tutor/whiteboard/svg-label';

const COLOR_AXIS = '#1f2937';
const COLOR_GRID = '#e5e7eb';
const COLOR_CURVE = '#0d9488';
const COLOR_SHADE = '#5eead4';
const COLOR_HL = '#dc2626';

export function PolarGraphRenderer({ figure }: { figure: PolarGraphFigure }) {
  const { curve, shadeRegion, highlightPoint, rMax, showAxes, title } = figure;
  // SVG <text> can't host KaTeX — plainify LaTeX-ish labels to Unicode
  // (\cos\theta → cosθ) instead of showing raw backslash commands.
  const exprLabel = figure.exprLabel ? texToSvgText(figure.exprLabel) : figure.exprLabel;
  const hlLabel = highlightPoint?.label ? texToSvgText(highlightPoint.label) : highlightPoint?.label;
  const N = polarGraphFeatureNames;

  const W = 480;
  const H = 480;
  const cx = W / 2;
  const cy = H / 2;
  const plotR = Math.min(W, H) / 2 - 30;

  const xAt = (x: number) => cx + (x / rMax) * plotR;
  const yAt = (y: number) => cy - (y / rMax) * plotR;

  const curvePath = smoothPath(curve, xAt, yAt);

  // Shade region: closed polygon from origin → smooth curve → origin.
  // Use smoothPath for the curve portion so the wedge edge matches the
  // main curve's smoothness, then close to the origin.
  let shadePath = '';
  if (shadeRegion && shadeRegion.length > 1) {
    const curvePart = smoothPath(shadeRegion, xAt, yAt);
    // smoothPath starts with `M<x0>,<y0>` — for the wedge, we want to
    // start at the origin, line to the first curve point, follow the
    // smooth curve, then close back to the origin.
    const first = shadeRegion[0];
    shadePath = `M${cx.toFixed(2)},${cy.toFixed(2)} L${xAt(first.x).toFixed(2)},${yAt(first.y).toFixed(2)} ${curvePart.replace(/^M[^ ]+ /, '')} Z`;
  }

  // Concentric grid circles at r = rMax/4, rMax/2, 3*rMax/4, rMax.
  const gridRs = [0.25, 0.5, 0.75, 1.0].map((f) => f * rMax);

  // Radial lines every 30°.
  const radialAngles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  return (
    <div
      className="polar-graph-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'polar graph'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[520px]">
        {/* concentric circles */}
        {showAxes && gridRs.map((r, i) => (
          <circle key={`c-${i}`} cx={cx} cy={cy} r={(r / rMax) * plotR} fill="none" stroke={COLOR_GRID} strokeWidth={1} />
        ))}
        {/* radial lines */}
        {showAxes && radialAngles.map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x2 = cx + Math.cos(rad) * plotR;
          const y2 = cy - Math.sin(rad) * plotR;
          return <line key={`r-${i}`} x1={cx} y1={cy} x2={x2} y2={y2} stroke={COLOR_GRID} strokeWidth={1} />;
        })}
        {/* x and y axes */}
        {showAxes && (
          <>
            <line x1={cx - plotR} y1={cy} x2={cx + plotR} y2={cy} stroke={COLOR_AXIS} strokeWidth={1.2} />
            <line x1={cx} y1={cy - plotR} x2={cx} y2={cy + plotR} stroke={COLOR_AXIS} strokeWidth={1.2} />
          </>
        )}

        {/* shaded region */}
        {shadePath && (
          <path
            d={shadePath} fill={COLOR_SHADE} fillOpacity={0.55} stroke="none"
            data-feature={N.shadeRegion}
            data-feature-label="shaded region"
            data-feature-cx={cx / W}
            data-feature-cy={cy / H}
            data-feature-w={(plotR * 0.8) / W}
            data-feature-h={(plotR * 0.8) / H}
          />
        )}

        {/* curve */}
        <path
          d={curvePath} fill="none" stroke={COLOR_CURVE} strokeWidth={2.5}
          data-feature={N.curve}
          data-feature-label={exprLabel || 'r(θ)'}
          data-feature-cx={cx / W}
          data-feature-cy={cy / H}
          data-feature-w={40 / W}
          data-feature-h={24 / H}
        />

        {/* highlight point */}
        {highlightPoint && (
          <g
            data-feature={N.highlightPoint}
            data-feature-label={hlLabel || 'highlight point'}
            data-feature-cx={xAt(highlightPoint.x) / W}
            data-feature-cy={yAt(highlightPoint.y) / H}
            data-feature-w={36 / W}
            data-feature-h={32 / H}
          >
            <circle cx={xAt(highlightPoint.x)} cy={yAt(highlightPoint.y)} r={5} fill={COLOR_HL} stroke="#fff" strokeWidth={2} />
            <text x={xAt(highlightPoint.x) + 8} y={yAt(highlightPoint.y) - 8} fontSize={11} fill={COLOR_HL} fontWeight={600}>
              {hlLabel ?? `(r=${Number(highlightPoint.r.toFixed(2))}, θ=${Number(highlightPoint.theta.toFixed(2))})`}
            </text>
          </g>
        )}

        {/* polar tick labels along positive x-axis */}
        {showAxes && gridRs.map((r, i) => (
          <text key={`tlr-${i}`} x={cx + (r / rMax) * plotR} y={cy + 12} fontSize={10} textAnchor="middle" fill="#6b7280">
            {Number(r.toFixed(2))}
          </text>
        ))}

        {/* angle labels */}
        {showAxes && (
          <>
            <text x={cx + plotR + 14} y={cy + 4} fontSize={11} fill="#6b7280">0</text>
            <text x={cx + 4} y={cy - plotR - 6} fontSize={11} fill="#6b7280">π/2</text>
            <text x={cx - plotR - 14} y={cy + 4} fontSize={11} fill="#6b7280" textAnchor="end">π</text>
            <text x={cx + 4} y={cy + plotR + 14} fontSize={11} fill="#6b7280">3π/2</text>
          </>
        )}

        {/* expression label */}
        {exprLabel && (
          <text
            x={20} y={26}
            fontSize={13} fontWeight={600} fill={COLOR_CURVE}
            data-feature={N.exprLabel}
            data-feature-label={exprLabel}
            data-feature-cx={80 / W}
            data-feature-cy={24 / H}
            data-feature-w={160 / W}
            data-feature-h={18 / H}
          >
            {exprLabel}
          </text>
        )}
      </svg>
    </div>
  );
}
