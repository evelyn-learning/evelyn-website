import type { Scenario } from '../types';

/**
 * Phase-1 carried verification debt (user delegated 2026-07-10):
 *  1. Translucent fills settle at design opacity (no flash/snap) — steer
 *     the brain to a CATALOG shaded figure, away from Desmos.
 *  2. Barge-in mid-draw fast-forwards animations (turn-end finishAll).
 *  3. Resume/reload renders the restored board instantly (bulk-mount cap).
 * Run with TUTOR_E2E_VIDEO=1; requires NEXT_PUBLIC_TUTOR_DRAW_ON=true.
 */
const scenario: Scenario = {
  name: 'draw-on-verify-debt',
  description: 'Translucent settle + barge-in mid-draw + resume instant board.',
  start: { subject: 'math', level: 'High School', topic: 'jee-math', lessonPlanId: 'evelyn.jee.coordinate-geometry.v1', studentName: 'Test Student' },
  seedTurns: [],
  testTurns: [
    {
      say: 'Draw the solution region of the inequality y < x + 2 as a shaded diagram on the whiteboard — use your drawn diagram tools, not the graphing calculator.',
      watchFor: 'Catalog inequality/shaded figure (NOT Desmos iframe); shaded region fades in and SETTLES at translucent design opacity — no flash-to-opaque, no snap at animation end.',
      timeoutMs: 150_000,
    },
    {
      say: 'Now draw the triangle with vertices at (0,0), (4,0) and (0,3) and mark the right angle.',
      trigger: '__tutorForceFalseBargein',
      triggerDelayMs: 6500,
      watchFor: 'Barge-in lands while the figure may still be drawing; all strokes must jump to complete instantly — no frozen half-drawn figure in subsequent frames.',
      timeoutMs: 150_000,
    },
  ],
  reloadAfterTurn: 1,
};

export default scenario;
