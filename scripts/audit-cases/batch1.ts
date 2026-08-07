/**
 * Clip-audit cases — batch 1 (standalone chart renderers):
 * TapeDiagramRenderer, FoodWebRenderer, PieChartRenderer,
 * CoordinatePlaneRenderer, BarChartRenderer, NormalCurveRenderer.
 * As each renderer is fixed, its case flips expectViolation → false (and the
 * fix should keep the SAME payload — that's the regression).
 */
import React from 'react';
import type { AuditCase } from '../lib/svg-text-extents';
import { TapeDiagramRenderer } from '../../src/app/tutor/components/whiteboard/TapeDiagramRenderer';
import FoodWebRenderer from '../../src/app/tutor/components/whiteboard/FoodWebRenderer';
import { PieChartRenderer } from '../../src/app/tutor/components/whiteboard/PieChartRenderer';
import CoordinatePlaneRenderer from '../../src/app/tutor/components/whiteboard/CoordinatePlaneRenderer';
import { BarChartRenderer } from '../../src/app/tutor/components/whiteboard/BarChartRenderer';

export const CASES: AuditCase[] = [
  {
    name: 'TapeDiagramRenderer bars[].name',
    expectViolation: true,
    el: React.createElement(TapeDiagramRenderer, {
      figure: { bars: [{ name: "Marcus's savings", segments: [{ length: 4, label: 'x' }, { length: 8, label: '8' }] }], sharedScale: true },
    }),
  },
  {
    name: 'FoodWebRenderer level labels (deterministic)',
    expectViolation: true,
    el: React.createElement(FoodWebRenderer, {
      species: [
        { id: 'grass', label: 'Grass', level: 1 },
        { id: 'rabbit', label: 'Rabbit', level: 2 },
        { id: 'fox', label: 'Fox', level: 3 },
      ],
      edges: [{ from: 'grass', to: 'rabbit' }, { from: 'rabbit', to: 'fox' }],
    }),
  },
  {
    name: 'PieChartRenderer legend slices[].label',
    expectViolation: true,
    el: React.createElement(PieChartRenderer, {
      figure: {
        slices: [
          { label: 'Students who bike to school', value: 30, proportion: 0.3 },
          { label: 'Walk', value: 70, proportion: 0.7 },
        ],
        total: 100,
      },
    }),
  },
  {
    name: 'CoordinatePlaneRenderer points[].label at xMax',
    expectViolation: true,
    el: React.createElement(CoordinatePlaneRenderer, {
      xRange: [-10, 10], yRange: [-10, 10],
      points: [{ x: 10, y: 5, label: '(10, 5) maximum' }],
    }),
  },
  {
    name: 'BarChartRenderer last category label',
    expectViolation: true,
    el: React.createElement(BarChartRenderer, {
      figure: {
        categories: ['Coal', 'Gas', 'Nuclear', 'Hydro', 'Wind', 'Solar', 'Biomass', 'Renewable electricity sources'],
        values: [30, 25, 15, 10, 12, 8, 6, 4],
        yMin: 0, yMax: 35, yStep: 5,
      },
    }),
  },
];
