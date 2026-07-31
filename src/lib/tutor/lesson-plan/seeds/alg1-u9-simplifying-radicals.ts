/**
 * Algebra 1 — Radicals: Simplifying Radical Expressions.
 *
 * Exact-answer hygiene (CCSS N-RN extension, A-REI.A.2 lead-in): pull the
 * largest perfect square out from under the root, use the product and
 * quotient rules, combine like radicals, and clear radicals out of
 * denominators. This is what turns the quadratic formula's √48 into a
 * clean 4√3, and it is the toolkit radical equations lean on next.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U9_SIMPLIFYING_RADICALS: LessonPlan = {
  id: 'evelyn.hs.alg1.simplifying-radicals.v1',
  title: 'Simplifying Radical Expressions',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.simplifying-radicals',
      standard: 'ALG1-9.1',
      description:
        'Simplify radical expressions by extracting perfect-square factors, applying the product and quotient rules, combining like radicals, and rationalizing simple denominators (CCSS N-RN.A.2, A-REI.A.2).',
    },
  ],
  prerequisites: ['alg1.quadratic-models'],
  followUps: ['alg1.radical-equations'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame radical simplification as the skill that keeps answers exact instead of rounded — and the cleanup step every quadratic and every distance problem ends with.',
      script:
        'Solve almost any quadratic and you land on something like √48. A calculator says 6.9282032... — a number that is already wrong in the last digit and will get more wrong every time you reuse it. Written as 4√3 it is exact, it is shorter, and it makes the pattern in your answer visible. Today we learn how to get from the messy form to the clean one, in both directions.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-radical-rules',
      kind: 'concept',
      goal: 'What "simplest radical form" means, the four legal moves that get you there, and the one illegal move students reach for anyway.',
      keyIdeas: [
        'SIMPLEST FORM — a radical expression is simplified when (1) no perfect-square factor is left under the √ and (2) no radical is left in a denominator. Two conditions, both required.',
        'THE EXTRACTION MOVE — factor the radicand using the LARGEST perfect square you can find, then split: √48 = √(16 · 3) = √16 · √3 = 4√3. Keep the perfect squares handy: 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144.',
        'PRODUCT RULE — √a · √b = √(ab) whenever a and b are not negative, and it runs both directions. Rightward it merges (√8 · √2 = √16 = 4); leftward it extracts.',
        'QUOTIENT RULE — √(a/b) = √a / √b for b greater than 0, so √(49/16) = 7/4. Fractions under a root split apart exactly the same way products do.',
        'LIKE RADICALS ONLY — you may add or subtract only terms with the same radicand: 5√3 + 2√3 = 7√3. Add the coefficients, leave the radicand alone. And SIMPLIFY FIRST — √8 and √50 look unlike until they become 2√2 and 5√2.',
        'THE ADDITION TRAP — √(a + b) is NOT √a + √b. Test it: √(9 + 16) = √25 = 5, but √9 + √16 = 3 + 4 = 7. The square root splits over multiplication and division, never over addition or subtraction.',
        'RATIONALIZING — a lone radical downstairs gets cleared by multiplying the top and bottom by that same radical, since √5 · √5 = 5: 3/√5 = (3 · √5)/(√5 · √5) = 3√5/5. You multiplied by √5/√5, which is 1, so the value never changed.',
      ],
      vocabulary: [
        { term: 'radicand', definition: 'the number sitting underneath the radical sign — the 48 in √48.' },
        { term: 'like radicals', definition: 'radical terms with identical radicands, e.g. 5√3 and 2√3 — the only ones that can be added or subtracted.' },
        { term: 'rationalize the denominator', definition: 'rewrite a fraction so no radical remains on the bottom.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-extract-and-combine',
      kind: 'worked_example',
      problem: 'Simplify: √48 + 2√27',
      steps: [
        'Simplify each radical on its own first. For √48, the largest perfect-square factor of 48 is 16: √48 = √(16 · 3) = √16 · √3 = 4√3.',
        'For √27, the largest perfect-square factor is 9: √27 = √(9 · 3) = 3√3. The term is 2√27, so 2 · 3√3 = 6√3.',
        'Now both terms carry the same radicand, √3, so they are like radicals: 4√3 + 6√3 = 10√3. Add the coefficients only — the √3 is untouched.',
        'CHECK with decimals: √48 ≈ 6.928 and 2√27 ≈ 10.392, which sum to ≈ 17.32; 10√3 ≈ 10(1.732) = 17.32. ✓',
      ],
      answer: '10√3',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-rationalize',
      kind: 'worked_example',
      problem: 'Simplify: 10/√8',
      steps: [
        'Clean up the radical before touching the fraction: √8 = √(4 · 2) = 2√2. The expression is now 10/(2√2).',
        'Reduce the whole numbers out front: 10/2 = 5, leaving 5/√2. This is where most students stop — but a radical in the denominator means it is NOT in simplest form yet.',
        'Rationalize: multiply the top and bottom by √2, which is multiplying by 1. (5 · √2)/(√2 · √2) = 5√2/2, because √2 · √2 = 2.',
        'Nothing reduces further (5 and 2 share no factor), so 5√2/2 is the answer. CHECK: 10/√8 ≈ 10/2.828 ≈ 3.536, and 5√2/2 ≈ 5(1.414)/2 ≈ 3.536. ✓',
      ],
      answer: '5√2/2',
      estimatedMinutes: 3,
    },
    {
      id: 'try-extract',
      kind: 'try_yourself',
      problem: 'Simplify √200 completely — no perfect-square factor may be left under the radical.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '10√2', correct: true },
        { id: 'b', text: '2√50' },
        { id: 'c', text: '100√2' },
        { id: 'd', text: '10√20' },
      ],
      expectedAnswer: '10√2',
      hints: [
        'Hunt for the LARGEST perfect square that divides 200. Try 100 before you try 4.',
        '200 = 100 · 2, so √200 = √100 · √2. What is √100?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-combine',
      kind: 'try_yourself',
      problem: 'Simplify: 4√3 + 2√5 − √3',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3√3 + 2√5', correct: true },
        { id: 'b', text: '5√8' },
        { id: 'c', text: '5√3 + 2√5' },
        { id: 'd', text: 'It cannot be simplified at all' },
      ],
      expectedAnswer: '3√3 + 2√5',
      hints: [
        'Sort the terms by radicand: which ones are √3 terms, and which are √5 terms?',
        'The √3 terms are 4√3 and −√3 (a bare √3 has coefficient 1). Combine only those; 2√5 has no partner and rides along.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'Use the product rule to evaluate √8 · √18 and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '12',
      hints: [
        'The product rule runs rightward too: √a · √b = √(ab). Merge the two radicands under one root.',
        '8 · 18 = 144, so you need √144.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-split-over-addition',
      kind: 'misconception_check',
      question: 'A student writes √(9 + 16) = √9 + √16 = 3 + 4 = 7, and on the next line writes 5√2 + 3√2 = 8√4 = 16. Both lines are wrong. What is the rule each one breaks?',
      commonErrors: [
        {
          answer: '√(9 + 16) = 7',
          misconception: 'Treating the square root like a distributive operation that spreads across a sum, the way multiplication spreads over parentheses.',
          correctsTo: 'Add inside the radical FIRST: √(9 + 16) = √25 = 5, not 7. The root splits over multiplication and division only — √(9 · 16) = 3 · 4 = 12 really is legal, but √(a + b) ≠ √a + √b, ever.',
        },
        {
          answer: '5√2 + 3√2 = 8√4',
          misconception: 'Adding the radicands along with the coefficients, as if √2 were a number being summed rather than a shared unit.',
          correctsTo: 'The √2 behaves like a unit label: 5 of them plus 3 of them is 8 of them, so 5√2 + 3√2 = 8√2. Only the coefficients add; the radicand never changes when you combine like radicals.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Simplest form = no perfect-square factor under the radical AND no radical in the denominator.',
        'Extract with the LARGEST perfect square: √48 = √16 · √3 = 4√3.',
        '√a · √b = √(ab) and √(a/b) = √a/√b — but √(a + b) is NEVER √a + √b.',
        'Add or subtract only like radicals, and simplify first so hidden matches show up: √8 + √50 = 2√2 + 5√2 = 7√2.',
        'Clear a denominator radical by multiplying top and bottom by it: 3/√5 = 3√5/5.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.1', cedTitle: 'Simplifying Radical Expressions' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
