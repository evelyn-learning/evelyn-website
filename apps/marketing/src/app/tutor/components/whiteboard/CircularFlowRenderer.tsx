'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import {
  circularFlowFeatureNames,
  type CircularFlowFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/economics';

const INK = '#1f2937';
const MONEY = '#16a34a';   // green — money flow (outer loop)
const REAL = '#d97706';    // amber — real flow of goods/resources (inner loop)
const HH_FILL = '#dbeafe';
const HH_STROKE = '#2563eb';
const FIRM_FILL = '#fee2e2';
const FIRM_STROKE = '#dc2626';
const MKT_FILL = '#f1f5f9';
const MKT_STROKE = '#475569';

type Pt = [number, number];

interface Box { x: number; y: number; w: number; h: number }

/** Distance from a box center to where a ray of unit direction (ux,uy) exits
 *  the box border. */
function exitDist(box: Box, ux: number, uy: number): number {
  const hw = box.w / 2, hh = box.h / 2;
  const tx = Math.abs(ux) < 1e-6 ? Infinity : hw / Math.abs(ux);
  const ty = Math.abs(uy) < 1e-6 ? Infinity : hh / Math.abs(uy);
  return Math.min(tx, ty);
}

/** A labeled arrow from box A to box B, clipped to each box's border and
 *  pushed `off` px along the perpendicular so the two opposite-direction
 *  arrows on a leg sit side by side. Draws an explicit arrowhead triangle at
 *  the B end (no reliance on SVG <marker>, which some rasterizers drop). */
function FlowArrow({
  a, aBox, b, bBox, off, color, label, labelDx = 0, labelDy = 0,
}: { a: Pt; aBox: Box; b: Pt; bBox: Box; off: number; color: string; label: string; labelDx?: number; labelDy?: number }) {
  const [ax, ay] = a;
  const [bx, by] = b;
  const dx = bx - ax, dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;     // unit along
  const px = -uy, py = ux;                 // unit perpendicular
  const gap = 6;
  const startT = exitDist(aBox, ux, uy) + gap;
  const endT = exitDist(bBox, ux, uy) + gap;
  const x1 = ax + ux * startT + px * off;
  const y1 = ay + uy * startT + py * off;
  const x2 = bx - ux * endT + px * off;
  const y2 = by - uy * endT + py * off;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  // arrowhead triangle at (x2,y2)
  const ah = 9;   // length
  const aw = 5;   // half-width
  const tipX = x2, tipY = y2;
  const baseX = x2 - ux * ah, baseY = y2 - uy * ah;
  const p1 = `${tipX},${tipY}`;
  const p2 = `${baseX + px * aw},${baseY + py * aw}`;
  const p3 = `${baseX - px * aw},${baseY - py * aw}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={baseX} y2={baseY} stroke={color} strokeWidth={2} />
      <polygon points={`${p1} ${p2} ${p3}`} fill={color} />
      <text x={mx + labelDx} y={my + labelDy} fontSize={10.5} fontWeight={600} fill={color} textAnchor="middle">{label}</text>
    </g>
  );
}

export function CircularFlowRenderer({ figure }: { figure: CircularFlowFigure }) {
  const N = circularFlowFeatureNames;
  const { showMoneyFlow, showRealFlow, title } = figure;

  const W = 660;
  const H = 470;

  // Node boxes.
  const HH = { x: 28, y: 190, w: 132, h: 90 };   // Households (left)
  const FM = { x: 500, y: 190, w: 132, h: 90 };  // Firms (right)
  const PM = { x: 250, y: 28, w: 160, h: 62 };   // Product Market (top)
  const RM = { x: 250, y: 380, w: 160, h: 62 };  // Resource Market (bottom)

  const center = (b: { x: number; y: number; w: number; h: number }): Pt => [b.x + b.w / 2, b.y + b.h / 2];
  const cHH = center(HH), cFM = center(FM), cPM = center(PM), cRM = center(RM);

  return (
    <div
      className="circular-flow-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'Circular flow'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[680px]">
        {/* ── money flow (outer loop, green): HH→PM→Firms→RM→HH ── */}
        {showMoneyFlow && (
          <g data-feature={N.moneyFlow} data-feature-label="money flow">
            <FlowArrow a={cHH} aBox={HH} b={cPM} bBox={PM} off={-11} color={MONEY} label="spending" labelDx={-16} labelDy={-4} />
            <FlowArrow a={cPM} aBox={PM} b={cFM} bBox={FM} off={-11} color={MONEY} label="revenue" labelDx={16} labelDy={-4} />
            <FlowArrow a={cFM} aBox={FM} b={cRM} bBox={RM} off={-11} color={MONEY} label="wages, rent, profit" labelDx={18} labelDy={14} />
            <FlowArrow a={cRM} aBox={RM} b={cHH} bBox={HH} off={-11} color={MONEY} label="income" labelDx={-16} labelDy={14} />
          </g>
        )}

        {/* ── real flow (inner loop, amber): HH→RM→Firms→PM→HH ── */}
        {showRealFlow && (
          <g data-feature={N.realFlow} data-feature-label="real flow">
            <FlowArrow a={cHH} aBox={HH} b={cRM} bBox={RM} off={-11} color={REAL} label="land, labor, capital" labelDx={-18} labelDy={18} />
            <FlowArrow a={cRM} aBox={RM} b={cFM} bBox={FM} off={-11} color={REAL} label="resources" labelDx={18} labelDy={20} />
            <FlowArrow a={cFM} aBox={FM} b={cPM} bBox={PM} off={-11} color={REAL} label="goods & services" labelDx={22} labelDy={-2} />
            <FlowArrow a={cPM} aBox={PM} b={cHH} bBox={HH} off={-11} color={REAL} label="goods & services" labelDx={-22} labelDy={-2} />
          </g>
        )}

        {/* ── nodes (drawn last so they sit atop the arrows) ── */}
        <g data-feature={N.households} data-feature-label="Households">
          <rect x={HH.x} y={HH.y} width={HH.w} height={HH.h} rx={10} fill={HH_FILL} stroke={HH_STROKE} strokeWidth={2} />
          <text x={cHH[0]} y={cHH[1] - 4} fontSize={15} fontWeight={700} fill={HH_STROKE} textAnchor="middle">Households</text>
          <text x={cHH[0]} y={cHH[1] + 14} fontSize={10} fill={INK} textAnchor="middle">own resources</text>
        </g>
        <g data-feature={N.firms} data-feature-label="Firms">
          <rect x={FM.x} y={FM.y} width={FM.w} height={FM.h} rx={10} fill={FIRM_FILL} stroke={FIRM_STROKE} strokeWidth={2} />
          <text x={cFM[0]} y={cFM[1] - 4} fontSize={15} fontWeight={700} fill={FIRM_STROKE} textAnchor="middle">Firms</text>
          <text x={cFM[0]} y={cFM[1] + 14} fontSize={10} fill={INK} textAnchor="middle">produce goods</text>
        </g>
        <g data-feature={N.productMarket} data-feature-label="Product Market">
          <rect x={PM.x} y={PM.y} width={PM.w} height={PM.h} rx={8} fill={MKT_FILL} stroke={MKT_STROKE} strokeWidth={2} />
          <text x={cPM[0]} y={cPM[1] - 3} fontSize={14} fontWeight={700} fill={MKT_STROKE} textAnchor="middle">Product Market</text>
          <text x={cPM[0]} y={cPM[1] + 14} fontSize={10} fill={INK} textAnchor="middle">goods &amp; services</text>
        </g>
        <g data-feature={N.resourceMarket} data-feature-label="Resource Market">
          <rect x={RM.x} y={RM.y} width={RM.w} height={RM.h} rx={8} fill={MKT_FILL} stroke={MKT_STROKE} strokeWidth={2} />
          <text x={cRM[0]} y={cRM[1] - 3} fontSize={14} fontWeight={700} fill={MKT_STROKE} textAnchor="middle">Resource Market</text>
          <text x={cRM[0]} y={cRM[1] + 14} fontSize={10} fill={INK} textAnchor="middle">land, labor, capital</text>
        </g>

        {/* legend */}
        <g transform={`translate(${W - 176}, ${H - 30})`}>
          {showMoneyFlow && (<><line x1={0} y1={0} x2={22} y2={0} stroke={MONEY} strokeWidth={2.5} /><text x={28} y={4} fontSize={11} fill={MONEY} fontWeight={600}>money</text></>)}
          {showRealFlow && (<><line x1={92} y1={0} x2={114} y2={0} stroke={REAL} strokeWidth={2.5} /><text x={120} y={4} fontSize={11} fill={REAL} fontWeight={600}>real</text></>)}
        </g>
      </svg>
    </div>
  );
}
