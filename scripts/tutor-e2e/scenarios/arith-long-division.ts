import type { Scenario } from '../types';

/**
 * Measurement scenario (Pillar 3, 2026-06-20) — PURE PROSE ARITHMETIC.
 * Grade-4 long division: the brain must free-hand multi-digit arithmetic in
 * narration with NO geometry solver in the loop. Probes whether wrong numbers
 * occur in PROSE (thinking/Wolfram territory) vs figures (local-solver
 * territory). Known answers: 4823÷7=689 r0; 6515÷8=814 r3; 9024÷6=1504 r0.
 */
const scenario: Scenario = {
  name: 'arith-long-division',
  description: 'Grade-4 long division — pure free-hand prose arithmetic, no geometry solver.',
  start: {
    subject: 'math',
    level: 'Elementary',
    topic: 'g4-math',
    lessonPlanId: 'evelyn.g4.math.long-division.v1',
    studentName: 'Test Student',
  },
  seedTurns: [
    { say: "let's do some long division", watchFor: 'Tutor enters the long-division segment.' },
  ],
  testTurns: [
    {
      say: 'What is 4823 divided by 7? Walk me through it.',
      watchFor: 'Each partial quotient/remainder step is arithmetically correct; final answer 689 r0. Are any spoken numbers wrong?',
      timeoutMs: 150_000,
    },
    {
      say: 'Now do 6515 divided by 8, step by step.',
      watchFor: 'Final answer 814 remainder 3; every spoken intermediate product/subtraction correct.',
      timeoutMs: 150_000,
    },
    {
      say: 'And 9024 divided by 6?',
      watchFor: 'Final answer 1504 r0; spoken steps correct.',
      timeoutMs: 150_000,
    },
  ],
};

export default scenario;
