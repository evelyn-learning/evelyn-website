/**
 * G11 — Pre-calc: Trig identities (Pythagorean, reciprocal, quotient,
 * sum/difference formulas).
 *
 * Identity = an equation that's true for ALL values where both sides
 * are defined. Three foundational families: reciprocal (sec, csc, cot
 * defined as flips of cos, sin, tan), quotient (tan = sin/cos), and
 * Pythagorean (sin² + cos² = 1 and its two derivatives). Used to
 * simplify and to solve trig equations.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_PRECALC_TRIG_IDENTITIES: LessonPlan = {
  id: 'evelyn.g11.math.precalc.trig-identities.v1',
  title: 'Trig Identities (Pythagorean, Reciprocal, Quotient)',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'trig-identities',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsf.tf.c.8',
      description: 'Prove the Pythagorean identity sin²(θ) + cos²(θ) = 1.',
      standard: 'CCSS.MATH.CONTENT.HSF.TF.C.8',
    },
  ],
  prerequisites: ['ccss.math.hsf.tf.a.2'],
  followUps: ['ccss.math.hsf.tf.b.7'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Connect to the unit circle (which they already know) so identities aren\'t random.',
      script: 'On the unit circle, every point (x, y) satisfies x² + y² = 1. We named cos(θ) for x and sin(θ) for y. Substitute: cos²(θ) + sin²(θ) = 1. The most famous trig identity falls out for free from the equation of a circle. Every other identity comes from clever algebra on top of that.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-families',
      kind: 'concept',
      goal: 'Reciprocal, quotient, and Pythagorean identities.',
      keyIdeas: [
        'A TRIG IDENTITY is an equation involving trig functions that is TRUE for all valid inputs.',
        'RECIPROCAL identities (just definitions):',
        '  csc(θ) = 1/sin(θ)',
        '  sec(θ) = 1/cos(θ)',
        '  cot(θ) = 1/tan(θ)',
        'QUOTIENT identities:',
        '  tan(θ) = sin(θ)/cos(θ)',
        '  cot(θ) = cos(θ)/sin(θ)',
        'PYTHAGOREAN identity (the centerpiece): sin²(θ) + cos²(θ) = 1.',
        'Two derivatives — divide both sides by cos²(θ) and sin²(θ):',
        '  tan²(θ) + 1 = sec²(θ)',
        '  1 + cot²(θ) = csc²(θ)',
        'Squaring notation: sin²(θ) means (sin(θ))², not sin(θ²).',
        'STRATEGY for simplifying or proving identities: convert everything to sines and cosines first; then use Pythagorean identity to swap pieces.',
      ],
      vocabulary: [
        { term: 'identity', definition: 'an equation true for all values where both sides are defined.' },
        { term: 'Pythagorean identity', definition: 'sin²(θ) + cos²(θ) = 1.' },
        { term: 'reciprocal identity', definition: 'csc/sec/cot defined as 1 over sin/cos/tan.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-simplify',
      kind: 'worked_example',
      problem: 'Simplify  sin(θ) · cot(θ).',
      steps: [
        'Rewrite using a quotient identity: cot(θ) = cos(θ)/sin(θ).',
        'sin(θ) · (cos(θ)/sin(θ)).',
        'sin(θ) cancels: result is cos(θ).',
      ],
      answer: 'cos(θ)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-pythagorean',
      kind: 'worked_example',
      problem: 'Simplify  1 - sin²(θ).',
      steps: [
        'Use the Pythagorean identity: sin²(θ) + cos²(θ) = 1, so 1 - sin²(θ) = cos²(θ).',
        'Result: cos²(θ).',
        'This swap shows up constantly — a sin² (or cos²) attached to a 1 - is a tip-off to use the identity.',
      ],
      answer: 'cos²(θ)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Simplify  cos(θ) · tan(θ).',
      expectedAnswer: 'sin(θ)',
      responseFormat: 'free',
      hints: [
        'Rewrite tan(θ) as sin(θ)/cos(θ).',
        'cos(θ) cancels.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-distribute-square',
      kind: 'misconception_check',
      question: 'Sami writes sin²(θ) + cos²(θ) = (sin(θ) + cos(θ))² and uses that to simplify. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating a sum of squares as the square of a sum.',
          correctsTo: 'Wrong. (a + b)² = a² + 2ab + b², not a² + b². So (sin + cos)² = sin² + 2 sin cos + cos² = 1 + 2 sin cos. The Pythagorean identity ONLY gives sin²(θ) + cos²(θ) = 1, NOT (sin(θ) + cos(θ))² = 1.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Pythagorean identity: sin²(θ) + cos²(θ) = 1. Most-used.',
        'Reciprocal identities: csc, sec, cot are flips of sin, cos, tan.',
        'Quotient: tan = sin/cos.',
        'Strategy: convert everything to sin and cos, then look for Pythagorean swaps.',
        'sin²(θ) means (sin(θ))² — NOT (sin(θ) + sin(θ))² or anything weirder.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Simplify  (1 - cos²(θ)) / sin(θ).',
      hint: 'Use Pythagorean: 1 - cos²(θ) = sin²(θ). So expression = sin²(θ)/sin(θ) = sin(θ).',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
