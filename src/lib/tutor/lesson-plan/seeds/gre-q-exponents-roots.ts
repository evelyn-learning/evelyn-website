/**
 * GRE Quant — Exponents & Roots.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_Q_EXPONENTS_ROOTS: LessonPlan = {
  id: 'evelyn.gre.q.exponents-roots.v1',
  title: 'GRE Quant — Exponents & Roots',
  curriculum: 'GRE',
  grade: 'graduate',
  subject: 'math',
  topic: 'gre-quant',
  locale: 'en',
  los: [
    {
      id: 'gre.q.exponents-roots',
      description: 'Manipulate integer, fractional, negative exponents; rationalise roots; recognise common simplifications.',
      standard: 'GRE-Q-EXPONENTS',
    },
  ],
  prerequisites: ['gre.q.number-properties'],
  followUps: ['gre.q.algebra-equations'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Exponent and root rules turn ugly expressions into single-digit answers if you spot the pattern fast.',
      script: '"Simplify (4^7 · 8^3) / 2^25." Twenty seconds if you see all the bases as powers of 2; otherwise a calculator slog. Today\'s drill: rewriting bases, splitting exponents, and recognising what needs to cancel.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-rules',
      kind: 'concept',
      goal: 'Exponent laws + root laws + bridge between them.',
      keyIdeas: [
        'EXPONENT LAWS: a^m · a^n = a^(m+n). a^m / a^n = a^(m−n). (a^m)^n = a^(m·n). a^0 = 1 (a ≠ 0). a^(−n) = 1/a^n.',
        'PRODUCT RULE: (ab)^n = a^n · b^n. (a/b)^n = a^n/b^n. NOT (a + b)^n.',
        'FRACTIONAL EXPONENTS: a^(1/n) = ⁿ√a. a^(m/n) = (ⁿ√a)^m. So 8^(2/3) = (³√8)² = 4.',
        'NEGATIVE EXPONENTS = reciprocals: 5^(−2) = 1/25.',
        'COMMON BASE TACTIC: rewrite different bases as powers of the same prime. 4 = 2², 8 = 2³, 27 = 3³, 1/8 = 2^(−3).',
        'ROOT LAWS: √(ab) = √a·√b. √(a/b) = √a/√b. √a + √b ≠ √(a+b) (BIG TRAP).',
        'RATIONALISING DENOMINATOR: 1/√3 → multiply top + bottom by √3 → √3/3.',
        'GRE WATCH: "((2^4)^3) is HUGE — 2^12 = 4096. (4·3) = 12 in the exponent, not 7. Multiply (not add) for nested powers.',
      ],
      vocabulary: [
        { term: 'fractional exponent', definition: 'a^(p/q) means q-th root of a^p; equivalently the p-th power of the q-th root.' },
        { term: 'rationalise', definition: 'remove a root from the denominator by multiplying numerator and denominator by an appropriate root.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-common-base',
      kind: 'worked_example',
      problem: 'Simplify (4^7 · 8^3) / 2^25.',
      steps: [
        'Rewrite all bases as powers of 2: 4 = 2², 8 = 2³.',
        'Substitute: ((2²)^7 · (2³)^3) / 2^25 = (2^14 · 2^9) / 2^25.',
        'Add exponents in the numerator: 2^(14+9) / 2^25 = 2^23 / 2^25.',
        'Subtract: 2^(23 − 25) = 2^(−2) = 1/4.',
      ],
      answer: '1/4',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Evaluate 27^(2/3) without a calculator.',
      expectedAnswer: '9',
      responseFormat: 'numeric',
      hints: [
        '27^(2/3) = (³√27)² = 3² = 9.',
        'Or: 27^(2/3) = (27²)^(1/3) = 729^(1/3) = 9.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-distribute',
      kind: 'misconception_check',
      question: 'A student writes (a + b)² = a² + b². Is this correct?',
      commonErrors: [
        {
          answer: '(a + b)² = a² + b²',
          misconception: 'Distributing the exponent over a sum, as if addition behaves like multiplication.',
          correctsTo: 'Exponents distribute over PRODUCTS, not sums. (ab)² = a²b² ✓. But (a + b)² = a² + 2ab + b² (the binomial expansion). Verify with a = 1, b = 2: (1 + 2)² = 9. a² + b² = 5. Not equal. The cross term 2ab = 4 is what\'s missing. Same trap with roots: √(a + b) ≠ √a + √b.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'a^m · a^n = a^(m+n). (a^m)^n = a^(m·n). a^(−n) = 1/a^n.',
        'Fractional: a^(p/q) = (q-th root of a)^p.',
        'Rewrite different bases as common base before applying laws.',
        '(a + b)² ≠ a² + b². √(a + b) ≠ √a + √b.',
        'Rationalise denominators by multiplying by appropriate root.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'If 2^x + 2^x + 2^x + 2^x = 2^16, find x.',
      hint: 'LHS = 4·2^x = 2²·2^x = 2^(x+2). Set equal: x + 2 = 16 → x = 14.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
