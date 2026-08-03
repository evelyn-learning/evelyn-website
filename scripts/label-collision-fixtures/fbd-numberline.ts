/**
 * Original 2026-07-19 regression fixtures (live sessions 1784320013977,
 * 1784182146307/1784194326500) — FBD + number line.
 */
import React from 'react';
import type { LabelFixture } from '../lib/label-collision-harness';
import FreeBodyDiagramRenderer from '../../src/app/tutor/components/whiteboard/FreeBodyDiagramRenderer';
import { NumberLineRenderer } from '../../src/app/tutor/components/whiteboard/NumberLineRenderer';

const fixtures: LabelFixture[] = [
  {
    name: 'fbd-opposed-horizontal',
    viewbox: { w: 520, h: 380 },
    checkArrows: true,
    element: React.createElement(FreeBodyDiagramRenderer, {
      title: 'You push a wall... does it push back?',
      object: { label: 'You', shape: 'person' as const },
      surface: { type: 'none' as const },
      forces: [
        { name: 'Push on wall', magnitude: 'F', direction: 'right' as const },
        { name: 'Wall pushes back', magnitude: 'F', direction: 'left' as const },
      ],
    }),
  },
  {
    name: 'fbd-four-forces-box',
    viewbox: { w: 520, h: 380 },
    checkArrows: true,
    element: React.createElement(FreeBodyDiagramRenderer, {
      object: { shape: 'box' as const, mass: 'm = 5 kg' },
      surface: { type: 'horizontal' as const },
      forces: [
        { name: 'N', direction: 'up' as const },
        { name: 'W', magnitude: 'mg', direction: 'down' as const },
        { name: 'F_app', magnitude: '20 N', direction: 'right' as const },
        { name: 'f_k', magnitude: '8 N', direction: 'left' as const },
      ],
    }),
  },
  {
    name: 'numberline-segment-vs-point',
    viewbox: { w: 500, h: 170 },
    element: React.createElement(NumberLineRenderer, {
      min: 0, max: 4, step: 1,
      points: [{ value: 1, label: 'diameter piece', color: '#3b82f6' }],
      segments: [
        { from: 0, to: 1, label: 'diameter', color: '#2563eb' },
        { from: 1, to: 4, label: 'wrap ≈ 3.14 diameters', color: '#92400e' },
      ],
    }),
  },
  {
    name: 'numberline-interval-plus-points',
    viewbox: { w: 500, h: 170 },
    element: React.createElement(NumberLineRenderer, {
      min: -2, max: 6, step: 1,
      intervals: [{ from: 0, to: 3, label: 'solution set', fromInclusive: true, toInclusive: false }],
      points: [
        { value: 0, label: 'start' },
        { value: 3, label: 'boundary', style: 'open' as const },
        { value: 1.5, label: 'midpoint' },
      ],
    }),
  },
  {
    // R38 regression: step=0.333333 vs fractionTicks 1/3 differ by ~3e-7,
    // far over old 1e-9 epsilon, so both passes printed "0.3333" at same pixel.
    // With step-relative epsilon (step * 1e-3), the fraction tick 1/3 is
    // properly deduplicated and no label overlap occurs.
    name: 'numberline-decimal-step-fraction-dedup',
    viewbox: { w: 500, h: 170 },
    element: React.createElement(NumberLineRenderer, {
      min: 0, max: 1, step: 0.333333,
      fractionTicks: { denominator: 3, showLabels: true },
    }),
  },
  {
    // R38 regression: step=0.25 with fractionTicks denominator 3 should
    // NOT over-deduplicate. Fraction ticks at 1/3, 2/3 should survive since
    // step grid (0, 0.25, 0.5, 0.75, 1) doesn't align with 1/3, 2/3.
    name: 'numberline-quarter-step-fraction-survives',
    viewbox: { w: 500, h: 170 },
    element: React.createElement(NumberLineRenderer, {
      min: 0, max: 1, step: 0.25,
      fractionTicks: { denominator: 3, showLabels: true },
    }),
  },
];

export default fixtures;
