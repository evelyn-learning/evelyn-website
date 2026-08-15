'use client';

import React from 'react';
import {
  cellEnergyFeatureNames,
  type CellEnergyFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/cell-energy';

const GREEN = '#16a34a', GREEN_F = '#dcfce7';
const PURPLE = '#7c3aed', PURPLE_F = '#ede9fe';
const INK = '#1f2937', MUT = '#6b7280';

function arrow(x1: number, y1: number, x2: number, y2: number, color: string, w = 2): React.ReactNode {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len, px = -uy, py = ux, s = 8;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - ux * 4} y2={y2 - uy * 4} stroke={color} strokeWidth={w} />
      <polygon points={`${x2},${y2} ${x2 - ux * s + px * s * 0.55},${y2 - uy * s + py * s * 0.55} ${x2 - ux * s - px * s * 0.55},${y2 - uy * s - py * s * 0.55}`} fill={color} />
    </g>
  );
}
function tlabel(x: number, y: number, text: string, color = INK, size = 12, weight = 600, anchor: 'start' | 'middle' | 'end' = 'middle') {
  return <text x={x} y={y} fontSize={size} fill={color} fontWeight={weight} textAnchor={anchor}>{text}</text>;
}
/** Circular process arrow (a cycle). */
function cycle(cx: number, cy: number, r: number, color: string) {
  return (
    <g>
      <path d={`M ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx + r * Math.cos(-0.5)} ${cy + r * Math.sin(-0.5)}`} fill="none" stroke={color} strokeWidth={2} />
      {arrow(cx + r * Math.cos(-0.35), cy + r * Math.sin(-0.35), cx + r * Math.cos(-0.55), cy + r * Math.sin(-0.55), color, 2)}
    </g>
  );
}

export function CatalogCellEnergyRenderer({ figure }: { figure: CellEnergyFigure }) {
  const N = cellEnergyFeatureNames;
  const W = 600;
  const photo = figure.process === 'photosynthesis';
  const H = photo ? 430 : 470;

  return (
    <div className="cell-energy-renderer w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[600px]" data-feature={N.organelle} data-feature-label={figure.title || figure.process} data-feature-cx={0.5} data-feature-cy={0.5} data-feature-w={1} data-feature-h={1}>
        {photo ? (
          <>
            {/* chloroplast (double membrane) */}
            <rect x={70} y={96} width={460} height={250} rx={120} fill={GREEN_F} stroke={GREEN} strokeWidth={2.5} />
            <rect x={80} y={106} width={440} height={230} rx={112} fill="none" stroke={GREEN} strokeWidth={1.2} opacity={0.6} />
            {tlabel(W / 2, 330, 'Chloroplast', GREEN, 12, 700)}

            {/* light reactions — thylakoid grana (left) */}
            <g data-feature={N.stage('light_reactions')} data-feature-label="light reactions">
              {[0, 1, 2].map((s) => (
                <g key={s}>
                  {[0, 1, 2, 3].map((d) => (
                    <ellipse key={d} cx={150 + s * 34} cy={185 + d * 16} rx={15} ry={6} fill="#86efac" stroke={GREEN} strokeWidth={1.2} />
                  ))}
                </g>
              ))}
              {tlabel(178, 268, 'Light reactions', GREEN, 12, 700)}
              {tlabel(178, 283, '(thylakoid)', MUT, 10.5, 600)}
            </g>

            {/* Calvin cycle (right, stroma) */}
            <g data-feature={N.stage('calvin_cycle')} data-feature-label="Calvin cycle">
              {cycle(400, 215, 34, PURPLE)}
              {tlabel(400, 219, 'Calvin', PURPLE, 12, 700)}
              {tlabel(400, 270, 'Calvin cycle', PURPLE, 12, 700)}
              {tlabel(400, 285, '(stroma)', MUT, 10.5, 600)}
            </g>

            {/* internal: ATP + NADPH from thylakoid → Calvin */}
            {arrow(238, 220, 360, 218, '#ca8a04', 2)}
            {tlabel(300, 210, 'ATP + NADPH', '#ca8a04', 11, 700)}

            {/* inputs */}
            <circle cx={48} cy={44} r={15} fill="#fde047" stroke="#ca8a04" strokeWidth={1.5} />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = (i / 8) * 2 * Math.PI; return <line key={i} x1={48 + 17 * Math.cos(a)} y1={44 + 17 * Math.sin(a)} x2={48 + 23 * Math.cos(a)} y2={44 + 23 * Math.sin(a)} stroke="#ca8a04" strokeWidth={1.5} />; })}
            {arrow(70, 60, 140, 150, '#ca8a04')}
            {tlabel(86, 96, 'Light', '#ca8a04', 12, 700, 'start')}
            {arrow(150, 400, 150, 250, '#2563eb')}
            {tlabel(150, 414, 'H₂O', '#2563eb', 12.5, 700)}
            {arrow(560, 215, 444, 215, '#6b7280')}
            {tlabel(575, 219, 'CO₂', INK, 12.5, 700)}

            {/* outputs */}
            {arrow(150, 165, 150, 60, '#0ea5e9')}
            {tlabel(150, 50, 'O₂', '#0ea5e9', 12.5, 700)}
            {arrow(400, 300, 400, 400, '#b45309')}
            {tlabel(400, 414, 'Glucose (G3P)', '#b45309', 12.5, 700)}
          </>
        ) : (
          <>
            {/* glycolysis (cytoplasm, outside the mitochondrion) */}
            {arrow(300, 18, 300, 44, INK)}
            {tlabel(300, 14, 'Glucose', INK, 12.5, 700)}
            <g data-feature={N.stage('glycolysis')} data-feature-label="glycolysis">
              <rect x={170} y={46} width={260} height={48} rx={10} fill="#fef9c3" stroke="#ca8a04" strokeWidth={2} />
              {tlabel(300, 66, 'Glycolysis  (cytoplasm)', '#92400e', 12.5, 700)}
              {tlabel(300, 84, 'glucose → 2 pyruvate  (+2 ATP)', MUT, 11, 600)}
            </g>
            {arrow(300, 96, 300, 156, INK)}
            {tlabel(330, 128, '2 pyruvate', INK, 11.5, 700, 'start')}

            {/* mitochondrion (double membrane + cristae) */}
            <rect x={70} y={158} width={460} height={278} rx={130} fill={PURPLE_F} stroke={PURPLE} strokeWidth={2.5} />
            <path d="M 90 230 Q 150 250 100 290 Q 150 330 100 370 Q 160 390 110 410" fill="none" stroke={PURPLE} strokeWidth={1.5} opacity={0.7} />
            {tlabel(W / 2, 424, 'Mitochondrion', PURPLE, 12, 700)}

            {/* Krebs cycle (matrix) */}
            <g data-feature={N.stage('krebs')} data-feature-label="Krebs cycle">
              {cycle(250, 250, 36, '#16a34a')}
              {tlabel(250, 254, 'Krebs', '#16a34a', 12, 700)}
              {tlabel(250, 308, 'Krebs cycle', '#16a34a', 12, 700)}
              {tlabel(250, 323, '(matrix)', MUT, 10.5, 600)}
            </g>

            {/* electron transport chain (inner membrane) */}
            <g data-feature={N.stage('etc')} data-feature-label="electron transport chain">
              <rect x={350} y={220} width={150} height={60} rx={10} fill="#dbeafe" stroke="#2563eb" strokeWidth={2} />
              {tlabel(425, 244, 'Electron transport', '#1e3a8a', 11.5, 700)}
              {tlabel(425, 260, 'chain → ~34 ATP', '#1e3a8a', 11.5, 700)}
              {tlabel(425, 300, '(inner membrane)', MUT, 10.5, 600)}
            </g>

            {/* internal arrows + I/O */}
            {arrow(290, 250, 346, 250, '#16a34a')}
            {tlabel(318, 242, 'NADH', '#16a34a', 10.5, 700)}
            {arrow(560, 250, 506, 250, '#6b7280')}
            {tlabel(575, 254, 'O₂', INK, 12.5, 700)}
            {arrow(250, 300, 250, 388, '#6b7280')}
            {tlabel(250, 404, 'CO₂', INK, 12.5, 700)}
            {arrow(425, 286, 425, 388, '#0ea5e9')}
            {tlabel(425, 404, 'H₂O', '#0ea5e9', 12.5, 700)}
            {arrow(500, 250, 560, 210, '#b45309')}
            {tlabel(560, 200, 'ATP', '#b45309', 13, 800)}
          </>
        )}
      </svg>
    </div>
  );
}
