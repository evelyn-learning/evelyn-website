'use client';

import React from 'react';
import { adAsFeatureNames, type AdAsFigure } from '@/lib/tutor/diagrams/catalog/kinds/economics';
import { ECON, MarketGraph, gap, type MarketLineSpec, type MarketPointSpec } from './econ-graph-layout';

/** AD-AS. The axes are schematic, so positions are restated in display units: the output gap and the
 *  shift keep their direction and a size that reads clearly (see econ-graph-layout). */
export function AdAsRenderer({ figure }: { figure: AdAsFigure }) {
  const { potentialGdp, initialEquilibriumGdp, showLras, shift, labels, title } = figure;
  const N = adAsFeatureNames;

  const Yp = 50;
  const Y0 = Yp + (showLras ? gap(initialEquilibriumGdp - potentialGdp, 9, 22) : 0);
  const P0 = 50;
  const dir = shift ? (shift.direction === 'right' ? 1 : -1) : 0;

  const lines: MarketLineSpec[] = [];
  const points: MarketPointSpec[] = [];
  if (showLras) lines.push({ key: 'lras', kind: 'vertical', x: Yp, color: ECON.vertical, label: labels.lras, feature: N.lras });
  lines.push({ key: 'ad', kind: 'down', x: Y0, y: P0, color: ECON.demand, label: labels.ad, feature: N.ad });
  lines.push({ key: 'sras', kind: 'up', x: Y0, y: P0, color: ECON.supply, label: labels.sras, feature: N.sras });

  let final: { x: number; y: number } | null = null;
  if (shift) {
    if (shift.curve === 'LRAS') {
      if (showLras) lines.push({ key: 'lras2', kind: 'vertical', x: Yp + dir * gap(shift.magnitude, 9, 20), color: ECON.vertical, dashed: true, label: `${labels.lras}′`, feature: N.lrasShifted });
    } else {
      const d = dir * gap(shift.magnitude, 14, 30) / 2;
      final = shift.curve === 'AD' ? { x: Y0 + d, y: P0 + d } : { x: Y0 + d, y: P0 - d };
      if (shift.curve === 'AD') lines.push({ key: 'ad2', kind: 'down', ...final, color: ECON.demand, dashed: true, label: `${labels.ad}′`, feature: N.adShifted });
      else lines.push({ key: 'sras2', kind: 'up', ...final, color: ECON.supply, dashed: true, label: `${labels.sras}′`, feature: N.srasShifted });
    }
  }
  points.push({ key: 'e0', x: Y0, y: P0, color: ECON.eq, label: labels.eqInitial, xTick: 'Y₀', yTick: 'P₀', feature: N.eqInitial });
  if (final) points.push({ key: 'e1', ...final, color: ECON.eqNew, label: labels.eqFinal, xTick: 'Y₁', yTick: 'P₁', feature: N.eqFinal });

  return (
    <MarketGraph
      className="ad-as-renderer"
      rootFeature={N.diagram}
      rootLabel={title || 'AD/AS'}
      title={title}
      subtitle={shift ? (shift.label ?? `${shift.curve} shifts ${shift.direction}`) : null}
      xTitle="Real GDP"
      yTitle="Price Level"
      lines={lines}
      points={points}
    />
  );
}
