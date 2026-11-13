'use client';

import React from 'react';
import { loanableFundsFeatureNames, type LoanableFundsFigure } from '@/lib/tutor/diagrams/catalog/kinds/economics';
import { ECON, MarketGraph, gap, type MarketLineSpec, type MarketPointSpec } from './econ-graph-layout';

/** Loanable funds: supply of saving up, demand for borrowing down. Positions are schematic (econ-graph-layout). */
export function LoanableFundsRenderer({ figure }: { figure: LoanableFundsFigure }) {
  const { shift, title } = figure;
  const N = loanableFundsFeatureNames;
  const Q0 = 50; const r0 = 50;

  const lines: MarketLineSpec[] = [
    { key: 's', kind: 'up', x: Q0, y: r0, color: ECON.supply, label: 'S', feature: N.supply },
    { key: 'd', kind: 'down', x: Q0, y: r0, color: ECON.demand, label: 'D', feature: N.demand },
  ];
  const points: MarketPointSpec[] = [];
  let final: { x: number; y: number } | null = null;
  if (shift) {
    const d = (shift.direction === 'right' ? 1 : -1) * gap(shift.magnitude, 14, 30) / 2;
    if (shift.curve === 'S') {
      final = { x: Q0 + d, y: r0 - d };
      lines.push({ key: 's2', kind: 'up', ...final, color: ECON.supply, dashed: true, label: 'S′', feature: N.supplyShifted, featureLabel: "S'" });
    } else {
      final = { x: Q0 + d, y: r0 + d };
      lines.push({ key: 'd2', kind: 'down', ...final, color: ECON.demand, dashed: true, label: 'D′', feature: N.demandShifted, featureLabel: "D'" });
    }
  }
  points.push({ key: 'e0', x: Q0, y: r0, color: ECON.eq, xTick: 'Q₀', yTick: 'r₀', feature: N.eqInitial, featureLabel: 'initial equilibrium' });
  if (final) points.push({ key: 'e1', ...final, color: ECON.eqNew, xTick: 'Q₁', yTick: 'r₁', feature: N.eqFinal, featureLabel: 'final equilibrium' });

  return (
    <MarketGraph
      className="loanable-funds-renderer"
      rootFeature={N.diagram}
      rootLabel={title || 'loanable funds'}
      title={title}
      subtitle={shift ? (shift.label ?? `${shift.curve} shifts ${shift.direction}`) : null}
      xTitle="Quantity of Loanable Funds"
      yTitle="Real Interest Rate"
      lines={lines}
      points={points}
    />
  );
}
