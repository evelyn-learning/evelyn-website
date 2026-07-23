'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import {
  adAsFeatureNames,
  type AdAsFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/economics';

const COLOR_AD = '#2563eb';
const COLOR_AD_NEW = '#60a5fa';
const COLOR_SRAS = '#dc2626';
const COLOR_SRAS_NEW = '#fca5a5';
const COLOR_LRAS = '#1f2937';
const COLOR_AXIS = '#1f2937';
const COLOR_EQ = '#16a34a';
const COLOR_EQ_NEW = '#facc15';

export function AdAsRenderer({ figure }: { figure: AdAsFigure }) {
  const {
    potentialGdp,
    initialEquilibriumGdp: Y0,
    initialPriceLevel: P0,
    showLras,
    shift,
    finalEquilibriumGdp: Y1,
    finalEquilibriumPriceLevel: P1,
    labels,
    title,
  } = figure;
  const N = adAsFeatureNames;

  const W = 580;
  const H = 420;
  const PAD_L = 60;
  const PAD_R = 60;
  const PAD_T = 36;
  const PAD_B = 60;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const AXIS_MAX = 100;
  const xAt = (v: number) => PAD_L + (v / AXIS_MAX) * plotW;
  const yAt = (v: number) => PAD_T + plotH - (v / AXIS_MAX) * plotH;

  /** Clip line endpoints to plot bounds for visualization. */
  function clipToBounds(slope: number, intercept: number): { x1: number; x2: number; y1: number; y2: number } {
    // P = intercept + slope * Y. Find the segment within Y in [0, AXIS_MAX] and P in [0, AXIS_MAX].
    const candidates: { Y: number; P: number }[] = [];
    // Cross x = 0
    candidates.push({ Y: 0, P: intercept });
    // Cross x = AXIS_MAX
    candidates.push({ Y: AXIS_MAX, P: intercept + slope * AXIS_MAX });
    // Cross y = 0
    if (slope !== 0) candidates.push({ Y: -intercept / slope, P: 0 });
    // Cross y = AXIS_MAX
    if (slope !== 0) candidates.push({ Y: (AXIS_MAX - intercept) / slope, P: AXIS_MAX });
    const inside = candidates.filter((c) => c.Y >= 0 && c.Y <= AXIS_MAX && c.P >= 0 && c.P <= AXIS_MAX);
    if (inside.length < 2) {
      return { x1: xAt(0), x2: xAt(AXIS_MAX), y1: yAt(intercept), y2: yAt(intercept + slope * AXIS_MAX) };
    }
    // Choose the two extremes.
    inside.sort((a, b) => a.Y - b.Y);
    const a = inside[0];
    const b = inside[inside.length - 1];
    return { x1: xAt(a.Y), y1: yAt(a.P), x2: xAt(b.Y), y2: yAt(b.P) };
  }

  // AD slope = -1, intercept = P0 + Y0. SRAS slope = +1, intercept = P0 - Y0.
  const adIntercept0 = P0 + Y0;
  const srasIntercept0 = P0 - Y0;
  const adLine = clipToBounds(-1, adIntercept0);
  const srasLine = clipToBounds(1, srasIntercept0);

  // Compute shifted curve(s) if any.
  let adShiftedLine: ReturnType<typeof clipToBounds> | null = null;
  let srasShiftedLine: ReturnType<typeof clipToBounds> | null = null;
  let lrasShifted: number | null = null;
  if (shift) {
    const delta = shift.direction === 'right' ? shift.magnitude : -shift.magnitude;
    if (shift.curve === 'AD') {
      adShiftedLine = clipToBounds(-1, adIntercept0 + delta);
    } else if (shift.curve === 'SRAS') {
      srasShiftedLine = clipToBounds(1, srasIntercept0 - delta);
    } else if (shift.curve === 'LRAS') {
      lrasShifted = potentialGdp + delta;
    }
  }

  return (
    <div
      className="ad-as-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'AD/AS'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      {shift && <div className="text-xs italic text-gray-600 -mt-1 mb-2">{shift.label ?? `${shift.curve} shifts ${shift.direction}`}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {/* Axes */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />

        {/* LRAS — vertical line at potential GDP */}
        {showLras && (
          <g
            data-feature={N.lras}
            data-feature-label={labels.lras}
            data-feature-cx={xAt(potentialGdp) / W}
            data-feature-cy={(PAD_T + plotH / 2) / H}
            data-feature-w={28 / W}
            data-feature-h={plotH / H}
          >
            <line x1={xAt(potentialGdp)} y1={PAD_T} x2={xAt(potentialGdp)} y2={PAD_T + plotH} stroke={COLOR_LRAS} strokeWidth={2} />
            <text x={xAt(potentialGdp)} y={PAD_T - 6} fontSize={12} fontWeight={600} fill={COLOR_LRAS} textAnchor="middle">
              {labels.lras}
            </text>
          </g>
        )}
        {showLras && lrasShifted !== null && lrasShifted >= 0 && lrasShifted <= AXIS_MAX && (
          <g
            data-feature={N.lrasShifted}
            data-feature-label={`${labels.lras}'`}
            data-feature-cx={xAt(lrasShifted) / W}
            data-feature-cy={(PAD_T + plotH / 2) / H}
            data-feature-w={28 / W}
            data-feature-h={plotH / H}
          >
            <line x1={xAt(lrasShifted)} y1={PAD_T} x2={xAt(lrasShifted)} y2={PAD_T + plotH} stroke={COLOR_LRAS} strokeWidth={2} strokeDasharray="6 4" />
            <text x={xAt(lrasShifted)} y={PAD_T - 6} fontSize={12} fontWeight={600} fill={COLOR_LRAS} textAnchor="middle">
              {labels.lras}&apos;
            </text>
          </g>
        )}

        {/* AD initial */}
        <g
          data-feature={N.ad}
          data-feature-label={labels.ad}
          data-feature-cx={((adLine.x1 + adLine.x2) / 2) / W}
          data-feature-cy={((adLine.y1 + adLine.y2) / 2) / H}
          data-feature-w={40 / W}
          data-feature-h={24 / H}
        >
          <line x1={adLine.x1} y1={adLine.y1} x2={adLine.x2} y2={adLine.y2} stroke={COLOR_AD} strokeWidth={2.5} />
          <text x={adLine.x2 + 4} y={adLine.y2 + 4} fontSize={12} fontWeight={600} fill={COLOR_AD}>
            {labels.ad}
          </text>
        </g>
        {adShiftedLine && (
          <g
            data-feature={N.adShifted}
            data-feature-label={`${labels.ad}'`}
            data-feature-cx={((adShiftedLine.x1 + adShiftedLine.x2) / 2) / W}
            data-feature-cy={((adShiftedLine.y1 + adShiftedLine.y2) / 2) / H}
            data-feature-w={40 / W}
            data-feature-h={24 / H}
          >
            <line x1={adShiftedLine.x1} y1={adShiftedLine.y1} x2={adShiftedLine.x2} y2={adShiftedLine.y2} stroke={COLOR_AD_NEW} strokeWidth={2.5} strokeDasharray="6 4" />
            <text x={adShiftedLine.x2 + 4} y={adShiftedLine.y2 + 4} fontSize={12} fontWeight={600} fill={COLOR_AD_NEW}>
              {labels.ad}&apos;
            </text>
          </g>
        )}

        {/* SRAS initial */}
        <g
          data-feature={N.sras}
          data-feature-label={labels.sras}
          data-feature-cx={((srasLine.x1 + srasLine.x2) / 2) / W}
          data-feature-cy={((srasLine.y1 + srasLine.y2) / 2) / H}
          data-feature-w={40 / W}
          data-feature-h={24 / H}
        >
          <line x1={srasLine.x1} y1={srasLine.y1} x2={srasLine.x2} y2={srasLine.y2} stroke={COLOR_SRAS} strokeWidth={2.5} />
          <text x={srasLine.x2 + 4} y={srasLine.y2 + 4} fontSize={12} fontWeight={600} fill={COLOR_SRAS}>
            {labels.sras}
          </text>
        </g>
        {srasShiftedLine && (
          <g
            data-feature={N.srasShifted}
            data-feature-label={`${labels.sras}'`}
            data-feature-cx={((srasShiftedLine.x1 + srasShiftedLine.x2) / 2) / W}
            data-feature-cy={((srasShiftedLine.y1 + srasShiftedLine.y2) / 2) / H}
            data-feature-w={40 / W}
            data-feature-h={24 / H}
          >
            <line x1={srasShiftedLine.x1} y1={srasShiftedLine.y1} x2={srasShiftedLine.x2} y2={srasShiftedLine.y2} stroke={COLOR_SRAS_NEW} strokeWidth={2.5} strokeDasharray="6 4" />
            <text x={srasShiftedLine.x2 + 4} y={srasShiftedLine.y2 + 4} fontSize={12} fontWeight={600} fill={COLOR_SRAS_NEW}>
              {labels.sras}&apos;
            </text>
          </g>
        )}

        {/* Initial equilibrium */}
        <g
          data-feature={N.eqInitial}
          data-feature-label={labels.eqInitial}
          data-feature-cx={xAt(Y0) / W}
          data-feature-cy={yAt(P0) / H}
          data-feature-w={40 / W}
          data-feature-h={40 / H}
        >
          <circle cx={xAt(Y0)} cy={yAt(P0)} r={5} fill={COLOR_EQ} stroke="#fff" strokeWidth={2} />
          <text x={xAt(Y0) + 8} y={yAt(P0) - 6} fontSize={13} fontWeight={700} fill={COLOR_EQ}>
            {labels.eqInitial}
          </text>
        </g>
        {/* Reference lines from initial equilibrium */}
        <line x1={xAt(Y0)} y1={yAt(P0)} x2={xAt(Y0)} y2={PAD_T + plotH} stroke={COLOR_EQ} strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
        <line x1={xAt(Y0)} y1={yAt(P0)} x2={PAD_L} y2={yAt(P0)} stroke={COLOR_EQ} strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
        <text x={xAt(Y0)} y={PAD_T + plotH + 14} fontSize={11} fill={COLOR_EQ} textAnchor="middle">Y₀</text>
        <text x={PAD_L - 6} y={yAt(P0) + 4} fontSize={11} fill={COLOR_EQ} textAnchor="end">P₀</text>

        {/* Final equilibrium if shift */}
        {Y1 !== undefined && P1 !== undefined && (
          <g
            data-feature={N.eqFinal}
            data-feature-label={labels.eqFinal}
            data-feature-cx={xAt(Y1) / W}
            data-feature-cy={yAt(P1) / H}
            data-feature-w={40 / W}
            data-feature-h={40 / H}
          >
            <circle cx={xAt(Y1)} cy={yAt(P1)} r={5} fill={COLOR_EQ_NEW} stroke="#fff" strokeWidth={2} />
            <text x={xAt(Y1) + 8} y={yAt(P1) - 6} fontSize={13} fontWeight={700} fill="#a16207">
              {labels.eqFinal}
            </text>
            <line x1={xAt(Y1)} y1={yAt(P1)} x2={xAt(Y1)} y2={PAD_T + plotH} stroke="#a16207" strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
            <line x1={xAt(Y1)} y1={yAt(P1)} x2={PAD_L} y2={yAt(P1)} stroke="#a16207" strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
            <text x={xAt(Y1)} y={PAD_T + plotH + 14} fontSize={11} fill="#a16207" textAnchor="middle">Y₁</text>
            <text x={PAD_L - 6} y={yAt(P1) + 4} fontSize={11} fill="#a16207" textAnchor="end">P₁</text>
          </g>
        )}

        {/* Axis labels */}
        <text x={PAD_L + plotW / 2} y={H - 18} fontSize={13} fontWeight={600} textAnchor="middle" fill="#374151">
          Real GDP
        </text>
        <text
          x={20}
          y={PAD_T + plotH / 2}
          fontSize={13}
          fontWeight={600}
          textAnchor="middle"
          fill="#374151"
          transform={`rotate(-90 20 ${PAD_T + plotH / 2})`}
        >
          Price Level
        </text>

      </svg>
    </div>
  );
}
