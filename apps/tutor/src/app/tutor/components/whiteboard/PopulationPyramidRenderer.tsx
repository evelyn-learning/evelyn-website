'use client';

import { mathifyDollarSpans } from '@/lib/utils/export/latex-readable';
import React from 'react';
import {
  populationPyramidFeatureNames,
  type PopulationPyramidFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/environmental';

const COLOR_AXIS = '#1f2937';
const COLOR_MALE = '#2563eb';
const COLOR_FEMALE = '#db2777';
const COLOR_GRID = '#e5e7eb';

export function PopulationPyramidRenderer({ figure }: { figure: PopulationPyramidFigure }) {
  const { ageGroups, mode, maxValue, title, xLabel, ageGroupLabel } = figure;
  const N = populationPyramidFeatureNames;

  const W = 580;
  const PAD_L = 24;
  const PAD_R = 24;
  const PAD_T = title ? 54 : 30;
  const PAD_B = 48;
  // Center column reserved for age labels.
  const CENTER_W = 64;
  const ROW_H = 22;
  const H = PAD_T + ROW_H * ageGroups.length + PAD_B;

  const sideW = (W - PAD_L - PAD_R - CENTER_W) / 2;
  const centerX = PAD_L + sideW + CENTER_W / 2;

  // Top of each row (oldest at top)
  // Reverse so the oldest age group renders highest.
  const ordered = [...ageGroups].reverse();
  const rowY = (idx: number) => PAD_T + ROW_H * idx;

  // Bar widths
  // (the outer 40px of each side is kept free for the value printed at the bar's end)
  const VALUE_GUTTER = 40;
  const valueToWidth = (v: number) => (Math.max(0, v) / (maxValue || 1)) * (sideW - VALUE_GUTTER);

  // X-axis ticks (0% to maxValue, both sides)
  const tickValues: number[] = [];
  const step = niceStep(maxValue / 4);
  for (let v = 0; v <= maxValue; v += step) tickValues.push(v);

  const fmt = (v: number) => {
    if (mode === 'percent') {
      return `${Number(v.toFixed(1))}%`;
    }
    if (v >= 1000000) return `${Number((v / 1000000).toFixed(1))}M`;
    if (v >= 1000) return `${Number((v / 1000).toFixed(1))}k`;
    return String(Number(v.toFixed(0)));
  };

  // youngest is at the BOTTOM of the pyramid (last row drawn); oldest
  // at the TOP. Compute screen-space bboxes for base and top features.
  const ROWS = ageGroups.length;
  const baseRowY = rowY(ROWS - 1); // youngest = bottom = reversed last
  const topRowY = rowY(0); // oldest = top of pyramid
  return (
    <div
      className="population-pyramid-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'population pyramid'}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {title && (
          <text x={W / 2} y={20} fontSize={14} fontWeight={700} textAnchor="middle" fill="#111827">
            {mathifyDollarSpans(title)}
          </text>
        )}

        {/* Side legends */}
        <text x={centerX - CENTER_W / 2 - (sideW - VALUE_GUTTER) / 2} y={PAD_T - 10} fontSize={12} fontWeight={600} textAnchor="middle" fill={COLOR_MALE}>
          Male
        </text>
        <text x={centerX + CENTER_W / 2 + (sideW - VALUE_GUTTER) / 2} y={PAD_T - 10} fontSize={12} fontWeight={600} textAnchor="middle" fill={COLOR_FEMALE}>
          Female
        </text>

        {/* Age column header + the two zero lines either side of it (never through the labels) */}
        <text x={centerX} y={PAD_T - 10} fontSize={11} textAnchor="middle" fill="#6b7280" fontStyle="italic">
          {ageGroupLabel}
        </text>
        {/* Gridlines first, so the bars sit on top of them */}
        {tickValues.filter((v) => v > 0).map((v, i) => (
          <g key={`grid-${i}`}>
            <line x1={centerX - CENTER_W / 2 - valueToWidth(v)} y1={PAD_T} x2={centerX - CENTER_W / 2 - valueToWidth(v)} y2={PAD_T + ROW_H * ageGroups.length} stroke={COLOR_GRID} strokeWidth={1} />
            <line x1={centerX + CENTER_W / 2 + valueToWidth(v)} y1={PAD_T} x2={centerX + CENTER_W / 2 + valueToWidth(v)} y2={PAD_T + ROW_H * ageGroups.length} stroke={COLOR_GRID} strokeWidth={1} />
          </g>
        ))}

        {/* Males side collective bbox — covers the left half of the rows. */}
        <g
          data-feature={N.malesSide}
          data-feature-label="males"
          data-feature-cx={(PAD_L + sideW / 2) / W}
          data-feature-cy={(PAD_T + (ROW_H * ROWS) / 2) / H}
          data-feature-w={sideW / W}
          data-feature-h={(ROW_H * ROWS) / H}
        />
        <g
          data-feature={N.femalesSide}
          data-feature-label="females"
          data-feature-cx={(W - PAD_R - sideW / 2) / W}
          data-feature-cy={(PAD_T + (ROW_H * ROWS) / 2) / H}
          data-feature-w={sideW / W}
          data-feature-h={(ROW_H * ROWS) / H}
        />
        {/* Base + top markers — pedagogically the most-scribbled features
            (wide base = expanding; narrow top = young population). */}
        {ROWS > 0 && (
          <g
            data-feature={N.base}
            data-feature-label={`base (${ageGroups[0].ageLabel})`}
            data-feature-cx={centerX / W}
            data-feature-cy={(baseRowY + ROW_H / 2) / H}
            data-feature-w={(sideW * 2 + CENTER_W) / W}
            data-feature-h={ROW_H / H}
          />
        )}
        {ROWS > 0 && (
          <g
            data-feature={N.top}
            data-feature-label={`top (${ageGroups[ageGroups.length - 1].ageLabel})`}
            data-feature-cx={centerX / W}
            data-feature-cy={(topRowY + ROW_H / 2) / H}
            data-feature-w={(sideW * 2 + CENTER_W) / W}
            data-feature-h={ROW_H / H}
          />
        )}

        {/* Age-group rows */}
        {ordered.map((g, idx) => {
          const yTop = rowY(idx);
          const yMid = yTop + ROW_H / 2;
          const maleW = valueToWidth(g.male);
          const femaleW = valueToWidth(g.female);
          return (
            <g
              key={`row-${idx}`}
              data-feature={N.ageGroup(g.ageLabel)}
              data-feature-label={`age ${g.ageLabel}`}
              data-feature-cx={centerX / W}
              data-feature-cy={yMid / H}
              data-feature-w={(sideW * 2 + CENTER_W) / W}
              data-feature-h={ROW_H / H}
            >
              {/* male bar */}
              <rect
                x={centerX - CENTER_W / 2 - maleW} y={yTop + 2}
                width={maleW} height={ROW_H - 4}
                fill={COLOR_MALE} fillOpacity={0.8} stroke={COLOR_MALE} strokeWidth={1}
                data-feature={N.maleBar(g.ageLabel)}
                data-feature-label={`male ${g.ageLabel}`}
                data-feature-cx={(centerX - CENTER_W / 2 - maleW / 2) / W}
                data-feature-cy={yMid / H}
                data-feature-w={Math.max(maleW, 20) / W}
                data-feature-h={(ROW_H - 4) / H}
              />
              {/* female bar */}
              <rect
                x={centerX + CENTER_W / 2} y={yTop + 2}
                width={femaleW} height={ROW_H - 4}
                fill={COLOR_FEMALE} fillOpacity={0.75} stroke={COLOR_FEMALE} strokeWidth={1}
                data-feature={N.femaleBar(g.ageLabel)}
                data-feature-label={`female ${g.ageLabel}`}
                data-feature-cx={(centerX + CENTER_W / 2 + femaleW / 2) / W}
                data-feature-cy={yMid / H}
                data-feature-w={Math.max(femaleW, 20) / W}
                data-feature-h={(ROW_H - 4) / H}
              />
              {/* age label */}
              <text x={centerX} y={yMid + 4} fontSize={11} textAnchor="middle" fill={COLOR_AXIS} fontWeight={600}>
                {g.ageLabel}
              </text>
              {/* numeric values at bar ends */}
              {g.male > 0 && (
                <text
                  x={centerX - CENTER_W / 2 - maleW - 4}
                  y={yMid + 4}
                  fontSize={10}
                  textAnchor="end"
                  fill={COLOR_MALE}
                >
                  {fmt(g.male)}
                </text>
              )}
              {g.female > 0 && (
                <text
                  x={centerX + CENTER_W / 2 + femaleW + 4}
                  y={yMid + 4}
                  fontSize={10}
                  textAnchor="start"
                  fill={COLOR_FEMALE}
                >
                  {fmt(g.female)}
                </text>
              )}
            </g>
          );
        })}

        {/* X-axis ticks (under bars) */}
        {tickValues.map((v, i) => {
          const xLeftLeft = centerX - CENTER_W / 2 - valueToWidth(v);
          const xRightRight = centerX + CENTER_W / 2 + valueToWidth(v);
          const yAxis = PAD_T + ROW_H * ageGroups.length;
          return (
            <g key={`tick-${i}`}>
              <line x1={xLeftLeft} y1={yAxis} x2={xLeftLeft} y2={yAxis + 4} stroke={COLOR_AXIS} strokeWidth={1} />
              <line x1={xRightRight} y1={yAxis} x2={xRightRight} y2={yAxis + 4} stroke={COLOR_AXIS} strokeWidth={1} />
              {/* tick labels (left side) */}
              <text x={xLeftLeft} y={yAxis + 16} fontSize={10} textAnchor="middle" fill="#374151">
                {fmt(v)}
              </text>
              {/* tick labels (right side) */}
              <text x={xRightRight} y={yAxis + 16} fontSize={10} textAnchor="middle" fill="#374151">
                {fmt(v)}
              </text>
            </g>
          );
        })}

        {/* Axes: a baseline and a zero line for each side */}
        {[-1, 1].map((sgn) => {
          const x0 = centerX + sgn * (CENTER_W / 2);
          const yAxis = PAD_T + ROW_H * ageGroups.length;
          return (
            <g key={sgn}>
              <line x1={x0} y1={PAD_T} x2={x0} y2={yAxis} stroke={COLOR_AXIS} strokeWidth={1.25} />
              <line x1={x0} y1={yAxis} x2={x0 + sgn * (sideW - VALUE_GUTTER + 8)} y2={yAxis} stroke={COLOR_AXIS} strokeWidth={1.25} />
            </g>
          );
        })}

        {/* Axis labels */}
        <text x={W / 2} y={H - 8} fontSize={12} fontWeight={600} textAnchor="middle" fill="#374151">
          {xLabel ?? `Population (${mode === 'percent' ? '%' : 'count'})`}
        </text>
      </svg>
    </div>
  );
}

function niceStep(raw: number): number {
  if (raw <= 0) return 1;
  const exp = Math.floor(Math.log10(raw));
  const base = Math.pow(10, exp);
  const norm = raw / base;
  let step: number;
  if (norm < 1.5) step = 1;
  else if (norm < 3.5) step = 2;
  else if (norm < 7.5) step = 5;
  else step = 10;
  return step * base;
}
