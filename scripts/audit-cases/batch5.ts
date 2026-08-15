/**
 * Clip-audit cases — batch 5 (catalog figure renderers):
 * CatalogPhaseDiagramRenderer, CatalogVectors3DRenderer,
 * CatalogNutrientCycleRenderer, CatalogSimpleCircuitRenderer,
 * CatalogPhScaleRenderer, CatalogCoordinateGridRenderer,
 * CatalogCycleStagesRenderer.
 * Worst-case payloads from docs/svg-renderer-clip-audit-2026-08-07.md; every
 * case was confirmed VIOLATING pre-fix, so expectViolation:false makes each
 * one a permanent regression test.
 */
import React from 'react';
import type { AuditCase } from '../lib/svg-text-extents';
import { CatalogPhaseDiagramRenderer } from '../../apps/marketing/src/app/tutor/components/whiteboard/CatalogPhaseDiagramRenderer';
import { CatalogVectors3DRenderer } from '../../apps/marketing/src/app/tutor/components/whiteboard/CatalogVectors3DRenderer';
import { CatalogNutrientCycleRenderer } from '../../apps/marketing/src/app/tutor/components/whiteboard/CatalogNutrientCycleRenderer';
import { CatalogSimpleCircuitRenderer } from '../../apps/marketing/src/app/tutor/components/whiteboard/CatalogSimpleCircuitRenderer';
import { CatalogPhScaleRenderer } from '../../apps/marketing/src/app/tutor/components/whiteboard/CatalogChemistryRenderers';
import { CatalogCoordinateGridRenderer } from '../../apps/marketing/src/app/tutor/components/whiteboard/CatalogElementaryMathRenderers';
import { CatalogCycleStagesRenderer } from '../../apps/marketing/src/app/tutor/components/whiteboard/CatalogCycleStagesRenderer';

export const CASES: AuditCase[] = [
  {
    // triple.label (anchor=end near left), critical fallback at t≥0.9
    // (anchor=start near right), marker.label (anchor=start near right).
    name: 'CatalogPhaseDiagramRenderer triple/critical/marker labels',
    expectViolation: false,
    el: React.createElement(CatalogPhaseDiagramRenderer, {
      figure: {
        triple: { t: 0.12, p: 0.12, label: 'triple point (0.006 atm, 0.01°C)' },
        critical: { t: 0.92, p: 0.85 }, // fallback "critical point"
        fusionSlope: 'negative',
        marker: { t: 0.88, p: 0.5, label: 'supercritical fluid boundary' },
        tLabel: 'Temperature',
        pLabel: 'Pressure',
        title: 'Phase Diagram of Water',
      },
    }),
  },
  {
    // anchor=start labels at tip+6 where the projection fills the frame.
    name: 'CatalogVectors3DRenderer vector/point/line/plane labels',
    expectViolation: false,
    el: React.createElement(CatalogVectors3DRenderer, {
      figure: {
        range: 5,
        vectors: [{ to: [5, -4, 2], from: [0, 0, 0], label: 'v = 5i − 4j + 2k (velocity)' }],
        points: [{ at: [4, -4, 1], label: 'P(4, −4, 1) initial position' }],
        line: { point: [0, 0, 0], dir: [1, -1, 0], label: 'line r = t(i − j)' },
        plane: { point: [2, -2, 0], normal: [0, 0, 1], label: 'plane z = 0 (xy-plane)' },
        title: '3D vectors',
      },
    }),
  },
  {
    // Ring boxes at x=460 (right) / x=140 (left) of W=600 with labels past
    // the capped 168u box estimate; flux label longer than its backing rect.
    name: 'CatalogNutrientCycleRenderer reservoirs[].label + fluxes[].label',
    expectViolation: false,
    el: React.createElement(CatalogNutrientCycleRenderer, {
      figure: {
        reservoirs: [
          { id: 'atmosphere', label: 'Atmosphere — carbon dioxide and methane gases' },
          { id: 'sediments', label: 'Deep ocean sediments and fossil fuel deposits' },
          { id: 'biosphere', label: 'Terrestrial biosphere' },
          { id: 'ocean', label: 'Ocean surface waters (dissolved carbon dioxide)' },
        ],
        fluxes: [
          { from: 'atmosphere', to: 'ocean', label: 'ocean–atmosphere gas exchange (diffusion)' },
          { from: 'biosphere', to: 'atmosphere', label: 'respiration and decomposition' },
        ],
      },
    }),
  },
  {
    // components[].label/value centered at local x=0 on loop corners; labels
    // previously also inherited the group rotate(180/270).
    name: 'CatalogSimpleCircuitRenderer components[].label/value',
    expectViolation: false,
    el: React.createElement(CatalogSimpleCircuitRenderer, {
      figure: {
        components: [
          { type: 'battery', value: '9V battery (EMF source)' },
          { type: 'resistor', label: 'R1 = 100Ω fixed resistor' },
          { type: 'bulb', label: 'indicator bulb' },
          { type: 'ammeter', label: 'ammeter reads 0.09 A' },
        ],
        title: 'Series circuit',
      },
    }),
  },
  {
    // markers[].label centered at phX(0)=56 / phX(14)=724 of W=780.
    name: 'CatalogPhScaleRenderer markers[].label at pH 0 and 14',
    expectViolation: false,
    el: React.createElement(CatalogPhScaleRenderer, {
      figure: {
        showRegions: true,
        markers: [
          { label: 'Concentrated hydrochloric acid', ph: 0 },
          { label: 'Pure water', ph: 7 },
          { label: 'Sodium hydroxide drain cleaner', ph: 14 },
        ],
      },
    }),
  },
  {
    // points[].label: old fixed 60u flipX guard was sized for "(x, y)" — a
    // long label at x=8 of 10 overflowed before the flip kicked in.
    name: 'CatalogCoordinateGridRenderer points[].label near right edge',
    expectViolation: false,
    el: React.createElement(CatalogCoordinateGridRenderer, {
      figure: {
        title: 'Treasure map',
        points: [{ x: 8, y: 6, label: '(8, 6) treasure chest location' }],
        xMin: 0, xMax: 10, yMin: 0, yMax: 10,
        quadrants: 1,
        connect: false,
      },
    }),
  },
  {
    // stages[].label centered on ring nodes at x=90/430 of W=520.
    name: 'CatalogCycleStagesRenderer stages[].label on left/right nodes',
    expectViolation: false,
    el: React.createElement(CatalogCycleStagesRenderer, {
      figure: {
        stages: [
          { label: 'Evaporation from oceans and lakes' },
          { label: 'Condensation into clouds' },
          { label: 'Precipitation as rain and snow' },
          { label: 'Collection in rivers, lakes, and oceans' },
        ],
        title: 'The water cycle',
      },
    }),
  },
];
