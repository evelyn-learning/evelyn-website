import type { Scenario } from '../types';

/**
 * Measurement scenario (Pillar 3, 2026-06-20) — ADVANCED PROSE/NUMERIC.
 * AP Calc BC Riemann sums + definite integrals: heavy free-hand algebra and
 * arithmetic in narration, Wolfram-checkable, light on geometry-solver figures.
 * Probes prose-arithmetic error rate at the hard end of the curriculum.
 * Known: ∫₀² x² dx = 8/3 ≈ 2.667; right Riemann sum of x² on [0,2], n=4
 * (Δx=0.5) = 0.5(0.25+1+2.25+4)=3.75.
 */
const scenario: Scenario = {
  name: 'calc-riemann',
  description: 'AP Calc BC Riemann sums — advanced free-hand prose arithmetic, Wolfram-checkable.',
  start: {
    subject: 'math',
    level: 'AP',
    topic: 'ap-calcbc',
    lessonPlanId: 'evelyn.ap.calcbc.riemann-sums.v1',
    studentName: 'Test Student',
  },
  seedTurns: [
    { say: 'Riemann sums', watchFor: 'Tutor enters the Riemann-sums segment.' },
  ],
  testTurns: [
    {
      say: 'Compute the right Riemann sum for f(x)=x² on [0,2] with n=4 subintervals. Show each term.',
      watchFor: 'Δx=0.5; terms 0.25,1,2.25,4; sum 0.5×7.5=3.75. Any spoken number wrong?',
      timeoutMs: 180_000,
    },
    {
      say: 'Now the exact value of the integral of x² from 0 to 2, and the error vs the Riemann estimate.',
      watchFor: 'Exact = 8/3 ≈ 2.667; error = 3.75 − 2.667 = 1.083. Spoken arithmetic correct?',
      timeoutMs: 180_000,
    },
  ],
};

export default scenario;
