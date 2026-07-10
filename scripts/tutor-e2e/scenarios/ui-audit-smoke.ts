import type { Scenario } from '../types';

/**
 * Cheap 2-turn smoke for the 2026-07-10 polish batch: session timer must
 * tick for typed-first students (no mic tap), and a free-form problem
 * card should render its statement math via inline $…$ KaTeX.
 */
const scenario: Scenario = {
  name: 'ui-audit-smoke',
  description: 'Timer ticks on typed-first session; problem-card math renders via KaTeX.',
  start: { subject: 'math', level: 'High School', topic: 'jee-math', lessonPlanId: 'evelyn.jee.coordinate-geometry.v1', studentName: 'Test Student' },
  seedTurns: [],
  testTurns: [
    {
      say: 'Give me one quick practice problem about the tangent to an ellipse, as a problem card.',
      watchFor: 'Problem card renders; any math in the statement is KaTeX (no unicode x², √). Timer in the top bar shows non-zero elapsed.',
      timeoutMs: 150_000,
    },
    {
      say: 'Thanks! That looks good.',
      watchFor: 'Timer has advanced further.',
      timeoutMs: 120_000,
    },
  ],
};

export default scenario;
