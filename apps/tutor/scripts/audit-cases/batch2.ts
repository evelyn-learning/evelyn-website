/**
 * Clip-audit cases — batch 2 (catalog renderers):
 * CatalogLogicGateRenderer, CatalogFlowchartSimpleRenderer,
 * CatalogBinaryTreeRenderer, LinkedListRenderer (via
 * CatalogDataStructureRenderer), CatalogComplexPlaneRenderer,
 * CatalogEnergyPyramidRenderer.
 * One case per fixed label site, worst-case payloads from
 * docs/svg-renderer-clip-audit-2026-08-07.md; expectViolation:false is the
 * permanent regression (fixes must keep the SAME payloads clean).
 */
import React from 'react';
import { createRequire } from 'node:module';
import type { AuditCase } from '../lib/svg-text-extents';

// CatalogAdvancedRenderers → CellContent → EquationRenderer imports
// katex.min.css, which the tsx CJS pipeline can't parse. Register a no-op
// .css loader BEFORE loading the renderer modules — hence createRequire
// (import statements would hoist above the registration).
const req = createRequire(__filename);
req.extensions['.css'] = () => {};
const { CatalogLogicGateRenderer, CatalogFlowchartSimpleRenderer, CatalogBinaryTreeRenderer } =
  req('../../src/app/tutor/components/whiteboard/CatalogCSRenderers') as typeof import('../../src/app/tutor/components/whiteboard/CatalogCSRenderers');
const { CatalogDataStructureRenderer } =
  req('../../src/app/tutor/components/whiteboard/CatalogCSStructuresRenderers') as typeof import('../../src/app/tutor/components/whiteboard/CatalogCSStructuresRenderers');
const { CatalogComplexPlaneRenderer } =
  req('../../src/app/tutor/components/whiteboard/CatalogAdvancedRenderers') as typeof import('../../src/app/tutor/components/whiteboard/CatalogAdvancedRenderers');
const { CatalogEnergyPyramidRenderer } =
  req('../../src/app/tutor/components/whiteboard/CatalogBioAnatomyRenderers') as typeof import('../../src/app/tutor/components/whiteboard/CatalogBioAnatomyRenderers');

export const CASES: AuditCase[] = [
  {
    name: 'CatalogLogicGateRenderer inputs[]/output labels',
    expectViolation: false,
    el: React.createElement(CatalogLogicGateRenderer, {
      figure: { gate: 'AND', inputs: ['A input', 'B input'], output: 'Output Q' },
    }),
  },
  {
    name: 'CatalogFlowchartSimpleRenderer back-edge label in right gutter',
    expectViolation: false,
    el: React.createElement(CatalogFlowchartSimpleRenderer, {
      figure: {
        nodes: [
          { id: 'start', type: 'start', text: 'Start' },
          { id: 'check', type: 'decision', text: 'More items?' },
          { id: 'end', type: 'end', text: 'Done' },
        ],
        edges: [
          { from: 'start', to: 'check' },
          { from: 'check', to: 'end', label: 'No' },
          { from: 'check', to: 'start', label: 'Yes — process next item' },
        ],
      },
    }),
  },
  {
    name: 'CatalogBinaryTreeRenderer long node values at outer columns',
    expectViolation: false,
    el: React.createElement(CatalogBinaryTreeRenderer, {
      figure: {
        root: {
          value: 'Ancestor',
          left: { value: 'Grandmother Rosa' },
          right: { value: 'Grandfather Louis' },
        },
      },
    }),
  },
  {
    name: 'LinkedListRenderer long items[] in 54u cells',
    expectViolation: false,
    el: React.createElement(CatalogDataStructureRenderer, {
      figure: { structure: 'linked_list', items: ['encapsulation', 'inheritance', 'polymorphism'] },
    }),
  },
  {
    name: 'CatalogComplexPlaneRenderer default labels at re=±range',
    expectViolation: false,
    el: React.createElement(CatalogComplexPlaneRenderer, {
      figure: { points: [{ re: 5, im: 3 }, { re: -5, im: -3 }], range: 5 },
    }),
  },
  {
    name: 'CatalogEnergyPyramidRenderer energy+units at solver defaults',
    expectViolation: false,
    el: React.createElement(CatalogEnergyPyramidRenderer, {
      figure: {
        levels: [
          { label: 'Producers', organisms: 'grasses, plants', energy: 10000 },
          { label: 'Primary consumers', organisms: 'herbivores', energy: 1000 },
          { label: 'Secondary consumers', organisms: 'carnivores', energy: 100 },
          { label: 'Tertiary consumers', organisms: 'top carnivores', energy: 10 },
        ],
        showEnergy: true,
        efficiency: 0.1,
        units: 'kcal/m²/yr',
      },
    }),
  },
];
