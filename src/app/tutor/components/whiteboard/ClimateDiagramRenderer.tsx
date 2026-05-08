'use client';

import React from 'react';
import type { ClimateDiagramFigure } from '@/lib/tutor/diagrams/catalog/kinds/environmental';

const COLOR_AXIS = '#1f2937';
const COLOR_TEMP = '#dc2626';
const COLOR_PRECIP = '#2563eb';
const COLOR_GRID = '#e5e7eb';

export function ClimateDiagramRenderer({ figure }: { figure: ClimateDiagramFigure }) {
  const { months, tempUnit, precipUnit, location, title, meanAnnualTemp, totalAnnualPrecip } = figure;

  const W = 580;
  const H = 380;
  const PAD_L = 56;
  const PAD_R = 56;
  const PAD_T = 56;
  const PAD_B = 56;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  // Temp range
  const tempMin = Math.min(0, ...months.map((m) => m.temp));
  const tempMax = Math.max(...months.map((m) => m.temp));
  const tMin = Math.floor((tempMin - 5) / 10) * 10;
  const tMax = Math.ceil((tempMax + 5) / 10) * 10;

  // Precip range — Walter-Lieth: precip y-axis 2× temp axis numerically.
  // i.e., 10°C aligns with 20mm precipitation.
  const pMax = Math.max(...months.map((m) => m.precip), 50);
  // Pick a clean precip max
  const pAxisMax = Math.ceil(pMax / 50) * 50;

  const tempY = (t: number) => PAD_T + plotH - ((t - tMin) / (tMax - tMin)) * plotH;
  const precipY = (p: number) => PAD_T + plotH - (p / pAxisMax) * plotH;

  const colW = plotW / months.length;
  const colCenter = (i: number) => PAD_L + colW * (i + 0.5);

  // Temperature line points
  const tempPath = months
    .map((m, i) => `${i === 0 ? 'M' : 'L'}${colCenter(i).toFixed(2)},${tempY(m.temp).toFixed(2)}`)
    .join(' ');

  // Y-axis ticks
  const tempTicks: number[] = [];
  const tempStep = (tMax - tMin) / 4;
  for (let i = 0; i <= 4; i += 1) tempTicks.push(tMin + tempStep * i);

  const precipTicks: number[] = [];
  const precipStep = pAxisMax / 4;
  for (let i = 0; i <= 4; i += 1) precipTicks.push(precipStep * i);

  return (
    <div className="climate-diagram-renderer w-full flex flex-col items-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {(title || location) && (
          <text x={W / 2} y={20} fontSize={14} fontWeight={700} textAnchor="middle" fill="#111827">
            {title ?? location}
          </text>
        )}
        {title && location && (
          <text x={W / 2} y={36} fontSize={11} textAnchor="middle" fill="#6b7280" fontStyle="italic">
            {location}
          </text>
        )}

        {/* horizontal gridlines */}
        {tempTicks.map((t, i) => (
          <line key={`gy-${i}`} x1={PAD_L} y1={tempY(t)} x2={PAD_L + plotW} y2={tempY(t)} stroke={COLOR_GRID} strokeWidth={1} />
        ))}

        {/* precipitation bars */}
        {months.map((m, i) => {
          const x = colCenter(i) - colW * 0.32;
          const y = precipY(m.precip);
          const yBase = precipY(0);
          return (
            <rect
              key={`bar-${i}`}
              x={x}
              y={y}
              width={colW * 0.64}
              height={Math.max(0, yBase - y)}
              fill={COLOR_PRECIP}
              fillOpacity={0.55}
              stroke={COLOR_PRECIP}
              strokeWidth={1}
            />
          );
        })}

        {/* zero temperature line if it falls inside range */}
        {tMin < 0 && tMax > 0 && (
          <line
            x1={PAD_L}
            y1={tempY(0)}
            x2={PAD_L + plotW}
            y2={tempY(0)}
            stroke="#9ca3af"
            strokeWidth={1}
            strokeDasharray="4 3"
          />
        )}

        {/* temperature line */}
        <path d={tempPath} fill="none" stroke={COLOR_TEMP} strokeWidth={2.5} />
        {months.map((m, i) => (
          <circle
            key={`pt-${i}`}
            cx={colCenter(i)}
            cy={tempY(m.temp)}
            r={3.5}
            fill={COLOR_TEMP}
            stroke="#fff"
            strokeWidth={1.4}
          />
        ))}

        {/* axes */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />
        <line x1={PAD_L + plotW} y1={PAD_T} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />

        {/* temp tick labels (LEFT axis) */}
        {tempTicks.map((t, i) => (
          <g key={`tt-${i}`}>
            <line x1={PAD_L - 4} y1={tempY(t)} x2={PAD_L} y2={tempY(t)} stroke={COLOR_AXIS} strokeWidth={1} />
            <text x={PAD_L - 6} y={tempY(t) + 4} fontSize={11} textAnchor="end" fill={COLOR_TEMP}>
              {Number(t.toFixed(0))}
            </text>
          </g>
        ))}

        {/* precip tick labels (RIGHT axis) */}
        {precipTicks.map((p, i) => (
          <g key={`pt-${i}`}>
            <line x1={PAD_L + plotW} y1={precipY(p)} x2={PAD_L + plotW + 4} y2={precipY(p)} stroke={COLOR_AXIS} strokeWidth={1} />
            <text x={PAD_L + plotW + 6} y={precipY(p) + 4} fontSize={11} textAnchor="start" fill={COLOR_PRECIP}>
              {Number(p.toFixed(0))}
            </text>
          </g>
        ))}

        {/* month labels */}
        {months.map((m, i) => (
          <text key={`m-${i}`} x={colCenter(i)} y={PAD_T + plotH + 16} fontSize={10} textAnchor="middle" fill="#374151">
            {m.label}
          </text>
        ))}

        {/* axis titles */}
        <text x={PAD_L - 32} y={PAD_T + plotH / 2} fontSize={12} fontWeight={600} textAnchor="middle" fill={COLOR_TEMP} transform={`rotate(-90 ${PAD_L - 32} ${PAD_T + plotH / 2})`}>
          Temp ({tempUnit})
        </text>
        <text x={PAD_L + plotW + 38} y={PAD_T + plotH / 2} fontSize={12} fontWeight={600} textAnchor="middle" fill={COLOR_PRECIP} transform={`rotate(90 ${PAD_L + plotW + 38} ${PAD_T + plotH / 2})`}>
          Precip ({precipUnit})
        </text>

        {/* annual summary */}
        {(meanAnnualTemp !== undefined || totalAnnualPrecip !== undefined) && (
          <text x={W / 2} y={H - 14} fontSize={11} textAnchor="middle" fill="#374151">
            {meanAnnualTemp !== undefined && <tspan fill={COLOR_TEMP}>Annual mean {Number(meanAnnualTemp.toFixed(1))}{tempUnit}</tspan>}
            {meanAnnualTemp !== undefined && totalAnnualPrecip !== undefined && <tspan>   ·   </tspan>}
            {totalAnnualPrecip !== undefined && <tspan fill={COLOR_PRECIP}>Total {Number(totalAnnualPrecip.toFixed(0))} {precipUnit}/yr</tspan>}
          </text>
        )}
      </svg>
    </div>
  );
}
