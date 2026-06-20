import type { Scenario } from '../types';

/**
 * Measurement scenario (Pillar 3 broaden, 2026-06-20) — ECONOMICS graph family.
 * Exercises the economic-graph tools (AD-AS / supply-demand) — a distinct
 * structured-figure family from geometry/physics. Mostly STRUCTURAL (curve
 * positions, shift direction, gap labeling), minimal numeric. Probes whether
 * errors are figure-shape vs prose, and which validator (if any) catches them.
 */
const scenario: Scenario = {
  name: 'macro-ad-as',
  description: 'AP Macro — AD-AS graph with a recessionary gap (economic-graph figure).',
  start: {
    subject: 'social-studies',
    level: 'AP',
    topic: 'ap-macro',
    lessonPlanId: 'evelyn.ap.macro.economic-growth.v1',
    studentName: 'Test Student',
  },
  seedTurns: [
    { say: 'aggregate demand and supply', watchFor: 'Tutor enters an AD-AS-relevant segment.' },
  ],
  testTurns: [
    {
      say: 'Draw an AD–AS graph showing a recessionary gap, and mark where full-employment output is.',
      watchFor: 'AD, SRAS, LRAS curves; equilibrium output LEFT of LRAS (recessionary gap). Figure correct? Validator rejection?',
      timeoutMs: 180_000,
    },
    {
      say: 'Now show the effect of expansionary fiscal policy on that graph.',
      watchFor: 'AD shifts RIGHT toward LRAS; output rises, price level rises. Correct shift direction rendered?',
      timeoutMs: 150_000,
    },
  ],
};

export default scenario;
