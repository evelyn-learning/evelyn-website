'use client';

import React from 'react';
import type { PopulationPyramidFigure } from '@/lib/tutor/diagrams/catalog/kinds/environmental';

const COLOR_AXIS = '#1f2937';
const COLOR_MALE = '#2563eb';
const COLOR_FEMALE = '#db2777';
const COLOR_GRID = '#e5e7eb';

export function PopulationPyramidRenderer({ figure }: { figure: PopulationPyramidFigure }) {
  const { ageGroups, mode, maxValue, title, xLabel, ageGroupLabel } = figure;

  const W = 580;
  const PAD_L = 24;
  const PAD_R = 24;
  const PAD_T = title ? 40 : 24;
  const PAD_B = 60;
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
  const valueToWidth = (v: number) => (v / maxValue) * sideW;

  // X-axis ticks (0% to maxValue, both sides)
  const tickValues: number[] = [];
  const step = niceStep(maxValue / 4);
  for (let v = 0; v <= maxValue; v += step) tickValues.push(v);

  const fmt = (v: number) => {
    if (mode === 'percent') {
      return `${Number(v.toFixed(1))}%`;
    }
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
    return String(Number(v.toFixed(0)));
  };

  return (
    <div className="population-pyramid-renderer w-full flex flex-col items-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {title && (
          <text x={W / 2} y={20} fontSize={14} fontWeight={700} textAnchor="middle" fill="#111827">
            {title}
          </text>
        )}

        {/* Side legends */}
        <text x={PAD_L + sideW / 2} y={PAD_T - 10} fontSize={12} fontWeight={600} textAnchor="middle" fill={COLOR_MALE}>
          Male
        </text>
        <text x={W - PAD_R - sideW / 2} y={PAD_T - 10} fontSize={12} fontWeight={600} textAnchor="middle" fill={COLOR_FEMALE}>
          Female
        </text>

        {/* Vertical center axis */}
        <line
          x1={centerX}
          y1={PAD_T}
          x2={centerX}
          y2={PAD_T + ROW_H * ageGroups.length}
          stroke={COLOR_AXIS}
          strokeWidth={1.5}
        />

        {/* Age-group rows */}
        {ordered.map((g, idx) => {
          const yTop = rowY(idx);
          const yMid = yTop + ROW_H / 2;
          const maleW = valueToWidth(g.male);
          const femaleW = valueToWidth(g.female);
          return (
            <g key={`row-${idx}`}>
              {/* male bar */}
              <rect
                x={centerX - CENTER_W / 2 - maleW}
                y={yTop + 2}
                width={maleW}
                height={ROW_H - 4}
                fill={COLOR_MALE}
                fillOpacity={0.75}
                stroke={COLOR_MALE}
                strokeWidth={1}
              />
              {/* female bar */}
              <rect
                x={centerX + CENTER_W / 2}
                y={yTop + 2}
                width={femaleW}
                height={ROW_H - 4}
                fill={COLOR_FEMALE}
                fillOpacity={0.75}
                stroke={COLOR_FEMALE}
                strokeWidth={1}
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
              {/* gridlines */}
              {v > 0 && (
                <>
                  <line x1={xLeftLeft} y1={PAD_T} x2={xLeftLeft} y2={yAxis} stroke={COLOR_GRID} strokeWidth={1} />
                  <line x1={xRightRight} y1={PAD_T} x2={xRightRight} y2={yAxis} stroke={COLOR_GRID} strokeWidth={1} />
                </>
              )}
              {/* tick labels (left side) */}
              <text x={xLeftLeft} y={yAxis + 16} fontSize={10} textAnchor="middle" fill="#374151">
                {fmt(v)}
              </text>
              {/* tick labels (right side) */}
              {v > 0 && (
                <text x={xRightRight} y={yAxis + 16} fontSize={10} textAnchor="middle" fill="#374151">
                  {fmt(v)}
                </text>
              )}
            </g>
          );
        })}

        {/* Bottom axis line */}
        <line
          x1={PAD_L}
          y1={PAD_T + ROW_H * ageGroups.length}
          x2={W - PAD_R}
          y2={PAD_T + ROW_H * ageGroups.length}
          stroke={COLOR_AXIS}
          strokeWidth={1.5}
        />

        {/* Axis labels */}
        <text x={W / 2} y={H - 8} fontSize={12} fontWeight={600} textAnchor="middle" fill="#374151">
          {xLabel ?? `Population (${mode === 'percent' ? '%' : 'count'})`}
        </text>
        <text x={centerX} y={H - 28} fontSize={11} textAnchor="middle" fill="#6b7280" fontStyle="italic">
          {ageGroupLabel}
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
