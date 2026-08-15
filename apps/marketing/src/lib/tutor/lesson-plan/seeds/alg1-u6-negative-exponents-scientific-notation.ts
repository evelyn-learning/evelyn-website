/**
 * Algebra 1 — Exponents: Zero & Negative Exponents; Scientific Notation.
 *
 * The bridge from the middle-school exponent laws (CCSS 8.EE.A) into
 * Algebra 1's exponential work: why a⁰ = 1, why a⁻ⁿ is a reciprocal and
 * never a negative number, and how scientific notation lets you compute
 * with numbers that are far too big or far too small to write out.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U6_NEGATIVE_EXPONENTS_SCIENTIFIC_NOTATION: LessonPlan = {
  id: 'evelyn.hs.alg1.negative-exponents-scientific-notation.v1',
  title: 'Zero & Negative Exponents; Scientific Notation',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.negative-exponents-scientific-notation',
      standard: 'ALG1-6.2',
      description:
        'Explain why a⁰ = 1 and why a negative exponent means a reciprocal rather than a negative value, and convert, multiply, and divide numbers written in scientific notation (CCSS 8.EE.A.1, 8.EE.A.3, 8.EE.A.4).',
    },
  ],
  prerequisites: ['alg1.exponent-rules'],
  followUps: ['alg1.exponential-functions'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame zero/negative exponents and scientific notation as the tools that make unwritable numbers workable.',
      script:
        'A red blood cell is about 0.000008 meters across. The Sun weighs about 2,000,000,000,000,000,000,000,000,000,000 kilograms. Nobody counts those zeros — scientists write 8 × 10⁻⁶ and 2 × 10³⁰ instead, and then multiply and divide them in one line. To read that shorthand you need to know what a zero exponent and a negative exponent actually mean. Today we nail both, and they carry straight into exponential functions later this unit.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-zero-negative-scinot',
      kind: 'concept',
      goal: 'Where a⁰ = 1 and a⁻ⁿ = 1/aⁿ come from, and how scientific notation packages and computes extreme numbers.',
      keyIdeas: [
        'WHY a⁰ = 1 — the quotient rule says a⁵/a⁵ = a⁵⁻⁵ = a⁰. But anything nonzero divided by itself is 1. So a⁰ = 1 for every a ≠ 0. It is a consequence of the rules, not a random definition. (0⁰ is left undefined.)',
        'ONLY WHAT THE EXPONENT TOUCHES — in 4x⁰ the exponent sits on x alone, so 4x⁰ = 4 · 1 = 4. In (4x)⁰ the parentheses put it on everything, so (4x)⁰ = 1.',
        'WHY a⁻ⁿ = 1/aⁿ — walk the pattern down: 2³ = 8, 2² = 4, 2¹ = 2, 2⁰ = 1, and each step divides by 2, so 2⁻¹ = 1/2 and 2⁻² = 1/4. A negative exponent keeps dividing.',
        'NEGATIVE EXPONENT ≠ NEGATIVE VALUE — 2⁻³ = 1/8, a positive number between 0 and 1. The BASE decides the sign; the exponent only decides the size. Positive exponents grow, negative exponents shrink.',
        'CROSSING THE FRACTION BAR — a FACTOR with a negative exponent flips to the other side and turns positive: x⁻²y³ = y³/x², and 1/x⁻² = x². This works on factors only, never on terms: (x + y)⁻¹ is NOT 1/x + 1/y.',
        'SCIENTIFIC NOTATION FORM — a × 10ⁿ where 1 ≤ a < 10 and n is an integer. 4,500,000 = 4.5 × 10⁶; 0.00032 = 3.2 × 10⁻⁴. Count how many places the decimal point moves; big numbers get a POSITIVE n, numbers under 1 get a NEGATIVE n.',
        'MULTIPLYING AND DIVIDING — regroup: multiply the front numbers and ADD the exponents; divide the front numbers and SUBTRACT the exponents. (3 × 10⁵)(2 × 10⁻⁸) = 6 × 10⁻³.',
        'RENORMALIZE AT THE END — if the front number lands outside 1 ≤ a < 10, fix it: (5 × 10⁴)(4 × 10³) = 20 × 10⁷ = 2 × 10⁸. Likewise 0.4 × 10⁷ = 4 × 10⁶.',
      ],
      vocabulary: [
        { term: 'reciprocal', definition: 'the flip of a number — the reciprocal of aⁿ is 1/aⁿ, which is what a⁻ⁿ means.' },
        { term: 'scientific notation', definition: 'a number written as a × 10ⁿ with 1 ≤ a < 10 and n an integer.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-zero-negative',
      kind: 'worked_example',
      problem: 'Simplify with positive exponents only: 5a⁰b⁻³ / (a⁻²b)',
      steps: [
        'Handle the zero exponent first: a⁰ = 1, and the exponent is only on a, so the numerator is 5 · 1 · b⁻³ = 5b⁻³. The 5 is untouched.',
        'The a⁻² is downstairs, so move it upstairs and make the exponent positive: 5a²b⁻³ / b.',
        'Same base b: b⁻³ / b¹ = b⁻³⁻¹ = b⁻⁴, giving 5a²b⁻⁴.',
        'Flip the negative exponent to clear it: 5a²b⁻⁴ = 5a²/b⁴. Check with a = 2, b = 2: original is 5(1)(1/8) ÷ ((1/4)(2)) = (5/8) ÷ (1/2) = 5/4, and 5(4)/16 = 5/4. ✓',
      ],
      answer: '5a²/b⁴',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-scinot-divide',
      kind: 'worked_example',
      problem: 'Divide and write the result in scientific notation: (3.6 × 10⁴) / (9 × 10⁻³)',
      steps: [
        'Regroup into fronts and powers: (3.6 / 9) × (10⁴ / 10⁻³).',
        'Front numbers: 3.6 / 9 = 0.4.',
        'Powers: subtract the exponents, 4 − (−3) = 7, so 10⁷. Subtracting a negative ADDS — the classic slip is writing 4 − 3 = 1.',
        '0.4 × 10⁷ is the right VALUE but not scientific notation, because 0.4 is less than 1. Since 0.4 = 4 × 10⁻¹, we get 4 × 10⁻¹ × 10⁷ = 4 × 10⁶.',
        'Sanity check in plain numbers: 36,000 ÷ 0.009 = 4,000,000 = 4 × 10⁶. ✓',
      ],
      answer: '4 × 10⁶',
      estimatedMinutes: 3,
    },
    {
      id: 'try-zero-exponent',
      kind: 'try_yourself',
      problem: 'Evaluate for x ≠ 0: 4x⁰ + (2x)⁰',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '5', correct: true },
        { id: 'b', text: '6' },
        { id: 'c', text: '2' },
        { id: 'd', text: '0' },
      ],
      expectedAnswer: '5',
      hints: [
        'In 4x⁰ the exponent sits on x only; in (2x)⁰ the parentheses put it on the whole thing.',
        '4x⁰ = 4 · 1 = 4, and (2x)⁰ = 1. Add them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-scinot-multiply',
      kind: 'try_yourself',
      problem: 'Multiply and write the answer in scientific notation: (4 × 10⁻⁵)(5 × 10⁸)',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '20 × 10³' },
        { id: 'b', text: '2 × 10⁴', correct: true },
        { id: 'c', text: '2 × 10⁻⁴' },
        { id: 'd', text: '9 × 10³' },
      ],
      expectedAnswer: '2 × 10⁴',
      hints: [
        'Multiply the front numbers, then add the exponents: −5 + 8.',
        '4 · 5 = 20 and 10⁻⁵ · 10⁸ = 10³, but 20 is not between 1 and 10 — renormalize.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-convert',
      kind: 'try_yourself',
      problem: 'Write 6.2 × 10⁻³ as an ordinary decimal and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '0.0062',
      hints: [
        'A negative exponent makes the number small, so the decimal point moves LEFT.',
        'Move the decimal point 3 places left from 6.2: 0.62, 0.062, then one more.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-negative-exponent-sign',
      kind: 'misconception_check',
      question: 'One student evaluates 3⁻² as −9. Another gets 1/6. What is 3⁻² really equal to, and what did each of them do?',
      commonErrors: [
        {
          answer: '−9',
          misconception: 'Reading the minus sign in the exponent as a minus sign on the value.',
          correctsTo: '3⁻² = 1/3² = 1/9 — a POSITIVE number smaller than 1. The exponent controls size (reciprocal), the base controls sign. Compare 3² = 9 (big) with 3⁻² = 1/9 (small); neither is negative because the base 3 is positive.',
        },
        {
          answer: '1/6',
          misconception: 'Multiplying the base by the exponent (3 · 2 = 6) instead of using the exponent as repeated multiplication, then taking the reciprocal.',
          correctsTo: '3² means 3 · 3 = 9, not 3 · 2 = 6. So 3⁻² = 1/9, not 1/6.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'a⁰ = 1 for every a ≠ 0 — it falls straight out of aⁿ/aⁿ = 1. Watch what the exponent touches: 4x⁰ = 4, but (4x)⁰ = 1.',
        'a⁻ⁿ = 1/aⁿ. A negative exponent means RECIPROCAL, never a negative value.',
        'A factor with a negative exponent crosses the fraction bar and turns positive — factors only, never terms.',
        'Scientific notation is a × 10ⁿ with 1 ≤ a < 10; big numbers take a positive n, numbers under 1 take a negative n.',
        'Multiply → multiply the fronts and ADD exponents; divide → divide the fronts and SUBTRACT; then renormalize so the front is between 1 and 10.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.2', cedTitle: 'Zero & Negative Exponents; Scientific Notation' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
