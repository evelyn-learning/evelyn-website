'use client';

import React from 'react';
import {
  heartFeatureNames,
  type HeartFigure,
  type HeartPart,
} from '@/lib/tutor/diagrams/catalog/kinds/heart';

const BLUE = '#2563eb', BLUE_F = '#dbeafe';
const RED = '#dc2626', RED_F = '#fee2e2';
const HI = '#d97706';

export function CatalogHeartRenderer({ figure }: { figure: HeartFigure }) {
  const N = heartFeatureNames;
  const hi = (p: HeartPart) => figure.highlight.includes(p);
  const W = 560, H = 480;

  const chamber = (part: HeartPart, x: number, y: number, w: number, h: number, deoxy: boolean, label: string) => {
    const stroke = hi(part) ? HI : deoxy ? BLUE : RED;
    return (
      <g data-feature={N.part(part)} data-feature-label={label}>
        <rect x={x} y={y} width={w} height={h} rx={14} fill={deoxy ? BLUE_F : RED_F} stroke={stroke} strokeWidth={hi(part) ? 3.5 : 2} />
        <text x={x + w / 2} y={y + h / 2 + 4} fontSize={12.5} textAnchor="middle" fill="#1f2937" fontWeight={600}>
          {label.split(' ').map((word, i) => (
            <tspan key={i} x={x + w / 2} dy={i === 0 ? 0 : 14}>{word}</tspan>
          ))}
        </text>
      </g>
    );
  };

  const vessel = (part: HeartPart, d: string, deoxy: boolean, label: string, lx: number, ly: number, anchor: 'start' | 'middle' | 'end' = 'middle') => {
    const color = hi(part) ? HI : deoxy ? BLUE : RED;
    return (
      <g data-feature={N.part(part)} data-feature-label={label}>
        <path d={d} fill="none" stroke={color} strokeWidth={hi(part) ? 16 : 13} strokeLinecap="round" opacity={0.85} />
        <text x={lx} y={ly} fontSize={11.5} fill={color} fontWeight={700} textAnchor={anchor}>{label}</text>
      </g>
    );
  };

  const flow = (x1: number, y1: number, x2: number, y2: number, color: string) => {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len, px = -uy, py = ux, s = 7;
    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2} />
        <polygon points={`${x2},${y2} ${x2 - ux * s + px * s * 0.6},${y2 - uy * s + py * s * 0.6} ${x2 - ux * s - px * s * 0.6},${y2 - uy * s - py * s * 0.6}`} fill={color} />
      </g>
    );
  };

  return (
    <div className="heart-renderer w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[560px]" data-feature={N.heart} data-feature-label={figure.title || 'heart'} data-feature-cx={0.5} data-feature-cy={0.5} data-feature-w={1} data-feature-h={1}>
        {/* legend */}
        <rect x={150} y={18} width={13} height={13} rx={2} fill={BLUE_F} stroke={BLUE} strokeWidth={1.5} />
        <text x={168} y={29} fontSize={11.5} fill="#374151">Deoxygenated</text>
        <rect x={290} y={18} width={13} height={13} rx={2} fill={RED_F} stroke={RED} strokeWidth={1.5} />
        <text x={308} y={29} fontSize={11.5} fill="#374151">Oxygenated</text>

        {/* great vessels (under chambers) — labels staggered into two rows */}
        {vessel('vena_cava', 'M 160 86 L 178 200', true, 'Vena cava', 160, 60, 'middle')}
        {vessel('pulmonary_artery', 'M 250 256 L 250 90', true, 'Pulmonary artery', 250, 46, 'middle')}
        {vessel('aorta', 'M 305 256 C 305 160 322 112 332 90', false, 'Aorta', 338, 60, 'middle')}
        {vessel('pulmonary_vein', 'M 418 86 L 392 200', false, 'Pulmonary veins', 418, 46, 'middle')}

        {/* chambers */}
        {chamber('right_atrium', 152, 190, 96, 60, true, 'Right atrium')}
        {chamber('left_atrium', 312, 190, 96, 60, false, 'Left atrium')}
        {chamber('right_ventricle', 150, 256, 118, 128, true, 'Right ventricle')}
        {chamber('left_ventricle', 296, 256, 122, 140, false, 'Left ventricle')}
        {/* septum */}
        <line x1={283} y1={256} x2={283} y2={384} stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 4" />

        {/* blood-flow arrows */}
        {flow(200, 252, 200, 292, BLUE)}{/* RA → RV */}
        {flow(360, 252, 360, 300, RED)}{/* LA → LV */}
        {flow(250, 256, 250, 224, BLUE)}{/* RV → pulmonary artery */}
        {flow(312, 256, 308, 226, RED)}{/* LV → aorta */}
        {flow(168, 178, 184, 196, BLUE)}{/* vena cava → RA */}
        {flow(408, 178, 392, 196, RED)}{/* pulmonary veins → LA */}
      </svg>
    </div>
  );
}
