/**
 * 2026-07-19 retrofit fixtures — ProjectileMotionRenderer + CollisionRenderer.
 *
 * Worst-case payloads: a flat low-angle launch (vx-component label vs the
 * range annotation arrow), a steep cliff launch (small range pulls the x-axis
 * caption onto the range arrow, with h₀/vᵧ/θ crowding the left edge), and
 * head-on collisions whose converging velocity arrows put both speed labels
 * in the same inter-body gap.
 */
import React from 'react';
import type { LabelFixture } from '../lib/label-collision-harness';
import ProjectileMotionRenderer from '../../apps/marketing/src/app/tutor/components/whiteboard/ProjectileMotionRenderer';
import CollisionRenderer from '../../apps/marketing/src/app/tutor/components/whiteboard/CollisionRenderer';

const fixtures: LabelFixture[] = [
  {
    // Ground-level low-angle shot: components shown, so the vₓ label sits at
    // ground+14 — straight through the range annotation arrow at ground+12.
    name: 'projectile-flat-launch-components',
    viewbox: { w: 520, h: 360 },
    checkArrows: true,
    element: React.createElement(ProjectileMotionRenderer, {
      title: 'Projectile at 20°',
      v0: 30,
      angle: 20,
      showComponents: true,
    }),
  },
  {
    // Steep throw off a cliff: tiny range → the "x (m)" caption lands on the
    // range arrow; h₀ / vᵧ / θ annotations crowd the launch corner.
    name: 'projectile-steep-cliff-launch',
    viewbox: { w: 520, h: 360 },
    checkArrows: true,
    element: React.createElement(ProjectileMotionRenderer, {
      v0: 12,
      angle: 75,
      y0: 15,
      showComponents: true,
      notes: 'Ball thrown from a 15 m building',
    }),
  },
  {
    // Head-on 1D elastic collision: both bodies' arrows are capped into the
    // same gap between them, so both "v = ..." labels land in that gap.
    name: 'collision-head-on-1d-elastic',
    viewbox: { w: 560, h: 360 },
    checkArrows: true,
    element: React.createElement(CollisionRenderer, {
      title: 'Truck vs car',
      type: 'elastic' as const,
      before: [
        { label: 'A', mass: 1200, velocity: 8.5 },
        { label: 'B', mass: 800, velocity: -6.75 },
      ],
      after: [
        { label: 'A', mass: 1200, velocity: -3.7 },
        { label: 'B', mass: 800, velocity: 11.55 },
      ],
      momentumAnnotation: 'p = Σmv = 4800 kg·m/s',
    }),
  },
  {
    // Right-angle 2D collision: B moves straight up, so its wide "(vx, vy)"
    // label is centered 14px beside a vertical arrow — across its own shaft.
    name: 'collision-right-angle-2d',
    viewbox: { w: 560, h: 360 },
    checkArrows: true,
    element: React.createElement(CollisionRenderer, {
      dimension: '2D' as const,
      type: 'perfectly-inelastic' as const,
      before: [
        { label: 'A', mass: 2, vx: 4, vy: 0 },
        { label: 'B', mass: 2, vx: 0, vy: 4 },
      ],
      after: [
        { label: 'A', mass: 2, vx: 2, vy: 2 },
        { label: 'B', mass: 2, vx: 2, vy: 2 },
      ],
    }),
  },
];

export default fixtures;
