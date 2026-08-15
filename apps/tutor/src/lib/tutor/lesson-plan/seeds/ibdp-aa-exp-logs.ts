/**
 * IB DP Math AA — Exponentials & Logarithms.
 * Index laws, change of base, log laws, solving exponential equations.
 */

import type { LessonPlan } from '../types';

export const SEED_IBDP_AA_EXP_LOGS: LessonPlan = {
  id: 'evelyn.ibdp.aa.exp-logs.v1',
  title: 'IB DP Math AA — Exponentials & Logarithms',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'math',
  topic: 'ibdp-aa',
  locale: 'en',
  los: [
    {
      id: 'ibdp.aa.exp-logs',
      description: 'Apply log laws and the change-of-base formula; solve equations involving exponentials and logarithms; use natural log e and ln.',
      standard: 'IB-DP-MATH-AA-1.5/1.7',
    },
  ],
  prerequisites: ['ibdp.aa.sequences-series'],
  followUps: ['ibdp.aa.binomial-theorem'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Logarithms convert multiplicative problems into additive ones — and unlock all exponential equation solving.',
      script: 'Compound interest, radioactive decay, population growth, sound intensity (decibels), pH, earthquake magnitudes — all logarithmic scales. Once you internalise the log-as-inverse-of-exponential, you can solve any "find the time/rate" question with a one-line transformation.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-laws',
      kind: 'concept',
      goal: 'Definition of logarithm + log laws + e and ln + change of base.',
      keyIdeas: [
        'DEFINITION: log_a(x) = y ⟺ a^y = x. The log answers: "to what power must I raise a to get x?"',
        'NATURAL LOG: ln(x) = log_e(x) where e ≈ 2.71828… (Euler\'s number, the base of continuous growth).',
        'LOG LAWS: log(xy) = log x + log y. log(x/y) = log x − log y. log(xⁿ) = n·log x. log_a(a) = 1. log_a(1) = 0.',
        'CHANGE OF BASE: log_a(x) = log_b(x)/log_b(a). Useful for calculator: log_3(7) = ln 7 / ln 3.',
        'INVERSE PAIR: a^(log_a x) = x and log_a(a^x) = x. They cancel.',
        'SOLVING EXPONENTIAL EQUATION: take ln of both sides. Example: 5·2^x = 80 → 2^x = 16 → x = 4 (or use ln: x = ln(16)/ln(2) = 4).',
        'SOLVING LOG EQUATION: combine logs into a single one, then exponentiate. Example: log(x) + log(x − 3) = 1 → log[x(x − 3)] = 1 → x(x − 3) = 10 → x² − 3x − 10 = 0 → (x − 5)(x + 2) = 0 → x = 5 (reject −2 since log of negative undefined).',
        'IB AA REMINDER: always check domain after solving — log requires positive argument.',
      ],
      vocabulary: [
        { term: 'logarithm', definition: 'the inverse of an exponential: log_a(x) is the power y such that a^y = x.' },
        { term: 'natural log', definition: 'ln(x) = log_e(x), the log with base e.' },
        { term: 'change of base', definition: 'log_a(x) = log_b(x)/log_b(a) — converts to a base your calculator supports.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-equation',
      kind: 'worked_example',
      problem: 'Solve 3^(2x − 1) = 7, giving x to 3 significant figures.',
      steps: [
        'Take ln of both sides: ln(3^(2x − 1)) = ln 7.',
        'Apply log power rule: (2x − 1)·ln 3 = ln 7.',
        'Solve for 2x − 1: 2x − 1 = ln 7 / ln 3.',
        'Compute: ln 7 ≈ 1.9459, ln 3 ≈ 1.0986. Ratio ≈ 1.7712.',
        '2x = 1 + 1.7712 = 2.7712 → x ≈ 1.39 (3 s.f.).',
        'CHECK: 3^(2·1.386 − 1) = 3^1.772 ≈ 7. ✓',
      ],
      answer: 'x ≈ 1.39',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Express log_2(48) in terms of log_2(3), as a + b·log_2(3) for integers a, b.',
      expectedAnswer: '4 + log_2(3)',
      responseFormat: 'free',
      hints: [
        'Factorise 48 = 16 × 3.',
        'log_2(16·3) = log_2(16) + log_2(3).',
        'log_2(16) = log_2(2⁴) = 4.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-log-sum',
      kind: 'misconception_check',
      question: 'A student writes log(x + y) = log(x) + log(y). Why is this wrong?',
      commonErrors: [
        {
          answer: 'log(x + y) = log(x) + log(y)',
          misconception: 'Treating log as if it distributes over addition.',
          correctsTo: 'log(xy) = log(x) + log(y) — the log of a PRODUCT splits into a sum. There is NO clean rule for log of a sum. Example: log(2) + log(3) = log(6), NOT log(5). To check: log(2) ≈ 0.301, log(3) ≈ 0.477, sum ≈ 0.778. log(6) ≈ 0.778 ✓. log(5) ≈ 0.699 ✗. Always read the bracket: product splits, sum does not.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'log_a(x) = y ⟺ a^y = x. ln = log_e.',
        'Laws: log(xy) = log x + log y; log(x/y) = log x − log y; log(xⁿ) = n log x.',
        'Change of base: log_a(x) = ln(x)/ln(a).',
        'Take ln of both sides to solve exponential equations.',
        'Combine logs into one to solve log equations; check domain after.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Solve ln(x²) − ln(x − 6) = ln(5) for x > 6.',
      hint: 'Combine left side: ln(x² / (x − 6)) = ln 5 → x²/(x − 6) = 5 → x² = 5x − 30 → x² − 5x + 30 = 0. Discriminant = 25 − 120 = −95 < 0, no real solutions. So no x > 6 satisfies the equation.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
