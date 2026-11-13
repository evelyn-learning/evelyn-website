'use client';

import React from 'react';
import { supplyDemandFeatureNames, type SupplyDemandFigure } from '@/lib/tutor/diagrams/catalog/kinds/economics';
import { ECON, MarketGraph, gap, type MarketBracketSpec, type MarketLineSpec, type MarketPointSpec } from './econ-graph-layout';

/** Single-market supply & demand, with one shift or a price control. Positions are schematic
 *  (econ-graph-layout): direction and order are kept, sizes are held where they read clearly. */
export function SupplyDemandRenderer({ figure }: { figure: SupplyDemandFigure }) {
  const { good, initialPrice, shift, priceControl: pc, title } = figure;
  const N = supplyDemandFeatureNames;
  const Q0 = 50; const P0 = 50;

  const lines: MarketLineSpec[] = [
    { key: 's', kind: 'up', x: Q0, y: P0, color: ECON.supply, label: 'S', feature: N.supply },
    { key: 'd', kind: 'down', x: Q0, y: P0, color: ECON.demand, label: 'D', feature: N.demand },
  ];
  const points: MarketPointSpec[] = [];
  const brackets: MarketBracketSpec[] = [];
  let final: { x: number; y: number } | null = null;
  if (shift) {
    const d = (shift.direction === 'right' ? 1 : -1) * gap(shift.magnitude, 14, 30) / 2;
    if (shift.curve === 'S') {
      final = { x: Q0 + d, y: P0 - d };
      lines.push({ key: 's2', kind: 'up', ...final, color: ECON.supply, dashed: true, label: 'S′', feature: N.supplyShifted, featureLabel: "S'" });
    } else {
      final = { x: Q0 + d, y: P0 + d };
      lines.push({ key: 'd2', kind: 'down', ...final, color: ECON.demand, dashed: true, label: 'D′', feature: N.demandShifted, featureLabel: "D'" });
    }
  }
  if (pc) {
    const dl = gap(pc.level - initialPrice, 12, 24);
    const y = P0 + dl;
    lines.push({ key: 'pc', kind: 'horizontal', y, color: ECON.control, dashed: true, label: pc.type === 'ceiling' ? 'Price ceiling' : 'Price floor', feature: N.priceControl, featureLabel: `price ${pc.type}` });
    if (pc.binding && dl !== 0) {
      const qS = Q0 + dl; const qD = Q0 - dl;
      brackets.push({ key: 'gap', y, x1: Math.min(qS, qD), x2: Math.max(qS, qD), label: pc.type === 'ceiling' ? 'Shortage' : 'Surplus', color: ECON.control, side: pc.type === 'ceiling' ? 'below' : 'above', feature: N.gap, featureLabel: pc.type === 'ceiling' ? 'shortage' : 'surplus' });
      points.push({ key: 'qs', x: qS, y, color: ECON.control, xTick: 'Qs', dot: false });
      points.push({ key: 'qd', x: qD, y, color: ECON.control, xTick: 'Qd', yTick: pc.type === 'ceiling' ? 'Pc' : 'Pf', dot: false });
    }
  }
  const marked = !!(shift || pc);
  points.push({ key: 'e0', x: Q0, y: P0, color: ECON.eq, xTick: marked ? 'Q₀' : 'Q*', yTick: marked ? 'P₀' : 'P*', feature: N.eqInitial, featureLabel: 'equilibrium' });
  if (final) points.push({ key: 'e1', ...final, color: ECON.eqNew, xTick: 'Q₁', yTick: 'P₁', feature: N.eqFinal, featureLabel: 'new equilibrium' });

  const subtitle = shift ? (shift.label ?? `${shift.curve} shifts ${shift.direction}`) : pc ? (pc.label ?? `price ${pc.type} at ${pc.level}`) : null;

  return (
    <MarketGraph
      className="supply-demand-renderer"
      rootFeature={N.diagram}
      rootLabel={title || `Supply & demand (${good})`}
      title={title}
      subtitle={subtitle}
      xTitle={`Quantity of ${good}`}
      yTitle="Price"
      lines={lines}
      points={points}
      brackets={brackets}
    />
  );
}
