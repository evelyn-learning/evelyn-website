'use client';

import React from 'react';
import type { MoneyMarketFigure } from '@/lib/tutor/diagrams/catalog/kinds/economics';

const COLOR_MS = '#1f2937';
const COLOR_MS_NEW = '#6b7280';
const COLOR_MD = '#2563eb';
const COLOR_MD_NEW = '#60a5fa';
const COLOR_AXIS = '#1f2937';
const COLOR_EQ = '#16a34a';
const COLOR_EQ_NEW = '#facc15';

export function MoneyMarketRenderer({ figure }: { figure: MoneyMarketFigure }) {
  const {
    moneySupplyQuantity: Q0,
    initialInterestRate: i0,
    shift,
    finalInterestRate: i1,
    finalMoneyQuantity: Q1,
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

  /** Md is downward with slope -1 through (Q0, i0). */
  const mdIntercept0 = i0 + Q0;
  function mdAt(q: number, intercept: number): number {
    return intercept - q;
  }
  function mdLineEndpoints(intercept: number): { x1: number; y1: number; x2: number; y2: number } {
    // Find segment within [0, AXIS_MAX] x [0, AXIS_MAX].
    const candidates: { Q: number; i: number }[] = [];
    candidates.push({ Q: 0, i: intercept });
    candidates.push({ Q: AXIS_MAX, i: intercept - AXIS_MAX });
    candidates.push({ Q: intercept, i: 0 });
    candidates.push({ Q: intercept - AXIS_MAX, i: AXIS_MAX });
    const inside = candidates.filter((c) => c.Q >= 0 && c.Q <= AXIS_MAX && c.i >= 0 && c.i <= AXIS_MAX);
    if (inside.length < 2) {
      return { x1: xAt(0), y1: yAt(intercept), x2: xAt(AXIS_MAX), y2: yAt(intercept - AXIS_MAX) };
    }
    inside.sort((a, b) => a.Q - b.Q);
    return {
      x1: xAt(inside[0].Q),
      y1: yAt(inside[0].i),
      x2: xAt(inside[inside.length - 1].Q),
      y2: yAt(inside[inside.length - 1].i),
    };
  }

  const mdLine = mdLineEndpoints(mdIntercept0);

  // Shifted Md if shift.curve === 'Md'.
  let mdShiftedLine: ReturnType<typeof mdLineEndpoints> | null = null;
  let msShiftedQ: number | null = null;
  if (shift) {
    const delta = shift.direction === 'right' ? shift.magnitude : -shift.magnitude;
    if (shift.curve === 'Md') {
      mdShiftedLine = mdLineEndpoints(mdIntercept0 + delta);
    } else {
      msShiftedQ = Q0 + delta;
    }
  }

  return (
    <div className="money-market-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[600px]">
        {/* Axes */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />

        {/* Ms (vertical) */}
        <line x1={xAt(Q0)} y1={PAD_T} x2={xAt(Q0)} y2={PAD_T + plotH} stroke={COLOR_MS} strokeWidth={2.5} />
        <text x={xAt(Q0)} y={PAD_T - 6} fontSize={12} fontWeight={600} fill={COLOR_MS} textAnchor="middle">
          Ms
        </text>
        {msShiftedQ !== null && msShiftedQ >= 0 && msShiftedQ <= AXIS_MAX && (
          <>
            <line x1={xAt(msShiftedQ)} y1={PAD_T} x2={xAt(msShiftedQ)} y2={PAD_T + plotH} stroke={COLOR_MS_NEW} strokeWidth={2.5} strokeDasharray="6 4" />
            <text x={xAt(msShiftedQ)} y={PAD_T - 6} fontSize={12} fontWeight={600} fill={COLOR_MS_NEW} textAnchor="middle">
              Ms&apos;
            </text>
          </>
        )}

        {/* Md */}
        <line x1={mdLine.x1} y1={mdLine.y1} x2={mdLine.x2} y2={mdLine.y2} stroke={COLOR_MD} strokeWidth={2.5} />
        <text x={mdLine.x2 + 4} y={mdLine.y2 + 4} fontSize={12} fontWeight={600} fill={COLOR_MD}>
          Md
        </text>
        {mdShiftedLine && (
          <>
            <line x1={mdShiftedLine.x1} y1={mdShiftedLine.y1} x2={mdShiftedLine.x2} y2={mdShiftedLine.y2} stroke={COLOR_MD_NEW} strokeWidth={2.5} strokeDasharray="6 4" />
            <text x={mdShiftedLine.x2 + 4} y={mdShiftedLine.y2 + 4} fontSize={12} fontWeight={600} fill={COLOR_MD_NEW}>
              Md&apos;
            </text>
          </>
        )}

        {/* Initial equilibrium */}
        <circle cx={xAt(Q0)} cy={yAt(i0)} r={5} fill={COLOR_EQ} stroke="#fff" strokeWidth={2} />
        <line x1={xAt(Q0)} y1={yAt(i0)} x2={xAt(Q0)} y2={PAD_T + plotH} stroke={COLOR_EQ} strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
        <line x1={xAt(Q0)} y1={yAt(i0)} x2={PAD_L} y2={yAt(i0)} stroke={COLOR_EQ} strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
        <text x={xAt(Q0)} y={PAD_T + plotH + 14} fontSize={11} fill={COLOR_EQ} textAnchor="middle">Q₀</text>
        <text x={PAD_L - 6} y={yAt(i0) + 4} fontSize={11} fill={COLOR_EQ} textAnchor="end">i₀</text>

        {/* Final equilibrium */}
        {i1 !== undefined && Q1 !== undefined && (
          <>
            <circle cx={xAt(Q1)} cy={yAt(i1)} r={5} fill={COLOR_EQ_NEW} stroke="#fff" strokeWidth={2} />
            <line x1={xAt(Q1)} y1={yAt(i1)} x2={xAt(Q1)} y2={PAD_T + plotH} stroke="#a16207" strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
            <line x1={xAt(Q1)} y1={yAt(i1)} x2={PAD_L} y2={yAt(i1)} stroke="#a16207" strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
            <text x={xAt(Q1)} y={PAD_T + plotH + 14} fontSize={11} fill="#a16207" textAnchor="middle">Q₁</text>
            <text x={PAD_L - 6} y={yAt(i1) + 4} fontSize={11} fill="#a16207" textAnchor="end">i₁</text>
          </>
        )}

        {/* Axis labels */}
        <text x={PAD_L + plotW / 2} y={H - 18} fontSize={13} fontWeight={600} textAnchor="middle" fill="#374151">
          Quantity of Money
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
          Nominal Interest Rate
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
