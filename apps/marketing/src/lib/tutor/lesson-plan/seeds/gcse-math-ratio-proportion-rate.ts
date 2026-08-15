/**
 * GCSE Math Higher — Ratio, Proportion, and Rate of Change.
 * Direct and inverse proportion (algebraic), rate problems, compound
 * units, exchange-rate-style scaling.
 */

import type { LessonPlan } from '../types';

export const SEED_GCSE_MATH_RATIO_PROPORTION_RATE: LessonPlan = {
  id: 'evelyn.gcse.math.ratio-proportion-rate.v1',
  title: 'GCSE Higher — Ratio, Proportion & Rate of Change',
  curriculum: 'GCSE',
  grade: '10-11',
  subject: 'math',
  topic: 'gcse-math',
  locale: 'en-GB',
  los: [
    {
      id: 'gcse.math.ratio-proportion-rate',
      description: 'Solve direct and inverse proportion problems algebraically; manipulate compound units and rates of change.',
      standard: 'GCSE-MATH-R10/R11/R13',
    },
  ],
  prerequisites: ['gcse.math.functions-transformations'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Direct and inverse proportion live in nearly every applied paper question — speed, density, force, gravity, light intensity.',
      script: 'When the exam says "y is proportional to x²" you don\'t need to memorise a new formula. You need to know one symbol — the ∝ — and how to turn it into y = kx² with a constant k. Once k is found from any data point, the relationship is locked.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-proportion',
      kind: 'concept',
      goal: 'Algebraic recipe for direct & inverse proportion + compound rates.',
      keyIdeas: [
        'DIRECT PROPORTION: y ∝ x means y = kx for some constant k. Doubling x doubles y.',
        'POWER VARIATIONS: y ∝ x² means y = kx². y ∝ √x means y = k√x. y ∝ x³ means y = kx³.',
        'INVERSE PROPORTION: y ∝ 1/x means y = k/x. Doubling x halves y. y ∝ 1/x² means y = k/x² (intensity, gravity).',
        'STANDARD METHOD: 1) Write the proportionality with k. 2) Substitute the given (x, y) pair to solve for k. 3) Use the now-complete formula for any other x or y.',
        'COMPOUND UNITS: density = mass/volume (g/cm³). Speed = distance/time (km/h). Pressure = force/area (N/m²). Convert via dimensional cancellation.',
        'RATE OF CHANGE = gradient when one quantity is plotted against another. Speed is rate of distance change. Acceleration is rate of speed change.',
        'EXCHANGE-LIKE SCALING: if 5 workers build a wall in 8 days, how long for 4 workers? Total work = 40 worker-days. New time = 40/4 = 10 days. Inverse proportion: more workers → less time.',
      ],
      vocabulary: [
        { term: 'constant of proportionality', definition: 'the fixed multiplier k linking proportional quantities; found from a known data point.' },
        { term: 'inverse proportion', definition: 'a relationship where y × x is constant; doubling one quantity halves the other.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-inverse-square',
      kind: 'worked_example',
      problem: 'The intensity I of a light source is inversely proportional to the square of distance d. When d = 2 m, I = 50 lux. Find I when d = 5 m.',
      steps: [
        'Write the relationship: I ∝ 1/d² → I = k/d².',
        'Substitute the known data: 50 = k/2² = k/4 → k = 200.',
        'Full formula: I = 200/d².',
        'Compute at d = 5: I = 200/25 = 8 lux.',
        'SANITY CHECK: distance went from 2 to 5 (2.5× further) → intensity should drop by 2.5² = 6.25× → 50/6.25 = 8. ✓',
      ],
      answer: 'I = 8 lux',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A car travels at 60 km/h for 2.5 hours. How far does it travel? Then convert your answer to metres.',
      expectedAnswer: '150 km = 150 000 m',
      responseFormat: 'free',
      hints: [
        'Distance = speed × time.',
        '1 km = 1000 m.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-double',
      kind: 'misconception_check',
      question: 'y is inversely proportional to x. When x doubles, what happens to y?',
      commonErrors: [
        {
          answer: 'y doubles',
          misconception: 'Treating "inversely proportional" as if it works the same as direct proportion.',
          correctsTo: 'Inverse proportion: y = k/x. If x doubles to 2x, then y becomes k/(2x) = (k/x)/2 = y/2 — y is HALVED. The two quantities move in opposite directions: x up → y down, x down → y up. The product xy stays constant at k.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'y ∝ x → y = kx. y ∝ 1/x → y = k/x.',
        'Always extract k from a known pair before solving for new x or y.',
        'Power proportions: y ∝ xⁿ behave the same way — find k once.',
        'Compound units carry through algebraically; cancel by treating units as factors.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Quantity p is directly proportional to the cube of q. When q triples, by what factor does p change?',
      hint: 'p = kq³. New p = k(3q)³ = 27kq³ = 27 × old p. So p scales by 27. Cube proportions: factor changes by the cube of the input change.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
