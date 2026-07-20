/**
 * Digital SAT — Math / Advanced Math: Quadratic Equations & the Discriminant.
 *
 * High-frequency Advanced Math skill on the digital SAT. Focus on the
 * digital-test traps: solving via the quadratic formula (not just
 * factoring), using the discriminant to classify or COUNT solutions
 * without solving, and the "exactly one solution" constant-k pattern.
 * Desmos is allowed on every math question — teach when graphing the
 * parabola is faster than algebra for confirming a root count.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U2_QUADRATIC_EQUATIONS: LessonPlan = {
  id: 'evelyn.testprep.dsat.quadratic-equations.v1',
  title: 'Quadratic Equations & the Discriminant',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.quadratic-equations',
      standard: 'DSAT-2.2',
      description:
        'Solve quadratic equations by factoring and the quadratic formula; use the discriminant to determine and classify the number of real solutions.',
    },
  ],
  prerequisites: ['dsat.linear-equations-one-var'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame quadratics as a recurring Advanced Math skill — the discriminant turns "how many solutions" questions into 10-second lookups.',
      script:
        'Quadratic equations show up in several questions on every digital SAT Math section, and a good chunk of them never ask you to find x at all — they ask HOW MANY solutions exist, or for what constant a specific solution count happens. The discriminant answers those without solving anything. Today: solving quadratics fast, and reading the discriminant like a pro.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-discriminant',
      kind: 'concept',
      goal: 'Solving methods, the discriminant, and the SAT traps around counting and classifying solutions.',
      keyIdeas: [
        'STANDARD FORM — ax² + bx + c = 0. Always rearrange to this form (everything on one side, = 0) BEFORE reading off a, b, c. Grabbing coefficients from a non-standard arrangement is a common sign trap.',
        'QUADRATIC FORMULA (always works, even when factoring is hard): x = (−b ± √(b² − 4ac)) / (2a). It ALWAYS produces two branches — the + and the −. Compute both.',
        'FACTORING (fast when it works): find factors of ax² + bx + c as (px + q)(rx + s) where pr = a, qs = c, ps + qr = b.',
        'THE DISCRIMINANT Δ = b² − 4ac tells you the solution count WITHOUT solving. Δ > 0 → two real solutions. Δ = 0 → exactly one real solution (a double root). Δ < 0 → no real solutions.',
        'TRAP — "EXACTLY ONE SOLUTION" QUESTIONS. "For what value of k does ax² + bx + k = 0 have exactly one real solution?" Set Δ = 0 and solve for the unknown constant — do not try to solve the quadratic itself.',
        'TRAP — DROPPING THE ± BRANCH. The quadratic formula yields two solutions whenever Δ > 0. Computing only (−b + √Δ)/(2a) and stopping is the single most common quadratic-formula error on the SAT.',
        'VIETA\'S SHORTCUT — sum of solutions = −b/a; product of solutions = c/a. "What is the sum of the solutions?" questions are answered directly from the coefficients, no solving required.',
        'DESMOS CHECK — graph y = ax² + bx + c. The number of x-intercepts IS the real solution count; it is a fast visual check against your discriminant.',
      ],
      vocabulary: [
        { term: 'discriminant', definition: 'Δ = b² − 4ac; its sign tells you the number of real solutions without solving.' },
        { term: 'double root', definition: 'the single repeated solution that occurs when Δ = 0.' },
        { term: 'no real solutions', definition: 'the case when Δ < 0 — the parabola never crosses the x-axis.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-formula',
      kind: 'worked_example',
      problem: 'Solve: 2x² − 3x − 20 = 0',
      steps: [
        'Already in standard form. Identify a = 2, b = −3, c = −20.',
        'Compute the discriminant: Δ = (−3)² − 4(2)(−20) = 9 + 160 = 169.',
        '√169 = 13, so x = (3 ± 13) / 4 → x = 16/4 = 4 or x = −10/4 = −5/2.',
        'Check: (2x + 5)(x − 4) = 2x² − 8x + 5x − 20 = 2x² − 3x − 20. ✓',
      ],
      answer: 'x = 4 or x = −5/2',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-discriminant-trap',
      kind: 'worked_example',
      problem: 'For what value of k does 3x² + 12x + k = 0 have exactly one real solution?',
      steps: [
        'Exactly one real solution means the discriminant equals 0 — do not try to solve for x.',
        'Δ = b² − 4ac = 12² − 4(3)(k) = 144 − 12k. Set to 0: 144 − 12k = 0.',
        'k = 12. Check: 3x² + 12x + 12 = 3(x² + 4x + 4) = 3(x + 2)² — one double root at x = −2. ✓',
      ],
      answer: 'k = 12',
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify',
      kind: 'try_yourself',
      problem: 'How many real solutions does x² + 4x + 9 = 0 have?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Zero real solutions', correct: true },
        { id: 'b', text: 'One real solution' },
        { id: 'c', text: 'Two real solutions' },
        { id: 'd', text: 'Infinitely many real solutions' },
      ],
      expectedAnswer: 'Zero real solutions',
      hints: ['Compute the discriminant Δ = b² − 4ac first.', 'Δ = 16 − 36 = −20. What does a negative discriminant mean?'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-factor',
      kind: 'try_yourself',
      problem: 'What are the solutions to x² − 2x − 15 = 0?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 5 and x = −3', correct: true },
        { id: 'b', text: 'x = −5 and x = 3' },
        { id: 'c', text: 'x = 5 and x = 3' },
        { id: 'd', text: 'x = −5 and x = −3' },
      ],
      expectedAnswer: 'x = 5 and x = −3',
      hints: [
        'Factor into two binomials whose constants multiply to −15 and add to −2.',
        '(x − 5)(x + 3) = x² − 2x − 15. Set each factor equal to zero.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-vieta',
      kind: 'try_yourself',
      problem: 'Student-produced response (type your answer): what is the sum of the solutions to 2x² − 8x − 24 = 0?',
      responseFormat: 'numeric',
      expectedAnswer: '4',
      hints: ['Divide every term by 2 first: x² − 4x − 12 = 0.', 'Sum of solutions = −b/a. Or factor: (x − 6)(x + 2) = 0.'],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-half-solution',
      kind: 'misconception_check',
      question:
        'A student solves 2x² + x − 6 = 0 with the quadratic formula and reports only x = 3/2, missing the second solution. What went wrong?',
      commonErrors: [
        {
          answer: 'x = 3/2 only',
          misconception: 'Only computed the + branch of (−b ± √Δ)/(2a) and stopped, forgetting the formula produces two solutions whenever Δ > 0.',
          correctsTo:
            'Δ = 1² − 4(2)(−6) = 1 + 48 = 49, √49 = 7. Compute BOTH branches: (−1 + 7)/4 = 3/2 and (−1 − 7)/4 = −2. Both are solutions unless Δ = 0.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Δ = b² − 4ac: Δ > 0 → two real solutions; Δ = 0 → one (double) solution; Δ < 0 → no real solutions.',
        '"Exactly one solution" questions → set Δ = 0 and solve for the unknown constant, not for x.',
        'The quadratic formula always yields TWO branches (+ and −) whenever Δ > 0 — compute both before stopping.',
        'Sum of solutions = −b/a; product = c/a — answers "sum/product of solutions" questions with no solving needed.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.2', cedTitle: 'Quadratic Equations & the Discriminant' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
