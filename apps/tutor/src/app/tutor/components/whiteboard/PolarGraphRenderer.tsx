'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import {
  polarGraphFeatureNames,
  type PolarGraphFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/math-calculus';
import { smoothPath } from './_smoothPath';
import { niceStep, formatTick, textWidth } from './_niceTicks';
import { texToSvgText } from '@/lib/tutor/whiteboard/svg-label';

const COLOR_AXIS = '#1f2937';
const COLOR_GRID = '#e5e7eb';
const COLOR_CURVE = '#0d9488';
const COLOR_SHADE = '#5eead4';
const COLOR_HL = '#dc2626';

export function PolarGraphRenderer({ figure }: { figure: PolarGraphFigure }) {
  const { curve, shadeRegion, highlightPoint, rMax: rMaxIn, showAxes, title } = figure;
  // SVG <text> can't host KaTeX — plainify LaTeX-ish labels to Unicode
  // (\cos\theta → cosθ) instead of showing raw backslash commands.
  const exprLabel = figure.exprLabel ? texToSvgText(figure.exprLabel) : figure.exprLabel;
  const hlLabel = highlightPoint?.label ? texToSvgText(highlightPoint.label) : highlightPoint?.label;
  const N = polarGraphFeatureNames;

  const W = 500;
  const H = 500;
  const cx = W / 2;
  const cy = H / 2 + 8;
  const plotR = Math.min(W, H) / 2 - 46;

  // The rings sit at round radii (0.5, 1, 1.5 …) and the outermost ring is the first round radius
  // that holds the whole curve. An rMax well beyond the curve is a window the caller asked for.
  let dataMax = 0;
  for (const p of curve) dataMax = Math.max(dataMax, Math.hypot(p.x, p.y));
  if (highlightPoint) dataMax = Math.max(dataMax, Math.hypot(highlightPoint.x, highlightPoint.y));
  const base = dataMax > 0 && rMaxIn <= dataMax * 1.3 ? dataMax : rMaxIn;
  const ringStep = niceStep(base, 4);
  const ringCount = Math.max(1, Math.ceil(base / ringStep - 1e-6));
  const rMax = ringCount * ringStep;

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

  const gridRs = Array.from({ length: ringCount }, (_, i) => (i + 1) * ringStep);
  const ANGLE_LABELS: Record<number, string> = {
    0: '0', 30: 'π/6', 60: 'π/3', 90: 'π/2', 120: '2π/3', 150: '5π/6',
    180: 'π', 210: '7π/6', 240: '4π/3', 270: '3π/2', 300: '5π/3', 330: '11π/6',
  };

  // Radial lines every 30°.
  const radialAngles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  return (
    <div
      className="polar-graph-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'polar graph'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
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
        {highlightPoint && (() => {
          const hpx = xAt(highlightPoint.x);
          const hpy = yAt(highlightPoint.y);
          const hlText = hlLabel ?? `(r=${Number(highlightPoint.r.toFixed(2))}, θ=${Number(highlightPoint.theta.toFixed(2))})`;
          // Width-aware anchor flip + edge clamp (ProjectileMotionRenderer
          // :197-208 idiom): a start-anchored label on a point near the
          // curve's right edge runs past the viewBox — flip it to the left
          // side of the point, then clamp the extent into [3, W-3].
          const hlW = textWidth(hlText, 11);
          const hlFlip = hpx + 8 + hlW > W - 3 || hpx > cx;
          let hlX = hlFlip ? hpx - 8 : hpx + 8;
          const hlLeft = hlFlip ? hlX - hlW : hlX;
          hlX += Math.max(3 - hlLeft, 0) - Math.max(hlLeft + hlW - (W - 3), 0);
          return (
            <g
              data-feature={N.highlightPoint}
              data-feature-label={hlLabel || 'highlight point'}
              data-feature-cx={hpx / W}
              data-feature-cy={hpy / H}
              data-feature-w={36 / W}
              data-feature-h={32 / H}
            >
              <circle cx={hpx} cy={hpy} r={5} fill={COLOR_HL} stroke="#fff" strokeWidth={2} />
              <text x={hlX} y={hpy - 10} fontSize={11} fill={COLOR_HL} fontWeight={600} textAnchor={hlFlip ? 'end' : 'start'} stroke="#fff" strokeWidth={3} paintOrder="stroke">
                {hlText}
              </text>
            </g>
          );
        })()}

        {/* polar tick labels along positive x-axis */}
        {showAxes && gridRs.map((r, i) => (
          <text key={`tlr-${i}`} x={cx + (r / rMax) * plotR - 3} y={cy + 13} fontSize={10.5} textAnchor="end" fill="#4b5563" stroke="#fff" strokeWidth={3} paintOrder="stroke">
            {formatTick(r, ringStep)}
          </text>
        ))}

        {/* angle labels */}
        {showAxes && (
          <>
            {radialAngles.map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const lx = cx + Math.cos(rad) * (plotR + 16);
              const ly = cy - Math.sin(rad) * (plotR + 14) + 4;
              return (
                <text key={`al-${deg}`} x={lx} y={ly} fontSize={11} fill="#6b7280" textAnchor="middle">{ANGLE_LABELS[deg]}</text>
              );
            })}
          </>
        )}

        {/* expression label */}
        {exprLabel && (
          <text
            x={10} y={18}
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
