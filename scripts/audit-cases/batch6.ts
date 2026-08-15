/**
 * Clip-audit cases — batch 6 (docs/svg-renderer-clip-audit-2026-08-07.md):
 * PhonicsRenderer, PolarGraphRenderer, ParametricCurveRenderer,
 * CollisionRenderer, EnergyBarsRenderer, CellDiagramRenderer, MapRenderer,
 * MotionDiagramRenderer, GeometryRenderer.
 * One case per fixed label site, worst-case payloads; expectViolation:false
 * is the permanent regression (fixes must keep the SAME payloads clean).
 */
import React from 'react';
import type { AuditCase } from '../lib/svg-text-extents';
import PhonicsRenderer from '../../apps/marketing/src/app/tutor/components/whiteboard/PhonicsRenderer';
import { PolarGraphRenderer } from '../../apps/marketing/src/app/tutor/components/whiteboard/PolarGraphRenderer';
import { ParametricCurveRenderer } from '../../apps/marketing/src/app/tutor/components/whiteboard/ParametricCurveRenderer';
import CollisionRenderer from '../../apps/marketing/src/app/tutor/components/whiteboard/CollisionRenderer';
import EnergyBarsRenderer from '../../apps/marketing/src/app/tutor/components/whiteboard/EnergyBarsRenderer';
import CellDiagramRenderer from '../../apps/marketing/src/app/tutor/components/whiteboard/CellDiagramRenderer';
import MapRenderer from '../../apps/marketing/src/app/tutor/components/whiteboard/MapRenderer';
import MotionDiagramRenderer from '../../apps/marketing/src/app/tutor/components/whiteboard/MotionDiagramRenderer';
import GeometryRenderer from '../../apps/marketing/src/app/tutor/components/whiteboard/GeometryRenderer';

export const CASES: AuditCase[] = [
  {
    // sound_out with 13 per-char graphemes: boxW = 420/13 ≈ 32.3, totalW =
    // 420 + 12·8 = 516 > 480 → origin x goes negative, first box clips left.
    name: 'PhonicsRenderer sound_out ≥9 graphemes (origin pushed negative)',
    expectViolation: false,
    el: React.createElement(PhonicsRenderer, {
      spec: { kind: 'sound_out', word: 'understanding' },
    }),
  },
  {
    // 17-char word at letterW 30 → totalW 510 > 480, first letters clip left.
    name: 'PhonicsRenderer blend >16-char word',
    expectViolation: false,
    el: React.createElement(PhonicsRenderer, {
      spec: { kind: 'blend', word: 'misunderstandings', cluster: 'mis' },
    }),
  },
  {
    // The checker splits the 48px syllable line into per-syllable tspans
    // (each measured separately), so it CANNOT flag this site pre- or
    // post-fix — verified by construction instead: pre-fix
    // "in · ter · est · ing · ly" = 25 chars × 48 × 0.55 = 660 est px
    // centered in a fixed 480 view → [-90, 570]. Post-fix the font scales
    // down from the estimated total width (floor 20px, canvas grows at the
    // floor): fs = (480 − 40) / (25 × 0.55) = 32 → 25 × 32 × 0.55 = 440
    // centered → [20, 460] ⊂ [0, 480].
    name: 'PhonicsRenderer syllables long word at 48px (by-construction)',
    expectViolation: false,
    el: React.createElement(PhonicsRenderer, {
      spec: { kind: 'syllables', syllables: ['in', 'ter', 'est', 'ing', 'ly'], stressed: 1 },
    }),
  },
  {
    // Point near the curve's right edge (xAt ≈ 439) with anchor=start at +8.
    name: 'PolarGraphRenderer highlightPoint.label at curve right edge',
    expectViolation: false,
    el: React.createElement(PolarGraphRenderer, {
      figure: {
        curve: [{ x: 0, y: 0 }, { x: 2, y: 2 }, { x: 3.8, y: 0.6 }],
        rMax: 4,
        showAxes: true,
        highlightPoint: { theta: 0.16, r: 3.85, x: 3.8, y: 0.6, label: 'maximum petal tip (r = 4)' },
      },
    }),
  },
  {
    // Highlight at x = xMax (xAt = 492 of 520) with anchor=start at +8.
    name: 'ParametricCurveRenderer highlightT.label at xMax',
    expectViolation: false,
    el: React.createElement(ParametricCurveRenderer, {
      figure: {
        curve: [{ x: 0, y: 0, t: 0 }, { x: 5, y: 4, t: 1 }, { x: 10, y: 1, t: 2 }],
        xMin: 0, xMax: 10, yMin: 0, yMax: 5,
        highlightT: { t: 2, x: 10, y: 1, label: 'particle at t = 2 (turning point)' },
      },
    }),
  },
  {
    // 88-char momentumAnnotation + 104-char notes, both single unwrapped
    // centered lines in a 560-wide view pre-fix.
    name: 'CollisionRenderer momentumAnnotation + notes (long)',
    expectViolation: false,
    el: React.createElement(CollisionRenderer, {
      dimension: '1D',
      type: 'inelastic',
      before: [{ label: 'A', mass: 2, velocity: 3 }, { label: 'B', mass: 4, velocity: -1 }],
      after: [{ label: 'A', mass: 2, velocity: -1 }, { label: 'B', mass: 4, velocity: 1 }],
      momentumAnnotation: 'Total momentum p = m1v1 + m2v2 = (2.0)(3.0) + (4.0)(-1.0) = 2.0 kg·m/s before and after',
      notes: 'Momentum is conserved because the net external force on the two-cart system is zero during the collision.',
    }),
  },
  {
    // 37-char label centered under the LAST column (center x ≈ 428 of 520)
    // + 90-char notes line.
    name: 'EnergyBarsRenderer positions[].label under last column + notes',
    expectViolation: false,
    el: React.createElement(EnergyBarsRenderer, {
      positions: [
        { label: 'Compressed (spring locked)', ke: 0, pe: 0, spring: 100 },
        { label: 'Release point', ke: 60, pe: 0, spring: 40 },
        { label: 'After release (spring fully extended)', ke: 100, pe: 0, spring: 0 },
      ],
      notes: 'Assumes a frictionless track, so no energy is converted to thermal energy anywhere in the motion.',
    }),
  },
  {
    // Golgi is a LEFT-side callout (anchor=end clamped to x=140 — sized for
    // the organelle NAME); its 42-char note at fontSize 9 is ~208 est px.
    name: 'CellDiagramRenderer highlight[].note wider than the name clamp',
    expectViolation: false,
    el: React.createElement(CellDiagramRenderer, {
      type: 'animal',
      highlight: [{ organelle: 'golgi', note: 'Packages proteins into vesicles for export' }],
    }),
  },
  {
    // Region centroid near the right edge (norm x = 93 → lx ≈ 549 of 600)
    // with a 35-char centered label; pins go through deoverlapLabels,
    // regions didn't.
    name: 'MapRenderer regions[].label at right-edge centroid',
    expectViolation: false,
    el: React.createElement(MapRenderer, {
      background: 'blank',
      regions: [{
        points: '88,40 98,40 98,60 88,60',
        label: 'Mediterranean maritime trade routes',
      }],
      pins: [{ x: 20, y: 30, label: 'Carthage' }],
    }),
  },
  {
    // The checker skips transformed <text>, so the rotated series label is
    // verified BY CONSTRUCTION: 3 panels, no title/notes → pad.top = 14,
    // pad.bottom = 28, plotH = 318, panelH = 106, gap = 8. Pre-fix the
    // 41-char label renders at fontSize 12 rotated −90 centered on the
    // panel mid-Y (top panel midY = 63): extent 41 × 12 × 0.55 = 270.6 →
    // vertical span [−72, 198] — spills past the viewBox top AND two
    // panels. Post-fix the label wraps to 2 rotated lines and the font
    // scales to the panel budget (106 − 8 − 4 = 94): lines "position of
    // the ball" (20) / "above the ground (m)" (20), fs = min(12, 94 /
    // (20 × 0.55)) = 8.5 → extent 20 × 8.5 × 0.55 = 93.5 ≤ 94, centered
    // at midY → stays inside each panel by construction.
    name: 'MotionDiagramRenderer rotated series[].label (by-construction)',
    expectViolation: false,
    el: React.createElement(MotionDiagramRenderer, {
      series: [
        { kind: 'position', label: 'position of the ball above the ground (m)', points: [{ t: 0, value: 0 }, { t: 1, value: 5 }, { t: 2, value: 20 }] },
        { kind: 'velocity', label: 'velocity of the ball just before impact (m/s)', points: [{ t: 0, value: 0 }, { t: 1, value: 10 }, { t: 2, value: 20 }] },
        { kind: 'acceleration', points: [{ t: 0, value: 9.8 }, { t: 2, value: 9.8 }] },
      ],
    }),
  },
  {
    // B (10, 5) sits at px ≈ 442 of 500; its start-anchored label at +14
    // overflows right. The vertical right-edge segment's 28-char middle-
    // anchored label (x ≈ 428) overflows too. The force-directed resolver
    // is bounds-blind pre-fix.
    name: 'GeometryRenderer points[].label(+showCoords) + segments[].label at right edge',
    expectViolation: false,
    el: React.createElement(GeometryRenderer, {
      points: [
        { id: 'A', x: 0, y: 0, label: 'A' },
        { id: 'B', x: 10, y: 5, label: 'B', showCoords: true },
        { id: 'C', x: 10, y: 0, label: 'C', showCoords: true },
      ],
      segments: [
        { from: 'A', to: 'B', label: 'AB', showLength: true },
        { from: 'B', to: 'C', label: 'perpendicular bisector of AB' },
      ],
      showAxes: true,
    }),
  },
];
