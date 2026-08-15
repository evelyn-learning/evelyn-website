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
import { NormalCurveRenderer } from '../../src/app/tutor/components/whiteboard/NormalCurveRenderer';

export const CASES: AuditCase[] = [
  {
    name: 'TapeDiagramRenderer bars[].name',
    expectViolation: false,
    el: React.createElement(TapeDiagramRenderer, {
      figure: { bars: [{ name: "Marcus's savings", segments: [{ length: 4, label: 'x' }, { length: 8, label: '8' }] }], sharedScale: true },
    }),
  },
  {
    name: 'TapeDiagramRenderer segments[].label + totalLabel + wrapped name',
    expectViolation: false,
    el: React.createElement(TapeDiagramRenderer, {
      figure: {
        bars: [
          { name: 'Money Marcus saved during summer vacation', segments: [{ length: 20, label: 'spent' }, { length: 1, label: 'money left over' }] },
          { name: 'Week 2', segments: [{ length: 1, unknown: true }], totalLabel: 'Total amount Marcus saved over the school year: $84' },
        ],
        sharedScale: true,
      },
    }),
  },
  {
    name: 'FoodWebRenderer level labels (deterministic)',
    expectViolation: false,
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
    expectViolation: false,
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
    name: 'PieChartRenderer legend over-cap single word (viewBox growth)',
    expectViolation: false,
    el: React.createElement(PieChartRenderer, {
      figure: {
        slices: [
          { label: 'Photosynthesizers', value: 12, proportion: 0.12 },
          { label: 'Decomposers', value: 88, proportion: 0.88 },
        ],
        total: 100,
      },
    }),
  },
  {
    name: 'CoordinatePlaneRenderer points[].label at xMax',
    expectViolation: false,
    el: React.createElement(CoordinatePlaneRenderer, {
      xRange: [-10, 10], yRange: [-10, 10],
      points: [{ x: 10, y: 5, label: '(10, 5) maximum' }],
    }),
  },
  {
    name: 'CoordinatePlaneRenderer vector/segment labels + yLabel at xMax=0',
    expectViolation: false,
    el: React.createElement(CoordinatePlaneRenderer, {
      xRange: [-10, 0], yRange: [0, 10],
      yLabel: 'Height above ground (m)',
      vectors: [{ from: { x: -10, y: 0 }, to: { x: 0, y: 8 }, label: 'resultant velocity v' }],
      segments: [{ from: { x: -1, y: 9 }, to: { x: 0, y: 9 }, label: 'ground reference line' }],
    }),
  },
  {
    name: 'BarChartRenderer last category label',
    expectViolation: false,
    el: React.createElement(BarChartRenderer, {
      figure: {
        categories: ['Coal', 'Gas', 'Nuclear', 'Hydro', 'Wind', 'Solar', 'Biomass', 'Renewable electricity sources'],
        values: [30, 25, 15, 10, 12, 8, 6, 4],
        yMin: 0, yMax: 35, yStep: 5,
      },
    }),
  },
  {
    name: 'NormalCurveRenderer markValues[].label near PAD_L + μ near xMax',
    expectViolation: false,
    el: React.createElement(NormalCurveRenderer, {
      figure: {
        mean: 144.75, sd: 30, xMin: 55, xMax: 145,
        markValues: [{ x: 55, label: 'score = 55 (z = -3.0)' }],
        showSDLines: true,
      },
    }),
  },
];
