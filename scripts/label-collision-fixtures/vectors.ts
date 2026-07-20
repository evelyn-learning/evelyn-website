/**
 * 2026-07-19 label-collision audit fixtures — VectorRenderer +
 * CatalogVectorAdditionRenderer. Converging / near-parallel / out-and-back
 * vectors put midpoint labels on top of each other, and long resultant
 * labels ran off the right viewbox edge.
 */
import React from 'react';
import type { LabelFixture } from '../lib/label-collision-harness';
import VectorRenderer from '../../src/app/tutor/components/whiteboard/VectorRenderer';
import { CatalogVectorAdditionRenderer } from '../../src/app/tutor/components/whiteboard/CatalogVectorAdditionRenderer';
import { solveVectorAddition } from '../../src/lib/tutor/diagrams/catalog/kinds/physics';

const fixtures: LabelFixture[] = [
  {
    // Two near-parallel vectors from a shared origin: their midpoint
    // labels land within ~7px of each other. The resultant tip label
    // also overflows the right viewbox edge (anchor=start + long text).
    name: 'vector-near-parallel-from-origin',
    viewbox: { w: 520, h: 360 },
    element: React.createElement(VectorRenderer, {
      vectors: [
        { magnitude: 5, direction: 40, label: 'wind velocity' },
        { magnitude: 5.3, direction: 43, label: 'current velocity' },
      ],
      showResultant: true,
    }),
  },
  {
    // Out-and-back tip-to-tail chain: both shafts share the same axis, so
    // both midpoint labels sit at the same y with overlapping x ranges.
    name: 'vector-opposed-horizontal-tip-to-tail',
    viewbox: { w: 520, h: 360 },
    checkArrows: true,
    element: React.createElement(VectorRenderer, {
      vectors: [
        { magnitude: 6, direction: 0, label: 'eastward drive' },
        { magnitude: 5.5, direction: 180, label: 'westward walk back' },
      ],
      layout: 'tip-to-tail',
      showResultant: true,
    }),
  },
  {
    // Real solver output (production path). The return leg retraces the
    // first vector, so the alternating labelSide stagger flips with the
    // reversed direction and both labels end up below the same line.
    name: 'catalog-vecadd-out-and-back-tip-to-tail',
    viewbox: { w: 520, h: 380 },
    checkArrows: true,
    element: React.createElement(CatalogVectorAdditionRenderer, {
      figure: solveVectorAddition({
        vectors: [
          { x: 6, y: 0, label: 'eastward leg' },
          { x: -5.5, y: 0.3, label: 'westward return leg' },
        ],
        method: 'tip_to_tail',
      }),
    }),
  },
  {
    // Real solver output. Three vectors from the origin: the alternating
    // ±labelSide puts the 1st and 3rd labels on the SAME side, and those
    // two vectors are near-parallel — labels composite at the midpoint.
    name: 'catalog-vecadd-parallelogram-three-near-parallel',
    viewbox: { w: 520, h: 380 },
    element: React.createElement(CatalogVectorAdditionRenderer, {
      figure: solveVectorAddition({
        vectors: [
          { x: 4, y: 1, label: 'force A' },
          { x: 1, y: 4, label: 'force B' },
          { x: 4.2, y: 1.4, label: 'force C' },
        ],
        method: 'parallelogram',
      }),
    }),
  },
];

export default fixtures;
