import type { Scenario } from '../types';

/**
 * Canonical scenario — the JEE coordinate-geometry session that surfaced the
 * conic-tangent bug (Console5). Drives the tutor to draw conics with tangents,
 * which is exactly where the hand-rolled-tangent / ellipse-as-circle bugs and
 * the render↔speech-sync timing showed up.
 */
const scenario: Scenario = {
  name: 'jee-conics-tangent',
  description: 'JEE coordinate geometry — draw conics + tangents (conic tangent_at fix, render-sync).',
  start: {
    subject: 'math',
    level: 'High School',
    topic: 'jee-math',
    lessonPlanId: 'evelyn.jee.coordinate-geometry.v1',
    studentName: 'Test Student',
  },
  seedTurns: [
    { say: 'conics', watchFor: 'Tutor moves into the conics segment.' },
    { say: 'parabola, let a = 1', watchFor: 'Parabola y²=4x context established; figure on board.' },
  ],
  testTurns: [
    {
      say: 'Can you draw the ellipse x²/9 + y²/4 = 1 with the tangent at the point (√5, 4/3)?',
      watchFor: 'Ellipse drawn as a TRUE ellipse (a=3,b=2), NOT a circle. Tangent at (√5,4/3) is actually tangent (slope ≈ −0.745), not a secant through V₂. Figure appears in sync with the narration, not before.',
      timeoutMs: 150_000,
    },
    {
      say: 'Now show the hyperbola x²/4 − y²/9 = 1 with the tangent at (√13, 9/2).',
      watchFor: 'Hyperbola has two branches; tangent at (√13,9/2) is tangent (slope ≈ 1.803). New figure on its own page; page pills numbered.',
      timeoutMs: 150_000,
    },
  ],
};

export default scenario;
