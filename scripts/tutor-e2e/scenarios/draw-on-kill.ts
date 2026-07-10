import type { Scenario } from '../types';

/**
 * SmoothDraw Phase-1 gate: a judge kill arriving while an item is mid
 * draw-on must fast-forward the animation — the retry's board state must
 * be complete/correct, never a half-drawn figure. Requires
 * NEXT_PUBLIC_TUTOR_DRAW_ON=true in .env.local (dev). Run with
 * TUTOR_E2E_VIDEO=1 and scrub the video around the kill.
 *
 * Third turn (added on review) exercises translucent fills — the fade-target
 * fix needs eyeballing: shaded/translucent regions should settle at their
 * design opacity, not flash-to-opaque then snap back at animation end.
 */
const scenario: Scenario = {
  name: 'draw-on-kill',
  description: 'Judge kill mid-draw-on fast-forwards animations; board lands complete.',
  start: { subject: 'math', level: 'High School', topic: 'jee-math', lessonPlanId: 'evelyn.jee.coordinate-geometry.v1', studentName: 'Test Student' },
  seedTurns: [{ say: 'ellipses' }],
  testTurns: [
    {
      say: 'Draw the ellipse x squared over 9 plus y squared over 4 equals 1 with its foci.',
      watchFor: 'Figure draws on stroke-by-stroke (video); final frame complete.',
      timeoutMs: 150_000,
    },
    {
      trigger: '__tutorForceKill',
      say: 'Now add the directrices to that figure.',
      watchFor: 'Kill fires during the turn; no half-drawn strokes persist after retry; board state correct.',
      timeoutMs: 150_000,
    },
    {
      say: 'Now shade the region inside the ellipse above the x-axis so I can see it.',
      watchFor: 'Shaded/translucent region settles at its design opacity — no flash-to-opaque then snap-back at animation end.',
      timeoutMs: 150_000,
    },
  ],
};

export default scenario;
