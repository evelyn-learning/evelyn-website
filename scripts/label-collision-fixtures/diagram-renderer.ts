/**
 * DiagramRenderer fixtures (2026-07-19 renderer label-collision audit) —
 * the generic Mafs-based physics diagrams (`showDiagram` types: vectors,
 * free-body, motion, circular-path...). Worst offenders reproduced here:
 * near-parallel vector tip + angle labels, duplicate-direction force
 * labels, decelerating motion-dot clusters, adjacent circle-point labels.
 *
 * Two quirks vs the plain-SVG renderers:
 *  - DiagramRenderer transitively imports CSS (mafs/core.css, KaTeX via
 *    EquationRenderer) which tsx cannot parse (same constraint documented
 *    in scripts/test-replay-scrubber.ts) — stub the .css loader before
 *    require()ing it.
 *  - Mafs emits <text>/<line> geometry in pixel space, but its svg
 *    viewBox has a NEGATIVE min corner (origin-centered), while the
 *    harness assumes a 0-origin viewbox. Each fixture renders the REAL
 *    component once, then shifts every coordinate by the parsed viewBox
 *    min — a pure frame translation, no geometry change.
 */
import React from 'react';
import Module from 'module';
import { renderToStaticMarkup } from 'react-dom/server';
import type { LabelFixture } from '../lib/label-collision-harness';

// Stub .css requires (tsx would otherwise SyntaxError on mafs/core.css).
(Module as unknown as {
  _extensions: Record<string, (mod: unknown, filename: string) => void>;
})._extensions['.css'] = () => {};

// Loaded via require AFTER the stub above — a static import would hoist
// past it and crash on the CSS.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  VectorDiagram,
  FreeBodyDiagram,
  MotionDiagram,
  CircularPathDiagram,
  // eslint-disable-next-line @typescript-eslint/no-require-imports
} = require('../../apps/marketing/src/app/tutor/components/whiteboard/DiagramRenderer') as {
  VectorDiagram: React.ComponentType<Record<string, unknown>>;
  FreeBodyDiagram: React.ComponentType<Record<string, unknown>>;
  MotionDiagram: React.ComponentType<Record<string, unknown>>;
  CircularPathDiagram: React.ComponentType<Record<string, unknown>>;
};

const NUM = '[-\\d.eE+]+';

function shiftTag(tag: string, offsets: Record<string, number>): string {
  return tag.replace(
    new RegExp(`(?<=\\s)(x1|y1|x2|y2|x|y)="(${NUM})"`, 'g'),
    (m, name: string, val: string) =>
      name in offsets ? `${name}="${parseFloat(val) - offsets[name]}"` : m,
  );
}

/** Render a Mafs component and translate its pixel geometry to the
 *  0-origin frame the harness expects. */
function mafsFixture(name: string, element: React.ReactElement, checkArrows = false): LabelFixture {
  const html = renderToStaticMarkup(element);
  const vb = html.match(new RegExp(`viewBox="(${NUM}) (${NUM}) (${NUM}) (${NUM})"`));
  if (!vb) throw new Error(`${name}: no Mafs svg viewBox found — was <Mafs ssr> dropped?`);
  const [ox, oy, w, h] = [vb[1], vb[2], vb[3], vb[4]].map(parseFloat);
  const shifted = html
    .replace(/<text\b[^>]*>/g, (tag) => shiftTag(tag, { x: ox, y: oy }))
    .replace(/<line\b[^>]*>/g, (tag) => shiftTag(tag, { x1: ox, y1: oy, x2: ox, y2: oy }));
  return {
    name,
    viewbox: { w, h },
    checkArrows,
    element: React.createElement('div', { dangerouslySetInnerHTML: { __html: shifted } }),
  };
}

const fixtures: LabelFixture[] = [
  // Two near-parallel velocity vectors: tip labels land almost on top of
  // each other, and both angle labels crowd the same spot near the origin.
  mafsFixture(
    'diagram-vector-close-directions',
    React.createElement(VectorDiagram, {
      title: 'Adding two velocity vectors',
      vectors: [
        { magnitude: 5, direction: 40, label: 'v₁ = 5 m/s' },
        { magnitude: 5.5, direction: 52, label: 'v₂ = 5.5 m/s' },
      ],
    }),
  ),
  // Two same-direction forces put both labels at the identical inline
  // spot past the arrow tip; the object caption sits ON the shaft.
  mafsFixture(
    'diagram-fbd-duplicate-direction-forces',
    React.createElement(FreeBodyDiagram, {
      objectLabel: 'Cart',
      forces: [
        { magnitude: 20, direction: 0, label: 'F_applied = 20 N' },
        { magnitude: 15, direction: 0, label: 'T = 15 N' },
        { magnitude: 10, direction: 90, label: 'N' },
        { magnitude: 10, direction: 270, label: 'W = mg' },
      ],
    }),
    true,
  ),
  // Decelerating object: dots bunch up at the end and the t=…s captions
  // composite into each other.
  mafsFixture(
    'diagram-motion-decelerating-cluster',
    React.createElement(MotionDiagram, {
      title: 'Braking car',
      positions: [
        { x: 0, y: 0, t: 0 },
        { x: 3, y: 0, t: 1 },
        { x: 5, y: 0, t: 2 },
        { x: 6.3, y: 0, t: 3 },
        { x: 6.9, y: 0, t: 4 },
        { x: 7.2, y: 0, t: 5 },
      ],
    }),
    true,
  ),
  // Two labeled points 20° apart near the top of the circle — long labels
  // at nearly the same height overlap.
  mafsFixture(
    'diagram-circular-adjacent-points',
    React.createElement(CircularPathDiagram, {
      radius: 3,
      title: 'Vertical loop',
      points: [
        { angle: 80, label: 'Start point' },
        { angle: 100, label: 'Top of loop' },
        { angle: 270, label: 'S' },
      ],
    }),
  ),
];

export default fixtures;
