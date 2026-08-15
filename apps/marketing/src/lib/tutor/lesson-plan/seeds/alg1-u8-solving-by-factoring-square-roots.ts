/**
 * Algebra 1 — Quadratics: Solving by Factoring & Square Roots.
 *
 * The first two ways to actually SOLVE a quadratic (CCSS A-REI.B.4b,
 * A-SSE.B.3a): the zero product property (which only works once the
 * equation reads = 0) and the square-root method for x² = k and
 * (x − h)² = k. Both roots, every time — and those roots are exactly the
 * x-intercepts of the parabola from the previous lesson.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U8_SOLVING_BY_FACTORING_SQUARE_ROOTS: LessonPlan = {
  id: 'evelyn.hs.alg1.solving-by-factoring-square-roots.v1',
  title: 'Solving Quadratics by Factoring & Square Roots',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.solving-by-factoring-square-roots',
      standard: 'ALG1-8.2',
      description:
        'Solve quadratic equations by factoring with the zero product property and by taking square roots of x² = k and (x − h)² = k, keeping both roots, and interpret those roots as the x-intercepts of the parabola (CCSS A-REI.B.4b, A-SSE.B.3a).',
    },
  ],
  prerequisites: ['alg1.quadratic-graphs-vertex'],
  followUps: ['alg1.completing-the-square'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame solving a quadratic as answering the question you actually care about — when does the curve hit a specific value.',
      script:
        'Last lesson we drew parabolas. Drawing is nice, but the useful questions are numbers: when does the thrown ball hit the ground, what width makes the garden exactly 40 square feet, when does profit reach zero. Every one of those questions ends as a quadratic set equal to zero. Today you get the two fastest tools for cracking them open — factoring, and just taking a square root.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-methods',
      kind: 'concept',
      goal: 'The zero product property (and its = 0 precondition), the factoring routine, and the square-root method with its mandatory ±.',
      keyIdeas: [
        'ZERO PRODUCT PROPERTY — if A × B = 0, then A = 0 OR B = 0. Nothing else multiplies to zero, so a factored quadratic hands you two tiny equations for free.',
        'THE = 0 PRECONDITION — the property only works against ZERO. From x(x − 3) = 10 you may NOT write x = 10 or x − 3 = 10, because plenty of pairs multiply to 10. Rearrange to = 0 first, always.',
        'THE FACTORING ROUTINE — 1) move every term to one side so the equation reads = 0, 2) factor completely (GCF first, then trinomial or difference of squares), 3) set each factor equal to 0 and solve those linear equations.',
        'NEVER DIVIDE BY A VARIABLE — for x² = 12x, dividing by x gives only x = 12 and silently throws away x = 0. Factor instead: x(x − 12) = 0 keeps both roots.',
        'SQUARE-ROOT METHOD — when there is no plain x term, skip factoring: x² = k gives x = ±√k. So x² = 49 has TWO answers, 7 and −7.',
        'SHIFTED VERSION — (x − h)² = k works the same way once the squared part is alone: x − h = ±√k, so x = h ± √k. Isolate the square before you root, e.g. divide off a coefficient first.',
        'THE ± IS NOT OPTIONAL — writing only the positive root is the single most common way students lose half of a correct answer.',
        'ROOTS ARE X-INTERCEPTS — the solutions of ax² + bx + c = 0 are exactly where the parabola y = ax² + bx + c crosses the x-axis, which is why a quadratic usually has two of them.',
      ],
      vocabulary: [
        { term: 'zero product property', definition: 'if a product equals 0, at least one factor equals 0.' },
        { term: 'root', definition: 'a value of x that makes the equation true — also called a zero or an x-intercept.' },
        { term: '± (plus-or-minus)', definition: 'shorthand saying both the positive and the negative value are solutions.' },
      ],
      suggestedTools: ['show_equation', 'show_function_graph'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-factoring',
      kind: 'worked_example',
      problem: 'Solve: x² + 2x = 15',
      steps: [
        'It is not equal to zero yet, so subtract 15 from both sides: x² + 2x − 15 = 0.',
        'Factor: find two numbers that multiply to −15 and add to +2 → +5 and −3.',
        'So (x + 5)(x − 3) = 0.',
        'Zero product property: x + 5 = 0 OR x − 3 = 0.',
        'Solve each: x = −5 or x = 3. Check x = −5: (−5)² + 2(−5) = 25 − 10 = 15. ✓ Check x = 3: 9 + 6 = 15. ✓',
      ],
      answer: 'x = −5 or x = 3',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-square-root',
      kind: 'worked_example',
      problem: 'Solve: 2(x − 4)² = 98',
      steps: [
        'Do NOT expand — the squared part is already grouped, so isolate it. Divide both sides by 2: (x − 4)² = 49.',
        'Take the square root of both sides and attach the ±: x − 4 = ±7.',
        'Split into two equations: x − 4 = 7 gives x = 11, and x − 4 = −7 gives x = −3.',
        'The trap here is stopping at x = 11. Both roots count. Check x = 11: 2(7)² = 98. ✓ Check x = −3: 2(−7)² = 2(49) = 98. ✓',
      ],
      answer: 'x = 11 or x = −3',
      estimatedMinutes: 3,
    },
    {
      id: 'try-factor-trinomial',
      kind: 'try_yourself',
      problem: 'Solve for x: x² − 3x − 10 = 0',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = −5 or x = 2' },
        { id: 'b', text: 'x = 5 or x = −2', correct: true },
        { id: 'c', text: 'x = 5 or x = 2' },
        { id: 'd', text: 'x = 10 or x = −1' },
      ],
      expectedAnswer: 'x = 5 or x = −2',
      hints: [
        'You need two numbers that multiply to −10 and add to −3.',
        'That pair is −5 and +2, so (x − 5)(x + 2) = 0 — now set each factor to zero.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-square-root',
      kind: 'try_yourself',
      problem: 'Solve for x: (x + 3)² = 25',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 2 or x = −8', correct: true },
        { id: 'b', text: 'x = 2 only' },
        { id: 'c', text: 'x = 8 or x = −2' },
        { id: 'd', text: 'x = 5 or x = −5' },
      ],
      expectedAnswer: 'x = 2 or x = −8',
      hints: [
        'Take the square root of both sides — and the right side becomes ±5, not just 5.',
        'x + 3 = 5 gives one root; x + 3 = −5 gives the other. Subtract 3 in each.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'Solve x² = 12x and type the LARGER of the two solutions as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '12',
      hints: [
        'Do not divide both sides by x — move the 12x over so the equation reads x² − 12x = 0.',
        'Factor out the GCF x: x(x − 12) = 0, so x = 0 or x = 12.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-set-equal-nonzero',
      kind: 'misconception_check',
      question: 'To solve x(x − 3) = 10, a student writes x = 10 or x − 3 = 10, giving x = 10 or x = 13. Both are wrong. What went wrong, and what are the real solutions?',
      commonErrors: [
        {
          answer: 'x = 10 or x = 13',
          misconception: 'Applying the zero product property against a number other than zero — but 10 can be made by 2 × 5, 4 × 2.5, and endlessly many other pairs, so a factor being 10 proves nothing.',
          correctsTo:
            'Expand and rearrange to zero first: x² − 3x = 10 → x² − 3x − 10 = 0 → (x − 5)(x + 2) = 0 → x = 5 or x = −2. Check x = 5: 5(2) = 10. ✓ Check x = −2: (−2)(−5) = 10. ✓',
        },
        {
          answer: 'x = 7 for x² = 49',
          misconception: 'Taking a square root and keeping only the positive value, losing the negative root.',
          correctsTo: 'x² = 49 means x = ±7, so x = 7 or x = −7 — both square to 49. The ± is part of the method, not decoration.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Zero product property works ONLY against zero — rearrange to = 0 before you factor.',
        'Routine: get = 0, factor completely (GCF first), set each factor = 0.',
        'Never divide both sides by x — factor it out, or you lose the x = 0 root.',
        'Square-root method: x² = k → x = ±√k, and (x − h)² = k → x = h ± √k. Isolate the square first; keep the ±.',
        'The roots you find are the x-intercepts of the parabola y = ax² + bx + c.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.2', cedTitle: 'Solving Quadratics by Factoring & Square Roots' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
