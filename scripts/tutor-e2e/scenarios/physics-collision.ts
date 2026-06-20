import type { Scenario } from '../types';

/**
 * Measurement scenario (Pillar 3 broaden, 2026-06-20) — PHYSICS DIAGRAM + numeric.
 * Exercises the collision/momentum Cat-B validator family + prose physics
 * arithmetic. Known: perfectly inelastic, (2·3+1·0)/(2+1)=2 m/s; KE before
 * =9 J, after =6 J, lost =3 J.
 */
const scenario: Scenario = {
  name: 'physics-collision',
  description: 'AP Physics 1 momentum — inelastic collision diagram + conservation arithmetic.',
  start: {
    subject: 'science',
    level: 'AP',
    topic: 'ap-physics1',
    lessonPlanId: 'evelyn.ap.physics1.momentum.v1',
    studentName: 'Test Student',
  },
  seedTurns: [
    { say: 'momentum and collisions', watchFor: 'Tutor enters the momentum segment.' },
  ],
  testTurns: [
    {
      say: 'A 2 kg cart at 3 m/s hits a stationary 1 kg cart and they stick together. Find the final velocity and draw the before/after.',
      watchFor: 'Final v = 2 m/s (correct). Before/after collision diagram rendered. Any wrong spoken/written number? Diagram-validator rejection?',
      timeoutMs: 180_000,
    },
    {
      say: 'How much kinetic energy was lost?',
      watchFor: 'KE_before=9 J, KE_after=6 J, lost=3 J. Spoken arithmetic correct?',
      timeoutMs: 150_000,
    },
  ],
};

export default scenario;
