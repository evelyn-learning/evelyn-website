'use client';

import React from 'react';
import {
  loanableFundsFeatureNames,
  type LoanableFundsFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/economics';

const COLOR_S = '#dc2626';
const COLOR_S_NEW = '#fca5a5';
const COLOR_D = '#2563eb';
const COLOR_D_NEW = '#60a5fa';
const COLOR_AXIS = '#1f2937';
const COLOR_EQ = '#16a34a';
const COLOR_EQ_NEW = '#facc15';

export function LoanableFundsRenderer({ figure }: { figure: LoanableFundsFigure }) {
  const N = loanableFundsFeatureNames;
  const {
    initialQuantity: Q0,
    initialRealRate: r0,
    shift,
    finalQuantity: Q1,
    finalRealRate: r1,
    title,
  } = figure;

  const W = 540;
  const H = 400;
  const PAD_L = 70;
  const PAD_R = 60;
  const PAD_T = 36;
  const PAD_B = 60;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const AXIS_MAX = 100;
  const xAt = (v: number) => PAD_L + (v / AXIS_MAX) * plotW;
  const yAt = (v: number) => PAD_T + plotH - (v / AXIS_MAX) * plotH;

  /** S slope = +1 through (Q0, r0). r = r0 + (Q - Q0). */
  const sIntercept0 = r0 - Q0;
  /** D slope = -1 through (Q0, r0). r = r0 - (Q - Q0). */
  const dIntercept0 = r0 + Q0;

  function clipLine(slope: number, intercept: number): { x1: number; y1: number; x2: number; y2: number } {
    const candidates: { Q: number; r: number }[] = [];
    candidates.push({ Q: 0, r: intercept });
    candidates.push({ Q: AXIS_MAX, r: intercept + slope * AXIS_MAX });
    if (slope !== 0) candidates.push({ Q: -intercept / slope, r: 0 });
    if (slope !== 0) candidates.push({ Q: (AXIS_MAX - intercept) / slope, r: AXIS_MAX });
    const inside = candidates.filter((c) => c.Q >= 0 && c.Q <= AXIS_MAX && c.r >= 0 && c.r <= AXIS_MAX);
    if (inside.length < 2) {
      return { x1: xAt(0), y1: yAt(intercept), x2: xAt(AXIS_MAX), y2: yAt(intercept + slope * AXIS_MAX) };
    }
    inside.sort((a, b) => a.Q - b.Q);
    return {
      x1: xAt(inside[0].Q),
      y1: yAt(inside[0].r),
      x2: xAt(inside[inside.length - 1].Q),
      y2: yAt(inside[inside.length - 1].r),
    };
  }

  const sLine = clipLine(1, sIntercept0);
  const dLine = clipLine(-1, dIntercept0);

  let sShiftedLine: ReturnType<typeof clipLine> | null = null;
  let dShiftedLine: ReturnType<typeof clipLine> | null = null;
  if (shift) {
    const delta = shift.direction === 'right' ? shift.magnitude : -shift.magnitude;
    if (shift.curve === 'S') {
      // Right shift = at any rate, more saving offered. Equivalently, intercept decreases.
      sShiftedLine = clipLine(1, sIntercept0 - delta);
    } else {
      // D right shift: at any rate, more borrowing demanded.
      dShiftedLine = clipLine(-1, dIntercept0 + delta);
    }
  }

  return (
    <div
      className="loanable-funds-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'loanable funds'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[600px]">
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />

        {/* S */}
        <g
          data-feature={N.supply}
          data-feature-label="S"
          data-feature-cx={((sLine.x1 + sLine.x2) / 2) / W}
          data-feature-cy={((sLine.y1 + sLine.y2) / 2) / H}
          data-feature-w={40 / W}
          data-feature-h={24 / H}
        >
          <line x1={sLine.x1} y1={sLine.y1} x2={sLine.x2} y2={sLine.y2} stroke={COLOR_S} strokeWidth={2.5} />
          <text x={sLine.x2 + 4} y={sLine.y2 + 4} fontSize={12} fontWeight={600} fill={COLOR_S}>S</text>
        </g>
        {sShiftedLine && (
          <g
            data-feature={N.supplyShifted}
            data-feature-label="S'"
            data-feature-cx={((sShiftedLine.x1 + sShiftedLine.x2) / 2) / W}
            data-feature-cy={((sShiftedLine.y1 + sShiftedLine.y2) / 2) / H}
            data-feature-w={40 / W}
            data-feature-h={24 / H}
          >
            <line x1={sShiftedLine.x1} y1={sShiftedLine.y1} x2={sShiftedLine.x2} y2={sShiftedLine.y2} stroke={COLOR_S_NEW} strokeWidth={2.5} strokeDasharray="6 4" />
            <text x={sShiftedLine.x2 + 4} y={sShiftedLine.y2 + 4} fontSize={12} fontWeight={600} fill={COLOR_S_NEW}>S&apos;</text>
          </g>
        )}

        {/* D */}
        <g
          data-feature={N.demand}
          data-feature-label="D"
          data-feature-cx={((dLine.x1 + dLine.x2) / 2) / W}
          data-feature-cy={((dLine.y1 + dLine.y2) / 2) / H}
          data-feature-w={40 / W}
          data-feature-h={24 / H}
        >
          <line x1={dLine.x1} y1={dLine.y1} x2={dLine.x2} y2={dLine.y2} stroke={COLOR_D} strokeWidth={2.5} />
          <text x={dLine.x2 + 4} y={dLine.y2 + 4} fontSize={12} fontWeight={600} fill={COLOR_D}>D</text>
        </g>
        {dShiftedLine && (
          <g
            data-feature={N.demandShifted}
            data-feature-label="D'"
            data-feature-cx={((dShiftedLine.x1 + dShiftedLine.x2) / 2) / W}
            data-feature-cy={((dShiftedLine.y1 + dShiftedLine.y2) / 2) / H}
            data-feature-w={40 / W}
            data-feature-h={24 / H}
          >
            <line x1={dShiftedLine.x1} y1={dShiftedLine.y1} x2={dShiftedLine.x2} y2={dShiftedLine.y2} stroke={COLOR_D_NEW} strokeWidth={2.5} strokeDasharray="6 4" />
            <text x={dShiftedLine.x2 + 4} y={dShiftedLine.y2 + 4} fontSize={12} fontWeight={600} fill={COLOR_D_NEW}>D&apos;</text>
          </g>
        )}

        {/* Initial equilibrium */}
        <g
          data-feature={N.eqInitial}
          data-feature-label="initial equilibrium"
          data-feature-cx={xAt(Q0) / W}
          data-feature-cy={yAt(r0) / H}
          data-feature-w={40 / W}
          data-feature-h={40 / H}
        >
          <circle cx={xAt(Q0)} cy={yAt(r0)} r={5} fill={COLOR_EQ} stroke="#fff" strokeWidth={2} />
        </g>
        <line x1={xAt(Q0)} y1={yAt(r0)} x2={xAt(Q0)} y2={PAD_T + plotH} stroke={COLOR_EQ} strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
        <line x1={xAt(Q0)} y1={yAt(r0)} x2={PAD_L} y2={yAt(r0)} stroke={COLOR_EQ} strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
        <text x={xAt(Q0)} y={PAD_T + plotH + 14} fontSize={11} fill={COLOR_EQ} textAnchor="middle">Q₀</text>
        <text x={PAD_L - 6} y={yAt(r0) + 4} fontSize={11} fill={COLOR_EQ} textAnchor="end">r₀</text>

        {/* Final equilibrium */}
        {Q1 !== undefined && r1 !== undefined && (
          <g
            data-feature={N.eqFinal}
            data-feature-label="final equilibrium"
            data-feature-cx={xAt(Q1) / W}
            data-feature-cy={yAt(r1) / H}
            data-feature-w={40 / W}
            data-feature-h={40 / H}
          >
            <circle cx={xAt(Q1)} cy={yAt(r1)} r={5} fill={COLOR_EQ_NEW} stroke="#fff" strokeWidth={2} />
            <line x1={xAt(Q1)} y1={yAt(r1)} x2={xAt(Q1)} y2={PAD_T + plotH} stroke="#a16207" strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
            <line x1={xAt(Q1)} y1={yAt(r1)} x2={PAD_L} y2={yAt(r1)} stroke="#a16207" strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
            <text x={xAt(Q1)} y={PAD_T + plotH + 14} fontSize={11} fill="#a16207" textAnchor="middle">Q₁</text>
            <text x={PAD_L - 6} y={yAt(r1) + 4} fontSize={11} fill="#a16207" textAnchor="end">r₁</text>
          </g>
        )}

        <text x={PAD_L + plotW / 2} y={H - 18} fontSize={13} fontWeight={600} textAnchor="middle" fill="#374151">
          Quantity of Loanable Funds
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
          Real Interest Rate
        </text>

        {shift && (
          <text x={PAD_L + plotW - 6} y={PAD_T + 14} fontSize={11} fill="#374151" textAnchor="end" fontStyle="italic">
            {shift.label ?? `${shift.curve} shifts ${shift.direction}`}
          </text>
        )}
      </svg>
    </div>
  );
}
