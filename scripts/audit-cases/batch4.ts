/**
 * Clip-audit cases — batch 4 (stats + econ + reaction-coordinate renderers):
 * StatsRenderer (shell title, pie legend, distribution probabilityLabel,
 * scatter highlightPoint), ScatterPlotRenderer, ScatterRegressionRenderer,
 * ReactionCoordinateRenderer, ProductionPossibilitiesRenderer,
 * EconMicro ComparativeAdvantageRenderer, AdAsRenderer, BusinessCycleRenderer.
 * As each renderer is fixed, its case flips expectViolation → false (and the
 * fix should keep the SAME payload — that's the regression).
 *
 * NOTE (ComparativeAdvantageRenderer): the pre-fix conclusion sentence was
 * FOUR flowed tspans measured individually by the harness, so no table-clean
 * payload could trip it per-tspan even though the concatenated line clipped
 * badly in reality. Pre-fix violation was confirmed 2026-08-07 by measuring
 * the concatenated tspan contents of the rendered markup directly with the
 * exact payload below: 125 chars, est [-60, 800] in view [0, 740]. The case
 * regresses the wrapped output.
 */
import React from 'react';
import type { AuditCase } from '../lib/svg-text-extents';
import StatsRenderer from '../../src/app/tutor/components/whiteboard/StatsRenderer';
import ScatterPlotRenderer from '../../src/app/tutor/components/whiteboard/ScatterPlotRenderer';
import { ScatterRegressionRenderer } from '../../src/app/tutor/components/whiteboard/ScatterRegressionRenderer';
import ReactionCoordinateRenderer from '../../src/app/tutor/components/whiteboard/ReactionCoordinateRenderer';
import { ProductionPossibilitiesRenderer } from '../../src/app/tutor/components/whiteboard/ProductionPossibilitiesRenderer';
import { ComparativeAdvantageRenderer } from '../../src/app/tutor/components/whiteboard/EconMicroRenderers';
import { AdAsRenderer } from '../../src/app/tutor/components/whiteboard/AdAsRenderer';
import { BusinessCycleRenderer } from '../../src/app/tutor/components/whiteboard/BusinessCycleRenderer';

export const CASES: AuditCase[] = [
  {
    name: 'StatsRenderer shell title (long, over fixed 500×350)',
    expectViolation: false,
    el: React.createElement(StatsRenderer, {
      type: 'bar',
      title: 'Average monthly rainfall totals for the three coastal cities in our sample (2020–2024)',
      bar: { categories: ['A', 'B', 'C'], values: [3, 5, 4] },
    }),
  },
  {
    name: 'StatsRenderer pie legend slices[].label',
    expectViolation: false,
    el: React.createElement(StatsRenderer, {
      type: 'pie',
      pie: {
        slices: [
          { label: 'Students who bike or scooter to school', value: 30 },
          { label: 'Walk', value: 70 },
        ],
        showPercentages: true,
      },
    }),
  },
  {
    name: 'StatsRenderer distribution probabilityLabel near plot edge',
    expectViolation: false,
    el: React.createElement(StatsRenderer, {
      type: 'distribution',
      distribution: {
        family: 'normal',
        params: { mean: 500, sd: 100 },
        shade: { type: 'greater', a: 850 },
        probabilityLabel: 'P(X > 850) = 0.0013',
      },
    }),
  },
  {
    name: 'StatsRenderer scatter highlightPoint.label at right edge',
    expectViolation: false,
    el: React.createElement(StatsRenderer, {
      type: 'scatter',
      points: [
        { x: 1, y: 12 }, { x: 2, y: 18 }, { x: 4, y: 35 },
        { x: 6, y: 48 }, { x: 8, y: 70 }, { x: 10, y: 95 },
      ],
      highlightPoint: { x: 10, y: 95, label: 'possible outlier (10, 95)' },
    }),
  },
  {
    name: 'ScatterPlotRenderer points[].label at rightmost point',
    expectViolation: false,
    el: React.createElement(ScatterPlotRenderer, {
      points: [
        { x: 2, y: 30 }, { x: 5, y: 45 },
        { x: 9.8, y: 88, label: 'final measurement (9.8, 88)' },
      ],
    }),
  },
  {
    name: 'ScatterRegressionRenderer highlightPoint.label at right edge',
    expectViolation: false,
    el: React.createElement(ScatterRegressionRenderer, {
      figure: {
        points: [{ x: 1, y: 5 }, { x: 4, y: 9 }, { x: 7, y: 14 }, { x: 10, y: 21 }],
        xMin: 0, xMax: 10, yMin: 0, yMax: 25,
        highlightPoint: { x: 10, y: 21, label: 'unusually high point' },
        showResiduals: false,
      },
    }),
  },
  {
    name: 'ReactionCoordinateRenderer product_label in 132u right margin',
    expectViolation: false,
    el: React.createElement(ReactionCoordinateRenderer, {
      products_energy: -92,
      activation_energies: [167],
      product_label: 'Ammonia products (2 NH₃ molecules)',
    }),
  },
  {
    name: 'ProductionPossibilitiesRenderer points[].label at xAxis.max',
    expectViolation: false,
    el: React.createElement(ProductionPossibilitiesRenderer, {
      figure: {
        xAxis: { label: 'Consumer goods', max: 100 },
        yAxis: { label: 'Capital goods', max: 100 },
        curve: 'bowed-out',
        points: [{ x: 100, y: 0, label: 'A (all consumer goods)', position: 'on' }],
        title: 'Production possibilities',
      },
    }),
  },
  {
    name: 'EconMicro ComparativeAdvantageRenderer conclusion sentence (wrapped)',
    expectViolation: false,
    el: React.createElement(ComparativeAdvantageRenderer, {
      figure: {
        producerA: 'The United States', producerB: 'South Korea',
        goodX: 'commercial aircraft',
        goodY: 'electronics',
        outputAX: 40, outputAY: 80, outputBX: 30, outputBY: 90,
        oppCostAX: 2, oppCostAY: 0.5, oppCostBX: 3, oppCostBY: 0.33,
        caX: 'A', caY: 'B',
      },
    }),
  },
  {
    name: 'AdAsRenderer labels.ad/sras at line ends + lras centered at edge',
    expectViolation: false,
    el: React.createElement(AdAsRenderer, {
      figure: {
        potentialGdp: 100,
        initialEquilibriumGdp: 50,
        initialPriceLevel: 50,
        showLras: true,
        shift: { curve: 'AD', direction: 'right', magnitude: 20, label: 'AD shifts right (fiscal stimulus)' },
        finalEquilibriumGdp: 60,
        finalEquilibriumPriceLevel: 60,
        labels: {
          eqInitial: 'E₀', eqFinal: 'E₁',
          ad: 'AD (aggregate demand)',
          sras: 'SRAS (short-run aggregate supply)',
          lras: 'LRAS (potential output)',
        },
      },
    }),
  },
  {
    name: 'BusinessCycleRenderer markers[].label at t=0 and t=1',
    expectViolation: false,
    el: React.createElement(BusinessCycleRenderer, {
      figure: {
        cycles: 1.5, amplitude: 0.18, trendSlope: 0.4,
        showTrend: true, showOutputGap: false, labels: 'all',
        markers: [
          { t: 0, label: 'Expansion begins here' },
          { t: 1, label: 'Contraction phase begins' },
        ],
        title: 'The business cycle',
      },
    }),
  },
];
