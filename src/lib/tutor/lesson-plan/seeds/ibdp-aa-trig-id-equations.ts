/**
 * IB DP Math AA — Trigonometric Identities & Equations.
 * Pythagorean, double-angle, sum-to-product identities; solving trig
 * equations in a given interval.
 */

import type { LessonPlan } from '../types';

export const SEED_IBDP_AA_TRIG_ID_EQUATIONS: LessonPlan = {
  id: 'evelyn.ibdp.aa.trig-id-equations.v1',
  title: 'IB DP Math AA — Trig Identities & Equations',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'math',
  topic: 'ibdp-aa',
  locale: 'en',
  los: [
    {
      id: 'ibdp.aa.trig-id-equations',
      description: 'Apply Pythagorean and double-angle identities; prove identities by manipulation; solve trigonometric equations on a specified interval.',
      standard: 'IB-DP-MATH-AA-3.6/3.8',
    },
  ],
  prerequisites: ['ibdp.aa.trig-radians'],
  followUps: ['ibdp.aa.vectors-2d-3d'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Trig identity manipulation tests algebra fluency. Solving an equation tests interval reasoning. IB AA combines both.',
      script: '"Solve 2 sin²x − sin x = 0 for x ∈ [0, 2π)" — a Paper 1 staple. The structure: factorise, set each factor to zero, find ALL solutions in the interval. The trap: students miss solutions because they forget that sine is periodic.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-identities',
      kind: 'concept',
      goal: 'Core identities + the algorithm for solving trig equations on an interval.',
      keyIdeas: [
        'PYTHAGOREAN: sin²θ + cos²θ = 1. Two derived forms: 1 + tan²θ = sec²θ; 1 + cot²θ = csc²θ.',
        'DOUBLE-ANGLE: sin 2θ = 2 sin θ cos θ. cos 2θ = cos²θ − sin²θ = 2cos²θ − 1 = 1 − 2sin²θ. tan 2θ = 2 tan θ / (1 − tan²θ).',
        'PROVING IDENTITIES: pick the messier side, manipulate using known identities, transform into the other side. Don\'t treat both sides as equal yet — work one to match the other.',
        'SOLVING ALGORITHM: 1) factorise or use identity to reduce to single trig function. 2) solve "sin x = value" or "cos x = value" or "tan x = value". 3) find principal solution. 4) generate all solutions in interval using periodicity.',
        'PERIODICITY: sin and cos repeat every 2π; tan repeats every π. For sin x = c, solutions are x = arcsin(c) and x = π − arcsin(c), plus 2π·n shifts.',
        'INTERVAL CARE: [0, 2π) excludes 2π itself. List every solution within the bounds.',
        'COMPOUND ARGUMENTS: for sin(2x) = c on [0, 2π), let u = 2x → u ∈ [0, 4π). Find all u, then x = u/2.',
      ],
      vocabulary: [
        { term: 'identity', definition: 'an equation that holds for ALL values in the domain (not just specific solutions).' },
        { term: 'principal value', definition: 'the value returned by arcsin / arccos / arctan in their restricted ranges.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-double-angle',
      kind: 'worked_example',
      problem: 'Solve cos 2x = sin x for x ∈ [0, 2π).',
      steps: [
        'Use identity cos 2x = 1 − 2 sin²x to convert to a single function.',
        'Equation: 1 − 2 sin²x = sin x → 2 sin²x + sin x − 1 = 0.',
        'Let s = sin x. Quadratic in s: 2s² + s − 1 = 0 → factor: (2s − 1)(s + 1) = 0.',
        's = 1/2 or s = −1.',
        'sin x = 1/2: principal x = π/6. Second solution in [0, 2π) is π − π/6 = 5π/6.',
        'sin x = −1: x = 3π/2.',
        'Solutions in [0, 2π): x = π/6, 5π/6, 3π/2.',
      ],
      answer: 'x ∈ {π/6, 5π/6, 3π/2}',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Solve 2 cos x = √3 for x ∈ [0, 2π).',
      expectedAnswer: 'x = π/6 and x = 11π/6',
      responseFormat: 'free',
      hints: [
        'Isolate: cos x = √3/2.',
        'Principal value: x = π/6 (cos π/6 = √3/2).',
        'cos is positive in Q1 and Q4. Q4 solution: 2π − π/6.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-double-arg',
      kind: 'misconception_check',
      question: 'Solving sin(2x) = 1/2 on [0, 2π), a student finds 2x = π/6 → x = π/12 and stops there. What\'s missing?',
      commonErrors: [
        {
          answer: 'x = π/12 only',
          misconception: 'Substituting the variable change but only finding the principal solution, missing that 2x ranges over [0, 4π).',
          correctsTo: 'Let u = 2x. Then u ∈ [0, 4π). sin u = 1/2 → u = π/6, 5π/6, π/6 + 2π = 13π/6, 5π/6 + 2π = 17π/6. Four solutions for u. Then x = u/2 = π/12, 5π/12, 13π/12, 17π/12. The double-argument doubles the search range and typically yields twice as many solutions in the original x interval.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'sin²θ + cos²θ = 1; 1 + tan²θ = sec²θ.',
        'cos 2θ = 1 − 2sin²θ = 2cos²θ − 1; sin 2θ = 2 sin θ cos θ.',
        'Identities: manipulate one side to match the other, don\'t cross-multiply as if equal.',
        'Equation algorithm: convert to single function, factorise, find all solutions in interval.',
        'Compound arguments expand the search range — list ALL solutions.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Prove the identity (1 − cos 2x)/(sin 2x) = tan x.',
      hint: 'LHS = (1 − (1 − 2sin²x)) / (2 sin x cos x) = (2 sin²x) / (2 sin x cos x) = sin x / cos x = tan x. ∎',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
