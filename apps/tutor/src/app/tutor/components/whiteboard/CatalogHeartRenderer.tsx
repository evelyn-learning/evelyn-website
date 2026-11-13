'use client';

import React from 'react';
import {
  heartFeatureNames,
  type HeartFigure,
  type HeartPart,
} from '@/lib/tutor/diagrams/catalog/kinds/heart';

const BLUE = '#3b82f6', BLUE_F = '#dbeafe', BLUE_HI = '#93c5fd', BLUE_INK = '#1d4ed8';
const RED = '#ef4444', RED_F = '#fee2e2', RED_HI = '#fca5a5', RED_INK = '#b91c1c';
const WALL = '#9f1239';
const HI = '#d97706';
const INK = '#1f2937', MUT = '#64748b';

/** Heart silhouette (front view: the heart's right side is on the viewer's left). */
const HEART_PATH = 'M 320 432 C 215 388, 150 305, 160 222 C 165 172, 215 150, 265 160 C 285 162, 305 166, 320 174 C 335 166, 355 162, 375 160 C 425 150, 475 172, 480 222 C 490 305, 425 388, 320 432 Z';
const AV_Y = 250;      // level of the atrioventricular valves
const SEPTUM_X = 320;

export function CatalogHeartRenderer({ figure }: { figure: HeartFigure }) {
  const N = heartFeatureNames;
  const hi = (p: HeartPart) => figure.highlight.includes(p);
  const W = 740, H = 500, OX = 34;

  /** A blood vessel: a thick coloured tube; a highlighted one gets an amber casing. */
  const tube = (part: HeartPart, d: string, deoxy: boolean, width: number, cap: 'round' | 'butt' = 'round') => (
    <g>
      {hi(part) && <path d={d} fill="none" stroke={HI} strokeWidth={width + 7} strokeLinecap={cap} strokeLinejoin="round" />}
      <path d={d} fill="none" stroke={deoxy ? BLUE : RED} strokeWidth={width} strokeLinecap={cap} strokeLinejoin="round" />
    </g>
  );

  /** Small white chevron inside a tube showing which way the blood moves (angle in degrees, 0 = right). */
  const chevron = (x: number, y: number, angle: number, color = '#ffffff') => (
    <path d="M -4 -5 L 3 0 L -4 5" transform={`translate(${x} ${y}) rotate(${angle})`} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  );

  const flow = (x1: number, y1: number, x2: number, y2: number, color: string) => {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len, px = -uy, py = ux, s = 8;
    return (
      <g>
        <line x1={x1} y1={y1} x2={x2 - ux * 4} y2={y2 - uy * 4} stroke={color} strokeWidth={2.2} strokeLinecap="round" />
        <polygon points={`${x2},${y2} ${x2 - ux * s + px * s * 0.6},${y2 - uy * s + py * s * 0.6} ${x2 - ux * s - px * s * 0.6},${y2 - uy * s - py * s * 0.6}`} fill={color} />
      </g>
    );
  };

  const chamberLabel = (part: HeartPart, x: number, y: number, l1: string, l2: string, deoxy: boolean) => (
    <g data-feature={N.part(part)} data-feature-label={`${l1} ${l2}`} data-feature-cx={(x + OX) / W} data-feature-cy={y / H} data-feature-w={110 / W} data-feature-h={70 / H}>
      {hi(part) && <rect x={x - 42} y={y - 17} width={84} height={38} rx={8} fill="#fffbeb" stroke={HI} strokeWidth={2} />}
      <text x={x} y={y} fontSize={13} textAnchor="middle" fill={hi(part) ? '#92400e' : deoxy ? BLUE_INK : RED_INK} fontWeight={700}>
        <tspan x={x} dy={0}>{l1}</tspan>
        <tspan x={x} dy={15}>{l2}</tspan>
      </text>
    </g>
  );

  /** Side label with a leader to a point on the vessel. */
  const sideLabel = (part: HeartPart, side: 'left' | 'right', y: number, name: string, sub: string, ax: number, ay: number, deoxy: boolean) => {
    const tx = side === 'left' ? 100 : 572;
    const lead = side === 'left' ? tx + 6 : tx - 6;
    const color = hi(part) ? '#92400e' : deoxy ? BLUE_INK : RED_INK;
    return (
      <g data-feature={N.part(part)} data-feature-label={name}>
        <line x1={lead} y1={y - 4} x2={ax} y2={ay} stroke="#475569" strokeWidth={0.9} />
        <circle cx={ax} cy={ay} r={2.2} fill="#475569" />
        <text x={tx} y={y} fontSize={12.5} fontWeight={700} fill={color} textAnchor={side === 'left' ? 'end' : 'start'}>{name}</text>
        <text x={tx} y={y + 14} fontSize={10.5} fill={MUT} textAnchor={side === 'left' ? 'end' : 'start'}>{sub}</text>
      </g>
    );
  };

  const quadrant = (part: HeartPart, x: number, y: number, w: number, h: number, deoxy: boolean) => (
    <rect x={x} y={y} width={w} height={h} fill={hi(part) ? (deoxy ? BLUE_HI : RED_HI) : (deoxy ? BLUE_F : RED_F)} />
  );

  return (
    <div className="heart-renderer w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[700px]" data-feature={N.heart} data-feature-label={figure.title || 'heart'} data-feature-cx={0.5} data-feature-cy={0.5} data-feature-w={1} data-feature-h={1}>
        <defs>
          <clipPath id="heart-clip"><path d={HEART_PATH} /></clipPath>
        </defs>
        <g transform={`translate(${OX} 0)`}>
          {/* ── vessels that run BEHIND the heart ── */}
          {tube('vena_cava', 'M 205 40 L 205 190', true, 22, 'butt')}{/* superior vena cava */}
          {tube('vena_cava', 'M 120 462 C 120 380, 116 300, 150 246 L 176 232', true, 17, 'butt')}{/* inferior vena cava */}
          {tube('aorta', 'M 432 96 L 432 190', false, 22, 'butt')}{/* descending aorta */}
          {tube('pulmonary_vein', 'M 562 196 L 468 204', false, 13, 'butt')}
          {tube('pulmonary_vein', 'M 562 232 L 470 232', false, 13, 'butt')}
          {chevron(205, 84, 90)}{chevron(205, 124, 90)}
          {chevron(120, 400, -90)}{chevron(119, 350, -90)}
          {chevron(534, 198, 175)}{chevron(534, 232, 180)}

          {/* ── the heart: four chambers inside one muscular wall ── */}
          <g clipPath="url(#heart-clip)">
            {quadrant('right_atrium', 100, 100, SEPTUM_X - 100, AV_Y - 100, true)}
            {quadrant('right_ventricle', 100, AV_Y, SEPTUM_X - 100, 220, true)}
            {quadrant('left_atrium', SEPTUM_X, 100, 240, AV_Y - 100, false)}
            {quadrant('left_ventricle', SEPTUM_X, AV_Y, 240, 220, false)}
            {/* wall between atria and ventricles, open at the two valves */}
            <path d={`M 100 ${AV_Y} L 214 ${AV_Y} M 266 ${AV_Y} L 384 ${AV_Y} M 436 ${AV_Y} L 560 ${AV_Y}`} stroke={WALL} strokeWidth={5} fill="none" />
            {/* septum */}
            <line x1={SEPTUM_X} y1={160} x2={SEPTUM_X} y2={440} stroke={WALL} strokeWidth={9} />
          </g>
          <path d={HEART_PATH} fill="none" stroke={WALL} strokeWidth={5} strokeLinejoin="round" />
          {/* valve flaps (open, pointing into the ventricles) */}
          {[[214, 266], [384, 436]].map(([a, b]) => (
            <g key={a} stroke={WALL} strokeWidth={2.5} strokeLinecap="round">
              <line x1={a} y1={AV_Y} x2={a + 15} y2={AV_Y + 17} />
              <line x1={b} y1={AV_Y} x2={b - 15} y2={AV_Y + 17} />
            </g>
          ))}

          {/* ── vessels that leave from the FRONT of the heart ── */}
          {/* pulmonary artery: out of the right ventricle, then a branch to each lung */}
          {tube('pulmonary_artery', 'M 292 300 L 292 124 M 236 112 L 474 112', true, 19, 'round')}
          {/* aorta: out of the left ventricle, over the arch, then down behind the heart */}
          {tube('aorta', 'M 350 298 L 350 100 C 350 44, 432 44, 432 97', false, 22, 'round')}
          {chevron(292, 230, -90)}{chevron(292, 170, -90)}{chevron(250, 112, 180)}{chevron(462, 112, 0)}
          {chevron(350, 220, -90)}{chevron(350, 150, -90)}{chevron(392, 58, 0)}{chevron(432, 150, 90)}

          {/* flow through the valves */}
          {flow(240, 226, 240, 270, BLUE_INK)}
          {flow(410, 226, 410, 270, RED_INK)}
          <text x={240} y={288} fontSize={10} textAnchor="middle" fill={WALL} fontStyle="italic">tricuspid valve</text>
          <text x={410} y={288} fontSize={10} textAnchor="middle" fill={WALL} fontStyle="italic">mitral valve</text>

          {/* chamber names */}
          {chamberLabel('right_atrium', 236, 200, 'Right', 'atrium', true)}
          {chamberLabel('left_atrium', 414, 196, 'Left', 'atrium', false)}
          {chamberLabel('right_ventricle', 246, 326, 'Right', 'ventricle', true)}
          {chamberLabel('left_ventricle', 398, 326, 'Left', 'ventricle', false)}

          {/* vessel names, in the side margins */}
          {sideLabel('vena_cava', 'left', 70, 'Superior vena cava', 'from the upper body', 193, 66, true)}
          {sideLabel('vena_cava', 'left', 420, 'Inferior vena cava', 'from the lower body', 111, 416, true)}
          {sideLabel('aorta', 'right', 52, 'Aorta', 'to the whole body', 410, 50, false)}
          {sideLabel('pulmonary_artery', 'right', 122, 'Pulmonary artery', 'to the lungs', 480, 112, true)}
          {sideLabel('pulmonary_vein', 'right', 222, 'Pulmonary veins', 'from the lungs', 556, 198, false)}

          {/* key */}
          <g transform="translate(196 462)">
            <rect x={0} y={0} width={22} height={10} rx={3} fill={BLUE} />
            <text x={28} y={9.5} fontSize={11.5} fill={INK}>deoxygenated blood</text>
            <rect x={150} y={0} width={22} height={10} rx={3} fill={RED} />
            <text x={178} y={9.5} fontSize={11.5} fill={INK}>oxygenated blood</text>
          </g>
        </g>
      </svg>
    </div>
  );
}
