/**
 * 2026-07-19 renderer label-collision audit fixtures — PulleySystemRenderer,
 * InclinedPlaneRenderer, RayDiagramRenderer.
 */
import React from 'react';
import type { LabelFixture } from '../lib/label-collision-harness';
import { PulleySystemRenderer } from '../../apps/marketing/src/app/tutor/components/whiteboard/PulleySystemRenderer';
import { InclinedPlaneRenderer } from '../../apps/marketing/src/app/tutor/components/whiteboard/InclinedPlaneRenderer';
import RayDiagramRenderer from '../../apps/marketing/src/app/tutor/components/whiteboard/RayDiagramRenderer';
import type { PulleyFigure, InclinedPlaneFigure } from '../../apps/marketing/src/lib/tutor/diagrams/catalog/kinds/physics';

const atwoodLongWeights: PulleyFigure = {
  mode: 'atwood',
  fixedCount: 1,
  movableCount: 0,
  weightLabel: '',
  mechanicalAdvantage: 1,
  leftSide: { label: 'm₁', weight: 'm₁g = 24.5 N' },
  rightSide: { label: 'm₂', weight: 'm₂g = 36.8 N' },
};

const inclinePulleyShallow: PulleyFigure = {
  mode: 'incline-pulley',
  fixedCount: 1,
  movableCount: 0,
  weightLabel: '',
  mechanicalAdvantage: 1,
  inclineAngle: 15,
  leftSide: { label: 'm₁', weight: 'm₁ = 8.0 kg' },
  rightSide: { label: 'm₂', weight: 'm₂ = 3.0 kg' },
};

const inclineWithMass: InclinedPlaneFigure = {
  angle: 25,
  mass: 5,
  showForces: true,
  showFriction: true,
};

const inclineFriction: InclinedPlaneFigure = {
  angle: 20,
  showForces: true,
  showFriction: true,
};

const fixtures: LabelFixture[] = [
  {
    // Two hanging masses at identical label heights — long tutor-style weight
    // strings ("m₁g = 24.5 N") overlap across the pulley centerline.
    name: 'pulley-atwood-long-weights',
    viewbox: { w: 480, h: 380 },
    element: React.createElement(PulleySystemRenderer, { figure: atwoodLongWeights }),
  },
  {
    // Shallow ramp bottom-clamps the hanging block to H-30; its weight label
    // (blockBottom + 16) then leaves the viewbox.
    name: 'pulley-incline-hanging-weight-clamp',
    viewbox: { w: 480, h: 380 },
    element: React.createElement(PulleySystemRenderer, { figure: inclinePulleyShallow }),
  },
  {
    // Mass label lives inside a translate+rotate group with local coords
    // (0, -13) — unmeasurable by any layout pass and parsed as off-viewbox.
    name: 'incline-forces-with-mass',
    viewbox: { w: 600, h: 360 },
    element: React.createElement(InclinedPlaneRenderer, { figure: inclineWithMass }),
  },
  {
    // Friction arrow points down-left; its label at (tip.x+8, tip.y+4) sits
    // back on its own shaft.
    name: 'incline-friction-label-on-shaft',
    viewbox: { w: 600, h: 360 },
    checkArrows: true,
    element: React.createElement(InclinedPlaneRenderer, { figure: inclineFriction }),
  },
  {
    // Object just beyond C: real inverted image lands beside the center-of-
    // curvature marker and "Image" composites into "C".
    name: 'ray-concave-image-vs-c',
    viewbox: { w: 520, h: 360 },
    checkArrows: true,
    element: React.createElement(RayDiagramRenderer, {
      type: 'concave-mirror',
      focalLength: 10,
      objectDistance: 22,
      objectHeight: 2,
    }),
  },
  {
    // Distant tall object: di → f, so the image arrow shaft crosses the F'
    // focal label just below the axis.
    name: 'ray-converging-fprime-vs-image-shaft',
    viewbox: { w: 520, h: 360 },
    checkArrows: true,
    element: React.createElement(RayDiagramRenderer, {
      type: 'converging',
      focalLength: 10,
      objectDistance: 60,
      objectHeight: 12,
    }),
  },
];

export default fixtures;
