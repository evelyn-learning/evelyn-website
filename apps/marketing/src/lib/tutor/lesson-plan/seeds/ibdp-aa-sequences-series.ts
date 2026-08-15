/**
 * IB DP Math Analysis & Approaches — Sequences & Series.
 * Arithmetic + geometric sequences, sigma notation, sum to infinity,
 * exam-style "show that" reasoning.
 */

import type { LessonPlan } from '../types';

export const SEED_IBDP_AA_SEQUENCES_SERIES: LessonPlan = {
  id: 'evelyn.ibdp.aa.sequences-series.v1',
  title: 'IB DP Math AA — Sequences & Series',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'math',
  topic: 'ibdp-aa',
  locale: 'en',
  los: [
    {
      id: 'ibdp.aa.sequences-series',
      description: 'Apply formulas for arithmetic and geometric sequences/series; manipulate sigma notation; identify when an infinite geometric series converges.',
      standard: 'IB-DP-MATH-AA-1.2/1.3',
    },
  ],
  prerequisites: [],
  followUps: ['ibdp.aa.exp-logs'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Sequences and series are tested on every IB DP AA paper — fluency saves minutes for harder problems later.',
      script: 'IB AA Paper 1 will hand you "the third term of a geometric sequence is 12 and the seventh is 192. Find the first term." If you can set up the equations and solve in 90 seconds, you protect time for calculus questions later. Today we drill the formulas and the sigma machinery.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-formulas',
      kind: 'concept',
      goal: 'Arithmetic / geometric formulas + sigma + infinite-sum convergence.',
      keyIdeas: [
        'ARITHMETIC SEQUENCE: u_n = u_1 + (n − 1)d. Sum S_n = (n/2)[2u_1 + (n − 1)d] = (n/2)(u_1 + u_n).',
        'GEOMETRIC SEQUENCE: u_n = u_1 · r^(n−1). Sum S_n = u_1(r^n − 1)/(r − 1) for r ≠ 1.',
        'SUM TO INFINITY (geometric only): if |r| < 1, S_∞ = u_1/(1 − r). If |r| ≥ 1, the series DIVERGES.',
        'SIGMA NOTATION: Σ from k=1 to n of f(k) = f(1) + f(2) + … + f(n). Lower limit (start) and upper limit (end) define the range.',
        'SIGMA RULES: Σ(a·f(k) + b·g(k)) = a·Σf(k) + b·Σg(k). Linearity. Constants pull out, sums split.',
        'STANDARD SUMS: Σk = n(n+1)/2; Σk² = n(n+1)(2n+1)/6; Σk³ = [n(n+1)/2]².',
        'AA EXAM PHRASING: "Show that…" and "Hence find…" — show every algebraic step (no shortcuts) AND use the result of the previous part.',
        'CONVERGENCE INTUITION: each term shrinks by factor r. If |r| < 1, terms approach 0 and the partial sums approach a finite limit u_1/(1−r).',
      ],
      vocabulary: [
        { term: 'common difference', definition: 'd, the constant gap between consecutive arithmetic terms.' },
        { term: 'common ratio', definition: 'r, the constant multiplier between consecutive geometric terms.' },
        { term: 'sigma notation', definition: 'a compact way to write a sum: Σ from k=1 to n of f(k).' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-geometric',
      kind: 'worked_example',
      problem: 'In a geometric sequence, u_3 = 12 and u_6 = 96. (a) Find u_1 and r. (b) Find Σ from n=1 to 8 of u_n.',
      steps: [
        '(a) u_3 = u_1·r² = 12. u_6 = u_1·r⁵ = 96.',
        'Divide u_6/u_3: r³ = 96/12 = 8 → r = 2.',
        'Substitute: u_1·4 = 12 → u_1 = 3.',
        '(b) S_8 = u_1(r^8 − 1)/(r − 1) = 3(2⁸ − 1)/(2 − 1) = 3(256 − 1) = 3·255 = 765.',
        'CHECK: u_8 = u_1·r⁷ = 3·128 = 384. Sequence: 3, 6, 12, 24, 48, 96, 192, 384. Sum = 765. ✓',
      ],
      answer: 'u_1 = 3, r = 2; S_8 = 765',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A geometric series has first term 8 and common ratio 1/3. Find the sum to infinity.',
      expectedAnswer: '12',
      responseFormat: 'numeric',
      hints: [
        '|r| = 1/3 < 1 → series converges.',
        'S_∞ = u_1/(1 − r) = 8/(1 − 1/3) = 8/(2/3).',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-divergence',
      kind: 'misconception_check',
      question: 'A student computes S_∞ = u_1/(1 − r) for the series 2 + 4 + 8 + 16 + … and gets 2/(1 − 2) = −2. Why is this wrong?',
      commonErrors: [
        {
          answer: 'S_∞ = −2',
          misconception: 'Applying the convergence formula without first checking |r| < 1.',
          correctsTo: 'Here r = 2, so |r| = 2 > 1. The series DIVERGES — partial sums grow without bound. The formula u_1/(1 − r) is only valid when the geometric series converges, i.e. |r| < 1. The negative answer is a signal that the formula was misapplied: real sums of positive terms can\'t be negative. ALWAYS check |r| before invoking S_∞.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Arithmetic: u_n = u_1 + (n−1)d. S_n = (n/2)(u_1 + u_n).',
        'Geometric: u_n = u_1·r^(n−1). S_n = u_1(r^n − 1)/(r − 1).',
        'Geometric S_∞ = u_1/(1 − r) ONLY if |r| < 1.',
        'Sigma rules: linearity (constants out, sums split). Standard sums of k, k², k³ are formula-page items.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A ball is dropped from 10 m. Each bounce reaches 60% of the previous height. Find the total vertical distance travelled before the ball comes to rest.',
      hint: 'First drop = 10. After that, each up-down pair: heights 10·(0.6), 10·(0.6²), … each contributing 2 × that height. Total = 10 + 2·Σ from n=1 of 10·(0.6)^n = 10 + 2·[10·(0.6)/(1 − 0.6)] = 10 + 2·(6/0.4) = 10 + 30 = 40 m.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
