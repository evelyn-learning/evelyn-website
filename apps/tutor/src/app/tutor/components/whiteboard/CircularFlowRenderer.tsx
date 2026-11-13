'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import {
  circularFlowFeatureNames,
  type CircularFlowFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/economics';

const INK = '#1f2937';
const MONEY = '#15803d';   // green: money flow (outer loop)
const REAL = '#b45309';    // amber: real flow of goods and resources (inner loop)
const HH_FILL = '#dbeafe';
const HH_STROKE = '#2563eb';
const FIRM_FILL = '#fee2e2';
const FIRM_STROKE = '#dc2626';
const MKT_FILL = '#f1f5f9';
const MKT_STROKE = '#475569';

type Pt = [number, number];
interface Box { x: number; y: number; w: number; h: number }

/** One leg of a loop: out of a box, round one corner, into the next box, ending in an arrowhead. Each leg
 *  has a straight horizontal run with nothing else on it, and the label sits on that run (straight arrows
 *  between the boxes ran in pairs, and the labels of a pair landed on each other and on the arrows). */
function Leg({ from, corner, to, color, label, labelSide }: { from: Pt; corner: Pt; to: Pt; color: string; label: string; labelSide: 'above' | 'below' }) {
  const R = 16;
  const unit = (a: Pt, b: Pt): Pt => { const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / d, (b[1] - a[1]) / d]; };
  const u1 = unit(from, corner); const u2 = unit(corner, to);
  const c1: Pt = [corner[0] - u1[0] * R, corner[1] - u1[1] * R];
  const c2: Pt = [corner[0] + u2[0] * R, corner[1] + u2[1] * R];
  const AH = 10; const AW = 5.5;
  const base: Pt = [to[0] - u2[0] * AH, to[1] - u2[1] * AH];
  const n: Pt = [-u2[1], u2[0]];
  // The horizontal run is the leg that leaves or enters along x.
  const horizFirst = Math.abs(u1[0]) > 0.5;
  const hx1 = horizFirst ? from[0] : corner[0]; const hx2 = horizFirst ? corner[0] : to[0];
  const hy = horizFirst ? from[1] : to[1];
  return (
    <g>
      <path d={`M ${from[0]} ${from[1]} L ${c1[0]} ${c1[1]} Q ${corner[0]} ${corner[1]} ${c2[0]} ${c2[1]} L ${base[0]} ${base[1]}`} stroke={color} strokeWidth={2.25} fill="none" strokeLinecap="round" />
      <polygon points={`${to[0]},${to[1]} ${base[0] + n[0] * AW},${base[1] + n[1] * AW} ${base[0] - n[0] * AW},${base[1] - n[1] * AW}`} fill={color} />
      <text x={(hx1 + hx2) / 2} y={labelSide === 'above' ? hy - 7 : hy + 16} fontSize={11.5} fontWeight={600} fill={color} textAnchor="middle" style={{ paintOrder: 'stroke', stroke: '#fff', strokeWidth: 3, strokeLinejoin: 'round' }}>{label}</text>
    </g>
  );
}

export function CircularFlowRenderer({ figure }: { figure: CircularFlowFigure }) {
  const N = circularFlowFeatureNames;
  const { showMoneyFlow, showRealFlow, title } = figure;

  const W = 720;
  const H = 440;

  const HH: Box = { x: 34, y: 172, w: 140, h: 96 };    // Households (left)
  const FM: Box = { x: 546, y: 172, w: 140, h: 96 };   // Firms (right)
  const PM: Box = { x: 278, y: 34, w: 164, h: 76 };    // Product Market (top)
  const RM: Box = { x: 278, y: 330, w: 164, h: 76 };   // Resource Market (bottom)
  const center = (b: Box): Pt => [b.x + b.w / 2, b.y + b.h / 2];
  const cHH = center(HH), cFM = center(FM), cPM = center(PM), cRM = center(RM);

  const G = 3;                        // gap between an arrow's end and a box
  const xo = 44, xi = 26;             // offsets of the outer / inner loop from a side box's centre line
  const yo = 20, yi = 18;             // offsets of the outer / inner loop from a market box's centre line
  const L = { o: cHH[0] - xo, i: cHH[0] + xi };       // x of the vertical runs on the left
  const Rr = { o: cFM[0] + xo, i: cFM[0] - xi };      // … and on the right
  const T = { o: cPM[1] - yo, i: cPM[1] + yi };       // y of the horizontal runs at the top
  const B = { o: cRM[1] + yo, i: cRM[1] - yi };       // … and at the bottom

  return (
    <div
      className="circular-flow-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'Circular flow'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[700px]">
        <g data-feature={N.households} data-feature-label="Households">
          <rect x={HH.x} y={HH.y} width={HH.w} height={HH.h} rx={10} fill={HH_FILL} stroke={HH_STROKE} strokeWidth={2} />
          <text x={cHH[0]} y={cHH[1] - 2} fontSize={16} fontWeight={700} fill={HH_STROKE} textAnchor="middle">Households</text>
          <text x={cHH[0]} y={cHH[1] + 17} fontSize={11} fill={INK} textAnchor="middle">own resources</text>
        </g>
        <g data-feature={N.firms} data-feature-label="Firms">
          <rect x={FM.x} y={FM.y} width={FM.w} height={FM.h} rx={10} fill={FIRM_FILL} stroke={FIRM_STROKE} strokeWidth={2} />
          <text x={cFM[0]} y={cFM[1] - 2} fontSize={16} fontWeight={700} fill={FIRM_STROKE} textAnchor="middle">Firms</text>
          <text x={cFM[0]} y={cFM[1] + 17} fontSize={11} fill={INK} textAnchor="middle">produce goods</text>
        </g>
        <g data-feature={N.productMarket} data-feature-label="Product Market">
          <rect x={PM.x} y={PM.y} width={PM.w} height={PM.h} rx={8} fill={MKT_FILL} stroke={MKT_STROKE} strokeWidth={2} />
          <text x={cPM[0]} y={cPM[1] + 5} fontSize={15} fontWeight={700} fill={MKT_STROKE} textAnchor="middle">Product Market</text>
        </g>
        <g data-feature={N.resourceMarket} data-feature-label="Resource Market">
          <rect x={RM.x} y={RM.y} width={RM.w} height={RM.h} rx={8} fill={MKT_FILL} stroke={MKT_STROKE} strokeWidth={2} />
          <text x={cRM[0]} y={cRM[1] + 5} fontSize={15} fontWeight={700} fill={MKT_STROKE} textAnchor="middle">Resource Market</text>
        </g>

        {/* money flow (outer loop, clockwise): Households → Product Market → Firms → Resource Market → Households */}
        {showMoneyFlow && (
          <g data-feature={N.moneyFlow} data-feature-label="money flow">
            <Leg from={[L.o, HH.y - G]} corner={[L.o, T.o]} to={[PM.x - G, T.o]} color={MONEY} label="spending" labelSide="above" />
            <Leg from={[PM.x + PM.w + G, T.o]} corner={[Rr.o, T.o]} to={[Rr.o, FM.y - G]} color={MONEY} label="revenue" labelSide="above" />
            <Leg from={[Rr.o, FM.y + FM.h + G]} corner={[Rr.o, B.o]} to={[RM.x + RM.w + G, B.o]} color={MONEY} label="wages, rent, profit" labelSide="below" />
            <Leg from={[RM.x - G, B.o]} corner={[L.o, B.o]} to={[L.o, HH.y + HH.h + G]} color={MONEY} label="income" labelSide="below" />
          </g>
        )}

        {/* real flow (inner loop, anticlockwise): Households → Resource Market → Firms → Product Market → Households */}
        {showRealFlow && (
          <g data-feature={N.realFlow} data-feature-label="real flow">
            <Leg from={[L.i, HH.y + HH.h + G]} corner={[L.i, B.i]} to={[RM.x - G, B.i]} color={REAL} label="land, labor, capital" labelSide="above" />
            <Leg from={[RM.x + RM.w + G, B.i]} corner={[Rr.i, B.i]} to={[Rr.i, FM.y + FM.h + G]} color={REAL} label="resources" labelSide="above" />
            <Leg from={[Rr.i, FM.y - G]} corner={[Rr.i, T.i]} to={[PM.x + PM.w + G, T.i]} color={REAL} label="goods & services" labelSide="below" />
            <Leg from={[PM.x - G, T.i]} corner={[L.i, T.i]} to={[L.i, HH.y - G]} color={REAL} label="goods & services" labelSide="below" />
          </g>
        )}
      </svg>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs font-semibold -mt-1">
        {showMoneyFlow && <span className="inline-flex items-center gap-2" style={{ color: MONEY }}><span className="inline-block" style={{ width: 22, height: 3, background: MONEY, borderRadius: 2 }} />money flow</span>}
        {showRealFlow && <span className="inline-flex items-center gap-2" style={{ color: REAL }}><span className="inline-block" style={{ width: 22, height: 3, background: REAL, borderRadius: 2 }} />real flow (goods, services, resources)</span>}
      </div>
    </div>
  );
}
