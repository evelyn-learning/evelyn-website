/**
 * Algebra 1 — Quadratics: The Quadratic Formula & the Discriminant.
 *
 * The always-works solver (CCSS A-REI.B.4b). Taught as the closer of the
 * quadratics toolkit: factoring is faster when it works, the formula
 * always works. The discriminant gets equal billing — students should
 * predict the number of solutions before computing anything.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U8_QUADRATIC_FORMULA_DISCRIMINANT: LessonPlan = {
  id: 'evelyn.hs.alg1.quadratic-formula-discriminant.v1',
  title: 'The Quadratic Formula & the Discriminant',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.quadratic-formula-discriminant',
      standard: 'ALG1-8.4',
      description:
        'Solve any quadratic equation with the quadratic formula and use the discriminant to determine the number of real solutions (CCSS A-REI.B.4b).',
    },
  ],
  prerequisites: ['alg1.completing-the-square'],
  followUps: ['alg1.quadratic-models'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Position the formula as the tool that never fails — and the discriminant as the 10-second preview of the answer.',
      script:
        'Factoring is elegant, but it only works when the numbers cooperate. The quadratic formula works on every quadratic ever written — even ones with ugly decimals. And hidden inside it is a shortcut called the discriminant that tells you how many solutions exist before you solve anything. One formula, total coverage.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-formula',
      kind: 'concept',
      goal: 'The formula, the setup discipline (a, b, c from standard form), and the discriminant cases.',
      keyIdeas: [
        'THE FORMULA — for ax² + bx + c = 0: x = (−b ± √(b² − 4ac)) / (2a). It comes from completing the square on the general equation, so it inherits "always works".',
        'STANDARD FORM FIRST — the equation must equal 0 before reading off a, b, c. For 2x² = 5x − 3, rewrite as 2x² − 5x + 3 = 0, so a = 2, b = −5, c = 3.',
        'SIGNS RIDE ALONG — b = −5 means −b = 5 and b² = 25. Writing −b² instead of (−b)² is the most common formula error.',
        'THE DISCRIMINANT — the part under the root, b² − 4ac. Positive → 2 real solutions; zero → exactly 1 (the parabola kisses the x-axis); negative → 0 real solutions.',
        'GRAPH CONNECTION — the discriminant counts x-intercepts of y = ax² + bx + c. You can answer "how many solutions" questions with zero solving.',
        'WHICH TOOL — factorable? factor. b even and a = 1? completing the square is quick. Anything else → formula. All three give the same roots.',
      ],
      vocabulary: [
        { term: 'discriminant', definition: 'b² − 4ac — the expression under the radical that counts real solutions.' },
        { term: 'standard form', definition: 'ax² + bx + c = 0, required before identifying a, b, c.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-two-roots',
      kind: 'worked_example',
      problem: 'Solve with the quadratic formula: 2x² − 5x + 3 = 0',
      steps: [
        'Already standard form: a = 2, b = −5, c = 3.',
        'Discriminant first: b² − 4ac = 25 − 24 = 1. Positive → expect 2 real solutions.',
        'x = (5 ± √1) / 4 = (5 ± 1)/4.',
        'x = 6/4 = 3/2 or x = 4/4 = 1. Check by factoring: (2x − 3)(x − 1) = 0. ✓ Same roots.',
      ],
      answer: 'x = 3/2 or x = 1',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-discriminant-only',
      kind: 'worked_example',
      problem: 'Without solving, determine how many real solutions 3x² + 2x + 4 = 0 has.',
      steps: [
        'a = 3, b = 2, c = 4.',
        'Discriminant: b² − 4ac = 4 − 48 = −44.',
        'Negative discriminant → the square root of a negative is not a real number → 0 real solutions.',
        'Graph check: y = 3x² + 2x + 4 opens upward with vertex above the x-axis — it never crosses.',
      ],
      answer: 'No real solutions',
      estimatedMinutes: 3,
    },
    {
      id: 'try-formula',
      kind: 'try_yourself',
      problem: 'Solve with the quadratic formula: x² − 6x + 8 = 0',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 2 or x = 4', correct: true },
        { id: 'b', text: 'x = −2 or x = −4' },
        { id: 'c', text: 'x = 3 ± √17' },
        { id: 'd', text: 'x = 6 or x = 8' },
      ],
      expectedAnswer: 'x = 2 or x = 4',
      hints: ['a = 1, b = −6, c = 8 — discriminant is 36 − 32 = 4.', 'x = (6 ± 2)/2.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-discriminant',
      kind: 'try_yourself',
      problem: 'Which equation has exactly ONE real solution?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x² + 5x + 2 = 0' },
        { id: 'b', text: 'x² − 4x + 4 = 0', correct: true },
        { id: 'c', text: 'x² + x + 3 = 0' },
        { id: 'd', text: 'x² − 9 = 0' },
      ],
      expectedAnswer: 'x² − 4x + 4 = 0',
      hints: ['Exactly one solution means discriminant = 0.', 'For x² − 4x + 4: b² − 4ac = 16 − 16 = 0.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'Compute the discriminant of 2x² + 3x − 2 = 0 and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '25',
      hints: ['b² − 4ac with a = 2, b = 3, c = −2.', '9 − 4(2)(−2) = 9 + 16.'],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-standard-form',
      kind: 'misconception_check',
      question: 'For 3x² = 6x − 2, a student uses a = 3, b = 6, c = −2 in the formula and gets wrong roots. What went wrong?',
      commonErrors: [
        {
          answer: 'a = 3, b = 6, c = −2',
          misconception: 'Reading a, b, c before moving everything to one side.',
          correctsTo: 'Rewrite in standard form first: 3x² − 6x + 2 = 0, so a = 3, b = −6, c = 2.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'x = (−b ± √(b² − 4ac)) / (2a) — works on every quadratic.',
        'Standard form (= 0) before reading a, b, c; signs ride along.',
        'Discriminant b² − 4ac: positive → 2 real solutions, zero → 1, negative → 0.',
        'Factor when it is easy; formula when it is not — same roots either way.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.4', cedTitle: 'The Quadratic Formula & the Discriminant' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
