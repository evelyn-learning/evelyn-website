/**
 * Algebra 1 — Arithmetic & Geometric Sequences.
 *
 * The bridge between the two big function families of Algebra 1 (CCSS
 * F-BF.A.2, F-LE.A.2): add the same amount every step and you get a
 * linear pattern; multiply by the same amount every step and you get an
 * exponential one. The whole lesson lives or dies on the n − 1 in the
 * explicit formulas.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U10_SEQUENCES: LessonPlan = {
  id: 'evelyn.hs.alg1.sequences.v1',
  title: 'Arithmetic & Geometric Sequences',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.sequences',
      standard: 'ALG1-10.3',
      description:
        'Identify arithmetic and geometric sequences, write and use their recursive and explicit formulas, and connect them to linear and exponential functions (CCSS F-BF.A.2, F-LE.A.2).',
    },
  ],
  prerequisites: ['alg1.scatterplots-trend-lines'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame sequences as the everyday version of the two function families the course has been building toward.',
      script:
        'Two savings plans. Plan A adds 50 dollars to your account every month. Plan B doubles your balance every month. Both are sequences — an ordered list of numbers with a rule — but one grows by adding and one grows by multiplying, and after a year they are not remotely close. Today you learn to spot which kind you have, write a formula that jumps straight to any term without listing them all, and see why one of these is secretly a line and the other is secretly an exponential curve.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-families',
      kind: 'concept',
      goal: 'Arithmetic vs geometric, recursive vs explicit, and the n − 1 that trips everyone.',
      keyIdeas: [
        'A SEQUENCE is an ordered list of numbers. Term 1 is a₁, term 2 is a₂, and the term in position n is aₙ. The position n is always a counting number: 1, 2, 3, ...',
        'ARITHMETIC — you ADD the same number every step. That number is the common difference d, and you find it by subtracting: d = a₂ − a₁ (later term minus earlier term, so d can be negative).',
        'GEOMETRIC — you MULTIPLY by the same number every step. That number is the common ratio r, and you find it by dividing: r = a₂ ÷ a₁.',
        'TEST WHICH ONE — check consecutive differences AND consecutive ratios. Constant difference → arithmetic. Constant ratio → geometric. Neither constant → it is some other pattern.',
        'RECURSIVE FORMULA says how to get the NEXT term from the one before: arithmetic is a₁ = (start), aₙ = aₙ₋₁ + d; geometric is a₁ = (start), aₙ = r · aₙ₋₁. Great for the next term, terrible for the 50th.',
        'EXPLICIT FORMULA jumps straight to any term: arithmetic is aₙ = a₁ + (n − 1)d; geometric is aₙ = a₁ · rⁿ⁻¹.',
        'WHY n − 1 — you are already standing on a₁, so getting to term n costs only n − 1 steps. Reaching a₅ takes 4 additions, not 5. Using n instead of n − 1 is the single most common error in this whole topic.',
        'SEQUENCES ARE FUNCTIONS of the position n. Arithmetic is LINEAR: aₙ = a₁ + (n − 1)d rewrites as aₙ = dn + (a₁ − d), so d is the slope. Geometric is EXPONENTIAL: r is the base, so r > 1 grows and 0 < r < 1 decays.',
      ],
      vocabulary: [
        { term: 'common difference (d)', definition: 'the fixed amount added each step in an arithmetic sequence.' },
        { term: 'common ratio (r)', definition: 'the fixed multiplier applied each step in a geometric sequence.' },
        { term: 'explicit formula', definition: 'a rule that gives aₙ directly from the position n, with no earlier terms needed.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-arithmetic-explicit',
      kind: 'worked_example',
      problem: 'For the sequence 4, 11, 18, 25, ... write the explicit formula and find the 20th term.',
      steps: [
        'Check the type: 11 − 4 = 7, 18 − 11 = 7, 25 − 18 = 7. The difference is constant, so it is arithmetic with d = 7 and a₁ = 4.',
        'Plug into aₙ = a₁ + (n − 1)d: aₙ = 4 + (n − 1)(7).',
        'Simplify if you like: aₙ = 4 + 7n − 7 = 7n − 3. This is a line with slope 7 — the common difference IS the slope.',
        'Find a₂₀: 4 + (20 − 1)(7) = 4 + (19)(7) = 4 + 133 = 137. Check with the simplified form: 7(20) − 3 = 140 − 3 = 137. ✓',
      ],
      answer: 'aₙ = 4 + (n − 1)(7) = 7n − 3, and a₂₀ = 137',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-geometric-offbyone',
      kind: 'worked_example',
      problem: 'For the sequence 5, 15, 45, 135, ... find the 7th term — and watch the exponent.',
      steps: [
        'Check the type: 15 ÷ 5 = 3, 45 ÷ 15 = 3, 135 ÷ 45 = 3. Constant ratio, so it is geometric with a₁ = 5 and r = 3.',
        'Explicit formula: aₙ = a₁ · rⁿ⁻¹ = 5 · 3ⁿ⁻¹.',
        'THE TRAP: writing a₇ = 5 · 3⁷ = 5 · 2187 = 10935. That answer is one whole step too far along the sequence.',
        'Do it right: a₇ = 5 · 3⁷⁻¹ = 5 · 3⁶ = 5 · 729 = 3645.',
        'Sanity-check by listing: 5, 15, 45, 135, 405, 1215, 3645 — the 7th number is 3645. ✓ Notice 10935 is the 8th term, exactly one position past where you wanted to stop.',
      ],
      answer: 'a₇ = 5 · 3⁶ = 3645',
      estimatedMinutes: 3,
    },
    {
      id: 'try-arithmetic-term',
      kind: 'try_yourself',
      problem: 'The arithmetic sequence 6, 10, 14, 18, ... continues. What is a₁₂?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '50', correct: true },
        { id: 'b', text: '54' },
        { id: 'c', text: '48' },
        { id: 'd', text: '44' },
      ],
      expectedAnswer: '50',
      hints: [
        'First find a₁ and d, then use aₙ = a₁ + (n − 1)d.',
        'a₁ = 6 and d = 4, so a₁₂ = 6 + (11)(4). Count the steps: 11, not 12.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-geometric-formula',
      kind: 'try_yourself',
      problem: 'Which explicit formula generates the sequence 2, 6, 18, 54, ... ?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'aₙ = 2 · 3ⁿ⁻¹', correct: true },
        { id: 'b', text: 'aₙ = 2 · 3ⁿ' },
        { id: 'c', text: 'aₙ = 2 + 3(n − 1)' },
        { id: 'd', text: 'aₙ = 3 · 2ⁿ⁻¹' },
      ],
      expectedAnswer: 'aₙ = 2 · 3ⁿ⁻¹',
      hints: [
        'The terms are multiplied by 3 each step, so this is geometric: use aₙ = a₁ · rⁿ⁻¹.',
        'Test each formula at n = 1 — the winner must give exactly 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-recursive-numeric',
      kind: 'try_yourself',
      problem: 'A sequence is defined recursively by a₁ = 3 and aₙ = 2 · aₙ₋₁. Find a₆ and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '96',
      hints: [
        'Each term is double the one before, so r = 2 and the explicit form is aₙ = 3 · 2ⁿ⁻¹.',
        'a₆ = 3 · 2⁵. Or just list them: 3, 6, 12, 24, ...',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-negative-d',
      kind: 'misconception_check',
      question:
        'A student looks at 20, 17, 14, 11, ... and writes d = 3, then claims the explicit formula is aₙ = 20 + 3(n − 1). What went wrong, and what is the correct formula?',
      commonErrors: [
        {
          answer: 'd = 3, so aₙ = 20 + 3(n − 1)',
          misconception:
            'Reading the gap as a distance instead of a signed change — subtracting the later term from the earlier one (20 − 17) instead of later minus earlier.',
          correctsTo:
            'd = a₂ − a₁ = 17 − 20 = −3. The correct formula is aₙ = 20 + (n − 1)(−3) = 23 − 3n. Check n = 4: 23 − 12 = 11 ✓. The student formula would give 29 at n = 4, growing when the sequence is clearly shrinking.',
        },
        {
          answer: 'Calling 2, 4, 8, 16, ... arithmetic because "it keeps adding more"',
          misconception:
            'Seeing the gaps grow (2, 4, 8) and still labeling it arithmetic; arithmetic requires the gaps to be IDENTICAL, not merely patterned.',
          correctsTo:
            'The differences 2, 4, 8 are not constant, but the ratios 4÷2 = 2, 8÷4 = 2, 16÷8 = 2 are. It is geometric with r = 2, so aₙ = 2 · 2ⁿ⁻¹.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Constant DIFFERENCE → arithmetic (d = a₂ − a₁, and it can be negative). Constant RATIO → geometric (r = a₂ ÷ a₁).',
        'Explicit: aₙ = a₁ + (n − 1)d for arithmetic, aₙ = a₁ · rⁿ⁻¹ for geometric.',
        'The n − 1 is not optional — you start ON a₁, so reaching term n takes only n − 1 steps.',
        'Recursive tells you the next term from the last one; explicit jumps straight to any term.',
        'Arithmetic sequences are linear functions of n (d is the slope); geometric sequences are exponential functions of n (r is the base).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.3', cedTitle: 'Arithmetic & Geometric Sequences' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
