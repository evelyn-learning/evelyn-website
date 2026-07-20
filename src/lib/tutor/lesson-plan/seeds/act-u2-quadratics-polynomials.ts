/**
 * ACT — Math: Quadratics & Polynomials.
 *
 * Standalone questions, calculator allowed, ~60 seconds per question.
 * Quadratics show up as "solve for x," "which expression is equivalent,"
 * and "how many solutions" — almost always graded on whether you factor
 * cleanly, set the equation to zero FIRST, and don't sign-error the FOIL.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U2_QUADRATICS_POLYNOMIALS: LessonPlan = {
  id: 'evelyn.testprep.act.quadratics-polynomials.v1',
  title: 'Quadratics & Polynomials',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.quadratics-polynomials',
      standard: 'ACT-2.4',
      description:
        'Factor and solve quadratic equations, multiply and expand polynomials, and apply the zero product property and quadratic formula accurately under ACT time pressure.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame quadratics/polynomials as a recurring, high-frequency ACT Math pattern worth drilling.',
      script:
        'Quadratics and polynomials show up all over ACT Math — "solve for x," "which expression is equivalent," "how many solutions does this equation have." You get about 60 seconds per question, calculator allowed. The good news: almost every one of these questions is really just factoring, FOILing, or the zero product property done carefully. Today we drill the pattern and the traps that eat time.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-quadratics',
      kind: 'concept',
      goal: 'The factor-and-zero method, the difference-of-squares shortcut, and the traps that cause wrong answers under time pressure.',
      keyIdeas: [
        'FACTORING x² + bx + c: find two numbers that multiply to c and add to b, then write (x + p)(x + q). Example: x² - 2x - 15 needs two numbers multiplying to -15, adding to -2 → -5 and 3.',
        'FOIL is the reverse check: (x + p)(x + q) = x² + (p + q)x + pq — First, Outer, Inner, Last. Use it to verify a factoring by re-expanding.',
        'ZERO PRODUCT PROPERTY: if (x - a)(x - b) = 0, then x = a or x = b. This ONLY works when one side of the equation is exactly 0.',
        'TRAP — NOT SET TO ZERO FIRST: ACT loves equations like x² + 4x = 21. You cannot factor and split at 21 — you MUST move everything to one side first: x² + 4x - 21 = 0, THEN factor and use the zero product property.',
        'DIFFERENCE OF SQUARES: a² - b² = (a - b)(a + b). Recognize it instantly — ACT disguises it as things like x² - 49 or 4x² - 9.',
        'TRAP — SQUARING A BINOMIAL ≠ DIFFERENCE OF SQUARES: (x - b)² = x² - 2bx + b², NOT x² - b². Students confuse this with the difference-of-squares pattern and drop the middle term.',
        'QUADRATIC FORMULA FALLBACK: x = (-b ± √(b² - 4ac)) / (2a). Use it when a quadratic does not factor with nice integers.',
        'THE DISCRIMINANT (b² - 4ac) tells you how many real solutions without fully solving: positive → two real solutions, zero → one repeated solution, negative → no real solutions.',
      ],
      vocabulary: [
        { term: 'zero product property', definition: 'if a product of factors equals 0, at least one of the factors must equal 0 — only valid when the product is set equal to 0.' },
        { term: 'discriminant', definition: 'the quantity b² - 4ac inside the quadratic formula\'s square root; its sign tells you how many real solutions the quadratic has.' },
        { term: 'FOIL', definition: 'First, Outer, Inner, Last — the order for multiplying two binomials together.' },
        { term: 'like terms', definition: 'terms with the same variable raised to the same power (e.g., 3x² and -5x², but not 3x² and 3x), which can be combined by adding coefficients.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-basic-factoring',
      kind: 'worked_example',
      problem: 'Solve for x: x² - 2x - 15 = 0.',
      steps: [
        'The equation is already set to 0, so we can factor directly.',
        'Find two numbers that multiply to -15 and add to -2: -5 and 3 (check: -5 × 3 = -15, -5 + 3 = -2).',
        'Factor: (x - 5)(x + 3) = 0.',
        'Apply the zero product property: x - 5 = 0 or x + 3 = 0, so x = 5 or x = -3.',
      ],
      answer: 'x = 5 or x = -3',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-not-zeroed-trap',
      kind: 'worked_example',
      problem: 'Solve for x: x² + 4x = 21.',
      steps: [
        'TRAP: a student might rewrite the left side as x(x + 4) = 21 and then set x = 21 and x + 4 = 21. This is WRONG — the zero product property only works when the product equals 0, not 21.',
        'Correct move: move 21 to the left side first, so the equation equals 0: x² + 4x - 21 = 0.',
        'Find two numbers that multiply to -21 and add to 4: 7 and -3 (check: 7 × -3 = -21, 7 + (-3) = 4).',
        'Factor: (x + 7)(x - 3) = 0. Zero product property: x = -7 or x = 3.',
      ],
      answer: 'x = -7 or x = 3',
      estimatedMinutes: 3,
    },
    {
      id: 'try-difference-of-squares',
      kind: 'try_yourself',
      problem: 'Which of the following is equivalent to x² - 64?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(x - 8)(x + 8)', correct: true },
        { id: 'b', text: '(x - 8)²' },
        { id: 'c', text: '(x + 8)²' },
        { id: 'd', text: '(x - 16)(x + 4)' },
      ],
      expectedAnswer: '(x - 8)(x + 8)',
      hints: [
        'Look for the pattern a² - b² = (a - b)(a + b).',
        '64 = 8², so with a = x and b = 8, x² - 64 = (x - 8)(x + 8).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-discriminant',
      kind: 'try_yourself',
      problem: 'How many distinct real solutions does x² - 6x + 9 = 0 have?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '0' },
        { id: 'b', text: '1', correct: true },
        { id: 'c', text: '2' },
        { id: 'd', text: 'It cannot be determined' },
      ],
      expectedAnswer: '1',
      hints: [
        'Compute the discriminant: b² - 4ac.',
        '(-6)² - 4(1)(9) = 36 - 36 = 0. A discriminant of 0 means exactly one repeated (double) solution — here, (x - 3)² = 0 gives x = 3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-other-root',
      kind: 'try_yourself',
      problem: 'Type your answer: One solution of x² - 5x - 24 = 0 is x = 8. What is the other solution?',
      responseFormat: 'numeric',
      expectedAnswer: '-3',
      hints: [
        'Factor using the pair of numbers that multiply to -24 and add to -5.',
        '-8 and 3 work: (x - 8)(x + 3) = 0, so the other solution is x = -3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-square-binomial',
      kind: 'misconception_check',
      question: 'A student simplifies (x - 5)² as x² - 25. What went wrong, and what is the correct expansion?',
      commonErrors: [
        {
          answer: 'x² - 25',
          misconception: 'Confusing squaring a binomial, (x - 5)², with the difference-of-squares pattern (x - 5)(x + 5).',
          correctsTo: '(x - 5)² means (x - 5)(x - 5). FOIL it out: x² - 5x - 5x + 25 = x² - 10x + 25. The shortcut x² - 25 only applies to the DIFFERENT expression (x - 5)(x + 5) — always check whether you\'re squaring a binomial or multiplying conjugates.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Factor x² + bx + c by finding two numbers that multiply to c and add to b; check your work with FOIL.',
        'The zero product property only works once the equation is set equal to 0 — move all terms to one side FIRST.',
        'Recognize a² - b² = (a - b)(a + b) instantly, and don\'t confuse it with (a ± b)², which has a middle term.',
        'When factoring stalls, use the quadratic formula; the discriminant (b² - 4ac) tells you how many real solutions exist before you even finish solving.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.4', cedTitle: 'Quadratics & Polynomials' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
