import type { Scenario } from '../types';

/**
 * UI-audit scenario (2026-07-10) — deliberately VISUAL-HEAVY to exercise the
 * whiteboard's expensive paths that equation-only sessions never hit:
 * Desmos graph render, comparison table, labeled diagram, cross-page
 * navigation back to a graph page (full page remount + Desmos re-init),
 * and scribbles on existing content. Run with TUTOR_E2E_VIDEO=1 and read
 * perf.json (layout shifts / long tasks / scroll bursts) for jank evidence.
 */
const scenario: Scenario = {
  name: 'ui-audit-visuals',
  description: 'Render-heavy UI jank audit — graph, table, diagram, cross-page nav, scribbles.',
  start: { subject: 'math', level: 'High School', topic: 'jee-math', lessonPlanId: 'evelyn.jee.coordinate-geometry.v1', studentName: 'Test Student' },
  seedTurns: [{ say: 'ellipses' }],
  testTurns: [
    {
      say: 'Can you draw the graph of the ellipse x squared over 9 plus y squared over 4 equals 1?',
      watchFor: 'Desmos (or catalog) ellipse graph renders; note paint delay and any layout shift.',
      timeoutMs: 150_000,
    },
    {
      say: 'Nice. Can you make a table comparing ellipse and hyperbola — equations, foci, eccentricity?',
      watchFor: 'Comparison table renders (likely new page); KaTeX in cells.',
      timeoutMs: 150_000,
    },
    {
      say: 'Now show me a labeled diagram of an ellipse with its foci and axes marked.',
      watchFor: 'Catalog conic/diagram render with labels.',
      timeoutMs: 150_000,
    },
    {
      say: 'Go back to the graph you drew first and circle the point where the ellipse crosses the positive x-axis.',
      watchFor: 'Cross-page navigation back to the graph page — page remount, Desmos re-instantiation flash, scribble placement.',
      timeoutMs: 150_000,
    },
    {
      say: 'Can you show that ellipse equation one more time?',
      watchFor: 'Dedup re-show should scroll to the existing equation, not duplicate it.',
      timeoutMs: 150_000,
    },
  ],
};

export default scenario;
