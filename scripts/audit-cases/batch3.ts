/**
 * Clip-audit cases — batch 3 (fractions/trees/organizers):
 * FractionComparisonRenderer, TreeRenderer, VennDiagramRenderer,
 * WritingFrameRenderer, GraphicOrganizerRenderer (kwl/t_chart),
 * EarlyMathRenderer (bar_model).
 * As each renderer is fixed, its case flips expectViolation → false.
 */
import React from 'react';
import type { AuditCase } from '../lib/svg-text-extents';
import { FractionComparisonRenderer } from '../../src/app/tutor/components/whiteboard/FractionComparisonRenderer';
import { TreeRenderer } from '../../src/app/tutor/components/whiteboard/TreeRenderer';
import { VennDiagramRenderer } from '../../src/app/tutor/components/whiteboard/VennDiagramRenderer';

export const CASES: AuditCase[] = [
  {
    name: 'FractionComparisonRenderer bar label',
    expectViolation: true,
    el: React.createElement(FractionComparisonRenderer, {
      figure: { fractions: [{ numerator: 2, denominator: 3, label: 'two-thirds of the pizza' }], style: 'bar' },
    }),
  },
  {
    name: 'TreeRenderer in-SVG title over node-only viewBox',
    expectViolation: true,
    el: React.createElement(TreeRenderer, {
      title: 'Probability of drawing two red cards without replacement',
      type: 'probability',
      root: {
        label: 'Start',
        children: [
          { label: 'Red', probability: '1/2', node: { label: 'R' } },
          { label: 'Black', probability: '1/2', node: { label: 'B' } },
        ],
      },
    }),
  },
  {
    name: 'VennDiagramRenderer title + set labels',
    expectViolation: true,
    el: React.createElement(VennDiagramRenderer, {
      title: 'Students who play a sport and students who play an instrument',
      sets: [{ label: 'Plays a school sport' }, { label: 'Plays an instrument' }],
      regions: { a: { items: ['Ravi'] }, b: { items: ['Chloe'] }, ab: { items: ['Sam'] } },
    }),
  },
];
