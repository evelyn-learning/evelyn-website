/**
 * 2026-07-19 renderer label-collision audit — retrofit wave 2 fixtures for
 * PendulumRenderer, SpringMassRenderer and WaveRenderer. Worst-case but
 * realistic payloads: above-horizontal pendulum release crowding the L/m
 * captions, a compressed spring-mass whose mass caption grazes the
 * displacement arrow, a coupled chain with verbose spring-constant labels,
 * and interference waves with verbose legend labels.
 */
import React from 'react';
import type { LabelFixture } from '../lib/label-collision-harness';
import PendulumRenderer from '../../apps/marketing/src/app/tutor/components/whiteboard/PendulumRenderer';
import SpringMassRenderer from '../../apps/marketing/src/app/tutor/components/whiteboard/SpringMassRenderer';
import WaveRenderer from '../../apps/marketing/src/app/tutor/components/whiteboard/WaveRenderer';

const fixtures: LabelFixture[] = [
  {
    // Energy-conservation setup: release above horizontal puts the bob in
    // the string's upper band, where the L and m captions converge.
    name: 'pendulum-above-horizontal-crowding',
    viewbox: { w: 520, h: 360 },
    element: React.createElement(PendulumRenderer, {
      title: 'Pendulum released above horizontal',
      length: 0.875,
      amplitude: 100,
      mass: 0.256,
    }),
  },
  {
    // Typical payload — pins the no-collision case so the retrofit stays
    // pixel-identical for ordinary renders.
    name: 'pendulum-typical-regression',
    viewbox: { w: 520, h: 360 },
    element: React.createElement(PendulumRenderer, { length: 1.5, amplitude: 25, mass: 0.5 }),
  },
  {
    // Legacy single-mass horizontal mode, compressed: the mass caption sits
    // directly over the double-headed displacement arrow's shaft band.
    name: 'springmass-compressed-displacement-arrow',
    viewbox: { w: 520, h: 360 },
    checkArrows: true,
    element: React.createElement(SpringMassRenderer, {
      title: 'Compressed spring',
      k: 250,
      mass: 0.5,
      displacement: -0.5,
      naturalLength: 1,
    }),
  },
  {
    // Chain mode: three coupled springs with the verbose spring-constant
    // labels the LLM actually writes — adjacent labels on one row overlap.
    name: 'springmass-chain-verbose-labels',
    viewbox: { w: 520, h: 360 },
    element: React.createElement(SpringMassRenderer, {
      elements: [
        { type: 'wall' as const },
        { type: 'spring' as const, k: 250, label: 'spring constant k₁ = 250 N/m' },
        { type: 'mass' as const, mass: 0.5 },
        { type: 'spring' as const, k: 250, label: 'spring constant k₂ = 250 N/m' },
        { type: 'mass' as const, mass: 0.5 },
        { type: 'spring' as const, k: 250, label: 'spring constant k₃ = 250 N/m' },
        { type: 'mass' as const, mass: 0.5 },
      ],
    }),
  },
  {
    // Verbose legend labels run into the next legend entry ("sum" included).
    name: 'wave-superposition-verbose-legend',
    viewbox: { w: 520, h: 360 },
    element: React.createElement(WaveRenderer, {
      wave: { amplitude: 2, wavelength: 2, label: 'incident wave (f = 2 Hz)' },
      secondary: { amplitude: 2, wavelength: 2, phase: 180, label: 'reflected wave (inverted)' },
      showSuperposition: true,
      frequency: 2,
    }),
  },
  {
    // Unequal waves: the λ bracket collapses to a sliver (label wider than
    // the bracket) while both legend labels are verbose.
    name: 'wave-unequal-interference-legend',
    viewbox: { w: 520, h: 360 },
    element: React.createElement(WaveRenderer, {
      title: 'Interference of unequal waves',
      wave: { amplitude: 0.4, wavelength: 0.5, label: 'incident pulse (moving right)' },
      secondary: { amplitude: 2, wavelength: 10, label: 'reflected pulse (inverted)' },
      frequency: 4,
      xLabel: 'position along the string (m)',
    }),
  },
];

export default fixtures;
