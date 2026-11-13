'use client';

import React from 'react';
import { fxMarketFeatureNames, type FxMarketFigure } from '@/lib/tutor/diagrams/catalog/kinds/economics';
import { ECON, MarketGraph, gap, type MarketLineSpec, type MarketPointSpec } from './econ-graph-layout';

/** Foreign exchange market for one currency. Positions are schematic (econ-graph-layout). */
export function ForeignExchangeRenderer({ figure }: { figure: FxMarketFigure }) {
  const { currency, quoteCurrency, shift, title } = figure;
  const N = fxMarketFeatureNames;
  const Q0 = 50; const e0 = 50;
  // A short code rides on the curve name as a subscript; a longer name stays on the axes only.
  const sub = currency.trim().length <= 4 ? currency.trim() : undefined;

  const lines: MarketLineSpec[] = [
    { key: 's', kind: 'up', x: Q0, y: e0, color: ECON.supply, label: 'S', sub, feature: N.supply, featureLabel: `S${currency}` },
    { key: 'd', kind: 'down', x: Q0, y: e0, color: ECON.demand, label: 'D', sub, feature: N.demand, featureLabel: `D${currency}` },
  ];
  const points: MarketPointSpec[] = [];
  let final: { x: number; y: number } | null = null;
  if (shift) {
    const d = (shift.direction === 'right' ? 1 : -1) * gap(shift.magnitude, 14, 30) / 2;
    if (shift.curve === 'S') {
      final = { x: Q0 + d, y: e0 - d };
      lines.push({ key: 's2', kind: 'up', ...final, color: ECON.supply, dashed: true, label: 'S′', sub, feature: N.supplyShifted, featureLabel: `S${currency}'` });
    } else {
      final = { x: Q0 + d, y: e0 + d };
      lines.push({ key: 'd2', kind: 'down', ...final, color: ECON.demand, dashed: true, label: 'D′', sub, feature: N.demandShifted, featureLabel: `D${currency}'` });
    }
  }
  points.push({ key: 'e0', x: Q0, y: e0, color: ECON.eq, xTick: 'Q₀', yTick: 'e₀', feature: N.eqInitial, featureLabel: 'initial equilibrium' });
  if (final) points.push({ key: 'e1', ...final, color: ECON.eqNew, xTick: 'Q₁', yTick: 'e₁', feature: N.eqFinal, featureLabel: 'final equilibrium' });

  return (
    <MarketGraph
      className="fx-market-renderer"
      rootFeature={N.diagram}
      rootLabel={title || `FX market (${currency})`}
      title={title}
      subtitle={shift ? (shift.label ?? `${shift.curve} shifts ${shift.direction}`) : null}
      xTitle={`Quantity of ${currency}`}
      yTitle={`Exchange Rate (${quoteCurrency} per ${currency})`}
      lines={lines}
      points={points}
    />
  );
}
