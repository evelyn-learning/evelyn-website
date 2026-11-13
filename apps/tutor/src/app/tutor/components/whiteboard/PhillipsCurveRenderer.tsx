'use client';

import React from 'react';
import { phillipsCurveFeatureNames, type PhillipsCurveFigure } from '@/lib/tutor/diagrams/catalog/kinds/economics';
import { ECON, MarketGraph, gap, type MarketLineSpec, type MarketPointSpec } from './econ-graph-layout';

/** Phillips curve: downward short-run curve, vertical long-run curve at the natural rate. Positions are
 *  schematic (econ-graph-layout), so real percentages (NAIRU 5, inflation 3) and 0..100 units draw alike. */
export function PhillipsCurveRenderer({ figure }: { figure: PhillipsCurveFigure }) {
  const { nairu, initialUnemployment, showLrpc, shift, title } = figure;
  const N = phillipsCurveFeatureNames;
  const Un = 50;
  const u0 = Un + (showLrpc ? gap(initialUnemployment - nairu, 9, 22) : 0);
  const pi0 = 50;

  const lines: MarketLineSpec[] = [];
  if (showLrpc) lines.push({ key: 'lrpc', kind: 'vertical', x: Un, color: ECON.vertical, label: 'LRPC', feature: N.lrpc });
  lines.push({ key: 'srpc', kind: 'down', x: u0, y: pi0, color: ECON.demand, label: 'SRPC', feature: N.srpc });
  const points: MarketPointSpec[] = [];
  let final: { x: number; y: number } | null = null;
  if (shift) {
    const sign = shift.direction === 'up' || shift.direction === 'right' ? 1 : -1;
    if (shift.curve === 'SRPC') {
      final = { x: u0, y: pi0 + sign * gap(shift.magnitude, 11, 24) };
      lines.push({ key: 'srpc2', kind: 'down', ...final, color: ECON.demand, dashed: true, label: 'SRPC′', feature: N.srpcShifted, featureLabel: "SRPC'" });
    } else {
      const x = Un + sign * gap(shift.magnitude, 10, 20);
      // The long-run point moves with the natural rate, at the same inflation (as the solver states it).
      final = { x, y: pi0 };
      if (showLrpc) lines.push({ key: 'lrpc2', kind: 'vertical', x, color: ECON.vertical, dashed: true, label: 'LRPC′', feature: N.lrpcShifted, featureLabel: "LRPC'" });
    }
  }
  points.push({ key: 'e0', x: u0, y: pi0, color: ECON.eq, xTick: 'U₀', yTick: 'π₀', feature: N.eqInitial, featureLabel: 'initial point' });
  if (final) points.push({ key: 'e1', ...final, color: ECON.eqNew, xTick: 'U₁', yTick: 'π₁', feature: N.eqFinal, featureLabel: 'final point' });

  return (
    <MarketGraph
      className="phillips-curve-renderer"
      rootFeature={N.diagram}
      rootLabel={title || 'Phillips curve'}
      title={title}
      subtitle={shift ? (shift.label ?? `${shift.curve} shifts ${shift.direction}`) : null}
      xTitle="Unemployment Rate (%)"
      yTitle="Inflation Rate (%)"
      lines={lines}
      points={points}
    />
  );
}
