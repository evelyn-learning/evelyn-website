'use client';

import React from 'react';
import { moneyMarketFeatureNames, type MoneyMarketFigure } from '@/lib/tutor/diagrams/catalog/kinds/economics';
import { ECON, MarketGraph, gap, type MarketLineSpec, type MarketPointSpec } from './econ-graph-layout';

/** Money market: vertical money supply, downward money demand. Positions are schematic (econ-graph-layout). */
export function MoneyMarketRenderer({ figure }: { figure: MoneyMarketFigure }) {
  const { shift, title } = figure;
  const N = moneyMarketFeatureNames;
  const Q0 = 50; const i0 = 50;
  const dir = shift ? (shift.direction === 'right' ? 1 : -1) : 0;

  const lines: MarketLineSpec[] = [
    { key: 'ms', kind: 'vertical', x: Q0, color: ECON.vertical, label: 'M', sub: 's', feature: N.ms, featureLabel: 'Ms' },
    { key: 'md', kind: 'down', x: Q0, y: i0, color: ECON.demand, label: 'M', sub: 'd', feature: N.md, featureLabel: 'Md' },
  ];
  const points: MarketPointSpec[] = [];
  let final: { x: number; y: number } | null = null;
  if (shift) {
    if (shift.curve === 'Ms') {
      const d = dir * gap(shift.magnitude, 10, 22);
      final = { x: Q0 + d, y: i0 - d };
      lines.push({ key: 'ms2', kind: 'vertical', x: final.x, color: ECON.vertical, dashed: true, label: 'M′', sub: 's', feature: N.msShifted, featureLabel: "Ms'" });
    } else {
      const d = dir * gap(shift.magnitude, 12, 26);
      final = { x: Q0, y: i0 + d };
      lines.push({ key: 'md2', kind: 'down', ...final, color: ECON.demand, dashed: true, label: 'M′', sub: 'd', feature: N.mdShifted, featureLabel: "Md'" });
    }
  }
  points.push({ key: 'e0', x: Q0, y: i0, color: ECON.eq, xTick: 'Q₀', yTick: 'i₀', feature: N.eqInitial, featureLabel: 'initial equilibrium' });
  if (final) points.push({ key: 'e1', ...final, color: ECON.eqNew, xTick: 'Q₁', yTick: 'i₁', feature: N.eqFinal, featureLabel: 'final equilibrium' });

  return (
    <MarketGraph
      className="money-market-renderer"
      rootFeature={N.diagram}
      rootLabel={title || 'money market'}
      title={title}
      subtitle={shift ? (shift.label ?? `${shift.curve} shifts ${shift.direction}`) : null}
      xTitle="Quantity of Money"
      yTitle="Nominal Interest Rate"
      lines={lines}
      points={points}
    />
  );
}
