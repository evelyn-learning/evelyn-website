'use client';

import React from 'react';
import {
  conicSectionsFeatureNames,
  CONIC_CUT,
  type ConicSectionsFigure,
  type ConicSlice,
} from '@/lib/tutor/diagrams/catalog/kinds/conic-sections';

const COLOR: Record<ConicSlice, string> = {
  circle: '#dc2626',
  ellipse: '#2563eb',
  parabola: '#16a34a',
  hyperbola: '#d97706',
};
const TITLECASE: Record<ConicSlice, string> = {
  circle: 'Circle',
  ellipse: 'Ellipse',
  parabola: 'Parabola',
  hyperbola: 'Hyperbola',
};

// One cell: a double cone (bowtie) cut by a plane at the characteristic angle,
// with the resulting conic drawn in the slice's color. Local coords 0..CW × 0..CH.
const CW = 280;
const CH = 250;
const CX = 140;
const WAIST = 104;
const NAPPE = 74;
const RX = 50;
const RY = 14;
const TOPY = WAIST - NAPPE; // 30
const BOTY = WAIST + NAPPE; // 178

function DoubleCone() {
  const g = '#94a3b8';
  return (
    <g>
      {/* slants */}
      <line x1={CX} y1={WAIST} x2={CX - RX} y2={TOPY} stroke={g} strokeWidth={1.5} />
      <line x1={CX} y1={WAIST} x2={CX + RX} y2={TOPY} stroke={g} strokeWidth={1.5} />
      <line x1={CX} y1={WAIST} x2={CX - RX} y2={BOTY} stroke={g} strokeWidth={1.5} />
      <line x1={CX} y1={WAIST} x2={CX + RX} y2={BOTY} stroke={g} strokeWidth={1.5} />
      {/* base ellipses: dashed back arc + solid front arc */}
      {[TOPY, BOTY].map((cy, i) => (
        <g key={i}>
          <path d={`M ${CX - RX} ${cy} A ${RX} ${RY} 0 0 1 ${CX + RX} ${cy}`} fill="none" stroke={g} strokeWidth={1.2} strokeDasharray="3 3" />
          <path d={`M ${CX - RX} ${cy} A ${RX} ${RY} 0 0 0 ${CX + RX} ${cy}`} fill="none" stroke={g} strokeWidth={1.5} />
        </g>
      ))}
    </g>
  );
}

function halfW(y: number): number {
  // cone half-width at height y within the UPPER nappe (TOPY..WAIST)
  return (RX * (WAIST - y)) / NAPPE;
}

function ConeCell({ slice, hi }: { slice: ConicSlice; hi: boolean }) {
  const c = COLOR[slice];
  const w = hi ? 3 : 2.25;
  const planeW = hi ? 2.5 : 1.75;
  let cut: React.ReactNode = null;
  let curve: React.ReactNode = null;

  if (slice === 'circle') {
    const y = 66;
    const hwc = halfW(y);
    cut = <line x1={CX - hwc - 12} y1={y} x2={CX + hwc + 12} y2={y} stroke={c} strokeWidth={planeW} strokeDasharray="5 3" />;
    curve = <ellipse cx={CX} cy={y} rx={hwc} ry={hwc * (RY / RX)} fill={c + '22'} stroke={c} strokeWidth={w} />;
  } else if (slice === 'ellipse') {
    cut = <line x1={104} y1={86} x2={184} y2={50} stroke={c} strokeWidth={planeW} strokeDasharray="5 3" />;
    curve = (
      <ellipse cx={143} cy={68} rx={31} ry={11} transform="rotate(-16 143 68)" fill={c + '22'} stroke={c} strokeWidth={w} />
    );
  } else if (slice === 'parabola') {
    // plane parallel to the right slant (direction (RX,-NAPPE))
    cut = <line x1={101} y1={126} x2={168} y2={28} stroke={c} strokeWidth={planeW} strokeDasharray="5 3" />;
    curve = <path d={`M 120 94 Q 150 30 182 94`} fill="none" stroke={c} strokeWidth={w} />;
  } else {
    // hyperbola — vertical plane through both nappes, two branches
    cut = <line x1={172} y1={26} x2={172} y2={182} stroke={c} strokeWidth={planeW} strokeDasharray="5 3" />;
    curve = (
      <g fill="none" stroke={c} strokeWidth={w}>
        <path d="M 150 52 Q 174 96 198 52" />
        <path d="M 150 156 Q 174 112 198 156" />
      </g>
    );
  }

  return (
    <>
      <DoubleCone />
      {cut}
      {curve}
      <text x={CX} y={214} fontSize={15} textAnchor="middle" fill={c} fontWeight={700}>{TITLECASE[slice]}</text>
      <text x={CX} y={232} fontSize={11.5} textAnchor="middle" fill="#6b7280">{CONIC_CUT[slice]}</text>
    </>
  );
}

export function CatalogConicSectionsRenderer({ figure }: { figure: ConicSectionsFigure }) {
  const N = conicSectionsFeatureNames;
  const cols = figure.slices.length <= 1 ? 1 : 2;
  const rows = Math.ceil(figure.slices.length / cols);
  const W = cols * CW;
  const H = rows * CH;

  return (
    <div className="conic-sections-renderer w-full flex flex-col items-center">
      {figure.title && <div className="text-base font-semibold text-gray-800 mb-2">{figure.title}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[600px]"
        data-feature={N.figure}
        data-feature-label={figure.title || 'conic sections'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {figure.slices.map((slice, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const w = (slice === figure.highlight) || (figure.slices.length === 1);
          return (
            <g
              key={slice}
              transform={`translate(${col * CW} ${row * CH})`}
              data-feature={N.slice(slice)}
              data-feature-label={TITLECASE[slice]}
              data-feature-cx={(col * CW + CX) / W}
              data-feature-cy={(row * CH + WAIST) / H}
              data-feature-w={CW / W}
              data-feature-h={(CH - 40) / H}
            >
              <ConeCell slice={slice} hi={w} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
